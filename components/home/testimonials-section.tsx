import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { site, testimonials } from "@/lib/site";

export function TestimonialsSection() {
  return (
    <section id="reviews" className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Customer Reviews"
          title={
            <>
              Rated <span className="text-brand-600">{site.rating}</span> by
              thousands of happy customers
            </>
          }
          description="Real results from real homes and businesses across India."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial) => (
            <figure
              key={testimonial.name}
              className="relative flex h-full flex-col rounded-3xl border border-ink/10 bg-cream/60 p-8 transition hover:shadow-xl hover:shadow-brand-600/5"
            >
              <Quote className="h-9 w-9 text-brand-200" fill="currentColor" />
              <div className="mt-5 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink/70">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
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
    </section>
  );
}
