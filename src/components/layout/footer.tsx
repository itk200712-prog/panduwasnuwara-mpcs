import Link from "next/link";
import { Facebook, Youtube, Instagram, MessageCircle, Phone, Mail, MapPin, Clock } from "lucide-react";
import { getDict, pickLocalized, type Lang } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { getSettings } from "@/lib/data";
import { FooterLogo } from "@/components/ui/logo";

export async function Footer() {
  const lang: Lang = await getLang();
  const t = getDict(lang);
  const settings = await getSettings();

  const quickLinks = [
    { href: "/about", label: t.nav.about },
    { href: "/members", label: t.nav.members },
    { href: "/directors", label: t.nav.directors },
    { href: "/news", label: t.nav.news },
    { href: "/careers", label: t.nav.careers },
    { href: "/contact", label: t.nav.contact },
  ];

  const serviceLinks = [
    { href: "/services", label: lang === "si" ? "ඉතිරිකිරීම් ගිණුම්" : "Savings Accounts" },
    { href: "/services", label: lang === "si" ? "ණය සේවා" : "Loan Services" },
    { href: "/services", label: lang === "si" ? "කෘෂිකාර්මික සේවා" : "Agricultural Services" },
    { href: "/business", label: lang === "si" ? "ව්‍යාපාර ඒකක" : "Business Units" },
    { href: "/gallery", label: t.nav.gallery },
    { href: "/services", label: lang === "si" ? "පුහුණු වැඩසටහන්" : "Training Programs" },
  ];

  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-5">
          <FooterLogo />
          <p className="text-sm leading-relaxed text-white/70">{t.footer.aboutText}</p>
          <div className="flex items-center gap-3">
            <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-gold-500 hover:text-navy-950">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={settings.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-gold-500 hover:text-navy-950">
              <Youtube className="h-4 w-4" />
            </a>
            <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-gold-500 hover:text-navy-950">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={settings.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-gold-500 hover:text-navy-950">
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-gold-400">{t.footer.quickLinks}</h3>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href + link.label}>
                <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-gold-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-gold-400">{t.footer.ourServices}</h3>
          <ul className="space-y-3">
            {serviceLinks.map((link, i) => (
              <li key={i}>
                <Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-gold-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-gold-400">{t.footer.contactInfo}</h3>
          <ul className="space-y-4 text-sm text-white/70">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              {pickLocalized(lang, settings.address_si, settings.address_en)}
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-gold-400" />
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-gold-400">{settings.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-gold-400" />
              <a href={`mailto:${settings.email}`} className="hover:text-gold-400">{settings.email}</a>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-4 w-4 shrink-0 text-gold-400" />
              {pickLocalized(lang, settings.hours_si, settings.hours_en)}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-white/50 sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {pickLocalized(lang, settings.name_si, settings.name_en)}. {t.footer.rights}.
          </p>
          <p className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-gold-500" />
            Next.js • Tailwind CSS • Supabase • Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
