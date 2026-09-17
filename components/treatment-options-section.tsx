import { Check, Home, CalendarCheck } from "lucide-react";
import { PopularBadge } from "@/components/popular-badge";

interface TreatmentOptionsSectionProps {
  id?: string;
  className?: string;
  oneTimeHref?: string;
  amcHref?: string;
  cityName?: string;
  whatsappPhone?: string;
}

const oneTimeFeatures = [
  "Detailed inspection",
  "Targeted bed bug treatment",
  "Treatment of identified hiding areas",
  "Post-treatment guidance",
  "Suitable for homes, apartments, hotels and offices",
];

const amcFeatures = [
  "Initial inspection and treatment",
  "3 scheduled visits over 12 months",
  "Follow-up treatment visits",
  "Monitoring for recurring activity",
  "Guidance to reduce re-infestation risk",
];

const iconBubble =
  "flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(ellipse_at_center,#c9eddd,#f0fcf6_70%)] text-[#008c5a]";

const buttonClass =
  "mt-6 flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#008c5a] to-[#006c4a] px-4 py-3 text-center font-display text-sm font-bold text-white shadow-sm transition hover:brightness-110 active:scale-[0.99]";

export function TreatmentOptionsSection({
  id = "treatment-options",
  className = "",
  oneTimeHref,
  amcHref,
  cityName,
  whatsappPhone = "919769321234",
}: TreatmentOptionsSectionProps) {
  const phone = whatsappPhone.replace(/[^0-9]/g, "");

  const defaultOneTimeHref = `https://wa.me/${phone}?text=${encodeURIComponent(
    cityName
      ? `Hi, I want to book the One-Time Bed Bug Treatment in ${cityName}. Please share the details.`
      : `Hi, I want to book the One-Time Bed Bug Treatment. Please share the details.`
  )}`;

  const defaultAmcHref = `https://wa.me/${phone}?text=${encodeURIComponent(
    cityName
      ? `Hi, I want to choose the 1-Year Bed Bug AMC in ${cityName}. Please share the details.`
      : `Hi, I want to choose the 1-Year Bed Bug AMC. Please share the details.`
  )}`;

  const finalOneTimeHref = oneTimeHref || defaultOneTimeHref;
  const finalAmcHref = amcHref || defaultAmcHref;

  return (
    <section id={id} className={`bg-white pt-3 pb-3 sm:pt-4 sm:pb-4 lg:pt-6 lg:pb-4 scroll-mt-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-600">
            <span className="h-px w-8 bg-brand-600/60" />
            <span>BED BUG TREATMENT OPTIONS</span>
            <span className="h-px w-8 bg-brand-600/60" />
          </div>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
            One-Time Treatment or 1-Year AMC
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-xs sm:text-sm text-ink/70 leading-relaxed">
            Choose the service plan that best fits your bed bug problem. A one-time treatment is suitable for immediate treatment needs, while our 1-Year AMC provides three visits over 12 months for continued protection.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-6 sm:mt-10 md:grid-cols-2 lg:gap-8">
          {/* Card 1: One-Time Bed Bug Treatment */}
          <article className="relative flex flex-col rounded-2xl border border-[#d9e9e2] bg-[#fdfffe] shadow-sm transition hover:shadow-md">
            {/* Header */}
            <div className="flex items-center gap-4 rounded-t-2xl px-6 pb-4 pt-6 sm:px-7">
              <span className={iconBubble}>
                <Home className="h-7 w-7" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-[#146d51] sm:text-lg">
                  One-Time Bed Bug Treatment
                </h3>
                <p className="mt-0.5 text-xs text-[#2c916d] sm:text-sm">
                  For immediate treatment needs
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col px-6 pb-6 sm:px-7">
              <ul className="flex-1 space-y-3">
                {oneTimeFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#008c5a] stroke-[2.5]" />
                    <span className="text-xs font-medium leading-snug text-[#385247] sm:text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href={finalOneTimeHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass}
              >
                Book One-Time Treatment
              </a>
            </div>
          </article>

          {/* Card 2: 1-Year Bed Bug AMC (Most Popular) */}
          <article className="relative flex flex-col rounded-2xl border border-[#65ac95] bg-[#fdfffe] shadow-md ring-1 ring-[#c6e2d8] transition hover:shadow-lg">
            <PopularBadge />
            {/* Header */}
            <div className="flex items-center gap-4 rounded-t-2xl bg-gradient-to-r from-[#07805b] to-[#006a47] px-6 pb-4 pt-6 sm:px-7">
              <span className={iconBubble}>
                <CalendarCheck className="h-7 w-7" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-white sm:text-lg">
                  1-Year Bed Bug AMC
                </h3>
                <p className="mt-0.5 text-xs text-white/85 sm:text-sm">
                  3 Visits Over 12 Months
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col px-6 pb-6 sm:px-7">
              <ul className="flex-1 space-y-3">
                {amcFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#008c5a] stroke-[2.5]" />
                    <span className="text-xs font-medium leading-snug text-[#385247] sm:text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href={finalAmcHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass}
              >
                Choose 1-Year AMC
              </a>
            </div>
          </article>
        </div>

        {/* Footnote */}
        <p className="mx-auto mt-4 sm:mt-5 text-center text-xs sm:text-sm text-ink/60">
          The recommended option depends on infestation level, affected areas and property conditions.
        </p>
      </div>
    </section>
  );
}
