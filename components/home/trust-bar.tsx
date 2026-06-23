"use client";

import React from "react";
import { motion } from "framer-motion";

const PUBLICATIONS = [
  { name: "Forbes", logo: "Forbes", width: 80 },
  { name: "TechCrunch", logo: "TechCrunch", width: 120 },
  { name: "Product Hunt", logo: "Product Hunt", width: 110 },
  { name: "Entrepreneur", logo: "Entrepreneur", width: 130 },
  { name: "YourStory", logo: "YourStory", width: 100 },
  { name: "Inc42", logo: "Inc42", width: 70 },
];

export function TrustBar() {
  return (
    <section className="py-12 border-y border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs font-semibold text-[#94A3B8] uppercase tracking-[0.15em] mb-8"
        >
          As Featured In
        </motion.p>

        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: [0, -50 + "%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-16 w-max"
          >
            {[...PUBLICATIONS, ...PUBLICATIONS].map((pub, i) => (
              <div
                key={`${pub.name}-${i}`}
                className="flex items-center justify-center opacity-30 hover:opacity-60 transition-opacity duration-300 cursor-default select-none"
                style={{ minWidth: pub.width }}
              >
                <span
                  className="font-bold text-white tracking-tight"
                  style={{
                    fontSize: pub.name === "Forbes" ? "28px" : pub.name === "Inc42" ? "22px" : "20px",
                    fontFamily: "serif",
                  }}
                >
                  {pub.logo}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#060816] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#060816] to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
