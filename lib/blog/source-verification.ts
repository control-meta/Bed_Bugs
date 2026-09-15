import { lookup } from "dns/promises";
import { isIP } from "net";
import type { EvidenceCandidate, VerifiedFact } from "./schemas";
import { highRiskClaimCategories } from "./schemas";
import { normalizeUrl, similarity } from "./safety";

type RetrievedPage = {
  finalUrl: string;
  title: string;
  text: string;
};

export type RejectedEvidence = {
  claim: string;
  sourceUrl: string;
  reason: string;
};

const MAX_SOURCE_BYTES = 750_000;
const SOURCE_TIMEOUT_MS = 9_000;

function isPrivateIp(address: string): boolean {
  if (address === "::1" || address === "0.0.0.0" || address.startsWith("fe80:")) return true;
  if (address.startsWith("fc") || address.startsWith("fd")) return true;
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some(Number.isNaN)) return false;
  return (
    parts[0] === 10 ||
    parts[0] === 127 ||
    (parts[0] === 169 && parts[1] === 254) ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168)
  );
}

async function assertPublicUrl(value: string): Promise<URL> {
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error("Only HTTPS sources are accepted");
  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".local") || isIP(hostname) && isPrivateIp(hostname)) {
    throw new Error("Private network sources are not accepted");
  }
  const addresses = await lookup(hostname, { all: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateIp(address))) {
    throw new Error("Source hostname did not resolve to a public address");
  }
  return url;
}

function decodeHtml(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function htmlToText(html: string): string {
  return decodeHtml(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function excerptCoverage(excerpt: string, pageText: string): number {
  const terms = (value: string) => new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3),
  );
  const excerptTerms = terms(excerpt);
  const pageTerms = terms(pageText);
  if (!excerptTerms.size) return 0;
  const present = [...excerptTerms].filter((word) => pageTerms.has(word)).length;
  return present / excerptTerms.size;
}

async function retrieveSource(value: string): Promise<RetrievedPage> {
  await assertPublicUrl(value);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SOURCE_TIMEOUT_MS);
  try {
    const response = await fetch(value, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml,text/plain;q=0.9",
        "User-Agent": "BedBugsTreatmentContentVerifier/1.0",
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get("content-type") || "";
    if (!/(?:text\/html|application\/xhtml\+xml|text\/plain)/i.test(contentType)) {
      throw new Error(`Unsupported source content type: ${contentType || "unknown"}`);
    }
    const declaredLength = Number(response.headers.get("content-length") || 0);
    if (declaredLength > MAX_SOURCE_BYTES) throw new Error("Source page is too large to verify safely");
    const html = (await response.text()).slice(0, MAX_SOURCE_BYTES);
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? htmlToText(titleMatch[1]) : "";
    const text = contentType.includes("text/plain") ? html : htmlToText(html);
    if (text.length < 200) throw new Error("Source page did not expose enough readable text");
    return { finalUrl: response.url, title, text };
  } finally {
    clearTimeout(timeout);
  }
}

function isFreshEnough(candidate: EvidenceCandidate): boolean {
  if (!candidate.freshnessMatters) return true;
  if (!candidate.publicationDate) {
    return !["PRICE_CLAIM", "STATISTICAL_CLAIM", "BUSINESS_CLAIM"].includes(candidate.category);
  }
  const timestamp = Date.parse(candidate.publicationDate);
  if (Number.isNaN(timestamp)) return false;
  const ageMs = Date.now() - timestamp;
  const maximumAgeYears = candidate.category === "PRICE_CLAIM" ? 2 : 8;
  return ageMs <= maximumAgeYears * 365.25 * 24 * 60 * 60 * 1000;
}

export function collectWebSearchUrls(response: { output?: unknown[] }): Set<string> {
  const urls = new Set<string>();
  for (const item of response.output || []) {
    if (!item || typeof item !== "object") continue;
    const outputItem = item as {
      type?: string;
      action?: { sources?: Array<{ url?: string }>; url?: string };
      content?: Array<{
        annotations?: Array<{ type?: string; url?: string }>;
      }>;
    };
    if (outputItem.type === "web_search_call") {
      const action = outputItem.action;
      for (const source of action?.sources || []) {
        if (source?.url) urls.add(normalizeUrl(source.url));
      }
      if (action?.url) urls.add(normalizeUrl(action.url));
    }
    if (outputItem.type === "message") {
      for (const content of outputItem.content || []) {
        for (const annotation of content?.annotations || []) {
          if (annotation?.type === "url_citation" && annotation.url) {
            urls.add(normalizeUrl(annotation.url));
          }
        }
      }
    }
  }
  return urls;
}

export async function verifyEvidenceCandidates(
  candidates: EvidenceCandidate[],
  discoveredUrls: Set<string>,
): Promise<{ verifiedFacts: VerifiedFact[]; rejectedEvidence: RejectedEvidence[] }> {
  const accessedDate = new Date().toISOString().slice(0, 10);
  const uniqueCandidates = candidates.filter(
    (candidate, index, all) =>
      all.findIndex(
        (other) => normalizeUrl(other.sourceUrl) === normalizeUrl(candidate.sourceUrl) && similarity(other.claim, candidate.claim) >= 0.8,
      ) === index,
  );

  const results = await Promise.all(
    uniqueCandidates.slice(0, 16).map(async (candidate, index) => {
      const normalizedCandidateUrl = normalizeUrl(candidate.sourceUrl);
      if (!discoveredUrls.has(normalizedCandidateUrl)) {
        return { rejected: { claim: candidate.claim, sourceUrl: candidate.sourceUrl, reason: "URL was not present in web-search results" } };
      }
      if (highRiskClaimCategories.has(candidate.category) && ["industry", "other"].includes(candidate.sourceType)) {
        return { rejected: { claim: candidate.claim, sourceUrl: candidate.sourceUrl, reason: "Source quality is too low for this claim category" } };
      }
      if (!isFreshEnough(candidate)) {
        return { rejected: { claim: candidate.claim, sourceUrl: candidate.sourceUrl, reason: "A current source was required but no sufficiently recent date was verified" } };
      }
      try {
        const page = await retrieveSource(candidate.sourceUrl);
        const finalUrl = normalizeUrl(page.finalUrl);
        if (finalUrl !== normalizedCandidateUrl && !discoveredUrls.has(finalUrl)) {
          throw new Error("Source redirected to a URL outside the research result set");
        }
        const titleMatched = similarity(candidate.sourceTitle, page.title) >= 0.45;
        const excerptMatched = excerptCoverage(candidate.evidenceExcerpt, page.text) >= 0.78;
        if (!titleMatched) throw new Error("Retrieved page title did not match the reported source title");
        if (!excerptMatched) throw new Error("Retrieved page did not contain the reported supporting excerpt");
        const fact: VerifiedFact = {
          id: `S${index + 1}`,
          claim: candidate.claim,
          category: candidate.category,
          sourceTitle: page.title || candidate.sourceTitle,
          sourceUrl: page.finalUrl,
          publisher: candidate.publisher,
          publicationDate: candidate.publicationDate,
          accessedDate,
          confidence: Math.min(candidate.confidence, 0.99),
          sourceType: candidate.sourceType,
          evidenceExcerpt: candidate.evidenceExcerpt,
          verification: {
            discoveredByWebSearch: true,
            urlAccessible: true,
            titleMatched: true,
            excerptMatched: true,
          },
        };
        return { fact };
      } catch (error) {
        return {
          rejected: {
            claim: candidate.claim,
            sourceUrl: candidate.sourceUrl,
            reason: error instanceof Error ? error.message : "Source verification failed",
          },
        };
      }
    }),
  );

  return {
    verifiedFacts: results.flatMap((result) => result.fact ? [result.fact] : []),
    rejectedEvidence: results.flatMap((result) => result.rejected ? [result.rejected] : []),
  };
}
