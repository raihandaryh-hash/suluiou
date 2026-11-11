// Tonggak 2a · klien atur-peran (manifest v0.6 A). Status umur hanya ditulis server; klien membaca app_metadata.
import { supabase } from '@/integrations/supabase/client';
import type { PeranPilihan } from '@/data/pintuMasukContent';

export type Jenjang = 'kelas_10_11' | 'kelas_12' | 'baru_lulus';

export interface StatusPeran {
  peran: PeranPilihan | null;
  jenjang: Jenjang | null;
  mahasiswa_iou: boolean;
  dewasa: boolean;
  terkunci: boolean;
  sisa_ralat_ms: number;
}

async function panggil<T>(isi: Record<string, unknown>): Promise<{ data: T | null; galat: string | null }> {
  const { data, error } = await supabase.functions.invoke('atur-peran', { body: isi });
  if (error) {
    // FunctionsHttpError membawa tubuh jawaban; ambil kode galatnya bila ada
    let galat = 'lainnya';
    try { const j = await (error as { context?: Response }).context?.json(); if (j?.galat) galat = String(j.galat); } catch { /* */ }
    return { data: null, galat };
  }
  return { data: data as T, galat: null };
}

export const bacaPeran = () => panggil<StatusPeran>({ aksi: 'baca' });

export async function tulisPeran(p: { peran: PeranPilihan; jenjang?: Jenjang | null; mahasiswaIou?: boolean; menyatakan18: boolean }) {
  const h = await panggil<StatusPeran>({ aksi: 'tulis', ...p });
  // token lama masih membawa app_metadata lama; segarkan supaya halaman lain membaca status baru
  if (!h.galat) await supabase.auth.refreshSession();
  return h;
}

export const mintaBukaKunci = () => panggil<{ tercatat: boolean }>({ aksi: 'minta_buka' });
export const bukaKunciOlehAdmin = (target: string) => panggil<{ dibuka: boolean }>({ aksi: 'buka_kunci', target });

/** Sudah memilih peran dan umur (tulisan pertama terpakai). Dipakai gerbang onboarding di Login. */
export function sudahPilihPeran(appMeta: Record<string, unknown> | undefined): boolean {
  return appMeta?.umur_terkunci === true;
}
