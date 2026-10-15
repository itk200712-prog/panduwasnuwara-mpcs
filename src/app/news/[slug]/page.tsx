import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { buttonStyles } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { CtaBanner } from "@/components/home/sections";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { getNewsBySlug, getNews } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "News" };

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getLang();
  const t = getDict(lang);
  const isSi = lang === "si";
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  const related = (await getNews(4)).filter((n) => n.slug !== item.slug).slice(0, 3);

  return (
    <>
      <PageHero
        badge={t.news.categories[item.category]}
        title={isSi ? item.title_si : item.title_en}
        text={`${t.news.publishedOn} ${formatDate(item.published_at ?? item.created_at, lang)}`}
      />

      <section className="bg-white py-16">
        <div className="container-page max-w-4xl">
          <Link href="/news" className={buttonStyles("outline", "sm")}>
            <ArrowLeft className="h-4 w-4" />
            {t.nav.news}
          </Link>

          <article className="mt-8 overflow-hidden rounded-3xl border border-slate-100 shadow-card">
            {item.image_url && (
              <div className="relative h-72 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url} alt="" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="p-8 sm:p-12">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="gold">{t.news.categories[item.category]}</Badge>
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="h-4 w-4" />
                  {formatDate(item.published_at ?? item.created_at, lang)}
                </span>
              </div>

              <h1 className="mt-5 text-2xl font-extrabold leading-snug text-navy-900 sm:text-3xl">
                {isSi ? item.title_si : item.title_en}
              </h1>

              <div className="prose-coop mt-8 whitespace-pre-wrap text-[17px]">
                {isSi ? item.content_si : item.content_en}
              </div>
            </div>
          </article>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold text-navy-900">{t.home.newsTitle}</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                {related.map((n) => (
                  <Link
                    key={n.id}
                    href={`/news/${n.slug}`}
                    className="card-hover rounded-2xl border border-slate-100 bg-white p-5 shadow-card"
                  >
                    <p className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(n.published_at ?? n.created_at, lang)}
                    </p>
                    <h3 className="mt-2 line-clamp-2 text-sm font-bold text-navy-900 hover:text-brand-700">
                      {isSi ? n.title_si : n.title_en}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
