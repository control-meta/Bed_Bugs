import type { Metadata } from "next";
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
  Users,
  Zap,
} from "lucide-react";
import {
  getAllLocationSlugs,
  getLocationBySlug,
  locations,
} from "@/lib/locations";
import { site } from "@/lib/site";
import { ContactForm } from "@/components/contact-form";
import { FaqAccordion } from "@/components/faq-accordion";
import { CtaSection } from "@/components/home/cta-section";
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
    title: location.title,
    description: location.metaDescription,
    keywords: location.keywords,
    alternates: {
      canonical: `https://bedbugstreatment.co.in/locations/${location.slug}`,
    },
    openGraph: {
      title: location.title,
      description: location.metaDescription,
      url: `https://bedbugstreatment.co.in/locations/${location.slug}`,
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
    url: `https://bedbugstreatment.co.in/locations/${location.slug}`,
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
        name: "Locations",
        item: "https://bedbugstreatment.co.in/locations",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: location.name,
        item: `https://bedbugstreatment.co.in/locations/${location.slug}`,
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

      {/* Centered Hero Section */}
      <section className="relative isolate overflow-hidden bg-cream pb-14 pt-24 max-sm:pb-10 max-sm:pt-20 lg:pb-20 lg:pt-28">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(120%_140%_at_50%_0%,#f1faf5_0%,#fdf7f4_50%,#ffffff_100%)]" />
          <div className="absolute inset-0 bg-grid-light opacity-60" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-96 w-[36rem] rounded-full bg-brand-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            className="flex items-center justify-center gap-2 text-xs font-medium text-ink/60"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition hover:text-brand-600">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/30" />
            <Link href="/locations" className="transition hover:text-brand-600">
              Locations
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/30" />
            <span className="font-semibold text-brand-700">{location.name}</span>
          </nav>

          {/* City Badge */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-800">
            <MapPin className="h-3.5 w-3.5 text-brand-600" />
            <span>
              Verified Bed Bug Specialists in {location.name}, {location.state}
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            Bed Bug Treatment in{" "}
            <span className="text-brand-600">{location.name}</span>
          </h1>

          {/* Tagline / Subtitle */}
          <p className="mx-auto mt-3 max-w-2xl text-base font-medium text-brand-800 sm:text-lg">
            {location.tagline}
          </p>

          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-ink/70 sm:text-base">
            {location.heroDescription}
          </p>

          {/* Metric Stats Pills */}
          <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-ink/10 bg-white/80 px-3.5 py-2 text-xs font-medium text-ink shadow-sm backdrop-blur-sm sm:text-sm">
              <Clock className="h-4 w-4 text-brand-600" />
              <span>
                Response: <strong className="font-semibold">{location.responseTime}</strong>
              </span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-ink/10 bg-white/80 px-3.5 py-2 text-xs font-medium text-ink shadow-sm backdrop-blur-sm sm:text-sm">
              <Users className="h-4 w-4 text-brand-600" />
              <span>
                Specialists: <strong className="font-semibold">{location.activeTechnicians}</strong>
              </span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-ink/10 bg-white/80 px-3.5 py-2 text-xs font-medium text-ink shadow-sm backdrop-blur-sm sm:text-sm">
              <Home className="h-4 w-4 text-brand-600" />
              <span>
                Homes Treated: <strong className="font-semibold">{location.homesTreated}</strong>
              </span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-ink/10 bg-white/80 px-3.5 py-2 text-xs font-medium text-ink shadow-sm backdrop-blur-sm sm:text-sm">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>
                Rating: <strong className="font-semibold">{location.rating}/5</strong> ({location.reviewCount})
              </span>
            </div>
          </div>

          {/* Centered Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#book-inspection"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-500 hover:shadow-brand-600/35 max-sm:w-full"
            >
              <CalendarCheck className="h-4 w-4" />
              Book Free Inspection in {location.name}
            </a>
            <a
              href={site.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3.5 text-sm font-semibold text-ink shadow-sm transition hover:border-brand-600 hover:text-brand-700 max-sm:w-full"
            >
              <Phone className="h-4 w-4 text-brand-600" />
              Call Now: {location.phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${location.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(location.whatsappText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-6 py-3.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 max-sm:w-full"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Local Highlights & City Context */}
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
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
                className="group relative flex flex-col justify-between rounded-2xl border border-ink/10 bg-cream/30 p-6 transition duration-300 hover:border-brand-600/30 hover:bg-white hover:shadow-xl hover:shadow-brand-600/5"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/10 text-brand-600">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink">
                    {highlight.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">
                    {highlight.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-brand-700">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  <span>Guaranteed in {location.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Localities & Neighborhoods Coverage */}
      <section className="bg-cream/50 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
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
                className="flex flex-col rounded-2xl border border-ink/10 bg-white p-6 shadow-sm transition hover:border-brand-500/40"
              >
                <div className="flex items-center gap-3 border-b border-ink/10 pb-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600/10 text-brand-600">
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

                <div className="mt-4 flex flex-wrap gap-2">
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
      <section className="bg-cream/40 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
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
            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-extrabold text-white">
                01
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink">
                Intensive Inspection
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/65">
                We inspect mattress seams, headboards, electrical sockets, skirting boards, and sofa crevices to map the full infestation.
              </p>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-extrabold text-white">
                02
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink">
                Targeted Odorless Treatment
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/65">
                Government-approved odorless micro-emulsion is injected into harborages, eliminating active adult bed bugs on contact.
              </p>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-extrabold text-white">
                03
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink">
                High-Heat Egg Eradication
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/65">
                Superheated steam penetrates fabric fibers and tufts, destroying microscopic eggs that chemical sprays cannot reach.
              </p>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-extrabold text-white">
                04
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink">
                12-Month Warranty Coverage
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/65">
                You receive a stamped 12-month warranty certificate. If you spot a single bed bug during the period, we re-treat free of charge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Local FAQs */}
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
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

      {/* Centered Booking Section */}
      <section id="book-inspection" className="bg-cream/60 py-14 lg:py-20 scroll-mt-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1 text-xs font-semibold text-brand-800">
              <Zap className="h-3.5 w-3.5 text-brand-600" />
              <span>Same-Day Inspection Available</span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
              Book Bed Bug Inspection in{" "}
              <span className="text-brand-600">{location.name}</span>
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-ink/70 sm:text-base">
              Fill out the form below. A licensed {location.name} technician will call you within 15 minutes to confirm your time slot.
            </p>
          </div>

          <div className="mt-8">
            <ContactForm defaultCity={location.name} />
          </div>
        </div>
      </section>

      {/* Other Service Locations */}
      <section className="border-t border-ink/10 bg-white py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="font-display text-lg font-bold text-ink">
              Looking for service in other cities?
            </h3>
            <p className="mt-1 text-xs text-ink/60">
              We provide identical guaranteed service across all major metropolitan hubs:
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {locations
              .filter((l) => l.slug !== location.slug)
              .map((otherCity) => (
                <Link
                  key={otherCity.slug}
                  href={`/locations/${otherCity.slug}`}
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
      <CtaSection />
    </>
  );
}
