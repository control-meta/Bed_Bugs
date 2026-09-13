"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { site, testimonials } from "@/lib/site";

const CARD_STEP = 340;
const PITCH = testimonials.length * CARD_STEP;
const SPEED = 34;
const loop = [...testimonials, ...testimonials];

export function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const state = useRef({ offset: 0, target: 0 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let paused = false;
    let raf = 0;
    let last = performance.now();

    const wrap = () => {
      const s = state.current;
      while (s.offset <= -PITCH) {
        s.offset += PITCH;
        s.target += PITCH;
      }
      while (s.offset > 0) {
        s.offset -= PITCH;
        s.target -= PITCH;
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
  }, []);

  const move = (direction: -1 | 1) => {
    state.current.target -= direction * CARD_STEP;
  };

  return (
    <section id="reviews" className="relative overflow-hidden bg-white py-10 lg:py-14">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          size="compact"
          eyebrow="Customer Reviews"
          title={
            <>
              Rated <span className="text-brand-600">{site.rating}</span> by
              thousands of happy customers
            </>
          }
          description="Real results from real homes and businesses across India."
        />

        <div className="relative mt-10">
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div ref={trackRef} className="flex w-max will-change-transform">
              {loop.map((testimonial, index) => (
                <figure
                  key={`${testimonial.name}-${index}`}
                  className="relative mr-5 flex w-80 shrink-0 flex-col rounded-2xl border border-ink/10 bg-cream/60 p-6 transition hover:shadow-xl hover:shadow-brand-600/5"
                >
                  <Quote className="h-7 w-7 text-brand-200" fill="currentColor" />
                  <div className="mt-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-accent-500 text-accent-500"
                      />
                    ))}
                  </div>
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-ink/10 pt-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                      {testimonial.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-ink">
                        {testimonial.name}
                      </span>
                      <span className="block text-xs text-ink/55">
                        {testimonial.city}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous reviews"
            className="absolute left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white/90 text-ink shadow-lg backdrop-blur transition hover:bg-brand-600 hover:text-white sm:left-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next reviews"
            className="absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white/90 text-ink shadow-lg backdrop-blur transition hover:bg-brand-600 hover:text-white sm:right-2"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
