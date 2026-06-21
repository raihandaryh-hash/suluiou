export type Block =
  | { t: 'p'; x: string }
  | { t: 'ayat'; ar: string; tr: string; ref: string };

export const mukadimahBabak = {
  salam: { italic: "Assalāmu'alaikum", rest: ", Pemuda-pemudi bangsa!" },

  intro: [
    "Tahukah kamu, bahwa Indonesia sedang menghadapi momen krusial? Pada tahun 2030, kita akan mengalami **puncak bonus demografi yang takkan terulang sepanjang masa.**",
    "Tahun 2030, mayoritas populasi kita diisi anak muda produktif, yakni 199 juta dari total 286 juta populasi (69,51 persen), dan kita adalah negara dengan populasi terbanyak di ASEAN, serta ke-4 di dunia!",
    "Jika Soekarno berkata, dengan 10 pemuda ia akan mengguncang dunia, bagaimana menurutmu jika ratusan juta pemuda Indonesia menjadi versi terbaik dirinya di momen tersebut? Yang beriman lagi berakhlak mulia, beridentitas kuat lagi berpikiran terbuka dan maju, bergotong royong dan peduli sekitar, mandiri lagi tangguh, bernalar kritis, serta kreatif dalam membuat inovasi-inovasi yang berdampak?",
  ],

  musibah: "Namun, jika tidak dimanfaatkan dengan baik, momen bonus demografi ini bisa jadi bukan menjadi **berkah**, namun **musibah**.",

  faktanya: "**Faktanya:** Tahukah kamu bahwa saat ini, kurang lebih 1 dari 5 orang pemuda Indonesia tergolong NEET? Yakni tidak sedang belajar/kuliah, tidak bekerja, dan tidak sedang membina diri dengan pelatihan?",

  neetLead: "Secara persentase, angka NEET pemuda kita terbesar kedua se-ASEAN, dan nomor satu dalam jumlah.",

  neet: {
    title: "Jumlah Pemuda NEET (15–24 th) · ASEAN",
    rows: [
      { c: "Indonesia", w: 100, label: "±9,0 jt", pct: "21,4", me: true },
      { c: "Filipina",  w: 27,  label: "±2,4 jt", pct: "12,4" },
      { c: "Vietnam",   w: 19,  label: "±1,7 jt", pct: "10,3" },
      { c: "Myanmar",   w: 15,  label: "±1,3 jt", pct: "15,0" },
      { c: "Thailand",  w: 13,  label: "±1,2 jt", pct: "12,8" },
      { c: "Malaysia",  w: 6,   label: "±0,5 jt", pct: "10,2" },
    ],
    note: "Laos, Kamboja, Timor-Leste, Singapura, Brunei: masing-masing di bawah 0,5 juta. Per persentase Indonesia ke-2 di antara 10 anggota lama ASEAN; per jumlah, terbanyak mutlak, sekitar 4× negara berikutnya.",
    source: "Jumlah = NEET% terkini (World Bank WDI / ILO modelled est.) × populasi usia 15–24. Indonesia ±9 juta konsisten dengan BPS (Sakernas 2025: 19,44%).",
  },

  rentangUmur: "Padahal, ini rentang umur yang sangat menentukan dalam hidup seseorang.",

  pertanyaan: "Lantas, apa yang harus kita lakukan? Bagaimana caranya kita bisa bangkit memimpin, ketika bahkan untuk hidup sehari-hari pun begitu berat rasanya di zaman penuh cobaan ini?",

  steps: [
    {
      ord: "Pertama",
      heading: "Kita harus kenali realita.",
      blocks: [
        { t: 'p', x: "Karena, bagaimana kita bisa menghadapi ujian, jika tidak tahu apa yang diujikan dan kisi-kisinya? Allah _Subhanahu wa Ta'ala_ berfirman:" },
        { t: 'ayat', ar: "وَكَيْفَ تَصْبِرُ عَلٰى مَا لَمْ تُحِطْ بِهٖ خُبْرًا", tr: "“Bagaimana engkau akan sanggup bersabar atas sesuatu yang engkau belum mempunyai pengetahuan yang cukup tentangnya?”", ref: "QS Al-Kahf · 18:68" },
        { t: 'p', x: "Ayat ini ditujukan kepada Nabi Musa _'alaihissalam_, lho, yang ketika itu merupakan sosok paling berilmu dan punya kekuatan fisik luar biasa. Jika beliau saja tidak bisa bersabar menghadapi sesuatu yang belum diketahui, apalagi kita?" },
        { t: 'p', x: "Oleh karena itu, nanti kita akan sama-sama belajar tentang kondisi dunia saat ini, terutama dari sisi lapangan kerja dan apa saja yang dibutuhkan untuk bisa _survive_ dan bahkan berkembang di dalamnya." },
      ],
    },
    {
      ord: "Kedua",
      heading: "Kita harus mengenali diri kita sendiri dan punya prinsip.",
      blocks: [
        { t: 'p', x: "Karena, dengan mengenal diri, kita akan tahu celah mana yang cocok untuk kita isi di dunia ini. Ibarat tim olahraga, yang tiap anggotanya punya posisi dan tugas masing-masing sesuai kelebihannya. Allah _Subhanahu wa Ta'ala_ juga mengisyaratkan kalau kita semua punya tabiat dan pembawaan yang khas:" },
        { t: 'ayat', ar: "قُلْ كُلٌّ يَّعْمَلُ عَلٰى شَاكِلَتِهٖ", tr: "“Katakanlah (Nabi Muhammad), ‘**Setiap orang berbuat sesuai dengan pembawaannya masing-masing**.’ Maka, Tuhanmu lebih mengetahui siapa yang lebih benar jalannya.”", ref: "QS Al-Isra’ · 17:84" },
        { t: 'p', x: "Selain itu, kalau tidak mengenal diri dan gak punya prinsip, bisa-bisa kita terjebak FOMO dan mengambil pilihan yang tidak sesuai dengan potensi, kata hati, dan nilai-nilai luhur kita hanya karena ikut-ikutan tren dan takut nggak kelihatan keren di hadapan teman-teman." },
        { t: 'p', x: "Allah membuat permisalan bahwa kalimat tauhid dan segala prinsip keyakinan yang baik itu ibarat **pohon yang akarnya menancap teguh dan batangnya kuat lagi senantiasa berbuah manis**, sedangkan perkataan dan keyakinan yang buruk itu **ibarat pohon yang buruk pula, yang akarnya tercerabut lagi tidak dapat tegak sedikit pun** (QS Ibrahim: 24–26)." },
        { t: 'p', x: "Kalau kita punya prinsip, keyakinan, dan niat baik, insya Allah akan teguh. Tapi kalau hanya ikut-ikutan walau itu _influence_ yang buruk, pasti nggak akan bertahan dan rapuh." },
        { t: 'p', x: "Nanti kita akan coba refleksi dan eksplorasi bersama soal dirimu, kelebihan dan kekuranganmu, modal-modal yang sudah kamu miliki, dan bagaimana memaksimalkannya, ya." },
      ],
    },
    {
      ord: "Ketiga",
      heading: "Kita harus memetakan jalan bakti kita di dunia.",
      blocks: [
        { t: 'p', x: "Karena, lewat berbakti dan bermanfaat, kita akan bertahan di tengah krisis cobaan. Allah _Subhanahu wa Ta'ala_ berfirman:" },
        { t: 'ayat', ar: "وَاَمَّا مَا يَنْفَعُ النَّاسَ فَيَمْكُثُ فِى الْاَرْضِ", tr: "“Buih akan hilang tidak berguna, sedangkan **yang bermanfaat bagi manusia akan menetap di bumi.** Demikianlah Allah membuat perumpamaan.”", ref: "QS Ar-Ra’d · 13:17" },
        { t: 'p', x: "Jadi, kalau kita bisa turut menjadi solusi riil bagi permasalahan umat, insya Allah kita akan bertahan. Di sisi lain, kalau kita mengabdikan diri untuk membantu orang lain, Allah juga akan membantu kita. Nabi _Shallallahu 'alaihi wasallam_ bersabda:" },
        { t: 'ayat', ar: "كَانَ اللّٰهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيْهِ", tr: "**“Allah pasti menolong hamba-Nya, selama hamba tersebut menolong saudaranya.”**", ref: "HR Muslim" },
        { t: 'p', x: "Nanti kita coba kenali masalah-masalah apa yang sedang dicari solusinya di dunia, Indonesia, dan bahkan daerahmu. Dari sana, kamu bisa mulai memetakan jalan untuk membangun jalan karir yang bermanfaat dan berdampak." },
      ],
    },
  ] as { ord: string; heading: string; blocks: Block[] }[],

  closing: "Nah, setelah mengenal dunia, diri, dan jalan baktimu, nanti kita akan tutup dengan membuat _rencana aksi_ untuk ke depannya, termasuk mendata keterampilan apa saja yang ingin dan perlu kamu pelajari supaya kamu bisa tumbuh jadi versi terbaikmu.",

  cta: { label: "Siap? Yuk kita mulai dari step pertama", to: "/insight" },
};
