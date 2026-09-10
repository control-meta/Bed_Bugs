"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function LogoMark({ className = "h-11 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 56" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff4d5e" />
          <stop offset="55%" stopColor="#e11931" />
          <stop offset="100%" stopColor="#9d1023" />
        </linearGradient>
      </defs>
      <path
        d="M24 2 44 10v18c0 14-9.5 22.5-20 26C13.5 50.5 4 42 4 28V10L24 2Z"
        fill="url(#shieldGrad)"
      />
      <path
        d="M24 6 40 12.7V28c0 11.4-7.6 18.6-16 21.7C15.6 46.6 8 39.4 8 28V12.7L24 6Z"
        fill="none"
        stroke="rgba(255,255,255,.45)"
        strokeWidth="1.4"
      />
      <g stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M24 20.5c1.2-2 1.2-3.6.4-5.2M24 20.5c-1.2-2-1.2-3.6-.4-5.2" />
        <path d="M15.8 25.5 11 23m4.8 6.4L10.4 31m5.4 5.2-4.2 3.6" />
        <path d="M32.2 25.5 37 23m-4.8 6.4 5.4 1.6m-5.4 5.2 4.2 3.6" />
      </g>
      <ellipse cx="24" cy="33" rx="8.6" ry="10.4" fill="#fff" />
      <path
        d="M24 22.6a4 4 0 0 1 4 4v12.8a4 4 0 0 1-8 0V26.6a4 4 0 0 1 4-4Z"
        fill="#fff"
      />
      <g stroke="#e11931" strokeWidth="1.5" fill="none">
        <path d="M16.5 29.5h15M16 33.5h16M16.5 37.5h15M17.5 41h13" />
        <path d="M24 22.6v22.4" />
      </g>
      <circle cx="24" cy="24.5" r="3.6" fill="#fff" />
      <circle cx="22.7" cy="24" r="1" fill="#9d1023" />
      <circle cx="25.3" cy="24" r="1" fill="#9d1023" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
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
      className={`group inline-flex items-center gap-3 ${className}`}
      aria-label="Bed Bug Treatment — Back to homepage"
    >
      <LogoMark className="h-11 w-auto transition-transform duration-300 group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl font-bold tracking-tight text-white">
          BedBug
        </span>
        <span className="font-display text-2xl font-bold tracking-tight text-brand-500 -mt-0.5">
          Treatment
        </span>
      </span>
    </Link>
  );
}
