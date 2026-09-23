import { identity, cabinet, contact, hours, medtn, specialties } from "../content/practice";
import { bcp47, locales, localizedPath, t, type Locale, type TranslationKey } from "./i18n";

/**
 * Structured data for a local medical practice.
 *
 * `Physician` is the correct type here rather than `LocalBusiness`: it inherits
 * both MedicalBusiness and MedicalOrganization, and it is what Google's local
 * health panels actually consume. Everything in it is sourced from
 * src/content/practice.ts, so the schema cannot drift from the visible page.
 *
 * CNAM is deliberately NOT forced into a schema property. There is no accurate
 * schema.org field for a Tunisian national insurance convention, and inventing
 * one (healthPlanNetworkId, say) would publish a claim in a shape no consumer
 * can interpret. It stays in the description and in the visible copy, where it
 * is true and readable.
 */
export function buildJsonLd(locale: Locale, siteUrl: URL): Record<string, unknown> {
  const pageUrl = new URL(localizedPath("/", locale), siteUrl).toString();
  const physicianId = new URL("/#physician", siteUrl).toString();
  const siteId = new URL("/#website", siteUrl).toString();

  const name = locale === "ar" ? identity.nameAr.value : identity.nameFr.value;
  const altName = locale === "ar" ? identity.nameFr.value : identity.nameAr.value;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": siteId,
        url: siteUrl.toString(),
        name,
        inLanguage: bcp47[locale],
        publisher: { "@id": physicianId },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: t(locale, "meta.title"),
        description: t(locale, "meta.description"),
        inLanguage: bcp47[locale],
        isPartOf: { "@id": siteId },
        about: { "@id": physicianId },
      },
      {
        "@type": "Physician",
        "@id": physicianId,
        name,
        alternateName: altName,
        description: t(locale, "meta.description"),
        url: pageUrl,
        image: new URL(`/brand/og-${locale}.png`, siteUrl).toString(),
        medicalSpecialty: "Ophthalmologic",
        telephone: [contact.phone.value, `+${contact.whatsapp.value}`],
        email: contact.email.value,
        knowsLanguage: locales.map((l) => bcp47[l]),
        sameAs: [medtn.url.value],
        address: {
          "@type": "PostalAddress",
          name: locale === "ar" ? cabinet.nameAr.value : cabinet.nameFr.value,
          streetAddress: cabinet.streetAddress.value,
          addressLocality: cabinet.locality.value,
          addressRegion: cabinet.region.value,
          postalCode: cabinet.postalCode.value,
          addressCountry: cabinet.country.value,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: cabinet.geo.value.lat,
          longitude: cabinet.geo.value.lng,
        },
        areaServed: [
          { "@type": "City", name: "El Mourouj" },
          { "@type": "AdministrativeArea", name: "Ben Arous" },
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: hours.days.value.map((d) => `https://schema.org/${d}`),
            opens: hours.opens.value,
            closes: hours.closes.value,
          },
        ],
        availableService: specialties.map((spec) => ({
          "@type": "MedicalProcedure",
          name: t(locale, `spec.${spec.id}.name` as TranslationKey),
          description: t(locale, `spec.${spec.id}.text` as TranslationKey),
        })),
        potentialAction: {
          "@type": "ReserveAction",
          name: t(locale, "cta.book"),
          target: {
            "@type": "EntryPoint",
            urlTemplate: medtn.url.value,
            actionPlatform: [
              "https://schema.org/DesktopWebPlatform",
              "https://schema.org/MobileWebPlatform",
            ],
          },
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        isPartOf: { "@id": `${pageUrl}#webpage` },
        mainEntity: [
          {
            "@type": "Question",
            name: t(locale, "faq.q1"),
            acceptedAnswer: {
              "@type": "Answer",
              text: t(locale, "faq.a1"),
            },
          },
          {
            "@type": "Question",
            name: t(locale, "faq.q2"),
            acceptedAnswer: {
              "@type": "Answer",
              text: t(locale, "faq.a2"),
            },
          },
          {
            "@type": "Question",
            name: t(locale, "faq.q3"),
            acceptedAnswer: {
              "@type": "Answer",
              text: t(locale, "faq.a3"),
            },
          },
          {
            "@type": "Question",
            name: t(locale, "faq.q4"),
            acceptedAnswer: {
              "@type": "Answer",
              text: t(locale, "faq.a4"),
            },
          },
          {
            "@type": "Question",
            name: t(locale, "faq.q5"),
            acceptedAnswer: {
              "@type": "Answer",
              text: t(locale, "faq.a5"),
            },
          },
          {
            "@type": "Question",
            name: t(locale, "faq.q6"),
            acceptedAnswer: {
              "@type": "Answer",
              text: t(locale, "faq.a6"),
            },
          },
        ],
      },
    ],
  };
}
