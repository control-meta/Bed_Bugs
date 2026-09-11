import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { FaqAccordion } from "@/components/faq-accordion";
import { CtaSection } from "@/components/home/cta-section";
import { faqs } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about bed bug treatment — safety, cost, preparation, warranties and what to expect. Still unsure? Call +91 97693 21234.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHero
        breadcrumb="FAQ"
        eyebrow="Help Center"
        title={
          <>
            Frequently asked{" "}
            <span className="text-brand-500">questions</span>
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
            <FaqAccordion items={faqs} defaultOpen={-1} pageSize={3} />
          </div>
        </div>
      </section>

      <CtaSection className="-mt-6 pb-12 pt-2 lg:-mt-10 lg:pb-16 lg:pt-4" />
    </>
  );
}
