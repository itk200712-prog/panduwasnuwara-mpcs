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
      <body>
        <LanguageProvider initialLang={lang}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
