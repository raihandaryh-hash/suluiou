// src/data/skillMapContent.ts
// AUTO-EXTRACTED VERBATIM dari src/pages/SkillMap.tsx (GitHub main), anti-watering-down.
// Sumber per-node tetap di field `source`. Editable-ready: konten skill-map tinggal di sini, bukan hardcode di JSX.
//
// ASAL-USUL & PRINSIP (deklarasi, per Komponen #5 audit 8 Jul 2026):
// Skill-map ini berawal dari 5 essential skills Pak Dillo (IOU Fair, tanpa referensi akademik),
// lalu diberi fondasi akademik WEF Future of Jobs / O*NET / BPS oleh Raihan+Claude (Juni 2026).
// Sintesis 4-layer ini adalah judgment desain pedagogis Sulu sendiri, BUKAN kutipan satu framework
// eksternal tunggal — connections/relasi antar-skill adalah peta pedagogis, edge bersifat tak-berarah
// kecuali ditandai causal (2 pasang: kesadaran-diri<->empati, dan dulu metakognisi<->berpikir-analitis
// yang sudah dibongkar 8 Jul karena sitasi kedua terbukti fabrikasi/salah-atribusi).
// Lihat CONNECTION_BASIS di bawah untuk klasifikasi provenance tiap edge non-causal.

export interface SkillNode { id: string; layer: number; name: string; techName: string; description: string; aiRisk: "safe"|"augment"|"vulnerable"; aiNote: string; source: string; wefData?: string; indonesiaData?: string; connections: string[]; causal?: { to: string; direction: "to"|"from"|"bidirectional"; citation: string }[]; isProvenCausal?: boolean; sectorStatus?: "growing"|"vulnerable" }

export interface SkillLayer { id: number; name: string; subtitle: string; note: string; colors: { bg: string; border: string; text: string; pill: string; pillBorder: string; pillText: string; dot: string; ring: string } }

export const LAYERS: SkillLayer[] = [
  { id: 0, name: "Sikap dan Disposisi", subtitle: "Ini akar dari segalanya. Bukan yang diajarkan di kelas, tapi terbentuk dari cara kamu menghadapi hidup sehari-hari, pilihan kecil, kegagalan, dan bagaimana kamu bangkit lagi. Tanpa fondasi ini, skill lain mudah goyah.", note: "Contoh: Rasa ingin tahu yang terus menyala, ulet menghadapi kesulitan, jujur pada diri sendiri, dan bertanggung jawab atas pilihanmu.", colors: { bg: "#FEF3C7", border: "#FCD34D", text: "#92400E", pill: "#FFFBEB", pillBorder: "#FDE68A", pillText: "#78350F", dot: "#F59E0B", ring: "#FCD34D" } },
  { id: 1, name: "Kapasitas Manusia", subtitle: "Ini yang membuat manusia sulit digantikan AI, setidaknya untuk waktu yang lama. Mesin bisa menghitung dan mengolah data, tapi belum bisa benar-benar memahami orang, memimpin dengan hati, atau menemukan solusi di situasi yang rumit.", note: "Contoh: Empati, berpikir kritis, kepemimpinan, dan kreativitas.", colors: { bg: "#F0FDFA", border: "#5EEAD4", text: "#134E4A", pill: "#F0FDFA", pillBorder: "#99F6E4", pillText: "#0F766E", dot: "#14B8A6", ring: "#5EEAD4" } },
  { id: 2, name: "Skill Lintas Bidang", subtitle: "Keterampilan yang berguna di hampir semua pekerjaan. Bisa dilatih melalui kursus, pengalaman, dan latihan berulang, tapi hasilnya akan jauh lebih kuat kalau ditopang oleh Layer 0 dan 1.", note: "Contoh: Komunikasi yang jelas di berbagai situasi, literasi data dan AI, mengajar atau membimbing orang lain, serta kepedulian terhadap lingkungan.", colors: { bg: "#EFF6FF", border: "#93C5FD", text: "#1E3A5F", pill: "#EFF6FF", pillBorder: "#BFDBFE", pillText: "#1D4ED8", dot: "#3B82F6", ring: "#93C5FD" } },
  { id: 3, name: "Domain dan Sektor", subtitle: "Keahlian khusus yang dibutuhkan di bidang atau industri tertentu. Inilah yang biasanya membuatmu dibutuhkan oleh tempat kerja tertentu.", note: "Contoh: Keuangan syariah, energi terbarukan, pendidikan anak, atau pelayanan kesehatan masyarakat.", colors: { bg: "#F8FAFC", border: "#CBD5E1", text: "#334155", pill: "#F8FAFC", pillBorder: "#E2E8F0", pillText: "#475569", dot: "#64748B", ring: "#CBD5E1" } },
];

export const AI_RISK = {
  safe: { label: "Aman dari AI", sublabel: "Tidak atau sangat sulit disubstitusi", bg: "#DCFCE7", text: "#166534", dot: "#22C55E" },
  augment: { label: "AI membantu", sublabel: "Manusia + AI lebih kuat dari keduanya sendiri", bg: "#FEF9C3", text: "#713F12", dot: "#EAB308" },
  vulnerable: { label: "Tugas berisiko tinggi", sublabel: "Tugas spesifik dalam domain ini rentan diotomasi", bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444" },
} as const;

export const NODES: SkillNode[] = [
  // LAYER 0
  { id: "rasa-ingin-tahu", layer: 0, name: "Rasa Ingin Tahu yang Bertahan", techName: "Curiosity and Lifelong Learning", description: "Tidak mati setelah dapat nilai. Tidak berhenti setelah ujian selesai. Kecenderungan terus bertanya bahkan ketika tidak ada yang mewajibkan, dan mencari jawabannya sendiri.", aiRisk: "safe" as const, aiNote: "Motivasi internal dan rasa heran yang autentik tidak bisa direplikasi mesin.", source: "WEF Global Skills Taxonomy (Self-Efficacy cluster); WEF Future of Jobs Report 2025, Ch. 3", wefData: "Top 10 core skill 2025. Tumbuh paling cepat di sektor Insurance (+83%), Education, dan Telecommunications.", connections: ["berpikir-analitis", "literasi-ai", "mengajar"] },
  { id: "resiliensi", layer: 0, name: "Resiliensi", techName: "Resilience, Flexibility and Agility", description: "Kemampuan berfungsi di tengah ketidakpastian, kegagalan, atau perubahan mendadak. Bukan tidak merasakan tekanan, tetap bergerak di bawahnya.", aiRisk: "safe" as const, aiNote: "Adaptasi terhadap situasi baru yang tidak terduga belum bisa direplikasi AI secara andal.", source: "WEF Future of Jobs Report 2025, Chapter 3, Figure 3.7", wefData: "Skill #2 terbanyak disebut employer sebagai esensial. Naik +17 poin sejak 2023. Pembeda paling kuat antara pekerjaan yang tumbuh vs yang menyusut.", connections: ["berpikir-kreatif", "kepemimpinan"] },
  { id: "kesadaran-diri", layer: 0, name: "Kesadaran Diri", techName: "Motivation and Self-Awareness / Self-Concept Clarity", description: "Tahu apa yang kamu percaya, bagaimana kamu bereaksi, dan mengapa. Bukan soal percaya diri, soal keakuratan dalam melihat diri sendiri.", aiRisk: "safe" as const, aiNote: "Membutuhkan pengalaman hidup dan kapasitas refleksi yang mendalam.", source: "WEF Global Skills Taxonomy; Krol & Bartz (2021), Emotion, DOI: 10.1037/emo0000943", wefData: "WEF Skill #5 (Motivation and Self-Awareness).", connections: ["empati", "metakognisi"], causal: [{ to: "empati", direction: "to" as const, citation: "Krol & Bartz (2021): Tiga studi terintegrasi termasuk satu desain eksperimental (N=658). Ketika self-concept clarity dilemahkan secara eksperimental, kapasitas empati dan perilaku menolong menurun secara terukur." }], isProvenCausal: true },
  { id: "etika", layer: 0, name: "Etika dan Tanggung Jawab", techName: "Ethics, Civic Responsibility, Environmental Stewardship, Global Citizenship", description: "Kesadaran bahwa pilihan karier dan tindakan sehari-hari punya konsekuensi yang melampaui diri sendiri, terhadap komunitas, lingkungan, dan generasi berikutnya.", aiRisk: "safe" as const, aiNote: "Penilaian moral dalam konteks nyata membutuhkan kapasitas nilai yang bersifat manusiawi.", source: "WEF Global Skills Taxonomy (Ethics cluster); WEF Future of Jobs Report 2025", wefData: "Environmental Stewardship khusus tumbuh di Mining and Metals, serta Government and Public Sector.", connections: ["kepedulian-lingkungan", "mengajar", "keuangan-syariah"] },
  // LAYER 1
  { id: "metakognisi", layer: 1, name: "Metakognisi", techName: "Metacognition", description: "Kemampuan mendeteksi di tengah proses berpikir apakah strategi yang sedang dipakai sudah tepat, dan mengubahnya sebelum terlambat.", aiRisk: "safe" as const, aiNote: "Kesadaran real-time tentang proses kognitif diri sendiri berada di luar kemampuan sistem AI yang ada saat ini.", source: "Pikouli et al. (2023), Journal of Intelligence, DOI: 10.3390/jintelligence11090182", connections: ["kesadaran-diri", "berpikir-analitis", "literasi-ai"] },
  { id: "berpikir-analitis", layer: 1, name: "Berpikir Analitis", techName: "Analytical Thinking", description: "Memecah masalah yang tampak besar dan tidak jelas menjadi bagian-bagian yang bisa diperiksa satu per satu, lalu menyimpulkan berdasarkan bukti.", aiRisk: "augment" as const, aiNote: "AI dapat mengumpulkan dan menyusun data, tapi penilaian akhir dan interpretasi konteks tetap butuh manusia.", source: "WEF Future of Jobs Report 2025, Ch. 3; O*NET Content Model (Process Skills)", wefData: "Skill #1 yang paling banyak disebut employer sebagai esensial, 7 dari 10 perusahaan pada 2025.", connections: ["metakognisi", "rasa-ingin-tahu", "literasi-ai", "manajemen-proyek", "berpikir-sistemik"] },
  { id: "berpikir-kreatif", layer: 1, name: "Berpikir Kreatif", techName: "Creative Thinking", description: "Menghasilkan solusi atau cara pandang yang tidak ada dalam petunjuk yang tersedia. Nilainya naik justru karena AI bisa menangani jawaban yang sudah ada.", aiRisk: "augment" as const, aiNote: "AI menghasilkan variasi dari pola yang ada. Kreativitas yang melampaui pola yang dikenal masih domain manusia.", source: "WEF Future of Jobs Report 2025, Ch. 3", wefData: "Skill #4. Kenaikan terbesar di sektor Insurance & Pensions Management.", connections: ["resiliensi", "literasi-ai"] },
  { id: "berpikir-sistemik", layer: 1, name: "Berpikir Sistemik", techName: "Systems Thinking", description: "Melihat bagaimana bagian-bagian yang terpisah saling memengaruhi satu sama lain, bukan menganalisis satu komponen secara terisolasi.", aiRisk: "safe" as const, aiNote: "Pemahaman tentang interaksi kompleks antara manusia, institusi, dan lingkungan memerlukan kapasitas manusiawi.", source: "WEF Future of Jobs Report 2025; WEF Global Skills Taxonomy (Cognitive Skills cluster)", wefData: "Solidifying di top skills 2030.", connections: ["berpikir-analitis", "kepedulian-lingkungan", "keuangan-syariah"] },
  { id: "empati", layer: 1, name: "Empati dan Mendengarkan Aktif", techName: "Empathy and Active Listening", description: "Memahami kondisi orang lain secara akurat, bukan hanya bersimpati, dan merespons berdasarkan pemahaman itu, bukan asumsi.", aiRisk: "safe" as const, aiNote: "0% substitution potential dari GenAI saat ini. Satu dari skill yang secara eksplisit dikategorikan tidak dapat digantikan AI (WEF/Indeed, 2025).", source: "WEF Future of Jobs Report 2025; Indeed x WEF (2025) GenAI substitution analysis; Krol & Bartz (2021)", wefData: "'Skills rooted in human interaction show no substitution potential.' WEF/Indeed, 2025.", connections: ["kesadaran-diri", "kepemimpinan", "mengajar", "komunikasi-kompleks", "pendidikan", "kesehatan"], causal: [{ to: "kesadaran-diri", direction: "from" as const, citation: "Krol & Bartz (2021), Emotion: Self-concept clarity memprediksi empathic concern dan helping behavior, terbukti dalam desain eksperimental." }], isProvenCausal: true },
  { id: "kepemimpinan", layer: 1, name: "Kepemimpinan dan Pengaruh Sosial", techName: "Leadership and Social Influence", description: "Kemampuan menggerakkan orang lain menuju tujuan bersama, bukan karena jabatan, tapi karena kepercayaan dan kejelasan arah.", aiRisk: "safe" as const, aiNote: "Kepercayaan dan otoritas yang tumbuh dari relasi manusiawi tidak dapat direplikasi mesin.", source: "WEF Future of Jobs Report 2025, Ch. 3", wefData: "Kenaikan terbesar dari semua skill: +22 poin sejak 2023.", connections: ["resiliensi", "empati", "manajemen-proyek", "komunikasi-kompleks"] },
  // LAYER 2
  { id: "literasi-ai", layer: 2, name: "Literasi AI dan Data", techName: "AI and Big Data", description: "Membaca apa yang data katakan. Mengevaluasi output AI secara kritis. Menggunakannya untuk mengambil keputusan yang lebih baik, bukan menggantikan penilaian manusia dengan mesin.", aiRisk: "augment" as const, aiNote: "Skill ini tentang mengawasi AI, bukan dikerjakan AI. Orang yang paham AI menggantikan orang yang tidak paham.", source: "WEF Future of Jobs Report 2025, Ch. 3; WEF Global Skills Taxonomy (Technology Skills)", wefData: "Skill tumbuh tercepat 2025-2030. Naik di lebih dari 90% industri.", connections: ["metakognisi", "berpikir-analitis", "rasa-ingin-tahu", "teknologi-digital", "berpikir-kreatif", "keamanan-digital", "literasi-teknologi"] },
  { id: "keamanan-digital", layer: 2, name: "Keamanan Digital dan Jaringan", techName: "Networks and Cybersecurity", description: "Memahami bagaimana sistem digital bekerja dan bagaimana melindungi data serta infrastruktur dari ancaman yang semakin kompleks.", aiRisk: "augment" as const, aiNote: "AI mendeteksi ancaman otomatis, tapi respons strategis dan keputusan etis tetap butuh manusia.", source: "WEF Future of Jobs Report 2025, Ch. 3", wefData: "Skill #2 tumbuh tercepat. Didorong oleh fragmentasi geopolitik.", connections: ["literasi-ai", "teknologi-digital", "literasi-teknologi"] },
  { id: "literasi-teknologi", layer: 2, name: "Literasi Teknologi", techName: "Technological Literacy", description: "Kemampuan menggunakan, mengevaluasi, dan beradaptasi dengan teknologi baru, tanpa harus membangunnya sendiri.", aiRisk: "augment" as const, aiNote: "Kemampuan beradaptasi lebih bernilai dari keahlian satu platform spesifik.", source: "WEF Future of Jobs Report 2025, Figure 3.7; O*NET Content Model (Technical Skills)", wefData: "Pembeda paling signifikan antara growing vs declining jobs dalam hal skill proficiency (WEF Figure 3.7).", connections: ["literasi-ai", "keamanan-digital", "teknologi-digital", "pertanian-modern"] },
  { id: "manajemen-proyek", layer: 2, name: "Manajemen Proyek dan Sumber Daya", techName: "Project Management / Resource Management", description: "Mengubah tujuan besar menjadi langkah konkret yang bisa dikerjakan tim, dengan sumber daya yang tersedia, waktu, orang, anggaran.", aiRisk: "augment" as const, aiNote: "AI membantu penjadwalan dan alokasi, tapi prioritas dan keputusan tentang manusia tetap domain manajer.", source: "WEF Global Skills Taxonomy (Management Skills); O*NET Resource Management Skills", wefData: "Project Managers termasuk 15 pekerjaan dengan pertumbuhan absolut terbesar secara global.", connections: ["kepemimpinan", "berpikir-analitis", "energi-terbarukan"] },
  { id: "komunikasi-kompleks", layer: 2, name: "Komunikasi Kompleks", techName: "Communication / Engagement Skills", description: "Menyampaikan ide yang rumit kepada orang yang berbeda latar belakang, secara akurat, tanpa menyederhanakan sampai kehilangan makna.", aiRisk: "augment" as const, aiNote: "AI dapat menghasilkan teks, tapi konteks, nada, dan kepekaan terhadap audiens spesifik masih membutuhkan penilaian manusia.", source: "O*NET Content Model (Social Skills); WEF Global Skills Taxonomy (Engagement Skills)", connections: ["empati", "mengajar", "kepemimpinan"] },
  { id: "kepedulian-lingkungan", layer: 2, name: "Kepedulian Lingkungan", techName: "Environmental Stewardship", description: "Memahami dampak nyata pilihan bisnis dan karier terhadap keberlanjutan, dan mengintegrasikannya ke dalam cara kerja sehari-hari.", aiRisk: "safe" as const, aiNote: "Penilaian dampak lingkungan membutuhkan konteks lokal dan nilai yang tidak bisa diotomasi.", source: "WEF Future of Jobs Report 2025; IESR 2024; Bappenas Peta Jalan Tenaga Kerja Hijau 2025", wefData: "Tumbuh signifikan di Oil & Gas, Mining, dan Government sectors.", indonesiaData: "Gap kritis: 1,72 juta green jobs diproyeksikan tersedia pada 2030 (IESR), tapi Kemnaker menargetkan melatih hanya 15.000 orang sampai 2029.", connections: ["etika", "berpikir-sistemik", "energi-terbarukan", "pertanian-modern"] },
  { id: "mengajar", layer: 2, name: "Mengajar dan Mentoring", techName: "Teaching and Mentoring", description: "Mentransfer pemahaman ke orang lain secara efektif, bukan hanya menjelaskan, tapi memastikan orang lain bisa menggunakan pengetahuan itu.", aiRisk: "safe" as const, aiNote: "Pendidikan bermakna membutuhkan kepekaan terhadap kondisi spesifik setiap orang.", source: "WEF Global Skills Taxonomy (Working with Others); WEF Future of Jobs Report 2025", wefData: "University and Higher Education Teachers dan Secondary Education Teachers masuk 15 pekerjaan dengan pertumbuhan absolut terbesar secara global.", connections: ["empati", "komunikasi-kompleks", "etika", "pendidikan", "rasa-ingin-tahu", "kesehatan"] },
  // LAYER 3, GROWING
  { id: "energi-terbarukan", layer: 3, name: "Energi Terbarukan dan Lingkungan", techName: "Renewable Energy / Green Economy", description: "Subsektor yang butuh SDM segera: PLTS (Teknisi Instalasi Panel Surya, Manajer Proyek PLTS, Auditor Energi), Bioenergi (Insinyur Proses, Agronomist Energi), Angin & Geotermal (Teknisi Turbin, Analis Pemetaan, Ahli Geologi Panas Bumi), dan lintas subsektor (Insinyur Integrasi Sistem, Spesialis Energy Storage, Konsultan Carbon Footprint).", aiRisk: "safe" as const, aiNote: "Pekerjaan lapangan dan engineering judgment dalam konteks fisik nyata.", sectorStatus: "growing" as const, source: "IESR 2024; Bappenas Peta Jalan Tenaga Kerja Hijau 2025; Kemnaker RTKN 2025-2029", indonesiaData: "1,72 juta jobs diproyeksikan tersedia pada 2030 (IESR). Kemnaker hanya menargetkan melatih 15.000 orang sampai 2029. Gap ini adalah peluang.", connections: ["kepedulian-lingkungan", "manajemen-proyek"] },
  { id: "teknologi-digital", layer: 3, name: "Teknologi dan Digital", techName: "Information Technology / Digital Economy", description: "Software developer, data analyst, AI/ML engineer, cybersecurity analyst, UI/UX designer, FinTech engineer.", aiRisk: "augment" as const, aiNote: "Entry-level developer turun 20% sejak 2024 (Stanford AI Index 2026). Yang bertahan: yang bisa mengawasi dan mengarahkan sistem AI.", sectorStatus: "growing" as const, source: "WEF FoJ 2025; BPS Sakernas 2024 (KBLI J); Stanford AI Index 2026", wefData: "Big Data Specialist: +110%. FinTech Engineer: +95%. AI/ML Specialist: +85%. Software Developer: +60% (persentase global, WEF FoJ 2025).", indonesiaData: "KBLI J (Informasi & Komunikasi): 1,03 juta pekerja saat ini (0,71% dari total workforce), kecil tapi tumbuh paling cepat.", connections: ["literasi-ai", "keamanan-digital", "literasi-teknologi"] },
  { id: "pendidikan", layer: 3, name: "Pendidikan dan Pengembangan SDM", techName: "Education / Human Capital Development", description: "Pengajar semua jenjang, instructional designer, konselor karier, pelatih vokasi, pengembang kurikulum.", aiRisk: "safe" as const, aiNote: "AI membantu administrasi dan produksi konten, tapi tidak dapat menggantikan proses belajar yang sesungguhnya.", sectorStatus: "growing" as const, source: "WEF FoJ 2025; BPS Sakernas 2024 (KBLI P); OECD 2025 (State of Global Teenage Career Preparation, berbasis PISA 2022)", indonesiaData: "7,16 juta pekerja (4,95% workforce). Secara OECD-wide (bukan Indonesia-spesifik), 39% remaja usia 15 tahun belum jelas arah kariernya, dua kali lipat dibanding kurang dari sedekade lalu (OECD 2025, berbasis PISA 2022).", connections: ["mengajar", "empati"] },
  { id: "kesehatan", layer: 3, name: "Kesehatan dan Layanan Sosial", techName: "Healthcare / Care Economy", description: "Tenaga keperawatan, konselor, social worker, community health worker, psikolog klinis.", aiRisk: "safe" as const, aiNote: "AI membantu diagnostik dan administrasi, tapi perawatan manusia membutuhkan kehadiran fisik dan empati yang tidak dapat digantikan.", sectorStatus: "growing" as const, source: "WEF FoJ 2025; BPS Sakernas 2024 (KBLI Q); ILO World Employment and Social Outlook 2024", wefData: "Nursing Professionals dan Social Work Professionals masuk 15 pekerjaan dengan pertumbuhan absolut terbesar secara global.", indonesiaData: "2,37 juta pekerja saat ini (1,64% workforce). Tumbuh karena aging population.", connections: ["empati", "mengajar"] },
  { id: "keuangan-syariah", layer: 3, name: "Keuangan Syariah dan Halal Economy", techName: "Islamic Finance / Halal Economy", description: "Analis sukuk, konsultan fiqh muamalah terapan, risk manager syariah, auditor halal.", aiRisk: "augment" as const, aiNote: "AI membantu analisis data keuangan, tapi penilaian kepatuhan syariah membutuhkan pengetahuan fiqh yang tidak bisa direplikasi mesin.", sectorStatus: "growing" as const, source: "KNEKS 2024; SGIE Report 2024/2025; OJK Roadmap Keuangan Syariah Indonesia 2023-2027", indonesiaData: "Aset perbankan syariah tumbuh 9,88% dalam setahun (OJK, Des 2024). Pangsa pasar perbankan syariah kini 7,72% dari total perbankan nasional (OJK). Kontribusi HVC (halal value chain) ke PDB: ~26% (KNEKS, 2024). Indonesia #1 modest fashion, #2 halal tourism dunia (SGIE 2024/25).", connections: ["berpikir-sistemik", "etika"] },
  { id: "pertanian-modern", layer: 3, name: "Pertanian Modern dan Agritech", techName: "Agricultural Technology / Food Security", description: "Precision farming specialist, agri-supply chain manager, IoT pertanian, teknisi sistem irigasi cerdas.", aiRisk: "augment" as const, aiNote: "AI mengoptimalkan irigasi dan prediksi panen, tapi manajemen lapangan dan adaptasi di konteks lokal masih butuh manusia.", sectorStatus: "growing" as const, source: "WEF FoJ 2025; BPS Sakernas 2024 (KBLI A); Bappenas RPJMN 2025-2029", wefData: "Farmworkers: pertumbuhan absolut terbesar secara global, proyeksi +35 juta jobs by 2030.", indonesiaData: "40,76 juta pekerja (28,18% workforce), sektor terbesar. Indonesia masih mengimpor gandum, kedelai, dan bawang putih.", connections: ["kepedulian-lingkungan", "literasi-teknologi"] },
  // LAYER 3, VULNERABLE
  { id: "klerikal", layer: 3, name: "Pekerjaan Klerikal dan Administratif", techName: "Clerical Support / Administrative Work", description: "Entri data, pemrosesan dokumen, administrasi rutin, kesekretariatan standar. Bukan orang yang digantikan, tugas spesifik yang sudah bisa dikerjakan AI lebih cepat.", aiRisk: "vulnerable" as const, aiNote: "Paparan GenAI tertinggi di Indonesia: 93,9% pekerjaan klerikal terpapar. 67,5% dalam kelompok risiko tertinggi (ILO, 2024). Eksposur pekerja muda dan dewasa relatif setara, tapi kesenjangan tajam yang nyata ada di gender: perempuan di posisi klerikal berisiko lebih dari 2 kali lipat dibanding laki-laki.", sectorStatus: "vulnerable" as const, source: "ILO Generative AI impact analysis ASEAN 2024; WEF FoJ 2025; BPS Sakernas 2024", indonesiaData: "ILO: secara global, sekitar 3,3% pekerjaan berisiko hilang sepenuhnya akibat GenAI (bukan angka Indonesia-spesifik). Mayoritas mengalami transformasi/augmentasi, bukan hilang total, tapi entry-level administratif paling terdampak dalam jangka pendek.", connections: [] },
  { id: "ritel-manual", layer: 3, name: "Ritel dan Layanan Manual Terstruktur", techName: "Retail / Structured Manual Service", description: "Kasir, petugas inventaris, operator standar, pemrosesan transaksi rutin, tugas berulang yang dapat dipetakan dengan baik oleh mesin.", aiRisk: "vulnerable" as const, aiNote: "Sekitar 56% pekerjaan bergaji di 5 negara ASEAN termasuk Indonesia berisiko tinggi otomasi (ILO 2016). Shop salespersons Indonesia (1,8 juta pekerja) masuk kategori risiko tinggi.", sectorStatus: "vulnerable" as const, source: "ILO ASEAN in Transformation 2016; WEF FoJ 2025; BPS KBLI G dan I", indonesiaData: "27,33 juta pekerja di KBLI G perdagangan (18,89% workforce), sektor terbesar kedua. Ini bukan berarti semua kehilangan pekerjaan, tapi tugas-tugas spesifik dalam sektor ini akan berubah fundamental.", connections: [] },
];

// CONNECTION_BASIS — internal only, TIDAK dirender ke UI. Klasifikasi provenance tiap edge
// non-causal (36 pasangan), per klasifikasi 3-tier handoff Komponen #5 (8 Jul 2026):
// - "taxonomy": kedua node co-member dalam cluster WEF Global Skills Taxonomy yang sama.
// - "construct-literature": definisional/ko-klaster sah menurut literatur, dilabel sebagai desain.
// - "design": murni judgment desain pedagogis Sulu, tanpa dasar eksternal langsung (dinyatakan jujur).
// Tag tambahan "esco-cooccurrence": pasangan yang mendapat konfirmasi ko-okurensi empiris dari ESCO API
// (RT-13, 8 Jul 2026) — koefisien overlap di atas baseline median pasangan acak (lihat Research Substrate 2).
export interface ConnectionBasisEntry { pair: [string, string]; basis: "taxonomy" | "construct-literature" | "design"; tags?: ("esco-cooccurrence")[] }
export const CONNECTION_BASIS: ConnectionBasisEntry[] = [
  { pair: ["kesadaran-diri", "metakognisi"], basis: "construct-literature" },
  { pair: ["berpikir-analitis", "metakognisi"], basis: "construct-literature" },
  { pair: ["literasi-ai", "metakognisi"], basis: "construct-literature" },
  { pair: ["berpikir-analitis", "rasa-ingin-tahu"], basis: "taxonomy" },
  { pair: ["berpikir-analitis", "berpikir-sistemik"], basis: "taxonomy" },
  { pair: ["berpikir-analitis", "literasi-ai"], basis: "construct-literature" },
  { pair: ["berpikir-analitis", "manajemen-proyek"], basis: "construct-literature", tags: ["esco-cooccurrence"] },
  { pair: ["berpikir-kreatif", "resiliensi"], basis: "taxonomy" },
  { pair: ["berpikir-kreatif", "literasi-ai"], basis: "construct-literature" },
  { pair: ["berpikir-sistemik", "kepedulian-lingkungan"], basis: "construct-literature" },
  { pair: ["berpikir-sistemik", "keuangan-syariah"], basis: "design" },
  { pair: ["empati", "kepemimpinan"], basis: "taxonomy" },
  { pair: ["empati", "mengajar"], basis: "taxonomy" },
  { pair: ["empati", "komunikasi-kompleks"], basis: "construct-literature", tags: ["esco-cooccurrence"] },
  { pair: ["empati", "pendidikan"], basis: "construct-literature" },
  { pair: ["empati", "kesehatan"], basis: "construct-literature" },
  { pair: ["energi-terbarukan", "kepedulian-lingkungan"], basis: "taxonomy", tags: ["esco-cooccurrence"] },
  { pair: ["energi-terbarukan", "manajemen-proyek"], basis: "construct-literature", tags: ["esco-cooccurrence"] },
  { pair: ["etika", "kepedulian-lingkungan"], basis: "taxonomy" },
  { pair: ["etika", "mengajar"], basis: "construct-literature" },
  { pair: ["etika", "keuangan-syariah"], basis: "design" },
  { pair: ["keamanan-digital", "literasi-ai"], basis: "taxonomy" },
  { pair: ["keamanan-digital", "teknologi-digital"], basis: "taxonomy" },
  { pair: ["keamanan-digital", "literasi-teknologi"], basis: "construct-literature" },
  { pair: ["kepedulian-lingkungan", "pertanian-modern"], basis: "construct-literature" },
  { pair: ["kepemimpinan", "manajemen-proyek"], basis: "taxonomy", tags: ["esco-cooccurrence"] },
  { pair: ["kepemimpinan", "resiliensi"], basis: "taxonomy" },
  { pair: ["kepemimpinan", "komunikasi-kompleks"], basis: "construct-literature", tags: ["esco-cooccurrence"] },
  { pair: ["kesehatan", "mengajar"], basis: "construct-literature" },
  { pair: ["komunikasi-kompleks", "mengajar"], basis: "taxonomy" },
  { pair: ["literasi-ai", "rasa-ingin-tahu"], basis: "construct-literature" },
  { pair: ["literasi-ai", "teknologi-digital"], basis: "taxonomy", tags: ["esco-cooccurrence"] },
  { pair: ["literasi-ai", "literasi-teknologi"], basis: "taxonomy" },
  { pair: ["literasi-teknologi", "teknologi-digital"], basis: "taxonomy" },
  { pair: ["literasi-teknologi", "pertanian-modern"], basis: "construct-literature" },
  { pair: ["mengajar", "pendidikan"], basis: "taxonomy" },
  { pair: ["mengajar", "rasa-ingin-tahu"], basis: "construct-literature" },
];

export const ISTILAH_BRIDGE: { popular: string; layer: string; nodes: { label: string; id: string | null; note?: string }[]; primary: string | false; note?: string }[] = [
  { popular: "Soft skills", layer: "Layer 0 + Layer 1", nodes: [
    { label: "Sikap & Disposisi", id: null, note: "(seluruh Layer 0)" },
    { label: "Kapasitas Manusia", id: null, note: "(seluruh Layer 1)" },
  ], primary: false },
  { popular: "Berpikir Kritis / Critical Thinking", layer: "Layer 1", nodes: [
    { label: "Berpikir Analitis", id: "berpikir-analitis" },
    { label: "Berpikir Sistemik", id: "berpikir-sistemik" },
  ], primary: "berpikir-analitis", note: "Dalam OECD Learning Compass dan framework Pak Dillo, Critical Thinking mencakup kemampuan mengevaluasi bukti dan mempertanyakan asumsi, ini terdistribusi di Berpikir Analitis dan Berpikir Sistemik di peta ini." },
  { popular: "Teamwork", layer: "Layer 1–2", nodes: [
    { label: "Empati", id: "empati" },
    { label: "Kepemimpinan", id: "kepemimpinan" },
    { label: "Komunikasi Kompleks", id: "komunikasi-kompleks" },
  ], primary: "empati" },
  { popular: "Emotional Intelligence / EQ", layer: "Layer 0–1", nodes: [
    { label: "Empati", id: "empati" },
    { label: "Kesadaran Diri", id: "kesadaran-diri" },
  ], primary: "empati" },
  { popular: "Problem solving", layer: "Layer 1", nodes: [
    { label: "Berpikir Analitis", id: "berpikir-analitis" },
    { label: "Berpikir Kreatif", id: "berpikir-kreatif" },
  ], primary: "berpikir-analitis" },
  { popular: "Komunikasi", layer: "Layer 1–2", nodes: [
    { label: "Komunikasi Kompleks", id: "komunikasi-kompleks" },
    { label: "Empati", id: "empati" },
  ], primary: "komunikasi-kompleks" },
  { popular: "Adaptability", layer: "Layer 0", nodes: [{ label: "Resiliensi", id: "resiliensi" }], primary: "resiliensi" },
  { popular: "Growth mindset", layer: "Layer 0", nodes: [
    { label: "Rasa Ingin Tahu", id: "rasa-ingin-tahu" },
    { label: "Resiliensi", id: "resiliensi" },
  ], primary: "rasa-ingin-tahu" },
];

export function buildConnectionMap(): Record<string, Set<string>> {
  const map: Record<string, Set<string>> = {};
  NODES.forEach(n => {
    map[n.id] = new Set(n.connections || []);
    (n.causal || []).forEach(c => map[n.id].add(c.to));
  });
  return map;
}
export const CONNECTION_MAP = buildConnectionMap();
