export const rencanaAksiContent = {
  ui: {
    pageTitle: "Rencana Aksi",
    pembukaSectionTitle: "Sebelum Menyusun Langkah",
    rumusSectionTitle: "Rumus Karier",
    formSectionTitle: "Rencana Aksimu",
    doaSectionTitle: "Doa di Persimpangan",
    saveLabel: "Simpan Rencana Aksi",
    savedToast: "Rencana aksimu tersimpan ✓",
    errorToast: "Gagal menyimpan, coba lagi",
    nextCtaLabel: "Lihat Ringkasan Perjalananmu →",
    nextCtaTooltip: "Segera tersedia",
  },

  pembuka: {
    teks: "Sebelum kamu menyusun langkah, berhenti sejenak. Kamu sudah mengumpulkan banyak — gambaran dunia, bekal dirimu, ladang yang memanggil. Semua itu berharga. Tapi ada satu hal yang perlu diletakkan di tempatnya yang benar.\n\nKetika Musa عليه السلام meninggalkan Mesir menuju Madyan, ia tidak memegang peta, tidak tahu apa yang menanti. Ia hanya melangkah sambil berbisik:",
    ayatArab: "عَسٰى رَبِّيْٓ اَنْ يَّهْدِيَنِيْ سَوَاۤءَ السَّبِيْلِ",
    ayatTerjemah: "\"Semoga Tuhanku membimbingku ke jalan yang benar.\"",
    ayatRujukan: "QS Al-Qasas: 22",
    penutupTeks: "Semua yang kamu kenali sejauh ini — data, hasil tes, kekuatanmu — hanyalah sebab. Yang memberi petunjuk adalah Allah, Al-Hadi. Maka sejelas apa pun data menunjukkan satu celah untukmu, sandaran utamamu tetap kepada-Nya, bukan kepada dirimu sendiri atau angka-angka itu. Dia lebih tahu apa yang terbaik bagimu.\n\nDengan hati seperti itu, mari susun langkahmu.",
  },

  rumus: {
    pengantar: "Kamu sudah mengenal kekuatan yang kamu bawa, dan ladang tempat ia bisa tumbuh. Sekarang satu pertanyaan yang lebih tenang: bagaimana semua ini menjadi langkah nyata?\n\nDulu, ketika Nabi Musa عليه السلام menolong dua perempuan di Madyan, salah satu dari mereka berkata kepada ayahnya:",
    ayatArab: "يٰٓاَبَتِ اسْتَأْجِرْهُ ۖ اِنَّ خَيْرَ مَنِ اسْتَأْجَرْتَ الْقَوِيُّ الْاَمِيْنُ",
    ayatTerjemah: "\"Wahai ayahku, pekerjakanlah dia. Sesungguhnya sebaik-baik orang yang engkau pekerjakan adalah orang yang kuat lagi dapat dipercaya.\"",
    ayatRujukan: "QS Al-Qasas: 26",
    tafsir: "Imam As-Sa'di menjelaskan: sebaik-baik orang yang dipekerjakan adalah yang menggabungkan dua hal — kekuatan dan kemampuan untuk menjalankan tugas, dan sikap amanah dalam menunaikannya tanpa khianat.",
    portfolioFraming: [
      "Pekerjaan didapat ketika kekuatan dan keamanahan yang sudah kamu bangun secara inheren bertemu dengan kesempatan yang tepat.",
      "Maka portfolio-mu bukan hanya yang tercantum di CV. Turunlah memberi manfaat kepada masyarakat dengan tulus, terus-menerus — nanti akan ada momennya, ketika itu berbuah menjadi kesempatan.",
    ],
    hilman: {
      teks: "Dan kekuatan itu — ia disiapkan, bukan ditunggu.",
      dalil1Arab: "النَّاسُ مَعَادِنُ",
      dalil1Terjemah: "\"Manusia ibarat tambang emas dan perak.\" (HR Bukhari–Muslim)",
      jembatan: "Setiap orang menyimpan potensi seperti logam mulia dalam tambang — ia berharga justru ketika digali dan ditempa.",
      dalil2Arab: "وَاَعِدُّوْا لَهُمْ مَّا اسْتَطَعْتُمْ مِّنْ قُوَّةٍ",
      dalil2Terjemah: "\"Siapkanlah kekuatan yang kamu sanggupi.\" (QS Al-Anfal: 60)",
    },
    refleksiPrompt: "Tuliskan satu momen ketika kamu membantu seseorang tanpa mengharapkan imbalan apa pun.",
    refleksiHint: "(Sekecil apa pun. Yang tulus selalu meninggalkan jejak.)",
  },

  form: {
    pengantar: "Ini bukan janji yang mengikat atau cetak biru yang kaku. Anggap ini surat pendek dari dirimu hari ini, untuk dirimu beberapa langkah ke depan. Isi yang terasa jelas; sisanya boleh menyusul.",
    gerak: [
      {
        title: "Arah",
        fields: [
          { key: "motivasiBakti", label: "Motivasi Bakti", prompt: "Dari semua kebutuhan yang kamu lihat, mengapa jalan bakti ini yang menyentuhmu?" },
          { key: "langkahSelanjutnya", label: "Langkah Selanjutnya", prompt: "Apa yang ingin kamu lakukan setelah lulus nanti?" },
        ],
      },
      {
        title: "Tujuan",
        fields: [
          { key: "tujuan1_2", label: "Tujuan 1–2 Tahun", prompt: "Satu hal yang ingin kamu capai dalam waktu dekat." },
          { key: "tujuan3_5", label: "Tujuan 3–5 Tahun", prompt: "Bayangkan dirimu beberapa tahun lagi — kamu sedang mengerjakan apa?" },
          { key: "kesesuaian", label: "Kesesuaian Diriku", prompt: "Lihat kembali bekal yang kamu kenali di tahap awal — bekal mana yang paling mendukung arah ini?" },
          { key: "kembangkan", label: "Yang Ingin Kukembangkan", prompt: "Dari keterampilan yang kamu pilih sebelumnya, mana yang ingin kamu latih lebih dulu?" },
        ],
      },
      {
        title: "Komitmen",
        fields: [
          { key: "aksi30", label: "Rencana Aksi 30 Hari", prompt: "Ketika [waktu/situasi], saya akan [satu aksi kecil].", hint: "Mulai dari yang paling mungkin.", keystone: true, required: true },
          { key: "pendamping", label: "Pendampingku", prompt: "Siapa yang akan menemanimu — guru, orang tua, teman, atau seorang mentor?" },
          { key: "niat", label: "Niat", prompt: "Untuk apa, dan dengan niat apa, kamu ingin melakukan ini?", framing: "Sekecil apa pun langkahnya, yang menjadikannya bernilai adalah niatnya. إنما الأعمال بالنيات." },
          { key: "doa", label: "Doa yang Kupegang", prompt: "Satu doa yang ingin kamu sandari di sepanjang jalan ini." },
        ],
      },
    ],
  },

  doa: {
    pengantar: "Setelah menolong dua perempuan itu, Musa عليه السلام berpindah ke tempat yang teduh — sendiri, dalam keadaan lemah dan butuh. Ia tidak menuntut. Ia hanya berbisik kepada Tuhannya:",
    ayatArab: "رَبِّ اِنِّيْ لِمَآ اَنْزَلْتَ اِلَيَّ مِنْ خَيْرٍ فَقِيْرٌ",
    ayatTerjemah: "\"Ya Tuhanku, sesungguhnya aku sangat memerlukan suatu kebaikan (rezeki) yang Engkau turunkan kepadaku.\"",
    ayatRujukan: "QS Al-Qasas: 24",
    setelah: "Lalu Allah jawab doa itu dengan jalan yang tak ia duga. Urutannya sederhana: berbuat baik dengan tulus, panjatkan kebutuhanmu, lalu tenang — biarkan Allah yang mengatur sisanya.",
    istianah: "Dan saat kamu mulai melangkah, ingatlah satu kalimat ringan yang menanggalkan beban: لا حول ولا قوة إلا بالله. Sebelum beramal, ia menurunkan rasa cemas. Saat beramal, ia mengingatkan bahwa kamu hanya alat — hasilnya milik Allah. Setelah beramal, ia menuntunmu bersyukur tanpa merasa cukup berjasa.",
    khidmahNudge: "Salah satu bentuk langkah 30 hari: habiskan 2–4 jam membantu di bidang yang kamu minati, tanpa bayaran, dengan niat khidmah.",
  },
} as const;
