"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, UserPlus } from "lucide-react";
import { useLang } from "@/context/language-context";
import { buttonStyles } from "@/components/ui/button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function UserActions() {
  const { t } = useLang();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!isSupabaseConfigured()) {
        if (mounted) setLoading(false);
        return;
      }
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (mounted) setEmail(user?.email ?? null);
      } catch {
        /* ignore */
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        await supabase.auth.signOut();
      }
    } catch {
      /* ignore */
    }
    setEmail(null);
    router.push("/");
    router.refresh();
  }

  if (loading) return <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-200" />;

  if (email) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/portal" className={buttonStyles("primary", "sm")}>
          <LayoutDashboard className="h-4 w-4" />
          {t.nav.portal}
        </Link>
        <button onClick={handleLogout} className={buttonStyles("ghost", "sm")}>
          <LogOut className="h-4 w-4" />
          {t.nav.logout}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className={buttonStyles("navy", "sm")}>
        {t.nav.login}
      </Link>
      <Link href="/register" className={buttonStyles("gold", "sm")}>
        <UserPlus className="h-4 w-4" />
        {t.nav.register}
      </Link>
    </div>
  );
}
