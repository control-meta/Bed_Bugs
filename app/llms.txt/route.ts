import { NextResponse } from "next/server";
import { locations } from "@/lib/locations";
import { getAllBlogs } from "@/lib/blog-db";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = "https://bedbugstreatment.co.in";

  const staticRoutes = [
    { url: baseUrl, description: "Homepage" },
    { url: `${baseUrl}/services`, description: "Services Page" },
    { url: `${baseUrl}/about`, description: "About Us" },
    { url: `${baseUrl}/faq`, description: "Frequently Asked Questions" },
    { url: `${baseUrl}/contact`, description: "Contact Us" },
    { url: `${baseUrl}/blog`, description: "Blog Index" },
  ];

  const locationRoutes = locations.map((loc) => ({
    url: `${baseUrl}/${loc.slug}`,
    description: `Bed Bug Treatment in ${loc.name}`,
  }));

  let blogRoutes: { url: string; description: string }[] = [];
  try {
    const blogs = await getAllBlogs({ status: "published" });
    blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/${blog.slug}`,
      description: `Blog: ${blog.title}`,
    }));
  } catch (err) {
    console.error("[llms.txt] Failed to load blog posts:", err);
  }

  const allRoutes = [...staticRoutes, ...locationRoutes, ...blogRoutes];

  const content = `# Bed Bug Treatment India - LLM Context File
This file provides a directory of all available pages and blog posts on bedbugstreatment.co.in for LLM consumption.

## Core Pages
${staticRoutes.map((r) => `- [${r.description}](${r.url})`).join("\n")}

## Service Locations
${locationRoutes.map((r) => `- [${r.description}](${r.url})`).join("\n")}

## Blog Posts
${blogRoutes.length > 0 ? blogRoutes.map((r) => `- [${r.description}](${r.url})`).join("\n") : "No blog posts currently available."}
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
