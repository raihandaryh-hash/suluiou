// Helpers for student session: stores either Google user info or guest info
// in localStorage so the assessment flow survives mobile tab-backgrounding,
// browser refresh, and short app switches (e.g. opening WhatsApp).
//
// Why localStorage (not sessionStorage):
// On mobile browsers, sessionStorage is wiped when a tab is backgrounded long
// enough for the OS to evict the page. That made students lose their session
// (and appear to "restart" the assessment) every time they switched apps.
// localStorage persists until explicitly cleared, so we control lifecycle:
//   - Cleared on explicit logout
//   - Cleared 24h after assessmentComplete flag is set
//   - NOT cleared on refresh, tab switch, or background

const KEY = 'sulu.studentSession.v1';
const COMPLETE_KEY = 'sulu.assessmentComplete.v1';
const COMPLETE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

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

// Backwards-compat: if an old sessionStorage entry exists (from before the
// switch to localStorage), migrate it once so users mid-session don't lose
// state on the first load after deploy.
function migrateLegacySessionStorage() {
  try {
    if (typeof sessionStorage === 'undefined') return;
    const legacy = sessionStorage.getItem(KEY);
    if (legacy && !localStorage.getItem(KEY)) {
      localStorage.setItem(KEY, legacy);
    }
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function getStudentSession(): StudentSession | null {
  try {
    migrateLegacySessionStorage();
    // If assessment was completed >24h ago, auto-clear the session so the
    // device can be reused by the next student.
    const completedAt = localStorage.getItem(COMPLETE_KEY);
    if (completedAt) {
      const ts = Number(completedAt);
      if (!Number.isNaN(ts) && Date.now() - ts > COMPLETE_TTL_MS) {
        localStorage.removeItem(KEY);
        localStorage.removeItem(COMPLETE_KEY);
        return null;
      }
    }
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StudentSession;
  } catch {
    return null;
  }
}

export function setStudentSession(s: StudentSession) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    // Starting a new session clears any prior "complete" flag.
    localStorage.removeItem(COMPLETE_KEY);
  } catch {
    /* ignore */
  }
}

export function patchStudentSession(patch: Partial<StudentSession>) {
  const cur = getStudentSession();
  if (!cur) return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...cur, ...patch }));
  } catch {
    /* ignore */
  }
}

export function clearStudentSession() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(COMPLETE_KEY);
    // Also clear any legacy sessionStorage entry.
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** Mark assessment as complete. Session will auto-clear after 24h. */
export function markAssessmentComplete() {
  try {
    localStorage.setItem(COMPLETE_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export function makeGuestIdentifier(phone: string, joinCode: string) {
  return `guest_${phone.replace(/\D/g, '')}_${joinCode.toUpperCase()}`;
}
