"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, ArrowLeft, Tag, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BLOG_POSTS } from "@/lib/constants";
import type { BlogPost } from "@/types";
import Link from "next/link";

const SAMPLE_CONTENT = `
Paint-by-number kits have been around since the 1950s, but something remarkable is happening in 2025: they've evolved from children's toys into sophisticated wellness tools embraced by adults seeking creative respite from screen-heavy modern life.

## The Science of Flow States

Psychologist Mihaly Csikszentmihalyi coined the term "flow" to describe the deeply satisfying mental state of complete absorption in a challenging task. Paint-by-number, it turns out, is almost perfectly engineered to produce this state.

The activity is structured enough to provide clear guidance (this area gets color 5) but open enough to demand focus and fine motor control. The result: your brain quiets the noise and enters a state of calm, focused creativity.

**Research shows that creative activities like painting:**
- Reduce cortisol (stress hormone) levels by up to 75%
- Improve mood and emotional regulation
- Enhance fine motor skills and hand-eye coordination
- Provide a sense of accomplishment and completion

## Why Personalization Matters

The traditional paint-by-number suffered one fatal flaw: the images were generic. You'd paint a lighthouse you'd never seen or flowers you didn't care about. Completion felt hollow because the finished piece meant nothing personal.

Personalized paint-by-number changes this fundamentally. When you're painting your dog Max, or your wedding day in Goa, or your grandmother's house — every brushstroke carries emotional weight. The therapeutic benefit multiplies because you're not just completing a task; you're literally recreating a cherished memory with your own hands.

## Getting Started

Whether you're new to painting or returning after years away, personalized paint-by-number offers a gentle, forgiving entry point. Here's what makes it accessible:

1. **No talent required** — The numbered system does the compositional work. You provide the patience.
2. **Start small** — Begin with a 12-color palette before moving to 24 or 36.
3. **Light-to-dark** — Always paint lighter colors first to avoid muddying the palette.
4. **Take your time** — A 40x50cm canvas typically takes 10-20 hours spread over 1-2 weeks.

The finished piece will surprise you. Not because it's perfect — it won't be, and that's part of the beauty — but because it will look far better than you expected from a "beginner."

## The Mindfulness Connection

Painting connects to mindfulness in powerful ways. The focus required to stay within the lines, the deliberate pace of dipping a brush and applying paint, the visual feedback of watching an image emerge — these all create natural mindfulness without requiring any meditation experience.

Many of our customers report painting sessions as their "unplugged time" — no phones, no notifications, just paint and memory.
`;

export function BlogPostPage({ post }: { post: BlogPost }) {
  const related = BLOG_POSTS.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3);

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/blog">
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Blog
            </Button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="default">{post.category}</Badge>
            <div className="flex items-center gap-1 text-sm text-[#94A3B8]">
              <Clock className="w-4 h-4" />
              {post.read_time} min read
            </div>
            <time className="text-sm text-[#94A3B8]">{post.published_at}</time>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-xl text-[#94A3B8] leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Author */}
          <div className="flex items-center justify-between pb-6 border-b border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center text-lg font-bold text-white">
                {post.author.avatar}
              </div>
              <div>
                <p className="font-semibold text-white">{post.author.name}</p>
                <p className="text-sm text-[#94A3B8]">{post.author.role}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </motion.div>

        {/* Cover image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl bg-gradient-to-br from-[rgba(124,92,255,0.15)] to-[rgba(0,229,255,0.08)] aspect-video flex items-center justify-center mb-12 overflow-hidden"
        >
          <span className="text-8xl">
            {post.category === "Wellness" ? "🧘" :
             post.category === "Tips & Tricks" ? "🎨" :
             post.category === "Gift Ideas" ? "🎁" :
             post.category === "Technology" ? "🤖" : "💼"}
          </span>
        </motion.div>

        {/* Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert max-w-none mb-12"
          style={{ color: "#94A3B8", lineHeight: "1.8" }}
        >
          {SAMPLE_CONTENT.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4">
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
              return (
                <p key={i} className="font-semibold text-white mb-4">
                  {paragraph.replace(/\*\*/g, "")}
                </p>
              );
            }
            if (paragraph.startsWith("1.") || paragraph.startsWith("-")) {
              const items = paragraph.split("\n").filter(Boolean);
              return (
                <ul key={i} className="mb-6 space-y-2 pl-4">
                  {items.map((item, j) => (
                    <li key={j} className="text-[#94A3B8]">
                      {item.replace(/^[0-9]+\.\s/, "").replace(/^-\s/, "").replace(/\*\*(.*?)\*\*/g, "$1")}
                    </li>
                  ))}
                </ul>
              );
            }
            return paragraph.trim() ? (
              <p key={i} className="mb-6 text-[#94A3B8] leading-relaxed">
                {paragraph.trim()}
              </p>
            ) : null;
          })}
        </motion.article>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pb-8 border-b border-[rgba(255,255,255,0.08)] mb-12">
          {post.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-sm bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl px-3 py-1.5 text-[#94A3B8] hover:text-white transition-colors cursor-pointer">
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[rgba(124,92,255,0.1)] to-[rgba(0,229,255,0.05)] border border-[rgba(124,92,255,0.2)] rounded-3xl p-8 mb-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Transform Your Own Memory</h3>
          <p className="text-[#94A3B8] mb-6">Try Canvasify free. Upload your photo and get a preview in under 5 minutes.</p>
          <Link href="/create">
            <Button variant="gradient" size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
              Create My Artwork
            </Button>
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`}>
                  <div className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 hover:border-[rgba(124,92,255,0.3)] transition-colors group">
                    <Badge variant="muted" className="mb-3 text-[10px]">{p.category}</Badge>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#B48EFF] transition-colors leading-tight">
                      {p.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-[#94A3B8] mt-3">
                      <Clock className="w-3 h-3" />
                      {p.read_time} min read
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
