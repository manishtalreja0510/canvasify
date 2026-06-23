import type { Metadata } from "next";
import { DashboardPage } from "@/features/dashboard/dashboard-page";

export const metadata: Metadata = {
  title: "Dashboard — Your Canvasify Projects",
  description: "Manage your paint-by-number projects, orders, downloads, and account settings.",
};

export default function Dashboard() {
  return <DashboardPage />;
}
