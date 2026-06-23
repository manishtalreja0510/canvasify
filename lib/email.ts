const RESEND_KEY = process.env.RESEND_API_KEY;
const BREVO_KEY = process.env.BREVO_API_KEY;
const FROM_NAME = "Canvasify";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "hello@canvasify.art";

async function sendEmail(to: string, subject: string, html: string) {
  // Try Resend first
  if (RESEND_KEY && RESEND_KEY !== "re_xxxx") {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: `${FROM_NAME} <${FROM_EMAIL}>`, to, subject, html }),
    });
    if (res.ok) return;
    console.error("[Email/Resend]", await res.text());
  }

  // Fall back to Brevo
  if (BREVO_KEY && BREVO_KEY !== "xkeysib-xxxx") {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": BREVO_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: { name: FROM_NAME, email: FROM_EMAIL },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });
    if (res.ok) return;
    console.error("[Email/Brevo]", await res.text());
  }

  console.log(`[Email] No provider configured — would send "${subject}" to ${to}`);
}

export async function sendWelcomeEmail(email: string, name: string) {
  await sendEmail(
    email,
    "Welcome to Canvasify — Your Journey to Art Starts Here! 🎨",
    `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#060816;color:#fff;">
  <div style="max-width:580px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;background:linear-gradient(135deg,#7C5CFF,#B48EFF);padding:12px 28px;border-radius:16px;">
        <span style="font-size:20px;font-weight:800;color:#fff;">✨ Canvasify</span>
      </div>
    </div>
    <h1 style="font-size:28px;font-weight:700;margin:0 0 12px;">Welcome, ${name}! 👋</h1>
    <p style="font-size:16px;color:#94A3B8;line-height:1.6;margin:0 0 24px;">
      You're one step away from turning your favorite photos into beautiful paint-by-number masterpieces.
      Confirm your email to get started.
    </p>
    <div style="background:#0D1323;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px;margin-bottom:24px;">
      <p style="margin:0 0 8px;color:#fff;font-weight:600;">What you can do:</p>
      <ul style="margin:0;padding:0 0 0 20px;color:#94A3B8;line-height:2;">
        <li>Upload any photo — AI converts it in seconds</li>
        <li>Choose 12, 24, or 36-color palettes</li>
        <li>Download template for ₹499 or order a printed kit</li>
        <li>Frame-ready artwork delivered to your door</li>
      </ul>
    </div>
    <p style="color:#94A3B8;font-size:14px;margin:0 0 32px;">
      Use code <strong style="color:#7C5CFF;">WELCOME10</strong> for 10% off your first order.
    </p>
    <p style="font-size:12px;color:#475569;text-align:center;">
      © ${new Date().getFullYear()} Canvasify · Bangalore, India
    </p>
  </div>
</body>
</html>`
  );
}

export async function sendOrderConfirmationEmail(
  email: string,
  name: string,
  order: { id: string; product_type: string; amount: number }
) {
  const LABELS: Record<string, string> = {
    digital: "Digital Download Template",
    canvas_kit: "Canvas Kit",
    framed: "Framed Artwork",
  };
  const label = LABELS[order.product_type] || order.product_type;
  const amount = `₹${order.amount.toLocaleString("en-IN")}`;
  const isDigital = order.product_type === "digital";

  await sendEmail(
    email,
    `Order Confirmed — ${label} | Canvasify`,
    `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#060816;color:#fff;">
  <div style="max-width:580px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;background:linear-gradient(135deg,#7C5CFF,#B48EFF);padding:12px 28px;border-radius:16px;">
        <span style="font-size:20px;font-weight:800;color:#fff;">✨ Canvasify</span>
      </div>
    </div>
    <div style="text-align:center;margin-bottom:28px;">
      <div style="width:64px;height:64px;background:linear-gradient(135deg,#00D084,#00A062);border-radius:16px;display:inline-flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:16px;">✓</div>
      <h1 style="font-size:26px;font-weight:700;margin:0 0 8px;">Order Confirmed!</h1>
      <p style="color:#94A3B8;margin:0;">Thank you, ${name}. Your order is confirmed.</p>
    </div>
    <div style="background:#0D1323;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px;margin-bottom:20px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
        <span style="color:#94A3B8;">Product</span>
        <span style="font-weight:600;">${label}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
        <span style="color:#94A3B8;">Order ID</span>
        <span style="font-family:monospace;">${order.id.slice(0, 8).toUpperCase()}</span>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,0.08);margin:12px 0;"></div>
      <div style="display:flex;justify-content:space-between;">
        <span style="font-weight:700;">Total Paid</span>
        <span style="color:#00D084;font-weight:700;font-size:18px;">${amount}</span>
      </div>
    </div>
    <div style="background:${isDigital ? "rgba(0,208,132,0.06)" : "rgba(124,92,255,0.06)"};border:1px solid ${isDigital ? "rgba(0,208,132,0.2)" : "rgba(124,92,255,0.2)"};border-radius:12px;padding:16px;margin-bottom:24px;">
      <p style="margin:0;color:${isDigital ? "#00D084" : "#B48EFF"};font-weight:600;">${isDigital ? "📥 Your template is ready!" : "📦 Your kit is being prepared!"}</p>
      <p style="margin:8px 0 0;color:#94A3B8;font-size:14px;">${isDigital ? "Log in to your dashboard to download your high-resolution template." : "We'll send a tracking link once your order ships (2–3 business days)."}</p>
    </div>
    <p style="font-size:12px;color:#475569;text-align:center;">
      Questions? <a href="mailto:hello@canvasify.art" style="color:#7C5CFF;">hello@canvasify.art</a><br>
      © ${new Date().getFullYear()} Canvasify · Bangalore, India
    </p>
  </div>
</body>
</html>`
  );
}
