"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Save } from "lucide-react";
import { useLang } from "@/context/language-context";
import { Button, buttonStyles } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/primitives";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { toDateInputValue } from "@/lib/format";
import type { Career, EmploymentType } from "@/types/database";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export function CareerForm({ item }: { item?: Career | null }) {
  const { t } = useLang();
  const router = useRouter();
  const [tab, setTab] = useState<"si" | "en">("si");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({
    slug: item?.slug ?? "",
    title_si: item?.title_si ?? "",
    title_en: item?.title_en ?? "",
    description_si: item?.description_si ?? "",
    description_en: item?.description_en ?? "",
    location: item?.location ?? "Colombo",
    employment_type: (item?.employment_type ?? "full_time") as EmploymentType,
    salary_range: item?.salary_range ?? "",
    deadline: toDateInputValue(item?.deadline),
    is_open: item?.is_open ?? true,
  });

  function update(key: keyof typeof form, value: string | boolean) {
    setForm((f) => {
      const next = { ...f, [key]: value } as typeof f;
      if (key === "title_en" && !next.slug) next.slug = slugify(String(value));
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured()) return;
    setStatus("loading");
    try {
      const supabase = createClient();
      const payload = {
        slug: form.slug || slugify(form.title_en || form.title_si),
        title_si: form.title_si,
        title_en: form.title_en,
        description_si: form.description_si || null,
        description_en: form.description_en || null,
        location: form.location,
        employment_type: form.employment_type,
        salary_range: form.salary_range || null,
        deadline: form.deadline || null,
        is_open: form.is_open,
      };

      const { error } = item
        ? await supabase.from("careers").update(payload).eq("id", item.id)
        : await supabase.from("careers").insert(payload);
      if (error) throw error;

      setStatus("success");
      router.push("/admin/careers");
      router.refresh();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/careers" className={buttonStyles("ghost", "sm")}>
          <ArrowLeft className="h-4 w-4" />
          {t.admin.manageCareers}
        </Link>
        {status === "success" && (
          <span className="flex items-center gap-2 text-sm font-medium text-brand-700">
            <CheckCircle2 className="h-4 w-4" />
            {t.admin.saved}
          </span>
        )}
        {status === "error" && <span className="text-sm font-medium text-red-600">{t.common.error}</span>}
      </div>

      <div className="flex gap-2 rounded-xl bg-slate-100 p-1.5">
        {(["si", "en"] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setTab(l)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
              tab === l ? "bg-white text-navy-900 shadow-sm" : "text-slate-600 hover:text-navy-900"
            }`}
          >
            {t.admin.tabButtons[l]}
          </button>
        ))}
      </div>

      {tab === "si" ? (
        <div className="space-y-5">
          <Field label="රැකියා නම (සිංහල)" required>
            <Input required value={form.title_si} onChange={(e) => update("title_si", e.target.value)} />
          </Field>
          <Field label="විස්තරය">
            <Textarea value={form.description_si} onChange={(e) => update("description_si", e.target.value)} className="min-h-[160px]" />
          </Field>
        </div>
      ) : (
        <div className="space-y-5">
          <Field label="Job Title (English)" required>
            <Input required value={form.title_en} onChange={(e) => update("title_en", e.target.value)} />
          </Field>
          <Field label="Description">
            <Textarea value={form.description_en} onChange={(e) => update("description_en", e.target.value)} className="min-h-[160px]" />
          </Field>
        </div>
      )}

      <div className="grid gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:grid-cols-2">
        <Field label="Slug">
          <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="job-slug" />
        </Field>
        <Field label={t.careers.location}>
          <Input value={form.location} onChange={(e) => update("location", e.target.value)} />
        </Field>
        <Field label="Employment Type">
          <Select value={form.employment_type} onChange={(e) => update("employment_type", e.target.value)}>
            <option value="full_time">{t.careers.employment.full_time}</option>
            <option value="part_time">{t.careers.employment.part_time}</option>
            <option value="contract">{t.careers.employment.contract}</option>
            <option value="internship">{t.careers.employment.internship}</option>
          </Select>
        </Field>
        <Field label={t.careers.salary}>
          <Input value={form.salary_range} onChange={(e) => update("salary_range", e.target.value)} placeholder="රු. 50,000 - 80,000" />
        </Field>
        <Field label={t.careers.deadline}>
          <Input type="date" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} />
        </Field>
        <Field label={t.common.status}>
          <Select value={form.is_open ? "1" : "0"} onChange={(e) => update("is_open", e.target.value === "1")}>
            <option value="1">{t.common.active}</option>
            <option value="0">{t.common.closed}</option>
          </Select>
        </Field>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={status === "loading"} size="lg">
          <Save className="h-4 w-4" />
          {t.common.save}
        </Button>
        <Link href="/admin/careers" className={buttonStyles("ghost", "lg")}>
          {t.common.cancel}
        </Link>
      </div>
    </form>
  );
}
