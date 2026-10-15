"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Mail, Menu, Phone, X, Facebook, Youtube, Instagram } from "lucide-react";
import { useLang } from "@/context/language-context";
import { Logo } from "@/components/ui/logo";
import { LanguageSwitcher } from "./language-switcher";
import { UserActions } from "./user-actions";

const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/business", key: "business" },
  { href: "/members", key: "members" },
  { href: "/directors", key: "directors" },
  { href: "/news", key: "news" },
  { href: "/gallery", key: "gallery" },
  { href: "/careers", key: "careers" },
  { href: "/contact", key: "contact" },
] as const;

export function Header({ phone, email, facebook, youtube, instagram }: {
  phone: string;
  email: string;
  facebook: string;
  youtube: string;
  instagram: string;
}) {
  const { t, lang } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="hidden bg-navy-950 text-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs">
          <div className="flex items-center gap-6">
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-white/80 transition-colors hover:text-gold-400">
              <Phone className="h-3.5 w-3.5" />
              {phone}
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-2 text-white/80 transition-colors hover:text-gold-400">
              <Mail className="h-3.5 w-3.5" />
              {email}
            </a>
            <span className="flex items-center gap-2 text-white/60">
              <Clock className="h-3.5 w-3.5" />
              {lang === "si" ? "සඳු - සිකු: පෙ.ව. 8.30 - ප.ව. 4.30" : "Mon - Fri: 8.30 AM - 4.30 PM"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <a href={facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="text-white/70 transition-colors hover:text-gold-400">
                <Facebook className="h-4 w-4" />
              </a>
              <a href={youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="text-white/70 transition-colors hover:text-gold-400">
                <Youtube className="h-4 w-4" />
              </a>
              <a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-white/70 transition-colors hover:text-gold-400">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-lg px-2.5 py-2 text-[13px] font-semibold transition-colors ${
                    active ? "text-brand-700" : "text-navy-800 hover:text-brand-700"
                  }`}
                >
                  {t.nav[item.key]}
                  {active && <span className="absolute inset-x-2.5 -bottom-[13px] h-[3px] rounded-full bg-brand-600" />}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            <UserActions />
          </div>

          <button
            className="rounded-lg p-2 text-navy-900 hover:bg-slate-100 xl:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-slate-100 bg-white px-4 pb-5 pt-3 shadow-lg xl:hidden">
            <nav className="grid grid-cols-2 gap-1">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${
                      active ? "bg-brand-50 text-brand-700" : "text-navy-800 hover:bg-slate-50"
                    }`}
                  >
                    {t.nav[item.key]}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4">
              <LanguageSwitcher />
              <div onClick={() => setOpen(false)}>
                <UserActions />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
