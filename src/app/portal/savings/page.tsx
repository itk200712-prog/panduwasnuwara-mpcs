import type { Metadata } from "next";
import { PiggyBank, Receipt, TrendingUp } from "lucide-react";
import { Badge, EmptyState } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/server";
import { getMemberDashboard } from "@/lib/data";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { formatCurrency, formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "My Savings" };

export default async function SavingsPage() {
  const lang = await getLang();
  const t = getDict(lang);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { accounts, transactions } = await getMemberDashboard(user.id);

  return (
    <div className="space-y-8">
      {/* Accounts */}
      <section>
        <h2 className="text-xl font-bold text-navy-900">{t.portal.mySavings}</h2>
        {accounts.length === 0 ? (
          <div className="mt-6">
            <EmptyState icon={PiggyBank} title={t.portal.noSavings} />
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {accounts.map((a) => (
              <div key={a.id} className="overflow-hidden rounded-2xl bg-white shadow-card">
                <div className="bg-gradient-to-r from-brand-700 to-brand-800 p-6">
                  <div className="flex items-center justify-between">
                    <PiggyBank className="h-8 w-8 text-white/80" />
                    <Badge tone="gold">{t.portal.types[a.account_type]}</Badge>
                  </div>
                  <p className="mt-4 text-xs text-white/60">{t.portal.accountNo}</p>
                  <p className="font-semibold text-white">{a.account_no}</p>
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-wider text-slate-500">{t.portal.balance}</p>
                  <p className="mt-1 text-2xl font-extrabold text-navy-900">{formatCurrency(a.balance, lang)}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <TrendingUp className="h-4 w-4 text-brand-600" />
                      {Number(a.interest_rate)}%
                    </span>
                    <span className="text-slate-500">
                      {t.portal.openedAt}: {formatDate(a.opened_at, lang)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Transactions */}
      <section className="rounded-2xl bg-white p-6 shadow-card">
        <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900">
          <Receipt className="h-5 w-5 text-brand-600" />
          {t.portal.recentTxns}
        </h2>
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
                  <th className="pb-3 pr-4">{t.common.message}</th>
                  <th className="pb-3 pr-4 text-right">{t.common.amount}</th>
                  <th className="pb-3 text-right">{t.portal.balance}</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4">{formatDate(txn.txn_date, lang)}</td>
                    <td className="py-3 pr-4">{txn.savings_accounts?.account_no ?? "—"}</td>
                    <td className="py-3 pr-4">
                      <Badge tone={txn.type === "deposit" ? "green" : txn.type === "withdrawal" ? "red" : "navy"}>
                        {t.portal.types[txn.type]}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-slate-500">{txn.note ?? "—"}</td>
                    <td
                      className={`py-3 pr-4 text-right font-bold ${
                        txn.type === "withdrawal" || txn.type === "fee" ? "text-red-600" : "text-brand-700"
                      }`}
                    >
                      {txn.type === "withdrawal" || txn.type === "fee" ? "-" : "+"}
                      {formatCurrency(txn.amount, lang)}
                    </td>
                    <td className="py-3 text-right">{formatCurrency(txn.balance_after, lang)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
