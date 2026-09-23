import fr from "../locales/fr.json";
import ar from "../locales/ar.json";

export const locales = ["fr", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

/** Locales written right-to-left. Drives `dir` on <html> and every logical property. */
export const rtlLocales: readonly Locale[] = ["ar"];

export function dirOf(locale: Locale): "rtl" | "ltr" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

/** BCP-47 tags for `hreflang`, `og:locale` and structured data. */
export const bcp47: Record<Locale, string> = { fr: "fr-TN", ar: "ar-TN" };
export const ogLocale: Record<Locale, string> = { fr: "fr_TN", ar: "ar_TN" };

/** What each language calls itself. A language switcher must never translate these. */
export const endonym: Record<Locale, string> = { fr: "Français", ar: "العربية" };
/** Compact label for the inline FR | العربية switch. */
export const shortLabel: Record<Locale, string> = { fr: "FR", ar: "العربية" };

/**
 * French is the reference dictionary: every key that exists in fr.json must exist
 * in ar.json, and `astro check` fails if one drifts. That is deliberate. A missing
 * Arabic string on a medical site is not a cosmetic bug, it is a French sentence
 * shown to a patient reading Arabic.
 */
export type TranslationKey = keyof typeof fr;

const dictionaries: Record<Locale, Record<TranslationKey, string>> = { fr, ar };

export function isLocale(x: string | undefined): x is Locale {
  return !!x && (locales as readonly string[]).includes(x);
}

/** Locale from an Astro URL: /ar/... -> ar, otherwise fr (the default has no prefix). */
export function localeFromPath(pathname: string): Locale {
  const seg = pathname.split("/").filter(Boolean)[0];
  return isLocale(seg) ? seg : defaultLocale;
}

/** Interpolates {name} placeholders. Falls back to FR, then to the key, so a gap is visible. */
export function t(locale: Locale, key: TranslationKey, vars: Record<string, string | number> = {}): string {
  const raw = dictionaries[locale][key] ?? dictionaries.fr[key] ?? key;
  return raw.replace(/\{(\w+)\}/g, (_, k: string) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}

export function makeT(locale: Locale) {
  return (key: TranslationKey, vars?: Record<string, string | number>) => t(locale, key, vars);
}

/** The home path for a locale. The site is one page per locale; sections are anchors. */
export function homePath(locale: Locale): string {
  return locale === defaultLocale ? "/" : `/${locale}`;
}

/**
 * The same page in another locale, for the language switcher and `hreflang`.
 * One page per locale today; written so adding /cataracte and /ar/cataracte later
 * needs no change here.
 */
export function localizedPath(pathname: string, target: Locale): string {
  const current = localeFromPath(pathname);
  const bare = current === defaultLocale ? pathname : pathname.replace(new RegExp(`^/${current}`), "") || "/";
  if (target === defaultLocale) return bare === "" ? "/" : bare;
  return bare === "/" ? `/${target}` : `/${target}${bare}`;
}

/** Section anchors. Ids are shared across locales so a link survives a language switch. */
export const sections = {
  specialties: "specialites",
  tech: "examens",
  about: "a-propos",
  journey: "parcours",
  faq: "faq",
  cabinet: "cabinet",
  booking: "rendez-vous",
  contact: "contact",
} as const;

export type SectionId = keyof typeof sections;

export function anchor(id: SectionId): string {
  return `#${sections[id]}`;
}

/** Returns the correct href whether the user is on the homepage or on a subpage. */
export function navLink(locale: Locale, id: SectionId, isHome: boolean): string {
  return isHome ? `#${sections[id]}` : `${homePath(locale)}#${sections[id]}`;
}

/** The header navigation: 4 items fit cleanly between 1024px and 1280px without collision. */
export const headerNavItems: { key: TranslationKey; id: SectionId }[] = [
  { key: "nav.specialties", id: "specialties" },
  { key: "nav.about", id: "about" },
  { key: "nav.cabinet", id: "cabinet" },
  { key: "nav.contact", id: "contact" },
];

/** The full navigation for the mobile panel and footer. */
export const allNavItems: { key: TranslationKey; id: SectionId }[] = [
  { key: "nav.specialties", id: "specialties" },
  { key: "nav.about", id: "about" },
  { key: "nav.journey", id: "journey" },
  { key: "nav.tech", id: "tech" },
  { key: "nav.faq", id: "faq" },
  { key: "nav.cabinet", id: "cabinet" },
  { key: "nav.contact", id: "contact" },
];

export const navItems = headerNavItems;
