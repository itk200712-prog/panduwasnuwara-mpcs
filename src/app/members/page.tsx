import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/primitives";
import { MembersGrid } from "@/components/members/members-grid";
import { CtaBanner } from "@/components/home/sections";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { getMembers } from "@/lib/data";

export const metadata: Metadata = { title: "Members" };

export default async function MembersPage() {
  const lang = await getLang();
  const t = getDict(lang);
  const members = await getMembers();

  return (
    <>
      <PageHero badge={t.members.badge} title={t.members.title} text={t.members.subtitle} />

      <section className="bg-slate-50 py-20">
        <div className="container-page">
          <SectionHeading badge={t.nav.members} title={t.members.title} text={t.members.subtitle} />
          <MembersGrid members={members} />
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
