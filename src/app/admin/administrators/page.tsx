"use client";

// Administrators (SUPER) — admin role management

import { ShieldCheck, UserPlus } from "lucide-react";
import { AdminTopbar, useNotice } from "@/components/admin";
import { REGISTERED_USERS } from "@/lib/seed";

export default function AdminAdministratorsPage() {
  const { show, node } = useNotice();
  const admins = REGISTERED_USERS.filter((u) => u.role === "superadmin" || u.role === "admin");

  return (
    <div>
      <AdminTopbar title="Administrators" sub="Manage administrator accounts with elevated console access (SUPER only)" />
      {node}

      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <ShieldCheck size={20} className="text-indigo-700" /> Administrator Accounts
              <span className="badge-blue rounded-full px-2.5 py-0.5 text-[11px] font-bold">{admins.length}</span>
            </h2>
            <p className="text-slate-500 text-[12px] mt-1">
              Only Super Administrators can add, edit, or remove administrator accounts and change roles.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => show("Add Administrator form — role grant SQL එකත් එක්ක")}>
            <UserPlus size={16} /> Add Administrator
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {admins.map((a) => (
            <div key={a.id} className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-[12px] font-black">
                  {a.full_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-[14px]">{a.full_name}</div>
                  <div className="text-slate-400 text-[11px]">{a.auth_email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-[12px] text-slate-600">
                <div>NIC: <span className="font-semibold">{a.nic}</span></div>
                <div>Phone: <span className="font-semibold">{a.phone}</span></div>
                <div>Joined: <span className="font-semibold">{a.joined_date}</span></div>
              </div>
              <div className="mt-3">
                {a.role === "superadmin" ? (
                  <span className="badge-amber rounded-full px-3 py-1 text-[10px] font-bold">SUPER ADMIN</span>
                ) : (
                  <span className="rounded-full bg-slate-900 text-white px-3 py-1 text-[10px] font-bold">ADMIN</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-indigo-50 border border-indigo-100 p-5 text-[12px] text-indigo-900 leading-relaxed">
          <strong>Role grant (SQL Editor):</strong> අලුත් admin කෙනෙක් register වුණාට පස්සේ Supabase SQL Editor එකේ
          <code className="mx-1 rounded bg-white px-1.5 py-0.5">update public.profiles set role=&apos;admin&apos;, status=&apos;active&apos; where nic=&apos;...&apos;;</code>
          run කරන්න. protect_role_change() trigger එක මේක ආරක්ෂා කරයි.
        </div>
      </div>
    </div>
  );
}
