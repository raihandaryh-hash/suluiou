// Tonggak 1 B3a/B7: pemeriksa pemicu distress. SATU daftar, DUA salinan:
//   src/lib/distress.ts (klien) dan supabase/functions/_shared/distress.ts (Deno).
// Kedua berkas harus identik byte per byte; scripts/cek-distress-sinkron.mjs
// menggagalkan `npm run build` bila berbeda. Ubah satu, salin ke yang lain.
//
// Sumber kategori (draf Claude, BELUM ditinjau SME; tinjauan Mbak Satwika = 🔲):
// - Columbia Suicide Severity Rating Scale (C-SSRS), butir ideasi: keinginan mati,
//   pikiran aktif bunuh diri, metode, niat, rencana, perilaku melukai diri.
// - Panduan safe messaging (WHO 2023, Preventing suicide: a resource for media
//   professionals; reportingonsuicide.org): tanda putus asa, merasa jadi beban,
//   merasa tidak berharga, ingin menghilang.
// - Kategori bahaya dari luar diri: kekerasan, pelecehan, ancaman, tidak aman sekarang.
// Presisi penting: frasa idiomatik ("mati gaya", "mati lampu") dibuang lebih dulu
// lewat DAFTAR_PENGECUALIAN. Berkas ini tidak berisi teks yang tampil ke pengguna.

export const DAFTAR_VERSI = "versi sebelum tinjauan SME, 8 Nov 2026";

export type TingkatDistress = "bahaya_langsung" | "tanda_berat";

export type HasilPeriksa = { cocok: boolean; tingkat: TingkatDistress | null };

// Sintaks pola: slot dipisah spasi (alternatif tidak boleh berisi spasi); alternatif dalam slot dipisah "|";
// "*" = 0 sampai 2 kata bebas; akhiran "~" = awalan kata (prefix).
const AKU = "aku|saya|gue|gw|gua|ak|aq|ane|sy";
const TIDAK = "tidak|tdk|gak|ga|gk|nggak|ngga|enggak|engga|g";
const INGIN = "ingin|pengen|pengin|pingin|kepengen|pgn|pen|mau|mo|pengennya|kepikiran|berniat|niat|rencana";

export const DAFTAR_BAHAYA_LANGSUNG: string[] = [
  // Ideasi aktif, niat, rencana (C-SSRS 2 sampai 5)
  "bunuh diri",
  "bundir",
  "membunuh diri",
  "membunuh|bunuh diriku|dirinya",
  `${INGIN} * mati`,
  `${INGIN} * mokad|modar|koit|mampus`,
  "lebih baik * mati",
  "mending|mendingan|sebaiknya * mati",
  `${INGIN} * akhiri|mengakhiri|akhirin|ngakhirin|udahin|menyudahi * hidup~`,
  "akhiri|mengakhiri|akhirin|ngakhirin hidup~",
  `${TIDAK} * mau|ingin|pengen * hidup lagi`,
  "gamau|gamao|gmau hidup lagi",
  "gantung diri",
  "lompat|loncat|terjun dari * gedung|jembatan|atap|lantai|tebing",
  "minum|nenggak|menenggak racun|baygon",
  "overdosis",
  "sayat|menyayat|nyayat|silet|nyilet|menyilet * tangan|nadi|pergelangan|lengan|diri~",
  "potong|motong * nadi|urat nadi",
  "melukai|nyakitin|menyakiti|lukai|nyakitin diri~",
  "self harm",
  "selfharm",
  // Bahaya dari luar diri, sedang terjadi
  "dipukuli",
  "disiksa",
  "dianiaya",
  "dilecehkan",
  "pelecehan seksual",
  "kekerasan seksual",
  "diperkosa",
  "dicabuli",
  "kdrt",
  "diancam * dibunuh|bunuh",
  "mau|akan|bakal dibunuh",
  `${AKU} * ${TIDAK} aman`,
  `${AKU} * dalam bahaya`,
  // English
  "kill myself",
  "killing myself",
  "suicide",
  "suicidal",
  "want|wanna|gonna * die",
  "end my life",
  "hurt myself",
  "hurting myself",
  "kms",
  "unalive",
  "being abused",
  "abusing me",
  "not safe",
];

export const DAFTAR_TANDA_BERAT: string[] = [
  "capek|cape|capai|lelah|letih|muak * hidup~",
  `hidup~ * ${TIDAK}|tak|nggak * ada * guna~|arti~|harapan|makna~`,
  `${TIDAK}|tak ada guna~ * hidup`,
  "buat|untuk|ngapain apa hidup~",
  `buat|untuk|ngapain apa ${AKU} * hidup~`,
  `${INGIN} * ngilang|menghilang|hilang|lenyap`,
  "putus asa",
  `${TIDAK}|tak ada harapan`,
  `${AKU} * ${TIDAK} berharga|berguna`,
  `${AKU} * cuma|hanya * beban`,
  `${AKU} * beban * semua|keluarga|orang~`,
  "lebih baik * tanpa aku|saya|gue|gw|diriku",
  "nyesel|menyesal|nyesal * lahir|dilahirkan",
  `${TIDAK} * sanggup|kuat * lagi`,
  `udah|sudah ${TIDAK} kuat`,
  `${TIDAK} ada * yang peduli`,
  "dibully|dirundung|dibuli",
  // English
  "hopeless",
  "worthless",
  "no reason to live",
  "tired of living",
  "tired of life",
  "give up on life",
  "nobody cares",
];

/** Bentuk rapat (spasi dihapus) untuk penulisan dieja "b u n u h d i r i". Dicek per token utuh. */
export const DAFTAR_RAPAT_BAHAYA: string[] = [
  "bunuhdiri", "bundir", "pengenmati", "inginmati", "pgnmati", "maumati",
  "akhirihidup", "gantungdiri", "killmyself", "suicide", "selfharm", "unalive",
];

/** Frasa idiomatik yang dibuang sebelum pencocokan. */
export const DAFTAR_PENGECUALIAN: string[] = [
  "mati gaya", "mati lampu", "mati listrik", "mati kutu", "mati suri", "mati angin",
  "mati matian", "mati ketawa", "mati penasaran", "mati bosan", "mati bosen",
  "mati kebosanan", "mati kelaparan", "mati kepanasan", "mati kedinginan",
  "harga mati", "jam mati", "hp mati", "hpnya mati", "hp ku mati", "laptop mati",
  "baterai mati", "batre mati", "mesin mati", "motor mati", "mati total",
  "mati mesin", "mati kena", "mati di game", "game over", "deadline", "dead line",
  "capek tugas", "capek belajar", "capek kerja", "hilang sinyal", "ngilang sinyal",
  "bunuh waktu", "membunuh waktu", "killing it", "kill it", "to die for",
  "suicide squad", "bunuh nyamuk", "membunuh nyamuk",
  "not safe for work",
];

const LEET: Record<string, string> = {
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b",
  "@": "a", "$": "s", "!": "i",
};

/** Normalisasi: huruf kecil, buang diakritik, "mati2an" -> "mati matian", leetspeak,
 *  non-huruf -> spasi, satukan huruf dieja ("b u n u h"), rapatkan huruf berulang. */
export function normalisasi(teks: string): string {
  let s = String(teks || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
  s = s.replace(/([a-z]+)2/g, "$1 $1");
  s = s.replace(/[0134578@$!]/g, (c) => LEET[c] ?? c);
  s = s.replace(/[^a-z]+/g, " ");
  s = s.replace(/\b(?:[a-z] ){2,}[a-z]\b/g, (m) => m.replace(/ /g, ""));
  s = s.replace(/([a-z])\1+/g, "$1");
  return s.replace(/\s+/g, " ").trim();
}

function escapeRe(x: string): string {
  return x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function kompilasi(pola: string): RegExp {
  const slots = pola.split(" ").filter(Boolean);
  let src = "";
  let first = true;
  for (const slot of slots) {
    if (slot === "*") {
      src += "(?: [a-z]+){0,2}?";
      continue;
    }
    const alts = slot.split("|").map((alt) => {
      const prefix = alt.endsWith("~");
      const base = normalisasi(prefix ? alt.slice(0, -1) : alt);
      return escapeRe(base) + (prefix ? "[a-z]*" : "");
    });
    src += (first ? "" : " ") + "(?:" + alts.join("|") + ")";
    first = false;
  }
  return new RegExp("(?:^| )" + src + "(?= |$)");
}

const RE_BAHAYA = DAFTAR_BAHAYA_LANGSUNG.map(kompilasi);
const RE_BERAT = DAFTAR_TANDA_BERAT.map(kompilasi);
const RAPAT = new Set(DAFTAR_RAPAT_BAHAYA.map(normalisasi));
const PENGECUALIAN = DAFTAR_PENGECUALIAN.map(normalisasi).sort((a, b) => b.length - a.length);

/** Periksa satu teks. Bahaya langsung menang atas tanda berat. */
export function periksaDistress(teks: string): HasilPeriksa {
  let s = " " + normalisasi(teks) + " ";
  for (const p of PENGECUALIAN) {
    if (p) s = s.split(" " + p + " ").join(" ");
  }
  s = s.replace(/\s+/g, " ").trim();
  if (!s) return { cocok: false, tingkat: null };
  if (s.split(" ").some((t) => RAPAT.has(t))) return { cocok: true, tingkat: "bahaya_langsung" };
  if (RE_BAHAYA.some((re) => re.test(s))) return { cocok: true, tingkat: "bahaya_langsung" };
  if (RE_BERAT.some((re) => re.test(s))) return { cocok: true, tingkat: "tanda_berat" };
  return { cocok: false, tingkat: null };
}

/** Kumpulkan semua string dari nilai apa pun (array/objek bersarang), lalu periksa. */
export function periksaDistressNilai(...nilai: unknown[]): HasilPeriksa {
  const teks: string[] = [];
  const jalan = (v: unknown, d: number) => {
    if (d > 6 || v == null) return;
    if (typeof v === "string") teks.push(v);
    else if (Array.isArray(v)) v.forEach((x) => jalan(x, d + 1));
    else if (typeof v === "object") Object.values(v as Record<string, unknown>).forEach((x) => jalan(x, d + 1));
  };
  nilai.forEach((v) => jalan(v, 0));
  let hasil: HasilPeriksa = { cocok: false, tingkat: null };
  for (const t of teks) {
    const h = periksaDistress(t);
    if (h.tingkat === "bahaya_langsung") return h;
    if (h.cocok) hasil = h;
  }
  return hasil;
}
