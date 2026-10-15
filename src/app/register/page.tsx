"use client";

// ============================================================================
// Register — Create Member Account (NIC-based)
// ============================================================================

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, UserPlus } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { registerMember } from "@/lib/auth";

export default function RegisterPage() {
  const { t } = useLang();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password"));
    const confirm = String(fd.get("confirm"));
    if (password !== confirm) {
      setError("Passwords do not match / මුරපද නොගැලපේ");
      return;
    }
    if (password.length < 5) {
      setError("Password must be at least 5 characters / මුරපදය අකුරු 5කට වැඩි විය යුතුය");
      return;
    }
    setBusy(true);
    const { error: err } = await registerMember({
      full_name: String(fd.get("full_name")),
      nic: String(fd.get("nic")),
      phone: String(fd.get("phone")),
      password,
    });
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    setDone(true);
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8 sm:p-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 text-[13px] font-semibold hover:text-slate-800">
          <ArrowLeft size={15} /> {t.auth.backHome}
        </Link>
        <div className="flex flex-col items-center mt-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <UserPlus size={24} />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-slate-900">{t.auth.registerTitle}</h1>
          <p className="text-slate-500 text-[13px] mt-1.5 text-center">{t.auth.registerSub}</p>
        </div>

        {done ? (
          <div className="mt-8 rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center">
            <div className="font-bold text-emerald-800">Registration successful! / ලියාපදිංචිය සාර්ථකයි!</div>
            <Link href="/signin" className="btn btn-primary mt-4 w-full">
              {t.auth.signinBtn}
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="field-label">{t.auth.fullname} *</label>
              <input name="full_name" required className="field" placeholder="e.g. Induwara Perera" />
            </div>
            <div>
              <label className="field-label">{t.auth.nic} *</label>
              <input name="nic" required className="field" placeholder="E.G. 200478922123 OR 851234567V" />
            </div>
            <div>
              <label className="field-label">{t.auth.phone} *</label>
              <input name="phone" required className="field" placeholder="07X XXXXXXX" />
            </div>
            <div>
              <label className="field-label">{t.auth.password} *</label>
              <div className="relative">
                <input name="password" required type={show ? "text" : "password"} className="field !pr-11" placeholder="••••••••" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={() => setShow(!show)}>
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div>
              <label className="field-label">{t.auth.confirm} *</label>
              <input name="confirm" required type={show ? "text" : "password"} className="field" placeholder="••••••••" />
            </div>
            {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-[12.5px] px-4 py-2.5">{error}</div>}
            <button type="submit" disabled={busy} className="btn btn-primary w-full">
              {busy ? "..." : t.auth.registerBtn}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-[13px] text-slate-500">
          {t.auth.haveAccount}{" "}
          <Link href="/signin" className="text-indigo-700 font-bold hover:underline">
            {t.auth.signinHere}
          </Link>
        </div>
      </div>
    </div>
  );
}
