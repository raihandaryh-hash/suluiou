// All textual content for the /jalan-bakti page. No strings hardcoded in JSX.
// Phase 3, Kenali Jalan Baktimu. Scope A (E+F). G/H/I menyusul.

export const jalanBaktiContent = {
  // ── Murajaah (full-circle): recall perjalanan + namai dilema + hook "temukan posisimu". ──
  // Crescendo "bermanfaat→bertahan" SENGAJA dibuang (duplikat opener lama). Bomb/kesimpulan = Hud 61.
  // Jejak: Mukadimah Al-Kahf 18:68 + analogi tim; /insight (lihat dunia); Kenali Diri (lihat diri).
  murajaah: {
    paragraphs: [
      "Kamu sudah menempuh perjalanan yang tidak sebentar. Di awal, kita sempat bilang bahwa sulit menghadapi sesuatu yang belum dikenal. Sejak itu, kamu sudah melihat wajah dunia yang berubah cepat, dan sudah menengok ke dalam, mengenali bekal yang Allah titipkan padamu.",
      "Mungkin kepalamu masih penuh pertanyaan: mau ambil jurusan apa, kerja dulu atau kuliah, di tengah biaya yang tidak murah. Itu wajar. Tapi sekarang kamu tidak lagi menebak dalam gelap.",
      "Di awal kita juga menyebut perumpamaan tim, bahwa tiap orang punya posisi sesuai kelebihannya. Sekarang, giliranmu menemukan posisimu.",
    ],
  },

  // ── Opener (Narasi Pembuka Bakti) ──
  opener: {
    paragraphs: [
      "Allah tidak membutuhkan bakti kita. Justru kita yang membutuhkan jalan untuk menyalurkan bakat dan potensi yang telah diberikan kepada kita.",
      "Setelah kamu mengenal dirimu lebih dalam, sekarang adalah saat yang tepat untuk melihat ke luar. Melihat kebutuhan di sekitarmu. Bukan untuk membebani, melainkan untuk menemukan di mana tempatmu bisa memberi makna.",
      "Apa yang bermanfaat bagi banyak orang biasanya akan lebih bertahan. Setiap peran yang dijalani dengan sungguh-sungguh pun memiliki arti yang mendalam.",
      "Mau melihat lebih jauh?",
    ],
  },

  // ── Touchpoint sebelum Jalan Bakti: QS Hud 61 ──
  tpHud61: {
    lead: "Pertanyaan itu sebetulnya sudah terjawab sejak awal kamu diciptakan.",
    ayat: "\"Dia telah menciptakan kamu dari bumi (tanah) dan menjadikan kamu pemakmurnya.\"",
    rujukan: "QS Hud: 61",
    framing: "Sejak awal kamu sudah diberi tugas: memakmurkan bumi, bukan sekadar menempatinya.",
  },

  // ── SDGs Section ──
  sdg: {
    tpAyat: "\"Kami menjadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal.\"",
    tpRujukan: "QS Al-Hujurat: 13",
    tpFraming: "Perbedaan bukan hambatan; itu desain Allah agar kita saling melengkapi.",

    sejarah: [
      "Selama lebih dari 50 tahun, para pemimpin, ilmuwan, dan diplomat dunia terus duduk bersama menanyakan satu hal yang sama: dari sekian banyak masalah, mana yang paling penting bagi umat manusia, dan mana yang harus didahulukan?",
      "Percakapan itu dimulai di Stockholm tahun 1972, berlanjut lewat Laporan Brundtland, hingga lahir 17 Tujuan Pembangunan Berkelanjutan (SDGs) pada 2015, kesepakatan pertama yang berlaku untuk semua negara, bukan hanya negara miskin.",
      "Jadi ini bukan daftar tugas yang turun begitu saja. Ini hasil percakapan panjang manusia tentang apa yang paling dibutuhkan, dan percakapan itu belum selesai.",
    ],

    urgensi: [
      "Lima tahun menjelang tenggat 2030, PBB menyebut keadaannya \"darurat pembangunan\": hanya sekitar sepertiga target yang berjalan baik, dan sebagian justru mundur dari titik awal.",
      "Yang paling tertinggal di dunia, mengakhiri kelaparan, pendidikan yang layak, air bersih, dan pekerjaan yang adil, justru hal-hal yang paling dekat dengan keseharian kita di sini.",
    ],

    agensi: [
      "Selama ini, santri dan anak madrasah lebih sering diminta mengikuti agenda dunia daripada ikut menyusunnya. Padahal SDGs akan berakhir di 2030, dan dunia sedang mulai merumuskan apa yang datang setelahnya.",
      "Maukah kamu hanya menonton, atau ikut menjadi salah satu yang merumuskannya?",
    ],

    pascaExpand: {
      title: "Apa yang sedang dibicarakan untuk setelah 2030?",
      items: [
        "Tata kelola kecerdasan buatan (AI) dan data",
        "Batas-batas planet (planetary boundaries), ambang aman bumi",
        "Ekonomi yang adil secara sosial sekaligus ekologis",
      ],
      closer: "Generasi inilah yang akan diminta menentukan, bukan sekadar mengikuti.",
    },

    chipPrompt: "Dari yang sedang diperjuangkan dunia, mana yang paling menggugah hatimu?",
    lensNote: "SDG hanyalah satu lensa untuk membaca kebutuhan dunia, bukan daftar lengkapnya. Anggap ini pintu masuk, bukan batas.",

    items: [
      { id: "sdg2", label: "SDG 2, Tanpa Kelaparan" },
      { id: "sdg3", label: "SDG 3, Kehidupan Sehat" },
      { id: "sdg4", label: "SDG 4, Pendidikan Berkualitas" },
      { id: "sdg6", label: "SDG 6, Air Bersih & Sanitasi" },
      { id: "sdg8", label: "SDG 8, Pekerjaan Layak" },
    ],

    transisiIndonesia: "Tujuan-tujuan besar itu terasa jauh, sampai kita menurunkannya ke tanah sendiri. Inilah wajah kebutuhan itu di Indonesia. Bukan angka, tapi orang-orang nyata.",
  },

  // ── 6 Klaster Jalan Bakti ──
  klasterIntro: "Tujuh medan. Pilih satu untuk kamu telusuri lebih dulu. Ini bukan keputusan seumur hidup, kamu bisa kembali dan memilih yang lain kapan saja.",

  // ── GERAKAN 2 · PAHAMI — tampar 10-jobs (horizon broadening). Statik, muncul setelah medan dipilih. ──
  // Jejak: OECD dream-jobs (PISA 2022, ~690rb remaja/81 negara, aspirasi menumpuk di ~10 pekerjaan). NO OVERCLAIM.
  gerakan2: {
    sectionTitle: "Lihat Lebih Dekat",
    tampar: [
      "Ada satu temuan yang mengejutkan. Sebuah riset ke ratusan ribu remaja di puluhan negara menemukan pola yang sama berulang: hampir separuh dari mereka membayangkan masa depan hanya di sekitar sepuluh pekerjaan yang itu-itu saja. Dokter, guru, polisi, pegawai negeri. Bukan karena pilihan lain tidak ada, tapi karena yang lain jarang terlihat.",
      "Padahal satu bidang bukan satu pintu. Ambil kesehatan: bukan hanya dokter yang duduk di poli. Ada yang meneliti wabah sebelum ia menyebar, ada yang merancang alat agar operasi lebih aman, ada yang memastikan gizi anak-anak di desa tercukupi. Satu medan, banyak peran, dan tiap peran menuntut kekuatan yang berbeda.",
      "Di sinilah yang kamu kenali tentang dirimu jadi penting. Peran yang menuntut ketelitian analitis berbeda dari peran yang menuntut ketangguhan menghadapi orang di saat genting. Bukan soal medan mana yang paling benar, melainkan peran mana yang paling pas dengan bekalmu.",
    ],
    bridge: "Peran mana itu belum harus kamu putuskan sekarang. Cukup sadari dulu bahwa ruangnya jauh lebih luas dari yang terlihat.",
  },
  klaster: [
    {
      id: "k1",
      nama: "Kesehatan & Kesejahteraan",
      bridge: "Pernahkah kamu/orang yang kamu sayangi kesulitan mendapat pertolongan saat sakit? Bayangkan ada orang yang hadir di momen itu, kompeten, dan benar-benar peduli.",
      subTantangan: [
        { id: "k1a", label: "Tenaga kesehatan yang bertugas sendirian di pelosok" },
        { id: "k1b", label: "Remaja yang memendam masalahnya sendirian" },
        { id: "k1c", label: "Balita yang kekurangan gizi di usia emasnya" },
      ],
    },
    {
      id: "k2",
      nama: "Pendidikan & Ilmu",
      bridge: "Siapa yang pernah membukakan dunia baru bagimu lewat ilmu? Bayangkan kamu bisa menjadi orang itu bagi orang lain.",
      subTantangan: [
        { id: "k2a", label: "Guru yang kelelahan" },
        {
          id: "k2b",
          label: "Al-Qur'an yang belum terbaca",
          detail: "Menurut riset IIQ Jakarta (2024), lebih dari 7 dari 10 Muslim Indonesia belum membaca Al-Qur'an dengan baik. Yang paling siap mengisi kekosongan ini adalah orang-orang seperti kamu yang punya bekal ilmu agama.",
        },
        { id: "k2c", label: "Murid yang belajar tanpa ada yang membimbing" },
      ],
    },
    {
      id: "k3",
      nama: "Keluarga, Anak & Kelompok Rentan",
      bridge: "Ada anak tumbuh tanpa pendampingan, orang tua yang kesepian, tetangga yang butuh lebih dari bantuan materi. Apa yang pernah menggerakkanmu untuk seseorang yang rentan?",
      subTantangan: [
        { id: "k3a", label: "Anak terlantar yang luput dari perhatian" },
        { id: "k3b", label: "Lansia yang terlupakan" },
        { id: "k3c", label: "Penyandang disabilitas yang terisolasi" },
      ],
    },
    {
      id: "k4",
      nama: "Bumi & Lingkungan",
      bridge: "Kamu hidup di tanah yang kaya, hutan, laut, lahan, energi yang belum dimanfaatkan. Apa yang kamu lihat di sekitarmu yang seharusnya bisa lebih baik?",
      subTantangan: [
        { id: "k4a", label: "Sungai yang penuh sampah" },
        { id: "k4b", label: "Energi bersih melimpah yang belum tergarap" },
        { id: "k4c", label: "Desa yang belum siap saat bencana datang" },
      ],
    },
    {
      id: "k5",
      nama: "Ekonomi Adil & Keuangan",
      bridge: "Jutaan orang bekerja keras tapi tetap kesulitan, bukan karena malas, tapi sistemnya belum berpihak. Apa yang kamu lihat di keluarga/komunitasmu soal ini?",
      subTantangan: [
        { id: "k5a", label: "Usaha kecil tetangga yang jalan di tempat" },
        { id: "k5b", label: "Keluarga yang ingin lepas dari riba" },
        { id: "k5c", label: "Zakat dan wakaf yang baru tergarap sebagian kecilnya" },
        { id: "k5d", label: "Pemuda seusiamu yang tidak sekolah dan tidak bekerja" },
      ],
    },
    {
      id: "k6",
      nama: "Pangan, Air & Keberlanjutan",
      bridge: "Indonesia mengimpor pangan di tanah subur. Apa yang bisa berbeda jika ada orang muda yang paham, peduli, dan mau terlibat langsung?",
      subTantangan: [
        { id: "k6a", label: "Sawah yang ditinggal anak mudanya" },
        { id: "k6b", label: "Hasil bumi dijual mentah, untungnya mengalir ke tempat lain" },
        { id: "k6c", label: "Meja makan yang bergantung pada impor" },
        {
          id: "k6d",
          label: "Air bersih yang belum mengalir ke semua rumah",
          detail: "Masih ada desa di tanah yang kaya air ini yang warganya kesulitan mendapat air bersih. Sumbernya sering ada, yang belum ada adalah orang yang tahu cara mengelola dan menjaganya. Ini bukan soal teknik semata, tapi kehidupan sehari-hari yang bergantung padanya.",
        },
      ],
    },
    {
      // K7 — ACC 4 Jul. Jejak: Research Drop 8 Jun (brain-drain desa → medan Kepemimpinan),
      // stream Umara IGS, muara jalur diplomasi/hukum/kebijakan world-layer.
      // Data kepala desa/BUMDes SENGAJA belum dipakai (🔲 Evidence Pass) — copy tanpa angka.
      id: "k7",
      nama: "Kepemimpinan & Tata Kelola",
      bridge: "Banyak tempat tidak kekurangan orang pintar, tapi kekurangan orang yang mau mengurus dengan amanah. Pernahkah kamu melihat desa, sekolah, atau lembaga yang jalan di tempat hanya karena tidak ada yang memimpinnya sungguh-sungguh?",
      subTantangan: [
        { id: "k7a", label: "Desa yang ditinggal calon pemimpin mudanya" },
        { id: "k7b", label: "Lembaga umat yang dikelola seadanya" },
        { id: "k7c", label: "Suara warga yang tidak sampai ke pengambil keputusan" },
      ],
    },
  ],

  lensaKepedulian: {
    pivot: "Tadi kamu melihat tujuh medan tantangan. Di balik semuanya, selalu ada satu hal yang sama: ada manusia yang paling rentan, yang paling butuh diulurkan tangan.",

    hadith: {
      teks: "Carikan aku orang-orang lemah di antara kalian. Sungguh kalian diberi rezeki dan ditolong sebab orang-orang lemah di antara kalian.",
      rujukan: "HR Abu Dawud (sahih)",
      framing: "Menolong yang lemah bukan kebaikan dari atas ke bawah. Justru rezeki dan pertolonganmu datang lewat mereka. Mereka bukan beban, mereka pintu keberkahan.",
    },

    elicitation: "Dari semua ini, siapa yang paling menggerakkan hatimu untuk ditolong?",

    tier1Title: "Islam sudah lama punya peta tentang siapa yang paling berhak ditolong, delapan golongan penerima zakat (QS At-Tawbah: 60).",
    tier1Items: [
      { id: "fakir", label: "Fakir", desc: "nyaris tak punya apa-apa" },
      { id: "miskin", label: "Miskin", desc: "punya, tapi tak cukup" },
      { id: "amil", label: "Amil", desc: "pengurus zakat" },
      { id: "muallaf", label: "Muallaf", desc: "yang sedang dikuatkan keislamannya" },
      { id: "riqab", label: "Riqab", desc: "membebaskan dari perbudakan" },
      { id: "gharimin", label: "Gharimin", desc: "yang terlilit utang" },
      { id: "fisabilillah", label: "Fi sabilillah", desc: "di jalan Allah" },
      { id: "ibnusabil", label: "Ibnu sabil", desc: "musafir yang kehabisan bekal" },
    ],

    tier2Intro: "Negara kita mengenali 26 bentuk kerentanan, dari anak terlantar, lansia tanpa keluarga, penyandang disabilitas, hingga korban kekerasan. Dulu disebut \"penyandang masalah\"; kini diganti jadi \"pemerlu pelayanan\", karena tak seorang pun pantas dicap \"masalah\".",
    tier2Wajah: [
      { id: "ppks_anak", label: "Anak terlantar" },
      { id: "ppks_lansia", label: "Lansia tanpa keluarga" },
      { id: "ppks_disabilitas", label: "Penyandang disabilitas" },
      { id: "ppks_korban", label: "Korban kekerasan" },
    ],
    tier2ExpandTitle: "Lihat 26 kategori (PPKS, Kemensos)",
    tier2Kategori: [
      "Anak Balita Terlantar", "Anak Terlantar", "Anak yang Berhadapan dengan Hukum",
      "Anak Jalanan", "Anak dengan Kedisabilitasan",
      "Anak yang Menjadi Korban Tindak Kekerasan atau Diperlakukan Salah",
      "Anak yang Memerlukan Perlindungan Khusus", "Lanjut Usia Terlantar",
      "Penyandang Disabilitas", "Tuna Susila", "Gelandangan", "Pengemis", "Pemulung",
      "Kelompok Minoritas", "Bekas Warga Binaan Lembaga Pemasyarakatan",
      "Orang dengan HIV/AIDS (ODHA)", "Korban Penyalahgunaan NAPZA", "Korban Trafficking",
      "Korban Tindak Kekerasan", "Pekerja Migran Bermasalah Sosial", "Korban Bencana Alam",
      "Korban Bencana Sosial", "Perempuan Rawan Sosial Ekonomi", "Fakir Miskin",
      "Keluarga Bermasalah Sosial Psikologis", "Komunitas Adat Terpencil",
    ],

    routeback: "Kepedulianmu pada mereka bisa kamu wujudkan lewat jalan bakti yang tadi kamu tandai.",
    penutup: "Inilah inti bakti: bukan merasa lebih tinggi, tapi sadar bahwa kemuliaanmu justru tumbuh saat kamu mengangkat yang lemah.",
  },

  // ── GERAKAN 3 · DESAIN — generator langkah eksplorasi (bukan completion). ──
  // Jejak: T-shaped → skill-map "fungsi manusia berubah/human skills langka" + WEF FoJ 2025.
  // 4 payung → OECD Exploring+Experiencing + Stanford prototyping + skill-map "nyemplung".
  gerakan3: {
    sectionTitle: "Rancang Langkah Pertamamu",
    // Leverage beat — jejak: GoTo Annual Report 2024 (~3 juta mitra pengemudi, tervalidasi 4 Jul);
    // Celio, Durlak & Dymnicki 2011 (meta-analisis 62 studi service-learning: kepemimpinan &
    // problem-solving naik terukur). Kalimat kunci ketegangan G3 dari lock 3 Jul:
    // "Langkah pertamamu boleh kecil. Tujuanmu tidak harus kecil."
    intro: [
      "Sebelum merancang langkah, satu hal soal ukuran mimpi. Dulu, membantu jutaan orang butuh membangun perusahaan raksasa lebih dahulu. Hari ini, satu aplikasi yang lahir dari keresahan tentang tukang ojek yang menunggu penumpang telah tumbuh menjadi penghidupan bagi sekitar tiga juta mitra pengemudi dan keluarga mereka.",
      "Teknologi, termasuk AI yang sedang kamu saksikan, terus menurunkan biaya membangun solusi. Karya yang menjangkau banyak orang tidak lagi hanya milik segelintir orang bermodal besar. Langkah pertamamu boleh kecil. Tujuanmu tidak harus kecil.",
      "Langkah kecil itu sendiri bukan basa-basi. Penelitian terhadap ribuan pelajar yang terjun langsung melayani masyarakat menemukan hal yang sama berulang: kepemimpinan dan kemampuan memecahkan masalah mereka tumbuh terukur. Bergerak itu sendiri yang menumbuhkan.",
      "Satu hal sebelum melangkah. Peran yang menarik hatimu bukan kotak yang mengurungmu. Jurusan atau keahlian yang nanti kamu ambil hanyalah satu fondasi. Di atasnya, kamu terus merakit dirimu: menambah keterampilan lain, membangun karya, terjun ke komunitas.",
      "Zaman ini justru paling membutuhkan orang yang punya kedalaman sekaligus keluasan. Jadi langkah pertama ini bukan untuk mengunci pilihan, melainkan untuk mulai bergerak.",
      "Cara tercepat mengenal sebuah peran bukan dengan memikirkannya lama-lama, tapi dengan mendekat. Berikut empat cara nyata untuk mulai. Pilih yang paling terjangkau untukmu.",
    ],
    payung: [
      {
        id: "temui",
        judul: "Temui orangnya",
        ajakan: "Cari satu orang yang benar-benar menjalani peran ini, lewat gurumu, alumni, atau media sosial.",
        ekstrovert: "Kalau kamu berani, sapa langsung dan tanya bagaimana ia memulai.",
        introvert: "Kalau menyapa terasa berat, cukup baca atau tonton satu kisah mereka dulu.",
        langkahDefault: "Menghubungi atau mencari kisah satu orang yang bekerja sebagai {peran}. Kapan: [isi hari & jamnya]. Lewat: [guru, alumni, atau media sosial].",
      },
      {
        id: "selami",
        judul: "Selami bidangnya",
        ajakan: "Habiskan tiga puluh menit menyelami peran ini sampai kamu paham sehari-harinya.",
        ekstrovert: "Ikut diskusi atau forum tempat orang-orang bidang ini berkumpul.",
        introvert: "Tonton atau baca mendalam, atau tanyakan ke AI dengan pertanyaan yang sudah kami siapkan.",
        langkahDefault: "Menyelami peran {peran} selama tiga puluh menit lewat bacaan, video, atau AI. Kapan: [isi hari & jamnya].",
      },
      {
        id: "bangun",
        judul: "Bangun bekalnya",
        ajakan: "Peran ini menuntut kekuatan tertentu yang tadi kamu lihat di kartunya. Mulai bangun dari sekarang.",
        ekstrovert: "Ikut ekskul atau komunitas yang melatih kekuatan itu.",
        introvert: "Ambil satu kursus daring gratis dan kerjakan pelan-pelan.",
        langkahDefault: "Mencari satu ekskul, komunitas, atau kursus untuk bekal peran {peran}. Kapan: [isi hari & jamnya]. Di mana: [isi tempat/platform].",
      },
      {
        id: "cebur",
        judul: "Cebur sebentar",
        ajakan: "Coba rasakan langsung, walau hanya sebentar.",
        ekstrovert: "Jadi relawan sehari atau ikut acara yang berkaitan dengan medan ini.",
        introvert: "Amati dari dekat dulu, temani seseorang yang sedang mengerjakannya.",
        langkahDefault: "Mengikuti satu kegiatan nyata di medan {medan}, walau sebentar. Kapan: [isi hari]. Di mana: [isi tempatnya].",
      },
    ],
    pitchJudul: "Pesan pembuka yang bisa kamu kirim",
    pitch: "Assalamualaikum, saya [nama kamu], seorang siswa yang sedang menjajaki bidang {medan}. Saya melihat Kakak menjalani peran sebagai {peran}. Bolehkah saya bertanya sedikit tentang bagaimana Kakak memulainya? Terima kasih banyak.",
    queriesJudul: "Kata kunci untuk kamu telusuri",
    queries: [
      "cara menjadi {peran} di Indonesia",
      "sehari-hari kerja {peran}",
      "{peran} belajar apa dulu",
    ],
    aiPromptJudul: "Atau tanyakan ini ke AI",
    aiPrompt: "Jelaskan peran {peran} untuk siswa SMA: apa yang dikerjakan sehari-hari, kekuatan yang dibutuhkan, dan langkah pertama untuk mulai mendekatinya.",
    bridge: "Dari empat cara di atas, mana satu langkah kecil yang paling mungkin kamu lakukan minggu ini? Langkah yang punya waktu dan tempat yang jelas jauh lebih mungkin benar-benar terjadi, jadi tuliskan kapan dan di mananya.",
    langkahNudge: "Pilih satu, atau maksimal dua kalau kamu memang siap. Satu langkah yang benar-benar kamu jalankan lebih berharga daripada banyak yang cuma jadi niat.",
    langkahPlaceholder: "Tulis satu langkah kecilmu, lengkap dengan kapan dan di mana kamu akan melakukannya. Atau ketuk salah satu cara di atas untuk memulai...",
    bridgeAksi: "Simpan langkahmu. Nanti di Rencana Aksi, kita ubah jadi komitmen yang benar-benar bisa kamu jalankan.",
  },

  // ── Closing refleksi sintesis ──
  closing: {
    intro: "Kamu sudah menjelajah jauh: mengenal dirimu, melihat kebutuhan dunia, dan menemukan siapa yang ingin kamu tolong. Sekarang, satukan semuanya.",
    scaffoldTitle: "Sebelum menulis, renungkan empat hal ini:",
    scaffold: [
      { q: "Apa kekuatanku?", cue: "yang kamu temukan saat mengenali dirimu" },
      { q: "Apa yang aku sukai?", cue: "hal yang membuatmu merasa hidup" },
      { q: "Apa yang perlu kukembangkan?", cue: "agar kamu lebih siap memberi" },
      { q: "Kontribusi apa yang ingin kuberikan?", cue: "untuk klaster & kelompok yang tadi kamu tandai" },
    ],
    prompt: "Ceritakan: kamu ingin berbakti seperti apa? Bermanfaat untuk siapa?",
    placeholder: "Tulis sebebasnya...",
  },

  ui: {
    pageTitle: "Kenali Jalan Baktimu",
    sdgSectionTitle: "Kebutuhan Umat Manusia",
    klasterSectionTitle: "Tujuh Jalan Bakti",
    lensaSectionTitle: "Siapa yang Ingin Kamu Tolong?",
    closingSectionTitle: "Refleksimu",
    saveLabel: "Simpan",
    savedToast: "Catatan tersimpan ✓",
    errorToast: "Gagal menyimpan, coba lagi",

    // ── STEPPER (baru, mekanis Sonnet — 🔲 SEMUA field di bawah menunggu review/isi Fable, BUKAN diisi dari memori) ──
    stepLanjutLabel: "🔲", // label tombol "Lanjut" antar step
    stepKembaliLabel: "🔲", // label tombol "Kembali" antar step
    stepLabels: {
      1: "🔲", // label progress step 1 — G1 Dengar
      2: "🔲", // label progress step 2 — G2 Pahami
      3: "🔲", // label progress step 3 — G3 Desain
      4: "🔲", // label progress step 4 — Penutup
    },
  },
} as const;
