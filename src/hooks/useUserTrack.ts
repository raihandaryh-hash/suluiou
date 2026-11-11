import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserTrack = 'siswa' | 'mahasiswa_iou';

/**
 * Jalur isi (jam bakti, rujukan HSA) dari peran yang ditulis server (Tonggak 2a, app_metadata).
 * Bukan penentu keselamatan: status dewasa hanya dibaca server (usia.ts, boleh_simpan).
 * Akun lama tanpa peran di app_metadata tetap membaca user_metadata.user_track bila akunnya dewasa (backfill 0007).
 */
export function trackDari(app: Record<string, unknown> | undefined, user: Record<string, unknown> | undefined): UserTrack {
  if (app?.peran === 'mahasiswa' && app?.mahasiswa_iou === true) return 'mahasiswa_iou';
  if (!app?.peran && app?.dewasa === true && user?.user_track === 'mahasiswa_iou') return 'mahasiswa_iou';
  return 'siswa';
}

export function useUserTrack(): UserTrack {
  const [track, setTrack] = useState<UserTrack>('siswa');

  useEffect(() => {
    let active = true;
    const read = (u: { app_metadata?: unknown; user_metadata?: unknown } | null | undefined) => {
      if (active) setTrack(trackDari(u?.app_metadata as Record<string, unknown>, u?.user_metadata as Record<string, unknown>));
    };
    supabase.auth.getUser().then(({ data }) => read(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => read(session?.user));
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  return track;
}
