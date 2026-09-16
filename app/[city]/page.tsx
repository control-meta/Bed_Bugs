import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  getAllLocationSlugs,
  getLocationBySlug,
  locations,
} from "@/lib/locations";
import { site } from "@/lib/site";
import { FaqAccordion } from "@/components/faq-accordion";
import { CtaSection } from "@/components/home/cta-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { TreatmentOptionsSection } from "@/components/treatment-options-section";
import { SectionHeading } from "@/components/section-heading";

type Props = {
  params: Promise<{ city: string }>;
};

export async function generateStaticParams() {
  return getAllLocationSlugs().map((slug) => ({
    city: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const location = getLocationBySlug(city);

  if (!location) {
    return {
      title: "Location Not Found",
    };
  }

  return {
    title: {
      absolute: location.title,
    },
    description: location.metaDescription,
    keywords: location.keywords,
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
      canonical: `https://bedbugstreatment.co.in/${location.slug}`,
    },
    openGraph: {
      title: location.title,
      description: location.metaDescription,
      url: `https://bedbugstreatment.co.in/${location.slug}`,
      siteName: "Bed Bug Treatment India",
      locale: "en_IN",
      type: "website",
    },
  };
}

export default async function LocationCityPage({ params }: Props) {
  const { city } = await params;
  const location = getLocationBySlug(city);

  if (!location) {
    notFound();
  }

  const allLocalities = location.coverageAreas.flatMap((z) => z.localities);

  // Structured Data (JSON-LD) for LocalBusiness / PestControl
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "PestControlService"],
    name: `Bed Bug Treatment ${location.name}`,
    image: "https://bedbugstreatment.co.in/images/treatment-1.png",
    telephone: location.phone,
    priceRange: "₹1499 - ₹4999",
    url: `https://bedbugstreatment.co.in/${location.slug}`,
    description: location.metaDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: location.name,
      addressRegion: location.state,
      addressCountry: "IN",
    },
    areaServed: allLocalities.map((loc) => ({
      "@type": "AdministrativeArea",
      name: `${loc}, ${location.name}`,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: location.rating,
      reviewCount: location.reviewCount.replace(/[^0-9]/g, ""),
      bestRating: "5",
      worstRating: "1",
    },
    review: (location.reviews || []).map((r) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.name,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: "5",
      },
      reviewBody: r.quote,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: location.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://bedbugstreatment.co.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: location.name,
        item: `https://bedbugstreatment.co.in/${location.slug}`,
      },
    ],
  };

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* City Hero Section with Panoramic City Skyline Background & Foreground Visual */}
      <section className="relative isolate overflow-hidden bg-cream pb-8 pt-20 max-sm:pb-6 max-sm:pt-16 lg:pb-10 lg:pt-24">
        {/* Background City Skyline & Atmosphere */}
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          {/* City Skyline Background Image */}
          <Image
            src={location.image}
            alt={`Bed bug pest control and eradication service coverage in ${location.name}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105"
          />

          {/* Gradient Overlay: Keeps text 100% clear and legible while letting city skyline shine through */}
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/92 to-cream/35 max-lg:bg-gradient-to-b max-lg:from-cream/95 max-lg:via-cream/85 max-lg:to-cream/45" />
          <div className="absolute inset-0 bg-grid-light opacity-25" />
          <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-brand-400/15 blur-3xl" />
          <div className="absolute -right-20 top-12 h-96 w-96 rounded-full bg-accent-400/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Content Column */}
            <div className="text-center lg:col-span-7 lg:text-left">
              {/* Breadcrumb */}
              <nav
                className="flex items-center justify-center gap-2 text-xs font-medium text-ink/60 lg:justify-start"
                aria-label="Breadcrumb"
              >
                <Link href="/" className="transition hover:text-brand-600">
                  Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-ink/30" />
                <span className="font-semibold text-brand-700">{location.name}</span>
              </nav>

              {/* City Badge */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-800">
                <MapPin className="h-3.5 w-3.5 text-brand-600" />
                <span>
                  Verified Bed Bug Specialists in {location.name}, {location.state}
                </span>
              </div>

              {/* Heading */}
              <h1 className="mt-3.5 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl lg:text-[3rem]">
                Bed Bug Treatment in{" "}
                <span className="text-brand-600">{location.name}</span>
              </h1>

              {/* Tagline / Subtitle */}
              <p className="mt-2 text-base font-semibold text-brand-800 sm:text-lg">
                {location.tagline}
              </p>

              {/* Mobile-Only City Visual Card (Centered in the viewport on mobile preview) */}
              <div className="my-5 flex w-full justify-center lg:hidden">
                <div className="relative aspect-[16/10] w-full max-w-sm overflow-hidden rounded-2xl border-2 border-white bg-white shadow-xl shadow-brand-900/10 ring-1 ring-black/5 sm:max-w-md">
                  <Image
                    src={location.image}
                    alt={`Bed bug inspection and extermination unit serving ${location.name}`}
                    fill
                    priority
                    sizes="(max-width: 1023px) 90vw, 40vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full border border-white/40 bg-white/95 px-2.5 py-0.5 text-[10.5px] font-bold text-brand-800 shadow-sm backdrop-blur-md">
                    <Clock className="h-3 w-3 text-brand-600" />
                    <span>Dispatch: {location.responseTime}</span>
                  </div>
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full border border-white/40 bg-brand-700/90 px-2.5 py-0.5 text-[10.5px] font-semibold text-white shadow-sm backdrop-blur-md">
                    <ShieldCheck className="h-3 w-3 text-emerald-300" />
                    <span>Verified Branch</span>
                  </div>
                  <div className="absolute bottom-2.5 left-3 right-3 text-center text-white sm:text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                      {location.state} • Pan-{location.name} Service
                    </p>
                    <h3 className="font-display text-base font-bold leading-tight drop-shadow-sm">
                      {location.name} Pest Control Hub
                    </h3>
                  </div>
                </div>
              </div>

              {/* Hero Description - Desktop Only */}
              <p className="hidden mt-2.5 max-w-2xl text-sm leading-relaxed text-ink/70 sm:text-base lg:block">
                {location.heroDescription}
              </p>

              {/* Metric Stats Pills - Desktop Only */}
              <div className="hidden mt-6 flex-wrap items-center justify-center gap-2 sm:gap-2.5 lg:flex lg:justify-center">
                <div className="inline-flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white/90 px-3 py-1.5 text-xs font-medium text-ink shadow-sm backdrop-blur-sm">
                  <Clock className="h-3.5 w-3.5 text-brand-600" />
                  <span>
                    Response: <strong className="font-semibold">{location.responseTime}</strong>
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white/90 px-3 py-1.5 text-xs font-medium text-ink shadow-sm backdrop-blur-sm">
                  <Home className="h-3.5 w-3.5 text-brand-600" />
                  <span>
                    Homes: <strong className="font-semibold">{location.homesTreated}</strong>
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white/90 px-3 py-1.5 text-xs font-medium text-ink shadow-sm backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>
                    Rating: <strong className="font-semibold">{location.rating}</strong> ({location.reviewCount})
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-500 hover:shadow-brand-600/35 max-sm:w-full"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Book Free Inspection in {location.name}
                </Link>
                <a
                  href={site.phoneHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-3 text-xs font-semibold text-ink shadow-sm transition hover:border-brand-600 hover:text-brand-700 max-sm:w-full"
                >
                  <Phone className="h-3.5 w-3.5 text-brand-600" />
                  Call Now: {location.phoneDisplay}
                </a>
                <a
                  href={`https://wa.me/${location.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(location.whatsappText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-5 py-3 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 max-sm:w-full"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Desktop Right Column: Large City Image Showcase Card */}
            <div className="relative mx-auto hidden w-full max-w-lg lg:col-span-5 lg:block lg:max-w-none">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-2xl shadow-brand-900/10 ring-1 ring-black/5">
                <Image
                  src={location.image}
                  alt={`Certified bed bug treatment specialists operating in ${location.name}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />

                {/* Top Badge: Response Time */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 rounded-full border border-white/40 bg-white/95 px-3 py-1 text-[11px] font-bold text-brand-800 shadow-md backdrop-blur-md">
                  <Clock className="h-3.5 w-3.5 text-brand-600" />
                  <span>Dispatch: {location.responseTime}</span>
                </div>

                {/* Top Left Badge: Verified Branch */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full border border-white/40 bg-brand-700/90 px-3 py-1 text-[11px] font-semibold text-white shadow-md backdrop-blur-md">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                  <span>Verified Branch</span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-semibold tracking-wider uppercase text-emerald-300 drop-shadow-sm">
                    {location.state} • Pan-{location.name} Service
                  </p>
                  <h3 className="font-display text-xl font-bold leading-tight drop-shadow-md sm:text-2xl">
                    {location.name} Pest Control Hub
                  </h3>
                  <p className="mt-1 text-xs text-white/80 font-medium">
                    {location.activeTechnicians} Active on Duty Today
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Highlights & City Context */}
      <section className="bg-white py-8 lg:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            size="compact"
            eyebrow={`Why ${location.name} Trusts Us`}
            title={
              <>
                Tailored bed bug solutions for{" "}
                <span className="text-brand-600">{location.name} homes &amp; societies</span>
              </>
            }
            description={`Every city has unique housing structures and pest patterns. Here is how our localized ${location.name} team ensures 100% bug-free results.`}
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {location.localHighlights.map((highlight, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-2xl border border-ink/10 bg-cream/30 p-6 text-center transition duration-300 hover:border-brand-600/30 hover:bg-white hover:shadow-xl hover:shadow-brand-600/5 sm:text-left"
              >
                <div>
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/10 text-brand-600 sm:mx-0">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink">
                    {highlight.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">
                    {highlight.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-700 sm:justify-start">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  <span>Guaranteed in {location.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Localities & Neighborhoods Coverage */}
      <section className="bg-cream/50 pt-8 pb-4 lg:pt-10 lg:pb-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            size="compact"
            eyebrow="Coverage Zones"
            title={
              <>
                Neighborhoods we cover across{" "}
                <span className="text-brand-600">{location.name}</span>
              </>
            }
            description={`Our mobile extermination units are stationed across all key zones in ${location.name} to ensure same-day arrival within ${location.responseTime}.`}
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {location.coverageAreas.map((area, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-2xl border border-ink/10 bg-white p-6 text-center shadow-sm transition hover:border-brand-500/40 sm:text-left"
              >
                <div className="flex flex-col items-center gap-3 border-b border-ink/10 pb-4 text-center sm:flex-row sm:text-left">
                  <span className="mx-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600/10 text-brand-600 sm:mx-0">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-ink">
                      {area.zone}
                    </h3>
                    <p className="text-xs text-ink/50">
                      {area.localities.length} major localities covered
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {area.localities.map((locality, lIdx) => (
                    <span
                      key={lIdx}
                      className="inline-flex items-center rounded-lg border border-ink/5 bg-cream/70 px-2.5 py-1 text-xs font-medium text-ink/80 transition hover:border-brand-500/30 hover:bg-brand-50 hover:text-brand-700"
                    >
                      {locality}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-brand-500/20 bg-brand-50/50 p-5 text-center">
            <p className="text-xs font-medium text-ink/80 sm:text-sm">
              Don&apos;t see your specific sector or colony listed?{" "}
              <strong className="text-ink">
                We service all residential and commercial addresses within 45 km of {location.name} center.
              </strong>{" "}
              Call{" "}
              <a
                href={site.phoneHref}
                className="font-semibold text-brand-700 underline hover:text-brand-800"
              >
                {location.phoneDisplay}
              </a>{" "}
              to verify instant technician dispatch.
            </p>
          </div>
        </div>
      </section>

      {/* 4-Step Elimination Process */}
      <section className="bg-cream/40 pt-4 pb-4 lg:pt-5 lg:pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            size="compact"
            eyebrow="Our Proven Methodology"
            title={
              <>
                How we eliminate bed bugs in{" "}
                <span className="text-brand-600">{location.name}</span>
              </>
            }
            description="Our scientific, dual-action extermination strategy kills adult bugs instantly and neutralizes eggs so they never hatch again."
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex h-full flex-col justify-between rounded-2xl border border-ink/10 bg-white p-6 text-center shadow-sm transition duration-300 hover:border-brand-600/30 hover:shadow-md sm:text-left">
              <div>
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-extrabold text-white sm:mx-0">
                  01
                </span>
                <h3 className="mt-4 flex min-h-[2.75rem] items-start justify-center font-display text-base font-bold text-ink sm:min-h-[3rem] sm:justify-start">
                  Intensive Property Inspection
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/65">
                  Thorough inspection of mattress seams, headboards, and crevices to detect all active bug harborages.
                </p>
              </div>
            </div>

            <div className="flex h-full flex-col justify-between rounded-2xl border border-ink/10 bg-white p-6 text-center shadow-sm transition duration-300 hover:border-brand-600/30 hover:shadow-md sm:text-left">
              <div>
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-extrabold text-white sm:mx-0">
                  02
                </span>
                <h3 className="mt-4 flex min-h-[2.75rem] items-start justify-center font-display text-base font-bold text-ink sm:min-h-[3rem] sm:justify-start">
                  Targeted Odorless Treatment
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/65">
                  Government-approved odorless micro-emulsion injected into deep harborages to eliminate all active bugs.
                </p>
              </div>
            </div>

            <div className="flex h-full flex-col justify-between rounded-2xl border border-ink/10 bg-white p-6 text-center shadow-sm transition duration-300 hover:border-brand-600/30 hover:shadow-md sm:text-left">
              <div>
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-extrabold text-white sm:mx-0">
                  03
                </span>
                <h3 className="mt-4 flex min-h-[2.75rem] items-start justify-center font-display text-base font-bold text-ink sm:min-h-[3rem] sm:justify-start">
                  High-Heat Egg Eradication
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/65">
                  Superheated dry steam penetrates fabric fibers and furniture joints to destroy hidden egg clusters.
                </p>
              </div>
            </div>

            <div className="flex h-full flex-col justify-between rounded-2xl border border-ink/10 bg-white p-6 text-center shadow-sm transition duration-300 hover:border-brand-600/30 hover:shadow-md sm:text-left">
              <div>
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-extrabold text-white sm:mx-0">
                  04
                </span>
                <h3 className="mt-4 flex min-h-[2.75rem] items-start justify-center font-display text-base font-bold text-ink sm:min-h-[3rem] sm:justify-start">
                  12-Month Warranty Protection
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/65">
                  Official stamped 12-month certificate providing free re-treatments if any bed bug activity reappears.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bed Bug Treatment Options */}
      <TreatmentOptionsSection
        cityName={location.name}
        whatsappPhone={location.phone}
      />

      {/* Customer Reviews for this Location */}
      <TestimonialsSection
        id="local-reviews"
        className="relative overflow-hidden bg-white pt-2 pb-4 sm:pt-3 sm:pb-5 lg:pt-4 lg:pb-6"
        eyebrow="Local Customer Reviews"
        title={
          <>
            Rated <span className="text-brand-600">{location.rating}</span> in{" "}
            {location.name}
          </>
        }
        description={`Real reviews from homeowners, tenants, and property managers in ${location.name} who became 100% bed bug-free.`}
        rating={location.rating}
        reviewCount={location.reviewCount}
        testimonials={location.reviews}
        city={location.name}
      />

      {/* Local FAQs */}
      <section className="bg-cream/40 pt-5 pb-3 sm:pt-6 sm:pb-3.5 lg:pt-6 lg:pb-4">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            size="compact"
            eyebrow="Local Questions"
            title={
              <>
                Frequently asked questions in{" "}
                <span className="text-brand-600">{location.name}</span>
              </>
            }
            description={`Answers to common questions about bed bug extermination, society permissions, and safety in ${location.name}.`}
          />

          <div className="mt-8">
            <FaqAccordion items={location.faqs} defaultOpen={-1} pageSize={3} />
          </div>
        </div>
      </section>

      {/* Other Service Locations */}
      <section className="border-t border-ink/10 bg-white pt-6 pb-2 lg:pt-8 lg:pb-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="font-display text-lg font-bold text-ink">
              Looking for service in other cities?
            </h3>
            <p className="mt-1 text-xs text-ink/60">
              We provide identical guaranteed service across all major metropolitan hubs:
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {locations
              .filter((l) => l.slug !== location.slug)
              .map((otherCity) => (
                <Link
                  key={otherCity.slug}
                  href={`/${otherCity.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-ink/10 bg-cream/40 px-4 py-2 text-xs font-medium text-ink transition hover:border-brand-600/30 hover:bg-brand-50 hover:text-brand-700"
                >
                  <MapPin className="h-3.5 w-3.5 text-brand-600" />
                  <span>Bed Bug Treatment in {otherCity.name}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection className="pt-2 pb-10 max-sm:pt-1 max-sm:pb-4 lg:pt-3 lg:pb-14" />
    </>
  );
}
