// Tonggak PW · teks layar izin orang tua/wali (manifest Tonggak PW v0.3). Ganti teks di sini, bukan di JSX.
// Teks persetujuan yang dicatat sebagai bukti TIDAK ada di sini: ia tinggal di server
// (supabase/functions/_shared/izinWali.ts) dan dikirim ke laman wali, supaya yang tampil sama dengan yang tercatat.
// Dua varian; VARIAN_AKTIF memakai varian yang sama dengan izinKuliahContent sampai Raihan memilih.
import type { VarianTeks } from '@/data/izinKuliahContent';

export interface TeksWali {
  // sisi siswa
  judulSiswa: string;
  pengantarSiswa: string;
  tombolBuat: string;
  tombolMinta: string;
  pesanWa: (nama: string, tautan: string) => string;
  sudahDikirim: string;
  salinTautan: string;
  tersalin: string;
  aktif: (hubungan: string) => string;
  // sisi orang tua
  sapaan: (namaAnak: string) => string;
  labelNama: string;
  labelHubungan: string;
  hubungan: Record<'ayah' | 'ibu' | 'wali', string>;
  tombolSetuju: string;
  selesai: string;
  simpanKelola: string;
  tautanTidakBerlaku: Record<'tidak_ada' | 'kedaluwarsa' | 'sudah_dipakai', string>;
  galat: Record<string, string>;
  // kelola
  judulKelola: string;
  statusAktif: (tgl: string) => string;
  statusDitarik: (tgl: string) => string;
  tombolTarik: string;
  tarikYakin: string;
  ditarik: string;
}

const GALAT: Record<string, string> = {
  nama_tidak_sah: 'Tulis nama lengkap Anda.',
  hubungan_tidak_sah: 'Pilih hubungan Anda dengan anak.',
  belum_centang: 'Centang pernyataan izin dulu.',
  versi_berubah: 'Keterangan baru saja diperbarui. Muat ulang halaman ini.',
  sudah_ada_izin: 'Orang tuamu sudah memberi izin. Muat ulang halaman ini.',
  terlalu_sering: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.',
  bukan_akun_anak: 'Izin orang tua hanya diperlukan untuk akun di bawah 18 tahun.',
  lainnya: 'Ada gangguan. Coba lagi sebentar lagi.',
};

export const TEKS_WALI: Record<VarianTeks, TeksWali> = {
  A: {
    judulSiswa: 'Biar perjalananmu tidak hilang',
    pengantarSiswa: 'Sekarang isianmu hanya ada di perangkat ini. Kirim tautan ke orang tuamu; begitu mereka mengizinkan, isianmu tersimpan di akunmu dan bisa dibuka dari mana saja.',
    tombolBuat: 'Buat tautan untuk orang tua',
    tombolMinta: 'Kirim ke orang tua lewat WhatsApp',
    pesanWa: (nama, tautan) => `Assalamu'alaikum. ${nama ? nama + ' ' : ''}minta izin supaya isiannya di Sulu (layanan IOU Indonesia untuk mengenali diri dan jalan kuliah) bisa disimpan. Cukup buka tautan ini, baca, lalu centang: ${tautan}`,
    sudahDikirim: 'Tautan berlaku 14 hari dan hanya bisa dipakai sekali.',
    salinTautan: 'Salin tautan',
    tersalin: 'Tautan tersalin.',
    aktif: (h) => `${h} sudah mengizinkan. Isianmu tersimpan di akunmu.`,
    sapaan: (n) => (n ? `${n} meminta izin Anda.` : 'Anak Anda meminta izin Anda.'),
    labelNama: 'Nama lengkap Anda',
    labelHubungan: 'Anda adalah',
    hubungan: { ayah: 'Ayah', ibu: 'Ibu', wali: 'Wali' },
    tombolSetuju: 'Saya mengizinkan',
    selesai: 'Terima kasih. Izin sudah tercatat.',
    simpanKelola: 'Simpan tautan di bawah ini. Lewat tautan ini Anda bisa melihat atau menarik izin kapan saja.',
    tautanTidakBerlaku: {
      tidak_ada: 'Tautan ini tidak dikenal. Minta anak Anda mengirim tautan baru.',
      kedaluwarsa: 'Tautan ini sudah lewat 14 hari. Minta anak Anda mengirim tautan baru.',
      sudah_dipakai: 'Tautan ini sudah dipakai. Bila Anda sudah mengizinkan, tidak perlu melakukan apa pun lagi.',
    },
    galat: GALAT,
    judulKelola: 'Izin penyimpanan di Sulu',
    statusAktif: (t) => `Izin aktif sejak ${t}.`,
    statusDitarik: (t) => `Izin sudah ditarik pada ${t}.`,
    tombolTarik: 'Tarik izin',
    tarikYakin: 'Sesudah ditarik, isian anak Anda tidak lagi disimpan di server. Lanjut?',
    ditarik: 'Izin sudah ditarik.',
  },
  B: {
    judulSiswa: 'Simpan perjalananmu di akun',
    pengantarSiswa: 'Isianmu baru tersimpan di perangkat ini. Minta izin orang tuamu lewat tautan; sesudah diizinkan, isianmu pindah ke akunmu.',
    tombolBuat: 'Minta izin orang tua',
    tombolMinta: 'Buka WhatsApp',
    pesanWa: (nama, tautan) => `Assalamu'alaikum. ${nama ? nama + ' ' : ''}minta izin menyimpan isiannya di Sulu, layanan IOU Indonesia. Silakan buka dan baca dulu: ${tautan}`,
    sudahDikirim: 'Tautan berlaku 14 hari, sekali pakai.',
    salinTautan: 'Salin tautan',
    tersalin: 'Tersalin.',
    aktif: (h) => `Sudah diizinkan ${h.toLowerCase()}. Isianmu tersimpan di akunmu.`,
    sapaan: (n) => (n ? `Izin untuk ${n}` : 'Izin untuk anak Anda'),
    labelNama: 'Nama lengkap',
    labelHubungan: 'Hubungan dengan anak',
    hubungan: { ayah: 'Ayah', ibu: 'Ibu', wali: 'Wali' },
    tombolSetuju: 'Izinkan',
    selesai: 'Izin tercatat. Terima kasih.',
    simpanKelola: 'Simpan tautan ini untuk menarik izin kapan saja.',
    tautanTidakBerlaku: {
      tidak_ada: 'Tautan tidak dikenal. Minta tautan baru dari anak Anda.',
      kedaluwarsa: 'Tautan sudah kedaluwarsa. Minta tautan baru dari anak Anda.',
      sudah_dipakai: 'Tautan sudah dipakai.',
    },
    galat: GALAT,
    judulKelola: 'Kelola izin Sulu',
    statusAktif: (t) => `Aktif sejak ${t}.`,
    statusDitarik: (t) => `Ditarik ${t}.`,
    tombolTarik: 'Tarik izin',
    tarikYakin: 'Isian anak Anda tidak akan disimpan di server lagi. Tarik izin?',
    ditarik: 'Izin ditarik.',
  },
};
