// Tonggak PW · aturan murni izin orang tua/wali (tanpa jaringan, supaya bisa diuji).
// Teks persetujuan tinggal di server: yang tampil di laman wali sama persis dengan yang sidiknya tercatat
// sebagai bukti (PP 33/2026 Pasal 33, 36). Ubah teks = naikkan TEKS_VERSI.

export const TEKS_VERSI = "pw-1";
export const MASA_TAUTAN_MS = 14 * 24 * 60 * 60 * 1000;
export const HUBUNGAN = ["ayah", "ibu", "wali"] as const;
export type Hubungan = typeof HUBUNGAN[number];

/** Informasi sebelum persetujuan (Pasal 33): data apa, untuk apa, siapa membaca, berapa lama, cara menarik. */
export const TEKS_IZIN: { judul: string; butir: string[]; centang: string } = {
  judul: "Izin menyimpan perjalanan anak Anda di Sulu",
  butir: [
    "Sulu adalah layanan IOU Indonesia untuk membantu siswa mengenali diri dan menjelajah jalan kuliah dan karier.",
    "Tanpa izin ini, isian anak Anda hanya tersimpan di HP atau laptopnya, dan hilang bila perangkat berganti.",
    "Dengan izin ini, isian anak Anda di Sulu (jawaban, catatan, dan rencananya) disimpan di server IOU dan bisa dibuka dari perangkat lain.",
    "Tim IOU membaca data ini untuk memperbaiki layanan Sulu bagi anak Anda dan siswa lain. Data ini tidak dipakai untuk menghubungi Anda atau anak Anda, dan tidak dipakai untuk menawarkan program.",
    "Asesmen untuk siswa SMA tetap tidak dibuka. Isian yang dikirim ke AI tetap disamarkan.",
    "Anda bisa menarik izin kapan saja lewat tautan kelola yang muncul sesudah Anda menyetujui. Sesudah izin ditarik, isian tidak lagi disimpan di server; salinannya dikembalikan ke perangkat anak Anda saat ia membuka Sulu, lalu dihapus dari server. Sisa yang tidak terambil dalam 60 hari dihapus.",
  ],
  centang: "Saya orang tua atau wali anak ini, sudah membaca keterangan di atas, dan mengizinkan isian Sulu anak saya disimpan di server IOU untuk memperbaiki layanan.",
};

export function teksKanonik(): string {
  return [TEKS_VERSI, TEKS_IZIN.judul, ...TEKS_IZIN.butir, TEKS_IZIN.centang].join("\n");
}

export async function sha256(teks: string): Promise<string> {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(teks));
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Token tautan dan kode kelola: 32 karakter dari abjad tanpa huruf mirip. */
export function sahToken(t: unknown): t is string {
  return typeof t === "string" && /^[ABCDEFGHJKMNPQRSTUVWXYZ2-9]{32}$/.test(t);
}

export type GalatSetuju = "nama_tidak_sah" | "hubungan_tidak_sah" | "belum_centang" | "versi_berubah";

/** Periksa isian orang tua sebelum disimpan. */
export function periksaSetuju(isi: { nama?: unknown; hubungan?: unknown; centang?: unknown; teks_versi?: unknown }):
  { ok: true; nama: string; hubungan: Hubungan } | { ok: false; galat: GalatSetuju } {
  const nama = typeof isi.nama === "string" ? isi.nama.replace(/\s+/g, " ").trim() : "";
  if (nama.length < 3 || nama.length > 120 || !/\p{L}/u.test(nama)) return { ok: false, galat: "nama_tidak_sah" };
  if (!HUBUNGAN.includes(isi.hubungan as Hubungan)) return { ok: false, galat: "hubungan_tidak_sah" };
  if (isi.centang !== true) return { ok: false, galat: "belum_centang" };
  if (isi.teks_versi !== TEKS_VERSI) return { ok: false, galat: "versi_berubah" };
  return { ok: true, nama, hubungan: isi.hubungan as Hubungan };
}

export type KeadaanTautan = "sah" | "tidak_ada" | "kedaluwarsa" | "sudah_dipakai";

/** Keadaan tautan dari barisnya (null bila tidak ditemukan). */
export function keadaanTautan(baris: { berlaku_sampai: string; dipakai_pada: string | null } | null, sekarang: Date): KeadaanTautan {
  if (!baris) return "tidak_ada";
  if (baris.dipakai_pada) return "sudah_dipakai";
  if (Date.parse(baris.berlaku_sampai) <= sekarang.getTime()) return "kedaluwarsa";
  return "sah";
}

/** Hanya akun anak (umur terkunci, tidak dewasa) yang meminta izin wali. */
export function bolehMintaIzin(meta: Record<string, unknown> | undefined): boolean {
  return meta?.umur_terkunci === true && meta?.dewasa !== true;
}

/** Nama panggilan aman untuk ditampilkan ke orang tua: kata pertama nama Google, paling banyak 30 huruf. */
export function namaPanggilan(userMeta: Record<string, unknown> | undefined): string {
  const n = String(userMeta?.full_name ?? userMeta?.name ?? "").trim().split(/\s+/)[0] ?? "";
  return n.slice(0, 30);
}
