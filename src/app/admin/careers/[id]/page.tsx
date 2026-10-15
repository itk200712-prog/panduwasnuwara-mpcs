import type { Metadata } from "next";
import { CareerForm } from "@/components/admin/career-form";
import { getAdminCareerById } from "@/lib/data";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export const metadata: Metadata = { title: "Edit Position" };

export default async function EditCareerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lang = await getLang();
  const t = getDict(lang);
  const item = await getAdminCareerById(id);

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-navy-900">{t.admin.editCareer}</h2>
      <div className="rounded-2xl bg-white p-8 shadow-card">
        <CareerForm item={item} />
      </div>
    </div>
  );
}
