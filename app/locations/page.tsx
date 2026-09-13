import type { Metadata } from "next";
import Image from "next/image";
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

      {/* Centered Hero with Prominent Metro Showcase */}
      {/* Centered Hero with Panoramic Metro Skyline Background & Showcase */}
      <section className="relative isolate overflow-hidden bg-cream pb-8 pt-20 max-sm:pb-6 max-sm:pt-16 lg:pb-10 lg:pt-24">
        {/* Panoramic Metro Skyline Background & Atmosphere */}
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          <Image
            src="/images/cities/mumbai.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/92 to-cream/35 max-lg:bg-gradient-to-b max-lg:from-cream/95 max-lg:via-cream/85 max-lg:to-cream/45" />
          <div className="absolute inset-0 bg-grid-light opacity-25" />
          <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-brand-400/15 blur-3xl" />
          <div className="absolute -right-20 top-12 h-96 w-96 rounded-full bg-accent-400/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Content */}
            <div className="text-center lg:col-span-7 lg:text-left">
              <nav
                className="flex items-center justify-center gap-2 text-xs font-medium text-ink/60 lg:justify-start"
                aria-label="Breadcrumb"
              >
                <Link href="/" className="transition hover:text-brand-600">
                  Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-ink/30" />
                <span className="font-semibold text-brand-700">Locations</span>
              </nav>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-800">
                <MapPin className="h-3.5 w-3.5 text-brand-600" />
                <span>Pan-India Coverage Across Key Metro Hubs</span>
              </div>

              <h1 className="mt-3.5 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl lg:text-[3rem]">
                Bed Bug Treatment{" "}
                <span className="text-brand-600">Service Locations</span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70 sm:text-base">
                Select your city to view local coverage zones, localized pricing packages, technician response times, and book a free same-day inspection.
              </p>

              {/* Mobile-Only Showcase Card (Centered in viewport on mobile preview) */}
              <div className="my-5 flex w-full justify-center lg:hidden">
                <div className="relative aspect-[16/10] w-full max-w-sm overflow-hidden rounded-2xl border-2 border-white bg-white shadow-xl shadow-brand-900/10 ring-1 ring-black/5 sm:max-w-md">
                  <Image
                    src="/images/cities/mumbai.jpg"
                    alt="Indian Metropolitan Cityscapes"
                    fill
                    priority
                    sizes="(max-width: 1023px) 90vw, 40vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full border border-white/40 bg-white/95 px-2.5 py-0.5 text-[10.5px] font-bold text-brand-800 shadow-md">
                    <Clock className="h-3 w-3 text-brand-600" />
                    <span>Same-Day Dispatch</span>
                  </div>
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full border border-white/40 bg-brand-700/90 px-2.5 py-0.5 text-[10.5px] font-semibold text-white shadow-md">
                    <ShieldCheck className="h-3 w-3 text-emerald-300" />
                    <span>5 Metro Hubs</span>
                  </div>
                  <div className="absolute bottom-2.5 left-3 right-3 text-center text-white sm:text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                      Pune • Mumbai • Bangalore • Delhi • Noida
                    </p>
                    <h3 className="font-display text-base font-bold leading-tight">
                      Dedicated Local Dispatch Hubs
                    </h3>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-ink/80 lg:justify-start">
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

            {/* Desktop Right Column: Prominently Visible Pan-India Metro Showcase Card */}
            <div className="relative mx-auto hidden w-full max-w-lg lg:col-span-5 lg:block lg:max-w-none">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-2xl shadow-brand-900/10 ring-1 ring-black/5">
                <Image
                  src="/images/cities/mumbai.jpg"
                  alt="Indian Metropolitan Cityscapes"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />

                {/* Top Badge: Response Time */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 rounded-full border border-white/40 bg-white/95 px-3 py-1 text-[11px] font-bold text-brand-800 shadow-md backdrop-blur-md">
                  <Clock className="h-3.5 w-3.5 text-brand-600" />
                  <span>Same-Day Dispatch</span>
                </div>

                {/* Top Left Badge: Network */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full border border-white/40 bg-brand-700/90 px-3 py-1 text-[11px] font-semibold text-white shadow-md backdrop-blur-md">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                  <span>5 Metro Hubs</span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-semibold tracking-wider uppercase text-emerald-300 drop-shadow-sm">
                    Pune • Mumbai • Bangalore • Delhi • Noida
                  </p>
                  <h3 className="font-display text-xl font-bold leading-tight drop-shadow-md sm:text-2xl">
                    Dedicated Local Dispatch Hubs
                  </h3>
                  <p className="mt-1 text-xs text-white/80 font-medium">
                    Over 50,000+ Homes &amp; Commercial Properties Protected
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* City Directory Grid */}
      <section className="bg-white py-8 lg:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            size="compact"
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
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-ink/10 bg-cream/20 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-600/30 hover:bg-white hover:shadow-xl hover:shadow-brand-600/10"
                >
                  <div>
                    {/* City Landmark/Skyline Photo Banner */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-950">
                      <Image
                        src={loc.image}
                        alt={`Bed Bug Treatment ${loc.name}`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                      
                      <span className="absolute top-3 right-3 rounded-full border border-white/40 bg-white/90 px-2.5 py-1 text-[10.5px] font-bold text-brand-800 shadow-sm backdrop-blur-md">
                        {loc.responseTime}
                      </span>

                      <div className="absolute bottom-3 left-4 right-4 text-center text-white sm:text-left">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300 drop-shadow-sm">
                          {loc.state}
                        </span>
                        <h2 className="font-display text-2xl font-bold leading-tight drop-shadow-sm">
                          {loc.name}
                        </h2>
                      </div>
                    </div>

                    <div className="p-6 pb-2 text-center sm:text-left">
                      <p className="text-xs leading-relaxed text-ink/70 line-clamp-2">
                        {loc.heroDescription}
                      </p>

                      {/* Local stats */}
                      <div className="mt-4 grid grid-cols-2 gap-2 border-y border-ink/10 py-3 text-xs text-center sm:text-left">
                        <div>
                          <span className="text-ink/50">Rating:</span>{" "}
                          <strong className="text-ink">{loc.rating}</strong>
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
                        <div className="mt-2 flex flex-wrap justify-center gap-1.5 sm:justify-start">
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
                  </div>

                  <div className="p-6 pt-2">
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
      <CtaSection className="pt-2 pb-10 max-sm:pt-1 max-sm:pb-4 lg:pt-3 lg:pb-14" />
    </>
  );
}
