import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Canvasify's refund and return policy — transparent, fair, and customer-first.",
};

const SECTIONS = [
  { title: "Our Commitment", content: "We want every Canvasify customer to be delighted with their purchase. Our refund policy is designed to be fair, transparent, and customer-first. If something goes wrong, we will make it right." },
  { title: "Digital Downloads", content: "Digital downloads are non-refundable once accessed, as they are immediately deliverable digital goods. However, if you experience a technical issue preventing download or the template has a significant error, contact us within 7 days and we will regenerate or provide a full refund." },
  { title: "Canvas Kits — Damaged or Defective", content: "If your Canvas Kit arrives damaged, defective, or with missing components, contact us within 7 days of delivery with photos of the damage. We will ship a replacement at no cost or provide a full refund, including shipping, at your choice." },
  { title: "Canvas Kits — Change of Mind", content: "We do not accept returns for change-of-mind on custom-made Canvas Kits as each kit is produced specifically for your order. If the physical kit shows significant color deviation from your preview (more than 15% palette difference), we will offer a free reprint." },
  { title: "Framed Artwork", content: "Framed Artwork carries the same damaged/defective policy as Canvas Kits. Contact us within 7 days of delivery. For transit damage, please photograph both the outer packaging and product. We will arrange collection and ship a replacement within 10 business days." },
  { title: "Creative Club Subscription", content: "Creative Club subscriptions can be cancelled at any time from your dashboard. Your benefits remain active until the end of the current billing period. We do not offer refunds for partial subscription periods. Your first month is free — if you cancel within 30 days of starting paid billing, we will refund the first month's charge." },
  { title: "How to Request a Refund", content: "Email support@canvasify.art with your order number, description of the issue, and photos if applicable. We respond within 24 business hours. Approved refunds are processed within 5-7 business days and will appear on your statement within 2-10 banking days depending on your bank." },
  { title: "International Orders", content: "For international orders, we cover shipping costs for returns due to our error (damaged, defective, wrong item). For any approved refund, the amount will be refunded in the original currency and payment method. Currency exchange differences are not refundable." },
];

export default function RefundPolicy() {
  return (
    <LegalPage
      title="Refund Policy"
      lastUpdated="June 1, 2025"
      intro="Our refund policy is simple: if something goes wrong, we will make it right. Here's exactly what that means in every scenario."
      sections={SECTIONS}
    />
  );
}
