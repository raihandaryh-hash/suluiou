// Tonggak 1: teks sementara. Semua teks di sini adalah DRAF dan menunggu
// paket pilihan Raihan. Jangan di-merge sebagai teks akhir.

export const keselamatanContent = {
  /** A6: pemberitahuan di /hasil/:resultId saat HASIL_PUBLIK_TERBUKA mati. */
  hasilPublikJudul: 'Halaman hasil ini sedang tidak tersedia',
  hasilPublikIsi: 'Tautan hasil yang dibagikan sedang ditutup sementara. Pemilik hasil tetap bisa membukanya setelah masuk ke akunnya.',
  hasilPublikTombol: 'Kembali ke Sulu',

  /** B2a: state galat saat AI gagal atau dimatikan. */
  aiGalatJudul: 'Bagian ini belum bisa dimuat',
  aiGalatIsi: 'Fitur AI sedang tidak tersedia. Bagian lain dari halaman ini tetap bisa kamu pakai.',
  aiGalatCobaLagi: 'Coba lagi',
  /** Server menjawab 503 asesmen_tertutup: tanpa tombol "Coba lagi". */
  asesmenDitutupJudul: 'Bagian ini ditutup sementara',
  asesmenDitutupIsi: 'Bagian ini ditutup sementara, jadi belum bisa dimuat. Mencoba lagi tidak akan membantu untuk saat ini. Bagian lain dari halaman ini tetap bisa kamu pakai.',

  /** Slide terakhir /suar saat ASESMEN_TERBUKA mati: tautan ke awal Spine B. */
  suarLanjutSpineB: 'Lanjut ke Kenali Dirimu',

  /** C1: keterangan non-diagnostik di halaman hasil. */
  nonDiagnostik: 'Hasil ini adalah gambaran awal dari jawabanmu, bukan diagnosis dan bukan penilaian psikologis resmi.',

  /** E7, E13: pengganti kalimat validasi di waitlist. */
  segeraHadir: 'Segera Hadir',

  /** E21: keterangan data provinsi. */
  gambaranAwal: 'Gambaran awal',
  /** Waktu muat Spine B (23 Nov): teks di bawah pemutar. */
  memuatHalaman: 'Menyiapkan halamanmu…',
} as const;
