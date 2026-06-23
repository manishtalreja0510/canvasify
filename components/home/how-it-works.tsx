"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, Cpu, Sliders, Package } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { HOW_IT_WORKS } from "@/lib/constants";

const ICONS: Record<string, React.ElementType> = {
  Upload, Cpu, Sliders, Package,
};

export function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[rgba(124,92,255,0.04)] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Simple Process"
          title="From Photo to Masterpiece in"
          highlight=" 4 Steps"
          description="Our streamlined process makes creating personalized art effortless. No artistic experience needed — just your favorite photo."
        />

        <div className="mt-20 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(124,92,255,0.3)] to-transparent -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = ICONS[step.icon] || Upload;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Icon circle */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-[#0D1323] border border-[rgba(255,255,255,0.08)] flex items-center justify-center relative z-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                      <Icon className="w-8 h-8 text-[#7C5CFF]" />
                    </div>
                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#7C5CFF] flex items-center justify-center text-xs font-bold text-white z-20 shadow-[0_0_15px_rgba(124,92,255,0.5)]">
                      {step.step}
                    </div>
                    {/* Glow */}
                    <div className="absolute inset-0 bg-[rgba(124,92,255,0.15)] rounded-2xl blur-xl" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
