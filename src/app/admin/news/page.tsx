import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { EmptyState } from "@/components/ui/primitives";
import { NewsList } from "@/components/admin/admin-list";
import { getAdminNews } from "@/lib/data";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export const metadata: Metadata = { title: "Manage News" };

export default async function AdminNewsPage() {
  const lang = await getLang();
  const t = getDict(lang);
  const items = await getAdminNews();

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-navy-900">{t.admin.manageNews}</h2>
      {items.length === 0 ? (
        <EmptyState icon={Newspaper} title={t.common.empty} />
      ) : (
        <NewsList items={items} />
      )}
    </div>
  );
}
