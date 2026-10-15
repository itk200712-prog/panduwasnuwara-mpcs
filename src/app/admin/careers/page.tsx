import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { EmptyState } from "@/components/ui/primitives";
import { CareersList } from "@/components/admin/admin-list";
import { getAdminCareers } from "@/lib/data";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export const metadata: Metadata = { title: "Manage Careers" };

export default async function AdminCareersPage() {
  const lang = await getLang();
  const t = getDict(lang);
  const items = await getAdminCareers();

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-navy-900">{t.admin.manageCareers}</h2>
      {items.length === 0 ? (
        <EmptyState icon={Briefcase} title={t.common.empty} />
      ) : (
        <CareersList items={items} />
      )}
    </div>
  );
}
