import { HighRiskCategory, VerifiedEvidenceItem } from "./evidence-contract";

export interface DetectedClaim {
  text: string;
  category: HighRiskCategory;
  risk: "LOW" | "MEDIUM" | "HIGH";
  matchedRule: string;
  isSupported: boolean;
  evidenceId?: string;
  sourceTitle?: string;
  sourceUrl?: string;
  explanation: string;
  recommendedAction: "KEEP" | "REWRITE_SAFE" | "REMOVE" | "BLOCK";
}

// Deterministic Regular Expressions
export const REGEX_PATTERNS = {
  // Currency & Prices
  price: /(?:₹\s?\d[\d,.]*(?:\s*[–-]\s*₹?\s?\d[\d,.]*)?|\b(?:Rs\.?|INR|\$|USD)\s?\d[\d,.]*(?:\s*[–-]\s*(?:Rs\.?|INR|\$)?\s?\d[\d,.]*)?|\b\d[\d,.]*\s+rupees?\b|\b\d[\d,.]*\s+per\s+(?:room|visit|treatment|sq\s*ft)\b)/gi,
  
  // Percentages & Numerical statistics
  percentage: /\b\d+(?:\.\d+)?\s?%/g,
  
  // Temperatures
  temperature: /\b\d+(?:\.\d+)?\s?(?:°\s?[CF]|degrees?\s+(?:Celsius|Fahrenheit))\b/gi,
  
  // Durations & intervals
  duration: /\b(?:within\s+(?:a|one|\d+)\s+(?:week|month|day)s?|over\s+(?:a|one|\d+)\s+months?|\d+\s+(?:hours?|days?|weeks?|months?)\s+(?:treatment|eradication|results))\b/gi,
  
  // Number + Trend words (Fake statistics)
  statisticalTrend: /\b(?:\d+[\d,.]*%?|\d+)\s+(?:increase|decrease|rise|rising|fall|falling|growth|jump|surge)\s+(?:annually|per\s+year|year-over-year|in\s+cases)?\b|\b(?:reported\s+cases|cases\s+reported)\s+(?:rising|increasing|growing)\s+by\s+\d+[\d,.]*%?\b|\b\d+\s+out\s+of\s+\d+\s+(?:homes|cases|households)\b/gi,
  
  // Trigger source phrases
  sourceTriggers: /\b(?:According\s+to\s+(?:a\s+)?(?:study|research|experts?|guidelines?|data|the\s+government)|A\s+study\s+(?:by|found|published|conducted)|Research\s+(?:shows|indicates|by|conducted)|Studies\s+(?:indicate|have\s+shown|show)|Experts\s+(?:say|from|at)|Government\s+guidelines?\s+(?:state|show|recommend)|Data\s+shows\s+that|Reported\s+cases\s+show)\b/gi,
  
  // Named institutions & fake authorities
  namedEntities: /\b(?:ICMR|Indian\s+Council\s+of\s+Medical\s+Research|National\s+Institute\s+of\s+Pest\s+Management|Indian\s+Institute\s+of\s+Pest\s+Management|Ministry\s+of\s+Health|EPA|WHO|NPIC|Purdue|Virginia\s+Tech|Dr\.\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g,
  
  // Home remedies
  homeRemedies: /\b(?:neem(?:\s+oil)?|turmeric|baking\s+soda|essential\s+oils?|lavender(?:\s+oil)?|tea\s+tree(?:\s+oil)?|vinegar|camphor|kerosene|rubbing\s+alcohol|salt|diatomaceous\s+earth|steam\s+treatment|herbal\s+treatments?)\b/gi,
  
  // Home remedy efficacy claims (Efficacy vs neutral mention)
  homeRemedyEfficacy: /\b(?:neem|turmeric|baking\s+soda|lavender|tea\s+tree|essential\s+oils?|camphor|vinegar)\b[^.\n]{0,80}\b(?:kills?|disrupts?|eliminates?|repels?|destroys?|eradicates?|effective\s+against|cures?|prevents?)\b/gi,
  
  // Absolute guarantees & safety overclaims
  guarantees: /\b(?:100%\s+guaranteed|guarantee\s+(?:treatment|complete|results|eradication)|professionals?\s+(?:often\s+)?guarantee(?:\s+their\s+work)?|guarantees?\s+peace\s+of\s+mind|permanent\s+elimination|instant\s+kill|eliminates?\s+bed\s+bugs\s+in\s+one\s+(?:visit|day|treatment))\b/gi,
  
  // Hazardous practices
  hazardousDIY: /\b(?:mix(?:ing)?\s+(?:kerosene|pesticides?|chemicals?|bleach)|spray(?:ing)?\s+(?:kerosene|petrol|alcohol)\s+on\s+(?:mattress|bed|furniture)|unregistered\s+chemicals?|agricultural\s+pesticides?)\b/gi,
  
  // Generic filler intros
  genericIntros: /\b(?:Dealing\s+with\s+(?:bed\s+bugs|an\s+infestation)\s+can\s+be\s+(?:frustrating|stressful|challenging)|Understanding\s+your\s+options\s+is\s+(?:crucial|essential)|This\s+comprehensive\s+guide\s+(?:aims\s+to|will\s+walk\s+you)|Whether\s+you(?:'re|\s+are)\s+(?:dealing\s+with|facing)|In\s+today's\s+(?:world|fast-paced))\b/gi,
  
  // Forced climate localization
  forcedClimate: /\b(?:India(?:'s)?\s+(?:is\s+warm\s+and\s+humid|climate\s+makes|tropical\s+climate\s+is\s+ideal)|warm\s+and\s+humid\s+climate\s+of\s+India\s+makes\s+it\s+ideal)\b/gi
};

export function detectClaimsInText(
  text: string,
  evidencePool: VerifiedEvidenceItem[]
): DetectedClaim[] {
  const claims: DetectedClaim[] = [];

  // Helper to test if a claim matches verified evidence
  const checkSupport = (claimSnippet: string, category: HighRiskCategory) => {
    const snippetLower = claimSnippet.toLowerCase().trim();
    for (const item of evidencePool) {
      const claimLower = item.claim.toLowerCase();
      if (
        claimLower.includes(snippetLower) ||
        snippetLower.includes(claimLower) ||
        item.supportedExcerpts.some(
          (e) => e.toLowerCase().includes(snippetLower) || snippetLower.includes(e.toLowerCase())
        )
      ) {
        return { isSupported: true, item };
      }
    }
    return { isSupported: false };
  };

  // 1. Check Prices
  const priceMatches = text.match(REGEX_PATTERNS.price);
  if (priceMatches) {
    for (const p of priceMatches) {
      // Check if this is backed by an evidence item
      const support = checkSupport(p, "PRICE");
      claims.push({
        text: p,
        category: "PRICE",
        risk: "HIGH",
        matchedRule: "AUTOMATIC_NUMERIC_CLAIM_DETECTOR: PRICE",
        isSupported: support.isSupported,
        evidenceId: support.item?.id,
        sourceTitle: support.item?.sourceTitle,
        sourceUrl: support.item?.sourceUrl,
        explanation: support.isSupported
          ? "Supported by first-party pricing policy."
          : `Unsupported specific price "${p}" detected without verified first-party evidence.`,
        recommendedAction: support.isSupported ? "KEEP" : "REWRITE_SAFE"
      });
    }
  }

  // 2. Check Statistical Trends / Fake Stats
  const statMatches = text.match(REGEX_PATTERNS.statisticalTrend);
  if (statMatches) {
    for (const s of statMatches) {
      const support = checkSupport(s, "STATISTIC");
      claims.push({
        text: s,
        category: "STATISTIC",
        risk: "HIGH",
        matchedRule: "STOP_FAKE_STATISTICS: NUMBER_PLUS_TREND",
        isSupported: support.isSupported,
        evidenceId: support.item?.id,
        sourceTitle: support.item?.sourceTitle,
        sourceUrl: support.item?.sourceUrl,
        explanation: support.isSupported
          ? "Statistical trend supported by verified research."
          : `Unsupported statistical trend "${s}" detected without verified citation.`,
        recommendedAction: support.isSupported ? "KEEP" : "REMOVE"
      });
    }
  }

  // 3. Check Percentages
  const pctMatches = text.match(REGEX_PATTERNS.percentage);
  if (pctMatches) {
    for (const pct of pctMatches) {
      // Exclude already captured stat trends
      if (!statMatches?.some((sm) => sm.includes(pct))) {
        const support = checkSupport(pct, "PERCENTAGE");
        claims.push({
          text: pct,
          category: "PERCENTAGE",
          risk: "HIGH",
          matchedRule: "AUTOMATIC_NUMERIC_CLAIM_DETECTOR: PERCENTAGE",
          isSupported: support.isSupported,
          evidenceId: support.item?.id,
          sourceTitle: support.item?.sourceTitle,
          sourceUrl: support.item?.sourceUrl,
          explanation: support.isSupported
            ? "Percentage verified by scientific source."
            : `Specific percentage "${pct}" found without supporting verified evidence.`,
          recommendedAction: support.isSupported ? "KEEP" : "REMOVE"
        });
      }
    }
  }

  // 4. Check Temperature Claims
  const tempMatches = text.match(REGEX_PATTERNS.temperature);
  if (tempMatches) {
    for (const t of tempMatches) {
      const support = checkSupport(t, "TEMPERATURE");
      // Check if context contains duration & controlled penetration
      const isQualified =
        support.isSupported ||
        (text.toLowerCase().includes("duration") &&
          text.toLowerCase().includes("controlled") &&
          (t.includes("48") || t.includes("50") || t.includes("118") || t.includes("120") || t.includes("122")));
      claims.push({
        text: t,
        category: "TEMPERATURE",
        risk: "HIGH",
        matchedRule: "FIX_HEAT_CLAIMS: TEMPERATURE_THRESHOLD",
        isSupported: isQualified,
        evidenceId: support.item?.id || (isQualified ? "E004" : undefined),
        sourceTitle: support.item?.sourceTitle || "Purdue University Thermal Death Research",
        sourceUrl: support.item?.sourceUrl || "https://www.extension.purdue.edu/extmedia/E/E-249-W.pdf",
        explanation: isQualified
          ? "Qualified thermal death point with controlled conditions."
          : `Unqualified temperature threshold "${t}" without verified duration and penetration parameters.`,
        recommendedAction: isQualified ? "KEEP" : "REWRITE_SAFE"
      });
    }
  }

  // 5. Check Trigger Source Phrases (e.g. "According to a study by ICMR")
  const sourceMatches = text.match(REGEX_PATTERNS.sourceTriggers);
  if (sourceMatches) {
    for (const sm of sourceMatches) {
      const isSourceSupported = evidencePool.some(
        (e) =>
          text.toLowerCase().includes(e.sourceTitle.toLowerCase()) ||
          text.toLowerCase().includes(e.publisher.toLowerCase())
      );
      if (!isSourceSupported) {
        claims.push({
          text: sm,
          category: "STUDY",
          risk: "HIGH",
          matchedRule: "NEVER_LET_WRITER_INVENT_SOURCE: TRIGGER_PHRASE",
          isSupported: false,
          explanation: `Trigger phrase "${sm}" detected. All external studies must map to an immutable evidence ID.`,
          recommendedAction: "REMOVE"
        });
      }
    }
  }

  // 6. Check Named Entities (ICMR, National Institute of Pest Management, Dr. Arun Kumar, etc.)
  const entityMatches = text.match(REGEX_PATTERNS.namedEntities);
  if (entityMatches) {
    for (const ent of entityMatches) {
      // Check if entity is in verified evidence pool
      const isEntityVerified = evidencePool.some(
        (e) =>
          e.publisher.toLowerCase().includes(ent.toLowerCase()) ||
          e.sourceTitle.toLowerCase().includes(ent.toLowerCase())
      );
      if (!isEntityVerified) {
        claims.push({
          text: ent,
          category: "EXPERT",
          risk: "HIGH",
          matchedRule: "NAMED_ORGANIZATION_VALIDATION: UNVERIFIED_ENTITY",
          isSupported: false,
          explanation: `Named entity or expert "${ent}" was introduced by the writer and does not exist in verified research.`,
          recommendedAction: "REMOVE"
        });
      }
    }
  }

  // 7. Check Home Remedy Efficacy Claims
  const remedyEfficacyMatches = text.match(REGEX_PATTERNS.homeRemedyEfficacy);
  if (remedyEfficacyMatches) {
    for (const rem of remedyEfficacyMatches) {
      claims.push({
        text: rem,
        category: "HOME_REMEDY_EFFECTIVENESS",
        risk: "HIGH",
        matchedRule: "HOME_REMEDY_EVIDENCE_GATE: UNSUPPORTED_EFFICACY",
        isSupported: false,
        explanation: `Claim "${rem}" suggests home remedy efficacy without supporting scientific evidence.`,
        recommendedAction: "REWRITE_SAFE"
      });
    }
  }

  // 8. Check Guarantees & Unrealistic Durations
  const guaranteeMatches = text.match(REGEX_PATTERNS.guarantees);
  if (guaranteeMatches) {
    for (const g of guaranteeMatches) {
      claims.push({
        text: g,
        category: "GUARANTEE",
        risk: "HIGH",
        matchedRule: "PROFESSIONAL_TREATMENT_CLAIMS: UNVERIFIED_GUARANTEE",
        isSupported: false,
        explanation: `Unrealistic guarantee or single-visit claim "${g}" violates IPM standards.`,
        recommendedAction: "REWRITE_SAFE"
      });
    }
  }

  const durationMatches = text.match(REGEX_PATTERNS.duration);
  if (durationMatches) {
    for (const d of durationMatches) {
      claims.push({
        text: d,
        category: "DURATION",
        risk: "HIGH",
        matchedRule: "PROFESSIONAL_TREATMENT_CLAIMS: UNVERIFIED_DURATION",
        isSupported: false,
        explanation: `Arbitrary treatment duration "${d}" without verified protocol evidence.`,
        recommendedAction: "REWRITE_SAFE"
      });
    }
  }

  // 9. Check Hazardous DIY
  const hazardMatches = text.match(REGEX_PATTERNS.hazardousDIY);
  if (hazardMatches) {
    for (const h of hazardMatches) {
      claims.push({
        text: h,
        category: "SAFETY",
        risk: "HIGH",
        matchedRule: "TREATMENT_SAFETY_OVERRIDES_SEO: HAZARDOUS_DIY",
        isSupported: false,
        explanation: `Dangerous DIY practice "${h}" detected. Must be blocked immediately.`,
        recommendedAction: "BLOCK"
      });
    }
  }

  // 10. Check Forced Climate Localization
  const climateMatches = text.match(REGEX_PATTERNS.forcedClimate);
  if (climateMatches) {
    for (const c of climateMatches) {
      claims.push({
        text: c,
        category: "LOCAL_CLIMATE_CLAIM",
        risk: "MEDIUM",
        matchedRule: "FIX_INDIA_LOCALIZATION: FORCED_CLIMATE_CLAIM",
        isSupported: false,
        explanation: `Generic forced climate sentence "${c}" lacks specific entomological relevance.`,
        recommendedAction: "REMOVE"
      });
    }
  }

  return claims;
}

export function detectGenericIntro(introText: string): boolean {
  return REGEX_PATTERNS.genericIntros.test(introText);
}
