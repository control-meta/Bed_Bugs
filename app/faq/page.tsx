import type { Metadata } from "next";
import { Mail, MessageCircle, PhoneCall } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { FaqAccordion } from "@/components/faq-accordion";
import { CtaSection } from "@/components/home/cta-section";
import { faqs, site } from "@/lib/site";

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

const supportChannels = [
  {
    icon: PhoneCall,
    label: site.phoneDisplay,
    note: "Call us — 24/7 bookings",
    href: site.phoneHref,
    external: false,
  },
  {
    icon: MessageCircle,
    label: "Chat on WhatsApp",
    note: "Fastest response",
    href: site.whatsappHref,
    external: true,
  },
  {
    icon: Mail,
    label: site.email,
    note: "Replies within hours",
    href: site.emailHref,
    external: false,
  },
];

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

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.55fr] lg:items-start lg:gap-10">
            <aside className="lg:sticky lg:top-24 lg:flex lg:min-h-[72vh] lg:items-center lg:self-start">
              <div className="w-full rounded-3xl bg-ink p-6 text-white">
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-600/20 px-3 py-1 text-xs font-semibold text-brand-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                  {site.hours}
                </span>
                <h2 className="mt-3 font-display text-lg font-bold">
                  Still have questions?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  Our team is one call away. Reach out and we will help you
                  choose the right treatment for your home or business.
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  {supportChannels.map((channel) => (
                    <a
                      key={channel.label}
                      href={channel.href}
                      {...(channel.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/5 px-4 py-3 transition hover:border-white/30 hover:bg-white/10"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600/20 text-brand-400">
                        <channel.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">
                          {channel.label}
                        </span>
                        <span className="block text-xs text-white/50">
                          {channel.note}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>

            </aside>

            <div>
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
                <FaqAccordion items={faqs} defaultOpen={0} pageSize={3} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaSection className="-mt-6 pb-12 pt-2 lg:-mt-10 lg:pb-16 lg:pt-4" />
    </>
  );
}
