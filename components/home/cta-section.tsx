import Image from "next/image";
import { PhoneCall, ShieldCheck } from "lucide-react";
import { site } from "@/lib/site";

const ctaImages = [
  {
    src: "/images/treatment-1.png",
    alt: "Family sleeping peacefully after professional bed bug treatment",
  },
  {
    src: "/images/treatment-2.png",
    alt: "Certified technician carrying out a bed bug inspection",
  },
  {
    src: "/images/treatment-3.png",
    alt: "Safe and effective bed bug treatment in progress",
  },
  {
    src: "/images/services/service-spray.jpg",
    alt: "Targeted bed bug spray treatment",
  },
];

export function CtaSection({
  className = "py-10 max-sm:pb-2 max-sm:pt-2 lg:py-12",
}: {
  className?: string;
}) {
  return (
    <section className={`bg-white ${className}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink max-sm:rounded-[1.5rem] max-sm:ring-1 max-sm:ring-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(110%_140%_at_15%_10%,#14532d_0%,#0b2e1f_45%,#08160f_80%)]" />
          <div className="absolute inset-0 bg-grid-dark opacity-20" aria-hidden />

          <div className="relative grid items-center gap-8 max-sm:gap-2 lg:grid-cols-2">
            <div className="px-7 pb-8 pt-10 max-sm:px-6 max-sm:pb-2 max-sm:pt-6 max-sm:text-center sm:px-10 lg:py-14">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-300 max-sm:justify-center max-sm:text-[0.65rem] max-sm:tracking-[0.2em]">
                <span className="h-px w-8 bg-brand-500" />
                Book Your Free Inspection
              </p>
              <h2 className="mt-4 font-display text-2xl font-extrabold leading-tight tracking-tight text-white max-sm:mt-3 max-sm:text-[1.4rem] sm:text-3xl lg:text-[2.25rem]">
                Say goodbye to bed bugs{" "}
                <span className="text-brand-300">permanently.</span>
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/85 max-sm:mx-auto max-sm:mt-3 max-sm:text-[0.8rem]">
                <span className="max-sm:hidden">
                  Schedule your free inspection today. Same-day service available
                  across Pune, Mumbai, Bangalore, Delhi &amp; Noida.
                </span>
                <span className="hidden max-sm:inline">
                  Free inspection with same-day service available.
                </span>
              </p>
              <div className="mt-6 flex flex-col items-center gap-4 max-sm:mt-5 sm:flex-row sm:justify-center">
                <a
                  href={site.phoneHref}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-brand-600/40 transition hover:bg-brand-500 max-sm:w-full max-sm:py-3"
                >
                  <PhoneCall className="h-5 w-5" />
                  {site.phoneDisplay}
                </a>
              </div>
              <p className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-white/80 max-sm:hidden max-sm:mt-4">
                <ShieldCheck className="h-4 w-4 shrink-0 text-brand-300" />
                100% money-back guarantee · 12-month warranty
              </p>
            </div>

            <div className="relative h-64 w-full overflow-hidden max-sm:h-40 sm:h-80 lg:h-full lg:min-h-[22rem]">
              {ctaImages.map((image, index) => (
                <div
                  key={image.src}
                  className="absolute inset-0 animate-cta-slide will-change-transform"
                  style={{
                    animationDelay: `-${(ctaImages.length - index) * 5}s`,
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover object-center lg:[mask-image:linear-gradient(to_right,transparent,black_18%)]"
                  />
                </div>
              ))}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-ink/40" />

              <div className="absolute bottom-6 left-1/2 z-10 flex w-40 -translate-x-1/2 items-center gap-2 lg:left-10 lg:translate-x-0">
                {ctaImages.map((image, index) => (
                  <span
                    key={image.src}
                    className="h-1 flex-1 origin-left animate-cta-bar rounded-full bg-white"
                    style={{
                      animationDelay: `-${(ctaImages.length - index) * 5}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
