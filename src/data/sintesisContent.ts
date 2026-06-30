export const sintesisContent = {
  ui: {
    pageTitle: "Sintesis",
    triangleSectionTitle: "Titik Temu",
    refleksiSectionTitle: "Satu Pertanyaan Terakhir",
    penutupSectionTitle: "Sebelum Kamu Melangkah",
    saveLabel: "Simpan",
    savedToast: "Catatan tersimpan ✓",
    errorToast: "Gagal menyimpan, coba lagi",
  },

  pembuka:
    "Kamu sudah melewati perjalanan yang panjang: mengenali nikmat yang kamu miliki, menimbang kemampuan yang sedang kamu bangun, dan melihat kebutuhan di sekitar yang memanggilmu.\n\nSekarang, coba berhenti sejenak dan lihat kembali semuanya dalam satu pandangan.\n\nApa yang kamu temukan di sini bukan jawaban akhir, melainkan cermin. Dari sini, arahmu akan terasa lebih jelas.",

  triangle: {
    framing:
      "Jalan yang ideal biasanya lahir dari pertemuan beberapa hal: apa yang kamu minati, kemampuan yang kamu miliki, nilai yang kamu pegang, dan kebutuhan nyata yang ingin kamu jawab.\n\nTidak satu pun berdiri sendiri. Minat tanpa kemampuan hanya angan, kemampuan tanpa nilai mudah kehilangan arah, dan semuanya terasa hampa bila belum menemukan tempat untuk memberi manfaat.\n\nDi titik temu keempatnya, jalanmu mulai terbentuk.",
    dimensi: {
      minat: { label: "Minat yang sedang kamu eksplor", cue: "Titik awal, bukan vonis" },
      kemampuan: { label: "Kemampuan", cue: "Yang ingin kamu kuatkan" },
      nilai: { label: "Nilai", cue: "Yang menjadi fondasimu" },
      bakti: { label: "Jalan Bakti", cue: "Tempatmu memberi manfaat" },
    },
    emptyState: {
      minat: "Minatmu akan terpetakan lebih jelas saat Asesmen Minat dibuka. Untuk sekarang, anggap ini ruang yang sedang kamu jelajahi, bukan kotak yang harus segera kamu isi.",
      kemampuan: "Kamu belum menandai kemampuan yang ingin kamu kuatkan.",
      nilai: "Kamu belum menuliskan fondasimu di tahap mengenali diri.",
      bakti: "Kamu belum menandai jalan baktimu.",
    },
  },

  refleksiLima:
    "Jika lima tahun dari sekarang kamu mencapai karier yang kamu impikan, skill apa yang paling berperan membawa kamu ke sana?",
  refleksiPlaceholder: "Tulis sebebasnya...",

  penutup: {
    teks:
      "Apa pun jalan yang kamu pilih nanti, baik teknologi, kesehatan, pendidikan, maupun bisnis, ada fondasi yang mendahuluinya. Mengenal Allah dan menegakkan ibadah adalah kewajiban pertama, fardhu ain yang tidak tergantikan. Setelah itu, keahlian duniawi yang kamu tekuni menjadi jalan menunaikan fardhu kifayah, selama diniatkan untuk kebaikan.\n\nPada akhirnya, yang bertahan bukan yang paling ramai atau paling tinggi, melainkan yang memberi manfaat bagi banyak orang. Studi karier modern, yang kamu temui di awal perjalanan ini, menunjuk ke arah yang sama.",
    ayatArab:
      "فَأَمَّا ٱلزَّبَدُ فَيَذۡهَبُ جُفَآءٗۖ وَأَمَّا مَا يَنفَعُ ٱلنَّاسَ فَيَمۡكُثُ فِى ٱلۡأَرۡضِ",
    ayatTerjemah:
      "Adapun buih, akan hilang sebagai sesuatu yang tidak berguna; tetapi yang memberi manfaat kepada manusia, akan tetap di bumi.",
    ayatRujukan: "QS Ar-Ra'd: 17",
  },
} as const;
