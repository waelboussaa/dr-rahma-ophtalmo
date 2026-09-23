# Dr Rahma Saidane Bourogaa — ophtalmologue

One-page bilingual site (French `/`, Arabic `/ar` in true RTL) for an
ophthalmology practice at Centre Médical BAYA, El Mourouj 5, Ben Arous, Tunisia.

Appointments are handled by [Med.tn](https://www.med.tn); this site builds the
trust that precedes the booking and hands the visitor over.

## Stack

Astro (static) · Tailwind v4 · self-hosted variable fonts · no framework, no
backend, essentially zero JavaScript.

```bash
npm install
npm run dev      # http://localhost:4321
npm run check    # typecheck (also catches missing Arabic translations)
npm run build    # -> dist/
npm run brand    # regenerate favicon, app icons and OG cards
```

Set `PUBLIC_SITE_URL` in `.env` to the production origin before building —
it drives canonical, hreflang, sitemap and OG image URLs.

## Before you edit anything

Read [`CLAUDE.md`](./CLAUDE.md). The short version:

- **This is a medical site — never invent a fact.** Everything factual lives in
  `src/content/practice.ts` with its source and verification status, audited in
  [`docs/00-content-source.md`](./docs/00-content-source.md).
- **Use logical CSS properties only** (`ps-`, `me-`, `start-`, `border-s`), so
  Arabic stays a `dir` flip rather than a second stylesheet.
- **Add new strings to both `fr.json` and `ar.json`** — the typecheck fails
  otherwise, on purpose.

The design system and its reasoning are in
[`docs/01-design-system.md`](./docs/01-design-system.md).

## Adding the portrait

No photograph of Dr Saidane exists yet, and the hero is built to look finished
without one. Drop `portrait.avif` (and optionally `.webp` / `.jpg`) into
`public/brand/` at 3:4, rebuild, and both the hero and the About section swap
from the brand plate to the photo with no layout change. Art direction for
shooting or generating it is in the design system doc.
