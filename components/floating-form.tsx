"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Phone,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  User,
  X,
  Zap,
} from "lucide-react";
import { site } from "@/lib/site";

export function FloatingForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  // Close popover on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Allow other components (e.g. the header CTA) to open this form
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-floating-form", handleOpen);
    return () => window.removeEventListener("open-floating-form", handleOpen);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(cleaned);
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError("");
    setStatus("submitting");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          source: "floating_widget",
          sourceUrl: typeof window !== "undefined" ? window.location.pathname : "/",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setStatus("success");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not request callback right now. Please call us directly.",
      );
      setStatus("idle");
    }
  };

  const handleReset = () => {
    setName("");
    setPhone("");
    setError("");
    setStatus("idle");
    setIsOpen(false);
  };

  return (
    <>
      {/* Click-outside transparent dismissal listener */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/15 backdrop-blur-[1px] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Popover Widget (Opens in small on the bottom-left above the icon) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="floating-form-title"
          className="fixed bottom-20 left-4 z-50 w-[calc(100vw-2rem)] sm:bottom-24 sm:left-7 sm:w-[22.5rem] sm:max-w-[22.5rem] overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white shadow-[0_25px_70px_-15px_rgba(15,35,25,0.45)] ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Branded Header Banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 p-5 text-white">
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-brand-400/20 blur-xl pointer-events-none" />

            <div className="relative flex items-center justify-between">
              {/* Live Status Pill */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-950 shadow-[0_0_0_3px_rgba(251,191,36,0.3)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-700 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-700" />
                </span>
                <span>Specialists on Duty</span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close form"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative mt-3 text-center">
              <h3
                id="floating-form-title"
                className="font-display text-xl font-extrabold tracking-tight text-white sm:text-2xl"
              >
                Free Inspection &amp; Quote
              </h3>
              <p className="mt-1 text-xs text-white/75 leading-relaxed">
                Get an expert callback within 15 minutes with transparent pricing.
              </p>
            </div>
          </div>

          {/* Form Body */}
          {status === "success" ? (
            <div className="p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-8 ring-brand-50/60">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="mt-4 font-display text-xl font-bold text-ink">
                Callback Requested!
              </h4>
              <p className="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-ink/70">
                Thank you, <strong className="text-ink">{name.split(" ")[0]}</strong>. A technician will call you at <strong className="text-ink">+91 {phone}</strong> in under 15 minutes.
              </p>

              <div className="mt-5 flex flex-col gap-2.5">
                <a
                  href={site.phoneHref}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 py-3 text-xs font-bold text-white shadow-md shadow-brand-600/30 transition hover:from-brand-500 hover:to-brand-600"
                >
                  <PhoneCall className="h-4 w-4" />
                  Call Directly: {site.phoneDisplay}
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-ink/10 py-2.5 text-xs font-semibold text-ink/65 transition hover:bg-cream"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 sm:p-6">
              {error && (
                <div className="mb-3 rounded-xl border border-accent-500/30 bg-accent-50/90 p-2.5 text-center text-xs font-medium text-accent-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Full Name Field */}
                <div>
                  <label
                    htmlFor="floating-name-input"
                    className="mb-1 block text-center text-[10.5px] font-bold uppercase tracking-wider text-ink/65"
                  >
                    Your Full Name
                  </label>
                  <div className="relative flex items-center rounded-xl border border-ink/15 bg-cream/40 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-500/10 transition">
                    <span className="pointer-events-none pl-3.5 text-ink/40">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      id="floating-name-input"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="e.g. Amit Sharma"
                      required
                      className="w-full py-2.5 pl-2.5 pr-4 text-sm font-medium text-ink outline-none bg-transparent placeholder:text-ink/35 placeholder:font-normal"
                    />
                  </div>
                </div>

                {/* Phone Number Field with Connected +91 Prefix */}
                <div>
                  <label
                    htmlFor="floating-phone-input"
                    className="mb-1 block text-center text-[10.5px] font-bold uppercase tracking-wider text-ink/65"
                  >
                    Phone Number
                  </label>
                  <div className="relative flex items-center overflow-hidden rounded-xl border border-ink/15 bg-cream/40 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-500/10 transition">
                    <div className="flex items-center gap-1 border-r border-ink/10 bg-ink/5 px-3 py-2.5 text-xs font-bold text-ink/75 select-none">
                      <Phone className="h-3.5 w-3.5 text-brand-600" />
                      <span>+91</span>
                    </div>
                    <input
                      id="floating-phone-input"
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="98765 43210"
                      maxLength={10}
                      required
                      className="w-full py-2.5 px-3 text-sm font-semibold tracking-wider text-ink outline-none bg-transparent placeholder:text-ink/35 placeholder:font-normal placeholder:tracking-normal"
                    />
                  </div>
                </div>

                {/* Value / Trust Highlights */}
                <div className="grid grid-cols-2 gap-2 pt-0.5 text-center text-[11px] text-ink/70">
                  <div className="flex items-center justify-center gap-1.5 rounded-lg bg-cream/60 py-1.5 px-2 border border-ink/5">
                    <ShieldCheck className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                    <span className="font-semibold">12-Mo Warranty</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 rounded-lg bg-cream/60 py-1.5 px-2 border border-ink/5">
                    <Clock className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                    <span className="font-semibold">Same-Day Visit</span>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition-all hover:from-brand-500 hover:to-brand-700 active:scale-[0.99] disabled:opacity-75"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Connecting Specialist...
                    </>
                  ) : (
                    <>
                      <span>Request Free Callback</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Confidential Privacy Reassurance */}
              <p className="mt-3 text-center text-[10.5px] text-ink/50 font-medium">
                🔒 100% Confidential. Zero spam or third-party sharing.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bottom Left Floating Form Action Button */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full border border-ink/10 bg-white/90 p-2 shadow-[0_18px_45px_-12px_rgba(23,6,9,0.35)] backdrop-blur-xl sm:bottom-7 sm:left-7 sm:gap-2.5 sm:p-2.5">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close callback form" : "Open quick callback form"}
          className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white shadow-lg shadow-brand-600/30 ring-1 ring-inset ring-white/25 transition-all duration-200 hover:scale-105 hover:shadow-brand-600/50 sm:h-12 sm:w-12"
        >
          {isOpen ? (
            <X className="h-5 w-5 drop-shadow transition-transform duration-200" />
          ) : (
            <>
              <FileText className="h-5 w-5 drop-shadow transition-transform group-hover:scale-110" />
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-3 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl ring-1 ring-white/10 transition-opacity duration-200 group-hover:opacity-100 lg:block">
                Quick Callback Form
              </span>

              {/* Pulse beacon to draw subtle eye attention */}
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              </span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
