"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, ShoppingBag,
  Package, ArrowUpRight, ArrowDownRight, MoreHorizontal, Search,
  Shield, Loader2, RefreshCw, MessageSquare, CheckCircle2, Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const ADMIN_NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "users", label: "Users", icon: Users },
  { id: "tickets", label: "Support Tickets", icon: MessageSquare },
];

const STATUS_CONFIG: Record<string, { variant: "success" | "default" | "warning" | "muted" | "error"; label: string }> = {
  delivered: { variant: "success", label: "Delivered" },
  paid: { variant: "success", label: "Paid" },
  shipped: { variant: "default", label: "Shipped" },
  processing: { variant: "warning", label: "Processing" },
  pending: { variant: "muted", label: "Pending" },
  cancelled: { variant: "error", label: "Cancelled" },
};

const ORDER_STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

const PRODUCT_LABELS: Record<string, string> = {
  digital: "Digital Download",
  canvas_kit: "Canvas Kit",
  framed: "Framed Artwork",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orderSearch, setOrderSearch] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketSearch, setTicketSearch] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/auth/login"); return; }
      loadAll();
    });
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [statsRes, ordersRes, usersRes, ticketsRes] = await Promise.all([
      fetch("/api/admin/stats"),
      fetch("/api/admin/orders"),
      fetch("/api/admin/users"),
      fetch("/api/admin/tickets"),
    ]);

    if (statsRes.status === 403 || ordersRes.status === 403) {
      setForbidden(true);
      setLoading(false);
      return;
    }

    const [statsData, ordersData, usersData, ticketsData] = await Promise.all([
      statsRes.ok ? statsRes.json() : null,
      ordersRes.ok ? ordersRes.json() : null,
      usersRes.ok ? usersRes.json() : null,
      ticketsRes.ok ? ticketsRes.json() : null,
    ]);

    if (statsData) setStats(statsData);
    if (ordersData?.orders) setOrders(ordersData.orders);
    if (usersData?.users) setUsers(usersData.users);
    if (ticketsData?.tickets) setTickets(ticketsData.tickets);
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setUpdatingOrder(orderId);
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    }
    setUpdatingOrder(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#7C5CFF] animate-spin" />
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <Shield className="w-16 h-16 text-red-400" />
        <h1 className="text-2xl font-bold text-white">Access Denied</h1>
        <p className="text-[#94A3B8]">You don&apos;t have admin privileges.</p>
        <Button variant="glass" onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  const filteredOrders = orders.filter((o) =>
    !orderSearch ||
    (o.id || "").includes(orderSearch) ||
    (o.users?.name || "").toLowerCase().includes(orderSearch.toLowerCase()) ||
    (o.users?.email || "").toLowerCase().includes(orderSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 flex bg-[#060816]">
      {/* Sidebar */}
      <aside className="fixed top-20 left-0 h-[calc(100vh-5rem)] w-60 bg-[#0A0F1E] border-r border-[rgba(255,255,255,0.05)] flex flex-col z-30">
        <div className="p-4 border-b border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[rgba(239,68,68,0.15)] flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Admin Panel</p>
              <p className="text-[10px] text-[#94A3B8]">Super Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-2">
          {ADMIN_NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl mb-0.5 text-xs font-medium transition-all ${
                activeTab === id
                  ? "bg-[rgba(124,92,255,0.15)] text-white"
                  : "text-[#94A3B8] hover:text-white hover:bg-[rgba(255,255,255,0.04)]"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-[rgba(255,255,255,0.05)]">
          <button
            onClick={loadAll}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#94A3B8] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-60 p-6">

        {/* Overview */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-sm text-[#94A3B8]">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Revenue", value: formatCurrency(stats?.totalRevenue || 0), change: stats?.changes?.revenue || 0 },
                { label: "Total Orders", value: formatNumber(stats?.totalOrders || 0), change: stats?.changes?.orders || 0 },
                { label: "Registered Users", value: formatNumber(stats?.activeUsers || 0), change: 0 },
                { label: "Subscriptions", value: formatNumber(stats?.activeSubscriptions || 0), change: 0 },
              ].map((m) => (
                <div key={m.label} className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl p-4">
                  <p className="text-xs text-[#94A3B8] mb-2">{m.label}</p>
                  <div className="text-2xl font-bold text-white mb-1">{m.value}</div>
                  {m.change !== 0 && (
                    <div className={`flex items-center gap-1 text-xs ${m.change > 0 ? "text-[#00D084]" : "text-red-400"}`}>
                      {m.change > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(m.change)}% vs last 30d
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Recent orders & users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">Recent Orders</h3>
                  <button onClick={() => setActiveTab("orders")} className="text-xs text-[#7C5CFF] hover:text-[#B48EFF]">View all</button>
                </div>
                {orders.slice(0, 5).length === 0 ? (
                  <p className="text-sm text-[#94A3B8] text-center py-4">No orders yet.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {orders.slice(0, 5).map((o) => {
                      const s = STATUS_CONFIG[o.status] || STATUS_CONFIG.pending;
                      return (
                        <div key={o.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[rgba(124,92,255,0.1)] flex items-center justify-center shrink-0">
                            <Package className="w-3.5 h-3.5 text-[#7C5CFF]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">{o.users?.name || o.users?.email || "User"} — {PRODUCT_LABELS[o.product_type] || o.product_type}</p>
                            <p className="text-[10px] text-[#94A3B8]">{timeAgo(o.created_at)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-white">{formatCurrency(o.amount)}</p>
                            <Badge variant={s.variant} className="text-[9px] py-0.5">{s.label}</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">Recent Users</h3>
                  <button onClick={() => setActiveTab("users")} className="text-xs text-[#7C5CFF] hover:text-[#B48EFF]">View all</button>
                </div>
                {users.slice(0, 5).length === 0 ? (
                  <p className="text-sm text-[#94A3B8] text-center py-4">No users yet.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {users.slice(0, 5).map((u) => (
                      <div key={u.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {(u.name || u.email || "U").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{u.name || "No name"}</p>
                          <p className="text-[10px] text-[#94A3B8] truncate">{u.email}</p>
                        </div>
                        <Badge variant={u.role === "admin" ? "error" : "muted"} className="text-[9px]">
                          {u.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders tab */}
        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Orders ({orders.length})</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search by name, email or ID…"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="pl-9 pr-4 h-9 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-white text-xs placeholder:text-[#94A3B8] focus:outline-none focus:border-[rgba(124,92,255,0.4)] w-64"
                />
              </div>
            </div>

            <div className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)]">
                    {["Order ID", "Customer", "Product", "Amount", "Status", "Date", "Action"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#94A3B8]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-[#94A3B8]">No orders found.</td>
                    </tr>
                  ) : filteredOrders.map((o) => {
                    const s = STATUS_CONFIG[o.status] || STATUS_CONFIG.pending;
                    return (
                      <tr key={o.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)]">
                        <td className="px-4 py-3 text-xs font-mono text-[#94A3B8]">{o.id.slice(0, 8).toUpperCase()}</td>
                        <td className="px-4 py-3 text-xs text-white">
                          <div>{o.users?.name || "—"}</div>
                          <div className="text-[10px] text-[#94A3B8]">{o.users?.email}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#94A3B8]">{PRODUCT_LABELS[o.product_type] || o.product_type}</td>
                        <td className="px-4 py-3 text-xs font-bold text-white">{formatCurrency(o.amount)}</td>
                        <td className="px-4 py-3">
                          <Badge variant={s.variant} className="text-[10px] py-0.5">{s.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#94A3B8]">{timeAgo(o.created_at)}</td>
                        <td className="px-4 py-3">
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                            disabled={updatingOrder === o.id}
                            className="text-[10px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-lg px-2 py-1 text-[#94A3B8] focus:outline-none focus:border-[rgba(124,92,255,0.4)] disabled:opacity-50"
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Tickets tab */}
        {activeTab === "tickets" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Support Tickets ({tickets.length})</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search tickets…"
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  className="pl-9 pr-4 h-9 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-white text-xs placeholder:text-[#94A3B8] focus:outline-none w-56"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {tickets
                .filter((t) => !ticketSearch ||
                  (t.subject || "").toLowerCase().includes(ticketSearch.toLowerCase()) ||
                  (t.email || "").toLowerCase().includes(ticketSearch.toLowerCase())
                )
                .map((t) => (
                  <div key={t.id} className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl p-4 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-[rgba(124,92,255,0.1)] flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-[#7C5CFF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white text-sm truncate">{t.subject}</span>
                        <Badge variant={t.status === "open" ? "warning" : t.status === "resolved" ? "success" : "muted"} className="text-[9px] shrink-0">
                          {t.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#94A3B8] mb-1">{t.name} · {t.email} · {t.type}</p>
                      <p className="text-xs text-[#94A3B8] line-clamp-2">{t.message}</p>
                    </div>
                    <div className="text-xs text-[#94A3B8] shrink-0">{timeAgo(t.created_at)}</div>
                  </div>
                ))}
              {tickets.length === 0 && (
                <div className="text-center py-12 text-[#94A3B8]">No support tickets yet.</div>
              )}
            </div>
          </motion.div>
        )}

        {/* Users tab */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-2xl font-bold text-white mb-6">Users ({users.length})</h1>
            <div className="bg-[#0D1323] border border-[rgba(255,255,255,0.07)] rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)]">
                    {["User", "Email", "Role", "Joined", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#94A3B8]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#94A3B8]">No users yet.</td></tr>
                  ) : users.map((u) => (
                    <tr key={u.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#B48EFF] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                            {(u.name || u.email || "U").slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-xs text-white">{u.name || "No name"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#94A3B8]">{u.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant={u.role === "admin" ? "error" : "muted"} className="text-[9px]">{u.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#94A3B8]">{timeAgo(u.created_at)}</td>
                      <td className="px-4 py-3">
                        <MoreHorizontal className="w-3.5 h-3.5 text-[#94A3B8]" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
