import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export const metadata: Metadata = {
  title: "පඳුවස්නුවර නව බහු අරමුණු සමූපකාර සමිතිය | Panduwasnuwara New MPCS",
  description:
    "Panduwasnuwara New Multi Purpose Co-Operative Society LTD — rural banking, consumer goods, product agencies and fuel supply under one roof.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("lang")?.value;
  const lang: Lang = raw === "en" ? "en" : "si";
  return (
    <html lang={lang}>
      <head>
        {/* ss වල භාවිතා කළ font එක පමණයි: Poppins (Latin) + Noto Sans Sinhala (සිංහල) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Noto+Sans+Sinhala:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider initialLang={lang}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
