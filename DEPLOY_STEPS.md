# 🚀 Deploy මාර්ගෝපදේශය (සිංහලෙන් — පියවරෙන් පියවර)

පඳුවස්නුවර නව බහු අරමුණු සමූපකාර සමිති වෙබ් අඩවිය — GitHub → Vercel + Supabase.

---

## පියවර 1 — Supabase දත්ත සමුදාය

1. https://supabase.com → sign in → **New Project** (හෝ දැනට ඇති project එක භාවිතා කරන්න — ref: `rayxoujhocvfzlzufdtm`)
2. වම් පස **SQL Editor** → **New query**
3. `supabase/schema.sql` file එකේ මුළු අන්තර්ගතයම copy කර paste කර **Run** කරන්න
4. නැවත **New query** එකක් → `supabase/seed.sql` file එකේ මුළු අන්තර්ගතයම copy කර paste කර **Run** කරන්න
5. **Authentication → Providers → Email** → "Confirm email" **OFF** කරන්න (NIC login සඳහා අවශ්‍යයි)
6. **Settings → API** වලින් මේ දෙක copy කරගන්න:
   - Project URL
   - anon public key

## පියවර 2 — පිවිසුම් පරීක්ෂා කිරීම

සමිතියේ වෙබ් අඩවිය හරහා `/signin` පිටුවට ගොස්:

| භූමිකාව | NIC | Password |
|---|---|---|
| Superadmin | `SUPERADMIN` | `Admin@123` |
| Admin | `ITKWEB` | `Kenula@123` |

පිවිසුම් වීමෙන් පසු `/admin` පිටුවට යන්න.

> **සටහන:** SQL Editor එකෙන් role වෙනස් කරන විට `ERROR P0001: Only administrators can change role or status` ආවොත් — protect_role_change() trigger එක නිසා. `update profiles set role='admin' where nic='ITKWEB';` වැනි වෙනස්කම් මුලින් SQL එකෙන් කර, ඊට පස්සේ Superadmin ලෙස ලොග් වී Admin Console එකෙන් වෙනස් කරන්න.

## පියවර 3 — GitHub එකට push කිරීම

```bash
cd coop-web
git init   (දැනටමත් repo නම් අවශ්‍ය නෑ)
git add .
git commit -m "Panduwasnuwara MPCS website"
git remote add origin https://github.com/ඔබේ-username/ඔබේ-repo.git
git push -u origin main
```

⚠️ **`.env.local` GitHub එකට යන්නේ නැති බවට වග බලා ගන්න** (`.gitignore` එකේ ඇත). වැරදීමකින් push වුණොත් Supabase → Settings → API → **Rotate keys**.

## පියවර 4 — Vercel එකට deploy කිරීම

1. https://vercel.com → **Add New → Project**
2. GitHub repo එක තෝරන්න → **Import**
3. **Environment Variables** එකේ මේ දෙක එකතු කරන්න:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL (පියවර 1)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key (පියවර 1)
4. **Deploy** ඔබන්න
5. Deploy වූ පසු https://ඔබේ-වෙබ්-අඩවිය.vercel.app ලිපිනයෙන් පිවිසෙන්න

## පියවර 5 — FormSubmit සක්‍රීය කිරීම (Contact Form)

1. `/contact` පිටුවෙන් පරීක්ෂණ පණිවුඩයක් යවන්න
2. `itk200712@gmail.com` inbox එකට **"Activate Form"** ලිපියක් එයි — එහි ඇති link එක click කරන්න (එක වරක් පමණයි)
3. ඉන් පසු හැම පණිවුඩයක්ම එම විද්‍යුත් තැපෑලට යයි
4. විද්‍යුත් තැපෑල වෙනස් කරන්නේ **Admin → System Settings → Contact Form Submission Emails** එකෙන්

## පියවර 6 — WhatsApp Password Recovery

Admin → System Settings → **Password Reset WhatsApp Number** → `94742352670` (දැනටමත් ඇත).
"Forgot Password?" click කළ විට member කෙනෙකුගේ විස්තර සමඟ WhatsApp message එකක් මෙම අංකයට සැකසේ.

---

## නිතර අසන ප්‍රශ්න

**"Supabase වින්‍යාස වී නොමැත" යැයි පෙන්වයි නම්:**
`.env.local` එකේ keys ඇතිද බලා `npm run dev` නැවත අරින්න (browser Ctrl+Shift+R). Vercel එකේ නම් Environment Variables නැවත බලා redeploy කරන්න.

**password එකෙන් පිවිසිය නොහැකි නම්:** NIC එක නිවැරදිද? Supabase → Authentication → Users එකේ user ඉන්නවද? ඉන්නවා නම් SQL එකෙන්:
```sql
update auth.users set encrypted_password = extensions.crypt('නවpassword', extensions.gen_salt('bf'))
where email = 'nic@members.mpcs.lk';
```

**admin පිටුවට යන්න බැරි නම්:** Middleware එකෙන් admin/superadmin පමණයි ඇතුළු වෙන්නේ. පිවිසීමෙන් පස්සේ role එක `admin` හෝ `superadmin` දැයි බලන්න.

---

Designed By Induwara Thathsara · පඳුවස්නුවර නව බහු අරමුණු සමූපකාර සමිතිය
