import type { Metadata } from "next";
import { AdminPage } from "@/features/admin/admin-page";

export const metadata: Metadata = {
  title: "Admin Dashboard — Canvasify",
  description: "Canvasify admin panel — manage orders, users, analytics, and content.",
};

export default function Admin() {
  return <AdminPage />;
}
