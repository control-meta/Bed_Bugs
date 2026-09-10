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
    description: "Government-approved, low-toxicity formulations only.",
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
    <section className="relative overflow-hidden bg-cream py-20 lg:py-28">
      <div
        className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-brand-100/70 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Why Choose Us"
              title={
                <>
                  Not just another pest control —{" "}
                  <span className="text-brand-600">bed bug specialists.</span>
                </>
              }
              description="We focus entirely on solving one serious problem, effectively and permanently. Every treatment is performed by trained and verified technicians who understand exactly where bed bugs hide."
            />
            <ul className="mt-10 space-y-6">
              {reasons.map((reason) => (
                <li key={reason.title} className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600/10">
                    <reason.icon className="h-6 w-6 text-brand-600" />
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
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-maroon-800"
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
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border-8 border-white shadow-2xl">
              <Image
                src="/images/treatment-3.png"
                alt="Before and after professional bed bug treatment of a mattress"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 w-56 rounded-2xl bg-ink p-5 text-white shadow-2xl sm:left-8">
              <p className="font-display text-3xl font-extrabold text-brand-500">
                30 min
              </p>
              <p className="mt-1 text-sm text-white/70">
                Bed bugs killed with advanced professional treatment
              </p>
            </div>
            <div className="absolute -right-2 -top-6 hidden items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-2xl sm:flex">
              <ShieldCheck className="h-8 w-8 text-brand-600" />
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
