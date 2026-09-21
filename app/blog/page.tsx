import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { BlogList } from "@/components/blog-list";
import { getAllBlogs } from "@/lib/blog-db";
import { checkAndExecuteDueAutoPublish } from "@/lib/auto-publish-service";
import { FloatingBubblesBg } from "@/components/floating-bubbles-bg";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "Blog | Bed Bug Treatment Tips, Guides & Pest Control Insights",
  },
  description:
    "Read expert bed bug treatment tips, prevention guides and pest control insights. For immediate help, call +91 97693 21234.",
};

export default async function BlogPage() {
  // Check if any scheduled auto-publish post is due and execute
  try {
    await checkAndExecuteDueAutoPublish();
  } catch (err) {
    console.warn("[blog-page] Scheduled auto-publish check notice:", err);
  }

  const blogs = await getAllBlogs({ status: "published" });

  return (
    <>
      <PageHero
        eyebrow="Insights & Guides"
        radarSize="compact"
        tightBottom
        title={
          <>
            Bed bug <span className="text-brand-600">knowledge hub</span>
          </>
        }
        description="Expert articles, DIY limitations, identification guides, and professional pest control insights for homes across India."
      />

      <section className="relative pb-12 md:pb-16 pt-4 md:pt-6 border-t border-neutral-200/80 overflow-hidden">
        <FloatingBubblesBg />
        <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BlogList blogs={blogs} />
        </div>
      </section>
    </>
  );
}

