import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentSuccessPage } from "@/features/payment/payment-success-page";

export const metadata: Metadata = {
  title: "Payment Successful — Canvasify",
};

export default function SuccessPage() {
  return (
    <Suspense>
      <PaymentSuccessPage />
    </Suspense>
  );
}
