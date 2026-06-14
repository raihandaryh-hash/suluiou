import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getStudentSession } from '@/lib/classSession';

/**
 * Spine B guard. If no student session (Google or guest) exists, redirect to
 * /login and remember where the user was going so we can send them back after
 * auth succeeds.
 */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const session = getStudentSession();
  if (!session) {
    const returnTo = location.pathname + location.search + location.hash;
    try {
      sessionStorage.setItem('sulu.returnTo', returnTo);
    } catch {
      /* ignore */
    }
    return <Navigate to="/login" replace state={{ returnTo }} />;
  }
  return <>{children}</>;
}

export function consumeReturnTo(): string | null {
  try {
    const v = sessionStorage.getItem('sulu.returnTo');
    if (v) sessionStorage.removeItem('sulu.returnTo');
    return v;
  } catch {
    return null;
  }
}
