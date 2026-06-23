import type { Metadata } from "next";
import { AboutPage } from "@/features/about/about-page";

export const metadata: Metadata = {
  title: "About Us — Our Story, Mission & Team",
  description:
    "Learn about Canvasify's mission to make personalized art accessible to everyone. Meet our team and discover the story behind our AI-powered art platform.",
};

export default function About() {
  return <AboutPage />;
}
