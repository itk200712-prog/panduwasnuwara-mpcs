// ============================================================================
//  Database type definitions — supabase/schema.sql එකට ගැලපේ
// ============================================================================

export type UserRole = "member" | "officer" | "admin";
export type MemberStatus = "pending" | "active" | "suspended" | "closed";
export type SavingsAccountType = "regular" | "fixed" | "children";
export type TransactionType = "deposit" | "withdrawal" | "interest" | "fee";
export type LoanType = "personal" | "business" | "education" | "housing" | "agriculture" | "emergency";
export type LoanStatus = "pending" | "approved" | "rejected" | "active" | "closed" | "defaulted";
export type EmploymentType = "full_time" | "part_time" | "contract" | "internship";
export type ApplicationStatus = "received" | "reviewing" | "shortlisted" | "rejected" | "hired";
export type NewsCategory = "news" | "notice" | "event" | "announcement";

export interface Localized {
  si: string;
  en: string;
}

export interface Profile {
  id: string;
  member_no: string | null;
  email: string | null;
  full_name_si: string;
  full_name_en: string;
  nic: string | null;
  phone: string | null;
  address_si: string | null;
  address_en: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
  occupation_si: string | null;
  occupation_en: string | null;
  role: UserRole;
  status: MemberStatus;
  joined_at: string;
  created_at: string;
  updated_at: string;
}

/** public.member_directory view එකෙන් ලැබෙන ආරක්ෂිත පිටපත */
export interface MemberDirectoryRow {
  id: string;
  member_no: string | null;
  full_name_si: string;
  full_name_en: string;
  avatar_url: string | null;
  occupation_si: string | null;
  occupation_en: string | null;
  joined_at: string;
}

export interface SavingsAccount {
  id: string;
  member_id: string;
  account_no: string;
  account_type: SavingsAccountType;
  balance: string | number;
  interest_rate: string | number;
  is_active: boolean;
  opened_at: string;
  created_at: string;
  updated_at: string;
}

export interface SavingsTransaction {
  id: string;
  account_id: string;
  member_id: string | null;
  type: TransactionType;
  amount: string | number;
  balance_after: string | number | null;
  note: string | null;
  txn_date: string;
  processed_by: string | null;
  created_at: string;
  savings_accounts?: Pick<SavingsAccount, "account_no" | "account_type"> | null;
}

export interface Loan {
  id: string;
  loan_no: string;
  member_id: string;
  loan_type: LoanType;
  principal: string | number;
  interest_rate: string | number;
  term_months: number;
  monthly_installment: string | number | null;
  purpose: string | null;
  status: LoanStatus;
  applied_at: string;
  approved_at: string | null;
  disbursed_at: string | null;
  due_date: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoanPayment {
  id: string;
  loan_id: string;
  member_id: string | null;
  amount: string | number;
  method: string;
  receipt_no: string | null;
  note: string | null;
  paid_at: string;
  recorded_by: string | null;
  created_at: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title_si: string;
  title_en: string;
  excerpt_si: string | null;
  excerpt_en: string | null;
  content_si: string | null;
  content_en: string | null;
  image_url: string | null;
  category: NewsCategory;
  is_published: boolean;
  published_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Director {
  id: string;
  name_si: string;
  name_en: string;
  position_si: string;
  position_en: string;
  bio_si: string | null;
  bio_en: string | null;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title_si: string;
  title_en: string;
  image_url: string;
  category: string;
  sort_order: number;
  created_at: string;
}

export interface Career {
  id: string;
  slug: string;
  title_si: string;
  title_en: string;
  description_si: string | null;
  description_en: string | null;
  location: string;
  employment_type: EmploymentType;
  salary_range: string | null;
  deadline: string | null;
  is_open: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  career_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  nic: string | null;
  cover_letter: string | null;
  resume_url: string | null;
  status: ApplicationStatus;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  replied_at: string | null;
  created_at: string;
}

export interface ServiceFeature {
  si: string;
  en: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title_si: string;
  title_en: string;
  summary_si: string | null;
  summary_en: string | null;
  description_si: string | null;
  description_en: string | null;
  icon: string;
  features: ServiceFeature[];
  highlight: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface BusinessUnit {
  id: string;
  slug: string;
  title_si: string;
  title_en: string;
  description_si: string | null;
  description_en: string | null;
  icon: string;
  image_url: string | null;
  highlight: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface SiteSettings {
  name_si: string;
  name_en: string;
  short_name: string;
  tagline_si: string;
  tagline_en: string;
  address_si: string;
  address_en: string;
  phone: string;
  hotline: string;
  email: string;
  whatsapp: string;
  facebook: string;
  youtube: string;
  instagram: string;
  tiktok: string;
  hours_si: string;
  hours_en: string;
}

export interface SiteStats {
  members: number;
  savings: number;
  loans: number;
  years: number;
}
