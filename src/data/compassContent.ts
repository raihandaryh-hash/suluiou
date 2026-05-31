export const compassHero = {
  tag: 'KENALI DIRIMU',
  headline: 'Data tentang dunia sudah kamu baca.\nSekarang, data tentang dirimu.',
  subtext:
    'Empat perspektif dari empat ahli — untuk membantu kamu menemukan posisimu dalam peta yang sudah kamu lihat.',
};

export type CompassSection = {
  id: string;
  day: string;
  date: string;
  speaker: string;
  role: string;
  tag: string;
  headline: string;
  body: string;
  questions: string[];
  keyInsight: string;
  color: 'navy' | 'gold' | 'teal' | 'blue';
  assessmentNote?: string;
};

export const compassSections: CompassSection[] = [
  {
    id: 'realita',
    day: 'Perspektif 1',
    date: '3 Juni 2026',
    speaker: 'Evan Indrawijaya, S.E., M.B.A.',
    role: 'Operations Director IOU Indonesia. Sebelumnya: HR Director Danone, Pfizer, Kimberly-Clark Indonesia selama 30 tahun.',
    tag: 'REALITA DUNIA KERJA',
    headline: 'Saya sudah mewawancarai ribuan kandidat.\nIni yang saya benar-benar cari.',
    body: `Tiga puluh tahun duduk di kursi yang memutuskan siapa yang diterima dan siapa yang tidak mengajarkan satu hal: gelar adalah tiket masuk, bukan paspor kesuksesan.

Yang paling sering membedakan kandidat yang berhasil bukan IPK-nya. Bukan nama universitasnya. Tapi ini: apakah ia tahu siapa dirinya, apa yang ia bawa, dan ke mana ia mau pergi — dan bisa menjelaskannya dengan jelas.

Dunia kerja sedang berubah struktural. 57,95 persen tenaga kerja Indonesia tidak punya kontrak formal. Sektor yang dulu stabil sekarang bergerak lebih cepat dari yang bisa diantisipasi. Dalam kondisi ini, satu-satunya aset yang tidak bisa diambil siapapun adalah kemandirian yang tumbuh dari pemahaman diri yang dalam.

Kemandirian bukan motivasi. Ini adalah kumpulan kemampuan konkret: belajar hal baru tanpa ada yang membimbing, menyelesaikan masalah dengan sumber daya yang terbatas, tetap produktif ketika tidak ada yang memotivasi dari luar, dan menciptakan nilai meski tidak ada deskripsi kerja yang jelas.`,
    questions: [
      'Kalau besok kamu diwawancarai oleh seorang HR Director — bukan ditanya nilai, tapi ditanya "ceritakan pengalaman di mana kamu harus menyelesaikan sesuatu sendiri, tanpa pengawasan, dan berhasil" — apa jawabanmu?',
      'Skill apa yang kamu miliki sekarang yang bisa kamu tunjukkan kepada orang lain, bukan hanya diceritakan?',
    ],
    keyInsight:
      'Kemandirian bukan karakter yang bagus untuk dimiliki. Ini satu-satunya survival strategy yang bisa kamu kontrol — dan dimulai dari mengenal diri sendiri.',
    color: 'navy',
  },
  {
    id: 'akar',
    day: 'Perspektif 2',
    date: '4 Juni 2026',
    speaker: 'Mochammad Hilman Al Fiqhy, M.A.',
    role: 'Dosen IOU, Kepala Labschool Tarbiyah Sunnah, Direktur Bidang Pendidikan Yayasan Tarbiyah Sunnah.',
    tag: 'AKAR: NILAI DAN IDENTITAS',
    headline: 'Barangsiapa mengenal Allah, ia akan mengenal dirinya.',
    body: `Allah berfirman dalam QS Al-Isra: 84 bahwa setiap orang berbuat sesuai dengan pembawaan (syakilah) masing-masing. Ini bukan sekadar ayat tentang perbedaan — ini adalah pernyataan teologis bahwa setiap manusia diciptakan dengan nature yang unik, dan Allah yang paling mengetahui jalur terbaik untuknya.

Dalam QS Ar-Ra'd: 11, Allah menegaskan bahwa perubahan dimulai dari dalam diri. Kemandirian yang dibutuhkan dunia kerja era ini tidak bisa berdiri tanpa akar nilai yang tidak goyah ketika dunia berubah.

Krisis identitas yang dialami banyak generasi muda bukan hanya masalah psikologi — ini juga masalah jarak dari sumber pengenalan diri yang paling dalam. Mengenal Allah adalah asal dari mengenal diri, yang adalah asal dari mengenal dunia.

Pohon yang baik punya akar yang kokoh sebelum bisa menghasilkan buah yang berkelanjutan. Kemandirian tanpa nilai adalah kebebasan tanpa arah.`,
    questions: [
      'Nilai apa — yang berakar dari keyakinanmu — yang tidak akan kamu kompromikan sekalipun itu berarti kehilangan kesempatan?',
      'Siapa versi dirimu yang paling kamu kagumi? Apa yang ia miliki yang hari ini belum sepenuhnya kamu miliki?',
    ],
    keyInsight:
      'Pohon yang baik punya akar yang kokoh (QS Ibrahim: 24-25). Sebelum memilih cabang mana yang akan kamu kembangkan, pastikan akarnya kuat.',
    color: 'gold',
  },
  {
    id: 'cabang',
    day: 'Perspektif 3',
    date: '5 Juni 2026',
    speaker: 'Dillo Augustdi Putra, S.Psi., M.Psi., Psikolog',
    role: 'Dosen Psikologi IOU Indonesia.',
    tag: 'CABANG: POTENSI DAN SKILL',
    headline: 'Kamu tidak "tidak punya kelebihan".\nKamu belum menggalinya.',
    body: `Dari perspektif psikologi, kebingungan karier bukan karena kurang pintar atau kurang mau berusaha. Ini karena kurangnya self-awareness yang terstruktur — pemahaman yang akurat tentang kekuatan, kecenderungan, dan cara kamu berfungsi terbaik.

Self-awareness adalah prasyarat kausal untuk empati dan kolaborasi yang efektif. Metakognisi — kemampuan memantau cara berpikirmu sendiri — adalah prasyarat kausal untuk analytical thinking. Ini bukan teori — ini relasi yang terbukti secara eksperimental dalam riset psikologi.

Overthinking yang sering dikeluhkan generasi muda bukan lawan dari critical thinking. Overthinking adalah pikiran yang berputar tanpa menghasilkan keputusan. Critical thinking adalah proses memecah masalah kompleks menjadi bagian-bagian yang bisa diperiksa. Yang pertama menguras energi, yang kedua membangunnya.

Hampir nol skill yang bisa digantikan sepenuhnya oleh AI saat ini adalah skill yang bersifat manusiawi: empati, penilaian kontekstual, kepemimpinan berbasis kepercayaan. Investasi pada pemahaman diri adalah investasi di area yang paling tahan terhadap otomasi.`,
    questions: [
      'Dalam situasi apa kamu merasa paling efektif — bukan hanya sibuk, tapi benar-benar menghasilkan sesuatu yang bermakna?',
      'Kalau seseorang yang mengenalmu dengan baik diminta menyebut tiga kekuatanmu — apa yang mungkin ia sebut? Apakah kamu setuju?',
    ],
    keyInsight:
      'Asesmen bukan tentang menemukan siapa kamu dalam satu label. Ini tentang mendapat data yang lebih akurat untuk membuat keputusan yang lebih baik tentang dirimu sendiri.',
    color: 'teal',
    assessmentNote:
      'Asesmen Sulu menggunakan instrumen psikometri tervalidasi untuk memberikan data tentang kepribadian dan minatmu. Sedang dalam pengembangan — daftarkan diri untuk diberitahu.',
  },
  {
    id: 'panduan',
    day: 'Perspektif 4',
    date: '6 Juni 2026',
    speaker: 'Dr. Evi Afifah Hurriyati, S.Si., M.Si.',
    role: 'Wakaprodi Psikologi IOU Indonesia. Peneliti FoMO, social media addiction, dan perkembangan Gen Z.',
    tag: 'PANDUAN UNTUK ORANG TUA',
    headline: 'Berhentilah menjelajahi masa depan anak\ndengan peta masa lalu.',
    body: `76 persen keputusan pilihan karier anak dipengaruhi orang tua — lebih besar dari guru, teman, bahkan media sosial. Pengaruh itu bisa menjadi aset terbesar atau hambatan terbesar.

Jebakan yang paling umum: memaksakan profesi bergengsi, membandingkan dengan teman sebaya, dan mengukur keberhasilan dari nilai akademik. Semua ini mungkin bekerja di generasi Anda. Tapi di era AI dan gig economy, metrik ini tidak lagi cukup.

Yang anak Anda butuhkan dari Anda bukan jawaban tentang jurusan. Yang mereka butuhkan adalah percakapan yang jujur, ruang untuk mengeksplorasi, dan orang tua yang memahami konteks dunia yang akan mereka masuki.

Framework yang berguna: sebelum memberi saran, tanyakan empat hal tentang anak Anda — apa kekuatan alaminya, apa yang benar-benar membuatnya bersemangat, nilai apa yang penting baginya, dan peluang apa yang relevan dengan kombinasi itu. Pertanyaan ini lebih bernilai dari jawaban apapun tentang jurusan.`,
    questions: [
      'Bayangkan percakapan terakhir Anda dengan anak tentang masa depannya. Siapa yang paling banyak berbicara — dan siapa yang paling banyak bertanya?',
      'Satu asumsi tentang dunia kerja yang Anda pegang dengan kuat — apakah Anda yakin asumsi itu masih berlaku untuk generasi anak Anda?',
    ],
    keyInsight:
      'Mendampingi bukan berarti menentukan. Pengaruh yang paling kuat dari orang tua bukan pada jurusan yang dipilihkan, tapi pada kualitas percakapan yang terjadi sebelum keputusan diambil.',
    color: 'blue',
  },
];

export const compassCTA = {
  headline: 'Empat perspektif. Satu perjalanan.',
  subtext:
    'Refleksi ini adalah awal. Langkah berikutnya adalah data yang lebih akurat tentang dirimu.',
  waitlist: {
    headline: 'Asesmen Sulu — Segera Hadir',
    subtext:
      'Tim psikologi kami sedang memvalidasi instrumen agar hasilnya bisa dipertanggungjawabkan. Masukkan kontakmu dan kami kabari begitu siap.',
    fields: {
      name: { label: 'Nama', placeholder: 'Nama lengkap' },
      email: { label: 'Email', placeholder: 'email@kamu.com' },
      whatsapp: { label: 'Nomor WhatsApp', placeholder: '08xxxxxxxxxx' },
    },
    submit: 'Daftarkan saya',
    successMessage:
      'Terdaftar. Kami akan menghubungimu segera setelah asesmen siap.',
  },
};

export const compassSources = [
  'Evan Indrawijaya, S.E., M.B.A. — Operations Director IOU Indonesia; ex-HR Director Danone, Pfizer, Kimberly-Clark',
  'Mochammad Hilman Al Fiqhy, M.A. — Dosen IOU; materi IOU Fair 2026',
  'Dillo Augustdi Putra, S.Psi., M.Psi., Psikolog — Dosen Psikologi IOU',
  'Dr. Evi Afifah Hurriyati, S.Si., M.Si. — Wakaprodi Psikologi IOU',
  "QS Al-Isra: 84; QS Ar-Ra'd: 11; QS Ibrahim: 24-25",
  'Krol & Bartz (2021), DOI: 10.1037/emo0000943 — Self-awareness sebagai prasyarat kausal empati',
  'Pikouli et al. (2023), DOI: 10.3390/jintelligence11090182 — Metakognisi dan analytical thinking',
  'BPS Sakernas 2024-2025 (data informal economy)',
  'WEF Future of Jobs Report 2025 (skill landscape)',
];
