"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Search, ShieldCheck, User } from "lucide-react";
import { useLang } from "@/context/language-context";
import { Badge, EmptyState, Input, Select } from "@/components/ui/primitives";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { formatDate } from "@/lib/format";
import type { MemberStatus, Profile, UserRole } from "@/types/database";

export function MembersTable({ members }: { members: Profile[] }) {
  const { t, lang } = useLang();
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(members);
  const [savedId, setSavedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((m) =>
      [m.full_name_si, m.full_name_en, m.member_no ?? "", m.email ?? "", m.nic ?? ""].some((v) =>
        (v ?? "").toLowerCase().includes(q)
      )
    );
  }, [rows, query]);

  async function updateMember(id: string, patch: Partial<Pick<Profile, "role" | "status">>) {
    if (!isSupabaseConfigured()) return;
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    try {
      const supabase = createClient();
      await supabase.from("profiles").update(patch).eq("id", id);
      setSavedId(id);
      setTimeout(() => setSavedId(null), 2000);
    } catch {
      setRows(members);
    }
  }

  return (
    <>
      <div className="mx-auto max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.members.searchPlaceholder}
            className="pl-12"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={User} title={t.common.empty} />
        </div>
      ) : (
        <div className="mt-10 overflow-x-auto rounded-2xl bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4">{t.common.memberNo}</th>
                <th className="px-5 py-4">{t.common.name}</th>
                <th className="px-5 py-4">{t.common.email}</th>
                <th className="px-5 py-4">{t.common.joinedAt}</th>
                <th className="px-5 py-4">{t.common.status}</th>
                <th className="px-5 py-4">{t.admin.role}</th>
                <th className="px-5 py-4">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                  <td className="px-5 py-4 font-semibold text-brand-700">{m.member_no}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-navy-900">{lang === "si" ? m.full_name_si : m.full_name_en}</p>
                    <p className="text-xs text-slate-500">{m.nic}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{m.email}</td>
                  <td className="px-5 py-4 text-slate-600">{formatDate(m.joined_at, lang)}</td>
                  <td className="px-5 py-4">
                    <Badge tone={m.status === "active" ? "green" : m.status === "pending" ? "amber" : "gray"}>
                      {t.admin.statusLabels[m.status]}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Select
                      value={m.role}
                      onChange={(e) => updateMember(m.id, { role: e.target.value as UserRole })}
                      className="w-32 py-1.5"
                    >
                      <option value="member">{t.admin.roles.member}</option>
                      <option value="officer">{t.admin.roles.officer}</option>
                      <option value="admin">{t.admin.roles.admin}</option>
                    </Select>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {m.status !== "active" ? (
                        <button
                          onClick={() => updateMember(m.id, { status: "active" as MemberStatus })}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-800"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {t.admin.approve}
                        </button>
                      ) : (
                        <button
                          onClick={() => updateMember(m.id, { status: "suspended" as MemberStatus })}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-300"
                        >
                          {t.common.suspended}
                        </button>
                      )}
                      {savedId === m.id && <ShieldCheck className="h-4 w-4 text-brand-600" />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
