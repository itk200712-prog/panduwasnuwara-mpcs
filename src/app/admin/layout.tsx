import { ShieldCheck } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  const t = getDict(lang);

  return (
    <div className="bg-slate-50 pb-20">
      <div className="relative overflow-hidden bg-navy-950">
        <div className="page-hero-pattern absolute inset-0" />
        <div className="container-page relative py-12">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold-400">
            <ShieldCheck className="h-4 w-4" />
            {t.admin.title}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-white">{t.admin.title}</h1>
          <div className="mt-8">
            <AdminNav />
          </div>
        </div>
      </div>
      <div className="container-page pt-10">{children}</div>
    </div>
  );
}
