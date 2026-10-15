import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { IconMap } from "@/components/ui/icon-map";
import { CtaBanner } from "@/components/home/sections";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { getBusinessUnits } from "@/lib/data";

export const metadata: Metadata = { title: "Business" };

export default async function BusinessPage() {
  const lang = await getLang();
  const t = getDict(lang);
  const isSi = lang === "si";
  const units = await getBusinessUnits();

  return (
    <>
      <PageHero badge={t.business.badge} title={t.business.title} text={t.business.subtitle} />

      <section className="bg-white py-20">
        <div className="container-page space-y-12">
          {units.map((unit, idx) => (
            <div
              key={unit.id}
              className={`overflow-hidden rounded-3xl border border-slate-100 shadow-card ${
                idx % 2 === 1 ? "bg-slate-50" : "bg-white"
              }`}
            >
              <div className={`grid items-center gap-0 lg:grid-cols-2 ${idx % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                {/* Image / icon panel */}
                <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-gradient-to-br from-brand-700 to-navy-900">
                  {unit.image_url ? (
                    <Image src={unit.image_url} alt={isSi ? unit.title_si : unit.title_en} fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-5">
                      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 text-gold-400">
                        <IconMap name={unit.icon} className="h-12 w-12" />
                      </div>
                      {unit.highlight && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-4 py-1.5 text-xs font-bold text-navy-950">
                          <Sparkles className="h-3.5 w-3.5" />
                          {unit.highlight}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12">
                  <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">
                    {isSi ? unit.title_si : unit.title_en}
                  </h2>
                  <p className="mt-5 leading-relaxed text-slate-700">
                    {isSi ? unit.description_si : unit.description_en}
                  </p>
                  {unit.highlight && (
                    <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700">
                      <Sparkles className="h-4 w-4" />
                      {unit.highlight}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
