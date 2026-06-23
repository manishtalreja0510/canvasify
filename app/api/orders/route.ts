import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";

const PRODUCT_PRICES: Record<string, number> = {
  digital: 499,
  canvas_kit: 1499,
  framed: 3999,
};

const COUPONS: Record<string, { type: "percentage" | "fixed"; value: number }> = {
  CANVAS40: { type: "percentage", value: 40 },
  WELCOME10: { type: "percentage", value: 10 },
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await request.json();
    const { productType, couponCode, validateOnly, projectId } = body as {
      productType: string;
      couponCode?: string;
      validateOnly?: boolean;
      projectId?: string;
    };

    const basePrice = PRODUCT_PRICES[productType];
    if (!basePrice) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    let discount = 0;
    if (couponCode) {
      const coupon = COUPONS[couponCode.toUpperCase()];
      if (coupon) {
        discount = coupon.type === "percentage"
          ? Math.floor(basePrice * (coupon.value / 100))
          : coupon.value;
      }
    }

    const finalPrice = basePrice - discount;

    if (validateOnly) {
      return NextResponse.json({ original_amount: basePrice, discount, final_amount: finalPrice });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: finalPrice * 100, // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        user_id: user.id,
        product_type: productType,
        coupon_code: couponCode || "",
        project_id: projectId || "",
      },
    });

    return NextResponse.json({
      razorpay_order_id: razorpayOrder.id,
      amount: finalPrice * 100,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
      original_amount: basePrice,
      discount,
    });
  } catch (error) {
    console.error("[Orders] Create error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("[Orders] Fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
