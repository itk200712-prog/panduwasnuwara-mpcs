-- ============================================================================
--  Panduwasnuwara New Multi Purpose Co-Operative Society LTD
--  Supabase Database Schema (PostgreSQL 15+)
--  භාවිතය: Supabase Dashboard > SQL Editor > New query > Run
--  මේක schema එක විතරයි — data seed එක supabase/seed.sql එකේ.
-- ============================================================================

create extension if not exists "pgcrypto" with schema extensions;

do $$ begin
  create type user_role as enum ('member', 'admin', 'superadmin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type app_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type msg_status as enum ('unread', 'read', 'replied');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- 1. profiles — website accounts (NIC-based login)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  nic text unique not null,
  phone text default '',
  auth_email text default '',
  password_display text default '',     -- admin view එකේ "current password" පෙන්වීමට (base64)
  role user_role not null default 'member',
  status text not null default 'active',
  joined_date timestamptz not null default now()
);

-- ✅ user requirement: NIC වලින් login — anon ලඟට nic→email lookup පමණයි (password නෑ)
create or replace view public.login_lookup with (security_invoker = off) as
  select nic, auth_email from public.profiles;

grant select on public.login_lookup to anon, authenticated;

-- role/status protection
create or replace function public.protect_role_change() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (new.role is distinct from old.role or new.status is distinct from old.status) then
    if auth.uid() is not null and not exists (
      select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin')
    ) then
      raise exception 'Only administrators can change role or status';
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_protect_role on public.profiles;
create trigger trg_protect_role before update on public.profiles
  for each row execute function public.protect_role_change();

-- ---------------------------------------------------------------------------
-- 2. business_units + children
-- ---------------------------------------------------------------------------
create table if not exists public.business_units (
  slug text primary key,
  "order" int not null default 0,
  name_en text not null,
  name_si text default '',
  category_en text default '',
  category_si text default '',
  tagline_en text default '',
  tagline_si text default '',
  desc_en text default '',
  desc_si text default '',
  logo text default '',
  cover text,
  is_new boolean default false,
  active boolean default true,
  special text default 'default'       -- default | rural-bank | consumer | fuel-station
);

create table if not exists public.business_services (
  id uuid primary key default gen_random_uuid(),
  business_slug text not null references public.business_units (slug) on delete cascade,
  "order" int not null default 0,
  title_en text not null,
  title_si text default '',
  desc_en text default '',
  desc_si text default '',
  features_en text[] default '{}',
  features_si text[] default '{}',
  active boolean default true
);

create table if not exists public.business_contacts (
  id uuid primary key default gen_random_uuid(),
  business_slug text not null references public.business_units (slug) on delete cascade,
  role_en text default '',
  role_si text default '',
  name text default '',
  location text default '',
  phone text default '',
  note_en text default '',
  note_si text default ''
);

create table if not exists public.business_branches (
  id uuid primary key default gen_random_uuid(),
  business_slug text not null references public.business_units (slug) on delete cascade,
  name text default '',
  manager text default '',
  location text default '',
  phone text default ''
);

-- ---------------------------------------------------------------------------
-- 3. board_members
-- ---------------------------------------------------------------------------
create table if not exists public.board_members (
  id uuid primary key default gen_random_uuid(),
  "order" int not null default 0,
  category text not null default 'director',   -- chairman | vice-chairman | director | officer
  name_en text not null,
  name_si text default '',
  position_en text default '',
  position_si text default '',
  qualification text default '',
  phone text default '',
  email text default '',
  address text default '',
  photo text
);

-- ---------------------------------------------------------------------------
-- 4. news
-- ---------------------------------------------------------------------------
create table if not exists public.news (
  id text primary key,
  category text not null default 'notice',      -- vacancy | notice | tender | general
  badge_text text,
  title_en text default '',
  title_si text default '',
  desc_en text default '',
  desc_si text default '',
  date date default current_date,
  image text default '',
  pinned boolean default false,
  published boolean default true
);

-- ---------------------------------------------------------------------------
-- 5. gallery
-- ---------------------------------------------------------------------------
create table if not exists public.gallery_items (
  id text primary key,
  title text default '',
  description text default '',
  aspect text default '4:3',
  image text default '',
  likes int default 0
);

create table if not exists public.gallery_comments (
  id uuid primary key default gen_random_uuid(),
  item_id text references public.gallery_items (id) on delete cascade,
  author text default '',
  text text default '',
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 6. messages (business send-inquiry + contact form) — Reply පහසුකම එක්ක
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text default '',
  phone text default '',
  email text default '',
  department text default 'General Society Inquiries',
  subject text,
  message text default '',
  status msg_status default 'unread',
  reply text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 7. membership_applications (rubber-stamp form upload)
-- ---------------------------------------------------------------------------
create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  app_no text unique default ('APP-' || to_char(now(), 'YYYYMMDD') || '-' || lpad((floor(random()*9999))::text, 4, '0')),
  name_si text default '',
  name_en text default '',
  address text default '',
  postal_address text default '',
  nic text default '',
  phone text default '',
  email text,
  certified_form_url text,
  status app_status default 'pending',
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 8. member_rows / voter_rows / data_files (Excel/CSV import)
--    Columns: Member Number, NIC, FULL NAME, ADDRESS, POSTAL ADDRESS, GENDER
-- ---------------------------------------------------------------------------
create table if not exists public.member_rows (
  id uuid primary key default gen_random_uuid(),
  member_no text default '',
  nic text default '',
  full_name text default '',
  address text default '',
  postal_address text default '',
  gender text default '',
  file_name text default ''
);

create table if not exists public.voter_rows (
  id uuid primary key default gen_random_uuid(),
  voter_no text default '',
  nic text default '',
  full_name text default '',
  address text default '',
  postal_address text default '',
  gender text default '',
  file_name text default ''
);

create table if not exists public.data_files (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  rows bigint default 0,
  kind text not null default 'member'      -- member | voter
);

create table if not exists public.data_imports (
  id uuid primary key default gen_random_uuid(),
  kind text default 'member',
  mode text default 'append',
  files text default '',
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 9. fuel_prices (admin එකෙන් හැමදාම update)
-- ---------------------------------------------------------------------------
create table if not exists public.fuel_prices (
  type text primary key,                   -- petrol92 | super_diesel | kerosene
  price numeric not null default 0,
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 10. system_settings (WhatsApp number / emails / years / counters)
-- ---------------------------------------------------------------------------
create table if not exists public.system_settings (
  key text primary key,
  value text not null default ''
);

-- ---------------------------------------------------------------------------
-- 11. RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.business_units enable row level security;
alter table public.business_services enable row level security;
alter table public.business_contacts enable row level security;
alter table public.business_branches enable row level security;
alter table public.board_members enable row level security;
alter table public.news enable row level security;
alter table public.gallery_items enable row level security;
alter table public.gallery_comments enable row level security;
alter table public.messages enable row level security;
alter table public.membership_applications enable row level security;
alter table public.member_rows enable row level security;
alter table public.voter_rows enable row level security;
alter table public.data_files enable row level security;
alter table public.data_imports enable row level security;
alter table public.fuel_prices enable row level security;
alter table public.system_settings enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'superadmin')
  );
$$;

-- profiles: own + admins
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using (auth.uid() = id or public.is_admin());
drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles for insert
  with check (auth.uid() = id or public.is_admin());
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update
  using (auth.uid() = id or public.is_admin());

-- public read (active businesses etc.), admin write
do $$
declare t text;
begin
  foreach t in array array['business_units','business_services','business_contacts','business_branches',
                          'board_members','news','gallery_items','gallery_comments',
                          'member_rows','voter_rows','data_files','fuel_prices','system_settings'] loop
    execute format('drop policy if exists %I_pub_read on public.%I', t, t);
    execute format('create policy %I_pub_read on public.%I for select using (true)', t, t);
    execute format('drop policy if exists %I_admin_write on public.%I', t, t);
    execute format('create policy %I_admin_write on public.%I for all using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
end $$;

-- messages: ඕන කෙනෙකුට යවන්න පුළුවන්; බලන්න/reply කරන්න admin පමණයි
drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages for insert with check (true);
drop policy if exists messages_admin on public.messages;
create policy messages_admin on public.messages for all using (public.is_admin()) with check (public.is_admin());

-- applications: ඕන කෙනෙකුට අයදුම් කරන්න පුළුවන්; admin approve/reject
drop policy if exists apps_insert on public.membership_applications;
create policy apps_insert on public.membership_applications for insert with check (true);
drop policy if exists apps_admin on public.membership_applications;
create policy apps_admin on public.membership_applications for all using (public.is_admin()) with check (public.is_admin());

-- data_imports: admin පමණයි
drop policy if exists imports_admin on public.data_imports;
create policy imports_admin on public.data_imports for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 12. homepage live counters (optional refresh trigger placeholder)
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_fuel_touch on public.fuel_prices;
create trigger trg_fuel_touch before update on public.fuel_prices
  for each row execute function public.touch_updated_at();
