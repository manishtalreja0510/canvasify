"use client";

import React, { useState, useActionState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signUp } from "@/app/auth/actions";

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [state, action, pending] = useActionState(signUp, null);

  const passwordStrength = password.length >= 8
    ? password.match(/(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/)
      ? "strong"
      : "medium"
    : password.length > 0
    ? "weak"
    : null;

  if (state?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0D1323] border border-[rgba(0,208,132,0.3)] rounded-3xl p-10 max-w-md w-full text-center shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
        >
          <div className="w-16 h-16 rounded-2xl bg-[rgba(0,208,132,0.1)] border border-[rgba(0,208,132,0.2)] flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-[#00D084]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Check your email!</h2>
          <p className="text-[#94A3B8] mb-6">{state.success}</p>
          <Link href="/auth/login">
            <Button variant="gradient" className="w-full">Go to Sign In</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgba(124,92,255,0.08)] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[rgba(0,229,255,0.05)] rounded-full blur-3xl" />
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

          <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-[#94A3B8] text-sm mb-6">Start transforming memories into art today</p>

          <div className="bg-[rgba(124,92,255,0.06)] border border-[rgba(124,92,255,0.15)] rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-[#B48EFF] mb-2">✨ What you get for free:</p>
            {["Free preview of your photo", "Save and manage projects", "Order history & tracking", "Access to Creative Club"].map((b) => (
              <div key={b} className="flex items-center gap-2 text-xs text-[#94A3B8] mt-1.5">
                <Check className="w-3.5 h-3.5 text-[#00D084]" />
                {b}
              </div>
            ))}
          </div>

          {state?.error && (
            <div className="flex items-center gap-2.5 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3 mb-4">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-sm text-red-400">{state.error}</p>
            </div>
          )}

          <form action={action} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              name="name"
              placeholder="Priya Sharma"
              icon={<User className="w-4 h-4" />}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="hello@example.com"
              icon={<Mail className="w-4 h-4" />}
              required
            />
            <div>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                icon={<Lock className="w-4 h-4" />}
                iconRight={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordStrength && (
                <div className="flex items-center gap-2 mt-2">
                  {["weak", "medium", "strong"].map((s, i) => (
                    <div
                      key={s}
                      className="flex-1 h-1 rounded-full transition-colors"
                      style={{
                        background: i < ["weak", "medium", "strong"].indexOf(passwordStrength) + 1
                          ? passwordStrength === "strong" ? "#00D084"
                          : passwordStrength === "medium" ? "#F59E0B"
                          : "#EF4444"
                          : "rgba(255,255,255,0.1)",
                      }}
                    />
                  ))}
                  <span className="text-xs capitalize text-[#94A3B8]">{passwordStrength}</span>
                </div>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => setAgree(!agree)}
                className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                  agree ? "bg-[#7C5CFF] border-[#7C5CFF]" : "border-[rgba(255,255,255,0.2)]"
                }`}
              >
                {agree && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-xs text-[#94A3B8] leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-[#7C5CFF] hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-[#7C5CFF] hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              loading={pending}
              className="w-full"
              iconRight={<ArrowRight className="w-4 h-4" />}
              disabled={!agree}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-[#94A3B8] mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#7C5CFF] hover:text-[#B48EFF] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
