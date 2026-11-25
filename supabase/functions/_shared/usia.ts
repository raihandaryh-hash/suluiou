// Tonggak 1 · penentu usia di server (KEPUTUSAN Raihan 11 Nov 2026 10.21, butir 1: mode (c) untuk di bawah 18).
// Tonggak 2a (manifest v0.6 A.5): status dewasa hanya dari app_metadata.dewasa, yang ditulis service role lewat
// atur-peran, aktivasi kode peserta, atau backfill 0007. user_metadata (bisa diubah pengguna) tidak lagi dibaca.
// Selain dewasa === true (tamu, token anon, akun tanpa status, gagal membaca) → bawah18 (gagal tertutup).

// G2-13 (23 Nov 2026): "anon" = tidak ada akun sah di permintaan. Fungsi AI menolaknya (gerbang.ts).
export type StatusUsia = "dewasa" | "bawah18" | "anon";

export function putuskanUsia(pengguna: unknown): StatusUsia {
  const p = pengguna as { app_metadata?: { dewasa?: unknown }; is_anonymous?: unknown } | null;
  // G3-016: sesi Anonymous Sign-In Supabase ditolak sebagai "anon" (tidak boleh lolos gerbangAI).
  if (p?.is_anonymous === true) return "anon";
  return p?.app_metadata?.dewasa === true ? "dewasa" : "bawah18";
}

export type IdentitasPermintaan = {
  usia: StatusUsia;
  userId: string | null;
  /** Peran yang dipilih pengguna di pintu masuk (app_metadata.peran, ditulis server); null bila tidak ada. */
  peran?: string | null;
};

const PERAN_SAH = ["siswa", "mahasiswa", "orang_tua", "guru_bk", "guru", "umum"];

/** Sebutan pembaca untuk perintah AI, menurut peran akun (KEPUTUSAN 8 Nov 21.45: Sulu untuk siapa pun). */
export function sebutanPembaca(peran: string | null | undefined): string {
  switch (peran) {
    case "siswa": return "siswa SMA/MA/SMK";
    case "mahasiswa": return "mahasiswa";
    case "orang_tua": return "orang tua yang sedang menimbang arah hidupnya sendiri";
    case "guru_bk": return "guru BK yang sedang mengenali dirinya sendiri";
    case "guru": return "guru yang sedang menimbang arah kariernya";
    case "umum": return "orang dewasa yang sedang menimbang arah";
    default: return "orang yang sedang menimbang arah hidupnya";
  }
}

/**
 * Baca status usia dan user.id pemanggil dari token permintaan.
 * Tanpa token, token anon/publishable, akun is_anonymous, token tidak sah, galat, atau lewat batas waktu -> { usia: "anon", userId: null }.
 */
export async function identitasPermintaan(
  req: Request,
  env: { supabaseUrl?: string; anonKey?: string },
  fetchFn: typeof fetch = fetch,
  timeoutMs = 2500,
): Promise<IdentitasPermintaan> {
  const auth = req.headers.get("authorization");
  if (!auth || !env.supabaseUrl || !env.anonKey) return { usia: "anon", userId: null };
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), timeoutMs);
  try {
    const r = await fetchFn(`${env.supabaseUrl}/auth/v1/user`, { headers: { authorization: auth, apikey: env.anonKey }, signal: c.signal });
    if (!r.ok) return { usia: "anon", userId: null };
    const u = await r.json();
    const usia = putuskanUsia(u);
    if (usia === "anon") return { usia: "anon", userId: null };
    const rawId = (u as { id?: unknown } | null)?.id;
    const userId = typeof rawId === "string" && rawId.trim() ? rawId.trim() : null;
    const rawPeran = (u as { app_metadata?: { peran?: unknown } } | null)?.app_metadata?.peran;
    const peran = typeof rawPeran === "string" && PERAN_SAH.includes(rawPeran) ? rawPeran : null;
    return { usia, userId, peran };
  } catch {
    return { usia: "anon", userId: null }; // termasuk lewat batas waktu
  } finally {
    clearTimeout(t);
  }
}

/**
 * Baca akun pemanggil dari token permintaan.
 * Tanpa token, token anon/publishable, akun is_anonymous, token tidak sah, galat, atau lewat batas waktu -> "anon" (ditolak, gagal tertutup).
 * Akun sah tanpa status dewasa -> "bawah18".
 */
export async function statusUsiaPermintaan(
  req: Request,
  env: { supabaseUrl?: string; anonKey?: string },
  fetchFn: typeof fetch = fetch,
  timeoutMs = 2500,
): Promise<StatusUsia> {
  const { usia } = await identitasPermintaan(req, env, fetchFn, timeoutMs);
  return usia;
}

/**
 * Saklar mode (c). KEPUTUSAN Raihan 18 Nov 15.47 "Kasih kapabilitas full." dan 25 Nov 04.32 "Kemampuan penuh semuanya.":
 * mode (c) MATI secara bawaan untuk semua fungsi AI. Samaran ke AI dan lapis distress tetap berjalan untuk di bawah 18.
 * SULU_MODE_C_HIDUP = "1"/"true"/"ya" menyalakannya kembali (keputusan Raihan saja). SULU_MODE_C_MATI tidak dipakai lagi.
 */
export function modeCHidup(get: (k: string) => string | undefined): boolean {
  return ["1", "true", "ya"].includes((get("SULU_MODE_C_HIDUP") || "").trim().toLowerCase());
}

/** Teks statis obrolan terkunci. Tidak dipakai sejak kapabilitas penuh (25 Nov); disimpan untuk saklar SULU_MODE_C_HIDUP. */
export const TEKS_OBROLAN_TERKUNCI =
  "Obrolan bebas dengan Sulu akan terbuka setelah orang tua atau wali kamu memberi izin. Sementara itu, semua tahap perjalananmu di Sulu tetap bisa kamu jalani. Kalau ada yang sedang berat dan ingin kamu ceritakan, bicarakan dengan guru BK atau orang dewasa yang kamu percaya.";
