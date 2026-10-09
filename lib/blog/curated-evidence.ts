import type { VerifiedFact } from "./schemas";

// Stable bed bug facts checked against the linked CDC and EPA pages on 2026-10-09.
// This snapshot avoids a paid web-search call for every article. Recheck the
// source pages when editing these claims; never use it for current prices,
// local regulations, service availability, or statistics.
const ACCESSED_DATE = "2026-10-09";
const SOURCES = {
  cdc: {
    sourceTitle: "About Bed Bugs",
    sourceUrl: "https://www.cdc.gov/bed-bugs/about/index.html",
    publisher: "Centers for Disease Control and Prevention",
    sourceType: "public_health" as const,
  },
  ipm: {
    sourceTitle: "Controlling Bed Bugs Using Integrated Pest Management (IPM)",
    sourceUrl: "https://www.epa.gov/bedbugs/controlling-bed-bugs-using-integrated-pest-management-ipm",
    publisher: "US Environmental Protection Agency",
    sourceType: "government" as const,
  },
  hiring: {
    sourceTitle: "Hiring a Pest Management Professional for Bed Bugs",
    sourceUrl: "https://www.epa.gov/bedbugs/hiring-pest-management-professional-bed-bugs",
    publisher: "US Environmental Protection Agency",
    sourceType: "government" as const,
  },
  safety: {
    sourceTitle: "Safety Issues in Controlling Bed Bugs",
    sourceUrl: "https://www.epa.gov/bedbugs/safety-issues-controlling-bed-bugs",
    publisher: "US Environmental Protection Agency",
    sourceType: "government" as const,
  },
  legal: {
    sourceTitle: "Stay Legal and Safe in Treating for Bed Bugs",
    sourceUrl: "https://www.epa.gov/bedbugs/stay-legal-and-safe-treating-bed-bugs",
    publisher: "US Environmental Protection Agency",
    sourceType: "government" as const,
  },
};

const FACTS: Array<{
  id: string;
  source: keyof typeof SOURCES;
  category: VerifiedFact["category"];
  claim: string;
  evidenceExcerpt: string;
  topics: string[];
}> = [
  {
    id: "C01", source: "cdc", category: "VERIFIABLE_FACT",
    claim: "Bed bugs can occur in clean as well as untidy places; cleanliness does not determine whether they are present.",
    evidenceExcerpt: "How clean a place is",
    topics: ["sign", "identify", "inspection", "hygiene"],
  },
  {
    id: "C02", source: "cdc", category: "HEALTH_CLAIM",
    claim: "Bed bug bites can resemble mosquito or flea bites, so bites alone are not a reliable way to identify an infestation.",
    evidenceExcerpt: "similar to mosquito or flea bites",
    topics: ["bite", "identify", "inspection", "symptom"],
  },
  {
    id: "C03", source: "cdc", category: "VERIFIABLE_FACT",
    claim: "Useful physical signs include shed exoskeletons, bed bugs in mattress folds, and rusty-colored spots on nearby furniture.",
    evidenceExcerpt: "Rusty–colored blood spots",
    topics: ["sign", "identify", "inspection", "mattress"],
  },
  {
    id: "C04", source: "cdc", category: "HEALTH_CLAIM",
    claim: "Bed bugs are not known to spread diseases to people, though bites can cause itching and disturbed sleep.",
    evidenceExcerpt: "not known to spread diseases",
    topics: ["bite", "health", "disease", "symptom"],
  },
  {
    id: "C05", source: "cdc", category: "VERIFIABLE_FACT",
    claim: "Bed bugs can be transported in seams and folds of luggage, clothing, bedding, and furniture.",
    evidenceExcerpt: "seams and folds of luggage",
    topics: ["spread", "travel", "luggage", "prevention"],
  },
  {
    id: "C06", source: "ipm", category: "SCIENTIFIC_CLAIM",
    claim: "Integrated bed bug management can combine non-chemical methods with carefully chosen chemical methods rather than relying on one tactic.",
    evidenceExcerpt: "non-chemical and chemical methods",
    topics: ["treatment", "control", "method", "professional", "affordable", "cost"],
  },
  {
    id: "C07", source: "ipm", category: "SAFETY_CLAIM",
    claim: "A high-temperature clothes dryer run for 30 minutes can kill bed bugs on suitable bedding and clothing; washing alone may not.",
    evidenceExcerpt: "dryer at high temperatures for 30 minutes",
    topics: ["laundry", "dry", "preparation", "treatment", "affordable"],
  },
  {
    id: "C08", source: "ipm", category: "VERIFIABLE_FACT",
    claim: "Mattress encasements and bed bug interceptors can help with trapping or monitoring bed bugs.",
    evidenceExcerpt: "bed bug interceptors",
    topics: ["monitor", "mattress", "prevention", "inspection"],
  },
  {
    id: "C09", source: "hiring", category: "VERIFIABLE_FACT",
    claim: "Bed bug control may require multiple professional visits; very few infestations are controlled with one treatment.",
    evidenceExcerpt: "few infestations are controlled with only one treatment",
    topics: ["professional", "treatment", "follow-up", "cost", "affordable"],
  },
  {
    id: "C10", source: "hiring", category: "VERIFIABLE_FACT",
    claim: "When choosing a bed bug professional, check their experience and credentials and ask how monitoring will be handled.",
    evidenceExcerpt: "Check the company’s credentials.",
    topics: ["professional", "service", "cost", "affordable", "quote"],
  },
  {
    id: "C11", source: "hiring", category: "PRICE_CLAIM",
    claim: "Professional bed bug treatment can be expensive, so comparing providers for the right fit is useful; this source gives no local price figure.",
    evidenceExcerpt: "professionals can be expensive",
    topics: ["price", "cost", "affordable", "quote", "budget"],
  },
  {
    id: "C12", source: "safety", category: "SAFETY_CLAIM",
    claim: "Heat treatment can control bed bugs, but it leaves no residual protection, so preventing reintroduction matters.",
    evidenceExcerpt: "heat treatments have no residual effects",
    topics: ["heat", "treatment", "prevention", "professional"],
  },
  {
    id: "C13", source: "legal", category: "SAFETY_CLAIM",
    claim: "Rubbing alcohol is flammable and has caused house fires when people used it against bed bugs.",
    evidenceExcerpt: "is flammable and has caused numerous house fires",
    topics: ["safety", "diy", "home remedy", "alcohol", "affordable"],
  },
];

export function selectCuratedEvidence(topic: string): VerifiedFact[] {
  const normalizedTopic = topic.toLowerCase();
  const essentials = new Set(["C01", "C06", "C09"]);
  const selected = FACTS
    .map((fact, index) => ({
      fact,
      index,
      score: (essentials.has(fact.id) ? 5 : 0) + fact.topics.filter((word) => normalizedTopic.includes(word)).length * 3,
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 10)
    .map(({ fact }) => ({
      id: fact.id,
      claim: fact.claim,
      category: fact.category,
      ...SOURCES[fact.source],
      publicationDate: null,
      accessedDate: ACCESSED_DATE,
      confidence: 0.95,
      evidenceExcerpt: fact.evidenceExcerpt,
      verification: {
        discoveredByWebSearch: false,
        urlAccessible: true,
        titleMatched: true,
        excerptMatched: true,
      },
    }));
  return selected;
}

/** Accept narrow paraphrases of the curated claims that a word-overlap score misses. */
export function supportsCuratedParaphrase(claim: string, source: VerifiedFact): boolean {
  if (/\b(?:guarantee\w*|eradicat\w*|eliminat\w*|completely|always)\b/i.test(claim)) return false;
  switch (source.id) {
    case "C02":
      return /\bbites?\b/i.test(claim) && /\b(?:mosquito|flea)\b/i.test(claim) && /\b(?:similar|resembl\w*|look)\b/i.test(claim);
    case "C13":
      return /\balcohol\b/i.test(claim) && /\b(?:flammab\w*|fires?)\b/i.test(claim) &&
        !/\b(?:safe|harmless)\b/i.test(claim.replace(/\bnot\s+(?:a\s+)?safe\b/gi, ""));
    case "C06":
      return /\b(?:integrated|IPM)\b/i.test(claim) && /\bchemical\b/i.test(claim) && /\bnon[- ]?chemical\b/i.test(claim);
    default:
      return false;
  }
}
