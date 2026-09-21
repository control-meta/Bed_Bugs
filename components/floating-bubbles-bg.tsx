/**
 * FloatingBubblesBg
 * Full animated background matching the home-page hero style:
 * radial base gradient → animated gradient blobs → frosted glass blur
 * → shimmer sweep → 35 floating glowing particles.
 *
 * Drop it as the FIRST child of any `relative overflow-hidden` container.
 */
export function FloatingBubblesBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>

      {/* ── Base radial gradient ── */}
      <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_12%_0%,#f1faf5_0%,#fdf7f4_45%,#ffffff_100%)]" />

      {/* ── Animated gradient blobs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-16 h-[34rem] w-[34rem] rounded-full bg-gradient-to-tr from-brand-500 via-emerald-400 to-teal-300 opacity-20 blur-3xl animate-gradient-blob-1" />
        <div className="absolute left-[16%] top-[24%] h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-accent-400 via-amber-200 to-brand-300 opacity-[0.18] blur-3xl animate-gradient-blob-2" />
        <div className="absolute -left-10 bottom-12 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-brand-600 via-teal-400 to-emerald-200 opacity-15 blur-3xl animate-gradient-blob-3" />
        <div className="absolute right-[5%] top-[8%] h-[26rem] w-[26rem] rounded-full bg-gradient-to-r from-emerald-300 via-brand-200 to-teal-100 opacity-15 blur-3xl animate-gradient-blob-4" />
        <div className="absolute right-[10%] bottom-[5%] h-[22rem] w-[22rem] rounded-full bg-gradient-to-tl from-accent-300 via-amber-100 to-brand-200 opacity-[0.12] blur-3xl animate-gradient-blob-1" style={{ animationDelay: "4s" }} />
        <div className="absolute left-[45%] top-[5%] h-[20rem] w-[20rem] rounded-full bg-gradient-to-br from-teal-300 via-emerald-200 to-brand-100 opacity-15 blur-3xl animate-gradient-blob-2" style={{ animationDelay: "6s" }} />
      </div>

      {/* ── Frosted glass layer ── */}
      <div className="pointer-events-none absolute inset-0 backdrop-blur-[64px] bg-white/70" />

      {/* ── Shimmer sweep ── */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-[150%] w-80 -rotate-12 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-3xl animate-shimmer-slide" />

      {/* ── 35 Floating glowing particles ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Row 1 - top area */}
        <span className="absolute left-[6%]  top-[8%]  h-2   w-2   rounded-full bg-brand-400/65  shadow-[0_0_10px_rgba(47,158,108,0.7)]  animate-[float_5s_ease-in-out_infinite_0s]" />
        <span className="absolute left-[18%] top-[5%]  h-1.5 w-1.5 rounded-full bg-emerald-400/70 shadow-[0_0_8px_rgba(52,211,153,0.75)]  animate-[float_4s_ease-in-out_infinite_1s]" />
        <span className="absolute left-[32%] top-[10%] h-2.5 w-2.5 rounded-full bg-brand-300/55  shadow-[0_0_12px_rgba(139,212,177,0.8)] animate-[float_6s_ease-in-out_infinite_0.5s]" />
        <span className="absolute left-[50%] top-[6%]  h-2   w-2   rounded-full bg-teal-400/60    shadow-[0_0_10px_rgba(45,212,191,0.65)]  animate-[float_7s_ease-in-out_infinite_2s]" />
        <span className="absolute left-[68%] top-[9%]  h-1.5 w-1.5 rounded-full bg-accent-300/60  shadow-[0_0_8px_rgba(238,123,109,0.7)]  animate-[float_5s_ease-in-out_infinite_1.3s]" />
        <span className="absolute right-[8%]  top-[7%]  h-2.5 w-2.5 rounded-full bg-emerald-400/55 shadow-[0_0_12px_rgba(52,211,153,0.65)] animate-[float_6s_ease-in-out_infinite_0.7s]" />
        <span className="absolute right-[22%] top-[4%]  h-2   w-2   rounded-full bg-brand-500/60  shadow-[0_0_10px_rgba(47,158,108,0.65)]  animate-[float_4.5s_ease-in-out_infinite_2.5s]" />

        {/* Row 2 - upper-mid area */}
        <span className="absolute left-[4%]  top-[22%] h-2.5 w-2.5 rounded-full bg-brand-400/60  shadow-[0_0_10px_rgba(47,158,108,0.7)]  animate-[float_5s_ease-in-out_infinite_0s]" />
        <span className="absolute left-[14%] top-[26%] h-2   w-2   rounded-full bg-teal-400/65    shadow-[0_0_8px_rgba(45,212,191,0.7)]   animate-[float_6s_ease-in-out_infinite_1s]" />
        <span className="absolute left-[28%] top-[20%] h-3   w-3   rounded-full bg-brand-300/50   shadow-[0_0_14px_rgba(139,212,177,0.8)] animate-[float_7s_ease-in-out_infinite_0.5s]" />
        <span className="absolute left-[44%] top-[28%] h-2   w-2   rounded-full bg-accent-400/55  shadow-[0_0_8px_rgba(238,123,109,0.65)] animate-[float_4.5s_ease-in-out_infinite_2s]" />
        <span className="absolute left-[60%] top-[22%] h-1.5 w-1.5 rounded-full bg-emerald-500/65 shadow-[0_0_8px_rgba(16,185,129,0.7)]   animate-[float_5s_ease-in-out_infinite_1.8s]" />
        <span className="absolute right-[14%] top-[20%] h-2   w-2   rounded-full bg-brand-400/70  shadow-[0_0_10px_rgba(47,158,108,0.75)] animate-[float_5s_ease-in-out_infinite_2s]" />
        <span className="absolute right-[30%] top-[25%] h-2.5 w-2.5 rounded-full bg-accent-300/55 shadow-[0_0_12px_rgba(252,165,165,0.65)] animate-[float_6s_ease-in-out_infinite_0.8s]" />

        {/* Row 3 - mid area */}
        <span className="absolute left-[8%]  top-[42%] h-2   w-2   rounded-full bg-teal-400/60    shadow-[0_0_8px_rgba(45,212,191,0.6)]   animate-[float_5s_ease-in-out_infinite_0.2s]" />
        <span className="absolute left-[22%] top-[48%] h-1.5 w-1.5 rounded-full bg-brand-300/65   shadow-[0_0_6px_rgba(139,212,177,0.65)] animate-[float_4s_ease-in-out_infinite_1s]" />
        <span className="absolute left-[38%] top-[38%] h-2.5 w-2.5 rounded-full bg-accent-300/45  shadow-[0_0_10px_rgba(238,123,109,0.55)] animate-[float_4.5s_ease-in-out_infinite_0.8s]" />
        <span className="absolute left-[55%] top-[44%] h-2   w-2   rounded-full bg-emerald-400/60  shadow-[0_0_8px_rgba(52,211,153,0.65)]  animate-[float_7s_ease-in-out_infinite_2.2s]" />
        <span className="absolute right-[6%]  top-[42%] h-2   w-2   rounded-full bg-teal-400/55    shadow-[0_0_8px_rgba(45,212,191,0.6)]   animate-[float_6s_ease-in-out_infinite_0s]" />
        <span className="absolute right-[20%] top-[38%] h-3   w-3   rounded-full bg-brand-300/45   shadow-[0_0_14px_rgba(139,212,177,0.6)] animate-[float_8s_ease-in-out_infinite_1.5s]" />
        <span className="absolute right-[38%] top-[46%] h-1.5 w-1.5 rounded-full bg-accent-400/65  shadow-[0_0_6px_rgba(238,123,109,0.65)] animate-[float_5s_ease-in-out_infinite_3s]" />

        {/* Row 4 - lower-mid area */}
        <span className="absolute left-[10%] top-[60%] h-2   w-2   rounded-full bg-brand-400/55   shadow-[0_0_10px_rgba(47,158,108,0.6)]  animate-[float_8s_ease-in-out_infinite_0s]" />
        <span className="absolute left-[24%] top-[65%] h-1.5 w-1.5 rounded-full bg-teal-300/65    shadow-[0_0_6px_rgba(94,234,212,0.65)]  animate-[float_6s_ease-in-out_infinite_2s]" />
        <span className="absolute left-[40%] top-[62%] h-2.5 w-2.5 rounded-full bg-emerald-400/55  shadow-[0_0_12px_rgba(110,231,183,0.7)] animate-[float_5s_ease-in-out_infinite_1s]" />
        <span className="absolute left-[56%] top-[68%] h-2   w-2   rounded-full bg-accent-300/55   shadow-[0_0_10px_rgba(252,165,165,0.6)] animate-[float_7s_ease-in-out_infinite_0.6s]" />
        <span className="absolute right-[12%] top-[62%] h-2.5 w-2.5 rounded-full bg-brand-400/60   shadow-[0_0_10px_rgba(47,158,108,0.65)] animate-[float_5.5s_ease-in-out_infinite_1s]" />
        <span className="absolute right-[28%] top-[67%] h-2   w-2   rounded-full bg-emerald-300/55  shadow-[0_0_8px_rgba(110,231,183,0.65)] animate-[float_7s_ease-in-out_infinite_0s]" />
        <span className="absolute right-[44%] top-[63%] h-1.5 w-1.5 rounded-full bg-teal-400/60    shadow-[0_0_6px_rgba(45,212,191,0.6)]   animate-[float_4s_ease-in-out_infinite_1.5s]" />

        {/* Row 5 - bottom area */}
        <span className="absolute left-[5%]  top-[80%] h-2.5 w-2.5 rounded-full bg-brand-300/60   shadow-[0_0_12px_rgba(139,212,177,0.7)] animate-[float_6s_ease-in-out_infinite_0.5s]" />
        <span className="absolute left-[20%] top-[85%] h-2   w-2   rounded-full bg-emerald-500/60  shadow-[0_0_8px_rgba(16,185,129,0.65)]  animate-[float_5.5s_ease-in-out_infinite_1.5s]" />
        <span className="absolute left-[36%] top-[78%] h-1.5 w-1.5 rounded-full bg-accent-400/65   shadow-[0_0_6px_rgba(238,123,109,0.65)] animate-[float_4.5s_ease-in-out_infinite_3s]" />
        <span className="absolute left-[52%] top-[83%] h-2   w-2   rounded-full bg-brand-400/55    shadow-[0_0_10px_rgba(47,158,108,0.6)]  animate-[float_7s_ease-in-out_infinite_2.5s]" />
        <span className="absolute right-[18%] top-[82%] h-2.5 w-2.5 rounded-full bg-teal-400/55    shadow-[0_0_10px_rgba(45,212,191,0.6)]  animate-[float_8s_ease-in-out_infinite_2.5s]" />
        <span className="absolute right-[34%] top-[87%] h-2   w-2   rounded-full bg-brand-500/55    shadow-[0_0_8px_rgba(16,185,129,0.6)]   animate-[float_6.5s_ease-in-out_infinite_3.5s]" />
        <span className="absolute right-[6%]  top-[78%] h-1.5 w-1.5 rounded-full bg-accent-300/65  shadow-[0_0_6px_rgba(252,165,165,0.65)] animate-[float_5s_ease-in-out_infinite_1.2s]" />
      </div>
    </div>
  );
}
