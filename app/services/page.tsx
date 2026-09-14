import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BedDouble,
  Bug,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Home,
  Hotel,
  SearchCheck,
  ShieldCheck,
  Sofa,
  Store,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { SignsSection } from "@/components/home/signs-section";
import { ProcessSection } from "@/components/home/process-section";
import { CtaSection } from "@/components/home/cta-section";
import { FaqAccordion } from "@/components/faq-accordion";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { TreatmentOptionsSection } from "@/components/treatment-options-section";
import { services, site, serviceFaqs, serviceReviews } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Bed Bug Treatment Services | 100% Odorless & Safe",
  },
  description:
    "Complete bed bug treatment for homes, apartments & hotels. Targeted, odorless treatments with free inspection and a 12-month warranty. Call +91 97693 21234.",
};

const serviceIcons: Record<string, LucideIcon> = {
  bug: Bug,
  search: SearchCheck,
  bed: BedDouble,
  sofa: Sofa,
  building: Building2,
  shield: ShieldCheck,
};


const inclusions = [
  "Free same-day inspection & written estimate",
  "Bed, mattress, frame & headboard treatment",
  "Sofa, carpet, curtain & upholstery treatment",
  "Crack, crevice & skirting board treatment",
  "Wardrobes, drawers & furniture joints",
  "Follow-up visits under 12-month warranty",
  "Prevention guidance & post-treatment support",
];

const spaces: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Home,
    title: "Homes & Apartments",
    description: "1 BHK to independent villas — treated room by room.",
  },
  {
    icon: Hotel,
    title: "Hotels & Resorts",
    description: "Discreet, guest-ready programs with minimal downtime.",
  },
  {
    icon: BedDouble,
    title: "Hostels & PGs",
    description: "Scheduled room-by-room plans that keep residents safe.",
  },
  {
    icon: Building2,
    title: "Offices & Workplaces",
    description: "After-hours treatments with zero business disruption.",
  },
  {
    icon: ShieldCheck,
    title: "Hospitals & Clinics",
    description: "Safe, compliant treatments for sensitive environments.",
  },
  {
    icon: Store,
    title: "Restaurants & Cafes",
    description: "Fabric, seating and back-of-house deep treatment.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        breadcrumb="Services"
        eyebrow="Our Services"
        title={
          <>
            Complete{" "}
            <span className="text-brand-600">bed bug treatment services</span>{" "}
            for every space
          </>
        }
        description="From a single mattress to a full hotel floor, our specialists deliver safe, odorless and guaranteed bed bug elimination — with free inspection and a 12-month warranty"
      />

      <section className="bg-white py-8 lg:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <SectionHeading
              size="compact"
              eyebrow="What We Offer"
              title={
                <>
                  Specialist services built around{" "}
                  <span className="text-brand-600">one problem — bed bugs</span>
                </>
              }
              description="We are bed bug specialists, not a general pest control company. Every service below is delivered by trained technicians using advanced equipment and family-safe products."
            />
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = serviceIcons[service.icon] ?? Bug;
              return (
                <article
                  key={service.title}
                  className="group flex flex-col items-center rounded-2xl border border-ink/10 bg-cream/60 p-6 text-center transition hover:-translate-y-1 hover:border-brand-600/30 hover:bg-white hover:shadow-[0_30px_60px_-25px_rgba(31,128,85,0.22)]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-ink">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">
                    {service.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <SignsSection />

      <ProcessSection />
      <section className="relative overflow-hidden bg-white py-8 lg:py-10">
        {/* Animated Particles */}
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute left-[5%] top-[10%] h-2.5 w-2.5 rounded-full bg-brand-400/30 shadow-[0_0_10px_rgba(47,158,108,0.4)] animate-[float_6s_ease-in-out_infinite_0s]" />
          <span className="absolute left-[95%] top-[30%] h-2 w-2 rounded-full bg-emerald-400/40 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-[float_5s_ease-in-out_infinite_1s]" />
          <span className="absolute left-[20%] top-[85%] h-3 w-3 rounded-full bg-brand-300/30 shadow-[0_0_12px_rgba(139,212,177,0.4)] animate-[float_7s_ease-in-out_infinite_2s]" />
          <span className="absolute left-[85%] top-[80%] h-1.5 w-1.5 rounded-full bg-accent-400/30 shadow-[0_0_6px_rgba(238,123,109,0.4)] animate-[float_4.5s_ease-in-out_infinite_0.5s]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="order-1 lg:order-1">
              <SectionHeading
                size="compact"
                eyebrow="Fully Equipped"
                title={
                  <>
                    What&apos;s included in{" "}
                    <span className="text-brand-600">every treatment</span>
                  </>
                }
                description="One transparent, all-inclusive service — no hidden charges and no corners left untreated."
                align="left"
              />
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {inclusions.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 rounded-2xl border border-ink/10 bg-cream/60 p-4 text-sm font-medium text-ink/80 transition hover:border-brand-600/30 hover:bg-white"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    {item}
                  </li>
                ))}
                <li className="flex items-center justify-center">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2.5 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500"
                  >
                    Book Free Inspection
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              </ul>
            </div>

            <div className="relative order-2 lg:order-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl">
                <Image
                  src="/images/services/fully-equipped-new.jpg"
                  alt="High-tech bed bug eradication equipment and pressurized steam systems"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 right-4 rounded-2xl bg-brand-600 p-5 text-white shadow-2xl sm:right-8">
                <p className="font-display text-2xl font-extrabold">
                  {site.warranty}
                </p>
                <p className="mt-1 text-sm text-white/85">
                  Service warranty
                  <br />
                  on every treatment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-cream pt-8 pb-4 lg:pt-10 lg:pb-6">
        {/* Animated Particles */}
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute left-[10%] top-[20%] h-2 w-2 rounded-full bg-brand-400/40 shadow-[0_0_8px_rgba(47,158,108,0.5)] animate-[float_6s_ease-in-out_infinite_0s]" />
          <span className="absolute left-[80%] top-[15%] h-2.5 w-2.5 rounded-full bg-accent-400/50 shadow-[0_0_10px_rgba(238,123,109,0.5)] animate-[float_5s_ease-in-out_infinite_1s]" />
          <span className="absolute left-[30%] top-[70%] h-3 w-3 rounded-full bg-emerald-400/40 shadow-[0_0_12px_rgba(52,211,153,0.5)] animate-[float_7s_ease-in-out_infinite_2s]" />
          <span className="absolute left-[70%] top-[80%] h-2 w-2 rounded-full bg-brand-300/60 shadow-[0_0_8px_rgba(139,212,177,0.6)] animate-[float_4.5s_ease-in-out_infinite_0.5s]" />
          <span className="absolute left-[50%] top-[40%] h-1.5 w-1.5 rounded-full bg-teal-400/50 shadow-[0_0_6px_rgba(45,212,191,0.5)] animate-[float_8s_ease-in-out_infinite_1.5s]" />
          <span className="absolute left-[90%] top-[50%] h-2.5 w-2.5 rounded-full bg-accent-300/40 shadow-[0_0_10px_rgba(252,165,165,0.4)] animate-[float_5.5s_ease-in-out_infinite_3s]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            size="compact"
            eyebrow="Spaces We Treat"
            title={
              <>
                Wherever bed bugs hide,{" "}
                <span className="text-brand-600">we reach them</span>
              </>
            }
            description="Homes, hospitality and commercial spaces — every treatment is tailored to the space and the people in it."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space) => (
              <div
                key={space.title}
                className="group flex flex-col items-center rounded-2xl border border-ink/10 bg-white p-6 text-center transition hover:-translate-y-1 hover:border-brand-600/30 hover:shadow-xl hover:shadow-brand-600/5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <space.icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-ink">
                  {space.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                  {space.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <p className="flex items-center gap-2 text-sm font-medium text-ink/70">
              <CalendarCheck className="h-5 w-5 text-brand-600" />
              Same-day service available across Pune, Mumbai, Bangalore, Delhi &amp; Noida
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2.5 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500"
            >
              Get Your Free Quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bed Bug Treatment Options */}
      <TreatmentOptionsSection />

      {/* Customer Reviews for Services */}
      <TestimonialsSection
        id="service-reviews"
        className="relative overflow-hidden bg-white pt-2 pb-8 sm:pt-3 sm:pb-10 lg:pt-4 lg:pb-12"
        eyebrow="Customer Reviews"
        title={
          <>
            Rated <span className="text-brand-600">{site.rating}</span> by{" "}
            thousands of happy customers
          </>
        }
        description="Real results from homeowners, tenants, and businesses who eliminated bed bugs with our specialized services."
        testimonials={serviceReviews}
      />

      <section className="bg-cream/40 py-8 lg:py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            size="compact"
            eyebrow="Service FAQ"
            title={
              <>
                Questions about our{" "}
                <span className="text-brand-600">services</span>
              </>
            }
            description="Everything you need to know about our treatment plans, preparation, and follow-ups."
          />
          <div className="mt-8">
            <FaqAccordion items={serviceFaqs} defaultOpen={-1} pageSize={5} />
          </div>
        </div>
      </section>

      <CtaSection className="py-8 lg:py-10" />
    </>
  );
}
