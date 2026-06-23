import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name: string;
      email: string;
      type: string;
      subject: string;
      message: string;
    };

    if (!body.email || !body.message) {
      return NextResponse.json({ error: "Email and message are required" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { error } = await (admin.from("support_tickets") as any).insert({
      name: body.name?.trim() || "Anonymous",
      email: body.email.toLowerCase().trim(),
      type: body.type || "general",
      subject: body.subject?.trim() || "Contact Form Submission",
      message: body.message?.trim(),
      status: "open",
    });

    if (error) {
      console.error("[Contact]", error);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Contact] Error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
