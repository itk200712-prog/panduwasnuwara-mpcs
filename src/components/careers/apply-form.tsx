"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertTriangle } from "lucide-react";
import { useLang } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/primitives";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function ApplyForm({ careerId }: { careerId: string }) {
  const { t } = useLang();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", nic: "", cover_letter: "", resume_url: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    if (!isSupabaseConfigured()) {
      setStatus("error");
      setErrorMsg("Demo mode — Supabase සම්බන්ධ කළ පසු අයදුම්පත් භාරගැනේ.");
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.from("job_applications").insert({
        career_id: careerId,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || null,
        nic: form.nic || null,
        cover_letter: form.cover_letter || null,
        resume_url: form.resume_url || null,
      });
      if (error) throw error;
      setStatus("success");
      setForm({ full_name: "", email: "", phone: "", nic: "", cover_letter: "", resume_url: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : t.common.error);
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-start gap-4 rounded-2xl border border-brand-200 bg-brand-50 p-6">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-brand-700" />
        <div>
          <p className="font-bold text-brand-800">{t.careers.applySuccess}</p>
          <p className="mt-1 text-sm text-brand-700">{t.auth.registerNote}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === "error" && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.common.name} required>
          <Input required value={form.full_name} onChange={(e) => update("full_name", e.target.value)} />
        </Field>
        <Field label={t.common.email} required>
          <Input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </Field>
        <Field label={t.common.phone}>
          <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </Field>
        <Field label={t.auth.nic}>
          <Input value={form.nic} onChange={(e) => update("nic", e.target.value)} />
        </Field>
      </div>

      <Field label={t.common.message} hint={t.common.optional}>
        <Textarea value={form.cover_letter} onChange={(e) => update("cover_letter", e.target.value)} />
      </Field>

      <Field label="CV / Resume URL" hint={t.common.optional}>
        <Input
          type="url"
          placeholder="https://drive.google.com/..."
          value={form.resume_url}
          onChange={(e) => update("resume_url", e.target.value)}
        />
      </Field>

      <Button type="submit" loading={status === "loading"} size="lg" className="w-full sm:w-auto">
        <Send className="h-4 w-4" />
        {t.common.submit}
      </Button>
    </form>
  );
}
