// All textual content for the /jalan-bakti page. No strings hardcoded in JSX.
// Phase 3 — Kenali Jalan Baktimu. Scope A (E+F). G/H/I menyusul.

export const jalanBaktiContent = {
  // ── Opener (Narasi Pembuka Bakti) ──
  opener: {
    paragraphs: [
      "Allah tidak membutuhkan bakti kita. Justru kita yang membutuhkan jalan untuk menyalurkan bakat dan potensi yang telah diberikan kepada kita.",
      "Setelah kamu mengenal dirimu lebih dalam, sekarang adalah saat yang tepat untuk melihat ke luar. Melihat kebutuhan di sekitarmu. Bukan untuk membebani, melainkan untuk menemukan di mana tempatmu bisa memberi makna.",
      "Apa yang bermanfaat bagi banyak orang biasanya akan lebih bertahan. Dan setiap peran yang dijalani dengan sungguh-sungguh, sudah memiliki arti yang mendalam.",
      "Mau melihat lebih jauh?",
    ],
  },

  // ── Touchpoint sebelum Jalan Bakti: QS Hud 61 ──
  tpHud61: {
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
      "Selama lebih dari 50 tahun, para pemimpin, ilmuwan, dan diplomat dunia terus duduk bersama menanyakan satu hal yang sama: dari sekian banyak masalah, mana yang paling penting bagi umat manusia — dan mana yang harus didahulukan?",
      "Percakapan itu dimulai di Stockholm tahun 1972, berlanjut lewat Laporan Brundtland, hingga lahir 17 Tujuan Pembangunan Berkelanjutan (SDGs) pada 2015 — kesepakatan pertama yang berlaku untuk semua negara, bukan hanya negara miskin.",
      "Jadi ini bukan daftar tugas yang turun begitu saja. Ini hasil percakapan panjang manusia tentang apa yang paling dibutuhkan — dan percakapan itu belum selesai.",
    ],

    urgensi: [
      "Lima tahun menjelang tenggat 2030, PBB menyebut keadaannya \"darurat pembangunan\": hanya sekitar sepertiga target yang berjalan baik, dan sebagian justru mundur dari titik awal.",
      "Dan yang paling tertinggal di dunia — mengakhiri kelaparan, pendidikan yang layak, air bersih, dan pekerjaan yang adil — justru hal-hal yang paling dekat dengan keseharian kita di sini.",
    ],

    agensi: [
      "Selama ini, santri dan anak madrasah lebih sering diminta mengikuti agenda dunia daripada ikut menyusunnya. Padahal SDGs akan berakhir di 2030 — dan dunia sedang mulai merumuskan apa yang datang setelahnya.",
      "Maukah kamu hanya menonton, atau ikut menjadi salah satu yang merumuskannya?",
    ],

    pascaExpand: {
      title: "Apa yang sedang dibicarakan untuk setelah 2030?",
      items: [
        "Tata kelola kecerdasan buatan (AI) dan data",
        "Batas-batas planet (planetary boundaries) — ambang aman bumi",
        "Ekonomi yang adil secara sosial sekaligus ekologis",
      ],
      closer: "Generasi inilah yang akan diminta menentukan, bukan sekadar mengikuti.",
    },

    chipPrompt: "Dari yang sedang diperjuangkan dunia, mana yang paling menggugah hatimu?",

    items: [
      { id: "sdg2", label: "SDG 2 — Tanpa Kelaparan" },
      { id: "sdg3", label: "SDG 3 — Kehidupan Sehat" },
      { id: "sdg4", label: "SDG 4 — Pendidikan Berkualitas" },
      { id: "sdg6", label: "SDG 6 — Air Bersih & Sanitasi" },
      { id: "sdg8", label: "SDG 8 — Pekerjaan Layak" },
    ],

    transisiIndonesia: "Tujuan-tujuan besar itu terasa jauh — sampai kita menurunkannya ke tanah sendiri. Inilah wajah kebutuhan itu di Indonesia. Bukan angka, tapi orang-orang nyata.",
  },

  // ── 6 Klaster Jalan Bakti ──
  klasterIntro: "Di balik setiap kebutuhan besar, ada wajah-wajah manusia. Mana yang paling menggerakkan hatimu? Tandai yang terasa dekat.",
  klaster: [
    {
      id: "k1",
      nama: "Kesehatan & Kesejahteraan",
      bridge: "Pernahkah kamu/orang yang kamu sayangi kesulitan mendapat pertolongan saat sakit? Bayangkan ada orang yang hadir di momen itu — kompeten, dan benar-benar peduli.",
      subTantangan: [
        { id: "k1a", label: "Nakes yang bekerja sendirian" },
        { id: "k1b", label: "Remaja yang menanggung sendiri" },
        { id: "k1c", label: "Tumbuh kembang yang tertunda" },
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
        { id: "k2c", label: "Belajar tanpa pembimbing" },
      ],
    },
    {
      id: "k3",
      nama: "Keluarga, Anak & Kelompok Rentan",
      bridge: "Ada anak tumbuh tanpa pendampingan, orang tua yang kesepian, tetangga yang butuh lebih dari bantuan materi. Apa yang pernah menggerakkanmu untuk seseorang yang rentan?",
      subTantangan: [
        { id: "k3a", label: "Anak yang belum terjangkau" },
        { id: "k3b", label: "Lansia yang terlupakan" },
        { id: "k3c", label: "Penyandang disabilitas yang terisolasi" },
      ],
    },
    {
      id: "k4",
      nama: "Bumi & Lingkungan",
      bridge: "Kamu hidup di tanah yang kaya — hutan, laut, lahan, energi yang belum dimanfaatkan. Apa yang kamu lihat di sekitarmu yang seharusnya bisa lebih baik?",
      subTantangan: [
        { id: "k4a", label: "Petani yang kalah di pasar" },
        { id: "k4b", label: "Energi yang belum sampai" },
        { id: "k4c", label: "Ruang untuk perempuan" },
      ],
    },
    {
      id: "k5",
      nama: "Ekonomi Adil & Keuangan",
      bridge: "Jutaan orang bekerja keras tapi tetap kesulitan — bukan karena malas, tapi sistemnya belum berpihak. Apa yang kamu lihat di keluarga/komunitasmu soal ini?",
      subTantangan: [
        { id: "k5a", label: "UMKM yang butuh panduan" },
        { id: "k5b", label: "Keuangan yang belum selaras nilai" },
        { id: "k5c", label: "Zakat dan wakaf yang belum optimal" },
      ],
    },
    {
      id: "k6",
      nama: "Pangan, Air & Keberlanjutan",
      bridge: "Indonesia mengimpor pangan di tanah subur. Petani kalah di pasar. Apa yang bisa berbeda jika ada orang muda yang paham, peduli, dan mau terlibat langsung?",
      subTantangan: [
        { id: "k6a", label: "Petani muda yang tidak ada" },
        { id: "k6b", label: "Nilai tambah yang hilang di tengah jalan" },
        { id: "k6c", label: "Ketahanan pangan yang rapuh" },
        {
          id: "k6d",
          label: "Air yang belum sampai",
          detail: "Masih ada desa di tanah yang kaya air ini yang warganya kesulitan mendapat air bersih. Sumbernya sering ada — yang belum ada adalah orang yang tahu cara mengelola dan menjaganya. Ini bukan soal teknik semata, tapi kehidupan sehari-hari yang bergantung padanya.",
        },
      ],
    },
  ],

  // ── Closing refleksi bebas ──
  closing: {
    prompt: "Ceritakan: kamu ingin berbakti seperti apa? Bermanfaat untuk siapa?",
    placeholder: "Tulis sebebasnya...",
  },

  ui: {
    pageTitle: "Kenali Jalan Baktimu",
    sdgSectionTitle: "Kebutuhan Umat Manusia",
    klasterSectionTitle: "Enam Jalan Bakti",
    closingSectionTitle: "Refleksimu",
    saveLabel: "Simpan",
    savedToast: "Catatan tersimpan ✓",
    errorToast: "Gagal menyimpan, coba lagi",
  },
} as const;
