"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Phone, User, Zap } from "lucide-react";

const fieldClass =
  "w-full rounded-[0.7em] border border-ink/15 bg-white py-[0.7em] pl-[2.3em] pr-[0.9em] text-[0.9em] text-ink outline-none transition placeholder:text-ink/40 hover:border-ink/25 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/15 max-sm:py-[0.6em]";

export function QuickConnectForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [error, setError] = useState("");

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value.replace(/\D/g, "").slice(0, 10));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit number.");
      return;
    }
    setError("");
    setStatus("submitting");
    window.setTimeout(() => setStatus("success"), 800);
  };

  if (status === "success") {
    return (
      <div className="flex max-w-[38em] items-center gap-[0.8em] rounded-[1.1em] border border-ink/10 bg-white p-[1em] shadow-[0_20px_45px_-30px_rgba(23,6,9,0.4)]">
        <span className="flex h-[2.4em] w-[2.4em] shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckCircle2 className="h-[1.3em] w-[1.3em]" />
        </span>
        <p className="text-[0.9em] leading-snug text-ink/80">
          Thanks {name.trim().split(" ")[0] || "there"}! Our team will call you
          back shortly on{" "}
          <span className="font-semibold text-ink">+91 {phone}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex max-w-[38em] flex-col gap-[0.4em]">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-[0.6em] rounded-[1.1em] border border-ink/10 bg-white p-[0.7em] shadow-[0_20px_45px_-30px_rgba(23,6,9,0.4)] max-sm:gap-[0.5em] max-sm:p-[0.55em] sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <User className="pointer-events-none absolute left-[0.9em] top-1/2 h-[1em] w-[1em] -translate-y-1/2 text-ink/40" />
          <input
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            autoComplete="name"
            aria-label="Your name"
            className={fieldClass}
          />
        </div>
        <div className="flex flex-1 items-center rounded-[0.7em] border border-ink/15 bg-white pl-[0.9em] transition hover:border-ink/25 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/15">
          <span className="flex shrink-0 items-center gap-[0.35em] whitespace-nowrap pr-[0.6em] text-[0.9em] font-medium text-ink/70">
            <Phone className="h-[1em] w-[1em] text-ink/40" />
            +91
          </span>
          <span className="h-[1.3em] w-px shrink-0 bg-ink/15" aria-hidden />
          <input
            name="phone"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={handlePhoneChange}
            maxLength={10}
            placeholder="Phone number"
            autoComplete="tel-national"
            aria-label="Phone number"
            className="w-full bg-transparent py-[0.7em] pl-[0.6em] pr-[0.9em] text-[0.9em] text-ink outline-none placeholder:text-ink/40 max-sm:py-[0.6em]"
          />
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex shrink-0 items-center justify-center gap-[0.5em] rounded-[0.7em] bg-brand-600 px-[1.3em] py-[0.75em] text-[0.9em] font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70 max-sm:py-[0.65em]"
        >
          {status === "submitting" ? (
            <Loader2 className="h-[1.1em] w-[1.1em] animate-spin" />
          ) : (
            <Zap className="h-[1.1em] w-[1.1em]" />
          )}
          Quick Connect
        </button>
      </form>
      {error && (
        <p className="pl-[0.5em] text-[0.8em] font-medium text-brand-600">
          {error}
        </p>
      )}
    </div>
  );
}
