import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { FaqAccordion } from "@/components/faq-accordion";
import { CtaSection } from "@/components/home/cta-section";
import { mainFaqs } from "@/lib/site";
import { getPageSeo, getAllImageAltMap } from "@/lib/seo-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/faq");
  return {
    title: {
      absolute: seo.title,
    },
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonical || "https://bedbugstreatment.co.in/faq",
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
  };
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: mainFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default async function FaqPage() {
  const altMap = await getAllImageAltMap();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHero
        altMap={altMap}
        eyebrow="Help Center"
        radarSize="compact"
        title={
          <>
            Frequently asked{" "}
            <span className="text-brand-600">questions</span>
          </>
        }
        description="Everything you need to know about our bed bug treatment — safety, pricing, preparation and warranties. Open a question to read the answer."
      />

      <section className="bg-white py-12 max-sm:pt-6 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="left"
            size="compact"
            eyebrow="Answers"
            title={
              <>
                Everything about our{" "}
                <span className="text-brand-600">bed bug treatment</span>
              </>
            }
            description="Tap a question to reveal the answer. Only one answer stays open at a time, so it is easy to follow."
          />
          <div className="mt-6">
            <FaqAccordion items={mainFaqs} defaultOpen={-1} pageSize={3} />
          </div>
        </div>
      </section>

      <CtaSection altMap={altMap} className="-mt-6 pb-12 pt-2 lg:-mt-10 lg:pb-16 lg:pt-4" />
    </>
  );
}
