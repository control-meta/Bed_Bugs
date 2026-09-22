"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck, Star } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { site, testimonials } from "@/lib/site";
import { WriteReviewSection } from "@/components/write-review-section";

export type TestimonialItem = {
  name: string;
  city?: string;
  locality?: string;
  service?: string;
  role?: string;
  quote: string;
  rating?: number;
};

export interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  id?: string;
  className?: string;
  cardBg?: string;
  rating?: string;
  reviewCount?: string;
  size?: "default" | "compact";
  city?: string;
  pageSlug?: string;
}

const CARD_WIDTH = 250;
const CARD_GAP = 12;
const CARD_STEP = CARD_WIDTH + CARD_GAP; // 262px
const SPEED = 34;

export function TestimonialsSection({
  testimonials: items = testimonials,
  eyebrow = "Customer Reviews",
  title = "What Our Customers Say About Our Bed Bug Treatment",
  description = "See what customers across India say about their experience with our bed bug treatment service.",
  id = "reviews",
  className = "relative overflow-hidden bg-white py-6 sm:py-8 lg:py-9",
  cardBg = "bg-brand-50/50",
  rating = site.rating,
  reviewCount = site.reviewCount,
  city,
  pageSlug,
}: TestimonialsSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const state = useRef({ offset: 0, target: 0 });

  const [reviewList, setReviewList] = useState<TestimonialItem[]>(() =>
    items && items.length > 0 ? items : testimonials
  );
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    let url = "/api/reviews";
    if (pageSlug) {
      url += `?page_slug=${encodeURIComponent(pageSlug)}`;
    } else {
      url += `?page_slug=/`; // default to home page reviews if on home page or global if not specified
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.reviews && data.reviews.length > 0) {
          setReviewList(data.reviews);
        } else if (items && items.length > 0) {
          setReviewList(items);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch live reviews:", err);
        if (items && items.length > 0) setReviewList(items);
      });
  }, [pageSlug, items]);

  const safeItems: TestimonialItem[] = reviewList.length > 0 ? reviewList : testimonials;
  const repeatCount = Math.max(4, Math.ceil(16 / safeItems.length));
  const loop: TestimonialItem[] = Array.from({ length: repeatCount }).flatMap((): TestimonialItem[] => safeItems);
  const pitch = safeItems.length * CARD_STEP;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let paused = false;
    let raf = 0;
    let last = performance.now();

    const wrap = () => {
      const s = state.current;
      while (s.offset <= -pitch) {
        s.offset += pitch;
        s.target += pitch;
      }
      while (s.offset > 0) {
        s.offset -= pitch;
        s.target -= pitch;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const s = state.current;
      if (!paused && !reduce) s.target -= SPEED * dt;
      s.offset += (s.target - s.offset) * Math.min(1, dt * 8);
      wrap();
      track.style.transform = `translate3d(${s.offset}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onEnter = () => {
      paused = true;
    };
    const onLeave = () => {
      paused = false;
    };
    track.addEventListener("pointerenter", onEnter);
    track.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("pointerenter", onEnter);
      track.removeEventListener("pointerleave", onLeave);
    };
  }, [pitch]);

  const move = (direction: -1 | 1) => {
    state.current.target -= direction * CARD_STEP;
  };

  return (
    <section id={id} className={className}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start text-left">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-600">
            <span className="h-px w-5 bg-current" />
            {eyebrow}
          </p>
          <h2 className="mt-1.5 text-xl sm:text-2xl lg:text-[1.65rem] font-display font-extrabold tracking-tight text-ink">
            {title}
          </h2>
          {description && (
            <p className="mt-1 max-w-2xl text-xs sm:text-[13px] leading-relaxed text-ink/65">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto mt-5 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Carousel Track: flex-1 min-w-0 guarantees zero overlap with the right card */}
          <div className="relative min-w-0 flex-1">
            <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
              <div ref={trackRef} className="flex w-max will-change-transform">
                {loop.map((testimonial, index) => {
                  const place = testimonial.city || testimonial.locality;

                  return (
                    <figure
                      key={`${testimonial.name}-${index}`}
                      style={{ width: `${CARD_WIDTH}px`, height: "180px" }}
                      className={`relative mr-3 flex shrink-0 flex-col justify-between rounded-xl border border-brand-600/10 ${cardBg} p-3.5 transition hover:border-brand-600/25 hover:shadow-lg`}
                    >
                      <div className="flex items-center gap-1 shrink-0">
                        {Array.from({ length: testimonial.rating ?? 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <blockquote className="my-auto text-xs leading-relaxed text-ink/75 line-clamp-4">
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>
                      <figcaption className="shrink-0 text-[11px] font-medium text-ink/55 truncate">
                        &mdash;{" "}
                        <span className="font-bold text-ink">{testimonial.name}</span>
                        {place ? `, ${place}` : ""}
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous reviews"
              className="absolute left-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white/95 text-ink/70 shadow-md backdrop-blur transition hover:bg-brand-600 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next reviews"
              className="absolute right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white/95 text-ink/70 shadow-md backdrop-blur transition hover:bg-brand-600 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Right-side Badge Card */}
          <div className="w-full lg:w-56 xl:w-60 shrink-0 flex justify-center">
            <div className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-brand-600/15 bg-brand-50/70 p-3.5 text-center shadow-sm lg:min-h-[180px]">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600/10 text-brand-600">
                <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <p className="font-display text-xs font-bold text-ink leading-tight">
                  Trusted by Property Owners across India
                </p>
                <p className="mt-0.5">
                  <span className="font-display text-lg font-extrabold text-brand-600 lg:text-xl">
                    {rating}
                  </span>{" "}
                  <span className="text-[11px] text-ink/60">Customer Rating</span>
                </p>
                <p className="text-[11px] font-semibold text-brand-700">
                  {reviewCount} Customer Reviews
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReviewOpen(true)}
                className="mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-600 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-xs transition hover:bg-brand-700 active:scale-95 lg:w-auto lg:py-1"
              >
                <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                Leave a Review
              </button>
            </div>
          </div>
        </div>

        {/* Expandable write-a-review form (opened by the "Leave a Review" button) */}
        {reviewOpen && (
          <div className="mt-6 sm:mt-8">
            <WriteReviewSection
              defaultCity={city}
              pageSlug={pageSlug}
              open={reviewOpen}
              onOpenChange={setReviewOpen}
              onReviewAdded={(newReview) => {
                setReviewList((prev) => [newReview, ...prev]);
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
