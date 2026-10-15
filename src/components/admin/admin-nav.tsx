"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Images,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Users,
} from "lucide-react";
import { useLang } from "@/context/language-context";

const LINKS = [
  { href: "/admin", key: "overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/members", key: "manageMembers", icon: Users , exact: false },
  { href: "/admin/news", key: "manageNews", icon: Newspaper , exact: false },
  { href: "/admin/careers", key: "manageCareers", icon: Briefcase , exact: false },
  { href: "/admin/gallery", key: "manageGallery", icon: Images , exact: false },
  { href: "/admin/messages", key: "manageMessages", icon: MessageSquare , exact: false },
] as const;

export function AdminNav() {
  const { t } = useLang();
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {LINKS.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              active
                ? "bg-gold-500 text-navy-950 shadow-sm"
                : "bg-white text-navy-800 hover:bg-gold-50 hover:text-gold-700"
            }`}
          >
            <link.icon className="h-4 w-4" />
            {t.admin[link.key]}
          </Link>
        );
      })}
    </nav>
  );
}
