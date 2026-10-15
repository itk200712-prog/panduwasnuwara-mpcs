import type { Metadata } from "next";
import Link from "next/link";
import {
  Banknote,
  Briefcase,
  CreditCard,
  MessageSquare,
  Newspaper,
  UserCheck,
  Users,
} from "lucide-react";
import { getAdminOverview } from "@/lib/data";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { formatCurrency, formatNumber } from "@/lib/format";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminOverviewPage() {
  const lang = await getLang();
  const t = getDict(lang);
  const stats = await getAdminOverview();

  const cards = [
    { icon: Users, label: t.admin.totalMembers, value: formatNumber(stats.totalMembers), href: "/admin/members", tone: "from-navy-700 to-navy-900" },
    { icon: UserCheck, label: t.admin.activeMembers, value: formatNumber(stats.activeMembers), href: "/admin/members", tone: "from-brand-600 to-brand-800" },
    { icon: Banknote, label: t.admin.totalSavings, value: formatCurrency(stats.totalSavings, lang), href: "/admin/members", tone: "from-gold-500 to-gold-700" },
    { icon: CreditCard, label: t.admin.activeLoans, value: formatNumber(stats.activeLoans), href: "/admin/members", tone: "from-brand-700 to-navy-800" },
    { icon: MessageSquare, label: t.admin.unreadMessages, value: formatNumber(stats.unreadMessages), href: "/admin/messages", tone: "from-red-500 to-red-700" },
    { icon: Briefcase, label: t.admin.openJobs, value: formatNumber(stats.openJobs), href: "/admin/careers", tone: "from-navy-600 to-brand-800" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`group overflow-hidden rounded-2xl bg-gradient-to-br ${card.tone} p-6 shadow-card transition-transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-extrabold text-white">{card.value}</p>
            <p className="text-sm text-white/75">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <h2 className="text-lg font-bold text-navy-900">{t.admin.overview}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/admin/news/new", label: t.admin.newPost, icon: Newspaper },
            { href: "/admin/careers/new", label: t.admin.newCareer, icon: Briefcase },
            { href: "/admin/messages", label: t.admin.manageMessages, icon: MessageSquare },
            { href: "/admin/members", label: t.admin.manageMembers, icon: Users },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-brand-300 hover:bg-brand-50"
            >
              <action.icon className="h-5 w-5 text-brand-700" />
              <span className="font-semibold text-navy-900">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
