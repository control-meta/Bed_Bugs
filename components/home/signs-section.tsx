import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bug,
  CircleDot,
  Droplets,
  Layers,
  Moon,
  Wind,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const signs = [
  {
    icon: Moon,
    title: "Itchy bites in rows",
    description:
      "Bites on arms, neck and legs, often appearing in lines or clusters after sleeping.",
  },
  {
    icon: Droplets,
    title: "Blood spots on sheets",
    description:
      "Small rust-coloured stains where bed bugs have fed or been crushed.",
  },
  {
    icon: CircleDot,
    title: "Dark spots & droppings",
    description:
      "Tiny black speckles along mattress seams, tags and furniture joints.",
  },
  {
    icon: Layers,
    title: "Shed skins & eggshells",
    description:
      "Pale, translucent shells in folds, cracks and behind the headboard.",
  },
  {
    icon: Wind,
    title: "Sweet, musty odour",
    description:
      "A stale, sweet smell that builds up in heavily infested rooms.",
  },
  {
    icon: Bug,
    title: "Live bugs or eggs",
    description:
      "Small reddish-brown insects or tiny white eggs near seams and piping.",
  },
];

export function SignsSection() {
  return (
    <section id="signs" className="bg-white py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          size="compact"
          eyebrow="Warning Signs"
          title={
            <>
              Signs you might have{" "}
              <span className="text-brand-600">bed bugs</span>
            </>
          }
          description="Bed bugs are experts at hiding. If you notice any of these signs, a same-day inspection can confirm the problem early — before it spreads."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {signs.map((sign) => (
            <div
              key={sign.title}
              className="group flex gap-4 rounded-2xl border border-ink/10 bg-cream/60 p-5 transition hover:-translate-y-1 hover:border-brand-600/30 hover:bg-white hover:shadow-[0_30px_60px_-25px_rgba(225,25,49,0.25)]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <sign.icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-ink">
                  {sign.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
                  {sign.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-10 overflow-hidden rounded-2xl bg-ink p-5 text-white sm:p-6">
          <div className="absolute inset-0 bg-grid-dark opacity-20" aria-hidden />
          <div
            className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-700/30 blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:h-16 sm:w-16">
              <Image
                src="/images/bedbug-closeup.jpg"
                alt="Close-up of a bed bug on a mattress"
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-base font-bold text-white sm:text-lg">
                Seeing any of these signs?
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-white/65">
                Book a free same-day inspection — we will confirm the
                infestation and give you a clear, honest quote.
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500"
            >
              Book Free Inspection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
