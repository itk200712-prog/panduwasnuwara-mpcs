"use client";

// ============================================================================
// Admin Dashboard — core metrics + latest applications + latest messages
// ============================================================================

import Link from "next/link";
import { useState } from "react";
import {
  Activity, Clock3, Database, FileText, Fuel, Mail, RefreshCw, UsersRound, Vote, Wifi,
} from "lucide-react";
import { AdminStatCard, AdminTopbar } from "@/components/admin";
import { NEWS, SETTINGS } from "@/lib/seed";

export default function AdminDashboard() {
  const [updated, setUpdated] = useState(new Date().toLocaleTimeString("en-US", { hour12: true }));

  return (
    <div>
      <AdminTopbar title="Dashboard Overview" sub="Real-time monitoring of website activity, members, applications, and customer inquiries" />

      {/* status bar */}
      <div className="card p-5 mb-6 border-l-4 border-emerald-500">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-[12px] font-bold">
              <Wifi size={15} /> Live Dashboard
              <span className="text-slate-400 font-normal">Updated: {updated}</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">Panduwasnuwara MPCS Executive Overview</h2>
            <p className="text-slate-500 text-[12.5px] mt-0.5">
              Real-time overview of active visitors, member registry, submitted applications, and customer inquiries.
            </p>
          </div>
          <button className="btn btn-outline" onClick={() => setUpdated(new Date().toLocaleTimeString("en-US", { hour12: true }))}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      {/* metrics */}
      <div className="flex items-center justify-between mb-4">
        <div className="section-badge">Core Metrics &amp; Live Counts</div>
        <div className="text-[11px] text-slate-400 font-semibold">7 Metrics Active</div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard tag="Live Activity" value="0" label="Users Online Now (Guests)" sub="Real-time visitors active on website (not signed in)" icon={<Activity size={18} />} tone="green" />
        <AdminStatCard tag="Accounts" value="2" label="Registered Website Users" sub="Total registered accounts on website" icon={<UsersRound size={18} />} />
        <AdminStatCard tag="CSV / Excel" value={SETTINGS.members_total.toLocaleString()} label="Members (Excel / CSV)" sub="Total cooperative members loaded from dataset" icon={<Database size={18} />} />
        <AdminStatCard tag="Electoral" value={SETTINGS.voters_total.toLocaleString()} label="Eligible Voters" sub="Members with verified voting eligibility" icon={<Vote size={18} />} />
        <AdminStatCard tag="Pending" value="0" label="Pending Applications" sub="Applications not yet approved or declined" icon={<Clock3 size={18} />} tone="amber" />
        <AdminStatCard tag="Registry" value="0" label="Total Applications" sub="Overall count of all submitted applications" icon={<FileText size={18} />} tone="slate" />
        <AdminStatCard tag="New Inquiries" value="1" label="Unread Messages" sub="Inquiries received via business contact forms" icon={<Mail size={18} />} tone="red" />
        <AdminStatCard tag="Future Integration" value="—" label="Live Chat Threads" sub="Customer live assistance channel — will be configured upon request" icon={<Wifi size={18} />} tone="slate" />
      </div>

      {/* bottom widgets */}
      <div className="grid gap-5 lg:grid-cols-2 mt-7">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 font-extrabold text-slate-900">
                <FileText size={18} className="text-indigo-700" /> Latest Applications
              </div>
              <div className="text-slate-400 text-[11.5px] mt-0.5">Most recently submitted or updated application records</div>
            </div>
            <Link href="/admin/applications" className="btn btn-outline !py-1.5 !px-3.5 !text-[11.5px]">View All →</Link>
          </div>
          <div className="mt-8 mb-4 text-center">
            <FileText size={34} className="mx-auto text-slate-300" />
            <div className="text-slate-500 font-semibold text-[13px] mt-2">No applications submitted yet</div>
            <div className="text-slate-400 text-[11.5px]">New membership applications will show up here</div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 font-extrabold text-slate-900">
                <Mail size={18} className="text-rose-600" /> Latest Messages
              </div>
              <div className="text-slate-400 text-[11.5px] mt-0.5">Most recently submitted inquiries across all business divisions</div>
            </div>
            <Link href="/admin/messages" className="btn btn-outline !py-1.5 !px-3.5 !text-[11.5px]">View All →</Link>
          </div>
          <div className="mt-5 rounded-2xl border border-slate-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-[13.5px]">INDUWARA</span>
                  <span className="badge-amber rounded-full px-2 py-0.5 text-[9.5px] font-bold">සාමාජික සාමාජිකා මැදි</span>
                  <span className="badge-red rounded-full px-2 py-0.5 text-[9.5px] font-bold">Unread</span>
                </div>
                <div className="text-slate-600 text-[12.5px] mt-1">සිංහල පරීක්ෂණය - පණිවුඩය පරීක්ෂණය</div>
                <div className="text-slate-400 text-[11.5px]">EFWERGFREG</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-slate-400 text-[10.5px]">23h ago</div>
                <Link href="/admin/messages" className="text-indigo-700 text-[11.5px] font-bold">Reply →</Link>
              </div>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Fuel size={12} /> Fuel prices &amp; site settings live under Businesses / System Settings
          </div>
        </div>
      </div>

      <div className="mt-6 text-[11px] text-slate-400">
        News published: {NEWS.filter((n) => n.published).length} · Last news date: {NEWS[0]?.date}
      </div>
    </div>
  );
}
