# ශ්‍රී සමෘද්ධි සමූපකාර සමිතිය — Cooperative Society Website

**Next.js + TypeScript + Tailwind CSS + Supabase + Vercel** භාවිතයෙන් නිර්මාණය කළ සම්පූර්ණ සමූපකාර වෙබ් අඩවි පද්ධතියකි.

> ද්විභාෂා (සිංහල / English) • Bold Corporate Design • Member Portal • Admin Panel

---

## ✨ ඇතුළත් වන දේ (Features)

### 🌐 Public Website
- **මුල් පිටුව** — Hero, stats, services, business, news, testimonials, CTA
- **අපි ගැන** — Mission, Vision, Values, History
- **සේවා** — ඉතිරිකිරීම්, ණය, කෘෂි, පාරිභෝගික, රක්ෂණ, පුහුණු (bilingual DB content)
- **ව්‍යාපාර** — සමූපකාර ව්‍යාපාර ඒකක
- **සාමාජිකයින්** — Public member directory + search + detail pages
- **අධ්‍යක්ෂ මණ්ඩලය** — Board of Directors
- **පුවත්** — News/notices/events + detail pages
- **ගැලරිය** — Category filter + lightbox
- **රැකියා** — Job vacancies + online application form
- **සම්බන්ධ වන්න** — Contact info + message form
- **Login / Register** — Supabase Auth (email + password)
- **Language Switcher** — සිංහල ⇄ English (cookie-based, SSR)

### 👤 Member Portal (`/portal`)
- Dashboard — ඉතිරිකිරීම් ශේෂය, ණය සාරාංශය, මෑත ගනුදෙනු
- මගේ ඉතිරිකිරීම් — ගිණුම් + ගනුදෙනු ඉතිහාසය
- මගේ ණය — ණය විස්තර + ගෙවීම්
- මගේ පැතිකඩ — Profile edit

### 🛠 Admin Panel (`/admin`)
- Overview stats
- සාමාජික කළමනාකරණය — approve / role change (member / officer / admin)
- පුවත් කළමනාකරණය — bilingual CRUD + publish/unpublish
- රැකියා කළමනාකරණය — bilingual CRUD
- ගැලරි කළමනාකරණය — add/delete
- පණිවිඩ — contact inbox (mark read / delete)

---

## 🚀 ආරම්භ කිරීම (Getting Started)

### 1) Dependencies ස්ථාපනය
```bash
cd coop-web
npm install
```

### 2) Supabase project එකක් සාදන්න
1. [supabase.com](https://supabase.com) වෙත ගොස් **New project** සාදන්න
2. **SQL Editor** → **New query** → [`supabase/schema.sql`](./supabase/schema.sql) සම්පූර්ණයෙන් paste කර **Run** කරන්න
3. Project **Settings → API** වලින් මේවා පිටපත් කරන්න:
   - `Project URL`
   - `anon public` key

### 3) Environment variables
`.env.example` එක copy කර `.env.local` නමින් සාදන්න:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4) Dev server ධාවනය
```bash
npm run dev
```
[http://localhost:3000](http://localhost:3000) විවෘත කරන්න.

> 💡 Supabase සම්බන්ධ නොකරත් site එක **demo data** එක්ක ක්‍රියා කරයි (design බලන්න).

### 5) පළමු Admin භූමිකාව
1. Website එකේ **Register** වී ගිණුමක් සාදන්න
2. Supabase **SQL Editor** එකේ මෙය run කරන්න (email එක වෙනස් කර):

```sql
update public.profiles
  set role = 'admin', status = 'active'
  where email = 'you@example.com';
```

3. නැවත login වන්න — `/admin` හි Admin panel එක ලැබේ.

---

## ☁️ Vercel වෙත Deploy කිරීම

1. කේතය **GitHub** repository එකකට push කරන්න
2. [vercel.com](https://vercel.com) → **New Project** → repository එක import කරන්න
3. **Environment Variables** එක් කරන්න:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (උදා: `https://your-site.vercel.app`)
4. **Deploy** ඔබන්න ✅

### Supabase Auth settings
Supabase → **Authentication → URL Configuration**:
- **Site URL**: `https://your-site.vercel.app`
- **Redirect URLs**: `https://your-site.vercel.app/auth/callback` සහ `http://localhost:3000/auth/callback`

---

## 🗄 Database Schema (සාරාංශය)

| Table | විස්තරය |
|---|---|
| `profiles` | සාමාජික පැතිකඩ (auth.users සමඟ 1:1) |
| `savings_accounts` | ඉතිරිකිරීම් ගිණුම් (regular / fixed / children) |
| `savings_transactions` | තැන්පතු / ආපසු ගැනීම් (balance auto-update trigger) |
| `loans` | ණය (personal/business/education/housing/agriculture/emergency) |
| `loan_payments` | ණය ගෙවීම් |
| `news` | පුවත්/නිවේදන (bilingual, publish workflow) |
| `directors` | අධ්‍යක්ෂ මණ්ඩලය |
| `gallery` | ඡායාරූප ගැලරිය |
| `careers` | රැකියා අවස්ථා |
| `job_applications` | රැකියා අයදුම්පත් |
| `contact_messages` | සම්බන්ධතා පණිවිඩ |
| `services` | සේවා (bilingual) |
| `business_units` | ව්‍යාපාර ඒකක |
| `site_settings` | අඩවි සැකසුම් (නම, ලිපිනය, social links) |
| `member_directory` | Public view (නිරාවරණය නොවන තොරතුරු පමණයි) |

**Security:**
- Row Level Security (RLS) සියලුම tables වල
- සාමාජිකයින්ට තමන්ගේ දත්ත පමණයි කියවිය/සංස්කරණය කළ හැක
- Admin/Officer භූමිකා සඳහා කළමනාකරණ ප්‍රතිපත්ති
- Role/status වෙනස් කිරීම trigger එකෙන් ආරක්ෂා කර ඇත
- `auth.users` insert trigger එකෙන් automatically profile නිර්මාණය වේ
- Member number (`M-00001`) auto-assign trigger

---

## 📁 Project Structure

```
coop-web/
├── supabase/
│   └── schema.sql              # සම්පූර්ණ database schema + seed data
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (public pages)      # home, about, services, business, members...
│   │   ├── login/ register/    # Supabase Auth
│   │   ├── portal/             # Member portal
│   │   └── admin/              # Admin panel
│   ├── components/             # UI + feature components
│   ├── context/                # Language context (si/en)
│   ├── lib/                    # i18n, format, data access, supabase clients
│   ├── types/                  # TypeScript database types
│   └── middleware.ts           # Session + route protection
├── tailwind.config.ts
└── next.config.ts
```

---

## 🌍 භාෂා කළමනාකරණය

- UI strings: `src/lib/i18n.ts` (`si` / `en` dictionaries)
- DB content: සෑම table එකකම `title_si` + `title_en` වැනි bilingual columns
- Language switcher → `lang` cookie → SSR මගින් content render වේ

---

## 🛠 තාක්ෂණ ගොඩනැගීම (Stack)

- [Next.js 15](https://nextjs.org) (App Router)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) (PostgreSQL + Auth + RLS)
- [Vercel](https://vercel.com) Hosting
- [Lucide Icons](https://lucide.dev)

---

© ශ්‍රී සමෘද්ධි සමූපකාර සමිතිය. සියලුම හිමිකම් ඇවිරිණි.
