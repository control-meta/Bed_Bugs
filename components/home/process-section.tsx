import { Lightbulb, RefreshCw, SearchCheck, SprayCan } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { processSteps } from "@/lib/site";

const stepIcons = [SearchCheck, SprayCan, RefreshCw, Lightbulb];

export function ProcessSection() {
  return (
    <section
      id="process"
      className="relative scroll-mt-20 overflow-hidden bg-brand-50/50 py-12 lg:py-16"
    >
      <div className="absolute inset-0 bg-grid-light opacity-60" aria-hidden />
      <div
        className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-brand-100/50 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          size="compact"
          eyebrow="How It Works"
          title={
            <>
              Our proven{" "}
              <span className="text-brand-600">4-step treatment process</span>
            </>
          }
          description="A disciplined process that removes the infestation completely — and keeps it from coming back."
        />

        <div className="relative mt-10">
          <div
            className="absolute left-0 right-0 top-[22px] hidden h-px bg-gradient-to-r from-transparent via-brand-600/40 to-transparent lg:block"
            aria-hidden
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {processSteps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <div key={step.step} className="relative text-center">
                  <div className="relative z-10 mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-brand-600">
                    Step {step.step}
                  </p>
                  <h3 className="mt-1.5 font-display text-lg font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">
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
