import type { Metadata } from "next";
import Script from "next/script";
import { Hero } from "@/components/hero";
import { WhySection } from "@/components/home/why-section";
import { LocationsSection } from "@/components/home/locations-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { FaqSection } from "@/components/home/faq-section";
import { CtaSection } from "@/components/home/cta-section";
import { TreatmentOptionsSection } from "@/components/treatment-options-section";
import { getPageSeo, getAllImageAltMap } from "@/lib/seo-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/");
  return {
    title: {
      absolute: seo.title,
    },
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonical || "https://bedbugstreatment.co.in/",
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [
        {
          url: seo.ogImage || "/images/og-share.jpg",
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage || "/images/og-share.jpg"],
    },
    verification: {
      google: "WSCksZqN235FUmro6h6sNEW0VRcCF0yDhXzkr-jK-TA",
    },
  };
}

export default async function Home() {
  const altMap = await getAllImageAltMap();

  return (
    <>
      <Script
        id="seo-alt-map"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.__SEO_ALT_MAP__ = ${JSON.stringify(altMap)};`,
        }}
      />
      <Hero altMap={altMap} />
      <WhySection altMap={altMap} />
      <TreatmentOptionsSection />
      <LocationsSection />
      <TestimonialsSection pageSlug="/" />
      <FaqSection />
      <CtaSection altMap={altMap} />
    </>
  );
}
