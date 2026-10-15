"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/context/language-context";
import { Button, buttonStyles } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/primitives";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { NewsCategory, NewsItem } from "@/types/database";

interface Props {
  item?: NewsItem | null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export function NewsForm({ item }: Props) {
  const { t } = useLang();
  const router = useRouter();
  const [tab, setTab] = useState<"si" | "en">("si");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({
    slug: item?.slug ?? "",
    title_si: item?.title_si ?? "",
    title_en: item?.title_en ?? "",
    excerpt_si: item?.excerpt_si ?? "",
    excerpt_en: item?.excerpt_en ?? "",
    content_si: item?.content_si ?? "",
    content_en: item?.content_en ?? "",
    image_url: item?.image_url ?? "",
    category: (item?.category ?? "news") as NewsCategory,
    is_published: item?.is_published ?? false,
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
        excerpt_si: form.excerpt_si || null,
        excerpt_en: form.excerpt_en || null,
        content_si: form.content_si || null,
        content_en: form.content_en || null,
        image_url: form.image_url || null,
        category: form.category,
        is_published: form.is_published,
        published_at: form.is_published ? item?.published_at ?? new Date().toISOString() : null,
      };

      const { error } = item
        ? await supabase.from("news").update(payload).eq("id", item.id)
        : await supabase.from("news").insert(payload);
      if (error) throw error;

      setStatus("success");
      router.push("/admin/news");
      router.refresh();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/news" className={buttonStyles("ghost", "sm")}>
          <ArrowLeft className="h-4 w-4" />
          {t.admin.manageNews}
        </Link>
        {status === "success" && (
          <span className="flex items-center gap-2 text-sm font-medium text-brand-700">
            <CheckCircle2 className="h-4 w-4" />
            {t.admin.saved}
          </span>
        )}
        {status === "error" && <span className="text-sm font-medium text-red-600">{t.common.error}</span>}
      </div>

      {/* Language tabs */}
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
          <Field label="මාතෘකාව (සිංහල)" required>
            <Input required value={form.title_si} onChange={(e) => update("title_si", e.target.value)} />
          </Field>
          <Field label="කෙටි විස්තරය">
            <Textarea value={form.excerpt_si} onChange={(e) => update("excerpt_si", e.target.value)} />
          </Field>
          <Field label="පූර්ණ විස්තරය">
            <Textarea value={form.content_si} onChange={(e) => update("content_si", e.target.value)} className="min-h-[220px]" />
          </Field>
        </div>
      ) : (
        <div className="space-y-5">
          <Field label="Title (English)" required>
            <Input required value={form.title_en} onChange={(e) => update("title_en", e.target.value)} />
          </Field>
          <Field label="Excerpt">
            <Textarea value={form.excerpt_en} onChange={(e) => update("excerpt_en", e.target.value)} />
          </Field>
          <Field label="Content">
            <Textarea value={form.content_en} onChange={(e) => update("content_en", e.target.value)} className="min-h-[220px]" />
          </Field>
        </div>
      )}

      <div className="grid gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:grid-cols-2">
        <Field label="Slug" hint="url: /news/slug">
          <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="my-news-slug" />
        </Field>
        <Field label={t.news.categories.news}>
          <Select value={form.category} onChange={(e) => update("category", e.target.value)}>
            <option value="news">{t.news.categories.news}</option>
            <option value="notice">{t.news.categories.notice}</option>
            <option value="event">{t.news.categories.event}</option>
            <option value="announcement">{t.news.categories.announcement}</option>
          </Select>
        </Field>
        <Field label="Image URL" hint={t.common.optional}>
          <Input value={form.image_url} onChange={(e) => update("image_url", e.target.value)} placeholder="https://..." />
        </Field>
        <Field label={t.admin.publish}>
          <Select
            value={form.is_published ? "1" : "0"}
            onChange={(e) => update("is_published", e.target.value === "1")}
          >
            <option value="1">{t.admin.publish}</option>
            <option value="0">{t.admin.unpublished}</option>
          </Select>
        </Field>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={status === "loading"} size="lg">
          <Save className="h-4 w-4" />
          {t.common.save}
        </Button>
        <Link href="/admin/news" className={buttonStyles("ghost", "lg")}>
          {t.common.cancel}
        </Link>
      </div>
    </form>
  );
}
