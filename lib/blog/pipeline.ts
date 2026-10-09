import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import {
  draftPackageSchema,
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
  removeUnsupportedProse,
  scanHallucinations,
  supportSimilarity,
} from "./safety";
import { selectCuratedEvidence, supportsCuratedParaphrase } from "./curated-evidence";
import { getExistingPageInventory } from "./site-inventory";
import { saveBlogArticle } from "./storage";
import { BLOG_LENGTH_POLICY, countBlogWords, isPublishableBlogLength } from "./length-policy";
import { AUTO_BLOG_TOKEN_BUDGET, completionAllowance, totalAfterUsage } from "./token-budget";

const CORE_MODEL = process.env.OPENAI_BLOG_MODEL || "gpt-4o";
const MAX_REVISIONS = Math.max(0, Math.min(1, Number(process.env.BLOG_MAX_REVISIONS || 0)));
const MIN_AUDIT_RESERVE = 6200;
const EditorialRewriteSchema = z.object({
  markdown: z.string(),
  faqs: draftPackageSchema.shape.faqs,
});
const IndependentReviewSchema = z.object({
  claims: factCheckSchema.shape.claims,
  qualityAudit: qualityAuditSchema,
});

const WRITING_RULES = `
- Begin by directly helping the reader recognize or solve the specific problem. Never begin with "This comprehensive guide aims to", "In today's world", "a growing concern", or similar filler.
- Use a calm, natural voice. Do not use fear, false urgency, exaggerated efficacy, or "peace of mind depends on it" language.
- Bed bugs are not evidence of poor hygiene. Cleaning and reducing clutter may support inspection and control, but sanitation alone is not eradication.
- Use precise India context only when the brief or verified evidence makes it relevant. Do not invent state climate explanations, regulations, local behavior, service availability, or pricing.
- For a city-specific topic without local source facts, make the city angle practical: explain which details the reader should give a local provider and which quote terms to compare. Never imply a particular provider, price, climate effect, or service promise exists there.
- Never invent an expert, quote, institution, paper, journal, government document, statistic, URL, certification, award, business claim, price, temperature, duration, dosage, success rate, or treatment interval.
- For SCIENTIFIC, HEALTH, SAFETY, REGULATORY, PRICE, EXPERT, and STATISTICAL claims, use only the verified evidence supplied below. If it is absent, omit the claim or use a non-specific explanation.
- If no verified PRICE_CLAIM is supplied, give no numeric price, price range, or estimate. Discuss quote factors instead. Do not claim anything about Pune's climate without a verified local-climate source.
- Do not claim any method kills, eliminates, or effectively treats bed bugs unless a verified fact supports that specific method and effect.
- The supplied facts are the complete list of claims you may make about infestation signs, treatment methods, biological effects, health, and safety. Do not add a musty-odor sign, plausible-sounding temperature, success promise, steam procedure, essential-oil remedy, whole-home heat claim, or chemical recommendation from memory.
- Do not turn qualified evidence into a guarantee. "Can help with control" does not mean "eradicates an infestation"; dryer guidance for suitable fabrics does not apply to a whole room.
- Keep each factual claim close to its evidence. If a requested angle has no supporting fact, explain what the reader should ask a provider rather than guessing the answer.
- Copy source URLs exactly. Cite important supported claims using normal Markdown links to their supplied sources. Use at least three distinct source pages when the supplied facts support them. Do not create a References section; the application creates it from sources actually used.
- Never use bracketed footnotes or fabricated source numbers such as [^1] or [^7^].
- Add 2 to 4 contextual internal links using only supplied internal URLs. External citations must point only to supplied source URLs.
- Build sections around search intent. Include a practical comparison table, one numbered decision process, and a short checklist using only supported claims and non-factual questions the reader can ask. Explain quote factors as questions, not asserted local prices or treatment effects.
- Make at least six distinct H2 sections and four topic-specific FAQs. Answer the title's question in the opening paragraph. Avoid repeating the same tip in the body, table, and FAQs.
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

function compactFacts(facts: VerifiedFact[]) {
  return facts.map(({ id, claim, category, sourceTitle, sourceUrl, evidenceExcerpt }) => ({
    id, claim, category, sourceTitle, sourceUrl, evidenceExcerpt,
  }));
}

function selectInternalPages(inventory: Awaited<ReturnType<typeof getExistingPageInventory>>, topic: string) {
  const essentials = inventory.filter((page) => page.source === "route");
  const related = inventory
    .filter((page) => page.source !== "route")
    .sort((a, b) => supportSimilarity(topic, b.topic) - supportSimilarity(topic, a.topic))
    .slice(0, 10);
  return [...essentials, ...related].map(({ url, title }) => ({ url, title }));
}

function ensureFaqSection(markdown: string, faqs: DraftPackage["faqs"]): string {
  if (!faqs.length || /^##\s+(?:FAQ|Frequently Asked Questions)/im.test(markdown)) return markdown.trim();
  const faqMarkdown = faqs
    .map((faq) => `### ${faq.question}\n\n${faq.answer}`)
    .join("\n\n");
  return `${markdown.trim()}\n\n## Frequently Asked Questions\n\n${faqMarkdown}`;
}

function ensureUsefulInternalLinks(markdown: string, allowedUrls: Set<string>): string {
  if (/\[[^\]]+\]\(\/[^)\s]+\)/.test(markdown)) return markdown;
  if (!allowedUrls.has("/services") || !allowedUrls.has("/contact")) return markdown;
  const nextStep = "If you need a home-specific assessment, compare [bed bug treatment services](/services) and [request an inspection](/contact) using the questions above.";
  const faqHeading = /^##\s+(?:FAQ|Frequently Asked Questions)/im.exec(markdown);
  if (!faqHeading || faqHeading.index === undefined) return `${markdown.trim()}\n\n${nextStep}`;
  return `${markdown.slice(0, faqHeading.index).trim()}\n\n${nextStep}\n\n${markdown.slice(faqHeading.index).trim()}`;
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
  clean = clean.replace(/\[\^\d+\^?\]/g, "");
  return clean.trim();
}

function appendVerifiedReferences(markdown: string, evidence: VerifiedFact[]): string {
  const clean = removeModelReferences(markdown);
  const usedUrls = new Set(extractUrls(clean).map(normalizeUrl));
  const usedSources = evidence.filter((fact, index) =>
    usedUrls.has(normalizeUrl(fact.sourceUrl)) &&
    evidence.findIndex((candidate) => normalizeUrl(candidate.sourceUrl) === normalizeUrl(fact.sourceUrl)) === index,
  );
  if (!usedSources.length) return clean;
  const entries = usedSources.map((fact) => {
    const date = fact.publicationDate ? `, ${fact.publicationDate}` : "";
    return `- [${fact.sourceTitle}](${fact.sourceUrl}) — ${fact.publisher}${date}. Accessed ${fact.accessedDate}.`;
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
    const supportedParaphrase = source && source.category === check.category &&
      supportsCuratedParaphrase(check.claim, source);
    const supportMatches = source && (supportSimilarity(check.claim, source.claim) >= 0.62 || supportedParaphrase);
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
  const addBudgetedUsage = (stage: string, usage?: { total_tokens?: number | null } | null) => {
    const stageTokens = usage?.total_tokens || 0;
    totalTokens = totalAfterUsage(totalTokens, usage);
    logStage(requestId, `${stage}.usage`, { stageTokens, totalTokens, remainingTokens: AUTO_BLOG_TOKEN_BUDGET - totalTokens });
    if (totalTokens > AUTO_BLOG_TOKEN_BUDGET) {
      throw new Error(`Generation exceeded the ${AUTO_BLOG_TOKEN_BUDGET}-token budget after ${stage} (${totalTokens} tokens used).`);
    }
  };
  const requestStructured = async <T>(
    stage: string,
    schema: z.ZodType<T>,
    formatName: string,
    messages: Array<{ role: "system" | "user"; content: string }>,
    desiredCompletionTokens: number,
    minimumCompletionTokens: number,
    reserveAfterCall = 0,
  ): Promise<T> => {
    const responseFormat = zodResponseFormat(schema, formatName);
    // Reserve a conservative estimate for the prompt, schema, and required later stages.
    const completionLimit = completionAllowance({
      usedTokens: totalTokens,
      serializedRequest: JSON.stringify({ messages, responseFormat }),
      desiredCompletionTokens,
      minimumCompletionTokens,
      reserveAfterCall,
    });
    const response = await openai.chat.completions.create({
      model: CORE_MODEL,
      messages,
      response_format: responseFormat,
      max_completion_tokens: completionLimit,
    });
    // Count usage before parsing so truncated/invalid structured responses are never free in the budget.
    addBudgetedUsage(stage, response.usage);
    const choice = response.choices[0];
    if (choice?.finish_reason === "length") {
      throw new Error(`${stage} was truncated at ${completionLimit} completion tokens; publication was blocked.`);
    }
    if (!choice?.message.content) throw new Error(`${stage} returned no structured content.`);
    return schema.parse(JSON.parse(choice.message.content));
  };
  const pageInventory = await getExistingPageInventory();
  const basePrompt = input.topic?.trim()
    ? `Topic: ${input.topic.trim()}\nTarget keywords supplied by the editor: ${input.keywords?.trim() || "none"}`
    : "Choose one useful bed-bug topic for an Indian reader. Do not claim search volume without keyword-tool data.";

  logStage(requestId, "intent.started", { model: CORE_MODEL });
  const researchBrief = await requestStructured(
    "intent", researchBriefSchema, "article_research_brief", [
      {
        role: "system",
        content: `You are a search-intent strategist. Plan a genuinely useful article before research. Separate meaningful India context from decorative localization. Identify every question that would require current or authoritative evidence. Do not answer research questions and do not invent facts.`,
      },
      { role: "user", content: basePrompt },
    ], 1800, 1200, 12000,
  );

  const cannibalization = calculateCannibalization(
    `${researchBrief.topicalCoverage.primaryTopic} ${researchBrief.searchIntent.primaryKeyword}`,
    pageInventory,
  );
  logStage(requestId, "intent.completed", { cannibalizationRisk: cannibalization.risk, totalTokens });

  const verifiedFacts = selectCuratedEvidence(researchBrief.topicalCoverage.primaryTopic);
  const rejectedEvidence: Array<{ claim: string; sourceUrl: string; reason: string }> = [];
  const researchGaps = researchBrief.evidenceNeeds
    .filter((need) => need.required && !verifiedFacts.some((fact) =>
      fact.category === need.category && supportSimilarity(need.question, fact.claim) >= 0.4,
    ))
    .map((need) => need.question);
  logStage(requestId, "research.curated", { verified: verifiedFacts.length, researchGaps: researchGaps.length, totalTokens });
  if (!verifiedFacts.length && researchBrief.evidenceNeeds.some((need) => need.required)) {
    throw new Error("No research source passed live URL, title, and excerpt verification. The article was not published.");
  }

  const allowedInternalUrls = new Set(pageInventory.map((page) => page.url));
  const relevantInternalPages = selectInternalPages(pageInventory, researchBrief.topicalCoverage.primaryTopic);
  const writerInput = {
    searchIntent: researchBrief.searchIntent,
    topic: researchBrief.topicalCoverage.primaryTopic,
    outline: researchBrief.outline,
    meaningfulLocalConsiderations: researchBrief.topicalCoverage.meaningfulLocalConsiderations,
    informationGainOpportunities: researchBrief.topicalCoverage.informationGainOpportunities,
    verifiedFacts: compactFacts(verifiedFacts),
    relatedQuestions: researchBrief.searchIntent.likelyFollowUpQuestions,
    researchGaps,
    allowedInternalPages: relevantInternalPages,
  };

  logStage(requestId, "draft.started", { model: CORE_MODEL });
  const drafted = await requestStructured(
    "draft", draftPackageSchema, "evidence_bound_article", [
      { role: "system", content: `You are the article writer. You cannot browse and must treat the supplied evidence and URL lists as closed sets.\n${WRITING_RULES}` },
      { role: "user", content: JSON.stringify(writerInput) },
    ], 5500, 3300, 5800,
  );
  let draft = drafted;
  logStage(requestId, "draft.completed", {
    words: countBlogWords(draft.markdown),
    totalTokens,
  });
  const preparedDraftWords = countBlogWords(appendVerifiedReferences(ensureFaqSection(
    removeModelReferences(removeHallucinatedVisuals(draft.markdown)), draft.faqs,
  ), verifiedFacts));
  if (preparedDraftWords < BLOG_LENGTH_POLICY.minimumWords) {
    const draftToExpand = draft;
    logStage(requestId, "draft.editorial_rewrite.started", { preparedWords: preparedDraftWords });
    const rewrite = await requestStructured(
      "draft.editorial_rewrite", EditorialRewriteSchema, "evidence_bound_rewrite", [
        { role: "system", content: `You are a meticulous editor. Rewrite the short draft as one cohesive, useful article. Do not add paragraphs to the existing structure. Remove repeated advice, generic filler, and any unsupported method, sign, or health assertion. Only the supplied verified facts support checkable claims. Do not introduce musty odor, steam, essential oils, diatomaceous earth, home heating, eradication promises, or treatment guarantees unless an exact supplied fact supports the claim. A local topic needs a practical local quote-comparison framework, never invented local prices or providers. Write ${BLOG_LENGTH_POLICY.targetMinimumWords}-${BLOG_LENGTH_POLICY.targetMaximumWords} reader-visible words, with at least six distinct H2 sections, one treatment or quote comparison table, a numbered decision process, and four specific FAQs. In each section, provide a different decision or step. Cite at least three distinct supplied source pages and add two contextual links to supplied internal pages. Return complete article Markdown and matching structured FAQs, without footnotes or a References section. The independent review will block unsupported or repetitive content.` },
        { role: "user", content: JSON.stringify({
          topic: researchBrief.topicalCoverage.primaryTopic,
          readerProblem: researchBrief.searchIntent.readerProblem,
          expectedAnswer: researchBrief.searchIntent.expectedAnswer,
          researchGaps,
          verifiedFacts: compactFacts(verifiedFacts),
          allowedInternalPages: relevantInternalPages,
          metadata: draftToExpand.metadata,
          shortDraft: draftToExpand.markdown,
        }) },
      ], 4700, 3000, MIN_AUDIT_RESERVE,
    );
    draft = { ...draftToExpand, markdown: rewrite.markdown, faqs: rewrite.faqs };
    logStage(requestId, "draft.editorial_rewrite.completed", { words: countBlogWords(draft.markdown), totalTokens });
    const repairedPreparedWords = countBlogWords(appendVerifiedReferences(ensureFaqSection(
      removeModelReferences(removeHallucinatedVisuals(draft.markdown)), draft.faqs,
    ), verifiedFacts));
    if (repairedPreparedWords < BLOG_LENGTH_POLICY.minimumWords) {
      throw new Error(`Article remained too short after editorial rewrite (${repairedPreparedWords} prepared words); publication was blocked.`);
    }
  }

  const evaluate = async (candidateDraft: DraftPackage): Promise<StageResult> => {
    const internalLinks = validInternalLinks(candidateDraft, allowedInternalUrls);
    candidateDraft = { ...candidateDraft, internalLinks };
    
    let cleanMarkdown = removeHallucinatedVisuals(candidateDraft.markdown);
    cleanMarkdown = removeModelReferences(cleanMarkdown);
    let prose = ensureUsefulInternalLinks(ensureFaqSection(cleanMarkdown, candidateDraft.faqs), allowedInternalUrls);
    const preliminaryWarnings = scanHallucinations(prose, verifiedFacts, [...allowedInternalUrls]);
    const prunedProse = removeUnsupportedProse(prose, preliminaryWarnings);
    if (prunedProse !== prose) {
      logStage(requestId, "draft.unsupported_prose_removed", { removedWarnings: preliminaryWarnings.filter((warning) => warning.risk === "HIGH").length });
      prose = prunedProse;
    }
    candidateDraft = { ...candidateDraft, markdown: prose };
    const markdown = appendVerifiedReferences(prose, verifiedFacts);
    const preparedWordCount = countBlogWords(markdown);
    if (!isPublishableBlogLength(preparedWordCount)) {
      throw new Error(`Article length was ${preparedWordCount} words before review; expected ${BLOG_LENGTH_POLICY.minimumWords}-${BLOG_LENGTH_POLICY.maximumWords}.`);
    }
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

    logStage(requestId, "independent_review.started");
    const review = await requestStructured(
      "independent_review", IndependentReviewSchema, "independent_article_review", [
        {
          role: "system",
          content: "You are an independent fact checker and content evaluator, separate from the writer. First identify important checkable claims in the article, including FAQs, tables, and calls to action. Compare them only with the supplied verified facts: model knowledge is not evidence. Mark VERIFIED only when a fact directly supports the claim and return its exact sourceId. Unsupported scientific, health, safety, price, regulatory, local, expert, and statistical claims are high risk. Non-numeric explanations of quote factors are permitted. Then score the article strictly: rubric fields 0-10, named quality scores 0-100. Do not reward authoritative tone; give concrete weaknesses. E-E-A-T requires useful content, transparent sourcing, and real authorship.",
        },
        {
          role: "user",
          content: JSON.stringify({
            searchIntent: {
              primaryKeyword: researchBrief.searchIntent.primaryKeyword,
              readerProblem: researchBrief.searchIntent.readerProblem,
              expectedAnswer: researchBrief.searchIntent.expectedAnswer,
            },
            article: removeModelReferences(markdown),
            metadata: candidateDraft.metadata,
            verifiedFacts: compactFacts(verifiedFacts),
            warnings: warnings.map(({ code, message, risk }) => ({ code, message, risk })),
            allowedInternalUrls: relevantInternalPages.map((page) => page.url),
          }),
        },
      ], 4000, 2300,
    );
    const factChecks = normalizeFactChecks(review.claims, verifiedFacts);
    const qualityAudit = review.qualityAudit;
    logStage(requestId, "independent_review.completed", { claims: factChecks.length, totalTokens });
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
    if (AUTO_BLOG_TOKEN_BUDGET - totalTokens < 9000) {
      logStage(requestId, "revision.skipped", { reason: "Insufficient budget for rewriting and independent review", totalTokens });
      break;
    }
    revisionCount += 1;
    logStage(requestId, "revision.started", { revisionCount, issues: issues.length });
    const revised = await requestStructured(
      "revision", draftPackageSchema, "revised_evidence_bound_article", [
        {
          role: "system",
          content: `You are a surgical content editor. Preserve sound sections and fix every supplied weakness. Remove unsupported claims instead of inventing support. Replace removed sentences with specific, non-factual decision guidance that helps the reader and keeps the article within the required word range. You cannot browse. Use the same closed evidence and internal URL sets.\n${WRITING_RULES}`,
        },
        {
          role: "user",
          content: JSON.stringify({
            issues,
            currentDraft: result.draft,
            verifiedFacts: compactFacts(verifiedFacts),
            allowedInternalPages: relevantInternalPages,
          }),
        },
      ], 5000, 3500, MIN_AUDIT_RESERVE,
    );
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
        researchGaps,
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
