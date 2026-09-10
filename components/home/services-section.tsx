import {
  ArrowUpRight,
  BedDouble,
  Bug,
  Building2,
  SearchCheck,
  ShieldCheck,
  Sofa,
} from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { services } from "@/lib/site";

const iconMap = {
  bug: Bug,
  search: SearchCheck,
  bed: BedDouble,
  sofa: Sofa,
  building: Building2,
  shield: ShieldCheck,
} as const;

export function ServicesSection() {
  return (
    <section id="services" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Services"
          title={
            <>
              Complete bed bug control for{" "}
              <span className="text-brand-600">homes and businesses</span>
            </>
          }
          description="From a single mattress to an entire hotel floor, our specialists deliver discreet, targeted treatments that eliminate every life stage of bed bugs — adults, nymphs and eggs."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            return (
              <Link
                key={service.title}
                href="/contact"
                className="group relative overflow-hidden rounded-3xl border border-ink/10 bg-cream/60 p-7 transition duration-300 hover:-translate-y-1 hover:border-brand-600/30 hover:bg-white hover:shadow-[0_30px_60px_-25px_rgba(225,25,49,0.35)]"
              >
                <div
                  className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-600/10 transition-transform duration-300 group-hover:scale-150"
                  aria-hidden
                />
                <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-brand-500 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-7 w-7" strokeWidth={1.8} />
                </span>
                <h3 className="relative mt-6 font-display text-lg font-bold text-ink">
                  {service.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-ink/60">
                  {service.description}
                </p>
                <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                  Book inspection
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
