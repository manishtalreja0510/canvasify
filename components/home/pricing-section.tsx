"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { PRODUCTS, SUBSCRIPTION } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

const PRODUCT_ICONS = [Zap, Star, Crown];

export function PricingSection() {
  const [billing, setBilling] = useState<"one_time" | "subscription">("one_time");

  return (
    <section className="py-24 relative overflow-hidden" id="pricing">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[rgba(124,92,255,0.05)] rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Simple Pricing"
          title="Transparent Pricing,"
          highlight=" No Surprises"
          description="Start free, pay only when you're in love with your preview. Every plan includes our satisfaction guarantee."
        />

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center mt-8 mb-12"
        >
          <div className="flex items-center bg-[#0D1323] border border-[rgba(255,255,255,0.08)] rounded-xl p-1 gap-1">
            <button
              onClick={() => setBilling("one_time")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                billing === "one_time"
                  ? "bg-[#7C5CFF] text-white shadow-[0_0_20px_rgba(124,92,255,0.3)]"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              One-time
            </button>
            <button
              onClick={() => setBilling("subscription")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                billing === "subscription"
                  ? "bg-[#7C5CFF] text-white shadow-[0_0_20px_rgba(124,92,255,0.3)]"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              Subscription
              <span className="text-xs bg-[#00D084] text-[#060816] px-1.5 py-0.5 rounded font-bold">SAVE 30%</span>
            </button>
          </div>
        </motion.div>

        {billing === "one_time" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCTS.map((product, i) => {
              const Icon = PRODUCT_ICONS[i];
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative rounded-2xl border p-6 flex flex-col ${
                    product.popular
                      ? "border-[rgba(124,92,255,0.4)] bg-gradient-to-b from-[rgba(124,92,255,0.08)] to-[#0D1323] shadow-[0_0_60px_rgba(124,92,255,0.15)]"
                      : "border-[rgba(255,255,255,0.07)] bg-[#0D1323]"
                  }`}
                >
                  {product.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="new" className="shadow-[0_0_20px_rgba(124,92,255,0.4)]">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    product.popular
                      ? "bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] shadow-[0_0_20px_rgba(124,92,255,0.4)]"
                      : "bg-[rgba(124,92,255,0.1)] border border-[rgba(124,92,255,0.2)]"
                  }`}>
                    <Icon className={`w-5 h-5 ${product.popular ? "text-white" : "text-[#7C5CFF]"}`} />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-sm text-[#94A3B8] mb-6 leading-relaxed">{product.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">
                        {formatCurrency(product.price, product.currency)}
                      </span>
                      <span className="text-[#94A3B8] text-sm">one-time</span>
                    </div>
                  </div>

                  <ul className="flex flex-col gap-3 mb-8 flex-1">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-[#94A3B8]">
                        <Check className="w-4 h-4 text-[#00D084] shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/create">
                    <Button
                      variant={product.popular ? "gradient" : "secondary"}
                      size="lg"
                      className="w-full"
                    >
                      {product.cta}
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto"
          >
            <div className="rounded-2xl border border-[rgba(124,92,255,0.4)] bg-gradient-to-b from-[rgba(124,92,255,0.1)] to-[#0D1323] p-8 shadow-[0_0_80px_rgba(124,92,255,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[rgba(124,92,255,0.1)] rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{SUBSCRIPTION.name}</h3>
                    <p className="text-sm text-[#94A3B8]">{SUBSCRIPTION.description}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-white">
                      {formatCurrency(SUBSCRIPTION.price, "INR")}
                    </span>
                    <span className="text-[#94A3B8]">/month</span>
                  </div>
                  <p className="text-sm text-[#00D084] mt-1">Cancel anytime • No commitment</p>
                </div>

                <ul className="grid grid-cols-2 gap-3 mb-8">
                  {SUBSCRIPTION.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#94A3B8]">
                      <Check className="w-4 h-4 text-[#00D084] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/create?plan=subscription">
                  <Button variant="gradient" size="xl" className="w-full">
                    Start Creative Club
                  </Button>
                </Link>

                <p className="text-center text-xs text-[#94A3B8] mt-4">
                  First month free for new members • Cancel anytime
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-[rgba(0,208,132,0.08)] border border-[rgba(0,208,132,0.2)] rounded-2xl px-6 py-4">
            <div className="w-10 h-10 rounded-xl bg-[rgba(0,208,132,0.15)] flex items-center justify-center">
              <Check className="w-5 h-5 text-[#00D084]" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">100% Satisfaction Guarantee</p>
              <p className="text-sm text-[#94A3B8]">Love your artwork or we'll redo it for free. No questions asked.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
