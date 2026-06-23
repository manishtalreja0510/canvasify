"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Package, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const productType = searchParams.get("product") as "digital" | "canvas_kit" | "framed" | null;
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  const isDigital = productType === "digital";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[rgba(0,208,132,0.06)] rounded-full blur-3xl" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={show ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-lg text-center"
      >
        {/* Animated check */}
        <motion.div
          initial={{ scale: 0 }}
          animate={show ? { scale: 1 } : {}}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#00D084] to-[#00A062] flex items-center justify-center mx-auto mb-8 shadow-[0_0_60px_rgba(0,208,132,0.4)]"
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35 }}
        >
          <span className="badge-premium mb-4 inline-block">Payment Confirmed</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Your Order is{" "}
            <span className="gradient-text">Confirmed!</span>
          </h1>
          <p className="text-[#94A3B8] text-lg mb-2">
            {isDigital
              ? "Your paint-by-number template is ready. Check your email for the download link."
              : "Your canvas kit is being prepared and will be shipped within 2–3 business days."}
          </p>
          {orderId && (
            <p className="text-sm text-[#94A3B8] mb-8">
              Order ID: <span className="text-white font-mono">{orderId}</span>
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-3xl p-6 mb-8 text-left"
        >
          <h3 className="text-white font-semibold mb-4">What happens next?</h3>
          <div className="flex flex-col gap-4">
            {(isDigital ? [
              { icon: Sparkles, title: "Check your email", desc: "A download link has been sent to your inbox (may take 2 minutes)." },
              { icon: Download, title: "Download your template", desc: "High-resolution PDF, print-ready at A3/A2 size." },
              { icon: Package, title: "Get your supplies", desc: "We recommend Camlin or Fevicryl acrylic paint sets." },
            ] : [
              { icon: Package, title: "Kit preparation", desc: "Your canvas kit is being printed and quality-checked." },
              { icon: Sparkles, title: "Shipping in 2–3 days", desc: "You'll receive a tracking link via email once shipped." },
              { icon: CheckCircle2, title: "Delivered in 5–7 days", desc: "Pan-India delivery. Metro cities typically faster." },
            ]).map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[rgba(124,92,255,0.1)] border border-[rgba(124,92,255,0.2)] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-[#7C5CFF]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link href="/dashboard" className="flex-1">
            <Button variant="gradient" size="lg" className="w-full" iconRight={<ArrowRight className="w-4 h-4" />}>
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/create" className="flex-1">
            <Button variant="secondary" size="lg" className="w-full">
              Create Another
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
