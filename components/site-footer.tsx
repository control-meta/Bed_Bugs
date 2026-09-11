import Link from "next/link";
import { Clock, Mail, MessageCircle, Phone } from "lucide-react";
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
        <div className="grid gap-8 border-b border-white/10 py-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-9 w-auto" />
              <span className="font-display text-lg font-bold leading-none tracking-tight">
                <span className="text-white">BedBug</span>{" "}
                <span className="text-brand-500">Treatment</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-white/55">
              Safe, effective and guaranteed bed bug treatment for homes, hotels
              and businesses across India.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-400">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {navLinks.slice(1).map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/65 transition hover:text-white"
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
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href={site.phoneHref}
                  className="inline-flex items-center gap-2.5 text-white/70 transition hover:text-white"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0 text-brand-400" />
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-white/70 transition hover:text-white"
                >
                  <MessageCircle className="h-3.5 w-3.5 shrink-0 text-brand-400" />
                  Chat on WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={site.emailHref}
                  className="inline-flex items-center gap-2.5 text-white/70 transition hover:text-white"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-brand-400" />
                  {site.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5 text-white/70">
                <Clock className="h-3.5 w-3.5 shrink-0 text-brand-400" />
                {site.hours}
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
