// Decide where an authenticated student should land based on DB state.
// Used by Login (after Google OAuth or guest enroll) and by /consent / /assessment.
import { supabase } from '@/integrations/supabase/client';
import { patchStudentSession, type StudentSession } from '@/lib/classSession';
import { getPendingClassCode, clearPendingClassCode } from '@/lib/pendingClassCode';

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

export type AuthRoute = '/results' | '/assessment' | '/consent' | '/profile';

/** Try to auto-enroll a Google user using a pending `?kode=` code captured earlier. */
async function tryEnrollFromPendingCode(
  session: StudentSession,
): Promise<{ classId: string; className: string | null } | null> {
  const code = getPendingClassCode();
  if (!code) return null;
  try {
    const { data: cls } = await supabase
      .from('classes')
      .select('id, name, session_closed')
      .eq('join_code', code)
      .maybeSingle();
    if (!cls || cls.session_closed) {
      clearPendingClassCode();
      return null;
    }
    if (session.kind === 'google') {
      const { error } = await supabase
        .from('class_enrollments')
        .insert({ class_id: cls.id, user_id: session.userId });
      if (error && !error.message.toLowerCase().includes('duplicate')) {
        console.warn('[tryEnrollFromPendingCode] insert failed', error);
        return null;
      }
    }
    clearPendingClassCode();
    return { classId: cls.id, className: cls.name ?? null };
  } catch (e) {
    console.warn('[tryEnrollFromPendingCode] failed', e);
    return null;
  }
}

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
  // Always try to ensure session has classId populated from DB.
  if (!session.classId) {
    const enr = await findEnrolledClass(session);
    if (enr) {
      patchStudentSession({ classId: enr.classId, className: enr.className });
      session = { ...session, classId: enr.classId, className: enr.className };
    }
  }

  // If still no class but a pending ?kode= was captured earlier, try to enroll now.
  if (!session.classId) {
    const enr = await tryEnrollFromPendingCode(session);
    if (enr) {
      patchStudentSession({ classId: enr.classId, className: enr.className });
      session = { ...session, classId: enr.classId, className: enr.className };
    }
  }

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

  // 4) Default landing → Step 0 (profile). Class code is now optional and
  //    collected within Step 0 if the student doesn't have one yet.
  return '/profile';
}
