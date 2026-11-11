// Teks izin per tujuan dan jalur tarik (manifest Persetujuan dan Jalur Tarik v0.2, disetujui Raihan 11 Nov 15.52).
// Varian A = pilihan Raihan 11 Nov 16.14; B disimpan sebagai riwayat. VARIAN_AKTIF menentukan yang tampil. Ganti teks di sini, bukan di JSX.
// Setiap perubahan teks P1/P2 wajib menaikkan versinya, karena versi disimpan bersama izin.

export type VarianTeks = 'A' | 'B';
export const VARIAN_AKTIF: VarianTeks = 'A';

export const TEKS_IZIN = {
  A: {
    // Dipilih Raihan 11 Nov 16.14 (gabungan baris).
    judul: 'Mau ngobrol soal kuliah di IOU?',
    pengantar: 'Centang hanya yang kamu setujui.',
    umur: 'Saya berumur 18 tahun atau lebih',
    p1: { versi: 'p1-A-2026-11-11', teks: 'Saya ingin dihubungi IOU soal kuliah' },
    p2: {
      versi: 'p2-A-2026-11-11',
      teks: 'Hasil asesmen saya boleh dipakai untuk menentukan program IOU yang paling relevan untuk ditawarkan kepada saya',
    },
    simpan: 'Simpan',
    tersimpan: 'Tersimpan. Izin ini bisa kamu cabut kapan saja.',
    cabut: 'Cabut izin',
    dicabut: 'Izin dicabut.',
  },
  B: {
    judul: 'Tertarik kuliah di IOU?',
    pengantar: 'Centang hanya yang kamu setujui. Tanpa centang, tidak ada yang menghubungimu.',
    umur: 'Saya berumur 18 tahun atau lebih',
    p1: { versi: 'p1-B-2026-11-11', teks: 'Saya ingin dihubungi IOU soal kuliah' },
    p2: {
      versi: 'p2-B-2026-11-11',
      teks: 'Hasil asesmen saya boleh dipakai untuk menentukan program IOU yang paling relevan untuk ditawarkan kepada saya',
    },
    simpan: 'Simpan',
    tersimpan: 'Tersimpan. Izin ini bisa kamu cabut kapan saja.',
    cabut: 'Cabut izin',
    dicabut: 'Izin dicabut.',
  },
} as const;

export const TEKS_TARIK = {
  A: {
    // Dipilih Raihan 11 Nov 16.14.
    judul: 'Mau tanya soal kuliah?',
    pengantar: 'Tanya langsung ke tim IOU. Kamu yang memulai obrolan, dan Sulu tidak menyimpan nomormu.',
    tombol: 'Tanya soal kuliah di IOU',
  },
  B: {
    judul: 'Mau tanya soal kuliah?',
    pengantar: 'Tim IOU siap menjawab pertanyaanmu. Mereka tidak akan menghubungimu lebih dulu.',
    tombol: 'Tanya soal kuliah di IOU',
  },
} as const;

/**
 * Kanal resmi penerimaan IOU Indonesia (EduAdvisor). Sumber: linktr.ee/iou.indonesia dan kaki situs
 * bahasa.iou.edu.gm, dibaca 11 Nov 2026 15.50 WIB. Raihan diminta mengoreksi bila Instagram memuat nomor lebih baru.
 */
export const KANAL_PENERIMAAN = [
  { label: 'EduAdvisor Ikhwan', nomorWa: '6287784411000' },
  { label: 'EduAdvisor Akhwat', nomorWa: '6282125351100' },
] as const;
