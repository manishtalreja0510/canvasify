import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single() as any;
    if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const admin = createAdminClient();

    const [ordersRes, usersRes, subscriptionsRes] = await Promise.all([
      admin.from("orders").select("amount, status, created_at") as any,
      admin.from("users").select("id, created_at") as any,
      admin.from("subscriptions").select("id, status") as any,
    ]);

    const orders = ordersRes.data || [];
    const users = usersRes.data || [];
    const subscriptions = subscriptionsRes.data || [];

    const paidOrders = orders.filter((o: any) => o.status === "paid" || o.status === "shipped" || o.status === "delivered");
    const totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + (o.amount || 0), 0);
    const activeSubscriptions = subscriptions.filter((s: any) => s.status === "active").length;

    // 7-day and 30-day comparison
    const now = Date.now();
    const day = 86400000;
    const last30 = orders.filter((o: any) => now - new Date(o.created_at).getTime() < 30 * day);
    const prev30 = orders.filter((o: any) => {
      const age = now - new Date(o.created_at).getTime();
      return age >= 30 * day && age < 60 * day;
    });

    const change = (curr: number, prev: number) =>
      prev === 0 ? 100 : Math.round(((curr - prev) / prev) * 100 * 10) / 10;

    return NextResponse.json({
      totalRevenue,
      totalOrders: orders.length,
      activeUsers: users.length,
      activeSubscriptions,
      changes: {
        revenue: change(
          last30.filter((o: any) => ["paid","shipped","delivered"].includes(o.status)).reduce((s: number, o: any) => s + o.amount, 0),
          prev30.filter((o: any) => ["paid","shipped","delivered"].includes(o.status)).reduce((s: number, o: any) => s + o.amount, 0)
        ),
        orders: change(last30.length, prev30.length),
      },
    });
  } catch (err) {
    console.error("[Admin/Stats]", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
