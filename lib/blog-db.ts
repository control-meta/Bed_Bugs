import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { getSupabase } from "./supabase";
import { persistBlogAssetReferences } from "./blog/image-storage";

export type BlogItem = {
  id: string;
  slug: string;
  title: string;
  topic: string;
  primaryKeyword: string;
  keywords: string[];
  markdown: string;
  contentHtml?: string;
  excerpt?: string;
  imageUrl?: string;
  images?: Array<{ url: string; alt?: string; title?: string }>;
  status: "draft" | "ready" | "published";
  publicationStatus: "READY" | "NEEDS_REVISION" | "BLOCKED";
  autoPublishEligible: boolean;
  author?: string;
  readTime?: string;
  research?: any;
  evidence?: any[];
  factChecks?: any[];
  warnings?: any[];
  qualityAudit?: any;
  cannibalization?: any;
  revisionCount?: number;
  createdAt: string;
  updatedAt: string;
};

const LOCAL_BLOG_PATH = path.join(process.cwd(), ".local_blog_articles.json");

// Read from local JSON fallback
export function readLocalBlogs(): BlogItem[] {
  try {
    if (!fs.existsSync(LOCAL_BLOG_PATH)) return [];
    const content = fs.readFileSync(LOCAL_BLOG_PATH, "utf8");
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item: any) => ({
      id: item.id || randomUUID(),
      slug: item.slug || "",
      title: item.title || "Untitled",
      topic: item.topic || "",
      primaryKeyword: item.primaryKeyword || item.primary_keyword || "",
      keywords: Array.isArray(item.keywords)
        ? item.keywords
        : item.primaryKeyword
        ? [item.primaryKeyword]
        : [],
      markdown: item.markdown || "",
      contentHtml: item.contentHtml || item.content_html || "",
      excerpt: item.excerpt || "",
      imageUrl: item.imageUrl || item.image_url || "",
      images: Array.isArray(item.images) ? item.images : [],
      status: item.status || "published",
      publicationStatus: item.publicationStatus || item.publication_status || "READY",
      autoPublishEligible: item.autoPublishEligible ?? item.auto_publish_eligible ?? true,
      author: item.author || "Bed Bug Treatment Team",
      readTime: item.readTime || item.read_time || "5 min read",
      research: item.research || {},
      evidence: item.evidence || [],
      factChecks: item.factChecks || item.fact_checks || [],
      warnings: item.warnings || [],
      qualityAudit: item.qualityAudit || item.quality_audit || {},
      cannibalization: item.cannibalization || {},
      revisionCount: item.revisionCount || item.revision_count || 0,
      createdAt: item.createdAt || item.created_at || new Date().toISOString(),
      updatedAt: item.updatedAt || item.updated_at || new Date().toISOString(),
    }));
  } catch (err) {
    console.error("[blog-db] Error reading local blogs:", err);
    return [];
  }
}

// Write to local JSON fallback
export function writeLocalBlogs(blogs: BlogItem[]): void {
  try {
    fs.writeFileSync(LOCAL_BLOG_PATH, JSON.stringify(blogs, null, 2), "utf8");
  } catch (err) {
    console.error("[blog-db] Error writing local blogs:", err);
  }
}

function rowToBlog(row: any): BlogItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    topic: row.topic || "",
    primaryKeyword: row.primary_keyword || "",
    keywords: Array.isArray(row.keywords) ? row.keywords : [],
    markdown: row.markdown || "",
    contentHtml: row.content_html || "",
    excerpt: row.excerpt || "",
    imageUrl: row.image_url || "",
    images: Array.isArray(row.images) ? row.images : [],
    status: row.status || "published",
    publicationStatus: row.publication_status || "READY",
    autoPublishEligible: row.auto_publish_eligible ?? true,
    author: row.author || "Bed Bug Treatment Team",
    readTime: row.read_time || "5 min read",
    research: row.research || {},
    evidence: row.evidence || [],
    factChecks: row.fact_checks || [],
    warnings: row.warnings || [],
    qualityAudit: row.quality_audit || {},
    cannibalization: row.cannibalization || {},
    revisionCount: row.revision_count || 0,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

function blogToRow(blog: BlogItem): Record<string, any> {
  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    topic: blog.topic,
    primary_keyword: blog.primaryKeyword,
    keywords: blog.keywords,
    markdown: blog.markdown,
    content_html: blog.contentHtml || "",
    excerpt: blog.excerpt || "",
    image_url: blog.imageUrl || "",
    images: blog.images || [],
    status: blog.status,
    publication_status: blog.publicationStatus,
    auto_publish_eligible: blog.autoPublishEligible,
    author: blog.author || "Bed Bug Treatment Team",
    read_time: blog.readTime || "5 min read",
    research: blog.research || {},
    evidence: blog.evidence || [],
    fact_checks: blog.factChecks || [],
    warnings: blog.warnings || [],
    quality_audit: blog.qualityAudit || {},
    cannibalization: blog.cannibalization || {},
    revision_count: blog.revisionCount || 0,
    created_at: blog.createdAt,
    updated_at: blog.updatedAt,
  };
}

// Fetch all blogs with optional search/status filter
export async function getAllBlogs(options?: {
  search?: string;
  status?: string;
}): Promise<BlogItem[]> {
  const supabase = getSupabase();
  let blogs: BlogItem[] = [];

  if (supabase) {
    try {
      // First try 'blogs' table, then fallback to 'blog_articles'
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        blogs = data.map(rowToBlog);
      } else {
        const { data: artData, error: artError } = await supabase
          .from("blog_articles")
          .select("*")
          .order("created_at", { ascending: false });

        if (!artError && artData && artData.length > 0) {
          blogs = artData.map(rowToBlog);
        }
      }
    } catch (err) {
      console.warn("[blog-db] Supabase query failed, using local store:", err);
    }
  }

  // If Supabase returned nothing or was unavailable, read local
  if (blogs.length === 0) {
    blogs = readLocalBlogs();
  }

  // Ensure consistent newest-first order (post #1 first)
  blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Filter if search/status requested
  let filtered = blogs;
  if (options?.status && options.status !== "all") {
    filtered = filtered.filter((b) => b.status === options.status);
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        b.primaryKeyword.toLowerCase().includes(q) ||
        b.topic.toLowerCase().includes(q),
    );
  }

  return filtered;
}

export type SitemapBlogItem = {
  slug: string;
  lastmod: string;
};

// Fast, lightweight query for sitemap generation without downloading heavy HTML/markdown payloads
export async function getSitemapBlogs(): Promise<SitemapBlogItem[]> {
  const supabase = getSupabase();
  const now = new Date().toISOString();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("slug, status, updated_at, created_at")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data
          .filter((row: any) => !row.status || row.status === "published")
          .map((row: any) => ({
            slug: (row.slug || "").replace(/^\/|\/$/g, ""),
            lastmod: row.updated_at || row.created_at || now,
          }))
          .filter((item: SitemapBlogItem) => item.slug.length > 0);
      }

      // Fallback to blog_articles table if used
      const { data: artData, error: artError } = await supabase
        .from("blog_articles")
        .select("slug, status, updated_at, created_at")
        .order("created_at", { ascending: false });

      if (!artError && artData && artData.length > 0) {
        return artData
          .filter((row: any) => !row.status || row.status === "published")
          .map((row: any) => ({
            slug: (row.slug || "").replace(/^\/|\/$/g, ""),
            lastmod: row.updated_at || row.created_at || now,
          }))
          .filter((item: SitemapBlogItem) => item.slug.length > 0);
      }
    } catch (err) {
      console.warn("[blog-db] Supabase sitemap query failed, falling back to local store:", err);
    }
  }

  // Fallback to local store
  try {
    const local = readLocalBlogs();
    return local
      .filter((b) => !b.status || b.status === "published")
      .map((b) => ({
        slug: (b.slug || "").replace(/^\/|\/$/g, ""),
        lastmod: b.updatedAt || b.createdAt || now,
      }))
      .filter((item) => item.slug.length > 0);
  } catch {
    return [];
  }
}

// Get single blog by ID
export async function getBlogById(id: string): Promise<BlogItem | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data } = await supabase.from("blogs").select("*").eq("id", id).maybeSingle();
      if (data) return rowToBlog(data);

      const { data: artData } = await supabase.from("blog_articles").select("*").eq("id", id).maybeSingle();
      if (artData) return rowToBlog(artData);
    } catch {}
  }

  const local = readLocalBlogs();
  return local.find((b) => b.id === id) || null;
}

// Get single blog by Slug
export async function getBlogBySlug(slug: string): Promise<BlogItem | null> {
  const cleanSlug = slug.replace(/^\/|\/$/g, "");
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data } = await supabase.from("blogs").select("*").eq("slug", cleanSlug).maybeSingle();
      if (data) return rowToBlog(data);

      const { data: artData } = await supabase.from("blog_articles").select("*").eq("slug", cleanSlug).maybeSingle();
      if (artData) return rowToBlog(artData);
    } catch {}
  }

  const local = readLocalBlogs();
  return local.find((b) => b.slug === cleanSlug || b.slug === slug) || null;
}

// Save or update blog
export async function saveBlog(
  blog: Partial<BlogItem> & { title: string; slug: string },
): Promise<{ blog: BlogItem; backend: "supabase" | "local" }> {
  const now = new Date().toISOString();
  const existing = blog.id ? await getBlogById(blog.id) : await getBlogBySlug(blog.slug);
  const durableAssets = await persistBlogAssetReferences({
    markdown: blog.markdown ?? existing?.markdown ?? "",
    imageUrl: blog.imageUrl ?? existing?.imageUrl ?? "",
    images: blog.images ?? existing?.images ?? [],
  });

  const complete: BlogItem = {
    id: existing?.id || blog.id || randomUUID(),
    slug: blog.slug.replace(/^\/|\/$/g, ""),
    title: blog.title,
    topic: blog.topic ?? existing?.topic ?? "",
    primaryKeyword: blog.primaryKeyword ?? existing?.primaryKeyword ?? "",
    keywords: blog.keywords ?? existing?.keywords ?? (blog.primaryKeyword ? [blog.primaryKeyword] : []),
    markdown: durableAssets.markdown.replace(/^\s*#\s+[^\n]+(?:\r?\n)+/, ""),
    contentHtml: blog.contentHtml ?? existing?.contentHtml ?? "",
    excerpt: blog.excerpt ?? existing?.excerpt ?? "",
    imageUrl: durableAssets.imageUrl,
    images: durableAssets.images,
    status: blog.status ?? existing?.status ?? "published",
    publicationStatus: blog.publicationStatus ?? existing?.publicationStatus ?? "READY",
    autoPublishEligible: blog.autoPublishEligible ?? existing?.autoPublishEligible ?? true,
    author: blog.author ?? existing?.author ?? "Bed Bug Treatment Team",
    readTime: blog.readTime ?? existing?.readTime ?? "5 min read",
    research: blog.research ?? existing?.research ?? {},
    evidence: blog.evidence ?? existing?.evidence ?? [],
    factChecks: blog.factChecks ?? existing?.factChecks ?? [],
    warnings: blog.warnings ?? existing?.warnings ?? [],
    qualityAudit: blog.qualityAudit ?? existing?.qualityAudit ?? {},
    cannibalization: blog.cannibalization ?? existing?.cannibalization ?? {},
    revisionCount: (existing?.revisionCount ?? 0) + (blog.markdown && blog.markdown !== existing?.markdown ? 1 : 0),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  let backend: "supabase" | "local" = "local";
  const supabase = getSupabase();

  if (supabase) {
    try {
      const row = blogToRow(complete);
      const { error } = await supabase.from("blogs").upsert(row, { onConflict: "slug" });
      if (!error) {
        backend = "supabase";
      } else {
        const { error: artError } = await supabase.from("blog_articles").upsert(row, { onConflict: "slug" });
        if (!artError) backend = "supabase";
      }
    } catch (err) {
      console.warn("[blog-db] Supabase upsert failed:", err);
    }
  }

  // Always sync to local store as well
  const local = readLocalBlogs();
  const index = local.findIndex((b) => b.id === complete.id || b.slug === complete.slug);
  if (index >= 0) {
    local[index] = complete;
  } else {
    local.push(complete);
  }
  local.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  writeLocalBlogs(local);

  return { blog: complete, backend };
}

// Delete blog
export async function deleteBlog(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("blogs").delete().eq("id", id);
      await supabase.from("blog_articles").delete().eq("id", id);
    } catch (err) {
      console.warn("[blog-db] Supabase delete failed:", err);
    }
  }

  const local = readLocalBlogs();
  const updated = local.filter((b) => b.id !== id);
  writeLocalBlogs(updated);
  return true;
}

// Push all local blogs to Supabase
export async function syncBlogsToSupabase(): Promise<{ synced: number; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { synced: 0, error: "Supabase client not initialized" };

  const local = readLocalBlogs();
  if (local.length === 0) return { synced: 0 };

  try {
    const rows = local.map(blogToRow);
    const { error } = await supabase.from("blogs").upsert(rows, { onConflict: "slug" });
    if (error) {
      return { synced: 0, error: error.message };
    }
    return { synced: rows.length };
  } catch (err: any) {
    return { synced: 0, error: err.message };
  }
}
