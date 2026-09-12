"use client";

import Link from "next/link";
import { useId } from "react";
import { usePathname, useRouter } from "next/navigation";

export function LogoMark({ className = "h-11 w-auto" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const shield = `logo-shield-${uid}`;
  const trim = `logo-trim-${uid}`;
  const body = `logo-body-${uid}`;
  const head = `logo-head-${uid}`;
  const shade = `logo-shade-${uid}`;
  const gloss = `logo-gloss-${uid}`;
  const clip = `logo-clip-${uid}`;

  return (
    <svg viewBox="0 0 64 66" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={shield} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#55ba8b" />
          <stop offset="45%" stopColor="#1f8055" />
          <stop offset="100%" stopColor="#0b3a27" />
        </linearGradient>
        <linearGradient id={trim} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8e3a1" />
          <stop offset="55%" stopColor="#d9a441" />
          <stop offset="100%" stopColor="#9c6414" />
        </linearGradient>
        <linearGradient id={body} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#dbe1ea" />
          <stop offset="100%" stopColor="#9aa3b5" />
        </linearGradient>
        <linearGradient id={head} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#c3cad7" />
        </linearGradient>
        <linearGradient id={shade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
          <stop offset="35%" stopColor="#000000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={gloss} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={clip}>
          <path d="M32 8.2 50.3 14.8V34c0 12.9-9 21-18.3 24C22.7 55 13.7 46.9 13.7 34V14.8Z" />
        </clipPath>
      </defs>

      {/* Shield base */}
      <path
        d="M32 2.5 56 11v23c0 15.8-11.2 25.6-24 29.2C19.2 59.6 8 49.8 8 34V11Z"
        fill="#09261b"
      />
      <path
        d="M32 4.5 54 12.4V34c0 14.9-10.6 24.2-22 27.6C20.6 58.2 10 48.9 10 34V12.4Z"
        fill={`url(#${shield})`}
      />

      <g clipPath={`url(#${clip})`}>
        {/* Top inner shadow + gloss for a metallic finish */}
        <rect x="8" y="4" width="48" height="30" fill={`url(#${shade})`} />
        <ellipse
          cx="22"
          cy="14"
          rx="17"
          ry="7"
          fill="#ffffff"
          opacity="0.16"
          transform="rotate(-16 22 14)"
        />

        {/* Ground shadow */}
        <ellipse cx="32" cy="55.5" rx="8.5" ry="1.8" fill="#000" opacity="0.28" />

        {/* Legs */}
        <g stroke="#eef1f6" strokeWidth="1.7" strokeLinecap="round" fill="none">
          <path d="M24.5 29.5 18.5 26.5 15.5 29.5" />
          <path d="M39.5 29.5 45.5 26.5 48.5 29.5" />
          <path d="M24 34.5 17.5 34.5 14.5 38" />
          <path d="M40 34.5 46.5 34.5 49.5 38" />
          <path d="M24.5 39.5 18.5 42.5 16.2 47" />
          <path d="M39.5 39.5 45.5 42.5 47.8 47" />
        </g>

        {/* Abdomen with segmented tergites */}
        <ellipse cx="32" cy="42" rx="9.5" ry="12" fill={`url(#${body})`} />
        <g
          stroke="#7d8698"
          strokeWidth="1"
          fill="none"
          opacity="0.85"
          strokeLinecap="round"
        >
          <path d="M23.6 37.2Q32 40.4 40.4 37.2" />
          <path d="M23 41.2Q32 44.6 41 41.2" />
          <path d="M23.4 45.2Q32 48.6 40.6 45.2" />
          <path d="M24.2 49.2Q32 52.2 39.8 49.2" />
        </g>
        <ellipse cx="28.4" cy="41" rx="2.6" ry="8" fill="#ffffff" opacity="0.45" />

        {/* Pronotum */}
        <path
          d="M23.5 27.5Q32 22.8 40.5 27.5L38.7 31.8Q32 28.2 25.3 31.8Z"
          fill="#c9d1de"
        />
        <path
          d="M23.5 27.5Q32 22.8 40.5 27.5"
          fill="none"
          stroke="#8b94a7"
          strokeWidth="1"
        />

        {/* Head, eyes, antennae */}
        <ellipse cx="32" cy="22.8" rx="3.4" ry="2.7" fill={`url(#${head})`} />
        <circle cx="30.1" cy="22.4" r="0.95" fill="#0b3a27" />
        <circle cx="33.9" cy="22.4" r="0.95" fill="#0b3a27" />
        <circle cx="30.4" cy="22.1" r="0.3" fill="#fff" />
        <circle cx="34.2" cy="22.1" r="0.3" fill="#fff" />
        <g
          stroke="#eef1f6"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M29.3 20.8C27 18.6 25.2 17.2 22.8 16.6" />
          <path d="M34.7 20.8C37 18.6 38.8 17.2 41.2 16.6" />
        </g>

        {/* Elimination slash */}
        <rect
          x="27.5"
          y="4"
          width="6.5"
          height="60"
          fill="#000"
          opacity="0.3"
          transform="rotate(38 32 34) translate(1.4 1.4)"
        />
        <rect
          x="27.5"
          y="4"
          width="6.5"
          height="60"
          rx="3.25"
          fill="#f6d789"
          transform="rotate(38 32 34)"
        />
        <rect
          x="28.7"
          y="4"
          width="4.1"
          height="60"
          rx="2.05"
          fill="#ffffff"
          opacity="0.95"
          transform="rotate(38 32 34)"
        />
      </g>

      {/* Champagne-gold rim + gloss */}
      <path
        d="M32 4.5 54 12.4V34c0 14.9-10.6 24.2-22 27.6C20.6 58.2 10 48.9 10 34V12.4Z"
        fill="none"
        stroke={`url(#${trim})`}
        strokeWidth="1.6"
      />
      <path
        d="M32 4.5 54 12.4V34c0 14.9-10.6 24.2-22 27.6C20.6 58.2 10 48.9 10 34V12.4Z"
        fill={`url(#${gloss})`}
      />
    </svg>
  );
}

export function Logo({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  return (
    <Link
      href="/"
      onClick={handleClick}
      className={`group inline-flex items-center transition-all duration-300 ${
        compact ? "gap-2" : "gap-3"
      } ${className}`}
      aria-label="Bed Bug Treatment — Back to homepage"
    >
      <LogoMark
        className={`w-auto transition-all duration-300 group-hover:scale-105 ${
          compact ? "h-8" : "h-11"
        }`}
      />
      <span className="flex flex-col">
        <span
          className={`whitespace-nowrap font-display font-extrabold leading-none tracking-tight transition-all duration-300 ${
            compact ? "text-lg" : "text-2xl"
          }`}
        >
          <span className="text-ink">BedBug</span>{" "}
          <span className="text-brand-600">Treatment</span>
        </span>
        {!compact && (
          <span className="mt-1.5 whitespace-nowrap font-sans text-[9px] font-semibold uppercase tracking-[0.32em] text-ink/50">
            Bed Bug Experts · Est. 2011
          </span>
        )}
      </span>
    </Link>
  );
}
