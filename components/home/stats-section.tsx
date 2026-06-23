"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { METRICS } from "@/lib/constants";

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, numericValue, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplayed(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, numericValue]);

  const hasK = value.includes(",");
  const formatted = hasK
    ? displayed.toLocaleString("en-IN")
    : displayed.toString();

  return <span ref={ref}>{formatted}{suffix}</span>;
}

export function StatsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(124,92,255,0.05)] via-transparent to-[rgba(0,229,255,0.05)]" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 gradient-text">
                <AnimatedCounter value={metric.value} suffix={metric.suffix} />
              </div>
              <div className="text-white font-semibold mb-1">{metric.label}</div>
              {metric.description && (
                <div className="text-xs text-[#94A3B8]">{metric.description}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
