import type { Metadata } from "next";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/ui/primitives";
import { MembersTable } from "@/components/admin/members-table";
import { getAdminMembers } from "@/lib/data";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export const metadata: Metadata = { title: "Manage Members" };

export default async function AdminMembersPage() {
  const lang = await getLang();
  const t = getDict(lang);
  const members = await getAdminMembers();

  return (
    <div>
      <h2 className="text-xl font-bold text-navy-900">{t.admin.manageMembers}</h2>
      {members.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={Users} title={t.common.empty} />
        </div>
      ) : (
        <MembersTable members={members} />
      )}
    </div>
  );
}
