import { Leaf } from "lucide-react";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 shadow-md">
        <svg viewBox="0 0 48 48" fill="none" className="h-8 w-8" aria-hidden="true">
          <circle cx="24" cy="24" r="13" stroke="white" strokeWidth="3" opacity="0.9" />
          <path
            d="M24 34c0-7 4-12 10-13-1 8-5 12-10 13Zm0 0c0-7-4-12-10-13 1 8 5 12 10 13Zm0 0V18"
            stroke="#F0C24B"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className={`text-base font-extrabold tracking-tight ${light ? "text-white" : "text-navy-900"}`}>
          ශ්‍රී සමෘද්ධි
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${light ? "text-gold-400" : "text-brand-700"}`}>
          Cooperative Society
        </span>
      </span>
    </span>
  );
}

export function FooterLogo() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
        <Leaf className="h-6 w-6 text-gold-400" />
      </span>
      <div className="leading-tight">
        <p className="text-lg font-extrabold text-white">ශ්‍රී සමෘද්ධි</p>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400">Cooperative Society</p>
      </div>
    </div>
  );
}
