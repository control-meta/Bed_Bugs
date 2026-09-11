import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { cities, navLinks, site } from "@/lib/site";

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
          <div className="lg:col-span-5 max-sm:col-span-2">
            <div className="flex items-center gap-2.5 max-sm:justify-center">
              <LogoMark className="h-9 w-auto" />
              <span className="font-display text-lg font-bold leading-none tracking-tight">
                <span className="text-white">BedBug</span>{" "}
                <span className="text-brand-500">Treatment</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-white/55 max-sm:mx-auto">
              Safe, effective and guaranteed bed bug treatment for homes, hotels
              and businesses across India.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-400">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2 text-sm max-sm:mt-3 max-sm:space-y-2">
              {navLinks.slice(1).map((link) => (
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

          <div className="lg:col-span-4">
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
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5 py-5 text-center text-xs text-white/45">
          <p>
            © {site.foundedYear}–{new Date().getFullYear()} {site.legalName}. All
            Rights Reserved.
          </p>
          <p>{cities.map((city) => city.name).join(" · ")}</p>
        </div>
      </div>
    </footer>
  );
}
