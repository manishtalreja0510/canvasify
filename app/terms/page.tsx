import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read Canvasify's Terms of Service to understand your rights and responsibilities when using our platform.",
};

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing or using Canvasify (\"Service\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. These terms apply to all visitors, users, and others who access or use the Service.",
  },
  {
    title: "2. Description of Service",
    content: "Canvasify provides an AI-powered platform that transforms user-uploaded photographs into personalized paint-by-number templates, digital downloads, and physical art products. We reserve the right to modify or discontinue the Service at any time without notice.",
  },
  {
    title: "3. User Accounts",
    content: "When you create an account, you must provide accurate and complete information. You are responsible for maintaining the security of your account credentials. You must immediately notify us of any unauthorized use. We cannot be held liable for any loss or damage arising from your failure to comply with this obligation.",
  },
  {
    title: "4. Intellectual Property & User Content",
    content: "You retain all rights to photographs and images you upload. By uploading content, you grant Canvasify a non-exclusive, royalty-free license to process and transform your images for the purpose of delivering our services. You represent that you have all necessary rights to the content you upload. Generated templates based on your images are licensed to you for personal, non-commercial use.",
  },
  {
    title: "5. Prohibited Uses",
    content: "You may not use the Service to upload content that infringes third-party intellectual property rights, contains illegal material, is defamatory or harassing, or is used for any commercial purpose without our express written consent. We reserve the right to terminate accounts that violate these prohibitions.",
  },
  {
    title: "6. Orders & Payments",
    content: "All prices are listed in Indian Rupees (INR) unless otherwise specified. Payment is required at time of order. We accept major credit cards, debit cards, UPI, and net banking through our secure payment processors (Stripe and Razorpay). By placing an order, you authorize us to charge your payment method.",
  },
  {
    title: "7. Delivery & Fulfillment",
    content: "Digital products are delivered electronically within minutes of payment confirmation. Physical products (Canvas Kits, Framed Artwork) are produced within 2-5 business days and delivered via courier partners. Delivery times are estimates and may vary. We are not responsible for delays caused by courier services or customs.",
  },
  {
    title: "8. Limitation of Liability",
    content: "To the maximum extent permitted by law, Canvasify shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill. Our total liability shall not exceed the amount paid for the specific product or service giving rise to the claim.",
  },
  {
    title: "9. Governing Law",
    content: "These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka, India.",
  },
  {
    title: "10. Changes to Terms",
    content: "We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or prominent notice on the Service. Your continued use of the Service after changes constitutes acceptance of the new Terms.",
  },
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="June 1, 2025"
      sections={SECTIONS}
    />
  );
}
