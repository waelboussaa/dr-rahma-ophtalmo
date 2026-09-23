/**
 * The single source of truth for every FACT about the practice.
 *
 * This is a medical site, so the rule is absolute: nothing here may be invented.
 * Each fact carries where it came from and whether it has been verified, using
 * the same VERIFIED / TO_CONFIRM discipline the wework-mourouj docs apply to
 * prices. Components read from this file and never hardcode a fact, so an
 * unreviewed claim is visible in one place instead of buried in markup.
 *
 *   source "card"  - Dr Saidane's own business card (also her Med.tn "clinic photo")
 *   source "medtn" - her Med.tn profile 227403, read 2026-09-22
 *   source "owner" - supplied directly by the site owner
 *
 * NOT recorded here, because no source attests them: diplomas, university,
 * years of experience, certifications, awards, hospital affiliations, learned
 * societies, patient reviews, statistics, success rates, or equipment owned by
 * the cabinet. Do not add them without a source.
 *
 * Marketing prose lives in src/locales/*.json. This file holds facts only.
 */

export type FactSource = "card" | "medtn" | "owner";
export type FactStatus = "VERIFIED" | "TO_CONFIRM";

export interface Fact<T = string> {
  value: T;
  source: FactSource;
  status: FactStatus;
  /** why this is trustworthy, or what still needs checking */
  note?: string;
}

const f = <T,>(value: T, source: FactSource, status: FactStatus = "VERIFIED", note?: string): Fact<T> => ({
  value,
  source,
  status,
  note,
});

/* -------------------------------------------------------------------------- */
/* Identity                                                                    */
/* -------------------------------------------------------------------------- */

export const identity = {
  /** Display name, without the "Docteur" prefix the card sets in a separate line. */
  nameFr: f("Dr Rahma Saidane Bourogaa", "card"),
  nameAr: f("الدكتورة رحمة سعيدان بورقعة", "card"),

  /**
   * The card reads "SPECIALISTE EN OPHTALMOLOGIE / MALADIES ET CHIRURGIE DES YEUX /
   * TRAITEMENT AU LASER". The brief said "chirurgie des yeux"; the card wins, because
   * it is her own wording and it matches the Arabic on the reverse ("طب وجراحة العيون").
   */
  titleFr: f("Spécialiste en ophtalmologie, maladies et chirurgie des yeux, traitement au laser", "card"),
  titleAr: f("أخصائية في طب وجراحة العيون والعلاج بالليزر", "card"),

  /** Short form for the header, footer and structured data. */
  shortTitleFr: f("Spécialiste en ophtalmologie", "card"),
  shortTitleAr: f("أخصائية طب العيون", "medtn"),
} as const;

/* -------------------------------------------------------------------------- */
/* Contact                                                                     */
/* -------------------------------------------------------------------------- */

export const contact = {
  /** Card prints "92 21 21 25"; the brief wrote the same digits grouped differently. */
  phone: f("+21692212125", "card"),
  phoneDisplay: f("+216 92 21 21 25", "card"),

  whatsapp: f("21622422131", "card"),
  whatsappDisplay: f("+216 22 42 21 31", "card"),

  email: f("dr.saidane.ophtalmo@gmail.com", "card"),
} as const;

/* -------------------------------------------------------------------------- */
/* Cabinet                                                                     */
/* -------------------------------------------------------------------------- */

export const cabinet = {
  nameFr: f("Centre Médical BAYA", "card"),
  nameAr: f("المركز الطبي بية", "card"),

  /** Rendered as separate lines, exactly as the card sets them. */
  addressLinesFr: f(
    [
      "Bloc A — 2ème étage",
      "Cabinet A2-16",
      "Avenue 14 Janvier",
      "Mourouj 5, 2074",
      "Ben Arous, Tunisie",
    ],
    "card",
  ),
  addressLinesAr: f(
    [
      "عمارة «A» — الطابق الثاني",
      "العيادة A2-16",
      "نهج 14 جانفي",
      "المروج 5، 2074",
      "بن عروس، تونس",
    ],
    "card",
  ),

  /** The landmark locals actually navigate by. Printed on the card in both languages. */
  landmarkFr: f("Au-dessus de Carrefour Market", "card"),
  landmarkAr: f("فوق كارفور ماركت", "card"),

  /* Flat fields for structured data. */
  streetAddress: f("Centre Médical BAYA, Bloc A, Cabinet A2-16, Avenue 14 Janvier", "card"),
  locality: f("El Mourouj", "card"),
  region: f("Ben Arous", "medtn"),
  postalCode: f("2074", "card"),
  country: f("TN", "card"),

  /**
   * Approximate centre of El Mourouj 5 near Avenue 14 Janvier. Not surveyed:
   * good enough to place a map pin, and deliberately marked so nobody treats it
   * as a precise coordinate for the building.
   */
  geo: f({ lat: 36.7233, lng: 10.2286 }, "owner", "TO_CONFIRM", "Approximate; confirm against the map pin."),
} as const;

/* -------------------------------------------------------------------------- */
/* Hours                                                                       */
/* -------------------------------------------------------------------------- */

/** Med.tn lists 08:00-18:00 for Monday through Saturday, which confirms the brief. */
export const hours = {
  days: f(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], "medtn"),
  opens: f("08:00", "medtn"),
  closes: f("18:00", "medtn"),
} as const;

/* -------------------------------------------------------------------------- */
/* Booking                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * The Med.tn profile. Stored percent-encoded because the path segments are
 * Arabic: an unencoded IRI works in most browsers but breaks when the URL is
 * copied into structured data, a QR code or an email client.
 */
export const medtn = {
  url: f(
    "https://www.med.tn/%D8%B7%D8%A8%D9%8A%D8%A8/%D8%A7%D8%AE%D8%B5%D8%A7%D9%8A%D9%8A-%D8%B7%D8%A8-%D8%A7%D9%84%D8%B9%D9%8A%D9%88%D9%86/%D8%A8%D9%86-%D8%B9%D8%B1%D9%88%D8%B3/%D8%A7%D9%84%D8%AF%D9%83%D8%AA%D9%88%D8%B1%D8%A9-%D8%B1%D8%AD%D9%85%D8%A9-%D8%B3%D8%B9%D9%8A%D8%AF%D8%A7%D9%86-%D8%A8%D8%B1%D9%88%D9%82%D8%B9%D8%A9-227403.html",
    "owner",
  ),
  profileId: f("227403", "medtn"),
} as const;

/** Listed as an accepted insurer on the Med.tn profile. A real local trust signal. */
export const insurance = {
  cnam: f(true, "medtn"),
} as const;

/* -------------------------------------------------------------------------- */
/* Specialties                                                                 */
/* -------------------------------------------------------------------------- */

export interface Specialty {
  /** stable id: the i18n key, the anchor, and the future SEO page slug */
  id: string;
  icon: string;
  /**
   * The acts listed on the Med.tn profile that back this card. These are what
   * make the section factual rather than generic ophthalmology copy; they are
   * not all printed on the page, they are the evidence behind what is.
   */
  backedBy: string[];
}

export const specialties: Specialty[] = [
  {
    id: "consultation",
    icon: "Eye",
    backedBy: [
      "Ophtalmologie de l'adulte",
      "Ophtalmopédiatrie",
      "Mesure de la pression intraoculaire",
      "Fond d'oeil",
      "Oeil et diabète",
      "Oeil et nutrition",
      "Troubles de la vision",
    ],
  },
  {
    id: "cataracte",
    icon: "Aperture",
    backedBy: [
      "Cataracte premium",
      "Cataracte congénitale",
      "Cataracte traumatique",
      "Implants premium de chirurgie de cataracte",
      "Implants monofocaux et multifocaux",
      "Extraction du cristallin",
    ],
  },
  {
    id: "refractive",
    icon: "ScanEye",
    backedBy: [
      "Chirurgie réfractive par LASIK",
      "Chirurgie réfractive par PKR",
      "Correction réfractive (hypermétropie, myopie, astigmatisme) par laser SMILE",
      "Chirurgie réfractive par Femto-LASIK",
      "Chirurgie réfractive par implants intraoculaires",
      "Laser Argon",
      "YAG laser",
    ],
  },
  {
    id: "cornee",
    icon: "Layers",
    backedBy: [
      "Topographie et topo-tomographie cornéenne",
      "Kératocône",
      "Cross-linking cornéen (CXL)",
      "Pachymétrie",
      "Kératite",
      "Ptérygion",
      "Traitement de la sécheresse oculaire par lumière pulsée (IPL)",
    ],
  },
  {
    id: "retine-glaucome",
    icon: "Activity",
    backedBy: [
      "OCT et OCT-A",
      "OCT Swept Source",
      "Angiographie rétinienne numérique",
      "Rétinographie ultra grand champ",
      "DMLA (dégénérescence maculaire liée à l'âge)",
      "Rétinopathie diabétique",
      "Chirurgie du décollement de rétine",
      "Chirurgie vitréo-rétinienne",
      "Injections intravitréennes",
      "Champ visuel Humphrey",
      "Analyse de progression du glaucome par OCT et OCT-A",
      "Trabéculoplastie et iridotomie laser",
      "Pose de système de drainage (valve de Ahmed)",
    ],
  },
  {
    id: "pediatrie",
    icon: "Baby",
    backedBy: [
      "Ophtalmopédiatrie",
      "Maladies des yeux chez l'enfant",
      "Strabologie",
      "Chirurgie du strabisme",
      "Amblyopie",
      "Sondage des voies lacrymales",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Diagnostic examinations                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Framed throughout the site as "examens pratiqués" - procedures she performs,
 * which is what Med.tn attests - and never as equipment the cabinet owns, which
 * no source attests. Keep that distinction when editing the copy.
 */
export const examinations = [
  { id: "oct", backedBy: ["OCT", "OCT-A", "OCT Swept Source", "Tomographie par cohérence optique"] },
  { id: "topographie", backedBy: ["Topographie cornéenne", "Topo-tomographie cornéenne", "Pachymétrie"] },
  { id: "champ-visuel", backedBy: ["Champ visuel Humphrey", "Analyse de progression du glaucome par OCT et OCT-A"] },
  { id: "tension", backedBy: ["Mesure de la pression intraoculaire", "Courbe de tonus"] },
  { id: "echographie", backedBy: ["Echographie oculaire A et B", "UBM"] },
  { id: "fond-oeil", backedBy: ["Fond d'oeil par rétinographie", "Rétinographie ultra grand champ", "Angiographie rétinienne numérique"] },
] as const;

/** The five steps of the patient journey. Copy lives in the locale files. */
export const journeySteps = ["step1", "step2", "step3", "step4", "step5"] as const;

/* -------------------------------------------------------------------------- */
/* Audit helper                                                                */
/* -------------------------------------------------------------------------- */

/** Every fact above, flattened, so `docs/00-content-source.md` can be checked against reality. */
export const allFacts: Record<string, Fact<unknown>> = {
  ...Object.fromEntries(Object.entries(identity).map(([k, v]) => [`identity.${k}`, v])),
  ...Object.fromEntries(Object.entries(contact).map(([k, v]) => [`contact.${k}`, v])),
  ...Object.fromEntries(Object.entries(cabinet).map(([k, v]) => [`cabinet.${k}`, v])),
  ...Object.fromEntries(Object.entries(hours).map(([k, v]) => [`hours.${k}`, v])),
  ...Object.fromEntries(Object.entries(medtn).map(([k, v]) => [`medtn.${k}`, v])),
  ...Object.fromEntries(Object.entries(insurance).map(([k, v]) => [`insurance.${k}`, v])),
};

/** Anything still awaiting the owner's confirmation. Surfaced in docs, never on the page. */
export const unconfirmedFacts = Object.entries(allFacts)
  .filter(([, fact]) => fact.status === "TO_CONFIRM")
  .map(([key, fact]) => ({ key, ...fact }));
