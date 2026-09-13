import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { WhySection } from "@/components/home/why-section";
import { LocationsSection } from "@/components/home/locations-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { FaqSection } from "@/components/home/faq-section";
import { CtaSection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title:
    "Bed Bug Treatment in Pune, Mumbai, Bangalore, Delhi & Noida | BedBug Treatment",
  description:
    "Professional bed bug treatment for homes, apartments, hotels and businesses. Same-day free inspection, odorless & family-safe, 12-month warranty. Call +91 97693 21234.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <WhySection />
      <LocationsSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
