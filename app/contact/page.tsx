import type { Metadata } from "next";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { CtaSection } from "@/components/home/cta-section";
import { cities, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Book a free bed bug inspection or get a quote. Call +91 97693 21234, WhatsApp us or fill the form — same-day service across Pune, Mumbai, Bangalore, Delhi & Noida.",
};

const contactCards = [
  {
    icon: PhoneCall,
    title: "Call Us",
    value: site.phoneDisplay,
    note: "Mon–Sun · 24/7 bookings",
    href: site.phoneHref,
    external: false,
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "Chat with our team",
    note: "Fastest response, share photos",
    href: site.whatsappHref,
    external: true,
  },
  {
    icon: Mail,
    title: "Email Us",
    value: site.email,
    note: "Replies within a few hours",
    href: site.emailHref,
    external: false,
  },
  {
    icon: Clock,
    title: "Working Hours",
    value: site.hours,
    note: "Emergency treatments available",
    href: null,
    external: false,
  },
];

const assurances = [
  "Same-day FREE inspection",
  "100% odorless & family-safe",
  "Trained technicians",
  "12-month service warranty",
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        breadcrumb="Contact Us"
        eyebrow="Get In Touch"
        title={
          <>
            Book a free{" "}
            <span className="text-brand-500">bed bug inspection</span>
          </>
        }
        description="Call, WhatsApp or send us a message — our team responds quickly and can often schedule a same-day visit. 24/7 support across all service cities."
      />

      <section className="relative z-20 -mt-10 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((card) => {
              const content = (
                <>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600">
                    <card.icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-4 font-display text-base font-bold text-ink">
                    {card.title}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-brand-700">
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs text-ink/50">{card.note}</p>
                </>
              );
              return card.href ? (
                <a
                  key={card.title}
                  href={card.href}
                  {...(card.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="rounded-3xl border border-ink/10 bg-white p-5 shadow-[0_20px_50px_-30px_rgba(23,6,9,0.4)] transition hover:-translate-y-1 hover:border-brand-600/30 hover:shadow-xl"
                >
                  {content}
                </a>
              ) : (
                <div
                  key={card.title}
                  className="rounded-3xl border border-ink/10 bg-white p-5 shadow-[0_20px_50px_-30px_rgba(23,6,9,0.4)]"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-10">
            <div>
              <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-600">
                <span className="h-px w-6 bg-current" />
                Service Coverage
              </p>
              <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                We come to you,{" "}
                <span className="text-brand-600">same day.</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink/65">
                Our local teams cover the cities below and surrounding areas.
                Share your location when you contact us and we will confirm the
                nearest available slot.
              </p>

              <ul className="mt-6 divide-y divide-ink/10 overflow-hidden rounded-3xl border border-ink/10">
                {cities.map((city) => (
                  <li
                    key={city.name}
                    className="flex items-start gap-4 bg-white px-5 py-4 transition hover:bg-cream/60"
                  >
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <div>
                      <p className="font-display text-base font-bold text-ink">
                        {city.name}
                      </p>
                      <p className="mt-0.5 text-sm text-ink/55">
                        {city.areas}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-3xl bg-ink p-6 text-white">
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-brand-400" />
                  <h3 className="font-display text-base font-bold">
                    Same-day service available
                  </h3>
                </div>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {assurances.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-white/75"
                    >
                      <ShieldCheck className="h-4 w-4 shrink-0 text-brand-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <CtaSection className="-mt-6 pb-12 pt-2 lg:-mt-10 lg:pb-16 lg:pt-4" />
    </>
  );
}
