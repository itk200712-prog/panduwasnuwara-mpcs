"use client";

// ============================================================================
// System Settings — WhatsApp number, Years of Service, FormSubmit emails
// ============================================================================

import { useState } from "react";
import { Check, Mail, MessageCircle, Save, Settings } from "lucide-react";
import { AdminTopbar, dbUpdate, useNotice } from "@/components/admin";
import { SETTINGS } from "@/lib/seed";

export default function AdminSettingsPage() {
  const { show, node } = useNotice();
  const [wa, setWa] = useState(SETTINGS.whatsapp_number);
  const [years, setYears] = useState(String(SETTINGS.years_of_service));
  const [email1, setEmail1] = useState(SETTINGS.contact_email_1);
  const [email2, setEmail2] = useState(SETTINGS.contact_email_2);

  return (
    <div>
      <AdminTopbar title="System Settings" sub="Review and manage member records, moderate gallery discussions, and configure communication preferences." />
      {node}

      <div className="card p-7 max-w-4xl space-y-8">
        {/* WhatsApp */}
        <section>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <MessageCircle size={20} className="text-emerald-600" /> Password Reset WhatsApp Number
          </h2>
          <p className="text-slate-500 text-[12.5px] mt-1.5 leading-relaxed">
            When a member uses the &apos;Forgot Password&apos; option, their details will be pre-filled into a WhatsApp message
            sent to this mobile number.
          </p>
          <div className="mt-4">
            <label className="field-label">Support WhatsApp Number (International format with country code)</label>
            <input value={wa} onChange={(e) => setWa(e.target.value)} className="field" placeholder="94742352670" />
            <p className="text-slate-400 text-[10.5px] mt-1.5">
              Example for Sri Lanka: 94771234567 (without leading 0 or spaces).
            </p>
          </div>
        </section>

        {/* Years */}
        <section className="border-t border-slate-100 pt-7">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Settings size={20} className="text-indigo-700" /> Years of Service Configuration
          </h2>
          <div className="mt-4">
            <input value={years} onChange={(e) => setYears(e.target.value)} className="field max-w-xs" />
            <p className="text-slate-400 text-[10.5px] mt-1.5">
              Configure the operational years of service displayed on the live homepage statistics counter.
            </p>
          </div>
        </section>

        {/* FormSubmit */}
        <section className="border-t border-slate-100 pt-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <Mail size={20} className="text-indigo-700" /> Contact Form Submission Emails
            </h2>
            <span className="badge-green rounded-full px-3.5 py-1.5 text-[11px] font-bold">
              FormSubmit Active (Automatic Delivery)
            </span>
          </div>
          <p className="text-slate-500 text-[12px] mt-1.5 leading-relaxed">
            Inquiries submitted through the website contact form are automatically delivered to the email addresses specified
            below via FormSubmit (https://formsubmit.co). No SMTP or complex server setup required.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <div>
              <label className="field-label">Primary Destination Email (Email 1)</label>
              <input value={email1} onChange={(e) => setEmail1(e.target.value)} className="field" placeholder="name@gmail.com" />
            </div>
            <div>
              <label className="field-label">Secondary Destination Email (Email 2 - Optional)</label>
              <input value={email2} onChange={(e) => setEmail2(e.target.value)} className="field" placeholder="e.g. manager@panduwasnuwara.lk" />
            </div>
          </div>

          <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-5 mt-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-[12.5px]">
                <Check size={15} /> FormSubmit Activation &amp; Testing
              </div>
              <p className="text-indigo-800/80 text-[11px] mt-1 max-w-lg leading-relaxed">
                When using an email for the first time with FormSubmit, you will receive an &quot;Activate Form&quot; verification
                link in your inbox. Click it once to activate.
              </p>
            </div>
            <button className="btn btn-primary shrink-0" onClick={() => show(`Test message sent to ${email1} (activation link එක inbox එකට)`)}>
              Send Test / Activate
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5 mt-5">
            <div className="text-[12px] font-bold text-slate-700">
              Current Delivery Configuration:{" "}
              <span className="text-slate-900">
                Delivering to {email2 ? "two addresses" : "single address"}: {email1}
                {email2 ? `, ${email2}` : ""}
              </span>
            </div>
            <pre className="mt-3 rounded-xl bg-slate-900 text-slate-200 px-4 py-3.5 text-[11px] leading-relaxed overflow-x-auto">
{`Standard Message Format Delivered to Inbox:

Name: Induwara Thathsara

Phone Number: 076 424 7716

Email: induwara@gmail.com

Department: General Society Inquiries

Message: Customer inquiry text...`}
            </pre>
          </div>
        </section>

        <div className="border-t border-slate-100 pt-6">
          <button
            className="btn btn-primary"
            onClick={async () => {
              const err = await dbUpdate("system_settings", { key: "whatsapp_number" }, { value: wa }) ??
                (await dbUpdate("system_settings", { key: "years_of_service" }, { value: years })) ??
                (await dbUpdate("system_settings", { key: "contact_email_1" }, { value: email1 }));
              show(err ? `⚠ ${err}` : "✅ Settings saved");
            }}
          >
            <Save size={16} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
