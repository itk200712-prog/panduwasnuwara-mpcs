import { redirect } from "next/navigation";
import { User } from "lucide-react";
import { PortalNav } from "@/components/portal/portal-nav";
import { createClient } from "@/lib/supabase/server";
import { getDict, pickLocalized } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  const t = getDict(lang);

  let name = "";
  let memberNo = "";
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login?next=/portal");

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name_si, full_name_en, member_no")
      .eq("id", user.id)
      .maybeSingle();

    name = pickLocalized(lang, profile?.full_name_si, profile?.full_name_en) || user.email || "";
    memberNo = profile?.member_no ?? "";
  } catch {
    redirect("/login?next=/portal");
  }

  return (
    <div className="bg-slate-50 pb-20">
      {/* Header band */}
      <div className="relative overflow-hidden bg-navy-950">
        <div className="page-hero-pattern absolute inset-0" />
        <div className="container-page relative py-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-400">{t.portal.welcome}</p>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <User className="h-7 w-7 text-gold-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">{name}</h1>
              {memberNo && <p className="text-sm text-white/60">{t.common.memberNo}: {memberNo}</p>}
            </div>
          </div>
          <div className="mt-8">
            <PortalNav />
          </div>
        </div>
      </div>

      <div className="container-page pt-10">{children}</div>
    </div>
  );
}
