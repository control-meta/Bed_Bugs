import {
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
    <section id="signs" className="bg-white py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          size="compact"
          eyebrow="Warning Signs"
          title={
            <>
              Signs you might have{" "}
              <span className="text-accent-600">bed bugs</span>
            </>
          }
          description="Bed bugs are experts at hiding. If you notice any of these signs, a same-day inspection can confirm the problem early — before it spreads."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {signs.map((sign) => (
            <div
              key={sign.title}
              className="group flex gap-4 rounded-2xl border border-ink/10 bg-cream/60 p-5 transition hover:-translate-y-1 hover:border-accent-600/30 hover:bg-white hover:shadow-[0_30px_60px_-25px_rgba(200,57,44,0.22)]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-600/10 text-accent-600 transition group-hover:bg-accent-600 group-hover:text-white">
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
      </div>
    </section>
  );
}
