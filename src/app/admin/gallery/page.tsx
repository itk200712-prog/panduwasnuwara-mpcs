"use client";

// ============================================================================
// Gallery Moderation — add / edit / delete + comments moderation
// ============================================================================

import { useState } from "react";
import { ImageIcon, Images, MessageSquare, Pencil, Plus, Search, ThumbsUp, Trash2 } from "lucide-react";
import { AdminModal, AdminTopbar, dbInsert, useNotice } from "@/components/admin";
import { GALLERY } from "@/lib/seed";
import type { GalleryItem } from "@/lib/types";

export default function AdminGalleryPage() {
  const { show, node } = useNotice();
  const [modal, setModal] = useState(false);
  const [items, setItems] = useState<GalleryItem[]>([...GALLERY]);

  async function addItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const row: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: String(fd.get("title")) || `Photo ${items.length + 1}`,
      description: String(fd.get("description")),
      aspect: String(fd.get("aspect")) as GalleryItem["aspect"],
      image: String(fd.get("image")) || "/images/gallery/new.jpg",
      likes: 0,
      comments: [],
    };
    setItems((xs) => [row, ...xs]);
    const err = await dbInsert("gallery_items", row as unknown as Record<string, unknown>);
    setModal(false);
    show(err ? `⚠ ${err}` : "✅ Gallery item added (title + description සමඟ public එකේ පේනවා)");
  }

  return (
    <div>
      <AdminTopbar title="Gallery Moderation" sub="Review and manage member records, moderate gallery discussions, and configure communication preferences." />
      {node}

      <div className="card p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="field !pl-10" placeholder="Search gallery posts or comments..." />
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>
          <Plus size={16} /> Add Gallery Item
        </button>
      </div>

      <div className="space-y-5 mt-5">
        {items.map((g) => (
          <div key={g.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-800 text-white/30 flex items-center justify-center shrink-0">
                  <ImageIcon size={26} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-[15px]">{g.title}</span>
                    <span className="badge-amber rounded-full px-2 py-0.5 text-[9.5px] font-bold">{g.aspect}</span>
                  </div>
                  <div className="text-slate-500 text-[11.5px] mt-0.5">{g.description}</div>
                  <div className="flex items-center gap-3.5 mt-1.5 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><ThumbsUp size={12} /> {g.likes} Likes</span>
                    <span className="flex items-center gap-1"><MessageSquare size={12} /> {g.comments.length} Comments</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button className="btn btn-outline !py-1.5 !px-3 !text-[11.5px]" onClick={() => show("Edit gallery item")}>
                  <Pencil size={13} /> Edit
                </button>
                <button
                  className="btn btn-outline !py-1.5 !px-3 !text-[11.5px] !text-red-600 !border-red-200"
                  onClick={() => setItems((xs) => xs.filter((x) => x.id !== g.id))}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
            <div className="mt-4 border-t border-slate-100 pt-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Comments:</div>
              {g.comments.length === 0 ? (
                <div className="text-slate-400 text-[11.5px] italic mt-1">No comments on this post.</div>
              ) : (
                <div className="space-y-1.5 mt-1.5">
                  {g.comments.map((c) => (
                    <div key={c.id} className="text-[12px] text-slate-600">
                      <strong>{c.author}:</strong> {c.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <AdminModal title="Add New Gallery Item" onClose={() => setModal(false)}>
          <form onSubmit={addItem} className="space-y-4">
            <div>
              <label className="field-label">Photo Title / Identifier (Optional)</label>
              <input name="title" className="field" placeholder="e.g. AGM 2026 or leave blank for auto-id" />
            </div>
            <div>
              <label className="field-label">Aspect Ratio</label>
              <div className="flex flex-wrap gap-2">
                {(["4:3", "16:9", "1:1", "3:2"] as const).map((a, i) => (
                  <label key={a} className="cursor-pointer">
                    <input type="radio" name="aspect" value={a} defaultChecked={i === 0} className="peer sr-only" />
                    <span className="inline-block rounded-xl border border-slate-200 px-5 py-2 text-[13px] font-bold text-slate-600 peer-checked:bg-indigo-700 peer-checked:text-white peer-checked:border-indigo-700">
                      {a}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="field-label">Description (Optional)</label>
              <textarea name="description" rows={3} className="field" placeholder="Enter a description for this photo..." />
            </div>
            <div>
              <label className="field-label">Gallery Photo *</label>
              <div className="flex gap-2.5">
                <label className="btn btn-outline flex-1 !justify-start cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" /> ⬆ Choose File (jpg, .png, .webp)
                </label>
                <input name="image" className="field flex-1" placeholder="or enter image path / URL" />
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">✓ Add Gallery Item</button>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
}
