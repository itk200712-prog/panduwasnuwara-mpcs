// ============================================================================
//  Server-side data access layer
//  Supabase සම්බන්ධ නොවූ විට / දෝෂයක් ඇති වූ විට demo දත්ත හෝ හිස් අගයන් ලැබේ
// ============================================================================

import { createClient } from "@/lib/supabase/server";
import {
  DEMO_BUSINESS,
  DEMO_CAREERS,
  DEMO_DIRECTORS,
  DEMO_GALLERY,
  DEMO_MEMBERS,
  DEMO_NEWS,
  DEMO_SERVICES,
  DEMO_SETTINGS,
} from "@/lib/demo-data";
import type {
  BusinessUnit,
  Career,
  ContactMessage,
  Director,
  GalleryItem,
  Loan,
  LoanPayment,
  MemberDirectoryRow,
  NewsItem,
  Profile,
  SavingsAccount,
  SavingsTransaction,
  ServiceItem,
  SiteSettings,
  SiteStats,
} from "@/types/database";

function isConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

async function safeQuery<T>(fn: (supabase: Awaited<ReturnType<typeof createClient>>) => Promise<T>): Promise<T | null> {
  if (!isConfigured()) return null;
  try {
    const supabase = await createClient();
    return await fn(supabase);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
//  Public content
// ---------------------------------------------------------------------------

export async function getSettings(): Promise<SiteSettings> {
  const res = await safeQuery(async (s) => {
    const { data } = await s.from("site_settings").select("value").eq("key", "site").maybeSingle();
    return (data?.value as SiteSettings) ?? null;
  });
  return res ?? DEMO_SETTINGS;
}

export async function getServices(): Promise<ServiceItem[]> {
  const res = await safeQuery(async (s) => {
    const { data, error } = await s.from("services").select("*").eq("is_active", true).order("sort_order");
    return error ? null : ((data as ServiceItem[]) ?? []);
  });
  return res ?? DEMO_SERVICES;
}

export async function getBusinessUnits(): Promise<BusinessUnit[]> {
  const res = await safeQuery(async (s) => {
    const { data, error } = await s.from("business_units").select("*").eq("is_active", true).order("sort_order");
    return error ? null : ((data as BusinessUnit[]) ?? []);
  });
  return res ?? DEMO_BUSINESS;
}

export async function getDirectors(): Promise<Director[]> {
  const res = await safeQuery(async (s) => {
    const { data, error } = await s.from("directors").select("*").eq("is_active", true).order("sort_order");
    return error ? null : ((data as Director[]) ?? []);
  });
  return res ?? DEMO_DIRECTORS;
}

export async function getGallery(): Promise<GalleryItem[]> {
  const res = await safeQuery(async (s) => {
    const { data, error } = await s.from("gallery").select("*").order("sort_order");
    return error ? null : ((data as GalleryItem[]) ?? []);
  });
  return res ?? DEMO_GALLERY;
}

export async function getNews(limit?: number): Promise<NewsItem[]> {
  const res = await safeQuery(async (s) => {
    let q = s
      .from("news")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    return error ? null : ((data as NewsItem[]) ?? []);
  });
  const list = res ?? DEMO_NEWS;
  return limit ? list.slice(0, limit) : list;
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const res = await safeQuery(async (s) => {
    const { data, error } = await s.from("news").select("*").eq("slug", slug).maybeSingle();
    return error ? null : ((data as NewsItem) ?? null);
  });
  return res ?? DEMO_NEWS.find((n) => n.slug === slug) ?? null;
}

export async function getCareers(): Promise<Career[]> {
  const res = await safeQuery(async (s) => {
    const { data, error } = await s.from("careers").select("*").eq("is_open", true).order("created_at", { ascending: false });
    return error ? null : ((data as Career[]) ?? []);
  });
  return res ?? DEMO_CAREERS;
}

export async function getCareerById(id: string): Promise<Career | null> {
  const res = await safeQuery(async (s) => {
    const { data, error } = await s.from("careers").select("*").eq("id", id).maybeSingle();
    return error ? null : ((data as Career) ?? null);
  });
  return res ?? DEMO_CAREERS.find((c) => c.id === id) ?? null;
}

export async function getMembers(): Promise<MemberDirectoryRow[]> {
  const res = await safeQuery(async (s) => {
    const { data, error } = await s.from("member_directory").select("*").order("member_no");
    return error ? null : ((data as MemberDirectoryRow[]) ?? []);
  });
  return res ?? DEMO_MEMBERS;
}

export async function getMemberById(id: string): Promise<MemberDirectoryRow | null> {
  const res = await safeQuery(async (s) => {
    const { data, error } = await s.from("member_directory").select("*").eq("id", id).maybeSingle();
    return error ? null : ((data as MemberDirectoryRow) ?? null);
  });
  return res ?? DEMO_MEMBERS.find((m) => m.id === id) ?? null;
}

export async function getStats(): Promise<SiteStats> {
  const res = await safeQuery(async (s) => {
    const [members, savings, loans] = await Promise.all([
      s.from("profiles").select("id", { count: "exact", head: true }).eq("status", "active"),
      s.from("savings_accounts").select("balance"),
      s.from("loans").select("principal").in("status", ["active", "closed"]),
    ]);
    const savingsTotal = (savings.data ?? []).reduce((acc, r) => acc + Number(r.balance ?? 0), 0);
    const loansTotal = (loans.data ?? []).reduce((acc, r) => acc + Number(r.principal ?? 0), 0);
    return {
      members: members.count ?? 0,
      savings: savingsTotal,
      loans: loansTotal,
      years: new Date().getFullYear() - 1998,
    };
  });
  return res ?? { members: 5240, savings: 285_000_000, loans: 145_000_000, years: new Date().getFullYear() - 1998 };
}

// ---------------------------------------------------------------------------
//  Member portal
// ---------------------------------------------------------------------------

export interface MemberDashboardData {
  profile: Profile | null;
  accounts: SavingsAccount[];
  transactions: SavingsTransaction[];
  loans: Loan[];
  payments: LoanPayment[];
}

export async function getMemberDashboard(memberId: string): Promise<MemberDashboardData> {
  const empty: MemberDashboardData = { profile: null, accounts: [], transactions: [], loans: [], payments: [] };
  const res = await safeQuery(async (s) => {
    const [profile, accounts, transactions, loans] = await Promise.all([
      s.from("profiles").select("*").eq("id", memberId).maybeSingle(),
      s.from("savings_accounts").select("*").eq("member_id", memberId).order("opened_at", { ascending: false }),
      s
        .from("savings_transactions")
        .select("*, savings_accounts(account_no, account_type)")
        .eq("member_id", memberId)
        .order("txn_date", { ascending: false })
        .limit(20),
      s.from("loans").select("*").eq("member_id", memberId).order("applied_at", { ascending: false }),
    ]);
    const loanRows = (loans.data as Loan[]) ?? [];
    let payments: LoanPayment[] = [];
    if (loanRows.length > 0) {
      const { data } = await s
        .from("loan_payments")
        .select("*")
        .in("loan_id", loanRows.map((l) => l.id))
        .order("paid_at", { ascending: false });
      payments = (data as LoanPayment[]) ?? [];
    }
    return {
      profile: (profile.data as Profile) ?? null,
      accounts: (accounts.data as SavingsAccount[]) ?? [],
      transactions: (transactions.data as SavingsTransaction[]) ?? [],
      loans: loanRows,
      payments,
    };
  });
  return res ?? empty;
}

// ---------------------------------------------------------------------------
//  Admin
// ---------------------------------------------------------------------------

export interface AdminOverview {
  totalMembers: number;
  activeMembers: number;
  totalSavings: number;
  activeLoans: number;
  unreadMessages: number;
  openJobs: number;
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const res = await safeQuery(async (s) => {
    const [allMembers, activeMembers, savings, loans, messages, jobs] = await Promise.all([
      s.from("profiles").select("id", { count: "exact", head: true }),
      s.from("profiles").select("id", { count: "exact", head: true }).eq("status", "active"),
      s.from("savings_accounts").select("balance"),
      s.from("loans").select("id", { count: "exact", head: true }).eq("status", "active"),
      s.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
      s.from("careers").select("id", { count: "exact", head: true }).eq("is_open", true),
    ]);
    return {
      totalMembers: allMembers.count ?? 0,
      activeMembers: activeMembers.count ?? 0,
      totalSavings: (savings.data ?? []).reduce((a, r) => a + Number(r.balance ?? 0), 0),
      activeLoans: loans.count ?? 0,
      unreadMessages: messages.count ?? 0,
      openJobs: jobs.count ?? 0,
    };
  });
  return (
    res ?? {
      totalMembers: 0,
      activeMembers: 0,
      totalSavings: 0,
      activeLoans: 0,
      unreadMessages: 0,
      openJobs: 0,
    }
  );
}

export async function getAdminMembers(): Promise<Profile[]> {
  const res = await safeQuery(async (s) => {
    const { data, error } = await s.from("profiles").select("*").order("created_at", { ascending: false }).limit(200);
    return error ? null : ((data as Profile[]) ?? []);
  });
  return res ?? [];
}

export async function getAdminMessages(): Promise<ContactMessage[]> {
  const res = await safeQuery(async (s) => {
    const { data, error } = await s.from("contact_messages").select("*").order("created_at", { ascending: false });
    return error ? null : ((data as ContactMessage[]) ?? []);
  });
  return res ?? [];
}

export async function getAdminNews(): Promise<NewsItem[]> {
  const res = await safeQuery(async (s) => {
    const { data, error } = await s.from("news").select("*").order("created_at", { ascending: false });
    return error ? null : ((data as NewsItem[]) ?? []);
  });
  return res ?? [];
}

export async function getAdminNewsById(id: string): Promise<NewsItem | null> {
  const res = await safeQuery(async (s) => {
    const { data, error } = await s.from("news").select("*").eq("id", id).maybeSingle();
    return error ? null : ((data as NewsItem) ?? null);
  });
  return res ?? null;
}

export async function getAdminCareers(): Promise<Career[]> {
  const res = await safeQuery(async (s) => {
    const { data, error } = await s.from("careers").select("*").order("created_at", { ascending: false });
    return error ? null : ((data as Career[]) ?? []);
  });
  return res ?? [];
}

export async function getAdminCareerById(id: string): Promise<Career | null> {
  const res = await safeQuery(async (s) => {
    const { data, error } = await s.from("careers").select("*").eq("id", id).maybeSingle();
    return error ? null : ((data as Career) ?? null);
  });
  return res ?? null;
}

export async function getAdminGallery(): Promise<GalleryItem[]> {
  return getGallery();
}
