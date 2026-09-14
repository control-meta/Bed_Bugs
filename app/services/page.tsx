import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BedDouble,
  Bug,
  Building2,
  CalendarCheck,
  CalendarDays,
  Check,
  CircleDot,
  Clock,
  Droplets,
  Home,
  Hotel,
  Layers,
  Leaf,
  MapPin,
  MessageCircle,
  Moon,
  Phone,
  Search,
  ShieldCheck,
  Sofa,
  Sparkles,
  Star,
  Target,
  Users,
} from "lucide-react";
import { FaqAccordion } from "@/components/faq-accordion";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { site, serviceFaqs, serviceReviews, cities } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Bed Bug Treatment Services | 100% Odorless & Safe",
  },
  description:
    "Complete bed bug treatment for homes, apartments & hotels. Targeted, odorless treatments with free inspection and a 12-month warranty. Call +91 97693 21234.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://bedbugstreatment.co.in/services",
  },
};

const propertyTypes = [
  {
    title: "Homes & Apartments",
    description: "Bedrooms, mattresses, furniture, sofas and other hiding areas.",
    icon: Home,
    image: "/images/treatment-1.png",
    alt: "Bed bug treatment for residential homes and private apartments",
  },
  {
    title: "Hotels & Resorts",
    description: "Guest rooms and affected areas with operational focus.",
    icon: Hotel,
    image: "/images/treatment-2.png",
    alt: "Commercial bed bug control for hotels, resorts and guest rooms",
  },
  {
    title: "Hostels & PGs",
    description: "Shared accommodation and recurring issues.",
    icon: Users,
    image: "/images/treatment-3.png",
    alt: "Specialized bed bug elimination for hostels, PGs and shared student accommodation",
  },
  {
    title: "Offices & Workspaces",
    description: "Furniture, upholstery and common areas.",
    icon: Building2,
    image: "/images/why-choose-us.webp",
    alt: "Discreet bed bug treatment for corporate offices and commercial workspaces",
  },
  {
    title: "Rental Properties",
    description: "For tenants, landlords and property managers.",
    icon: Building2,
    image: "/images/cities/pune.jpg",
    alt: "Comprehensive bed bug eradication for rental properties and tenanted flats",
  },
];

const processStepsData = [
  {
    num: "01",
    title: "Inspection & Assessment",
    description:
      "We inspect mattresses, bed frames, furniture, upholstery, cracks and other common hiding areas to identify signs of bed bug activity.",
    icon: Search,
  },
  {
    num: "02",
    title: "Targeted Treatment",
    description:
      "Treatment is focused on identified infestation areas and common bed bug harborages based on the property's condition.",
    icon: Target,
  },
  {
    num: "03",
    title: "Follow-Up *",
    description:
      "Follow-up visits are provided according to the selected service plan and treatment requirements.",
    icon: CalendarCheck,
  },
  {
    num: "04",
    title: "Prevention Guidance",
    description:
      "We provide practical guidance on cleaning, preparation and prevention to help reduce the risk of recurring bed bug activity.",
    icon: ShieldCheck,
  },
];

const bedbugSigns = [
  {
    title: "Itchy bites after sleeping",
    icon: Moon,
    bg: "bg-red-50",
    textColor: "text-red-600",
  },
  {
    title: "Blood spots on sheets",
    icon: Droplets,
    bg: "bg-red-50",
    textColor: "text-red-600",
  },
  {
    title: "Dark spots around mattress seams",
    icon: CircleDot,
    bg: "bg-emerald-50",
    textColor: "text-emerald-700",
  },
  {
    title: "Shed skins or eggshells",
    icon: Layers,
    bg: "bg-amber-50",
    textColor: "text-amber-700",
  },
  {
    title: "Bed bugs around furniture joints",
    icon: Clock,
    bg: "bg-emerald-50",
    textColor: "text-emerald-700",
  },
  {
    title: "Live bugs or eggs",
    icon: Sparkles,
    bg: "bg-emerald-50",
    textColor: "text-emerald-700",
  },
];

const oneTimeFeatures = [
  "Inspection of common bed bug hiding areas",
  "Targeted treatment of affected areas",
  "Mattress, bed frame and furniture treatment as required",
  "Post-treatment guidance",
  "Suitable for homes, apartments, hotels and offices",
];

const amcFeatures = [
  "Initial inspection and treatment",
  "3 scheduled visits over 12 months",
  "Follow-up treatment visits",
  "Monitoring for recurring activity",
  "Guidance to reduce re-infestation risk",
];

export default function ServicesPage() {
  const oneTimeWhatsApp = `https://wa.me/919769321234?text=${encodeURIComponent(
    "Hi, I want to book the One-Time Bed Bug Treatment. Please share the details."
  )}`;

  const amcWhatsApp = `https://wa.me/919769321234?text=${encodeURIComponent(
    "Hi, I want to choose the 1-Year Bed Bug AMC. Please share the details."
  )}`;

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f4f9f6] via-white to-white pt-8 pb-10 sm:pt-12 sm:pb-14 lg:pt-14 lg:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
            {/* Left Column */}
            <div className="lg:col-span-7">
              {/* Red Pill Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[#991b1b] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>BED BUG SPECIALISTS · EST. 2011</span>
              </div>

              {/* Main Heading */}
              <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
                Professional Bed Bug Treatment Services
              </h1>

              {/* Bold Tagline */}
              <p className="mt-3 text-base font-bold text-brand-800 sm:text-lg">
                Specialized bed bug treatment for homes, apartments, hotels, PGs, offices and other properties across India.
              </p>

              {/* Description */}
              <p className="mt-2.5 text-sm leading-relaxed text-ink/70 sm:text-base">
                We focus exclusively on bed bugs, with treatment plans designed to identify infestation areas, target common hiding spots and provide follow-up support when required.
              </p>

              {/* 4 Feature Pills in a row */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2 border-y border-brand-600/10 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Leaf className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-semibold text-ink/85 leading-tight">
                    100% Odorless Treatment
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-semibold text-ink/85 leading-tight">
                    Bed Bug Specialists
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Building2 className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-semibold text-ink/85 leading-tight">
                    Residential &amp; Commercial Properties
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  </span>
                  <span className="text-xs font-semibold text-ink/85 leading-tight">
                    4.9/5 Customer Rating
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-700/25 transition hover:bg-brand-800"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Book Bed Bug Treatment
                </Link>
                <a
                  href={site.phoneHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-600/30 bg-white px-5 py-3.5 text-sm font-semibold text-brand-800 shadow-sm transition hover:bg-brand-50 hover:border-brand-600/50"
                >
                  <Phone className="h-4 w-4 text-brand-600" />
                  Call Now: {site.phoneDisplay}
                </a>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-600/30 bg-white px-5 py-3.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50 hover:border-emerald-600/50"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Right Visual Column */}
            <div className="relative mx-auto w-full max-w-lg lg:col-span-5 lg:max-w-none">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border-4 border-white bg-cream shadow-2xl ring-1 ring-black/5">
                <Image
                  src="/images/hero-tech-bed.webp"
                  alt="Certified technician applying targeted odorless bed bug treatment to a mattress"
                  fill
                  priority
                  sizes="(min-width: 1024px) 42vw, 90vw"
                  className="object-cover object-center"
                />

                {/* Top Right Floating Badge */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white/95 px-3.5 py-2 shadow-xl backdrop-blur-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Leaf className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block font-display text-xs font-bold leading-tight text-ink">
                      100% Odorless
                    </span>
                    <span className="block text-[10px] font-medium text-ink/60 leading-tight">
                      Bed Bug Treatment
                    </span>
                  </div>
                </div>

                {/* Bottom Right Floating Circular Macro Bed Bug Badge */}
                <div className="absolute -bottom-2 -right-2 h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-full border-4 border-red-500/90 bg-white shadow-2xl ring-4 ring-white">
                  <Image
                    src="/images/bedbug-closeup.jpg"
                    alt="Macro view of adult bed bug for pest identification and detection"
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 100% ODORLESS HIGHLIGHT BANNER */}
      <section className="bg-white py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 rounded-2xl border border-brand-500/25 bg-[#f1f9f4] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white shadow-md shadow-brand-700/20">
                <Leaf className="h-7 w-7" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-ink sm:text-xl">
                  100% Odorless Bed Bug Treatment
                </h2>
                <p className="mt-1 text-xs text-ink/70 sm:text-sm max-w-xl leading-relaxed">
                  Professional bed bug-focused treatment designed for homes, apartments, hotels and other occupied spaces.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:shrink-0 text-xs sm:text-sm font-medium text-ink/85">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-brand-600 stroke-[2.5]" />
                <span>No lingering treatment odor</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-brand-600 stroke-[2.5]" />
                <span>Suitable for residential &amp; commercial spaces</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-brand-600 stroke-[2.5]" />
                <span>Professional bed bug-focused treatment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMPLETE BED BUG TREATMENT SOLUTIONS (3 CARDS) */}
      <section className="bg-white py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              <span className="h-px w-6 bg-brand-600" />
              <span>OUR BED BUG SERVICES</span>
              <span className="h-px w-6 bg-brand-600" />
            </div>
            <h2 className="mt-2.5 font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
              Complete Bed Bug Treatment Solutions
            </h2>
            <p className="mx-auto mt-2.5 max-w-3xl text-xs sm:text-sm text-ink/70 leading-relaxed">
              From a single bedroom to large residential and commercial properties, our bed bug specialists provide treatment based on the infestation, property type and areas affected.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <Image
                  src="/images/treatment-1.png"
                  alt="Professional bed bug treatment for bedroom mattress and furniture"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="-mt-11 mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-700 text-white shadow-md ring-4 ring-white">
                  <Bug className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-ink">
                  Bed Bug Treatment
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink/65 flex-1">
                  Professional treatment for active bed bug infestations in bedrooms, mattresses, bed frames, furniture and other affected areas.
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 transition hover:text-brand-800"
                >
                  Learn More <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <Image
                  src="/images/treatment-2.png"
                  alt="One-time bed bug eradication service for apartments and residences"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="-mt-11 mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-700 text-white shadow-md ring-4 ring-white">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-ink">
                  One-Time Bed Bug Service
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink/65 flex-1">
                  A treatment option for customers looking to address a current bed bug infestation with a focused service based on property conditions.
                </p>
                <a
                  href={oneTimeWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 transition hover:text-brand-800"
                >
                  Book One-Time Service <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <Image
                  src="/images/services/service-warranty.jpg"
                  alt="1-year bed bug AMC warranty and scheduled service maintenance plan"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="-mt-11 mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-700 text-white shadow-md ring-4 ring-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-ink">
                  1-Year Bed Bug AMC
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink/65 flex-1">
                  Three scheduled visits over 12 months for continued treatment support, follow-up and monitoring based on service requirements.
                </p>
                <a
                  href={amcWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 transition hover:text-brand-800"
                >
                  Choose 1-Year AMC <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHOOSE YOUR SERVICE PLAN: ONE-TIME OR 1-YEAR AMC */}
      <section className="bg-white py-8 lg:py-12 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              <span className="h-px w-6 bg-brand-600" />
              <span>CHOOSE YOUR SERVICE PLAN</span>
              <span className="h-px w-6 bg-brand-600" />
            </div>
            <h2 className="mt-2.5 font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
              One-Time Treatment or 1-Year AMC
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-ink/70 leading-relaxed">
              Choose the option that fits your current bed bug situation.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2 lg:gap-8 items-stretch">
            {/* Plan 1: One-Time Bed Bug Treatment */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition hover:shadow-md">
              <div>
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
                      One-Time Bed Bug Treatment
                    </h3>
                    <p className="text-xs text-brand-700 font-semibold">
                      For immediate treatment needs
                    </p>
                  </div>
                </div>

                <ul className="mt-6 space-y-3.5">
                  {oneTimeFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-4 w-4 shrink-0 text-brand-600 stroke-[2.5] mt-0.5" />
                      <span className="text-xs sm:text-sm text-ink/80 leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <a
                  href={oneTimeWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-800 py-3.5 px-6 text-sm font-bold text-white shadow-md transition hover:bg-brand-900"
                >
                  Book One-Time Service
                </a>
              </div>
            </div>

            {/* Plan 2: 1-Year Bed Bug AMC (Most Popular) */}
            <div className="relative flex flex-col justify-between rounded-3xl border-2 border-brand-700 bg-brand-800 text-white p-6 sm:p-8 shadow-xl">
              {/* Most Popular Badge */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
                <span className="rounded-full bg-brand-500/90 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-sm">
                  Most Popular
                </span>
              </div>

              <div>
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm">
                    <CalendarDays className="h-6 w-6 text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                      1-Year Bed Bug AMC
                    </h3>
                    <p className="text-xs text-emerald-300 font-semibold">
                      3 Visits Over 12 Months
                    </p>
                  </div>
                </div>

                <ul className="mt-6 space-y-3.5">
                  {amcFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-4 w-4 shrink-0 text-emerald-300 stroke-[2.5] mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/90 leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <a
                  href={amcWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 px-6 text-sm font-bold text-white shadow-lg transition hover:bg-brand-500"
                >
                  Choose 1-Year AMC
                </a>
              </div>
            </div>
          </div>

          <p className="mx-auto mt-6 text-center text-xs text-ink/55">
            *The recommended plan depends on infestation level, property conditions and service requirements.
          </p>
        </div>
      </section>

      {/* 5. WHAT'S INCLUDED IN OUR TREATMENT */}
      <section className="bg-[#f8faf8] py-10 lg:py-14 border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              <span className="h-px w-6 bg-brand-600" />
              <span>WHAT&apos;S INCLUDED</span>
              <span className="h-px w-6 bg-brand-600" />
            </div>
            <h2 className="mt-2.5 font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
              What&apos;s Included in Our Treatment
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-brand-700 font-medium">
              Our treatment plans cover all the key areas where bed bugs hide and include post-treatment support.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-4 items-stretch">
            {/* Card 1 (Active/Detailed) */}
            <div className="rounded-2xl border-2 border-brand-600/30 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm">
                  <BedDouble className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-ink">
                    One-Time &amp; Bedding
                  </h3>
                  <p className="text-xs font-semibold text-brand-700">
                    For Frames &amp; Furniture
                  </p>
                </div>
              </div>
              <ul className="mt-5 space-y-2.5 text-xs text-ink/75">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 shrink-0 text-brand-600 stroke-[2.5] mt-0.5" />
                  <span>Inspection of common bed bug hiding areas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 shrink-0 text-brand-600 stroke-[2.5] mt-0.5" />
                  <span>Targeted treatment of affected areas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 shrink-0 text-brand-600 stroke-[2.5] mt-0.5" />
                  <span>Mattress, bed frame and furniture treatment as required</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 shrink-0 text-brand-600 stroke-[2.5] mt-0.5" />
                  <span>Post-treatment guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 shrink-0 text-brand-600 stroke-[2.5] mt-0.5" />
                  <span>Suitable for homes, apartments, hotels and offices</span>
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-600/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Sofa className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-ink">
                Upholstery &amp; Sofas
              </h3>
              <p className="mt-1 text-xs text-ink/60">
                Cracks-up &amp; sofas
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-600/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-ink">
                Cracks &amp; Crevices
              </h3>
              <p className="mt-1 text-xs text-ink/60">
                Cracks &amp; Crevices
              </p>
            </div>

            {/* Card 4 */}
            <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-600/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-ink">
                Post-Treatment Guidance
              </h3>
              <p className="mt-1 text-xs text-ink/60">
                Post-Treatment Guidance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROPERTY TYPES (5 CARDS) */}
      <section className="bg-white py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              <span className="h-px w-6 bg-brand-600" />
              <span>WHAT WE TREAT</span>
              <span className="h-px w-6 bg-brand-600" />
            </div>
            <h2 className="mt-2.5 font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
              Bed Bug Treatment for Different Property Types
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-ink/70 leading-relaxed">
              We provide treatment for a wide range of residential and commercial properties across India.
            </p>
          </div>

          <div className="mt-10 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {propertyTypes.map((prop) => (
              <div
                key={prop.title}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={prop.image}
                    alt={prop.alt}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1.5">
                    <prop.icon className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                    <h3 className="font-display text-xs sm:text-sm font-bold text-ink truncate">
                      {prop.title}
                    </h3>
                  </div>
                  <p className="mt-1.5 text-[11px] sm:text-xs text-ink/65 leading-snug">
                    {prop.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. STRUCTURED APPROACH (4 STEPS) */}
      <section className="bg-[#f8faf8] py-10 lg:py-14 border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              <span className="h-px w-6 bg-brand-600" />
              <span>OUR TREATMENT PROCESS</span>
              <span className="h-px w-6 bg-brand-600" />
            </div>
            <h2 className="mt-2.5 font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
              A Structured Approach to Bed Bug Treatment
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-ink/70 leading-relaxed">
              We follow a clear and effective process to identify, treat and help prevent bed bug re-infestation.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {processStepsData.map((step) => (
              <div
                key={step.num}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-brand-600/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="font-display text-sm font-extrabold text-brand-700">
                    {step.num}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-sm sm:text-base font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/65">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. SIGNS YOU MAY HAVE BED BUGS */}
      <section className="bg-white py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              <span className="h-px w-6 bg-brand-600" />
              <span>KNOW THE SIGNS</span>
              <span className="h-px w-6 bg-brand-600" />
            </div>
            <h2 className="mt-2.5 font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
              Signs You May Have Bed Bugs
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-ink/70 leading-relaxed">
              Look out for these common signs of bed bug activity in your home or property.
            </p>
          </div>

          <div className="mt-10 grid items-stretch gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-7">
            {bedbugSigns.map((sign) => (
              <div
                key={sign.title}
                className="flex flex-col items-center text-center rounded-2xl border border-slate-200 bg-[#fdfdfd] p-4 shadow-sm transition hover:shadow-md hover:border-brand-600/30 justify-center"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${sign.bg} ${sign.textColor}`}>
                  <sign.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-xs font-semibold text-ink/80 leading-snug">
                  {sign.title}
                </p>
              </div>
            ))}

            {/* 7th item: Callout box */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex flex-col justify-between rounded-2xl border border-brand-500/30 bg-[#f1f9f4] p-4 shadow-sm text-center">
              <div>
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-white">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <h4 className="mt-2 font-display text-xs font-bold text-ink">
                  Not sure if you have bed bugs?
                </h4>
                <p className="mt-1 text-[11px] text-ink/70 leading-snug">
                  Book an inspection and get expert advice.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center justify-center gap-1 rounded-lg bg-brand-700 py-1.5 px-3 text-[11px] font-bold text-white shadow-sm transition hover:bg-brand-800"
              >
                Book Now <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. SERVICE LOCATIONS */}
      <section className="bg-[#f8faf8] py-8 lg:py-10 border-t border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              <span className="h-px w-6 bg-brand-600" />
              <span>SERVICE LOCATIONS</span>
            </div>
            <h2 className="mt-1.5 font-display text-xl sm:text-2xl font-bold text-ink">
              Bed Bug Treatment Across India
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-ink/70">
              We provide professional bed bug treatment services in selected cities, with local service teams supporting residential and commercial customers.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            {cities.map((city) => (
              <Link
                key={city.name}
                href={`/${city.name.toLowerCase()}`}
                className="inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-white px-4 py-2 text-xs font-semibold text-ink shadow-sm transition hover:border-brand-600 hover:bg-brand-50 hover:text-brand-800"
              >
                <MapPin className="h-3.5 w-3.5 text-brand-600" />
                <span>{city.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CUSTOMER REVIEWS (Kept same as requested) */}
      <TestimonialsSection
        id="service-reviews"
        className="relative overflow-hidden bg-white pt-6 pb-8 sm:pt-8 sm:pb-10 lg:pt-10 lg:pb-12 border-t border-slate-100"
        eyebrow="Customer Reviews"
        title={
          <>
            What Our Customers Say About Our{" "}
            <span className="text-brand-600">Bed Bug Treatment</span>
          </>
        }
        description="Real results from homeowners, tenants, and businesses who eliminated bed bugs with our specialized services."
        testimonials={serviceReviews}
      />

      {/* 11. FREQUENTLY ASKED QUESTIONS (Kept same as requested) */}
      <section className="bg-[#f8faf8] py-10 lg:py-14 border-t border-slate-200/70">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              <span className="h-px w-6 bg-brand-600" />
              <span>BED BUG SERVICE FAQ</span>
              <span className="h-px w-6 bg-brand-600" />
            </div>
            <h2 className="mt-2.5 font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
              Frequently Asked Questions About Bed Bug Treatment
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-ink/70 leading-relaxed">
              Everything you need to know about our treatment plans, preparation, safety, and follow-ups.
            </p>
          </div>
          <div className="mt-8">
            <FaqAccordion items={serviceFaqs} defaultOpen={-1} pageSize={10} />
          </div>
        </div>
      </section>

      {/* 12. BOTTOM CTA BANNER */}
      <section className="bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#0b291d] p-6 sm:p-10 text-white shadow-2xl">
            <div className="relative z-10 grid items-center gap-6 lg:grid-cols-12">
              {/* Left Thumbnail */}
              <div className="hidden sm:block lg:col-span-3">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-white/20 shadow-md">
                  <Image
                    src="/images/treatment-1.png"
                    alt="Clean pest-free bedroom after professional bed bug treatment"
                    fill
                    sizes="(min-width: 1024px) 25vw, 30vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Center Content */}
              <div className="lg:col-span-5 text-center sm:text-left">
                <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                  Ready to Treat Your Bed Bug Problem?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-white/75 leading-relaxed">
                  Choose a One-Time Treatment or our 1-Year AMC with 3 scheduled visits. Our team can help you select the right option based on your property and infestation.
                </p>
              </div>

              {/* Right Action Buttons */}
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center lg:items-end justify-center gap-3">
                <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2.5 w-full">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-brand-900 shadow-md transition hover:bg-emerald-50"
                  >
                    <CalendarCheck className="h-4 w-4 text-brand-700" />
                    Book Now
                  </Link>
                  <a
                    href={site.phoneHref}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    <Phone className="h-4 w-4" />
                    Call {site.phoneDisplay}
                  </a>
                  <a
                    href={site.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/50 bg-emerald-500/20 px-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-200 backdrop-blur-sm transition hover:bg-emerald-500/30"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp Us
                  </a>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>100% Odorless Bed Bug Treatment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
