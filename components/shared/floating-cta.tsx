"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, 8000);

    const onScroll = () => {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (pct > 40 && !dismissed) setVisible(true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [dismissed]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: 20 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-6 left-6 z-40 max-w-xs"
        >
          <div className="bg-[#0D1323] border border-[rgba(124,92,255,0.3)] rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <button
              onClick={handleDismiss}
              className="absolute top-2.5 right-2.5 w-6 h-6 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Free Preview Available</p>
                <p className="text-xs text-[#94A3B8]">No account needed</p>
              </div>
            </div>

            <p className="text-xs text-[#94A3B8] mb-3 leading-relaxed">
              Upload any photo and get a free AI-generated paint-by-number preview in under 5 minutes.
            </p>

            <Link href="/create" onClick={handleDismiss}>
              <Button variant="gradient" size="sm" className="w-full" iconRight={<ArrowRight className="w-3.5 h-3.5" />}>
                Get Free Preview
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
