import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  breadcrumb: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-cream pb-14 pt-24 max-sm:pb-8 lg:pb-16 lg:pt-28">
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(120%_140%_at_80%_0%,#f1faf5_0%,#fdf7f4_45%,#ffffff_100%)]" />
        <div className="absolute inset-0 bg-grid-light opacity-70" />
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* High-Tech Circular Radar & Bedbug Center Animation */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[45%] items-center justify-center lg:flex xl:right-4 xl:w-[48%]"
          aria-hidden
        >
          <div className="relative flex h-[24rem] w-[24rem] items-center justify-center">
            <div className="absolute inset-14 rounded-full bg-brand-300/30 blur-3xl animate-pulse-glow" />

            <div className="absolute inset-8 overflow-hidden rounded-full animate-[radar-spin_9s_linear_infinite]">
              <div className="h-full w-full rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_305deg,rgba(47,158,108,0.14)_360deg)]" />
            </div>

            <div className="absolute inset-9 rounded-full border border-brand-600/15" />
            <div className="absolute inset-9 rounded-full border border-dashed border-brand-600/25 animate-[radar-spin_26s_linear_infinite]">
              <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-brand-600 shadow-[0_0_0_5px_rgba(31,128,85,0.12)]" />
            </div>

            <div className="relative z-10 h-48 w-48 overflow-hidden rounded-full border-[0.5rem] border-white bg-white shadow-[0_28px_70px_-24px_rgba(23,82,58,0.45)]">
              <Image
                src="/images/bedbug.png"
                alt="Realistic bed bug"
                fill
                sizes="190px"
                className="object-contain p-6"
                priority
              />
            </div>
          </div>
        </div>

        <nav
          className="flex items-center gap-2 text-xs font-medium text-ink/55"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition hover:text-ink">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-brand-600">{breadcrumb}</span>
        </nav>

        <p className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">
          <span className="h-px w-8 bg-brand-500" />
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/65">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
