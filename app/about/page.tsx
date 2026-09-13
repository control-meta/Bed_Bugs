import type { Metadata } from "next";
import Image from "next/image";
import {
  Award,
  BadgeCheck,
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
    "India's trusted bed bug control experts. Learn about our mission, vision and the team behind 50,000+ bed bug-free homes across Pune, Mumbai, Bangalore, Delhi & Noida.",
};

const highlights = [
  "100% Safe & Eco-Friendly",
  "Trained Technicians",
  "Same-Day Service Available",
  "Discreet & Professional",
  "Service Warranty Provided",
];

const values = [
  {
    icon: ShieldCheck,
    title: "Safety First",
    description:
      "Low-toxicity, family-safe formulations that are safe for children, pets and senior citizens.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description:
      "Trained and courteous technicians who treat your home with respect.",
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

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb="About Us"
        eyebrow="About BedBug Treatment"
        title={
          <>
            India&apos;s trusted{" "}
            <span className="text-brand-600">bed bug control experts</span>
          </>
        }
        description="Since 2011, we have helped families, hotels and businesses across India sleep peacefully again — safely, discreetly and permanently."
      />

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl">
                <Image
                  src="/images/our-story.jpg"
                  alt="BedBug Treatment technician fumigating a living room sofa"
                  fill
                  loading="eager"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 right-4 rounded-2xl bg-brand-600 p-5 text-white shadow-2xl sm:right-8">
                <p className="font-display text-2xl font-extrabold">
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
                  50,000+
                  <span className="block font-medium text-ink/55">
                    Homes served
                  </span>
                </p>
              </div>
            </div>

            <div>
              <SectionHeading
                align="left"
                size="compact"
                eyebrow="Our Story"
                title={
                  <>
                    Focused entirely on one problem —{" "}
                    <span className="text-brand-600">solved permanently.</span>
                  </>
                }
              />
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink/65">
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
                  use advanced methods and family-safe chemicals to
                  eliminate bed bugs permanently and prevent future
                  infestations.
                </p>
              </div>

              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
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

      <section className="bg-cream py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            size="compact"
            eyebrow="What Drives Us"
            title={
              <>
                Our mission, vision and{" "}
                <span className="text-brand-600">promise to you</span>
              </>
            }
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-ink/10 bg-white p-6 text-center transition hover:shadow-xl hover:shadow-brand-600/5">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600">
                <Target className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink">
                Our Mission
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                To provide eco-friendly and effective bed bug treatment
                services that protect homes, businesses and communities. We are
                committed to using safe methods and educating our clients.
              </p>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-white p-6 text-center transition hover:shadow-xl hover:shadow-brand-600/5">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600">
                <Eye className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink">
                Our Vision
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                To be the most trusted name in bed bug treatment by delivering
                safe, innovative and long-lasting solutions that ensure
                healthy, pest-free living for everyone.
              </p>
            </div>
            <div className="rounded-2xl bg-ink p-6 text-center text-white">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white">
                <HeartHandshake className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold">
                Clean. Safe. Bed Bug-Free.
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/65">
                No more bites. No more stress. Just peaceful, bug-free sleep —
                backed by our 100% money-back guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            size="compact"
            eyebrow="Why Families Trust Us"
            title={
              <>
                Professional standards at{" "}
                <span className="text-brand-600">every step</span>
              </>
            }
            description="From the first inspection to the final follow-up, every visit is handled by trained specialists who treat your home as if it were their own."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="group flex gap-4 rounded-2xl border border-ink/10 bg-cream/60 p-5 transition hover:-translate-y-1 hover:border-brand-600/30 hover:bg-white hover:shadow-[0_30px_60px_-25px_rgba(31,128,85,0.2)]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <value.icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-ink">
                    {value.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection className="-mt-6 pb-12 pt-2 lg:-mt-10 lg:pb-16 lg:pt-4" />
    </>
  );
}
