import { MessageCircle, PhoneCall } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { FaqAccordion } from "@/components/faq-accordion";
import { faqs, site } from "@/lib/site";

export function FaqSection() {
  return (
    <section id="faq" className="bg-cream py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionHeading
              align="left"
              size="compact"
              eyebrow="FAQ"
              title={
                <>
                  Frequently asked{" "}
                  <span className="text-brand-600">questions</span>
                </>
              }
              description="Everything you need to know before booking your bed bug treatment. Still unsure? Our team is one call away."
            />
            <div className="mt-8 rounded-2xl border border-ink/10 bg-white p-5 text-center">
              <h3 className="font-display text-base font-bold text-ink">
                {site.hours}
              </h3>
              <p className="mt-2 text-sm text-ink/60">
                Have questions or need a quote? Reach out and our team will
                respond quickly.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <a
                  href={site.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500"
                >
                  <PhoneCall className="h-4 w-4" />
                  {site.phoneDisplay}
                </a>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-brand-600/40 hover:text-brand-600"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div>
            <FaqAccordion
              items={faqs.slice(0, 5)}
              pageSize={5}
              defaultOpen={-1}
            />
            <div className="mt-4 text-center">
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-500"
              >
                See all FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
