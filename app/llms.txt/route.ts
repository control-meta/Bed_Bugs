import { locations } from "@/lib/locations";
import { getAllBlogs, readLocalBlogs } from "@/lib/blog-db";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bedbugstreatment.co.in";

  let blogs: any[] = [];
  try {
    const fetchPromise = getAllBlogs({ status: "published" });
    const timeoutPromise = new Promise<any[]>((resolve) =>
      setTimeout(() => {
        try {
          const local = readLocalBlogs().filter((b) => b.status === "published");
          resolve(local);
        } catch {
          resolve([]);
        }
      }, 750)
    );
    blogs = await Promise.race([fetchPromise, timeoutPromise]);
  } catch (err) {
    try {
      blogs = readLocalBlogs().filter((b) => b.status === "published");
    } catch {
      blogs = [];
    }
  }

  const lines: string[] = [
    "# Bed Bug Treatment India - LLM Directory",
    "> Professional bed bug treatment, inspection, and eradication services across India. Odorless, safe, and guaranteed bed bug control with 12-month warranty protection.",
    "",
    "## Core Pages",
    `- [Homepage](${baseUrl}): Government-approved, odorless bed bug extermination services across India.`,
    `- [Services](${baseUrl}/services): Comprehensive one-time and 1-year AMC bed bug treatment options.`,
    `- [About Us](${baseUrl}/about): Information about our team, certifications, experience, and safety standards.`,
    `- [Frequently Asked Questions](${baseUrl}/faq): Common questions and answers about bed bug treatments and preparation.`,
    `- [Contact Us](${baseUrl}/contact): Book an inspection or contact our customer support team.`,
    `- [Blog Index](${baseUrl}/blog): Educational guides, pest identification, home tips, and eradication insights.`,
    "",
    "## Service Locations",
    ...locations.map(
      (loc) =>
        `- [Bed Bug Treatment in ${loc.name}](${baseUrl}/${loc.slug}): ${loc.tagline || `Specialized bed bug eradication and inspection in ${loc.name}, ${loc.state}.`}`
    ),
    "",
    "## Blog Posts & Educational Guides",
    ...blogs.map((b) => {
      const desc = b.excerpt || b.metaDescription || b.title;
      return `- [${b.title}](${baseUrl}/${b.slug}): ${desc.replace(/\r?\n|\r/g, " ").trim()}`;
    }),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=86400",
    },
  });
}
