"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Clock, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BLOG_POSTS } from "@/lib/constants";
import Link from "next/link";

const CATEGORIES = ["All", "Wellness", "Tips & Tricks", "Gift Ideas", "Technology", "Business"];

export function BlogListPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const featured = BLOG_POSTS.find((p) => p.featured);
  const rest = BLOG_POSTS.filter((p) => p.id !== featured?.id);

  const filtered = rest.filter((p) => {
    if (category !== "All" && p.category !== category) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="badge-premium mb-4 inline-block">Blog</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Art, Tech &{" "}
            <span className="gradient-text">Inspiration</span>
          </h1>
          <p className="text-xl text-[#94A3B8]">Tips, stories, and insights from the Canvasify team.</p>
        </motion.div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[rgba(124,92,255,0.4)] text-sm transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  category === cat
                    ? "bg-[#7C5CFF] text-white"
                    : "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#94A3B8] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured post */}
        {featured && category === "All" && !search && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link href={`/blog/${featured.slug}`}>
              <div className="rounded-3xl bg-[#0D1323] border border-[rgba(255,255,255,0.07)] overflow-hidden hover:border-[rgba(124,92,255,0.3)] transition-colors group">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-[rgba(124,92,255,0.2)] to-[rgba(0,229,255,0.1)] flex items-center justify-center">
                    <span className="text-8xl">📝</span>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="default">Featured</Badge>
                      <Badge variant="muted">{featured.category}</Badge>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#B48EFF] transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-[#94A3B8] mb-6 leading-relaxed">{featured.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center text-sm font-bold text-white">
                          {featured.author.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{featured.author.name}</p>
                          <p className="text-xs text-[#94A3B8]">{featured.published_at}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#94A3B8]">
                        <Clock className="w-3.5 h-3.5" />
                        {featured.read_time} min read
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl overflow-hidden hover:border-[rgba(124,92,255,0.3)] transition-all hover:-translate-y-1 group">
                  <div className="aspect-video bg-gradient-to-br from-[rgba(124,92,255,0.15)] to-[rgba(0,229,255,0.08)] flex items-center justify-center">
                    <span className="text-5xl">
                      {post.category === "Wellness" ? "🧘" :
                       post.category === "Tips & Tricks" ? "🎨" :
                       post.category === "Gift Ideas" ? "🎁" :
                       post.category === "Technology" ? "🤖" : "💼"}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="muted" className="text-[10px]">{post.category}</Badge>
                      <div className="flex items-center gap-1 text-xs text-[#94A3B8] ml-auto">
                        <Clock className="w-3 h-3" />
                        {post.read_time} min
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#B48EFF] transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.06)]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center text-xs font-bold text-white">
                          {post.author.avatar}
                        </div>
                        <span className="text-xs text-[#94A3B8]">{post.author.name}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="flex items-center gap-0.5 text-[10px] text-[#94A3B8]">
                            <Tag className="w-2.5 h-2.5" />{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-[rgba(124,92,255,0.05)] border border-[rgba(124,92,255,0.2)] rounded-3xl p-12"
        >
          <h3 className="text-3xl font-bold text-white mb-3">Get Weekly Art Inspiration</h3>
          <p className="text-[#94A3B8] mb-8">Join 3,000+ creative souls. Tips, deals, and art stories every Sunday.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 h-11 px-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[rgba(124,92,255,0.4)] text-sm"
            />
            <Button variant="gradient" iconRight={<ArrowRight className="w-4 h-4" />}>
              Subscribe
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
