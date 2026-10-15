"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, ShieldCheck, AlertTriangle } from "lucide-react";
import { useLang } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/primitives";
import { Logo } from "@/components/ui/logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

function LoginForm() {
  const { t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    if (!isSupabaseConfigured()) {
      setStatus("error");
      setErrorMsg("Supabase සම්බන්ධ කර නොමැත. .env.local සකසන්න.");
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Role එක අනුව redirect
      let dest = searchParams.get("next") ?? "/portal";
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user?.id ?? "")
          .maybeSingle();
        if (!searchParams.get("next") && (profile?.role === "admin" || profile?.role === "officer")) {
          dest = "/admin";
        }
      } catch {
        /* ignore */
      }

      router.push(dest);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error && err.message !== "Invalid login credentials"
        ? err.message
        : t.auth.invalidCredentials);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === "error" && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          {errorMsg}
        </div>
      )}

      <Field label={t.common.email} required>
        <Input
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </Field>

      <Field label={t.auth.password} required>
        <Input
          required
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </Field>

      <Button type="submit" loading={status === "loading"} size="lg" className="w-full">
        <LogIn className="h-5 w-5" />
        {t.auth.submitLogin}
      </Button>

      <p className="text-center text-sm text-slate-600">
        {t.auth.noAccount}{" "}
        <Link href="/register" className="font-bold text-brand-700 hover:underline">
          {t.nav.register}
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  const { t } = useLang();

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-navy-950 px-4 py-16">
      <div className="page-hero-pattern absolute inset-0" />
      <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" />

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="mb-8 text-center">
          <div className="mb-6 inline-flex">
            <Logo light />
          </div>
          <h1 className="text-3xl font-extrabold text-white">{t.auth.loginTitle}</h1>
          <p className="mt-2 text-white/70">{t.auth.loginSubtitle}</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/50">
          <ShieldCheck className="h-4 w-4 text-gold-400" />
          Supabase Secure Authentication
        </div>
      </div>
    </div>
  );
}
