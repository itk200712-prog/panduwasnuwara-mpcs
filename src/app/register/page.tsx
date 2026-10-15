"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useLang } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/primitives";
import { Logo } from "@/components/ui/logo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function RegisterPage() {
  const { t } = useLang();
  const [form, setForm] = useState({
    full_name_si: "",
    full_name_en: "",
    nic: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    if (form.password !== form.confirm) {
      setStatus("error");
      setErrorMsg(t.auth.passwordMismatch);
      return;
    }

    if (!isSupabaseConfigured()) {
      setStatus("error");
      setErrorMsg("Supabase සම්බන්ධ කර නොමැත. .env.local සකසන්න.");
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name_si: form.full_name_si,
            full_name_en: form.full_name_en || form.full_name_si,
            nic: form.nic,
            phone: form.phone,
          },
        },
      });
      if (error) throw error;
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : t.common.error);
    }
  }

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-navy-950 px-4 py-16">
      <div className="page-hero-pattern absolute inset-0" />
      <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" />

      <div className="relative w-full max-w-2xl animate-fade-up">
        <div className="mb-8 text-center">
          <div className="mb-6 inline-flex">
            <Logo light />
          </div>
          <h1 className="text-3xl font-extrabold text-white">{t.auth.registerTitle}</h1>
          <p className="mt-2 text-white/70">{t.auth.registerSubtitle}</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <CheckCircle2 className="h-16 w-16 text-brand-600" />
              <p className="text-lg font-bold text-navy-900">{t.auth.registerSuccess}</p>
              <p className="max-w-sm text-sm text-slate-600">{t.auth.registerNote}</p>
              <Link href="/login" className="mt-2">
                <Button variant="primary">{t.auth.submitLogin}</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === "error" && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t.common.name + " (සිංහල)"} required>
                  <Input required value={form.full_name_si} onChange={(e) => update("full_name_si", e.target.value)} />
                </Field>
                <Field label={t.common.name + " (English)"}>
                  <Input value={form.full_name_en} onChange={(e) => update("full_name_en", e.target.value)} />
                </Field>
                <Field label={t.auth.nic} required>
                  <Input required value={form.nic} onChange={(e) => update("nic", e.target.value)} placeholder="123456789V" />
                </Field>
                <Field label={t.common.phone} required>
                  <Input required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="077 123 4567" />
                </Field>
              </div>

              <Field label={t.common.email} required>
                <Input required type="email" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t.auth.password} required>
                  <Input
                    required
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                  />
                </Field>
                <Field label={t.auth.confirmPassword} required>
                  <Input
                    required
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    value={form.confirm}
                    onChange={(e) => update("confirm", e.target.value)}
                  />
                </Field>
              </div>

              <p className="rounded-xl border border-brand-100 bg-brand-50 p-4 text-xs text-brand-800">
                {t.auth.registerNote}
              </p>

              <Button type="submit" loading={status === "loading"} size="lg" className="w-full">
                <UserPlus className="h-5 w-5" />
                {t.auth.submitRegister}
              </Button>

              <p className="text-center text-sm text-slate-600">
                {t.auth.haveAccount}{" "}
                <Link href="/login" className="font-bold text-brand-700 hover:underline">
                  {t.nav.login}
                </Link>
              </p>
            </form>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/50">
          <ShieldCheck className="h-4 w-4 text-gold-400" />
          Supabase Secure Authentication
        </div>
      </div>
    </div>
  );
}
