// Tracks an optional class code captured early in the funnel — typically from
// a `?kode=ABCD` query param on the landing URL. Stored in localStorage so it
// survives the OAuth roundtrip and Step 0.
//
// This is intentionally separate from the StudentSession to keep concerns
// clean: pending code is a *hint* before authentication; classId on the
// session is the *bound* enrollment after auth.

const KEY = 'sulu.pendingClassCode.v1';

function normalize(code: string | null | undefined): string | null {
  if (!code) return null;
  const cleaned = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (cleaned.length !== 4) return null;
  return cleaned;
}

export function setPendingClassCode(code: string) {
  const normalized = normalize(code);
  if (!normalized) return;
  try {
    localStorage.setItem(KEY, normalized);
  } catch {
    /* ignore */
  }
}

export function getPendingClassCode(): string | null {
  try {
    return normalize(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function clearPendingClassCode() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Reads `?kode=ABCD` from the current URL and stashes it. Strips the param
 * from the URL so subsequent navigation/refresh stays clean. Idempotent.
 */
export function captureClassCodeFromUrl() {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    const raw = url.searchParams.get('kode') ?? url.searchParams.get('code');
    if (!raw) return;
    const normalized = normalize(raw);
    if (normalized) setPendingClassCode(normalized);
    url.searchParams.delete('kode');
    url.searchParams.delete('code');
    const newUrl = url.pathname + (url.search ? url.search : '') + url.hash;
    window.history.replaceState({}, '', newUrl);
  } catch {
    /* ignore */
  }
}
