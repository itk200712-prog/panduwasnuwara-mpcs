import type { Metadata } from "next";
import { Mail, Phone, User } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading, EmptyState } from "@/components/ui/primitives";
import { CtaBanner } from "@/components/home/sections";
import { getDict, pickLocalized } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { getDirectors } from "@/lib/data";

export const metadata: Metadata = { title: "Board of Directors" };

export default async function DirectorsPage() {
  const lang = await getLang();
  const t = getDict(lang);
  const directors = await getDirectors();

  return (
    <>
      <PageHero badge={t.directors.badge} title={t.directors.title} text={t.directors.subtitle} />

      <section className="bg-slate-50 py-20">
        <div className="container-page">
          <SectionHeading badge={t.directors.boardTitle} title={t.directors.boardTitle} />

          {directors.length === 0 ? (
            <div className="mt-12">
              <EmptyState icon={User} title={t.common.noData} />
            </div>
          ) : (
            <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {directors.map((d) => (
                <div key={d.id} className="card-hover group overflow-hidden rounded-2xl bg-white shadow-card">
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-navy-800 to-brand-800">
                    {d.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={d.photo_url}
                        alt={pickLocalized(lang, d.name_si, d.name_en)}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10">
                          <User className="h-12 w-12 text-white/70" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-950/80 to-transparent p-4">
                      <p className="text-sm font-bold text-gold-400">{pickLocalized(lang, d.position_si, d.position_en)}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-navy-900">{pickLocalized(lang, d.name_si, d.name_en)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {pickLocalized(lang, d.bio_si, d.bio_en)}
                    </p>
                    {(d.email || d.phone) && (
                      <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                        {d.email && (
                          <a href={`mailto:${d.email}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-brand-700">
                            <Mail className="h-4 w-4 text-brand-600" />
                            {d.email}
                          </a>
                        )}
                        {d.phone && (
                          <a href={`tel:${d.phone}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-brand-700">
                            <Phone className="h-4 w-4 text-brand-600" />
                            {d.phone}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
