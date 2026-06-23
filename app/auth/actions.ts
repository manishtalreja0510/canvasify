"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

async function getAppUrl() {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const protocol = host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function signIn(_: unknown, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) return { error: error.message };

  const redirectTo = formData.get("redirect") as string | null;
  redirect(redirectTo || "/dashboard");
}

export async function signUp(_: unknown, formData: FormData) {
  const supabase = await createClient();
  const appUrl = await getAppUrl();

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: { full_name: formData.get("name") as string },
      emailRedirectTo: `${appUrl}/auth/callback?next=/dashboard`,
    },
  });

  if (error) return { error: error.message };

  // Send welcome email in background (non-blocking)
  try {
    const { sendWelcomeEmail } = await import("@/lib/email");
    await sendWelcomeEmail(
      formData.get("email") as string,
      formData.get("name") as string || "there"
    );
  } catch { /* Resend key not configured yet */ }

  return { success: "Account created! Check your email to confirm." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function resetPassword(_: unknown, formData: FormData) {
  const supabase = await createClient();
  const appUrl = await getAppUrl();

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email") as string,
    { redirectTo: `${appUrl}/auth/update-password` }
  );

  if (error) return { error: error.message };
  return { success: "Password reset link sent — check your inbox." };
}
