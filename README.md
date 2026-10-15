# පඳුවස්නුවර නව බහු අරමුණු සමූපකාර සමිතිය — වෙබ් අඩවිය

Panduwasnuwara New Multi Purpose Co-Operative Society LTD (Reg. ලියා/186, ස්ථාපිත 1976-10-06)

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase · Vercel

## දිවීම (Quick Start)

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # logic + data verification (58 tests)
npm run build      # production build
```

Supabase නැතිව වුණත් site එක වැඩ කරයි (seed data fallback). SQL run කළාට පස්සේ live database එකට යනවා.

## අඩවි ව්‍යුහය

| මාර්ගය | විස්තරය |
|---|---|
| `/` | මුල් පිටුව — hero, සංඛ්‍යාලේඛන, ව්‍යාපාර, සේවා, නිවේදන, සමාජ මාධ්‍ය |
| `/businesses` + `/businesses/[slug]` | ව්‍යාපාර අංශ 14 — services, contacts, විශේෂ pages (Rural Bank 22 ශාඛා, Consumer, Fuel) |
| `/board` | අධ්‍යක්ෂ මණ්ඩලය (9 නිලධාරීන්) |
| `/membership/members` | සාමාජික ලේඛනය — 52,964 members / 52 files / "Page 1 / 2119" |
| `/membership/voters` | ඡන්ද ලේඛනය — 2,359 voters / 1 file / "Page 1 / 95" |
| `/membership/apply` | සාමාජිකත්ව අයදුම්පත (රබර් මුද්‍රා ලේඛනය ≤10MB) |
| `/news` | නිවේදන (Job Vacancies / Special Notices / Tenders / News) |
| `/gallery` | ඡායාරූප — title + description සමඟ, lightbox, aspect ratios |
| `/contact` | සම්බන්ධතා පෝරමය — FormSubmit මගින් විද්‍යුත් තැපෑලට |
| `/signin` · `/register` | NIC පිවිසුම · ලියාපදිංචිය (WhatsApp password recovery ඇතුළුව) |
| `/admin` | පරිපාලක තිර 13ක් (middleware මගින් ආරක්ෂිත) |

## විශේෂාංග (අවශ්‍යතා)

1. **Contact form** → FormSubmit (formsubmit.co) — email එක Settings වලින් වෙනස් කරන්න පුළුවන්
2. **Forgot Password** → WhatsApp `wa.me/94742352670` (Settings වලින් අංකය වෙනස් කරන්න පුළුවන්)
3. **NIC පිවිසුම** — `nic@members.mpcs.lk` synthetic auth email
4. **සේවා නැති ව්‍යාපාර** → DEFAULT template (Hemas ආකාරය) — admin එකෙන් සංස්කරණය කරන්න පුළුවන්
5. **Fuel prices** — admin → Fuel Prices එකෙන් update (414 / 528 / 285)
6. **Registered Members** — PASSWORD column (show/hide + reset)
7. **Gallery** — title + description හැම විටම පෙනේ
8. **Send Inquiry** → admin → Messages & Inquiries (business tabs + Unread/Read/Replied + Reply)
9. **Services (N) badge** → Division Offered Services tab එකට pre-select වේ

## Database (SQL — වෙන වෙනම)

- `supabase/schema.sql` — tables 17ක් + `login_lookup` view + `protect_role_change` trigger
- `supabase/seed.sql` — screenshots වල සියලු දත්ත + superadmin ගිණුම

**Login (SQL run කළාට පස්සේ):**
| භූමිකාව | NIC | Password |
|---|---|---|
| Superadmin | `SUPERADMIN` | `Admin@123` |
| Admin | `ITKWEB` | `Kenula@123` |

## තාක්ෂණික සටහන්

- `src/lib/seed.ts` — canonical screenshot data (public pages fallback)
- `src/lib/directory-rows.ts` — 52,964 + 2,359 rows client-side generate වේ
- `.env.local` කවදාවත් GitHub එකට push කරන්න එපා
- පරිපාලක වෙනස්කම් "Supabase වින්‍යාස වී නොමැත" ලෙස පෙන්වූවොත් — `.env.local` බලන්න; `npm run dev` නැවත අරින්න
