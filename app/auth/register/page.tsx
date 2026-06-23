import type { Metadata } from "next";
import { RegisterPage } from "@/features/auth/register-page";

export const metadata: Metadata = {
  title: "Create Account — Canvasify",
  description: "Join Canvasify and start transforming your memories into personalized art today.",
};

export default function Register() {
  return <RegisterPage />;
}
