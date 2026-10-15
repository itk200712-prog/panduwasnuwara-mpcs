import { cookies } from "next/headers";
import type { Lang } from "@/lib/i18n";

/** Server Components / Route Handlers සඳහා භාෂාව කියවීම */
export async function getLang(): Promise<Lang> {
  try {
    const store = await cookies();
    return store.get("lang")?.value === "en" ? "en" : "si";
  } catch {
    return "si";
  }
}
