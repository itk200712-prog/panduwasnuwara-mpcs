"use client";

import { useState } from "react";
import { CheckCheck, Mail, MailOpen, Phone, Trash2, User } from "lucide-react";
import { useLang } from "@/context/language-context";
import { Badge, EmptyState } from "@/components/ui/primitives";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { formatDate } from "@/lib/format";
import type { ContactMessage } from "@/types/database";

export function MessagesList({ messages }: { messages: ContactMessage[] }) {
  const { t, lang } = useLang();
  const [rows, setRows] = useState(messages);
  const [openId, setOpenId] = useState<string | null>(null);

  async function markRead(msg: ContactMessage) {
    if (!isSupabaseConfigured() || msg.is_read) return;
    setRows((prev) => prev.map((r) => (r.id === msg.id ? { ...r, is_read: true } : r)));
    const supabase = createClient();
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", msg.id);
  }

  async function remove(msg: ContactMessage) {
    if (!isSupabaseConfigured()) return;
    if (!confirm(t.admin.confirmDelete)) return;
    setRows((prev) => prev.filter((r) => r.id !== msg.id));
    const supabase = createClient();
    await supabase.from("contact_messages").delete().eq("id", msg.id);
  }

  if (rows.length === 0) {
    return <EmptyState icon={Mail} title={t.common.empty} />;
  }

  return (
    <div className="space-y-4">
      {rows.map((msg) => {
        const open = openId === msg.id;
        return (
          <div
            key={msg.id}
            className={`overflow-hidden rounded-2xl border bg-white shadow-card transition-colors ${
              msg.is_read ? "border-slate-100" : "border-brand-200"
            }`}
          >
            <button
              onClick={() => {
                setOpenId(open ? null : msg.id);
                markRead(msg);
              }}
              className="flex w-full items-start gap-4 p-5 text-left hover:bg-slate-50"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  msg.is_read ? "bg-slate-100 text-slate-500" : "bg-brand-100 text-brand-700"
                }`}
              >
                {msg.is_read ? <MailOpen className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-bold text-navy-900">{msg.full_name}</p>
                  {!msg.is_read && <Badge tone="brand">New</Badge>}
                  <span className="text-xs text-slate-400">{formatDate(msg.created_at, lang)}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-700">{msg.subject ?? "—"}</p>
                {!open && <p className="mt-1 line-clamp-1 text-sm text-slate-500">{msg.message}</p>}
              </div>
            </button>

            {open && (
              <div className="border-t border-slate-100 bg-slate-50 p-5">
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-brand-600" />
                    {msg.full_name}
                  </span>
                  <a href={`mailto:${msg.email}`} className="flex items-center gap-1.5 hover:text-brand-700">
                    <Mail className="h-4 w-4 text-brand-600" />
                    {msg.email}
                  </a>
                  {msg.phone && (
                    <a href={`tel:${msg.phone}`} className="flex items-center gap-1.5 hover:text-brand-700">
                      <Phone className="h-4 w-4 text-brand-600" />
                      {msg.phone}
                    </a>
                  )}
                </div>
                <p className="mt-4 whitespace-pre-wrap rounded-xl bg-white p-4 text-sm text-slate-700">
                  {msg.message}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => markRead(msg)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-100 px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-200"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    {t.admin.markRead}
                  </button>
                  <button
                    onClick={() => remove(msg)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-200"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t.common.delete}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
