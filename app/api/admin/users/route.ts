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
    const { data: users, error } = await admin
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200) as any;

    if (error) throw error;
    return NextResponse.json({ users });
  } catch (err) {
    console.error("[Admin/Users]", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
