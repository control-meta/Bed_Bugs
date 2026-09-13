import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  Crosshair,
  Leaf,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const features = [
  {
    icon: UserRound,
    title: "Bed Bug Specialists",
    description: "Focused expertise for bed bug infestations.",
  },
  {
    icon: Search,
    title: "Thorough Inspection",
    description:
      "We look beyond the mattress, inspecting beds, furniture, frames and nearby areas.",
  },
  {
    icon: CalendarCheck,
    title: "One-Time & 1-Year Plans",
    description: "Choose the service that fits your needs.",
  },
  {
    icon: ShieldCheck,
    title: "Clear, Professional Service",
    description: "Straightforward treatment and guidance.",
  },
];

const planPoints = ["One-Time Service", "1-Year Plan", "3 Scheduled Visits"];

export function WhySection() {
  return (
    <section className="relative overflow-hidden bg-white py-10 lg:py-14">
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_88%_8%,#f1faf5_0%,#ffffff_55%,#ffffff_100%)]" />
        <div className="absolute inset-0 bg-grid-light opacity-40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">
              <span className="h-px w-8 bg-brand-500" />
              Why Choose Us
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl lg:text-[2.2rem]">
              Not just pest control —
              <span className="block text-brand-600">bed bug specialists.</span>
            </h2>
            <p className="mt-3.5 max-w-lg text-sm leading-relaxed text-ink/65 sm:text-[0.92rem]">
              We focus specifically on bed bug treatment, with trained
              technicians who inspect sleeping areas, furniture and common
              hiding spots before applying a targeted treatment approach.
            </p>

            <ul className="mt-6 grid gap-x-5 gap-y-4 sm:grid-cols-2">
              {features.map((feature) => (
                <li key={feature.title} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <feature.icon className="h-4 w-4" strokeWidth={1.9} />
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-bold text-ink">
                      {feature.title}
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink/60">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-900"
              >
                More About Us
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="hidden h-6 w-px bg-ink/10 sm:block" />
              <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-ink/75">
                <span className="flex items-center gap-1.5">
                  <CalendarCheck className="h-4 w-4 text-brand-600" />
                  {planPoints[0]}
                </span>
                {planPoints.slice(1).map((point) => (
                  <span key={point} className="flex items-center gap-x-2.5">
                    <span className="h-1 w-1 rounded-full bg-brand-500" />
                    {point}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[27rem] lg:mx-0 lg:ml-auto lg:max-w-[29rem] xl:max-w-[31rem]">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-4 border-white shadow-xl">
                <Image
                  src="/images/why-choose-us.webp"
                  alt="Technician applying a targeted bed bug treatment to a room"
                  fill
                  sizes="(min-width: 1024px) 38vw, 90vw"
                  className="object-cover"
                />
              </div>

              <div className="absolute -top-3 right-2 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-lg sm:right-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600/10 text-brand-600">
                  <CalendarDays className="h-4 w-4" />
                </span>
                <p className="text-xs font-bold leading-tight text-ink">
                  1-Year Service Plan
                  <span className="block text-[10px] font-medium text-ink/55">
                    3 Scheduled Visits
                  </span>
                </p>
              </div>

              <div className="absolute -bottom-2 left-2 flex items-center gap-2.5 rounded-xl bg-ink px-3 py-2 text-white shadow-lg sm:left-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600/25 text-brand-300">
                  <Crosshair className="h-4 w-4" />
                </span>
                <p className="text-xs font-bold leading-tight">
                  Targeted Treatment
                  <span className="block text-[10px] font-medium text-white/60">
                    Based on inspection level
                  </span>
                </p>
              </div>

              <div className="absolute -bottom-2 right-4 hidden h-20 w-28 overflow-hidden rounded-xl border-2 border-white shadow-lg sm:block lg:h-24 lg:w-32">
                <Image
                  src="/images/bedbug-closeup.jpg"
                  alt="Close-up inspection of a mattress for bed bugs"
                  fill
                  sizes="130px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* A safer, healthier home for you badge */}
            <div className="mt-6 hidden justify-end pr-2 sm:flex lg:mt-7">
              <div className="flex items-center gap-2 rotate-[-5deg] select-none">
                <span className="flex items-center text-brand-600">
                  <Leaf className="h-5 w-5 -rotate-12 fill-brand-600/20 text-brand-600" />
                </span>
                <div className="text-left font-semibold text-brand-700">
                  <p
                    className="text-[0.95rem] leading-tight"
                    style={{
                      fontFamily:
                        "'Caveat', 'Segoe Script', 'Bradley Hand', 'Comic Sans MS', cursive",
                    }}
                  >
                    A safer, healthier
                  </p>
                  <div className="relative inline-block">
                    <p
                      className="text-[0.95rem] leading-tight"
                      style={{
                        fontFamily:
                          "'Caveat', 'Segoe Script', 'Bradley Hand', 'Comic Sans MS', cursive",
                      }}
                    >
                      home for you
                    </p>
                    <svg
                      className="absolute -bottom-1.5 left-0 h-2 w-full overflow-visible text-brand-600"
                      viewBox="0 0 100 8"
                      fill="none"
                    >
                      <path
                        d="M1 5.5C28 2 68 7 99 2.5"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
