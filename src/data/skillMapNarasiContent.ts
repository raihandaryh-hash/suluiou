// src/data/skillMapNarasiContent.ts
// Narasi jembatan Babak 2 (Pak Evan, lanskap) → Babak 3 (Pak Dillo, bekal/human skills) → Peta Skill.
// Mengikuti sequencing IOU Fair: Evan hari-1 (medan) lalu Dillo hari-3 (bekal).
// SEMUA ANGKA TERVERIFIKASI ke sumber primer (lihat field cite → references.ts).
// Deck "Soft Skills" & materi Pak Dillo dipakai sebagai STRUKTUR NARASI; datanya diverifikasi ulang,
// angka tak terverifikasi (49%, fresh-grad -14%) DIBUANG dan diganti sumber sahih (AEI + Stanford).

export const dilloIntro = {
  kicker: 'Penerus dari Pak Evan',
  headline: 'Pak Evan menunjukkan medannya. Sekarang, bekalnya.',
  body: 'Di IOU Fair, setelah Pak Evan memetakan lanskap dunia kerja, giliran Pak Dillo Augustdi Putra, seorang psikolog, yang melanjutkan: kalau dunia berubah secepat ini, keterampilan apa yang membuat seorang manusia tetap dibutuhkan? Pertanyaan itu yang kita telusuri sekarang.',
};

export const aiSudahDiSini = {
  kicker: 'AI sudah di sini',
  headline: 'Ini bukan ramalan masa depan. Ini yang sedang terjadi.',
  body: 'Anthropic, salah satu laboratorium AI terdepan, menganalisis jutaan percakapan nyata orang dengan AI untuk melihat bagaimana teknologi ini sebenarnya dipakai di dunia kerja. Hasilnya: sekitar 36% pekerjaan sudah memakai AI untuk setidaknya seperempat tugasnya.',
  cite: 'anthropic-economic-index',
  augmentNote: 'Kabar baiknya, mayoritas pemakaian itu bersifat augmentasi: AI menguatkan manusia, bukan menggantikannya. Pada data terbaru, augmentasi memimpin 52% berbanding 45%.',
  augmentCite: 'anthropic-aug-vs-auto-2025',
};

export const yangKenaBukanYangKamuKira = {
  kicker: 'Yang mengejutkan',
  headline: 'Yang paling terdampak bukan yang kamu kira.',
  body: 'Dugaan umum: yang pertama tergantikan AI adalah pekerjaan manual dan berulang. Realitanya justru sebaliknya. Yang paling banyak bersinggungan dengan AI adalah pekerjaan kognitif kelas menengah-atas: programmer, penulis, analis data.',
  bodyCite: 'anthropic-aug-vs-auto-2025',
  stanford: 'Dampaknya sudah terukur. Sebuah studi Stanford menemukan pekerja muda usia 22-25 di bidang yang paling terpapar AI mengalami penurunan lapangan kerja sekitar 13% sejak akhir 2022, sementara pekerja senior di bidang yang sama relatif stabil. Yang menarik, penurunan ini terkonsentrasi di bidang yang tugasnya diotomasi, bukan yang diaugmentasi.',
  stanfordCite: 'stanford-entry-level-ai-2025',
  link: { label: 'Lihat data dan grafik selengkapnya di Pusat Rujukan', href: '/glossary?tab=eraai' },
};

export const pergeseranFungsi = {
  kicker: 'Yang berubah bukan hanya skill',
  headline: 'Yang berubah adalah fungsi manusia.',
  body: 'Dulu manusia mengerjakan seluruh rantai: menganalisis, memutuskan, lalu mengeksekusi. AI kini mengambil alih banyak bagian teknis dari rantai itu. Yang tersisa, dan justru makin bernilai, adalah hal-hal yang tidak bisa didelegasikan ke mesin.',
  tersisa: [
    { label: 'Judgment', desc: 'Menilai mana yang benar, baik, dan relevan, di luar yang bisa dihitung mesin.' },
    { label: 'Framing masalah', desc: 'Menentukan pertanyaan yang tepat sebelum AI bisa menjawab. AI bekerja setelah masalah dirumuskan, manusia yang merumuskannya.' },
    { label: 'Interpretasi makna', desc: 'Memberi arti pada data dan hasil, dalam konteks manusia yang sebenarnya.' },
    { label: 'Tanggung jawab moral', desc: 'Menanggung konsekuensi dari sebuah keputusan, sesuatu yang tidak bisa dipikul oleh mesin.' },
  ],
  closing: 'Inilah yang dilatih oleh human skills. Bukan untuk menyaingi AI dalam hal teknis, tapi untuk menguasai hal-hal yang justru jadi langka ketika AI ada di mana-mana.',
};

export const jembatanKePeta = {
  headline: 'Lalu, apa saja bekal itu, dan bagaimana semuanya saling terkait?',
  body: 'Pak Dillo menyebut lima keterampilan inti: berpikir kritis, komunikasi, kerja sama, adaptabilitas, dan kepemimpinan. Peta di bawah ini menampung kelimanya, lalu menempatkannya dalam struktur yang lebih utuh: dari karakter dasar yang membentuk dirimu, sampai keahlian teknis tiap sektor. Setiap simpul ditandai apakah ia aman, terbantu, atau berisiko di hadapan AI, lengkap dengan kaitan sebab-akibat yang sudah teruji.',
};

// Penutup SETELAH diagram skill-map: menjawab "apa yang harus dilakukan dengan
// peta ini?" Resolusi = service learning / menjadi problem solver aktif, bukan
// belajar dari buku. Lalu jembatan ke Kenali Dirimu. Semua siswa-facing.
export const setelahPeta = {
  kicker: 'Lalu, bagaimana cara menumbuhkannya?',
  headline: 'Skill ini tidak tumbuh dari buku. Ia tumbuh saat kamu "nyemplung".',
  poin: [
    { label: 'Membaca saja tidak cukup', desc: 'Membaca sepuluh buku tentang kepemimpinan tidak membuatmu jadi pemimpin. Skill ini bukan informasi yang bisa dihafal, tapi kemampuan yang terbentuk lewat pengalaman nyata.' },
    { label: 'Caranya: jadi pemecah masalah yang aktif', desc: 'Tempatkan dirimu di tengah persoalan nyata di masyarakat, sekecil apa pun. Begitu kamu benar-benar mencoba menolong, kamu otomatis akan butuh dan melatih berpikir analitis, komunikasi, kerja sama, dan kepemimpinan. Skill datang sebagai konsekuensi, bukan sebagai pelajaran terpisah.' },
    { label: 'Arahkan sejak awal untuk berkhidmat', desc: 'Pilih jurusan, ambil microcredential, dan cari pengalaman dengan satu pertanyaan di kepala: masalah atau komunitas mana yang ingin kubantu? Inilah inti service learning, yang juga menjadi ruh Kurikulum Merdeka, dan sejalan dengan tiga transformative competencies yang dirumuskan OECD untuk pelajar masa depan.' },
  ],
  poinCite: 'oecd-teenage-career-2025',
  bridge: 'Perjalanannya panjang, dan itu wajar. Tapi jangan sampai membuatmu takut atau membeku di tempat. Setiap perjalanan jauh dimulai dari satu langkah yang dekat: mengenali dengan jujur apa yang sudah kamu punya, lalu menyusun rencana ke depan. Sebelum itu, mari lihat dulu, pintu-pintu mana yang sebenarnya sedang terbuka lebar.',
};
