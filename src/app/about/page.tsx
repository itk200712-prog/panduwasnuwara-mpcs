import type { Metadata } from "next";
import { CheckCircle2, Eye, HeartHandshake, Scale, Target, Users } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/primitives";
import { CtaBanner } from "@/components/home/sections";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export const metadata: Metadata = { title: "About Us" };

export default async function AboutPage() {
  const lang = await getLang();
  const t = getDict(lang);
  const isSi = lang === "si";

  const values = [
    {
      icon: HeartHandshake,
      title_si: "සහයෝගිතාව",
      title_en: "Cooperation",
      text_si: "එකිනෙකාට සහය වී එක්ව ඉදිරියට යාම",
      text_en: "Supporting each other and moving forward together",
    },
    {
      icon: Scale,
      title_si: "සාධාරණත්වය",
      title_en: "Fairness",
      text_si: "සියලුම සාමාජිකයින්ට සාධාරණ සැලකිල්ල",
      text_en: "Fair treatment for every member",
    },
    {
      icon: Users,
      title_si: "විශ්වාසය",
      title_en: "Trust",
      text_si: "පාරදෘශ්‍ය හා වගකීම් සහගත කළමනාකරණය",
      text_en: "Transparent and accountable management",
    },
    {
      icon: Target,
      title_si: "කැපවීම",
      title_en: "Commitment",
      text_si: "සාමාජික සේවයට නොනැවතෙන කැපවීම",
      text_en: "Unwavering commitment to member service",
    },
  ];

  const choosePoints = isSi
    ? [
        "වසර 25කට අධික විශ්වාසනීය සේවයක්",
        "සාමාජික මූලික තීරණ ගැනීමේ ක්‍රියාවලිය",
        "වාර්ෂික ස්වාධීන විගණනයකට භාජනය වීම",
        "තරුණ හා කාන්තා සංවර්ධන වැඩසටහන්",
        "තාක්ෂණය මත පදනම් වූ නවීන සේවා",
      ]
    : [
        "Over 25 years of trusted service",
        "Member-driven decision making",
        "Subject to annual independent audits",
        "Youth and women development programs",
        "Modern technology-based services",
      ];

  return (
    <>
      <PageHero badge={t.about.badge} title={t.about.title} text={t.about.subtitle} />

      {/* Mission / Vision */}
      <section className="bg-white py-20">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-brand-100 bg-brand-50 p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700 text-white">
              <Target className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">{t.about.missionTitle}</h2>
            <p className="mt-4 leading-relaxed text-slate-700">{t.about.missionText}</p>
          </div>
          <div className="rounded-3xl border border-gold-100 bg-gold-50 p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500 text-navy-950">
              <Eye className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">{t.about.visionTitle}</h2>
            <p className="mt-4 leading-relaxed text-slate-700">{t.about.visionText}</p>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="bg-navy-950 py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading badge={t.nav.about} title={t.about.historyTitle} text={t.about.historyText} align="left" light />
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[
              { value: "5,000+", label: isSi ? "සාමාජිකයින්" : "Members" },
              { value: "25+", label: isSi ? "වසර" : "Years" },
              { value: "50+", label: isSi ? "සේවකයින්" : "Employees" },
              { value: "10+", label: isSi ? "ශාඛා" : "Branches" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                <p className="text-3xl font-extrabold text-gold-400">{s.value}</p>
                <p className="mt-2 text-sm text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-20">
        <div className="container-page">
          <SectionHeading badge={t.about.valuesTitle} title={t.about.valuesTitle} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title_en} className="card-hover rounded-2xl bg-white p-8 text-center shadow-card">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                  <v.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{isSi ? v.title_si : v.title_en}</h3>
                <p className="mt-2 text-sm text-slate-600">{isSi ? v.text_si : v.text_en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-white py-20">
        <div className="container-page">
          <SectionHeading badge={t.about.chooseTitle} title={t.about.chooseTitle} />
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
            {choosePoints.map((point) => (
              <div key={point} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-brand-600" />
                <p className="font-medium text-navy-800">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
