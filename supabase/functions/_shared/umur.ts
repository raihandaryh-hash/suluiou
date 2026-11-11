// Tonggak 2a · aturan kunci umur (manifest v0.6 A.3 dan A.9). Murni, tanpa jaringan, supaya bisa diuji.
export type Peran = "siswa" | "mahasiswa" | "orang_tua" | "guru_bk" | "guru" | "umum";
export const PERAN: Peran[] = ["siswa", "mahasiswa", "orang_tua", "guru_bk", "guru", "umum"];
export type Jenjang = "kelas_10_11" | "kelas_12" | "baru_lulus" | null;

export interface MetaUmur {
  peran?: Peran;
  jenjang?: Jenjang;
  mahasiswa_iou?: boolean; // hanya untuk isi (jam bakti, rujukan HSA), bukan keselamatan
  dewasa?: boolean;
  umur_terkunci?: boolean;
  umur_ditulis_pada?: string; // ISO, tulisan pertama
  umur_sumber?: string; // diri | backfill_* | aktivasi_peserta | admin
}

export const MASA_RALAT_MS = 15 * 60 * 1000;

export interface Permintaan {
  peran: Peran;
  jenjang?: Jenjang;
  mahasiswaIou?: boolean;
  menyatakan18: boolean;
}

/** Siswa selalu di bawah 18; peran lain dewasa hanya bila menyatakan 18+. */
export function dewasaDari(p: Permintaan): boolean {
  return p.peran !== "siswa" && p.menyatakan18 === true;
}

export type Hasil =
  | { ok: true; meta: MetaUmur }
  | { ok: false; alasan: "peran_tidak_dikenal" | "terkunci_arah_longgar" };

/**
 * Putuskan tulisan baru.
 * - Belum terkunci: bebas, lalu terkunci dengan stempel tulisan pertama.
 * - Dalam masa ralat 15 menit sejak tulisan pertama oleh diri sendiri: bebas.
 * - Sesudahnya (atau akun hasil backfill/aktivasi): hanya ke arah lebih ketat.
 */
export function putuskanTulisan(lama: MetaUmur, p: Permintaan, sekarang: Date): Hasil {
  if (!PERAN.includes(p.peran)) return { ok: false, alasan: "peran_tidak_dikenal" };
  const dewasaBaru = dewasaDari(p);
  const jenjang = p.peran === "siswa" ? (p.jenjang ?? null) : null;
  const mahasiswa_iou = p.peran === "mahasiswa" && p.mahasiswaIou === true;
  if (!lama.umur_terkunci) {
    return { ok: true, meta: { peran: p.peran, jenjang, mahasiswa_iou, dewasa: dewasaBaru, umur_terkunci: true, umur_ditulis_pada: sekarang.toISOString(), umur_sumber: "diri" } };
  }
  const ditulis = lama.umur_ditulis_pada ? Date.parse(lama.umur_ditulis_pada) : NaN;
  const dalamRalat = lama.umur_sumber === "diri" && Number.isFinite(ditulis) && sekarang.getTime() - ditulis <= MASA_RALAT_MS;
  if (dalamRalat) {
    return { ok: true, meta: { ...lama, peran: p.peran, jenjang, mahasiswa_iou, dewasa: dewasaBaru } };
  }
  // terkunci: dewasa → bawah 18 boleh; bawah 18 → dewasa ditolak
  if (dewasaBaru && lama.dewasa !== true) return { ok: false, alasan: "terkunci_arah_longgar" };
  return { ok: true, meta: { ...lama, peran: p.peran, jenjang, mahasiswa_iou, dewasa: lama.dewasa === true ? dewasaBaru : false } };
}

/** Sisa masa ralat dalam milidetik (0 bila habis atau tidak berlaku). */
export function sisaRalat(lama: MetaUmur, sekarang: Date): number {
  if (!lama.umur_terkunci || lama.umur_sumber !== "diri" || !lama.umur_ditulis_pada) return 0;
  const sisa = MASA_RALAT_MS - (sekarang.getTime() - Date.parse(lama.umur_ditulis_pada));
  return sisa > 0 ? sisa : 0;
}
