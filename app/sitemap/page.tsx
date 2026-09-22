import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CtaSection } from "@/components/home/cta-section";
import { SitemapDashboard, SitemapItem } from "@/components/sitemap/sitemap-dashboard";
import { locations } from "@/lib/locations";
import { getAllBlogs, readLocalBlogs } from "@/lib/blog-db";
import { getAllImageAltMap } from "@/lib/seo-db";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Sitemap | Complete Site Directory & Navigation | Bed Bug Treatment India",
  description:
    "Explore all pages, treatment services, city branches, and educational guides on Bed Bug Treatment India. Fast search and complete website navigation directory.",
  alternates: {
    canonical: "https://bedbugstreatment.co.in/sitemap",
  },
  openGraph: {
    title: "Sitemap | Bed Bug Treatment India",
    description:
      "Explore all pages, treatment services, city branches, and educational guides on Bed Bug Treatment India.",
    url: "https://bedbugstreatment.co.in/sitemap",
  },
};

export default async function SitemapPage() {
  const baseUrl = "https://bedbugstreatment.co.in";
  const altMap = await getAllImageAltMap();

  // Core pages definition
  const coreItems: SitemapItem[] = [
    {
      url: baseUrl,
      path: "/",
      title: "Home — Certified Bed Bug Treatment",
      description:
        "Government-approved, odorless bed bug extermination services with 1-year warranty protection across India.",
      category: "core",
      priority: "1.0",
      changefreq: "weekly",
    },
    {
      url: `${baseUrl}/services`,
      path: "/services",
      title: "Our Treatment Services & Plans",
      description:
        "Complete single-service treatments, chemical spray procedures, and 1-Year Comprehensive AMC plans.",
      category: "core",
      priority: "0.9",
      changefreq: "monthly",
    },
    {
      url: `${baseUrl}/about`,
      path: "/about",
      title: "About Bed Bug Treatment India",
      description:
        "Certified technicians, licensed pest operators, chemical safety standards, and our mission to keep homes pest-free.",
      category: "core",
      priority: "0.8",
      changefreq: "monthly",
    },
    {
      url: `${baseUrl}/faq`,
      path: "/faq",
      title: "Frequently Asked Questions",
      description:
        "Clear answers on treatment duration, chemical safety, odorless sprays, pet safety, preparation, and warranties.",
      category: "core",
      priority: "0.8",
      changefreq: "monthly",
    },
    {
      url: `${baseUrl}/contact`,
      path: "/contact",
      title: "Contact & Rapid Booking",
      description:
        "24/7 dedicated helpline, emergency same-day appointments, and free instant inspection quotes.",
      category: "core",
      priority: "0.8",
      changefreq: "monthly",
    },
    {
      url: `${baseUrl}/blog`,
      path: "/blog",
      title: "Pest Education Blog & Guides",
      description:
        "Expert guides on bed bug identification, egg prevention, chemical vs heat treatments, and DIY traps.",
      category: "core",
      priority: "0.8",
      changefreq: "weekly",
    },
  ];

  // Location pages definition
  const locationItems: SitemapItem[] = locations.map((loc) => ({
    url: `${baseUrl}/${loc.slug}`,
    path: `/${loc.slug}`,
    title: `${loc.name} Bed Bug Treatment`,
    description: `Specialized bed bug inspection and guaranteed extermination services covering all neighborhoods in ${loc.name}.`,
    category: "location",
    priority: "0.9",
    changefreq: "weekly",
  }));

  // Fetch blogs with safeguard
  let blogItems: SitemapItem[] = [];
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
    const blogs = await Promise.race([fetchPromise, timeoutPromise]);
    blogItems = (blogs || []).map((blog) => ({
      url: `${baseUrl}/${blog.slug}`,
      path: `/${blog.slug}`,
      title: blog.title || "Bed Bug Guide",
      description: blog.excerpt || "Expert advice and guide on bed bug treatment and pest management.",
      category: "blog",
      priority: "0.7",
      changefreq: "monthly",
      updatedAt: blog.updatedAt || blog.createdAt,
      readTime: blog.readTime,
    }));
  } catch {
    try {
      const local = readLocalBlogs().filter((b) => b.status === "published");
      blogItems = local.map((blog) => ({
        url: `${baseUrl}/${blog.slug}`,
        path: `/${blog.slug}`,
        title: blog.title || "Bed Bug Guide",
        description: blog.excerpt || "Expert advice and guide on bed bug treatment and pest management.",
        category: "blog",
        priority: "0.7",
        changefreq: "monthly",
        updatedAt: blog.updatedAt || blog.createdAt,
        readTime: blog.readTime,
      }));
    } catch {
      blogItems = [];
    }
  }

  const allItems: SitemapItem[] = [...coreItems, ...locationItems, ...blogItems];

  return (
    <>
      <PageHero
        altMap={altMap}
        eyebrow="Site Directory"
        radarSize="compact"
        title={
          <>
            Website Directory &amp;{" "}
            <span className="text-brand-600">Sitemap</span>
          </>
        }
        description="Browse all certified bed bug treatment programs, major Indian city hubs, and expert educational guides in one organized directory."
      />

      <SitemapDashboard items={allItems} />

      <CtaSection />
    </>
  );
}
