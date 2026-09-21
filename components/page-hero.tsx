import Image from "next/image";

export function PageHero({
  eyebrow,
  title,
  description,
  radarSize = "default",
  tightBottom = false,
  altMap,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  radarSize?: "default" | "compact";
  tightBottom?: boolean;
  altMap?: Record<string, string>;
}) {
  const isCompact = radarSize === "compact";

  return (
    <section
      className={`relative isolate overflow-hidden bg-cream pt-24 lg:pt-28 ${
        tightBottom ? "pb-6 max-sm:pb-4 lg:pb-8" : "pb-14 max-sm:pb-8 lg:pb-16"
      }`}
    >
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(120%_140%_at_80%_0%,#f1faf5_0%,#fdf7f4_45%,#ffffff_100%)]" />
        <div className="absolute inset-0 bg-grid-light opacity-70" />
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl" />

        {/* Animated gradient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 -top-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-brand-500 via-emerald-400 to-teal-300 opacity-20 blur-3xl animate-gradient-blob-1" />
          <div className="absolute left-[20%] top-[10%] h-[22rem] w-[22rem] rounded-full bg-gradient-to-br from-accent-400 via-amber-200 to-brand-300 opacity-[0.16] blur-3xl animate-gradient-blob-2" />
          <div className="absolute right-[2%] top-[5%] h-[20rem] w-[20rem] rounded-full bg-gradient-to-r from-emerald-300 via-brand-200 to-teal-100 opacity-15 blur-3xl animate-gradient-blob-4" />
          <div className="absolute left-[50%] bottom-0 h-[18rem] w-[18rem] rounded-full bg-gradient-to-tr from-brand-600 via-teal-400 to-emerald-200 opacity-[0.12] blur-3xl animate-gradient-blob-3" />
        </div>

        {/* Shimmer sweep */}
        <div className="pointer-events-none absolute -left-20 -top-10 h-[200%] w-64 -rotate-12 bg-gradient-to-r from-transparent via-white/35 to-transparent blur-3xl animate-shimmer-slide" />

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0">
          {/* Top row */}
          <span className="absolute left-[6%]  top-[20%] h-2   w-2   rounded-full bg-brand-400/65  shadow-[0_0_10px_rgba(47,158,108,0.7)]   animate-[float_5s_ease-in-out_infinite_0s]" />
          <span className="absolute left-[18%] top-[15%] h-1.5 w-1.5 rounded-full bg-emerald-400/70 shadow-[0_0_8px_rgba(52,211,153,0.75)]   animate-[float_4s_ease-in-out_infinite_1s]" />
          <span className="absolute left-[32%] top-[30%] h-2.5 w-2.5 rounded-full bg-brand-300/55  shadow-[0_0_12px_rgba(139,212,177,0.8)]  animate-[float_6s_ease-in-out_infinite_0.5s]" />
          <span className="absolute left-[48%] top-[18%] h-2   w-2   rounded-full bg-teal-400/60    shadow-[0_0_10px_rgba(45,212,191,0.65)]  animate-[float_7s_ease-in-out_infinite_2s]" />
          <span className="absolute left-[62%] top-[25%] h-1.5 w-1.5 rounded-full bg-accent-300/60  shadow-[0_0_8px_rgba(238,123,109,0.7)]   animate-[float_5s_ease-in-out_infinite_1.3s]" />
          <span className="absolute right-[6%]  top-[22%] h-2.5 w-2.5 rounded-full bg-emerald-400/55 shadow-[0_0_12px_rgba(52,211,153,0.65)]  animate-[float_6s_ease-in-out_infinite_0.7s]" />
          <span className="absolute right-[20%] top-[14%] h-2   w-2   rounded-full bg-brand-500/60   shadow-[0_0_10px_rgba(47,158,108,0.65)]  animate-[float_4.5s_ease-in-out_infinite_2.5s]" />
          <span className="absolute right-[36%] top-[28%] h-1.5 w-1.5 rounded-full bg-accent-400/65  shadow-[0_0_6px_rgba(238,123,109,0.65)]  animate-[float_5.5s_ease-in-out_infinite_0.8s]" />
          {/* Mid row */}
          <span className="absolute left-[8%]  top-[55%] h-2   w-2   rounded-full bg-teal-400/60    shadow-[0_0_8px_rgba(45,212,191,0.6)]    animate-[float_5s_ease-in-out_infinite_0.2s]" />
          <span className="absolute left-[22%] top-[65%] h-1.5 w-1.5 rounded-full bg-brand-300/65   shadow-[0_0_6px_rgba(139,212,177,0.65)]  animate-[float_4s_ease-in-out_infinite_1s]" />
          <span className="absolute left-[40%] top-[60%] h-2.5 w-2.5 rounded-full bg-accent-300/50  shadow-[0_0_10px_rgba(238,123,109,0.55)]  animate-[float_4.5s_ease-in-out_infinite_0.8s]" />
          <span className="absolute left-[56%] top-[70%] h-2   w-2   rounded-full bg-emerald-400/60  shadow-[0_0_8px_rgba(52,211,153,0.65)]   animate-[float_7s_ease-in-out_infinite_2.2s]" />
          <span className="absolute right-[8%]  top-[58%] h-2   w-2   rounded-full bg-teal-400/55    shadow-[0_0_8px_rgba(45,212,191,0.6)]    animate-[float_6s_ease-in-out_infinite_0s]" />
          <span className="absolute right-[24%] top-[52%] h-3   w-3   rounded-full bg-brand-300/45   shadow-[0_0_14px_rgba(139,212,177,0.6)]  animate-[float_8s_ease-in-out_infinite_1.5s]" />
          <span className="absolute right-[40%] top-[68%] h-1.5 w-1.5 rounded-full bg-accent-400/65  shadow-[0_0_6px_rgba(238,123,109,0.65)]  animate-[float_5s_ease-in-out_infinite_3s]" />
          {/* Bottom row */}
          <span className="absolute left-[12%] top-[80%] h-2.5 w-2.5 rounded-full bg-brand-400/55   shadow-[0_0_10px_rgba(47,158,108,0.6)]   animate-[float_6s_ease-in-out_infinite_0.5s]" />
          <span className="absolute left-[28%] top-[88%] h-2   w-2   rounded-full bg-emerald-500/60  shadow-[0_0_8px_rgba(16,185,129,0.65)]   animate-[float_5.5s_ease-in-out_infinite_1.5s]" />
          <span className="absolute left-[46%] top-[82%] h-1.5 w-1.5 rounded-full bg-accent-400/65   shadow-[0_0_6px_rgba(238,123,109,0.65)]  animate-[float_4.5s_ease-in-out_infinite_3s]" />
          <span className="absolute right-[16%] top-[85%] h-2   w-2   rounded-full bg-teal-400/55    shadow-[0_0_10px_rgba(45,212,191,0.6)]   animate-[float_8s_ease-in-out_infinite_2.5s]" />
          <span className="absolute right-[32%] top-[78%] h-2.5 w-2.5 rounded-full bg-brand-500/50   shadow-[0_0_12px_rgba(16,185,129,0.6)]   animate-[float_6.5s_ease-in-out_infinite_3.5s]" />
        </div>
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
