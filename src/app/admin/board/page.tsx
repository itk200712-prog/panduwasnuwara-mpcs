"use client";

// ============================================================================
// Board of Directors Management — add / edit / reorder / delete
// ============================================================================

import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2, UserPlus, UsersRound } from "lucide-react";
import { AdminModal, AdminTopbar, dbDelete, dbInsert, useNotice } from "@/components/admin";
import { BOARD } from "@/lib/seed";
import type { BoardMember } from "@/lib/types";

const CATS = [
  { key: "all", label: "All" },
  { key: "chairman", label: "Chairman" },
  { key: "vice-chairman", label: "Vice Chairman" },
  { key: "director", label: "Directors" },
  { key: "officer", label: "Officers" },
];

const PILL: Record<BoardMember["category"], string> = {
  chairman: "badge-amber",
  "vice-chairman": "badge-blue",
  director: "badge-green",
  officer: "badge-red",
};

export default function AdminBoardPage() {
  const { show, node } = useNotice();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [modal, setModal] = useState(false);
  const [members, setMembers] = useState<BoardMember[]>([...BOARD]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return members.filter(
      (m) =>
        (cat === "all" || m.category === cat) &&
        (!s || m.name_en.toLowerCase().includes(s) || m.name_si.includes(q.trim()) || m.email.toLowerCase().includes(s))
    );
  }, [q, cat, members]);

  async function addMember(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const row: BoardMember = {
      order: Number(fd.get("order")) || members.length + 1,
      category: String(fd.get("category")) as BoardMember["category"],
      name_en: String(fd.get("name_en")),
      name_si: String(fd.get("name_si")),
      position_en: String(fd.get("position_en")),
      position_si: String(fd.get("position_si")),
      qualification: String(fd.get("qualification")),
      phone: String(fd.get("phone")),
      email: String(fd.get("email")),
      address: String(fd.get("address")),
      photo: null,
    };
    setMembers((xs) => [...xs, row]);
    const err = await dbInsert("board_members", row as unknown as Record<string, unknown>);
    setModal(false);
    show(err ? `⚠ ${err}` : "✅ Board member added");
  }

  return (
    <div>
      <AdminTopbar title="Board of Directors Management" sub="Add, edit, reorder, and manage Board of Directors profiles, photos, and designations" />
      {node}

      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <UsersRound size={20} className="text-indigo-700" /> Board of Directors Management
            </h2>
            <p className="text-slate-500 text-[12px] mt-1">
              Manage leadership profiles, qualifications, and designations displayed on the official website.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            <Plus size={16} /> Add Board Member
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-5">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} className="field !pl-10" placeholder="Search by name, position, or email..." />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={`rounded-full px-4 py-2 text-[12px] font-bold border ${
                  cat === c.key ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {filtered.map((m) => (
            <div key={`${m.order}-${m.name_en}`} className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-[12px] font-black">
                    {m.name_en.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <span className={`${PILL[m.category]} rounded-full px-2.5 py-0.5 text-[9.5px] font-bold`}>
                      {m.category === "officer" ? "Administrative Officer" : m.category.replace("-", " ")}
                    </span>
                    <div className="font-extrabold text-slate-900 text-[13.5px] mt-1 leading-snug">{m.name_en}</div>
                    <div className="text-slate-500 text-[11.5px]">{m.position_en}</div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">Order: {m.order}</div>
              </div>
              <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 text-[11px] text-slate-600">
                🎓 {m.qualification}
              </div>
              <div className="mt-2.5 space-y-1 text-[11.5px] text-slate-600">
                <div>📞 {m.phone}</div>
                <div>✉ {m.email}</div>
              </div>
              <div className="flex items-center justify-between mt-3.5">
                <div className="text-[11.5px] text-slate-400">{m.name_si}</div>
                <div className="flex gap-1.5">
                  <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-700" onClick={() => show("Edit modal — fields මෙතනින් update")}>
                    <Pencil size={13} />
                  </button>
                  <button
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-600"
                    onClick={async () => {
                      setMembers((xs) => xs.filter((x) => x.order !== m.order || x.name_en !== m.name_en));
                      const err = await dbDelete("board_members", { name_en: m.name_en });
                      show(err ? `⚠ ${err}` : "✅ Deleted");
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <AdminModal title="Add Board Member" sub="Add one or more leaders to the official board page" onClose={() => setModal(false)} wide>
          <form onSubmit={addMember} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Full Name (Sinhala) *</label>
                <input name="name_si" required className="field" placeholder="උදා: H.H.D නිමල් පෙරේරා" />
              </div>
              <div>
                <label className="field-label">Full Name (English) *</label>
                <input name="name_en" required className="field" placeholder="e.g. Emal Priyantha Herath" />
              </div>
              <div>
                <label className="field-label">Position (Sinhala) *</label>
                <input name="position_si" required className="field" placeholder="උදා: සභාපති / අධ්‍යක්ෂ" />
              </div>
              <div>
                <label className="field-label">Position (English) *</label>
                <input name="position_en" required className="field" placeholder="e.g. Chairman / Director" />
              </div>
              <div>
                <label className="field-label">Category / Role Tier</label>
                <select name="category" className="field" defaultValue="director">
                  <option value="chairman">Chairman (සභාපති)</option>
                  <option value="vice-chairman">Vice Chairman (උප සභාපති)</option>
                  <option value="director">Board Director (අධ්‍යක්ෂ)</option>
                  <option value="officer">Administrative Officer (නිලධාරී)</option>
                </select>
              </div>
              <div>
                <label className="field-label">Display Order (Rank)</label>
                <input name="order" type="number" className="field" defaultValue={members.length + 1} />
              </div>
            </div>
            <div>
              <label className="field-label">Qualifications / Honors</label>
              <input name="qualification" className="field" placeholder="e.g. B.Com. (Hons) — University of Kelaniya" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Phone Number</label>
                <input name="phone" className="field" placeholder="e.g. 071 229 1011" />
              </div>
              <div>
                <label className="field-label">Email Address</label>
                <input name="email" className="field" placeholder="e.g. chairman@mpcs.lk" />
              </div>
            </div>
            <div>
              <label className="field-label">Address</label>
              <input name="address" className="field" placeholder="e.g. කුරුණෑගල පාර, හෙට්ටිපොල, ශ්‍රී ලංකා" />
            </div>
            <div>
              <label className="field-label">Profile Photo (Optional)</label>
              <input type="file" accept="image/*" className="field" />
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                <UserPlus size={16} /> Add Member
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </div>
  );
}
