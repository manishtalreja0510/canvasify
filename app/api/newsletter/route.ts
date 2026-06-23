import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json() as { email: string; name?: string };

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await (admin.from("newsletter_subscribers") as any)
      .upsert({ email: email.toLowerCase().trim(), name: name?.trim() || null }, { onConflict: "email" });

    if (error && error.code !== "23505") {
      console.error("[Newsletter]", error);
    }

    return NextResponse.json({ success: true, message: "Successfully subscribed!" });
  } catch (error) {
    console.error("[Newsletter] Error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
