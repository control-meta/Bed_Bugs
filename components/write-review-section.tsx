"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Send, Star } from "lucide-react";
import type { TestimonialItem } from "@/components/home/testimonials-section";

interface WriteReviewSectionProps {
  defaultCity?: string;
  onReviewAdded?: (review: TestimonialItem) => void;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "1 Star — Poor Experience",
  2: "2 Stars — Fair",
  3: "3 Stars — Average",
  4: "4 Stars — Very Good",
  5: "5 Stars — Excellent Service",
};

export function WriteReviewSection({
  defaultCity = "",
  onReviewAdded,
  className = "",
  open,
  onOpenChange,
}: WriteReviewSectionProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const containerRef = useRef<HTMLDivElement>(null);

  const setOpen = (value: boolean) => {
    if (!isControlled) setInternalOpen(value);
    onOpenChange?.(value);
  };

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [city, setCity] = useState(defaultCity);
  const [quote, setQuote] = useState("");
  const [hpField, setHpField] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset transient state and reveal the panel each time it is opened
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setIsSuccess(false);
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!quote.trim() || quote.trim().length < 5) {
      setErrorMessage("Please share a brief review of your experience.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          city: city.trim() || undefined,
          rating,
          quote: quote.trim(),
          hp_field: hpField,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review. Please try again.");
      }

      setIsSuccess(true);

      if (onReviewAdded) {
        onReviewAdded({
          name: name.trim(),
          city: city.trim() || undefined,
          rating,
          quote: quote.trim(),
        });
      }

      // Reset fields
      setName("");
      setQuote("");
      setRating(5);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={containerRef} id="write-a-review" className={className}>
      {isOpen && (
        <div className="mx-auto w-full max-w-2xl rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-50/70 via-white to-brand-50/40 p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 font-display text-sm font-bold text-ink">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              Write a Customer Review
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[11px] font-semibold text-ink/50 transition hover:text-ink"
            >
              Close
            </button>
          </div>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-4 text-center animate-in fade-in zoom-in duration-300">
              <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </span>
              <h4 className="font-display text-sm font-bold text-ink">Thank You for Your Review!</h4>
              <p className="mt-1 max-w-sm text-xs text-ink/70">
                Your feedback has been recorded and will help fellow customers looking for reliable bed bug treatment.
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-brand-700"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Honeypot anti-spam field */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="hp_field"
                  tabIndex={-1}
                  autoComplete="off"
                  value={hpField}
                  onChange={(e) => setHpField(e.target.value)}
                />
              </div>

              {/* Star Rating Picker */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        className="rounded-md p-0.5 transition hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <Star
                          className={`h-5 w-5 transition-colors ${
                            isFilled
                              ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                              : "fill-slate-100 text-slate-300 hover:text-slate-400"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="rounded-md border border-brand-500/20 bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-800">
                  {RATING_LABELS[hoverRating || rating]}
                </span>
              </div>

              {/* User Details Grid */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div>
                  <label htmlFor="review-name" className="mb-1 block text-[11px] font-semibold text-ink">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="review-name"
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kulkarni"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-xs text-ink placeholder:text-ink/40 shadow-xs transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>

                <div>
                  <label htmlFor="review-city" className="mb-1 block text-[11px] font-semibold text-ink">
                    City / Location
                  </label>
                  <input
                    id="review-city"
                    type="text"
                    placeholder="e.g. Mumbai or Pune"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-xs text-ink placeholder:text-ink/40 shadow-xs transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              {/* Review Quote Textarea */}
              <div>
                <label htmlFor="review-message" className="mb-1 block text-[11px] font-semibold text-ink">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="review-message"
                  required
                  rows={2}
                  placeholder="Tell us about the results: Was the treatment odorless? Did the technician arrive on time?"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-xs text-ink placeholder:text-ink/40 shadow-xs transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              {errorMessage && (
                <p className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-600">
                  {errorMessage}
                </p>
              )}

              <div className="flex flex-col-reverse items-center gap-3 border-t border-ink/10 pt-3 sm:flex-row sm:justify-between">
                <span className="text-center text-[10px] text-ink/50 sm:text-left">
                  Verified reviews help maintain safe, guaranteed treatment standards.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-emerald-700 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-brand-600/20 transition hover:from-brand-500 hover:to-emerald-600 active:scale-98 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
