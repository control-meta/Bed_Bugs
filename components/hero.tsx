import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  CalendarCheck,
  Clock,
  Crosshair,
  Home,
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

const avatars = [
  { initials: "RK", color: "from-brand-400 to-brand-600" },
  { initials: "AM", color: "from-ink/70 to-ink" },
  { initials: "SR", color: "from-brand-300 to-brand-500" },
  { initials: "PN", color: "from-accent-400 to-accent-600" },
];

const statsMobileLabels = ["Housings", "Available", "Warranty"];

function StatIcon({ index }: { index: number }) {
  const icons = [Home, ShieldCheck, Award];
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
      className="relative isolate flex min-h-svh flex-col bg-cream"
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_12%_0%,#f1faf5_0%,#fdf7f4_45%,#ffffff_100%)]" />
        <div className="absolute inset-0 bg-grid-light opacity-70 mask-fade-b" />
        <div className="absolute -left-32 -top-24 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />

        <div className="absolute left-0 top-0 h-[130%] w-[62%] -rotate-12 bg-gradient-to-b from-brand-600/[0.04] to-transparent" />
        <div className="absolute left-[30%] top-0 h-[140%] w-px -rotate-12 bg-gradient-to-b from-transparent via-brand-500/40 to-transparent" />
        <div className="absolute left-[42%] top-0 h-[140%] w-px -rotate-12 bg-gradient-to-b from-transparent via-brand-500/20 to-transparent" />
        <svg
          className="absolute bottom-0 left-0 w-full opacity-60"
          viewBox="0 0 1440 140"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 118C300 60 620 150 900 96C1120 54 1300 40 1440 74"
            stroke="url(#curve)"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="curve" x1="0" y1="0" x2="1440" y2="0">
              <stop offset="0" stopColor="#1f8055" stopOpacity="0" />
              <stop offset="0.5" stopColor="#55ba8b" stopOpacity="0.7" />
              <stop offset="1" stopColor="#1f8055" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
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

      <div className="hero-fluid relative z-20 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-[3em] pt-[max(5.5rem,7em)] max-sm:pb-[1.5em] max-sm:pt-20 sm:px-6 lg:px-8 lg:pb-[1.5em] lg:pt-[7.5em]">
        <div className="flex max-w-[45em] flex-col gap-[1.05em] max-sm:gap-[0.65em] lg:max-w-[46em] lg:-translate-y-[2em]">
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

          <div className="flex flex-col gap-[0.9em] max-sm:gap-[0.55em] sm:flex-row sm:items-center">
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

      <div className="hero-fluid relative z-20 mx-auto w-full max-w-[66em] px-4 pb-[max(1rem,2em)] sm:px-6 lg:px-8">
        <div className="grid gap-[1.2em] rounded-[1.5em] border border-ink/10 bg-white/85 p-[1.3em] shadow-[0_30px_80px_-35px_rgba(23,6,9,0.4)] ring-1 ring-inset ring-white/60 backdrop-blur-xl max-sm:grid-cols-3 max-sm:gap-[0.6em] lg:grid-cols-[1.2fr_repeat(3,1fr)] lg:gap-0">
          <div className="flex items-center gap-[0.9em] max-sm:col-span-3 max-sm:flex-col max-sm:gap-[0.4em] lg:pr-[2em]">
            <div className="flex -space-x-[0.45em]">
              {avatars.map((avatar) => (
                <span
                  key={avatar.initials}
                  className={`flex h-[2.4em] w-[2.4em] items-center justify-center rounded-full border-[0.12em] border-white bg-gradient-to-br ${avatar.color} text-[0.62em] font-bold text-white`}
                >
                  {avatar.initials}
                </span>
              ))}
            </div>
            <div className="max-sm:text-center">
              <p className="flex items-center gap-[0.4em] whitespace-nowrap text-[0.88em] font-bold leading-tight text-ink max-sm:justify-center">
                {site.rating}
                <span className="flex items-center gap-[0.12em]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-[0.85em] w-[0.85em] fill-accent-500 text-accent-500"
                    />
                  ))}
                </span>
              </p>
              <p className="mt-[0.15em] text-[0.88em] font-medium leading-tight text-ink/55">
                Customer Rating
              </p>
            </div>
          </div>

          {stats.slice(0, 3).map((stat, index) => (
            <div
              key={stat.label}
              className="flex items-center gap-[0.9em] max-sm:flex-col max-sm:gap-[0.3em] max-sm:text-center lg:border-l lg:border-ink/10 lg:px-[2em]"
            >
              <StatIcon index={index} />
              <p className="whitespace-nowrap text-[0.88em] font-bold leading-tight text-ink max-sm:whitespace-normal max-sm:text-[0.78em]">
                {stat.value}
                <span className="block font-medium text-ink/55">
                  <span className="max-sm:hidden">{stat.label}</span>
                  <span className="hidden max-sm:inline">
                    {statsMobileLabels[index]}
                  </span>
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
