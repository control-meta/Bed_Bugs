import { locations } from "@/lib/locations";
import { getAllBlogs } from "@/lib/blog-db";

export const revalidate = 60;

export async function GET() {
  const baseUrl = "https://bedbugstreatment.co.in";

  let content = `# Bed Bug Treatment India

> Professional bed bug treatment, inspection, and eradication services across India. Odorless, safe, and guaranteed bed bug control with 12-month warranty protection.

## Core Pages
- [Homepage](${baseUrl}/): Government-approved, odorless bed bug extermination services across India.
- [Services](${baseUrl}/services): Comprehensive one-time and 1-year AMC bed bug treatment options.
- [About Us](${baseUrl}/about): Information about our team, certifications, experience, and safety standards.
- [Frequently Asked Questions](${baseUrl}/faq): Common questions and answers about bed bug treatments and preparation.
- [Contact Us](${baseUrl}/contact): Book an inspection or contact our customer support team.
- [Blog Index](${baseUrl}/blog): Educational guides, pest identification, home tips, and eradication insights.

## Service Locations
`;

  locations.forEach((loc) => {
    content += `- [Bed Bug Treatment in ${loc.name}](${baseUrl}/${loc.slug}): ${loc.tagline}.\n`;
  });

  content += `\n## Educational Guides & Blog Posts\n`;

  try {
    const blogs = await getAllBlogs({ status: "published" });
    blogs.forEach((blog) => {
      const cleanExcerpt = (blog.excerpt || "").replace(/\r?\n|\r/g, " ").trim();
      const cleanSlug = blog.slug.replace(/^\/|\/$/g, "");
      content += `- [${blog.title}](${baseUrl}/${cleanSlug}): ${cleanExcerpt}\n`;
    });
  } catch (err) {
    console.error("[llms.txt] Error fetching blogs:", err);
  }

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
