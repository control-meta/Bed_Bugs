import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BedDouble,
  Building2,
  CalendarCheck,
  Clock,
  Crosshair,
  Home,
  Leaf,
  MessageCircle,
  ShieldCheck,
  Star,
} from "lucide-react";
import { site, stats } from "@/lib/site";
import { QuickConnectForm } from "@/components/quick-connect-form";

const features = [
  { icon: ShieldCheck, title: "Safe for", subtitle: "Your Family & Pets" },
  { icon: Crosshair, title: "Targeted", subtitle: "Treatment" },
  { icon: Clock, title: "Same-Day", subtitle: "Inspection" },
  { icon: BadgeCheck, title: "12-Month", subtitle: "Warranty" },
];

const categories = [
  {
    icon: Home,
    title: "Homes & Apartments",
    description: "Bedrooms, mattresses and living spaces",
    image: "/images/treatment-3.png",
  },
  {
    icon: BedDouble,
    title: "Hotels & Guest Rooms",
    description: "Professional service for hospitality properties",
    image: "/images/treatment-1.png",
  },
  {
    icon: Building2,
    title: "Offices & Businesses",
    description: "Treatment solutions for commercial spaces",
    image: "/images/treatment-2.png",
  },
];

function StatIcon({ index }: { index: number }) {
  const icons = [Star, Home, ShieldCheck, Award];
  const Icon = icons[index];
  return (
    <Icon
      className="h-[1.45em] w-[1.45em] shrink-0 text-brand-600"
      strokeWidth={1.8}
    />
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-svh flex-col bg-cream lg:justify-center-safe"
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_12%_0%,#f1faf5_0%,#fdf7f4_45%,#ffffff_100%)]" />

        {/* Animated Moving Mesh Gradients (BEHIND the blur layer) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Gradient Blob 1 - Lush Emerald Green */}
          <div className="absolute -left-20 -top-16 h-[34rem] w-[34rem] rounded-full bg-gradient-to-tr from-brand-500 via-emerald-400 to-teal-300 opacity-60 blur-2xl animate-gradient-blob-1" />

          {/* Gradient Blob 2 - Warm Coral & Apricot Glow */}
          <div className="absolute left-[16%] top-[24%] h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-accent-400 via-amber-200 to-brand-300 opacity-50 blur-2xl animate-gradient-blob-2" />

          {/* Gradient Blob 3 - Spring Mint & Forest Green */}
          <div className="absolute -left-10 bottom-12 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-brand-600 via-teal-400 to-emerald-200 opacity-55 blur-2xl animate-gradient-blob-3" />

          {/* Gradient Blob 4 - Luminous Cyan/Teal Flare */}
          <div className="absolute left-[34%] top-[8%] h-[26rem] w-[26rem] rounded-full bg-gradient-to-r from-emerald-300 via-brand-200 to-teal-100 opacity-50 blur-xl animate-gradient-blob-4" />
        </div>

        {/* Frosted Glass Blur Layer */}
        <div className="pointer-events-none absolute inset-0 backdrop-blur-[42px] bg-cream/55 sm:bg-cream/50" />

        {/* Minimal Soft Ambient Sunlight Shimmer (No lines, pure soft light wash) */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-[150%] w-80 -rotate-12 bg-gradient-to-r from-transparent via-white/45 to-transparent blur-3xl animate-shimmer-slide" />

        {/* Minimal Ambient Floating Particles (Zero lines, soft luminous dots drifting in air) */}
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute left-[14%] top-[26%] h-2.5 w-2.5 rounded-full bg-brand-400/60 shadow-[0_0_10px_rgba(47,158,108,0.7)] animate-float" />
          <span className="absolute left-[36%] top-[18%] h-2 w-2 rounded-full bg-emerald-400/70 shadow-[0_0_8px_rgba(52,211,153,0.75)] animate-float-slow" />
          <span className="absolute left-[24%] top-[58%] h-3 w-3 rounded-full bg-brand-300/50 shadow-[0_0_12px_rgba(139,212,177,0.8)] animate-float-slower" />
          <span className="absolute left-[44%] top-[38%] h-2 w-2 rounded-full bg-accent-300/50 shadow-[0_0_8px_rgba(238,123,109,0.7)] animate-float" />
          <span className="absolute left-[8%] top-[72%] h-2.5 w-2.5 rounded-full bg-brand-400/50 shadow-[0_0_10px_rgba(47,158,108,0.6)] animate-float-slow" />
          <span className="absolute left-[30%] top-[82%] h-2 w-2 rounded-full bg-emerald-500/55 shadow-[0_0_8px_rgba(16,185,129,0.65)] animate-float-slower" />
        </div>
      </div>

      <div
        className="absolute inset-y-0 right-0 hidden w-[44%] xl:w-[46%] lg:block"
        aria-hidden
      >
        <div className="relative h-full w-full [clip-path:polygon(28%_0,100%_0,100%_100%,0_100%)]">
          <Image
            src="/images/hero-tech-bed.webp"
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1280px) 46vw, 44vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      <div className="hero-fluid pointer-events-none absolute bottom-[24%] right-[15%] z-10 hidden lg:block">
        <div className="relative h-[11.5em] w-[11.5em]">
          <div className="absolute -inset-[0.75em] rounded-full border border-accent-500/40" />
          <div className="absolute inset-0 animate-pulse-ring rounded-full" />
          <div className="relative h-full w-full overflow-hidden rounded-full border-[0.28em] border-accent-600 shadow-[0_25px_60px_-20px_rgba(200,57,44,0.45)]">
            <Image
              src="/images/bedbug-closeup.jpg"
              alt="Close-up of a bed bug"
              fill
              sizes="224px"
              className="object-cover"
            />
          </div>
          <span className="absolute -right-[6em] bottom-[2em] hidden h-px w-[6em] bg-gradient-to-r from-accent-500 to-transparent xl:block" />
          <span className="absolute -right-[6em] bottom-[1.9em] hidden h-[0.55em] w-[0.55em] rounded-full bg-accent-500 shadow-[0_0_12px_2px_rgba(200,57,44,0.6)] xl:block" />
        </div>
      </div>

      <div className="hero-fluid relative z-20 mx-auto flex w-full max-w-7xl flex-col px-4 pt-[max(5.5rem,7em)] max-sm:pt-20 sm:px-6 lg:px-8 lg:pt-[7.5em]">
        <div className="flex max-w-[45em] flex-col gap-[1.05em] max-sm:gap-[0.65em] lg:max-w-[46em]">
          <p className="flex items-center gap-[1em] text-[0.78em] font-semibold uppercase tracking-[0.28em] text-brand-700">
            <span className="h-px w-[2.6em] shrink-0 bg-brand-500" />
            Professional Bed Bug Treatment
          </p>

          <h1 className="font-display text-[2.4em] font-extrabold leading-[1.06] tracking-tight text-ink max-sm:text-[2em] sm:text-[2.9em] lg:text-[3.4em]">
            Bed Bugs?
            <span className="block">
              Get Your <span className="text-brand-600">Home Back.</span>
            </span>
          </h1>

          <p className="max-w-[33em] text-[1.05em] leading-relaxed text-ink/65 max-sm:whitespace-nowrap max-sm:text-[0.82em] max-sm:leading-snug">
            <span className="max-sm:hidden">
              Safe, effective and long-lasting bed bug treatment for homes,
              apartments, hotels and businesses. Sleep peacefully again.
            </span>
            <span className="hidden max-sm:inline">
              Safe, effective &amp; lasting bed bug treatment.
            </span>
          </p>

          <div className="relative mb-[1.6em] sm:order-last sm:mb-0 sm:mt-[1.8em] lg:hidden">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4em] border border-ink/10">
              <Image
                src="/images/hero-tech-bed.webp"
                alt="Technician treating a bed for bed bugs"
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 640px) calc(100vw - 3rem), calc(100vw - 2rem)"
                className="object-cover object-center"
              />
            </div>
            <div className="absolute -bottom-[1.8em] -right-[0.6em] h-[8em] w-[8em] overflow-hidden rounded-full border-[0.22em] border-accent-600 bg-white shadow-2xl sm:h-[9em] sm:w-[9em]">
              <Image
                src="/images/bedbug-closeup.jpg"
                alt="Close-up of a bed bug"
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex max-w-[46em] flex-wrap gap-x-[1.8em] gap-y-[0.9em] max-sm:grid max-sm:grid-cols-4 max-sm:gap-x-[0.4em] max-sm:gap-y-[0.55em] lg:max-w-none lg:flex-nowrap">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-[0.7em] max-sm:flex-col max-sm:gap-[0.3em] max-sm:text-center"
              >
                <span className="flex h-[2.6em] w-[2.6em] shrink-0 items-center justify-center rounded-full border border-brand-500/40 bg-brand-600/10 max-sm:h-[1.9em] max-sm:w-[1.9em]">
                  <feature.icon className="h-[1.3em] w-[1.3em] text-brand-600 max-sm:h-[1.05em] max-sm:w-[1.05em]" />
                </span>
                <span className="text-[0.92em] font-medium leading-tight text-ink/90 max-sm:text-[0.68em]">
                  {feature.title}
                  <span className="block text-ink/55">
                    {feature.subtitle}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <QuickConnectForm />

          <div className="flex max-w-[38em] flex-col items-center justify-center gap-[0.9em] max-sm:gap-[0.55em] sm:flex-row">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-[0.7em] rounded-full bg-brand-600 px-[1.8em] py-[0.95em] text-[0.92em] font-semibold text-white shadow-xl shadow-brand-600/30 transition hover:bg-brand-500 max-sm:py-[0.8em]"
            >
              <CalendarCheck className="h-[1.2em] w-[1.2em]" />
              Book Free Inspection
              <ArrowRight className="h-[1.1em] w-[1.1em] transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-[0.7em] rounded-full border border-ink/20 bg-white/70 px-[1.8em] py-[0.95em] text-[0.92em] font-semibold text-ink transition hover:border-ink/45 hover:bg-white max-sm:py-[0.8em]"
            >
              <MessageCircle className="h-[1.2em] w-[1.2em] text-brand-600" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="hero-fluid relative z-20 mx-auto w-full max-w-[66em] px-4 py-[1.5em] sm:px-6 lg:px-8">
        <div className="grid gap-[0.9em] sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.title}
              className="relative flex items-center gap-[0.9em] overflow-hidden rounded-[1.1em] border border-brand-500/25 bg-brand-50 p-[1em] shadow-[0_18px_45px_-32px_rgba(23,6,9,0.5)]"
            >
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 22vw, 50vw"
                  className="scale-[1.14] object-cover object-right opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-50 from-45% via-brand-50/90 to-brand-50/15" />
              </div>

              <div className="relative z-10 flex h-[2.8em] w-[2.8em] shrink-0 items-center justify-center rounded-full border border-brand-500/20 bg-white shadow-sm">
                <category.icon
                  className="h-[1.4em] w-[1.4em] text-brand-600"
                  strokeWidth={1.9}
                />
              </div>
              <div className="relative z-10 min-w-0">
                <p className="text-[0.95em] font-bold leading-tight text-ink">
                  {category.title}
                </p>
                <p className="mt-[0.25em] text-[0.8em] font-medium leading-snug text-ink/75">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-fluid relative z-20 mx-auto w-full max-w-[66em] px-4 pb-[max(1rem,2em)] sm:px-6 lg:px-8">
        <div className="grid gap-[1.2em] rounded-[1.5em] border border-ink/10 bg-white/85 p-[1.3em] shadow-[0_30px_80px_-35px_rgba(23,6,9,0.4)] ring-1 ring-inset ring-white/60 backdrop-blur-xl max-sm:grid-cols-2 max-sm:gap-[0.7em] lg:grid-cols-4 lg:gap-0">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="flex items-center gap-[0.7em] max-sm:flex-col max-sm:gap-[0.3em] max-sm:text-center lg:justify-center lg:border-l lg:border-ink/10 lg:px-[1.2em] lg:first:border-l-0"
            >
              <StatIcon index={index} />
              <p className="whitespace-nowrap text-[0.82em] font-bold leading-tight text-ink max-sm:whitespace-normal max-sm:text-[0.72em]">
                {stat.value}{" "}
                <span className="font-medium text-ink/55">
                  {stat.labelBold && stat.label.startsWith(stat.labelBold) ? (
                    <>
                      <span className="font-bold text-ink">{stat.labelBold}</span>
                      {stat.label.slice(stat.labelBold.length)}
                    </>
                  ) : (
                    stat.label
                  )}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
