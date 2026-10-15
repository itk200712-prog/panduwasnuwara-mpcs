"use client";

import { useMemo, useState } from "react";
import { Images, X } from "lucide-react";
import { useLang } from "@/context/language-context";
import { EmptyState } from "@/components/ui/primitives";
import type { GalleryItem } from "@/types/database";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const { t, lang } = useLang();
  const [category, setCategory] = useState("all");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["all", ...Array.from(set)];
  }, [items]);

  const filtered = category === "all" ? items : items.filter((i) => i.category === category);

  return (
    <>
      {/* Filter tabs */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              category === c
                ? "bg-brand-700 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-brand-50 hover:text-brand-700"
            }`}
          >
            {c === "all" ? t.gallery.all : c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12">
          <EmptyState icon={Images} title={t.common.empty} />
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setLightbox(item)}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-navy-900 shadow-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url}
                alt={lang === "si" ? item.title_si : item.title_en}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <p className="absolute bottom-3 left-3 right-3 text-left text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {lang === "si" ? item.title_si : item.title_en}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <figure className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.image_url}
              alt=""
              className="max-h-[75vh] w-full rounded-2xl object-contain"
            />
            <figcaption className="mt-4 text-center text-white">
              {lang === "si" ? lightbox.title_si : lightbox.title_en}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
