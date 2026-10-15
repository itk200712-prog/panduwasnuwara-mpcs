import type { Metadata } from "next";
import { CreditCard, Receipt } from "lucide-react";
import { Badge, EmptyState } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/server";
import { getMemberDashboard } from "@/lib/data";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { formatCurrency, formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "My Loans" };

export default async function LoansPage() {
  const lang = await getLang();
  const t = getDict(lang);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { loans, payments } = await getMemberDashboard(user.id);

  return (
    <div className="space-y-8">
      {/* Loans */}
      <section>
        <h2 className="text-xl font-bold text-navy-900">{t.portal.myLoans}</h2>
        {loans.length === 0 ? (
          <div className="mt-6">
            <EmptyState icon={CreditCard} title={t.portal.noLoans} />
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {loans.map((l) => (
              <div key={l.id} className="overflow-hidden rounded-2xl bg-white shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-navy-900">{l.loan_no}</h3>
                      <Badge tone={l.status === "active" ? "green" : l.status === "pending" ? "amber" : "gray"}>
                        {t.admin.statusLabels[l.status]}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {t.portal.loanType}: {t.portal.types[l.loan_type]}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-slate-500">{t.portal.principal}</p>
                    <p className="text-2xl font-extrabold text-navy-900">{formatCurrency(l.principal, lang)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
                  {[
                    { label: t.portal.monthlyPayment, value: l.monthly_installment ? formatCurrency(l.monthly_installment, lang) : "—" },
                    { label: `${t.common.status} (%)`, value: `${Number(l.interest_rate)}%` },
                    { label: t.common.date, value: l.due_date ? formatDate(l.due_date, lang) : "—" },
                    { label: t.portal.purpose, value: l.purpose ?? "—" },
                  ].map((row) => (
                    <div key={row.label} className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">{row.label}</p>
                      <p className="mt-1 font-semibold text-navy-900">{row.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Payments */}
      <section className="rounded-2xl bg-white p-6 shadow-card">
        <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900">
          <Receipt className="h-5 w-5 text-brand-600" />
          {t.portal.recentTxns}
        </h2>
        {payments.length === 0 ? (
          <div className="mt-6">
            <EmptyState icon={Receipt} title={t.portal.noTxns} />
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="pb-3 pr-4">{t.common.date}</th>
                  <th className="pb-3 pr-4">{t.portal.loanNo}</th>
                  <th className="pb-3 pr-4">{t.common.status}</th>
                  <th className="pb-3 text-right">{t.common.amount}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4">{formatDate(p.paid_at, lang)}</td>
                    <td className="py-3 pr-4">{loans.find((l) => l.id === p.loan_id)?.loan_no ?? "—"}</td>
                    <td className="py-3 pr-4">{p.method}</td>
                    <td className="py-3 text-right font-bold text-brand-700">{formatCurrency(p.amount, lang)}</td>
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
