"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Target, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROADMAP } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const TEAM = [
  { name: "Aarav Sharma", role: "CEO & Co-Founder", bio: "Former product lead at Flipkart. Passionate about art and democratizing creativity.", avatar: "AS", linkedin: "#" },
  { name: "Preethi Nair", role: "CTO & Co-Founder", bio: "PhD in Computer Vision from IIT Bombay. Built AI systems at Google Brain.", avatar: "PN", linkedin: "#" },
  { name: "Rohan Kapoor", role: "Head of Design", bio: "Award-winning product designer. Previously at Razorpay and Zomato.", avatar: "RK", linkedin: "#" },
  { name: "Divya Mehta", role: "Head of Operations", bio: "Supply chain expert with 10 years in manufacturing and D2C logistics.", avatar: "DM", linkedin: "#" },
];

const VALUES = [
  { icon: Heart, title: "Memory First", description: "Every product decision starts with one question: does this create more meaning for the customer?" },
  { icon: Sparkles, title: "AI for Good", description: "Technology should amplify human creativity, not replace it. We build tools that empower, not commodify." },
  { icon: Target, title: "Quality Obsession", description: "From canvas thread count to paint viscosity — we obsess over every detail so our customers don't have to." },
  { icon: Zap, title: "Relentless Speed", description: "We ship weekly. Feedback becomes features. Ideas become products. We move at startup speed, deliver at enterprise quality." },
];

export function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24 max-w-4xl mx-auto"
        >
          <span className="badge-premium mb-6 inline-block">Our Story</span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            We Believe Every Memory
            <br />
            <span className="gradient-text">Deserves to be Art</span>
          </h1>
          <p className="text-xl text-[#94A3B8] leading-relaxed">
            Canvasify was born in 2024 when our founder Aarav tried to find a personalized paint-by-number kit of his wedding day — and couldn&apos;t. So he built one. Then 5,000 more.
          </p>
        </motion.div>

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold text-white mb-6">The Problem We Saw</h2>
            <div className="space-y-4 text-[#94A3B8] leading-relaxed">
              <p>
                Walk into any craft store and you&apos;ll find paint-by-number kits of generic sunflowers, random seascapes, and stock photo landscapes. Beautiful, maybe. Meaningful? Not at all.
              </p>
              <p>
                Meanwhile, everyone carries 10,000+ photos on their phones — moments of pure emotion. Weddings. The last walk with a dog. A grandparent&apos;s smile. The house where you grew up.
              </p>
              <p>
                These memories sit locked in a phone gallery, slowly fading in importance. We believed they deserved better. They deserved to become <strong className="text-white">art</strong>.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-br from-[rgba(124,92,255,0.1)] to-[rgba(0,229,255,0.05)] border border-[rgba(124,92,255,0.2)] p-8 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 w-32 h-32 bg-[rgba(124,92,255,0.1)] rounded-full blur-2xl" />
            <div className="relative">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-[#94A3B8] mb-6">
                Enable anyone in the world to transform memories into personalized creative experiences using AI.
              </p>
              <div className="pt-4 border-t border-[rgba(255,255,255,0.08)]">
                <div className="text-6xl font-bold text-white mb-1 gradient-text">5,000+</div>
                <div className="text-[#94A3B8]">memories transformed since launch</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <span className="badge-premium mb-4 inline-block">Values</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgba(124,92,255,0.2)] to-[rgba(0,229,255,0.1)] flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#B48EFF]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-[#94A3B8] leading-relaxed">{v.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Team */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <span className="badge-premium mb-4 inline-block">Team</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">The People Behind the Art</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 text-center group hover:border-[rgba(124,92,255,0.3)] transition-colors"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                  {member.avatar}
                </div>
                <h4 className="text-lg font-bold text-white mb-1">{member.name}</h4>
                <p className="text-sm text-[#7C5CFF] mb-3">{member.role}</p>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <span className="badge-premium mb-4 inline-block">Roadmap</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">What&apos;s Coming Next</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROADMAP.map((item, i) => (
              <motion.div
                key={item.quarter}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border p-6 ${
                  item.status === "live"
                    ? "border-[rgba(0,208,132,0.3)] bg-[rgba(0,208,132,0.05)]"
                    : item.status === "in_progress"
                    ? "border-[rgba(124,92,255,0.3)] bg-[rgba(124,92,255,0.05)]"
                    : "border-[rgba(255,255,255,0.07)] bg-[#0D1323]"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-[#94A3B8]">{item.quarter}</span>
                  <Badge
                    variant={item.status === "live" ? "success" : item.status === "in_progress" ? "default" : "muted"}
                    className="text-[10px] py-0.5"
                  >
                    {item.status === "live" ? "Live" : item.status === "in_progress" ? "In Progress" : "Planned"}
                  </Badge>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-sm text-[#94A3B8]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-br from-[rgba(124,92,255,0.1)] to-[rgba(0,229,255,0.05)] border border-[rgba(124,92,255,0.2)] rounded-3xl p-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform a Memory?</h2>
          <p className="text-[#94A3B8] mb-8 text-lg">Join 5,000+ people who&apos;ve turned their photos into art.</p>
          <Link href="/create">
            <Button variant="gradient" size="xl" iconRight={<ArrowRight className="w-5 h-5" />}>
              Start Creating Free
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
