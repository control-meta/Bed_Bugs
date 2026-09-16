import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { WhySection } from "@/components/home/why-section";
import { LocationsSection } from "@/components/home/locations-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { FaqSection } from "@/components/home/faq-section";
import { CtaSection } from "@/components/home/cta-section";
import { TreatmentOptionsSection } from "@/components/treatment-options-section";

export const metadata: Metadata = {
  title: {
    absolute: "Bed Bug Treatment & Pest Control Services in India",
  },
  description:
    "Professional odorless bed bug treatment for homes & hotels across India. Same-day free inspection, safe methods & 12-month warranty. Call +91 97693 21234.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <WhySection />
      <TreatmentOptionsSection />
      <LocationsSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
