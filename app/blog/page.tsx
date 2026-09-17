import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: {
    absolute: "Blog | Bed Bug Treatment Tips & Guides",
  },
  description:
    "Read expert bed bug treatment tips, prevention guides and pest control insights. For immediate help, call +91 97693 21234.",
};

export default function BlogPage() {
  return (
    <PageHero
      eyebrow="Insights"
      radarSize="compact"
      title={
        <>
          Bed bug <span className="text-brand-600">blog</span>
        </>
      }
      description="Articles, tips and guides on bed bug prevention, detection and treatment."
    />
  );
}
