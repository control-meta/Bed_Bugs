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
    <section className="relative isolate overflow-hidden bg-ink pb-14 pt-24 lg:pb-16 lg:pt-28">
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(120%_140%_at_80%_10%,#7f1024_0%,#3d0a12_40%,#170609_75%)]" />
        <div className="absolute inset-0 bg-grid-dark opacity-25" />
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-brand-700/25 blur-3xl" />
        <div className="absolute right-[10%] top-0 h-[140%] w-px rotate-12 bg-gradient-to-b from-transparent via-brand-500/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center gap-2 text-xs font-medium text-white/55"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-brand-400">{breadcrumb}</span>
        </nav>

        <p className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-400">
          <span className="h-px w-8 bg-brand-500" />
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
