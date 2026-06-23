"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, CheckCircle2, Frown, Smile, Heart, Camera, Home, Plane } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const PROBLEMS = [
  { icon: X, title: "Generic kits", description: "Store-bought kits with boring, impersonal designs you don't care about." },
  { icon: X, title: "No emotional connection", description: "Painting scenes of strangers or stock images creates zero personal meaning." },
  { icon: X, title: "Low quality results", description: "Poor paint quality, inaccurate colors, and thin canvases that don't last." },
];

const SOLUTIONS = [
  { icon: CheckCircle2, title: "Your photo, your story", description: "Every kit is made from YOUR chosen memory — wedding, pet, family, travel." },
  { icon: CheckCircle2, title: "AI precision", description: "Advanced segmentation creates perfect paint zones that match your photo exactly." },
  { icon: CheckCircle2, title: "Premium materials", description: "Archival-quality canvas, vibrant non-toxic paints, professional brushes." },
];

const CATEGORIES = [
  { icon: Heart, label: "Weddings", color: "text-pink-400" },
  { icon: Camera, label: "Pets", color: "text-yellow-400" },
  { icon: Heart, label: "Family", color: "text-blue-400" },
  { icon: Plane, label: "Travel", color: "text-cyan-400" },
  { icon: Home, label: "Homes", color: "text-green-400" },
  { icon: Camera, label: "Custom", color: "text-purple-400" },
];

export function ProblemSolution() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Why Canvasify"
          title="Art That Actually"
          highlight=" Means Something"
          description="Most paint-by-number kits are generic and impersonal. We changed that."
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.15)] p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[rgba(239,68,68,0.1)] flex items-center justify-center">
                <Frown className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-red-400">The Old Way</h3>
            </div>
            <div className="flex flex-col gap-5">
              {PROBLEMS.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-7 h-7 rounded-lg bg-[rgba(239,68,68,0.15)] flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">{p.title}</p>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">{p.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-[rgba(0,208,132,0.05)] border border-[rgba(0,208,132,0.15)] p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[rgba(0,208,132,0.1)] flex items-center justify-center">
                <Smile className="w-5 h-5 text-[#00D084]" />
              </div>
              <h3 className="text-xl font-bold text-[#00D084]">The Canvasify Way</h3>
            </div>
            <div className="flex flex-col gap-5">
              {SOLUTIONS.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-7 h-7 rounded-lg bg-[rgba(0,208,132,0.15)] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00D084]" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">{s.title}</p>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">{s.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Categories */}
            <div className="mt-8 pt-6 border-t border-[rgba(0,208,132,0.1)]">
              <p className="text-sm text-[#94A3B8] mb-4">Works with any photo type:</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-center gap-1.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-xl px-3 py-1.5 text-sm">
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    <span className="text-white">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
