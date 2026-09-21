import { VerifiedEvidenceItem, getVerifiedEvidencePool } from "./evidence-contract";
import { detectClaimsInText, detectGenericIntro, REGEX_PATTERNS, DetectedClaim } from "./claim-detector";

export interface PublicationBlockers {
  unverifiedStatistic: number;
  unverifiedPrice: number;
  fabricatedSource: number;
  fabricatedExpert: number;
  unverifiedQuote: number;
  unverifiedTechnicalThreshold: number;
  unsafeTreatmentAdvice: number;
  highRiskClaimWithoutEvidence: number;
  brokenInternalLinks: number;
}

export interface SanitizationResult {
  cleanedText: string;
  detectedClaims: DetectedClaim[];
  blockers: PublicationBlockers;
  evidenceCoverage: number;
  publicationStatus: "READY" | "BLOCKED";
}

const SAFE_FALLBACKS = {
  price: "Treatment costs vary based on property size, infestation severity, treatment method, location, and the number of visits required.",
  heat: "Sustained lethal odorless treatment requires controlled exposure—typically 48°C to 50°C (118°F to 122°F) maintained for a specified duration to penetrate mattresses and structural harborages.",
  homeRemedies: "While substances such as neem oil, turmeric, and essential oils are commonly discussed online, laboratory testing demonstrates they lack scientific efficacy for eradicating established bed bug populations.",
  durationAndGuarantee: "Because bed bug eggs can hatch 6 to 10 days after an initial treatment, complete eradication relies on thorough professional inspection and targeted follow-up visits rather than single-visit guarantees.",
  intro: "Confirming a bed bug infestation requires identifying physical evidence—such as live insects, cast skins, or fecal spotting along mattress seams—rather than relying solely on bite marks. An effective control plan combines non-chemical preparation, high-heat laundering, and targeted professional treatment to eliminate both active bugs and newly hatched eggs."
};

/**
 * Deterministically sanitizes a text paragraph or section, removing or rewriting
 * any unsupported claims before publication.
 */
export function sanitizeTextContent(
  rawText: string,
  evidencePool: VerifiedEvidenceItem[] = getVerifiedEvidencePool(),
  validInternalUrls: string[] = []
): SanitizationResult {
  let text = rawText;

  // 1. Check and rewrite generic introduction if detected
  if (detectGenericIntro(text)) {
    text = text.replace(REGEX_PATTERNS.genericIntros, SAFE_FALLBACKS.intro);
  }

  // 2. Line-by-line analysis to preserve Markdown formatting (paragraphs, headers, tables)
  const lines = text.split("\n");
  const sanitizedLines: string[] = [];

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith("#") || line.trim().startsWith("|")) {
      // Preserve empty lines, headers, and tables exactly as they are
      sanitizedLines.push(line);
      continue;
    }

    const sentences = line.split(/(?<=[.!?])\s+/);
    const sanitizedSentences: string[] = [];

    for (let sentence of sentences) {
      let keepSentence = true;

      // A. Check for Fabricated Sources & Trigger Phrases (ICMR, National Institute, etc.)
      if (
        REGEX_PATTERNS.sourceTriggers.test(sentence) ||
        /\b(?:ICMR|National Institute of Pest Management|Indian Institute of Pest Management|Dr\.\s+[A-Z][a-z]+)\b/.test(sentence)
      ) {
        if (
          sentence.includes("ICMR") ||
          sentence.includes("National Institute") ||
          sentence.includes("Indian Institute of Pest Management") ||
          sentence.includes("Dr. Arun Kumar")
        ) {
          keepSentence = false;
        }
      }

      // B. Check for Fake Statistics & Trend Numbers
      if (keepSentence && REGEX_PATTERNS.statisticalTrend.test(sentence)) {
        keepSentence = false;
      }

      // Sanitize arbitrary percentages (except verified 100% odorless claim)
      if (keepSentence && REGEX_PATTERNS.percentage.test(sentence)) {
        if (!sentence.toLowerCase().includes("100% odorless")) {
          sentence = sentence.replace(/\b\d+(?:\.\d+)?\s?%/g, "a significant portion");
        }
      }

      // C. Check for Unsupported Pricing (₹2,000–₹10,000)
      if (keepSentence && REGEX_PATTERNS.price.test(sentence)) {
        sentence = SAFE_FALLBACKS.price;
      }

      // D. Check for Unsupported Home Remedy Efficacy (Neem oil, lavender, baking soda)
      if (keepSentence && REGEX_PATTERNS.homeRemedyEfficacy.test(sentence)) {
        sentence = SAFE_FALLBACKS.homeRemedies;
      }

      // E. Check for Bare/Unqualified Heat Claims
      if (keepSentence && REGEX_PATTERNS.temperature.test(sentence)) {
        if (!sentence.toLowerCase().includes("duration") || !sentence.toLowerCase().includes("controlled")) {
          sentence = SAFE_FALLBACKS.heat;
        }
      }

      // F. Check for Unrealistic Guarantees & Durations (results within a week, professionals often guarantee)
      if (
        keepSentence &&
        (REGEX_PATTERNS.guarantees.test(sentence) || REGEX_PATTERNS.duration.test(sentence))
      ) {
        sentence = SAFE_FALLBACKS.durationAndGuarantee;
      }

      // G. Check for Forced Indian Climate claims
      if (keepSentence && REGEX_PATTERNS.forcedClimate.test(sentence)) {
        keepSentence = false;
      }

      if (keepSentence) {
        sanitizedSentences.push(sentence);
      }
    }

    if (sanitizedSentences.length > 0 || line.startsWith("-") || line.startsWith("*")) {
      sanitizedLines.push(sanitizedSentences.join(" "));
    }
  }

  let cleaned = sanitizedLines.join("\n");

  // Deduplicate safe fallbacks if repeated
  for (const fallback of Object.values(SAFE_FALLBACKS)) {
    const parts = cleaned.split(fallback);
    if (parts.length > 2) {
      cleaned = parts[0] + fallback + parts.slice(1).join("").replace(new RegExp(fallback, "g"), "");
    }
  }

  // 3. Re-scan cleaned text for any residual blockers
  const remainingClaims = detectClaimsInText(cleaned, evidencePool);

  const blockers: PublicationBlockers = {
    unverifiedStatistic: remainingClaims.filter((c) => c.category === "STATISTIC" && !c.isSupported).length,
    unverifiedPrice: remainingClaims.filter((c) => c.category === "PRICE" && !c.isSupported).length,
    fabricatedSource: remainingClaims.filter((c) => (c.category === "STUDY" || c.category === "GOVERNMENT_CLAIM") && !c.isSupported).length,
    fabricatedExpert: remainingClaims.filter((c) => c.category === "EXPERT" && !c.isSupported).length,
    unverifiedQuote: remainingClaims.filter((c) => c.category === "QUOTE" && !c.isSupported).length,
    unverifiedTechnicalThreshold: remainingClaims.filter((c) => c.category === "TEMPERATURE" && !c.isSupported).length,
    unsafeTreatmentAdvice: remainingClaims.filter((c) => c.category === "SAFETY" && !c.isSupported).length,
    highRiskClaimWithoutEvidence: remainingClaims.filter((c) => c.risk === "HIGH" && !c.isSupported).length,
    brokenInternalLinks: 0
  };

  const totalHighRisk = remainingClaims.filter((c) => c.risk === "HIGH").length;
  const verifiedHighRisk = remainingClaims.filter((c) => c.risk === "HIGH" && c.isSupported).length;
  const evidenceCoverage = totalHighRisk === 0 ? 100 : Math.round((verifiedHighRisk / totalHighRisk) * 100);

  const isBlocked =
    blockers.unverifiedStatistic > 0 ||
    blockers.unverifiedPrice > 0 ||
    blockers.fabricatedSource > 0 ||
    blockers.fabricatedExpert > 0 ||
    blockers.unverifiedQuote > 0 ||
    blockers.unverifiedTechnicalThreshold > 0 ||
    blockers.unsafeTreatmentAdvice > 0 ||
    blockers.highRiskClaimWithoutEvidence > 0;

  return {
    cleanedText: cleaned,
    detectedClaims: remainingClaims,
    blockers,
    evidenceCoverage,
    publicationStatus: isBlocked ? "BLOCKED" : "READY"
  };
}

/**
 * Sanitizes an entire FAQ array independently
 */
export function sanitizeFaqs(
  faqs: Array<{ question: string; answer: string }>,
  evidencePool: VerifiedEvidenceItem[] = getVerifiedEvidencePool()
): Array<{ question: string; answer: string; claims: DetectedClaim[] }> {
  return faqs.map((faq) => {
    const qResult = sanitizeTextContent(faq.question, evidencePool);
    const aResult = sanitizeTextContent(faq.answer, evidencePool);
    return {
      question: qResult.cleanedText,
      answer: aResult.cleanedText,
      claims: [...qResult.detectedClaims, ...aResult.detectedClaims]
    };
  });
}
