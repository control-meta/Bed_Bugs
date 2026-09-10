import { MessageCircle, PhoneCall, Plus } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { faqs, site } from "@/lib/site";

export function FaqSection() {
  return (
    <section id="faq" className="bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title={
                <>
                  Frequently asked{" "}
                  <span className="text-brand-600">questions</span>
                </>
              }
              description="Everything you need to know before booking your bed bug treatment. Still unsure? Our team is one call away."
            />
            <div className="mt-10 rounded-3xl border border-ink/10 bg-white p-7">
              <h3 className="font-display text-lg font-bold text-ink">
                {site.hours}
              </h3>
              <p className="mt-2 text-sm text-ink/60">
                Have questions or need a quote? Reach out and our team will
                respond quickly.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={site.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
                >
                  <PhoneCall className="h-4 w-4" />
                  {site.phoneDisplay}
                </a>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold text-ink transition hover:border-brand-600/40 hover:text-brand-600"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-ink/10 bg-white px-6 py-5 open:border-brand-600/30 open:shadow-lg open:shadow-brand-600/5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600/10 text-brand-600 transition-transform duration-300 group-open:rotate-45">
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>
                <p className="mt-4 border-t border-ink/10 pt-4 text-sm leading-relaxed text-ink/60">
                  {faq.answer}
                </p>
              </details>
            ))}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-brand-600 hover:text-brand-500"
            >
              Still have questions? Contact us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
