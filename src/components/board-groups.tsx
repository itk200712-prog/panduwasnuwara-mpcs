"use client";

// Board category filter chips

import { useState } from "react";
import type { BoardMember } from "@/lib/types";

const GROUPS = [
  { key: "all", en: "All", si: "සියල්ල" },
  { key: "chairman", en: "Chairman", si: "සභාපති" },
  { key: "vice-chairman", en: "Vice Chairman", si: "උප සභාපති" },
  { key: "director", en: "Directors", si: "අධ්‍යක්ෂවරුන්" },
  { key: "officer", en: "Officers", si: "නිලධාරීන්" },
];

export function BoardGroups({ board }: { board: BoardMember[] }) {
  const [active, setActive] = useState("all");
  const counts: Record<string, number> = { all: board.length };
  for (const m of board) counts[m.category] = (counts[m.category] ?? 0) + 1;

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {GROUPS.map((g) => (
        <button
          key={g.key}
          onClick={() => setActive(g.key)}
          className={`rounded-full px-4 py-2 text-[12.5px] font-bold border transition ${
            active === g.key
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
          }`}
        >
          {g.en} ({counts[g.key] ?? 0})
        </button>
      ))}
    </div>
  );
}
