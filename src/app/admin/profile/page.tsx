"use client";

// ============================================================================
// My Profile — Profile & Security Management (SUPER)
// ============================================================================

import { useState } from "react";
import { Eye, EyeOff, KeyRound, Lock, Save, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { AdminTopbar, dbUpdate, useNotice } from "@/components/admin";

export default function AdminProfilePage() {
  const { show, node } = useNotice();
  const [showPw, setShowPw] = useState(false);

  return (
    <div>
      <AdminTopbar title="Profile & Security Management" sub="Update your personal credentials, contact information, and account security password" />
      {node}

      {/* header card */}
      <div className="card p-6 mb-6 border-l-4 border-indigo-600">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-2xl font-extrabold text-slate-900">Super Administrator</span>
                <span className="badge-amber rounded-full px-3 py-1 text-[10px] font-black tracking-wider">SUPER ADMIN</span>
              </div>
              <div className="text-slate-500 text-[13px] mt-0.5">@superadmin · Authenticated Official Account</div>
            </div>
          </div>
          <span className="badge-green rounded-full px-4 py-2 text-[12px] font-bold">● Active Authenticated Session</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* personal info */}
        <div className="card p-6">
          <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-[16px]">
            <UserRound size={19} className="text-indigo-700" /> Personal &amp; Contact Information
          </div>
          <p className="text-slate-400 text-[11.5px] mt-1">Update your administrator profile attributes</p>
          <div className="border-t border-slate-100 my-5" />
          <div className="space-y-4">
            <div>
              <label className="field-label">Username (System Identifier)</label>
              <div className="relative">
                <input className="field !bg-slate-100 !pr-20" defaultValue="superadmin" readOnly />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 badge-amber rounded-full px-2.5 py-0.5 text-[9.5px] font-bold">LOCKED</span>
              </div>
              <p className="text-slate-400 text-[10.5px] mt-1">Username is a permanent system identifier and cannot be modified.</p>
            </div>
            <div>
              <label className="field-label">Full Name *</label>
              <input className="field" defaultValue="Super Administrator" />
            </div>
            <div>
              <label className="field-label">National Identity Card (NIC)</label>
              <input className="field" defaultValue="SUPERADMIN" />
            </div>
            <div>
              <label className="field-label">Phone Number</label>
              <input className="field" defaultValue="0372291012" />
            </div>
            <div>
              <label className="field-label">Official Email Address</label>
              <input className="field" defaultValue="superadmin@panduwasnuwara.mpcs.lk" />
            </div>
            <button
              className="btn btn-primary w-full"
              onClick={async () => {
                const err = await dbUpdate("profiles", { nic: "SUPERADMIN" }, { full_name: "Super Administrator" });
                show(err ? `⚠ ${err}` : "✅ Profile saved");
              }}
            >
              <Save size={16} /> Save Profile Changes
            </button>
          </div>
        </div>

        {/* security */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-[16px]">
              <KeyRound size={19} className="text-amber-600" /> Security &amp; Password Management
            </div>
            <button
              className="btn btn-amber !py-1.5 !px-3.5 !text-[11.5px]"
              onClick={() => {
                const pw = Math.random().toString(36).slice(-6) + "A1!";
                (document.getElementById("new-pw") as HTMLInputElement).value = pw;
                setShowPw(true);
              }}
            >
              <Sparkles size={13} /> Generate
            </button>
          </div>
          <p className="text-slate-400 text-[11.5px] mt-1">Update your administrator login password</p>
          <div className="border-t border-slate-100 my-5" />
          <div className="space-y-4">
            <div>
              <label className="field-label">Current Password *</label>
              <div className="relative">
                <input className="field !pr-11" type={showPw ? "text" : "password"} defaultValue="Admin@123" />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div>
              <label className="field-label">New Password *</label>
              <input id="new-pw" className="field" type={showPw ? "text" : "password"} placeholder="Minimum 8 characters" />
            </div>
            <div>
              <label className="field-label">Confirm New Password *</label>
              <input className="field" type={showPw ? "text" : "password"} />
            </div>
            <button className="btn btn-amber w-full" onClick={() => show("✅ Password updated (demo — Supabase connected නම් සැබෑ update)")}>
              <Lock size={16} /> Update Password
            </button>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-[12px]">
                <ShieldCheck size={15} /> Security Guidelines:
              </div>
              <p className="text-slate-500 text-[11.5px] mt-1.5 leading-relaxed">
                For optimal institutional security, use at least 8 characters with a mix of uppercase letters, numbers, and symbols.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
