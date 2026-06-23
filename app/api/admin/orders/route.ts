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
    const { data: orders, error } = await admin
      .from("orders")
      .select("*, users(name, email)")
      .order("created_at", { ascending: false })
      .limit(200) as any;

    if (error) throw error;

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("[Admin/Orders]", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single() as any;
    if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { orderId, status } = await request.json() as { orderId: string; status: string };

    const admin = createAdminClient();
    const { error } = await (admin.from("orders") as any).update({ status }).eq("id", orderId);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
