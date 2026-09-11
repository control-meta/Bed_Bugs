import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Leaf,
  PiggyBank,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const reasons = [
  {
    icon: ShieldCheck,
    title: "100% money-back guarantee",
    description: "Backed by a 30-day guarantee and a 12-month service warranty.",
  },
  {
    icon: Sparkles,
    title: "100% safe for children & pets",
    description: "Low-toxicity, family-safe formulations only.",
  },
  {
    icon: Leaf,
    title: "Eco-friendly & 100% odorless",
    description: "No harsh smell and no need to throw away your belongings.",
  },
  {
    icon: PiggyBank,
    title: "Affordable, transparent pricing",
    description: "Free inspection and a clear estimate before we begin.",
  },
];

export function WhySection() {
  return (
    <section className="relative overflow-hidden bg-cream py-10 lg:py-14">
      <div
        className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-brand-100/70 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              size="compact"
              eyebrow="Why Choose Us"
              title={
                <>
                  Not just another pest control —{" "}
                  <span className="text-brand-600">bed bug specialists.</span>
                </>
              }
              description="We focus entirely on solving one serious problem, effectively and permanently. Every treatment is performed by trained technicians who understand exactly where bed bugs hide."
            />
            <ul className="mt-8 space-y-4">
              {reasons.map((reason) => (
                <li key={reason.title} className="flex gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-600/10">
                    <reason.icon className="h-5 w-5 text-brand-600" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-ink">
                      {reason.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink/60">
                      {reason.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-maroon-800"
              >
                More About Us
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="flex items-center gap-2 text-sm font-medium text-ink/70">
                <CheckCircle2 className="h-5 w-5 text-brand-600" />
                100% money-back guaranteed
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-[6px] border-white shadow-2xl">
              <Image
                src="/images/why-choose-us.webp"
                alt="Technician treating a bedroom while a family sleeps peacefully, bed bug free"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-3 w-48 rounded-2xl bg-ink p-4 text-white shadow-2xl sm:left-6">
              <p className="font-display text-2xl font-extrabold text-brand-500">
                30 min
              </p>
              <p className="mt-1 text-xs text-white/70">
                Bed bugs killed with advanced professional treatment
              </p>
            </div>
            <div className="absolute -right-2 -top-5 hidden items-center gap-2.5 rounded-2xl bg-white px-4 py-3 shadow-2xl sm:flex">
              <ShieldCheck className="h-7 w-7 text-brand-600" />
              <p className="text-sm font-bold text-ink">
                12-Month
                <span className="block font-medium text-ink/55">
                  Warranty
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
