import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { navLinks, site } from "@/lib/site";
import { locations } from "@/lib/locations";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 bg-grid-dark opacity-20" aria-hidden />
      <div
        className="absolute -left-32 -top-24 h-72 w-72 rounded-full bg-brand-700/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-b border-white/10 py-10 max-sm:grid-cols-2 max-sm:gap-6 max-sm:pt-6 max-sm:text-center sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4 max-sm:col-span-2">
            <div className="flex items-center gap-2.5 max-sm:justify-center">
              <LogoMark className="h-9 w-auto" />
              <span className="font-display text-lg font-bold leading-none tracking-tight">
                <span className="text-white">BedBug</span>{" "}
                <span className="text-brand-500">Treatment</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-white/55 max-sm:mx-auto">
              India’s Bed Bug Treatment Specialists
              Professional solutions designed to eliminate bed bugs and help prevent reinfestation.
              Residential • Commercial
            </p>
          </div>

          <div className="lg:col-span-2 max-sm:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-400">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2 text-sm max-sm:mt-3 max-sm:space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/65 transition hover:text-white max-sm:flex max-sm:min-h-[3.25rem] max-sm:w-full max-sm:items-center max-sm:justify-center max-sm:rounded-full max-sm:border max-sm:border-white/10 max-sm:bg-white/[0.06] max-sm:px-3 max-sm:py-2 max-sm:text-center max-sm:text-[0.78rem] max-sm:font-medium max-sm:text-white/80"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 max-sm:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-400">
              Locations
            </h3>
            <ul className="mt-3 space-y-2 text-sm max-sm:mt-3 max-sm:space-y-2">
              {locations.map((loc) => (
                <li key={loc.slug}>
                  <Link
                    href={`/${loc.slug}`}
                    className="text-white/65 transition hover:text-white max-sm:flex max-sm:min-h-[3.25rem] max-sm:w-full max-sm:items-center max-sm:justify-center max-sm:rounded-full max-sm:border max-sm:border-white/10 max-sm:bg-white/[0.06] max-sm:px-3 max-sm:py-2 max-sm:text-center max-sm:text-[0.78rem] max-sm:font-medium max-sm:text-white/80"
                  >
                    {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 max-sm:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-400">
              Contact
            </h3>
            <ul className="mt-3 space-y-2 text-sm max-sm:mt-3 max-sm:space-y-2">
              <li>
                <a
                  href={site.phoneHref}
                  className="inline-flex items-center gap-2.5 text-white/70 transition hover:text-white max-sm:relative max-sm:flex max-sm:min-h-[3.25rem] max-sm:w-full max-sm:items-center max-sm:justify-center max-sm:rounded-full max-sm:border max-sm:border-white/10 max-sm:bg-white/[0.06] max-sm:py-2 max-sm:pl-9 max-sm:pr-3 max-sm:text-center max-sm:text-[0.78rem] max-sm:font-medium max-sm:text-white/80"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0 text-brand-400 max-sm:absolute max-sm:left-3 max-sm:top-1/2 max-sm:-translate-y-1/2" />
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-white/70 transition hover:text-white max-sm:relative max-sm:flex max-sm:min-h-[3.25rem] max-sm:w-full max-sm:items-center max-sm:justify-center max-sm:rounded-full max-sm:border max-sm:border-white/10 max-sm:bg-white/[0.06] max-sm:py-2 max-sm:pl-9 max-sm:pr-3 max-sm:text-center max-sm:text-[0.78rem] max-sm:font-medium max-sm:text-white/80"
                >
                  <MessageCircle className="h-3.5 w-3.5 shrink-0 text-brand-400 max-sm:absolute max-sm:left-3 max-sm:top-1/2 max-sm:-translate-y-1/2" />
                  Chat on WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={site.emailHref}
                  className="inline-flex items-center gap-2.5 text-white/70 transition hover:text-white max-sm:relative max-sm:flex max-sm:min-h-[3.25rem] max-sm:w-full max-sm:items-center max-sm:justify-center max-sm:rounded-full max-sm:border max-sm:border-white/10 max-sm:bg-white/[0.06] max-sm:py-2 max-sm:pl-9 max-sm:pr-3 max-sm:text-center max-sm:text-[0.72rem] max-sm:font-medium max-sm:text-white/80 max-sm:break-all"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-brand-400 max-sm:absolute max-sm:left-3 max-sm:top-1/2 max-sm:-translate-y-1/2" />
                  {site.email}
                </a>
              </li>
            </ul>
            <div className="mt-5 flex items-center justify-center gap-4">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-brand-500 hover:text-white"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-brand-500 hover:text-white"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-brand-500 hover:text-white"
                aria-label="Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2.5 py-6 text-center text-xs text-white/45">
          <p>
            © {site.foundedYear}–{new Date().getFullYear()} {site.legalName}. All
            Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-white/50">
            <span className="text-white/35">Service Cities:</span>
            {locations.map((loc, idx) => (
              <span key={loc.slug} className="inline-flex items-center gap-2">
                <Link
                  href={`/${loc.slug}`}
                  className="transition hover:text-brand-400 hover:underline"
                >
                  {loc.name}
                </Link>
                {idx < locations.length - 1 && (
                  <span className="text-white/20">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
