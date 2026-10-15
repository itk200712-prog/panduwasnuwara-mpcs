import type { Metadata } from "next";
import { CheckCircle2, Percent } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Badge } from "@/components/ui/primitives";
import { IconMap } from "@/components/ui/icon-map";
import { CtaBanner } from "@/components/home/sections";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { getServices } from "@/lib/data";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  const lang = await getLang();
  const t = getDict(lang);
  const isSi = lang === "si";
  const services = await getServices();

  return (
    <>
      <PageHero badge={t.services.badge} title={t.services.title} text={t.services.subtitle} />

      <section className="bg-white py-20">
        <div className="container-page space-y-10">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className={`overflow-hidden rounded-3xl border border-slate-100 shadow-card ${
                idx % 2 === 1 ? "bg-slate-50" : "bg-white"
              }`}
            >
              <div className="grid gap-0 lg:grid-cols-2">
                {/* Icon side */}
                <div className="flex items-center justify-center bg-gradient-to-br from-navy-900 to-brand-800 p-12">
                  <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white/10 text-gold-400 backdrop-blur">
                    <IconMap name={service.icon} className="h-14 w-14" />
                  </div>
                </div>

                {/* Content side */}
                <div className="p-8 lg:p-12">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold text-navy-900">
                      {isSi ? service.title_si : service.title_en}
                    </h2>
                    {service.highlight && <Badge tone="gold">{service.highlight}</Badge>}
                  </div>
                  <p className="mt-4 leading-relaxed text-slate-700">
                    {isSi ? service.summary_si : service.summary_en}
                  </p>
                  {(isSi ? service.description_si : service.description_en) ? (
                    <p className="mt-3 leading-relaxed text-slate-600">
                      {isSi ? service.description_si : service.description_en}
                    </p>
                  ) : null}

                  <div className="mt-6">
                    <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-700">
                      <Percent className="h-4 w-4" />
                      {t.services.featuresLabel}
                    </p>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {(service.features ?? []).map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                          <span className="text-sm text-slate-700">{f[isSi ? "si" : "en"]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <p className="rounded-2xl border border-gold-200 bg-gold-50 p-6 text-center text-sm font-medium text-gold-800">
            {t.services.interestNote}
          </p>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
