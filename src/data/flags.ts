// Tonggak 1 (lantai keselamatan): sakelar fitur sisi klien.
// A5: ASESMEN_TERBUKA hanya dinyalakan oleh Raihan, sesudah tinjauan tertulis
// Mbak Satwika atas paket instrumen (Tonggak 3). Tidak ada orang atau
// proses lain yang boleh mengubah nilainya ke true. Setiap perubahan nilai
// harus lewat PR yang ditinjau Raihan dan tercatat di LOG-SESI.
// Catatan: flag ini hanya di sisi klien. Penulisan ke tabel asesmen di
// database tetap terbuka bagi pengguna login (ditutup di gelombang lain).

/** Asesmen psikometrik (Spine A). Mati = semua pintu ke asesmen tertutup. */
export const ASESMEN_TERBUKA = false;

/**
 * Asesmen untuk akun dewasa (umur 18+ tercatat server), misalnya mahasiswa IOU (KEPUTUSAN 6 Jul).
 * Siswa di bawah 18 dan tamu tetap tertutup. Admin selalu bisa masuk untuk peninjauan (lihat lib/aksesAsesmen.ts).
 * Hanya dinyalakan Raihan, sesudah tinjauan SME atas paket instrumen.
 */
export const ASESMEN_DEWASA_TERBUKA = false;

/** Halaman hasil publik /hasil/:resultId. Mati = pemberitahuan saja. */
export const HASIL_PUBLIK_TERBUKA = false;

/** Awal Spine B: tujuan pengalihan saat asesmen tertutup. */
export const SPINE_B_AWAL = '/kenali-dirimu';

/** E15: aside dalil Al-Anfal 60 di /rencana-aksi. Tersembunyi sampai Raihan menyetujui terjemahnya. */
export const DALIL_ANFAL_60_TERBUKA = false;

/** E17: tombol "Bagikan ke Orang Tua (WA)" di /ringkasan. Tersembunyi (PAD 11.3); diganti tautan Proposal Diri di Tonggak 2. */
export const BAGIKAN_ORANG_TUA_TERBUKA = false;

/** Tonggak 2b A1: kartu kebutuhan daerah bersumber di Jalan Bakti. Dipasang atas perintah Raihan 16 Nov 2026 17.46. Mati = blok kartu tidak tampil; isi lain tidak berubah. */
export const KARTU_DAERAH_TERBUKA = true;
