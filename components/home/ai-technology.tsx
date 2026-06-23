"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Palette, Grid3X3, Scan, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { AI_STEPS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

const STEP_ICONS = [Scan, Palette, Grid3X3, Cpu];

export function AITechnology() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[rgba(0,229,255,0.05)] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[rgba(124,92,255,0.05)] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="AI Technology"
          title="The Science Behind"
          highlight=" The Magic"
          description="Our AI engine uses cutting-edge computer vision and color science to transform any photo into a perfect paint-by-number template."
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Steps */}
          <div className="flex flex-col gap-4">
            {AI_STEPS.map((step, i) => {
              const Icon = STEP_ICONS[i];
              const isActive = activeStep === i;
              return (
                <motion.button
                  key={step.step}
                  onClick={() => setActiveStep(i)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? "border-[rgba(124,92,255,0.4)] bg-[rgba(124,92,255,0.08)] shadow-[0_8px_30px_rgba(124,92,255,0.1)]"
                      : "border-[rgba(255,255,255,0.06)] bg-[#0D1323] hover:border-[rgba(124,92,255,0.2)]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: isActive ? `${step.color}20` : undefined, border: `1px solid ${step.color}30` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: step.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Step {step.step}</span>
                        {isActive && <Badge variant="default" className="text-[10px] py-0.5">Active</Badge>}
                      </div>
                      <h4 className={`font-bold mt-0.5 ${isActive ? "text-white" : "text-[#94A3B8]"}`}>
                        {step.title}
                      </h4>
                    </div>
                    <ArrowRight className={`w-4 h-4 transition-transform ${isActive ? "text-[#7C5CFF] translate-x-1" : "text-[#94A3B8]"}`} />
                  </div>
                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-sm text-[#94A3B8] leading-relaxed mt-3 pl-14"
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {/* Right: Interactive diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-3xl bg-[#0D1323] border border-[rgba(255,255,255,0.07)] p-8 relative overflow-hidden aspect-square flex items-center justify-center">
              {/* Background grid */}
              <div className="absolute inset-0 grid-pattern opacity-40" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex flex-col items-center justify-center gap-6 text-center"
                >
                  {/* Visual representation */}
                  {activeStep === 0 && (
                    <div className="relative">
                      <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 relative overflow-hidden">
                        {/* Segmentation lines */}
                        {[20, 40, 60, 80].map((pct) => (
                          <div key={pct}>
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ delay: 0.1 * (pct / 20) }}
                              className="absolute left-0 right-0 h-px bg-[rgba(124,92,255,0.5)]"
                              style={{ top: `${pct}%` }}
                            />
                            <motion.div
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{ delay: 0.1 * (pct / 20) }}
                              className="absolute top-0 bottom-0 w-px bg-[rgba(124,92,255,0.5)]"
                              style={{ left: `${pct}%` }}
                            />
                          </div>
                        ))}
                        <span className="absolute inset-0 flex items-center justify-center text-4xl">🖼️</span>
                      </div>
                      <p className="mt-4 text-sm text-[#94A3B8]">Semantic region detection</p>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex gap-2">
                        {["#4A90D9", "#E8D5B7", "#2C5F2E", "#8B4513", "#F5F5DC", "#1A1A2E"].map((c, i) => (
                          <motion.div
                            key={c}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="w-10 h-10 rounded-xl shadow-lg"
                            style={{ background: c }}
                          />
                        ))}
                      </div>
                      <div className="flex gap-1.5">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div key={i} className="w-4 h-4 rounded-sm" style={{ background: `hsl(${i * 15}, 60%, 50%)` }} />
                        ))}
                      </div>
                      <p className="text-sm text-[#94A3B8]">24-color palette optimization</p>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="relative w-40 h-40">
                      <div className="absolute inset-0 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)]"
                        style={{
                          backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 20px)`,
                        }}
                      />
                      {[
                        { t: "15%", l: "25%", n: "1" },
                        { t: "35%", l: "55%", n: "5" },
                        { t: "55%", l: "20%", n: "3" },
                        { t: "70%", l: "65%", n: "8" },
                        { t: "25%", l: "75%", n: "2" },
                      ].map(({ t, l, n }, i) => (
                        <motion.div
                          key={n}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.15 }}
                          className="absolute w-6 h-6 rounded-full bg-white text-[#060816] text-xs font-bold flex items-center justify-center shadow-md"
                          style={{ top: t, left: l }}
                        >
                          {n}
                        </motion.div>
                      ))}
                      <p className="absolute -bottom-8 left-0 right-0 text-center text-sm text-[#94A3B8]">Number assignment</p>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="w-12 flex flex-col items-center gap-1"
                          >
                            <div className="w-10 h-10 rounded-lg" style={{ background: `hsl(${i * 45}, 60%, 50%)` }} />
                            <span className="text-xs text-[#94A3B8] font-bold">{i + 1}</span>
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-sm text-[#94A3B8]">Custom palette generated</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Tech badges */}
            <div className="absolute -bottom-4 left-4 right-4 flex justify-center gap-2">
              {["OpenCV", "PyTorch", "Pillow", "FastAPI"].map((tech) => (
                <span key={tech} className="text-xs bg-[#0D1323] border border-[rgba(255,255,255,0.08)] text-[#94A3B8] px-2.5 py-1 rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
