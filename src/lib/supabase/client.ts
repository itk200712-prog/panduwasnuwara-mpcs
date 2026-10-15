"use client";

import { createBrowserClient } from "@supabase/ssr";
export { isSupabaseConfigured } from "@/lib/env";

/** Browser (client components) සඳහා Supabase client */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Supabase වින්‍යාස වී නොමැත. .env.local එකට NEXT_PUBLIC_SUPABASE_URL සහ NEXT_PUBLIC_SUPABASE_ANON_KEY එක් කරන්න."
    );
  }
  return createBrowserClient(url, anon);
}
