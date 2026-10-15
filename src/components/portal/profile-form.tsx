"use client";

import { useState } from "react";
import { CheckCircle2, Save } from "lucide-react";
import { useLang } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/primitives";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface Props {
  userId: string;
  initial: {
    full_name_si: string;
    full_name_en: string;
    phone: string;
    address_si: string;
    address_en: string;
    occupation_si: string;
    occupation_en: string;
    email: string;
  };
}

export function ProfileForm({ userId, initial }: Props) {
  const { t } = useLang();
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured()) return;
    setStatus("loading");
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name_si: form.full_name_si,
          full_name_en: form.full_name_en,
          phone: form.phone,
          address_si: form.address_si,
          address_en: form.address_en,
          occupation_si: form.occupation_si,
          occupation_en: form.occupation_en,
        })
        .eq("id", userId);
      if (error) throw error;
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === "success" && (
        <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm font-medium text-brand-800">
          <CheckCircle2 className="h-5 w-5" />
          {t.portal.profileSaved}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.common.name + " (සිංහල)"}>
          <Input value={form.full_name_si} onChange={(e) => update("full_name_si", e.target.value)} />
        </Field>
        <Field label={t.common.name + " (English)"}>
          <Input value={form.full_name_en} onChange={(e) => update("full_name_en", e.target.value)} />
        </Field>
        <Field label={t.common.phone}>
          <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </Field>
        <Field label={t.common.email}>
          <Input value={form.email} disabled className="bg-slate-100" />
        </Field>
        <Field label={t.auth.occupation + " (සිංහල)"}>
          <Input value={form.occupation_si} onChange={(e) => update("occupation_si", e.target.value)} />
        </Field>
        <Field label={t.auth.occupation + " (English)"}>
          <Input value={form.occupation_en} onChange={(e) => update("occupation_en", e.target.value)} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.common.address + " (සිංහල)"}>
          <Textarea value={form.address_si} onChange={(e) => update("address_si", e.target.value)} className="min-h-[80px]" />
        </Field>
        <Field label={t.common.address + " (English)"}>
          <Textarea value={form.address_en} onChange={(e) => update("address_en", e.target.value)} className="min-h-[80px]" />
        </Field>
      </div>

      <Button type="submit" loading={status === "loading"} size="lg">
        <Save className="h-4 w-4" />
        {t.common.save}
      </Button>
    </form>
  );
}
