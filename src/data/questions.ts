export type Dimension =
  | 'honesty'
  | 'emotionality'
  | 'extraversion'
  | 'agreeableness'
  | 'conscientiousness'
  | 'openness'
  | 'realistic'
  | 'investigative'
  | 'artistic'
  | 'social'
  | 'enterprising'
  | 'conventional';

export interface Question {
  id: number;
  text: string;
  dimension: Dimension;
  framework: 'hexaco' | 'riasec';
  reverse?: boolean;
}

export const questions: Question[] = [
  // HEXACO — Honesty-Humility
  { id: 1, text: "Saya lebih memilih jujur meskipun itu merugikan diri sendiri.", dimension: "honesty", framework: "hexaco" },
  { id: 2, text: "Saya tidak tertarik memanfaatkan orang lain untuk keuntungan pribadi.", dimension: "honesty", framework: "hexaco" },

  // HEXACO — Emotionality
  { id: 3, text: "Saya mudah merasa khawatir tentang hal-hal kecil.", dimension: "emotionality", framework: "hexaco" },
  { id: 4, text: "Saya membutuhkan dukungan emosional dari orang lain saat menghadapi masalah.", dimension: "emotionality", framework: "hexaco" },

  // HEXACO — Extraversion
  { id: 5, text: "Saya merasa bersemangat saat berada di tengah keramaian.", dimension: "extraversion", framework: "hexaco" },
  { id: 6, text: "Saya mudah memulai percakapan dengan orang baru.", dimension: "extraversion", framework: "hexaco" },

  // HEXACO — Agreeableness
  { id: 7, text: "Saya lebih memilih mengalah daripada berdebat panjang.", dimension: "agreeableness", framework: "hexaco" },
  { id: 8, text: "Saya mudah memaafkan orang yang pernah menyakiti saya.", dimension: "agreeableness", framework: "hexaco" },

  // HEXACO — Conscientiousness
  { id: 9, text: "Saya selalu membuat rencana sebelum memulai sesuatu.", dimension: "conscientiousness", framework: "hexaco" },
  { id: 10, text: "Saya tidak puas sampai pekerjaan saya benar-benar sempurna.", dimension: "conscientiousness", framework: "hexaco" },

  // HEXACO — Openness
  { id: 11, text: "Saya senang memikirkan ide-ide yang tidak biasa dan filosofis.", dimension: "openness", framework: "hexaco" },
  { id: 12, text: "Saya tertarik pada seni, musik, atau sastra.", dimension: "openness", framework: "hexaco" },

  // RIASEC — Realistic
  { id: 13, text: "Saya suka bekerja dengan tangan, alat, atau mesin.", dimension: "realistic", framework: "riasec" },
  { id: 14, text: "Saya lebih suka aktivitas fisik daripada duduk di meja.", dimension: "realistic", framework: "riasec" },

  // RIASEC — Investigative
  { id: 15, text: "Saya senang memecahkan teka-teki atau masalah yang kompleks.", dimension: "investigative", framework: "riasec" },
  { id: 16, text: "Saya suka menganalisis data untuk menemukan pola.", dimension: "investigative", framework: "riasec" },

  // RIASEC — Artistic
  { id: 17, text: "Saya suka mengekspresikan diri melalui karya kreatif.", dimension: "artistic", framework: "riasec" },
  { id: 18, text: "Saya lebih suka lingkungan kerja yang fleksibel dan tidak terstruktur.", dimension: "artistic", framework: "riasec" },

  // RIASEC — Social
  { id: 19, text: "Saya merasa puas saat bisa membantu orang lain berkembang.", dimension: "social", framework: "riasec" },
  { id: 20, text: "Saya senang mengajar atau membimbing orang lain.", dimension: "social", framework: "riasec" },

  // RIASEC — Enterprising
  { id: 21, text: "Saya suka memimpin dan mempengaruhi orang lain.", dimension: "enterprising", framework: "riasec" },
  { id: 22, text: "Saya tertarik memulai bisnis atau proyek sendiri.", dimension: "enterprising", framework: "riasec" },

  // RIASEC — Conventional
  { id: 23, text: "Saya suka pekerjaan yang terorganisir dengan prosedur jelas.", dimension: "conventional", framework: "riasec" },
  { id: 24, text: "Saya teliti dalam mengelola data dan angka.", dimension: "conventional", framework: "riasec" },
];

export const likertLabels = [
  "Sangat Tidak Setuju",
  "Tidak Setuju",
  "Netral",
  "Setuju",
  "Sangat Setuju",
];