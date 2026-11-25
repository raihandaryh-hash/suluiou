// Teks Profil Awal asesmen, dua varian pembaca.
// Asesmen kini untuk akun dewasa dan peninjau (KEPUTUSAN 6 Jul "asesmen itu untuk mahasiswa yang sudah tak berisiko
// identity foreclosure"); varian siswa dipertahankan untuk saat asesmen dibuka bagi semua (Spine A "tetap ada", 25 Jul).
// SINTESIS Chief Sulu 25 Nov: rumusan varian dewasa, menunggu tinjauan Raihan.

export const profilSiswa = {
  kodeKelasPetunjuk: 'Isi kalau dapat kode dari gurumu. Kosongkan kalau ikut sendiri.',
  keyakinanLabel: 'Seberapa yakin kamu dengan pilihan studi setelah lulus nanti?',
  keyakinanOpsi: ['Sudah tahu mau ke mana', 'Masih bingung', 'Belum kepikiran sama sekali'],
  pendidikanLabel: 'Setelah SMA/SMK/MA, kamu berencana melanjutkan ke mana?',
  pendidikanOpsi: ['D3 (Diploma 3)', 'S1 (Sarjana)', 'Belum tahu'],
  aspirasiLabel: 'Apa cita-cita atau bayangan masa depanmu?',
};

export const profilDewasa = {
  kodeKelasPetunjuk: 'Isi kalau dapat kode dari pengajar atau fasilitatormu. Kosongkan kalau ikut sendiri.',
  keyakinanLabel: 'Seberapa yakin kamu dengan arah studi atau kariermu saat ini?',
  keyakinanOpsi: ['Sudah cukup yakin', 'Masih menimbang beberapa arah', 'Belum punya gambaran'],
  pendidikanLabel: 'Di jenjang mana kamu sekarang?',
  pendidikanOpsi: ['Sedang kuliah D3 atau S1', 'Sudah lulus D3 atau S1', 'Sedang atau ingin lanjut S2', 'Tidak sedang kuliah'],
  aspirasiLabel: 'Apa yang ingin kamu bangun atau kerjakan beberapa tahun ke depan?',
};
