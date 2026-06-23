"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Sparkles, Zap, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userDropdown, setUserDropdown] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const { user, loading: authLoading } = useSession();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const initials = user?.email
    ? user.user_metadata?.full_name
      ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
      : user.email.slice(0, 2).toUpperCase()
    : "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-[rgba(6,8,22,0.85)] backdrop-blur-2xl border-b border-[rgba(255,255,255,0.06)] shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-transparent"
        )}
      >
        {/* Announcement bar */}
        <div className="bg-gradient-to-r from-[#7C5CFF]/20 via-[#7C5CFF]/10 to-[#00E5FF]/20 border-b border-[rgba(124,92,255,0.2)] py-2 px-4 text-center">
          <p className="text-xs font-medium text-[#B48EFF] flex items-center justify-center gap-2">
            <Zap className="w-3 h-3 text-[#00E5FF]" />
            Limited Time: Get 40% off your first Canvas Kit with code{" "}
            <span className="text-white font-bold bg-[rgba(124,92,255,0.2)] px-2 py-0.5 rounded">CANVAS40</span>
            <Zap className="w-3 h-3 text-[#00E5FF]" />
          </p>
        </div>

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" ref={dropdownRef}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center shadow-[0_0_20px_rgba(124,92,255,0.4)] group-hover:shadow-[0_0_30px_rgba(124,92,255,0.6)] transition-shadow duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight">Canvasify</span>
              <div className="text-[9px] text-[#94A3B8] leading-none tracking-wider uppercase -mt-0.5">Turn Memories Into Art</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      activeDropdown === item.label
                        ? "text-white bg-[rgba(124,92,255,0.1)]"
                        : "text-[#94A3B8] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200",
                        activeDropdown === item.label && "rotate-180"
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      pathname === item.href
                        ? "text-white bg-[rgba(124,92,255,0.1)]"
                        : "text-[#94A3B8] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
                    )}
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown */}
                <AnimatePresence>
                  {item.children && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute top-full left-0 mt-2 w-52 rounded-2xl bg-[#0D1323] border border-[rgba(255,255,255,0.08)] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
                    >
                      <div className="p-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-[#94A3B8] hover:text-white hover:bg-[rgba(124,92,255,0.08)] transition-all duration-200 group"
                          >
                            <span>{child.label}</span>
                            {child.badge && (
                              <span className="text-[9px] font-bold bg-gradient-to-r from-[#7C5CFF] to-[#00E5FF] text-white px-2 py-0.5 rounded-full">
                                {child.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.06)] animate-pulse" />
            ) : user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-[rgba(124,92,255,0.1)] border border-[rgba(124,92,255,0.2)] hover:border-[rgba(124,92,255,0.4)] transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center text-[11px] font-bold text-white">
                    {initials}
                  </div>
                  <span className="text-sm text-white max-w-[120px] truncate">
                    {user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-[#94A3B8] transition-transform", userDropdown && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {userDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-44 rounded-2xl bg-[#0D1323] border border-[rgba(255,255,255,0.08)] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                    >
                      <div className="p-1.5">
                        <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#94A3B8] hover:text-white hover:bg-[rgba(124,92,255,0.08)] transition-all">
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#94A3B8] hover:text-red-400 hover:bg-[rgba(239,68,68,0.05)] transition-all"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/create">
                  <Button variant="gradient" size="sm" className="font-bold">
                    Start Creating
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-40 bg-[#060816] overflow-y-auto lg:hidden pt-32"
          >
            <div className="px-6 pb-8 flex flex-col gap-2">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  {item.children ? (
                    <div>
                      <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider px-3 mb-2 mt-4">
                        {item.label}
                      </p>
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="flex items-center justify-between px-3 py-3 rounded-xl text-white hover:bg-[rgba(124,92,255,0.08)] transition-colors"
                        >
                          {child.label}
                          {child.badge && (
                            <span className="text-[9px] font-bold bg-[#7C5CFF] text-white px-2 py-0.5 rounded-full">
                              {child.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "block px-3 py-3 rounded-xl text-lg font-medium transition-colors",
                        pathname === item.href
                          ? "text-white bg-[rgba(124,92,255,0.1)]"
                          : "text-[#94A3B8] hover:text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}

              <div className="mt-6 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="secondary" size="lg" className="w-full">Dashboard</Button>
                    </Link>
                    <Button variant="destructive" size="lg" className="w-full" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="secondary" size="lg" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/create">
                      <Button variant="gradient" size="lg" className="w-full">
                        Start Creating Free
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
