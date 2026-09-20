import fs from "fs";
import path from "path";
import TurndownService from "turndown";
import { config } from "dotenv";
import { saveBlog } from "../lib/blog-db";

// Load environment variables
config({ path: ".env.local" });

const WP_API_URL = "https://bedbugstreatment.co.in/wp-json/wp/v2/posts?per_page=30&_embed=1";
const IMAGES_DIR = path.join(process.cwd(), "public", "images", "blogs");

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  hr: "---",
  bulletListMarker: "-",
});

// Configure turndown rules to preserve useful elements
turndown.addRule("cleanDivs", {
  filter: ["div", "section", "header", "footer", "article"],
  replacement: function (content) {
    return "\n\n" + content + "\n\n";
  },
});

function decodeHtml(str: string): string {
  return str
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "\x27")
    .replace(/&#8217;/g, "\x27")
    .replace(/&#8216;/g, "\x27")
    .replace(/&#8220;/g, "\"")
    .replace(/&#8221;/g, "\"")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "...")
    .replace(/&nbsp;/g, " ")
    .replace(/\r?\n|\r/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\|/g, "\\|")
    .trim();
}

function getTableCells(tableHtml: string): string[] {
  const cellMatches = tableHtml.match(/<(th|td)[\s\S]*?<\/\1>/gi) || [];
  return cellMatches.map((c) => decodeHtml(c)).filter((t) => t.length > 0);
}

function htmlTableToMarkdown(htmlTable: string): string {
  const rowMatches = htmlTable.match(/<tr[\s\S]*?<\/tr>/gi) || [];
  if (rowMatches.length === 0) return "";
  const rows: string[][] = [];
  for (const trHtml of rowMatches) {
    const cellMatches = trHtml.match(/<(th|td)[\s\S]*?<\/\1>/gi) || [];
    const row = cellMatches.map((c) => decodeHtml(c));
    if (row.length > 0) rows.push(row);
  }
  if (rows.length === 0) return "";
  const maxCols = Math.max(...rows.map((r) => r.length));
  if (maxCols === 0) return "";
  const normalized = rows.map((r) => {
    const copy = [...r];
    while (copy.length < maxCols) copy.push("");
    return copy;
  });
  const headerRow = normalized[0];
  const dataRows = normalized.slice(1);
  return [
    "| " + headerRow.join(" | ") + " |",
    "| " + headerRow.map(() => "---").join(" | ") + " |",
    ...dataRows.map((r) => "| " + r.join(" | ") + " |"),
  ].join("\n");
}

// Download image and return public relative URL
async function downloadImage(remoteUrl: string, slug: string): Promise<string | null> {
  try {
    const extMatch = remoteUrl.match(/\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i);
    const ext = extMatch ? extMatch[1].toLowerCase() : "png";
    const filename = `${slug}.${ext === "jpeg" ? "jpg" : ext}`;
    const filePath = path.join(IMAGES_DIR, filename);

    // If file already exists and has nonzero size, return existing path
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
      return `/images/blogs/${filename}`;
    }

    const res = await fetch(remoteUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!res.ok) {
      console.warn(`[fetch-blogs] Failed to download image: ${remoteUrl} (${res.status})`);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);
    console.log(`[fetch-blogs] Downloaded image: /images/blogs/${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
    return `/images/blogs/${filename}`;
  } catch (err) {
    console.error(`[fetch-blogs] Image download error for ${remoteUrl}:`, err);
    return null;
  }
}

function cleanHtml(rawHtml: string): string {
  return rawHtml
    // Remove elementor boilerplate or form blocks
    .replace(/<form[\s\S]*?<\/form>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/data-elementor-[^=]+="[^"]*"/gi, "")
    .replace(/class="elementor-[^"]*"/gi, "")
    .trim();
}

function extractReadTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export async function fetchTopBlogs() {
  console.log(`[fetch-blogs] Fetching top 30 blogs from: ${WP_API_URL}`);
  const res = await fetch(WP_API_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`WordPress API returned ${res.status}: ${res.statusText}`);
  }

  const posts = await res.json();
  console.log(`[fetch-blogs] Fetched ${posts.length} posts from WordPress`);

  const results = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const slug = post.slug || `post-${post.id}`;
    const rawTitle = post.title?.rendered || "Untitled";
    // Unescape HTML entities in title
    const title = rawTitle
      .replace(/&#8217;/g, "'")
      .replace(/&#8211;/g, "–")
      .replace(/&#8212;/g, "—")
      .replace(/&#038;/g, "&")
      .replace(/&amp;/g, "&")
      .replace(/&#045;/g, "-")
      .replace(/&quot;/g, '"');

    console.log(`\n[${i + 1}/${posts.length}] Processing: ${slug} ("${title}")`);

    // Extract featured image
    const featuredMediaUrl = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
    let localImageUrl: string | null = null;

    if (featuredMediaUrl) {
      localImageUrl = await downloadImage(featuredMediaUrl, slug);
    }

    // Extract all images in content
    const contentHtml = post.content?.rendered || "";
    const imgMatches = [...contentHtml.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map((m) => m[1]);
    const images: Array<{ url: string; alt?: string; title?: string }> = [];

    if (localImageUrl) {
      images.push({ url: localImageUrl, alt: title, title });
    }

    // Download additional content images (up to 2 per post to avoid huge downloads)
    for (let cIdx = 0; cIdx < Math.min(imgMatches.length, 2); cIdx++) {
      const cImgUrl = imgMatches[cIdx];
      if (cImgUrl && !cImgUrl.includes(slug)) {
        const cLocal = await downloadImage(cImgUrl, `${slug}-content-${cIdx + 1}`);
        if (cLocal) {
          images.push({ url: cLocal, alt: `${title} illustration ${cIdx + 1}` });
        }
      }
    }

    // Clean HTML and convert to Markdown
    const cleaned = cleanHtml(contentHtml);
    let markdown = turndown.turndown(cleaned);

    // Reconstruct and insert GFM tables if present in HTML
    const tableMatches = (cleaned || "").match(/<table[\s\S]*?<\/table>/gi) || [];
    for (const tHtml of tableMatches) {
      const gfmTable = htmlTableToMarkdown(tHtml);
      if (!gfmTable) continue;
      const cells = getTableCells(tHtml);
      if (cells.length < 2) continue;
      const firstCell = cells[0];
      const lastCell = cells[cells.length - 1];
      const p1 = markdown.indexOf(firstCell);
      const p2 = markdown.indexOf(lastCell, p1 !== -1 ? p1 : 0);
      if (p1 !== -1 && p2 !== -1 && p2 >= p1) {
        markdown = markdown.substring(0, p1) + "\n\n" + gfmTable + "\n\n" + markdown.substring(p2 + lastCell.length);
      }
    }

    // If title isn't in markdown H1, prepend it
    if (!markdown.startsWith("# ")) {
      markdown = `# ${title}\n\n${markdown}`;
    }

    // Clean excerpt
    const rawExcerpt = post.excerpt?.rendered || "";
    const excerpt = rawExcerpt
      .replace(/<[^>]+>/g, "")
      .replace(/\n+/g, " ")
      .trim()
      .slice(0, 200);

    const readTime = extractReadTime(markdown);

    // Derive primary keyword from slug or title
    const primaryKeyword = slug.replace(/-/g, " ");

    const blogItem = {
      slug,
      title,
      topic: "Bed Bug Pest Control & Treatment",
      primaryKeyword,
      keywords: [primaryKeyword, "bed bugs treatment", "pest control"],
      markdown: markdown.replace(/^\s*#\s+[^\n]+(?:\r?\n)+/, ""),
      contentHtml: cleaned,
      excerpt: excerpt || `Learn all about ${title.toLowerCase()} with expert tips and treatment methods.`,
      imageUrl: localImageUrl || featuredMediaUrl || "",
      images,
      status: "published" as const,
      publicationStatus: "READY" as const,
      autoPublishEligible: true,
      author: "Bed Bug Treatment Team",
      readTime,
      createdAt: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
      updatedAt: post.modified ? new Date(post.modified).toISOString() : new Date().toISOString(),
    };

    const saved = await saveBlog(blogItem);
    results.push(saved.blog);
    console.log(`  ✓ Saved to ${saved.backend} store (Image: ${saved.blog.imageUrl})`);
  }

  console.log(`\n🎉 Successfully fetched and saved ${results.length} blogs!`);
  return results;
}

// Allow running directly via CLI
if (require.main === module) {
  fetchTopBlogs()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Fatal error:", err);
      process.exit(1);
    });
}
