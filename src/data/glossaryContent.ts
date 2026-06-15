// src/data/glossaryContent.ts
// Kamus istilah ekonomi & ketenagakerjaan Sulu.
// Sumber VERBATIM: Notion "Inventori Istilah Ekonomi & Ketenagakerjaan" (370a045d995781e8bc21c22d7372ebcd).
// JANGAN edit isi tanpa trace ke inventori. Anti-watering-down.

export interface GlossaryEntry {
  id: string;
  term: string;
  padanan?: string;
  arti?: string;        // Apa artinya
  indonesia?: string;   // Yang sedang terjadi (di Indonesia)
  data?: string;        // Data / Data kunci / Data Indonesia
  konsekuensi?: string;
  navigasi?: string;    // Cara navigasi
  sumber?: string;
}

export interface GlossaryCategory {
  id: string;
  title: string;
  subtitle?: string;
  entries: GlossaryEntry[];
}

export const glossaryIntro = {
  title: "Kamus Istilah",
  subtitle: "Kata-kata ekonomi dan dunia kerja yang sering kamu dengar — dijelaskan apa adanya, dengan apa yang sedang terjadi dan apa artinya buat kamu.",
  note: "Semua istilah di sini sudah terjadi atau sedang terjadi, dengan dokumentasi yang bisa diverifikasi.",
};

export const glossaryCategories: GlossaryCategory[] = [
  {
    id: "makro",
    title: "Makroekonomi yang Terasa Personal",
    subtitle: "Angka yang sekilas terdengar jauh, tapi langsung mempengaruhi pasar kerja dan pilihan hidup pemuda Indonesia.",
    entries: [
      {
        id: "k-shaped",
        term: "K-Shaped Recovery",
        padanan: "Pemulihan Ekonomi Berbentuk Huruf K",
        arti: "Ketika ekonomi \"pulih\", pertumbuhan tidak merata. Sektor yang sudah kuat (teknologi, keuangan, komoditas ekspor) tumbuh lebih cepat. Sektor padat karya tradisional, UMKM kecil, pekerja informal — tertinggal atau stagnan. Angka PDB nasional terlihat bagus, tapi banyak orang tidak merasakan manfaatnya.",
        indonesia: "Gini index 0,381 (September 2024). Perkotaan 0,402. Kelas menengah menyusut dari 57,33 juta (2019) ke 47,85 juta (2024). Indonesia Gelap Februari 2025 dan protes Agustus 2025 adalah ekspresi langsung ketidakmerataan ini.",
        konsekuensi: "Posisi di mana kamu berdiri ditentukan jalur yang dipilih sekarang. Yang masuk ke K-atas butuh kombinasi skill tertentu, jaringan, dan portofolio. Yang terjebak di K-bawah bukan karena malas — tapi tidak punya navigasi yang cukup saat memilih jalur.",
        navigasi: "Identifikasi sektor tempat kamu masuk — apakah ia ada di K-atas (teknologi, keuangan syariah, green economy, pendidikan digital) atau K-bawah (ritel manual, administrasi rutin). Bangun skill yang dibutuhkan di K-atas bahkan dari sekolah.",
        sumber: "BPS Sakernas 2024; World Bank Indonesia 2024; ISEAS Agustus 2025.",
      },
      {
        id: "premature-deindustrialization",
        term: "Premature Deindustrialization",
        padanan: "Deindustrialisasi Dini",
        arti: "Penurunan sektor manufaktur sebelum negara cukup kaya dan sebelum menyerap cukup banyak tenaga kerja melalui industri. Negara maju dulu bisa pakai manufaktur sebagai mesin penyerapan TK besar-besaran 30-40 tahun. Indonesia kehilangan jendela itu lebih cepat.",
        indonesia: "Kontribusi manufaktur terhadap PDB turun struktural. Sektor yang tumbuh justru ekstraktif (nikel, kelapa sawit) — padat modal tapi minim penyerapan TK. Ratusan ribu lulusan SMA/SMK yang seharusnya terserap manufaktur tidak menemukan tempat.",
        konsekuensi: "Jalur \"lulus SMK langsung kerja pabrik\" tidak semudah dulu. Angka pengangguran lulusan SMK Jabar (12,42%) lebih tinggi dari lulusan universitas (9,47%). Ini bukan kegagalan individual — ini pergeseran struktural.",
        navigasi: "Cari sektor yang sedang bertransformasi, bukan stagnan. Agritech, green energy, dan layanan profesional digital menyerap tenaga kerja yang dulu pergi ke manufaktur.",
        sumber: "Rodrik, Journal of Economic Growth 2016; Australian Institute of International Affairs Oktober 2025.",
      },
      {
        id: "pelemahan-rupiah",
        term: "Pelemahan Rupiah dan Dampak ke Pasar Kerja",
        padanan: "Depresiasi Nilai Tukar / Tekanan Biaya Korporasi",
        arti: "Rupiah melemah → perusahaan yang bahan baku atau utangnya dalam dolar mengalami kenaikan biaya → mereka pilih salah satu: naikkan harga jual, potong operasional, atau bekukan rekrutmen. Dalam ketidakpastian, opsi ketiga paling sering dipilih.",
        indonesia: "Rupiah volatil sepanjang 2024-2025 akibat kebijakan Fed, ketegangan perdagangan global, dan sentimen risiko investor. Efek langsung: hiring freeze lebih sering terjadi. Bank Indonesia pertahankan suku bunga tinggi untuk jaga rupiah, tapi ini juga perlambat ekspansi bisnis.",
        konsekuensi: "Persaingan untuk posisi yang ada makin ketat. Perusahaan yang merekrut di kondisi ini cari orang langsung produktif. Posisi kontrak dan freelance lebih disukai dari karyawan tetap.",
        navigasi: "Kurangi ketergantungan pada satu sumber penghasilan dari satu perusahaan. Kemampuan bekerja untuk klien yang bayar dalam dolar memberi perlindungan alamiah terhadap depresiasi.",
        sumber: "Bank Indonesia Monetary Policy Reports 2024-2026; McKinsey Southeast Asia Q4 2025.",
      },
      {
        id: "efisiensi-anggaran",
        term: "Efisiensi Anggaran Pemerintah",
        padanan: "Budget Efficiency Drive / Pengetatan APBN",
        arti: "Pemerintah Prabowo memotong anggaran besar untuk mendanai program prioritas. Pemangkasan menyentuh pendidikan, kesehatan, dan infrastruktur. Akibatnya, rekrutmen aparatur negara lebih terbatas dan kontraktor pemerintah banyak kehilangan kontrak.",
        indonesia: "Total pemangkasan di atas 700 triliun rupiah atau lebih dari 15% APBN. Ribuan tenaga kontrak pemerintah diberhentikan. Dana pendidikan dasar-menengah dipotong ratusan miliar.",
        konsekuensi: "Strategi \"aman masuk PNS\" makin sulit. Kuota CPNS/PPPK lebih ketat. Lowongan BUMN dan lembaga pemerintah berkurang.",
        navigasi: "Jangan hilangkan opsi sektor publik, tapi jangan jadikan satu-satunya rencana. Bangun keahlian yang bisa masuk ke sektor publik maupun swasta: policy analysis, data governance, environmental compliance.",
        sumber: "East Asia Forum September 2025; ECPS September 2025.",
      },
      {
        id: "salary-inflation-disconnect",
        term: "Salary-Inflation Disconnect",
        padanan: "Kesenjangan Kenaikan Gaji vs Inflasi",
        arti: "Biaya hidup naik lebih cepat dari kenaikan gaji rata-rata. Meski bekerja, daya beli secara riil turun setiap tahun.",
        indonesia: "Rata-rata upah nasional November 2025: Rp 3,33 juta/bulan. Fresh graduate PTN awal karier: sekitar Rp 2-2,5 juta/bulan. Biaya hidup layak Jakarta minimal Rp 4-5 juta/bulan. Angka pengangguran yang turun tidak berarti kualitas hidup naik.",
        konsekuensi: "Mengandalkan satu gaji dari satu pekerjaan entry-level hampir tidak cukup untuk hidup mandiri di kota besar. Ini bukan tentang gaya hidup — ini matematika biaya hidup dasar yang tidak ketemu.",
        navigasi: "Multiple income streams sejak dini bukan opsi sekunder, ini arsitektur karier. Skill yang bisa menghasilkan income sampingan sejak hari pertama: mengajar/tutoring, menulis, desain, jasa bahasa.",
        sumber: "BPS Sakernas November 2025; HR Asia Februari 2026.",
      },
    ],
  },
  {
    id: "transformasi",
    title: "Transformasi Dunia Kerja",
    subtitle: "Perubahan cara kerja dan rekrutmen yang sudah berjalan dan tidak berbalik.",
    entries: [
      {
        id: "ai-junior-squeeze",
        term: "AI Junior Squeeze / AI-Induced Job Polarisation",
        padanan: "Penyempitan Pintu Masuk Karier Akibat AI",
        arti: "AI menghapus banyak tugas yang biasanya diberikan ke karyawan baru: pemrosesan data, penulisan dasar, analisis laporan standar, customer service tier 1. Perusahaan tidak perlu banyak junior untuk \"belajar sambil kerja\". Mereka mau orang yang langsung bisa mid-level dari hari pertama.",
        indonesia: "Stanford AI Index 2026 mendokumentasikan penurunan 20% pekerjaan entry-level di sektor teknologi sejak 2022. Pola ini mulai terlihat di sektor administratif dan layanan pelanggan.",
        konsekuensi: "Kamu tidak bisa masuk kerja dengan modal \"saya mau belajar\". Perekrut mengharapkan kamu sudah bisa menyelesaikan sebagian besar tugas dari hari pertama. Waktu warming up makin pendek.",
        navigasi: "Bangun kompetensi tingkat menengah sebelum masuk dunia kerja, bukan setelah. Proyek nyata, freelance, magang informal. Dan pelajari cara kerja bersama AI — bukan hanya memakai AI.",
        sumber: "Stanford AI Index 2026; WEF Future of Jobs Report 2025.",
      },
      {
        id: "skills-based-hiring",
        term: "Skills-Based Hiring",
        padanan: "Rekrutmen Berbasis Keahlian Terbukti",
        arti: "Pergeseran dari \"tunjukkan ijazahmu\" ke \"tunjukkan apa yang bisa kamu kerjakan\". McKinsey: rekrutmen berbasis skills 5x lebih prediktif terhadap performa kerja dibanding rekrutmen berbasis pendidikan.",
        indonesia: "Adopsi asimetris — startup teknologi, industri kreatif, dan ekosistem halal digital sudah bergerak ke sini. Sektor tradisional dan birokrasi belum.",
        konsekuensi: "Peluang terbesar sekaligus ancaman jika salah strategi. Tanpa portofolio yang terdokumentasi, kamu tidak punya bukti apapun bahkan jika sebenarnya mampu.",
        navigasi: "Dokumentasikan setiap hasil kerja — tulisan, proyek, kontribusi komunitas. GitHub, Behance, Google Drive — semua bisa menjadi portofolio yang sah. Yang tidak bisa direkam tidak akan dihitung.",
        sumber: "McKinsey Workforce Transformation 2024; LinkedIn Global Talent Trends 2023; TestGorilla 2025.",
      },
      {
        id: "gig-proletariat",
        term: "Gig-Proletariat / Portfolio Career",
        padanan: "Pekerja Gig / Karier Berbasis Portofolio Proyek",
        arti: "Semakin banyak pekerja — bukan hanya ojol tapi juga desainer, konsultan, analis, pendidik — yang bekerja tanpa ikatan tetap. Portfolio career adalah versi yang lebih terencana: seseorang membangun beberapa sumber penghasilan dari beberapa klien atau proyek sekaligus.",
        indonesia: "56-59% tenaga kerja Indonesia di sektor informal (BPS 2024-2025). Tren naik bukan turun. Banyak perusahaan besar terapkan model core-flexible: sedikit staf tetap, banyak kontraktor.",
        konsekuensi: "Harapan \"masuk kerja, pensiun di sana\" tidak relevan lagi untuk sebagian besar pekerjaan. Yang survive bukan yang paling aman, tapi yang paling portable.",
        navigasi: "Bangun identitas profesional yang tidak terikat satu perusahaan. Mulai dengan satu keahlian yang bisa dijual secara independen. Bahasa Inggris dan Arab adalah keahlian yang langsung bisa menghasilkan income freelance untuk audiens berlatar Islam.",
        sumber: "BPS Sakernas 2024-2025; Al Jazeera Juli 2025.",
      },
      {
        id: "credentials-decoupling",
        term: "Credentials Decoupling",
        padanan: "Terputusnya Ijazah dari Relevansi Kerja",
        arti: "Ijazah formal semakin tidak menjamin kompetensi yang dibutuhkan dunia kerja. Fungsinya berubah dari \"bukti kemampuan\" menjadi \"syarat administratif\". 43% pekerjaan yang dulu mensyaratkan S1 bisa dikerjakan orang tanpa gelar jika punya kompetensi tepat (Burning Glass Institute, 2024).",
        indonesia: "APK perguruan tinggi Indonesia stagnan di ~30% selama 8 tahun. 53% anak Indonesia di usia sekolah dasar tidak mencapai kemampuan baca yang memadai (World Bank Learning Poverty).",
        konsekuensi: "Jangan anggap lulus kuliah otomatis membuatmu siap kerja. Dan jangan asumsikan tidak kuliah menutup semua pintu.",
        navigasi: "Kuliah dengan tujuan: untuk membangun kompetensi yang bisa dibuktikan, bukan sekadar mendapat gelar. Kalau tidak kuliah dulu, isi waktu dengan membangun kompetensi yang terdokumentasi.",
        sumber: "Burning Glass Institute 2024; World Bank Learning Poverty Brief 2024.",
      },
      {
        id: "career-ladder-erasure",
        term: "Career-Ladder Erasure / Mid-Level Trap",
        padanan: "Hilangnya Tangga Karier Linier",
        arti: "Jalur karier yang jelas dan dapat diprediksi — staf junior → supervisor → manajer → direktur — semakin jarang ada. Perusahaan merestrukturisasi setiap 6-12 bulan. Mid-level trap: terjebak di level menengah karena posisi senior diisi dari luar atau dihapus oleh AI.",
        konsekuensi: "Loyalitas ke satu perusahaan bukan lagi strategi yang reliabel. Membangun nilai pasar di luar perusahaan tempatmu bekerja adalah perlindungan nyata.",
        navigasi: "Evaluasi karier berdasarkan \"apakah saya terus belajar sesuatu yang baru dan bisa saya buktikan\", bukan \"apakah saya naik jabatan setiap dua tahun\". Pindah kerja setiap 2-3 tahun bukan ketidaksetiaan — ini strategi mempertahankan nilai pasar.",
      },
      {
        id: "algorithmic-management",
        term: "Algorithmic Management",
        padanan: "Manajemen oleh Algoritma",
        arti: "Penggunaan AI dan algoritma untuk mengelola, menilai, dan menentukan kompensasi pekerja. Di platform gig ini sudah dominan. Semakin masuk ke pekerjaan kantor: produktivitas, kehadiran virtual, kecepatan respons.",
        konsekuensi: "Di pekerjaan yang dikelola algoritma, tidak ada negosiasi dengan sistem. Tidak ada atasan yang bisa memahami konteks mengapa kamu lambat hari ini.",
        navigasi: "Jika bekerja di platform gig sebagai strategi sementara, perlakukan itu sebagai sementara dan aktif bangun jalur keluar.",
      },
      {
        id: "human-centric-premium",
        term: "Human-Centric Premium / T-Shaped Professional",
        padanan: "Nilai Tambah Kemanusiaan",
        arti: "Seiring AI ambil alih tugas teknis dan administratif, keahlian manusiawi — empati, negosiasi, kepemimpinan berbasis kepercayaan, kreativitas dari pengalaman hidup — justru naik nilainya dan tidak bisa ditiru mesin. T-shaped professional: kedalaman tinggi di satu bidang spesifik + keluasan pengetahuan lintas bidang untuk berkolaborasi dengan siapa pun.",
        data: "WEF/Indeed 2025: 0 dari 2.800 skill yang dianalisis punya substitusi AI \"sangat tinggi\" saat ini. 69% dinilai sangat rendah potensi substitusinya.",
        navigasi: "Investasi pada keahlian manusiawi yang tidak bisa direplikasi mesin. Kepemimpinan organisasi, proyek komunitas, mengajar, mediasi — ini training ground untuk human-centric premium.",
        sumber: "WEF/Indeed GenAI substitution analysis 2025; David Autor, Noema Magazine 2024.",
      },
    ],
  },
  {
    id: "generasi",
    title: "Fenomena Generasi",
    entries: [
      {
        id: "great-gloom-neet",
        term: "The Great Gloom / NEET",
        padanan: "Kegelapan Besar / Tidak Bekerja Tidak Sekolah Tidak Pelatihan",
        data: "19,44% pemuda NEET (BPS 2025). Setara 9 juta orang. Perempuan 35,77%, laki-laki 16,38%.",
        navigasi: "Bedakan antara pesimisme produktif (memahami kondisi nyata untuk keputusan lebih baik) dan pesimisme paralitik (tidak melakukan apapun). Yang pertama adalah aset, yang kedua adalah jebakan.",
      },
      {
        id: "indonesia-gelap",
        term: "Indonesia Gelap",
        padanan: "Dark Indonesia Movement",
        arti: "Gerakan protes Februari dan Agustus 2025 — terbesar sejak Reformasi 1998. Bukan gerakan partai, tapi ekspresi frustrasi terhadap kesenjangan antara pejabat sejahtera dan pemuda yang tidak bisa menemukan pekerjaan layak.",
        sumber: "ECPS September 2025; East Asia Forum September 2025.",
      },
      {
        id: "maybe-later-generation",
        term: "\"Maybe Later\" Generation / Financial Anxiety",
        data: "Deloitte 2025: 56% Gen Z global hidup paycheck-to-paycheck. 48% tidak merasa aman secara finansial.",
        navigasi: "Perencanaan finansial bukan pilihan, ini kebutuhan darurat. Model generasi orang tua tidak bisa langsung dipindahkan ke konteks kamu. Membangun aset produktif — keahlian yang menghasilkan income — adalah investasi paling accessible untuk yang belum punya modal.",
      },
    ],
  },
  {
    id: "peluang",
    title: "Peluang Struktural",
    entries: [
      {
        id: "bonus-demografi",
        term: "Bonus Demografi 2030-2035",
        data: "201 juta jiwa angkatan kerja potensial pada 2030. Jendela ini tidak berulang.",
      },
      {
        id: "green-economy",
        term: "Green Economy",
        data: "1,72 juta jobs diproyeksikan di sektor EBT pada 2030 (IESR). Kemnaker hanya targetkan latih 15.000 orang sampai 2029. Gap = peluang terdokumentasi.",
      },
      {
        id: "halal-economy",
        term: "Halal Economy",
        data: "882.000 UMKM bersertifikat halal di Jabar (BPJPH Februari 2026). Shortage Auditor Halal dan Penyelia Halal sangat besar.",
      },
      {
        id: "david-autor-thesis",
        term: "David Autor Thesis: AI sebagai Leveler",
        arti: "AI bisa menurunkan barrier masuk ke profesi yang dulu hanya bisa diakses orang dengan pendidikan elite — jika didesain dengan benar dan digunakan secara aktif.",
        sumber: "David Autor, \"AI Could Actually Help Rebuild The Middle Class\", Noema Magazine 2024.",
      },
    ],
  },
];
