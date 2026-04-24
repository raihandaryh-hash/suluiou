// SDS-Holland (Self-Directed Search) — versi Indonesia
// 3 Bagian × 6 kategori RIASEC.
// Bagian I (Kegiatan): 11 item × 6 = 66
// Bagian II (Kompetensi): 11 item × 6 = 66
// Bagian III (Pekerjaan): 14 item × 6 = 84
// Total: 216 item. Skoring: binary (1 = Suka/Mampu/Tertarik, 0 = Tidak).

export type RiasecCategory = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export type SdsSection = 'activities' | 'competencies' | 'occupations';

export interface SdsItem {
  id: number;            // global, 1-216
  section: SdsSection;
  category: RiasecCategory;
  localIndex: number;    // urutan dalam (section, category), 1-based
  text: string;
}

export const riasecLabels: Record<RiasecCategory, string> = {
  R: 'Realistik (Praktis)',
  I: 'Investigatif (Analitis)',
  A: 'Artistik (Kreatif)',
  S: 'Sosial (Penolong)',
  E: 'Enterprising (Wirausaha)',
  C: 'Konvensional (Terstruktur)',
};

export const sdsSectionMeta: Record<SdsSection, { title: string; instruction: string; positiveLabel: string; negativeLabel: string }> = {
  activities: {
    title: 'Bagian I — Kegiatan',
    instruction: 'Tandai kegiatan yang Anda sukai. Lewati yang tidak Anda sukai atau biasa saja.',
    positiveLabel: 'Suka',
    negativeLabel: 'Tidak Suka',
  },
  competencies: {
    title: 'Bagian II — Kompetensi',
    instruction: 'Tandai kegiatan yang Anda mampu lakukan dengan baik. Lewati yang tidak pernah Anda lakukan atau tidak mampu.',
    positiveLabel: 'Mampu',
    negativeLabel: 'Tidak Mampu',
  },
  occupations: {
    title: 'Bagian III — Pekerjaan',
    instruction: 'Tandai pekerjaan yang menarik bagi Anda. Lewati yang tidak menarik.',
    positiveLabel: 'Tertarik',
    negativeLabel: 'Tidak Tertarik',
  },
};

// ---------------- Bagian I — Kegiatan (11 × 6 = 66) ----------------
const activities: Record<RiasecCategory, string[]> = {
  R: [
    'Memperbaiki alat-alat listrik (seterika, dll)',
    'Memperbaiki mobil',
    'Memperbaiki alat-alat mekanik (sepeda, dll)',
    'Membuat benda dari kayu',
    'Beternak ayam, bebek atau angsa',
    'Menggunakan perkakas bengkel dan mesin-mesin',
    'Membudidayakan tanaman hias',
    'Mengikuti kursus perbengkelan',
    'Mengikuti kursus menggambar keteknikan',
    'Mengikuti kursus kerajinan kayu',
    'Mengikuti kursus montir mobil',
  ],
  I: [
    'Membaca buku atau majalah ilmiah',
    'Bekerja di laboratorium',
    'Mengerjakan suatu proyek ilmiah',
    'Mempelajari suatu teori ilmiah',
    'Melakukan percobaan kimia',
    'Membaca mengenai topik-topik khusus atas keinginan sendiri',
    'Menerapkan matematika dalam masalah praktis',
    'Mengambil kursus pelajaran Fisika',
    'Mengambil kursus pelajaran Kimia',
    'Mengambil kursus pelajaran Matematika',
    'Mengambil kursus pelajaran Biologi',
  ],
  A: [
    'Membuat sketsa, menggambar atau melukis',
    'Menjadi pemain dalam komedi atau sandiwara',
    'Merancang perabotan, pakaian atau poster',
    'Bermain dalam suatu band, kelompok atau orkestra',
    'Memainkan alat musik',
    'Menulis untuk suatu majalah atau koran',
    'Membuat lukisan atau foto orang',
    'Menulis novel atau sandiwara',
    'Membaca atau menulis puisi',
    'Mengikuti kursus kesenian',
    'Menata atau menggubah musik',
  ],
  S: [
    'Bertemu dengan pengamat masalah sosial atau pendidikan',
    'Membaca artikel atau buku mengenai masalah sosial',
    'Bekerja untuk Palang Merah',
    'Membantu orang lain dengan masalah pribadinya',
    'Menjaga / mengurus dan mengawasi anak-anak',
    'Mempelajari kenakalan remaja',
    'Mengajar di perguruan tinggi',
    'Membaca buku-buku psikologi (pergaulan, dll)',
    'Membantu orang-orang cacat',
    'Mengambil kursus hubungan masyarakat',
    'Mengajar di sekolah lanjutan (SLTP, SLTA, dll)',
  ],
  E: [
    'Mempengaruhi orang lain',
    'Menjual suatu produk',
    'Mempelajari strategi untuk keberhasilan bisnis',
    'Berwiraswasta',
    'Mengikuti ceramah mengenai penjualan',
    'Mengambil kursus singkat administrasi dan kepemimpinan',
    'Menjadi pemimpin dalam kelompok',
    'Mengawasi pekerjaan orang lain',
    'Bertemu dengan tokoh eksekutif dan pemimpin',
    'Memimpin kelompok dalam meraih tujuan tertentu',
    'Menjadi penanggungjawab dalam kampanye politik',
  ],
  C: [
    'Mengisi formulir / daftar isian yang panjang',
    'Mengetik sendiri makalah atau surat-surat',
    'Melakukan operasi matematika (+, -, x, dan :) dalam bisnis atau pembukuan',
    'Mengoperasikan berbagai jenis alat kantor',
    'Membuat catatan pengeluaran yang terperinci',
    'Menyusun sistem pengarsipan (filing)',
    'Mengikuti kursus bisnis',
    'Mengikuti kursus pembukuan (akuntansi)',
    'Mengikuti kursus hitung dagang',
    'Mengoperasikan komputer',
    'Membuat daftar inventaris dari persediaan atau produk',
  ],
};

// ---------------- Bagian II — Kompetensi (11 × 6 = 66) ----------------
const competencies: Record<RiasecCategory, string[]> = {
  R: [
    'Menggunakan peralatan mesin untuk pertukangan kayu (gergaji kayu listrik, mesin bubut, dll)',
    'Membuat gambar dengan skala',
    'Mengganti minyak mesin mobil atau ban mobil',
    'Menggunakan peralatan mesin, seperti bor listrik atau mesin jahit',
    'Menghaluskan dan memplitur perabotan atau barang-barang dari kayu',
    'Membaca cetak biru (blue prints)',
    'Melakukan perbaikan kecil pada alat listrik',
    'Memperbaiki perabotan',
    'Menggunakan hampir semua alat pertukangan kayu',
    'Melakukan perbaikan kecil pada TV atau radio',
    'Melakukan perbaikan kecil pada pipa air, keran, dll',
  ],
  I: [
    'Menggunakan prinsip aljabar untuk memecahkan masalah matematika',
    'Melakukan percobaan atau penelitian ilmiah',
    'Mengerti tentang "waktu paruh" elemen radioaktif',
    'Menggunakan tabel logaritma',
    'Menggunakan kalkulator atau mistar hitung',
    'Menggunakan mikroskop',
    'Membuat program komputer untuk mempelajari masalah ilmiah',
    'Menjelaskan fungsi sel darah putih',
    'Menginterpretasikan rumus kimia sederhana',
    'Mengerti mengapa satelit buatan manusia tidak jatuh ke bumi',
    'Menyebutkan tiga makanan yang memiliki protein tinggi',
  ],
  A: [
    'Memainkan alat musik',
    'Menyanyi suara dua atau suara empat dalam paduan suara',
    'Menyajikan permainan musik tunggal',
    'Bermain dalam sandiwara',
    'Menginterpretasikan cerita atau bahan bacaan',
    'Menulis laporan berita atau laporan teknis',
    'Membuat sketsa orang sehingga ia dapat dikenali',
    'Melukis atau membuat patung',
    'Menata atau menggubah musik',
    'Merancang pakaian',
    'Mengaransemen lagu atau komposisi musik',
  ],
  S: [
    'Mudah berbicara dengan semua orang',
    'Memimpin diskusi kelompok',
    'Pandai menjelaskan sesuatu kepada orang lain',
    'Berpartisipasi dalam pencarian dana atau amal',
    'Bekerja sebagai pengurus RT / RW',
    'Mengajar anak-anak dengan mudah',
    'Mengajar orang dewasa dengan mudah',
    'Menolong orang lain yang sedang bingung atau bermasalah',
    'Merencanakan acara hiburan untuk pesta dalam lingkungan terbatas (keluarga, teman, dll)',
    'Menghibur dan menemani orang yang lebih tua dari saya',
    'Orang lain mencari saya untuk menceritakan masalah mereka',
  ],
  E: [
    'Memenangkan penghargaan sebagai tenaga penjual atau pemimpin',
    'Mengetahui cara menjadi pemimpin yang sukses',
    'Menjadi pembicara di depan umum',
    'Mengelola usaha kecil',
    'Membuat suatu kelompok sosial / kelompok kerja berjalan dengan baik',
    'Berbicara dengan orang yang sulit / keras kepala',
    'Mengelola kampanye penjualan',
    'Mengatur pekerjaan orang lain',
    'Berambisi dan cenderung berbicara apa adanya (tidak secara agresif)',
    'Pandai mempengaruhi orang untuk melakukan sesuatu menurut cara saya',
    'Saya seorang tenaga penjual yang baik',
  ],
  C: [
    'Mengetik sepuluh jari dengan cepat',
    'Menjalankan mesin duplikator / mesin penjumlah',
    'Menulis steno',
    'Mengarsip surat dan berkas-berkas lain',
    'Melakukan pekerjaan administrasi kantor',
    'Menggunakan program pembukuan',
    'Melakukan tugas administratif dalam waktu singkat',
    'Menggunakan mesin penghitung (kalkulator)',
    'Menggunakan alat pemroses data yang sederhana seperti komputer',
    'Menempatkan kredit dan debet dalam pembukuan',
    'Saya dapat mencatat dengan cermat pembayaran / penjualan',
  ],
};

// ---------------- Bagian III — Pekerjaan (14 × 6 = 84) ----------------
const occupations: Record<RiasecCategory, string[]> = {
  R: [
    'Mekanik pesawat terbang', 'Penanggung jawab keamanan', 'Mekanik / montir mobil',
    'Pengrajin kayu', 'Spesialis perikanan dan margasatwa', 'Ahli tanaman',
    'Operator alat-alat berat', 'Peninjau kelayakan (surveyor)', 'Pengawas konstruksi bangunan',
    'Operator radio', 'Pengemudi bis', 'Insinyur otomotif', 'Ahli mesin', 'Ahli listrik',
  ],
  I: [
    'Ahli meteorologi (ilmu cuaca)', 'Ahli biologi (ilmu hayat)', 'Ahli astronomi (ilmu bintang)',
    'Teknisi laboratorium medis', 'Ahli antropologi', 'Ahli ilmu hewan', 'Ahli kimia',
    'Ilmuwan peneliti', 'Penulis artikel ilmiah', 'Penyunting majalah ilmiah', 'Ahli geologi',
    'Ahli botani (ilmu tumbuh-tumbuhan)', 'Pekerja riset ilmiah', 'Ahli fisika',
  ],
  A: [
    'Penulis puisi', 'Dirigen simfoni', 'Pemain musik', 'Penulis novel', 'Aktor / aktris',
    'Penulis lepas', 'Penata musik', 'Wartawan', 'Seniman', 'Penyanyi', 'Penggubah musik',
    'Pemahat patung', 'Penulis sandiwara', 'Kartunis',
  ],
  S: [
    'Sosiolog', 'Guru sekolah lanjutan', 'Pakar kenakalan remaja', 'Terapis bicara',
    'Konselor pernikahan', 'Kepala sekolah', 'Fisioterapis', 'Psikolog klinis',
    'Guru ilmu sosial', 'Direktur L.S.M.', 'Direktur Lembaga Rehabilitasi',
    'Konselor masalah pribadi', 'Pekerja sosial', 'Konselor kejuruan dan pekerjaan',
  ],
  E: [
    'Spekulator bisnis', 'Eksekutif pembelian', 'Eksekutif periklanan',
    'Wakil perusahaan produksi', 'Penjual asuransi jiwa', 'Penyiar radio - TV',
    'Eksekutif bisnis', 'Manajer restoran', 'Pembawa acara (MC)', 'Eksekutif penjualan',
    'Eksekutif penjualan real estate', 'Pemandu wisata', 'Manajer toko serba ada',
    'Manajer penjualan',
  ],
  C: [
    'Ahli pembukuan', 'Guru bisnis / ilmu dagang', 'Pemeriksa anggaran',
    'Akuntan publik bersertifikat', 'Penyelidik kredit', 'Pencatat steno di pengadilan',
    'Kasir bank', 'Ahli pajak', 'Pengawas barang inventaris', 'Operator alat listrik kantor',
    'Analis keuangan', 'Penaksir biaya', 'Pembayar gaji', 'Pemeriksa di bank',
  ],
};

const categoryOrder: RiasecCategory[] = ['R', 'I', 'A', 'S', 'E', 'C'];

function buildSection(section: SdsSection, source: Record<RiasecCategory, string[]>): SdsItem[] {
  const out: SdsItem[] = [];
  for (const cat of categoryOrder) {
    source[cat].forEach((text, idx) => {
      out.push({
        id: 0, // assigned below
        section,
        category: cat,
        localIndex: idx + 1,
        text,
      });
    });
  }
  return out;
}

const all: SdsItem[] = [
  ...buildSection('activities', activities),
  ...buildSection('competencies', competencies),
  ...buildSection('occupations', occupations),
].map((item, i) => ({ ...item, id: i + 1 }));

export const sdsQuestions: SdsItem[] = all;

// Helper: ambil item per (section, category) untuk render per-screen
export function sdsItemsBy(section: SdsSection, category: RiasecCategory): SdsItem[] {
  return sdsQuestions.filter((q) => q.section === section && q.category === category);
}

export const sdsSections: SdsSection[] = ['activities', 'competencies', 'occupations'];
export const sdsCategories: RiasecCategory[] = categoryOrder;
