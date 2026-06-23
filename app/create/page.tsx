import type { Metadata } from "next";
import { CreatePage } from "@/features/create/create-page";

export const metadata: Metadata = {
  title: "Create Your Artwork — Upload & Transform",
  description: "Upload your photo and watch AI transform it into a stunning personalized paint-by-number template. Start for free.",
};

export default function Create() {
  return <CreatePage />;
}
