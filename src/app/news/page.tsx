import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, Newspaper } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Badge, EmptyState, SectionHeading } from "@/components/ui/primitives";
import { CtaBanner } from "@/components/home/sections";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { getNews } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "News" };

export default async function NewsPage() {
  const lang = await getLang();
  const t = getDict(lang);
  const isSi = lang === "si";
  const news = await getNews();

  return (
    <>
      <PageHero badge={t.news.badge} title={t.news.title} text={t.news.subtitle} />

      <section className="bg-slate-50 py-20">
        <div className="container-page">
          <SectionHeading badge={t.nav.news} title={t.news.title} text={t.news.subtitle} />

          {news.length === 0 ? (
            <div className="mt-12">
              <EmptyState icon={Newspaper} title={t.news.empty} />
            </div>
          ) : (
            <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card"
                >
                  <div className="relative h-48 bg-gradient-to-br from-brand-700 to-navy-900">
                    {item.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image_url} alt="" className="h-full w-full object-cover" />
                    )}
                    <div className="absolute left-4 top-4">
                      <Badge tone="gold">{t.news.categories[item.category]}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      {t.news.publishedOn} {formatDate(item.published_at ?? item.created_at, lang)}
                    </p>
                    <h2 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-navy-900 transition-colors group-hover:text-brand-700">
                      {isSi ? item.title_si : item.title_en}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {isSi ? item.excerpt_si : item.excerpt_en}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-bold text-brand-700">
                      <Calendar className="h-4 w-4" />
                      {t.common.readMore}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
