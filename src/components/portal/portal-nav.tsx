"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, LayoutDashboard, PiggyBank, User } from "lucide-react";
import { useLang } from "@/context/language-context";

const LINKS = [
  { href: "/portal", key: "dashboard", icon: LayoutDashboard, exact: true },
  { href: "/portal/savings", key: "mySavings", icon: PiggyBank , exact: false },
  { href: "/portal/loans", key: "myLoans", icon: CreditCard , exact: false },
  { href: "/portal/profile", key: "myProfile", icon: User , exact: false },
] as const;

export function PortalNav() {
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
                ? "bg-brand-700 text-white shadow-sm"
                : "bg-white text-navy-800 hover:bg-brand-50 hover:text-brand-700"
            }`}
          >
            <link.icon className="h-4 w-4" />
            {t.portal[link.key]}
          </Link>
        );
      })}
    </nav>
  );
}
