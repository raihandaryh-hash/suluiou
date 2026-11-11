import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/** Status dewasa dari app_metadata (ditulis server, Tonggak 2a). null = belum terbaca; tamu = false. Hanya untuk tampilan. */
export function useDewasa(): boolean | null {
  const [dewasa, setDewasa] = useState<boolean | null>(null);
  useEffect(() => {
    let aktif = true;
    const baca = (u: { app_metadata?: Record<string, unknown> } | null | undefined) => { if (aktif) setDewasa(u?.app_metadata?.dewasa === true); };
    supabase.auth.getUser().then(({ data }) => baca(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => baca(s?.user));
    return () => { aktif = false; sub.subscription.unsubscribe(); };
  }, []);
  return dewasa;
}
