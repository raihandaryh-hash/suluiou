import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeftRight, X, ChevronDown, ArrowLeft, Search } from "lucide-react";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

const LAYERS = [
  { id: 0, name: "Sikap dan Disposisi", subtitle: "Ini akar dari segalanya. Bukan yang diajarkan di kelas, tapi terbentuk dari cara kamu menghadapi hidup sehari-hari — pilihan kecil, kegagalan, dan bagaimana kamu bangkit lagi. Tanpa fondasi ini, skill lain mudah goyah.", note: "Contoh: Rasa ingin tahu yang terus menyala, ulet menghadapi kesulitan, jujur pada diri sendiri, dan bertanggung jawab atas pilihanmu.", colors: { bg: "#FEF3C7", border: "#FCD34D", text: "#92400E", pill: "#FFFBEB", pillBorder: "#FDE68A", pillText: "#78350F", dot: "#F59E0B", ring: "#FCD34D" } },
  { id: 1, name: "Kapasitas Manusia", subtitle: "Ini yang membuat manusia sulit digantikan AI, setidaknya untuk waktu yang lama. Mesin bisa menghitung dan mengolah data, tapi belum bisa benar-benar memahami orang, memimpin dengan hati, atau menemukan solusi di situasi yang rumit.", note: "Contoh: Empati, berpikir kritis, kepemimpinan, dan kreativitas.", colors: { bg: "#F0FDFA", border: "#5EEAD4", text: "#134E4A", pill: "#F0FDFA", pillBorder: "#99F6E4", pillText: "#0F766E", dot: "#14B8A6", ring: "#5EEAD4" } },
  { id: 2, name: "Skill Lintas Bidang", subtitle: "Keterampilan yang berguna di hampir semua pekerjaan. Bisa dilatih melalui kursus, pengalaman, dan latihan berulang. Tapi hasilnya akan jauh lebih kuat kalau ditopang oleh Layer 0 dan 1.", note: "Contoh: Komunikasi yang jelas di berbagai situasi, literasi data dan AI, mengajar atau membimbing orang lain, serta kepedulian terhadap lingkungan.", colors: { bg: "#EFF6FF", border: "#93C5FD", text: "#1E3A5F", pill: "#EFF6FF", pillBorder: "#BFDBFE", pillText: "#1D4ED8", dot: "#3B82F6", ring: "#93C5FD" } },
  { id: 3, name: "Domain dan Sektor", subtitle: "Keahlian khusus yang dibutuhkan di bidang atau industri tertentu. Inilah yang biasanya membuatmu dibutuhkan oleh tempat kerja tertentu.", note: "Contoh: Keuangan syariah, energi terbarukan, pendidikan anak, atau pelayanan kesehatan masyarakat.", colors: { bg: "#F8FAFC", border: "#CBD5E1", text: "#334155", pill: "#F8FAFC", pillBorder: "#E2E8F0", pillText: "#475569", dot: "#64748B", ring: "#CBD5E1" } },
];

const AI_RISK = {
  safe: { label: "Aman dari AI", sublabel: "Tidak atau sangat sulit disubstitusi", bg: "#DCFCE7", text: "#166534", dot: "#22C55E" },
  augment: { label: "AI membantu", sublabel: "Manusia + AI lebih kuat dari keduanya sendiri", bg: "#FEF9C3", text: "#713F12", dot: "#EAB308" },
  vulnerable: { label: "Tugas berisiko tinggi", sublabel: "Tugas spesifik dalam domain ini rentan diotomasi", bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444" },
};

const NODES = [
  // LAYER 0
  { id: "rasa-ingin-tahu", layer: 0, name: "Rasa Ingin Tahu yang Bertahan", techName: "Curiosity and Lifelong Learning", description: "Tidak mati setelah dapat nilai. Tidak berhenti setelah ujian selesai. Kecenderungan terus bertanya bahkan ketika tidak ada yang mewajibkan — dan mencari jawabannya sendiri.", aiRisk: "safe" as const, aiNote: "Motivasi internal dan rasa heran yang autentik tidak bisa direplikasi mesin.", source: "WEF Global Skills Taxonomy (Self-Efficacy cluster); WEF Future of Jobs Report 2025, Ch. 3", wefData: "Top 10 core skill 2025. Tumbuh paling cepat di sektor Insurance (+83%), Education, dan Telecommunications.", connections: ["berpikir-analitis", "literasi-ai", "mengajar"] },
  { id: "resiliensi", layer: 0, name: "Resiliensi", techName: "Resilience, Flexibility and Agility", description: "Kemampuan berfungsi di tengah ketidakpastian, kegagalan, atau perubahan mendadak. Bukan tidak merasakan tekanan — tetap bergerak di bawahnya.", aiRisk: "safe" as const, aiNote: "Adaptasi terhadap situasi baru yang tidak terduga belum bisa direplikasi AI secara andal.", source: "WEF Future of Jobs Report 2025, Chapter 3, Figure 3.7", wefData: "Skill #2 terbanyak disebut employer sebagai esensial. Naik +17 poin sejak 2023. Pembeda paling kuat antara pekerjaan yang tumbuh vs yang menyusut.", connections: ["berpikir-kreatif", "kepemimpinan"] },
  { id: "kesadaran-diri", layer: 0, name: "Kesadaran Diri", techName: "Motivation and Self-Awareness / Self-Concept Clarity", description: "Tahu apa yang kamu percaya, bagaimana kamu bereaksi, dan mengapa. Bukan soal percaya diri — soal keakuratan dalam melihat diri sendiri.", aiRisk: "safe" as const, aiNote: "Membutuhkan pengalaman hidup dan kapasitas refleksi yang mendalam.", source: "WEF Global Skills Taxonomy; Krol & Bartz (2021), Journal of Emotion, DOI: 10.1037/emo0000943", wefData: "WEF Skill #5 (Motivation and Self-Awareness).", connections: ["empati", "metakognisi"], causal: [{ to: "empati", direction: "to" as const, citation: "Krol & Bartz (2021): Tiga studi terintegrasi termasuk satu desain eksperimental (N=658). Ketika self-concept clarity dilemahkan secara eksperimental, kapasitas empati dan perilaku menolong menurun secara terukur." }], isProvenCausal: true },
  { id: "etika", layer: 0, name: "Etika dan Tanggung Jawab", techName: "Ethics — Civic Responsibility, Environmental Stewardship, Global Citizenship", description: "Kesadaran bahwa pilihan karier dan tindakan sehari-hari punya konsekuensi yang melampaui diri sendiri — terhadap komunitas, lingkungan, dan generasi berikutnya.", aiRisk: "safe" as const, aiNote: "Penilaian moral dalam konteks nyata membutuhkan kapasitas nilai yang bersifat manusiawi.", source: "WEF Global Skills Taxonomy (Ethics cluster); WEF Future of Jobs Report 2025", wefData: "Environmental Stewardship khusus tumbuh di Mining, Oil & Gas, dan Government sectors.", connections: ["kepedulian-lingkungan", "mengajar"] },
  // LAYER 1
  { id: "metakognisi", layer: 1, name: "Metakognisi", techName: "Metacognition", description: "Kemampuan mendeteksi di tengah proses berpikir apakah strategi yang sedang dipakai sudah tepat, dan mengubahnya sebelum terlambat.", aiRisk: "safe" as const, aiNote: "Kesadaran real-time tentang proses kognitif diri sendiri berada di luar kemampuan sistem AI yang ada saat ini.", source: "Pikouli et al. (2023), Journal of Intelligence, DOI: 10.3390/jintelligence11090182; Journal of Intelligence, Vol. 13, No. 3 (2025)", connections: ["kesadaran-diri", "berpikir-analitis"], causal: [{ to: "berpikir-analitis", direction: "bidirectional" as const, citation: "Pikouli et al. (2023): Intervensi metakognitif secara kausal meningkatkan analytical thinking (eksperimental, terkontrol). J. Intelligence (2025): Latihan analytical thinking secara kausal memperkuat regulasi metakognitif. Hubungan ini dua arah." }], isProvenCausal: true },
  { id: "berpikir-analitis", layer: 1, name: "Berpikir Analitis", techName: "Analytical Thinking", description: "Memecah masalah yang tampak besar dan tidak jelas menjadi bagian-bagian yang bisa diperiksa satu per satu, lalu menyimpulkan berdasarkan bukti.", aiRisk: "augment" as const, aiNote: "AI dapat mengumpulkan dan menyusun data, tapi penilaian akhir dan interpretasi konteks tetap butuh manusia.", source: "WEF Future of Jobs Report 2025, Ch. 3; O*NET Content Model (Process Skills)", wefData: "Skill #1 yang paling banyak disebut employer sebagai esensial — 7 dari 10 perusahaan pada 2025.", connections: ["metakognisi", "kesadaran-diri", "rasa-ingin-tahu", "literasi-ai", "manajemen-proyek"], causal: [{ to: "metakognisi", direction: "bidirectional" as const, citation: "Hubungan dua arah yang terbukti secara kausal — lihat node Memantau Cara Berpikirmu Sendiri." }], isProvenCausal: true },
  { id: "berpikir-kreatif", layer: 1, name: "Berpikir Kreatif", techName: "Creative Thinking", description: "Menghasilkan solusi atau cara pandang yang tidak ada dalam petunjuk yang tersedia. Nilainya naik justru karena AI bisa menangani jawaban yang sudah ada.", aiRisk: "augment" as const, aiNote: "AI menghasilkan variasi dari pola yang ada. Kreativitas yang melampaui pola yang dikenal masih domain manusia.", source: "WEF Future of Jobs Report 2025, Ch. 3", wefData: "Skill #4. Kenaikan terbesar di sektor Insurance & Pensions Management.", connections: ["resiliensi", "literasi-ai"] },
  { id: "berpikir-sistemik", layer: 1, name: "Berpikir Sistemik", techName: "Systems Thinking", description: "Melihat bagaimana bagian-bagian yang terpisah saling memengaruhi satu sama lain — bukan menganalisis satu komponen secara terisolasi.", aiRisk: "safe" as const, aiNote: "Pemahaman tentang interaksi kompleks antara manusia, institusi, dan lingkungan memerlukan kapasitas manusiawi.", source: "WEF Future of Jobs Report 2025; WEF Global Skills Taxonomy (Cognitive Skills cluster)", wefData: "Solidifying di top skills 2030.", connections: ["berpikir-analitis", "kepedulian-lingkungan"] },
  { id: "empati", layer: 1, name: "Empati dan Mendengarkan Aktif", techName: "Empathy and Active Listening", description: "Memahami kondisi orang lain secara akurat — bukan hanya bersimpati — dan merespons berdasarkan pemahaman itu, bukan asumsi.", aiRisk: "safe" as const, aiNote: "0% substitution potential dari GenAI saat ini. Satu dari skill yang secara eksplisit dikategorikan tidak dapat digantikan AI (WEF/Indeed, 2025).", source: "WEF Future of Jobs Report 2025; Indeed x WEF (2025) GenAI substitution analysis; Krol & Bartz (2021)", wefData: "'Skills rooted in human interaction show no substitution potential.' WEF/Indeed, 2025.", connections: ["kesadaran-diri", "kepemimpinan", "mengajar"], causal: [{ to: "kesadaran-diri", direction: "from" as const, citation: "Krol & Bartz (2021): Self-concept clarity adalah prasyarat kausal untuk empathic concern dan helping behavior — terbukti secara eksperimental." }], isProvenCausal: true },
  { id: "kepemimpinan", layer: 1, name: "Kepemimpinan dan Pengaruh Sosial", techName: "Leadership and Social Influence", description: "Kemampuan menggerakkan orang lain menuju tujuan bersama — bukan karena jabatan, tapi karena kepercayaan dan kejelasan arah.", aiRisk: "safe" as const, aiNote: "Kepercayaan dan otoritas yang tumbuh dari relasi manusiawi tidak dapat direplikasi mesin.", source: "WEF Future of Jobs Report 2025, Ch. 3", wefData: "Kenaikan terbesar dari semua skill: +22 poin sejak 2023.", connections: ["resiliensi", "empati", "manajemen-proyek"] },
  // LAYER 2
  { id: "literasi-ai", layer: 2, name: "Literasi AI dan Data", techName: "AI and Big Data", description: "Membaca apa yang data katakan. Mengevaluasi output AI secara kritis. Menggunakannya untuk mengambil keputusan yang lebih baik — bukan menggantikan penilaian manusia dengan mesin.", aiRisk: "augment" as const, aiNote: "Skill ini tentang mengawasi AI, bukan dikerjakan AI. Orang yang paham AI menggantikan orang yang tidak paham.", source: "WEF Future of Jobs Report 2025, Ch. 3; WEF Global Skills Taxonomy (Technology Skills)", wefData: "Skill tumbuh tercepat 2025-2030. Naik di lebih dari 90% industri.", connections: ["metakognisi", "berpikir-analitis", "rasa-ingin-tahu", "teknologi-digital"] },
  { id: "keamanan-digital", layer: 2, name: "Keamanan Digital dan Jaringan", techName: "Networks and Cybersecurity", description: "Memahami bagaimana sistem digital bekerja dan bagaimana melindungi data serta infrastruktur dari ancaman yang semakin kompleks.", aiRisk: "augment" as const, aiNote: "AI mendeteksi ancaman otomatis, tapi respons strategis dan keputusan etis tetap butuh manusia.", source: "WEF Future of Jobs Report 2025, Ch. 3", wefData: "Skill #2 tumbuh tercepat. Didorong oleh fragmentasi geopolitik.", connections: ["literasi-ai", "teknologi-digital"] },
  { id: "literasi-teknologi", layer: 2, name: "Literasi Teknologi", techName: "Technological Literacy", description: "Kemampuan menggunakan, mengevaluasi, dan beradaptasi dengan teknologi baru — tanpa harus membangunnya sendiri.", aiRisk: "augment" as const, aiNote: "Kemampuan beradaptasi lebih bernilai dari keahlian satu platform spesifik.", source: "WEF Future of Jobs Report 2025, Figure 3.7; O*NET Content Model (Technical Skills)", wefData: "Pembeda paling signifikan antara growing vs declining jobs dalam hal skill proficiency (WEF Figure 3.7).", connections: ["literasi-ai", "keamanan-digital", "teknologi-digital", "pertanian-modern"] },
  { id: "manajemen-proyek", layer: 2, name: "Manajemen Proyek dan Sumber Daya", techName: "Project Management / Resource Management", description: "Mengubah tujuan besar menjadi langkah konkret yang bisa dikerjakan tim, dengan sumber daya yang tersedia — waktu, orang, anggaran.", aiRisk: "augment" as const, aiNote: "AI membantu penjadwalan dan alokasi, tapi prioritas dan keputusan tentang manusia tetap domain manajer.", source: "WEF Global Skills Taxonomy (Management Skills); O*NET Resource Management Skills", wefData: "Project Managers termasuk 15 pekerjaan dengan pertumbuhan absolut terbesar secara global.", connections: ["kepemimpinan", "berpikir-analitis", "energi-terbarukan"] },
  { id: "komunikasi-kompleks", layer: 2, name: "Komunikasi Kompleks", techName: "Communication / Engagement Skills", description: "Menyampaikan ide yang rumit kepada orang yang berbeda latar belakang — secara akurat, tanpa menyederhanakan sampai kehilangan makna.", aiRisk: "augment" as const, aiNote: "AI dapat menghasilkan teks, tapi konteks, nada, dan kepekaan terhadap audiens spesifik masih membutuhkan penilaian manusia.", source: "O*NET Content Model (Social Skills); WEF Global Skills Taxonomy (Engagement Skills)", connections: ["empati", "mengajar", "kepemimpinan"] },
  { id: "kepedulian-lingkungan", layer: 2, name: "Kepedulian Lingkungan", techName: "Environmental Stewardship", description: "Memahami dampak nyata pilihan bisnis dan karier terhadap keberlanjutan — dan mengintegrasikannya ke dalam cara kerja sehari-hari.", aiRisk: "safe" as const, aiNote: "Penilaian dampak lingkungan membutuhkan konteks lokal dan nilai yang tidak bisa diotomasi.", source: "WEF Future of Jobs Report 2025; IESR 2024; Bappenas Peta Jalan Tenaga Kerja Hijau 2025", wefData: "Tumbuh signifikan di Oil & Gas, Mining, dan Government sectors.", indonesiaData: "Gap kritis: 1,72 juta green jobs diproyeksikan tersedia pada 2030 (IESR), tapi Kemnaker menargetkan melatih hanya 15.000 orang sampai 2029.", connections: ["etika", "berpikir-sistemik", "energi-terbarukan"] },
  { id: "mengajar", layer: 2, name: "Mengajar dan Mentoring", techName: "Teaching and Mentoring", description: "Mentransfer pemahaman ke orang lain secara efektif — bukan hanya menjelaskan, tapi memastikan orang lain bisa menggunakan pengetahuan itu.", aiRisk: "safe" as const, aiNote: "Pendidikan bermakna membutuhkan kepekaan terhadap kondisi spesifik setiap orang.", source: "WEF Global Skills Taxonomy (Working with Others); WEF Future of Jobs Report 2025", wefData: "University and Higher Education Teachers dan Secondary Education Teachers masuk 15 pekerjaan dengan pertumbuhan absolut terbesar secara global.", connections: ["empati", "komunikasi-kompleks", "etika", "pendidikan"] },
  // LAYER 3 — GROWING
  { id: "energi-terbarukan", layer: 3, name: "Energi Terbarukan dan Lingkungan", techName: "Renewable Energy / Green Economy", description: "Subsektor yang butuh SDM segera: PLTS (Teknisi Instalasi Panel Surya, Manajer Proyek PLTS, Auditor Energi), Bioenergi (Insinyur Proses, Agronomist Energi), Angin & Geotermal (Teknisi Turbin, Analis Pemetaan, Ahli Geologi Panas Bumi), dan lintas subsektor (Insinyur Integrasi Sistem, Spesialis Energy Storage, Konsultan Carbon Footprint).", aiRisk: "safe" as const, aiNote: "Pekerjaan lapangan dan engineering judgment dalam konteks fisik nyata.", sectorStatus: "growing" as const, source: "IESR 2024; Bappenas Peta Jalan Tenaga Kerja Hijau 2025; Kemnaker RTKN 2025-2029", indonesiaData: "1,72 juta jobs diproyeksikan tersedia pada 2030 (IESR). Kemnaker hanya menargetkan melatih 15.000 orang sampai 2029. Gap ini adalah peluang.", connections: ["kepedulian-lingkungan", "manajemen-proyek"] },
  { id: "teknologi-digital", layer: 3, name: "Teknologi dan Digital", techName: "Information Technology / Digital Economy", description: "Software developer, data analyst, AI/ML engineer, cybersecurity analyst, UI/UX designer, FinTech engineer.", aiRisk: "augment" as const, aiNote: "Entry-level developer turun 20% sejak 2022 (Stanford AI Index 2026). Yang bertahan: yang bisa mengawasi dan mengarahkan sistem AI.", sectorStatus: "growing" as const, source: "WEF FoJ 2025; BPS Sakernas 2024 (KBLI J); Stanford AI Index 2026", wefData: "Big Data Specialist: +110%. FinTech Engineer: +95%. AI/ML Specialist: +85%. Software Developer: +60% (persentase global, WEF FoJ 2025).", indonesiaData: "KBLI J (Informasi & Komunikasi): 1,03 juta pekerja saat ini (0,71% dari total workforce) — kecil tapi tumbuh paling cepat.", connections: ["literasi-ai", "keamanan-digital", "literasi-teknologi"] },
  { id: "pendidikan", layer: 3, name: "Pendidikan dan Pengembangan SDM", techName: "Education / Human Capital Development", description: "Pengajar semua jenjang, instructional designer, konselor karier, pelatih vokasi, pengembang kurikulum.", aiRisk: "safe" as const, aiNote: "AI membantu administrasi dan produksi konten, tapi tidak dapat menggantikan proses belajar yang sesungguhnya.", sectorStatus: "growing" as const, source: "WEF FoJ 2025; BPS Sakernas 2024 (KBLI P); OECD Career Preparation Report 2024", indonesiaData: "7,16 juta pekerja (4,95% workforce). Hanya 28% siswa usia 15 tahun Indonesia punya rencana karier realistis (OECD 2024).", connections: ["mengajar", "empati"] },
  { id: "kesehatan", layer: 3, name: "Kesehatan dan Layanan Sosial", techName: "Healthcare / Care Economy", description: "Tenaga keperawatan, konselor, social worker, community health worker, psikolog klinis.", aiRisk: "safe" as const, aiNote: "AI membantu diagnostik dan administrasi, tapi perawatan manusia membutuhkan kehadiran fisik dan empati yang tidak dapat digantikan.", sectorStatus: "growing" as const, source: "WEF FoJ 2025; BPS Sakernas 2024 (KBLI Q); ILO World Employment and Social Outlook 2024", wefData: "Nursing Professionals dan Social Work Professionals masuk 15 pekerjaan dengan pertumbuhan absolut terbesar secara global.", indonesiaData: "2,37 juta pekerja saat ini (1,64% workforce). Tumbuh karena aging population.", connections: ["empati", "mengajar"] },
  { id: "keuangan-syariah", layer: 3, name: "Keuangan Syariah dan Halal Economy", techName: "Islamic Finance / Halal Economy", description: "Analis sukuk, konsultan fiqh muamalah terapan, risk manager syariah, auditor halal.", aiRisk: "augment" as const, aiNote: "AI membantu analisis data keuangan, tapi penilaian kepatuhan syariah membutuhkan pengetahuan fiqh yang tidak bisa direplikasi mesin.", sectorStatus: "growing" as const, source: "KNEKS 2024; SGIE Report 2024/2025; OJK Roadmap Keuangan Syariah Indonesia 2023-2027", indonesiaData: "Aset perbankan syariah tumbuh 33,92% dalam satu tahun. Kontribusi sektor halal ke PDB: 47,27% (~Rp10.600 triliun, 2024). Indonesia #1 modest fashion, #2 halal tourism dunia.", connections: ["berpikir-sistemik", "manajemen-proyek", "etika"] },
  { id: "pertanian-modern", layer: 3, name: "Pertanian Modern dan Agritech", techName: "Agricultural Technology / Food Security", description: "Precision farming specialist, agri-supply chain manager, IoT pertanian, teknisi sistem irigasi cerdas.", aiRisk: "augment" as const, aiNote: "AI mengoptimalkan irigasi dan prediksi panen, tapi manajemen lapangan dan adaptasi di konteks lokal masih butuh manusia.", sectorStatus: "growing" as const, source: "WEF FoJ 2025; BPS Sakernas 2024 (KBLI A); Bappenas RPJMN 2025-2029", wefData: "Farmworkers: pertumbuhan absolut terbesar secara global — proyeksi +35 juta jobs by 2030.", indonesiaData: "40,76 juta pekerja (28,18% workforce) — sektor terbesar. Indonesia masih mengimpor gandum, kedelai, dan bawang putih.", connections: ["kepedulian-lingkungan", "literasi-teknologi"] },
  // LAYER 3 — VULNERABLE
  { id: "klerikal", layer: 3, name: "Pekerjaan Klerikal dan Administratif", techName: "Clerical Support / Administrative Work", description: "Entri data, pemrosesan dokumen, administrasi rutin, kesekretariatan standar. Bukan orang yang digantikan — tugas spesifik yang sudah bisa dikerjakan AI lebih cepat.", aiRisk: "vulnerable" as const, aiNote: "Paparan GenAI tertinggi di Indonesia: 93,9% pekerjaan klerikal terpapar. 67,5% dalam kelompok risiko tertinggi (ILO, 2024). Pekerja muda 15-24 tahun paling rentan karena memulai karier di posisi ini.", sectorStatus: "vulnerable" as const, source: "ILO Generative AI impact analysis ASEAN 2024; WEF FoJ 2025; BPS Sakernas 2024", indonesiaData: "ILO: hanya 3-4% pekerjaan Indonesia berisiko hilang sepenuhnya akibat GenAI. Mayoritas mengalami augmentasi. Tapi entry-level administratif paling terdampak dalam jangka pendek.", connections: [] },
  { id: "ritel-manual", layer: 3, name: "Ritel dan Layanan Manual Terstruktur", techName: "Retail / Structured Manual Service", description: "Kasir, petugas inventaris, operator standar, pemrosesan transaksi rutin — tugas berulang yang dapat dipetakan dengan baik oleh mesin.", aiRisk: "vulnerable" as const, aiNote: "91,1% tugas di sektor perdagangan besar dan eceran berisiko diotomasi. 77,9% di sektor akomodasi dan makan minum.", sectorStatus: "vulnerable" as const, source: "Digitalisasi Pasar Kerja Indonesia (ResearchGate 2024); WEF FoJ 2025; BPS KBLI G dan I", indonesiaData: "27,33 juta pekerja di KBLI G perdagangan (18,89% workforce) — sektor terbesar kedua. Ini bukan berarti semua kehilangan pekerjaan, tapi tugas-tugas spesifik dalam sektor ini akan berubah fundamental.", connections: [] },
];

function buildConnectionMap() {
  const map: Record<string, Set<string>> = {};
  NODES.forEach(n => {
    map[n.id] = new Set(n.connections || []);
    (n.causal || []).forEach(c => map[n.id].add(c.to));
  });
  return map;
}
const CONNECTION_MAP = buildConnectionMap();

interface NodeType { id: string; layer: number; name: string; techName: string; description: string; aiRisk: keyof typeof AI_RISK; aiNote: string; source: string; wefData?: string; indonesiaData?: string; connections: string[]; causal?: { to: string; direction: "to"|"from"|"bidirectional"; citation: string }[]; isProvenCausal?: boolean; sectorStatus?: "growing"|"vulnerable"; localContextExample?: string }

function NodePill({ node, isActive, isConnected, dimmed, onClick }: { node: NodeType; isActive: boolean; isConnected: boolean; dimmed: boolean; onClick: () => void }) {
  const colors = LAYERS[node.layer].colors;
  let style: React.CSSProperties = { opacity: dimmed ? 0.3 : 1 };
  let className = "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border shrink-0 transition-all bg-background border-border text-muted-foreground";
  if (isActive) {
    style = { backgroundColor: colors.bg, borderColor: colors.dot, color: colors.text, boxShadow: `0 0 0 2px ${colors.ring}`, opacity: 1 };
    className = "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border shrink-0 transition-all";
  } else if (isConnected) {
    style = { backgroundColor: "#FFFBEB", borderColor: "#FCD34D", color: "#78350F", opacity: 1 };
    className = "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border shrink-0 transition-all";
  }
  const sectorDot = node.sectorStatus === "growing" ? "#22C55E" : node.sectorStatus === "vulnerable" ? "#EF4444" : null;
  return (
    <button id={`node-${node.id}`} onClick={onClick} className={className} style={{ ...style, borderWidth: 1.5 }}>
      {sectorDot && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sectorDot }} />}
      <span>{node.name}</span>
      {node.isProvenCausal && <span className="text-violet-400 text-xs font-bold ml-0.5">★</span>}
    </button>
  );
}

function DataBox({ colorKey, label, children }: { colorKey: string; label: string; children: React.ReactNode }) {
  const map: Record<string, { bg: string; lc: string; tc: string }> = {
    amber: { bg: "#FFFBEB", lc: "#D97706", tc: "#92400E" },
    blue: { bg: "#EFF6FF", lc: "#2563EB", tc: "#1E3A5F" },
    violet: { bg: "#F5F3FF", lc: "#7C3AED", tc: "#3B0764" },
  };
  const c = map[colorKey] || map.amber;
  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: c.bg }}>
      <p className="text-xs font-bold mb-1" style={{ color: c.lc }}>{label}</p>
      <p className="text-sm leading-relaxed" style={{ color: c.tc }}>{children}</p>
    </div>
  );
}

function NodeDetail({ node, onClose, onNavigate }: { node: NodeType; onClose: () => void; onNavigate: (n: NodeType) => void }) {
  const [showSrc, setShowSrc] = useState(false);
  const ai = AI_RISK[node.aiRisk];
  const lc = LAYERS[node.layer].colors;
  return (
    <div className="bg-card rounded-2xl border shadow-sm overflow-hidden mt-3" style={{ borderColor: lc.border }}>
      <div className="px-5 pt-4 pb-3" style={{ backgroundColor: lc.bg }}>
        <div className="flex justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <h3 className="font-bold text-base leading-tight" style={{ color: lc.text }}>{node.name}</h3>
              {node.isProvenCausal && <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-violet-100 text-violet-700">★ Relasi kausal terbukti secara eksperimental</span>}
            </div>
            <p className="text-xs font-mono text-muted-foreground">{node.techName}</p>
          </div>
          <button onClick={onClose}><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: ai.bg, color: ai.text }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ai.dot }} />{ai.label}
          </span>
          {node.sectorStatus && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: node.sectorStatus === "growing" ? "#DCFCE7" : "#FEE2E2", color: node.sectorStatus === "growing" ? "#166534" : "#991B1B" }}>
              {node.sectorStatus === "growing" ? "↑ Tumbuh" : "↓ Rentan otomasi"}
            </span>
          )}
        </div>
      </div>
      <div className="px-5 py-4 space-y-3">
        <p className="text-sm leading-relaxed text-foreground/80">{node.description}</p>
        {node.aiNote && <DataBox colorKey="amber" label="Posisi terhadap AI">{node.aiNote}</DataBox>}
        {node.wefData && <DataBox colorKey="blue" label="Data WEF Future of Jobs 2025">{node.wefData}</DataBox>}
        {node.indonesiaData && <DataBox colorKey="violet" label="Data Indonesia">{node.indonesiaData}</DataBox>}
        {node.localContextExample && (
          <div className="rounded-xl p-3 border border-border bg-muted/40">
            <p className="text-xs font-bold tracking-widest uppercase mb-1 text-muted-foreground">Contoh nyata</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{node.localContextExample}</p>
          </div>
        )}
        {node.causal && node.causal.length > 0 && (
          <div className="rounded-xl p-4 border border-violet-200 bg-violet-50">
            <p className="text-xs font-bold text-violet-700 mb-3">Relasi kausal yang terbukti secara eksperimental — bukan hanya korelasi</p>
            {node.causal.map((c, i) => {
              const tgt = NODES.find(n => n.id === c.to);
              return (
                <div key={i} className="mb-2">
                  <div className="flex items-center gap-2 text-violet-800 mb-1">
                    {c.direction === "bidirectional" ? <ArrowLeftRight className="w-4 h-4 shrink-0" /> : c.direction === "to" ? <ArrowRight className="w-4 h-4 shrink-0" /> : <ArrowRight className="w-4 h-4 shrink-0 rotate-180" />}
                    <button onClick={() => tgt && onNavigate(tgt)} className="font-medium text-sm underline underline-offset-2">{tgt?.name}</button>
                  </div>
                  <p className="text-xs text-violet-600 italic ml-6 leading-relaxed">{c.citation}</p>
                </div>
              );
            })}
          </div>
        )}
        {node.connections && node.connections.length > 0 && (
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-2 text-muted-foreground">Terhubung ke</p>
            <div className="flex flex-wrap gap-2">
              {node.connections.map(cid => {
                const cn = NODES.find(n => n.id === cid); if (!cn) return null;
                const cl = LAYERS[cn.layer].colors;
                return <button key={cid} onClick={() => onNavigate(cn)} className="text-xs px-3 py-1 rounded-full border hover:opacity-70 transition-opacity" style={{ backgroundColor: cl.pill, borderColor: cl.pillBorder, color: cl.pillText }}>{cn.name}</button>;
              })}
            </div>
          </div>
        )}
        <div>
          <button onClick={() => setShowSrc(v => !v)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSrc ? "rotate-180" : ""}`} />
            {showSrc ? "Sembunyikan sumber" : "Lihat sumber"}
          </button>
          {showSrc && <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{node.source}</p>}
        </div>
      </div>
    </div>
  );
}

const ISTILAH_BRIDGE: { popular: string; layer: string; nodes: { label: string; id: string | null; note?: string }[]; primary: string | false; note?: string }[] = [
  { popular: "Soft skills", layer: "Layer 0 + Layer 1", nodes: [
    { label: "Sikap & Disposisi", id: null, note: "(seluruh Layer 0)" },
    { label: "Kapasitas Manusia", id: null, note: "(seluruh Layer 1)" },
  ], primary: false },
  { popular: "Berpikir Kritis / Critical Thinking", layer: "Layer 1", nodes: [
    { label: "Berpikir Analitis", id: "berpikir-analitis" },
    { label: "Berpikir Sistemik", id: "berpikir-sistemik" },
  ], primary: "berpikir-analitis", note: "Dalam OECD Learning Compass dan framework Pak Dillo, Critical Thinking mencakup kemampuan mengevaluasi bukti dan mempertanyakan asumsi — ini terdistribusi di Berpikir Analitis dan Berpikir Sistemik di peta ini." },
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

function JembatanIstilah({ onNavigate }: { onNavigate: (nodeIds: string[]) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const visibleItems = expanded ? ISTILAH_BRIDGE : ISTILAH_BRIDGE.slice(0, 5);

  function handleChip(item: typeof ISTILAH_BRIDGE[0]) {
    setActiveChip(item.popular === activeChip ? null : item.popular);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-5 md:px-8">
      <div className="bg-secondary/40 border border-border rounded-2xl p-5">
        <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase mb-1">Jembatan Istilah</p>
        <p className="text-sm text-foreground/80 mb-4">Sering dengar kata-kata ini di sekolah atau media? Temukan di mana letaknya di peta.</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {visibleItems.map((item) => (
            <button
              key={item.popular}
              onClick={() => handleChip(item)}
              className={cn(
                "text-sm px-3 py-1.5 rounded-full border transition-all",
                activeChip === item.popular
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-foreground/80 hover:border-primary/50"
              )}
            >
              {item.popular}
            </button>
          ))}
          {ISTILAH_BRIDGE.length > 5 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-sm px-3 py-1.5 rounded-full border border-dashed border-border text-muted-foreground hover:border-primary/50 transition-all"
            >
              {expanded ? "Lebih sedikit ↑" : `+ ${ISTILAH_BRIDGE.length - 5} lainnya`}
            </button>
          )}
        </div>
        {activeChip && (() => {
          const item = ISTILAH_BRIDGE.find((i) => i.popular === activeChip);
          if (!item) return null;
          const navigableIds = item.nodes.map((n) => n.id).filter((id): id is string => !!id);
          return (
            <div className="rounded-xl border border-border bg-background/60 p-4 mt-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-semibold text-sm text-foreground">{item.popular}</span>
                <span className="text-xs text-muted-foreground">→ {item.layer}</span>
              </div>
              {item.note && (
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.note}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {item.nodes.map((node) => (
                  <button
                    key={node.label}
                    onClick={() => node.id && onNavigate([node.id])}
                    disabled={!node.id}
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-full border transition-all",
                      node.id
                        ? "bg-secondary/60 border-border hover:border-primary/60 hover:bg-primary/5 text-foreground"
                        : "bg-secondary/30 border-border/50 text-muted-foreground cursor-default"
                    )}
                  >
                    {node.label}
                    {node.note && <span className="ml-1 text-muted-foreground">{node.note}</span>}
                    {node.id && " →"}
                  </button>
                ))}
              </div>
              {navigableIds.length > 0 && (
                <button
                  onClick={() => onNavigate(navigableIds)}
                  className="text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground mt-3 hover:bg-primary/90 transition-colors"
                >
                  Lihat di Peta Skill →
                </button>
              )}
            </div>
          );
        })()}
        <p className="text-xs text-muted-foreground mt-3 italic">Klik chip → lihat deskripsi. Klik "Lihat di Peta Skill" → sorot semua node terkait di peta.</p>
      </div>
    </div>
  );
}

export default function SkillMap() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(new Set([0]));
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "growing" | "safe" | "layer0">("all");
  const [jembatanHighlightIds, setJembatanHighlightIds] = useState<Set<string>>(new Set());
  const activeNode = NODES.find(n => n.id === activeId) || null;
  const connectedIds = useMemo(() => activeId ? (CONNECTION_MAP[activeId] || new Set<string>()) : new Set<string>(), [activeId]);
  const hasActive = activeId !== null;

  const filteredNodes = useMemo(() => {
    return NODES.filter(node => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || node.name.toLowerCase().includes(q) || node.techName.toLowerCase().includes(q);
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "growing" && node.sectorStatus === "growing") ||
        (activeFilter === "safe" && node.aiRisk === "safe") ||
        (activeFilter === "layer0" && node.layer === 0);
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);
  const filteredIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);
  const isFiltering = searchQuery.length > 0 || activeFilter !== "all";

  useEffect(() => {
    if (isFiltering) {
      setExpanded(new Set(filteredNodes.map(n => n.layer)));
    } else {
      setExpanded(new Set([0]));
    }
  }, [isFiltering, filteredNodes]);

  function toggleLayer(id: number) { setExpanded(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; }); }
  function handleClick(node: NodeType) {
    setJembatanHighlightIds(new Set());
    setActiveId(prev => prev === node.id ? null : node.id);
  }
  function handleNavigate(node: NodeType) { setActiveId(node.id); setExpanded(prev => new Set([...prev, node.layer])); window.scrollTo({ top: 0, behavior: "smooth" }); }

  function handleJembatanNavigate(nodeIds: string[]) {
    if (nodeIds.length === 1) {
      const target = NODES.find(n => n.id === nodeIds[0]);
      if (!target) return;
      setActiveId(nodeIds[0]);
      setJembatanHighlightIds(new Set());
      setExpanded(prev => new Set([...prev, target.layer]));
      setTimeout(() => {
        const el = document.getElementById(`node-${nodeIds[0]}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    } else {
      setJembatanHighlightIds(new Set(nodeIds));
      setActiveId(null);
      const relevantLayers = nodeIds
        .map(id => NODES.find(n => n.id === id)?.layer)
        .filter((l): l is number => l !== undefined);
      setExpanded(prev => new Set([...prev, ...relevantLayers]));
    }
  }

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const target = NODES.find(n => n.id === hash);
    if (!target) return;
    setActiveId(hash);
    setExpanded(prev => new Set([...prev, target.layer]));
    setTimeout(() => {
      const el = document.getElementById(`node-${hash}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const growingNodes = NODES.filter(n => n.layer === 3 && n.sectorStatus === "growing");
  const vulnNodes = NODES.filter(n => n.layer === 3 && n.sectorStatus === "vulnerable");
  const FILTERS: { id: typeof activeFilter; label: string }[] = [
    { id: "all", label: "Semua" },
    { id: "growing", label: "↑ Tumbuh" },
    { id: "safe", label: "Aman dari AI" },
    { id: "layer0", label: "Karakter Dasar" },
  ];

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-20 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="sm" linkTo="/" />
          <Link to="/insight" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Insight
          </Link>
        </div>
      </header>

      <div className="border-b border-border bg-background px-6 py-6 md:px-8">
        <p className="text-xs font-bold tracking-widest text-muted-foreground mb-1.5 uppercase">Peta Skill 2025–2030</p>
        <h1 className="font-heading font-bold text-xl md:text-2xl text-foreground leading-tight">Pohon Keterampilan</h1>
        <p className="text-base text-muted-foreground mt-1.5 max-w-xl">Setiap cabang memiliki perannya masing-masing. Mari kita pahami dari akar hingga daun.</p>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-2xl">Berdasarkan WEF Future of Jobs 2025, BPS Sakernas 2024, ILO, IESR, Kemnaker RTKN 2025–2029, dan riset psikologi karier terverifikasi.</p>
      </div>

      <JembatanIstilah onNavigate={handleJembatanNavigate} />

      <div className="max-w-4xl mx-auto px-4 pt-4 pb-2 md:px-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari skill atau sektor..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  activeFilter === f.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        {isFiltering && (
          <p className="text-xs text-muted-foreground mt-2">{filteredNodes.length} hasil ditemukan</p>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 md:px-8 space-y-3">
        {(() => {
          const renderLayer = (lid: number, outerClass = "bg-card rounded-xl border overflow-hidden") => {
            const L = LAYERS[lid];
            const layerNodes = NODES.filter(n => n.layer === lid && (!isFiltering || filteredIds.has(n.id)));
            const isOpen = expanded.has(lid);
            if (isFiltering && layerNodes.length === 0) return null;
            return (
              <div key={lid} className={outerClass} style={{ borderColor: L.colors.border }}>
                <button onClick={() => toggleLayer(lid)} className="w-full flex items-start gap-3 px-5 py-4 text-left" style={{ backgroundColor: L.colors.bg }}>
                  <span className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ backgroundColor: L.colors.dot }} />
                  <div className="flex-1">
                    <p className="font-bold text-sm md:text-base" style={{ color: L.colors.text }}>{L.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{L.subtitle}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground mt-1 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-3">
                    <p className="text-xs text-muted-foreground italic mb-3">{L.note}</p>
                    <div className="flex flex-wrap gap-2">
                      {layerNodes.map(node => <NodePill key={node.id} node={node as NodeType} isActive={activeId === node.id} isConnected={connectedIds.has(node.id)} dimmed={hasActive && activeId !== node.id && !connectedIds.has(node.id)} onClick={() => handleClick(node as NodeType)} />)}
                    </div>
                    {activeNode && activeNode.layer === lid && <NodeDetail node={activeNode as NodeType} onClose={() => setActiveId(null)} onNavigate={handleNavigate} />}
                  </div>
                )}
              </div>
            );
          };
          return (
            <>
              {/* SOFT SKILLS UMBRELLA — Layer 0 + Layer 1 */}
              <div className="rounded-2xl border-2 border-dashed border-amber-300/60 bg-amber-50/20 p-3 space-y-3">
                <div className="flex flex-wrap items-center gap-2 px-2 pt-1">
                  <span className="font-heading font-bold text-sm text-amber-800 uppercase tracking-wider">Soft Skills</span>
                  <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5">Istilah populer</span>
                  <p className="w-full text-xs text-amber-700/80 leading-relaxed mt-0.5">
                    <em>Soft skills</em> adalah istilah sehari-hari. Dalam riset akademis, keterampilan ini biasanya disebut <em>"Non-Cognitive Skills"</em> (Heckman et al.), <em>"Essential Skills"</em> (ILO), atau dipisah menjadi <em>"Attitudes and Mindsets"</em> dan <em>"Cognitive Skills"</em> dalam WEF Global Skills Taxonomy.
                  </p>
                </div>
                {renderLayer(0)}
                {renderLayer(1)}
              </div>
              {renderLayer(2, "bg-card rounded-2xl border overflow-hidden")}
            </>
          );
        })()}

        {(() => {
          const growingFiltered = growingNodes.filter(n => !isFiltering || filteredIds.has(n.id));
          const vulnFiltered = vulnNodes.filter(n => !isFiltering || filteredIds.has(n.id));
          if (isFiltering && growingFiltered.length === 0 && vulnFiltered.length === 0) return null;
          return (
        <div className="bg-card rounded-2xl border overflow-hidden border-border">
          <button onClick={() => toggleLayer(3)} className="w-full flex items-start gap-3 px-5 py-4 text-left bg-secondary/30">
            <span className="w-3 h-3 rounded-full mt-1 shrink-0 bg-muted-foreground/50" />
            <div className="flex-1">
              <p className="font-bold text-sm md:text-base text-foreground">{LAYERS[3].name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{LAYERS[3].subtitle}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground mt-1 shrink-0 transition-transform ${expanded.has(3) ? "rotate-180" : ""}`} />
          </button>
          {expanded.has(3) && (
            <div className="px-5 pb-5 pt-3">
              <p className="text-xs text-muted-foreground italic mb-4">{LAYERS[3].note}</p>
              {growingFiltered.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Tumbuh — shortage SDM terdokumentasi</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {growingFiltered.map(node => <NodePill key={node.id} node={node as NodeType} isActive={activeId === node.id} isConnected={connectedIds.has(node.id)} dimmed={hasActive && activeId !== node.id && !connectedIds.has(node.id)} onClick={() => handleClick(node as NodeType)} />)}
                </div>
              </div>
              )}
              {vulnFiltered.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-destructive" />
                  <p className="text-xs font-bold text-destructive uppercase tracking-wider">Rentan — tugas berisiko tinggi tergantikan</p>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Yang berisiko adalah tugas-tugas spesifik, bukan semua orang dalam sektor ini. ILO: hanya 3-4% pekerjaan Indonesia berisiko hilang sepenuhnya.</p>
                <div className="flex flex-wrap gap-2">
                  {vulnFiltered.map(node => <NodePill key={node.id} node={node as NodeType} isActive={activeId === node.id} isConnected={connectedIds.has(node.id)} dimmed={hasActive && activeId !== node.id && !connectedIds.has(node.id)} onClick={() => handleClick(node as NodeType)} />)}
                </div>
              </div>
              )}
              {activeNode && activeNode.layer === 3 && <NodeDetail node={activeNode as NodeType} onClose={() => setActiveId(null)} onNavigate={handleNavigate} />}
            </div>
          )}
        </div>
          );
        })()}

        {isFiltering && filteredNodes.length === 0 && (
          <div className="bg-card rounded-2xl border border-border p-6 text-center text-sm text-muted-foreground">
            Tidak ada skill atau sektor yang cocok. Coba kata kunci lain atau reset filter.
          </div>
        )}

        <div className="bg-card rounded-2xl border border-border px-5 py-4 space-y-3">
          <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Panduan Membaca</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {(Object.entries(AI_RISK) as [string, typeof AI_RISK[keyof typeof AI_RISK]][]).map(([, val]) => (
              <div key={val.label} className="flex items-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full mt-0.5 shrink-0" style={{ backgroundColor: val.dot }} />
                <div><p className="text-xs font-semibold text-foreground">{val.label}</p><p className="text-xs text-muted-foreground">{val.sublabel}</p></div>
              </div>
            ))}
            <div className="flex items-start gap-2">
              <span className="text-violet-400 font-bold text-sm shrink-0 leading-none mt-0.5">★</span>
              <div><p className="text-xs font-semibold text-foreground">Relasi kausal terbukti</p><p className="text-xs text-muted-foreground">Dibuktikan secara eksperimental — bukan hanya korelasi atau teori</p></div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full mt-0.5 shrink-0 bg-amber-400" />
              <div><p className="text-xs font-semibold text-foreground">Sorotan kuning</p><p className="text-xs text-muted-foreground">Node ini terhubung ke node yang sedang dipilih</p></div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground pt-3 border-t border-border leading-relaxed">
            Sumber: WEF Future of Jobs Report 2025 · BPS Sakernas Agustus 2024 · ILO ASEAN GenAI Impact 2024 · IESR 2024 · Kemnaker RTKN 2025-2029 · Bappenas Peta Jalan Tenaga Kerja Hijau 2025 · Krol & Bartz (2021) DOI: 10.1037/emo0000943 · Pikouli et al. (2023) DOI: 10.3390/jintelligence11090182 · Journal of Intelligence Vol. 13 No. 3 (2025) · O*NET Content Model v30.3 · KNEKS 2024 · SGIE Report 2024/2025
          </p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
          <p className="font-heading font-semibold text-foreground mb-2">Ingin tahu skill mana yang paling relevan untuk profilmu?</p>
          <p className="text-sm text-muted-foreground mb-4">Asesmen Sulu akan mencocokkan peta skill ini dengan kepribadian dan minatmu. Sedang dalam pengembangan.</p>
          <Link to="/insight#waitlist" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Daftarkan diri untuk diberitahu <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
