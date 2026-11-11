// Logika murni izin per tujuan dan jalur tarik (manifest Persetujuan dan Jalur Tarik v0.2).
import type { IzinSkor } from './leadScoring';

export type AlurIzin = 'dewasa' | 'tarik';

/**
 * Alur yang dipakai:
 * - tamu (sesi kelas atau tanpa akun) selalu diperlakukan sebagai anak → jalur tarik;
 * - pengguna masuk dengan jalur mahasiswa IOU → dewasa;
 * - pengguna masuk lain → dewasa hanya bila menyatakan 18+, selain itu jalur tarik.
 */
export function tentukanAlur(opsi: { masuk: boolean; jalurMahasiswa: boolean; menyatakan18: boolean }): AlurIzin {
  if (!opsi.masuk) return 'tarik';
  if (opsi.jalurMahasiswa || opsi.menyatakan18) return 'dewasa';
  return 'tarik';
}

/** P2 tidak berlaku tanpa P1. */
export function normalkanIzin(izin: IzinSkor): IzinSkor {
  return { dihubungi: izin.dihubungi, hasilUntukTawaran: izin.dihubungi && izin.hasilUntukTawaran };
}

/**
 * Tautan WhatsApp jalur tarik. Pesan awal hanya memuat program pilihan pengguna sendiri, tanpa hasil asesmen,
 * nama, atau data lain. Tidak ada yang ditulis ke basis data.
 */
export function tautanTarik(nomorWa: string, programDipilih: string[]): string {
  const daftar = programDipilih.filter(Boolean).slice(0, 3);
  const pesan = daftar.length
    ? `Assalamu'alaikum, saya ingin bertanya soal kuliah di IOU, terutama program ${daftar.join(', ')}.`
    : `Assalamu'alaikum, saya ingin bertanya soal kuliah di IOU.`;
  return `https://wa.me/${nomorWa.replace(/\D/g, '')}?text=${encodeURIComponent(pesan)}`;
}
