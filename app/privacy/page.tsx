import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Canvasify collects, uses, and protects your personal data.",
};

const SECTIONS = [
  { title: "1. Information We Collect", content: "We collect information you provide directly (name, email, photos), information generated through your use of the Service (project data, order history), and technical data (device type, browser, IP address, usage analytics). We use Supabase for secure data storage and PostHog for privacy-respecting analytics." },
  { title: "2. How We Use Your Information", content: "We use your information to provide and improve the Service, process orders and payments, send transactional emails (order confirmations, delivery updates), respond to your inquiries, and send marketing communications (only with your consent). We never sell your personal data to third parties." },
  { title: "3. Your Uploaded Photos", content: "Photos you upload are stored securely on encrypted servers. They are used solely to generate your personalized templates. We do not use your photos to train AI models without explicit written consent. You can delete your photos and all derived data at any time from your dashboard settings." },
  { title: "4. Data Sharing", content: "We share minimal data with trusted service providers: payment processors (Stripe, Razorpay), shipping partners, email service providers (Resend), and cloud infrastructure (Vercel, Cloudflare). All third parties are required to maintain data security and may only use your data as needed to provide services to us." },
  { title: "5. Data Retention", content: "We retain your account data for as long as your account is active. Order data is retained for 7 years for legal and accounting purposes. You may request deletion of your personal data at any time, subject to legal retention requirements." },
  { title: "6. Cookies", content: "We use essential cookies for authentication and session management, analytics cookies (PostHog) to understand how users interact with our Service, and preference cookies to remember your settings. You can control cookies through your browser settings." },
  { title: "7. Your Rights", content: "You have the right to access, correct, or delete your personal data. You may object to or restrict processing, request data portability, and withdraw consent at any time. To exercise these rights, contact privacy@canvasify.art. We will respond within 30 days." },
  { title: "8. Security", content: "We implement industry-standard security measures including encryption in transit (TLS) and at rest, row-level security on our database, regular security audits, and access controls. However, no system is 100% secure, and we cannot guarantee absolute security." },
  { title: "9. Children's Privacy", content: "The Service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we discover we have collected such information, we will delete it immediately." },
  { title: "10. Contact Us", content: "For privacy-related inquiries, contact our Data Protection Officer at privacy@canvasify.art or by mail at: Canvasify, MG Road, Bangalore, Karnataka, India 560001." },
];

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="June 1, 2025"
      intro="At Canvasify, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information."
      sections={SECTIONS}
    />
  );
}
