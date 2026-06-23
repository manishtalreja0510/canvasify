"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(124,92,255,0.15)] via-[rgba(124,92,255,0.05)] to-[rgba(0,229,255,0.1)]" />
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[rgba(124,92,255,0.1)] rounded-full"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[rgba(0,229,255,0.08)] rounded-full"
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-8"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center shadow-[0_0_60px_rgba(124,92,255,0.4)]">
            <Sparkles className="w-10 h-10 text-white" />
          </div>

          <div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-4">
              Your Memory Deserves
              <br />
              <span className="gradient-text">To Be Art</span>
            </h2>
            <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
              Join 5,000+ people who&apos;ve transformed their most precious moments into stunning paintings.
              Start free — no credit card required.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/create">
              <Button variant="gradient" size="xl" magnetic iconRight={<ArrowRight className="w-5 h-5" />}>
                Create My Artwork Free
              </Button>
            </Link>
            <Link href="/gallery">
              <Button variant="glass" size="xl">
                See Gallery First
              </Button>
            </Link>
          </div>

          <p className="text-sm text-[#94A3B8]">
            Free preview • No account needed • Results in 5 minutes
          </p>
        </motion.div>
      </div>
    </section>
  );
}
