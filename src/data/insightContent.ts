// All textual content for the /insight page. No strings hardcoded in JSX.
// Persona-aware: 'siswa' | 'orangtua' | 'gurubk'.

export type Persona = 'siswa' | 'orangtua' | 'gurubk';
export type Tone = 'negative' | 'positive' | 'neutral';

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
    fixed: { value: '208 juta', suffix: 'jiwa produktif pada puncak bonus demografi' },
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
      detail: 'Tidak bekerja, tidak sekolah, tidak pelatihan. Setara 9 juta anak muda di tengah puncak bonus demografi. Kesenjangan gender tajam: perempuan 35,77%, laki-laki 16,38%.',
      source: 'BPS Sakernas 2025, data 38 provinsi', tone: 'negative' as Tone,
      artinya: {
        siswa: 'Satu dari lima orang seusiamu sudah terputus dari jalur apapun.',
        orangtua: 'Ini termasuk anak-anak dari keluarga yang juga berencana dengan baik.',
        gurubk: 'Titik awal percakapan karier yang lebih jujur dengan siswa.',
      } as Record<Persona, string>,
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
        gurubk: 'Bukan masalah motivasi — masalah minimnya refleksi diri saat keputusan diambil.',
      } as Record<Persona, string>,
    },
    {
      value: '20%', label: 'penurunan pekerjaan entry-level di sektor digital dan tech',
      detail: 'Di sektor teknologi, developer usia 22–25 tahun kehilangan 20% peluang kerja sejak 2022. Pola serupa mulai terlihat di administrasi digital dan customer service. Catatan: angka ini spesifik untuk sektor terpapar AI generatif, bukan semua sektor.',
      source: 'Stanford AI Index 2026 (sektor tech/knowledge work)', tone: 'negative' as Tone,
      artinya: {
        siswa: 'AI tidak hanya mengambil pekerjaan orang dewasa. Ia mengambil titik masuk ke karier.',
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

// ─── SECTION 2: NEET ASEAN ────────────────────────────────────────
export const neetSection = {
  tag: 'NEET INDONESIA VS ASEAN',
  intro: 'Indonesia bukan yang terburuk di kawasan. Tapi gap-nya cukup untuk dipikirkan.',
  maxPercent: 25,
  data: [
    { country: 'Indonesia', value: 19.44, colorClass: 'bg-destructive' },
    { country: 'Malaysia', value: 13.63, colorClass: 'bg-amber-500' },
    { country: 'Vietnam', value: 10.82, colorClass: 'bg-amber-500' },
    { country: 'Singapura', value: 4.1, colorClass: 'bg-primary' },
  ],
  source: 'BPS Sakernas 2025; ASEAN Statistical Yearbook 2024',
  note: 'Definisi NEET tiap negara sedikit berbeda. Gunakan sebagai gambaran, bukan perbandingan absolut.',
};

// ─── SECTION 3a: SKILL LANDSCAPE (siswa) ──────────────────────────
export const skillSection = {
  tag: 'PETA SKILL 2025–2030',
  intro: 'Skill bukan tentang apa yang tren sekarang. Skill adalah tentang apa yang masih dibutuhkan ketika kamu lulus.',
  growing: {
    label: 'Yang Tumbuh', subtitle: 'Dibutuhkan, belum cukup tersedia',
    items: [
      { skill: 'Analytical thinking', note: '7 dari 10 perusahaan menyebutnya skill paling dicari pada 2025' },
      { skill: 'AI dan data literacy', note: 'Bukan coding. Kemampuan bekerja dengan sistem AI dan membaca data untuk mengambil keputusan' },
      { skill: 'Resiliensi dan adaptabilitas', note: 'Tumbuh paling cepat di sektor pertanian, telekomunikasi, dan teknologi' },
      { skill: 'Kreativitas', note: 'Naik karena AI mengambil tugas rutin. Yang tersisa adalah yang butuh penilaian manusia' },
      { skill: 'Kepemimpinan', note: 'Kemampuan mengelola tim manusia sambil mengawasi sistem AI' },
    ],
  },
  declining: {
    label: 'Yang Menyusut', subtitle: 'Bukan hilang seketika, tapi peluang kerjanya menyempit',
    items: [
      { skill: 'Entri data dan administrasi rutin', note: '1,7 juta posisi admin di Indonesia berisiko tinggi (ILO)' },
      { skill: 'Desain grafis dasar', note: 'Masuk daftar declining untuk pertama kali di WEF 2025 akibat generative AI' },
      { skill: 'Tugas fisik terstruktur dan prediktif', note: 'Perakitan linier, pembukuan dasar, pemrosesan data standar' },
    ],
  },
  note: '39% skill inti hari ini diperkirakan tidak relevan pada 2030. Turun dari 44% di 2023 karena reskilling mulai berjalan.',
  source: 'WEF Future of Jobs Report 2025; McKinsey Global Institute',
};

// ─── SECTION 3b: ROI PENDIDIKAN (orangtua) ────────────────────────
export const roiSection = {
  tag: 'INVESTASI PENDIDIKAN',
  intro: 'Pertanyaan yang wajar untuk ditanyakan: apakah biaya yang dikeluarkan sepadan dengan jalur yang dipilih?',
  cards: [
    {
      value: 'Rp 4,63 jt', label: 'rata-rata gaji bulanan lulusan perguruan tinggi Indonesia',
      detail: 'Lebih tinggi dari lulusan SMA/SMK (Rp3,2-3,4 juta) dan rata-rata nasional (Rp3,33 juta). Tapi fresh graduate baru masuk kerja (usia 20-25) sering hanya mendapat Rp2,0-2,5 juta — bahkan lulusan PTN rata-rata lebih rendah (Rp2,0 juta) dari PTS (Rp2,5 juta) di awal karier.',
      source: 'BPS Sakernas November 2025', tone: 'neutral' as Tone,
    },
    {
      value: '4–8 tahun', label: 'estimasi waktu balik modal investasi S1 di PTN (kelas menengah)',
      detail: 'Dengan UKT kelompok menengah PTN (Rp4-7 juta/semester) + biaya hidup di kota (Rp2,5-4 juta/bulan), total investasi 4 tahun bisa mencapai Rp100-200 juta. Dengan gaji awal Rp2-3 juta, balik modal membutuhkan 4-8 tahun — asumsi tidak ada pengeluaran lain.',
      source: 'Kalkulasi dari data BPS Sakernas November 2025 + data UKT Kemendikbud 2025', tone: 'neutral' as Tone,
    },
    {
      value: '76%', label: 'keputusan pilihan jurusan dipengaruhi orang tua',
      detail: 'Orang tua adalah faktor terbesar dalam keputusan karier anak, lebih besar dari guru. Pengaruh yang didasari informasi yang akurat menghasilkan keputusan yang lebih baik untuk semua pihak.',
      source: 'Jurnal Nusantara of Research 2024; Anne Roe career theory', tone: 'neutral' as Tone,
    },
  ],
  expertQuote: {
    quote: 'Anak-anak Indonesia yang lahir dengan kondisi sosial berbeda harus diberikan kesempatan yang sama dalam hal pendidikan dan kesehatan.',
    speaker: 'Sri Mulyani Indrawati',
    title: 'Menteri Keuangan RI',
    context: 'Tentang perlunya investasi SDM untuk keluar dari middle-income trap',
  },
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
      source: 'OECD State of Global Teenage Career Preparation 2024', tone: 'negative' as Tone,
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
        siswa: 'Generasimu adalah generasi yang paling menentukan apakah bonus demografi jadi aset atau beban.',
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
    { number: '01', title: 'Sertifikasi dan Auditor Halal', body: 'BPJPH mewajibkan sertifikasi halal untuk jutaan UMKM dan perusahaan. Kebutuhan Penyelia Halal dan Auditor Halal melonjak, tapi tenaga tersertifikasi sangat sedikit. Jalur ini sangat relevan untuk lulusan pendidikan Islam yang juga memahami sains.', badge: 'Shortage regulasi — data BPJPH/Kemenag' },
    { number: '02', title: 'Keuangan Syariah dan Fintech', body: 'Aset perbankan syariah tumbuh dengan pesat. Kebutuhan analis yang paham fikih muamalah sekaligus instrumen keuangan modern sangat akut dan belum terpenuhi. Kurang dari 20% lulusan ekonomi syariah langsung terserap karena skill mismatch.', badge: 'Shortage terdokumentasi — OJK, KNEKS' },
    { number: '03', title: 'Energi Terbarukan dan Ekonomi Hijau', body: '1,72 juta tenaga terampil dibutuhkan di sektor ini sampai 2030 (IESR). Target pelatihan pemerintah jauh di bawah angka ini. Termasuk teknisi PLTS, insinyur sistem energi, dan konsultan carbon accounting.', badge: 'Gap 1,72 juta vs 15.000 terlatih' },
    { number: '04', title: 'Agritech dan Ketahanan Pangan', body: 'Sektor terbesar Indonesia (28% workforce) yang butuh regenerasi dan modernisasi. Indonesia masih impor gandum, kedelai, bawang putih. Hanya 12-14% pemuda bekerja di pertanian — sebagian besar karena tidak ada jalur masuk yang modern.', badge: 'Shortage demografis + teknologi' },
    { number: '05', title: 'Kesehatan dan Layanan Sosial', body: 'Perawat, konselor, social worker, psikolog — pertumbuhan absolut tertinggi secara global (WEF). Di Indonesia, rasio psikolog/konselor dengan remaja yang butuh layanan kesehatan mental: 1:30.000+.', badge: 'Shortage akut — Kemenkes, INAMHS' },
    { number: '06', title: 'Halal Logistics dan Supply Chain', body: 'Ekspansi rantai pasok global menuntut standarisasi Halal Supply Chain. Industri kekurangan pengawas rantai pasok yang memahami regulasi higienitas dan halal traceability — posisi yang cocok untuk lulusan SMA/MA dengan pelatihan spesifik.', badge: 'Emerging — data Asosiasi Logistik Indonesia' },
    { number: '07', title: 'Talenta Digital (Software, Data, Cybersecurity)', body: 'Indonesia kekurangan rata-rata 600.000 talenta digital per tahun (Bank Dunia, Kominfo). Posisi junior di data analytics dan cybersecurity terbuka untuk fresh graduate. Catatan: AI mengotomasi entry-level coding — yang bertahan adalah yang bisa mengawasi sistem AI.', badge: 'Shortage — Bank Dunia, Kominfo' },
  ],
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
      source: 'Pernyataan kebijakan fiskal dan investasi SDM, 2025',
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
  headline: 'Sekarang, kenali dirimu.',
  subtext: {
    siswa: 'Asesmen minat dan kepribadian yang dirancang untuk konteks Indonesia. Gratis.',
    orangtua: 'Bisa diisi sendiri, atau bersama anak.',
    gurubk: 'Tersedia juga mode kelas untuk digunakan bersama siswa.',
  } as Record<Persona, string>,
  button: { label: 'Mulai asesmen', disabled: true },
  waitlist: {
    headline: 'Asesmen sedang dalam pengembangan.',
    subtext: 'Tim psikologi kami sedang memvalidasi instrumen agar hasilnya bisa dipertanggungjawabkan. Masukkan kontakmu dan kami kabari begitu siap.',
    fields: {
      name: { label: 'Nama', placeholder: 'Nama lengkap' },
      email: { label: 'Email', placeholder: 'email@kamu.com' },
      whatsapp: { label: 'Nomor WhatsApp', placeholder: '08xxxxxxxxxx', note: 'Kami hubungi via WA ketika asesmen siap.' },
    },
    submit: 'Daftarkan saya',
    submitting: 'Menyimpan...',
    successMessage: 'Terdaftar. Kami akan menghubungimu segera setelah asesmen siap.',
    errorMessage: 'Terjadi kesalahan. Coba lagi.',
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
  'OECD State of Global Teenage Career Preparation 2024',
  'Irene Guntur, Psikolog Pendidikan IDF; Indonesia Career Center Network',
  'Jurnal ABKIN; UPI; UNY — Riset kebutuhan guru BK',
  'Permendikbud No. 111/2014; Data Dapodik; EMIS Kemenag',
  'IESR 2024; Bappenas Peta Jalan Tenaga Kerja Hijau 2025',
  'Kemnaker RTKN 2025-2029',
];

export const sourcePrefix = 'Sumber:';
export const dataSourcesLabel = 'Daftar sumber data';
