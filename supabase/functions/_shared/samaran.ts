// Tonggak 1 · samaran bolak-balik (KEPUTUSAN Raihan 11 Nov 2026 10.21, butir 1):
// "AI membaca data pribadinya yang mockup, dan kita bisa unmasking sehingga jadi full lagi di sisi kitanya".
// - Sebelum dikirim ke AI: nilai pribadi yang diketahui (nama, sekolah, kelas, HP, surel) dan pola HP/surel
//   di teks bebas diganti nilai tiruan yang wajar.
// - Sesudah AI menjawab: nilai tiruan diganti kembali ke nilai asli, juga pada aliran yang terpotong per bagian.
// - Peta samaran hanya hidup di memori satu permintaan; tidak disimpan, tidak dicatat di log.
// Modul murni (tanpa Deno), diuji di src/test/samaran.test.ts.

export type JenisPribadi = "nama" | "sekolah" | "kelas" | "hp" | "surel";

const TIRUAN: Record<JenisPribadi, string[]> = {
  nama: ["Laras", "Bima", "Sekar", "Raka", "Nadia", "Fajri", "Wulan", "Dimas"],
  sekolah: ["SMA Harapan Nusantara", "SMA Cahaya Bangsa", "MA Pelita Ilmu", "SMK Karya Muda"],
  kelas: ["Kelas Rintis", "Kelas Tunas", "Kelas Langkah", "Kelas Arah"],
  hp: ["081200000101", "081200000102", "081200000103", "081200000104"],
  surel: ["pengguna1@contoh.id", "pengguna2@contoh.id", "pengguna3@contoh.id", "pengguna4@contoh.id"],
};

const POLA_HP_CALON = /(?<![0-9])(?:\+?62[\s-]?|0)8[0-9][0-9\s\-]{6,13}[0-9]/g;
/** Calon HP diterima bila 10–14 digit dan tidak berupa deret kelompok dua digit (mis. daftar skor "62 80 81 82"). */
function benarHP(m: string): boolean {
  const digit = m.replace(/\D/g, "").length;
  if (digit < 10 || digit > 14) return false;
  const kelompok = m.replace(/^\+/, "").split(/[\s-]+/);
  return kelompok.length === 1 || kelompok.filter((k) => k.length <= 2).length <= 1;
}
// Dibatasi panjang dan tidak mulai di tengah kata, supaya biaya regex tetap linear pada teks panjang (pemeriksa 11 Nov, temuan 7).
const POLA_SUREL = /(?<![A-Za-z0-9._%+-])[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9-]{1,63}(?:\.[A-Za-z0-9-]{1,63}){0,4}\.[A-Za-z]{2,24}(?![A-Za-z])/g;

// Pengenal nama orang lain di teks bebas, ditiru dari War Room samaran-0.7.2 (harness/privasi/nama_umum.js, commit 7f087a9):
// sapaan + nama, atau kata konteks kuat + nama berhuruf awal kapital. Daftar sapaan dan kata bukan-nama disalin dari sana.
const SAPAAN = String.raw`mas|mbak|mba|pak|bu|bapak|ibu|ust|ustadz|ustaz|ustadzah|ustazah|kak|bang|dik|adik|teh|aa|akhi|ukhti|sdr|sdri|saudara|saudari|dr|prof|om|tante|ning|gus`;
const KONTEKS_KUAT = String.raw`(?:[aA]tas|ATAS)\s+(?:nama|Nama|NAMA)|[aA]\.\s?[nN]\.|[bB]ernama|BERNAMA|[nN]amanya|NAMANYA`;
const BUKAN_SESUDAH_SAPAAN = new Set(`dekan rektor kaprodi direktur ketua kepala admin dosen guru staf tim kami kita saya aku dia mereka yang ini itu tadi dan atau sudah
belum mau minta tolong bilang kata di ke dari dengan untuk juga lagi aja saja nih dong ya pengurus sekretaris bendahara koordinator
manajer pimpinan pembina wali kurir satpam hrd it msp hsa lt bisa boleh apa siapa kapan gimana bagaimana bk
anda kamu kalian engkau kau siswa siswi murid pengguna sedang sulu kakak semua sekalian sekarang kalau jika`.split(/\s+/).concat(SAPAAN.split("|")));
// Sapaan bertumpuk ("pak ustadz", "bu Dr. Rina") dilompati. Tambahan baris terakhir dari temuan pemeriksa 11 Nov.
// Nama yang juga kata biasa (War Room nama_umum.js NAMA_KATA_BIASA): tidak dicari dalam huruf kecil, supaya "indah" tetap kata biasa.
const NAMA_KATA_BIASA = new Set(`indah putri putra budi sari jaya mulia iman amal ikhlas rahmat hidayah rizki rezeki intan permata melati bunga cahya cahaya
fajar bayu agung bagus dewi ayu kurnia wati santi suci endah rosa mega yoga dian dini nur umi tri eka dwi lia lina risa alam`.split(/\s+/));
const KATA = String.raw`\p{L}[\p{L}'’]*(?:-\p{L}[\p{L}'’]*)*`; // tanda hubung ikut: "Ani-Wati" satu nama
// Tanpa flag i: dengan i, \p{Lu} ikut cocok dengan huruf kecil. Sapaan dibuat tiga varian huruf secara manual.
const tigaVarian = (alt: string) => alt.split("|").flatMap((w) => [w, w[0].toUpperCase() + w.slice(1), w.toUpperCase()]).join("|");
const POLA_SAPAAN = new RegExp(`(?<![\\p{L}\\p{N}])(?:${tigaVarian(SAPAAN)})\\.?[ \\t]+((?:(?:${tigaVarian(SAPAAN)})\\.?[ \\t]+)*)(${KATA})(?=((?:[ \\t]+${KATA}){0,2}))`, "gu");
const POLA_KONTEKS = new RegExp(`(?<![\\p{L}\\p{N}])(?:${KONTEKS_KUAT})[ \\t]+()(${KATA})(?=((?:[ \\t]+${KATA}){0,2}))`, "gu");
const awalKapital = (w: string) => /^\p{Lu}\p{Ll}/u.test(w);
/** Nama dari satu cocokan, atau null. Rangkaian lanjut hanya bila kata pertama dan lanjutannya berbentuk Huruf Awal Besar. */
const KLITIK = /-(?:nya|lah|pun|kah|ku|mu)$/iu;
/** Kata calon nama tanpa klitik ("Rina-nya" → "Rina"), atau null bila kata biasa, termasuk bentuk ulang ("guru-guru", "mas-mas"). */
function bersihkan(w: string): string | null {
  const k = w.replace(KLITIK, "");
  const bagian = k.split("-");
  if (k.length < 2 || BUKAN_SESUDAH_SAPAAN.has(bagian[0].toLowerCase())) return null;
  if (bagian.length > 1 && bagian.every((x) => x.toLowerCase() === bagian[0].toLowerCase())) return null;
  return k;
}
/** Nama dari satu cocokan, atau null. Rangkaian lanjut hanya bila kata pertama dan lanjutannya berbentuk Huruf Awal Besar. */
function namaDariCocok(kataStr: string, wajibKapital: boolean): string | null {
  const kata = kataStr.split(/[ \t]+/);
  const awal = bersihkan(kata[0]);
  if (!awal || (wajibKapital && !/^\p{Lu}/u.test(awal))) return null;
  const nama = [awal];
  if (awalKapital(awal) && awal === kata[0]) {
    for (const w of kata.slice(1)) {
      const b = bersihkan(w);
      if (!b || !awalKapital(b)) break;
      nama.push(b);
      if (b !== w) break; // klitik menutup nama: "Budi Santoso-nya bilang"
    }
  }
  return nama.join(" ");
}
/**
 * Calon nama orang lain di teks: kata sesudah sapaan (sapaan bertumpuk dilompati), atau sesudah "atas nama"/"bernama".
 * Nama Berhuruf Awal Besar boleh sampai tiga kata; huruf kecil atau KAPITAL semua hanya satu kata (temuan pemeriksa 2).
 */
export function cariNamaLain(teks: string): string[] {
  const keluar: string[] = [];
  for (const [re, wajib] of [[POLA_SAPAAN, false], [POLA_KONTEKS, true]] as const) {
    for (const m of teks.matchAll(re)) { const n = namaDariCocok(m[2] + m[3], wajib || !!m[1]); if (n) keluar.push(n); }
  }
  return keluar;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Pola kata utuh: tidak didahului atau diikuti huruf/angka (Unicode). */
function kataUtuh(isi: string, flag = "gu"): RegExp {
  return new RegExp(`(?<![\\p{L}\\p{N}])(?:${isi})(?![\\p{L}\\p{N}])`, flag);
}

/** Varian penulisan sebuah nilai: persis, Huruf Awal Besar, KAPITAL. Tidak memakai huruf kecil semua,
 * supaya nama yang juga kata biasa ("Indah", "Cahaya") tidak mengganti kata biasa di prompt. */
function varian(s: string): string[] {
  const awal = s.replace(/(^|\s)(\p{L})/gu, (_m, a, h) => a + h.toUpperCase());
  return [...new Set([s, awal, s.toUpperCase()])];
}

export class Samaran {
  private keTiruan = new Map<string, string>();
  private keAsli = new Map<string, string>();
  private pakai: Record<JenisPribadi, number> = { nama: 0, sekolah: 0, kelas: 0, hp: 0, surel: 0 };
  private teksInput: string;
  private jenisAsli = new Map<string, JenisPribadi>();
  private dariTeks = new Set<string>(); // nama yang ditemukan pengenal, bukan dari profil: tanpa varian huruf kecil

  /** teksInput: gabungan semua teks yang akan dikirim, agar nilai tiruan tidak bertabrakan dengan isi siswa. */
  constructor(teksInput = "") {
    this.teksInput = teksInput.toLowerCase();
  }

  private ambilTiruan(jenis: JenisPribadi): string {
    const kolam = TIRUAN[jenis];
    while (this.pakai[jenis] < kolam.length) {
      const calon = kolam[this.pakai[jenis]++];
      if (!this.teksInput.includes(calon.toLowerCase()) && !this.keAsli.has(calon)) return calon;
    }
    // Kolam habis: tiruan bernomor yang tidak mungkin muncul alami.
    const n = this.pakai[jenis]++;
    return jenis === "hp" ? `0812000009${String(n).padStart(2, "0")}` : `${kolam[0]} ${n}`;
  }

  /** Daftarkan nilai pribadi yang diketahui. Nilai kosong atau terlalu pendek diabaikan. */
  daftar(jenis: JenisPribadi, nilai: unknown, asal: "profil" | "lain" = "profil"): string | null {
    if (typeof nilai !== "string") return null;
    const asli = nilai.trim();
    if (asli.length < 2) return null;
    const ada = this.keTiruan.get(asli);
    if (ada) return ada;
    const tiruan = this.ambilTiruan(jenis);
    this.keTiruan.set(asli, tiruan);
    this.jenisAsli.set(asli, jenis);
    if (asal === "lain") this.dariTeks.add(asli);
    this.keAsli.set(tiruan, asli);
    return tiruan;
  }

  /** Ganti semua nilai pribadi terdaftar, lalu pola HP dan surel yang tersisa, di sebuah teks. */
  samarkan(teks: string): string {
    if (!teks) return teks;
    // Surel dan HP lebih dulu, supaya nama di dalam alamat surel tidak terganti setengah.
    let hasil = teks.replace(POLA_SUREL, (m) => this.keAsli.has(m) ? m : this.daftar("surel", m)!);
    hasil = hasil.replace(POLA_HP_CALON, (m) => (this.keAsli.has(m) || !benarHP(m)) ? m : this.daftar("hp", m)!);
    // Nama orang lain (guru, teman, keluarga) di teks bebas. Nama Berhuruf Awal Besar didaftarkan dan diganti di seluruh teks;
    // nama huruf kecil atau KAPITAL semua hanya diganti di posisi sesudah sapaan, supaya kata biasa di tempat lain tidak tersentuh.
    for (const [re, wajib] of [[POLA_SAPAAN, false], [POLA_KONTEKS, true]] as const) {
      hasil = hasil.replace(re, (m, tumpuk: string, kata1: string, lanjut: string) => {
        // Kata lanjutan hanya diintip (lookahead, temuan pemeriksa kedua): "Pak Budi dan bu Rina" tetap memindai "bu Rina".
        const kataStr = kata1 + lanjut;
        // Sesudah sapaan bertumpuk ("pak ustadz mengisi"), nama wajib berhuruf kapital.
        const n = namaDariCocok(kataStr, wajib || !!tumpuk);
        if (!n || this.keAsli.has(n)) return m;
        if (awalKapital(n)) {
          this.daftar("nama", n, "lain");
          for (const k of n.split(/[ \t-]+/)) if (k.length >= 3 && !this.keAsli.has(k)) this.daftar("nama", k, "lain");
          return m;
        }
        const t = this.daftar("nama", n, "lain")!;
        // Nama huruf kecil atau KAPITAL selalu satu kata = kata1, yang ada di ujung cocokan.
        return m.slice(0, m.length - kata1.length) + t + kata1.slice(n.length); // klitik dipertahankan
      });
    }
    const asliUrut = [...this.keTiruan.keys()].sort((a, b) => b.length - a.length);
    for (const asli of asliUrut) {
      // Nama huruf kecil temuan pengenal sudah diganti di posisinya; tidak dicari di tempat lain.
      if (this.dariTeks.has(asli) && !awalKapital(asli)) continue;
      // Utuh sebagai kata ("Ani" tidak mengganti bagian dari "Daniel"), peka huruf besar ("indah" tetap).
      // Nama juga dicari dalam huruf kecil semua: siswa sering menulis namanya sendiri tanpa kapital.
      // Kecuali nama yang juga kata biasa ("Indah"): huruf kecilnya dibiarkan agar makna kalimat tidak rusak.
      const v = varian(asli);
      if (this.jenisAsli.get(asli) === "nama" && !this.dariTeks.has(asli) && asli.length >= 3 && !asli.toLowerCase().split(/\s+/).some((k) => NAMA_KATA_BIASA.has(k))) {
        v.push(asli.toLowerCase());
      }
      hasil = hasil.replace(kataUtuh(v.map(escapeRe).join("|")), this.keTiruan.get(asli)!);
    }
    return hasil;
  }

  /** Samarkan semua string di dalam nilai apa pun (objek/array bersarang), tanpa mengubah aslinya. */
  samarkanNilai<T>(nilai: T): T {
    const jalan = (v: unknown, d: number): unknown => {
      if (d > 8 || v == null) return v;
      if (typeof v === "string") return this.samarkan(v);
      if (Array.isArray(v)) return v.map((x) => jalan(x, d + 1));
      if (typeof v === "object") {
        const o: Record<string, unknown> = {};
        for (const [k, x] of Object.entries(v as Record<string, unknown>)) o[k] = jalan(x, d + 1);
        return o;
      }
      return v;
    };
    return jalan(nilai, 0) as T;
  }

  /** Kembalikan nilai tiruan ke nilai asli di teks jawaban AI. */
  buka(teks: string, sebelum = ""): string {
    if (!teks || this.keAsli.size === 0) return teks;
    // "sebelum": huruf terakhir yang sudah dikirim, agar batas kata di sambungan aliran tetap benar.
    let hasil = sebelum + teks;
    const tiruanUrut = [...this.keAsli.keys()].sort((a, b) => b.length - a.length);
    for (const t of tiruanUrut) hasil = hasil.replace(kataUtuh(escapeRe(t)), this.keAsli.get(t)!);
    return hasil.slice(sebelum.length);
  }

  /** Panjang tiruan terpanjang; dipakai pembuka aliran untuk menahan ekor yang mungkin terpotong. */
  panjangMaks(): number {
    let m = 0;
    for (const t of this.keAsli.keys()) m = Math.max(m, t.length);
    return m;
  }

  /**
   * Pembuka aliran: terima potongan teks berurutan, keluarkan teks yang sudah dibuka.
   * Menahan ekor sepanjang (tiruan terpanjang - 1) supaya tiruan yang terbelah dua potongan tetap terbuka.
   */
  pembukaAliran(): { dorong: (potongan: string) => string; tutup: () => string } {
    let sisa = "";
    let akhir = ""; // huruf terakhir yang sudah dikirim
    const tiruan = [...this.keAsli.keys()];
    // Panjang akhiran terpanjang yang merupakan awalan sebuah tiruan, termasuk tiruan utuh di ujung
    // (huruf berikutnya bisa membuatnya bukan kata utuh, mis. "Sekar" lalu "ang").
    const ekorGantung = (s: string): number => {
      let k = 0;
      for (const t of tiruan) {
        for (let n = Math.min(t.length, s.length); n > k; n--) {
          if (s.endsWith(t.slice(0, n))) { k = n; break; }
        }
      }
      return k;
    };
    const kirim = (s: string): string => {
      const keluar = this.buka(s, akhir);
      if (s) akhir = s.slice(-1);
      return keluar;
    };
    return {
      dorong: (potongan: string) => {
        const gabung = sisa + potongan;
        const k = ekorGantung(gabung);
        sisa = gabung.slice(gabung.length - k);
        return kirim(gabung.slice(0, gabung.length - k));
      },
      tutup: () => { const k = kirim(sisa); sisa = ""; return k; },
    };
  }
}

/**
 * Kumpulkan nilai pribadi dari badan permintaan menurut nama kunci, hanya di akar dan di objek profil
 * (profile, studentProfile, studentContext). Objek lain seperti medan.nama (nama bidang) tidak disentuh.
 */
const INDUK_PROFIL = new Set(["", "profile", "studentprofile", "studentcontext", "student", "pengguna", "user"]);
const KUNCI_PRIBADI: Array<[RegExp, JenisPribadi]> = [
  [/^(name|nama|guest_?name|nickname|nama_?panggilan|full_?name)$/i, "nama"],
  [/^(school|school_?name|sekolah|nama_?sekolah)$/i, "sekolah"],
  [/^(phone|guest_?phone|hp|no_?hp|wa|wa_?number)$/i, "hp"],
  [/^(email|surel)$/i, "surel"],
];
export function cariPribadi(v: unknown, induk = "", keluar: Array<[JenisPribadi, unknown]> = []): Array<[JenisPribadi, unknown]> {
  if (v == null || typeof v !== "object" || Array.isArray(v) || !INDUK_PROFIL.has(induk.toLowerCase())) return keluar;
  for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
    const cocok = KUNCI_PRIBADI.find(([re]) => re.test(k));
    if (cocok && typeof x === "string") keluar.push([cocok[1], x]);
    else if (x && typeof x === "object") cariPribadi(x, k, keluar);
  }
  return keluar;
}
