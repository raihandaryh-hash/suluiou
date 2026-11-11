// Tonggak 1: teks sementara. Semua teks di sini adalah DRAF dan menunggu
// paket pilihan Raihan. Jangan di-merge sebagai teks akhir.

export const keselamatanContent = {
  /** A6: pemberitahuan di /hasil/:resultId saat HASIL_PUBLIK_TERBUKA mati. */
  hasilPublikJudul: 'DRAF: Halaman hasil ini sedang tidak tersedia',
  hasilPublikIsi: 'DRAF: Tautan hasil yang dibagikan sedang ditutup sementara. Pemilik hasil tetap bisa membukanya setelah masuk ke akunnya.',
  hasilPublikTombol: 'DRAF: Kembali ke Sulu',

  /** B2a: state galat saat AI gagal atau dimatikan. */
  aiGalatJudul: 'DRAF: Bagian ini belum bisa dimuat',
  aiGalatIsi: 'DRAF: Fitur AI sedang tidak tersedia. Bagian lain dari halaman ini tetap bisa kamu pakai.',
  aiGalatCobaLagi: 'DRAF: Coba lagi',
  /** Server menjawab 503 asesmen_tertutup: tanpa tombol "Coba lagi". */
  asesmenDitutupJudul: 'DRAF: Bagian ini ditutup sementara',
  asesmenDitutupIsi: 'DRAF: Bagian ini ditutup sementara, jadi belum bisa dimuat. Mencoba lagi tidak akan membantu untuk saat ini. Bagian lain dari halaman ini tetap bisa kamu pakai.',

  /** Slide terakhir /suar saat ASESMEN_TERBUKA mati: tautan ke awal Spine B. */
  suarLanjutSpineB: 'DRAF: Lanjut ke Kenali Dirimu',

  /** C1: keterangan non-diagnostik di halaman hasil. */
  nonDiagnostik: 'DRAF: Hasil ini adalah gambaran awal dari jawabanmu, bukan diagnosis dan bukan penilaian psikologis resmi.',

  /** E7, E13: pengganti kalimat validasi di waitlist. */
  segeraHadir: 'DRAF: Segera Hadir',

  /** E21: keterangan data provinsi. */
  gambaranAwal: 'DRAF: Gambaran awal',
} as const;
