// Phase 2A — Kenali Yang Sudah Ada (Tafakkur Journaling)
// Copy diekstrak dari KenaliDirimu.tsx (editable-ready). Dalil/terjemah = verbatim.
// Voice: kakak senior (10 Prinsip, arch 11B). Penutup syukur tetap inline di komponen (dalil ber-<em>).

export type Prompt = { id: string; question: string; starter: string; minH?: string };
export type Domain = { id: string; title: string; subtitle: string; prompts: Prompt[] };

export const kenaliDirimuContent = {
  progressSuffix: "dari 4 domain selesai",

  pembuka: {
    ayatLead: "Allah berjanji:",
    ayat: "\"Sesungguhnya jika kamu bersyukur, niscaya Aku akan menambah (nikmat) kepadamu...\"",
    ayatRef: "— QS Ibrahim: 7",
    intro:
      "Mensyukuri dimulai dari mengenali. Barangkali ada nikmat yang belum kamu sadari sepenuhnya. Di sini, mari kita ingat dan petakan bersama.",
    h1: "Kenali Yang Sudah Ada",
    h1sub:
      "Ini bukan untuk menilai dirimu, melainkan untuk mensyukuri modal yang sudah Allah titipkan untuk jalan gerakmu ke depan.",
  },

  hilman:
    "\"Rasulullah \uFDFA mengingatkan: di dalam tubuh ada segumpal daging. Bila ia baik, baiklah seluruh tubuh. Dari sana kita mulai.\"",

  domainsGroup: {
    kicker: "Inti",
    heading: "Empat Domain Dirimu",
    line: "Empat sisi modal yang sudah Allah titipkan. Kenali satu per satu, tanpa terburu-buru.",
  },

  domains: [
    {
      id: "d1",
      title: "Fondasi Keimanan",
      subtitle:
        "Fondasi imanmu adalah nikmat yang paling mendasar. Di sini kamu mengingat apa yang sudah ada: ayat yang menguatkan, pemahaman yang membimbing, dan kebiasaan yang menopang.",
      prompts: [
        {
          id: "d1_q1",
          question:
            "Ayat, doa, atau momen ibadah mana yang paling sering membawa ketenangan saat hatimu terasa berat?",
          starter: "Yang paling sering membawa ketenangan bagi saya adalah...",
        },
        {
          id: "d1_q2",
          question:
            "Pemahaman atau nilai dalam Islam mana yang paling melekat dalam dirimu, yang memberi arah ketika kamu bimbang, atau kekuatan ketika kamu hampir menyerah?",
          starter: "Pemahaman atau nilai dalam Islam yang paling melekat dan membimbing saya adalah...",
        },
        {
          id: "d1_q3",
          question:
            "Rutinitas amal apa yang biasanya memberi kamu ketenangan dan kekuatan di hari-hari biasa?",
          starter: "Rutinitas amal yang biasanya memberi saya ketenangan dan kekuatan adalah...",
        },
      ],
    },
    {
      id: "d2",
      title: "Karakter dan Keterampilan Latent",
      subtitle:
        "Setiap orang diciptakan dengan kekuatan dan cara kerja yang unik. Di sini kamu akan mengenali pola yang sudah ada dalam dirimu.",
      prompts: [
        {
          id: "d2_q1",
          question:
            "Pernahkah kamu mengerjakan sesuatu yang terasa mudah, mengalir, dan merasa 'ini saya banget', sangat cocok dan terasa benar? Apa yang sedang kamu lakukan saat itu, dan kenapa rasanya begitu?",
          starter: "Momen ketika saya merasa 'ini saya banget' dan semuanya terasa mengalir adalah...",
        },
        {
          id: "d2_q2",
          question:
            "Hal apa yang sering orang lain perhatikan atau komentari tentang cara kamu bekerja atau berinteraksi, bahkan orang yang baru saja mengenalmu?",
          starter: "Yang sering orang perhatikan tentang saya, bahkan yang baru mengenal saya, adalah...",
        },
        {
          id: "d2_q3",
          question:
            "Di sekolah, ekskul, atau komunitas, peran atau tugas apa yang paling cocok dengan cara kamu biasanya bekerja?",
          starter: "Peran atau tugas yang paling cocok dengan cara kerja saya adalah...",
        },
      ],
    },
    {
      id: "d3",
      title: "Modal Relasional",
      subtitle:
        "Orang tua, guru, dan sahabat sering melihat kekuatanmu lebih jelas dari yang kamu rasakan sendiri. Mereka adalah cermin yang sudah Allah hadirkan dalam hidupmu.",
      prompts: [
        {
          id: "d3_q1",
          question:
            "Siapa yang pernah mengatakan sesuatu positif tentang cara kerjamu atau kemampuanmu? Ceritakan apa yang mereka katakan.",
          starter:
            "Yang pernah memberi komentar tentang kemampuan atau cara kerja saya adalah... dan mereka mengatakan...",
        },
        {
          id: "d3_q2",
          question:
            "Pernahkah seseorang mengatakan sesuatu tentang kemampuanmu yang membuatmu menyadari sesuatu tentang dirimu yang belum pernah terpikir sebelumnya?",
          starter: "Yang membuat saya menyadari sesuatu baru tentang diri saya adalah...",
        },
        {
          id: "d3_q3",
          question:
            "Bagaimana kamu biasanya memberi manfaat kepada keluarga atau komunitas lewat hal-hal yang kamu kuasai?",
          starter: "Saya biasanya memberi manfaat kepada keluarga atau komunitas dengan...",
        },
      ],
    },
    {
      id: "d4",
      title: "Adaptabilitas Karier",
      subtitle:
        "Allah menjanjikan bahwa bersama setiap kesulitan ada kemudahan. Kamu akan menuliskan masa depan yang kamu impikan sekaligus yang ingin kamu hindari. Keduanya akan membantumu lebih terarah dan yakin.",
      prompts: [
        {
          id: "d4_q1",
          question:
            "Bayangkan lima tahun mendatang. Kehidupan seperti apa yang ingin kamu bangun bersama keluarga dan komunitas?",
          starter: "Lima tahun mendatang, yang ingin saya bangun bersama keluarga dan komunitas adalah...",
        },
        {
          id: "d4_q2",
          question:
            "Hal apa yang ingin kamu hindari di masa depan agar tetap selaras dengan nilai dan tanggung jawabmu?",
          starter: "Yang ingin saya hindari di masa depan adalah...",
        },
        {
          id: "d4_q3",
          question:
            "Ketika kamu menghadapi ketidakpastian tentang masa depan, apa yang biasanya memberimu keyakinan untuk tetap bergerak?",
          starter: "Yang biasanya memberi saya keyakinan untuk tetap bergerak menghadapi ketidakpastian adalah...",
        },
      ],
    },
  ] satisfies Domain[],

  pelengkapGroup: {
    kicker: "Pelengkap",
    heading: "Yang Belum Tertangkap",
    line: "Sisi yang mungkin terlewat dari empat domain di atas. Catat selagi teringat.",
  },

  nikmatLain: {
    id: "free_nikmat",
    label: "Nikmat lain yang ingin kamu catat",
    helper:
      "Ada nikmat lain yang kamu sadari yang belum tercakup di atas? Semuanya adalah nikmat karunia-Nya.",
    placeholder: "Nikmat lain yang saya syukuri adalah...",
  },

  achievement: {
    title: "Catatan Perjalananmu",
    subtitle:
      "Setiap pengalaman yang pernah kamu jalani, dalam organisasi, kegiatan, tugas harian, atau momen membantu orang lain, adalah bagian dari perjalananmu. Catat semuanya di sini, besar atau kecil, peran yang keren maupun yang tidak. Tuliskan sebanyak yang kamu ingat, ini akan menjadi arsip pribadimu dan bahan nyata untuk kariermu ke depan.",
    prompts: [
      {
        id: "ach_q1",
        question:
          "Pengalaman atau kegiatan apa saja yang pernah kamu jalani, di sekolah, komunitas, keluarga, atau di mana saja? Ceritakan peranmu dan apa yang kamu lakukan.",
        starter: "Pengalaman atau kegiatan yang pernah saya jalani adalah...",
        minH: "min-h-[140px]",
      },
      {
        id: "ach_q2",
        question:
          "Pernahkah kamu melakukan sesuatu, sekecil apa pun, dan merasakan bahwa itu memberi manfaat nyata bagi orang lain? Ceritakan.",
        starter: "Momen ketika saya merasa memberi manfaat nyata adalah...",
      },
    ] satisfies Prompt[],
    optional: {
      toggleLabel: "Ada pengalaman sulit yang ternyata mengandung kebaikan? (opsional)",
      prompt: {
        id: "ach_q3",
        question:
          "Pernahkah kamu melewati pengalaman yang terasa berat atau tidak kamu inginkan, tapi belakangan kamu sadari ada kebaikan atau pelajaran di baliknya?",
        starter: "Pengalaman yang awalnya terasa berat tapi belakangan saya syukuri adalah...",
      } satisfies Prompt,
    },
  },

  cerminGroup: {
    kicker: "Cermin",
    heading: "Cermin dari Luar",
    line: "Orang lain sering melihat yang tak kamu sadari. Mintalah pandangan mereka.",
  },

  zaid: {
    body:
      "Zaid bin Tsabit pun awalnya tidak tahu ke mana bakatnya, sampai keluarganya yang mengarahkannya, hingga ia menjadi sekretaris wahyu Rasulullah \uFDFA. Sekarang, coba tunjukkan jawaban-jawabanmu kepada orang tua, guru, atau sahabat dekatmu. Tanyakan:",
    ask: "\"Apa yang kamu lihat sebagai keunggulanku yang mungkin belum aku sadari?\"",
    shareLabel: "Bagikan ke Orang Tua / Guru",
  },

  abu: {
    title: "Yang Paling Jelas Terlihat",
    prompt: {
      id: "abu_q1",
      question:
        "Apa yang sering orang lain perhatikan atau komentari tentang dirimu, hal yang langsung terlihat, bahkan sebelum mereka mengenalmu lebih dalam?",
      starter: "Yang langsung terlihat dari diri saya bahkan sebelum orang mengenal saya lebih dalam adalah...",
    } satisfies Prompt,
  },

  finalFree: {
    id: "final_free",
    label: "Ada yang ingin kamu tambahkan?",
    helper:
      "Ada hal lain tentang dirimu yang belum terjawab di atas? Ini bisa menjadi bahan diskusi dengan orang tua, guru, atau konselor.",
    placeholder: "Tuliskan di sini...",
  },

  // BEAT BARU — Growth Edge (W1 16 Jun). Framing: arch 19.5 (pemimpin berdampak + Zaid/Abu Mahdzurah)
  // + Islamic Growth Mindset (arch). Reflektif non-diagnostik (HIMPSI). 🔲 Ust. Hilman review akhir.
  growthEdge: {
    kicker: "Arah Tumbuh",
    heading: "Yang Masih Ingin Kamu Kuatkan",
    intro:
      "Sampai di sini kamu sudah menata banyak modal yang Allah titipkan. Mengenali yang sudah ada bukan berarti menutup mata dari yang masih bertumbuh. Justru orang yang paling berdampak adalah yang menyempurnakan kelebihannya, lalu menutupi kekurangannya lewat kolaborasi, seperti cara Rasulullah \uFDFA mengelola potensi para sahabat seperti Zaid bin Tsabit dan Abu Mahdzurah. Coba renungkan satu hal, bukan untuk menghakimi diri, melainkan untuk tahu ke mana kamu ingin tumbuh.",
    gap: {
      id: "ge_gap",
      label: "Satu hal yang masih ingin kamu kuatkan",
      starter: "Kemampuan atau kebiasaan yang masih ingin saya kuatkan adalah...",
      helper: "Pilih yang bisa dipelajari atau dilatih, bukan yang sudah menjadi pemberian.",
    },
    mitigasi: {
      id: "ge_mitigasi",
      label: "Cara kamu menumbuhkannya",
      starter: "Saya bisa menumbuhkannya dengan belajar... atau berkolaborasi dengan...",
    },
    closing:
      "Tidak ada yang lahir lengkap. Yang penting kamu tahu arahnya, dan kamu tidak perlu menempuhnya sendirian.",
  },

  save: {
    button: "Simpan Catatanku",
    saving: "Menyimpan...",
    ctaBody:
      "Kamu sudah mengenali apa yang sudah ada. Langkah berikutnya: kenali kompetensi yang ingin kamu bangun.",
    ctaLabel: "Lanjut: Kenali Kompetensimu \u2192",
  },
};
