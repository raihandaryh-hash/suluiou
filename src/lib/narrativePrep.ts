// Preprocessing untuk narasi AI Layer 1 & Layer 3.
// Mengubah angka mentah HEXACO + Holland Code menjadi interpretasi perilaku
// yang lebih mudah dicerna oleh LLM, sehingga narasi terasa personal —
// bukan generik / horoskopik.

export interface HEXACOScores {
  H: number; E: number; X: number; A: number; C: number; O: number;
}

export interface TensionPair {
  label: string;
  detail: string;
}

// ---
// 1. interpretHEXACO
// Kembalikan interpretasi perilaku (bukan definisi akademik) per dimensi
// dan level. Level: high (>=3.7), mid (2.4–3.6), low (<2.4).
// Bahasa Indonesia, nada naratif.
// ---
export function interpretHEXACO(dim: keyof HEXACOScores, score: number): string {
  const level = score >= 3.7 ? 'high' : score >= 2.4 ? 'mid' : 'low';
  const map: Record<keyof HEXACOScores, Record<string, string>> = {
    H: {
      high: 'orang yang akan memilih diam daripada mengatakan sesuatu yang tidak sepenuhnya benar — bahkan ketika berbohong kecil jauh lebih mudah',
      mid: 'tahu kapan harus jujur penuh dan kapan harus memilih kata dengan hati-hati — kejujuran baginya bukan absolut, tapi juga bukan sesuatu yang bisa diperjualbelikan',
      low: 'pragmatis dalam cara ia menyampaikan sesuatu — lebih mementingkan tujuan tercapai daripada apakah caranya sepenuhnya sesuai ekspektasi orang lain',
    },
    E: {
      high: 'bisa merasakan ketegangan di ruangan sebelum ada yang bicara — dan biasanya menahan diri untuk tidak langsung bereaksi, meski sudah merasakannya duluan',
      mid: 'tidak mudah terbawa arus perasaan orang lain, tapi juga tidak dingin — ia tahu kapan harus hadir sepenuhnya dan kapan harus menjaga jarak',
      low: 'tidak mudah goyah ketika tekanan datang — orang-orang di sekitarnya sering datang justru karena ia tidak panik ketika semua orang lain panik',
    },
    X: {
      high: 'ruangan berenergi berbeda ketika ia masuk — bukan karena ia berusaha, tapi karena kehadirannya yang natural menarik orang mendekat',
      mid: 'nyaman di keramaian maupun kesendirian, tergantung apa yang dibutuhkan saat itu — tidak merasa kehilangan di salah satunya',
      low: 'bekerja terbaik ketika tidak ada yang menginterupsi alur berpikirnya — bukan antisosial, tapi pikirannya butuh ruang untuk sampai ke tempat yang dalam',
    },
    A: {
      high: 'orang yang sulit menolak permintaan bantuan, bukan karena lemah, tapi karena genuinely tidak nyaman melihat orang lain kesulitan sendirian',
      mid: 'bisa bersikap hangat sekaligus tegas — tidak perlu memilih antara menjaga hubungan dan menyampaikan pendapat yang berbeda',
      low: 'tidak segan menyampaikan ketidaksetujuan, bahkan ketika itu membuat suasana tidak nyaman — baginya kebenaran lebih penting dari ketenangan palsu',
    },
    C: {
      high: 'ketika ia berkomitmen pada sesuatu, orang lain tahu itu akan selesai — bukan karena dipaksa, tapi karena ia tidak bisa hidup dengan sesuatu yang tergantung setengah jalan',
      mid: 'cukup terstruktur untuk bisa diandalkan, tapi tidak kaku ketika situasi berubah — tahu kapan harus berpegang pada rencana dan kapan harus banting setir',
      low: 'ide datang cepat dan ia langsung ingin mengerjakannya — tapi menyelesaikan satu hal sebelum loncat ke hal berikutnya adalah perjuangan tersendiri',
    },
    O: {
      high: 'tidak nyaman dengan jawaban "karena memang begini caranya" — selalu ingin tahu apakah ada cara yang lebih baik, lebih elegan, atau lebih tidak biasa',
      mid: 'terbuka pada hal baru tapi tidak latah — bisa membedakan mana yang genuinely menarik dan mana yang sekadar hype',
      low: 'lebih percaya pada yang sudah terbukti daripada yang masih teori — bukan karena tidak imajinatif, tapi karena ia tahu bahwa eksekusi yang solid lebih langka dari ide yang bagus',
    },
  };
  return map[dim][level];
}

// ---
// 2. interpretHolland
// Deskripsi perilaku 2–3 kalimat untuk Holland Code. Gunakan 3 huruf pertama.
// ---
export function interpretHolland(hollandCode: string): string {
  const descriptions: Record<string, string> = {
    SIA: 'Kamu paling hidup saat membantu orang memecahkan masalah nyata dengan cara yang kreatif. Bukan di balik meja — tapi di ruang di mana kamu bisa bergerak, mendengar, dan melihat dampak langsung dari apa yang kamu lakukan.',
    SAI: 'Kamu bergerak dari rasa peduli yang tulus, dan kreativitas adalah cara kamu mewujudkan kepedulian itu menjadi sesuatu yang nyata. Lingkungan yang paling cocok untukmu adalah yang menghargai hubungan manusia sekaligus memberi ruang untuk bereksperimen.',
    IAS: 'Kamu adalah pemikir yang suka memecahkan teka-teki, tapi tidak sendirian — kamu butuh makna sosial dari apa yang kamu kerjakan. Yang paling memuaskan bagimu adalah menemukan jawaban yang benar-benar berguna bagi orang lain.',
    ISA: 'Kamu mendekati masalah dengan metode, tapi tujuan akhirnya selalu tentang manusia. Analisis yang kamu lakukan bukan untuk kepuasan intelektual semata — tapi karena kamu ingin orang lain benar-benar terbantu.',
    AIS: 'Kreativitas adalah cara berpikirmu, bukan sekadar bakat. Kamu melihat pola yang orang lain lewatkan, dan lebih suka memecahkan masalah dengan cara yang tidak terduga daripada mengikuti template yang sudah ada.',
    ASI: 'Kamu kreator yang berakar pada kepedulian. Karya terbaikmu lahir ketika ada orang nyata yang akan merasakannya — bukan karya seni demi seni, tapi ekspresi yang menyentuh dan menggerakkan.',
    RIS: 'Kamu bekerja terbaik saat ada sesuatu yang bisa disentuh, dibangun, atau diperbaiki — tapi kamu juga ingin memahami cara kerjanya secara mendalam. Kombinasi ini membuatmu bisa menjadi pemecah masalah yang sangat praktis sekaligus tidak gegabah.',
    RIA: 'Tanganmu dan pikiranmu bekerja sama. Kamu bukan tipe yang puas hanya dengan teori — kamu perlu melihat, menyentuh, dan mencoba. Kreativitas bagimu bukan abstrak; ia harus bisa diwujudkan.',
    EIS: 'Kamu punya kemampuan menggerakkan orang sekaligus rasa ingin tahu yang kuat tentang mengapa sesuatu bekerja. Perpaduan ini membuatmu bisa menjadi pemimpin yang tidak hanya bisa memotivasi, tapi juga memahami apa yang benar-benar perlu dilakukan.',
    ESI: 'Kamu tumbuh di ruang yang dinamis, di mana kamu bisa mengorganisir, memimpin, dan memastikan semuanya berjalan. Tapi kamu juga punya rasa peduli yang dalam pada orang-orang di sekitarmu — bukan pemimpin yang dingin.',
    CSI: 'Kamu suka tatanan dan sistem yang jelas, tapi tidak untuk dirimu sendiri — untuk membantu orang lain. Ketelitian yang kamu miliki adalah cara kamu menunjukkan bahwa kamu bisa diandalkan.',
    CIS: 'Kamu menggabungkan ketelitian analitis dengan kepraktisan sistematis. Pekerjaan terbaikmu adalah yang punya standar jelas dan dampak yang bisa diukur.',
    IRS: 'Rasa ingin tahumu sangat besar, dan kamu suka menyelami sesuatu sampai benar-benar paham. Tapi kamu juga ingin pengetahuan itu berguna — bukan hanya teori yang tersimpan di kepala.',
    EAS: 'Kamu punya energi untuk menggerakkan dan kreativitas untuk memberi warna. Lingkungan terbaik untukmu adalah yang memberimu ruang untuk berinisiatif sekaligus berinovasi.',
  };
  const code = hollandCode.toUpperCase().slice(0, 3);
  return (
    descriptions[code] ||
    `Dengan pola minat ${hollandCode}, kamu paling efektif di lingkungan yang sesuai dengan cara alaminya kamu mendekati masalah — kombinasi unik yang tidak selalu punya satu jalur karir tunggal.`
  );
}

// ---
// 3. detectTension
// Cari pasangan dimensi tertinggi & terendah yang menciptakan ketegangan bermakna.
// ---
export function detectTension(scores: HEXACOScores): TensionPair {
  const pairs: Array<{
    highDim: keyof HEXACOScores;
    lowDim: keyof HEXACOScores;
    minGap: number;
    label: string;
    detail: string;
  }> = [
    {
      highDim: 'O', lowDim: 'C', minGap: 0.8,
      label: 'visioner yang belum menemukan ritme eksekusi',
      detail: 'Kamu punya banyak ide yang bagus — dan graveyard dari ide-ide yang belum selesai mungkin lebih panjang dari yang kamu akui. Ini bukan kelemahan karakter. Tapi ini adalah sesuatu yang perlu sistem, bukan sekadar niat.',
    },
    {
      highDim: 'C', lowDim: 'O', minGap: 0.8,
      label: 'pelaksana handal yang mungkin bermain terlalu aman',
      detail: 'Kamu bisa diandalkan — dan itu langka. Tapi ada kalanya kamu bertanya-tanya: apakah jalur yang kamu jalankan dengan sangat baik ini benar-benar pilihanmu, atau sekadar yang paling aman untuk dipilih?',
    },
    {
      highDim: 'X', lowDim: 'E', minGap: 0.8,
      label: 'mudah hadir di luar, sulit benar-benar dikenal di dalam',
      detail: 'Kamu mudah membuat orang merasa nyaman di dekatmu. Tapi ada jarak antara dikenal dan benar-benar dikenal — dan kamu yang mengendalikan seberapa dekat orang bisa masuk.',
    },
    {
      highDim: 'E', lowDim: 'X', minGap: 0.8,
      label: 'merasakan lebih banyak dari yang ditampilkan',
      detail: 'Kamu sering sudah tahu bagaimana perasaan seseorang sebelum mereka mengatakannya. Tapi energi itu ada harganya — lingkungan yang terlalu bising atau penuh konflik menguras kamu lebih cepat dari yang orang kira.',
    },
    {
      highDim: 'A', lowDim: 'H', minGap: 0.8,
      label: 'menjaga hubungan, tapi kadang dengan harga yang terlalu mahal',
      detail: 'Kamu pandai membuat orang merasa diterima. Tapi ada momen di mana kamu tahu ada sesuatu yang perlu dikatakan — dan kamu memilih diam untuk menjaga suasana. Itu pilihan, bukan kewajiban.',
    },
    {
      highDim: 'H', lowDim: 'A', minGap: 0.8,
      label: 'berprinsip, tapi standarnya tidak selalu terasa ringan bagi orang lain',
      detail: 'Integritasmu bukan performatif — itu genuinely siapa kamu. Tapi standar yang kamu pegang terhadap dirimu kadang tanpa sadar diproyeksikan ke orang lain, dan mereka merasakannya.',
    },
    {
      highDim: 'O', lowDim: 'A', minGap: 0.8,
      label: 'terbuka pada ide, tapi kurang sabar dengan cara orang lain berpikir',
      detail: 'Kamu sangat terbuka pada kemungkinan baru — tapi keterbukaan itu lebih mudah kamu rasakan untuk ide daripada untuk orang. Ada gap kecil di sana yang mungkin belum kamu sadari.',
    },
  ];

  let bestPair: TensionPair = {
    label: 'profil yang seimbang — belum ketemu ujian yang sesungguhnya',
    detail: 'Skor-skormu cukup merata — kamu fleksibel dalam banyak situasi. Tapi fleksibilitas baru ketahuan kualitasnya ketika ada tekanan. Pertanyaannya bukan apa kekuatanmu — tapi apa yang kamu lakukan ketika kekuatan itu diuji.',
  };
  let maxGap = 0;

  for (const pair of pairs) {
    const gap = scores[pair.highDim] - scores[pair.lowDim];
    if (gap >= pair.minGap && gap > maxGap) {
      maxGap = gap;
      bestPair = { label: pair.label, detail: pair.detail };
    }
  }
  return bestPair;
}

// ---
// Helper: build full HEXACO interpretations object dalam satu call.
// ---
export function buildHEXACOInterpretations(scores: HEXACOScores): Record<keyof HEXACOScores, string> {
  return {
    H: interpretHEXACO('H', scores.H),
    E: interpretHEXACO('E', scores.E),
    X: interpretHEXACO('X', scores.X),
    A: interpretHEXACO('A', scores.A),
    C: interpretHEXACO('C', scores.C),
    O: interpretHEXACO('O', scores.O),
  };
}
