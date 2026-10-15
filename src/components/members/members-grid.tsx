"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, Search, User } from "lucide-react";
import { useLang } from "@/context/language-context";
import { EmptyState } from "@/components/ui/primitives";
import { Input } from "@/components/ui/primitives";
import { formatMonthYear } from "@/lib/format";
import type { MemberDirectoryRow } from "@/types/database";

export function MembersGrid({ members }: { members: MemberDirectoryRow[] }) {
  const { t, lang } = useLang();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      [m.full_name_si, m.full_name_en, m.member_no ?? ""].some((v) => v.toLowerCase().includes(q))
    );
  }, [members, query]);

  return (
    <>
      <div className="mx-auto mt-10 max-w-xl">
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
        <div className="mt-12">
          <EmptyState icon={User} title={t.members.empty} />
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((m) => (
            <Link
              key={m.id}
              href={`/members/${m.id}`}
              className="card-hover group rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-card"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-600 to-brand-800">
                {m.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {(lang === "si" ? m.full_name_si : m.full_name_en).charAt(0)}
                  </span>
                )}
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-700">{m.member_no}</p>
              <h3 className="mt-1 text-lg font-bold text-navy-900 transition-colors group-hover:text-brand-700">
                {lang === "si" ? m.full_name_si : m.full_name_en}
              </h3>
              {(m.occupation_si || m.occupation_en) && (
                <p className="mt-1 text-sm text-slate-500">
                  {lang === "si" ? m.occupation_si : m.occupation_en}
                </p>
              )}
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                {t.members.memberSince} {formatMonthYear(m.joined_at, lang)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
