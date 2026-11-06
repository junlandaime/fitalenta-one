import { AboutSection } from "@/components/sections/about-section";
import { CtaSection } from "@/components/sections/cta-section";
import { ExpertsSection } from "@/components/sections/expert-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ImpactSection } from "@/components/sections/impact-section";
import { InsightsSection } from "@/components/sections/insight-section";
import { PartnersSection } from "@/components/sections/partner-section";
import { ServicesSection } from "@/components/sections/service.section";
import { TestimonialsSection } from "@/components/sections/testimonial-section";
import { Metadata } from "next";
import { Reveal } from "@/components/common/reveal";
import { FeaturedEventsSection } from "@/components/sections/featured-events-section";

export const metadata: Metadata = {
    title: "FITALENTA - Wellcome to FITALENTA",
    description: "Empowering businesses and individuals to grow.",
};

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Reveal><FeaturedEventsSection /></Reveal>
      <Reveal><AboutSection /></Reveal>
      <Reveal><ServicesSection /></Reveal>
      <Reveal><ImpactSection /></Reveal>
      <Reveal><ExpertsSection /></Reveal>
      <Reveal><InsightsSection /></Reveal>
      <Reveal><TestimonialsSection /></Reveal>
      <Reveal><PartnersSection /></Reveal>
      <Reveal><CtaSection /></Reveal>
    </>
  );
}
