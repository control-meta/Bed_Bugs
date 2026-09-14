"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck, Star } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { site, testimonials } from "@/lib/site";

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
  eyebrow?: string;
  title?: React.ReactNode;
  description?: string;
  id?: string;
  className?: string;
  cardBg?: string;
  rating?: string;
  reviewCount?: string;
}

const CARD_STEP = 410;
const SPEED = 34;

export function TestimonialsSection({
  testimonials: items = testimonials,
  eyebrow = "Customer Reviews",
  title = "What Our Customers Say About Our Bed Bug Treatment",
  description = "See what customers across India say about their experience with our bed bug treatment service.",
  id = "reviews",
  className = "relative overflow-hidden bg-white py-10 lg:py-14",
  cardBg = "bg-brand-50/50",
  rating = site.rating,
  reviewCount = site.reviewCount,
}: TestimonialsSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const state = useRef({ offset: 0, target: 0 });

  const safeItems: TestimonialItem[] = items && items.length > 0 ? items : testimonials;
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
        <SectionHeading
          align="left"
          size="compact"
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
      </div>

      <div className="relative mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:pr-[19rem] xl:pr-[20rem]">
          <div className="relative min-w-0">
            <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
              <div ref={trackRef} className="flex w-max will-change-transform">
                {loop.map((testimonial, index) => {
                  const place = testimonial.city || testimonial.locality;

                  return (
                    <figure
                      key={`${testimonial.name}-${index}`}
                      className={`relative mr-2.5 flex w-[25rem] shrink-0 flex-col rounded-2xl border border-brand-600/10 ${cardBg} p-6 transition hover:border-brand-600/25 hover:shadow-xl hover:shadow-brand-600/5`}
                    >
                      <div className="flex gap-1">
                        {Array.from({ length: testimonial.rating ?? 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-[18px] w-[18px] fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-ink/75">
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>
                      <figcaption className="mt-4 text-sm font-medium text-ink/55">
                        &mdash; {testimonial.name}
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
              className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white/95 text-ink/70 shadow-lg backdrop-blur transition hover:bg-brand-600 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next reviews"
              className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white/95 text-ink/70 shadow-lg backdrop-blur transition hover:bg-brand-600 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mx-auto mt-6 w-full max-w-xs lg:absolute lg:inset-y-0 lg:right-12 lg:mx-0 lg:mt-0 lg:flex lg:w-64 lg:max-w-none lg:items-center xl:right-16">
          <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-brand-600/15 bg-brand-50/70 p-6 text-center shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600/10 text-brand-600">
              <ShieldCheck className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <p className="mt-3 font-display text-sm font-bold text-ink">
              Trusted by Homeowners across India
            </p>
            <p className="mt-2">
              <span className="font-display text-2xl font-extrabold text-brand-600">
                {rating}
              </span>{" "}
              <span className="text-xs text-ink/60">Customer Rating</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-brand-700">
              {reviewCount} Customer Reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
