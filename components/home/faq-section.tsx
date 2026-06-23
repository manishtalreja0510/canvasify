"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { FAQS } from "@/lib/constants";

const CATEGORIES = ["All", "Getting Started", "Products", "Orders", "Payments", "Refunds", "Business", "Technical", "Experience"];

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>("1");

  const filtered = activeCategory === "All"
    ? FAQS
    : FAQS.filter((f) => f.category === activeCategory);

  return (
    <section className="py-24 relative" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="FAQ"
          title="Everything You Need "
          highlight="to Know"
          description="Got questions? We've answered the most common ones below."
        />

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mt-8 mb-12"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenId(null); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#7C5CFF] text-white shadow-[0_0_20px_rgba(124,92,255,0.3)]"
                  : "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#94A3B8] hover:text-white hover:border-[rgba(124,92,255,0.2)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* FAQ Accordion */}
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {filtered.map((faq, i) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openId === faq.id
                    ? "border-[rgba(124,92,255,0.3)] bg-[rgba(124,92,255,0.04)]"
                    : "border-[rgba(255,255,255,0.07)] bg-[#0D1323]"
                }`}
              >
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className={`font-medium text-sm md:text-base transition-colors ${
                    openId === faq.id ? "text-white" : "text-[#94A3B8]"
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    openId === faq.id
                      ? "bg-[#7C5CFF] text-white"
                      : "bg-[rgba(255,255,255,0.05)] text-[#94A3B8]"
                  }`}>
                    {openId === faq.id ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className="px-5 pb-5 text-sm text-[#94A3B8] leading-relaxed border-t border-[rgba(255,255,255,0.05)] pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center p-8 rounded-2xl bg-[rgba(124,92,255,0.05)] border border-[rgba(124,92,255,0.15)]"
        >
          <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-[#94A3B8] mb-4">Our friendly support team typically responds within 2 hours.</p>
          <a
            href="mailto:hello@canvasify.art"
            className="inline-flex items-center gap-2 bg-[#7C5CFF] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#9B7FFF] transition-colors"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </section>
  );
}
