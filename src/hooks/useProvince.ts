import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Returns the province stored on the current Supabase user's `user_metadata.province`.
 * Returns null when no user is signed in or province has not been set yet.
 */
export function useProvince(): string | null {
  const [province, setProvince] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const read = (meta: Record<string, unknown> | undefined) => {
      const p = meta?.province;
      if (active) setProvince(typeof p === 'string' && p.length > 0 ? p : null);
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

  return province;
}
