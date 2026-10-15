"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, Handshake, PlayCircle, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { useLang } from "@/context/language-context";
import { buttonStyles } from "@/components/ui/button";
import { formatCurrencyShort, formatNumber } from "@/lib/format";
import type { SiteStats } from "@/types/database";

export function Hero({ stats }: { stats: SiteStats }) {
  const { t, lang } = useLang();

  return (
    <section className="relative overflow-hidden bg-navy-950">
      {/* Decorative background */}
      <div className="hero-pattern absolute inset-0" />
      <div className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-brand-600/20 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-gold-500/15 blur-3xl" />

      <div className="container-page relative py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left — content */}
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gold-300">
              <BadgeCheck className="h-4 w-4" />
              {t.home.badge}
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
              {t.home.heroTitle1}
              <br />
              <span className="gradient-text">{t.home.heroTitle2}</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              {t.home.heroText}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/register" className={buttonStyles("gold", "lg")}>
                {t.home.cta1}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/services" className={buttonStyles("outlineLight", "lg")}>
                <PlayCircle className="h-5 w-5" />
                {t.home.cta2}
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
              {[
                { icon: ShieldCheck, label: lang === "si" ? "ආරක්ෂිත තැන්පතු" : "Secure Deposits" },
                { icon: Handshake, label: lang === "si" ? "සාධාරණ ණය" : "Fair Loans" },
                { icon: TrendingUp, label: lang === "si" ? "ඉහළ පොලිය" : "High Interest" },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-2 text-sm font-medium text-white/80">
                  <item.icon className="h-5 w-5 text-gold-400" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right — visual */}
          <div className="relative animate-fade-in">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -left-6 -top-6 h-24 w-24 rounded-2xl bg-gold-500/25" />
              <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-2xl border-2 border-gold-500/40" />
              <div className="relative overflow-hidden rounded-3xl border-4 border-white/10 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=70"
                  alt="Cooperative team"
                  width={560}
                  height={420}
                  className="h-[380px] w-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
              </div>

              {/* Floating cards */}
              <div className="absolute -left-4 bottom-8 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl sm:-left-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100">
                  <Users className="h-5 w-5 text-brand-700" />
                </div>
                <div>
                  <p className="text-lg font-extrabold leading-none text-navy-900">
                    {formatNumber(stats.members)}+
                  </p>
                  <p className="text-xs text-slate-500">{t.home.statMembers}</p>
                </div>
              </div>

              <div className="absolute -right-2 top-8 rounded-2xl bg-gold-500 px-5 py-4 shadow-xl sm:-right-6">
                <p className="text-2xl font-extrabold leading-none text-navy-950">{stats.years}+</p>
                <p className="mt-1 text-xs font-semibold text-navy-900/80">{t.home.statYears}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats band */}
      <div className="relative border-t border-white/10 bg-navy-900/60">
        <div className="container-page grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
          {[
            { value: `${formatNumber(stats.members)}+`, label: t.home.statMembers, icon: Users },
            { value: formatCurrencyShort(stats.savings, lang), label: t.home.statSavings, icon: ShieldCheck },
            { value: formatCurrencyShort(stats.loans, lang), label: t.home.statLoans, icon: TrendingUp },
            { value: `${stats.years}+`, label: t.home.statYears, icon: BadgeCheck },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <item.icon className="h-6 w-6 text-gold-400" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-white sm:text-2xl">{item.value}</p>
                <p className="text-xs text-white/60 sm:text-sm">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
