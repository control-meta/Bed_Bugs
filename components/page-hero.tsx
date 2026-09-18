import Image from "next/image";

export function PageHero({
  eyebrow,
  title,
  description,
  radarSize = "default",
  altMap,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  radarSize?: "default" | "compact";
  altMap?: Record<string, string>;
}) {
  const isCompact = radarSize === "compact";

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
          className={`pointer-events-none absolute inset-y-0 right-0 hidden items-center justify-center lg:flex ${
            isCompact
              ? "w-[40%] xl:right-8 xl:w-[42%]"
              : "w-[45%] xl:right-4 xl:w-[48%]"
          }`}
          aria-hidden
        >
          <div
            className={`relative flex items-center justify-center ${
              isCompact
                ? "h-[16.5rem] w-[16.5rem] -translate-y-4"
                : "h-[24rem] w-[24rem]"
            }`}
          >
            <div
              className={`absolute rounded-full bg-brand-300/30 blur-3xl animate-pulse-glow ${
                isCompact ? "inset-10" : "inset-14"
              }`}
            />

            <div
              className={`absolute overflow-hidden rounded-full animate-[radar-spin_9s_linear_infinite] ${
                isCompact ? "inset-5" : "inset-8"
              }`}
            >
              <div className="h-full w-full rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_305deg,rgba(47,158,108,0.14)_360deg)]" />
            </div>

            <div
              className={`absolute rounded-full border border-brand-600/15 ${
                isCompact ? "inset-6" : "inset-9"
              }`}
            />
            <div
              className={`absolute rounded-full border border-dashed border-brand-600/25 animate-[radar-spin_26s_linear_infinite] ${
                isCompact ? "inset-6" : "inset-9"
              }`}
            >
              <span
                className={`absolute left-1/2 -translate-x-1/2 rounded-full bg-brand-600 shadow-[0_0_0_5px_rgba(31,128,85,0.12)] ${
                  isCompact ? "-top-1.5 h-2.5 w-2.5" : "-top-1.5 h-3 w-3"
                }`}
              />
            </div>

            <div
              className={`relative z-10 overflow-hidden rounded-full border-white bg-white shadow-[0_28px_70px_-24px_rgba(23,82,58,0.45)] ${
                isCompact
                  ? "h-32 w-32 border-[0.375rem]"
                  : "h-48 w-48 border-[0.5rem]"
              }`}
            >
              <Image
                src="/images/real-bedbug-macro.png"
                alt={altMap?.["/images/real-bedbug-macro.png"] || "Macro photograph of adult bed bug for pest identification and eradication"}
                fill
                sizes={isCompact ? "130px" : "190px"}
                className={`object-contain ${isCompact ? "p-3.5" : "p-5"}`}
                priority
              />
            </div>
          </div>
        </div>

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
