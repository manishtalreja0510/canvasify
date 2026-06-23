"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { TESTIMONIALS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? "fill-[#FFD700] text-[#FFD700]" : "text-[#94A3B8]"}`}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [autoplay, next]);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[rgba(0,229,255,0.05)] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[rgba(124,92,255,0.05)] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Customer Stories"
          title="Thousands of Memories "
          highlight="Transformed"
          description="Don't take our word for it. Here's what our community says about their Canvasify experience."
        />

        {/* Aggregate stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-8 mt-8 mb-16"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />)}
            </div>
            <p className="text-2xl font-bold text-white">4.9/5</p>
            <p className="text-xs text-[#94A3B8]">Average Rating</p>
          </div>
          <div className="w-px h-12 bg-[rgba(255,255,255,0.08)]" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">2,400+</p>
            <p className="text-xs text-[#94A3B8]">Verified Reviews</p>
          </div>
          <div className="w-px h-12 bg-[rgba(255,255,255,0.08)]" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">98%</p>
            <p className="text-xs text-[#94A3B8]">Would Recommend</p>
          </div>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {TESTIMONIALS.slice(0, 4).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <StarRating rating={t.rating} />
                {t.verified && <Badge variant="success" className="text-[10px] py-0.5">Verified</Badge>}
              </div>
              <p className="text-sm text-[#94A3B8] leading-relaxed flex-1">
                &ldquo;{t.text.length > 150 ? t.text.slice(0, 150) + "..." : t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-[#94A3B8]">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured testimonial carousel */}
        <div
          className="relative rounded-3xl bg-gradient-to-br from-[rgba(124,92,255,0.08)] to-[rgba(0,229,255,0.04)] border border-[rgba(124,92,255,0.2)] p-8 md:p-12 overflow-hidden"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          <Quote className="absolute top-6 right-8 w-24 h-24 text-[rgba(124,92,255,0.1)]" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={TESTIMONIALS[current].rating} />
                {TESTIMONIALS[current].verified && (
                  <Badge variant="success" className="text-xs">Verified Purchase</Badge>
                )}
              </div>

              <p className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-8 max-w-3xl">
                &ldquo;{TESTIMONIALS[current].text}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center text-lg font-bold text-white">
                  {TESTIMONIALS[current].avatar}
                </div>
                <div>
                  <p className="text-white font-bold">{TESTIMONIALS[current].name}</p>
                  <p className="text-sm text-[#94A3B8]">{TESTIMONIALS[current].role} • {TESTIMONIALS[current].location}</p>
                  <p className="text-xs text-[#7C5CFF] mt-0.5">{TESTIMONIALS[current].project_type}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[rgba(124,92,255,0.15)] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "bg-[#7C5CFF] w-6" : "bg-[rgba(255,255,255,0.15)] w-1.5 hover:bg-[rgba(255,255,255,0.3)]"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[rgba(124,92,255,0.15)] transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
