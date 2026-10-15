// ============================================================================
//  Member / Voter registry — deterministic client-side row generator
//  screenshots වල දත්ත: 52,964 members (52 files) / 2,359 voters (1 file)
//  head rows = capture කළ පේළි 12; ඉතිරිය realistic Sinhala data generate වේ.
//  Browser එකේ generate වෙන නිසා server → client payload එකක් නෑ.
// ============================================================================

import type { DataFile, MemberRow, VoterRow } from "@/lib/types";

/* ---------------------------------------------------------------- files --- */
const PRIMARY_MEMBER_FILES: Array<Omit<DataFile, "kind">> = [
  { file_name: "Hettipola.xlsx", rows: 3600 },
  { file_name: "Panduwasnuwara.xlsx", rows: 2363 },
  { file_name: "Diyulwawa.xlsx", rows: 2166 },
  { file_name: "Barampola.xlsx", rows: 2073 },
  { file_name: "Kanogama.xlsx", rows: 2001 },
  { file_name: "Madulla.xlsx", rows: 1989 },
];

const EXTRA_VILLAGES = [
  "Polpitiya", "Narammala", "Alawwa", "Pannala", "Kobeigane", "Wellawa",
  "Ganewatta", "Nikaweratiya", "Maho", "Bingiriya", "Wariyapola", "Ambanpola",
  "Galgamuwa", "Ehetuwewa", "Kotavehera", "Polgahawela", "Rambukkana",
  "Mawathagama", "Kuliyapitiya", "Udubaddawa", "Pannala East", "Hettipola East",
  "Hettipola West", "Diyulwawa North", "Diyulwawa South", "Barampola North",
  "Barampola South", "Kanogama East", "Kanogama West", "Madulla North",
  "Madulla South", "Panduwasnuwara East", "Panduwasnuwara West", "Panduwasnuwara Central",
  "Bogamuwa", "Dambadeniya", "Giriulla", "Melsiripura", "Bingiriya South",
  "Kotuwewa", "Gokarella", "Pannala Central", "Alawwa North", "Katupotha",
  "Muddaragama", "Wilgamuwa",
];

const MEMBER_TOTAL = 52_964;
const VOTER_TOTAL = 2_359;

function buildMemberFiles(): DataFile[] {
  const extras: Array<Omit<DataFile, "kind">> = [];
  const n = EXTRA_VILLAGES.length; // 46
  const remaining = MEMBER_TOTAL - 14_192; // 38,772
  const base = Math.floor(remaining / n);
  let allocated = 0;
  for (let i = 0; i < n; i++) {
    const rows = i === n - 1 ? remaining - allocated : base + ((i * 137) % 260);
    allocated += rows;
    extras.push({ file_name: `${EXTRA_VILLAGES[i]}.xlsx`, rows });
  }
  // පේළි එකතුව නිවැරදිව 52,964 ට සකසන්න
  const sum = [...PRIMARY_MEMBER_FILES, ...extras].reduce((s, f) => s + f.rows, 0);
  extras[extras.length - 1].rows += MEMBER_TOTAL - sum;
  return [...PRIMARY_MEMBER_FILES, ...extras].map((f) => ({ ...f, kind: "member" as const }));
}

export const MEMBER_FILES: DataFile[] = buildMemberFiles();
export const VOTER_FILES: DataFile[] = [{ file_name: "Panduwasnuwara.xls", rows: VOTER_TOTAL, kind: "voter" }];

/* ----------------------------------------------------------------- rows --- */
// captured head rows (screenshots — first 12)
const MEMBER_HEAD: MemberRow[] = [
  { member_no: "41/01", nic: "0000000000", full_name: "මුදිත ලියනආරච්චි", address: "බෝගමුවාගොඩ", postal_address: "බෝගමුවාගොඩ", gender: "කාන්තා", file_name: "Panduwasnuwara.xlsx" },
  { member_no: "41/02", nic: "0000000000", full_name: "නි. සේ. සිසිර", address: "හෙට්ටිපොල", postal_address: "හෙට්ටිපොල", gender: "පිරිමි", file_name: "Panduwasnuwara.xlsx" },
  { member_no: "41/03", nic: "0000000000", full_name: "ඩී. එම්. ඩී. සිල්වා බණ්ඩාර", address: "ගිරිඋල්ල", postal_address: "ගිරිඋල්ල", gender: "පිරිමි", file_name: "Panduwasnuwara.xlsx" },
  { member_no: "41/04", nic: "430500139v", full_name: "චන්ද්‍රසේන ගුණසේන", address: "පි/පල්ලේනුවර", postal_address: "පල්ලේනුවර", gender: "පිරිමි", file_name: "Hettipola.xlsx" },
  { member_no: "41/209", nic: "0000000000", full_name: "කේ. එම්. පෙරේරා", address: "පන්නිල්ගොඩ", postal_address: "පන්නිල්ගොඩ", gender: "කාන්තා", file_name: "Hettipola.xlsx" },
  { member_no: "41/210", nic: "0000000000", full_name: "මුදිත ලියනආරච්චි", address: "ය/දොඩම්දෙනියාව", postal_address: "දොඩම්දෙනියාව", gender: "කාන්තා", file_name: "Hettipola.xlsx" },
  { member_no: "41/211", nic: "312490072v", full_name: "චන්ද්‍රසේන ජයසිංහ මුදියන්සේලා ගුණසිංහ", address: "ගිරිඋල්ල", postal_address: "ගිරිඋල්ල", gender: "පිරිමි", file_name: "Diyulwawa.xlsx" },
  { member_no: "41/212", nic: "0000000000", full_name: "නි. කේ. පී. රණසිංහ දිසානායක", address: "බෝගමුවාගොඩ", postal_address: "බෝගමුවාගොඩ", gender: "පිරිමි", file_name: "Diyulwawa.xlsx" },
  { member_no: "41/213", nic: "600164589v", full_name: "චන්ද්‍රසේන ජයසිංහ මුදියන්සේලා ජයසූරිය", address: "හෙට්ටිපොල", postal_address: "හෙට්ටිපොල", gender: "පිරිමි", file_name: "Barampola.xlsx" },
  { member_no: "41/214", nic: "0000000000", full_name: "නි. කේ. පී. ආර්. මුණසිංහ", address: "පල්ලේනුවර", postal_address: "පල්ලේනුවර", gender: "පිරිමි", file_name: "Barampola.xlsx" },
  { member_no: "41/215", nic: "0000000000", full_name: "ජෝතිපාල ලියනආරච්චි", address: "පන්නිල්ගොඩ", postal_address: "පන්නිල්ගොඩ", gender: "කාන්තා", file_name: "Kanogama.xlsx" },
  { member_no: "41/216", nic: "0000000000", full_name: "ඩී. කේ. පී. ආර්. ජයසිංහ", address: "අඹන්කුඹුර", postal_address: "අඹන්කුඹුර", gender: "පිරිමි", file_name: "Kanogama.xlsx" },
];

const VOTER_HEAD: VoterRow[] = [
  { voter_no: "01/01", nic: "0000000000", full_name: "ඩබ්.බී. රණසිංහ", address: "ගිරිඋල්ල", postal_address: "ගිරිඋල්ල", gender: "පිරිමි", file_name: "Panduwasnuwara.xls" },
  { voter_no: "01/03", nic: "0000000000", full_name: "කේ. එම්. අබ්දුල්", address: "පල්ලේනුවර", postal_address: "පල්ලේනුවර", gender: "පිරිමි", file_name: "Panduwasnuwara.xls" },
  { voter_no: "01/05", nic: "0000000000", full_name: "අනු. අබේරත්න", address: "පන්නිල්ගොඩ", postal_address: "පන්නිල්ගොඩ", gender: "කාන්තා", file_name: "Panduwasnuwara.xls" },
  { voter_no: "01/06", nic: "0000000000", full_name: "ලී. පී. ප්‍රේමසිරි", address: "අඹන්කුඹුර", postal_address: "අඹන්කුඹුර", gender: "පිරිමි", file_name: "Panduwasnuwara.xls" },
  { voter_no: "01/07", nic: "0000000000", full_name: "ආර්. පී. සේනා", address: "මැදබුලත්වැව", postal_address: "මැදබුලත්වැව", gender: "පිරිමි", file_name: "Panduwasnuwara.xls" },
  { voter_no: "01/08", nic: "0000000000", full_name: "ඇම්. ඇම්. සිසිර කුමාර ලියනආරච්චි", address: "කුඹුක්කුඹුර, වීරබුලත්වැව", postal_address: "වීරබුලත්වැව", gender: "පිරිමි", file_name: "Panduwasnuwara.xls" },
  { voter_no: "01/09", nic: "0000000000", full_name: "ඇම්. ඇම්. ජයන්ති බණ්ඩාර.", address: "වීරබුලත්වැව", postal_address: "වීරබුලත්වැව", gender: "කාන්තා", file_name: "Panduwasnuwara.xls" },
  { voter_no: "01/10", nic: "0000000000", full_name: "ඇම්. ඇම්. උපුල් කුමාරි", address: "වීරබුලත්වැව", postal_address: "වීරබුලත්වැව", gender: "කාන්තා", file_name: "Panduwasnuwara.xls" },
  { voter_no: "01/11", nic: "0000000000", full_name: "ඇම්. ඇම්. ඇම්. බණ්ඩාර", address: "වීරබුලත්වැව", postal_address: "වීරබුලත්වැව", gender: "පිරිමි", file_name: "Panduwasnuwara.xls" },
  { voter_no: "01/12", nic: "0000000000", full_name: "ඇම්. ඇම්. තිලක්", address: "වීරබුලත්වැව", postal_address: "වීරබුලත්වැව", gender: "පිරිමි", file_name: "Panduwasnuwara.xls" },
  { voter_no: "01/13", nic: "0000000000", full_name: "ඇම්. ඇම්. චන්ද්‍රා බණ්ඩාර", address: "ගිරිඋල්ල", postal_address: "ගිරිඋල්ල", gender: "කාන්තා", file_name: "Panduwasnuwara.xls" },
  { voter_no: "01/14", nic: "0000000000", full_name: "ජී. ඇම්. උපුල් කුමාර", address: "ගිරිඋල්ල", postal_address: "ගිරිඋල්ල", gender: "පිරිමි", file_name: "Panduwasnuwara.xls" },
];

/* ------------------------------------------------------- name building --- */
const INITIALS = ["ඇම්.", "ජී.", "කේ.", "ආර්.", "ඩී.", "එම්.", "බී.", "එච්.", "එල්.", "එන්.", "පී.", "ඩබ්.", "ඒ.", "සී.", "ටී.", "යූ."];
const MID = ["පී.", "ජී.", "ඇම්.", "ඩී.", "කේ.", "බී.", "එම්.", "ආර්.", "එච්.", "සී."];
const SURNAMES = [
  "ලියනආරච්චි", "බණ්ඩාර", "පෙරේරා", "ද සිල්වා", "ගුණසේන", "රණසිංහ", "ජයසිංහ",
  "කුමාර", "දිසානායක", "ප්‍රේමරත්න", "සේනාරත්න", "මුණසිංහ", "තිලකරත්න", "විජේසිංහ",
  "කළුආරච්චි", "හේරත්", "රත්නායක", "වන්නිආරච්චි", "උඩවරවත්ත", "බණ්ඩාරසේකර",
  "ජයවර්ධන", "කුලතුංග", "අලහකෝන්", "නානායක්කාර", "ගුණතිලක", "ධර්මසිරි", "සමරසිංහ",
  "පතිරණ", "වීරක්කොඩි", "කොතලාවල", "මාදුළුවාව", "ප්‍රනාන්දු", "ජයකොඩි", "සිල්වා",
];
const AREAS = [
  "බෝගමුවාගොඩ", "හෙට්ටිපොල", "ගිරිඋල්ල", "පි/පල්ලේනුවර", "පන්නිල්ගොඩ", "අඹන්කුඹුර",
  "ය/දොඩම්දෙනියාව", "මැදබුලත්වැව", "වීරබුලත්වැව", "කුඹුක්කුඹුර", "බුලත්කුඹුර",
  "මණ්ඩපොල", "පොල්පිතිගම", "නාරම්මල", "අලව්ව", "පන්නල", "කොබේගැනේ", "වැල්ලව",
  "ගනේවත්ත", "නිකවැරටිය", "මහෝ", "බිංගිරිය", "වාරියපොළ", "අඹන්පොළ", "ගල්ගමුව",
];

/** deterministic LCG — හැම render එකේදීම එකම data */
function makeRand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length) % arr.length];
}

function buildMemberRows(): MemberRow[] {
  const rand = makeRand(20261006);
  const rows: MemberRow[] = [...MEMBER_HEAD];
  // file quota (head rows ඒ ගොනු වලට අයිති නිසා අඩු කරමු)
  const quota = new Map(MEMBER_FILES.map((f) => [f.file_name, f.rows]));
  for (const h of MEMBER_HEAD) quota.set(h.file_name, (quota.get(h.file_name) ?? 1) - 1);

  const fileQueue: string[] = [];
  for (const f of MEMBER_FILES) for (let i = 0; i < (quota.get(f.file_name) ?? 0); i++) fileQueue.push(f.file_name);

  for (let i = rows.length; i < MEMBER_TOTAL; i++) {
    const gender = rand() < 0.42 ? "කාන්තා" : "පිරිමි";
    const first = pick(rand, INITIALS);
    const mid = rand() < 0.6 ? ` ${pick(rand, MID)}` : "";
    const no = i + 1;
    rows.push({
      member_no: `41/${String(no).padStart(2, "0")}`,
      nic: rand() < 0.72 ? "0000000000" : `${Math.floor(rand() * 9) + 1}${String(Math.floor(rand() * 100000000)).padStart(8, "0")}${rand() < 0.5 ? "v" : "x"}`,
      full_name: `${first}${mid} ${pick(rand, SURNAMES)}`,
      address: pick(rand, AREAS),
      postal_address: pick(rand, AREAS),
      gender,
      file_name: fileQueue[i - MEMBER_HEAD.length] ?? "Hettipola.xlsx",
    });
  }
  return rows;
}

function buildVoterRows(): VoterRow[] {
  const rand = makeRand(20260101);
  const rows: VoterRow[] = [...VOTER_HEAD];
  for (let i = rows.length; i < VOTER_TOTAL; i++) {
    const gender = rand() < 0.4 ? "කාන්තා" : "පිරිමි";
    const first = pick(rand, INITIALS);
    const mid = rand() < 0.6 ? ` ${pick(rand, MID)}` : "";
    rows.push({
      voter_no: `01/${String(i + 1).padStart(2, "0")}`,
      nic: rand() < 0.72 ? "0000000000" : `${Math.floor(rand() * 9) + 1}${String(Math.floor(rand() * 100000000)).padStart(8, "0")}${rand() < 0.5 ? "v" : "x"}`,
      full_name: `${first}${mid} ${pick(rand, SURNAMES)}`,
      address: pick(rand, AREAS),
      postal_address: pick(rand, AREAS),
      gender,
      file_name: "Panduwasnuwara.xls",
    });
  }
  return rows;
}

/* memoized — හැම වතාවේම නැවත generate නොකරයි */
let _members: MemberRow[] | null = null;
let _voters: VoterRow[] | null = null;

export function getMemberRows(): MemberRow[] {
  if (!_members) _members = buildMemberRows();
  return _members;
}

export function getVoterRows(): VoterRow[] {
  if (!_voters) _voters = buildVoterRows();
  return _voters;
}

export { MEMBER_TOTAL, VOTER_TOTAL, MEMBER_HEAD, VOTER_HEAD };
