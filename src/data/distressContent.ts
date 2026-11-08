// Tonggak 1 B3b, B4, B6, B10: teks rujukan distress. Semua teks DRAF, menunggu paket
// pilihan Raihan; daftar pemicu (src/lib/distress.ts) menunggu tinjauan Mbak Satwika.
//
// Verifikasi nomor (B4), 8 Nov 2026:
// - https://kesprimkom.kemkes.go.id/konten/158/151/0/cegah-bunuh-diri-dukung-kesehatan-jiwa-kenali-layanan-healing119-id
//   (Kemenkes, 7 Agu 2025): "Hubungi 119 ekstensi 8 dari ponsel Anda", situs https://www.healing119.id/,
//   "disediakan secara gratis", jam layanan "dari pagi hingga malam hari".
// - InfoPublik 19 Des 2025 menyebut "24 jam". Sumber tidak konsisten, jadi jam layanan
//   TIDAK dicantumkan (manifest v0.5 B4). healing119.id tidak bisa dibaca alat (robots), belum dicek langsung.

export type BarisRujukan = {
  id: 'hsa' | 'bk' | 'orangTua' | 'healing119';
  judul: string;
  isi: string;
  telepon?: string;
  situs?: string;
};

export const distressContent = {
  judul: {
    bahaya_langsung: 'DRAF: Kamu tidak sendirian. Ayo cari bantuan sekarang.',
    tanda_berat: 'DRAF: Terima kasih sudah mau cerita',
  },
  pembuka: {
    bahaya_langsung:
      'DRAF: Dari yang kamu tulis, sepertinya kamu sedang dalam keadaan berat atau tidak aman. Sulu bukan tempat yang tepat untuk ini. Orang di bawah ini bisa menemanimu hari ini.',
    tanda_berat:
      'DRAF: Yang kamu rasakan itu penting. Sulu tidak akan melanjutkan percakapan ini dulu, supaya kamu bisa bicara dengan orang yang bisa menemanimu langsung.',
  },
  baris: {
    hsa: {
      id: 'hsa',
      judul: 'DRAF: Tim HSA IOU',
      isi: 'DRAF: kontak HSA menunggu',
    },
    bk: {
      id: 'bk',
      judul: 'DRAF: Guru BK atau wali kelas',
      isi: 'DRAF: Ceritakan ke Guru BK atau wali kelasmu hari ini. Kamu boleh bilang, "Saya sedang tidak baik-baik saja dan butuh bicara."',
    },
    orangTua: {
      id: 'orangTua',
      judul: 'DRAF: Orang tua atau orang dewasa tepercaya',
      isi: 'DRAF: Bicaralah dengan orang tua, kakak, saudara, guru ngaji, atau orang dewasa lain yang kamu percaya.',
    },
    healing119: {
      id: 'healing119',
      judul: 'Healing119 Kemenkes',
      isi: 'DRAF: Layanan dukungan kesehatan jiwa dari Kementerian Kesehatan. Gratis.',
      telepon: '119 ekstensi 8',
      situs: 'healing119.id',
    },
  } satisfies Record<string, BarisRujukan>,
  labelTelepon: 'DRAF: Telepon',
  labelSitus: 'DRAF: Situs',
  tautanPenjelasan: 'DRAF: Bagaimana Sulu menangani ini?',
  tombolTutup: 'DRAF: Tutup',

  /** B10: halaman publik /bila-tidak-baik-baik-saja. */
  halaman: {
    judul: 'DRAF: Bila kamu sedang tidak baik-baik saja',
    pengantar:
      'DRAF: Sulu adalah teman refleksi untuk belajar dan karier. Sulu bukan konselor dan tidak bisa menolong dalam keadaan darurat. Halaman ini menjelaskan apa yang Sulu lakukan kalau tulisanmu menunjukkan kamu sedang berat.',
    bagian: [
      {
        judul: 'DRAF: Apa yang Sulu perhatikan',
        isi: 'DRAF: Sebelum tulisanmu dikirim ke AI, Sulu memeriksa apakah ada kata atau kalimat yang menunjukkan kamu ingin menyakiti diri, sedang disakiti orang lain, merasa tidak aman, atau merasa putus asa. Kalau ada, tulisanmu tidak dikirim ke AI.',
      },
      {
        judul: 'DRAF: Apa yang terjadi sesudahnya',
        isi: 'DRAF: Sulu berhenti dari tugasnya dan menampilkan daftar orang dan layanan yang bisa kamu hubungi. AI juga diberi perintah untuk berhenti dan hanya menampilkan daftar yang sama bila ia melihat tanda serupa.',
      },
      {
        judul: 'DRAF: Apa yang tidak disimpan',
        isi: 'DRAF: Tulisanmu pada saat itu tidak disimpan. Sulu hanya mencatat bahwa pemeriksaan ini pernah menyala, kapan, dan di fitur mana, tanpa isi tulisan dan tanpa namamu.',
      },
      {
        judul: 'DRAF: Ke mana Sulu merujuk',
        isi: 'DRAF: Guru BK atau wali kelas, orang tua atau orang dewasa yang kamu percaya, dan Healing119 Kemenkes. Untuk mahasiswa IOU, Tim HSA IOU ditampilkan lebih dulu.',
      },
      {
        judul: 'DRAF: Pemeriksaan ini tidak sempurna',
        isi: 'DRAF: Sulu bisa keliru, baik terlalu cepat menyala maupun terlewat. Kalau kamu merasa tidak aman, jangan menunggu Sulu. Hubungi orang di daftar ini sekarang.',
      },
    ],
    judulDaftar: 'DRAF: Orang dan layanan yang bisa kamu hubungi',
    kembali: 'DRAF: Kembali ke Sulu',
  },
} as const;

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
