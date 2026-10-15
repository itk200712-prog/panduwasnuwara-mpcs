// ============================================================================
// Home — hero, stats, businesses, news, membership CTA
// ============================================================================

import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarDays, Newspaper, Phone, Send, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { SectionHead, StatsBand, PersonCard } from "@/components/site-sections";
import { HomeClientBits } from "@/components/home-client";
import { getBoard, getBusinesses, getNews, getSettings } from "@/lib/data";
import { SITE } from "@/lib/seed";

export default async function HomePage() {
  const [businesses, news, board, settings] = await Promise.all([
    getBusinesses(),
    getNews(),
    getBoard(),
    getSettings(),
  ]);
  const publicBusinesses = businesses.filter((b) => b.active);
  const pinned = news.filter((n) => n.pinned);
  const rest = news.filter((n) => !n.pinned).slice(0, 3);
  const newsList = [...pinned, ...rest].slice(0, 3);

  return (
    <>
      <SiteHeader />

      {/* HERO — background images auto-change (admin → System Settings) */}
      <section className="hero-dark relative overflow-hidden text-white">
        <HeroSlideshow images={settings.hero_images} />
        <div className="hero-overlay" />
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Est. 1976 — 50+ Years of Trust
          </div>
          <h1 className="mt-5 text-3xl sm:text-5xl font-black leading-[1.15] max-w-4xl">
            පඳුවස්නුවර නව බහු අරමුණු සමූපකාර සමිතිය
          </h1>
          <p className="mt-2 text-lg sm:text-2xl text-indigo-100 font-semibold">
            Panduwasnuwara New Multi Purpose Co-Operative Society LTD
          </p>
          <p className="mt-5 text-slate-200 max-w-2xl leading-relaxed text-[15px]">
            ග්‍රාමීය බැංකු, පාරිභෝගික භාණ්ඩ, නිෂ්පාදන නියෝජිතායතන සහ ඉන්ධන සැපයුම එක් වහලක් යටතේ සපයන
            විශ්වාසනීය සමූපකාර ආයතනයකි.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/membership/apply" className="btn btn-amber">
              සාමාජිකත්වයට අයදුම් කරන්න <ArrowRight size={17} />
            </Link>
            <Link href="/businesses" className="btn btn-outline !bg-white/10 !text-white !border-white/25 hover:!bg-white/20">
              අපේ ව්‍යාපාර බලන්න
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 text-[12px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2">
              <ShieldCheck size={14} className="text-emerald-300" /> Reg: {SITE.reg_no}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2">
              <CalendarDays size={14} className="text-amber-300" /> Est: {SITE.est}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2">
              <Phone size={14} className="text-sky-300" /> {SITE.phones[0]} | {SITE.phones[1]}
            </span>
          </div>
        </div>
      </section>

      {/* LIVE STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <StatsBand
          members={settings.members_total}
          voters={settings.voters_total}
          divisions={publicBusinesses.length}
          years={settings.years_of_service}
        />
      </section>

      {/* BUSINESSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <SectionHead
          badge="Our Business Divisions"
          title="අපේ ව්‍යාපාර"
          sub="සමිතියේ ව්‍යාපාර අංශ සහ සේවා — එක් වහලක් යටතේ."
          right={
            <Link href="/businesses" className="btn btn-outline">
              සියල්ල බලන්න →
            </Link>
          }
        />
        <HomeClientBits businesses={publicBusinesses.slice(0, 8)} />
      </section>

      {/* NEWS */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <SectionHead
            badge="News & Notices"
            title="නවතම පුවත් හා නිවේදන"
            sub="සමිතියේ නිල නිවේදන සහ පුවත්"
            right={
              <Link href="/news" className="btn btn-outline">
                සියල්ල බලන්න →
              </Link>
            }
          />
          <div className="grid gap-5 md:grid-cols-3">
            {newsList.map((n) => (
              <Link key={n.id} href="/news" className="card card-hover overflow-hidden">
                <div className="h-44 bg-gradient-to-br from-indigo-900 to-slate-800 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-white/30">
                    <Newspaper size={44} />
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="badge-blue rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                      {n.category === "vacancy" ? "VACANCY" : "NOTICE"}
                    </span>
                    {n.pinned && <span className="badge-pinned rounded-full px-2.5 py-0.5 text-[10px] font-bold">📌 PINNED</span>}
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <CalendarDays size={12} /> {n.date}
                  </div>
                  <h3 className="mt-2 font-extrabold text-slate-900 leading-snug line-clamp-2">{n.title_si}</h3>
                  <p className="mt-2 text-[12.5px] text-slate-500 leading-relaxed line-clamp-3">{n.desc_si.slice(0, 140)}…</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BOARD preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <SectionHead
          badge="Leadership"
          title="අධ්‍යක්ෂ මණ්ඩලය"
          sub="පඳුවස්නුවර නව බහු අරමුණු සමූපකාර සමිතියේ නායකත්ව කණ්ඩායම"
          right={
            <Link href="/board" className="btn btn-outline">
              සියල්ල බලන්න →
            </Link>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {board.slice(0, 3).map((p) => (
            <PersonCard key={p.order} person={p} />
          ))}
        </div>
      </section>

      {/* MEMBERSHIP CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="hero-dark rounded-3xl p-10 sm:p-14 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-amber-300">
              <BadgeCheck size={16} /> Membership
            </div>
            <h2 className="mt-3 text-2xl sm:text-4xl font-black leading-snug">
              පඳුවස්නුවර MPCS සමිතියේ සාමාජිකයෙකු වන්න
            </h2>
            <p className="mt-3 text-slate-300">
              අදම සාමාජිකත්වයට බැඳී අපේ සේවා සියල්ලෙන් ප්‍රයෝජන ගන්න — ග්‍රාමීය බැංකු, ණය පහසුකම්, වට්ටම් සහ තවත් බොහෝ දේ.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/membership/apply" className="btn btn-amber">
                <Send size={16} /> අයදුම් කරන්න
              </Link>
              <Link href="/membership/members" className="btn btn-outline !bg-white/10 !text-white !border-white/25 hover:!bg-white/20">
                සාමාජික ලේඛනය
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
