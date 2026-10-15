"use client";

// Admin shell — sidebar + content

import { AdminSidebar } from "@/components/admin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 min-w-0 px-6 lg:px-9 py-6">{children}</main>
    </div>
  );
}
