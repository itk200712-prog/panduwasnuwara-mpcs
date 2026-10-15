"use client";

import { useLang } from "@/context/language-context";

export function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="inline-flex items-center rounded-full border border-white/20 bg-white/5 p-0.5 text-xs font-bold">
      <button
        onClick={() => setLang("si")}
        className={`rounded-full px-3 py-1 transition-colors ${
          lang === "si" ? "bg-gold-500 text-navy-950" : "text-white/80 hover:text-white"
        }`}
        aria-label="සිංහල"
      >
        සිං
      </button>
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-1 transition-colors ${
          lang === "en" ? "bg-gold-500 text-navy-950" : "text-white/80 hover:text-white"
        }`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
