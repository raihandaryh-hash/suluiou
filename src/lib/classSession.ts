// Helpers for student session: stores either Google user info or guest info
// in sessionStorage so the assessment flow can know who the student is.

const KEY = 'sulu.studentSession.v1';

export type StudentSession =
  | {
      kind: 'google';
      userId: string;
      email: string;
      displayName: string | null;
      classId: string | null;
      className: string | null;
    }
  | {
      kind: 'guest';
      guestIdentifier: string; // guest_{phone}_{joinCode}
      name: string;
      phone: string;
      classId: string | null;
      className: string | null;
    };

export function getStudentSession(): StudentSession | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StudentSession;
  } catch {
    return null;
  }
}

export function setStudentSession(s: StudentSession) {
  sessionStorage.setItem(KEY, JSON.stringify(s));
}

export function patchStudentSession(patch: Partial<StudentSession>) {
  const cur = getStudentSession();
  if (!cur) return;
  sessionStorage.setItem(KEY, JSON.stringify({ ...cur, ...patch }));
}

export function clearStudentSession() {
  sessionStorage.removeItem(KEY);
}

export function makeGuestIdentifier(phone: string, joinCode: string) {
  return `guest_${phone.replace(/\D/g, '')}_${joinCode.toUpperCase()}`;
}
