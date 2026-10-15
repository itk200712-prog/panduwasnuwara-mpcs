import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Briefcase, Calendar, Hash, Phone, User } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { buttonStyles } from "@/components/ui/button";
import { CtaBanner } from "@/components/home/sections";
import { getDict, pickLocalized } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { getMemberById } from "@/lib/data";
import { formatMonthYear } from "@/lib/format";

export const metadata: Metadata = { title: "Member Details" };

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lang = await getLang();
  const t = getDict(lang);
  const member = await getMemberById(id);
  if (!member) notFound();

  return (
    <>
      <PageHero
        badge={t.members.detailTitle}
        title={pickLocalized(lang, member.full_name_si, member.full_name_en)}
        text={member.member_no ?? ""}
      />

      <section className="bg-white py-20">
        <div className="container-page">
          <Link href="/members" className={buttonStyles("outline", "sm")}>
            <ArrowLeft className="h-4 w-4" />
            {t.nav.members}
          </Link>

          <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-3xl border border-slate-100 shadow-card">
            <div className="bg-gradient-to-r from-brand-700 to-navy-900 p-10 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white/30 bg-white/10">
                {member.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-white/80" />
                )}
              </div>
              <h2 className="mt-4 text-2xl font-bold text-white">
                {pickLocalized(lang, member.full_name_si, member.full_name_en)}
              </h2>
              <p className="mt-1 text-sm text-gold-300">{member.member_no}</p>
            </div>

            <div className="space-y-4 p-8">
              {[
                {
                  icon: Briefcase,
                  label: t.members.occupation,
                  value: pickLocalized(lang, member.occupation_si, member.occupation_en),
                },
                { icon: Calendar, label: t.common.joinedAt, value: formatMonthYear(member.joined_at, lang) },
                { icon: Hash, label: t.common.memberNo, value: member.member_no ?? "—" },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                    <row.icon className="h-5 w-5 text-brand-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{row.label}</p>
                    <p className="font-semibold text-navy-900">{row.value || "—"}</p>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-gold-200 bg-gold-50 p-4 text-center">
                <p className="flex items-center justify-center gap-2 text-sm font-medium text-gold-800">
                  <Phone className="h-4 w-4" />
                  {t.members.contactNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
