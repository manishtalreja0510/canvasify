"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FolderOpen, ShoppingBag, Download,
  Crown, Settings, Bell, Plus, LogOut, CheckCircle2,
  Clock, Package, Zap, TrendingUp, ChevronRight,
  MoreHorizontal, Loader2, AlertCircle, Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type Project = {
  id: string;
  title: string;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
  palette_size?: number;
  canvas_size?: string;
  original_image_url?: string;
};

type Order = {
  id: string;
  product_type: "digital" | "canvas_kit" | "framed";
  amount: number;
  status: string;
  created_at: string;
  razorpay_order_id?: string;
};

type Profile = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "user" | "admin";
};

const PRODUCT_LABELS: Record<string, string> = {
  digital: "Digital Download",
  canvas_kit: "Canvas Kit",
  framed: "Framed Artwork",
};

const STATUS_BADGES: Record<string, { variant: "success" | "default" | "warning" | "muted" | "error"; label: string }> = {
  completed: { variant: "success", label: "Completed" },
  processing: { variant: "default", label: "Processing" },
  pending: { variant: "warning", label: "Pending" },
  failed: { variant: "error", label: "Failed" },
  paid: { variant: "success", label: "Paid" },
  shipped: { variant: "default", label: "Shipped" },
  delivered: { variant: "success", label: "Delivered" },
  cancelled: { variant: "muted", label: "Cancelled" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Settings form
  const [settingsName, setSettingsName] = useState("");
  const [settingsPhone, setSettingsPhone] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState("");

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) { router.push("/auth/login"); return; }
    setUser(authUser);

    const [profileRes, projectsRes, ordersRes] = await Promise.all([
      (supabase.from("users") as any).select("*").eq("id", authUser.id).single(),
      (supabase.from("projects") as any).select("*").eq("user_id", authUser.id).order("created_at", { ascending: false }),
      (supabase.from("orders") as any).select("*").eq("user_id", authUser.id).order("created_at", { ascending: false }),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
      setSettingsName(profileRes.data.name || "");
      setSettingsPhone(profileRes.data.phone || "");
    }
    if (projectsRes.data) setProjects(projectsRes.data);
    if (ordersRes.data) setOrders(ordersRes.data);
    setLoading(false);
  }, [router]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    setSettingsMsg("");
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: settingsName, phone: settingsPhone }),
    });
    setSettingsSaving(false);
    if (res.ok) {
      setSettingsMsg("Saved!");
      setProfile((p) => p ? { ...p, name: settingsName, phone: settingsPhone } : p);
    } else {
      setSettingsMsg("Failed to save. Try again.");
    }
  };

  const displayName = profile?.name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const displayEmail = profile?.email || user?.email || "";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const totalSpent = orders.filter((o) => ["paid","shipped","delivered"].includes(o.status)).reduce((s, o) => s + o.amount, 0);
  const downloadCount = orders.filter((o) => o.product_type === "digital" && ["paid","delivered"].includes(o.status)).length;

  const NAV_ITEMS_LIVE = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "projects", label: "My Projects", icon: FolderOpen, count: projects.length || undefined },
    { id: "orders", label: "Orders", icon: ShoppingBag, count: orders.length || undefined },
    { id: "downloads", label: "Downloads", icon: Download },
    { id: "subscription", label: "Subscription", icon: Crown },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#7C5CFF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-[#0D1323] border-r border-[rgba(255,255,255,0.06)] flex flex-col z-30 overflow-y-auto"
      >
        {/* User card */}
        <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center text-sm font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm truncate">{displayName}</p>
              <p className="text-xs text-[#94A3B8] truncate">{displayEmail}</p>
            </div>
          </div>
          {profile?.role === "admin" && (
            <Link href="/admin">
              <div className="mt-3 flex items-center gap-1.5 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl px-3 py-1.5 cursor-pointer hover:bg-[rgba(239,68,68,0.12)] transition-colors">
                <Zap className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xs font-medium text-red-400">Admin Panel</span>
              </div>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          {NAV_ITEMS_LIVE.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? "bg-[rgba(124,92,255,0.15)] text-white"
                  : "text-[#94A3B8] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {count !== undefined && count > 0 && (
                <span className="text-xs bg-[rgba(124,92,255,0.2)] text-[#B48EFF] px-1.5 py-0.5 rounded-full">
                  {count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-[rgba(255,255,255,0.06)]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#94A3B8] hover:text-red-400 hover:bg-[rgba(239,68,68,0.05)] transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8 min-h-screen">

        {/* Overview */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {displayName.split(" ")[0]}! 👋
                </h1>
                <p className="text-[#94A3B8] mt-1">Here&apos;s what&apos;s happening with your projects.</p>
              </div>
              <Link href="/create">
                <Button variant="gradient" icon={<Plus className="w-4 h-4" />}>New Project</Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Projects", value: String(projects.length), icon: FolderOpen, color: "#7C5CFF" },
                { label: "Orders Placed", value: String(orders.length), icon: ShoppingBag, color: "#00E5FF" },
                { label: "Total Spent", value: formatCurrency(totalSpent), icon: TrendingUp, color: "#00D084" },
                { label: "Downloads", value: String(downloadCount), icon: Download, color: "#B48EFF" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-xs text-[#94A3B8] mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Recent projects */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">Recent Projects</h2>
                  <button onClick={() => setActiveTab("projects")} className="text-sm text-[#7C5CFF] hover:text-[#B48EFF] flex items-center gap-1">
                    View all <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {projects.length === 0 ? (
                  <div className="bg-[#0D1323] border border-dashed border-[rgba(255,255,255,0.08)] rounded-2xl p-8 text-center">
                    <FolderOpen className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
                    <p className="text-[#94A3B8] mb-4">No projects yet. Create your first one!</p>
                    <Link href="/create">
                      <Button variant="gradient" size="sm">Create Now</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {projects.slice(0, 5).map((project) => {
                      const badge = STATUS_BADGES[project.status] || STATUS_BADGES.pending;
                      return (
                        <div key={project.id} className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl p-4 flex items-center gap-4 hover:border-[rgba(124,92,255,0.2)] transition-colors group">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgba(124,92,255,0.2)] to-[rgba(0,229,255,0.1)] flex items-center justify-center shrink-0 overflow-hidden">
                            {project.original_image_url && project.original_image_url.startsWith("http") ? (
                              <img src={project.original_image_url} alt="" className="w-full h-full object-cover opacity-60" style={{ filter: "saturate(0)" }} />
                            ) : (
                              <FolderOpen className="w-5 h-5 text-[#7C5CFF]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white text-sm truncate">{project.title}</p>
                            <p className="text-xs text-[#94A3B8] mt-0.5">{timeAgo(project.created_at)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={badge.variant} className="text-[10px] py-0.5">{badge.label}</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent order widget */}
              <div>
                <h2 className="text-lg font-bold text-white mb-4">Latest Order</h2>
                {orders.length === 0 ? (
                  <div className="bg-[#0D1323] border border-dashed border-[rgba(255,255,255,0.08)] rounded-2xl p-6 text-center">
                    <ShoppingBag className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                    <p className="text-sm text-[#94A3B8]">No orders yet.</p>
                  </div>
                ) : (
                  <div className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5">
                    {(() => {
                      const o = orders[0];
                      const badge = STATUS_BADGES[o.status] || STATUS_BADGES.pending;
                      return (
                        <>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-[rgba(0,208,132,0.1)] flex items-center justify-center">
                              <Package className="w-4 h-4 text-[#00D084]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white">{PRODUCT_LABELS[o.product_type] || o.product_type}</p>
                              <p className="text-xs text-[#94A3B8]">{timeAgo(o.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-white">{formatCurrency(o.amount)}</span>
                            <Badge variant={badge.variant} className="text-[10px]">{badge.label}</Badge>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Projects tab */}
        {activeTab === "projects" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-white">My Projects</h1>
              <Link href="/create">
                <Button variant="gradient" icon={<Plus className="w-4 h-4" />}>New Project</Button>
              </Link>
            </div>
            {projects.length === 0 ? (
              <div className="border-2 border-dashed border-[rgba(124,92,255,0.2)] rounded-2xl p-16 flex flex-col items-center gap-4 text-center">
                <FolderOpen className="w-12 h-12 text-[#94A3B8]" />
                <p className="text-lg font-semibold text-white">No projects yet</p>
                <p className="text-[#94A3B8] max-w-xs">Upload your first photo and turn it into a beautiful paint-by-number.</p>
                <Link href="/create"><Button variant="gradient">Create First Project</Button></Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => {
                  const badge = STATUS_BADGES[project.status] || STATUS_BADGES.pending;
                  return (
                    <div key={project.id} className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl overflow-hidden hover:border-[rgba(124,92,255,0.2)] transition-colors group cursor-pointer">
                      <div className="aspect-video bg-gradient-to-br from-[rgba(124,92,255,0.15)] to-[rgba(0,229,255,0.08)] flex items-center justify-center relative overflow-hidden">
                        {project.original_image_url && project.original_image_url.startsWith("http") ? (
                          <img src={project.original_image_url} alt={project.title} className="w-full h-full object-cover opacity-50" style={{ filter: "saturate(0.3)" }} />
                        ) : (
                          <FolderOpen className="w-10 h-10 text-[#7C5CFF] opacity-40" />
                        )}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 20px)` }} />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-white text-sm">{project.title}</h3>
                          <Badge variant={badge.variant} className="text-[10px] shrink-0 py-0.5">{badge.label}</Badge>
                        </div>
                        <p className="text-xs text-[#94A3B8] mt-1">{timeAgo(project.created_at)}</p>
                        <div className="flex gap-2 mt-4">
                          <Link href="/create" className="flex-1">
                            <Button variant="primary" size="xs" className="w-full">Order Print</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <Link href="/create">
                  <div className="border-2 border-dashed border-[rgba(124,92,255,0.2)] rounded-2xl min-h-[180px] flex flex-col items-center justify-center gap-3 hover:border-[rgba(124,92,255,0.5)] hover:bg-[rgba(124,92,255,0.04)] transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(124,92,255,0.1)] flex items-center justify-center">
                      <Plus className="w-6 h-6 text-[#7C5CFF]" />
                    </div>
                    <p className="text-sm font-medium text-[#94A3B8]">Create New Project</p>
                  </div>
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {/* Orders tab */}
        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-8">Order History</h1>
            {orders.length === 0 ? (
              <div className="bg-[#0D1323] border border-dashed border-[rgba(255,255,255,0.08)] rounded-2xl p-12 text-center">
                <ShoppingBag className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
                <p className="text-[#94A3B8]">No orders yet. Create a project to get started!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((order) => {
                  const badge = STATUS_BADGES[order.status] || STATUS_BADGES.pending;
                  return (
                    <div key={order.id} className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[rgba(124,92,255,0.1)] flex items-center justify-center">
                        <Package className="w-5 h-5 text-[#7C5CFF]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white text-sm">{PRODUCT_LABELS[order.product_type] || order.product_type}</span>
                          <Badge variant={badge.variant} className="text-[10px] py-0.5">{badge.label}</Badge>
                        </div>
                        <p className="text-xs text-[#94A3B8] font-mono">{order.id.slice(0, 8).toUpperCase()} • {timeAgo(order.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">{formatCurrency(order.amount)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Downloads tab */}
        {activeTab === "downloads" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-8">My Downloads</h1>
            {orders.filter((o) => o.product_type === "digital").length === 0 ? (
              <div className="bg-[#0D1323] border border-dashed border-[rgba(255,255,255,0.08)] rounded-2xl p-12 text-center">
                <Download className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
                <p className="text-[#94A3B8] mb-4">No digital downloads yet.</p>
                <Link href="/create"><Button variant="gradient" size="sm">Create Template</Button></Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.filter((o) => o.product_type === "digital").map((order) => (
                  <div key={order.id} className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(0,208,132,0.1)] flex items-center justify-center">
                      <Download className="w-5 h-5 text-[#00D084]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">Paint-by-Number Template</p>
                      <p className="text-xs text-[#94A3B8]">{timeAgo(order.created_at)} • PDF + Print files</p>
                    </div>
                    <Button variant="glass" size="sm">Download</Button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Settings tab */}
        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>
            <div className="max-w-2xl flex flex-col gap-6">
              <div className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-5">Profile Information</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center text-2xl font-bold text-white">
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{displayName}</p>
                    <p className="text-sm text-[#94A3B8]">{displayEmail}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#94A3B8] block mb-1.5">Full Name</label>
                    <input
                      value={settingsName}
                      onChange={(e) => setSettingsName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-white text-sm focus:outline-none focus:border-[rgba(124,92,255,0.4)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#94A3B8] block mb-1.5">Email</label>
                    <input
                      value={displayEmail}
                      disabled
                      className="w-full h-10 px-3 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-[#94A3B8] text-sm opacity-60"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#94A3B8] block mb-1.5">Phone (optional)</label>
                    <input
                      value={settingsPhone}
                      onChange={(e) => setSettingsPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full h-10 px-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-white text-sm focus:outline-none focus:border-[rgba(124,92,255,0.4)]"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <Button variant="primary" size="sm" onClick={handleSaveSettings} disabled={settingsSaving}>
                    {settingsSaving ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />Saving…</> : <><Save className="w-3.5 h-3.5 mr-1.5" />Save Changes</>}
                  </Button>
                  {settingsMsg && (
                    <span className={`text-sm ${settingsMsg === "Saved!" ? "text-[#00D084]" : "text-red-400"}`}>
                      {settingsMsg}
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-[rgba(239,68,68,0.03)] border border-[rgba(239,68,68,0.15)] rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">Danger Zone</h3>
                <p className="text-sm text-[#94A3B8] mb-4">Permanently delete your account and all associated data.</p>
                <Button variant="destructive" size="sm">Delete Account</Button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
