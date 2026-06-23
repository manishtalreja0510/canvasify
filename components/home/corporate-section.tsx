"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, GraduationCap, Users, Gift, ArrowRight, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import Link from "next/link";

const CORPORATE_FEATURES = [
  {
    icon: Gift,
    title: "Corporate Gifting",
    description: "Personalized art kits make the most memorable employee gifts, client appreciation, and milestone rewards.",
    stats: "50+ units • Custom packaging • Bulk pricing",
  },
  {
    icon: Users,
    title: "Team Workshops",
    description: "Host creative paint sessions for team building. Perfect for employee wellness programs and company events.",
    stats: "Virtual & in-person • HR-friendly • All skill levels",
  },
  {
    icon: Building2,
    title: "Office Decor",
    description: "Commission custom artwork for your office, reception, conference rooms, or client spaces.",
    stats: "Custom sizes • Brand colors • Professional finish",
  },
];

const SCHOOL_FEATURES = [
  {
    icon: GraduationCap,
    title: "Art Education",
    description: "Curriculum-aligned paint kits that teach color theory, patience, and fine motor skills.",
  },
  {
    icon: Gift,
    title: "School Events",
    description: "Perfect for art days, fundraisers, talent shows, and cultural fairs.",
  },
];

export function CorporateSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Corporate */}
        <div className="mb-20">
          <SectionHeader
            badge="Enterprise"
            title="Built for "
            highlight="Teams & Businesses"
            description="Join 200+ companies using Canvasify for employee gifts, team workshops, and client appreciation."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {CORPORATE_FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6 hover:border-[rgba(124,92,255,0.2)] transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[rgba(124,92,255,0.1)] border border-[rgba(124,92,255,0.2)] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#7C5CFF]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">{f.description}</p>
                  <div className="text-xs text-[#7C5CFF] font-medium bg-[rgba(124,92,255,0.08)] rounded-xl px-3 py-2">
                    {f.stats}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gradient-to-r from-[rgba(124,92,255,0.08)] to-[rgba(0,229,255,0.05)] border border-[rgba(124,92,255,0.2)] rounded-2xl p-6"
          >
            <div>
              <h4 className="text-white font-bold mb-1">Custom enterprise pricing available</h4>
              <p className="text-sm text-[#94A3B8]">10+ units. Dedicated account manager. Priority support.</p>
            </div>
            <Link href="/contact?type=corporate">
              <Button variant="primary" iconRight={<CalendarCheck className="w-4 h-4" />}>
                Book a Demo
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Schools */}
        <div className="rounded-3xl bg-gradient-to-br from-[rgba(0,208,132,0.06)] to-[rgba(124,92,255,0.06)] border border-[rgba(0,208,132,0.15)] p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="badge-premium mb-4 block w-fit">For Schools</span>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Inspiring the Next Generation of Artists
              </h3>
              <p className="text-[#94A3B8] mb-6 leading-relaxed">
                Educational art kits designed for classrooms. Curriculum-aligned, budget-friendly, and genuinely exciting for students of all ages.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {SCHOOL_FEATURES.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex flex-col gap-2">
                    <div className="w-9 h-9 rounded-xl bg-[rgba(0,208,132,0.1)] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#00D084]" />
                    </div>
                    <h5 className="font-semibold text-white text-sm">{title}</h5>
                    <p className="text-xs text-[#94A3B8]">{description}</p>
                  </div>
                ))}
              </div>
              <Link href="/education">
                <Button variant="secondary" iconRight={<ArrowRight className="w-4 h-4" />}>
                  Learn About School Programs
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: "🎨", label: "Art classes", count: "500+" },
                { emoji: "👧", label: "Students served", count: "12,000+" },
                { emoji: "📚", label: "Schools", count: "80+" },
                { emoji: "⭐", label: "Teacher rating", count: "4.9/5" },
              ].map(({ emoji, label, count }) => (
                <div key={label} className="bg-[rgba(0,0,0,0.2)] rounded-2xl p-5 text-center">
                  <div className="text-4xl mb-2">{emoji}</div>
                  <div className="text-2xl font-bold text-white mb-1">{count}</div>
                  <div className="text-xs text-[#94A3B8]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
