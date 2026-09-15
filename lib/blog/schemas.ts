import { z } from "zod";

export const claimCategorySchema = z.enum([
  "GENERAL_KNOWLEDGE",
  "VERIFIABLE_FACT",
  "SCIENTIFIC_CLAIM",
  "HEALTH_CLAIM",
  "SAFETY_CLAIM",
  "REGULATORY_CLAIM",
  "PRICE_CLAIM",
  "BUSINESS_CLAIM",
  "LOCAL_CLAIM",
  "EXPERT_CLAIM",
  "STATISTICAL_CLAIM",
]);

export const highRiskClaimCategories = new Set([
  "SCIENTIFIC_CLAIM",
  "HEALTH_CLAIM",
  "SAFETY_CLAIM",
  "REGULATORY_CLAIM",
  "PRICE_CLAIM",
  "EXPERT_CLAIM",
  "STATISTICAL_CLAIM",
]);

export const sourceTypeSchema = z.enum([
  "government",
  "university",
  "public_health",
  "scientific",
  "professional",
  "industry",
  "other",
]);

export const researchBriefSchema = z.object({
  searchIntent: z.object({
    primaryKeyword: z.string(),
    primaryIntent: z.enum([
      "Informational",
      "Commercial investigation",
      "Transactional",
      "Local",
      "Navigational",
      "Mixed",
    ]),
    secondaryIntent: z.string(),
    targetReader: z.string(),
    readerProblem: z.string(),
    expectedAnswer: z.string(),
    likelyFollowUpQuestions: z.array(z.string()),
    commercialIntentLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
  }),
  topicalCoverage: z.object({
    primaryTopic: z.string(),
    secondaryTopics: z.array(z.string()),
    relatedEntities: z.array(z.string()),
    commonMisconceptions: z.array(z.string()),
    meaningfulLocalConsiderations: z.array(z.string()),
    informationGainOpportunities: z.array(z.string()),
  }),
  evidenceNeeds: z.array(
    z.object({
      question: z.string(),
      category: claimCategorySchema,
      required: z.boolean(),
      freshnessMatters: z.boolean(),
    }),
  ),
  outline: z.array(
    z.object({
      heading: z.string(),
      level: z.enum(["H2", "H3"]),
      purpose: z.string(),
      evidenceNeeded: z.boolean(),
    }),
  ),
});

export const evidenceResearchSchema = z.object({
  candidates: z.array(
    z.object({
      claim: z.string(),
      category: claimCategorySchema,
      sourceTitle: z.string(),
      sourceUrl: z.string(),
      publisher: z.string(),
      publicationDate: z.string().nullable(),
      evidenceExcerpt: z.string(),
      confidence: z.number().min(0).max(1),
      sourceType: sourceTypeSchema,
      freshnessMatters: z.boolean(),
    }),
  ),
  relatedQuestions: z.array(z.string()),
  researchGaps: z.array(z.string()),
});

export const verifiedFactSchema = z.object({
  id: z.string(),
  claim: z.string(),
  category: claimCategorySchema,
  sourceTitle: z.string(),
  sourceUrl: z.string(),
  publisher: z.string(),
  publicationDate: z.string().nullable(),
  accessedDate: z.string(),
  confidence: z.number().min(0).max(1),
  sourceType: sourceTypeSchema,
  evidenceExcerpt: z.string(),
  verification: z.object({
    discoveredByWebSearch: z.boolean(),
    urlAccessible: z.boolean(),
    titleMatched: z.boolean(),
    excerptMatched: z.boolean(),
  }),
});

export const draftPackageSchema = z.object({
  markdown: z.string(),
  metadata: z.object({
    seoTitle: z.string(),
    metaDescription: z.string(),
    urlSlug: z.string(),
    h1: z.string(),
  }),
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
  internalLinks: z.array(
    z.object({
      targetUrl: z.string(),
      anchorText: z.string(),
      section: z.string(),
      reason: z.string(),
    }),
  ),
  imageRecommendations: z.array(
    z.object({
      imageType: z.string(),
      purpose: z.string(),
      placement: z.string(),
      description: z.string(),
      altText: z.string(),
      caption: z.string(),
    }),
  ),
});

export const factCheckSchema = z.object({
  claims: z.array(
    z.object({
      claim: z.string(),
      category: claimCategorySchema,
      verificationStatus: z.enum([
        "VERIFIED",
        "PARTIALLY_VERIFIED",
        "UNVERIFIED",
        "CONTRADICTED",
      ]),
      sourceId: z.string().nullable(),
      risk: z.enum(["LOW", "MEDIUM", "HIGH"]),
      recommendedAction: z.enum([
        "KEEP",
        "QUALIFY",
        "REMOVE",
        "RESEARCH_AGAIN",
      ]),
      explanation: z.string(),
    }),
  ),
});

export const qualityAuditSchema = z.object({
  rubric: z.object({
    searchIntent: z.number().min(0).max(10),
    topicalCompleteness: z.number().min(0).max(10),
    informationGain: z.number().min(0).max(10),
    factualReliability: z.number().min(0).max(10),
    eeat: z.number().min(0).max(10),
    readability: z.number().min(0).max(10),
    structure: z.number().min(0).max(10),
    semanticCoverage: z.number().min(0).max(10),
    localRelevance: z.number().min(0).max(10),
    internalLinking: z.number().min(0).max(10),
    faqQuality: z.number().min(0).max(10),
    conversionQuality: z.number().min(0).max(10),
    originality: z.number().min(0).max(10),
  }),
  scores: z.object({
    seoQuality: z.number().min(0).max(100),
    contentQuality: z.number().min(0).max(100),
    factualConfidence: z.number().min(0).max(100),
    eeat: z.number().min(0).max(100),
    informationGain: z.number().min(0).max(100),
  }),
  weaknesses: z.array(z.string()),
  strengths: z.array(z.string()),
});

export type ClaimCategory = z.infer<typeof claimCategorySchema>;
export type ResearchBrief = z.infer<typeof researchBriefSchema>;
export type EvidenceCandidate = z.infer<typeof evidenceResearchSchema>["candidates"][number];
export type VerifiedFact = z.infer<typeof verifiedFactSchema>;
export type DraftPackage = z.infer<typeof draftPackageSchema>;
export type FactCheck = z.infer<typeof factCheckSchema>["claims"][number];
export type QualityAudit = z.infer<typeof qualityAuditSchema>;

export type AuditWarning = {
  code:
    | "UNVERIFIED_PRICE"
    | "UNVERIFIED_TECHNICAL_CLAIM"
    | "UNVERIFIED_EXPERT"
    | "UNVERIFIED_SOURCE"
    | "POSSIBLE_CONTENT_CANNIBALIZATION"
    | "WEAK_INFORMATION_GAIN"
    | "MISSING_INTERNAL_LINKS"
    | "LOW_FACTUAL_CONFIDENCE"
    | "FEAR_BASED_CTA"
    | "GENERIC_AI_LANGUAGE"
    | "UNSUPPORTED_LOCAL_CLAIM"
    | "MISSING_FAQ"
    | "UNSUPPORTED_URL";
  message: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
  excerpt?: string;
};

export type ExistingPage = {
  url: string;
  title: string;
  topic: string;
  source: "route" | "location" | "database";
};

export type CannibalizationResult = {
  risk: "LOW" | "MEDIUM" | "HIGH";
  overlappingPages: Array<ExistingPage & { similarity: number }>;
  recommendedAction:
    | "CREATE_NEW"
    | "UPDATE_EXISTING"
    | "MERGE"
    | "CHANGE_SEARCH_INTENT"
    | "CREATE_SUPPORTING_ARTICLE";
};
