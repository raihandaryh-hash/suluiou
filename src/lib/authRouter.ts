// Decide where an authenticated student should land based on DB state.
// Used by Login (after Google OAuth or guest enroll) and by /consent / /assessment.
import { supabase } from '@/integrations/supabase/client';
import { patchStudentSession, type StudentSession } from '@/lib/classSession';

/** Look up a student's most recent class enrollment and return class info. */
async function findEnrolledClass(
  session: StudentSession,
): Promise<{ classId: string; className: string | null } | null> {
  try {
    let q = supabase
      .from('class_enrollments')
      .select('class_id, classes:class_id(name, session_closed)')
      .order('enrolled_at', { ascending: false })
      .limit(1);
    q = session.kind === 'google'
      ? q.eq('user_id', session.userId)
      : q.eq('guest_identifier', session.guestIdentifier);
    const { data } = await q.maybeSingle();
    if (!data?.class_id) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cls: any = data.classes;
    if (cls?.session_closed) return null;
    return { classId: data.class_id, className: cls?.name ?? null };
  } catch (e) {
    console.warn('[findEnrolledClass] failed', e);
    return null;
  }
}

export type AuthRoute = '/results' | '/assessment' | '/consent' | '/profile' | '/join';

interface ProgressLite {
  consent_given?: boolean;
  student_profile?: Record<string, unknown> | null;
}

function profileHasAllRequired(p: Record<string, unknown> | null | undefined): boolean {
  if (!p) return false;
  const required = [
    'province',
    'familyBackground',
    'learningStyle',
    'careerCertainty',
    'contributionGoal',
    'educationPlan',
  ];
  return required.every((k) => typeof p[k] === 'string' && (p[k] as string).length > 0);
}

/** Determine where the authenticated student should go next. */
export async function routeAfterAuth(session: StudentSession): Promise<AuthRoute> {
  // 1) Finished assessment?
  try {
    let q = supabase
      .from('assessment_results')
      .select('id')
      .not('completed_at', 'is', null)
      .limit(1);
    q = session.kind === 'google'
      ? q.eq('user_id', session.userId)
      : q.eq('guest_identifier', session.guestIdentifier);
    const { data: done } = await q.maybeSingle();
    if (done) return '/results';
  } catch (e) {
    console.warn('[routeAfterAuth] results check failed', e);
  }

  // 2) Look up in-progress row.
  let progress: ProgressLite | null = null;
  try {
    let q = supabase
      .from('assessment_progress')
      .select('consent_given, student_profile, class_id')
      .is('completed_at', null)
      .limit(1);
    q = session.kind === 'google'
      ? q.eq('user_id', session.userId)
      : q.eq('guest_identifier', session.guestIdentifier);
    const { data } = await q.maybeSingle();
    progress = data as unknown as ProgressLite | null;
  } catch (e) {
    console.warn('[routeAfterAuth] progress check failed', e);
  }

  // 3) If a progress row exists, route by what's missing.
  if (progress) {
    if (!profileHasAllRequired(progress.student_profile ?? null)) return '/profile';
    if (!progress.consent_given) return '/consent';
    return '/assessment';
  }

  // 4) Enrolled but never started?
  try {
    let q = supabase.from('class_enrollments').select('class_id').limit(1);
    q = session.kind === 'google'
      ? q.eq('user_id', session.userId)
      : q.eq('guest_identifier', session.guestIdentifier);
    const { data: enr } = await q.maybeSingle();
    if (enr?.class_id) return '/profile';
  } catch (e) {
    console.warn('[routeAfterAuth] enrollment check failed', e);
  }

  return '/join';
}
