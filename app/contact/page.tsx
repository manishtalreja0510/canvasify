import type { Metadata } from "next";
import { ContactPage } from "@/features/contact/contact-page";

export const metadata: Metadata = {
  title: "Contact Us — We'd Love to Hear from You",
  description: "Get in touch with the Canvasify team for support, partnerships, corporate orders, or general questions.",
};

export default function Contact() {
  return <ContactPage />;
}
