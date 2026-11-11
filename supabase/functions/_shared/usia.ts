// Tonggak 1 · penentu usia di server (KEPUTUSAN Raihan 11 Nov 2026 10.21, butir 1: mode (c) untuk di bawah 18).
// Sulu tidak menyimpan umur. Aturan, condong hati-hati:
// - Akun login dengan user_metadata.user_track = "mahasiswa_iou" → dewasa.
// - Selain itu (tamu kelas sekolah, akun jalur siswa, akun tanpa jalur, gagal membaca akun) → bawah18.
// Batas yang diketahui: user_track ditulis klien sendiri (supabase.auth.updateUser), jadi siswa bisa memilih
// jalur mahasiswa. Penutupnya (verifikasi akun mahasiswa IOU) di Tonggak 2.

export type StatusUsia = "dewasa" | "bawah18";

export function putuskanUsia(pengguna: unknown): StatusUsia {
  const p = pengguna as { user_metadata?: { user_track?: unknown } } | null;
  return p?.user_metadata?.user_track === "mahasiswa_iou" ? "dewasa" : "bawah18";
}

/** Baca akun pemanggil dari token permintaan. Gagal, tamu, atau token anon → bawah18. */
export async function statusUsiaPermintaan(
  req: Request,
  env: { supabaseUrl?: string; anonKey?: string },
  fetchFn: typeof fetch = fetch,
  timeoutMs = 2500,
): Promise<StatusUsia> {
  const auth = req.headers.get("authorization");
  if (!auth || !env.supabaseUrl || !env.anonKey) return "bawah18";
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), timeoutMs);
  try {
    const r = await fetchFn(`${env.supabaseUrl}/auth/v1/user`, { headers: { authorization: auth, apikey: env.anonKey }, signal: c.signal });
    if (!r.ok) return "bawah18";
    return putuskanUsia(await r.json());
  } catch {
    return "bawah18"; // termasuk lewat batas waktu
  } finally {
    clearTimeout(t);
  }
}

/** Saklar mode (c): SULU_MODE_C_MATI = "1"/"true"/"ya" mematikan pembatasan teks bebas (keputusan Raihan saja). */
export function modeCHidup(get: (k: string) => string | undefined): boolean {
  return !["1", "true", "ya"].includes((get("SULU_MODE_C_MATI") || "").trim().toLowerCase());
}

/** Teks statis untuk obrolan bebas siswa di bawah 18 sebelum persetujuan orang tua (DRAF rumusan, dua varian menunggu Raihan). */
export const TEKS_OBROLAN_TERKUNCI =
  "Obrolan bebas dengan Sulu akan terbuka setelah orang tua atau wali kamu memberi izin. Sementara itu, hasil asesmen dan saran jalur kamu tetap bisa dibuka. Kalau ada yang sedang berat dan ingin kamu ceritakan, bicarakan dengan guru BK atau orang dewasa yang kamu percaya.";
