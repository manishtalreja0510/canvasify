import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await request.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      productType,
      amount,
      originalAmount,
      discount,
      couponCode,
      projectId,
    } = body as {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
      productType: string;
      amount: number;
      originalAmount: number;
      discount: number;
      couponCode: string;
      projectId?: string;
    };

    // Verify HMAC-SHA256 signature
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Save order to DB — cast to any to work around Supabase type inference with custom DB types
    const { data: order, error } = await (supabase
      .from("orders")
      .insert({
        user_id: user.id,
        project_id: projectId || "00000000-0000-0000-0000-000000000000",
        product_type: productType as "digital" | "canvas_kit" | "framed",
        amount: Math.round(amount / 100),
        original_amount: originalAmount,
        discount,
        currency: "INR",
        status: "paid",
        payment_provider: "razorpay",
        payment_id: razorpay_payment_id,
        razorpay_order_id,
        coupon_code: couponCode || null,
        shipping_country: "IN",
      } as any)
      .select()
      .single() as any);

    if (error) throw error;

    // Send confirmation email (non-blocking)
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const { data: profile } = await (supabase.from("users") as any).select("name, email").eq("id", user.id).single();
      const { sendOrderConfirmationEmail } = await import("@/lib/email");
      await sendOrderConfirmationEmail(
        profile?.email || authUser?.email || "",
        profile?.name || "there",
        { id: order.id, product_type: productType, amount: Math.round(amount / 100) }
      );
    } catch { /* email failure is non-fatal */ }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("[Orders] Verify error:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
