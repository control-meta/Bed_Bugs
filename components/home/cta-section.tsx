import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, PhoneCall, ShieldCheck } from "lucide-react";
import { site } from "@/lib/site";

export function CtaSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink">
          <div className="absolute inset-0 bg-[radial-gradient(110%_140%_at_15%_10%,#7f1024_0%,#3d0a12_45%,#170609_80%)]" />
          <div className="absolute inset-0 bg-grid-dark opacity-20" aria-hidden />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div className="px-7 pb-10 pt-14 sm:px-12 lg:py-20">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-400">
                <span className="h-px w-8 bg-brand-500" />
                Book Your Free Inspection
              </p>
              <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
                Say goodbye to bed bugs{" "}
                <span className="text-brand-500">permanently.</span>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70">
                Schedule your free inspection today. Same-day service available
                across Pune, Mumbai, Bangalore, Delhi &amp; Noida.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-brand-600 px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-brand-600/40 transition hover:bg-brand-500"
                >
                  <CalendarCheck className="h-5 w-5" />
                  Get Free Quote
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href={site.phoneHref}
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-white/30 px-7 py-4 text-sm font-semibold text-white transition hover:border-white/70 hover:bg-white/10"
                >
                  <PhoneCall className="h-5 w-5 text-brand-400" />
                  {site.phoneDisplay}
                </a>
              </div>
              <p className="mt-6 flex items-center gap-2 text-sm text-white/60">
                <ShieldCheck className="h-5 w-5 text-brand-400" />
                100% money-back guarantee · 12-month warranty
              </p>
            </div>

            <div className="relative h-72 w-full sm:h-96 lg:h-full lg:min-h-[30rem]">
              <Image
                src="/images/treatment-1.png"
                alt="Family sleeping peacefully after professional bed bug treatment"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center lg:[mask-image:linear-gradient(to_right,transparent,black_18%)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-ink/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
