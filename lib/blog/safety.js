const GENERIC_PHRASES = [
  "comprehensive guide aims to",
  "crucial to understand",
  "it is important to note",
  "in today's world",
  "when it comes to",
  "look no further",
  "peace of mind",
  "highly effective",
  "comprehensive solution",
  "lasting solution",
];

const STOP_WORDS = new Set([
  "about", "after", "again", "also", "and", "are", "based", "been", "before",
  "being", "between", "can", "does", "for", "from", "have", "into", "its", "may",
  "more", "must", "not", "only", "other", "should", "such", "than", "that", "the",
  "their", "these", "they", "this", "those", "through", "under", "use", "using",
  "very", "what", "when", "where", "which", "will", "with", "your",
]);

function normalizeUrl(value) {
  try {
    const url = new URL(value);
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith("utm_") || ["gclid", "fbclid"].includes(key)) {
        url.searchParams.delete(key);
      }
    }
    url.pathname = url.pathname.replace(/\/$/, "") || "/";
    return url.toString();
  } catch {
    return value.trim().replace(/\/$/, "");
  }
}

function tokens(value) {
  return new Set(
    String(value)
      .toLowerCase()
      .replace(/https?:\/\/\S+/g, " ")
      .replace(/[^a-z0-9₹%°]+/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word)),
  );
}

function similarity(left, right) {
  const a = tokens(left);
  const b = tokens(right);
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter((token) => b.has(token)).length;
  return intersection / (a.size + b.size - intersection);
}

function supportSimilarity(left, right) {
  const a = tokens(left);
  const b = tokens(right);
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter((token) => b.has(token)).length;
  return intersection / Math.min(a.size, b.size);
}

function excerptAround(text, index, length = 220) {
  const lineStart = Math.max(text.lastIndexOf("\n", index), text.lastIndexOf(".", index)) + 1;
  const nextLine = text.indexOf("\n", index + 1);
  const nextPeriod = text.indexOf(".", index + 1);
  const candidates = [nextLine, nextPeriod].filter((value) => value >= 0);
  const end = candidates.length ? Math.min(...candidates) + 1 : Math.min(text.length, index + length);
  return text.slice(lineStart, end).trim().slice(0, length);
}

function extractUrls(markdown) {
  const urls = new Set();
  const matcher = /https?:\/\/[^\s)>\]}"']+/gi;
  for (const match of markdown.matchAll(matcher)) {
    urls.add(match[0].replace(/[.,;:]+$/, ""));
  }
  return [...urls];
}

function hasSupportingEvidence(excerpt, facts) {
  const excerptUrls = extractUrls(excerpt).map(normalizeUrl);
  return facts.some((fact) => {
    const sourceUrl = normalizeUrl(fact.sourceUrl);
    if (excerptUrls.includes(sourceUrl)) return true;
    return supportSimilarity(excerpt, fact.claim) >= 0.65;
  });
}

function scanHallucinations(markdown, facts = [], allowedInternalUrls = []) {
  const warnings = [];
  const addMatches = (regex, code, message, risk = "HIGH", requireEvidence = true) => {
    for (const match of markdown.matchAll(regex)) {
      const evidenceContext = excerptAround(markdown, match.index || 0, 800);
      if (!requireEvidence || !hasSupportingEvidence(evidenceContext, facts)) {
        warnings.push({ code, message, risk, excerpt: evidenceContext.slice(0, 220) });
      }
    }
  };

  addMatches(
    /(?:₹\s?\d[\d,.]*(?:\s*[–-]\s*₹?\s?\d[\d,.]*)?|\b(?:Rs\.?|INR)\s?\d[\d,.]*(?:\s*[–-]\s*(?:Rs\.?|INR)?\s?\d[\d,.]*)?|\b\d[\d,.]*\s+rupees?\b|\b\d[\d,.]*\s+per\s+(?:room|visit|treatment)\b)/gi,
    "UNVERIFIED_PRICE",
    "A precise price appears without matching verified evidence.",
  );
  addMatches(
    /\b\d+(?:\.\d+)?\s?(?:°\s?[CF]|degrees?\s+(?:Celsius|Fahrenheit)|hours?|minutes?|days?|visits?|%|percent)\b/gi,
    "UNVERIFIED_TECHNICAL_CLAIM",
    "A technical number, duration, percentage, or treatment interval is not supported by verified evidence.",
  );
  addMatches(
    /\b(?:Dr\.?|Professor|Prof\.?)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+|\b(?:an?|the)\s+(?:entomologist|researcher|scientist|expert)\s+(?:at|from)\s+[A-Z][^\n,.]{3,80}|\b(?:says|said|emphasizes|explains),?\s*[“\"]/g,
    "UNVERIFIED_EXPERT",
    "A named expert, credential, affiliation, or quotation lacks matching verified evidence.",
  );
  addMatches(
    /\b(?:government[- ]approved|government guidelines?|certified (?:solution|treatment|technician)|licensed by|regulations? require|Ministry of [A-Z][A-Za-z ]+)\b/gi,
    "UNVERIFIED_SOURCE",
    "A government, regulatory, or certification claim lacks matching verified evidence.",
  );
  addMatches(
    /\b(?:regulated by|approved by|registered with)\s+(?:the\s+)?[A-Z][A-Za-z&.() -]{2,100}/g,
    "UNVERIFIED_SOURCE",
    "A regulatory or approval claim lacks matching verified evidence.",
  );
  addMatches(
    /\b(?:kill(?:s|ed|ing)?|eliminat(?:e|es|ed|ing|ion)|eradicat(?:e|es|ed|ing|ion)|repel(?:s|led|ling)?|dehydrat(?:e|es|ed|ing)|insecticidal)\b[^.\n]{0,140}\b(?:bed bugs?|infestation|insects?)\b|\b(?:bed bugs?|infestation|insects?)\b[^.\n]{0,140}\b(?:kill(?:s|ed|ing)?|eliminat(?:e|es|ed|ing|ion)|eradicat(?:e|es|ed|ing|ion)|repel(?:s|led|ling)?|dehydrat(?:e|es|ed|ing)|insecticidal)\b|\b(?:heat|steam|chemical|insecticide|laundering|essential oils?|diatomaceous earth|vacuuming)\b[^.\n]{0,100}\beffective(?:ness)?\b/gi,
    "UNVERIFIED_TECHNICAL_CLAIM",
    "A treatment efficacy or biological-effect claim lacks matching verified evidence.",
  );
  addMatches(
    /\b(?:safe for (?:children|kids|pets|pregnant|elderly)|non[- ]toxic|low[- ]toxicity|no health risk|harmless|causes? (?:infection|disease|allergy)|(?:do not|don't|cannot|can) transmit diseases?|bites? can cause (?:itching|infection|allerg(?:y|ies|ic)))\b/gi,
    "UNVERIFIED_TECHNICAL_CLAIM",
    "A health or safety claim lacks matching verified evidence.",
  );
  addMatches(
    /\b(?:\d+[+-]?\s+years? (?:of )?experience|\d[\d,]+[+-]?\s+(?:homes|customers|properties) (?:served|treated)|\d+[- ]month warranty|award[- ]winning)\b/gi,
    "UNVERIFIED_SOURCE",
    "A business experience, warranty, volume, or award claim lacks matching verified first-party evidence.",
  );
  addMatches(
    /\b(?:journal|study|research paper|guidelines?|publication)\b[^\n]{0,100}\b(?:19|20)\d{2}\b/gi,
    "UNVERIFIED_SOURCE",
    "A publication or reference-like claim lacks matching verified evidence.",
  );
  addMatches(
    /\b(?:Kerala|Mumbai|Delhi|Pune|Bengaluru|Bangalore|India)['’s ]{1,3}[^.\n]{0,90}\b(?:humidity|humid|climate|weather|monsoon|temperature)\b/gi,
    "UNSUPPORTED_LOCAL_CLAIM",
    "A local environmental explanation is not supported by verified evidence.",
  );
  addMatches(
    /\b(?:urgent action required|your (?:family'?s )?health depends on it|don't wait before it's too late|your peace of mind depends on it)\b/gi,
    "FEAR_BASED_CTA",
    "The call to action uses fear or false urgency for a routine service decision.",
    "MEDIUM",
    false,
  );

  const genericHits = GENERIC_PHRASES.filter((phrase) =>
    markdown.toLowerCase().includes(phrase),
  );
  if (genericHits.length >= 2) {
    warnings.push({
      code: "GENERIC_AI_LANGUAGE",
      message: `Repeated generic AI phrasing: ${genericHits.join(", ")}.`,
      risk: "MEDIUM",
    });
  }

  if (!/^##\s+(?:FAQ|Frequently Asked Questions)/im.test(markdown)) {
    warnings.push({
      code: "MISSING_FAQ",
      message: "The article has no topic-specific FAQ section.",
      risk: "MEDIUM",
    });
  }

  const internalLinks = [...markdown.matchAll(/\[[^\]]+\]\((\/[^)\s]+)\)/g)].map(
    (match) => match[1],
  );
  if (!internalLinks.length) {
    warnings.push({
      code: "MISSING_INTERNAL_LINKS",
      message: "The article contains no contextual link to an existing site page.",
      risk: "MEDIUM",
    });
  }

  const normalizedFacts = new Set(facts.map((fact) => normalizeUrl(fact.sourceUrl)));
  const normalizedInternal = new Set(allowedInternalUrls.map((url) => normalizeUrl(url)));
  for (const url of extractUrls(markdown)) {
    const normalized = normalizeUrl(url);
    let isOwnAbsoluteUrl = false;
    try {
      const parsed = new URL(normalized);
      isOwnAbsoluteUrl = parsed.hostname === "bedbugstreatment.co.in";
    } catch {}
    if (!normalizedFacts.has(normalized) && !normalizedInternal.has(normalized) && !isOwnAbsoluteUrl) {
      warnings.push({
        code: "UNSUPPORTED_URL",
        message: `The article contains a URL that was not supplied by verified research or the site inventory: ${url}`,
        risk: "HIGH",
        excerpt: url,
      });
    }
  }

  return warnings.filter(
    (warning, index, all) =>
      all.findIndex(
        (candidate) =>
          candidate.code === warning.code && candidate.excerpt === warning.excerpt,
      ) === index,
  );
}

function calculateCannibalization(topic, pages) {
  const overlappingPages = pages
    .map((page) => ({
      ...page,
      similarity: Math.round(similarity(topic, `${page.title} ${page.topic}`) * 100) / 100,
    }))
    .filter((page) => page.similarity >= 0.35)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);
  const top = overlappingPages[0]?.similarity || 0;
  if (top >= 0.8) {
    return { risk: "HIGH", overlappingPages, recommendedAction: "UPDATE_EXISTING" };
  }
  if (top >= 0.5) {
    return { risk: "MEDIUM", overlappingPages, recommendedAction: "CHANGE_SEARCH_INTENT" };
  }
  return { risk: "LOW", overlappingPages, recommendedAction: "CREATE_NEW" };
}

function calculateDeterministicScores({ markdown, metadata, facts, warnings, factChecks, primaryKeyword }) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  const h2s = (markdown.match(/^##\s+/gm) || []).length;
  const hasTable = /^\|.+\|/m.test(markdown);
  const hasSteps = /^\s*\d+\.\s+/m.test(markdown);
  const hasChecklist = /^\s*[-*]\s+\[[ xX]\]/m.test(markdown);
  const hasFaq = /^##\s+(?:FAQ|Frequently Asked Questions)/im.test(markdown);
  const internalLinks = (markdown.match(/\[[^\]]+\]\(\/[^)]+\)/g) || []).length;
  const highWarnings = warnings.filter((warning) => warning.risk === "HIGH").length;
  const mediumWarnings = warnings.filter((warning) => warning.risk === "MEDIUM").length;
  const highUnverified = factChecks.filter(
    (claim) => claim.risk === "HIGH" && claim.verificationStatus !== "VERIFIED",
  ).length;
  const contradicted = factChecks.filter((claim) => claim.verificationStatus === "CONTRADICTED").length;
  const keyword = String(primaryKeyword || "").toLowerCase();
  const seoSignals = [
    metadata.seoTitle?.toLowerCase().includes(keyword),
    metadata.h1?.toLowerCase().includes(keyword),
    metadata.metaDescription?.length >= 100 && metadata.metaDescription?.length <= 165,
    h2s >= 4,
    internalLinks >= 1,
  ].filter(Boolean).length;
  const seoQuality = Math.max(0, Math.min(100, 55 + seoSignals * 9 - (internalLinks ? 0 : 12)));
  const contentQuality = Math.max(
    0,
    Math.min(100, 55 + Math.min(15, words / 100) + Math.min(12, h2s * 2) + (hasFaq ? 8 : 0) + (hasSteps || hasTable ? 6 : 0) - mediumWarnings * 3),
  );
  const informationGain = Math.max(0, Math.min(100, 55 + (hasTable ? 12 : 0) + (hasSteps ? 12 : 0) + (hasChecklist ? 10 : 0) + Math.min(10, facts.length * 2)));
  const factualConfidence = Math.max(0, Math.min(100, 100 - highWarnings * 25 - mediumWarnings * 5 - highUnverified * 25 - contradicted * 40));
  const eeat = Math.max(0, Math.min(100, 55 + Math.min(30, facts.length * 5) + (facts.length ? 10 : 0) - highWarnings * 20));
  return {
    seoQuality: Math.round(seoQuality),
    contentQuality: Math.round(contentQuality),
    factualConfidence: Math.round(factualConfidence),
    eeat: Math.round(eeat),
    informationGain: Math.round(informationGain),
  };
}

module.exports = {
  GENERIC_PHRASES,
  calculateCannibalization,
  calculateDeterministicScores,
  extractUrls,
  normalizeUrl,
  scanHallucinations,
  similarity,
  supportSimilarity,
};
