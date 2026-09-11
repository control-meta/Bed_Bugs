import { MapPin, PhoneCall, Zap } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { cities, site } from "@/lib/site";

export function LocationsSection() {
  return (
    <section id="locations" className="bg-cream py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          size="compact"
          eyebrow="Service Areas"
          title={
            <>
              Bed bug treatment across{" "}
              <span className="text-brand-600">India&apos;s major cities</span>
            </>
          }
          description="Local teams, local knowledge. Same-day inspection available in every city we serve."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <div
              key={city.name}
              className="group flex items-start gap-3.5 rounded-2xl border border-ink/10 bg-white p-5 transition hover:border-brand-600/30 hover:shadow-xl hover:shadow-brand-600/5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-ink">
                  {city.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/55">
                  {city.areas}
                </p>
              </div>
            </div>
          ))}

          <div className="flex h-full flex-col justify-between rounded-2xl bg-ink p-5 text-white">
            <div className="flex items-start gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-600/20 text-brand-400">
                <Zap className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-sm font-bold">
                  Not sure if we cover your area?
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-white/60">
                  Call us to confirm availability near you.
                </p>
              </div>
            </div>
            <div className="mt-1.5 flex flex-wrap justify-center gap-2">
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-3.5 py-1 text-xs font-semibold text-white transition hover:bg-brand-500"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                Call Now
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-white/25 px-3.5 py-1 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
