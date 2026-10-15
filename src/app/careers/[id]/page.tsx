import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Wallet } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { buttonStyles } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { ApplyForm } from "@/components/careers/apply-form";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { getCareerById } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Careers" };

export default async function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lang = await getLang();
  const t = getDict(lang);
  const isSi = lang === "si";
  const job = await getCareerById(id);
  if (!job) notFound();

  return (
    <>
      <PageHero
        badge={t.careers.applyTitle}
        title={isSi ? job.title_si : job.title_en}
        text={job.salary_range ?? ""}
      />

      <section className="bg-white py-16">
        <div className="container-page max-w-4xl">
          <Link href="/careers" className={buttonStyles("outline", "sm")}>
            <ArrowLeft className="h-4 w-4" />
            {t.careers.backToList}
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-5">
            {/* Job details */}
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <Badge tone="navy">{t.careers.employment[job.employment_type]}</Badge>
                <div className="mt-5 space-y-4">
                  {[
                    { icon: MapPin, label: t.careers.location, value: job.location },
                    { icon: Wallet, label: t.careers.salary, value: job.salary_range ?? "—" },
                    {
                      icon: CalendarDays,
                      label: t.careers.deadline,
                      value: job.deadline ? formatDate(job.deadline, lang) : "—",
                    },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start gap-3">
                      <row.icon className="mt-0.5 h-5 w-5 text-brand-600" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{row.label}</p>
                        <p className="font-semibold text-navy-900">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 p-6">
                <h2 className="font-bold text-navy-900">{t.common.learnMore}</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {isSi ? job.description_si : job.description_en}
                </p>
              </div>
            </div>

            {/* Apply form */}
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-card lg:col-span-3">
              <h2 className="text-2xl font-bold text-navy-900">{t.careers.applyTitle}</h2>
              <div className="mt-6">
                <ApplyForm careerId={job.id} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
