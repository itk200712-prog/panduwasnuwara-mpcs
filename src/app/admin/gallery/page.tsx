import type { Metadata } from "next";
import { Images } from "lucide-react";
import { EmptyState } from "@/components/ui/primitives";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { getAdminGallery } from "@/lib/data";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export const metadata: Metadata = { title: "Manage Gallery" };

export default async function AdminGalleryPage() {
  const lang = await getLang();
  const t = getDict(lang);
  const items = await getAdminGallery();

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-navy-900">{t.admin.manageGallery}</h2>
      {items.length === 0 ? (
        <EmptyState icon={Images} title={t.common.empty} />
      ) : (
        <GalleryManager items={items} />
      )}
    </div>
  );
}
