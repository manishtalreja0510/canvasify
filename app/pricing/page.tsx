import type { Metadata } from "next";
import { PricingSection } from "@/components/home/pricing-section";
import { FAQSection } from "@/components/home/faq-section";
import { CTASection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title: "Pricing — From ₹499 for Personalized Art",
  description:
    "Simple, transparent pricing. Digital downloads from ₹499, Canvas Kits from ₹1,499, and Framed Artwork from ₹3,999. Subscribe for Creative Club at ₹299/month.",
};

export default function PricingPage() {
  return (
    <div className="pt-24">
      <PricingSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
