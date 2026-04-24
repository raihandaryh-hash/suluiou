// Helpers for persisting & resuming assessment progress in DB.
import { supabase } from '@/integrations/supabase/client';
import type { StudentSession } from '@/lib/classSession';

export interface ProgressRow {
  id: string;
  user_id: string | null;
  guest_identifier: string | null;
  class_id: string | null;
  student_profile: {
    name: string;
    province: string;
    familyBackground: string;
    aspiration: string;
  } | null;
  hexaco_answers: Record<string, number>;
  sds_answers: Record<string, boolean>;
  stage: string;
  hexaco_index: number;
  sds_section: number;
  completed_at: string | null;
}

export interface ProgressSnapshot {
  studentProfile: ProgressRow['student_profile'];
  hexacoAnswers: Record<number, number>;
  sdsAnswers: Record<string, boolean>;
  stage: 'profile' | 'hexaco' | 'sds' | 'submitting';
  hexacoIndex: number;
  sdsSection: 1 | 2 | 3;
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

/** Upsert a progress snapshot. Idempotent thanks to unique indexes. */
export async function saveProgress(
  session: StudentSession,
  snap: ProgressSnapshot
) {
  // Convert numeric-keyed hexaco answers to string keys for jsonb.
  const hexaco: Record<string, number> = {};
  Object.entries(snap.hexacoAnswers).forEach(([k, v]) => {
    hexaco[k] = v;
  });

  const base = {
    student_profile: snap.studentProfile,
    hexaco_answers: hexaco,
    sds_answers: snap.sdsAnswers,
    stage: snap.stage,
    hexaco_index: snap.hexacoIndex,
    sds_section: snap.sdsSection,
  };

  const row =
    session.kind === 'google'
      ? {
          ...base,
          user_id: session.userId,
          guest_identifier: null,
          class_id: session.classId,
        }
      : {
          ...base,
          user_id: null,
          guest_identifier: session.guestIdentifier,
          class_id: session.classId,
        };

  const conflict =
    session.kind === 'google' ? 'user_id' : 'guest_identifier,class_id';

  const { error } = await supabase
    .from('assessment_progress')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .upsert(row as any, { onConflict: conflict });

  if (error) console.warn('saveProgress failed:', error.message);
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
}

/** Convert DB row to context-shaped snapshot. */
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
  return {
    studentProfile: row.student_profile,
    hexacoAnswers: hexaco,
    sdsAnswers: (row.sds_answers ?? {}) as Record<string, boolean>,
    stage,
    hexacoIndex: row.hexaco_index ?? 0,
    sdsSection: section,
  };
}
