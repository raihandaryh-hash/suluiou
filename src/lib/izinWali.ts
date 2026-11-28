// Tonggak PW · klien fungsi izin-wali. Aksi orang tua berjalan tanpa akun.
import { supabase } from '@/integrations/supabase/client';

export interface TeksIzinServer { judul: string; butir: string[]; centang: string }
export type KeadaanTautan = 'sah' | 'tidak_ada' | 'kedaluwarsa' | 'sudah_dipakai';

async function panggil<T>(isi: Record<string, unknown>): Promise<{ data: T | null; galat: string | null }> {
  const { data, error } = await supabase.functions.invoke('izin-wali', { body: isi });
  if (error) {
    let galat = 'lainnya';
    try { const j = await (error as { context?: Response }).context?.json(); if (j?.galat) galat = String(j.galat); } catch { /* */ }
    return { data: null, galat };
  }
  return { data: data as T, galat: null };
}

export const buatTautanWali = () => panggil<{ token: string; berlaku_sampai: string }>({ aksi: 'buat' });
export const statusIzinWali = () => panggil<{ aktif: boolean; diberikan_pada: string | null; hubungan: 'ayah' | 'ibu' | 'wali' | null }>({ aksi: 'status' });
export const lihatTautanWali = (token: string) =>
  panggil<{ keadaan: KeadaanTautan; nama_anak?: string; teks?: TeksIzinServer; teks_versi?: string }>({ aksi: 'lihat', token });
export const setujuIzinWali = (p: { token: string; nama: string; hubungan: string; centang: boolean; teks_versi: string }) =>
  panggil<{ kelola: string }>({ aksi: 'setuju', ...p });
export const kelolaIzinWali = (kelola: string) =>
  panggil<{ aktif: boolean; diberikan_pada: string; dicabut_pada: string | null; hubungan: string }>({ aksi: 'kelola', kelola });
export const tarikIzinWali = (kelola: string) => panggil<{ ditarik: boolean }>({ aksi: 'tarik', kelola });

export function tautanIzin(token: string, asal = window.location.origin) { return `${asal}/izin-orang-tua/${token}`; }
export function tautanKelola(kode: string, asal = window.location.origin) { return `${asal}/izin-orang-tua/kelola/${kode}`; }
export function tanggalId(iso: string) {
  try { return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return iso; }
}
