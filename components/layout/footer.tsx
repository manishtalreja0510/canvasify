"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles,
  MapPin, Mail, Phone, Heart, Share2, PlayCircle, Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SITE_CONFIG } from "@/lib/constants";

const footerLinks = {
  Products: [
    { label: "Digital Download", href: "/products/digital" },
    { label: "Canvas Kit", href: "/products/canvas-kit" },
    { label: "Framed Artwork", href: "/products/framed" },
    { label: "Creative Club", href: "/products/subscription" },
    { label: "Corporate Gifts", href: "/corporate" },
    { label: "Schools & Education", href: "/education" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Gallery", href: "/gallery" },
    { label: "Pricing", href: "/pricing" },
    { label: "Careers", href: "/careers" },
    { label: "Press Kit", href: "/press" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Track Order", href: "/track-order" },
    { label: "Returns & Refunds", href: "/refund-policy" },
    { label: "Shipping Info", href: "/shipping" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Copyright", href: "/copyright" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch { /* fail silently */ }
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="relative border-t border-[rgba(255,255,255,0.06)] bg-[#060816] overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[rgba(124,92,255,0.06)] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[rgba(0,229,255,0.04)] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">Canvasify</div>
                <div className="text-[10px] text-[#94A3B8] uppercase tracking-widest">Turn Memories Into Art</div>
              </div>
            </Link>

            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-xs">
              Transform your precious memories into personalized paint-by-number masterpieces using AI.
              Join 5,000+ customers worldwide who've turned their photos into art.
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-2.5 text-sm text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#7C5CFF] shrink-0" />
                <span>Bangalore, India 560001</span>
              </div>
              <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-[#7C5CFF] shrink-0" />
                <span>{SITE_CONFIG.email}</span>
              </a>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#7C5CFF] shrink-0" />
                <span>{SITE_CONFIG.phone}</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { icon: Camera, href: SITE_CONFIG.social.instagram, label: "Instagram" },
                { icon: Share2, href: SITE_CONFIG.social.twitter, label: "Twitter" },
                { icon: PlayCircle, href: SITE_CONFIG.social.youtube, label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#94A3B8] hover:text-white hover:border-[rgba(124,92,255,0.3)] hover:bg-[rgba(124,92,255,0.08)] transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold text-white">{category}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#94A3B8] hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter section */}
        <div className="py-8 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold mb-1">Get art inspiration in your inbox</h4>
              <p className="text-sm text-[#94A3B8]">Join 3,000+ subscribers. Unsubscribe anytime.</p>
            </div>
            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-[#00D084] font-medium"
              >
                <div className="w-5 h-5 rounded-full bg-[#00D084] flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                You're subscribed!
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full md:w-64"
                  required
                />
                <Button type="submit" variant="primary" size="md" iconRight={<ArrowRight className="w-4 h-4" />}>
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <p>
            © {new Date().getFullYear()} Canvasify. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in India
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
