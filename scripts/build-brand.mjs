/**
 * Generates the brand image assets from the same vector geometry the site uses.
 *
 *   public/brand/favicon.svg          the mark, stroke-weighted up for small sizes
 *   public/brand/apple-touch-icon.png 180x180
 *   public/brand/icon-192.png         PWA / manifest
 *   public/brand/icon-512.png         PWA / manifest
 *   public/brand/og-fr.png            1200x630 social card
 *   public/brand/og-ar.png            1200x630 social card, Arabic
 *
 * Run with `npm run brand`. Checked-in output means a normal build needs no
 * rasteriser, and re-running after a logo change is one command.
 *
 * Rasterising is done by sharp (already present as an Astro dependency), which
 * renders SVG through resvg/librsvg. Shapes are exact; TEXT is resolved against
 * the fonts installed on the machine running this script, NOT against the
 * webfonts the site loads. So the cards name a system stack that degrades
 * sensibly (Georgia for the serif, Segoe UI / Tahoma for the sans and for
 * Arabic). If you regenerate on a machine with Fraunces and Manrope installed,
 * add them to the front of the stacks below and the cards will match the site
 * exactly.
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../public/brand/", import.meta.url));

const CREAM = "#f8f5ef";
const SAND = "#e9ded0";
const BRONZE = "#8f7963";
const BRONZE_DEEP = "#6e5b49";
const INK = "#1c1b19";
const INK_MUTED = "#5a554d";

/** The arc and eye, in the 64x64 frame used by EyeMark.astro. */
const ARC_PATH = "M54.55 40.21 A 24 24 0 1 1 54.55 23.79";
const EYE_PATH = "M17 32 C 22 23.4, 42 23.4, 47 32 C 42 40.6, 22 40.6, 17 32 Z";

function mark({ stroke = 2.25, arc = BRONZE, eye = INK } = {}) {
  return `
    <path d="${ARC_PATH}" stroke="${arc}" stroke-width="${stroke}" stroke-linecap="round" fill="none"/>
    <path d="${EYE_PATH}" stroke="${eye}" stroke-width="${stroke}" stroke-linejoin="round" fill="none"/>
    <circle cx="32" cy="32" r="4.6" fill="${eye}"/>`;
}

/* -------------------------------------------------------------------------- */
/* favicon                                                                     */
/* -------------------------------------------------------------------------- */

// Heavier strokes and a cream ground: at 16px a hairline mark on transparency
// disappears into whatever the browser chrome happens to be.
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="13" fill="${CREAM}"/>
  <g transform="translate(32 32) scale(0.86) translate(-32 -32)">
    ${mark({ stroke: 3.4 })}
  </g>
</svg>`;

/* -------------------------------------------------------------------------- */
/* app icons                                                                   */
/* -------------------------------------------------------------------------- */

const appIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="512" height="512">
  <rect width="64" height="64" fill="${CREAM}"/>
  <g transform="translate(32 32) scale(0.78) translate(-32 -32)">
    ${mark({ stroke: 3 })}
  </g>
</svg>`;

/* -------------------------------------------------------------------------- */
/* social cards                                                                */
/* -------------------------------------------------------------------------- */

const SERIF = "Fraunces, Georgia, 'Times New Roman', serif";
const SANS = "Manrope, 'Segoe UI', Tahoma, sans-serif";
const ARABIC = "'Readex Pro', 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif";

function ogCard({ dir, name, title, place, fontStack, displaySize = 62 }) {
  const rtl = dir === "rtl";
  // Anchor the text block to the outer edge of whichever side it sits on.
  const x = rtl ? 1120 : 80;
  // NOTE: no `direction` attribute. resvg does not combine `direction="rtl"`
  // with `text-anchor` correctly - the run is laid out from the anchor point
  // rightwards and walks off the canvas. Arabic still shapes and orders
  // correctly from the bidi algorithm alone, and `text-anchor="end"` then puts
  // the visual end of the run exactly on the margin, which is what we want.
  const anchor = rtl ? "end" : "start";

  // Mirror the whole decorative arc for RTL instead of hand-placing it twice,
  // so the two cards are true reflections rather than two separate guesses.
  const arcFrame = rtl ? `translate(1200 0) scale(-1 1) translate(820 -140) scale(14)` : `translate(820 -140) scale(14)`;
  const markX = rtl ? 1120 - 64 : 80;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${CREAM}"/>

  <!-- oversized arc, cropped by the frame, on the side opposite the text -->
  <g transform="${arcFrame}" opacity="0.15">
    <path d="${ARC_PATH}" stroke="${BRONZE}" stroke-width="0.6" stroke-linecap="round" fill="none"/>
  </g>

  <g transform="translate(${markX} 66) scale(1.35)">${mark({ stroke: 2.6 })}</g>

  <text x="${x}" y="308" text-anchor="${anchor}"
        font-family="${fontStack.display}" font-size="${displaySize}" fill="${INK}">${name}</text>

  <text x="${x}" y="368" text-anchor="${anchor}"
        font-family="${fontStack.body}" font-size="27" fill="${INK_MUTED}">${title}</text>

  <rect x="${rtl ? 1040 : 80}" y="418" width="80" height="3" fill="${BRONZE}"/>

  <text x="${x}" y="480" text-anchor="${anchor}"
        font-family="${fontStack.body}" font-size="25" font-weight="600" fill="${BRONZE_DEEP}">${place}</text>

  <rect x="0" y="606" width="1200" height="24" fill="${SAND}"/>
</svg>`;
}

const cards = {
  "og-fr.png": ogCard({
    dir: "ltr",
    name: "Dr Rahma Saidane Bourogaa",
    title: "Spécialiste en ophtalmologie, maladies et chirurgie des yeux",
    place: "El Mourouj 5 · Ben Arous",
    fontStack: { display: SERIF, body: SANS },
  }),
  "og-ar.png": ogCard({
    dir: "rtl",
    name: "الدكتورة رحمة سعيدان بورقعة",
    title: "أخصائية في طب وجراحة العيون والعلاج بالليزر",
    place: "المروج 5 · بن عروس",
    fontStack: { display: ARABIC, body: ARABIC },
    displaySize: 56,
  }),
};

/* -------------------------------------------------------------------------- */

async function main() {
  await mkdir(OUT, { recursive: true });

  await writeFile(`${OUT}favicon.svg`, faviconSvg, "utf8");
  console.log("wrote favicon.svg");

  const icon = Buffer.from(appIconSvg);
  for (const [file, size] of [
    ["apple-touch-icon.png", 180],
    ["icon-192.png", 192],
    ["icon-512.png", 512],
  ]) {
    await sharp(icon, { density: 400 }).resize(size, size).png().toFile(`${OUT}${file}`);
    console.log(`wrote ${file} (${size}px)`);
  }

  for (const [file, svg] of Object.entries(cards)) {
    await sharp(Buffer.from(svg), { density: 144 }).resize(1200, 630).png().toFile(`${OUT}${file}`);
    console.log(`wrote ${file} (1200x630)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
