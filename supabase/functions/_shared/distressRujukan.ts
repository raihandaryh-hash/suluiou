// Tonggak 1 B3a/B9: salinan server dari teks rujukan polos di src/data/distressContent.ts.
// Edge function tidak bisa mengimpor dari src/, jadi blok di bawah disalin persis;
// scripts/cek-distress-sinkron.mjs menggagalkan build bila keduanya berbeda.
// Semua teks DRAF, menunggu paket pilihan Raihan dan tinjauan Mbak Satwika.
// Nomor diverifikasi: lihat komentar sumber di src/data/distressContent.ts.

// MULAI RUJUKAN_POLOS
/** Teks rujukan polos (tanpa format) untuk balasan server dan arahan lapis kedua B9.
 *  Blok ini harus identik dengan blok yang sama di pasangannya; dicek scripts/cek-distress-sinkron.mjs. */
export const RUJUKAN_POLOS = {
  bahaya_langsung:
    "DRAF: Terima kasih sudah mau cerita. Keselamatanmu yang paling penting sekarang. Hubungi Healing119 Kemenkes di telepon 119 ekstensi 8 (healing119.id), gratis. Bicaralah juga hari ini dengan Guru BK atau wali kelas, dan dengan orang tua atau orang dewasa yang kamu percaya. Kalau kamu dalam bahaya saat ini, pergilah ke dekat orang lain dan minta tolong.",
  tanda_berat:
    "DRAF: Terima kasih sudah mau cerita. Yang kamu rasakan itu penting, dan kamu tidak perlu menanggungnya sendiri. Coba bicara hari ini dengan Guru BK atau wali kelas, atau dengan orang tua atau orang dewasa yang kamu percaya. Kamu juga bisa menghubungi Healing119 Kemenkes di telepon 119 ekstensi 8 (healing119.id), gratis.",
} as const;
// AKHIR RUJUKAN_POLOS
