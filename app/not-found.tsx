"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[rgba(124,92,255,0.06)] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[rgba(0,229,255,0.04)] rounded-full blur-3xl" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center max-w-2xl mx-auto"
      >
        {/* 404 art */}
        <div className="relative inline-block mb-8">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-[120px] md:text-[180px] font-black leading-none select-none"
            style={{
              background: "linear-gradient(135deg, rgba(124,92,255,0.15), rgba(0,229,255,0.1))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(124,92,255,0.3))",
            }}
          >
            404
          </motion.div>
          {/* Paint numbers overlay */}
          {[{ t: "25%", l: "15%", n: "3" }, { t: "60%", l: "75%", n: "7" }, { t: "40%", l: "50%", n: "1" }].map(({ t, l, n }) => (
            <motion.div
              key={n}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: Number(n) * 0.5 }}
              className="absolute w-8 h-8 rounded-full bg-[#7C5CFF] text-white text-sm font-bold flex items-center justify-center shadow-[0_0_20px_rgba(124,92,255,0.5)]"
              style={{ top: t, left: l }}
            >
              {n}
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-xl">Canvasify</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          This canvas is blank
        </h1>
        <p className="text-[#94A3B8] text-lg mb-10 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist. Maybe it was moved, deleted, or never painted in the first place.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/">
            <Button variant="gradient" size="lg" icon={<Home className="w-4 h-4" />}>
              Go Home
            </Button>
          </Link>
          <Link href="/create">
            <Button variant="secondary" size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
              Create Artwork
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
