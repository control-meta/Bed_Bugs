import { MapPin, PhoneCall, Zap } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { cities, site } from "@/lib/site";

export function LocationsSection() {
  return (
    <section id="locations" className="bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Service Areas"
          title={
            <>
              Bed bug treatment across{" "}
              <span className="text-brand-600">India&apos;s major cities</span>
            </>
          }
          description="Local teams, local knowledge. Same-day inspection available in every city we serve."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <div
              key={city.name}
              className="group flex items-start gap-4 rounded-3xl border border-ink/10 bg-white p-6 transition hover:border-brand-600/30 hover:shadow-xl hover:shadow-brand-600/5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600">
                <MapPin className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-ink">
                  {city.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/55">
                  {city.areas}
                </p>
              </div>
            </div>
          ))}

          <div className="flex flex-col justify-between rounded-3xl bg-ink p-7 text-white sm:col-span-2 lg:col-span-1">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-600/20 px-3 py-1 text-xs font-semibold text-brand-400">
                <Zap className="h-3.5 w-3.5" />
                Same-day service
              </span>
              <h3 className="mt-4 font-display text-xl font-bold">
                Not sure if we cover your area?
              </h3>
              <p className="mt-2 text-sm text-white/65">
                Call us and we will confirm availability near you in minutes.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
              >
                <PhoneCall className="h-4 w-4" />
                Call Now
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
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
