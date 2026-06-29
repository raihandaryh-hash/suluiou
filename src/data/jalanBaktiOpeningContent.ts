// src/data/jalanBaktiOpeningContent.ts
// Opening baru Kenali Jalan Bakti: "the bomb" (temuan riset person-environment fit,
// = segitiga Pak Dillo), lalu lapisan Islami via doa Nabi Sulaiman (menyertai, BUKAN
// merombak framework), lalu framework 3 gerakan yang memberi halaman ini tulang punggung.
//
// Disiplin:
// - Klaim riset = person-environment fit / Holland (lihat referensi 'vocational-fit-research').
//   Efek nyata namun moderat; tidak di-overclaim sebagai dogma.
// - Doa Sulaiman QS An-Naml 19: Arab + terjemahan Kemenag VERBATIM (terverifikasi via
//   quran.kemenag.go.id, terjemah ROMAN bukan italic, Arab Amiri).
// - Ikigai TIDAK dipakai (terbukti bukan kerangka ilmiah, adaptasi blog 2014).
// - Semua siswa-facing ("kamu"), tanpa em-dash.

export const jbOpening = {
  // ── The bomb: temuan riset ──
  bombKicker: 'Sebelum kita mulai',
  bombLead:
    'Penelitian karier selama lebih dari setengah abad menemukan satu pola yang terus berulang. Seseorang paling berkembang, bertahan, dan tenang dalam pekerjaannya ketika ada kecocokan antara dirinya, yaitu minat, kemampuan, dan nilai yang ia pegang, dengan apa yang sungguh dibutuhkan dunia di sekitarnya.',
  bombEmphasis:
    'Karier terbaik bukan sekadar yang bergengsi atau bergaji besar, melainkan titik temu antara siapa dirimu dan apa yang dunia butuhkan.',
  bombCite: 'vocational-fit-research',
  bombAfter:
    'Tiga yang pertama, minat, kemampuan, dan nilai, kamu gali di tahap Kenali Dirimu. Yang terakhir, kebutuhan dunia, itulah yang akan kita telusuri bersama sekarang.',

  // ── Lapisan Islami: doa Nabi Sulaiman (menyertai, mengangkat) ──
  doaIntro:
    'Menariknya, jauh sebelum riset itu ada, seorang nabi sudah merangkum pola yang sama dalam satu doa. Ketika Nabi Sulaiman menyadari betapa banyak nikmat yang Allah berikan, beliau tidak berhenti pada syukur. Beliau memohon agar nikmat itu mengalir menjadi amal:',
  ayat: {
    arabic:
      'رَبِّ اَوْزِعْنِيْٓ اَنْ اَشْكُرَ نِعْمَتَكَ الَّتِيْٓ اَنْعَمْتَ عَلَيَّ وَعَلٰى وَالِدَيَّ وَاَنْ اَعْمَلَ صَالِحًا تَرْضٰىهُ',
    terjemah:
      'Ya Tuhanku, anugerahkanlah aku ilham untuk tetap mensyukuri nikmat-Mu yang telah Engkau anugerahkan kepadaku dan kepada kedua orang tuaku dan agar aku mengerjakan kebajikan yang Engkau ridai.',
    rujukan: 'QS An-Naml [27]: 19 (terjemahan Kemenag RI)',
  },
  // Pemetaan doa → triad, tanpa merombak framework
  doaMapping: [
    {
      frasa: '"Mensyukuri nikmat-Mu kepadaku"',
      makna: 'Mengenali dan mensyukuri minat serta kemampuan yang Allah titipkan dalam dirimu.',
    },
    {
      frasa: '"dan kepada kedua orang tuaku"',
      makna: 'Termasuk latar, didikan, dan nilai yang membentukmu sampai hari ini.',
    },
    {
      frasa: '"agar aku mengerjakan kebajikan yang Engkau ridai"',
      makna: 'Mengarahkan semua itu keluar, menjadi amal yang bermanfaat bagi sesama dan diridai Allah. Di sinilah minat dan kemampuanmu bertemu kebutuhan dunia.',
    },
  ],
  doaClosing:
    'Jadi mengenali jalan bakti bukan menambah beban di atas pencarian kariermu. Justru inilah yang menyempurnakannya: arah yang membuat semua bekalmu berarti.',

  // ── Framework: 3 gerakan (memberi halaman tulang punggung) ──
  gerakanKicker: 'Bagaimana caranya?',
  gerakanLead: 'Perjalanan di halaman ini punya tiga gerakan sederhana:',
  gerakan: [
    {
      no: '01',
      judul: 'Dengar',
      desc: 'Kenali dulu kebutuhan dunia, dari yang global sampai yang ada di depan matamu. Tandai mana yang paling menggugah hatimu.',
    },
    {
      no: '02',
      judul: 'Pahami',
      desc: 'Pilih satu yang memanggilmu, lalu gali lebih dalam. Apa akar masalahnya? Siapa yang sudah bergerak? Apa yang belum tergarap? Di sinilah alat seperti AI bisa membantumu meneliti, bukan menggantikan rasa pedulimu.',
    },
    {
      no: '03',
      judul: 'Desain',
      desc: 'Ubah kepedulian menjadi langkah. Bukan rencana muluk, tapi satu langkah dekat yang bisa kamu mulai, sebagai seseorang yang menempatkan diri di tengah masalah, bukan menontonnya dari jauh.',
    },
  ],
  gerakanClosing:
    'Kamu tidak harus menyelesaikan semuanya hari ini. Cukup mulai mendengar, lalu satu langkah akan menuntun ke langkah berikutnya.',
};
