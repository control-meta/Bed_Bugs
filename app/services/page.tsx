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
  Leaf,
  SearchCheck,
  ShieldCheck,
  Sofa,
  Store,
  Zap,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { SignsSection } from "@/components/home/signs-section";
import { ProcessSection } from "@/components/home/process-section";
import { CtaSection } from "@/components/home/cta-section";
import { services, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Bed Bug Treatment Services",
  description:
    "Complete bed bug treatment services for homes, apartments, hotels, hostels, PGs and offices. Targeted, odorless and eco-friendly treatments with free inspection and a 12-month warranty. Call +91 97693 21234.",
};

const serviceIcons: Record<string, LucideIcon> = {
  bug: Bug,
  search: SearchCheck,
  bed: BedDouble,
  sofa: Sofa,
  building: Building2,
  shield: ShieldCheck,
};

const assurances = [
  { icon: SearchCheck, label: "Free same-day inspection" },
  { icon: ShieldCheck, label: "12-month service warranty" },
  { icon: Leaf, label: "Odorless & family-safe" },
  { icon: Zap, label: "Single-visit solutions" },
];

const inclusions = [
  "Free same-day inspection & written estimate",
  "Bed, mattress, frame & headboard treatment",
  "Sofa, carpet, curtain & upholstery treatment",
  "Crack, crevice & skirting board treatment",
  "Wardrobes, drawers & furniture joints",
  "Follow-up visits under 12-month warranty",
  "Prevention guidance & post-treatment support",
  "30-day money-back guarantee",
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
        description="From a single mattress to a full hotel floor, our specialists deliver safe, odorless and guaranteed bed bug elimination — with free inspection and a 12-month warranty on every job."
      />

      <section className="bg-white pb-12 pt-8 lg:pb-16 lg:pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {assurances.map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-cream/70 px-4 py-2 text-xs font-semibold text-ink/75 shadow-sm"
              >
                <item.icon className="h-4 w-4 text-brand-600" />
                {item.label}
              </span>
            ))}
          </div>

          <div className="mt-10">
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
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500"
                >
                  Book Free Inspection
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <div className="flex items-center gap-3 rounded-full border border-ink/10 bg-white px-4 py-2 shadow-sm">
                  <ShieldCheck className="h-5 w-5 text-brand-600" />
                  <span className="text-sm font-semibold text-ink">
                    100% Money-back
                  </span>
                </div>
              </div>
            </div>

            <div className="relative order-2 lg:order-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl">
                <Image
                  src="/images/services/fully-equipped-new.jpg"
                  alt="High-tech professional pest control equipment"
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

      <section className="bg-cream py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

      <CtaSection className="-mt-6 pb-12 pt-2 lg:-mt-10 lg:pb-16 lg:pt-4" />
    </>
  );
}
