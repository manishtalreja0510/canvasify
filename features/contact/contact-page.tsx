"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, Building2, GraduationCap, HelpCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SITE_CONFIG } from "@/lib/constants";

const CONTACT_TYPES = [
  { value: "general", label: "General Inquiry", icon: MessageSquare },
  { value: "support", label: "Customer Support", icon: HelpCircle },
  { value: "corporate", label: "Corporate Orders", icon: Building2 },
  { value: "education", label: "School Program", icon: GraduationCap },
];

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", type: "general", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSent(true);
      toast.success("Message sent!", { description: "We'll get back to you within 24 hours." });
    } catch {
      toast.error("Failed to send", { description: "Please email us directly at hello@canvasify.art" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="badge-premium mb-4 inline-block">Contact</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            We&apos;d Love to{" "}
            <span className="gradient-text">Hear From You</span>
          </h1>
          <p className="text-xl text-[#94A3B8]">Our team typically responds within 2 hours during business hours.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            {[
              { icon: Mail, label: "Email", value: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
              { icon: Phone, label: "Phone", value: SITE_CONFIG.phone, href: `tel:${SITE_CONFIG.phone}` },
              { icon: MapPin, label: "Address", value: "MG Road, Bangalore\nKarnataka, India 560001", href: undefined },
              { icon: Clock, label: "Business Hours", value: "Mon-Fri: 9am – 6pm IST\nSat: 10am – 2pm IST", href: undefined },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-xl bg-[rgba(124,92,255,0.1)] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#7C5CFF]" />
                  </div>
                  <span className="text-sm font-semibold text-white">{label}</span>
                </div>
                {href ? (
                  <a href={href} className="text-sm text-[#94A3B8] hover:text-white transition-colors pl-12 block">
                    {value}
                  </a>
                ) : (
                  <p className="text-sm text-[#94A3B8] pl-12 whitespace-pre-line">{value}</p>
                )}
              </div>
            ))}

            <div className="bg-gradient-to-br from-[rgba(124,92,255,0.08)] to-[rgba(0,229,255,0.04)] border border-[rgba(124,92,255,0.2)] rounded-2xl p-5">
              <h4 className="text-white font-semibold mb-2">Corporate Inquiries</h4>
              <p className="text-sm text-[#94A3B8] mb-3">For bulk orders (10+ units) and enterprise partnerships:</p>
              <a href="mailto:corporate@canvasify.art" className="text-[#7C5CFF] text-sm hover:text-[#B48EFF] transition-colors">
                corporate@canvasify.art
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            {sent ? (
              <div className="bg-[#0D1323] border border-[rgba(0,208,132,0.3)] rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[rgba(0,208,132,0.1)] flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#00D084]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                <p className="text-[#94A3B8]">We&apos;ll get back to you at <span className="text-white">{form.email}</span> within 24 hours.</p>
                <Button variant="secondary" onClick={() => setSent(false)}>Send Another</Button>
              </div>
            ) : (
              <div className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Type selector */}
                  <div>
                    <label className="text-sm font-medium text-white/80 block mb-2">Type of Inquiry</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CONTACT_TYPES.map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setForm({ ...form, type: value })}
                          className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                            form.type === value
                              ? "border-[rgba(124,92,255,0.5)] bg-[rgba(124,92,255,0.08)] text-white"
                              : "border-[rgba(255,255,255,0.08)] text-[#94A3B8] hover:text-white"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  <Input
                    label="Subject"
                    placeholder="What's this about?"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-white/80">Message</label>
                    <textarea
                      rows={5}
                      placeholder="Tell us more..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[rgba(124,92,255,0.5)] resize-none transition-colors"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    loading={loading}
                    iconRight={<Send className="w-4 h-4" />}
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
