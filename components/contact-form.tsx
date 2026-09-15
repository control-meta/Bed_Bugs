"use client";

import { useEffect, useRef, useState } from "react";
import {
  BedDouble,
  Building2,
  Check,
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

function CitySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const openMenu = () => {
    setOpen(true);
    setActive(Math.max(0, cities.findIndex((city) => city.name === value)));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) return openMenu();
      setActive((index) => Math.min(index + 1, cities.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) return openMenu();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) return openMenu();
      if (active >= 0) {
        onChange(cities[active].name);
        setOpen(false);
      }
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <FieldIcon>
        <MapPin className="h-4 w-4" />
      </FieldIcon>
      <button
        type="button"
        id="city"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
        className={`${inputClass} flex items-center justify-between gap-2 text-left ${
          value ? "text-ink" : "text-ink/35"
        }`}
      >
        <span className="truncate">{value || "Select your city"}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink/40 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="City"
          className="absolute inset-x-0 z-30 mt-2 max-h-56 origin-top overflow-y-auto rounded-2xl border border-ink/10 bg-white p-1.5 shadow-[0_24px_60px_-25px_rgba(23,6,9,0.5)] ring-1 ring-black/5"
        >
          {cities.map((city, index) => {
            const selected = value === city.name;
            return (
              <li key={city.name}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(city.name);
                    setOpen(false);
                  }}
                  onMouseEnter={() => setActive(index)}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    selected
                      ? "bg-brand-50 font-semibold text-brand-700"
                      : active === index
                        ? "bg-cream text-ink"
                        : "text-ink/75"
                  }`}
                >
                  <span>{city.name}</span>
                  {selected && <Check className="h-4 w-4 text-brand-600" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function ContactForm({ defaultCity }: { defaultCity?: string } = {}) {
  const [form, setForm] = useState<FormState>(() => ({
    ...initialState,
    city: defaultCity || "",
  }));
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email?.trim() || undefined,
          city: form.city,
          property: form.property || undefined,
          message: form.message?.trim() || undefined,
          source: "contact_page",
          sourceUrl: typeof window !== "undefined" ? window.location.pathname : "/contact",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit your enquiry.");
      }

      setStatus("success");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not send enquiry right now. Please call or WhatsApp us directly.",
      );
      setStatus("idle");
    }
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
      className="rounded-[2rem] border border-ink/10 bg-white shadow-[0_30px_80px_-40px_rgba(23,6,9,0.35)]"
      noValidate
    >
      {/* Header — single-service focus */}
      <div className="relative rounded-t-[2rem] bg-ink px-6 py-5 sm:px-7">
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
              <CitySelect
                value={form.city}
                onChange={(city) => setForm((prev) => ({ ...prev, city }))}
              />
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
          <p className="mt-4 rounded-xl bg-accent-50 px-4 py-2.5 text-sm font-medium text-accent-700">
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
          className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 px-7 py-3 text-sm font-semibold text-ink transition hover:border-brand-600/40 hover:text-brand-600 max-sm:text-center"
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
