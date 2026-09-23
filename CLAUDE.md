# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repository.

## What this is

A one-page bilingual site for **Dr Rahma Saidane Bourogaa**, ophthalmologist at
Centre Médical BAYA, El Mourouj 5, Ben Arous, Tunisia. French at `/`, Arabic at
`/ar` in true RTL.

It is **not** a booking platform. Med.tn owns the appointment workflow; this
site owns the decision that precedes it. Its whole job is
**build trust → explain expertise → convert → hand off to Med.tn**. Every
section must answer one of: who is the doctor, can I trust her, can she help
with my problem, where is the clinic, how do I contact her, how do I book. If a
proposed section answers none of them, it does not belong.

## The rule that overrides everything

**This is a medical site. Never invent a fact.**

No diplomas, university, years of experience, certifications, awards, hospital
affiliations, learned societies, patient reviews, statistics, success rates,
equipment owned by the cabinet, or medical outcomes. No superlatives or
guarantees ("meilleur", "n°1", "100 % sûr", "résultats garantis").

Every fact lives in `src/content/practice.ts`, tagged with its `source`
(`card` | `medtn` | `owner`) and `status` (`VERIFIED` | `TO_CONFIRM`).
Components read from it and never hardcode a fact. `docs/00-content-source.md`
is the human-readable audit — **update it in the same commit as any copy change.**

Two framings that must survive editing:

- Diagnostic procedures are **"examens pratiqués"** (acts she is listed as
  performing), never equipment the cabinet owns. No source attests ownership.
- The large line in the About section is **site copy, not a quotation**. No
  quote marks, no attribution. She has given this site no statement.

Med.tn sits behind Cloudflare bot protection and cannot be fetched
programmatically. To refresh its data, screenshot the profile manually — see the
end of `docs/00-content-source.md`.

## Commands

Run from the project folder, never from `D:\`.

```bash
npm install
npm run dev          # astro dev on http://localhost:4321 (falls back to 4322 if taken)
npm run check        # astro check - run before considering a change done
npm run build        # static output to dist/
npm run preview      # serve dist/ locally
npm run brand        # regenerate favicon, app icons and both OG cards
npm run specialties  # regenerate the six drawn specialty images
npm run logo-formats # regenerate logo-clean.avif/.webp after replacing logo-clean.png
```

`PUBLIC_SITE_URL` in `.env` is the canonical origin, read by `astro.config.mjs`
through `loadEnv`. It drives `<link rel=canonical>`, `hreflang`, the sitemap and
the OG image URLs, so it must be the real domain in production.

## Architecture

**Astro, fully static, essentially zero JavaScript.** No adapter, no React, no
UI library, no backend. Two prerendered pages plus a generated `robots.txt`.

Conventions deliberately mirror the author's `wework-mourouj` project so the two
feel like one house style: `:root` + `@theme inline` tokens, `src/lib/i18n.ts`,
the `Base.astro` SEO head, the `loadEnv` config pattern, `@lucide/astro` icons.

```
src/content/practice.ts   facts, source-tagged - the only place a fact is written
src/locales/{fr,ar}.json  authored copy (Arabic is authored, not translated)
src/lib/i18n.ts           locales, dirOf, t(), localizedPath, section anchors
src/lib/links.ts          tel / wa.me / mailto / maps / Med.tn hrefs
src/lib/jsonld.ts         Physician + WebSite + WebPage structured data
src/layouts/Base.astro    head, header, footer, dock, reveal observer
src/components/brand/     EyeMark, Wordmark
src/components/site/      Portrait, SectionHead, LocaleSwitch, SpecialtyImage,
                          MobileNavToggle, MobileNavPanel, StickyDock,
                          MapPanel, HomeBody
src/components/sections/  the nine homepage sections
src/pages/index.astro     FR   ->  /
src/pages/ar/index.astro  AR   ->  /ar
scripts/build-brand.mjs   brand raster generation (sharp)
scripts/build-specialty-images.mjs  the six specialty illustrations (sharp)
scripts/build-logo-formats.mjs      AVIF/WebP siblings of logo-clean.png (sharp)
```

Both routes render the same `HomeBody`, so the two language versions cannot
drift apart structurally — only their strings differ.

**i18n.** French is the default and has no path prefix
(`prefixDefaultLocale: false`). `TranslationKey` is derived from `fr.json`, and
`ar.json` is typed against it, so **`astro check` fails if a key drifts**. That
is intentional: a missing Arabic string is a French sentence shown to a patient
reading Arabic.

## Rules when editing

1. **Logical properties only.** `ps-`/`pe-`/`ms-`/`me-`/`start-`/`end-`/
   `border-s`/`text-start`. Never `pl-`, `left-`, `text-left`. RTL is a `dir`
   flip, not a second stylesheet. The only deliberate mirrors are
   `rtl:-scale-x-100` on the booking arrows and `rtl:origin-right` on the
   specialty hover sweep. The logo, phone icon and map pin never mirror.
2. **Never put tracking on Arabic.** `global.css` neutralises it globally; do
   not work around that.
3. **Bronze never carries text** (3.5:1 on cream). Use `--color-bronze-deep`.
   The primary CTA stays ink.
4. **Do not turn every section into cards.** Specialties is the one card grid,
   built that way at the owner's request from a reference they supplied. Every
   other section alternates cream / sand / ink grounds with its own treatment;
   keep it that way.
5. **Add new strings to both locale files** in the same edit, or the typecheck
   fails.
6. **One kicker only, in Specialties.** `SectionHead.astro` deliberately has no
   eyebrow slot: elsewhere the heading carries its own weight. The specialties
   kicker exists because the owner asked for it; do not add more without asking
   them, and do not remove that one on craft grounds. `.field-label` is
   otherwise for labels that name data ("Adresse", "Horaires").
7. **New sections get `.reveal`** - opacity only, one per section - not a
   bespoke animation. The hero owns the page's single authored motion; do not
   add a second. Everything inherits the one `prefers-reduced-motion` block.
8. **The full nav appears at `lg`, not `md`.** Between 768 and ~1020px the
   header does not fit; the menu button covers that range. Keep the toggle, the
   nav, the header CTA and the sticky dock on the same `lg` breakpoint.
9. **The mobile menu is two components, and they stay apart.**
   `MobileNavToggle.astro` sits in the header; `MobileNavPanel.astro` is a
   sibling of `<header>`. The header carries `backdrop-blur-lg`, and a
   `backdrop-filter` becomes the containing block for every `position: fixed`
   descendant - with the panel nested inside, `inset-0` resolved against the
   header's 64px box and the menu opened as an empty strip with 607px of content
   scrolled out of sight. Merging them back reintroduces that silently. The same
   applies to anything else fixed and full-screen: render it outside the header.
10. **Do not hijack scrolling.** The Lenis smooth-scroll library was removed:
    it overrode native scrolling (keyboard paging, find-in-page, `scrollTo`)
    on a site whose patients skew older. `global.css` gives anchor links
    `scroll-behavior: smooth` and a header offset natively.
11. **Dialogs are `inert` when closed.** The comfort panel was hidden with
    opacity alone, so its controls stayed focusable and announced. Anything
    that hides with opacity must also toggle `inert` and manage focus.
12. **Emergency symptoms never route to online booking.** See the end of
    `docs/00-content-source.md`.
13. **Keep the page zero-JS by default.** The only scripts are the nav toggle,
   the dock observer, the reveal observer, the header scroll state and the map
   click-to-load — together 2.6 KB of inline JavaScript, and no external bundle.

## Known constraints

- **The portrait does not exist.** `Portrait.astro` renders a designed brand
  plate when `public/brand/portrait.{avif,webp,jpg}` is absent, and swaps to the
  photo with no layout change when one appears. Art direction is in
  `docs/01-design-system.md`. Do not fake a photo.
- **Google Maps loads only after a click.** Do not "simplify" `MapPanel.astro`
  into an always-on iframe: that would contact Google and set cookies before a
  patient has done anything, on a page about their eyesight, and it is the worst
  single thing on the page for LCP.
- **Windows / Smart App Control.** The author's other project hits a blocked
  Astro markdown parser binary (`@bruits/satteri-win32-x64-msvc`). This project
  uses only `.astro` and `.ts` content, never `.md` pages, which avoids it. If a
  build ever trips it, apply the `vendor/satteri-wasm32-wasi` +
  `@napi-rs/wasm-runtime` fallback from `wework-mourouj`.

## Per-specialty SEO sub-pages were built, then removed

A later build added six pages - `/cataracte`, `/ar/cataracte`, and the same
for the other five specialties - via `src/pages/[specialty].astro` and
`src/pages/ar/[specialty].astro`, rendering a shared `SpecialtyPage.astro`
with its own breadcrumbs, JSON-LD (`buildSpecialtyJsonLd` in `jsonld.ts`) and
booking CTA. Every link into them ("En savoir plus" on each homepage
specialty card, on each VisionGuide panel, and the footer's services column)
was removed at the owner's request, at the same time as the pages themselves.

The footer's services column still lists all six specialties, now linking to
that specialty's card on the homepage (`${homePath(locale)}#${spec.id}`)
instead of a dedicated page - each card already carries `id={spec.id}` as a
scroll anchor, which is why this needed no new plumbing.

**Reviving this is a re-add, not new work.** The underlying content was never
deleted: `specialties[].backedBy` in `practice.ts` still holds the sourced
acts, `sections` in `i18n.ts` still names anchors after slugs a page could
reuse, and `localizedPath()` still handles arbitrary paths. Recreate the two
`[specialty].astro` routes and `SpecialtyPage.astro` from git history, restore
`buildSpecialtyJsonLd`, and re-point the three link sites above - do not
re-invent the page from scratch.
