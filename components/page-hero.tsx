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
        <div className="absolute right-[10%] top-0 h-[140%] w-px rotate-12 bg-gradient-to-b from-transparent via-brand-500/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
