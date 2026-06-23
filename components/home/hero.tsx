"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Play, ArrowRight, Star, CheckCircle2, Sparkles, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import Link from "next/link";

const METRICS = [
  { value: "10,000+", label: "Templates Created" },
  { value: "5,000+", label: "Happy Customers" },
  { value: "98%", label: "Satisfaction Rate" },
];

type ProcessingStage = "idle" | "uploading" | "processing" | "preview";

const STAGE_LABELS: Record<ProcessingStage, string> = {
  idle: "Drop your photo here",
  uploading: "Uploading...",
  processing: "AI Processing...",
  preview: "Your masterpiece is ready!",
};

export function Hero() {
  const [stage, setStage] = useState<ProcessingStage>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setStage("uploading");

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setStage("processing");
        timeoutRef.current = setTimeout(() => {
          setStage("preview");
        }, 2500);
      }, 1000);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic"] },
    maxFiles: 1,
    maxSize: 25 * 1024 * 1024,
  });

  const resetDemo = () => {
    setStage("idle");
    setPreview(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Background elements */}
      <div className="absolute inset-0 dot-pattern opacity-40" />
      <div className="absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#7C5CFF] rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#00E5FF] rounded-full blur-[120px]"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <Badge variant="default" className="gap-1.5 py-1.5">
                <Sparkles className="w-3 h-3" />
                AI-Powered Art Creation
              </Badge>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700]" />
                ))}
                <span className="text-xs text-[#94A3B8] ml-1">5.0 (2,400+ reviews)</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
                Turn Any Photo Into A{" "}
                <span className="gradient-text">Stunning Masterpiece</span>
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-[#94A3B8] leading-relaxed max-w-lg"
            >
              Upload your favorite memory and let AI transform it into a beautiful personalized{" "}
              <span className="text-white font-medium">paint-by-number experience</span>{" "}
              you&apos;ll treasure forever.
            </motion.p>

            {/* Trust points */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 text-sm text-[#94A3B8]"
            >
              {[
                { icon: Zap, text: "Results in under 5 minutes" },
                { icon: Shield, text: "100% satisfaction guarantee" },
                { icon: CheckCircle2, text: "Free preview before purchase" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#00D084] shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link href="/create">
                <Button variant="gradient" size="xl" magnetic iconRight={<ArrowRight className="w-5 h-5" />}>
                  Create My Artwork
                </Button>
              </Link>
              <Button
                variant="glass"
                size="xl"
                icon={<Play className="w-5 h-5 text-[#7C5CFF]" />}
                onClick={() => setShowDemo(true)}
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-3 gap-4 pt-4 border-t border-[rgba(255,255,255,0.06)]"
            >
              {METRICS.map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-2xl font-bold text-white">{value}</span>
                  <span className="text-xs text-[#94A3B8]">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Interactive Upload Demo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            {/* Main upload card */}
            <div className="relative rounded-3xl bg-[#0D1323] border border-[rgba(255,255,255,0.08)] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
              {/* Header */}
              <div className="flex items-center gap-2 p-4 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-[#94A3B8] font-medium">
                    {STAGE_LABELS[stage]}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {stage === "idle" && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div
                        {...getRootProps()}
                        className={`h-72 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 ${
                          isDragActive
                            ? "border-[#7C5CFF] bg-[rgba(124,92,255,0.08)]"
                            : "border-[rgba(255,255,255,0.1)] hover:border-[rgba(124,92,255,0.4)] hover:bg-[rgba(124,92,255,0.05)]"
                        }`}
                      >
                      <input {...getInputProps()} />
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C5CFF]/20 to-[#B48EFF]/10 border border-[rgba(124,92,255,0.2)] flex items-center justify-center">
                        <Upload className="w-7 h-7 text-[#7C5CFF]" />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-semibold mb-1">
                          {isDragActive ? "Drop it here!" : "Drop your photo here"}
                        </p>
                        <p className="text-sm text-[#94A3B8]">or click to browse</p>
                        <p className="text-xs text-[#94A3B8] mt-2">JPG, PNG, HEIC • Max 25MB</p>
                      </div>

                      {/* Category chips */}
                      <div className="flex flex-wrap justify-center gap-2 mt-2">
                        {["Weddings", "Pets", "Family", "Travel", "Homes"].map((cat) => (
                          <span key={cat} className="text-xs px-3 py-1 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-[#94A3B8]">
                            {cat}
                          </span>
                        ))}
                      </div>
                      </div>
                    </motion.div>
                  )}

                  {stage === "uploading" && preview && (
                    <motion.div
                      key="uploading"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-72 rounded-2xl overflow-hidden relative"
                    >
                      <Image src={preview} alt="Upload" fill className="object-cover" />
                      <div className="absolute inset-0 bg-[rgba(6,8,22,0.6)] flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-[#7C5CFF] border-t-transparent animate-spin" />
                        <p className="text-white font-medium">Uploading your photo...</p>
                        <div className="w-48 h-1.5 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1 }}
                            className="h-full bg-[#7C5CFF] rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {stage === "processing" && preview && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-72 relative"
                    >
                      <div className="grid grid-cols-2 h-full gap-2">
                        <div className="relative rounded-xl overflow-hidden">
                          <Image src={preview} alt="Original" fill className="object-cover" />
                          <div className="absolute bottom-2 left-2 text-xs bg-[rgba(0,0,0,0.7)] text-white px-2 py-0.5 rounded-full">Original</div>
                        </div>
                        <div className="relative rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
                          <div className="flex flex-col items-center gap-3">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles className="w-8 h-8 text-[#7C5CFF]" />
                            </motion.div>
                            <p className="text-xs text-[#94A3B8] text-center px-4">AI analyzing your photo...</p>
                            {["Segmenting", "Color mapping", "Generating palette"].map((step, i) => (
                              <motion.div
                                key={step}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.6 }}
                                className="flex items-center gap-1.5 text-xs text-[#94A3B8]"
                              >
                                <CheckCircle2 className="w-3 h-3 text-[#00D084]" />
                                {step}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {stage === "preview" && preview && (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-72 relative"
                    >
                      {/* Paint-by-number mockup overlay */}
                      <div className="relative h-full rounded-2xl overflow-hidden">
                        <Image src={preview} alt="Preview" fill className="object-cover" style={{ filter: "saturate(0.3) contrast(1.1)" }} />
                        {/* Grid overlay to simulate paint-by-number */}
                        <div className="absolute inset-0"
                          style={{
                            backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 20px)`,
                          }}
                        />
                        {/* Number dots */}
                        {[
                          { top: "20%", left: "30%", num: "1" },
                          { top: "45%", left: "60%", num: "5" },
                          { top: "65%", left: "25%", num: "3" },
                          { top: "30%", left: "70%", num: "2" },
                          { top: "75%", left: "55%", num: "7" },
                        ].map(({ top, left, num }) => (
                          <div key={num} className="absolute w-5 h-5 rounded-full bg-white text-[#060816] text-[10px] font-bold flex items-center justify-center shadow-sm" style={{ top, left }}>
                            {num}
                          </div>
                        ))}
                        <div className="absolute top-2 left-2 text-xs bg-[rgba(0,0,0,0.7)] text-white px-2 py-0.5 rounded-full">
                          Paint-By-Number Preview
                        </div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute bottom-3 left-3 right-3 flex items-center justify-between"
                        >
                          <span className="text-xs text-[#00D084] flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Ready to order!
                          </span>
                          <button onClick={resetDemo} className="text-xs text-[#94A3B8] hover:text-white">
                            Try another
                          </button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Color palette preview */}
                {stage === "preview" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 flex items-center gap-3"
                  >
                    <span className="text-xs text-[#94A3B8]">Color palette:</span>
                    <div className="flex gap-1.5">
                      {["#4A90D9", "#E8D5B7", "#2C5F2E", "#8B4513", "#F5F5DC", "#1A1A2E", "#D4A017"].map((color) => (
                        <div key={color} className="w-5 h-5 rounded-full border border-[rgba(255,255,255,0.1)]" style={{ background: color }} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* CTA row */}
              <div className="px-6 pb-6">
                {stage === "preview" ? (
                  <Link href="/create">
                    <Button variant="gradient" size="lg" className="w-full" iconRight={<ArrowRight className="w-4 h-4" />}>
                      Order Your Kit — From ₹499
                    </Button>
                  </Link>
                ) : (
                  <div className="flex items-center justify-center gap-4 text-xs text-[#94A3B8]">
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-[#00D084]" /> Secure upload</span>
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-[#7C5CFF]" /> Results in minutes</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-[#00D084]" /> Free preview</span>
                  </div>
                )}
              </div>
            </div>

            {/* Floating cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-[#0D1323] border border-[rgba(255,255,255,0.1)] rounded-2xl p-3 shadow-xl backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">4.9/5 Rating</p>
                  <p className="text-[10px] text-[#94A3B8]">2,400+ reviews</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-6 bg-[#0D1323] border border-[rgba(255,255,255,0.1)] rounded-2xl p-3 shadow-xl backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[rgba(0,208,132,0.15)] border border-[rgba(0,208,132,0.2)] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-[#00D084]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Order Completed</p>
                  <p className="text-[10px] text-[#94A3B8]">Priya S. • 2 mins ago</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Video Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDemo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0D1323] rounded-3xl p-8 max-w-2xl w-full border border-[rgba(255,255,255,0.1)] text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center mx-auto mb-6">
                <Play className="w-10 h-10 text-white ml-1" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Demo Video Coming Soon</h3>
              <p className="text-[#94A3B8] mb-6">Try the interactive demo above by uploading your own photo to see the AI transformation in real-time!</p>
              <Button variant="primary" onClick={() => setShowDemo(false)}>Close</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
