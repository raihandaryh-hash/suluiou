import { supabase } from '@/integrations/supabase/client';

// Tonggak 2a C.6: pengenal analytics acak yang berganti tiap hari, terpisah dari kd_session_id.
// Kunci props disaring lagi di server (sulu_catat_peristiwa: method, jalur, value, persona).
const KUNCI = 'sulu.analytics.hari.v1';
function sesiHarian(): string {
  const hari = new Date().toISOString().slice(0, 10);
  try {
    const ada = JSON.parse(localStorage.getItem(KUNCI) || 'null') as { hari: string; id: string } | null;
    if (ada && ada.hari === hari) return ada.id;
    const id = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)).replace(/-/g, '').slice(0, 20);
    localStorage.setItem(KUNCI, JSON.stringify({ hari, id }));
    return id;
  } catch {
    return 'tanpa-sesi';
  }
}

export async function track(eventName: string, props?: Record<string, unknown>): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc('sulu_catat_peristiwa', { p_nama: eventName, p_sesi: sesiHarian(), p_props: props ?? {} });
  } catch {
    // Silent fail — tracking tidak boleh break UX apapun
  }
}
