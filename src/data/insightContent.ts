// All textual content for the /insight page. No strings hardcoded in JSX.
// Persona-aware: 'siswa' | 'orangtua' | 'gurubk'.

export type Persona = 'siswa' | 'orangtua' | 'gurubk';
export type Tone = 'negative' | 'positive' | 'neutral';

// Shared optional-concrete-steps shape used by stat cards / data items.
// Field is optional — not yet populated in any card data.
export type LangkahKongkret = {
  siswa: string;
  orangtua?: string;
  gurubk?: string;
};

export type InsightCard = {
  value: string;
  label: string;
  detail: string;
  source: string;
  tone: Tone;
  artinya?: Record<Persona, string>;
  glossaryTerm?: string;
  dampak?: string[];
  langkahKongkret?: LangkahKongkret;
};

// ─── PERSONA TEASER (soft, non-blocking) ──────────────────────────
export const personaTeaserSection = {
  headline: 'Pilih sudut pandangmu',
  subtext: 'Konten yang sama, framing yang relevan untuk kamu.',
  options: [
    { id: 'siswa' as Persona, label: 'Siswa atau gap year', description: 'Masih cari arah, bingung jurusan, atau baru gagal seleksi', icon: 'GraduationCap' },
    { id: 'orangtua' as Persona, label: 'Orang tua', description: 'Mendampingi anak memilih jalur pendidikan dan karier', icon: 'Heart' },
    { id: 'gurubk' as Persona, label: 'Guru BK atau konselor', description: 'Mendampingi siswa setiap hari dengan data yang sering tidak cukup', icon: 'BookOpen' },
  ],
  defaultPersona: 'siswa' as Persona,
  localStorageKey: 'sulu_insight_persona',
  neutralOption: { id: 'neutral' as const, label: 'Lihat semua perspektif' },
};

export const personaShortLabel: Record<Persona, string> = {
  siswa: 'Siswa',
  orangtua: 'Orang tua',
  gurubk: 'Guru BK',
};

// ─── HERO ──────────────────────────────────────────────────────────
export const hero = {
  headline: 'Dunia yang akan kamu masuki\nsudah berubah sebelum kamu siap.',
  subtext: {
    siswa: 'Bukan untuk menakut-nakuti. Karena kamu berhak tahu sebelum memilih.',
    orangtua: 'Bukan untuk menakut-nakuti. Karena keputusan hari ini punya konsekuensi panjang.',
    gurubk: 'Data yang selama ini sulit kamu temukan dalam satu tempat, dikurasi untuk keperluan konseling.',
  } as Record<Persona, string>,
  countdown: {
    targetIso: '2030-01-01',
    years: { suffix: 'tahun tersisa menuju 2030' },
    months: { suffix: 'bulan untuk bergerak' },
    fixed: { value: '201 juta', suffix: 'jiwa angkatan kerja potensial menuju 2030' },
  },
};

// ─── SECTION 1: INDONESIA ─────────────────────────────────────────
export const indonesiaSection = {
  tag: 'INDONESIA HARI INI',
  intro: {
    siswa: 'Ini lapangan yang akan kamu masuki. Bukan prediksi, ini yang sedang terjadi.',
    orangtua: 'Generasi anak Anda menghadapi kondisi yang berbeda dari yang Anda hadapi dulu. Datanya spesifik.',
    gurubk: 'Data ini bisa jadi titik masuk percakapan karier yang lebih jujur bersama siswa Anda.',
  } as Record<Persona, string>,
  cards: [
    {
      value: '19,44%', label: 'pemuda Indonesia berstatus NEET',
      detail: 'Sekitar 9 juta anak muda berada dalam kondisi ini tepat di masa bonus demografi. Kesenjangan gender cukup tajam: perempuan 35,77%, laki-laki 16,38%.',
      source: 'BPS Sakernas 2025, data 38 provinsi', tone: 'negative' as Tone,
      artinya: {
        siswa: 'Satu dari lima pemuda seusiamu saat ini belum terlibat dalam pendidikan, pekerjaan, atau pelatihan apa pun.',
        orangtua: 'Ini termasuk anak-anak dari keluarga yang juga berencana dengan baik.',
        gurubk: 'Satu dari lima siswa usia 16-30 sudah terputus dari jalur apapun. Data ini pembuka percakapan yang lebih jujur dari sekadar "kamu mau jadi apa?"',
      } as Record<Persona, string>,
      dampak: [
        'Hilangnya bonus demografi — Potensi tenaga kerja besar terbuang, sehingga pertumbuhan ekonomi melambat.',
        'Beban negara & keluarga — Meningkatkan pengeluaran sosial dan mengurangi pendapatan nasional.',
        'Penurunan daya saing — Indonesia kalah bersaing dengan negara ASEAN lain karena kekurangan tenaga kerja terampil.',
        'Efek jangka panjang — Pemuda NEET sulit bangkit, gaji lebih rendah, dan risiko kemiskinan meningkat.',
      ],
    },
    {
      value: '17,54%', label: 'tingkat pengangguran pemuda usia 15–24 tahun',
      detail: 'Tiga kali lipat rata-rata nasional (4,91%). Lulusan SMK yang dirancang siap kerja justru punya angka tertinggi antar jenjang: 8,63%. Hanya 35% bekerja sesuai keahliannya.',
      source: 'BPS Sakernas Agustus 2024', tone: 'negative' as Tone,
      artinya: {
        siswa: 'Ijazah tanpa kecocokan arah tidak melindungi dari pengangguran.',
        orangtua: 'Nama kampus lebih sedikit pengaruhnya dari kecocokan antara jurusan dan kemampuan nyata anak.',
        gurubk: 'Mismatch ini terjadi jauh sebelum siswa lulus — dimulai dari pilihan di kelas 12.',
      } as Record<Persona, string>,
    },
    {
      value: '35,36% & 70%', label: 'mismatch pendidikan dan pekerjaan',
      detail: '35,36% pemuda mengalami vertical mismatch — bekerja di bawah kualifikasi pendidikan yang sudah ditempuh. Sementara itu, 70% lulusan perguruan tinggi bekerja di bidang yang berbeda dari jurusannya.',
      source: 'BPS Sakernas 2025 (vertical mismatch); Mandiri Institute (mismatch jurusan, catatan: bukan survei nasional representatif)', tone: 'negative' as Tone,
      artinya: {
        siswa: 'Kamu masih punya waktu untuk mengenal diri lebih baik sebelum memilih.',
        orangtua: 'Pilihan yang terburu-buru jauh lebih mahal dari waktu yang diambil untuk mengenal anak.',
        gurubk: 'Bukan masalah motivasi. Masalah minimnya refleksi diri saat keputusan diambil.',
      } as Record<Persona, string>,
    },
    {
      value: '20%', label: 'penurunan pekerjaan entry-level di sektor digital dan tech',
      detail: 'Di sektor teknologi, developer usia 22–25 tahun kehilangan 20% peluang kerja sejak 2024. Pola serupa mulai terlihat di administrasi digital dan customer service. Catatan: angka ini spesifik untuk sektor terpapar AI generatif, bukan semua sektor.',
      source: 'Stanford AI Index 2026 (sektor tech/knowledge work)', tone: 'negative' as Tone,
      artinya: {
        siswa: 'AI tidak hanya mengambil pekerjaan orang dewasa; ia mengambil titik masuk pertama ke karier.',
        orangtua: 'Skill yang membuat seseorang naik level berbeda dari skill yang cukup untuk masuk kerja dulu.',
        gurubk: 'Siswa perlu dipersiapkan untuk tidak bergantung pada entry-level job sebagai satu-satunya opsi.',
      } as Record<Persona, string>,
    },
    {
      value: '1,72 juta', label: 'kebutuhan tenaga kerja di sektor ekonomi hijau Indonesia hingga 2030',
      detail: 'Indonesia membutuhkan 1,72 juta tenaga terampil di energi terbarukan. Target pelatihan pemerintah: 15.000 orang sampai 2029. Gap ini bukan hanya tantangan — ini peluang yang nyata dan terdokumentasi.',
      source: 'IESR (Institute for Essential Services Reform) 2024; Kemnaker RTKN 2025-2029', tone: 'positive' as Tone,
      artinya: {
        siswa: 'Ada sektor besar yang tumbuh cepat dan belum ada cukup orang yang datang.',
        orangtua: 'Jalur karier dengan prospek jangka panjang yang kuat dan shortage nyata.',
        gurubk: 'Alternatif konkret bagi siswa yang menyukai sains, lingkungan, atau teknologi.',
      } as Record<Persona, string>,
    },
  ],
};

// ─── LINK AND MATCH ───────────────────────────────────────────────
export const linkMatchSection = {
  tag: 'LINK AND MATCH',
  headline: 'Upaya Menjembatani Pendidikan dan Dunia Kerja',
  body: 'Pemerintah Indonesia melalui program Link and Match 8+i mendorong kerjasama SMK dengan industri. Namun realisasinya menghadapi tantangan nyata: tingkat pengangguran lulusan SMK masih 8,63%, banyak kerjasama bersifat formalitas, dan kurikulum sulit mengikuti perubahan teknologi. Yang paling sering terabaikan: pemahaman diri siswa terhadap kekuatan dan minat mereka sendiri.',
  source: 'BPS Sakernas 2024; Kemendikbudristek Evaluasi Program Link and Match 2023',
  artinya: {
    siswa: 'Link and Match akan lebih berhasil jika kamu memilih bidang yang sesuai dengan kekuatanmu, bukan hanya yang "sedang dibutuhkan industri" secara umum.',
    orangtua: 'Kerjasama sekolah-industri penting, tapi pemahaman mendalam tentang anak lebih menentukan pilihan yang tepat.',
    gurubk: 'Data pasar kerja terkini dapat memperkuat peran Anda membimbing siswa memilih kompetensi untuk industri masa depan.',
  } as Record<Persona, string>,
};

// ─── REALITA DUNIA KERJA ──────────────────────────────────────────
export const laborRealitySection = {
  tag: 'REALITA DUNIA KERJA',
  headline: 'Bukan hanya AI. Ini yang paling langsung terasa sekarang.',
  intro: {
    siswa: 'Sebelum memilih jalur, kenali dulu medan yang akan kamu masuki.',
    orangtua: 'Dunia kerja yang akan dimasuki anak Anda berbeda secara struktural dari yang Anda masuki dulu.',
    gurubk: 'Data ini berguna untuk membangun percakapan karier yang jujur, bukan yang hanya menenangkan.',
  } as Record<Persona, string>,
  cards: [
    {
      value: '57,95%', label: 'tenaga kerja Indonesia bekerja di sektor informal',
      detail: 'Tidak punya kontrak formal, tidak dapat BPJS dari majikan, tidak ada kepastian bulan depan masih ada pekerjaan. Ini bukan kelompok pinggiran — ini mayoritas. Tren ini naik, bukan turun.',
      source: 'BPS Sakernas 2024-2025',
      glossaryTerm: 'Gig-Proletariat: kondisi di mana semakin banyak pekerja, termasuk yang berpendidikan, bekerja tanpa ikatan formal dengan satu pemberi kerja. Bukan hanya ojek online, tapi juga desainer, konsultan, dan pendidik.',
      tone: 'negative' as Tone,
      artinya: {
        siswa: 'Sistem tidak sedang mempersiapkan tempat untukmu secara otomatis. Kamu yang harus mempersiapkan diri.',
        orangtua: 'Stabilitas kerja yang Anda rasakan dulu bukan standar yang bisa dijanjikan untuk anak Anda.',
        gurubk: 'Mayoritas siswa Anda akan masuk ke ekosistem kerja tanpa jaring pengaman formal.',
      } as Record<Persona, string>,
    },
    {
      value: 'K-Shaped', label: 'pemulihan ekonomi yang tidak merata',
      detail: 'Gini index Indonesia mencapai 0,381 (September 2024). Kelas menengah menyusut 10 juta orang dalam 5 tahun. Pertumbuhan ekonomi terjadi, tapi terkonsentrasi di atas. Gelombang protes pemuda yang terjadi sejak awal 2025 adalah ekspresi langsung dari ketidakmerataan ini.',
      source: 'BPS; World Bank Indonesia 2024; ISEAS Agustus 2025',
      glossaryTerm: 'K-Shaped Recovery: pemulihan ekonomi berbentuk huruf K: bagian atas tumbuh cepat, bagian bawah pekerja informal tertinggal.',
      tone: 'negative' as Tone,
      artinya: {
        siswa: 'Jalur yang kamu pilih sekarang menentukan kamu ada di bagian mana dari huruf K itu.',
        orangtua: 'Pertumbuhan ekonomi yang terlihat di berita tidak selalu dirasakan oleh semua lapisan masyarakat.',
        gurubk: 'Data ini membantu menjelaskan mengapa banyak siswa merasa frustrasi meski ekonomi "tumbuh".',
      } as Record<Persona, string>,
    },
    {
      value: '15,45%', label: 'tenaga kerja Indonesia yang punya pekerjaan tambahan',
      detail: 'Tertinggi dalam 5 tahun terakhir (BPS 2023). 57% Gen Z dan 48% Milenial Indonesia sudah menjalankan setidaknya satu pekerjaan sampingan. Catatan: sebagian besar karena gaji satu pekerjaan tidak cukup, bukan karena pilihan strategis. Keduanya perlu diantisipasi.',
      source: 'BPS Sakernas 2023; IDN Media Indonesian Millennials & Gen Z Report 2024',
      glossaryTerm: 'Portfolio Career / Poly-jobbing: memiliki beberapa sumber penghasilan dari beberapa klien atau pekerjaan sekaligus: bisa karena terpaksa (gaji tidak cukup) atau karena direncanakan sebagai strategi ketahanan.',
      tone: 'neutral' as Tone,
      artinya: {
        siswa: 'Membangun lebih dari satu keahlian yang bisa menghasilkan adalah strategi, bukan kemewahan.',
        orangtua: 'Generasi anak Anda kemungkinan besar tidak akan hanya bekerja di satu tempat seumur hidup.',
        gurubk: 'Siswa perlu disiapkan untuk mengelola karier yang lebih dinamis dari generasi sebelumnya.',
      } as Record<Persona, string>,
    },
  ],
};

// ─── SECTION 2: NEET ASEAN ────────────────────────────────────────
export const neetSection = {
  tag: 'NEET INDONESIA VS ASEAN',
  intro: 'Diukur dengan standar yang sama untuk semua negara, Indonesia berada di posisi tertinggi di kawasan. Gap-nya cukup untuk dipikirkan.',
  maxPercent: 25,
  data: [
    { country: 'Indonesia', value: 21.36, year: '2023', colorClass: 'bg-destructive' },
    { country: 'Thailand', value: 12.82, year: '2024', colorClass: 'bg-amber-500' },
    { country: 'Filipina', value: 12.36, year: '2023', colorClass: 'bg-amber-500' },
    { country: 'Vietnam', value: 10.25, year: '2024', colorClass: 'bg-amber-500' },
    { country: 'Malaysia', value: 10.22, year: '2022', colorClass: 'bg-amber-500' },
    { country: 'Singapura', value: 6.45, year: '2024', colorClass: 'bg-primary' },
  ],
  source: 'World Bank WDI, indikator SL.UEM.NEET.ZS (ILO modeled estimate); observasi terbaru per negara 2022–2024.',
  note: 'Satu sumber, satu definisi (apple-to-apple). Tahun terbaru tiap negara sedikit berbeda karena ketersediaan data. Angka kawasan ini (ILO modeled) berbeda dari 19,44% nasional Indonesia (BPS Sakernas 2025) karena metodologinya berbeda. Keduanya benar untuk tujuannya masing-masing.',
};

// ─── SECTION 3a: SKILL LANDSCAPE (siswa) ──────────────────────────
export const skillSection = {
  tag: 'PETA SKILL 2025–2030',
  intro: 'Skill bukan tentang apa yang tren sekarang. Skill adalah tentang apa yang masih dibutuhkan ketika kamu lulus.',
  growing: {
    label: 'Yang Tumbuh', subtitle: 'Dibutuhkan, belum cukup tersedia',
    items: [
      { skill: 'Analytical thinking', note: '7 dari 10 perusahaan menyebutnya skill paling dicari pada 2025', href: '/skill-map#berpikir-analitis' },
      { skill: 'AI dan data literacy', note: 'Bukan coding. Kemampuan bekerja dengan sistem AI dan membaca data untuk mengambil keputusan', href: '/skill-map#literasi-ai' },
      { skill: 'Resiliensi dan adaptabilitas', note: 'Tumbuh paling cepat di sektor pertanian, telekomunikasi, dan teknologi', href: '/skill-map#resiliensi' },
      { skill: 'Kreativitas', note: 'Naik karena AI mengambil tugas rutin. Yang tersisa adalah yang butuh penilaian manusia', href: '/skill-map#berpikir-kreatif' },
      { skill: 'Kepemimpinan', note: 'Kemampuan mengelola tim manusia sambil mengawasi sistem AI', href: '/skill-map#kepemimpinan' },
    ] as Array<{ skill: string; note: string; href?: string }>,
  },
  declining: {
    label: 'Yang Menyusut', subtitle: 'Bukan hilang seketika, tapi peluang kerjanya menyempit',
    items: [
      { skill: 'Entri data dan administrasi rutin', note: '1,7 juta posisi admin di Indonesia berisiko tinggi (ILO)' },
      { skill: 'Desain grafis dasar', note: 'Masuk daftar declining untuk pertama kali di WEF 2025 akibat generative AI' },
      { skill: 'Tugas fisik terstruktur dan prediktif', note: 'Perakitan linier, pembukuan dasar, pemrosesan data standar' },
    ],
  },
  note: '39% skill inti hari ini diperkirakan akan berubah sebelum 2030. Turun dari 44% di 2023 karena reskilling mulai berjalan.',
  source: 'WEF Future of Jobs Report 2025; McKinsey Global Institute',
};

// ─── SECTION 3b: ROI PENDIDIKAN (orangtua) ────────────────────────
export const roiSection = {
  tag: 'INVESTASI PENDIDIKAN',
  intro: 'Pertanyaan yang wajar: apakah biaya yang dikeluarkan sepadan dengan jalur yang dipilih?',
  cards: [
    {
      value: 'Rp 12–19 jt', label: 'total biaya kuliah S1 di IOU Indonesia (4 tahun)',
      detail: 'Rp 1,5 juta/semester (paruh waktu) × 8 semester = Rp 12 juta. Atau Rp 2,4 juta/semester (normal) × 8 semester = Rp 19,2 juta. Ijazah sudah mendapat penyetaraan Kemendikbud. Kuliah dari rumah — tidak ada biaya hidup terpisah.',
      source: 'IOU Indonesia, data biaya semester 2025; Kemendikbud penyetaraan 2024', tone: 'positive' as Tone,
    },
    {
      value: 'Rp 150–250 jt', label: 'estimasi total biaya kuliah S1 di PTN (termasuk biaya hidup di kota)',
      detail: 'UKT kelompok menengah PTN: Rp 4-7 juta/semester × 8 semester = Rp 32-56 juta (SPP saja). Ditambah biaya hidup di kota Rp 2,5-4 juta/bulan × 48 bulan = Rp 120-192 juta. Total: bisa mencapai Rp 150-250 juta untuk 4 tahun.',
      source: 'Data UKT Kemendikbud 2025; BPS Survei Biaya Hidup 2024', tone: 'neutral' as Tone,
    },
    {
      value: 'Rp 4,63 jt', label: 'rata-rata gaji bulanan lulusan perguruan tinggi Indonesia',
      detail: 'Lebih tinggi dari rata-rata nasional (Rp 3,33 juta). Tapi fresh graduate usia 20-25 tahun sering hanya mendapat Rp 2-2,5 juta di awal karier. Yang menentukan outcome bukan nama kampus, tapi kecocokan antara kemampuan nyata dan kebutuhan industri.',
      source: 'BPS Sakernas November 2025', tone: 'neutral' as Tone,
    },
  ],
};

// ─── SECTION 3c: KONDISI BK (gurubk) ──────────────────────────────
export const bkSection = {
  tag: 'KONDISI BIMBINGAN KARIER DI SEKOLAH',
  intro: 'Data tentang kondisi BK di Indonesia, untuk referensi dan advokasi.',
  cards: [
    {
      value: '1:250–350', label: 'rasio guru BK terhadap siswa di SMA Indonesia',
      detail: 'Standar Permendikbud No. 111/2014: 1:150. Kenyataan: rata-rata 1:250 sampai 1:350. Di daerah terpencil bisa 1:500. Hanya 35–40% sekolah memenuhi standar. Di madrasah aliyah: 1:350 sampai 1:400.',
      source: 'Data Dapodik Kemendikbud; EMIS Kemenag; Permendikbud No. 111/2014', tone: 'negative' as Tone,
    },
    {
      value: '80–85%', label: 'siswa yang hanya mendapat layanan BK administratif',
      detail: 'Layanan yang bermakna, konseling berbasis data minat bakat, tindak lanjut individual, hanya diterima 15–20% siswa. Sisanya: mengisi angket, mendengar sosialisasi universitas, mengisi formulir tanpa analisis.',
      source: 'Jurnal Kajian Bimbingan dan Konseling; Survei Mutu Pendidikan', tone: 'negative' as Tone,
    },
    {
      value: '88%', label: 'guru BK yang membutuhkan platform asesmen karier terstandarisasi dan gratis',
      detail: 'Lisensi alat tes psikologi mahal jika harus diadakan mandiri untuk seluruh siswa. 74% membutuhkan dashboard data pasar kerja yang diperbarui berkala. 62% kesulitan mengintegrasikan asesmen non-kognitif sesuai Kurikulum Merdeka.',
      source: 'Riset ABKIN; Universitas Pendidikan Indonesia (UPI); Universitas Negeri Yogyakarta (UNY)', tone: 'neutral' as Tone,
    },
    {
      value: '28%', label: 'siswa usia 15 tahun di Indonesia dengan rencana karier yang realistis',
      detail: 'OECD menemukan: bimbingan karier di usia 15 berkorelasi kuat dengan outcome kerja di usia 25. Indonesia berada di kuadran bawah dalam efektivitas career guidance. Mayoritas siswa mendambakan pekerjaan kerah putih tradisional yang kuota pasarnya sedang menyusut.',
      source: 'OECD State of Global Teenage Career Preparation 2025 (data PISA 2022)', tone: 'negative' as Tone,
    },
  ],
};

// ─── SECTION 4: DUNIA 2025–2030 ───────────────────────────────────
export const worldSection = {
  tag: 'DUNIA 2025–2030',
  intro: {
    siswa: 'Ini bukan krisis global yang abstrak. Ini yang akan membentuk pilihan karier kamu.',
    orangtua: 'Investasi pendidikan yang paling aman adalah yang mempersiapkan anak untuk jenis pekerjaan yang akan ada, bukan yang sudah ada.',
    gurubk: 'Data dari WEF, McKinsey, dan Stanford. Sumber yang bisa dikutip dalam konseling.',
  } as Record<Persona, string>,
  cards: [
    {
      value: '+78 juta', label: 'pertumbuhan neto lapangan kerja global pada 2030',
      detail: '170 juta pekerjaan baru tercipta, 92 juta hilang. Neto positif secara global. Tapi distribusinya tidak merata: negara berkembang seperti Indonesia lebih rentan karena ketergantungan pada sektor yang paling mudah diotomasi.',
      source: 'WEF Future of Jobs Report 2025', tone: 'neutral' as Tone,
      artinya: {
        siswa: 'Ada pekerjaan baru, tapi butuh skill berbeda dari yang diajarkan sekarang.',
        orangtua: 'Skill anak Anda pada 2030 lebih penting dari nama kampusnya.',
        gurubk: 'Basis data untuk menjawab pertanyaan siswa soal "masih ada pekerjaan tidak nanti?"',
      } as Record<Persona, string>,
    },
    {
      value: '39%', label: 'skill inti hari ini yang tidak akan relevan pada 2030',
      detail: 'WEF memproyeksikan 39% keterampilan kerja inti akan berubah sebelum akhir dekade ini. Di Indonesia, BAPPENAS dan WEF memperkirakan 36% skill akan berubah dalam lima tahun akibat adopsi digital dan transisi hijau.',
      source: 'WEF Future of Jobs Report 2025; BAPPENAS-WEF Jobs and Skills Accelerator 2025', tone: 'negative' as Tone,
      artinya: {
        siswa: 'Lebih dari sepertiga skill yang diajarkan sekarang mungkin tidak relevan saat kamu lulus.',
        orangtua: 'Bukan berarti kuliah sia-sia — tapi jenis kuliah dan fokus belajarnya yang perlu dipilih dengan tepat.',
        gurubk: 'Data untuk mendampingi siswa yang mempertanyakan relevansi pilihan studinya.',
      } as Record<Persona, string>,
    },
    {
      value: '23–25%', label: 'kontribusi Halal Value Chain ke PDB Indonesia',
      detail: 'Bank Indonesia dan KNEKS mencatat sektor prioritas halal (makanan-minuman, fashion muslim, pariwisata halal) menopang 23-25% PDB nasional. Indonesia #1 dunia modest fashion, #2 halal tourism. SDM yang paham fikih muamalah sekaligus bisnis modern sangat sedikit.',
      source: 'Laporan Halal Value Chain, Bank Indonesia dan KNEKS 2024; SGIE Report 2024/2025', tone: 'positive' as Tone,
      artinya: {
        siswa: 'Ada sektor besar yang kekurangan orang yang tahu cara kerjanya dari dalam.',
        orangtua: 'Jalur pendidikan berbasis nilai Islam tidak harus menutup peluang karier.',
        gurubk: 'Sektor ini bisa jadi alternatif konkret untuk siswa yang selama ini tidak melihat jalurnya.',
      } as Record<Persona, string>,
    },
    {
      value: '2030–2035', label: 'puncak bonus demografi Indonesia',
      detail: 'Proporsi penduduk usia produktif mencapai 68–70% dari total populasi. Bappenas memproyeksikan angkatan kerja potensial mencapai 201 juta jiwa pada 2030. Setelah 2035, rasio ketergantungan mulai naik. Jendela ini tidak berulang.',
      source: 'Proyeksi Penduduk Indonesia 2020–2050, Bappenas/BPS; RPJPN 2025–2045', tone: 'neutral' as Tone,
      artinya: {
        siswa: 'Kamu masuk pasar kerja tepat di puncak bonus demografi. Ini bisa jadi keuntungan atau tekanan, tergantung persiapanmu.',
        orangtua: 'Keputusan yang dibuat hari ini untuk anak Anda adalah bagian dari keputusan nasional yang lebih besar.',
        gurubk: 'Framing ini berguna untuk menjelaskan urgency kepada siswa tanpa terasa menakut-nakuti.',
      } as Record<Persona, string>,
    },
  ],
};

// ─── SECTION 5: PELUANG SDM ───────────────────────────────────────
export const opportunitySection = {
  tag: 'PELUANG YANG BELUM DIISI',
  intro: {
    siswa: 'Ada sektor-sektor yang butuh orang tapi belum ada cukup yang datang. Ini shortage yang terdokumentasi, bukan hype.',
    orangtua: 'Jalur karier yang paling aman bukan yang paling populer sekarang.',
    gurubk: 'Referensi untuk membuka percakapan tentang jalur yang jarang masuk radar siswa.',
  } as Record<Persona, string>,
  items: [
    { number: '01', title: 'Sertifikasi dan Auditor Halal', body: 'BPJPH mewajibkan sertifikasi halal untuk jutaan UMKM. 882.000 UMKM di Jawa Barat sudah bersertifikat (terbanyak nasional). Kebutuhan Penyelia Halal dan Auditor Halal sangat besar, supply sangat sedikit. Jalur yang sangat relevan untuk lulusan pendidikan Islam yang memahami sains.', badge: 'BPJPH Februari 2026; KDEKS Jabar' },
    { number: '02', title: 'Keuangan Syariah', body: 'Aset perbankan syariah tumbuh 33,92% dalam satu tahun. Kebutuhan analis yang paham fikih muamalah sekaligus instrumen keuangan modern sangat akut. Kurang dari 20% lulusan ekonomi syariah langsung terserap karena mismatch skills.', badge: 'OJK; KNEKS 2024' },
    { number: '03', title: 'Energi Terbarukan', body: '1,72 juta tenaga kerja diproyeksikan dibutuhkan di sektor EBT pada 2030 (IESR, skenario optimal). Target pelatihan pemerintah: 15.000 orang. Gap ini adalah peluang bagi yang menyiapkan diri lebih awal.', badge: 'IESR 2024; Kemnaker RTKN 2025-2029' },
    { number: '04', title: 'Kerja Lepas Digital', body: 'BPS Sakernas mencatat 7,2 juta pekerja lepas di Indonesia dengan rata-rata penghasilan Rp 3,73 juta/bulan secara nasional. Penghasilan aktual sangat bervariasi — ditentukan oleh spesialisasi, akses ke klien, dan reputasi yang dibangun. Untuk berlatar pendidikan Islam, bidang yang paling accessible: penerjemahan teks Arab-Indonesia, pengajaran bahasa Arab dan Al-Quran, dan penulisan konten berbasis kajian Islam.', badge: 'BPS Sakernas 2024' },
    { number: '05', title: 'Wirausaha Sosial', body: '67% pemimpin wirausaha sosial di Indonesia berusia 18-34 tahun. 70% entitas ini didirikan dalam 5 tahun terakhir. Model yang memadukan profitabilitas dengan pemecahan masalah sosial — selaras dengan konsep khairu ummah.', badge: 'British Council/AVPN DICE Study; UNESCAP' },
    { number: '06', title: 'Kesehatan dan Layanan Sosial', body: 'Perawat, konselor, social worker — pertumbuhan absolut tertinggi secara global (WEF). Rasio psikolog/konselor dengan remaja yang butuh layanan kesehatan mental di Indonesia: 1:30.000+.', badge: 'WEF FoJ 2025; Kemenkes RI 2024' },
    { number: '07', title: 'Agritech dan Ketahanan Pangan', body: 'Sektor terbesar Indonesia (28% workforce, 40,76 juta orang) yang butuh generasi baru dengan literasi teknologi. Indonesia masih impor gandum, kedelai, bawang putih. SDM agritech modern sangat langka.', badge: 'BPS Sakernas 2024; Kementan RI' },
  ],
};

// ─── KONTEKS JAWA BARAT ───────────────────────────────────────────
export const jabarSection = {
  tag: 'KONTEKS JAWA BARAT',
  headline: 'Paradoks provinsi dengan ekonomi terkuat sekaligus pengangguran pemuda tertinggi.',
  subtext: 'Ekonomi Jawa Barat tumbuh 5,79% di kuartal pertama 2026, tercepat di Indonesia. Tapi tingkat pengangguran pemudanya 16,89%, tertinggi ketiga secara nasional. Pertumbuhan dan pengangguran bisa hidup berdampingan. Yang menentukan kamu ada di sisi mana adalah persiapan.',
  source: 'BPS Jawa Barat 2025; Bank Indonesia Jawa Barat Q1 2026',
  stats: [
    { label: 'TPT Pemuda Jabar', value: '16,89%', context: 'Tertinggi ke-3 nasional', tone: 'negative' as Tone },
    { label: 'TPT Lulusan SMK Jabar', value: '12,42%', context: 'Lebih tinggi dari lulusan universitas (9,47%)', tone: 'negative' as Tone },
    { label: 'Tasikmalaya TPT', value: '3,74%', context: 'Terendah di Jabar. Ekosistem: pesantren + kerajinan + ekonomi Islam komunitas.', tone: 'positive' as Tone },
    { label: 'UMKM bersertifikat halal di Jabar', value: '882.000', context: 'Terbanyak di Indonesia (BPJPH, Feb 2026)', tone: 'positive' as Tone },
  ],
  closingNote: {
    siswa: 'Kamu tinggal di provinsi dengan salah satu paradoks terbesar Indonesia. Keputusan hari ini menentukan kamu ada di sisi pertumbuhan atau sisi pengangguran.',
    orangtua: 'Data Jabar berbeda dari rata-rata nasional. Informasi lokal ini lebih relevan untuk keputusan pendidikan anak Anda.',
    gurubk: 'Data per-kabupaten sangat bervariasi. Kabupaten asal siswa menentukan konteks peluang yang berbeda.',
  } as Record<Persona, string>,
};

// ─── ALUMNI YANG SUDAH MEMBUKTIKAN ────────────────────────────────
export const alumniSection = {
  tag: 'MEREKA YANG SUDAH MEMBUKTIKAN',
  headline: 'Lulusan madrasah dan pesantren bukan hanya ustaz dan guru agama.',
  subtext: 'Ini pola yang terdokumentasi dari alumni pendidikan Islam Indonesia yang masuk ke sektor-sektor yang tidak pernah diduga.',
  stories: [
    {
      sector: 'Pendidikan Tinggi',
      story: 'Universitas Islam Negeri Syarif Hidayatullah Jakarta mencatat hampir 50% lulusannya sudah terserap kerja sebelum wisuda. Alumni PBSB (Beasiswa Santri Berprestasi) Kemenag tersebar di kementerian, kedutaan besar, dan universitas.',
      insight: 'Latar belakang Islam tidak mengurangi daya saing. Yang mengurangi daya saing adalah tidak mengenal potensi diri.',
      source: 'Tracer Study UIN Jakarta; Data PBSB Kemenag',
    },
  ],
};

// ─── DATA DISCLAIMER (standar untuk semua angka income/salary) ───
export const dataDisclaimer = {
  income:
    'Angka penghasilan di halaman ini adalah rata-rata atau estimasi dari sumber terverifikasi. Penghasilan aktual sangat bervariasi berdasarkan pengalaman, spesialisasi, akses ke klien, dan kondisi pasar lokal. Selalu verifikasi dengan sumber terpercaya sebelum mengambil keputusan berdasarkan angka ini.',
};

// ─── EXPERT QUOTES ────────────────────────────────────────────────
export const expertSection = {
  tag: 'KATA PARA AHLI',
  intro: {
    siswa: 'Ini bukan opini acak. Ini pakar Indonesia dengan rekam jejak yang bisa dicek.',
    orangtua: 'Pandangan akademisi dan pejabat Indonesia tentang arah pendidikan.',
    gurubk: 'Referensi yang bisa dikutip dalam presentasi atau advokasi kepada pihak sekolah.',
  } as Record<Persona, string>,
  quotes: [
    {
      quote: 'Dunia berubah, namun masih banyak perguruan tinggi masih bergerak dengan tempo lama. Belum lagi hadirnya AI yang meruntuhkan monopoli pengetahuan. Perguruan tinggi yang mampu membaca momentum akan bertahan, yang tidak akan ditinggalkan.',
      speaker: 'Prof. Rhenald Kasali, Ph.D.',
      title: 'Guru Besar FEB Universitas Indonesia, Pendiri Rumah Perubahan',
      source: 'Executive Workshop SEVIMA, Jakarta, 12 Februari 2026',
      url: 'https://sevima.com/ai-hancurkan-monopoli-pengetahuan-kampus-sevima-prof-rhenald-kasali-ajak-pendidikan-tinggi-berubah/',
    },
    {
      quote: 'Produktivitas adalah prasyarat utama bagi Indonesia untuk keluar dari middle income trap, yang ditopang oleh kualitas SDM melalui investasi strategis bidang pendidikan dan kesehatan.',
      speaker: 'Sri Mulyani Indrawati',
      title: 'Menteri Keuangan Republik Indonesia',
      source: 'Pertemuan Musim Semi IMF-World Bank, Washington D.C., April 2024',
      url: 'https://www.tempo.co/ekonomi/di-washington-dc-sri-mulyani-beberkan-soal-bonus-demografi-muda-hingga-reformasi-kesehatan--66336',
    },
  ],
};

// ─── SECTION 6: SKILL MAP TEASER ─────────────────────────────────
export const skillMapTeaser = {
  tag: 'PETA SKILL LENGKAP',
  headline: 'Bukan daftar jargon. Peta yang bisa kamu baca.',
  body: 'Dari karakter dasar yang tidak bisa digantikan AI, sampai domain teknis per sektor. Lengkap dengan relasi kausal yang terbukti secara eksperimental dan data pasar kerja Indonesia.',
  cta: 'Buka Peta Skill',
  href: '/skill-map',
};

// ─── PERSONA CALLOUT ──────────────────────────────────────────────
export const personaCallout: Record<Persona, { headline: string; body: string }> = {
  siswa: {
    headline: 'Kamu sudah tahu kondisinya.',
    body: 'Data yang kamu baca bukan takdir. Itu peta. Yang menentukan kamu ada di mana dalam peta itu adalah pilihan yang kamu buat sekarang, dan seberapa dalam kamu mengenal diri sendiri sebelum memilih.',
  },
  orangtua: {
    headline: 'Mendampingi bukan berarti menentukan.',
    body: 'Pengaruh yang paling kuat dari orang tua bukan pada jurusan yang dipilihkan, tapi pada kualitas percakapan yang terjadi sebelum keputusan diambil. Data yang valid membuat percakapan itu lebih jujur.',
  },
  gurubk: {
    headline: 'Kamu menghadapi 200+ siswa dengan pertanyaan yang semakin kompleks.',
    body: 'Bukan salahmu bahwa datanya tidak cukup. Tapi ada cara untuk memulai percakapan yang lebih bermakna, bahkan dalam waktu yang terbatas.',
  },
};

// ─── CTA + WAITLIST ───────────────────────────────────────────────
export const ctaSection = {
  headline: 'Kamu sudah tahu kondisi dunianya.',
  subtext: {
    siswa: 'Ada dua langkah yang bisa diambil sekarang.',
    orangtua: 'Ada dua langkah yang bisa diambil sekarang.',
    gurubk: 'Ada dua langkah yang bisa diambil sekarang.',
  } as Record<Persona, string>,
  paths: [
    {
      label: 'Lihat peta skill lengkap',
      description: 'Skill apa yang tumbuh, apa yang menyusut, dan bagaimana relasinya satu sama lain.',
      href: '/skill-map',
      variant: 'outline' as const,
    },
    {
      label: 'Kenali dirimu',
      description: 'Refleksi terarah tentang siapa kamu dan apa yang kamu bawa ke dunia ini.',
      href: '/compass',
      variant: 'default' as const,
    },
  ],
  waitlist: {
    headline: 'Asesmen Sulu — Segera Hadir',
    subtext: 'Tim psikologi kami sedang memvalidasi instrumen agar hasilnya bisa dipertanggungjawabkan. Masukkan kontakmu dan kami kabari begitu siap.',
    fields: {
      name: { label: 'Nama', placeholder: 'Nama lengkap' },
      email: { label: 'Email', placeholder: 'email@kamu.com' },
      whatsapp: { label: 'Nomor WhatsApp', placeholder: '08xxxxxxxxxx', note: 'Kami hubungi via WA ketika asesmen siap.' },
    },
    submit: 'Daftarkan saya',
    submitting: 'Menyimpan...',
    successMessage: 'Terdaftar. Kami akan menghubungimu begitu asesmen siap.',
    errorMessage: 'Terjadi kesalahan. Coba lagi.',
  },
};

// ─── 4 KARTU PENAMPAR ─────────────────────────────────────────────
export type PenamparCard = {
  id: string;
  title: string;
  hook: string;
  statNumber: string;   // angka besar — ditampilkan prominent
  statLabel: string;    // label singkat — ditampilkan kecil di bawahnya
  peluang: string;
  klaster: string;
};

export const penamparSection = {
  headline: 'Dari Ilmu ke Dampak — Mulai dari Sini',
  cards: [
    {
      id: 'pendidikan',
      title: 'Di Balik Papan Tulis',
      hook: 'Di banyak madrasah, siswa datang penuh semangat setiap pagi. Tapi gurunya masih berjuang untuk mengajar dengan lebih baik.',
      statNumber: '6 dari 10',
      statLabel: 'guru madrasah belum bersertifikat',
      peluang: 'Ada ruang yang terbuka bagi yang ingin membawa kualitas pendidikan lebih baik ke generasi berikutnya.',
      klaster: 'Pendidikan & Ilmu',
    },
    {
      id: 'kepemimpinan',
      title: 'Yang Pergi, Yang Tidak Kembali',
      hook: 'Banyak kepala desa bekerja dengan tulus melayani warganya. Namun latar belakang pendidikannya sering terbatas.',
      statNumber: '57%',
      statLabel: 'kepala desa tidak melanjutkan pendidikan tinggi',
      peluang: 'Ada tempat bagi generasi muda yang ingin membawa ilmu dan perspektif baru ke kepemimpinan desa.',
      klaster: 'Kepemimpinan & Tata Kelola',
    },
    {
      id: 'kesehatan',
      title: 'Ditanggung Sendiri',
      hook: 'Di balik senyuman banyak remaja, ada yang sedang menahan beban sendirian karena tidak tahu harus bicara dengan siapa.',
      statNumber: 'hanya 1 dari 10',
      statLabel: 'remaja yang depresi mencari bantuan',
      peluang: 'Ada ruang yang luas bagi yang ingin hadir — sebagai pendamping, konselor, atau tenaga kesehatan — untuk orang-orang yang selama ini menanggung sendiri.',
      klaster: 'Kesehatan & Kesejahteraan',
    },
    {
      id: 'ekonomi',
      title: '65 Juta UMKM, 7% Syariah',
      hook: 'Ada jutaan pemilik usaha kecil yang ingin menjalankan bisnis sesuai nilai agamanya, tapi kesulitan mencari jalan dan dukungan yang tepat.',
      statNumber: '7,4%',
      statLabel: 'keuangan Indonesia yang berprinsip syariah',
      peluang: 'Ada ruang yang terbuka bagi yang ingin membantu membangun keuangan dan bisnis yang lebih selaras dengan nilai Islam.',
      klaster: 'Ekonomi Adil & Keuangan',
    },
  ] satisfies PenamparCard[],
};

// ─── PAK EVAN INSIGHTS ────────────────────────────────────────────
export const evanInsights = {
  buttonLabel: 'Insights Ketenagakerjaan dari Pak Evan Indrawijaya',
  profile: {
    name: 'Evan Indrawijaya, SE, MBA.',
    bio: '25+ tahun memimpin SDM di perusahaan multinasional — Danone, Pfizer, Weatherford, Kimberly-Clark. SE Universitas Airlangga · MBA Universitas Antwerp, Belgia.',
    role: 'Operations Director, International Open University',
  },
  kondisi: {
    title: 'Angka yang Tidak Bisa Diabaikan',
    highlight: '1 dari 6 Gen Z menganggur',
    highlightSub: 'lebih dari 3× rata-rata nasional',
    highlightSource: 'BPS Sakernas Agustus 2025 · Apindo 2025',
    ageChart: [
      { age: '15–19', juta: 1.5 },
      { age: '20–24', juta: 2.3 },
      { age: '25–29', juta: 1.1 },
      { age: '30–34', juta: 0.6 },
      { age: '35–44', juta: 0.7 },
      { age: '45+',   juta: 0.5 },
    ],
    ageChartNote: 'Jumlah penganggur per kelompok usia (juta jiwa) · BPS Sakernas Agustus 2025',
    kisah: [
      { label: 'Batam, April 2025', story: 'Ratusan pelamar berdesakan di depan pabrik di Tanjung Uncang sampai ada yang jatuh ke selokan. Videonya viral di seluruh Indonesia.', source: 'Okezone / RCTI+, April 2025' },
      { label: 'Putri, 22 tahun', story: '80 lamaran, nol panggilan. Di satu job fair: 6.654 lowongan — tapi diserbu puluhan ribu pelamar.', source: 'Kompas / Tribun Jateng, Agustus 2025' },
      { label: 'Fardi', story: 'Menyesal tidak pernah magang. Puluhan lamaran, hanya 3–4 interview, 2 tahun menganggur.', source: 'Mojok, September 2025' },
      { label: '300 lamaran, 299 penolakan', story: 'Hampir kehilangan kepercayaan diri sebelum akhirnya diterima setelah ikut program pendampingan.', source: 'Viva, Agustus 2025' },
    ],
    neetNote: 'Hampir 9 juta anak muda Indonesia saat ini berstatus NEET — tidak bekerja, tidak sekolah, tidak dalam pelatihan apapun.',
    neetSource: 'BPS Sakernas Agustus 2025',
  },
  ironi: {
    title: 'Ironi yang Perlu Dipahami',
    pullQuote: 'Pasar tidak membeli ijazah. Pasar membeli kemampuan yang bisa langsung dipakai.',
    pullQuoteSource: 'Apindo 2025',
    eduChart: [
      { edu: 'SD ke bawah', tpt: 2.3, highlight: false },
      { edu: 'SMP',         tpt: 5.3, highlight: false },
      { edu: 'SMA',         tpt: 8.6, highlight: true  },
      { edu: 'SMK',         tpt: 9.2, highlight: true  },
      { edu: 'Diploma',     tpt: 6.1, highlight: false },
      { edu: 'Sarjana S1',  tpt: 5.4, highlight: false },
    ],
    eduChartTitle: 'Tingkat Pengangguran menurut Pendidikan (%)',
    eduChartNote: 'Pola BPS Sakernas Agustus 2024 · Justru lulusan SMK & SMA yang paling sulit terserap.',
    apindoInsight: 'Mayoritas penganggur muda punya keterampilan umum, sementara industri membutuhkan keahlian teknis & vokasional yang spesifik.',
    supply: [
      'Lulusan banyak & terus bertambah',
      'Keterampilan umum, berbasis hafalan',
      'Sedikit bukti kerja nyata / portofolio',
      'Ekspektasi: belajar dulu, baru produktif',
    ],
    demand: [
      'Keahlian teknis & vokasional spesifik',
      'Mampu langsung berkontribusi (day-1)',
      'Problem-solving & analytical thinking',
      'Kemandirian & bukti nyata, bukan janji',
    ],
    wef: '63% pemberi kerja menyebut kesenjangan keterampilan sebagai penghalang utama transformasi bisnis.',
    wefSource: 'WEF Future of Jobs 2025',
  },
  arah: {
    title: 'Ke Mana Arah Ini Bergerak',
    tamparan: [
      { label: 'Skills-Based Hiring',    desc: 'Perusahaan tidak lagi merekrut berdasarkan nama kampus. Yang dicari: bisa langsung bekerja, ada bukti nyata, tidak butuh training panjang.' },
      { label: 'Hit the Ground Running', desc: 'Tidak ada lagi budget orientasi panjang. Hari pertama sudah harus berkontribusi — siap, atau digantikan.' },
      { label: 'Saringan Makin Sempit',  desc: '100 pelamar → 1–2 yang lolos. Program management trainee dan posisi junior jauh lebih sedikit dari satu dekade lalu.' },
      { label: 'Gig Economy',            desc: '57% pekerja Indonesia di sektor informal. Bagi yang punya skill dan kemandirian: kebebasan. Bagi yang tidak: jurang.' },
    ],
    paradoksPQ: 'Laba naik, kepala berkurang.',
    paradoksDesc: 'Banyak korporasi global mencatat rekor laba sambil memangkas ribuan posisi — investasi dialihkan ke AI dan infrastruktur data. Indonesia tidak kebal: gelombang PHK startup dan sektor tech 2025 sudah terasa.',
    paradoksStats: [
      { angka: '±72.000', sub: 'karyawan tech global terkena PHK semester I-2025', source: 'Layoffs.fyi' },
      { angka: '12.000+', sub: 'posisi dipangkas Microsoft 2025 — meski cetak laba rekor', source: 'Microsoft 2025' },
    ],
    mckinsey: {
      displaced: '23 juta',
      displacedLabel: 'pekerjaan tergeser otomasi pada 2030',
      created: '27–46 juta',
      createdLabel: 'pekerjaan baru bisa tercipta — bagi yang siap',
      note: '~10 juta dari pekerjaan baru itu berjenis yang belum ada hari ini.',
      source: 'McKinsey Indonesia, "Automation & the Future of Work in Indonesia" (2030)',
    },
    closing: 'Kemandirian adalah satu-satunya jaring pengaman yang tersisa.',
  },
  survive: {
    title: 'Yang Membuat Kamu Survive',
    quote: '"Gen Alpha jagoan memakai AI — tapi membeku ketika harus berbicara langsung dengan atasannya. Teknologi melimpah; kematangan manusia justru menjadi langka."',
    aiCantTitle: 'Yang Belum Bisa Dilakukan AI',
    aiCant: [
      'Menetapkan arah dan tujuan yang bermakna',
      'Memaknai kompleksitas dan ambiguitas',
      'Mengambil keputusan berbasis nilai',
      'Membangun kepercayaan antar-manusia',
    ],
    aiCantNote: 'Justru di sinilah nilai manusia — dan nilai keislaman — menemukan tempatnya.',
    ayatAliImran: {
      arabic: 'وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ',
      translation: '"Kamulah yang paling tinggi derajatnya, jika kamu orang beriman."',
      ref: 'QS Ali Imran: 139',
    },
    pilars: [
      { label: 'Kemandirian & Resilience', points: ['Belajar hal baru tanpa harus diawasi', 'Menyelesaikan masalah — tidak menyerah saat terhambat', 'Produktif tanpa bergantung motivasi eksternal'] },
      { label: 'Human Relations', points: ['Membangun kepercayaan dan kredibilitas', 'Menepati komitmen — bukan sekadar berjanji', 'Mengelola emosi dan konflik secara matang'] },
    ],
  },
  ekosistem: {
    title: 'Empat Pilar Ekosistem Sukses',
    items: [
      { num: '1', label: 'Fondasi Spiritual',    desc: 'Tauhid dan niat yang benar. Self-leadership dimulai dari kedekatan dengan Allah — dunia sebagai ladang, bukan tujuan.' },
      { num: '2', label: 'Kapasitas Diri',        desc: 'Ilmu, skill, dan kemandirian. Padukan fardhu ain dengan keahlian masa depan — resilien, adaptif, mandiri.' },
      { num: '3', label: 'Relasi & Komunitas',    desc: 'Barisan dan kolaborasi. Allah membedakan potensi tiap orang agar saling melengkapi — bangun jaringan yang kokoh.' },
      { num: '4', label: 'Lingkungan Bertumbuh',  desc: 'Pendidikan adaptif dan aksi nyata. Pilih wadah yang melatih kemandirian dan menuntut karya nyata.' },
    ],
    roadmap: [
      { step: '1', label: 'Kenali',     desc: 'Diri dan ekosistem. Bukan hanya nilai akademik — skill-based assessment sejak awal.' },
      { step: '2', label: 'Sesuaikan',  desc: 'Arah dan pilihan. Selaraskan jurusan dan jalur dengan potensi asli, bukan gengsi.' },
      { step: '3', label: 'Bertindak',  desc: 'Eksplorasi nyata. Ekskul, proyek, magang, microcredential — ciptakan nilai, bukan hanya belajar tentang nilai.' },
      { step: '4', label: 'Mandiri',    desc: 'Survive dan berdampak. Berdiri di atas kaki sendiri, memberi manfaat, dengan niat yang benar.' },
    ],
    projection: 'Proyeksi The Millennium Project (lembaga foresight independen, konsensus pakar global via metode Delphi): tingkat pengangguran global 24% pada 2050 — jika sistem dan manusia tidak beradaptasi.',
  },
  footer: {
    ayat: {
      arabic: 'وَأَمَّا مَا يَنفَعُ النَّاسَ فَيَمْكُثُ فِي الْأَرْضِ',
      translation: '"Adapun yang memberi manfaat kepada manusia, ia akan tetap menetap di bumi."',
      ref: 'QS Ar-Ra\'d: 17',
    },
    hadith: {
      arabic: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
      translation: '"Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lain."',
      ref: 'HR. Thabrani, hasan — Al-Albani',
    },
  },
};

// ─── FOOTER SOURCES ───────────────────────────────────────────────
export const dataSources = [
  'BPS Sakernas 2024 dan 2025',
  'WEF Future of Jobs Report 2025',
  'Stanford AI Index 2026',
  'McKinsey Global Institute — Future of Work Indonesia',
  'ILO ASEAN in Transformation 2024',
  'Bappenas — Proyeksi Penduduk Indonesia 2020–2050',
  'RPJPN 2025–2045 (UU No. 59/2024)',
  'KNEKS 2024; SGIE Report 2024/2025',
  'OECD State of Global Teenage Career Preparation 2025 (data PISA 2022)',
  'Irene Guntur, Psikolog Pendidikan IDF; Indonesia Career Center Network',
  'Jurnal ABKIN; UPI; UNY — Riset kebutuhan guru BK',
  'Permendikbud No. 111/2014; Data Dapodik; EMIS Kemenag',
  'IESR 2024; Bappenas Peta Jalan Tenaga Kerja Hijau 2025',
  'Kemnaker RTKN 2025-2029',
  'BPS Sakernas 2024-2025 (informal economy, pekerja lepas, poly-jobbing)',
  'World Bank Indonesia — Kelas Menengah 2024',
  'BPS Jawa Barat 2025; Bank Indonesia Jawa Barat Q1 2026',
  'BPJPH 2026 — Data Sertifikasi Halal Jawa Barat',
  'British Council/AVPN DICE Study — Social Enterprise Indonesia',
  'Tracer Study UIN Jakarta; Data PBSB Kemenag RI',
  'IDN Media Indonesian Millennials & Gen Z Report 2024',
];

export const sourcePrefix = 'Sumber:';
export const dataSourcesLabel = 'Daftar sumber data';
