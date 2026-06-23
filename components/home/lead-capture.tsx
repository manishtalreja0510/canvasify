"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Upload, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/section-header";
import { useDropzone } from "react-dropzone";

export function LeadCapture() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !photo) return;
    setLoading(true);
    // Save to newsletter in background
    fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, name: form.name }),
    }).catch(() => {});
    // Simulate AI preview (in future: call /api/process)
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(124,92,255,0.04)] to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#00E5FF] flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">Your Preview Is On Its Way!</h3>
            <p className="text-[#94A3B8] mb-2">We&apos;re processing your photo and will send your free preview to <span className="text-white">{form.email}</span> within 5 minutes.</p>
            <p className="text-sm text-[#94A3B8]">Check your spam folder if you don&apos;t see it.</p>
          </motion.div>
        ) : (
          <>
            <SectionHeader
              badge="Free Preview"
              title="Get Your First Preview"
              highlight=" Free"
              description="Upload your photo now and we'll send you a free AI preview of your personalized paint-by-number template."
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-3xl p-8 md:p-10"
            >
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-5">
                  <Input
                    label="Your Name"
                    placeholder="Priya Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="hello@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />

                  <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                    <Lock className="w-3.5 h-3.5 text-[#00D084]" />
                    Your data is secure and never shared.
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    size="xl"
                    loading={loading}
                    iconRight={<ArrowRight className="w-5 h-5" />}
                    disabled={!form.name || !form.email || !photo}
                  >
                    Get My Free Preview
                  </Button>
                </div>

                <div
                  {...getRootProps()}
                  className={`rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 p-6 cursor-pointer transition-all duration-300 min-h-[200px] ${
                    isDragActive
                      ? "border-[#7C5CFF] bg-[rgba(124,92,255,0.08)]"
                      : photoPreview
                      ? "border-[rgba(0,208,132,0.4)] bg-[rgba(0,208,132,0.04)]"
                      : "border-[rgba(255,255,255,0.1)] hover:border-[rgba(124,92,255,0.4)]"
                  }`}
                >
                  <input {...getInputProps()} />
                  {photoPreview ? (
                    <div className="text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photoPreview} alt="Upload preview" className="w-full h-32 object-cover rounded-xl mb-3" />
                      <p className="text-sm text-[#00D084] font-medium">✓ Photo ready!</p>
                      <p className="text-xs text-[#94A3B8] mt-1">Click to change</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-[rgba(124,92,255,0.1)] border border-[rgba(124,92,255,0.2)] flex items-center justify-center">
                        <Upload className="w-5 h-5 text-[#7C5CFF]" />
                      </div>
                      <div className="text-center">
                        <p className="text-white text-sm font-medium">Upload Your Photo</p>
                        <p className="text-xs text-[#94A3B8] mt-1">
                          {isDragActive ? "Drop it here!" : "Drag & drop or click to browse"}
                        </p>
                        <p className="text-xs text-[#94A3B8] mt-1">JPG, PNG, HEIC • Max 25MB</p>
                      </div>
                    </>
                  )}
                </div>
              </form>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
