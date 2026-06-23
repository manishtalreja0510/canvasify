"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Heart, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import Link from "next/link";

const GALLERY_DATA = [
  { id: "1", title: "Wedding by the Lake", category: "Wedding", color: "from-pink-500/20 to-purple-500/20", likes: 234, emoji: "💑" },
  { id: "2", title: "Golden Retriever Max", category: "Pet", color: "from-yellow-500/20 to-orange-500/20", likes: 189, emoji: "🐕" },
  { id: "3", title: "Santorini Sunset", category: "Travel", color: "from-blue-500/20 to-cyan-500/20", likes: 312, emoji: "🌅" },
  { id: "4", title: "Family Portrait 2024", category: "Family", color: "from-green-500/20 to-teal-500/20", likes: 156, emoji: "👨‍👩‍👧‍👦" },
  { id: "5", title: "Mountain Valley", category: "Nature", color: "from-emerald-500/20 to-green-500/20", likes: 201, emoji: "🏔️" },
  { id: "6", title: "Dream Home", category: "Home", color: "from-orange-500/20 to-red-500/20", likes: 98, emoji: "🏡" },
];

const CATEGORIES = ["All", "Wedding", "Pet", "Travel", "Family", "Nature", "Home"];

export function GalleryPreview() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxItem, setLightboxItem] = useState<typeof GALLERY_DATA[0] | null>(null);

  const filtered = activeCategory === "All"
    ? GALLERY_DATA
    : GALLERY_DATA.filter((g) => g.category === activeCategory);

  return (
    <section className="py-24 relative overflow-hidden" id="gallery">
      <div className="absolute inset-0 dot-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Gallery"
          title="Real Photos,"
          highlight=" Real Masterpieces"
          description="See how Canvasify transforms memories into stunning paint-by-number art. Every piece is unique, every story priceless."
        />

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center flex-wrap gap-2 mt-8 mb-12"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#7C5CFF] text-white shadow-[0_0_20px_rgba(124,92,255,0.3)]"
                  : "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#94A3B8] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`relative rounded-2xl overflow-hidden cursor-pointer group ${
                  i === 0 || i === 5 ? "row-span-1 aspect-[4/5]" : "aspect-square"
                }`}
                onClick={() => setLightboxItem(item)}
              >
                {/* Placeholder art card */}
                <div className={`w-full h-full bg-gradient-to-br ${item.color} border border-[rgba(255,255,255,0.08)] flex flex-col items-center justify-center gap-3 relative`}>
                  <span className="text-6xl">{item.emoji}</span>
                  {/* Paint-by-number grid overlay */}
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 24px)`,
                    }}
                  />
                  {/* Number dots */}
                  {[{ t: "20%", l: "30%", n: "1" }, { t: "55%", l: "65%", n: "3" }, { t: "70%", l: "20%", n: "5" }].map(({ t, l, n }) => (
                    <div key={n} className="absolute w-5 h-5 rounded-full bg-white text-[#060816] text-[9px] font-bold flex items-center justify-center shadow-sm" style={{ top: t, left: l }}>
                      {n}
                    </div>
                  ))}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,8,22,0.9)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <Badge variant="glass" className="self-start mb-2 text-xs">{item.category}</Badge>
                  <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                      <Heart className="w-3 h-3 text-red-400" />
                      {item.likes}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                      <Eye className="w-3 h-3" />
                      View
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link href="/gallery">
            <Button variant="secondary" size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
              View Full Gallery
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-lg w-full rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`aspect-square bg-gradient-to-br ${lightboxItem.color} flex items-center justify-center`}>
                <span className="text-8xl">{lightboxItem.emoji}</span>
              </div>
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setLightboxItem(null)}
                  className="w-10 h-10 rounded-full bg-[rgba(0,0,0,0.5)] flex items-center justify-center text-white hover:bg-[rgba(0,0,0,0.8)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(6,8,22,0.95)] p-6">
                <Badge variant="default" className="mb-2">{lightboxItem.category}</Badge>
                <h3 className="text-xl font-bold text-white">{lightboxItem.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-sm text-[#94A3B8]">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-400 fill-red-400" /> {lightboxItem.likes} loves
                  </span>
                </div>
                <Link href="/create">
                  <Button variant="gradient" size="md" className="mt-4 w-full">
                    Create Mine Like This
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
