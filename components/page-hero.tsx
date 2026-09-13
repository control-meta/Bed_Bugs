import Image from "next/image";
import Link from "next/link";
import { Award, ChevronRight, Leaf, Shield } from "lucide-react";

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
        {/* Minimal Animated Background Elements */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[45%] items-center justify-center lg:flex xl:right-6 xl:w-[48%]"
          aria-hidden
        >
          {/* Subtle Glowing Orbs */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute top-1/4 -right-12 h-[28rem] w-[28rem] animate-float rounded-full bg-brand-100/40 blur-3xl" />
            <div className="absolute bottom-1/4 left-12 h-[24rem] w-[24rem] animate-float-slow rounded-full bg-accent-50/40 blur-3xl" />
          </div>

          {/* Minimal Floating Elements */}
          <div className="relative flex h-full w-full items-center justify-center">
             {/* Center Glass Element */}
             <div className="relative flex h-24 w-24 animate-float items-center justify-center rounded-3xl border border-white/80 bg-white/50 shadow-[0_8px_32px_rgba(25,103,70,0.08)] backdrop-blur-xl">
                <Shield className="h-10 w-10 text-brand-600/90" strokeWidth={1.5} />
             </div>
             
             {/* Orbital Elements */}
             <div className="absolute top-[35%] right-[30%] flex animate-float-slow items-center justify-center rounded-2xl border border-white/60 bg-white/40 p-3 shadow-lg backdrop-blur-md">
                <Leaf className="h-5 w-5 text-accent-500/90" strokeWidth={1.5} />
             </div>
             
             <div className="absolute bottom-[35%] left-[30%] flex animate-float-slower items-center justify-center rounded-2xl border border-white/60 bg-white/40 p-3 shadow-lg backdrop-blur-md">
                <Award className="h-5 w-5 text-brand-500/90" strokeWidth={1.5} />
             </div>
          </div>
          
          {/* Dust Particles */}
          <span className="absolute left-[25%] top-[25%] h-1 w-1 animate-float rounded-full bg-brand-400/40" />
          <span className="absolute right-[25%] top-[65%] h-1.5 w-1.5 animate-float-slower rounded-full bg-accent-400/40" />
          <span className="absolute left-[40%] bottom-[30%] h-1 w-1 animate-float-slow rounded-full bg-brand-500/40" />
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
