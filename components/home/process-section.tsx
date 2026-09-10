import { Lightbulb, RefreshCw, SearchCheck, SprayCan } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { processSteps } from "@/lib/site";

const stepIcons = [SearchCheck, SprayCan, RefreshCw, Lightbulb];

export function ProcessSection() {
  return (
    <section id="process" className="relative overflow-hidden bg-ink py-20 lg:py-28">
      <div className="absolute inset-0 bg-grid-dark opacity-25" aria-hidden />
      <div
        className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-brand-700/25 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-brand-600/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          dark
          eyebrow="How It Works"
          title={
            <>
              Our proven{" "}
              <span className="text-brand-500">4-step treatment process</span>
            </>
          }
          description="A disciplined process that removes the infestation completely — and keeps it from coming back."
        />

        <div className="relative mt-16">
          <div
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-brand-600/60 to-transparent lg:block"
            aria-hidden
          />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {processSteps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <div key={step.step} className="relative">
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/40">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-5 font-display text-sm font-bold uppercase tracking-[0.25em] text-brand-400">
                    Step {step.step}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
