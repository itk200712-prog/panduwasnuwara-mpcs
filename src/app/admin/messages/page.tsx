import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/ui/primitives";
import { MessagesList } from "@/components/admin/messages-list";
import { getAdminMessages } from "@/lib/data";
import { getDict } from "@/lib/i18n";
import { getLang } from "@/lib/get-lang";

export const metadata: Metadata = { title: "Manage Messages" };

export default async function AdminMessagesPage() {
  const lang = await getLang();
  const t = getDict(lang);
  const messages = await getAdminMessages();

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-navy-900">{t.admin.manageMessages}</h2>
      {messages.length === 0 ? (
        <EmptyState icon={MessageSquare} title={t.common.empty} />
      ) : (
        <MessagesList messages={messages} />
      )}
    </div>
  );
}
