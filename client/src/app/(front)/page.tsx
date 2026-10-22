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

export const metadata: Metadata = {
    title: "FITALENTA - Wellcome to FITALENTA",
    description: "Empowering businesses and individuals to grow.",
};

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ImpactSection />
      <ExpertsSection />
      <InsightsSection />
      <TestimonialsSection/>
      <PartnersSection />
      <CtaSection />
    </>
  );
}
