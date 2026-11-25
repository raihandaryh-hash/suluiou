// Akses asesmen (Spine A), diputus per pengguna di sisi klien.
// KEPUTUSAN Raihan: asesmen dikunci untuk siswa (1 Jun, 3 Jul: anti-foreclosure); "asesmen itu untuk mahasiswa yang
// sudah tak berisiko identity foreclosure" dan "Setelah Spine A aktif, SEMUA harus lewat login, tak ada guest" (6 Jul);
// "Spine A ya tetap ada tidak dihapus" (25 Jul); build sampai final lalu ditinjau SME (3 Nov).
// Aturan:
//  1. ASESMEN_TERBUKA (semua orang) tetap mati sampai Raihan menyalakannya.
//  2. Tamu tidak pernah masuk asesmen. Akun Google wajib.
//  3. Admin selalu bisa masuk, supaya Raihan dan peninjau SME bisa menjalankan asesmen utuh sebelum dibuka.
//  4. ASESMEN_DEWASA_TERBUKA (Raihan saja) membuka asesmen untuk akun berstatus dewasa (umur 18+ tercatat server).
//     Akun siswa di bawah 18 tetap tertutup.
import { ASESMEN_TERBUKA, ASESMEN_DEWASA_TERBUKA } from '@/data/flags';
import { getStudentSession } from '@/lib/classSession';

const KUNCI_ADMIN = 'sulu.admin.';

/** Dicatat useAuth sesudah pemeriksaan admin selesai, supaya gerbang sinkron bisa membacanya. */
export function catatAdmin(userId: string, admin: boolean) {
  try { sessionStorage.setItem(KUNCI_ADMIN + userId, admin ? '1' : '0'); } catch { /* abaikan */ }
}

function sesiAuth(): { id?: string; app_metadata?: Record<string, unknown> } | null {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) ?? '';
      if (k.startsWith('sb-') && k.endsWith('-auth-token')) {
        const v = JSON.parse(localStorage.getItem(k) ?? 'null');
        return v?.user ?? null;
      }
    }
  } catch { /* abaikan */ }
  return null;
}

function adminTercatat(uid: string): boolean {
  try { return sessionStorage.getItem(KUNCI_ADMIN + uid) === '1'; } catch { return false; }
}

/** Hapus semua tanda admin (dipanggil saat keluar). */
export function hapusTandaAdmin() {
  try {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const k = sessionStorage.key(i) ?? '';
      if (k.startsWith(KUNCI_ADMIN)) sessionStorage.removeItem(k);
    }
  } catch { /* abaikan */ }
}

export function asesmenTerbuka(): boolean {
  if (ASESMEN_TERBUKA) return true;
  const s = getStudentSession();
  // Sesi tamu tidak pernah masuk, walau tab yang sama masih memegang token admin.
  if (s?.kind === 'guest') return false;
  const u = sesiAuth();
  // Admin cukup punya sesi akun (Google atau email admin), tanpa sesi siswa.
  if (u?.id && adminTercatat(u.id)) return true;
  if (s?.kind !== 'google') return false;
  if (!u?.id || u.id !== s.userId) return false;
  return ASESMEN_DEWASA_TERBUKA && u.app_metadata?.dewasa === true;
}

/** Versi yang menunggu pemeriksaan admin selesai (untuk perutean sesudah login, sebelum useAuth sempat jalan). */
export async function asesmenTerbukaAsync(cekAdmin: (uid: string) => Promise<{ admin: boolean }>): Promise<boolean> {
  if (asesmenTerbuka()) return true;
  const u = sesiAuth();
  if (!u?.id) return false;
  try { await cekAdmin(u.id); } catch { /* catatAdmin sudah dipanggil */ }
  return asesmenTerbuka();
}
