"use client";

import React from "react";
import { motion } from "framer-motion";

interface LegalSection {
  title: string;
  content: string;
}

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
  intro?: string;
}

export function LegalPage({ title, lastUpdated, sections, intro }: LegalPageProps) {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{title}</h1>
          <p className="text-sm text-[#94A3B8] mb-8">Last updated: {lastUpdated}</p>

          {intro && (
            <p className="text-[#94A3B8] mb-10 text-lg leading-relaxed">{intro}</p>
          )}

          <div className="flex flex-col gap-8">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="pb-8 border-b border-[rgba(255,255,255,0.06)] last:border-0"
              >
                <h2 className="text-xl font-bold text-white mb-3">{section.title}</h2>
                <p className="text-[#94A3B8] leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-[rgba(124,92,255,0.05)] border border-[rgba(124,92,255,0.15)] rounded-2xl">
            <p className="text-[#94A3B8] text-sm">
              If you have questions about these terms, please contact us at{" "}
              <a href="mailto:legal@canvasify.art" className="text-[#7C5CFF] hover:text-[#B48EFF]">
                legal@canvasify.art
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
