import type { Metadata } from "next";
import { NewsForm } from "@/components/admin/news-form";
import { getAdminNewsById } from "@/lib/data";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export const metadata: Metadata = { title: "Edit Post" };

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lang = await getLang();
  const t = getDict(lang);
  const item = await getAdminNewsById(id);

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-navy-900">{t.admin.editPost}</h2>
      <div className="rounded-2xl bg-white p-8 shadow-card">
        <NewsForm item={item} />
      </div>
    </div>
  );
}
