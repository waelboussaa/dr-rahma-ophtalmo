/**
 * Generates the six specialty images in public/specialties/.
 *
 *   consultation.{avif,webp}     slit-lamp beam
 *   cataracte.{avif,webp}        macro iris with central clouding
 *   refractive.{avif,webp}       corneal topography, warm scale
 *   cornee.{avif,webp}           cornea edge-on under raking light
 *   retine-glaucome.{avif,webp}  fundus, warm
 *   pediatrie.{avif,webp}        child's vision test
 *
 * Run with `npm run specialties`. Output is checked in, so a normal build needs
 * no rasteriser.
 *
 * WHY THESE ARE DRAWN AND NOT PHOTOGRAPHED
 *
 * docs/01-design-system.md sets the honesty constraint for this imagery: it may
 * not depict Dr Saidane, her cabinet, or anything that would read as evidence of
 * equipment she owns, because the page frames diagnostics as "examens pratiques"
 * precisely to avoid claiming equipment no source attests. A photograph - stock
 * or generated - of a slit lamp standing in a consulting room quietly makes that
 * claim back. A drawing of the *phenomenon* does not: nobody reads a contour map
 * of a cornea as an inventory of the room.
 *
 * So each image is an authored composition of the thing the specialty is about,
 * built from the site's own palette, and deliberately illustrative rather than
 * photographic. No faces, no rooms, no instruments presented as hers.
 *
 * TECHNIQUE
 *
 * Shapes and gradients are SVG, rasterised by sharp. Depth of field is applied
 * afterwards in raster, per layer, because SVG filter support through
 * librsvg/resvg is uneven and a silently dropped feGaussianBlur would ship a
 * flat image. Every layer is rendered separately, blurred by its own sigma and
 * composited in order; a low-amplitude noise plate goes on top in `overlay` so
 * the soft gradients carry some tooth instead of banding under AVIF.
 *
 * All randomness is seeded, so re-running produces identical output.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../public/specialties/", import.meta.url));

const W = 1120;
const H = 1400;

/* Palette. The first five are the site's own tokens; the last three are warm
   extensions used only inside these illustrations, never in the UI. */
const CREAM = "#f8f5ef";
const SAND = "#e9ded0";
const SAND_DEEP = "#dccdb7";
const BRONZE = "#8f7963";
const BRONZE_DEEP = "#6e5b49";
const AMBER = "#c9a67c";
const TERRA = "#a9714e";
const UMBER = "#4a3a2c";

/** Deterministic PRNG, so the committed files never churn. */
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const svg = (body, defs = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
     <defs>${defs}</defs>${body}
   </svg>`;

/** A soft warm vignette on every image, so the leaf mask has something to bite
    into at the corners rather than a flat edge. */
const VIGNETTE = `
  <radialGradient id="vig" cx="0.5" cy="0.44" r="0.78">
    <stop offset="0.55" stop-color="#000000" stop-opacity="0"/>
    <stop offset="1" stop-color="${UMBER}" stop-opacity="0.30"/>
  </radialGradient>`;
const vignetteLayer = {
  svg: svg(`<rect width="${W}" height="${H}" fill="url(#vig)"/>`, VIGNETTE),
  blur: 0,
};

/* -------------------------------------------------------------------------- */
/* 1. consultation - the slit lamp's beam                                      */
/* -------------------------------------------------------------------------- */
// What a slit lamp actually shows: a thin blade of light that, where it crosses
// the eye, bends into a bright curved sliver - the optical section - tracing the
// cornea's profile. That sliver is the recognisable image of the examination,
// and it is a phenomenon of light rather than a picture of a machine, so it
// makes no claim about what stands in her room.
const consultation = [
  {
    svg: svg(
      `<rect width="${W}" height="${H}" fill="url(#g)"/>`,
      `<radialGradient id="g" cx="0.5" cy="0.45" r="0.8">
         <stop offset="0" stop-color="${BRONZE_DEEP}"/>
         <stop offset="0.6" stop-color="${UMBER}"/>
         <stop offset="1" stop-color="#241c15"/>
       </radialGradient>`,
    ),
    blur: 0,
  },
  {
    // The eye, dim and defocused behind the beam: iris ring and pupil only.
    svg: svg(
      `<circle cx="600" cy="660" r="420" fill="url(#iris)"/>
       <circle cx="600" cy="660" r="150" fill="#1d1611"/>`,
      `<radialGradient id="iris">
         <stop offset="0.3" stop-color="${TERRA}" stop-opacity="0.75"/>
         <stop offset="0.8" stop-color="${BRONZE}" stop-opacity="0.5"/>
         <stop offset="1" stop-color="${BRONZE_DEEP}" stop-opacity="0"/>
       </radialGradient>`,
    ),
    blur: 38,
  },
  {
    // The slit above and below the eye: faint, straight, slightly tilted.
    svg: svg(
      `<g stroke="${CREAM}" stroke-linecap="round" opacity="0.5">
         <line x1="440" y1="-20" x2="468" y2="250" stroke-width="16"/>
         <line x1="508" y1="1070" x2="538" y2="1420" stroke-width="16"/>
       </g>`,
    ),
    blur: 10,
  },
  {
    // The glow around the optical section.
    svg: svg(
      `<path d="M 470 250 C 380 470, 380 850, 505 1070" stroke="${CREAM}" stroke-width="120"
         fill="none" stroke-linecap="round" opacity="0.4"/>`,
    ),
    blur: 55,
  },
  {
    // The optical section itself: a crisp curved sliver of light following the
    // cornea, thicker at its apex, with a fainter lens echo behind it.
    svg: svg(
      `<path d="M 470 250 C 380 470, 380 850, 505 1070 C 425 850, 425 470, 470 250 Z" fill="#fffdf8"/>
       <path d="M 470 250 C 380 470, 380 850, 505 1070" stroke="#fffdf8" stroke-width="10"
         fill="none" stroke-linecap="round"/>
       <path d="M 560 420 C 520 560, 520 760, 575 900" stroke="${AMBER}" stroke-width="26"
         fill="none" stroke-linecap="round" opacity="0.55"/>`,
    ),
    blur: 3,
  },
  vignetteLayer,
];

/* -------------------------------------------------------------------------- */
/* 2. cataracte - a macro iris, clouding at the centre                         */
/* -------------------------------------------------------------------------- */
// Drawn rather than photographed for the same reason as the rest, and because a
// drawing can pitch the clouding at exactly the strength that still reads at
// 170px wide without exaggerating it into something alarming.
function irisFibres() {
  const r = rng(4021);
  let out = "";
  for (let i = 0; i < 168; i++) {
    const a = (i / 168) * Math.PI * 2 + r() * 0.02;
    const inner = 250 + r() * 40;
    const outer = 520 + r() * 60;
    const wob = (r() - 0.5) * 0.12;
    const x1 = 560 + Math.cos(a) * inner;
    const y1 = 640 + Math.sin(a) * inner;
    const x2 = 560 + Math.cos(a + wob) * outer;
    const y2 = 640 + Math.sin(a + wob) * outer;
    const mx = 560 + Math.cos(a + wob * 0.4) * ((inner + outer) / 2 + (r() - 0.5) * 50);
    const my = 640 + Math.sin(a + wob * 0.4) * ((inner + outer) / 2 + (r() - 0.5) * 50);
    const c = r() > 0.72 ? CREAM : r() > 0.4 ? AMBER : TERRA;
    out +=
      `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" ` +
      `stroke="${c}" stroke-width="${(1.6 + r() * 3.4).toFixed(1)}" fill="none" ` +
      `opacity="${(0.18 + r() * 0.5).toFixed(2)}" stroke-linecap="round"/>`;
  }
  return out;
}

const cataracte = [
  {
    svg: svg(
      `<rect width="${W}" height="${H}" fill="${SAND}"/>
       <ellipse cx="560" cy="640" rx="760" ry="560" fill="url(#sclera)"/>`,
      `<radialGradient id="sclera">
         <stop offset="0.3" stop-color="${CREAM}"/>
         <stop offset="1" stop-color="${SAND_DEEP}"/>
       </radialGradient>`,
    ),
    blur: 20,
  },
  {
    svg: svg(
      `<circle cx="560" cy="640" r="560" fill="url(#iris)"/>`,
      `<radialGradient id="iris">
         <stop offset="0.30" stop-color="${TERRA}"/>
         <stop offset="0.72" stop-color="${BRONZE}"/>
         <stop offset="0.93" stop-color="${BRONZE_DEEP}"/>
         <stop offset="1" stop-color="${UMBER}"/>
       </radialGradient>`,
    ),
    blur: 2,
  },
  { svg: svg(irisFibres()), blur: 3 },
  {
    // Pupil, then the clouding sitting in front of it - the whole subject of the
    // card. Kept soft and central: a faint veil, not a white disc.
    svg: svg(
      `<circle cx="560" cy="640" r="268" fill="url(#pupil)"/>
       <circle cx="560" cy="640" r="250" fill="url(#cloud)"/>`,
      `<radialGradient id="pupil">
         <stop offset="0.7" stop-color="#241d17"/>
         <stop offset="1" stop-color="#241d17" stop-opacity="0.55"/>
       </radialGradient>
       <radialGradient id="cloud">
         <stop offset="0" stop-color="${CREAM}" stop-opacity="0.72"/>
         <stop offset="0.55" stop-color="${CREAM}" stop-opacity="0.34"/>
         <stop offset="1" stop-color="${CREAM}" stop-opacity="0"/>
       </radialGradient>`,
    ),
    blur: 16,
  },
  {
    // Specular catchlight. One, off-axis, soft - the thing that makes an eye
    // read as wet rather than drawn.
    svg: svg(
      `<ellipse cx="382" cy="452" rx="96" ry="72" fill="#ffffff" opacity="0.5" transform="rotate(-24 382 452)"/>
       <ellipse cx="742" cy="880" rx="52" ry="34" fill="${CREAM}" opacity="0.22"/>`,
    ),
    blur: 22,
  },
  vignetteLayer,
];

/* -------------------------------------------------------------------------- */
/* 3. refractive - corneal topography on a warm scale                          */
/* -------------------------------------------------------------------------- */
// The rainbow scale every topographer prints would drop a hard blue-to-red ramp
// into a cream page. Re-mapped to cream -> sand -> amber -> bronze it still
// reads as a curvature map and stays inside the palette. The rings are
// deliberately off-centre and elliptical: perfectly concentric would look like
// a target rather than a measurement.
function topography() {
  const r = rng(9137);
  const cx = 560;
  const cy = 660;
  const steps = 17;
  let out = "";
  for (let i = steps; i >= 1; i--) {
    const k = i / steps;
    const rx = 70 + k * 470;
    const ry = 70 + k * 400;
    const rot = -18 + (1 - k) * 12;
    const off = (1 - k) * 34;
    const t = 1 - k;
    // cream at the rim, bronze at the apex
    const col =
      t > 0.78 ? BRONZE_DEEP : t > 0.58 ? BRONZE : t > 0.38 ? TERRA : t > 0.2 ? AMBER : t > 0.08 ? SAND_DEEP : SAND;
    out +=
      `<ellipse cx="${(cx + off).toFixed(1)}" cy="${(cy - off * 0.6).toFixed(1)}" ` +
      `rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" ` +
      `transform="rotate(${rot.toFixed(1)} ${cx} ${cy})" ` +
      `fill="${col}" opacity="${(0.82 + r() * 0.12).toFixed(2)}"/>`;
  }
  // Hairline contour separators, which is what makes it read as a map.
  for (let i = steps; i >= 1; i--) {
    const k = i / steps;
    const rx = 70 + k * 470;
    const ry = 70 + k * 400;
    const rot = -18 + (1 - k) * 12;
    const off = (1 - k) * 34;
    out +=
      `<ellipse cx="${(cx + off).toFixed(1)}" cy="${(cy - off * 0.6).toFixed(1)}" ` +
      `rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" ` +
      `transform="rotate(${rot.toFixed(1)} ${cx} ${cy})" ` +
      `fill="none" stroke="${CREAM}" stroke-width="2.2" opacity="0.4"/>`;
  }
  return out;
}

const refractive = [
  { svg: svg(`<rect width="${W}" height="${H}" fill="${CREAM}"/>`), blur: 0 },
  {
    // The map, set on a plate tilted away from the viewer.
    svg: svg(
      `<g transform="translate(560 700) rotate(-7) skewY(5) translate(-560 -700)">
         <rect x="10" y="110" width="1100" height="1180" rx="26" fill="${SAND}"/>
         ${topography()}
       </g>`,
    ),
    blur: 1,
  },
  {
    // Axis reticle. Thin, cream, enough to say "instrument readout".
    svg: svg(
      `<g transform="translate(560 700) rotate(-7) skewY(5) translate(-560 -700)"
          stroke="${CREAM}" stroke-width="2" opacity="0.5" fill="none">
         <line x1="560" y1="180" x2="560" y2="1230"/>
         <line x1="40" y1="660" x2="1080" y2="660"/>
         <circle cx="560" cy="660" r="14" stroke-width="3"/>
       </g>`,
    ),
    blur: 0,
  },
  {
    // Screen glare, falling across the tilt.
    svg: svg(`<path d="M -200 1080 L 1320 420 L 1320 700 L -200 1340 Z" fill="${CREAM}" opacity="0.16"/>`),
    blur: 70,
  },
  vignetteLayer,
];

/* -------------------------------------------------------------------------- */
/* 4. cornee - the curve, edge-on, under a raking light                        */
/* -------------------------------------------------------------------------- */
// Almost the whole frame is shadow. The subject is one crescent of light along
// a curved surface, which is how the cornea's shape is actually read, and
// conveniently the most abstract of the six.
const cornee = [
  {
    svg: svg(
      `<rect width="${W}" height="${H}" fill="url(#bg)"/>`,
      `<linearGradient id="bg" x1="1" y1="0" x2="0" y2="1">
         <stop offset="0" stop-color="${UMBER}"/>
         <stop offset="0.6" stop-color="${BRONZE_DEEP}"/>
         <stop offset="1" stop-color="#2b211a"/>
       </linearGradient>`,
    ),
    blur: 0,
  },
  {
    // The globe.
    svg: svg(
      `<circle cx="640" cy="700" r="600" fill="url(#globe)"/>`,
      `<radialGradient id="globe" cx="0.24" cy="0.3" r="0.95">
         <stop offset="0" stop-color="${AMBER}"/>
         <stop offset="0.45" stop-color="${BRONZE}"/>
         <stop offset="0.8" stop-color="${BRONZE_DEEP}"/>
         <stop offset="1" stop-color="#2b211a"/>
       </radialGradient>`,
    ),
    blur: 6,
  },
  {
    // The corneal dome sitting proud of the globe, caught edge-on. Two offset
    // circles make the crescent, so there is no mask for resvg to drop.
    svg: svg(
      `<g>
         <circle cx="470" cy="560" r="430" fill="url(#lit)"/>
         <circle cx="556" cy="628" r="430" fill="url(#cut)"/>
       </g>`,
      `<radialGradient id="lit" cx="0.35" cy="0.32" r="0.8">
         <stop offset="0" stop-color="#fffdf8" stop-opacity="0.95"/>
         <stop offset="0.6" stop-color="${CREAM}" stop-opacity="0.55"/>
         <stop offset="1" stop-color="${CREAM}" stop-opacity="0.08"/>
       </radialGradient>
       <radialGradient id="cut" cx="0.4" cy="0.38" r="0.85">
         <stop offset="0" stop-color="${BRONZE}" stop-opacity="0.96"/>
         <stop offset="0.7" stop-color="${BRONZE_DEEP}" stop-opacity="0.9"/>
         <stop offset="1" stop-color="${BRONZE_DEEP}" stop-opacity="0.72"/>
       </radialGradient>`,
    ),
    blur: 10,
  },
  {
    // A single hairline running the limbus: the one crisp element in the frame.
    svg: svg(
      `<path d="M 218 828 A 430 430 0 0 1 470 130" stroke="#fffdf8" stroke-width="7"
         fill="none" opacity="0.55" stroke-linecap="round"/>`,
    ),
    blur: 4,
  },
  vignetteLayer,
];

/* -------------------------------------------------------------------------- */
/* 5. retine-glaucome - the fundus, warm                                       */
/* -------------------------------------------------------------------------- */
// A fundus photograph is orange-red already, so warming it is a small move
// rather than a distortion. The vessel tree is grown recursively from the optic
// disc, seeded, so it branches like a vasculature instead of like a starburst.
function vesselTree() {
  const r = rng(7731);
  const discX = 742;
  const discY = 560;
  let out = "";

  const branch = (x, y, angle, len, width, depth) => {
    if (depth === 0 || width < 1.4) return;
    const curve = (r() - 0.5) * 0.55;
    const ex = x + Math.cos(angle) * len;
    const ey = y + Math.sin(angle) * len;
    const cx = x + Math.cos(angle + curve) * len * 0.55;
    const cy = y + Math.sin(angle + curve) * len * 0.55;
    const col = width > 9 ? TERRA : width > 5 ? "#96593c" : BRONZE;
    out +=
      `<path d="M ${x.toFixed(1)} ${y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" ` +
      `stroke="${col}" stroke-width="${width.toFixed(1)}" fill="none" ` +
      `stroke-linecap="round" opacity="${(0.55 + r() * 0.35).toFixed(2)}"/>`;
    const n = r() > 0.35 ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const spread = (i === 0 ? -1 : 1) * (0.26 + r() * 0.42);
      branch(
        ex,
        ey,
        angle + spread + (r() - 0.5) * 0.18,
        len * (0.66 + r() * 0.2),
        width * (0.62 + r() * 0.16),
        depth - 1,
      );
    }
  };

  // Four trunks leaving the disc the way the real arcades do: sweeping up and
  // down and away from the macula rather than straight across it.
  [2.55, 3.75, 1.9, 4.5].forEach((a, i) => {
    branch(discX, discY + (i % 2 ? 28 : -28), a, 210 + r() * 70, 15 - i * 0.8, 7);
  });
  return out;
}

const retineGlaucome = [
  {
    svg: svg(
      `<rect width="${W}" height="${H}" fill="${UMBER}"/>
       <ellipse cx="560" cy="680" rx="640" ry="700" fill="url(#fundus)"/>`,
      `<radialGradient id="fundus" cx="0.56" cy="0.45" r="0.72">
         <stop offset="0" stop-color="${AMBER}"/>
         <stop offset="0.45" stop-color="#bb8552"/>
         <stop offset="0.8" stop-color="${TERRA}"/>
         <stop offset="1" stop-color="#5e3a26"/>
       </radialGradient>`,
    ),
    blur: 8,
  },
  { svg: svg(vesselTree()), blur: 5 },
  {
    // The optic disc: pale, slightly oval, with a lighter cup inside it.
    svg: svg(
      `<ellipse cx="742" cy="560" rx="118" ry="132" fill="url(#disc)"/>
       <ellipse cx="748" cy="562" rx="58" ry="66" fill="${CREAM}" opacity="0.72"/>`,
      `<radialGradient id="disc">
         <stop offset="0.5" stop-color="#fbf4e6"/>
         <stop offset="1" stop-color="${SAND_DEEP}" stop-opacity="0.85"/>
       </radialGradient>`,
    ),
    blur: 9,
  },
  {
    // The macula, a soft darker pool opposite the disc.
    svg: svg(
      `<circle cx="380" cy="700" r="150" fill="#6b3f28" opacity="0.42"/>
       <circle cx="380" cy="700" r="26" fill="#5a3320" opacity="0.5"/>`,
    ),
    blur: 40,
  },
  vignetteLayer,
];

/* -------------------------------------------------------------------------- */
/* 6. pediatrie - a child's vision test                                        */
/* -------------------------------------------------------------------------- */
// The one card whose subject is a person, so the one that most needed not to be
// a photograph. A picture chart and an occluder paddle carry the whole idea - a
// child being tested, gently - with nobody in frame at all.
function chartRows() {
  // Shapes, not letters: it is a preschool chart, and it sidesteps resolving
  // type through a rasteriser that uses whatever fonts the machine happens to
  // have installed rather than the site's webfonts.
  const rows = [
    { y: 330, n: 3, s: 92 },
    { y: 500, n: 4, s: 68 },
    { y: 640, n: 5, s: 50 },
    { y: 758, n: 5, s: 36 },
    { y: 856, n: 6, s: 26 },
  ];
  const r = rng(3319);
  let out = "";
  for (const row of rows) {
    const gap = row.s * 1.85;
    const total = (row.n - 1) * gap;
    for (let i = 0; i < row.n; i++) {
      const x = 560 - total / 2 + i * gap;
      const kind = Math.floor(r() * 3);
      const s = row.s / 2;
      const sw = (s * 0.32).toFixed(1);
      if (kind === 0) {
        out += `<circle cx="${x}" cy="${row.y}" r="${s}" fill="none" stroke="${UMBER}" stroke-width="${sw}"/>`;
      } else if (kind === 1) {
        out +=
          `<path d="M ${x} ${row.y - s} L ${x + s} ${row.y + s * 0.8} L ${x - s} ${row.y + s * 0.8} Z" ` +
          `fill="none" stroke="${UMBER}" stroke-width="${sw}" stroke-linejoin="round"/>`;
      } else {
        out +=
          `<rect x="${x - s}" y="${row.y - s}" width="${s * 2}" height="${s * 2}" rx="${s * 0.22}" ` +
          `fill="none" stroke="${UMBER}" stroke-width="${sw}"/>`;
      }
    }
  }
  return out;
}

const pediatrie = [
  {
    svg: svg(
      `<rect width="${W}" height="${H}" fill="url(#room)"/>`,
      `<linearGradient id="room" x1="0.1" y1="0" x2="0.9" y2="1">
         <stop offset="0" stop-color="#fdfaf4"/>
         <stop offset="0.6" stop-color="${CREAM}"/>
         <stop offset="1" stop-color="${SAND}"/>
       </linearGradient>`,
    ),
    blur: 0,
  },
  {
    // Window light falling across the wall behind the chart.
    svg: svg(`<path d="M -120 -80 L 620 -80 L 300 1480 L -220 1480 Z" fill="#ffffff" opacity="0.55"/>`),
    blur: 90,
  },
  {
    // The chart, pinned flat, very slightly off-square.
    svg: svg(
      `<g transform="rotate(-1.4 560 620)">
         <rect x="176" y="150" width="768" height="860" rx="10" fill="#fffdf7"/>
         <rect x="176" y="150" width="768" height="860" rx="10" fill="none" stroke="${SAND_DEEP}" stroke-width="3"/>
         <line x1="176" y1="236" x2="944" y2="236" stroke="${SAND}" stroke-width="3"/>
         ${chartRows()}
       </g>`,
    ),
    blur: 2,
  },
  {
    // The occluder paddle, held up into the near field and well out of focus.
    // No hand: a hand drawn at this scale reads as a cartoon, and a hand
    // photographed puts a person into a frame that must not contain one.
    svg: svg(
      `<g transform="rotate(-13 400 1180)">
         <rect x="352" y="1096" width="96" height="420" rx="48" fill="${BRONZE}"/>
         <circle cx="400" cy="1096" r="228" fill="${BRONZE}"/>
         <circle cx="400" cy="1096" r="228" fill="url(#pad)"/>
       </g>`,
      `<radialGradient id="pad" cx="0.35" cy="0.3" r="0.85">
         <stop offset="0" stop-color="${CREAM}" stop-opacity="0.45"/>
         <stop offset="1" stop-color="${BRONZE_DEEP}" stop-opacity="0.35"/>
       </radialGradient>`,
    ),
    blur: 34,
  },
  vignetteLayer,
];

/* -------------------------------------------------------------------------- */
/* render                                                                      */
/* -------------------------------------------------------------------------- */

/** Mid-grey noise, composited in `overlay`, so the soft gradients get some
    tooth and AVIF has something to hold onto instead of banding across a ramp. */
async function grain(amplitude = 9, alpha = 0.055) {
  const w = Math.round(W / 2);
  const h = Math.round(H / 2);
  const buf = Buffer.allocUnsafe(w * h);
  const r = rng(515);
  for (let i = 0; i < buf.length; i++) buf[i] = 128 + Math.round((r() - 0.5) * 2 * amplitude);
  const grey = await sharp(buf, { raw: { width: w, height: h, channels: 1 } })
    .resize(W, H, { kernel: "cubic" })
    .png()
    .toBuffer();
  return sharp(grey).ensureAlpha(alpha).png().toBuffer();
}

async function render(name, layers) {
  const composites = [];
  for (const layer of layers) {
    let img = sharp(Buffer.from(layer.svg)).resize(W, H);
    if (layer.blur) img = img.blur(layer.blur);
    composites.push({ input: await img.png().toBuffer() });
  }
  composites.push({ input: await grain(), blend: "overlay" });

  const flat = await sharp({ create: { width: W, height: H, channels: 4, background: CREAM } })
    .composite(composites)
    .png()
    .toBuffer();

  const [avif, webp] = await Promise.all([
    sharp(flat).avif({ quality: 56, effort: 6 }).toBuffer(),
    sharp(flat).webp({ quality: 80 }).toBuffer(),
  ]);

  await Promise.all([
    sharp(avif).toFile(`${OUT}${name}.avif`),
    sharp(webp).toFile(`${OUT}${name}.webp`),
  ]);

  return { name, avif: avif.length, webp: webp.length };
}

await mkdir(OUT, { recursive: true });

const results = [];
for (const [name, layers] of [
  ["consultation", consultation],
  ["cataracte", cataracte],
  ["refractive", refractive],
  ["cornee", cornee],
  ["retine-glaucome", retineGlaucome],
  ["pediatrie", pediatrie],
]) {
  results.push(await render(name, layers));
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
for (const r of results) {
  console.log(`  ${r.name.padEnd(16)} avif ${kb(r.avif).padStart(9)}   webp ${kb(r.webp).padStart(9)}`);
}
console.log(`\n  ${results.length} specialty images written to public/specialties/ at ${W}x${H}`);
