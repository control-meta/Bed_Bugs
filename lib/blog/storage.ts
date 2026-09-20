import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { getSupabase } from "@/lib/supabase";
import type {
  AuditWarning,
  CannibalizationResult,
  ExistingPage,
  FactCheck,
  QualityAudit,
  ResearchBrief,
  VerifiedFact,
} from "./schemas";

export type StoredBlogArticle = {
  id: string;
  topic: string;
  primaryKeyword: string;
  slug: string;
  title: string;
  markdown: string;
  status: "draft" | "ready" | "published";
  publicationStatus: "READY" | "NEEDS_REVISION" | "BLOCKED";
  autoPublishEligible: boolean;
  research: ResearchBrief;
  evidence: VerifiedFact[];
  factChecks: FactCheck[];
  warnings: AuditWarning[];
  qualityAudit: QualityAudit;
  cannibalization: CannibalizationResult;
  revisionCount: number;
  createdAt: string;
  updatedAt: string;
};

const LOCAL_BLOG_PATH = path.join(process.cwd(), ".local_blog_articles.json");

function readLocalArticles(): StoredBlogArticle[] {
  try {
    if (!fs.existsSync(LOCAL_BLOG_PATH)) return [];
    const parsed = JSON.parse(fs.readFileSync(LOCAL_BLOG_PATH, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("[blog-storage] Could not read local article store", error);
    return [];
  }
}

function writeLocalArticles(articles: StoredBlogArticle[]) {
  fs.writeFileSync(LOCAL_BLOG_PATH, JSON.stringify(articles, null, 2), "utf8");
}

function toDatabaseRow(article: StoredBlogArticle) {
  return {
    id: article.id,
    topic: article.topic,
    primary_keyword: article.primaryKeyword,
    slug: article.slug,
    title: article.title,
    markdown: article.markdown,
    status: article.status,
    publication_status: article.publicationStatus,
    auto_publish_eligible: article.autoPublishEligible,
    research: article.research,
    evidence: article.evidence,
    fact_checks: article.factChecks,
    warnings: article.warnings,
    quality_audit: article.qualityAudit,
    cannibalization: article.cannibalization,
    revision_count: article.revisionCount,
    created_at: article.createdAt,
    updated_at: article.updatedAt,
  };
}

export async function saveBlogArticle(
  article: Omit<StoredBlogArticle, "id" | "createdAt" | "updatedAt">,
): Promise<{ article: StoredBlogArticle; backend: "supabase" | "local" }> {
  const now = new Date().toISOString();
  const stored: StoredBlogArticle = {
    ...article,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  const supabase = getSupabase();

  if (supabase) {
    const { error } = await supabase.from("blog_articles").insert(toDatabaseRow(stored));
    if (!error) {
      if (stored.evidence.length) {
        const { error: evidenceError } = await supabase.from("blog_evidence").insert(
          stored.evidence.map((fact) => ({
            article_id: stored.id,
            evidence_id: fact.id,
            claim: fact.claim,
            claim_category: fact.category,
            source_title: fact.sourceTitle,
            source_url: fact.sourceUrl,
            publisher: fact.publisher,
            publication_date: fact.publicationDate || null,
            accessed_date: fact.accessedDate,
            confidence: fact.confidence,
            source_type: fact.sourceType,
            evidence_excerpt: fact.evidenceExcerpt,
            verification: fact.verification,
          })),
        );
        if (evidenceError) {
          console.error("[blog-storage] Evidence rows were not duplicated", evidenceError.message);
        }
      }
      return { article: stored, backend: "supabase" };
    }
    console.error("[blog-storage] Supabase article save failed; using local fallback", error.message);
  }

  const articles = readLocalArticles();
  articles.unshift(stored);
  writeLocalArticles(articles.slice(0, 100));
  return { article: stored, backend: "local" };
}

export async function getPublishedBlogPages(): Promise<ExistingPage[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("blog_articles")
      .select("slug,title,topic")
      .eq("status", "published")
      .limit(500);
    if (!error) {
      return (data || []).map((article) => ({
        url: `/${article.slug}`,
        title: article.title,
        topic: article.topic,
        source: "database" as const,
      }));
    }
    console.error("[blog-storage] Published page lookup failed; using local fallback", error.message);
  }

  return readLocalArticles()
    .filter((article) => article.status === "published")
    .map((article) => ({
      url: `/${article.slug}`,
      title: article.title,
      topic: article.topic,
      source: "database" as const,
    }));
}
