import type { Metadata } from "next";
import Image from "next/image";
import {
  Award,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Eye,
  HeartHandshake,
  IndianRupee,
  Leaf,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaSection } from "@/components/home/cta-section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "India's trusted bed bug control experts. Learn about our mission, vision and the team behind 10,000+ bed bug-free homes across Pune, Mumbai, Bangalore, Delhi & Noida.",
};

const highlights = [
  "100% Safe & Eco-Friendly",
  "Trained & Verified Technicians",
  "Same-Day Service Available",
  "Discreet & Professional",
  "Service Warranty Provided",
];

const values = [
  {
    icon: ShieldCheck,
    title: "Safety First",
    description:
      "Low-toxicity, government-approved formulations that are safe for children, pets and senior citizens.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description:
      "Trained, verified and background-checked technicians who treat your home with respect.",
  },
  {
    icon: Target,
    title: "Specialist Focus",
    description:
      "We are bed bug specialists — not a general pest control company treating everything at once.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Approach",
    description:
      "Odorless treatments that protect your family and the environment without compromising results.",
  },
  {
    icon: IndianRupee,
    title: "Honest Pricing",
    description:
      "Free inspection, a clear written estimate and no hidden charges — ever.",
  },
  {
    icon: Award,
    title: "Guaranteed Results",
    description:
      "30-day money-back guarantee and a 12-month service warranty on every treatment we perform.",
  },
];

const commitments = [
  "Certified & verified pest control experts",
  "Same-day FREE inspection available",
  "100% odorless & family-safe treatment",
  "Government-approved chemicals only",
  "12-month service warranty",
  "4.9★ rated by thousands of customers",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb="About Us"
        eyebrow="About BedBug Treatment"
        title={
          <>
            India&apos;s trusted{" "}
            <span className="text-brand-500">bed bug control experts</span>
          </>
        }
        description="Since 2011, we have helped families, hotels and businesses across India sleep peacefully again — safely, discreetly and permanently."
      />

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border-8 border-white shadow-2xl sm:aspect-square lg:aspect-[4/5]">
                <Image
                  src="/images/treatment-2.png"
                  alt="BedBug Treatment technician treating a bedroom"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 right-4 rounded-3xl bg-brand-600 p-6 text-white shadow-2xl sm:right-8">
                <p className="font-display text-3xl font-extrabold">
                  {new Date().getFullYear() - site.foundedYear}+
                </p>
                <p className="mt-1 text-sm text-white/85">
                  Years of bed bug
                  <br />
                  treatment expertise
                </p>
              </div>
              <div className="absolute -left-3 top-8 hidden items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-2xl sm:flex">
                <BadgeCheck className="h-8 w-8 text-brand-600" />
                <p className="text-sm font-bold text-ink">
                  10,000+
                  <span className="block font-medium text-ink/55">
                    Homes served
                  </span>
                </p>
              </div>
            </div>

            <div>
              <SectionHeading
                align="left"
                eyebrow="Our Story"
                title={
                  <>
                    Focused entirely on one problem —{" "}
                    <span className="text-brand-600">solved permanently.</span>
                  </>
                }
              />
              <div className="mt-6 space-y-5 text-base leading-relaxed text-ink/65">
                <p>
                  Welcome to {site.legalName} — your trusted experts for
                  professional bed bug pest control services in Pune, Mumbai,
                  Bangalore, Delhi and Noida. We provide safe, effective and
                  eco-friendly bed bug treatment for homes, apartments, hotels,
                  hostels, PGs, offices and commercial properties.
                </p>
                <p>
                  Bed bugs hide inside mattresses, sofas, wooden furniture,
                  carpets, curtains and wall cracks. Our trained exterminators
                  use advanced methods and government-approved chemicals to
                  eliminate bed bugs permanently and prevent future
                  infestations.
                </p>
                <p>
                  We are proud to be part of{" "}
                  <span className="font-semibold text-ink">
                    A to Z Pest Solutions
                  </span>
                  , bringing professional standards, verified technicians and
                  genuine service warranties to every booking.
                </p>
              </div>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm font-medium text-ink/80"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What Drives Us"
            title={
              <>
                Our mission, vision and{" "}
                <span className="text-brand-600">promise to you</span>
              </>
            }
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-ink/10 bg-white p-8 transition hover:shadow-xl hover:shadow-brand-600/5">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600">
                <Target className="h-7 w-7" />
              </span>
              <h3 className="mt-6 font-display text-xl font-bold text-ink">
                Our Mission
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">
                To provide eco-friendly and effective bed bug treatment
                services that protect homes, businesses and communities. We are
                committed to using safe methods and educating our clients.
              </p>
            </div>
            <div className="rounded-3xl border border-ink/10 bg-white p-8 transition hover:shadow-xl hover:shadow-brand-600/5">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600">
                <Eye className="h-7 w-7" />
              </span>
              <h3 className="mt-6 font-display text-xl font-bold text-ink">
                Our Vision
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">
                To be the most trusted name in bed bug treatment by delivering
                safe, innovative and long-lasting solutions that ensure
                healthy, pest-free living for everyone.
              </p>
            </div>
            <div className="rounded-3xl bg-ink p-8 text-white">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white">
                <HeartHandshake className="h-7 w-7" />
              </span>
              <h3 className="mt-6 font-display text-xl font-bold">
                Clean. Safe. Bed Bug-Free.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                No more bites. No more stress. Just peaceful, bug-free sleep —
                backed by our 100% money-back guarantee.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Building2 className="h-8 w-8 text-brand-400" />
                <p className="text-sm font-medium text-white/80">
                  Proudly part of{" "}
                  <span className="font-bold text-white">
                    A to Z Pest Solutions
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <SectionHeading
              align="left"
              eyebrow="Why Families Trust Us"
              title={
                <>
                  Professional standards at{" "}
                  <span className="text-brand-600">every step</span>
                </>
              }
              description="From the first inspection to the final follow-up, every visit is handled by trained specialists who treat your home as if it were their own."
            />
            <div className="grid gap-5 sm:grid-cols-2">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-3xl border border-ink/10 bg-cream/60 p-6 transition hover:border-brand-600/30 hover:bg-white hover:shadow-lg"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/10 text-brand-600">
                    <value.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-ink">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] border border-ink/10 bg-white px-7 py-10 sm:px-12">
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
                  Our commitment on every job
                </h2>
                <p className="mt-2 max-w-xl text-sm text-ink/60">
                  Every technician follows the same checklist — so you get the
                  same guaranteed result, every single time.
                </p>
              </div>
              <ul className="grid flex-1 gap-3 sm:grid-cols-2">
                {commitments.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm font-medium text-ink/80"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
