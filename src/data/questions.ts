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

  // HEXACO placeholders (items 25-36) — awaiting EJ content
  { id: 25, text: '[EJ_PENDING] Honesty-Humility 3', dimension: 'honesty', framework: 'hexaco', reverse: true },
  { id: 26, text: '[EJ_PENDING] Honesty-Humility 4', dimension: 'honesty', framework: 'hexaco', reverse: false },
  { id: 27, text: '[EJ_PENDING] Emotionality 3', dimension: 'emotionality', framework: 'hexaco', reverse: true },
  { id: 28, text: '[EJ_PENDING] Emotionality 4', dimension: 'emotionality', framework: 'hexaco', reverse: false },
  { id: 29, text: '[EJ_PENDING] Extraversion 3', dimension: 'extraversion', framework: 'hexaco', reverse: true },
  { id: 30, text: '[EJ_PENDING] Extraversion 4', dimension: 'extraversion', framework: 'hexaco', reverse: false },
  { id: 31, text: '[EJ_PENDING] Agreeableness 3', dimension: 'agreeableness', framework: 'hexaco', reverse: true },
  { id: 32, text: '[EJ_PENDING] Agreeableness 4', dimension: 'agreeableness', framework: 'hexaco', reverse: false },
  { id: 33, text: '[EJ_PENDING] Conscientiousness 3', dimension: 'conscientiousness', framework: 'hexaco', reverse: true },
  { id: 34, text: '[EJ_PENDING] Conscientiousness 4', dimension: 'conscientiousness', framework: 'hexaco', reverse: false },
  { id: 35, text: '[EJ_PENDING] Openness 3', dimension: 'openness', framework: 'hexaco', reverse: true },
  { id: 36, text: '[EJ_PENDING] Openness 4', dimension: 'openness', framework: 'hexaco', reverse: false },

  // RIASEC placeholders (items 37-48) — awaiting EJ content
  { id: 37, text: '[EJ_PENDING] Realistic 3', dimension: 'realistic', framework: 'riasec', reverse: false },
  { id: 38, text: '[EJ_PENDING] Realistic 4', dimension: 'realistic', framework: 'riasec', reverse: false },
  { id: 39, text: '[EJ_PENDING] Investigative 3', dimension: 'investigative', framework: 'riasec', reverse: false },
  { id: 40, text: '[EJ_PENDING] Investigative 4', dimension: 'investigative', framework: 'riasec', reverse: false },
  { id: 41, text: '[EJ_PENDING] Artistic 3', dimension: 'artistic', framework: 'riasec', reverse: false },
  { id: 42, text: '[EJ_PENDING] Artistic 4', dimension: 'artistic', framework: 'riasec', reverse: false },
  { id: 43, text: '[EJ_PENDING] Social 3', dimension: 'social', framework: 'riasec', reverse: false },
  { id: 44, text: '[EJ_PENDING] Social 4', dimension: 'social', framework: 'riasec', reverse: false },
  { id: 45, text: '[EJ_PENDING] Enterprising 3', dimension: 'enterprising', framework: 'riasec', reverse: false },
  { id: 46, text: '[EJ_PENDING] Enterprising 4', dimension: 'enterprising', framework: 'riasec', reverse: false },
  { id: 47, text: '[EJ_PENDING] Conventional 3', dimension: 'conventional', framework: 'riasec', reverse: false },
  { id: 48, text: '[EJ_PENDING] Conventional 4', dimension: 'conventional', framework: 'riasec', reverse: false },
];

export const likertLabels = [
  "Sangat Tidak Setuju",
  "Tidak Setuju",
  "Netral",
  "Setuju",
  "Sangat Setuju",
];