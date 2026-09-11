"use client";

import { useState } from "react";
import {
  BedDouble,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";
import { cities, site } from "@/lib/site";

type FormState = {
  name: string;
  phone: string;
  email: string;
  city: string;
  property: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  city: "",
  property: "",
  message: "",
};

const propertyOptions = [
  "1 RK",
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "Villa / Bungalow",
  "Hotel / PG / Office",
];

const trustPoints = [
  { icon: Zap, label: "Same-day visit" },
  { icon: ShieldCheck, label: "12-month warranty" },
  { icon: Clock, label: "24/7 bookings" },
];

const inputClass =
  "w-full rounded-xl border border-ink/15 bg-cream/60 py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-ink/35 hover:border-ink/25 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/70";

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/35">
      {children}
    </span>
  );
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [error, setError] = useState("");

  const update =
    (field: keyof FormState) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      phone: event.target.value.replace(/\D/g, "").slice(0, 10),
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (form.phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!form.city) {
      setError("Please select your city.");
      return;
    }
    setError("");
    setStatus("submitting");
    window.setTimeout(() => setStatus("success"), 900);
  };

  if (status === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-ink/10 bg-white text-center shadow-[0_30px_80px_-40px_rgba(23,6,9,0.35)]">
        <div className="w-full bg-ink px-8 pb-8 pt-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h3 className="mt-5 font-display text-2xl font-extrabold text-white">
            Request received!
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/65">
            Thank you, {form.name.split(" ")[0] || "there"}. Our bed bug
            specialists will call you back shortly
            {form.city ? ` to schedule your free inspection in ${form.city}` : ""}.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 px-8 py-8">
          <a
            href={site.phoneHref}
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-500"
          >
            <Phone className="h-4 w-4" />
            Call Now
          </a>
          <a
            href={site.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold text-ink transition hover:border-brand-600/40 hover:text-brand-600"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
        <button
          type="button"
          onClick={() => {
            setForm(initialState);
            setStatus("idle");
          }}
          className="mb-8 text-sm font-semibold text-brand-600 hover:text-brand-500"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-[0_30px_80px_-40px_rgba(23,6,9,0.35)]"
      noValidate
    >
      {/* Header — single-service focus */}
      <div className="relative bg-ink px-6 py-5 sm:px-7">
        <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-[11px] font-bold text-white">
            <BedDouble className="h-3 w-3" />
            Bed Bug Treatment — our only speciality
          </span>
          <h2 className="mt-2.5 font-display text-xl font-extrabold tracking-tight text-white">
            Book your free inspection
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-white/60">
            One service, done right. We&apos;ll call you back within minutes.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {trustPoints.map((point) => (
              <span
                key={point.label}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/75"
              >
                <point.icon className="h-3.5 w-3.5 text-brand-400" />
                {point.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              Full Name *
            </label>
            <div className="relative">
              <FieldIcon>
                <User className="h-4 w-4" />
              </FieldIcon>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={update("name")}
                placeholder="e.g. Ramesh Kumar"
                className={inputClass}
                autoComplete="name"
              />
            </div>
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              Mobile Number *
            </label>
            <div className="relative">
              <FieldIcon>
                <Phone className="h-4 w-4" />
              </FieldIcon>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={handlePhoneChange}
                maxLength={10}
                placeholder="10-digit mobile number"
                className={inputClass}
                autoComplete="tel"
              />
            </div>
          </div>
          <div>
            <label htmlFor="city" className={labelClass}>
              City *
            </label>
            <div className="relative">
              <FieldIcon>
                <MapPin className="h-4 w-4" />
              </FieldIcon>
              <select
                id="city"
                name="city"
                value={form.city}
                onChange={update("city")}
                className={`${inputClass} appearance-none pr-10 ${form.city ? "" : "text-ink/35"}`}
              >
                <option value="">Select your city</option>
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/35">
                <ChevronDown className="h-4 w-4" />
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email <span className="font-normal normal-case">(optional)</span>
            </label>
            <div className="relative">
              <FieldIcon>
                <Mail className="h-4 w-4" />
              </FieldIcon>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={update("email")}
                placeholder="you@example.com"
                className={inputClass}
                autoComplete="email"
              />
            </div>
          </div>
        </div>

        {/* Property type chips */}
        <div className="mt-4">
          <p className={labelClass}>
            <Building2 className="mr-1.5 inline h-3.5 w-3.5 -translate-y-px" />
            Property type
          </p>
          <div className="flex flex-wrap gap-1.5">
            {propertyOptions.map((option) => {
              const active = form.property === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      property: active ? "" : option,
                    }))
                  }
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "border-brand-600 bg-brand-600 text-white shadow-lg shadow-brand-600/25"
                      : "border-ink/15 bg-white text-ink/65 hover:border-brand-600/40 hover:text-brand-600"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="message" className={labelClass}>
            Describe the problem{" "}
            <span className="font-normal normal-case">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={update("message")}
            rows={2}
            placeholder="e.g. Itchy bites at night, dark spots on mattress seams in a 2 BHK…"
            className="w-full resize-none rounded-xl border border-ink/15 bg-cream/60 px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink/35 hover:border-ink/25 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
          />
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-brand-50 px-4 py-2.5 text-sm font-medium text-brand-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-600/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending request…
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Book My Free Bed Bug Inspection
            </>
          )}
        </button>

        <a
          href={site.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 px-7 py-3 text-sm font-semibold text-ink transition hover:border-brand-600/40 hover:text-brand-600"
        >
          <MessageCircle className="h-4 w-4" />
          Or WhatsApp photos of bites & mattress spots
        </a>
        <p className="mt-3 text-center text-xs text-ink/45">
          By submitting, you agree to be contacted about your enquiry. We never
          share your details.
        </p>
      </div>
    </form>
  );
}
