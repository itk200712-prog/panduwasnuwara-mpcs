-- ============================================================================
--  ශ්‍රී සමෘද්ධි සමූපකාර සමිතිය | Sri Samrudhi Cooperative Society
--  Supabase Database Schema  (PostgreSQL 15+)
--  භාවිතය / Usage: Supabase Dashboard > SQL Editor > New query > Run කරන්න
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Extensions
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto" with schema extensions;

-- ----------------------------------------------------------------------------
-- 2. Enum types
-- ----------------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('member', 'officer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type member_status as enum ('pending', 'active', 'suspended', 'closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type savings_account_type as enum ('regular', 'fixed', 'children');
exception when duplicate_object then null; end $$;

do $$ begin
  create type transaction_type as enum ('deposit', 'withdrawal', 'interest', 'fee');
exception when duplicate_object then null; end $$;

do $$ begin
  create type loan_type as enum ('personal', 'business', 'education', 'housing', 'agriculture', 'emergency');
exception when duplicate_object then null; end $$;

do $$ begin
  create type loan_status as enum ('pending', 'approved', 'rejected', 'active', 'closed', 'defaulted');
exception when duplicate_object then null; end $$;

do $$ begin
  create type employment_type as enum ('full_time', 'part_time', 'contract', 'internship');
exception when duplicate_object then null; end $$;

do $$ begin
  create type application_status as enum ('received', 'reviewing', 'shortlisted', 'rejected', 'hired');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- 3. Sequences
-- ----------------------------------------------------------------------------
create sequence if not exists member_no_seq start 1;

-- ----------------------------------------------------------------------------
-- 4. Tables
-- ----------------------------------------------------------------------------

-- 4.1 සාමාජික පැතිකඩ | Member profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  member_no      text unique,
  email          text,
  full_name_si   text not null default '',
  full_name_en   text not null default '',
  nic            text unique,
  phone          text,
  address_si     text,
  address_en     text,
  date_of_birth  date,
  avatar_url     text,
  occupation_si  text,
  occupation_en  text,
  role           user_role not null default 'member',
  status         member_status not null default 'pending',
  joined_at      timestamptz not null default now(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- 4.2 ඉතිරිකිරීම් ගිණුම් | Savings accounts
create table if not exists public.savings_accounts (
  id             uuid primary key default gen_random_uuid(),
  member_id      uuid not null references public.profiles (id) on delete cascade,
  account_no     text unique not null default ('SA-' || lpad(nextval('member_no_seq')::text, 6, '0')),
  account_type   savings_account_type not null default 'regular',
  balance        numeric(14, 2) not null default 0 check (balance >= 0),
  interest_rate  numeric(5, 2) not null default 5.00,
  is_active      boolean not null default true,
  opened_at      date not null default current_date,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- 4.3 ගනුදෙනු | Savings transactions
create table if not exists public.savings_transactions (
  id            uuid primary key default gen_random_uuid(),
  account_id    uuid not null references public.savings_accounts (id) on delete cascade,
  member_id     uuid references public.profiles (id) on delete set null,
  type          transaction_type not null default 'deposit',
  amount        numeric(14, 2) not null check (amount > 0),
  balance_after numeric(14, 2),
  note          text,
  txn_date      date not null default current_date,
  processed_by  uuid references public.profiles (id) on delete set null,
  created_at    timestamptz not null default now()
);

-- 4.4 ණය | Loans
create table if not exists public.loans (
  id                  uuid primary key default gen_random_uuid(),
  loan_no             text unique not null default ('LN-' || lpad(nextval('member_no_seq')::text, 6, '0')),
  member_id           uuid not null references public.profiles (id) on delete cascade,
  loan_type           loan_type not null default 'personal',
  principal           numeric(14, 2) not null check (principal > 0),
  interest_rate       numeric(5, 2) not null default 12.00,
  term_months         integer not null check (term_months > 0),
  monthly_installment numeric(14, 2),
  purpose             text,
  status              loan_status not null default 'pending',
  applied_at          timestamptz not null default now(),
  approved_at         timestamptz,
  disbursed_at        timestamptz,
  due_date            date,
  closed_at           timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- 4.5 ණය ගෙවීම් | Loan payments
create table if not exists public.loan_payments (
  id           uuid primary key default gen_random_uuid(),
  loan_id      uuid not null references public.loans (id) on delete cascade,
  member_id    uuid references public.profiles (id) on delete set null,
  amount       numeric(14, 2) not null check (amount > 0),
  method       text not null default 'cash' check (method in ('cash', 'bank', 'cheque', 'deduction')),
  receipt_no   text,
  note         text,
  paid_at      timestamptz not null default now(),
  recorded_by  uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now()
);

-- 4.6 පුවත් / නිවේදන | News & notices (bilingual)
create table if not exists public.news (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title_si      text not null,
  title_en      text not null,
  excerpt_si    text,
  excerpt_en    text,
  content_si    text,
  content_en    text,
  image_url     text,
  category      text not null default 'news' check (category in ('news', 'notice', 'event', 'announcement')),
  is_published  boolean not null default false,
  published_at  timestamptz,
  author_id     uuid references public.profiles (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 4.7 අධ්‍යක්ෂ මණ්ඩලය | Board of directors
create table if not exists public.directors (
  id           uuid primary key default gen_random_uuid(),
  name_si      text not null,
  name_en      text not null,
  position_si  text not null,
  position_en  text not null,
  bio_si       text,
  bio_en       text,
  photo_url    text,
  email        text,
  phone        text,
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- 4.8 ගැලරිය | Gallery
create table if not exists public.gallery (
  id           uuid primary key default gen_random_uuid(),
  title_si     text not null default '',
  title_en     text not null default '',
  image_url    text not null,
  category     text not null default 'general',
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- 4.9 රැකියා අවස්ථා | Careers / job vacancies
create table if not exists public.careers (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title_si        text not null,
  title_en        text not null,
  description_si  text,
  description_en  text,
  location        text not null default 'Colombo',
  employment_type employment_type not null default 'full_time',
  salary_range    text,
  deadline        date,
  is_open         boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 4.10 රැකියා අයදුම්පත් | Job applications
create table if not exists public.job_applications (
  id           uuid primary key default gen_random_uuid(),
  career_id    uuid not null references public.careers (id) on delete cascade,
  full_name    text not null,
  email        text not null,
  phone        text,
  nic          text,
  cover_letter text,
  resume_url   text,
  status       application_status not null default 'received',
  created_at   timestamptz not null default now()
);

-- 4.11 සම්බන්ධතා පණිවිඩ | Contact messages
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  full_name  text not null,
  email      text not null,
  phone      text,
  subject    text,
  message    text not null,
  is_read    boolean not null default false,
  replied_at timestamptz,
  created_at timestamptz not null default now()
);

-- 4.12 සේවා | Services (bilingual)
create table if not exists public.services (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  title_si       text not null,
  title_en       text not null,
  summary_si     text,
  summary_en     text,
  description_si text,
  description_en text,
  icon           text not null default 'circle',
  features       jsonb not null default '[]'::jsonb, -- [{"si":"...","en":"..."}]
  highlight      text,
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

-- 4.13 ව්‍යාපාර ඒකක | Business units
create table if not exists public.business_units (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  title_si       text not null,
  title_en       text not null,
  description_si text,
  description_en text,
  icon           text not null default 'store',
  image_url      text,
  highlight      text,
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

-- 4.14 අඩවි සැකසුම් | Site settings (key -> jsonb)
create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 5. Indexes
-- ----------------------------------------------------------------------------
create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_profiles_status on public.profiles (status);
create index if not exists idx_savings_accounts_member on public.savings_accounts (member_id);
create index if not exists idx_savings_txn_account on public.savings_transactions (account_id);
create index if not exists idx_savings_txn_member on public.savings_transactions (member_id);
create index if not exists idx_savings_txn_date on public.savings_transactions (txn_date desc);
create index if not exists idx_loans_member on public.loans (member_id);
create index if not exists idx_loans_status on public.loans (status);
create index if not exists idx_loan_payments_loan on public.loan_payments (loan_id);
create index if not exists idx_news_published on public.news (is_published, published_at desc);
create index if not exists idx_news_slug on public.news (slug);
create index if not exists idx_careers_open on public.careers (is_open);
create index if not exists idx_gallery_sort on public.gallery (sort_order);
create index if not exists idx_directors_sort on public.directors (sort_order);

-- ----------------------------------------------------------------------------
-- 6. Functions & triggers
-- ----------------------------------------------------------------------------

-- 6.1 updated_at auto-touch
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_savings_accounts_updated_at on public.savings_accounts;
create trigger trg_savings_accounts_updated_at before update on public.savings_accounts
  for each row execute function public.set_updated_at();

drop trigger if exists trg_loans_updated_at on public.loans;
create trigger trg_loans_updated_at before update on public.loans
  for each row execute function public.set_updated_at();

drop trigger if exists trg_news_updated_at on public.news;
create trigger trg_news_updated_at before update on public.news
  for each row execute function public.set_updated_at();

drop trigger if exists trg_careers_updated_at on public.careers;
create trigger trg_careers_updated_at before update on public.careers
  for each row execute function public.set_updated_at();

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- 6.2 Member number auto-assign (M-00001)
create or replace function public.assign_member_no()
returns trigger
language plpgsql
as $$
begin
  if new.member_no is null then
    new.member_no := 'M-' || lpad(nextval('member_no_seq')::text, 5, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_assign_member_no on public.profiles;
create trigger trg_assign_member_no before insert on public.profiles
  for each row execute function public.assign_member_no();

-- 6.3 New auth user -> profile (register වෙලාම සාමාජික පැතිකඩ හැදෙනවා)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name_si, full_name_en, nic, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name_si', new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'full_name_en', new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'nic',
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6.4 Role/status protection — සාමාජිකයෙකුට තමන්ගේ role/status වෙනස් කරන්න බෑ
create or replace function public.protect_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role or new.status is distinct from old.status) then
    if not exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') then
      raise exception 'Only administrators can change role or status';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_role_change on public.profiles;
create trigger trg_protect_role_change before update on public.profiles
  for each row execute function public.protect_role_change();

-- 6.5 Savings transaction -> balance auto-update
create or replace function public.apply_savings_transaction()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance  numeric(14, 2);
  v_member   uuid;
begin
  select balance, member_id into v_balance, v_member
  from public.savings_accounts
  where id = new.account_id
  for update;

  if not found then
    raise exception 'Savings account not found';
  end if;

  if new.type in ('deposit', 'interest') then
    v_balance := v_balance + new.amount;
  else
    v_balance := v_balance - new.amount;
    if v_balance < 0 then
      raise exception 'Insufficient balance';
    end if;
  end if;

  update public.savings_accounts
  set balance = v_balance, updated_at = now()
  where id = new.account_id;

  new.balance_after := v_balance;
  new.member_id     := v_member;
  return new;
end;
$$;

drop trigger if exists trg_apply_savings_transaction on public.savings_transactions;
create trigger trg_apply_savings_transaction
  before insert on public.savings_transactions
  for each row execute function public.apply_savings_transaction();

-- ----------------------------------------------------------------------------
-- 7. Helper functions (RLS)
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_officer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('officer', 'admin')
  );
$$;

-- ----------------------------------------------------------------------------
-- 8. Public member directory view (නිරාවරණය නොවන තොරතුරු පමණයි)
-- ----------------------------------------------------------------------------
create or replace view public.member_directory
with (security_invoker = off) as
  select
    id, member_no, full_name_si, full_name_en,
    avatar_url, occupation_si, occupation_en, joined_at
  from public.profiles
  where status = 'active';

grant select on public.member_directory to anon, authenticated;

-- ----------------------------------------------------------------------------
-- 9. Row Level Security
-- ----------------------------------------------------------------------------
alter table public.profiles            enable row level security;
alter table public.savings_accounts    enable row level security;
alter table public.savings_transactions enable row level security;
alter table public.loans               enable row level security;
alter table public.loan_payments       enable row level security;
alter table public.news                enable row level security;
alter table public.directors           enable row level security;
alter table public.gallery             enable row level security;
alter table public.careers             enable row level security;
alter table public.job_applications    enable row level security;
alter table public.contact_messages    enable row level security;
alter table public.services            enable row level security;
alter table public.business_units      enable row level security;
alter table public.site_settings       enable row level security;

-- PROFILES
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_officer());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_officer())
  with check (id = auth.uid() or public.is_officer());

drop policy if exists "profiles_delete_admin" on public.profiles;
create policy "profiles_delete_admin" on public.profiles
  for delete to authenticated
  using (public.is_admin());

-- SAVINGS ACCOUNTS
drop policy if exists "savings_select" on public.savings_accounts;
create policy "savings_select" on public.savings_accounts
  for select to authenticated
  using (member_id = auth.uid() or public.is_officer());

drop policy if exists "savings_write_officer" on public.savings_accounts;
create policy "savings_write_officer" on public.savings_accounts
  for all to authenticated
  using (public.is_officer())
  with check (public.is_officer());

-- SAVINGS TRANSACTIONS
drop policy if exists "txn_select" on public.savings_transactions;
create policy "txn_select" on public.savings_transactions
  for select to authenticated
  using (member_id = auth.uid() or public.is_officer());

drop policy if exists "txn_insert_officer" on public.savings_transactions;
create policy "txn_insert_officer" on public.savings_transactions
  for insert to authenticated
  with check (public.is_officer());

-- LOANS
drop policy if exists "loans_select" on public.loans;
create policy "loans_select" on public.loans
  for select to authenticated
  using (member_id = auth.uid() or public.is_officer());

drop policy if exists "loans_insert" on public.loans;
create policy "loans_insert" on public.loans
  for insert to authenticated
  with check (member_id = auth.uid() or public.is_officer());

drop policy if exists "loans_update_officer" on public.loans;
create policy "loans_update_officer" on public.loans
  for update to authenticated
  using (public.is_officer())
  with check (public.is_officer());

-- LOAN PAYMENTS
drop policy if exists "payments_select" on public.loan_payments;
create policy "payments_select" on public.loan_payments
  for select to authenticated
  using (member_id = auth.uid() or public.is_officer());

drop policy if exists "payments_insert_officer" on public.loan_payments;
create policy "payments_insert_officer" on public.loan_payments
  for insert to authenticated
  with check (public.is_officer());

-- NEWS
drop policy if exists "news_select_published" on public.news;
create policy "news_select_published" on public.news
  for select to anon, authenticated
  using (is_published or public.is_officer());

drop policy if exists "news_write_officer" on public.news;
create policy "news_write_officer" on public.news
  for all to authenticated
  using (public.is_officer())
  with check (public.is_officer());

-- DIRECTORS
drop policy if exists "directors_select_all" on public.directors;
create policy "directors_select_all" on public.directors
  for select to anon, authenticated
  using (is_active or public.is_officer());

drop policy if exists "directors_write_officer" on public.directors;
create policy "directors_write_officer" on public.directors
  for all to authenticated
  using (public.is_officer())
  with check (public.is_officer());

-- GALLERY
drop policy if exists "gallery_select_all" on public.gallery;
create policy "gallery_select_all" on public.gallery
  for select to anon, authenticated
  using (true);

drop policy if exists "gallery_write_officer" on public.gallery;
create policy "gallery_write_officer" on public.gallery
  for all to authenticated
  using (public.is_officer())
  with check (public.is_officer());

-- CAREERS
drop policy if exists "careers_select" on public.careers;
create policy "careers_select" on public.careers
  for select to anon, authenticated
  using (is_open or public.is_officer());

drop policy if exists "careers_write_officer" on public.careers;
create policy "careers_write_officer" on public.careers
  for all to authenticated
  using (public.is_officer())
  with check (public.is_officer());

-- JOB APPLICATIONS (anon අයදුම් කරන්න පුළුවන්)
drop policy if exists "applications_insert_anyone" on public.job_applications;
create policy "applications_insert_anyone" on public.job_applications
  for insert to anon, authenticated
  with check (true);

drop policy if exists "applications_select_officer" on public.job_applications;
create policy "applications_select_officer" on public.job_applications
  for select to authenticated
  using (public.is_officer());

drop policy if exists "applications_update_officer" on public.job_applications;
create policy "applications_update_officer" on public.job_applications
  for update to authenticated
  using (public.is_officer())
  with check (public.is_officer());

-- CONTACT MESSAGES (anon පණිවිඩ යවන්න පුළුවන්)
drop policy if exists "messages_insert_anyone" on public.contact_messages;
create policy "messages_insert_anyone" on public.contact_messages
  for insert to anon, authenticated
  with check (true);

drop policy if exists "messages_select_officer" on public.contact_messages;
create policy "messages_select_officer" on public.contact_messages
  for select to authenticated
  using (public.is_officer());

drop policy if exists "messages_update_officer" on public.contact_messages;
create policy "messages_update_officer" on public.contact_messages
  for update to authenticated
  using (public.is_officer())
  with check (public.is_officer());

-- SERVICES & BUSINESS UNITS (public read)
drop policy if exists "services_select_all" on public.services;
create policy "services_select_all" on public.services
  for select to anon, authenticated
  using (is_active or public.is_officer());

drop policy if exists "services_write_officer" on public.services;
create policy "services_write_officer" on public.services
  for all to authenticated
  using (public.is_officer())
  with check (public.is_officer());

drop policy if exists "business_select_all" on public.business_units;
create policy "business_select_all" on public.business_units
  for select to anon, authenticated
  using (is_active or public.is_officer());

drop policy if exists "business_write_officer" on public.business_units;
create policy "business_write_officer" on public.business_units
  for all to authenticated
  using (public.is_officer())
  with check (public.is_officer());

-- SITE SETTINGS (public read, admin write)
drop policy if exists "settings_select_all" on public.site_settings;
create policy "settings_select_all" on public.site_settings
  for select to anon, authenticated
  using (true);

drop policy if exists "settings_write_admin" on public.site_settings;
create policy "settings_write_admin" on public.site_settings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- 10. Seed data
-- ============================================================================

-- 10.1 Site settings
insert into public.site_settings (key, value) values
('site', jsonb_build_object(
  'name_si', 'ශ්‍රී සමෘද්ධි සමූපකාර සමිතිය',
  'name_en', 'Sri Samrudhi Cooperative Society',
  'short_name', 'SSCS',
  'tagline_si', 'එකට ඉදිරියට — සමෘද්ධිය කරා',
  'tagline_en', 'Together Forward — Towards Prosperity',
  'address_si', 'නො. 125, මහරගම පාර, කොළඹ 05, ශ්‍රී ලංකාව',
  'address_en', 'No. 125, Maharagama Road, Colombo 05, Sri Lanka',
  'phone', '+94 11 234 5678',
  'hotline', '+94 77 123 4567',
  'email', 'info@samrudhi-coop.lk',
  'whatsapp', '+94 77 123 4567',
  'facebook', 'https://facebook.com/',
  'youtube', 'https://youtube.com/',
  'instagram', 'https://instagram.com/',
  'tiktok', 'https://tiktok.com/',
  'hours_si', 'සඳුදා - සිකුරාදා: පෙ.ව. 8.30 - ප.ව. 4.30',
  'hours_en', 'Monday - Friday: 8.30 AM - 4.30 PM'
))
on conflict (key) do nothing;

-- 10.2 Services
insert into public.services (slug, title_si, title_en, summary_si, summary_en, icon, features, highlight, sort_order) values
('savings', 'ඉතිරිකිරීම් ගිණුම්', 'Savings Accounts', 'ආරක්ෂිත, ඉහළ පොලියක් සහිත ඉතිරිකිරීම් වැඩසටහන්', 'Safe savings programs with attractive interest rates', 'piggy-bank',
 '[{"si":"දෛනික ඉතිරිකිරීම්","en":"Daily savings"},{"si":"නියමිත තැන්පතු (Fixed)","en":"Fixed deposits"},{"si":"ළමා ඉතිරිකිරීම්","en":"Children savings"},{"si":"5% - 12% වාර්ෂික පොලිය","en":"5% - 12% annual interest"}]'::jsonb,
 '5% - 12% පොලිය', 1),
('loans', 'ණය සේවා', 'Loan Services', 'ඔබේ අවශ්‍යතා සඳහා අඩු පොලි ණය', 'Low-interest loans for every need', 'hand-coins',
 '[{"si":"පුද්ගලික ණය","en":"Personal loans"},{"si":"ව්‍යාපාර ණය","en":"Business loans"},{"si":"අධ්‍යාපන ණය","en":"Education loans"},{"si":"නිවාස ණය","en":"Housing loans"}]'::jsonb,
 '10% සිට පොලිය', 2),
('agri', 'කෘෂිකාර්මික සේවා', 'Agricultural Services', 'ගොවීන්ට බීජ, පොහොර සහ තාක්ෂණික සහය', 'Seeds, fertilizer and technical support for farmers', 'sprout',
 '[{"si":"බීජ හා පොහොර බෙදාහැරීම","en":"Seeds & fertilizer distribution"},{"si":"අස්වනු මිලදී ගැනීම","en":"Harvest purchasing"},{"si":"ගොවි පුහුණුව","en":"Farmer training"},{"si":"කෘෂි ණය","en":"Agricultural loans"}]'::jsonb,
 'ගොවි සේවා', 3),
('consumer', 'පාරිභෝගික වෙළඳසැල්', 'Consumer Outlets', 'සාධාරණ මිලට ගුණාත්මක භාණ්ඩ', 'Quality goods at fair prices', 'shopping-basket',
 '[{"si":"අත්‍යවශ්‍ය ආහාර ද්‍රව්‍ය","en":"Essential groceries"},{"si":"සාමාජික වට්ටම්","en":"Member discounts"},{"si":"ණය පහසුකම්","en":"Credit facilities"},{"si":"ගෘහ භාණ්ඩ","en":"Household items"}]'::jsonb,
 'සාමාජික වට්ටම්', 4),
('insurance', 'සාමාජික රක්ෂණය', 'Member Insurance', 'සාමාජිකයින්ට සහ පවුලේ අයට රක්ෂණ ආවරණය', 'Insurance cover for members and families', 'shield-check',
 '[{"si":"ජීවිත රක්ෂණය","en":"Life insurance"},{"si":"අනතුරු රක්ෂණය","en":"Accident cover"},{"si":"වෛද්‍ය ප්‍රතිලාභ","en":"Medical benefits"},{"si":"අඩු වාරික","en":"Low premiums"}]'::jsonb,
 'පවුල ආරක්ෂාවට', 5),
('training', 'පුහුණු හා සංවර්ධන', 'Training & Development', 'සාමාජිකයින්ගේ දැනුම හා කුසලතා වර්ධනය', 'Building knowledge and skills of members', 'graduation-cap',
 '[{"si":"ව්‍යාපාර පුහුණුව","en":"Business training"},{"si":"මූල්‍ය සාක්ෂරතාව","en":"Financial literacy"},{"si":"තරුණ සංවර්ධන","en":"Youth development"},{"si":"කාන්තා සවිබලගැන්වීම","en":"Women empowerment"}]'::jsonb,
 'නොමිලේ පුහුණුව', 6)
on conflict (slug) do nothing;

-- 10.3 Business units
insert into public.business_units (slug, title_si, title_en, description_si, description_en, icon, highlight, sort_order) values
('stores', 'සමූපකාර වෙළඳසැල්', 'Cooperative Outlets', 'අපගේ සමූපකාර වෙළඳසැල් ජාලය හරහා ගුණාත්මක භාණ්ඩ සාධාරණ මිලට ලබා ගන්න. සාමාජිකයින්ට විශේෂ වට්ටම් හිමි වේ.', 'Access quality goods at fair prices through our cooperative outlet network. Special discounts for members.', 'store', 'සාමාජික වට්ටම් 5% - 15%', 1),
('agrimarket', 'කෘෂි වෙළඳපොළ', 'Agricultural Market', 'ගොවීන්ගේ අස්වනු කෙලින්ම වෙළඳපොළට ගෙන ඒම — අතරමැදියන් නොමැතිව සාධාරණ මිලක්.', 'Bringing farmer harvests straight to market — fair prices with no middlemen.', 'wheat', 'සෘජු අස්වනු මිලදී ගැනීම්', 2),
('warehouse', 'ගබඩා හා ප්‍රවාහන', 'Warehouse & Transport', 'ආරක්ෂිත ගබඩා පහසුකම් සහ ප්‍රවාහන සේවා මගින් ඔබේ භාණ්ඩ ආරක්ෂිතව.', 'Secure warehousing and transport services to keep your goods safe.', 'truck', 'ආරක්ෂිත ගබඩා', 3),
('fuel', 'ඉන්ධන හා පොහොර අලෙවිසැල්', 'Fuel & Fertilizer Outlets', 'ගොවිතැනට අවශ්‍ය ඉන්ධන, පොහොර සහ කෘෂි රසායන සාධාරණ මිලට.', 'Fuel, fertilizer and agro-chemicals for farming at fair prices.', 'fuel', 'ගොවි සහය', 4)
on conflict (slug) do nothing;

-- 10.4 Directors
insert into public.directors (name_si, name_en, position_si, position_en, bio_si, bio_en, sort_order) values
('ආර්. පී. විජේසිංහ', 'R. P. Wijesinghe', 'සභාපති', 'Chairman', 'වසර 25ක පළපුරුද්දක් ඇති සමූපකාර ක්ෂේත්‍රයේ පළපුරුදු නායකයෙක්.', 'An experienced cooperative leader with 25 years in the field.', 1),
('එම්. එච්. ප්‍රනාන්දු', 'M. H. Fernando', 'උප සභාපති', 'Vice Chairman', 'ග්‍රාමීය සංවර්ධන හා සාමාජික සේවා ක්ෂේත්‍රයේ විශේෂඥයෙක්.', 'Specialist in rural development and member services.', 2),
('ඩබ්ලිව්. කේ. ජයසිංහ', 'W. K. Jayasinghe', 'ලේකම්', 'Secretary', 'සමූපකාර පරිපාලන හා නීතිමය කටයුතු පිළිබඳ දැනුමැති පුද්ගලයෙක්.', 'Knowledgeable in cooperative administration and legal affairs.', 3),
('ඒ. එම්. අබ්දුල්ලා', 'A. M. Abdulullah', 'භාණ්ඩාගාරික', 'Treasurer', 'මූල්‍ය කළමනාකරණය හා විගණන ක්ෂේත්‍රයේ වසර 18ක පළපුරුද්ද.', '18 years of experience in financial management and auditing.', 4),
('ආර්. එස්. කුමාරි', 'R. S. Kumari', 'අධ්‍යක්ෂ', 'Director', 'කාන්තා සවිබලගැන්වීම සහ සමූපකාර සංවර්ධන ව්‍යාපෘති වලට නායකත්වය.', 'Leads women empowerment and cooperative development projects.', 5),
('ටී. ජී. බණ්ඩාර', 'T. G. Bandara', 'අධ්‍යක්ෂ', 'Director', 'කෘෂිකාර්මික සේවා හා ගොවි සංවර්ධන වැඩසටහන් සඳහා වගකීම.', 'In charge of agricultural services and farmer development programs.', 6)
on conflict do nothing;

-- 10.5 News
insert into public.news (slug, title_si, title_en, excerpt_si, excerpt_en, content_si, content_en, category, is_published, published_at) values
('annual-general-meeting-2026', '2026 වාර්ෂික මහා සභා රැස්වීම', 'Annual General Meeting 2026', 'අපගේ 2026 වාර්ෂික මහා සභා රැස්වීම මාර්තු මාසයේ පැවැත්වේ.', 'Our AGM for 2026 will be held in March.', 'ශ්‍රී සමෘද්ධි සමූපකාර සමිතියේ 2026 වාර්ෂික මහා සභා රැස්වීම 2026 මාර්තු 15 වැනිදා පෙ.ව. 9.00 ට සමිතියේ ප්‍රධාන ශාලාවේදී පැවැත්වේ. සියලුම සාමාජිකයින්ට සහභාගී විය හැකිය. පසුගිය වසරේ වාර්තා, මූල්‍ය ප්‍රකාශ සහ නව වසර සැලැස්ම ඉදිරිපත් කෙරේ.', 'The 2026 Annual General Meeting of the Sri Samrudhi Cooperative Society will be held on 15th March 2026 at 9.00 AM at the main hall. All members are welcome. Last year''s reports, financial statements and the new year plan will be presented.', 'event', true, now() - interval '2 days'),
('new-savings-scheme', 'නව ඉතිරිකිරීම් වැඩසටහනක් දියත් කෙරේ', 'New Savings Scheme Launched', 'සාමාජිකයින් සඳහා ඉහළ පොලියක් සහිත නව නියමිත තැන්පතු වැඩසටහන.', 'A new fixed deposit scheme with higher interest for members.', 'සමිතියේ සාමාජිකයින් සඳහා වාර්ෂික 12% දක්වා පොලියක් ලබා දෙන නව නියමිත තැන්පතු වැඩසටහන දියත් කර ඇත. මාස 12, 24 සහ 36 මාස කාල සීමා යටතේ තැන්පතු කළ හැකිය.', 'A new fixed deposit scheme offering up to 12% annual interest for society members has been launched. Deposits can be made for 12, 24 and 36 month terms.', 'news', true, now() - interval '5 days'),
('agri-equipment-support', 'ගොවි උපකරණ බෙදාහැරීම', 'Farm Equipment Distribution', 'සාමාජික ගොවීන්ට නවීන කෘෂි උපකරණ බෙදාහැරීමේ වැඩසටහන.', 'Distribution of modern farm equipment to member farmers.', 'සමිතියේ කෘෂිකාර්මික සේවා ඒකකය මගින් සාමාජික ගොවීන් 150 දෙනෙකුට නවීන කෘෂි උපකරණ බෙදාහැරීමේ වැඩසටහන පසුගිය සතියේ දී සාර්ථකව නිමා විය.', 'The agricultural services unit successfully completed the distribution of modern farm equipment to 150 member farmers last week.', 'news', true, now() - interval '9 days'),
('scholarship-program-2026', '2026 ශිෂ්‍යත්ව වැඩසටහන', '2026 Scholarship Program', 'සාමාජික දරුවන් සඳහා ශිෂ්‍යත්ව පිරිනැමීම ආරම්භ වේ.', 'Scholarships for members'' children are now open.', 'සමිතියේ අධ්‍යාපන සංවර්ධන වැඩසටහන යටතේ 2026 වසර සඳහා සාමාජික දරුවන්ගේ ශිෂ්‍යත්ව අයදුම්පත් භාරගැනීම ආරම්භ වී ඇත. විස්තුරූප සමිති කාර්යාලයෙන් ලබාගත හැකිය.', 'Applications for 2026 scholarships for members'' children are now being accepted under the society''s education development program. Forms are available at the society office.', 'notice', true, now() - interval '14 days'),
('branch-opening', 'නව ශාඛාවක් විවෘත කෙරේ', 'New Branch Opening', 'කඩවත ප්‍රදේශයේ නව ශාඛාව ඉදිරි මාසයේ විවෘත වේ.', 'A new branch will open in Kadawatha next month.', 'සාමාජිකයින්ගේ පහසුව සඳහා කඩවත ප්‍රදේශයේ නව ශාඛාවක් ලබන මාසයේ 10 වැනිදා විවෘත කිරීමට නියමිතය. සියලුම සමූපකාර සේවා එම ශාඛාවෙන් ලබාගත හැකි වේ.', 'A new branch will be opened in Kadawatha on the 10th of next month for the convenience of members. All cooperative services will be available at this branch.', 'announcement', true, now() - interval '20 days')
on conflict (slug) do nothing;

-- 10.6 Gallery
insert into public.gallery (title_si, title_en, image_url, category, sort_order) values
('වාර්ෂික මහා සභා රැස්වීම', 'Annual General Meeting', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=60', 'events', 1),
('ගොවි උපකරණ බෙදාහැරීම', 'Farm Equipment Distribution', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=60', 'agriculture', 2),
('සමූපකාර වෙළඳසැල', 'Cooperative Store', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=900&q=60', 'business', 3),
('සාමාජික පුහුණු වැඩසටහන', 'Member Training Program', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=60', 'training', 4),
('ශිෂ්‍යත්ව පිරිනැමීම', 'Scholarship Awards', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=60', 'events', 5),
('අස්වනු මිලදී ගැනීම', 'Harvest Purchasing', 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=60', 'agriculture', 6),
('සාමාජික සුභසාධන වැඩසටහන', 'Member Welfare Program', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=60', 'welfare', 7),
('නව ශාඛා විවෘත කිරීම', 'New Branch Opening', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=60', 'events', 8)
on conflict do nothing;

-- 10.7 Careers
insert into public.careers (slug, title_si, title_en, description_si, description_en, location, employment_type, salary_range, deadline, is_open) values
('accountant', 'ගිණුම්කරු / ගිණුම් නිලධාරී', 'Accountant', 'සමිතියේ මූල්‍ය ගිණුම් කළමනාකරණය, වාර්තා සකස් කිරීම සහ විගණන සඳහා සහය දැක්වීම. ACCA / CIMA / AAT සුදුසුකම් ඇති අය අතිරේක සලකා බැලේ.', 'Managing the society''s financial accounts, preparing reports and supporting audits. Candidates with ACCA / CIMA / AAT qualifications will have an advantage.', 'Colombo', 'full_time', 'රු. 80,000 - 120,000', current_date + interval '30 days', true),
('field-officer', 'ක්ෂේත්‍ර නිලධාරී', 'Field Officer', 'සාමාජික සේවා, ණය එකතු කිරීම් සහ නව සාමාජිකයින් ලියාපදිංචි කිරීමේ කටයුතු සඳහා ක්ෂේත්‍ර නිලධාරීන් අවශ්‍යයි. යතුරුපැදි බලපත්‍රය අනිවාර්යයි.', 'Field officers required for member services, loan collection and new member registration. A motorcycle license is mandatory.', 'Colombo', 'full_time', 'රු. 55,000 - 75,000', current_date + interval '21 days', true),
('it-support', 'තොරතුරු තාක්ෂණ සහය නිලධාරී', 'IT Support Officer', 'සමිතියේ පරිගණක පද්ධති, මෘදුකාංග සහ වෙබ් අඩවි කළමනාකරණය සඳහා IT සහය නිලධාරීවරයෙකු අවශ්‍යයි.', 'An IT support officer is required to manage the society''s computer systems, software and website.', 'Colombo', 'contract', 'රු. 70,000 - 100,000', current_date + interval '14 days', true)
on conflict (slug) do nothing;

-- ============================================================================
-- 11. Optional: Storage bucket policies (ගොනු උඩුගත කිරීම් සඳහා)
--    Supabase Dashboard > Storage > New bucket > "uploads" (public) නිර්මාණය කර
--    පහත SQL එක run කරන්න.
-- ============================================================================
-- insert into storage.buckets (id, name, public) values ('uploads', 'uploads', true)
--   on conflict (id) do nothing;
--
-- create policy "Public read uploads" on storage.objects
--   for select to anon, authenticated using (bucket_id = 'uploads');
-- create policy "Officer upload" on storage.objects
--   for insert to authenticated with check (bucket_id = 'uploads' and public.is_officer());
-- create policy "Officer delete" on storage.objects
--   for delete to authenticated using (bucket_id = 'uploads' and public.is_officer());

-- ============================================================================
-- 12. Admin භූමිකාව ලබාදීම (පළමු පරිශීලකයා)
--    1) වෙබ් අඩවියේ register වෙන්න
--    2) පහත email එක වෙනස් කර SQL Editor එකේ run කරන්න:
-- ============================================================================
-- update public.profiles
--   set role = 'admin', status = 'active'
--   where email = 'you@example.com';

-- ============================================================================
-- නිමයි | Done — දැන් ව්‍යාපෘතියේ .env.local සකසා Vercel වෙත deploy කරන්න.
-- ============================================================================
