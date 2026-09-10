import Link from "next/link";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { LogoMark } from "@/components/logo";
import { cities, navLinks, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden />
      <div
        className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand-700/25 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <LogoMark className="h-12 w-auto" />
              <div className="font-display text-2xl font-bold leading-none">
                <span className="block text-white">BedBug</span>
                <span className="block text-brand-500">Treatment</span>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              The best bed bug treatment service in India. We put the comfort
              and requirements of our clients at the center of every service we
              deliver — safe, discreet and guaranteed.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80">
              <ShieldCheck className="h-4 w-4 text-brand-400" />
              Part of A to Z Pest Solutions
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-brand-400">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {navLinks.slice(1).map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-brand-400">
              Service Areas
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {cities.map((city) => (
                <li key={city.name} className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                  <span>
                    <span className="font-medium text-white/90">
                      Bed Bug Treatment in {city.name}
                    </span>
                    <span className="block text-xs text-white/50">
                      {city.areas}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-brand-400">
              Contact Us
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-3 text-white/75 transition hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600/20">
                    <Phone className="h-4 w-4 text-brand-400" />
                  </span>
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/75 transition hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600/20">
                    <MessageCircle className="h-4 w-4 text-brand-400" />
                  </span>
                  Chat on WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={site.emailHref}
                  className="flex items-center gap-3 text-white/75 transition hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600/20">
                    <Mail className="h-4 w-4 text-brand-400" />
                  </span>
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/75">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600/20">
                  <Clock className="h-4 w-4 text-brand-400" />
                </span>
                {site.hours}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {site.foundedYear}–{new Date().getFullYear()} {site.legalName}.
            All Rights Reserved.
          </p>
          <p>
            Guaranteed bed bug treatment across Pune, Mumbai, Bangalore, Delhi
            &amp; Noida.
          </p>
        </div>
      </div>
    </footer>
  );
}
