// Isomorphic Supabase anon client — server + browser දෙකේම වැඩ කරයි
// (public data reads; cookies/auth ඕන නෑ). "use client" directive නෑ — server-safe.
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/env";

export function createAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Supabase වින්‍යාස වී නොමැත.");
  }
  return createSupabaseClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** query එකක් උත්සාහ කර, Supabase නැත්නම්/අසාර්ථක නම් fallback දෙයි */
export async function queryWithFallback<T>(
  run: (client: ReturnType<typeof createAnonClient>) => PromiseLike<{ data: T | null; error: { message: string } | null }>,
  fallback: T
): Promise<T> {
  if (!isSupabaseConfigured()) return fallback;
  try {
    const { data, error } = await run(createAnonClient());
    if (error || data == null) {
      console.warn("[supabase]", error?.message ?? "no data — using seed fallback");
      return fallback;
    }
    return data;
  } catch (e) {
    console.warn("[supabase]", e instanceof Error ? e.message : e, "— using seed fallback");
    return fallback;
  }
}
