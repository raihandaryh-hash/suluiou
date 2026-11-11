// Pencocokan kode kelas lewat fungsi basis data (drizzle 0005). Tabel classes tidak lagi bisa dibaca publik.
import { supabase } from '@/integrations/supabase/client';

export interface KelasCocok {
  id: string;
  name: string;
  school_name: string | null;
  session_closed: boolean;
}

export async function cariKelasDariKode(kode: string): Promise<{ data: KelasCocok | null; error: { message: string } | null }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc('cari_kelas_dari_kode', { p_kode: kode });
  if (error) return { data: null, error: { message: error.message } };
  const baris = Array.isArray(data) ? data[0] : data;
  return { data: (baris as KelasCocok) ?? null, error: null };
}
