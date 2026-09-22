import { locations } from "@/lib/locations";
import { getSitemapBlogs } from "@/lib/blog-db";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

function safeIsoDate(d: string | undefined | null, fallback: string): string {
  if (!d) return fallback;
  try {
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
  } catch {
    return fallback;
  }
}

export async function GET() {
  const baseUrl = "https://bedbugstreatment.co.in";
  const currentDate = new Date().toISOString();

  // Core pages
  const coreRoutes = [
    { url: baseUrl, lastmod: currentDate, changefreq: "weekly", priority: "1.0" },
    { url: `${baseUrl}/services`, lastmod: currentDate, changefreq: "monthly", priority: "0.9" },
    { url: `${baseUrl}/about`, lastmod: currentDate, changefreq: "monthly", priority: "0.8" },
    { url: `${baseUrl}/faq`, lastmod: currentDate, changefreq: "monthly", priority: "0.8" },
    { url: `${baseUrl}/contact`, lastmod: currentDate, changefreq: "monthly", priority: "0.8" },
    { url: `${baseUrl}/blog`, lastmod: currentDate, changefreq: "weekly", priority: "0.8" },
  ];

  // City location landing pages
  const locationRoutes = locations.map((loc) => ({
    url: `${baseUrl}/${loc.slug}`,
    lastmod: currentDate,
    changefreq: "weekly",
    priority: "0.9",
  }));

  // Published blog articles
  let blogRoutes: Array<{
    url: string;
    lastmod: string;
    changefreq: string;
    priority: string;
  }> = [];

  try {
    const blogs = await getSitemapBlogs();
    blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/${blog.slug}`,
      lastmod: safeIsoDate(blog.lastmod, currentDate),
      changefreq: "monthly",
      priority: "0.7",
    }));
  } catch (err) {
    console.error("[sitemap.xml] Error generating blog routes:", err);
  }

  const allRoutes = [...coreRoutes, ...locationRoutes, ...blogRoutes];

  const xmlEntries = allRoutes
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${safeIsoDate(entry.lastmod, currentDate)}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join("\n");

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;

  return new Response(xmlContent, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
