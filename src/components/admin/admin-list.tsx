"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useLang } from "@/context/language-context";
import { Badge } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { formatDate } from "@/lib/format";
import type { Career, NewsItem } from "@/types/database";

// ---------------------------------------------------------------------------
//  News list
// ---------------------------------------------------------------------------
export function NewsList({ items }: { items: NewsItem[] }) {
  const { t, lang } = useLang();
  const [rows, setRows] = useState(items);

  async function togglePublish(item: NewsItem) {
    if (!isSupabaseConfigured()) return;
    const next = !item.is_published;
    setRows((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, is_published: next, published_at: next ? new Date().toISOString() : null } : r))
    );
    const supabase = createClient();
    await supabase
      .from("news")
      .update({ is_published: next, published_at: next ? new Date().toISOString() : null })
      .eq("id", item.id);
  }

  async function remove(item: NewsItem) {
    if (!isSupabaseConfigured()) return;
    if (!confirm(t.admin.confirmDelete)) return;
    setRows((prev) => prev.filter((r) => r.id !== item.id));
    const supabase = createClient();
    await supabase.from("news").delete().eq("id", item.id);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/admin/news/new" className={buttonStyles("primary", "md")}>
          <Plus className="h-4 w-4" />
          {t.admin.newPost}
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-4">{t.common.name}</th>
              <th className="px-5 py-4">{t.common.status}</th>
              <th className="px-5 py-4">{t.news.publishedOn}</th>
              <th className="px-5 py-4">{t.common.actions}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                <td className="px-5 py-4">
                  <p className="font-semibold text-navy-900">{lang === "si" ? item.title_si : item.title_en}</p>
                  <p className="text-xs text-slate-500">{t.news.categories[item.category]} • /{item.slug}</p>
                </td>
                <td className="px-5 py-4">
                  <Badge tone={item.is_published ? "green" : "gray"}>
                    {item.is_published ? t.admin.publish : t.admin.unpublished}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {formatDate(item.published_at ?? item.created_at, lang)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublish(item)}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
                    >
                      {item.is_published ? t.admin.unpublished : t.admin.publish}
                    </button>
                    <Link
                      href={`/admin/news/${item.id}`}
                      className="rounded-lg bg-brand-100 p-1.5 text-brand-700 hover:bg-brand-200"
                      aria-label={t.common.edit}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => remove(item)}
                      className="rounded-lg bg-red-100 p-1.5 text-red-700 hover:bg-red-200"
                      aria-label={t.common.delete}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  Careers list
// ---------------------------------------------------------------------------
export function CareersList({ items }: { items: Career[] }) {
  const { t, lang } = useLang();
  const [rows, setRows] = useState(items);

  async function remove(item: Career) {
    if (!isSupabaseConfigured()) return;
    if (!confirm(t.admin.confirmDelete)) return;
    setRows((prev) => prev.filter((r) => r.id !== item.id));
    const supabase = createClient();
    await supabase.from("careers").delete().eq("id", item.id);
  }

  async function toggleOpen(item: Career) {
    if (!isSupabaseConfigured()) return;
    const next = !item.is_open;
    setRows((prev) => prev.map((r) => (r.id === item.id ? { ...r, is_open: next } : r)));
    const supabase = createClient();
    await supabase.from("careers").update({ is_open: next }).eq("id", item.id);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/admin/careers/new" className={buttonStyles("primary", "md")}>
          <Plus className="h-4 w-4" />
          {t.admin.newCareer}
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-4">{t.common.name}</th>
              <th className="px-5 py-4">{t.careers.location}</th>
              <th className="px-5 py-4">{t.careers.deadline}</th>
              <th className="px-5 py-4">{t.common.status}</th>
              <th className="px-5 py-4">{t.common.actions}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                <td className="px-5 py-4">
                  <p className="font-semibold text-navy-900">{lang === "si" ? item.title_si : item.title_en}</p>
                  <p className="text-xs text-slate-500">{t.careers.employment[item.employment_type]}</p>
                </td>
                <td className="px-5 py-4 text-slate-600">{item.location}</td>
                <td className="px-5 py-4 text-slate-600">{formatDate(item.deadline, lang)}</td>
                <td className="px-5 py-4">
                  <Badge tone={item.is_open ? "green" : "gray"}>{item.is_open ? t.common.active : t.common.closed}</Badge>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleOpen(item)}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
                    >
                      {item.is_open ? t.common.closed : t.common.active}
                    </button>
                    <Link
                      href={`/admin/careers/${item.id}`}
                      className="rounded-lg bg-brand-100 p-1.5 text-brand-700 hover:bg-brand-200"
                      aria-label={t.common.edit}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => remove(item)}
                      className="rounded-lg bg-red-100 p-1.5 text-red-700 hover:bg-red-200"
                      aria-label={t.common.delete}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
