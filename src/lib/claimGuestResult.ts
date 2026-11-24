// Helpers for the "Save to Google" flow.
//
// When a guest completes the assessment, they can choose to attach the result
// to their Google account. We stash a small "claim" payload in localStorage
// before triggering the OAuth redirect; after OAuth completes and Login mounts,
// we read the claim, UPDATE the existing assessment_results + assessment_progress
// rows to set user_id (so the result shows up under their Google login), and
// clear the claim.


const CLAIM_KEY = 'sulu.pendingClaim.v1';

export interface PendingClaim {
  resultId: string | null;
  guestIdentifier: string;
  // Snapshot for UX after claim succeeds
  studentName: string | null;
  classId: string | null;
  className: string | null;
  // Asal klaim: hasil asesmen (bawaan) atau Jalan Bakti (ajakan masuk saat fitur AI menjawab 401).
  asal?: 'hasil' | 'jalan-bakti';
  createdAt: number;
}

export function setPendingClaim(claim: Omit<PendingClaim, 'createdAt'>) {
  try {
    localStorage.setItem(
      CLAIM_KEY,
      JSON.stringify({ ...claim, createdAt: Date.now() }),
    );
  } catch {
    /* ignore */
  }
}

export function getPendingClaim(): PendingClaim | null {
  try {
    const raw = localStorage.getItem(CLAIM_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as PendingClaim;
    // Klaim basi (OAuth batal atau gagal) tidak boleh memindahkan data tamu ke akun lain di perangkat yang sama.
    if (!c.createdAt || Date.now() - c.createdAt > 15 * 60 * 1000) {
      localStorage.removeItem(CLAIM_KEY);
      return null;
    }
    return c;
  } catch {
    return null;
  }
}

export function clearPendingClaim() {
  try {
    localStorage.removeItem(CLAIM_KEY);
  } catch {
    /* ignore */
  }
}

/** UPDATE existing guest rows to attach a Google user_id. */

// applyClaim dihapus di Tonggak 2a (T4, B.8): tamu tidak punya baris server; pindah hasil kini di perangkat
// (pindahPemilikPerangkat di src/lib/perangkat.ts), dipanggil Login sesudah OAuth.

// Penanda sekali pakai: Jalan Bakti boleh mengadopsi isian tamu di perangkat untuk akun ini.
const ADOPSI_KEY = 'sulu.jb.adopsi';
export function tandaiAdopsiJalanBakti(userId: string) {
  try { sessionStorage.setItem(ADOPSI_KEY, userId); } catch { /* abaikan */ }
}
export function ambilAdopsiJalanBakti(userId: string): boolean {
  try {
    const v = sessionStorage.getItem(ADOPSI_KEY);
    if (v) sessionStorage.removeItem(ADOPSI_KEY);
    return v === userId;
  } catch {
    return false;
  }
}
