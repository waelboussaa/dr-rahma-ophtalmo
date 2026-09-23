# Content sources

**This is a medical site. Nothing on it may be invented.**

Every factual claim traces to one of two sources. If a sentence cannot be traced
here, it does not go on the page. When adding copy, add its source to this file
in the same commit.

| Source | What it is |
|---|---|
| `card` | Dr Saidane's business card, `D:\WAEL\Projects\we work\227403_dr-rahma-saidane-bourogaa_1790086801.webp`. Also the only "clinic photo" on her Med.tn profile. |
| `medtn` | Med.tn profile **227403**, read 2026-09-22. |
| `owner` | Supplied directly by the site owner. |

Machine-readable equivalents live in `src/content/practice.ts`; every entry
there carries `source` and `status`, and `unconfirmedFacts` lists anything still
marked `TO_CONFIRM`.

---

## Identity — VERIFIED (card)

| Field | Value |
|---|---|
| Name (FR) | Dr Rahma Saidane Bourogaa |
| Name (AR) | الدكتورة رحمة سعيدان بورقعة |
| Title (FR) | Spécialiste en ophtalmologie, maladies et chirurgie des yeux, traitement au laser |
| Title (AR) | أخصائية في طب وجراحة العيون والعلاج بالليزر |

The card prints **"maladies et chirurgie des yeux"**. The original brief said
"chirurgie des yeux". The card is used, because it is her own wording and it is
what the Arabic on the reverse says (`طب وجراحة العيون`). Med.tn's
"التأهيل المهني" field agrees.

## Contact — VERIFIED (card)

| Field | Value |
|---|---|
| Phone | +216 92 21 21 25 |
| WhatsApp | +216 22 42 21 31 |
| Email | dr.saidane.ophtalmo@gmail.com |

The card groups the digits `92 21 21 25`; the brief wrote `92 212 125`. Same
number, different grouping. The card's grouping is used for display.

## Cabinet — VERIFIED (card)

Centre Médical BAYA · Bloc A, 2ème étage · Cabinet A2-16 · Avenue 14 Janvier ·
Mourouj 5, 2074 · Ben Arous, Tunisie · **au-dessus de Carrefour Market**.

Arabic taken verbatim from the reverse of the card, including
`فوق كارفور ماركت`.

The landmark is given the same weight as the street address on the page,
because it is how people in El Mourouj actually navigate to the building.

## Opening hours — VERIFIED (medtn)

Monday to Saturday, 08:00 – 18:00. Med.tn lists all six days identically, which
independently confirms what the owner supplied.

## Insurance — VERIFIED (medtn)

CNAM appears under "التأمين على العرض" on the profile. Stated on the page as
"Cabinet conventionné CNAM" / "عيادة متعاقدة مع الكنام".

It is deliberately **not** forced into the JSON-LD: schema.org has no accurate
field for a Tunisian national insurance convention, and inventing one would
publish a claim in a shape no consumer can interpret.

## Geolocation — TO_CONFIRM (owner)

`36.7233, 10.2286` — approximate centre of El Mourouj 5 near Avenue 14 Janvier.
Good enough for a map pin; **not** surveyed. It appears only in `geo` inside the
JSON-LD, never as a displayed coordinate. Replace it with the real pin from
Google Maps when convenient.

## Booking — VERIFIED (owner + medtn)

The Med.tn profile URL, stored percent-encoded in `practice.ts` because its path
segments are Arabic. Decoded, it is exactly the URL the owner supplied, ending
`...-227403.html`.

---

## Specialties

The six cards that ship are backed by acts listed under "العلاج" on the Med.tn profile.
The full backing list for each card is in `specialties[].backedBy` in
`src/content/practice.ts`. The card copy itself is patient-facing paraphrase,
not a claim of anything beyond those listed acts.

| Card | Representative backing acts (medtn) |
|---|---|
| Consultation & diagnostic | Ophtalmologie de l'adulte, Ophtalmopédiatrie, mesure de la pression intraoculaire, fond d'œil, œil et diabète |
| Cataracte | Cataracte premium / congénitale / traumatique, implants mono- et multifocaux |
| Chirurgie réfractive & laser | LASIK, Femto-LASIK, PKR, SMILE, implants intraoculaires, laser Argon, YAG |
| Cornée | Topo-tomographie cornéenne, kératocône, CXL, pachymétrie, kératite, ptérygion, IPL |
| Rétine & glaucome | OCT / OCT-A, angiographie, DMLA, rétinopathie diabétique, décollement de rétine, champ visuel Humphrey, valve d'Ahmed |
| Ophtalmologie pédiatrique | Ophtalmopédiatrie, strabologie, chirurgie du strabisme, amblyopie, sondage des voies lacrymales |
| ~~Paupières & voies lacrymales~~ | Blépharoplastie médicale et chirurgicale, ptosis, esthétique palpébrale, tumeurs de l'orbite, DCR — **REMOVED from the page** at the owner's request; sourced and accurate, kept here in case it returns |

A seventh card, **Paupières & voies lacrymales**, was built and then removed at
the owner's request. It was not in the original brief; it was added because the
profile lists substantial eyelid and lacrimal work. Removing it hides a real,
sourced competency rather than correcting an error, which is why the acts stay
recorded above. Six specialties ship.

## Examinations

Framed throughout as **"examens pratiqués"** — procedures she is listed as
performing. **Never** as equipment the cabinet owns, which no source attests.
A patient who arrives expecting a particular machine in the room must not have
been told so by this page. Keep that framing when editing `exam.*` strings.

All six are listed acts on the profile: OCT / OCT-A / OCT Swept Source,
topographie and topo-tomographie cornéenne, champ visuel Humphrey, mesure de la
pression intraoculaire and courbe de tonus, échographie oculaire A/B and UBM,
fond d'œil par rétinographie and rétinographie ultra grand champ.

---

## Never written, because nothing attests them

Diplomas · university · years of experience · certifications · awards · hospital
affiliations · learned societies · patient reviews · patient statistics ·
success rates · equipment owned by the cabinet · medical outcomes.

No superlatives or guarantees: "meilleur ophtalmologue", "n°1", "100 % sûr",
"résultats garantis", "guérison définitive".

The large line in the About section is set as **site copy, not a quotation** —
no quote marks, no attribution. Dr Saidane has not given this site a statement,
and typesetting an invented sentence as something she said would be fabricating
a credential.

---

## Claims removed on 2026-09-23

A later build added sections (stats band, symptom guide, FAQ, visit prep, a
WhatsApp card) whose copy broke the rules above. None of it was sourced. It was
rewritten or removed, in both languages - the Arabic was consistently stronger
than the French, so check both whenever copy changes:

| Removed | Why |
|---|---|
| "100 %" stat; "L'excellence…"; AR "التميز", "أعلى المعايير", "أفضل رعاية" | invented metric, superlatives |
| "indolore" / "sans douleur" / AR "دون ألم", "غير مؤلم" on surgery, injections and every exam card | guarantees about a patient's experience |
| AR "لضمان التعافي التام" (to guarantee full recovery); "préserver durablement"; "stabiliser efficacement"; AR "يضمن علاجاً ناجحاً بنسبة ممتازة" | guaranteed outcomes and an implied success rate |
| "Réalisé au cabinet… avec des équipements de haute précision"; AR "بأحدث الأجهزة"; "implant de dernière génération"; "haute précision"; AR "أحدث تقنيات" | equipment and technology the cabinet is not attested to own |
| AR "إجراء… آمن داخل العيادة" for injections | unverified location and safety claim |
| "secrétariat médical", "réponse rapide", "24h/24" | unverified staffing and response promises |
| "retirez vos lentilles 48h avant", "dépistage à 9 mois puis à 3 ans", "2 à 4 heures" | clinical instructions she has not given; replaced with "the cabinet will tell you" |
| "Examen diagnostique recommandé" | a website recommending an exam from a self-selected symptom |

**Urgent symptoms.** The symptom guide listed flashes of light and a sudden
dark spot as ordinary symptoms ending in "book on Med.tn". Flashes, a shower of
floaters or a spreading curtain can mean a retinal tear or detachment. They now
sit in a separate callout that says to call the cabinet the same day, or go to
emergency services / call 190 out of hours - the same number the Contact
section already gives. Keep any future symptom content out of routine booking
when it describes an emergency.

## Re-checking Med.tn

The live profile sits behind Cloudflare bot protection and cannot be fetched
programmatically. The data above was read from a screenshot supplied by the
owner on 2026-09-22. To refresh it: open the profile in a normal browser,
screenshot the "العلاج", "أوقات العمل" and "التأمين على العرض" blocks, and
update `src/content/practice.ts` plus this file together.
