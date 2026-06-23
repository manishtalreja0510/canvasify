import type { Metadata } from "next";
import { FAQSection } from "@/components/home/faq-section";
import { CTASection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description: "Find answers to the most common questions about Canvasify — from how our AI works to shipping, refunds, and subscriptions.",
};

export default function FAQPage() {
  return (
    <div className="pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center mb-4">
          <span className="badge-premium">FAQ</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-4">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h1>
        <p className="text-xl text-center text-[#94A3B8] mb-16">
          22 questions answered. Still have more? Contact our team.
        </p>
      </div>
      <FAQSection />
      <CTASection />
    </div>
  );
}
