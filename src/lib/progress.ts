// Helpers for persisting & resuming assessment progress in DB.
// Now resilient to flaky networks: 3 attempts with exponential backoff,
// localStorage backup as last-resort, and a sync-on-online helper that
// retries the backup whenever the tab regains focus.
import { supabase } from '@/integrations/supabase/client';
import type { StudentSession } from '@/lib/classSession';
import type { StudentProfile } from '@/context/AssessmentContext';

export interface ProgressRow {
  id: string;
  user_id: string | null;
  guest_identifier: string | null;
  class_id: string | null;
  student_profile: Partial<StudentProfile> | null;
  hexaco_answers: Record<string, number>;
  sds_answers: Record<string, boolean>;
  stage: string;
  hexaco_index: number;
  sds_section: number;
  consent_given?: boolean;
  completed_at: string | null;
}

export interface ProgressSnapshot {
  studentProfile: StudentProfile | null;
  hexacoAnswers: Record<number, number>;
  sdsAnswers: Record<string, boolean>;
  stage: 'profile' | 'hexaco' | 'sds' | 'submitting';
  hexacoIndex: number;
  sdsSection: 1 | 2 | 3;
  consentGiven: boolean;
}

// ===== Save status broadcasting =====
// HEXACO/SDS components subscribe to show a small indicator in the header.
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'local';
type SaveListener = (s: SaveStatus) => void;
const listeners = new Set<SaveListener>();
let lastStatus: SaveStatus = 'idle';

export function subscribeSaveStatus(fn: SaveListener): () => void {
  listeners.add(fn);
  fn(lastStatus);
  return () => listeners.delete(fn);
}
function emit(s: SaveStatus) {
  lastStatus = s;
  listeners.forEach((l) => {
    try { l(s); } catch { /* ignore */ }
  });
}

// ===== localStorage backup =====
function backupKey(session: StudentSession): string {
  return session.kind === 'google'
    ? `sulu.progressBackup.user_${session.userId}`
    : `sulu.progressBackup.guest_${session.guestIdentifier}`;
}

function writeBackup(session: StudentSession, snap: ProgressSnapshot) {
  try {
    localStorage.setItem(
      backupKey(session),
      JSON.stringify({ snap, ts: Date.now() })
    );
  } catch { /* ignore quota */ }
}

function readBackup(session: StudentSession): ProgressSnapshot | null {
  try {
    const raw = localStorage.getItem(backupKey(session));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { snap: ProgressSnapshot };
    return parsed.snap ?? null;
  } catch {
    return null;
  }
}

function clearBackup(session: StudentSession) {
  try { localStorage.removeItem(backupKey(session)); } catch { /* ignore */ }
}

/** Look up an unfinished progress row for the given session. */
export async function fetchProgress(
  session: StudentSession
): Promise<ProgressRow | null> {
  let query = supabase
    .from('assessment_progress')
    .select('*')
    .is('completed_at', null);

  if (session.kind === 'google') {
    query = query.eq('user_id', session.userId);
  } else {
    query = query.eq('guest_identifier', session.guestIdentifier);
    if (session.classId) query = query.eq('class_id', session.classId);
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    console.warn('fetchProgress failed:', error.message);
    return null;
  }
  return (data as unknown as ProgressRow) ?? null;
}

// ===== Core upsert (one attempt) =====
async function attemptSave(
  session: StudentSession,
  snap: ProgressSnapshot
): Promise<{ ok: boolean; error?: string }> {
  const hexaco: Record<string, number> = {};
  Object.entries(snap.hexacoAnswers).forEach(([k, v]) => { hexaco[k] = v; });

  const base = {
    student_profile: snap.studentProfile,
    hexaco_answers: hexaco,
    sds_answers: snap.sdsAnswers,
    stage: snap.stage,
    hexaco_index: snap.hexacoIndex,
    sds_section: snap.sdsSection,
    consent_given: snap.consentGiven,
  };

  const row = session.kind === 'google'
    ? { ...base, user_id: session.userId, guest_identifier: null, class_id: session.classId }
    : { ...base, user_id: null, guest_identifier: session.guestIdentifier, class_id: session.classId };

  // Lookup existing row id (PostgREST can't pick a partial unique index).
  let existingId: string | null = null;
  {
    let q = supabase.from('assessment_progress').select('id').is('completed_at', null);
    if (session.kind === 'google') {
      q = q.eq('user_id', session.userId);
    } else {
      q = q.eq('guest_identifier', session.guestIdentifier);
      if (session.classId) q = q.eq('class_id', session.classId);
      else q = q.is('class_id', null);
    }
    const { data: found, error: findErr } = await q.maybeSingle();
    if (findErr) return { ok: false, error: findErr.message };
    existingId = (found as { id?: string } | null)?.id ?? null;
  }

  if (existingId) {
    const { error } = await supabase
      .from('assessment_progress')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update(row as any)
      .eq('id', existingId);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase
      .from('assessment_progress')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(row as any);
    if (error) return { ok: false, error: error.message };
  }
  return { ok: true };
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Upsert a progress snapshot with retry + localStorage backup fallback. */
export async function saveProgress(
  session: StudentSession,
  snap: ProgressSnapshot
) {
  emit('saving');

  // Attempt 1, then retry with 1s, then 2s backoff.
  const delays = [0, 1000, 2000];
  for (let i = 0; i < delays.length; i++) {
    if (delays[i] > 0) await sleep(delays[i]);
    const res = await attemptSave(session, snap);
    if (res.ok) {
      // Successful — drop any previous backup.
      clearBackup(session);
      emit('saved');
      return;
    }
    if (i < delays.length - 1) {
      console.warn(`saveProgress attempt ${i + 1} failed:`, res.error);
    } else {
      console.warn('saveProgress all attempts failed:', res.error);
    }
  }

  // All attempts failed → keep snapshot locally so we don't lose progress.
  writeBackup(session, snap);
  emit('local');
}

/** Try to flush any locally-backed-up progress for this session to the DB.
 *  Called on mount and when the tab regains visibility. */
export async function syncBackupProgress(session: StudentSession): Promise<void> {
  const snap = readBackup(session);
  if (!snap) return;
  emit('saving');
  const res = await attemptSave(session, snap);
  if (res.ok) {
    clearBackup(session);
    emit('saved');
  } else {
    emit('local');
  }
}

/** Mark progress completed so it's not resumed again. */
export async function markProgressCompleted(session: StudentSession) {
  let query = supabase
    .from('assessment_progress')
    .update({ completed_at: new Date().toISOString() });

  if (session.kind === 'google') {
    query = query.eq('user_id', session.userId);
  } else {
    query = query
      .eq('guest_identifier', session.guestIdentifier)
      .eq('class_id', session.classId ?? '');
  }
  const { error } = await query;
  if (error) console.warn('markProgressCompleted failed:', error.message);
  // Clear any leftover backup once the assessment is done.
  clearBackup(session);
}

/** Delete the in-progress row (used by "Mulai asesmen baru"). */
export async function deleteProgress(session: StudentSession) {
  let q = supabase.from('assessment_progress').delete().is('completed_at', null);
  if (session.kind === 'google') {
    q = q.eq('user_id', session.userId);
  } else {
    q = q.eq('guest_identifier', session.guestIdentifier);
    if (session.classId) q = q.eq('class_id', session.classId);
  }
  const { error } = await q;
  if (error) console.warn('deleteProgress failed:', error.message);
  clearBackup(session);
}

/** Convert DB row to context-shaped snapshot. Backfills missing fields so
 *  legacy Step 0 rows don't break typing — UI gates via isProfileComplete. */
export function rowToSnapshot(row: ProgressRow): ProgressSnapshot {
  const hexaco: Record<number, number> = {};
  Object.entries(row.hexaco_answers ?? {}).forEach(([k, v]) => {
    hexaco[Number(k)] = Number(v);
  });
  const stage = (['profile', 'hexaco', 'sds', 'submitting'].includes(row.stage)
    ? row.stage
    : 'profile') as ProgressSnapshot['stage'];
  const section = (row.sds_section >= 1 && row.sds_section <= 3
    ? row.sds_section
    : 1) as 1 | 2 | 3;

  const sp = row.student_profile;
  const studentProfile: StudentProfile | null = sp
    ? {
        name: sp.name ?? '',
        province: sp.province ?? '',
        familyBackground: sp.familyBackground ?? '',
        learningStyle: sp.learningStyle ?? '',
        careerCertainty: sp.careerCertainty ?? '',
        contributionGoal: sp.contributionGoal ?? '',
        educationPlan: sp.educationPlan ?? '',
        aspiration: sp.aspiration ?? '',
      }
    : null;

  return {
    studentProfile,
    hexacoAnswers: hexaco,
    sdsAnswers: (row.sds_answers ?? {}) as Record<string, boolean>,
    stage,
    hexacoIndex: row.hexaco_index ?? 0,
    sdsSection: section,
    consentGiven: Boolean(row.consent_given),
  };
}
