import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
//  Badge
// ---------------------------------------------------------------------------
const badgeTones = {
  brand: "bg-brand-100 text-brand-800",
  gold: "bg-gold-100 text-gold-800",
  navy: "bg-navy-100 text-navy-800",
  green: "bg-emerald-100 text-emerald-800",
  red: "bg-red-100 text-red-700",
  amber: "bg-amber-100 text-amber-800",
  gray: "bg-slate-100 text-slate-700",
} as const;

export function Badge({
  children,
  tone = "brand",
  className = "",
}: {
  children: React.ReactNode;
  tone?: keyof typeof badgeTones;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badgeTones[tone]} ${className}`}>
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
//  SectionHeading
// ---------------------------------------------------------------------------
export function SectionHeading({
  badge,
  title,
  text,
  align = "center",
  light = false,
}: {
  badge?: string;
  title: string;
  text?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex flex-col gap-4 ${alignCls}`}>
      {badge && (
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${
            light ? "bg-white/10 text-gold-300" : "bg-brand-100 text-brand-800"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${light ? "bg-gold-400" : "bg-brand-600"}`} />
          {badge}
        </span>
      )}
      <h2
        className={`text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.75rem] ${
          light ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {text && (
        <p className={`max-w-2xl text-base leading-relaxed sm:text-lg ${light ? "text-white/80" : "text-slate-600"}`}>
          {text}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
//  StatCard
// ---------------------------------------------------------------------------
export function StatCard({
  icon: Icon,
  value,
  label,
  tone = "brand",
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  tone?: "brand" | "gold" | "navy" | "white";
}) {
  const tones = {
    brand: "bg-brand-50 text-brand-700",
    gold: "bg-gold-50 text-gold-700",
    navy: "bg-navy-50 text-navy-700",
    white: "bg-white/10 text-white",
  } as const;
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-navy-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
//  EmptyState
// ---------------------------------------------------------------------------
export function EmptyState({ icon: Icon, title, text }: { icon?: LucideIcon; title: string; text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
          <Icon className="h-7 w-7 text-slate-400" />
        </div>
      )}
      <p className="text-lg font-semibold text-navy-900">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
//  Form fields
// ---------------------------------------------------------------------------
const fieldCls =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 transition-colors focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100";

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-navy-800">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input className={`${fieldCls} ${className}`} {...rest} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return <textarea className={`${fieldCls} min-h-[120px] resize-y ${className}`} {...rest} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", ...rest } = props;
  return <select className={`${fieldCls} ${className}`} {...rest} />;
}
