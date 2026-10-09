import OpenAI from "openai";
import { LengthFinishReasonError } from "openai/error";
import { z } from "zod";
import { zodResponseFormat, zodTextFormat } from "openai/helpers/zod";
import {
  draftPackageSchema,
  evidenceResearchSchema,
  factCheckSchema,
  highRiskClaimCategories,
  qualityAuditSchema,
  researchBriefSchema,
  type AuditWarning,
  type DraftPackage,
  type FactCheck,
  type QualityAudit,
  type VerifiedFact,
} from "./schemas";
import {
  calculateCannibalization,
  calculateDeterministicScores,
  extractUrls,
  normalizeUrl,
  scanHallucinations,
  supportSimilarity,
} from "./safety";
import { collectWebSearchUrls, verifyEvidenceCandidates } from "./source-verification";
import { getExistingPageInventory } from "./site-inventory";
import { saveBlogArticle } from "./storage";
import { BLOG_LENGTH_POLICY, countBlogWords, isPublishableBlogLength } from "./length-policy";

const CORE_MODEL = process.env.OPENAI_BLOG_MODEL || "gpt-4o";
const RESEARCH_MODEL = process.env.OPENAI_RESEARCH_MODEL || "gpt-4o";
const MAX_REVISIONS = Math.max(0, Math.min(1, Number(process.env.BLOG_MAX_REVISIONS || 0)));
const AUTO_BLOG_TOKEN_BUDGET = 60000;
const SectionAdditionsSchema = z.object({
  additions: z.array(z.object({
    sectionIndex: z.number().int().nonnegative(),
    content: z.string(),
  })),
});

const SOURCE_HIERARCHY = `
1. Government and regulatory sources
2. Universities and extension programs
3. Public-health organizations
4. Peer-reviewed scientific research
5. Recognized professional organizations
6. Established high-quality industry sources
7. Other reliable sources
`;

const WRITING_RULES = `
- Begin by directly helping the reader recognize or solve the specific problem. Never begin with "This comprehensive guide aims to", "In today's world", "a growing concern", or similar filler.
- Use a calm, natural voice. Do not use fear, false urgency, exaggerated efficacy, or "peace of mind depends on it" language.
- Bed bugs are not evidence of poor hygiene. Cleaning and reducing clutter may support inspection and control, but sanitation alone is not eradication.
- Use precise India context only when the brief or verified evidence makes it relevant. Do not invent state climate explanations, regulations, local behavior, service availability, or pricing.
- Never invent an expert, quote, institution, paper, journal, government document, statistic, URL, certification, award, business claim, price, temperature, duration, dosage, success rate, or treatment interval.
- For SCIENTIFIC, HEALTH, SAFETY, REGULATORY, PRICE, EXPERT, and STATISTICAL claims, use only the verified evidence supplied below. If it is absent, omit the claim or use a non-specific explanation.
- If no verified PRICE_CLAIM is supplied, give no numeric price, price range, or estimate. Discuss quote factors instead. Do not claim anything about Pune's climate without a verified local-climate source.
- Do not claim any method kills, eliminates, or effectively treats bed bugs unless a verified fact supports that specific method and effect.
- Copy source URLs exactly. Cite an important supported claim using a normal Markdown link to its supplied source. Do not create a References section; the application creates it from sources actually used.
- In the interlinks step, strictly add 4 to 5 contextual internal links using only the supplied internal URLs. Strictly add ONLY ONE (1) high-authority external link across the entire article. All other evidence citations must remain plain text.
- Build sections around search intent. Prefer useful inspection steps, decision aids, checklists, comparison tables, mistakes, preparation, aftercare, and topic-specific FAQs when they improve the answer.
- Write ${BLOG_LENGTH_POLICY.targetMinimumWords}-${BLOG_LENGTH_POLICY.targetMaximumWords} reader-visible words, accepting ${BLOG_LENGTH_POLICY.minimumWords}-${BLOG_LENGTH_POLICY.maximumWords}. Earn length with topic-specific decisions, steps, limitations and useful FAQs; never pad.
- Return the FAQ content in both the markdown article and the structured faqs field.
- Start markdown with one H1 matching metadata.h1. Use relative paths such as /services for internal links; never expand them to a made-up domain.
- NEVER add captions, italicized descriptions, or any text below images. The images must stand alone without a descriptive line below them.
`;

type StageResult = {
  draft: DraftPackage;
  markdown: string;
  factChecks: FactCheck[];
  qualityAudit: QualityAudit;
  warnings: AuditWarning[];
  scores: QualityAudit["scores"];
};

function logStage(requestId: string, stage: string, details: Record<string, unknown> = {}) {
  console.info(JSON.stringify({ scope: "blog-pipeline", requestId, stage, ...details }));
}

function addUsage(current: number, usage?: { total_tokens?: number | null } | null) {
  return current + (usage?.total_tokens || 0);
}

/** A truncated structured response cannot be parsed or audited. Retry that
 * same stage once with more output room; every other error still fails closed. */
async function parseWithLengthRetry<T>(
  requestId: string,
  stage: string,
  firstLimit: number,
  retryLimit: number,
  parse: (maxCompletionTokens: number) => Promise<T>,
): Promise<T> {
  try {
    return await parse(firstLimit);
  } catch (error) {
    if (!(error instanceof LengthFinishReasonError)) throw error;
    logStage(requestId, `${stage}.length_retry`, { firstLimit, retryLimit });
    return parse(retryLimit);
  }
}

function ensureFaqSection(markdown: string, faqs: DraftPackage["faqs"]): string {
  if (!faqs.length || /^##\s+(?:FAQ|Frequently Asked Questions)/im.test(markdown)) return markdown.trim();
  const faqMarkdown = faqs
    .map((faq) => `### ${faq.question}\n\n${faq.answer}`)
    .join("\n\n");
  return `${markdown.trim()}\n\n## Frequently Asked Questions\n\n${faqMarkdown}`;
}

function removeModelReferences(markdown: string): string {
  return markdown.replace(/\n##\s+(?:References|Sources)\s*\n[\s\S]*$/i, "").trim();
}

function removeHallucinatedVisuals(markdown: string): string {
  let clean = markdown;
  // 1. Strip hallucinated markdown images
  clean = clean.replace(/!\[[^\]]*\]\([^)]+\)\s*/g, "");
  // 2. Strip hallucinated italic captions (e.g. *Image showing...*)
  clean = clean.replace(/^\s*(?:\*|_)?(?:Image|Photo|Picture|Visual|Caption|Figure|Illustration)(?:\s*showing|\s*:|\s+of).*?(?:\*|_)?\s*$/gim, "");
  // 3. Strip any stray markdown caption lines that are just italics under where an image used to be (if they start with just italics)
  clean = clean.replace(/^\s*(?:\*|_)(?:A|An|Close-up|Close up|Macro).*?(?:\*|_)\s*$/gim, "");
  return clean.trim();
}

function expandableHeadings(markdown: string): string[] {
  return [...markdown.matchAll(/^##\s+(.+)$/gm)]
    .map((match) => match[1].trim())
    .filter((heading) => !/^(?:faq|frequently asked questions|references|sources)$/i.test(heading));
}

function addDepthToSections(markdown: string, additions: Array<{ sectionIndex: number; content: string }>): string {
  const lines = markdown.split("\n");
  const headings = lines.flatMap((line, lineIndex) => {
    const match = line.match(/^##\s+(.+)$/);
    return match ? [{ lineIndex, heading: match[1].trim() }] : [];
  });
  const expandable = headings.filter(({ heading }) => !/^(?:faq|frequently asked questions|references|sources)$/i.test(heading));
  const uniqueAdditions = new Map(additions
    .filter(({ sectionIndex, content }) => sectionIndex < expandable.length && content.trim())
    .map(({ sectionIndex, content }) => [sectionIndex, content.trim()]));

  for (const [sectionIndex, content] of [...uniqueAdditions].sort((a, b) => b[0] - a[0])) {
    const headingLine = expandable[sectionIndex].lineIndex;
    const nextHeading = headings.find(({ lineIndex }) => lineIndex > headingLine);
    lines.splice(nextHeading?.lineIndex ?? lines.length, 0, "", content, "");
  }
  return lines.join("\n");
}

function appendVerifiedReferences(markdown: string, evidence: VerifiedFact[]): string {
  const clean = removeModelReferences(markdown);
  const usedUrls = new Set(extractUrls(clean).map(normalizeUrl));
  const usedSources = evidence.filter((fact) => usedUrls.has(normalizeUrl(fact.sourceUrl)));
  if (!usedSources.length) return clean;
  const entries = usedSources.map((fact) => {
    const date = fact.publicationDate ? `, ${fact.publicationDate}` : "";
    return `- [${fact.sourceTitle}](${fact.sourceUrl}) — ${fact.publisher}${date}. Accessed ${fact.accessedDate}. Supports: ${fact.claim}`;
  });
  return `${clean}\n\n## References\n\n${entries.join("\n")}`;
}

function validInternalLinks(draft: DraftPackage, allowedUrls: Set<string>) {
  return draft.internalLinks.filter(
    (link) => allowedUrls.has(link.targetUrl) && link.targetUrl.startsWith("/"),
  );
}

function buildSchema(draft: DraftPackage) {
  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: draft.metadata.h1,
    description: draft.metadata.metaDescription,
    mainEntityOfPage: `https://bedbugstreatment.co.in/${draft.metadata.urlSlug}`,
  };
  const faq = draft.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: draft.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;
  return { article, faq };
}

function normalizeFactChecks(checks: FactCheck[], evidence: VerifiedFact[]): FactCheck[] {
  const factById = new Map(evidence.map((fact) => [fact.id, fact]));
  return checks.map((check) => {
    const qualifiedPriceExplanation =
      check.category === "PRICE_CLAIM" &&
      !/(?:₹|\bINR\b|\bRs\.?|\d)/i.test(check.claim) &&
      /(?:var(?:y|ies)|depend|factor|inspection|quote)/i.test(check.claim);
    if (qualifiedPriceExplanation) {
      return {
        ...check,
        risk: "LOW" as const,
        recommendedAction: "KEEP" as const,
        explanation: "This is a non-numeric explanation of pricing factors, used when verified pricing is unavailable.",
      };
    }
    const source = check.sourceId ? factById.get(check.sourceId) : undefined;
    const supportMatches = source && supportSimilarity(check.claim, source.claim) >= 0.62;
    if (check.verificationStatus === "VERIFIED" && (!source || !supportMatches)) {
      return {
        ...check,
        verificationStatus: "UNVERIFIED" as const,
        sourceId: null,
        risk: highRiskClaimCategories.has(check.category) ? "HIGH" as const : check.risk,
        recommendedAction: highRiskClaimCategories.has(check.category) ? "REMOVE" as const : "QUALIFY" as const,
        explanation: "The fact checker did not map this claim to a sufficiently similar verified evidence object.",
      };
    }
    if (check.verificationStatus !== "VERIFIED" && highRiskClaimCategories.has(check.category)) {
      return {
        ...check,
        risk: "HIGH" as const,
        recommendedAction: check.verificationStatus === "PARTIALLY_VERIFIED" ? "QUALIFY" as const : "REMOVE" as const,
      };
    }
    return check;
  });
}

function validImageRecommendations(draft: DraftPackage, evidence: VerifiedFact[]) {
  return draft.imageRecommendations.filter((image) => {
    const text = `${image.imageType} ${image.purpose} ${image.description} ${image.altText} ${image.caption}`;
    if (/\b(?:price|pricing|cost|₹|INR|Rs\.)\b/i.test(text)) {
      return evidence.some((fact) => fact.category === "PRICE_CLAIM");
    }
    if (/\b(?:percentage|success rate|efficacy|toxicity|safe for|regulation|approved)\b/i.test(text)) {
      return evidence.some((fact) => supportSimilarity(text, fact.claim) >= 0.55);
    }
    return true;
  });
}

function mergeScores(modelScores: QualityAudit["scores"], deterministic: QualityAudit["scores"]): QualityAudit["scores"] {
  return {
    seoQuality: Math.min(modelScores.seoQuality, deterministic.seoQuality),
    contentQuality: Math.min(modelScores.contentQuality, deterministic.contentQuality),
    factualConfidence: Math.min(modelScores.factualConfidence, deterministic.factualConfidence),
    eeat: Math.min(modelScores.eeat, deterministic.eeat),
    informationGain: Math.min(modelScores.informationGain, deterministic.informationGain),
  };
}

function publicationDecision(
  scores: QualityAudit["scores"],
  warnings: AuditWarning[],
  factChecks: FactCheck[],
  cannibalizationRisk: "LOW" | "MEDIUM" | "HIGH",
) {
  const highRiskUnverifiedClaims = factChecks.filter(
    (claim) => claim.risk === "HIGH" && claim.verificationStatus !== "VERIFIED",
  );
  const hasCriticalWarning = warnings.some((warning) => warning.risk === "HIGH");
  const meetsScores = scores.seoQuality >= 85 && scores.contentQuality >= 85 && scores.factualConfidence >= 90;
  const ready = meetsScores && !hasCriticalWarning && !highRiskUnverifiedClaims.length && cannibalizationRisk !== "HIGH";
  const blocked = hasCriticalWarning || highRiskUnverifiedClaims.length > 0 || cannibalizationRisk === "HIGH";
  return {
    status: ready ? "READY" as const : blocked ? "BLOCKED" as const : "NEEDS_REVISION" as const,
    autoPublishEligible: ready,
    highRiskUnverifiedClaims,
    overallPublishingConfidence: Math.round(
      (scores.seoQuality + scores.contentQuality + scores.factualConfidence + scores.eeat + scores.informationGain) / 5,
    ),
  };
}

export async function runBlogPipeline(input: { topic?: string; keywords?: string; persistDraft?: boolean }) {
  const requestId = crypto.randomUUID();
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  let totalTokens = 0;
  const addBudgetedUsage = (usage?: { total_tokens?: number | null } | null) => {
    totalTokens = addUsage(totalTokens, usage);
    if (totalTokens > AUTO_BLOG_TOKEN_BUDGET) {
      throw new Error(`Generation exceeded the ${AUTO_BLOG_TOKEN_BUDGET}-token budget.`);
    }
  };
  const pageInventory = await getExistingPageInventory();
  const basePrompt = input.topic?.trim()
    ? `Topic: ${input.topic.trim()}\nTarget keywords supplied by the editor: ${input.keywords?.trim() || "none"}`
    : "Choose one useful bed-bug topic for an Indian reader. Do not claim search volume without keyword-tool data.";

  logStage(requestId, "intent.started", { model: CORE_MODEL });
  const intentResponse = await parseWithLengthRetry(requestId, "intent", 1800, 2800, (maxCompletionTokens) => openai.chat.completions.parse({
    model: CORE_MODEL,
    messages: [
      {
        role: "system",
        content: `You are a search-intent strategist. Plan a genuinely useful article before research. Separate meaningful India context from decorative localization. Identify every question that would require current or authoritative evidence. Do not answer research questions and do not invent facts.`,
      },
      { role: "user", content: basePrompt },
    ],
    response_format: zodResponseFormat(researchBriefSchema, "article_research_brief"),
    max_completion_tokens: maxCompletionTokens,
  }));
  addBudgetedUsage(intentResponse.usage);
  const researchBrief = intentResponse.choices[0]?.message.parsed;
  if (!researchBrief) throw new Error("Intent analysis did not return a valid research brief.");

  const cannibalization = calculateCannibalization(
    `${researchBrief.topicalCoverage.primaryTopic} ${researchBrief.searchIntent.primaryKeyword}`,
    pageInventory,
  );
  logStage(requestId, "intent.completed", { cannibalizationRisk: cannibalization.risk, totalTokens });

  logStage(requestId, "research.started", { model: RESEARCH_MODEL, evidenceNeeds: researchBrief.evidenceNeeds.length });
  const researchResponse = await openai.responses.parse({
    model: RESEARCH_MODEL,
    tool_choice: "required",
    tools: [{
      type: "web_search",
      search_context_size: "medium",
      user_location: { type: "approximate", country: "IN", timezone: "Asia/Kolkata" },
    }],
    include: ["web_search_call.action.sources"],
    max_tool_calls: 8,
    max_output_tokens: 4200,
    instructions: `You are the evidence researcher, separate from the article writer. Search and open real sources. ${SOURCE_HIERARCHY}\nUse authoritative global sources for stable identification, biology, inspection, and control facts; India-specific sourcing is required only for genuinely India-specific regulatory, business, price, or local claims. Seek several authoritative HTML pages; PDF files cannot be verified by this system. For scientific, health, safety, regulatory, price, expert, and statistical claims, industry and other sources are insufficient. Return only claims directly supported by a retrieved page. Copy the page URL and title from the retrieval result. evidenceExcerpt must be a short, faithful excerpt from the page, not a paraphrase. Set freshnessMatters to true only for prices, current statistics, current regulations, or recommendations likely to change; it is false for stable identification and biology. Do not invent a missing date, author, expert, quote, institution, document, price, statistic, or URL. Use null for an unavailable publication date. For current prices, prefer configured first-party data, which is absent here; do not infer market ranges.`,
    input: `Research this article plan:\n${JSON.stringify(researchBrief, null, 2)}\n\nFind sources only for the stated evidence needs. Also identify real related user questions based on research, without inventing keyword volumes.`,
    text: { format: zodTextFormat(evidenceResearchSchema, "verified_evidence_candidates") },
  });
  addBudgetedUsage(researchResponse.usage);
  const evidenceResearch = researchResponse.output_parsed;
  if (!evidenceResearch) throw new Error("Web research did not return structured evidence candidates.");
  const discoveredUrls = collectWebSearchUrls(researchResponse);
  const completedWebSearch = researchResponse.output.some(
    (item) => item.type === "web_search_call" && item.status === "completed",
  );
  const sourceListFallback = completedWebSearch && discoveredUrls.size === 0;
  const { verifiedFacts, rejectedEvidence } = await verifyEvidenceCandidates(
    evidenceResearch.candidates,
    discoveredUrls,
    sourceListFallback,
  );
  logStage(requestId, "research.completed", {
    outputTypes: researchResponse.output.map((item) => item.type),
    discoveredUrls: discoveredUrls.size,
    sourceListFallback,
    matchedCandidates: evidenceResearch.candidates.filter((item) => discoveredUrls.has(normalizeUrl(item.sourceUrl))).length,
    candidates: evidenceResearch.candidates.length,
    verified: verifiedFacts.length,
    rejected: rejectedEvidence.length,
    rejectionReasons: rejectedEvidence.map((item) => item.reason),
    totalTokens,
  });
  if (!verifiedFacts.length && researchBrief.evidenceNeeds.some((need) => need.required)) {
    throw new Error("No research source passed live URL, title, and excerpt verification. The article was not published.");
  }

  const allowedInternalUrls = new Set(pageInventory.map((page) => page.url));
  const writerInput = {
    researchBrief,
    verifiedFacts,
    relatedQuestions: evidenceResearch.relatedQuestions,
    researchGaps: evidenceResearch.researchGaps,
    allowedInternalPages: pageInventory,
  };

  logStage(requestId, "draft.started", { model: CORE_MODEL });
  const draftResponse = await parseWithLengthRetry(requestId, "draft", 5500, 7500, (maxCompletionTokens) => openai.chat.completions.parse({
    model: CORE_MODEL,
    messages: [
      { role: "system", content: `You are the article writer. You cannot browse and must treat the supplied evidence and URL lists as closed sets.\n${WRITING_RULES}` },
      { role: "user", content: JSON.stringify(writerInput, null, 2) },
    ],
    response_format: zodResponseFormat(draftPackageSchema, "evidence_bound_article"),
    max_completion_tokens: maxCompletionTokens,
  }));
  addBudgetedUsage(draftResponse.usage);
  let draft = draftResponse.choices[0]?.message.parsed;
  if (!draft) throw new Error("The writer did not return a valid article package.");
  logStage(requestId, "draft.completed", {
    words: countBlogWords(draft.markdown),
    totalTokens,
  });
  if (countBlogWords(draft.markdown) < BLOG_LENGTH_POLICY.minimumWords) {
    const draftToExpand = draft;
    const headings = expandableHeadings(draftToExpand.markdown).slice(0, 6);
    if (!headings.length) throw new Error("The article has no sections that can be expanded safely.");
    // The model tends to deliver fewer words than requested for additions.
    // Ask with headroom while the final 1500-2400 gate remains authoritative.
    const wordsPerSection = Math.max(200, Math.min(320,
      Math.ceil((BLOG_LENGTH_POLICY.targetMinimumWords - countBlogWords(draftToExpand.markdown) + 100) / headings.length / 0.65),
    ));
    logStage(requestId, "draft.length_repair.started", { words: countBlogWords(draftToExpand.markdown), sections: headings.length });
    const sectionBatches = [headings.slice(0, 3), headings.slice(3, 6)].filter((batch) => batch.length);
    const repairResponses = await Promise.all(sectionBatches.map((batch, batchIndex) =>
      parseWithLengthRetry(requestId, `draft.length_repair.${batchIndex + 1}`, 3000, 4500, (maxCompletionTokens) => openai.chat.completions.parse({
        model: CORE_MODEL,
        messages: [
          { role: "system", content: "You are an evidence-bound editor adding useful depth to existing sections. Write only new paragraphs. Do not rewrite or summarize the article. Do not repeat existing points or invent claims, prices, statistics, safety advice, URLs, or business facts. Cite the exact supplied source URL immediately after any externally checkable claim. Omit a claim when no supplied fact supports it. The independent fact checker will reject unsupported additions." },
          { role: "user", content: JSON.stringify({
            task: `Write one addition of approximately ${wordsPerSection} words for EACH listed section. Give practical steps, decisions, examples, limitations or comparisons specific to that section. Return the sectionIndex and new paragraphs only. Use only supplied facts for externally checkable claims.`,
            topic: researchBrief.topicalCoverage.primaryTopic,
            sections: batch.map((heading, index) => ({ sectionIndex: batchIndex * 3 + index, heading })),
            verifiedFacts,
            existingMarkdown: draftToExpand.markdown,
          }, null, 2) },
        ],
        response_format: zodResponseFormat(SectionAdditionsSchema, "section_additions"),
        max_completion_tokens: maxCompletionTokens,
      }))
    ));
    for (const response of repairResponses) addBudgetedUsage(response.usage);
    const additions = repairResponses.flatMap((response) => response.choices[0]?.message.parsed?.additions || []);
    if (!additions.length) throw new Error("The length repair did not return section additions.");
    draft = { ...draftToExpand, markdown: addDepthToSections(draftToExpand.markdown, additions) };
    logStage(requestId, "draft.length_repair.completed", { words: countBlogWords(draft.markdown), totalTokens });
    if (countBlogWords(draft.markdown) < BLOG_LENGTH_POLICY.minimumWords - 100) {
      throw new Error(`Article remained too short after focused expansion (${countBlogWords(draft.markdown)} words); publication was blocked.`);
    }
  }

  const evaluate = async (candidateDraft: DraftPackage): Promise<StageResult> => {
    const internalLinks = validInternalLinks(candidateDraft, allowedInternalUrls);
    candidateDraft = { ...candidateDraft, internalLinks };
    
    let cleanMarkdown = removeHallucinatedVisuals(candidateDraft.markdown);
    cleanMarkdown = removeModelReferences(cleanMarkdown);
    let markdown = ensureFaqSection(cleanMarkdown, candidateDraft.faqs);
    markdown = appendVerifiedReferences(markdown, verifiedFacts);
    // References are generated from verified facts; scan article prose only.
    // Scanning the generated list double-counts its quoted claims as prose.
    const warnings = scanHallucinations(removeModelReferences(markdown), verifiedFacts, [...allowedInternalUrls]);
    if (!verifiedFacts.length && researchBrief.evidenceNeeds.some((need) => need.required)) {
      warnings.push({
        code: "UNVERIFIED_SOURCE",
        message: "The topic requires evidence, but no candidate source passed URL, title, and excerpt verification.",
        risk: "HIGH",
      });
    }
    if (cannibalization.risk !== "LOW") {
      warnings.push({
        code: "POSSIBLE_CONTENT_CANNIBALIZATION",
        message: `${cannibalization.risk} overlap with: ${cannibalization.overlappingPages.map((page) => page.url).join(", ") || "an existing page"}. Recommended action: ${cannibalization.recommendedAction}.`,
        risk: cannibalization.risk === "HIGH" ? "HIGH" : "MEDIUM",
      });
    }

    if (allowedInternalUrls.has(`/${candidateDraft.metadata.urlSlug}`)) {
      warnings.push({
        code: "DUPLICATE_SLUG",
        message: `The URL slug "/${candidateDraft.metadata.urlSlug}" is already taken by an existing article. You must rename the slug to a completely different, valid, descriptive URL path. Do NOT append random strings or numbers. Use a descriptive, intent-focused path instead (e.g., if "bed-bug-bites" is taken, use "bed-bug-bites-identification-guide").`,
        risk: "HIGH",
      });
    }

    logStage(requestId, "fact_check.started");
    const factResponse = await parseWithLengthRetry(requestId, "fact_check", 2400, 3600, (maxCompletionTokens) => openai.chat.completions.parse({
      model: CORE_MODEL,
      messages: [
        {
          role: "system",
          content: `You are an independent fact checker. Extract every important externally checkable claim from the article, including claims in FAQs, tables, and calls to action. Classify each and compare it only with the verified evidence objects. Model knowledge is not evidence. A claim is VERIFIED only when a supplied evidence object directly supports it; return that exact sourceId. Be especially strict with scientific, health, safety, regulatory, price, expert, and statistical claims. Ordinary advice may be GENERAL_KNOWLEDGE, but specific numbers, efficacy, safety, local, and business claims are not. A non-numeric statement that treatment cost varies with property or infestation factors is the permitted fallback when verified pricing is unavailable; mark it LOW risk and KEEP.`,
        },
        { role: "user", content: JSON.stringify({ article: markdown, verifiedFacts }, null, 2) },
      ],
      response_format: zodResponseFormat(factCheckSchema, "independent_fact_check"),
      max_completion_tokens: maxCompletionTokens,
    }));
    addBudgetedUsage(factResponse.usage);
    const factChecks = normalizeFactChecks(factResponse.choices[0]?.message.parsed?.claims || [], verifiedFacts);

    logStage(requestId, "quality_audit.started");
    const qualityResponse = await parseWithLengthRetry(requestId, "quality_audit", 1500, 2400, (maxCompletionTokens) => openai.chat.completions.parse({
      model: CORE_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an independent content evaluator, separate from the writer and fact checker. Each rubric field is 0-10. Each named quality score is 0-100. Score strictly and use the full requested scale. Do not reward authoritative tone. E-E-A-T comes from useful content, transparent sourcing, and real authorship only. Explain concrete weaknesses that an editor can fix.",
        },
        {
          role: "user",
          content: JSON.stringify({
            searchIntent: researchBrief.searchIntent,
            article: markdown,
            metadata: candidateDraft.metadata,
            verifiedEvidenceCount: verifiedFacts.length,
            factChecks,
            warnings,
            internalLinks,
            availableInternalUrls: [...allowedInternalUrls],
          }, null, 2),
        },
      ],
      response_format: zodResponseFormat(qualityAuditSchema, "independent_quality_audit"),
      max_completion_tokens: maxCompletionTokens,
    }));
    addBudgetedUsage(qualityResponse.usage);
    const qualityAudit = qualityResponse.choices[0]?.message.parsed;
    if (!qualityAudit) throw new Error("The independent quality audit did not return valid results.");
    const deterministicScores = calculateDeterministicScores({
      markdown,
      metadata: candidateDraft.metadata,
      facts: verifiedFacts,
      warnings,
      factChecks,
      primaryKeyword: researchBrief.searchIntent.primaryKeyword,
    });
    const scores = mergeScores(qualityAudit.scores, deterministicScores);
    qualityAudit.scores = scores;
    qualityAudit.weaknesses = [...new Set([
      ...qualityAudit.weaknesses,
      ...warnings.map((warning) => warning.message),
      ...factChecks
        .filter((claim) => claim.verificationStatus !== "VERIFIED" && claim.risk !== "LOW")
        .map((claim) => `${claim.recommendedAction}: ${claim.claim} — ${claim.explanation}`),
    ])];
    return { draft: candidateDraft, markdown, factChecks, qualityAudit, warnings, scores };
  };

  let result = await evaluate(draft);
  let decision = publicationDecision(result.scores, result.warnings, result.factChecks, cannibalization.risk);
  let revisionCount = 0;
  while (!decision.autoPublishEligible && revisionCount < MAX_REVISIONS) {
    const issues = result.qualityAudit.weaknesses
      .filter((issue) => !/cannibali[sz]ation|overlap with|recommended action/i.test(issue))
      .slice(0, 15);
    if (!issues.length) break;
    revisionCount += 1;
    logStage(requestId, "revision.started", { revisionCount, issues: issues.length });
    const revisionResponse = await parseWithLengthRetry(requestId, "revision", 5500, 7500, (maxCompletionTokens) => openai.chat.completions.parse({
      model: CORE_MODEL,
      messages: [
        {
          role: "system",
          content: `You are a surgical content editor. Preserve sound sections and fix every supplied weakness. Remove unsupported claims instead of inventing support. Replace removed sentences with specific, non-factual decision guidance that helps the reader and keeps the article within the required word range. You cannot browse. Use the same closed evidence and internal URL sets.\n${WRITING_RULES}`,
        },
        {
          role: "user",
          content: JSON.stringify({
            issues,
            currentDraft: result.draft,
            researchBrief,
            verifiedFacts,
            allowedInternalPages: pageInventory,
          }, null, 2),
        },
      ],
      response_format: zodResponseFormat(draftPackageSchema, "revised_evidence_bound_article"),
      max_completion_tokens: maxCompletionTokens,
    }));
    addBudgetedUsage(revisionResponse.usage);
    const revised = revisionResponse.choices[0]?.message.parsed;
    if (!revised) break;
    if (!isPublishableBlogLength(countBlogWords(revised.markdown))) {
      logStage(requestId, "revision.rejected", {
        reason: "Revised article does not meet the required word range",
        words: countBlogWords(revised.markdown),
      });
      break;
    }
    draft = revised;
    result = await evaluate(draft);
    decision = publicationDecision(result.scores, result.warnings, result.factChecks, cannibalization.risk);
    logStage(requestId, "revision.completed", { revisionCount, status: decision.status });
  }

  const schema = buildSchema(result.draft);
  const wordCount = countBlogWords(result.markdown);
  if (!isPublishableBlogLength(wordCount)) {
    throw new Error(
      `Article length was ${wordCount} words; expected ${BLOG_LENGTH_POLICY.minimumWords}-${BLOG_LENGTH_POLICY.maximumWords} words.`,
    );
  }
  result.draft.imageRecommendations = validImageRecommendations(result.draft, verifiedFacts);
  // Scheduled publishing writes the final article through blog-db only after
  // the audit passes. Avoid an intermediate draft/duplicate slug in "blogs".
  const stored = input.persistDraft === false ? null : await saveBlogArticle({
    topic: researchBrief.topicalCoverage.primaryTopic,
    primaryKeyword: researchBrief.searchIntent.primaryKeyword,
    slug: result.draft.metadata.urlSlug,
    title: result.draft.metadata.h1,
    markdown: result.markdown,
    status: decision.autoPublishEligible ? "ready" : "draft",
    publicationStatus: decision.status,
    autoPublishEligible: decision.autoPublishEligible,
    research: researchBrief,
    evidence: verifiedFacts,
    factChecks: result.factChecks,
    warnings: result.warnings,
    qualityAudit: result.qualityAudit,
    cannibalization,
    revisionCount,
  });

  logStage(requestId, "pipeline.completed", {
    status: decision.status,
    articleId: stored?.article.id,
    storage: stored?.backend,
    revisionCount,
    warnings: result.warnings.map((warning) => ({ code: warning.code, risk: warning.risk, excerpt: warning.excerpt })),
    highRiskClaims: decision.highRiskUnverifiedClaims.map((claim) => ({ claim: claim.claim, category: claim.category })),
    scores: result.scores,
    wordCount,
    totalTokens,
  });

  return {
    articleId: stored?.article.id,
    storage: stored?.backend,
    blogContent: result.markdown,
    research: {
      ...researchBrief,
      evidence: {
        verifiedFacts,
        rejectedEvidence,
        researchGaps: evidenceResearch.researchGaps,
      },
    },
    audit: {
      ...result.qualityAudit,
      scores: result.scores,
      warnings: result.warnings,
      factChecks: result.factChecks,
      cannibalization,
      ...decision,
      revisionCount,
      wordCount,
    },
    metadata: result.draft.metadata,
    faqs: result.draft.faqs,
    schema: { type: "BlogPosting", jsonLd: JSON.stringify(schema, null, 2) },
    internalLinks: result.draft.internalLinks,
    imageRecommendations: result.draft.imageRecommendations,
    wordCount,
    usage: { totalTokens },
  };
}
