import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Home,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { locations } from "@/lib/locations";
import { site } from "@/lib/site";
import { CtaSection } from "@/components/home/cta-section";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Service Locations | Bed Bug Treatment Across India",
  description:
    "Expert, odorless bed bug treatment services available in Pune, Mumbai, Bangalore, Delhi & Noida. Fast same-day inspection with 12-month service warranty.",
  alternates: {
    canonical: "https://bedbugstreatment.co.in/locations",
  },
};

const locationsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: locations.map((loc, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    name: `Bed Bug Treatment ${loc.name}`,
    url: `https://bedbugstreatment.co.in/locations/${loc.slug}`,
  })),
};

export default function LocationsIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationsJsonLd) }}
      />

      {/* Centered Hero */}
      <section className="relative isolate overflow-hidden bg-cream pb-14 pt-24 max-sm:pb-10 max-sm:pt-20 lg:pb-20 lg:pt-28">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(120%_140%_at_50%_0%,#f1faf5_0%,#fdf7f4_50%,#ffffff_100%)]" />
          <div className="absolute inset-0 bg-grid-light opacity-60" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-96 w-[36rem] rounded-full bg-brand-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <nav
            className="flex items-center justify-center gap-2 text-xs font-medium text-ink/60"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition hover:text-brand-600">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink/30" />
            <span className="font-semibold text-brand-700">Locations</span>
          </nav>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-800">
            <MapPin className="h-3.5 w-3.5 text-brand-600" />
            <span>Pan-India Coverage Across Key Metro Hubs</span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            Bed Bug Treatment <span className="text-brand-600">Service Locations</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink/70 sm:text-base">
            Select your city to view local coverage zones, localized pricing packages, technician response times, and book a free same-day inspection.
          </p>

          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-ink/80">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-brand-600" /> Same-day technician dispatch
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-600" /> 12-month service warranty
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-600" /> 100% odorless &amp; pet-safe
            </span>
          </div>
        </div>
      </section>

      {/* City Directory Grid */}
      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Cities"
            title={
              <>
                Choose your city for{" "}
                <span className="text-brand-600">localized pest control</span>
              </>
            }
            description="Dedicated local branch offices and mobile teams stationed in each city for immediate assistance."
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc) => {
              const previewLocalities = loc.coverageAreas
                .flatMap((z) => z.localities)
                .slice(0, 6);

              return (
                <div
                  key={loc.slug}
                  className="group flex flex-col justify-between rounded-3xl border border-ink/10 bg-cream/20 p-6 transition duration-300 hover:border-brand-600/30 hover:bg-white hover:shadow-xl hover:shadow-brand-600/5"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                        <MapPin className="h-6 w-6" />
                      </span>
                      <span className="rounded-full border border-brand-500/20 bg-brand-50 px-3 py-1 text-[11px] font-semibold text-brand-700">
                        {loc.responseTime}
                      </span>
                    </div>

                    <h2 className="mt-5 font-display text-2xl font-bold text-ink group-hover:text-brand-700 transition">
                      {loc.name}
                    </h2>
                    <p className="text-xs font-semibold text-brand-600">{loc.state}</p>

                    <p className="mt-2 text-xs leading-relaxed text-ink/70 line-clamp-2">
                      {loc.heroDescription}
                    </p>

                    {/* Local stats */}
                    <div className="mt-4 grid grid-cols-2 gap-2 border-y border-ink/10 py-3 text-xs">
                      <div>
                        <span className="text-ink/50">Rating:</span>{" "}
                        <strong className="text-ink">{loc.rating}/5</strong>
                      </div>
                      <div>
                        <span className="text-ink/50">Homes:</span>{" "}
                        <strong className="text-ink">{loc.homesTreated}</strong>
                      </div>
                    </div>

                    {/* Coverage localities preview */}
                    <div className="mt-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/50">
                        Popular Coverage Areas:
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {previewLocalities.map((item, iIdx) => (
                          <span
                            key={iIdx}
                            className="rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-ink/70 border border-ink/5"
                          >
                            {item}
                          </span>
                        ))}
                        <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">
                          + more
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4">
                    <Link
                      href={`/locations/${loc.slug}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-xs font-semibold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-500 group-hover:shadow-brand-600/30"
                    >
                      <span>View {loc.name} Services &amp; Pricing</span>
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Emergency Hotline Card */}
            <div className="flex flex-col justify-between rounded-3xl bg-ink p-6 text-white shadow-xl">
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-400">
                  <Zap className="h-6 w-6" />
                </span>

                <h2 className="mt-5 font-display text-2xl font-bold text-white">
                  Need Help Outside These Cities?
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  Our regional partner network frequently services adjacent tier-2 industrial belts and residential clusters on special request.
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/80">
                    Call our pan-India central dispatch desk to check service availability for your pincode.
                  </p>
                  <p className="mt-2 font-display text-base font-bold text-brand-400">
                    {site.phoneDisplay}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={site.phoneHref}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-xs font-semibold text-white transition hover:bg-brand-500"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call Central Helpline
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection />
    </>
  );
}
