// Helpers for the "Save to Google" flow.
//
// When a guest completes the assessment, they can choose to attach the result
// to their Google account. We stash a small "claim" payload in localStorage
// before triggering the OAuth redirect; after OAuth completes and Login mounts,
// we read the claim, UPDATE the existing assessment_results + assessment_progress
// rows to set user_id (so the result shows up under their Google login), and
// clear the claim.

import { supabase } from '@/integrations/supabase/client';

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
export async function applyClaim(claim: PendingClaim, userId: string) {
  // 1) Attach user_id to assessment_results (by id if known, else by guest_identifier)
  if (claim.resultId) {
    await supabase
      .from('assessment_results')
      .update({ user_id: userId })
      .eq('id', claim.resultId);
  } else {
    await supabase
      .from('assessment_results')
      .update({ user_id: userId })
      .eq('guest_identifier', claim.guestIdentifier);
  }

  // 2) Attach user_id to assessment_progress for the same guest
  await supabase
    .from('assessment_progress')
    .update({ user_id: userId })
    .eq('guest_identifier', claim.guestIdentifier);

  // 3) Re-point class_enrollments so the student appears under their Google login too
  await supabase
    .from('class_enrollments')
    .update({ user_id: userId })
    .eq('guest_identifier', claim.guestIdentifier)
    .is('user_id', null);
}
