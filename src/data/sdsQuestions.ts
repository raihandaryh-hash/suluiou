// Minat: O*NET Interest Profiler Short Form (60 kegiatan kerja, 10 per tipe RIASEC).
// Sumber butir: https://www.onetcenter.org/dl_tools/ipsf/Interest_Profiler.pdf (dibaca 25 Nov 2026).
// Lisensi: O*NET Career Exploration Tools; terjemahan dan penyesuaian di bawah O*NET Tools Developer License
// (https://www.onetcenter.org/license_tools.html). Atribusi: "Butir diadaptasi dari O*NET Interest Profiler Short Form,
// USDOL/ETA. O*NET adalah merek dagang USDOL/ETA. Adaptasi ini tidak didukung USDOL/ETA."
// KEPUTUSAN Raihan 25 Nov 10.25 "Lisensi dua instrumen, ke yang terbuka." menggantikan SDS-216 (milik PAR).
// SACII-SR versi Indonesia divalidasi konvergen terhadap O*NET Interest Profiler (ejournal.uin-suska.ac.id/index.php/psikologi/article/download/12676/pdf).
// Terjemahan Indonesia: DRAF Chief Sulu, menunggu terjemah balik dan tinjauan SME. Teks Inggris disimpan di `asli`.
// Nama berkas dan tipe dipertahankan supaya alur dan skor tidak patah; kini satu bagian saja.
// Catatan metodologi untuk SME: skala jawaban di sini dikotom (ingin / tidak), mengikuti versi kertas O*NET IP-SF;
// versi daring O*NET memakai lima pilihan. Validitas versi lima pilihan tidak otomatis berlaku untuk adaptasi dikotom ini.
// Urutan tampil diselang-seling R-I-A-S-E-C seperti formulir O*NET, tanpa judul tipe.

export type RiasecCategory = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
export type SdsSection = 1;

export interface SdsQuestion {
  id: string; // mis. "ip-R-1"
  section: SdsSection;
  category: RiasecCategory;
  num: number;
  text: string;
  /** Teks butir O*NET asli (Inggris). */
  asli: string;
}

export const sdsSectionMeta: Record<SdsSection, { title: string; instruction: string; positive: string; negative: string }> = {
  1: {
    title: 'Kegiatan kerja',
    instruction: 'Centang kegiatan yang ingin kamu lakukan. Jangan pikirkan pendidikan yang dibutuhkan atau berapa penghasilannya.',
    positive: 'Ingin',
    negative: 'Tidak / ragu',
  },
};

export const riasecLabels: Record<RiasecCategory, string> = {
  R: 'Realistic (Praktis)',
  I: 'Investigative (Analitis)',
  A: 'Artistic (Kreatif)',
  S: 'Social (Sosial)',
  E: 'Enterprising (Wirausaha)',
  C: 'Conventional (Terstruktur)',
};

export const instrumenMinat = {
  nama: 'O*NET Interest Profiler Short Form (adaptasi)',
  lisensi: 'O*NET Tools Developer License',
  sumber: 'https://www.onetcenter.org/license_tools.html',
  atribusi:
    'Butir diadaptasi dari O*NET Interest Profiler Short Form, USDOL/ETA. O*NET adalah merek dagang USDOL/ETA. Adaptasi ini tidak didukung USDOL/ETA.',
};

export const sdsQuestions: SdsQuestion[] = [
  { id: 'ip-R-1', section: 1, category: 'R', num: 1, text: 'Membuat lemari dapur', asli: 'Build kitchen cabinets' },
  { id: 'ip-R-2', section: 1, category: 'R', num: 2, text: 'Memasang bata atau ubin', asli: 'Lay brick or tile' },
  { id: 'ip-R-3', section: 1, category: 'R', num: 3, text: 'Memperbaiki peralatan rumah tangga', asli: 'Repair household appliances' },
  { id: 'ip-R-4', section: 1, category: 'R', num: 4, text: 'Membudidayakan ikan di tempat pembenihan', asli: 'Raise fish in a fish hatchery' },
  { id: 'ip-R-5', section: 1, category: 'R', num: 5, text: 'Merakit komponen elektronik', asli: 'Assemble electronic parts' },
  { id: 'ip-R-6', section: 1, category: 'R', num: 6, text: 'Mengemudikan truk untuk mengantar paket ke kantor dan rumah', asli: 'Drive a truck to deliver packages to offices and homes' },
  { id: 'ip-R-7', section: 1, category: 'R', num: 7, text: 'Menguji mutu suku cadang sebelum dikirim', asli: 'Test the quality of parts before shipment' },
  { id: 'ip-R-8', section: 1, category: 'R', num: 8, text: 'Memperbaiki dan memasang kunci', asli: 'Repair and install locks' },
  { id: 'ip-R-9', section: 1, category: 'R', num: 9, text: 'Menyiapkan dan menjalankan mesin untuk membuat produk', asli: 'Set up and operate machines to make products' },
  { id: 'ip-R-10', section: 1, category: 'R', num: 10, text: 'Memadamkan kebakaran hutan', asli: 'Put out forest fires' },
  { id: 'ip-I-1', section: 1, category: 'I', num: 1, text: 'Mengembangkan obat baru', asli: 'Develop a new medicine' },
  { id: 'ip-I-2', section: 1, category: 'I', num: 2, text: 'Meneliti cara mengurangi pencemaran air', asli: 'Study ways to reduce water pollution' },
  { id: 'ip-I-3', section: 1, category: 'I', num: 3, text: 'Melakukan percobaan kimia', asli: 'Conduct chemical experiments' },
  { id: 'ip-I-4', section: 1, category: 'I', num: 4, text: 'Mempelajari pergerakan planet', asli: 'Study the movement of planets' },
  { id: 'ip-I-5', section: 1, category: 'I', num: 5, text: 'Memeriksa sampel darah dengan mikroskop', asli: 'Examine blood samples using a microscope' },
  { id: 'ip-I-6', section: 1, category: 'I', num: 6, text: 'Menyelidiki penyebab kebakaran', asli: 'Investigate the cause of a fire' },
  { id: 'ip-I-7', section: 1, category: 'I', num: 7, text: 'Mengembangkan cara memprakirakan cuaca dengan lebih baik', asli: 'Develop a way to better predict the weather' },
  { id: 'ip-I-8', section: 1, category: 'I', num: 8, text: 'Bekerja di laboratorium biologi', asli: 'Work in a biology lab' },
  { id: 'ip-I-9', section: 1, category: 'I', num: 9, text: 'Menciptakan pengganti gula', asli: 'Invent a replacement for sugar' },
  { id: 'ip-I-10', section: 1, category: 'I', num: 10, text: 'Melakukan uji laboratorium untuk mengenali penyakit', asli: 'Do laboratory tests to identify diseases' },
  { id: 'ip-A-1', section: 1, category: 'A', num: 1, text: 'Menulis buku atau naskah drama', asli: 'Write books or plays' },
  { id: 'ip-A-2', section: 1, category: 'A', num: 2, text: 'Memainkan alat musik', asli: 'Play a musical instrument' },
  { id: 'ip-A-3', section: 1, category: 'A', num: 3, text: 'Menggubah atau mengaransemen musik', asli: 'Compose or arrange music' },
  { id: 'ip-A-4', section: 1, category: 'A', num: 4, text: 'Menggambar', asli: 'Draw pictures' },
  { id: 'ip-A-5', section: 1, category: 'A', num: 5, text: 'Membuat efek khusus untuk film', asli: 'Create special effects for movies' },
  { id: 'ip-A-6', section: 1, category: 'A', num: 6, text: 'Melukis latar panggung pertunjukan', asli: 'Paint sets for plays' },
  { id: 'ip-A-7', section: 1, category: 'A', num: 7, text: 'Menulis naskah film atau acara televisi', asli: 'Write scripts for movies or television shows' },
  { id: 'ip-A-8', section: 1, category: 'A', num: 8, text: 'Menampilkan tari jazz atau tap dance', asli: 'Perform jazz or tap dance' },
  { id: 'ip-A-9', section: 1, category: 'A', num: 9, text: 'Bernyanyi dalam sebuah grup musik', asli: 'Sing in a band' },
  { id: 'ip-A-10', section: 1, category: 'A', num: 10, text: 'Menyunting film', asli: 'Edit movies' },
  { id: 'ip-S-1', section: 1, category: 'S', num: 1, text: 'Mengajarkan rangkaian latihan olahraga kepada seseorang', asli: 'Teach an individual an exercise routine' },
  { id: 'ip-S-2', section: 1, category: 'S', num: 2, text: 'Membantu orang dengan masalah pribadi atau emosional', asli: 'Help people with personal or emotional problems' },
  { id: 'ip-S-3', section: 1, category: 'S', num: 3, text: 'Memberi bimbingan karier kepada orang lain', asli: 'Give career guidance to people' },
  { id: 'ip-S-4', section: 1, category: 'S', num: 4, text: 'Memberikan terapi rehabilitasi', asli: 'Perform rehabilitation therapy' },
  { id: 'ip-S-5', section: 1, category: 'S', num: 5, text: 'Bekerja sukarela di organisasi nirlaba', asli: 'Do volunteer work at a non-profit organization' },
  { id: 'ip-S-6', section: 1, category: 'S', num: 6, text: 'Mengajari anak-anak cara berolahraga', asli: 'Teach children how to play sports' },
  { id: 'ip-S-7', section: 1, category: 'S', num: 7, text: 'Mengajarkan bahasa isyarat kepada orang Tuli atau yang sulit mendengar', asli: 'Teach sign language to people who are deaf or hard of hearing' },
  { id: 'ip-S-8', section: 1, category: 'S', num: 8, text: 'Membantu memandu sesi terapi kelompok', asli: 'Help conduct a group therapy session' },
  { id: 'ip-S-9', section: 1, category: 'S', num: 9, text: 'Mengasuh anak-anak di tempat penitipan anak', asli: 'Take care of children at a day-care center' },
  { id: 'ip-S-10', section: 1, category: 'S', num: 10, text: 'Mengajar kelas SMA', asli: 'Teach a high-school class' },
  { id: 'ip-E-1', section: 1, category: 'E', num: 1, text: 'Membeli dan menjual saham dan obligasi', asli: 'Buy and sell stocks and bonds' },
  { id: 'ip-E-2', section: 1, category: 'E', num: 2, text: 'Mengelola toko ritel', asli: 'Manage a retail store' },
  { id: 'ip-E-3', section: 1, category: 'E', num: 3, text: 'Menjalankan salon kecantikan atau pangkas rambut', asli: 'Operate a beauty salon or barber shop' },
  { id: 'ip-E-4', section: 1, category: 'E', num: 4, text: 'Memimpin sebuah bagian di perusahaan besar', asli: 'Manage a department within a large company' },
  { id: 'ip-E-5', section: 1, category: 'E', num: 5, text: 'Memulai usaha sendiri', asli: 'Start your own business' },
  { id: 'ip-E-6', section: 1, category: 'E', num: 6, text: 'Merundingkan kontrak bisnis', asli: 'Negotiate business contracts' },
  { id: 'ip-E-7', section: 1, category: 'E', num: 7, text: 'Mewakili klien dalam perkara hukum', asli: 'Represent a client in a lawsuit' },
  { id: 'ip-E-8', section: 1, category: 'E', num: 8, text: 'Memasarkan lini pakaian baru', asli: 'Market a new line of clothing' },
  { id: 'ip-E-9', section: 1, category: 'E', num: 9, text: 'Menjual barang di toserba', asli: 'Sell merchandise at a department store' },
  { id: 'ip-E-10', section: 1, category: 'E', num: 10, text: 'Mengelola toko pakaian', asli: 'Manage a clothing store' },
  { id: 'ip-C-1', section: 1, category: 'C', num: 1, text: 'Menyusun spreadsheet dengan perangkat lunak komputer', asli: 'Develop a spreadsheet using computer software' },
  { id: 'ip-C-2', section: 1, category: 'C', num: 2, text: 'Memeriksa ketepatan catatan atau formulir', asli: 'Proofread records or forms' },
  { id: 'ip-C-3', section: 1, category: 'C', num: 3, text: 'Memasang perangkat lunak di banyak komputer dalam jaringan besar', asli: 'Install software across computers on a large network' },
  { id: 'ip-C-4', section: 1, category: 'C', num: 4, text: 'Mengoperasikan kalkulator', asli: 'Operate a calculator' },
  { id: 'ip-C-5', section: 1, category: 'C', num: 5, text: 'Mencatat pengiriman dan penerimaan barang', asli: 'Keep shipping and receiving records' },
  { id: 'ip-C-6', section: 1, category: 'C', num: 6, text: 'Menghitung upah karyawan', asli: 'Calculate the wages of employees' },
  { id: 'ip-C-7', section: 1, category: 'C', num: 7, text: 'Mendata persediaan barang dengan komputer genggam', asli: 'Inventory supplies using a hand-held computer' },
  { id: 'ip-C-8', section: 1, category: 'C', num: 8, text: 'Mencatat pembayaran sewa', asli: 'Record rent payments' },
  { id: 'ip-C-9', section: 1, category: 'C', num: 9, text: 'Mengelola catatan persediaan barang', asli: 'Keep inventory records' },
  { id: 'ip-C-10', section: 1, category: 'C', num: 10, text: 'Membubuhkan stempel, memilah, dan membagikan surat untuk sebuah organisasi', asli: 'Stamp, sort, and distribute mail for an organization' },
];
