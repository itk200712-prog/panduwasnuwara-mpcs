"use client";

// ============================================================================
// Registered Members — All User & Admin Accounts (password display included)
// ============================================================================

import { useMemo, useState } from "react";
import { Eye, EyeOff, Pencil, Search, Trash2, UsersRound } from "lucide-react";
import { AdminTopbar, dbDelete, dbUpdate, useNotice } from "@/components/admin";
import { decodePw } from "@/lib/auth";
import { REGISTERED_USERS } from "@/lib/seed";

type UserRow = (typeof REGISTERED_USERS)[number];

export default function AdminMembersPage() {
  const { show, node } = useNotice();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<UserRow[]>([...REGISTERED_USERS]);
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) => r.full_name.toLowerCase().includes(s) || r.nic.toLowerCase().includes(s) || r.phone.includes(s)
    );
  }, [q, rows]);

  return (
    <div>
      <AdminTopbar title="Registered Members" sub="Review and manage member records, moderate gallery discussions, and configure communication preferences." />
      {node}

      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <UsersRound size={20} className="text-indigo-700" /> All User &amp; Admin Accounts
              <span className="badge-blue rounded-full px-2.5 py-0.5 text-[11px] font-bold">{rows.length}</span>
            </h2>
            <p className="text-slate-500 text-[12px] mt-1">
              Super Admin: You can manage both Administrator and Registered Member accounts.
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} className="field !pl-10" placeholder="Search members by name, NIC, or phone..." />
          </div>
        </div>

        <div className="scroll-x mt-5">
          <table className="table-x">
            <thead>
              <tr>
                <th>FULL NAME</th>
                <th>NIC NUMBER</th>
                <th>PHONE</th>
                <th>PASSWORD</th>
                <th>ROLE</th>
                <th>JOINED DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="font-semibold text-slate-800">{r.full_name}</td>
                  <td className="tabular-nums text-slate-600">{r.nic}</td>
                  <td className="tabular-nums text-slate-600">{r.phone}</td>
                  {/* ✅ user requirement: current password එක පෙන්වන්න ඕන */}
                  <td>
                    <div className="flex items-center gap-2">
                      <code className="rounded-lg bg-slate-100 px-2.5 py-1 text-[12px] tabular-nums">
                        {visible[r.id] ? decodePw(r.password_display) || "••••••" : "••••••••"}
                      </code>
                      <button
                        className="text-slate-400 hover:text-indigo-700"
                        onClick={() => setVisible((v) => ({ ...v, [r.id]: !v[r.id] }))}
                        title="Show / hide password"
                      >
                        {visible[r.id] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </td>
                  <td>
                    {r.role === "superadmin" ? (
                      <span className="badge-amber rounded-full px-2.5 py-1 text-[10.5px] font-bold inline-flex items-center gap-1">
                        <Eye size={11} /> Super Admin
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-900 text-white px-2.5 py-1 text-[10.5px] font-bold inline-flex items-center gap-1">
                        <Eye size={11} /> Admin
                      </span>
                    )}
                  </td>
                  <td className="tabular-nums text-slate-500">{r.joined_date}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-700"
                        onClick={() => show("Edit mode — update fields මෙතනින්")}
                      >
                        <Pencil size={14} />
                      </button>
                      {r.role !== "superadmin" && (
                        <button
                          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-600"
                          onClick={async () => {
                            setRows((rs) => rs.filter((x) => x.id !== r.id));
                            const err = await dbDelete("profiles", { nic: r.nic });
                            show(err ? `⚠ ${err}` : "✅ Deleted");
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
