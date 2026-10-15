// Server-safe env helpers — no "use client" directive here.

/** Supabase env vars දෙකම set කරලා තියෙනවද? (build/dev දී seed fallback තීරණයට) */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
