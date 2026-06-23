import type { Metadata } from "next";
import { ForgotPasswordPage } from "@/features/auth/forgot-password-page";

export const metadata: Metadata = {
  title: "Reset Password — Canvasify",
  description: "Reset your Canvasify account password.",
};

export default function ForgotPassword() {
  return <ForgotPasswordPage />;
}
