"use client";

import React, { useActionState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { resetPassword } from "@/app/auth/actions";

export function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(resetPassword, null);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[rgba(124,92,255,0.07)] rounded-full blur-3xl" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-[#0D1323] border border-[rgba(255,255,255,0.08)] rounded-3xl p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Canvasify</span>
          </div>

          {state?.success ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-[rgba(0,208,132,0.1)] border border-[rgba(0,208,132,0.2)] flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-[#00D084]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
              <p className="text-[#94A3B8] text-sm mb-6">{state.success}</p>
              <Link href="/auth/login">
                <Button variant="glass" icon={<ArrowLeft className="w-4 h-4" />} className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-1">Reset password</h1>
              <p className="text-[#94A3B8] text-sm mb-8">Enter your email and we&apos;ll send a reset link.</p>

              {state?.error && (
                <div className="flex items-center gap-2.5 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3 mb-4">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-sm text-red-400">{state.error}</p>
                </div>
              )}

              <form action={action} className="flex flex-col gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="hello@example.com"
                  icon={<Mail className="w-4 h-4" />}
                  required
                />
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  loading={pending}
                  className="w-full"
                  iconRight={<ArrowRight className="w-4 h-4" />}
                >
                  Send Reset Link
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/auth/login" className="text-sm text-[#94A3B8] hover:text-white flex items-center justify-center gap-1 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
