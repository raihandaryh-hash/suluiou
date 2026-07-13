// src/data/dapurPetaContent.ts
// Dapur Peta — halaman transparansi metodologi Peta Skill Sulu.
// Copy user-facing VERBATIM dari Sulu_Dapur_Peta_Draft_v1.md (Fable, 11 Jul 2026),
// nol parafrase. Spec implementasi & catatan sumber ada di komentar inline.
// Tabel crosswalk dirakit dari sumber tertelusur (grep kode live + RT-10/RT-13
// Research Substrate 2) — sel tanpa sumber tertelusur wajib strip (—), tidak
// dikarang. Lihat deviasi log di akhir eksekusi untuk daftar sel yang di-strip.

import { NODES, CONNECTION_BASIS } from "./skillMapContent";

// ─────────────────────────────────────────────────────────────
// Copy user-facing (verbatim dari draft, register "Anda")
// ─────────────────────────────────────────────────────────────

export const dapurPetaPembuka = {
  body: "Halaman ini menunjukkan bahan-bahan peta skill Sulu: sumbernya, cara kami menyusunnya, batas yang kami ketahui, dan catatan koreksi kami. Ditulis untuk guru BK, orang tua, dan pemeriksa.",
};

export const dapurPetaSeksiA = {
  title: "Peta ini bukan alat ukur",
  body: "Peta skill Sulu adalah **peta baca**, bukan alat ukur. Ia tidak menguji Anda atau anak Anda, tidak memberi skor, dan tidak menyimpulkan siapa cocok menjadi apa. Fungsinya seperti peta kota: menunjukkan apa saja yang ada, mana yang berdekatan, dan pintu mana yang bisa dibuka — keputusan berjalan ke mana tetap di tangan pembacanya.\n\nKami juga tidak menciptakan daftar skill ini sendiri. Peta ini adalah **kurasi dan terjemahan**: kami memilih dari taksonomi yang sudah dipakai dunia (rinciannya di seksi berikut), menerjemahkannya ke bahasa yang bisa dibaca siswa SMA, dan menyusunnya dalam empat lapis supaya mudah dijelajahi. Yang orisinal dari kami adalah susunan dan bahasanya; isinya berdiri di atas kerja lembaga-lembaga yang jauh lebih besar dari kami.",
  // Catatan internal (TIDAK dirender): jangan sebut "HIMPSI Bab XIII" di halaman
  // publik — itu bahasa white paper. Di sini cukup bahasa fungsi.
};

export const dapurPetaSeksiB = {
  title: "Dari mana isinya",
  bodyBefore: "Peta ini disusun dari sumber kerangka skill World Economic Forum (Global Skills Taxonomy dan Future of Jobs Report), basis data okupasi O*NET milik Departemen Tenaga Kerja AS, serta data ketenagakerjaan Indonesia (BPS, ILO). Hasil kurasinya adalah 25 kotak dalam empat lapis yang Anda lihat di peta.\n\nSetiap kotak bisa dilacak. Tabel di bawah menunjukkan padanan tiap kotak di lima kerangka rujukan. Tanda strip (—) berarti kotak itu tidak punya padanan langsung di kerangka tersebut.",
  bodyAfter: "Di luar peta ini, sudah ada peta-peta lain. Indonesia punya 8 Dimensi Profil Lulusan (Permendikdasmen 10/2025) dan SKKNI; Malaysia punya MQF yang eksplisit memuat pendidikan berbasis nilai; Arab Saudi punya HCDP dengan pilar identitas Islami. Peta Sulu tidak menggantikan satu pun dari itu — ia peta baca untuk satu kebutuhan spesifik: siswa SMA/MA yang sedang menjajaki arah, dengan jangkar dunia kerja (WEF) dan lensa pelajar (Education 4.0).",
};

export const dapurPetaSeksiC = {
  title: "Dari mana garis-garisnya",
  intro:
    "Garis antar-kotak di peta bukan hukum sebab-akibat. Setiap garis punya salah satu dari empat dasar, dan kami mencatatnya satu per satu di dalam kode platform:",
  dasar: [
    {
      label: "Satu rumpun di taksonomi.",
      desc: "Kedua skill tercatat dalam kelompok yang sama di kerangka WEF. Contoh: berpikir analitis dan berpikir sistemik.",
    },
    {
      label: "Ada literatur yang menghubungkan.",
      desc: "Penelitian ilmiah menemukan kaitan antara keduanya. Untuk garis jenis ini kami juga mencatat batasnya — misalnya bila penelitiannya dilakukan pada perawat dewasa, bukan remaja, catatan itu ikut tersimpan.",
    },
    {
      label: "Keputusan pendidikan kami.",
      desc: "Sebagian garis kami gambar karena secara pedagogis masuk akal berdampingan, tanpa penelitian pasangan yang spesifik. Kami menyatakannya jujur sebagai keputusan desain, bukan menyamarkannya sebagai temuan riset.",
    },
    {
      label: "Jalur adaptasi.",
      desc: "Garis dari dua bidang yang tugas rutinnya sedang diambil mesin (klerikal dan ritel manual) bermakna lain: ia menunjuk skill yang menjadi bekal berpindah peran. Penjelasannya ada langsung di kotak masing-masing.",
    },
  ],
  ujiLuar:
    "Kami juga menguji garis-garis ini dari luar. Kami membandingkannya dengan basis data okupasi Eropa (ESCO, ribuan pekerjaan): tujuh pasangan terkonfirmasi memang muncul bersama di pekerjaan nyata. Sisanya tidak terbukti oleh uji itu — tapi juga tidak terbantah, karena ujinya sendiri terbatas: ESCO dirancang untuk skill kerja teknis Eropa, dan banyak skill di peta kami (terutama yang bersifat watak dan cara berpikir) memang jarang tercatat sebagai syarat formal pekerjaan di sana. Kami menyebut hasil ini indikatif, bukan validasi.",
  // Catatan internal (TIDAK dirender): jumlah garis per kategori JANGAN
  // di-hardcode di copy — dirender dari CONNECTION_BASIS live (lihat
  // hitunganGarisPerBasis di bawah) supaya tidak basi setelah eksekusi
  // Bagian 1 Gelombang 2.
};

export const dapurPetaSeksiD = {
  title: "Peran platform, peran manusia",
  paragraf1:
    "Sebuah platform intervensi, secara bersendirian, tidak mampu mengubah arah hidup siswa, sebagaimana dikemukakan oleh data. Rangkuman empat dekade penelitian intervensi karier menemukan intervensi lewat komputer saja punya efek yang hampir nol, sementara efek terbesar justru datang dari **dukungan konselor dan manusia pendamping**. Karena itu, Sulu dirancang sebagai platform pendukung manusia: peta dan bahan ada di layar, percakapannya terjadi dengan pendamping (guru BK, psikolog, konselor, dan selainnya) dan orang tua.",
  paragraf2:
    "Konteks Indonesianya membuat ini makin penting: rasio guru BK terhadap siswa di lapangan sekitar satu banding lima ratusan. Sulu tidak menggantikan guru BK — ia menambah kapasitas: menyiapkan bahan supaya waktu tatap muka yang sedikit itu terpakai untuk percakapan, bukan penjelasan dari nol.",
  paragraf3:
    "Soal AI. AI dipakai di dapur Sulu sebagai alat bantu menyusun dan merangkum — bukan sebagai sumber kebenaran. Semua klaim di peta bersumber pada dokumen yang bisa Anda periksa, bukan pada jawaban AI. Kami juga mempertimbangkan penelitian yang menemukan bahwa AI bisa bias dalam merekomendasikan jurusan atau gengsi karier berdasarkan latar belakang seseorang. Karena itu, AI di Sulu dilarang keras merekomendasikan jurusan atau memvonis kecocokan — perannya berhenti di membantu siswa berpikir, bukan memutuskan untuknya.",
};

export type DapurPetaCorrection = {
  title: string;
  body: string;
};

export const dapurPetaSeksiE = {
  title: "Yang kami rawat dan koreksi",
  intro:
    "Peta ini (dan juga platform Sulu secara keseluruhan) dirawat seperti karya ilmiah: diperiksa berkala, dan setiap koreksi dicatat terbuka. Kami terus melakukan pemeriksaan, karena peta yang dipakai orang banyak harus terus diuji. Beberapa catatan dari pemeriksaan kami sendiri:",
  // Correction log — komponen daftar yang mudah ditambah (spec §4). Setiap
  // koreksi baru di-prepend di sini, bukan section baru di tempat lain.
  corrections: [
    {
      title: "Label \"terbukti kausal\" kami turunkan",
      body: "dari satu pasangan skill setelah kami memeriksa ulang penelitiannya: temuannya nyata, tapi diteliti pada populasi lansia, bukan remaja. Label yang lebih jujur adalah \"ada kaitan menurut literatur, dengan catatan\".",
    },
    {
      title: "Satu angka risiko otomasi kami hapus",
      body: "karena setelah dua putaran pencarian, sumber primernya tidak pernah ditemukan. Kami menggantinya dengan angka ILO yang bisa dilacak.",
    },
    {
      title: "Angka keuangan syariah kami koreksi",
      body: "ke sumber resmi OJK setelah menemukan angka lama tercampur antara dua ukuran yang berbeda.",
    },
    {
      title: "Satu klaim internal kami tarik",
      body: "kami pernah menyebut kerangka eksplorasi kami \"tervalidasi di lapangan\". Yang benar: kerangka itu pernah dipakai di lapangan — dipakai bukan berarti tervalidasi, dan kami mengoreksi bahasanya.",
    },
  ] as DapurPetaCorrection[],
  closing:
    "Daftar ini hidup. Kalau Anda menemukan angka atau klaim di peta yang menurut Anda keliru, tolong sampaikan, kami sangat menghargai saran dan koreksi Anda.",
};

export const dapurPetaPenutup = {
  body: "Aturan yang kami pegang: setiap klaim ber-angka di platform ini punya sumber yang dicantumkan. Kalau Anda menemukan klaim tanpa sumber, perlakukan ia sebagai belum berdasar dan kabari kami.",
  email: "raihan@bahasa.iou.edu.gm",
  // PERHATIAN: verifikasi Raihan wajib sebelum ship — brief eksekusi minta
  // konfirmasi alamat ini benar-benar aktif, jangan asumsikan typo/benar.
};

// ─────────────────────────────────────────────────────────────
// Tabel crosswalk 25 × 5 — kerangka
// ─────────────────────────────────────────────────────────────
// Perakitan baru (belum pernah dirakit lengkap di mana pun sebelumnya).
// Sumber per kolom, wajib tertelusur:
//   - Kotak Sulu: NODES[].name (kode live)
//   - WEF GST: NODES[].techName (kode live) — RT-10/RT-11 mengonfirmasi
//     techName di-map langsung dari GST/Future of Jobs Report untuk mayoritas
//     Layer 0-2. Dipakai verbatim sebagai padanan GST.
//   - Education 4.0: TIDAK ADA sumber tertelusur per-node di kode maupun
//     Research Substrate 2 (RT-10/RT-8/RT-13 tidak pernah memetakan node
//     individual ke Education 4.0 Taxonomy — hanya disebut sebagai "lensa
//     pelajar" di level konsep). STRIP (—) untuk semua 25 baris. Dicatat di
//     deviasi log; kandidat kerja lanjutan bila Education 4.0 crosswalk
//     dibutuhkan di masa depan.
//   - O*NET: TIDAK ADA mapping per-node tertelusur (RT-2/RT-10 membahas
//     O*NET Content Model di level taksonomi umum, bukan crosswalk per node
//     eksplisit). STRIP (—) untuk semua 25 baris. Dicatat di deviasi log.
//   - ESCO: dari RT-13 (Research Substrate 2, 8 Jul 2026) — 23 dari 25 node
//     dipetakan ke ESCO skill title terdekat via search API. 2 node TANPA
//     padanan (dikonfirmasi RT-13 dan RT-10, konsisten): metakognisi,
//     keuangan-syariah. Nilai kolom = ESCO skill title verbatim dari RT-13.
//   - NACE: dari 7 label kompetensi NACE 2024 yang sudah live di
//     src/pages/KenaliDirimuSkill.tsx & Sintesis.tsx (Phase 2B, COMPETENCY_LABELS)
//     — dipetakan manual ke node terdekat berdasarkan kedekatan makna.
//     Bukan mapping resmi/tervalidasi silang, dicatat sebagai such di
//     deviasi log. Node tanpa padanan NACE jelas = strip (—).

export type CrosswalkRow = {
  nodeId: string;
  kotakSulu: string;
  wefGst: string;
  education40: string;
  onet: string;
  esco: string;
  nace: string;
};

// Padanan ESCO per node, verbatim dari RT-13 (Research Substrate 2).
// Node yang tidak muncul di peta ini = tanpa padanan ESCO (strip).
const ESCO_MAP: Record<string, string> = {
  "berpikir-analitis": "think analytically",
  "berpikir-sistemik": "systems thinking",
  "literasi-ai": "principles of artificial intelligence",
  "manajemen-proyek": "project management",
  "rasa-ingin-tahu": "demonstrate curiosity",
  "berpikir-kreatif": "think creatively",
  resiliensi: "organisational resilience",
  "kepedulian-lingkungan": "promote environmental awareness",
  empati: "show empathy",
  "komunikasi-kompleks": "apply technical communication skills",
  mengajar: "teach teaching principles",
  pendidikan: "education administration",
  "energi-terbarukan": "renewable energy technologies",
  etika: "ethics",
  "keamanan-digital": "cyber security",
  "literasi-teknologi": "have computer literacy",
  "pertanian-modern": "work independently in agriculture",
  kepemimpinan: "leadership principles",
  kesehatan: "public health",
  "teknologi-digital": "computer technology",
  // metakognisi: tanpa padanan (RT-13 & RT-10 konsisten)
  // keuangan-syariah: tanpa padanan (RT-13 & RT-10 konsisten)
  // klerikal, ritel-manual: di luar 23 node yang diuji RT-13 (sektor
  // domain/adaptasi, bukan bagian dari 21 node ber-mapping RT-13 asli) —
  // strip, tidak ada sumber ESCO tertelusur untuk keduanya.
};

// Padanan NACE per node — mapping manual dari 7 label kompetensi NACE 2024
// (COMPETENCY_LABELS, live di KenaliDirimuSkill.tsx/Sintesis.tsx) ke node
// yang maknanya paling dekat. Bukan mapping resmi bersumber; dicatat di
// deviasi log. Hanya dipetakan ke SATU node paling representatif per label
// NACE (bukan one-to-many) supaya tidak mengulang masalah MECE yang sudah
// diputuskan permanen di ISTILAH_BRIDGE (Jembatan Istilah boleh
// one-to-many; Dapur Peta menegakkan MECE).
const NACE_MAP: Record<string, string> = {
  "berpikir-analitis": "Berpikir Kritis",
  "komunikasi-kompleks": "Komunikasi",
  // "Kerja Sama Tim" — tidak ada satu node tunggal yang representasinya
  // jelas tanpa tumpang tindih (empati/kepemimpinan sama-sama relevan);
  // tidak dipaksakan, strip.
  "literasi-teknologi": "Literasi Teknologi",
  kepemimpinan: "Kepemimpinan",
  etika: "Profesionalisme",
  "kesadaran-diri": "Pengembangan Diri & Karier",
};

export const crosswalkTable: CrosswalkRow[] = NODES.map((n) => ({
  nodeId: n.id,
  kotakSulu: n.name,
  wefGst: n.techName,
  education40: "—",
  onet: "—",
  esco: ESCO_MAP[n.id] ?? "—",
  nace: NACE_MAP[n.id] ?? "—",
}));

// ─────────────────────────────────────────────────────────────
// Hitungan garis per basis — dirender live dari CONNECTION_BASIS,
// TIDAK di-hardcode (spec §3 draft + brief eksekusi item 3).
// ─────────────────────────────────────────────────────────────

export type ConnectionBasisCounts = {
  taxonomy: number;
  constructLiterature: number;
  design: number;
  total: number;
  escoConfirmed: number; // pasangan bertag esco-cooccurrence
  escoHighestPair: string; // label pasangan koefisien tertinggi (verbatim RT-13)
  escoHighestCoefficient: string;
};

export function getConnectionBasisCounts(): ConnectionBasisCounts {
  const taxonomy = CONNECTION_BASIS.filter((e) => e.basis === "taxonomy").length;
  const constructLiterature = CONNECTION_BASIS.filter((e) => e.basis === "construct-literature").length;
  const design = CONNECTION_BASIS.filter((e) => e.basis === "design").length;
  const escoConfirmed = CONNECTION_BASIS.filter((e) => e.tags?.includes("esco-cooccurrence")).length;
  return {
    taxonomy,
    constructLiterature,
    design,
    total: CONNECTION_BASIS.length,
    escoConfirmed,
    // Angka ini terverifikasi di Research Substrate 2 RT-13 (8 Jul 2026,
    // "tujuh pasangan terkonfirmasi" + koefisien tertinggi 0,45) — aman
    // dipakai verbatim per brief eksekusi. escoConfirmed di atas (dihitung
    // dari tag live) adalah cross-check mekanis terhadap angka RT-13 ini,
    // bukan pengganti.
    escoHighestPair: "energi-terbarukan ↔ kepedulian-lingkungan",
    escoHighestCoefficient: "0,45",
  };
}
