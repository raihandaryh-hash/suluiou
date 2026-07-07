import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserTrack = 'siswa' | 'mahasiswa_iou';

/**
 * Returns the track stored on the current Supabase user's
 * `user_metadata.user_track` (Fork Dua-Pintu, 6 Jul 2026).
 *
 * Defaults to 'siswa' when: no user signed in (guest/anon), or track not set.
 * Guest sessions never carry user_track by design — see comment on
 * handleGuest in Login.tsx.
 */
export function useUserTrack(): UserTrack {
  const [track, setTrack] = useState<UserTrack>('siswa');

  useEffect(() => {
    let active = true;

    const read = (meta: Record<string, unknown> | undefined) => {
      const t = meta?.user_track;
      if (active) setTrack(t === 'mahasiswa_iou' ? 'mahasiswa_iou' : 'siswa');
    };

    supabase.auth.getUser().then(({ data }) => {
      read(data.user?.user_metadata as Record<string, unknown> | undefined);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      read(session?.user?.user_metadata as Record<string, unknown> | undefined);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return track;
}
