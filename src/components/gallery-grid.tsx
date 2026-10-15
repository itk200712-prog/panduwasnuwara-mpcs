"use client";

// ============================================================================
// Gallery grid — photo + Title + Description හැම විටම user ට පේනවා ✅
// ============================================================================

import { useState } from "react";
import { Heart, ImageIcon, MessageSquare, X } from "lucide-react";
import type { GalleryItem } from "@/lib/types";

const ASPECT: Record<GalleryItem["aspect"], string> = {
  "4:3": "4 / 3",
  "16:9": "16 / 9",
  "1:1": "1 / 1",
  "3:2": "3 / 2",
};

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState<GalleryItem | null>(null);
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((g) => (
          <figure key={g.id} className="card card-hover overflow-hidden">
            <button
              className="w-full block relative bg-slate-800"
              style={{ aspectRatio: ASPECT[g.aspect] }}
              onClick={() => setOpen(g)}
            >
              <div className="absolute inset-0 flex items-center justify-center text-white/25">
                <ImageIcon size={44} />
              </div>
              <span className="absolute top-3 right-3 badge-amber rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                {g.aspect}
              </span>
            </button>
            {/* ✅ title + description හැම විටම පේනවා */}
            <figcaption className="p-5">
              <h3 className="font-extrabold text-slate-900 leading-snug">{g.title}</h3>
              <p className="text-slate-500 text-[12.5px] mt-1.5 leading-relaxed">{g.description}</p>
              <div className="flex items-center gap-4 mt-3.5 text-[12px] text-slate-500">
                <button
                  className="flex items-center gap-1.5 hover:text-rose-600"
                  onClick={() => setLiked((l) => ({ ...l, [g.id]: !l[g.id] }))}
                >
                  <Heart size={14} className={liked[g.id] ? "fill-rose-500 text-rose-500" : ""} />
                  {g.likes + (liked[g.id] ? 1 : 0)} Likes
                </button>
                <span className="flex items-center gap-1.5">
                  <MessageSquare size={14} /> {g.comments.length} Comments
                </span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* lightbox — title + description මෙතනත් */}
      {open && (
        <div
          className="fixed inset-0 z-[90] bg-slate-900/80 flex items-center justify-center p-4 no-print"
          onClick={() => setOpen(null)}
        >
          <div className="card max-w-3xl w-full p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative bg-slate-800" style={{ aspectRatio: ASPECT[open.aspect] }}>
              <div className="absolute inset-0 flex items-center justify-center text-white/25">
                <ImageIcon size={64} />
              </div>
              <button
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center"
                onClick={() => setOpen(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-extrabold text-slate-900">{open.title}</h3>
              <p className="text-slate-500 text-[13.5px] mt-2 leading-relaxed">{open.description}</p>
              <div className="flex items-center gap-4 mt-4 text-[12.5px] text-slate-500 border-t border-slate-100 pt-4">
                <span className="flex items-center gap-1.5">
                  <Heart size={14} className="fill-rose-500 text-rose-500" /> {open.likes} Likes
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare size={14} /> {open.comments.length} Comments
                </span>
                <span className="badge-amber rounded-full px-2.5 py-0.5 text-[10px] font-bold ml-auto">{open.aspect}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
