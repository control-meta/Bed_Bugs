"use client";

import { useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { cities, site } from "@/lib/site";

type FormState = {
  name: string;
  phone: string;
  email: string;
  city: string;
  service: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  city: "",
  service: "Bed Bug Treatment",
  message: "",
};

const serviceOptions = [
  "Bed Bug Treatment",
  "Free Inspection",
  "Mattress & Bed Frames",
  "Sofas & Upholstery",
  "Hotel / Hostel / PG Program",
  "Other Enquiry",
];

const inputClass =
  "w-full rounded-2xl border border-ink/15 bg-white px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (form.phone.replace(/\D/g, "").length < 10) {
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
      <div className="flex h-full flex-col items-center justify-center rounded-[2rem] border border-emerald-200 bg-emerald-50 px-8 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h3 className="mt-6 font-display text-2xl font-extrabold text-ink">
          Request received!
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/65">
          Thank you, {form.name.split(" ")[0] || "there"}. Our team will call
          you back shortly to schedule your free inspection in {form.city}.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
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
          className="mt-6 text-sm font-semibold text-brand-600 hover:text-brand-500"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-ink/10 bg-white p-7 shadow-[0_30px_80px_-40px_rgba(23,6,9,0.35)] sm:p-9"
      noValidate
    >
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600">
          <CalendarCheck className="h-6 w-6" />
        </span>
        <div>
          <h2 className="font-display text-xl font-extrabold text-ink">
            Book Your Free Inspection
          </h2>
          <p className="text-sm text-ink/55">
            Fill the form and we&apos;ll call you back quickly.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-ink"
          >
            Full Name *
          </label>
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
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-semibold text-ink"
          >
            Mobile Number *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={update("phone")}
            placeholder="10-digit mobile number"
            className={inputClass}
            autoComplete="tel"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-ink"
          >
            Email (optional)
          </label>
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
        <div>
          <label
            htmlFor="city"
            className="mb-2 block text-sm font-semibold text-ink"
          >
            City *
          </label>
          <select
            id="city"
            name="city"
            value={form.city}
            onChange={update("city")}
            className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[position:right_1rem_center] bg-no-repeat pr-10`}
          >
            <option value="">Select your city</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="service"
            className="mb-2 block text-sm font-semibold text-ink"
          >
            Service Required
          </label>
          <select
            id="service"
            name="service"
            value={form.service}
            onChange={update("service")}
            className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-[position:right_1rem_center] bg-no-repeat pr-10`}
          >
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-semibold text-ink"
          >
            Tell us about the problem (optional)
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={update("message")}
            rows={4}
            placeholder="e.g. 2 BHK flat, bed bugs seen on mattresses and sofa"
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {error && (
        <p className="mt-5 rounded-2xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-brand-600 px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-brand-600/30 transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending request…
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Request Free Callback
          </>
        )}
      </button>
      <p className="mt-4 text-center text-xs text-ink/45">
        By submitting, you agree to be contacted about your enquiry. We never
        share your details.
      </p>
    </form>
  );
}
