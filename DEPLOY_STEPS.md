# 🚀 සම්පූර්ණ Deploy Guide — GitHub → Supabase → Vercel
### පියවරෙන් පියවර | ඔයාගේ coop-web project එක internet එකට ගේන හැටි

> ⏱ ඇස්තමේන්තුගත කාලය: පැය 1ක් පමණ (පළවෙනි වතාවට)
> 💡 පිළිවෙළ: **GitHub (code) → Supabase (database) → Vercel (hosting) → Connect**

---

## 📋 කලින් සූදානම් කරගන්න ඕන දේ

- [ ] GitHub ගිණුමක් (github.com)
- [ ] Supabase ගිණුමක් (supabase.com)
- [ ] Vercel ගිණුමක් (vercel.com)
- [ ] ඔයාගේ පරිගණකයේ `coop-web` project එක (මේ guide එක තියෙන folder එක)

> තුනම **github.com එකෙන් sign up** කරන්න පුළුවන් — එක ගිණුමකින් හැම දේම කරන්න පුළුවන්.

---

# 🅰️ පියවර 1 — GitHub එකට code එක යවන්න

### 1.1 GitHub එකේ නව repository එකක් හදන්න

1. [github.com](https://github.com) එකට **login** වෙන්න
2. ඉහළ දකුණු කෙළින් **➕** icon එක → **"New repository"** ඔබන්න
3. මේ විදිහට පුරවන්න:
   - **Repository name:** `sri-samrudhi-coop` (ඔයාට ඕන නමක් දාන්න පුළුවන්)
   - **Public** තෝරන්න (Private නම් Vercel free plan එකේ ප්‍රශ්න ඇති වෙන්න පුළුවන් — Public හොඳයි)
   - **"Add a README file"** ✅ ඉවත් කරන්න (tick නැති කරන්න)
   - **.gitignore** — තෝරන්න එපා (අපේ project එකේ දැනටමත් තියෙනවා)
4. **"Create repository"** ඔබන්න
5. ඊළඟ පිටුවේ `…or push an existing repository from the command line` යටතේ තියෙන commands මතක තියාගන්න (URL එක වැදගත්!)

### 1.2 පරිගණකයෙන් code එක push කරන්න (Terminal)

Terminal / Command Prompt එක විවෘත කර පහත commands **එකින් එක** run කරන්න:

```bash
# 1. project folder එකට යන්න
cd coop-web

# 2. git පටන් ගන්න
git init

# 3. සියලුම files එකතු කරන්න
git add .

# 4. පළමු commit එක
git commit -m "Sri Samrudhi Cooperative Society website"

# 5. branch නම main කරන්න
git branch -M main

# 6. GitHub repository එක සම්බන්ධ කරන්න (ඔයාගේ නම/repo වලට වෙනස් කරන්න!)
git remote add origin https://github.com/ඔයාගේ-username/sri-samrudhi-coop.git

# 7. Push කරන්න
git push -u origin main
```

### 1.3 Username / Password ඉල්ලුවොත්?

> GitHub දැන් **password** භාවිතා කරන්නේ නැහැ. **Personal Access Token** එකක් දෙන්න ඕන.

1. GitHub එකේ: **Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token (classic)**
2. **repo** permission එක ✅ තෝරන්න, **Generate** ඔබන්න
3. Token එක **එක වතාවක් පමණයි පෙන්වන්නේ** — copy කර ගොනුවක සුරකින්න
4. Push කරන විට:
   - **Username:** ඔයාගේ GitHub username
   - **Password:** වෙනුවට **Token එක** paste කරන්න

> ✅ **සරල විකල්පය:** [GitHub Desktop](https://desktop.github.com) app එක install කර "Add Existing Repository" → folder එක තෝරා "Publish repository" ඔබන්න. Terminal එකක් ඕන නැහැ!

### 1.4 සාර්ථකද කියලා බලන්න

GitHub repository page එක **refresh** කරන්න — `src`, `supabase`, `package.json` වගේ files පෙනෙනවා නම් **සාර්ථකයි** ✅

---

# 🅱️ පියවර 2 — Supabase (Database) සකසන්න

### 2.1 Supabase project එකක් හදන්න

1. [supabase.com](https://supabase.com) එකට යන්න → **"Start your project"** → **GitHub එකෙන් sign in** කරන්න
2. **"New Project"** ඔබන්න
3. මේ විදිහට පුරවන්න:
   - **Organization:** ඔයාගේ නම (පළමු වතාවට නම් default එක හරි)
   - **Name:** `sri-samrudhi-coop`
   - **Database Password:** ශක්තිමත් password එකක් **සුරකින්න** (අමතක වුණත් පස්සේ reset කරන්න පුළුවන්)
   - **Region:** `Southeast Asia (Singapore)` — ලංකාවට වේගවත්ම region එක 🇱🇰
4. **"Create new project"** ඔබන්න
5. ⏳ Project එක සැකසෙනකම් විනාඩි 2-3 ඉන්න

### 2.2 SQL schema එක Run කරන්න (🔥 වැදගත්ම පියවර)

1. Supabase Dashboard එකේ **මුළු වම් පැත්තේ menu එකෙන් → "SQL Editor"** තෝරන්න
2. **"New query"** ඔබන්න
3. ඔයාගේ පරිගණකයේ **`coop-web/supabase/schema.sql`** file එක **Notepad / VS Code** එකෙන් විවෘත කර **සම්පූර්ණයෙන් copy** කරන්න
4. SQL Editor එකට **paste** කරන්න
5. දකුණු පැත්තේ ඇති **"Run"** බොත්තම (හෝ `Ctrl + Enter`) ඔබන්න
6. පහළ **"Success. No rows returned"** කියලා ආවොත් **සාර්ථකයි** ✅

> ⚠️ **Error ආවොත්:** මුල ඉඳන් අන්තිමට සම්පූර්ණ script එකම paste කරලා තියෙනවද බලන්න. Editor එකේ ඇතැම් කොටස් මගහැරිලා නැද්ද බලන්න.

7. **සාර්ථකද කියලා බලන්න:** වම් පැත්තේ **"Table Editor"** එකට යන්න — `profiles`, `news`, `savings_accounts`, `loans` වගේ **tables 14ක්** පෙනෙනවා නම් හරි ✅

### 2.3 Supabase Keys ගන්න (කොපි කරගන්න)

1. වම් පැත්තේ **"Settings" (gear icon) → "API"** යන්න
2. මේ දෙක **කොපි කර ගොනුවක සුරකින්න** (පස්සේ Vercel එකට දාන්න ඕන):

| නම | තැන |
|---|---|
| **Project URL** | `Settings → API → Project URL` (උදා: `https://abcdefghij.supabase.co`) |
| **anon public key** | `Settings → API → Project API keys → anon / public` (දිග token එක) |

> 🔒 **service_role key** එක කවදාවත් කාටවත් දෙන්න එපා / website එකේ frontend එකේ දාන්න එපා. ඒක රහස්!

### 2.4 Email Confirmation සරල කරන්න (පරීක්ෂණ සඳහා)

1. **Authentication → Sign In / Providers → Email** යන්න
2. **"Confirm email"** toggle එක **OFF** කරන්න (testing වලට ලේසියි — register වුණ හැටියේ login වෙන්න පුළුවන්)
3. **Save** ඔබන්න

> පස්සේ production එකට නම් ON කරන්න පුළුවන් (ආරක්ෂාවට හොඳයි).

### 2.5 Website එකට ඉඩ දෙන්න (Auth URLs)

1. **Authentication → URL Configuration** යන්න
2. **Site URL** එකට: `http://localhost:3000` දාන්න (දැනට — Vercel deploy කරලා පස්සේ වෙනස් කරනවා)
3. **Redirect URLs** එකට **"Add URL"** ඔබලා මේවා දෙක එක් කරන්න:
   - `http://localhost:3000/auth/callback`
   - `https://your-site.vercel.app/auth/callback` (පස්සේ ඔයාගේ ඇත්ත domain එක දානවා)
4. **Save** ඔබන්න

---

# 🅲 පියවර 3 — Vercel එකට Host කරන්න

### 3.1 Vercel ගිණුම සම්බන්ධ කරන්න

1. [vercel.com](https://vercel.com) එකට යන්න
2. **"Continue with GitHub"** ඔබන්න (පළමු වතාවට sign up වෙනවා නම්)
3. Vercel එකට **GitHub access** ලබා දෙන්න (authorize කරන්න)

### 3.2 Project එක Import කර Deploy කරන්න

1. Vercel Dashboard එකේ **"Add New → Project"** ඔබන්න
2. ඔයාගේ repository list එකෙන් **`sri-samrudhi-coop`** හොයා **"Import"** ඔබන්න
   - පෙනෙන්නේ නැත්නම් **"Adjust GitHub App Permissions"** ඔබලා repo එකට access දෙන්න
3. මෙන්න මේක **🔥 ඉතාම වැදගත්** — **"Environment Variables"** කොටසේ මේ තුන එකින් එක **එක් කරන්න**:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ඔයාගේ Supabase **Project URL** එක |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ඔයාගේ Supabase **anon public key** එක |
| `NEXT_PUBLIC_SITE_URL` | `https://sri-samrudhi-coop.vercel.app` (deploy වුණාම ලැබෙන URL එක — පස්සේ update කරන්න පුළුවන්) |

> එකින් එක: **Key** එකට නම, **Value** එකට අගය paste කර **"Add"** ඔබන්න. තුනම එක් කරලා **"Deploy"** ඔබන්න.

4. ⏳ Deploy වෙන්න විනාඩි 2-4 යනවා — confetti 🎉 ආවොත් **සාර්ථකයි!**
5. **"Visit"** / **"Go to Dashboard"** ඔබන්න — ඔයාගේ website එක **ජීවමානව** තියෙනවා! 🎊

### 3.3 ඔයාගේ Website එකේ ලිපිනය (Domain)

- Default: **`https://sri-samrudhi-coop.vercel.app`** (ඔයාගේ project නමට අනුව)
- **Settings → Domains** එකෙන් ඔයාගේම domain එකක් (උදා: `samrudhi-coop.lk`) එකතු කරන්නත් පුළුවන්

### 3.4 දැන් ආයෙත් Supabase එක update කරන්න (දෙන්න සම්බන්ධ කිරීම)

Supabase → **Authentication → URL Configuration**:
1. **Site URL** = `https://sri-samrudhi-coop.vercel.app` (ඔයාගේ ඇත්ත Vercel URL එක)
2. **Redirect URLs** එකට: `https://sri-samrudhi-coop.vercel.app/auth/callback` එකතු කරන්න
3. **Save** ✅

Vercel → **Settings → Environment Variables**:
- `NEXT_PUBLIC_SITE_URL` = ඔයාගේ ඇත්ත Vercel URL එක → පසුව **Deployments → ⋯ → Redeploy**

---

# 🅳 පියවර 4 — පළමු Admin භූමිකාව + Content එකතු කිරීම

### 4.1 Website එකේ ලියාපදිංචි වෙන්න

1. ඔයාගේ website එකේ **"ලියාපදිංචි වන්න"** (Register) යන්න
2. ඔයාගේ විස්තර පුරවා **Register** කරන්න
3. `Confirm email` OFF කරලා තිබුණොත් — දැන්ම login වෙන්න පුළුවන්

### 4.2 Admin බලය දෙන්න

1. Supabase → **SQL Editor → New query**
2. මේක run කරන්න (**ඔයාගේ email එකට වෙනස් කරලා**):

```sql
update public.profiles
  set role = 'admin', status = 'active'
  where email = 'ඔයාගේ-email@example.com';
```

3. Website එකේ **නැවත login** වෙන්න → **`/admin`** එකට යන්න
4. **Admin Dashboard** එක පෙනෙනවා ✅

### 4.3 Content එකතු කරන්න

Admin panel එකෙන් දැන් ඔයාට පුළුවන්:
- 📰 **පුවත්** — නව පුවත්/නිවේදන එක් කරන්න (සිංහල + ඉංග්‍රීසි)
- 💼 **රැකියා** — නව රැකියා ඇපැයුම් දාන්න
- 🖼 **ගැලරිය** — ඡායාරූප එක් කරන්න
- 👥 **සාමාජිකයින්** — approve කරන්න, officer/admin බලය දෙන්න
- ✉️ **පණිවිඩ** — contact form එකෙන් එන පණිවිඩ කියවන්න

> 💡 **සමිතියේ නම, ලිපිනය, දුරකථන, social links වෙනස් කරන්න:** Supabase → **Table Editor → `site_settings`** → `site` row එක edit කරන්න.

---

# ✅ අවසාන Check List

- [ ] GitHub repo එකේ code එක තියෙනවා
- [ ] Supabase එකේ SQL schema එක run වෙලා tables 14 තියෙනවා
- [ ] Vercel එකේ 3 environment variables දාලා තියෙනවා
- [ ] Website එක live (vercel.app URL එක විවෘත වෙනවා)
- [ ] Supabase Auth URLs එකේ Vercel URL එක දාලා තියෙනවා
- [ ] Register වෙලා SQL එකෙන් admin බලය ගත්තා
- [ ] `/admin` එකෙන් content එකතු කරනවා

---

# 🔧 ප්‍රශ්න ඇති වුණොත් (Troubleshooting)

| ප්‍රශ්නය | විසඳුම |
|---|---|
| `git push` එකේ error / authentication fail | Personal Access Token එක (password නෙවෙයි) භාවිතා කරන්න — පියවර 1.3 බලන්න |
| Website එකේ login/register වැඩ කරන්නේ නැහැ | Vercel **Environment Variables** හරිද බලන්න → වෙනස් කළා නම් **Redeploy** කරන්න |
| Email verification link එකෙන් error | Supabase **Auth → URL Configuration** එකේ ඔයාගේ Vercel URL එක තියෙනවද බලන්න |
| Build failed on Vercel | Vercel **Deployments → Build Logs** බලන්න; local `npm run build` වැඩ කරනවද පරීක්ෂා කරන්න |
| Website එකේ demo දත්ත විතරයි පෙනෙන්නේ | Environment variables නැති නිසා — Supabase URL/key දාලා Redeploy කරන්න |
| Supabase SQL run වෙන්නේ නැහැ | සම්පූර්ණ `schema.sql` එකම paste කරලද බලන්න; මුල ඉඳන් run කරන්න |
| Site එක මන්දගාමීයි | Supabase region `Singapore` ද? Vercel එකේ පසුව CDN cache වේ |

---

# 🔄 පස්සේ code වෙනස් කළාම (Update කරන හැටි)

```bash
cd coop-web
git add .
git commit -m "Update website"
git push
```

> Vercel එක **automatic deploy** කරනවා — මිනිත්තු 2කින් website එක update! 🚀

---

ශුභ පැතුම්! 🎉 ඔයාගේ සමූපකාර website එක දැන් ලෝකෙටම පේනවා.
