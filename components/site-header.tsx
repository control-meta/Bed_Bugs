"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { navLinks, site } from "@/lib/site";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      const hero = document.getElementById("hero");
      const threshold = (hero ? hero.offsetHeight : window.innerHeight) - 80;
      setShrink(y > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const compact = shrink && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-white/10 bg-ink/95 shadow-lg shadow-black/20 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          compact ? "h-16" : "h-20"
        }`}
      >
        <Logo compact={compact} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative whitespace-nowrap rounded-full px-3.5 text-sm font-medium transition ${
                  compact ? "py-1.5" : "py-2"
                } ${
                  active
                    ? "text-white after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand-500"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={site.phoneHref}
            className={`hidden items-center gap-2 whitespace-nowrap rounded-full border border-white/25 px-3.5 text-[13px] font-semibold text-white transition hover:border-white/60 hover:bg-white/10 xl:inline-flex ${
              compact ? "py-2" : "py-2.5"
            }`}
          >
            <Phone className="h-4 w-4 text-brand-400" />
            {site.phoneDisplay}
          </a>
          <Link
            href="/contact"
            className={`hidden items-center gap-2 whitespace-nowrap rounded-full bg-brand-600 px-4 text-[13px] font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500 sm:inline-flex ${
              compact ? "py-2" : "py-2.5"
            }`}
          >
            <CalendarCheck className="h-4 w-4" />
            Book Free Inspection
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink/95 backdrop-blur-xl lg:hidden">
          <nav
            className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6"
            aria-label="Mobile"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-white/90 transition hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-3 border-t border-white/10 pt-4">
              <a
                href={site.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white"
              >
                <Phone className="h-4 w-4 text-brand-400" />
                {site.phoneDisplay}
              </a>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white"
              >
                <CalendarCheck className="h-4 w-4" />
                Book Free Inspection
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
