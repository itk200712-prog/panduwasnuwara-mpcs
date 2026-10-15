import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/primitives";
import { ContactForm } from "@/components/contact/contact-form";
import { getDict, pickLocalized } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const lang = await getLang();
  const t = getDict(lang);
  const settings = await getSettings();

  const info = [
    {
      icon: MapPin,
      label: t.common.address,
      value: pickLocalized(lang, settings.address_si, settings.address_en),
      href: null,
    },
    {
      icon: Phone,
      label: t.common.phone,
      value: settings.phone,
      href: `tel:${settings.phone.replace(/\s/g, "")}`,
    },
    {
      icon: MessageCircle,
      label: t.common.hotline,
      value: settings.hotline,
      href: `tel:${settings.hotline.replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      label: t.common.email,
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    {
      icon: Clock,
      label: t.contact.hoursTitle,
      value: pickLocalized(lang, settings.hours_si, settings.hours_en),
      href: null,
    },
  ];

  return (
    <>
      <PageHero badge={t.contact.badge} title={t.contact.title} text={t.contact.subtitle} />

      <section className="bg-white py-20">
        <div className="container-page grid gap-12 lg:grid-cols-5">
          {/* Info */}
          <div className="lg:col-span-2">
            <SectionHeading badge={t.contact.infoTitle} title={t.contact.infoTitle} align="left" />
            <div className="mt-8 space-y-4">
              {info.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-colors hover:border-brand-200 hover:bg-brand-50"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    <row.icon className="h-5 w-5 text-brand-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{row.label}</p>
                    {row.href ? (
                      <a href={row.href} className="mt-0.5 block font-semibold text-navy-900 hover:text-brand-700">
                        {row.value}
                      </a>
                    ) : (
                      <p className="mt-0.5 font-semibold text-navy-900">{row.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-card lg:col-span-3">
            <h2 className="text-2xl font-bold text-navy-900">{t.contact.formTitle}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.contact.formText}</p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
