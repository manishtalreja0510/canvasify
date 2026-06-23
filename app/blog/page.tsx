import type { Metadata } from "next";
import { BlogListPage } from "@/features/blog/blog-list-page";

export const metadata: Metadata = {
  title: "Blog — Art Tips, Inspiration & Stories",
  description:
    "Explore painting tips, art therapy insights, gift guides, and behind-the-scenes stories from the Canvasify team.",
};

export default function Blog() {
  return <BlogListPage />;
}
