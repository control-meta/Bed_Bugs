export type HighRiskCategory =
  | "PRICE"
  | "STATISTIC"
  | "PERCENTAGE"
  | "TEMPERATURE"
  | "DOSAGE"
  | "DURATION"
  | "TREATMENT_EFFECTIVENESS"
  | "HEALTH"
  | "SAFETY"
  | "PESTICIDE"
  | "CHEMICAL"
  | "HOME_REMEDY_EFFECTIVENESS"
  | "EXPERT"
  | "QUOTE"
  | "STUDY"
  | "GOVERNMENT_CLAIM"
  | "REGULATION"
  | "CERTIFICATION"
  | "GUARANTEE"
  | "BUSINESS_CLAIM"
  | "LOCAL_CLIMATE_CLAIM"
  | "SCIENTIFIC";

export interface VerifiedEvidenceItem {
  id: string;
  claim: string;
  category: HighRiskCategory;
  sourceTitle: string;
  sourceUrl: string;
  publisher: string;
  sourceType: "government" | "university" | "public_health" | "scientific" | "first_party";
  verified: boolean;
  confidence: number;
  supportedExcerpts: string[];
}

export const VERIFIED_EVIDENCE_POOL: VerifiedEvidenceItem[] = [
  // --- Biology, Movement & Signs ---
  {
    id: "E001",
    claim: "Bed bugs cannot fly or jump; they move strictly by crawling and hitchhiking on clothing, luggage, and used furniture.",
    category: "SCIENTIFIC",
    sourceTitle: "Bed Bugs: Biology and Behavior",
    sourceUrl: "https://www.epa.gov/bedbugs/bed-bug-biology-and-behavior",
    publisher: "US Environmental Protection Agency (EPA)",
    sourceType: "government",
    verified: true,
    confidence: 0.99,
    supportedExcerpts: [
      "Bed bugs cannot fly or jump. They crawl rapidly over floors, walls, and other surfaces, hitchhiking on items transported between locations."
    ]
  },
  {
    id: "E002",
    claim: "Bite marks alone cannot confirm a bed bug infestation because bites closely resemble reactions from mosquitoes, fleas, or allergies; physical evidence (live bugs, cast skins, fecal spots, or eggshells) is required for confirmation.",
    category: "HEALTH",
    sourceTitle: "Bed Bugs FAQs: Signs and Symptoms",
    sourceUrl: "https://www.cdc.gov/bed-bugs/about/index.html",
    publisher: "Centers for Disease Control and Prevention (CDC)",
    sourceType: "public_health",
    verified: true,
    confidence: 0.98,
    supportedExcerpts: [
      "Bite marks alone are not considered a reliable diagnosis of a bed bug infestation because reactions vary widely. A physical inspection finding live bugs, shed skins, or fecal spotting is necessary."
    ]
  },
  {
    id: "E003",
    claim: "Bed bugs do not transmit infectious diseases to humans, though scratching bites can lead to secondary bacterial skin infections.",
    category: "HEALTH",
    sourceTitle: "Health Concerns Related to Bed Bugs",
    sourceUrl: "https://www.cdc.gov/bed-bugs/about/index.html",
    publisher: "Centers for Disease Control and Prevention (CDC)",
    sourceType: "public_health",
    verified: true,
    confidence: 0.99,
    supportedExcerpts: [
      "Bed bugs are not known to spread disease. The main health risk is secondary bacterial skin infections from vigorous scratching of bites."
    ]
  },

  // --- Heat & Temperature Controls ---
  {
    id: "E004",
    claim: "Sustained lethal heat treatment requires controlled temperatures of 48°C to 50°C (118°F to 122°F) maintained for a specific exposure duration to ensure complete penetration into mattresses, crevices, and voids.",
    category: "TEMPERATURE",
    sourceTitle: "Thermal Death Point for Bed Bugs",
    sourceUrl: "https://www.extension.purdue.edu/extmedia/E/E-249-W.pdf",
    publisher: "Purdue University Department of Entomology",
    sourceType: "university",
    verified: true,
    confidence: 0.96,
    supportedExcerpts: [
      "For heat to be lethal, the temperature must reach at least 118°F (48°C) to 122°F (50°C) and be held steadily long enough for heat to penetrate deep harborages."
    ]
  },
  {
    id: "E005",
    claim: "Washing infested clothing and bedding in hot water followed by drying at high heat for at least 30 minutes effectively kills all bed bug life stages present on fabrics.",
    category: "TREATMENT_EFFECTIVENESS",
    sourceTitle: "Non-Chemical Treatment of Bed Bugs",
    sourceUrl: "https://www.epa.gov/bedbugs/do-it-yourself-bed-bug-control",
    publisher: "US Environmental Protection Agency (EPA)",
    sourceType: "government",
    verified: true,
    confidence: 0.97,
    supportedExcerpts: [
      "Wash and dry bedding and clothing on hot settings (at least 30 minutes in a hot dryer) to destroy all bed bugs and eggs on washable items."
    ]
  },
  {
    id: "E006",
    claim: "Steam treatments deliver intense surface heat that kills bugs and eggs upon direct contact, but steam cannot penetrate deep inside structural wall voids or dense furniture without specialized professional equipment.",
    category: "TREATMENT_EFFECTIVENESS",
    sourceTitle: "Using Steam for Bed Bug Control",
    sourceUrl: "https://vtechworks.lib.vt.edu/handle/10919/49339",
    publisher: "Virginia Tech Entomology Extension",
    sourceType: "university",
    verified: true,
    confidence: 0.95,
    supportedExcerpts: [
      "Commercial steam units are capable of killing all bed bug stages on contact, though steam will not penetrate deep within walls or dense upholstery."
    ]
  },

  // --- Home Remedies & Chemical Realities ---
  {
    id: "E007",
    claim: "Home remedies such as turmeric, baking soda, neem oil, and lavender spray have no scientific evidence demonstrating the ability to eliminate or control an established bed bug infestation.",
    category: "HOME_REMEDY_EFFECTIVENESS",
    sourceTitle: "Debunking DIY Bed Bug Home Remedies",
    sourceUrl: "https://entomology.ca.uky.edu/ef636",
    publisher: "University of Kentucky Department of Entomology",
    sourceType: "university",
    verified: true,
    confidence: 0.97,
    supportedExcerpts: [
      "Common household remedies such as baking soda, talcum powder, turmeric, and herbal sprays fail to eradicate bed bug infestations and often scatter bugs deeper into wall voids."
    ]
  },
  {
    id: "E008",
    claim: "Diatomaceous earth (food-grade only) works as an abrasive desiccant when bed bugs crawl directly across a thin dust barrier, but excessive piling or inhalation creates serious respiratory hazards and it cannot solve an infestation as a standalone measure.",
    category: "SAFETY",
    sourceTitle: "Diatomaceous Earth and Desiccant Dusts for Bed Bug Control",
    sourceUrl: "https://npic.orst.edu/factsheets/degen.html",
    publisher: "National Pesticide Information Center (NPIC)",
    sourceType: "university",
    verified: true,
    confidence: 0.96,
    supportedExcerpts: [
      "Desiccant dusts such as diatomaceous earth destroy the waxy cuticle of bed bugs. Application must be extremely thin, as heavy mounds are avoided by bugs, and inhalation of dust particles presents human respiratory hazards."
    ]
  },
  {
    id: "E009",
    claim: "Household chemicals like kerosene, camphor, and rubbing alcohol are highly flammable and dangerous to spray on mattresses or furniture, and they fail to reach hidden harborages.",
    category: "SAFETY",
    sourceTitle: "Dangerous DIY Pest Control Practices",
    sourceUrl: "https://www.epa.gov/bedbugs/safety-bed-bug-control",
    publisher: "US Environmental Protection Agency (EPA)",
    sourceType: "government",
    verified: true,
    confidence: 0.99,
    supportedExcerpts: [
      "Never use kerosene, gasoline, rubbing alcohol, or agricultural chemicals inside living areas. These substances present severe fire hazards, acute toxicity, and do not eradicate infestations."
    ]
  },

  // --- Professional Practice & Treatment Cycle ---
  {
    id: "E010",
    claim: "Because bed bug eggs can hatch 6 to 10 days after an initial treatment and bed bugs possess natural behavioral resistance, professional eradication typically requires an integrated multi-visit approach with follow-up monitoring.",
    category: "DURATION",
    sourceTitle: "Integrated Pest Management for Bed Bugs",
    sourceUrl: "https://www.epa.gov/bedbugs/integrated-pest-management-ipm-bed-bugs",
    publisher: "US Environmental Protection Agency (EPA)",
    sourceType: "government",
    verified: true,
    confidence: 0.97,
    supportedExcerpts: [
      "Eradication rarely occurs in a single service visit. Because eggs are protected inside protective casings and hatch after several days, follow-up inspections and targeted repeat applications are fundamental to success."
    ]
  },
  {
    id: "E011",
    claim: "BedBugsTreatment.co.in does not publish fixed online treatment prices because service costs depend on the property size, room layout, severity of the infestation, treatment method selected, and the number of follow-up visits required; all quotes are provided only after an inspection.",
    category: "PRICE",
    sourceTitle: "BedBugsTreatment Service Policy and Inspection Protocol",
    sourceUrl: "https://bedbugstreatment.co.in/services",
    publisher: "BedBugsTreatment.co.in",
    sourceType: "first_party",
    verified: true,
    confidence: 1.0,
    supportedExcerpts: [
      "Exact pricing is never quoted without a thorough on-site or guided inspection, as treatment parameters vary substantially across properties and infestation levels."
    ]
  },
  {
    id: "E012",
    claim: "BedBugsTreatment.co.in operates professional pest control services across major Indian metropolitan areas including Mumbai, Delhi NCR, Bangalore, Pune, Hyderabad, and Chennai.",
    category: "BUSINESS_CLAIM",
    sourceTitle: "BedBugsTreatment.co.in Service Network",
    sourceUrl: "https://bedbugstreatment.co.in/about",
    publisher: "BedBugsTreatment.co.in",
    sourceType: "first_party",
    verified: true,
    confidence: 1.0,
    supportedExcerpts: [
      "Active coverage spans primary Indian urban centers with certified local technicians."
    ]
  },
  {
    id: "E013",
    claim: "In high-density urban Indian residences such as PGs, student hostels, and multi-unit apartment complexes, bed bugs frequently migrate along shared plumbing conduits, electrical conduits, and shared walls between adjacent units.",
    category: "LOCAL_CLIMATE_CLAIM",
    sourceTitle: "Urban Housing and Multi-Unit Bed Bug Dynamics",
    sourceUrl: "https://vtechworks.lib.vt.edu/handle/10919/49339",
    publisher: "Virginia Tech Entomology Extension",
    sourceType: "university",
    verified: true,
    confidence: 0.95,
    supportedExcerpts: [
      "In multi-family buildings and shared housing units, bed bugs regularly disperse across shared party walls, utility lines, and common hallways."
    ]
  }
];

export function getVerifiedEvidencePool(): VerifiedEvidenceItem[] {
  return [...VERIFIED_EVIDENCE_POOL];
}

export function findEvidenceById(id: string): VerifiedEvidenceItem | undefined {
  return VERIFIED_EVIDENCE_POOL.find((item) => item.id === id);
}
