import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Sinhala } from "next/font/google";
import { LanguageProvider } from "@/context/language-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { getSettings } from "@/lib/data";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const sinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  variable: "--font-sinhala",
  display: "swap",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: `${settings.name_en} | ${settings.name_si}`,
      template: `%s | ${settings.name_en}`,
    },
    description: settings.tagline_en,
    keywords: ["cooperative", "samrudhi", "co-op", "sri lanka", "savings", "loans", "සමූපකාර"],
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  const settings = await getSettings();

  return (
    <html lang={lang}>
      <body className={`${jakarta.variable} ${sinhala.variable} font-sans`}>
        <LanguageProvider lang={lang}>
          <Header
            phone={settings.phone}
            email={settings.email}
            facebook={settings.facebook}
            youtube={settings.youtube}
            instagram={settings.instagram}
          />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
