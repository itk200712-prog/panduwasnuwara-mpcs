import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Email verification link එකෙන් පසු session එක හදා /portal වෙත යොමු කිරීම
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    try {
      const supabase = await createClient();
      await supabase.auth.exchangeCodeForSession(code);
    } catch {
      // ignore
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
