"use client";

import React, { useState, useActionState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/app/auth/actions";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";

  const [state, action, pending] = useActionState(signIn, null);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[rgba(124,92,255,0.08)] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-[rgba(0,229,255,0.05)] rounded-full blur-3xl" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-[#0D1323] border border-[rgba(255,255,255,0.08)] rounded-3xl p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Canvasify</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-[#94A3B8] text-sm mb-8">Sign in to access your projects and orders</p>

          {/* Social login */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              type="button"
              className="w-full h-11 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-white text-sm font-medium flex items-center justify-center gap-3 hover:bg-[rgba(255,255,255,0.07)] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
            <span className="text-xs text-[#94A3B8]">or</span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.08)]" />
          </div>

          {state?.error && (
            <div className="flex items-center gap-2.5 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-4 py-3 mb-4">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-sm text-red-400">{state.error}</p>
            </div>
          )}

          <form action={action} className="flex flex-col gap-4">
            <input type="hidden" name="redirect" value={redirect} />

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
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                iconRight={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />
              <div className="mt-1.5 text-right">
                <Link href="/auth/forgot-password" className="text-xs text-[#7C5CFF] hover:text-[#B48EFF] transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              loading={pending}
              className="w-full mt-2"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-[#94A3B8] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-[#7C5CFF] hover:text-[#B48EFF] font-medium transition-colors">
              Sign up free
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-4">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-white">Terms</Link>
          {" & "}
          <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  );
}
