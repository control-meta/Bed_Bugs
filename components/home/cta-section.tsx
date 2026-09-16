import Image from "next/image";
import { PhoneCall, ShieldCheck } from "lucide-react";
import { site } from "@/lib/site";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

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
              <div className="mt-6 flex flex-col items-center gap-3 max-sm:mt-5 sm:flex-row sm:justify-center sm:gap-2.5">
                <a
                  href={site.phoneHref}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-3.5 text-[13px] font-semibold text-brand-700 shadow-xl shadow-black/10 transition hover:bg-white/90 max-sm:w-full max-sm:py-3 max-sm:text-sm"
                >
                  <PhoneCall className="h-4 w-4" />
                  Call {site.phoneDisplay}
                </a>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/40 px-4 py-3.5 text-[13px] font-semibold text-white transition hover:border-white/70 hover:bg-white/10 max-sm:w-full max-sm:py-3 max-sm:text-sm"
                >
                  <WhatsAppIcon className="h-4.5 w-4.5" />
                  WhatsApp Us Now
                </a>
              </div>
              <p className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-white/80 max-sm:hidden max-sm:mt-4">
                <ShieldCheck className="h-4 w-4 shrink-0 text-brand-300" />
                Professional, effective and 100% odorless bed bug treatment for homes, hotels and businesses across India.
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
