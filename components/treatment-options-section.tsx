import { Check, Home, CalendarCheck, MessageCircle } from "lucide-react";

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
        <div className="mx-auto mt-8 sm:mt-10 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 items-stretch">
          {/* Card 1: One-Time Bed Bug Treatment */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition hover:shadow-md">
            <div>
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
                    One-Time Bed Bug Treatment
                  </h3>
                  <p className="text-xs sm:text-sm text-ink/60">
                    For immediate treatment needs
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <ul className="mt-6 sm:mt-8 space-y-3 sm:space-y-3.5">
                {oneTimeFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-brand-600 stroke-[2.5] mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-ink/80 leading-snug">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <a
                href={finalOneTimeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-brand-600 py-3 sm:py-3.5 px-4 text-center font-display text-sm sm:text-base font-bold text-white shadow-sm transition duration-200 hover:bg-brand-700 active:scale-[0.99]"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span>Book One-Time Treatment</span>
              </a>
            </div>
          </div>

          {/* Card 2: 1-Year Bed Bug AMC */}
          <div className="flex flex-col justify-between rounded-3xl border-[3.5px] sm:border-4 border-brand-600 bg-white p-6 sm:p-8 shadow-md transition hover:shadow-lg relative">
            <div>
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                  <CalendarCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
                    1-Year Bed Bug AMC
                  </h3>
                  <p className="text-xs sm:text-sm text-ink/60">
                    3 Visits Over 12 Months
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <ul className="mt-6 sm:mt-8 space-y-3 sm:space-y-3.5">
                {amcFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-brand-600 stroke-[2.5] mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-ink/80 leading-snug">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <a
                href={finalAmcHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-brand-600 py-3 sm:py-3.5 px-4 text-center font-display text-sm sm:text-base font-bold text-white shadow-sm transition duration-200 hover:bg-brand-700 active:scale-[0.99]"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span>Choose 1-Year AMC</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <p className="mx-auto mt-4 sm:mt-5 text-center text-xs sm:text-sm text-ink/60">
          The recommended option depends on infestation level, affected areas and property conditions.
        </p>
      </div>
    </section>
  );
}
