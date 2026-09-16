import { Star } from "lucide-react";

function Sparks({ side }: { side: "left" | "right" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={`absolute top-1/2 h-4 w-4 text-amber-400 ${
        side === "left" ? "-left-5" : "-right-5"
      }`}
      style={{ transform: `translateY(-50%) rotate(${side === "left" ? 0 : 180}deg)` }}
    >
      <path d="M10 12H3" />
      <path d="M9.5 7.5 5 4" />
      <path d="M9.5 16.5 5 20" />
    </svg>
  );
}

export function PopularBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`pointer-events-none absolute -top-3 right-3 z-10 inline-flex -rotate-3 items-center gap-1.5 rounded-full bg-gradient-to-b from-amber-300 to-amber-400 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-950 shadow-[0_6px_16px_-4px_rgba(180,120,0,0.6)] ${className}`}
    >
      <Sparks side="left" />
      <Star className="h-3.5 w-3.5 fill-white text-white" />
      <span>Most Popular</span>
      <Sparks side="right" />
    </span>
  );
}
