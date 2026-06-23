import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { HowItWorks } from "@/components/home/how-it-works";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { PricingSection } from "@/components/home/pricing-section";
import { Testimonials } from "@/components/home/testimonials";
import { StatsSection } from "@/components/home/stats-section";
import { LeadCapture } from "@/components/home/lead-capture";
import { FAQSection } from "@/components/home/faq-section";
import { CTASection } from "@/components/home/cta-section";
import { ProblemSolution } from "@/components/home/problem-solution";
import { AITechnology } from "@/components/home/ai-technology";
import { CorporateSection } from "@/components/home/corporate-section";

export const metadata: Metadata = {
  title: "Canvasify — Turn Memories Into Masterpieces with AI",
  description:
    "Transform your photos into personalized paint-by-number kits using AI. Upload any image — wedding, pets, travel, family — and receive a stunning custom art kit. From ₹499.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <StatsSection />
      <ProblemSolution />
      <HowItWorks />
      <AITechnology />
      <GalleryPreview />
      <PricingSection />
      <Testimonials />
      <CorporateSection />
      <LeadCapture />
      <FAQSection />
      <CTASection />
    </>
  );
}
