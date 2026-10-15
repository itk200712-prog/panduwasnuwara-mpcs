"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Clock, Quote, Star, HeartHandshake, ShieldCheck, Users, TrendingUp } from "lucide-react";
import { useLang } from "@/context/language-context";
import { buttonStyles } from "@/components/ui/button";
import { SectionHeading, Badge } from "@/components/ui/primitives";
import { IconMap } from "@/components/ui/icon-map";
import { formatDate } from "@/lib/format";
import type { BusinessUnit, NewsItem, ServiceItem } from "@/types/database";

// ---------------------------------------------------------------------------
//  About preview
// ---------------------------------------------------------------------------
export function AboutPreview() {
  const { t, lang } = useLang();

  const points =
    lang === "si"
      ? [
          "සාමාජිකයින් 5,000කට අධික ශක්තිමත් පවුලක්",
          "අඩු පොලියට ණය සහ ඉහළ පොලියට ඉතිරිකිරීම්",
          "පාරදෘශ්‍ය මූල්‍ය කළමනාකරණය සහ වාර්ෂික විගණන",
          "සාමාජික සුභසාධන හා රක්ෂණ වැඩසටහන්",
        ]
      : [
          "A strong family of over 5,000 members",
          "Low-interest loans and high-interest savings",
          "Transparent financial management with annual audits",
          "Member welfare and insurance programs",
        ];

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2">
        {/* Image */}
        <div className="relative">
          <div className="absolute -left-5 -top-5 h-32 w-32 rounded-2xl bg-brand-100" />
          <div className="absolute -bottom-5 -right-5 h-32 w-32 rounded-full bg-gold-100" />
          <div className="relative overflow-hidden rounded-3xl shadow-card-hover">
            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=70"
              alt="Cooperative members"
              width={600}
              height={460}
              className="h-[420px] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-8 left-8 rounded-2xl border border-brand-100 bg-white px-6 py-4 shadow-card">
            <p className="text-3xl font-extrabold text-brand-700">25+</p>
            <p className="text-sm font-semibold text-navy-800">
              {lang === "si" ? "වසරක සේවය" : "Years of Service"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div>
          <SectionHeading
            badge={t.nav.about}
            title={t.home.aboutTitle}
            text={t.home.aboutText}
            align="left"
          />
          <ul className="mt-8 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <span className="text-[15px] text-slate-700">{point}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/about" className={buttonStyles("primary", "md")}>
              {t.common.learnMore}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className={buttonStyles("outline", "md")}>
              {t.common.contactUs}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
//  Services preview
// ---------------------------------------------------------------------------
export function ServicesPreview({ services }: { services: ServiceItem[] }) {
  const { t, lang } = useLang();

  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading badge={t.nav.services} title={t.home.servicesTitle} text={t.home.servicesText} />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <div
              key={service.id}
              className="card-hover group relative flex flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-card"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {service.highlight && (
                <div className="absolute right-5 top-5">
                  <Badge tone="gold">{service.highlight}</Badge>
                </div>
              )}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white">
                <IconMap name={service.icon} className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-navy-900">
                {lang === "si" ? service.title_si : service.title_en}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {lang === "si" ? service.summary_si : service.summary_en}
              </p>
              <ul className="mt-4 space-y-2">
                {(service.features ?? []).slice(0, 4).map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                    {f[lang]}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 transition-colors hover:text-brand-800"
                >
                  {t.common.readMore}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
//  Business preview
// ---------------------------------------------------------------------------
export function BusinessPreview({ units }: { units: BusinessUnit[] }) {
  const { t, lang } = useLang();

  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-28">
      <div className="page-hero-pattern absolute inset-0" />
      <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="container-page relative">
        <SectionHeading badge={t.nav.business} title={t.home.businessTitle} text={t.home.businessText} light />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {units.map((unit) => (
            <div
              key={unit.id}
              className="group rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:bg-white/10"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/20 p-3.5 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-navy-950">
                <IconMap name={unit.icon} className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">
                {lang === "si" ? unit.title_si : unit.title_en}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                {lang === "si" ? unit.description_si : unit.description_en}
              </p>
              {unit.highlight && (
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gold-400">{unit.highlight}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/business" className={buttonStyles("outlineLight", "lg")}>
            {t.common.viewAll}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
//  News preview
// ---------------------------------------------------------------------------
export function NewsPreview({ news }: { news: NewsItem[] }) {
  const { t, lang } = useLang();

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading badge={t.nav.news} title={t.home.newsTitle} text={t.home.newsText} align="left" />
          <Link href="/news" className={buttonStyles("outline", "md")}>
            {t.common.viewAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {news.slice(0, 3).map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="card-hover group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card"
            >
              <div className="relative h-52 overflow-hidden bg-gradient-to-br from-brand-700 to-navy-900">
                {item.image_url && (
                  <Image
                    src={item.image_url}
                    alt={lang === "si" ? item.title_si : item.title_en}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute left-4 top-4">
                  <Badge tone="gold">{t.news.categories[item.category]}</Badge>
                </div>
              </div>
              <div className="p-6">
                <p className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(item.published_at ?? item.created_at, lang)}
                </p>
                <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-navy-900 transition-colors group-hover:text-brand-700">
                  {lang === "si" ? item.title_si : item.title_en}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {lang === "si" ? item.excerpt_si : item.excerpt_en}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-700">
                  {t.common.readMore}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
//  Testimonials
// ---------------------------------------------------------------------------
const TESTIMONIALS = [
  {
    name_si: "කේ. ආර්. පෙරේරා",
    name_en: "K. R. Perera",
    role_si: "ගොවි සාමාජිකයෙක්",
    role_en: "Farmer Member",
    text_si: "සමිතියෙන් ලැබුණු කෘෂි ණය නිසා මගේ වගාව දියුණු කරගන්න පුළුවන් වුණා. අඩු පොලියට ණය ලැබෙනවා.",
    text_en: "The agricultural loan from the society helped me expand my farming. The interest rates are very fair.",
  },
  {
    name_si: "එස්. ඩබ්ලිව්. සිල්වා",
    name_en: "S. W. Silva",
    role_si: "කුඩා ව්‍යාපාර හිමියෙක්",
    role_en: "Small Business Owner",
    text_si: "ව්‍යාපාර ණය පහසුකම නිසා මගේ වෙළඳසැල පුළුල් කරගන්න හැකි වුණා. සේවය සුහදශීලීයි.",
    text_en: "The business loan facility helped me expand my shop. The service is very friendly.",
  },
  {
    name_si: "එච්. එම්. ජයවර්ධන",
    name_en: "H. M. Jayawardena",
    role_si: "ගුරු සාමාජිකයෙක්",
    role_en: "Teacher Member",
    text_si: "දරුවන්ගේ අධ්‍යාපනය සඳහා ඉතිරිකිරීම් කරන්න හොඳම තැන සමූපකාරය. විශ්වාසනීයයි.",
    text_en: "The cooperative is the best place to save for my children's education. Very trustworthy.",
  },
];

export function Testimonials() {
  const { t, lang } = useLang();

  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading badge={t.home.testimonialsTitle} title={t.home.testimonialsTitle} text={t.home.testimonialsText} />

        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <div key={item.name_en} className="card-hover relative rounded-2xl bg-white p-8 shadow-card">
              <Quote className="absolute right-6 top-6 h-10 w-10 text-brand-100" />
              <div className="flex gap-1 text-gold-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-700">
                &ldquo;{lang === "si" ? item.text_si : item.text_en}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                  {(lang === "si" ? item.name_si : item.name_en).charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-navy-900">{lang === "si" ? item.name_si : item.name_en}</p>
                  <p className="text-xs text-slate-500">{lang === "si" ? item.role_si : item.role_en}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
//  CTA banner
// ---------------------------------------------------------------------------
export function CtaBanner() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-brand-700 via-brand-800 to-navy-900 py-16 lg:py-20">
      <div className="page-hero-pattern absolute inset-0" />
      <div className="container-page relative">
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{t.home.ctaTitle}</h2>
            <p className="mt-3 text-base text-white/80 sm:text-lg">{t.home.ctaText}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className={buttonStyles("gold", "lg")}>
              <HeartHandshake className="h-5 w-5" />
              {t.home.ctaButton}
            </Link>
            <Link href="/contact" className={buttonStyles("outlineLight", "lg")}>
              {t.common.contactUs}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
