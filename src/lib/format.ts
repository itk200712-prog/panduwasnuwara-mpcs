import type { Lang } from "./i18n";

const SI_MONTHS = [
  "ජනවාරි",
  "පෙබ‍රවාරි",
  "මාර්තු",
  "අප්‍රේල්",
  "මැයි",
  "ජූනි",
  "ජූලි",
  "අගෝස්තු",
  "සැප්තැම්බර්",
  "ඔක්තෝබර්",
  "නොවැම්බර්",
  "දෙසැම්බර්",
];

const EN_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** රුපියල් මුදල් ආකෘතිය — "රු. 25,000.00" / "LKR 25,000.00" */
export function formatCurrency(value: number | string | null | undefined, lang: Lang = "si"): string {
  const num = typeof value === "string" ? parseFloat(value) : value ?? 0;
  const safe = Number.isFinite(num as number) ? (num as number) : 0;
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe);
  return lang === "si" ? `රු. ${formatted}` : `LKR ${formatted}`;
}

/** කෙටි මුදල් ආකෘතිය — "රු. 12.5M" */
export function formatCurrencyShort(value: number | string | null | undefined, lang: Lang = "si"): string {
  const num = typeof value === "string" ? parseFloat(value) : value ?? 0;
  const safe = Number.isFinite(num as number) ? (num as number) : 0;
  const prefix = lang === "si" ? "රු." : "LKR";
  if (Math.abs(safe) >= 1_000_000_000) return `${prefix} ${(safe / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(safe) >= 1_000_000) return `${prefix} ${(safe / 1_000_000).toFixed(1)}M`;
  if (Math.abs(safe) >= 1_000) return `${prefix} ${(safe / 1_000).toFixed(1)}K`;
  return `${prefix} ${safe.toFixed(0)}`;
}

export function formatNumber(value: number | string | null | undefined): string {
  const num = typeof value === "string" ? parseFloat(value) : value ?? 0;
  return new Intl.NumberFormat("en-US").format(Number.isFinite(num as number) ? (num as number) : 0);
}

/** "15 මාර්තු 2026" / "15 Mar 2026" */
export function formatDate(iso: string | null | undefined, lang: Lang = "si"): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const month = lang === "si" ? SI_MONTHS[d.getMonth()] : EN_MONTHS[d.getMonth()];
  return `${d.getDate()} ${month} ${d.getFullYear()}`;
}

/** "මාර්තු 2026" / "Mar 2026" */
export function formatMonthYear(iso: string | null | undefined, lang: Lang = "si"): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const month = lang === "si" ? SI_MONTHS[d.getMonth()] : EN_MONTHS[d.getMonth()];
  return `${month} ${d.getFullYear()}`;
}

/** "2026-03-15" (input[type=date] සඳහා) */
export function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}
