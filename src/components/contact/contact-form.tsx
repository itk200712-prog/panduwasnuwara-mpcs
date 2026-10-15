"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertTriangle } from "lucide-react";
import { useLang } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/primitives";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function ContactForm() {
  const { t } = useLang();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", subject: "", message: "" });
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
      setErrorMsg("Demo mode — Supabase සම්බන්ධ කළ පසු පණිවිඩ යැවිය හැක.");
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_messages").insert({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject || null,
        message: form.message,
      });
      if (error) throw error;
      setStatus("success");
      setForm({ full_name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : t.common.error);
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-start gap-4 rounded-2xl border border-brand-200 bg-brand-50 p-8">
        <CheckCircle2 className="mt-0.5 h-7 w-7 shrink-0 text-brand-700" />
        <div>
          <p className="text-lg font-bold text-brand-800">{t.contact.success}</p>
          <p className="mt-1 text-sm text-brand-700">{t.contact.formText}</p>
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
        <Field label={t.common.subject}>
          <Input value={form.subject} onChange={(e) => update("subject", e.target.value)} />
        </Field>
      </div>

      <Field label={t.common.message} required>
        <Textarea required value={form.message} onChange={(e) => update("message", e.target.value)} />
      </Field>

      <Button type="submit" loading={status === "loading"} size="lg">
        <Send className="h-4 w-4" />
        {t.contact.send}
      </Button>
    </form>
  );
}
