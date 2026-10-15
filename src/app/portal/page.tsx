import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Banknote, Clock, CreditCard, PiggyBank, Receipt } from "lucide-react";
import { Badge, EmptyState } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/server";
import { getMemberDashboard } from "@/lib/data";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";

export const metadata: Metadata = { title: "Member Portal" };

export default async function PortalDashboard() {
  const lang = await getLang();
  const t = getDict(lang);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { accounts, transactions, loans } = await getMemberDashboard(user.id);

  const totalSavings = accounts.reduce((acc, a) => acc + Number(a.balance ?? 0), 0);
  const activeLoans = loans.filter((l) => l.status === "active");
  const pendingLoans = loans.filter((l) => l.status === "pending");

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: PiggyBank,
            label: t.portal.totalSavings,
            value: formatCurrency(totalSavings, lang),
            tone: "bg-brand-100 text-brand-700",
          },
          {
            icon: CreditCard,
            label: t.portal.activeLoans,
            value: formatNumber(activeLoans.length),
            tone: "bg-gold-100 text-gold-700",
          },
          {
            icon: Banknote,
            label: t.portal.mySavings,
            value: formatNumber(accounts.length),
            tone: "bg-navy-100 text-navy-700",
          },
          {
            icon: Clock,
            label: t.common.pending,
            value: formatNumber(pendingLoans.length),
            tone: "bg-slate-200 text-slate-700",
          },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-6 shadow-card">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.tone}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <p className="mt-4 text-2xl font-extrabold text-navy-900">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Savings accounts */}
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy-900">{t.portal.mySavings}</h2>
            <Link href="/portal/savings" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:underline">
              {t.common.viewAll}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {accounts.length === 0 ? (
            <div className="mt-6">
              <EmptyState icon={PiggyBank} title={t.portal.noSavings} />
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {accounts.slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <p className="font-semibold text-navy-900">{a.account_no}</p>
                    <p className="text-xs text-slate-500">{t.portal.types[a.account_type]}</p>
                  </div>
                  <p className="text-lg font-bold text-brand-700">{formatCurrency(a.balance, lang)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Loans */}
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy-900">{t.portal.myLoans}</h2>
            <Link href="/portal/loans" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:underline">
              {t.common.viewAll}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loans.length === 0 ? (
            <div className="mt-6">
              <EmptyState icon={CreditCard} title={t.portal.noLoans} />
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {loans.slice(0, 3).map((l) => (
                <div key={l.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <p className="font-semibold text-navy-900">{l.loan_no}</p>
                    <p className="text-xs text-slate-500">
                      {t.portal.types[l.loan_type]} • {formatCurrency(l.principal, lang)}
                    </p>
                  </div>
                  <Badge tone={l.status === "active" ? "green" : l.status === "pending" ? "amber" : "gray"}>
                    {t.admin.statusLabels[l.status]}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-900">{t.portal.recentTxns}</h2>
          <Receipt className="h-5 w-5 text-slate-400" />
        </div>
        {transactions.length === 0 ? (
          <div className="mt-6">
            <EmptyState icon={Receipt} title={t.portal.noTxns} />
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="pb-3 pr-4">{t.common.date}</th>
                  <th className="pb-3 pr-4">{t.portal.accountNo}</th>
                  <th className="pb-3 pr-4">{t.common.status}</th>
                  <th className="pb-3 pr-4 text-right">{t.common.amount}</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 8).map((txn) => (
                  <tr key={txn.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4">{formatDate(txn.txn_date, lang)}</td>
                    <td className="py-3 pr-4">{txn.savings_accounts?.account_no ?? "—"}</td>
                    <td className="py-3 pr-4">
                      <Badge tone={txn.type === "deposit" ? "green" : txn.type === "withdrawal" ? "red" : "navy"}>
                        {t.portal.types[txn.type]}
                      </Badge>
                    </td>
                    <td
                      className={`py-3 pr-4 text-right font-bold ${
                        txn.type === "withdrawal" || txn.type === "fee" ? "text-red-600" : "text-brand-700"
                      }`}
                    >
                      {txn.type === "withdrawal" || txn.type === "fee" ? "-" : "+"}
                      {formatCurrency(txn.amount, lang)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
