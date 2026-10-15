import type { Metadata } from "next";
import { CareerForm } from "@/components/admin/career-form";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export const metadata: Metadata = { title: "New Position" };

export default async function NewCareerPage() {
  const lang = await getLang();
  const t = getDict(lang);

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-navy-900">{t.admin.newCareer}</h2>
      <div className="rounded-2xl bg-white p-8 shadow-card">
        <CareerForm />
      </div>
    </div>
  );
}
