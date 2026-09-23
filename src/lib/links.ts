import { cabinet, contact, medtn } from "../content/practice";

/**
 * Every outbound action the site offers. Built from src/content/practice.ts so a
 * phone number exists in exactly one place, and shaped here so a component never
 * has to remember that `tel:` wants no spaces while `wa.me` wants no plus sign.
 */

/** tel: needs the E.164 number with no spaces. */
export const telHref = `tel:${contact.phone.value}`;
export const telDisplay = contact.phoneDisplay.value;

/** wa.me wants the international number WITHOUT a leading + or any separator. */
export function whatsappHref(message: string): string {
  return `https://wa.me/${contact.whatsapp.value}?text=${encodeURIComponent(message)}`;
}
export const whatsappTel = `tel:+${contact.whatsapp.value}`;
export const whatsappDisplay = contact.whatsappDisplay.value;

export const mailtoHref = `mailto:${contact.email.value}`;
export const emailDisplay = contact.email.value;

/**
 * A plain Google Maps search URL: no API key, no billing account, and it opens
 * the native Maps app on a phone. The query carries the landmark, because
 * "au-dessus de Carrefour Market" is how people actually find the building.
 */
export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Centre Medical BAYA, Avenue 14 Janvier, El Mourouj 5, Ben Arous, Tunisie",
)}`;

/**
 * The embedded map, loaded only after an explicit click (see MapPanel.astro).
 * The `output=embed` form needs no API key and no Google Cloud project.
 */
export const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  "Centre Medical BAYA, Avenue 14 Janvier, El Mourouj 5, Ben Arous, Tunisie",
)}&output=embed`;

/** The Med.tn profile, already percent-encoded (its path segments are Arabic). */
export const medtnHref = medtn.url.value;

export const geo = cabinet.geo.value;
