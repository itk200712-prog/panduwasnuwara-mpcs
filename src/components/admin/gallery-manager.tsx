"use client";

import { useState } from "react";
import { Plus, Trash2, ImagePlus } from "lucide-react";
import { useLang } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/primitives";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { GalleryItem } from "@/types/database";

export function GalleryManager({ items }: { items: GalleryItem[] }) {
  const { t, lang } = useLang();
  const [rows, setRows] = useState(items);
  const [form, setForm] = useState({ title_si: "", title_en: "", image_url: "", category: "general" });
  const [adding, setAdding] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured() || !form.image_url) return;
    setAdding(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("gallery")
        .insert({
          title_si: form.title_si || "",
          title_en: form.title_en || "",
          image_url: form.image_url,
          category: form.category,
          sort_order: rows.length + 1,
        })
        .select()
        .single();
      if (error) throw error;
      setRows((prev) => [...prev, data as GalleryItem]);
      setForm({ title_si: "", title_en: "", image_url: "", category: "general" });
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  }

  async function remove(item: GalleryItem) {
    if (!isSupabaseConfigured()) return;
    if (!confirm(t.admin.confirmDelete)) return;
    setRows((prev) => prev.filter((r) => r.id !== item.id));
    const supabase = createClient();
    await supabase.from("gallery").delete().eq("id", item.id);
  }

  return (
    <div className="space-y-8">
      {/* Add form */}
      <form onSubmit={add} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h3 className="flex items-center gap-2 font-bold text-navy-900">
          <ImagePlus className="h-5 w-5 text-brand-600" />
          {t.common.add}
        </h3>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field label={t.common.name + " (සිංහල)"}>
            <Input value={form.title_si} onChange={(e) => setForm((f) => ({ ...f, title_si: e.target.value }))} />
          </Field>
          <Field label={t.common.name + " (English)"}>
            <Input value={form.title_en} onChange={(e) => setForm((f) => ({ ...f, title_en: e.target.value }))} />
          </Field>
          <Field label="Image URL" required>
            <Input
              required
              type="url"
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              placeholder="https://..."
            />
          </Field>
          <Field label="Category">
            <Input
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="events / agriculture / ..."
            />
          </Field>
        </div>
        <Button type="submit" loading={adding} className="mt-5">
          <Plus className="h-4 w-4" />
          {t.common.add}
        </Button>
      </form>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {rows.map((item) => (
          <div key={item.id} className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-navy-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image_url}
              alt={lang === "si" ? item.title_si : item.title_en}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent" />
            <p className="absolute bottom-2 left-3 right-3 truncate text-xs font-semibold text-white">
              {lang === "si" ? item.title_si : item.title_en || item.category}
            </p>
            <button
              onClick={() => remove(item)}
              className="absolute right-2 top-2 rounded-lg bg-red-600/90 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label={t.common.delete}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
