import type { Metadata } from "next";
import { BadgeCheck, User } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { ProfileForm } from "@/components/portal/profile-form";
import { createClient } from "@/lib/supabase/server";
import { getDict, pickLocalized } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";
import { formatDate } from "@/lib/format";
import type { Profile } from "@/types/database";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const lang = await getLang();
  const t = getDict(lang);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const profile = data as Profile | null;

  return (
    <div className="space-y-8">
      {/* Summary card */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-card">
        <div className="flex flex-wrap items-center gap-5 bg-gradient-to-r from-navy-900 to-brand-800 p-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10">
            <User className="h-9 w-9 text-gold-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">
              {pickLocalized(lang, profile?.full_name_si, profile?.full_name_en) || user.email}
            </h2>
            <p className="mt-1 text-white/70">{profile?.member_no}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={profile?.status === "active" ? "green" : "amber"}>
              <BadgeCheck className="h-3.5 w-3.5" />
              {t.admin.statusLabels[profile?.status ?? "pending"]}
            </Badge>
            <Badge tone="gold">{t.admin.roles[profile?.role ?? "member"]}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
          {[
            { label: t.common.memberNo, value: profile?.member_no ?? "—" },
            { label: t.auth.nic, value: profile?.nic ?? "—" },
            { label: t.common.email, value: profile?.email ?? user.email ?? "—" },
            { label: t.portal.memberSince, value: formatDate(profile?.joined_at ?? profile?.created_at, lang) },
          ].map((row) => (
            <div key={row.label} className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">{row.label}</p>
              <p className="mt-1 font-semibold text-navy-900">{row.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit form */}
      <div className="rounded-2xl bg-white p-8 shadow-card">
        <h2 className="text-lg font-bold text-navy-900">{t.portal.myProfile}</h2>
        <div className="mt-6">
          <ProfileForm
            userId={user.id}
            initial={{
              full_name_si: profile?.full_name_si ?? "",
              full_name_en: profile?.full_name_en ?? "",
              phone: profile?.phone ?? "",
              address_si: profile?.address_si ?? "",
              address_en: profile?.address_en ?? "",
              occupation_si: profile?.occupation_si ?? "",
              occupation_en: profile?.occupation_en ?? "",
              email: profile?.email ?? user.email ?? "",
            }}
          />
        </div>
      </div>
    </div>
  );
}
