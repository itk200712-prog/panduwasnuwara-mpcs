import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, CalendarDays, MapPin, Wallet } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Badge, EmptyState, SectionHeading } from "@/components/ui/primitives";
import { CtaBanner } from "@/components/home/sections";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { getCareers } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Careers" };

export default async function CareersPage() {
  const lang = await getLang();
  const t = getDict(lang);
  const isSi = lang === "si";
  const careers = await getCareers();

  return (
    <>
      <PageHero badge={t.careers.badge} title={t.careers.title} text={t.careers.subtitle} />

      <section className="bg-slate-50 py-20">
        <div className="container-page">
          <SectionHeading badge={t.nav.careers} title={t.careers.title} text={t.careers.subtitle} />

          {careers.length === 0 ? (
            <div className="mt-12">
              <EmptyState icon={Briefcase} title={t.careers.empty} />
            </div>
          ) : (
            <div className="mt-12 space-y-5">
              {careers.map((job) => (
                <Link
                  key={job.id}
                  href={`/careers/${job.id}`}
                  className="card-hover group flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-7 shadow-card sm:flex-row sm:items-center"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                    <Briefcase className="h-7 w-7" />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-navy-900 transition-colors group-hover:text-brand-700">
                      {isSi ? job.title_si : job.title_en}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-brand-600" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Wallet className="h-4 w-4 text-brand-600" />
                        {job.salary_range}
                      </span>
                      {job.deadline && (
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-4 w-4 text-brand-600" />
                          {t.careers.deadline}: {formatDate(job.deadline, lang)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge tone="navy">{t.careers.employment[job.employment_type]}</Badge>
                    <span className="flex items-center gap-2 text-sm font-bold text-brand-700">
                      {t.common.applyNow}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
