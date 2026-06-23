import type { Metadata } from "next";
import { GalleryPage } from "@/features/gallery/gallery-page";

export const metadata: Metadata = {
  title: "Gallery — Customer Creations & Transformations",
  description:
    "Browse thousands of stunning paint-by-number transformations created by our community. See weddings, pets, travel, family portraits and more.",
};

export default function Gallery() {
  return <GalleryPage />;
}
