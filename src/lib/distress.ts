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
// lewat DAFTAR_PENGECUALIAN, konteks aman (film/dokumenter/pencegahan) lewat
// DAFTAR_KONTEKS_AMAN. Berkas ini tidak berisi teks yang tampil ke pengguna.
//
// Revisi (b), 8 Nov 2026: generalisasi atas meleset di scripts/uji-distress-dev.mjs
// (set DEV, bukan set uji tertahan): singkatan, Sunda/Jawa, eufemisme, tindakan melukai
// diri, beban/tidak berharga, bahaya dari orang lain (pola berpasangan), Inggris, emoji.
// Daftar kata kunci tetap lapis 1 saja; lapis 1b (pengklasifikasi) ada di
// supabase/functions/_shared/distressKlasifikasi.ts.

export const DAFTAR_VERSI = "versi sebelum tinjauan SME, 8 Nov 2026 (b)";

export type TingkatDistress = "bahaya_langsung" | "tanda_berat";

export type HasilPeriksa = { cocok: boolean; tingkat: TingkatDistress | null };

// Sintaks pola: slot dipisah spasi (alternatif tidak boleh berisi spasi); alternatif dalam slot dipisah "|";
// "*" = 0 sampai 2 kata bebas; akhiran "~" = awalan kata (prefix).
const AKU = "aku|saya|gue|gw|gua|ak|aq|ane|sy|aing|abdi|kula|awak";
const TIDAK = "tidak|tdk|gak|ga|gk|nggak|ngga|enggak|engga|g|kagak|kaga|ndak|nda|teu|ora|ra";
const INGIN =
  "ingin|pengen|pengin|pingin|kepengen|kepingin|pgn|pngn|pngen|pgen|pgin|pengn|ingn|pen|mau|mo|pengennya|kepikiran|berniat|niat|rencana|hayang";
const MATI = "mati|mti|mokad|modar|koit|mampus|mampos|matek|paeh|maot";
const HIDUP = "hidup~|idup~|hirup|urip~";
const LUKA =
  "gores|menggores|nggores|ngegores|digores|sayat|menyayat|nyayat|disayat|silet|nyilet|menyilet|disilet|cutter|kater";
const BAGIAN_TUBUH = "tangan~|lengan~|nadi~|pergelangan~|paha~|leher~";
const PELAKU =
  "ayah~|bapak~|papa~|papi|abah|om|paman~|pakde|pakdhe|paklik|kakek~|kakak~|abang~|sepupu~|tetangga~|guru~|ustad~|ustaz~|pacar~|cowok~|majikan~|bos~|pelatih~|tiri";
const KALAU = "kalau|kalo|klo|kl|jika|jikalau|seandainya|andai|misal|misalnya";

export const DAFTAR_BAHAYA_LANGSUNG: string[] = [
  // Ideasi aktif, niat, rencana (C-SSRS 2 sampai 5)
  "bunuh|bnuh|bunh|bnh diri|dri|diriku",
  "bundir",
  "membunuh diri",
  "membunuh|bunuh diriku|dirinya",
  `${INGIN} * ${MATI}`,
  `lebih baik * ${MATI}|lenyap|tiada|musnah`,
  `mending|mendingan|sebaiknya * ${MATI}|lenyap|tiada|musnah`,
  `${INGIN} * akhiri|mengakhiri|akhirin|ngakhirin|udahin|menyudahi * hidup~`,
  `akhiri|mengakhiri|akhirin|ngakhirin ${HIDUP}`,
  "akhiri|mengakhiri|akhirin|ngakhirin|udahin|nyudahin|menyudahi semuanya|segalanya",
  "end it|everything all",
  `${TIDAK} * mau|ingin|pengen * ${HIDUP} lagi`,
  `${TIDAK} ${INGIN} ${HIDUP}`,
  // Eufemisme: tidur/pergi selamanya, tidak bangun lagi, menyusul, menghadap Tuhan, pamit
  `${INGIN} * tidur|pergi|istirahat|pamit|terlelap * selamanya`,
  `${TIDAK} bangun~ * lagi|selamanya`,
  `${INGIN} * nyusul|menyusul|nyusulin * mbah|simbah|almarhum~|alm|almh|mendiang|kakek|nenek|eyang`,
  "ketemu|bertemu|menghadap|jumpa allah|tuhan * cepat|secepatnya|duluan|sekarang",
  "jadi|menjadi bintang * langit",
  "pamit|pergi|leave * for good",
  "hilang|ilang|lenyap|ngilang|menghilang * dari|dr|dri muka bumi",
  "nulis|menulis|tulis|nulisin|bikin|membuat|nyiapin|menyiapkan * surat perpisahan|wasiat",
  "gamau|gamao|gmau hidup lagi",
  "gantung diri",
  "lompat|loncat|terjun dari|dr|dri * gedung|jembatan|atap|lantai|tebing|rooftop|balkon",
  "minum|nenggak|menenggak racun|baygon",
  "nelen|menelan|telan|minum|nenggak|menenggak * obat~ * sebungkus|sebotol|segenggam|sestrip|seplastik|sekaligus",
  "overdosis",
  "sayat|menyayat|nyayat|silet|nyilet|menyilet * tangan|nadi|pergelangan|lengan|diri~",
  `${LUKA} * ${BAGIAN_TUBUH}`,
  "emojipisau|emojisilet emojidarah",
  "emojidarah emojipisau|emojisilet",
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
  "ngancem|ngancam|mengancam|ancam|diancam * nyebar~|menyebar~|sebar~|disebar~|upload|ngupload|posting|viralin * foto~|video~|vidio~",
  // English
  "kill myself",
  "killing myself",
  "suicide",
  "suicidal",
  "want|wanna|gonna * die",
  "dont|t|not wanna|want * be here anymore",
  "dont|t|not wanna|want * exist|alive",
  "dont|t|not wanna|want * live|wake * anymore",
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
  `capek|cape|capai|lelah|letih|muak * ${HIDUP}`,
  `${TIDAK} * kuat|sanggup|tahan * ${HIDUP}`,
  `${TIDAK}|tak * pantas|layak|berhak * ${HIDUP}`,
  `jadi|menjadi|cuma|hanya|sebagai beban * orang~|keluarga~|ortu|semua~|kalian|mereka|bapak~|ibu~|mama~|papa~|ayah~`,
  `${AKU}|ngerasa|merasa|diriku * kayak|kaya|seperti|bagai|bagaikan * sampah`,
  `${AKU} cuma|hanya|emang|memang sampah`,
  `nyawa|hidup~|diri~|${AKU} * ${TIDAK}|tak * ada|punya * harga~|arti~`,
  `${TIDAK} ada yang * sedih|nangis|kehilangan|nyari~|nyariin|sadar|inget~|ingat~`,
  `${KALAU} * ${AKU} * hilang|ilang|${MATI}|tiada|meninggal`,
  "numpang napas|nafas|hidup",
  `life|living|everything|${HIDUP} * pointless|meaningless|percuma|sia`,
  `${TIDAK} ${INGIN} bangun~ * besok|lagi`,
  "takut pulang",
  `takut * sama|dengan|ama * ${PELAKU}`,
  "surat perpisahan|wasiat",
  "emojipeti",
  `hidup~ * ${TIDAK}|tak|nggak * ada * guna~|arti~|harapan|makna~`,
  `${TIDAK}|tak ada guna~ * hidup`,
  "buat|untuk|ngapain apa hidup~",
  `buat|untuk|ngapain apa ${AKU} * hidup~`,
  `${INGIN} * ngilang|menghilang|hilang|ilang|lenyap`,
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
  "no point * living|life",
];

/** Pola berpasangan: kedua pola harus cocok di mana pun dalam teks (urutan bebas). */
export const DAFTAR_BERSAMA: { a: string; b: string; tingkat: TingkatDistress }[] = [
  // Pelecehan: pelaku + tindakan meraba
  { a: PELAKU, b: "raba|meraba|diraba|ngeraba|grepe~|digrepe~|gerayang~|digerayang~|nggerayang~", tingkat: "bahaya_langsung" },
  { a: PELAKU, b: "megang|pegang|dipegang|memegang|dipegangi megang~|pegang~", tingkat: "bahaya_langsung" },
  // Kekerasan fisik: tindakan + bekas luka, atau tindakan + pelaku
  {
    a: "ditampar|ditempeleng|dipukul~|ditendang|dijambak|dicekik|digebuk~|dihajar~|disabet|dicambuk|disundut|dibanting",
    b: "biru|memar~|lebam~|berdarah|bengkak~|luka~|benjol~",
    tingkat: "bahaya_langsung",
  },
  {
    a: "ditampar|ditempeleng|dipukul~|ditendang|dijambak|dicekik|digebuk~|dihajar~|disabet|dicambuk|disundut|dibanting",
    b: PELAKU,
    tingkat: "bahaya_langsung",
  },
  // Pamit: titip jaga + "kalau aku tidak ada"
  {
    a: "tolong|titip|titipin|minta jaga~|jagain|rawat~|rawatin|urus~|urusin",
    b: `${KALAU} * ${AKU} * ${TIDAK}|udah|sudah ada|tiada`,
    tingkat: "bahaya_langsung",
  },
];

/** Bentuk rapat (spasi dihapus) untuk penulisan dieja "b u n u h d i r i". Dicek per token utuh. */
export const DAFTAR_RAPAT_BAHAYA: string[] = [
  "bunuhdiri", "bundir", "pengenmati", "inginmati", "pgnmati", "maumati",
  "akhirihidup", "gantungdiri", "killmyself", "suicide", "selfharm", "unalive",
  "bnuhdiri", "bnuhdri", "bunuhdri", "pngnmati", "pgnmti", "pngnmti", "endital",
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
  "hilang dari grup", "ilang dari grup", "ngilang dari grup", "menghilang dari grup", "keluar dari grup",
  "hilang dari medsos", "hilang dari sosmed", "ngilang dari sosmed", "ngilang dari medsos",
  "hidup susah", "hidup miskin", "hidup sengsara", "hidup pas pasan", "hidup kekurangan", "hidup sederhana",
  "bank sampah", "buang sampah", "sampah plastik", "pengelolaan sampah", "olah sampah", "daur ulang sampah",
];

/** Konteks aman: rentang yang cocok dibuang sebelum pencocokan (media, edukasi, pencegahan). */
export const DAFTAR_KONTEKS_AMAN: string[] = [
  "pencegahan|mencegah|pencegah|cegah|penanganan|menangani|awareness bunuh diri",
  "pencegahan|mencegah|cegah bundir|suicide|selfharm",
  "suicide prevention|awareness|hotline",
  "prevention|preventing|prevent * suicide",
  "film|dokumenter|berita|artikel|novel|buku|seminar|webinar|materi|penyuluhan|sosialisasi|kampanye|edukasi|penelitian|riset|skripsi|lagu|anime|drama tentang|soal|mengenai|bertema * bunuh diri",
];

/** Hiperbola ujian + tawa ("soal UTBK bikin pengen mati wkwk"): bahaya_langsung turun jadi tanda_berat, tidak hilang. */
const RE_TAWA = /^(?:(?:wk)+w?|(?:kw)+k?|w?k?(?:wk)+|(?:ha)+h?|(?:he)+h?|(?:xi)+|lol|lmao|awok[a-z]*|ngakak|emojitawa)$/;
const RE_UJIAN = /^(?:ujian|ulangan|utbk|snbt|sbmptn|soal|soalnya|tugas|tugasnya|pr|kuis|quiz|uts|uas|skripsi|matematika|mtk|fisika|kimia|remedial|remed|presentasi|sidang|tes|test|tryout|olimpiade|pts|pat)$/;

const LEET: Record<string, string> = {
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b",
  "@": "a", "$": "s", "!": "i",
};

/** Emoji yang membawa makna (pisau, darah, peti, tawa) jadi token sebelum non-huruf dibuang. */
const EMOJI: [RegExp, string][] = [
  [/\u{1F52A}|\u{1F5E1}/gu, " emojipisau "],
  [/\u{1FA78}/gu, " emojidarah "],
  [/\u{26B0}|\u{1FAA6}/gu, " emojipeti "],
  [/\u{1F602}|\u{1F923}|\u{1F606}/gu, " emojitawa "],
];

/** Normalisasi: huruf kecil, buang diakritik, "mati2an" -> "mati matian", leetspeak,
 *  non-huruf -> spasi, satukan huruf dieja ("b u n u h"), rapatkan huruf berulang. */
export function normalisasi(teks: string): string {
  let s = String(teks || "").toLowerCase();
  for (const [re, ganti] of EMOJI) s = s.replace(re, ganti);
  s = s.normalize("NFKD").replace(/[̀-ͯ]/g, "");
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

function kompilasi(pola: string, bendera = ""): RegExp {
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
  return new RegExp("(?:^| )" + src + "(?= |$)", bendera);
}

const RE_BAHAYA = DAFTAR_BAHAYA_LANGSUNG.map((p) => kompilasi(p));
const RE_BERAT = DAFTAR_TANDA_BERAT.map((p) => kompilasi(p));
const RAPAT = new Set(DAFTAR_RAPAT_BAHAYA.map(normalisasi));
const PENGECUALIAN = DAFTAR_PENGECUALIAN.map(normalisasi).sort((a, b) => b.length - a.length);
const RE_KONTEKS_AMAN = DAFTAR_KONTEKS_AMAN.map((p) => kompilasi(p, "g"));
const RE_BERSAMA = DAFTAR_BERSAMA.map((x) => ({ a: kompilasi(x.a), b: kompilasi(x.b), tingkat: x.tingkat }));

function turunkanHiperbola(s: string, tingkat: TingkatDistress): HasilPeriksa {
  if (tingkat === "bahaya_langsung") {
    const tok = s.split(" ");
    if (tok.some((t) => RE_TAWA.test(t)) && tok.some((t) => RE_UJIAN.test(t))) {
      return { cocok: true, tingkat: "tanda_berat" };
    }
  }
  return { cocok: true, tingkat };
}

/** Periksa satu teks. Bahaya langsung menang atas tanda berat. */
export function periksaDistress(teks: string): HasilPeriksa {
  let s = " " + normalisasi(teks) + " ";
  for (const p of PENGECUALIAN) {
    if (p) s = s.split(" " + p + " ").join(" ");
  }
  for (const re of RE_KONTEKS_AMAN) s = s.replace(re, " ");
  s = s.replace(/\s+/g, " ").trim();
  if (!s) return { cocok: false, tingkat: null };
  if (s.split(" ").some((t) => RAPAT.has(t))) return turunkanHiperbola(s, "bahaya_langsung");
  if (RE_BAHAYA.some((re) => re.test(s))) return turunkanHiperbola(s, "bahaya_langsung");
  const pasang = RE_BERSAMA.find((x) => x.a.test(s) && x.b.test(s));
  if (pasang) return turunkanHiperbola(s, pasang.tingkat);
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
