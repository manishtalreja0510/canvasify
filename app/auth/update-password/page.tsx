import type { Metadata } from "next";
import { Suspense } from "react";
import { UpdatePasswordPage } from "@/features/auth/update-password-page";

export const metadata: Metadata = { title: "Set New Password — Canvasify" };

export default function Page() {
  return (
    <Suspense>
      <UpdatePasswordPage />
    </Suspense>
  );
}
