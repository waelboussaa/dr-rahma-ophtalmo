# Design system

The whole system lives in `src/styles/global.css`. This file explains the
reasoning so the next person does not undo it by accident.

Direction: **Warm Medical Editorial × Premium Private Practice × Human Doctor.**
The premium feeling comes from type, spacing and composition. There are no
gradients, no glassmorphism, no glow, and no drop shadows except one very soft
plate shadow that is currently unused.

---

## Colour

Sampled from the business card, then corrected for contrast.

| Token | Hex | Role |
|---|---|---|
| `--color-cream` | `#f8f5ef` | page ground |
| `--color-surface` | `#ffffff` | raised plates |
| `--color-sand` | `#e9ded0` | alternating bands, timeline rail |
| `--color-sand-soft` | `#f1e9de` | hover surface, icon chips |
| `--color-line` | `#e3d9cb` | hairlines |
| `--color-bronze` | `#8f7963` | the arc, icons, rules, index numerals |
| `--color-bronze-deep` | `#6e5b49` | the only bronze allowed to carry text |
| `--color-bronze-light` | `#d9c4ac` | bronze on the ink bands |
| `--color-ink` | `#1c1b19` | headings, primary CTA, dark bands |
| `--color-ink-muted` | `#5a554d` | body copy |
| `--color-sand-ink` | `#cfc6b8` | muted text on the ink bands |

Measured contrast: ink/cream **15.9:1**, ink-muted/cream **7.4:1**,
sand-ink/ink **9.8:1**, bronze-deep/white **6.0:1**, bronze/cream **3.5:1**.

Two rules that must not be broken:

1. **`--color-bronze` never carries text.** At 3.5:1 on cream it is legal for a
   1px rule, a ≥24px display numeral, an icon and a focus ring, and nothing
   else. If you need bronze text, use `--color-bronze-deep`.
2. **The primary CTA is ink, not bronze.** A brown button on a beige page is the
   template cliché the whole design is steering around, and charcoal on cream is
   calmer, reads more clinical-premium, and passes AAA. Bronze is the accent
   that makes the page feel like her card — used selectively, as the brief asked.

## Radius

Deliberately uneven, so the page never reads as "everything is a rounded card":
`--radius-pill: 999px` for buttons, `--radius-plate: 18px` for specialty plates,
`--radius-panel: 10px` for the map, `--radius-photo: 4px` for imagery.
Photographs are near-square-cornered on purpose.

## Type

| | Display | Body / UI |
|---|---|---|
| **FR** | Fraunces Variable (opsz + wght) | Manrope Variable |
| **AR** | Readex Pro Variable | IBM Plex Sans Arabic |

Self-hosted through `@fontsource-variable`. No Google Fonts CDN: one fewer
third-party request, and no visitor IP handed to a US ad network from a page
about their eyesight.

Every face is `unicode-range` gated, so **the French page downloads zero Arabic
bytes** and `/ar` downloads the Arabic subsets plus the Latin ones it needs for
phone numbers and "Med.tn". This is why there is no per-locale preloading and no
conditional import — the browser already does the right thing.

Scale is fluid (`clamp`) and defined once in `:root`: `--text-display`,
`--text-h2`, `--text-h3`, `--text-lead`, `--text-body`, `--text-label`. Use
the `.display` / `.h2` / `.h3` / `.lead` / `.field-label` classes rather than
per-component font sizes.

**There are no kickers on this site.** `.field-label` is for small uppercase
labels that name DATA beneath them - "Adresse", "Horaires", "Téléphone". It is
not for a word floated above a heading. An earlier build had eight of those
("SPÉCIALITÉS" over "Une expertise complète pour votre vision."); they spent the
reader's first line of attention restating the heading, and they are gone.
`SectionHead.astro` has no eyebrow slot, so the pattern cannot come back by
habit.

### Arabic is a system, not a translation

The `[lang="ar"]` block in `global.css` is the single most important part of
this design system. Each rule is there because ignoring it is what makes "RTL
support" look like an afterthought:

- **`letter-spacing: normal` on everything.** Tracking breaks the joins between
  Arabic letters. This is a rendering fault, not a style preference. The rule is
  written as `[lang="ar"] *` so it outranks every Tailwind `tracking-*` utility
  and a shared component cannot reintroduce it.
- **More leading, not less.** `--leading-display` goes 1.04 → 1.34 and
  `--leading-body` 1.7 → 1.95. Arabic has deep descenders and diacritics; at
  Latin leading, stacked lines collide.
- **Body up, display down.** `--text-body` 1rem → 1.0625rem because Arabic reads
  optically smaller at equal px; `--text-display` comes *down* slightly because
  at Latin display sizes Arabic overwhelms the composition.
- **No uppercase.** Arabic has no case. `.u-caps` and `.field-label` reset
  `text-transform` under `[lang="ar"]`.
- **Western digits in `<bdi dir="ltr">`.** Tunisian convention is 0–9, and the
  isolation stops the bidi algorithm reordering a phone number inside an Arabic
  sentence.
- **Arabic copy is authored, not translated.** `src/locales/ar.json` is written
  for Arabic rhythm. The name, title and address use the card's own Arabic.

### RTL mechanics

Every spacing, border and position utility in the codebase is **logical**:
`ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`, `border-s`, `text-start`.
RTL is then a `dir` flip rather than a second stylesheet — verified by the fact
that the hero rule, the journey rail and the column dividers all mirror with no
RTL-specific CSS at all.

The only explicit mirroring is `rtl:-scale-x-100` on the `ArrowUpRight` in the
booking buttons, and `rtl:origin-right` on the specialty hover sweep. The logo,
the phone icon and the map pin must **never** mirror.

## Layout

`.wrap` is 75rem max with a 1.25rem gutter (2.5rem from `md`). `.section-y`
gives every section `clamp(4.5rem, 9vw, 8.5rem)` of vertical rhythm.

Nine sections alternate four grounds so no two neighbours share a treatment:

```
Hero        cream, full bleed, asymmetric 7/5
Trust       SAND band, four hairline-separated columns (not cards)
Specialties cream, six tinted numbered cards, 3 x 2, image per card
Examens     INK band, statement + ruled rows (no icons)
About       cream, editorial split, image at inline-start
Parcours    SAND band, one rail, four nodes
Cabinet     cream, editorial split, click-to-load map
RDV         INK band, centred, one dominant CTA
Contact     cream, four hairline-separated columns
```

The specialties section is **six tinted cards on a 3 x 2 grid**, built to match a
reference layout the owner supplied: a rounded sand-soft card carrying an index
number, an outlined bronze icon, a blob-masked image in the top-inline-end
corner, then heading and copy, under a centred heading block with a kicker.

This reverses two earlier decisions in this project - no kickers, no decorative
index numbers - and it is the owner's call, made with the trade-off stated. It
also supersedes an intermediate treatment (boxless hairline entries with a
full-width lead). Do not "restore" the older versions without asking them.

**The one deviation from the reference** is colour. The reference is navy, light
blue and coral; this renders the same composition in cream, sand and bronze,
because a blue section between the sand band above and the ink band below would
read as a different site spliced in. Swapping the literal colours in is a token
change, not a structural one.

The mask is a **leaf**: heavy curvature on two opposite corners, slight on the
others, defined once as an SVG `clipPath` in `objectBoundingBox` units and
referenced by every card. It is deliberately asymmetric, so RTL mirrors the
container and the `<img>` counter-mirrors inside it - the shape points the right
way and the photograph is never flipped. Flipping a photograph of a person or an
instrument is the kind of error nobody notices until a patient does.

The left column of each card stretches to the image height and pushes its two
marks apart, so the number sits at the top of the band and the icon low against
the image. Left as `items-start` the icon floats with a dead pocket beneath it.

**The count is load-bearing:** six cards fill exactly two rows of three, and the
booking prompt is a full-width row *below* the grid rather than a seventh cell.
Changing the number of specialties leaves a hole.

## Specialty imagery

The six images are **drawn, not photographed**, by
`scripts/build-specialty-images.mjs` (`npm run specialties`) into
`public/specialties/<id>.{avif,webp}` - ids `consultation`, `cataracte`,
`refractive`, `cornee`, `retine-glaucome`, `pediatrie`. About 67 KB of AVIF for
all six. Each depicts the phenomenon its specialty is about - the slit lamp's
optical section, a clouding lens, a warm topography map, the cornea under
raking light, a fundus, a picture chart with an occluder - in the site palette,
seeded so re-running produces identical files. `SpecialtyImage.astro` still
falls back to a sand ground with the mark's arc if a file is missing.

Drawing them was a deliberate reading of the constraint below: a photograph of
an instrument in a consulting room implies it is hers; a drawing of light
crossing a cornea implies nothing about the room. Replacing any with a
photograph is a drop-in (same filename), but the prompts that follow must then
be held to the same constraint.

**Honesty constraint.** These are generated illustrations, not photographs of
this practice. They must never depict Dr Saidane, her cabinet, or anything that
would read as evidence of her equipment - the page already frames diagnostics as
"examens pratiqués" precisely to avoid claiming equipment nobody has verified.
Keep faces out of frame or heavily out of focus, and keep the alt text
descriptive of the image rather than of her practice (`spec.<id>.alt`).

**If replacing with generated photographs - shared direction for every prompt:** portrait 4:5, at least 1120 x 1400.
Palette restricted to cream `#F8F5EF`, sand `#E9DED0` and warm bronze
`#8F7963`; explicitly no blue, teal, chrome or clinical fluorescent light.
Soft single key light, shallow depth of field, low contrast, editorial rather
than stock. Export AVIF plus a WebP fallback, named `<id>.avif` / `<id>.webp`.

1. **consultation** - A close, softly lit detail of a slit-lamp ophthalmic
   examination: the instrument's chin rest and illumination arm in the
   foreground, the patient's eye area soft and out of focus behind. Single soft
   key from the upper left, warm cream and beige light, no chrome glare.

2. **cataracte** - An extreme macro of a human eye in warm light, the lens
   showing a faint central cloudiness. Amber-brown iris, natural skin, no
   makeup. Diffuse light, cream and sand ground, respectful and clinical
   without being cold.

3. **refractive** - A corneal topography map recoloured into warm tones instead
   of the usual rainbow scale: concentric contour rings in bronze, sand and
   cream on a warm off-white ground, on a softly lit screen seen at an angle.
   Abstract, precise, graphic.

4. **cornee** - A macro of the curved surface of a cornea catching a soft
   crescent highlight, seen almost edge-on. Raking light from one side revealing
   the curvature, warm bronze and amber reflections, the rest falling into soft
   shadow.

5. **retine-glaucome** - A fundus image of a healthy retina recoloured warm: the
   optic disc a pale cream circle, the vessel tree branching in soft bronze and
   terracotta across a warm amber ground. Vignetted, slightly soft at the edges,
   reads as a natural form.

6. **pediatrie** - A gentle scene from a child's vision test: small hands
   holding an occluder paddle, or a picture-based eye chart in soft focus, shot
   at child height. Soft natural window light, no full faces in frame, calm and
   unposed.

Icons appear in the trust strip and on the specialty entries, and **deliberately
not** in the examens section — repeating the icon-led treatment there would
flatten two very different sections into one look.

## Motion

**One authored moment, and near-silence afterwards.**

An earlier build gave all 37 blocks on the page the same fade-and-rise. That is
not a motion design; it is one effect repeated until it reads as a tic. Now the
hero plays a short staged entrance on load - the arc strokes itself in over
1.6s (normalised with `pathLength="100"`, so the dash maths survives a re-cut of
the geometry), the headline wipes up from a clip rather than fading, so the
serif reads as being *set* rather than switched on, and the supporting lines
follow on a 90ms stagger - all on `--ease-out-expo`.

Everything below the fold gets **opacity only**, 600ms, no transform, one settle
per section: 13 reveals on the page, not 37. Fired once by a single
`IntersectionObserver` in `Base.astro`; elements unobserve themselves, so nothing
replays on the way back up.

That observer uses `threshold: 0` deliberately. A ratio threshold can never be
satisfied by an element taller than the viewport, so a tall section would sit at
opacity 0 forever for anyone who deep-linked into it or whose browser restored a
mid-page scroll. Firing on the first pixel, held back by a negative bottom
margin, is correct at every element height.

Reveals are **opt-in behind a `js` class** set pre-paint. With JavaScript
disabled the stylesheet leaves every section visible, rather than hiding the
whole page behind an animation that will never run.

`prefers-reduced-motion: reduce` is honoured in **one global block** that
neutralises every animation, transition and transform, so a new section cannot
forget to support it.

## Browser surfaces

The parts nobody draws still carry the design. A default grey scrollbar and a
blue caret on a cream editorial page are the clearest tell that a site was
assembled rather than built, so `global.css` themes them: `::selection` in sand,
a slim bronze scrollbar thumb on a sand track (`scrollbar-color` for Firefox and
`::-webkit-scrollbar-*` for the rest), `caret-color` in deep bronze, and a global
`text-underline-offset` so underlines clear descenders everywhere rather than
only where a component remembers to set it.

Body measure is `--measure: 68ch`, inside the 65-75ch comfortable range.

## Focus

One treatment site-wide: `2px solid var(--color-bronze)` at `3px` offset.
Inside `.band-dark` it swaps to `--color-bronze-light` so the ring never
disappears against ink. WCAG 2.2 wants 3:1 for a focus indicator; bronze on
cream is 3.5:1 and light bronze on ink is well above.

Targets are 48px minimum (`.btn`), 56px in the mobile dock.

---

## The portrait slot

**No photograph of Dr Saidane exists.** Her Med.tn "clinic photo" is a scan of
her business card. The hero was therefore built to be finished *without* a
portrait: its weight is in the type and the asymmetric grid, and the image
column is an enrichment.

`src/components/site/Portrait.astro` checks at build time for
`public/brand/portrait.{avif,webp,jpg}`. With none present it renders a brand
plate — the mark over an oversized cropped arc on a cream disc. Drop a file in
and it is used instead, with no layout change: same slot, same aspect ratio, no
shift. Provide AVIF and WebP and it builds a `<picture>` automatically.

### Art direction for the portrait

If generating or shooting it, ask for:

> A warm, natural portrait of a woman ophthalmologist in her forties, shoulders
> up, three-quarter turn with eyes to camera, calm and approachable expression,
> no clinical equipment in frame. Soft directional key light from the front
> left, gentle falloff, no hard shadows. Plain warm backdrop in cream or soft
> beige (`#F1E9DE`–`#E9DED0`). Neutral professional clothing, no strong pattern.
> Shallow depth of field. Editorial, not corporate stock. Colour grade warm and
> low-contrast to match a cream page.

Deliver **3:4** (used by the hero) and let the About section's 4:5 crop from the
same file. Export AVIF at ~900×1200 plus a WebP fallback.

Cabinet photography, if it is ever shot, should follow the same warmth and avoid
empty waiting rooms and equipment close-ups.

## Brand assets

`npm run brand` regenerates the favicon, app icons and both social cards from
the same vector geometry the site uses, via `scripts/build-brand.mjs`.

The mark is derived, not eyeballed: circle centre (32,32), radius 24, arc from
20° clockwise to 340°, leaving a 40° opening. `EyeMark.astro`, the Portrait
plate, the hero, the booking band and the generator all use the same two path
strings, so the logo cannot drift between them.

The social cards' **text** is rendered by resvg against the fonts installed on
the machine running the script, not the webfonts — they currently fall back to
Georgia and Segoe UI, which is close enough at card scale. Install Fraunces and
Manrope and add them to the front of the stacks in the script for an exact match.
