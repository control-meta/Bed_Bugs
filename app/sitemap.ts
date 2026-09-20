import type { MetadataRoute } from "next";
import { locations } from "@/lib/locations";
import { getAllBlogs } from "@/lib/blog-db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://bedbugstreatment.co.in";
  const currentDate = new Date();

  const routes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  const locationRoutes = locations.map((loc) => ({
    url: `${baseUrl}/${loc.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs = await getAllBlogs({ status: "published" });
    blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/${blog.slug}`,
      lastModified: new Date(blog.updatedAt || blog.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.error("[sitemap] Failed to load blog posts:", err);
  }

  return [...routes, ...locationRoutes, ...blogRoutes];
}
