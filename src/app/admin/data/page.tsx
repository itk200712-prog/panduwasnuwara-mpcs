"use client";

// ============================================================================
// Data & Live Metrics — Excel/CSV import + download (member logic upload flow)
// ============================================================================

import { useState } from "react";
import {
  Database, Download, FileSpreadsheet, Printer, UploadCloud, UsersRound, Vote,
} from "lucide-react";
import { AdminTopbar, dbInsert, useNotice } from "@/components/admin";
import { MEMBER_FILES, SETTINGS, VOTER_FILES } from "@/lib/seed";

const MODES = [
  { key: "append", label: "Append to existing list" },
  { key: "replace-file", label: "Replace matching file(s) only" },
  { key: "replace-all", label: "Replace entire existing list" },
];

function ImportPanel({
  kind, title, total, files,
}: {
  kind: "member" | "voter";
  title: string;
  total: number;
  files: { file_name: string; rows: number }[];
}) {
  const { show, node } = useNotice();
  const [mode, setMode] = useState("append");
  const [chosen, setChosen] = useState<string[]>([]);
  const [fileOpen, setFileOpen] = useState(false);

  return (
    <div className="card p-6">
      {node}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2.5">
          <Database size={19} className="text-indigo-700" /> {title}
        </h3>
        <span className="badge-blue rounded-full px-3 py-1 text-[11px] font-bold tabular-nums">
          {total.toLocaleString()} {kind === "member" ? "Members" : "Voters"}
        </span>
      </div>
      <p className="text-slate-500 text-[12px] mt-1.5">
        {kind === "member"
          ? "Upload a member spreadsheet file (.csv) to dynamically update the live members counter."
          : "Upload verified voter records from the electoral register file to update the live eligible voters count."}
      </p>

      <div className="mt-5">
        <label className="field-label">
          Select {kind === "member" ? "Member Register" : "Electoral Register"} File(s) (Excel .xlsx, .xls or CSV):
        </label>
        <label className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-5 cursor-pointer hover:border-indigo-400">
          <input
            type="file"
            multiple
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => setChosen(Array.from(e.target.files ?? []).map((f) => f.name))}
          />
          <span className="btn btn-outline !py-2 !px-4 !text-[12px]">Choose Files</span>
          <span className="text-slate-500 text-[12.5px]">
            {chosen.length ? chosen.join(", ") : "No file chosen"}
          </span>
        </label>
        <div className="mt-2.5 rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-2.5 text-[11px] text-indigo-900 leading-relaxed">
          💡 Tip: To ensure Sinhala text renders without question marks (??), upload Excel (.xlsx) directly or save as &quot;CSV UTF-8&quot;.
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        {MODES.map((m) => (
          <label key={m.key} className="flex items-center gap-2 text-[12.5px] text-slate-700 font-semibold cursor-pointer">
            <input type="radio" name={`mode-${kind}`} checked={mode === m.key} onChange={() => setMode(m.key)} className="accent-indigo-700" />
            {m.label}
          </label>
        ))}
      </div>

      <button
        className="btn btn-primary w-full mt-4"
        onClick={async () => {
          const err = await dbInsert("data_imports", { kind, mode, files: chosen.join(",") });
          show(err ? `⚠ ${err}` : `✅ ${kind} files processed (${mode})`);
        }}
      >
        <UploadCloud size={16} /> Upload &amp; Process File
      </button>

      {/* download */}
      <div className="border-t border-slate-100 mt-6 pt-5">
        <div className="field-label">
          Download {kind === "member" ? "Registered" : "Elective"} Members by File:
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <button className="field !w-auto min-w-[200px] flex items-center justify-between gap-3 font-semibold" onClick={() => setFileOpen(!fileOpen)}>
              <span className="flex items-center gap-2">
                <FileSpreadsheet size={15} className="text-slate-400" />
                All Files ({total.toLocaleString()})
              </span>
              <span className="text-slate-400">⌄</span>
            </button>
            {fileOpen && (
              <div className="absolute z-40 mt-2 w-64 card p-2 shadow-xl">
                {files.map((f) => (
                  <div key={f.file_name} className="px-3 py-2 rounded-lg hover:bg-slate-50 text-[12px] flex justify-between">
                    <span>{f.file_name}</span>
                    <span className="text-slate-400 tabular-nums">{f.rows.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-amber !py-2 !px-4 !text-[12px]" onClick={() => window.print()}>
            <Printer size={14} /> Download (PDF)
          </button>
          <button className="btn btn-primary !py-2 !px-4 !text-[12px]" onClick={() => show("CSV export — Supabase connected නම් file එක බාගැනේ")}>
            <Download size={14} /> Download (CSV)
          </button>
        </div>
      </div>

      <div className="border-t border-slate-100 mt-5 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-[12px] font-bold text-slate-700">Expected Columns Format:</div>
          <div className="flex gap-2">
            <button className="btn btn-outline !py-1.5 !px-3 !text-[11px]" onClick={() => show("Sample .xlsx template download")}>
              📋 Sample (.xlsx)
            </button>
            <button className="btn btn-outline !py-1.5 !px-3 !text-[11px]" onClick={() => show("Sample CSV template download")}>
              ⬇ Sample CSV
            </button>
          </div>
        </div>
        <code className="mt-2 block rounded-xl bg-slate-900 text-emerald-300 px-4 py-2.5 text-[11.5px]">
          Member Number, NIC, FULL NAME, ADDRESS, POSTAL ADDRESS, GENDER
        </code>
        <p className="text-slate-400 text-[10.5px] mt-2">
          RFC-4180 standard CSV supported. Quotes around commas are handled automatically.
          {kind === "voter" && " Verified voters count automatically syncs."}
        </p>
      </div>
    </div>
  );
}

export default function AdminDataPage() {
  return (
    <div>
      <AdminTopbar title="Data & Live Metrics" sub="Manage operational data registries — member spreadsheets & electoral register files" />

      <div className="card p-5 mb-6 border-l-4 border-indigo-600 text-[12.5px] text-slate-600 leading-relaxed">
        Manage operational data registries. Uploading member spreadsheets (CSV/Excel) and official electoral register files
        automatically reflects on the real-time homepage live counter every 5 seconds.
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-7">
        {[
          { label: "Total Members", value: SETTINGS.members_total.toLocaleString(), icon: <UsersRound size={18} />, tone: "blue" },
          { label: "Verified Eligible Voters", value: SETTINGS.voters_total.toLocaleString(), icon: <Vote size={18} />, tone: "green" },
          { label: "Active Registered Businesses", value: "13", icon: <Database size={18} />, tone: "amber" },
          { label: "Years of Service Configuration", value: `${SETTINGS.years_of_service}+ Yrs`, icon: <Database size={18} />, tone: "slate" },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div className="text-slate-500 text-[12px] font-semibold">{s.label}</div>
            <div className="text-3xl font-black text-slate-900 mt-1.5 tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ImportPanel kind="member" title="Import Members (CSV / Excel)" total={SETTINGS.members_total} files={MEMBER_FILES} />
        <ImportPanel kind="voter" title="Upload Electoral Register (Eligible Voters)" total={SETTINGS.voters_total} files={VOTER_FILES} />
      </div>
    </div>
  );
}
