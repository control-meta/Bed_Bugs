"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Lock,
  Phone,
  PhoneCall,
  ShieldCheck,
  User,
  X,
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

  // Refresh the page 3 seconds after a successful submission
  useEffect(() => {
    if (status !== "success") return;
    const timer = window.setTimeout(() => window.location.reload(), 3000);
    return () => window.clearTimeout(timer);
  }, [status]);

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
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Popover Widget (Exact match to requested UI, scaled down) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="floating-form-title"
          className="fixed bottom-20 left-4 z-50 w-[calc(100vw-2rem)] sm:bottom-22 sm:left-6 sm:w-[20.5rem] sm:max-w-[20.5rem] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header with fresh emerald gradient and yellow specialist pill */}
          <div className="relative bg-gradient-to-b from-[#16855b] via-[#116e4b] to-[#0d593d] p-4 pb-4.5 text-white sm:p-4.5 sm:pb-5">
            <div className="flex items-center justify-between gap-2">
              {/* Yellow Specialists Pill */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fed028] px-2.5 py-1 shadow-sm">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 text-red-600"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    {/* Crosshair outer circle and ticks */}
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
                    <line x1="12" y1="1.5" x2="12" y2="4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="12" y1="19.5" x2="12" y2="22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="1.5" y1="12" x2="4.5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="19.5" y1="12" x2="22.5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    {/* Bug Silhouette in center */}
                    <ellipse cx="12" cy="12.5" rx="2.5" ry="3.2" fill="currentColor" />
                    <circle cx="12" cy="8.2" r="1.3" fill="currentColor" />
                    <path
                      d="M9.5 11L7.5 9.8M9.5 13L7 13.5M9.5 15L7.5 16.5M14.5 11L16.5 9.8M14.5 13L17 13.5M14.5 15L16.5 16.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="text-[9.5px] sm:text-[10px] font-black uppercase tracking-tight text-neutral-900 whitespace-nowrap">
                  Bed Bug Specialists Available
                </span>
              </div>

              {/* Circular Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close form"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white/90 transition hover:bg-white/25 hover:text-white cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Title & Subtitle */}
            <div className="mt-3 text-center">
              <h3
                id="floating-form-title"
                className="text-xl font-black tracking-tight text-white sm:text-[21px]"
              >
                Book Your <span className="text-[#a7f3d0]">Free</span> Inspection
              </h3>
              <p className="mt-1 text-[11.5px] leading-snug text-white/90 sm:text-xs">
                Get an expert callback within 15 minutes and receive clear, upfront pricing.
              </p>
            </div>
          </div>

          {/* Form Body */}
          {status === "success" ? (
            <div className="p-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfdf5] text-[#158058]">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h4 className="mt-3 font-display text-lg font-bold text-slate-900">
                Thank You!
              </h4>
              <p className="mx-auto mt-1 max-w-xs text-[11.5px] leading-relaxed text-slate-600">
                Thank you, <strong className="text-slate-900">{name.split(" ")[0]}</strong>. A technician will call you at <strong className="text-slate-900">+91 {phone}</strong> in under 15 minutes.
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={site.phoneHref}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#158058] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#126f4c]"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  Call Directly: {site.phoneDisplay}
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-4.5">
              {error && (
                <div className="mb-2.5 rounded-lg border border-red-200 bg-red-50 p-2 text-center text-[11px] font-medium text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Full Name Field */}
                <div>
                  <label
                    htmlFor="floating-name-input"
                    className="mb-1 block text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-600"
                  >
                    Your Full Name
                  </label>
                  <div className="relative flex items-center rounded-lg border border-slate-200 bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 transition">
                    <span className="pointer-events-none pl-3 text-slate-400">
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
                      className="w-full py-2 pl-2 pr-3 text-xs sm:text-[13px] font-medium text-slate-800 outline-none bg-transparent placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Phone Number Field with Connected +91 Prefix */}
                <div>
                  <label
                    htmlFor="floating-phone-input"
                    className="mb-1 block text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-600"
                  >
                    Phone Number
                  </label>
                  <div className="relative flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 transition">
                    <div className="flex items-center gap-1 border-r border-slate-200 bg-emerald-50/50 px-2.5 py-2 text-xs font-bold text-slate-700 select-none">
                      <Phone className="h-3.5 w-3.5 text-[#158058]" />
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
                      className="w-full py-2 px-2.5 text-xs sm:text-[13px] font-medium text-slate-800 outline-none bg-transparent placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Trust Badges: 12-Month Warranty & Same-Day Service (single line) */}
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[#ecfdf5] py-2 px-2 border border-[#a7f3d0]/60">
                    <ShieldCheck className="h-4 w-4 text-[#126f4c] shrink-0 stroke-[2.2]" />
                    <span className="text-[10.5px] font-bold text-[#126f4c] whitespace-nowrap">
                      12-Month Warranty
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[#ecfdf5] py-2 px-2 border border-[#a7f3d0]/60">
                    <Clock className="h-4 w-4 text-[#126f4c] shrink-0 stroke-[2.2]" />
                    <span className="text-[10.5px] font-bold text-[#126f4c] whitespace-nowrap">
                      Same-Day Service
                    </span>
                  </div>
                </div>

                {/* Primary CTA Submit Button */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-0.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#158058] hover:bg-[#126f4c] active:bg-[#0e5c3e] py-2.5 px-3.5 text-sm font-bold text-white shadow-md shadow-[#158058]/20 transition-all disabled:opacity-75 cursor-pointer"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Connecting Specialist...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Free Inspection</span>
                      <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>

              {/* Confidential Privacy Reassurance */}
              <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10.5px] text-slate-500 font-medium">
                <Lock className="h-3 w-3 text-[#158058] shrink-0" />
                <span>Your information is 100% confidential. No spam.</span>
              </div>
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
