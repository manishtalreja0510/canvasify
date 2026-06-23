import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPage } from "@/features/auth/login-page";

export const metadata: Metadata = {
  title: "Sign In — Canvasify",
  description: "Sign in to your Canvasify account to access your projects and orders.",
};

export default function Login() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
