"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Heart, Eye, X, ArrowRight, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const CATEGORIES = ["All", "Weddings", "Pets", "Travel", "Family", "Homes", "Nature", "Custom"];
const SORT_OPTIONS = ["Most Popular", "Newest", "Most Liked", "Featured"];

const GALLERY_ITEMS = Array.from({ length: 24 }, (_, i) => ({
  id: String(i + 1),
  title: [
    "Wedding by the Lake", "Golden Retriever Max", "Santorini Sunset",
    "Family Portrait 2024", "Mountain Valley", "Dream Home", "Paris at Night",
    "Labrador Trio", "Bali Temples", "Anniversary Couple", "Snow Mountains",
    "Victorian Villa", "Desert Safari", "Siberian Husky", "Amalfi Coast",
    "Grandparents Portrait", "Autumn Forest", "Modern Penthouse", "Amazon Rainforest",
    "Border Collie", "Machu Picchu", "Three Generations", "Arctic Tundra",
    "Beach House"
  ][i],
  category: ["Weddings", "Pets", "Travel", "Family", "Nature", "Homes", "Travel", "Pets",
    "Travel", "Weddings", "Nature", "Homes", "Travel", "Pets", "Travel",
    "Family", "Nature", "Homes", "Nature", "Pets", "Travel", "Family", "Nature", "Homes"][i],
  likes: Math.floor(Math.random() * 400) + 50,
  views: Math.floor(Math.random() * 2000) + 200,
  featured: i < 6,
  emoji: ["💑", "🐕", "🌅", "👨‍👩‍👧‍👦", "🏔️", "🏡", "🌙", "🐾", "⛩️", "💑",
    "❄️", "🏠", "🐪", "🐺", "⛵", "👴👵", "🍂", "🏙️", "🌿", "🐕", "🏛️",
    "👪", "🌨️", "🏖️"][i],
  gradient: [
    "from-pink-500/20 to-purple-500/20", "from-yellow-500/20 to-orange-500/20",
    "from-blue-500/20 to-cyan-500/20", "from-green-500/20 to-teal-500/20",
    "from-emerald-500/20 to-green-500/20", "from-orange-500/20 to-red-500/20",
    "from-indigo-500/20 to-purple-500/20", "from-amber-500/20 to-yellow-500/20",
    "from-teal-500/20 to-emerald-500/20", "from-rose-500/20 to-pink-500/20",
    "from-sky-500/20 to-blue-500/20", "from-stone-500/20 to-gray-500/20",
    "from-orange-500/20 to-amber-500/20", "from-slate-500/20 to-gray-500/20",
    "from-cyan-500/20 to-sky-500/20", "from-violet-500/20 to-purple-500/20",
    "from-red-500/20 to-orange-500/20", "from-blue-500/20 to-indigo-500/20",
    "from-green-500/20 to-emerald-500/20", "from-yellow-500/20 to-orange-500/20",
    "from-amber-500/20 to-yellow-500/20", "from-teal-500/20 to-cyan-500/20",
    "from-purple-500/20 to-violet-500/20", "from-sky-500/20 to-teal-500/20",
  ][i],
}));

export function GalleryPage() {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Most Popular");
  const [search, setSearch] = useState("");
  const [lightbox, setLightbox] = useState<(typeof GALLERY_ITEMS)[0] | null>(null);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const filtered = GALLERY_ITEMS
    .filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "Most Popular") return b.views - a.views;
      if (sort === "Most Liked") return b.likes - a.likes;
      if (sort === "Featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return 0;
    });

  return (
    <div className="min-h-screen pt-32 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="badge-premium mb-4 inline-block">Community Gallery</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Real Photos,{" "}
            <span className="gradient-text">Real Masterpieces</span>
          </h1>
          <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto">
            Browse stunning transformations from our community. Every piece tells a unique story.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4 mb-8"
        >
          {/* Search & Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search creations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[rgba(124,92,255,0.4)] text-sm transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#94A3B8]" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-11 px-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-[rgba(124,92,255,0.4)] cursor-pointer"
              >
                {SORT_OPTIONS.map((s) => <option key={s} value={s} className="bg-[#0D1323]">{s}</option>)}
              </select>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  category === cat
                    ? "bg-[#7C5CFF] text-white shadow-[0_0_20px_rgba(124,92,255,0.3)]"
                    : "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#94A3B8] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats bar */}
        <div className="flex items-center justify-between mb-6 text-sm text-[#94A3B8]">
          <span>{filtered.length} creations</span>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Filter: {category}</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
                className="relative group cursor-pointer rounded-2xl overflow-hidden"
                onClick={() => setLightbox(item)}
              >
                <div className={`aspect-square bg-gradient-to-br ${item.gradient} relative`}>
                  {/* Grid overlay */}
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 22px), repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 22px)`,
                    }}
                  />
                  {/* Number dots */}
                  {[{ t: "20%", l: "25%", n: "1" }, { t: "55%", l: "60%", n: "3" }, { t: "70%", l: "20%", n: "5" }].map(({ t, l, n }) => (
                    <div key={n} className="absolute w-4 h-4 rounded-full bg-white text-[#060816] text-[9px] font-bold flex items-center justify-center" style={{ top: t, left: l }}>
                      {n}
                    </div>
                  ))}
                  <span className="absolute inset-0 flex items-center justify-center text-4xl">{item.emoji}</span>

                  {item.featured && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="new" className="text-[10px] py-0.5">Featured</Badge>
                    </div>
                  )}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,8,22,0.95)] via-[rgba(6,8,22,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
                  <Badge variant="glass" className="self-start mb-2 text-[10px]">{item.category}</Badge>
                  <h4 className="text-white font-semibold text-xs leading-tight">{item.title}</h4>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const next = new Set(liked);
                        if (next.has(item.id)) next.delete(item.id); else next.add(item.id);
                        setLiked(next);
                      }}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Heart className={`w-3 h-3 transition-colors ${liked.has(item.id) ? "fill-red-500 text-red-500" : "text-[#94A3B8]"}`} />
                      <span className="text-[#94A3B8]">{item.likes + (liked.has(item.id) ? 1 : 0)}</span>
                    </button>
                    <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                      <Eye className="w-3 h-3" />{item.views}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load more */}
        <div className="mt-12 text-center">
          <Button variant="secondary" size="lg">
            Load More Creations
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative bg-[#0D1323] rounded-3xl overflow-hidden max-w-xl w-full border border-[rgba(255,255,255,0.08)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`aspect-video bg-gradient-to-br ${lightbox.gradient} flex items-center justify-center relative`}>
                <span className="text-8xl">{lightbox.emoji}</span>
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 22px), repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 22px)`,
                  }}
                />
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge variant="default" className="mb-2">{lightbox.category}</Badge>
                    <h3 className="text-xl font-bold text-white">{lightbox.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#94A3B8]">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-400 fill-red-400" /> {lightbox.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> {lightbox.views}
                    </span>
                  </div>
                </div>
                <Link href="/create">
                  <Button variant="gradient" size="lg" className="w-full" iconRight={<ArrowRight className="w-4 h-4" />}>
                    Create Mine Like This
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
