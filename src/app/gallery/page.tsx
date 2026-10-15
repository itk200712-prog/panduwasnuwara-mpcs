import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/primitives";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { CtaBanner } from "@/components/home/sections";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { getGallery } from "@/lib/data";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const lang = await getLang();
  const t = getDict(lang);
  const items = await getGallery();

  return (
    <>
      <PageHero badge={t.gallery.badge} title={t.gallery.title} text={t.gallery.subtitle} />

      <section className="bg-slate-50 py-20">
        <div className="container-page">
          <SectionHeading badge={t.nav.gallery} title={t.gallery.title} text={t.gallery.subtitle} />
          <GalleryGrid items={items} />
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
