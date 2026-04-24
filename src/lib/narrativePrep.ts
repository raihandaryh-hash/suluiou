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
      high: 'cenderung jujur bahkan saat tidak menguntungkan, menolak manipulasi, tidak tergiur keuntungan instan yang mengorbankan integritas',
      mid: 'menyeimbangkan kejujuran dengan kepraktisan — tahu kapan harus tegas dan kapan harus fleksibel',
      low: 'pragmatis dan adaptif terhadap ekspektasi sosial, bisa tampak lebih fleksibel dari yang orang kira soal aturan',
    },
    E: {
      high: 'peka secara emosional, mudah merasakan apa yang dirasakan orang lain, butuh rasa aman untuk bekerja optimal',
      mid: 'cukup peka terhadap perasaan tanpa mudah terbawa arus, bisa memisahkan emosi dari keputusan ketika perlu',
      low: 'tenang di bawah tekanan, tidak mudah goyah oleh kritik atau ketidakpastian, cenderung mandiri secara emosional',
    },
    X: {
      high: 'energik di lingkungan sosial, mudah membangun koneksi, tumbuh dari interaksi dan mendapat energi dari orang-orang di sekitar',
      mid: 'fleksibel antara dunia sosial dan ruang pribadi, nyaman di keduanya tergantung konteks',
      low: 'lebih dalam dari yang terlihat di permukaan, bekerja terbaik saat punya ruang berpikir, tidak perlu banyak validasi eksternal',
    },
    A: {
      high: 'hangat dan mudah berempati, menjaga harmoni dengan tulus, orang-orang cenderung merasa nyaman berbicara jujur dengannya',
      mid: 'bisa bekerja sama dengan baik sekaligus tidak segan mengungkapkan perbedaan pendapat ketika perlu',
      low: 'tegas dan tidak mudah mengalah demi menjaga ketenangan semu, punya standar yang jelas dan tidak ragu mempertahankannya',
    },
    C: {
      high: 'terstruktur, bisa diandalkan, menyelesaikan apa yang dimulai — orang tipe ini jarang meninggalkan sesuatu setengah jalan',
      mid: 'cukup teratur untuk produktif tanpa terlalu kaku, bisa beradaptasi ketika rencana berubah',
      low: 'spontan dan fleksibel, ide datang cepat tapi menyelesaikannya butuh dorongan atau sistem eksternal yang kuat',
    },
    O: {
      high: 'selalu mencari cara pandang baru, senang dengan ide-ide yang tidak lazim, tidak nyaman dengan keseragaman dan rutinitas yang stagnan',
      mid: 'terbuka pada hal baru tanpa kehilangan pijakan pada yang sudah terbukti, tahu kapan harus eksplor dan kapan harus eksekusi',
      low: 'praktis dan fokus pada yang sudah terbukti bekerja, tidak tertarik berputar-putar di wilayah abstrak tanpa tujuan konkret',
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
      detail: 'Ide datang dengan mudah dan kamu senang mengeksplorasi kemungkinan baru — tapi menyelesaikan satu hal sebelum pindah ke hal lain bukan sesuatu yang alami bagimu. Kekuatan terbesarmu sekaligus tantangan terbesarmu ada di titik yang sama.',
    },
    {
      highDim: 'C', lowDim: 'O', minGap: 0.8,
      label: 'pelaksana handal yang mungkin belum menemukan peta besarnya',
      detail: 'Kamu bisa diandalkan dan konsisten — itu langka. Tapi ada kalanya kamu bertanya-tanya apakah jalur yang kamu jalankan dengan baik ini benar-benar milikmu, atau sekadar yang tersedia.',
    },
    {
      highDim: 'X', lowDim: 'E', minGap: 0.8,
      label: 'aktif di luar, lebih mandiri di dalam dari yang terlihat',
      detail: 'Di permukaan kamu mudah hadir dan energik — tapi secara emosional kamu jauh lebih mandiri dari yang orang kira. Ini bisa menjadi kekuatan, tapi juga bisa membuat orang sulit benar-benar mengenalmu.',
    },
    {
      highDim: 'E', lowDim: 'X', minGap: 0.8,
      label: 'peka secara emosional, tapi ekspresinya lebih ke dalam',
      detail: 'Kamu merasakan banyak hal — lebih dari yang kamu tunjukkan. Ini membuatmu sangat empatik, tapi juga kadang membuat energimu habis di lingkungan yang terlalu ramai atau penuh konflik.',
    },
    {
      highDim: 'A', lowDim: 'H', minGap: 0.8,
      label: 'hangat dan menjaga harmoni, kadang mengorbankan ketegasan',
      detail: 'Kamu sangat baik dalam menjaga hubungan tetap harmonis — tapi ada momen di mana kamu perlu mengatakan sesuatu yang tidak nyaman, dan itu bukan hal yang datang secara alami.',
    },
    {
      highDim: 'H', lowDim: 'A', minGap: 0.8,
      label: 'berprinsip kuat, tapi mungkin tampak kurang mudah didekati',
      detail: 'Integritas adalah identitasmu — dan itu berharga. Tapi standar yang kamu pegang bisa membuat orang merasa dinilai, bahkan ketika kamu tidak bermaksud demikian.',
    },
    {
      highDim: 'O', lowDim: 'A', minGap: 0.8,
      label: 'eksplorasi ide yang kuat, tapi kurang sabar dengan yang berbeda cara',
      detail: 'Kamu sangat terbuka pada ide baru — tapi itu tidak selalu berarti terbuka pada orang yang berpikirnya berbeda. Ada gap kecil antara keterbukaan intelektual dan keterbukaan interpersonal.',
    },
  ];

  let bestPair: TensionPair = {
    label: 'profil yang seimbang — kekuatanmu adalah fleksibilitas',
    detail: 'Skor-skormu cukup merata, yang artinya kamu punya fleksibilitas besar dalam banyak situasi. Tapi fleksibilitas tanpa arah bisa membuat kamu belum tahu di mana kamu paling tajam. Itu bukan masalah — itu undangan untuk bereksperimen.',
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
