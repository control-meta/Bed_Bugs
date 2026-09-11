"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function LogoMark({ className = "h-11 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 56" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="bgt-shield" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#ff5a69" />
          <stop offset="52%" stopColor="#e11931" />
          <stop offset="100%" stopColor="#93101f" />
        </linearGradient>
        <linearGradient id="bgt-gloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d="M24 2 43 9.6V28c0 13.8-9.4 22.2-19 25.5C14.4 50.2 5 41.8 5 28V9.6L24 2Z"
        fill="url(#bgt-shield)"
      />
      <path
        d="M24 2 43 9.6V28c0 13.8-9.4 22.2-19 25.5C14.4 50.2 5 41.8 5 28V9.6L24 2Z"
        fill="url(#bgt-gloss)"
      />
      <path
        d="M24 6.6 39 12.7V28c0 10.7-7.2 17.6-15 20.7-7.8-3.1-15-10-15-20.7V12.7Z"
        fill="none"
        stroke="rgba(255,255,255,0.32)"
        strokeWidth="1.2"
      />

      <g>
        <g
          stroke="#fff"
          strokeWidth="1.7"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M15.6 29.4 10.2 26.7" />
          <path d="M15 34.6 9.4 34.9" />
          <path d="M15.6 39.8 10.4 42.7" />
          <path d="M32.4 29.4 37.8 26.7" />
          <path d="M33 34.6 38.6 34.9" />
          <path d="M32.4 39.8 37.6 42.7" />
          <path d="M20.4 21.4 17.6 15.8" />
          <path d="M27.6 21.4 30.4 15.8" />
        </g>

        <circle cx="24" cy="21.6" r="4.4" fill="#fff" />
        <ellipse cx="24" cy="33.4" rx="9.1" ry="11.2" fill="#fff" />

        <g stroke="#e11931" strokeWidth="1.45" fill="none">
          <path d="M16.2 30.2h15.6M15.6 34.8h16.8M16.2 39.4h15.6M17.4 43.4h13.2" />
        </g>

        <circle cx="22.3" cy="21" r="1" fill="#93101f" />
        <circle cx="25.7" cy="21" r="1" fill="#93101f" />
      </g>
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
      <span
        className={`whitespace-nowrap font-display font-bold leading-none tracking-tight transition-all duration-300 ${
          compact ? "text-lg" : "text-2xl"
        }`}
      >
        <span className="text-white">BedBug</span>{" "}
        <span className="text-brand-500">Treatment</span>
      </span>
    </Link>
  );
}
