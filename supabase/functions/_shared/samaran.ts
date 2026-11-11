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

const POLA_HP = /(?:\+?62[\s-]?|0)8[0-9][0-9\s\-]{6,13}[0-9]/g;
const POLA_SUREL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

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
  daftar(jenis: JenisPribadi, nilai: unknown): string | null {
    if (typeof nilai !== "string") return null;
    const asli = nilai.trim();
    if (asli.length < 2) return null;
    const ada = this.keTiruan.get(asli);
    if (ada) return ada;
    const tiruan = this.ambilTiruan(jenis);
    this.keTiruan.set(asli, tiruan);
    this.keAsli.set(tiruan, asli);
    return tiruan;
  }

  /** Ganti semua nilai pribadi terdaftar, lalu pola HP dan surel yang tersisa, di sebuah teks. */
  samarkan(teks: string): string {
    if (!teks) return teks;
    // Surel dan HP lebih dulu, supaya nama di dalam alamat surel tidak terganti setengah.
    let hasil = teks.replace(POLA_SUREL, (m) => this.keAsli.has(m) ? m : this.daftar("surel", m)!);
    hasil = hasil.replace(POLA_HP, (m) => this.keAsli.has(m) ? m : this.daftar("hp", m)!);
    const asliUrut = [...this.keTiruan.keys()].sort((a, b) => b.length - a.length);
    for (const asli of asliUrut) {
      // Utuh sebagai kata ("Ani" tidak mengganti bagian dari "Daniel"), peka huruf besar ("indah" tetap).
      hasil = hasil.replace(kataUtuh(varian(asli).map(escapeRe).join("|")), this.keTiruan.get(asli)!);
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
