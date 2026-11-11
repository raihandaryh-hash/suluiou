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
    return JSON.parse(raw) as PendingClaim;
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
