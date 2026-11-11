// Tonggak 2a · mode perangkat (manifest v0.6 B.2, C.3, C.7).
// Pengguna yang belum berizin menyimpan semua datanya hanya di perangkat ini. Server menolak tulisannya
// (policy restriktif boleh_simpan), jadi klien memutuskan lebih dulu supaya tidak ada galat yang terlihat.
import { supabase } from '@/integrations/supabase/client';

const AWALAN = 'sulu.perangkat.v1.';
export const KEDALUWARSA_MS = 30 * 24 * 60 * 60 * 1000; // 30 hari sejak terakhir dibuka (C.7)
const CEK_ULANG_MS = 5 * 60 * 1000;

interface Simpanan<T> { data: T; disentuh: number }

let cache: { uid: string | null; boleh: boolean; pada: number } | null = null;

/** Apakah akun pemanggil boleh menyimpan di server. Tamu dan kegagalan → false (gagal tertutup). */
export async function bolehSimpan(paksa = false): Promise<boolean> {
  const { data: u } = await supabase.auth.getUser();
  const uid = u.user?.id ?? null;
  if (!uid) return false;
  if (!paksa && cache && cache.uid === uid && Date.now() - cache.pada < CEK_ULANG_MS) return cache.boleh;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc('boleh_simpan', { p_uid: uid });
  const boleh = !error && data === true;
  cache = { uid, boleh, pada: Date.now() };
  return boleh;
}

export function lupakanCacheIzin() { cache = null; }

function kunci(nama: string, pemilik: string) { return `${AWALAN}${nama}.${pemilik}`; }

export function bacaPerangkat<T>(nama: string, pemilik: string): T | null {
  try {
    const mentah = localStorage.getItem(kunci(nama, pemilik));
    if (!mentah) return null;
    const s = JSON.parse(mentah) as Simpanan<T>;
    if (Date.now() - s.disentuh > KEDALUWARSA_MS) { localStorage.removeItem(kunci(nama, pemilik)); return null; }
    // menyentuh memperpanjang masa simpan
    localStorage.setItem(kunci(nama, pemilik), JSON.stringify({ data: s.data, disentuh: Date.now() }));
    return s.data;
  } catch { return null; }
}

export function tulisPerangkat<T>(nama: string, pemilik: string, data: T) {
  try { localStorage.setItem(kunci(nama, pemilik), JSON.stringify({ data, disentuh: Date.now() } satisfies Simpanan<T>)); } catch { /* penuh */ }
}

/** Tombol "Hapus dari perangkat ini" (C.7): semua data Sulu mode perangkat ikut terhapus. */
export function hapusSemuaDariPerangkat() {
  try {
    const hapus: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith(AWALAN) || k.startsWith('sulu.progressBackup.') || k === 'sulu.studentSession.v1' || k === 'sulu.assessmentComplete.v1')) hapus.push(k);
    }
    hapus.forEach((k) => localStorage.removeItem(k));
  } catch { /* abaikan */ }
}

/** Buang kedaluwarsa saat aplikasi dimuat. */
export function sapuKedaluwarsa() {
  try {
    const kunciList: string[] = [];
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k?.startsWith(AWALAN)) kunciList.push(k); }
    for (const k of kunciList) {
      try { const s = JSON.parse(localStorage.getItem(k) || 'null'); if (!s || Date.now() - s.disentuh > KEDALUWARSA_MS) localStorage.removeItem(k); }
      catch { localStorage.removeItem(k); }
    }
  } catch { /* abaikan */ }
}

/**
 * Bersihkan nomor HP lama dari penyimpanan perangkat (B.1): sesi tamu lama memuat `phone` dan pengenal
 * `guest_<HP>_<KODE>`; cadangan progres memakai nama kunci yang sama. Semua dibuang, tidak dipindah.
 */
export function bersihkanHpLama() {
  const POLA_HP = /guest_\d{6,}/;
  for (const simpan of [localStorage, sessionStorage]) {
    try {
      const buang: string[] = [];
      for (let i = 0; i < simpan.length; i++) {
        const k = simpan.key(i);
        if (!k) continue;
        if (POLA_HP.test(k)) { buang.push(k); continue; }
        if (k === 'sulu.studentSession.v1') {
          const v = simpan.getItem(k) || '';
          if (/"phone"/.test(v) || POLA_HP.test(v)) buang.push(k);
        }
      }
      buang.forEach((k) => simpan.removeItem(k));
    } catch { /* abaikan */ }
  }
}

// ===== Tabel fase (Kenali Diri, Jalan Bakti, Sintesis, Rencana Aksi) =====
export type TabelFase = 'phase_2a_inventory' | 'phase_2b_skills' | 'phase_3_jalan_bakti' | 'phase_4_sintesis' | 'phase_5_action_plan';
export const TABEL_FASE: TabelFase[] = ['phase_2a_inventory', 'phase_2b_skills', 'phase_3_jalan_bakti', 'phase_4_sintesis', 'phase_5_action_plan'];

/** Baca data fase: server bila berizin, perangkat bila tidak. Bentuk keluaran sama dengan `.select('data').maybeSingle()`. */
export async function bacaFase(tabel: TabelFase, userId: string): Promise<{ data: { data: unknown } | null }> {
  if (await bolehSimpan()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any).from(tabel).select('data').eq('user_id', userId).maybeSingle();
    return { data: data ?? null };
  }
  const d = bacaPerangkat<unknown>(tabel, userId);
  return { data: d === null ? null : { data: d } };
}

export async function simpanFase(tabel: TabelFase, userId: string, data: unknown): Promise<{ error: { message: string } | null }> {
  if (await bolehSimpan()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from(tabel).upsert({ user_id: userId, data, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    return { error: error ?? null };
  }
  tulisPerangkat(tabel, userId, data);
  return { error: null };
}

/** Sesudah aktivasi kode peserta (B.3): unggah data fase perangkat ke akun, lalu hapus dari perangkat. */
export async function unggahPerangkatKeAkun(userId: string): Promise<number> {
  lupakanCacheIzin();
  if (!(await bolehSimpan(true))) return 0;
  let n = 0;
  for (const t of TABEL_FASE) {
    const d = bacaPerangkat<unknown>(t, userId);
    if (d === null) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from(t).upsert({ user_id: userId, data: d, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    if (!error) { try { localStorage.removeItem(kunci(t, userId)); } catch { /* */ } n++; }
  }
  return n;
}

/** Tamu yang lalu masuk Google: data perangkat pindah dari pengenal tamu ke akun (tetap di perangkat). */
export function pindahPemilikPerangkat(dari: string, ke: string) {
  try {
    const pindah: [string, string][] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith(AWALAN) && k.endsWith('.' + dari)) pindah.push([k, k.slice(0, -dari.length) + ke]);
      if (k === `sulu.progressBackup.guest_${dari}`) pindah.push([k, `sulu.progressBackup.user_${ke}`]);
    }
    for (const [a, b] of pindah) { const v = localStorage.getItem(a); if (v !== null) localStorage.setItem(b, v); localStorage.removeItem(a); }
  } catch { /* abaikan */ }
}
