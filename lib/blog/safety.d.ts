import type {
  AuditWarning,
  CannibalizationResult,
  ExistingPage,
  FactCheck,
  VerifiedFact,
} from "./schemas";

export const GENERIC_PHRASES: string[];
export function normalizeUrl(value: string): string;
export function extractUrls(markdown: string): string[];
export function similarity(left: string, right: string): number;
export function supportSimilarity(left: string, right: string): number;
export function scanHallucinations(
  markdown: string,
  facts?: VerifiedFact[],
  allowedInternalUrls?: string[],
): AuditWarning[];
export function calculateCannibalization(
  topic: string,
  pages: ExistingPage[],
): CannibalizationResult;
export function calculateDeterministicScores(input: {
  markdown: string;
  metadata: { seoTitle: string; metaDescription: string; h1: string };
  facts: VerifiedFact[];
  warnings: AuditWarning[];
  factChecks: FactCheck[];
  primaryKeyword: string;
}): {
  seoQuality: number;
  contentQuality: number;
  factualConfidence: number;
  eeat: number;
  informationGain: number;
};
