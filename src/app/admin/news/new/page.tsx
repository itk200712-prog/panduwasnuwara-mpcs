import type { Metadata } from "next";
import { NewsForm } from "@/components/admin/news-form";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export const metadata: Metadata = { title: "New Post" };

export default async function NewNewsPage() {
  const lang = await getLang();
  const t = getDict(lang);

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-navy-900">{t.admin.newPost}</h2>
      <div className="rounded-2xl bg-white p-8 shadow-card">
        <NewsForm />
      </div>
    </div>
  );
}
