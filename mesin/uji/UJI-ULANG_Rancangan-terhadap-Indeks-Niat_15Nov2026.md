# Uji ulang rancangan sambungan terhadap indeks niat lengkap

SINTESIS, kecuali kutipan. SESI-11NOV-SULU-MESIN (https://claude.ai/code/session_01JZPjjr3cEST9SPkxZSaHrr), 15 Nov 2026 16.47 WIB.
Asal: Raihan 15 Nov 14.12, "Haduh, ini artinya intent saya belum tertangkap semua. … Tolong fix. … Saya TIDAK menerima failure."

## 1. Indeks niat: apa yang dijamin dan apa yang tidak

| Ukuran | Angka | Cara |
|---|---|---|
| Pesan arsip yang punya baris | 3.059 dari 3.059 | skrip `periksa.py`: tiap nomor pesan wajib ada |
| Pesan dinilai memuat arahan | 2.145 | pembaca membaca utuh, tanpa saringan kata kunci |
| Kutipan disalin | 3.653 | — |
| Kutipan tidak cocok dengan arsip | 0 | pencocokan huruf demi huruf sesudah spasi dirapikan |
| Pesan bernilai 0 yang memuat kata penting, dibaca ulang oleh sesi ini | 76, 0 ternyata arahan | skrip `silang.py` |

Rumah: laptop `MESIN\niat\INDEKS-NIAT_Raihan_lengkap_15Nov2026.jsonl` (sha256 e513c4b396006337be7091dd72a77e307a29b1f9b3fddbff32abe96b7f71d20f). Tidak ditaruh di repo karena memuat pesan di luar Sulu.

Batas: arsip berhenti 18 Okt 2026; lampiran tidak ikut; pembacanya AI, jadi masih mungkin ada arahan yang dinilai 0 dan tidak memuat kata penting. Sesi ini sudah membaca sendiri semua baris empat topik inti mesin (data daerah dan pencarian, peran dan karier, jalan bakti, proposal diri: 99 pesan). Belum dibaca sesi ini: baris topik peran AI, pengguna, tujuan, keterampilan, kenali diri, privasi, dan lainnya.

Aturan pakai (mengikat sesi mesin): tiap baris rancangan menunjuk nomor pesan di indeks. Sebelum membangun sebuah bagian, cetak semua baris topiknya (`cetak.py`) dan baca.

## 2. Yang terlewat atau salah di rancangan (dari 99 pesan yang dibaca)

Nomor dalam kurung siku adalah nomor pesan di indeks.

| # | Niat Raihan | Kutipan | Keadaan di rancangan | Tindak |
|---|---|---|---|---|
| U1 | Data daerah harus memuat peluang yang tumbuh, bukan hanya kekurangan | [788] 31 Mei: "data Jabar kok tidak mencakup growing opportunities dst. yang sudah dirisetkan, dan malah soal pengangguran saja dan yg tidak actionable?" | Kartu mesin hanya empat indikator kekurangan | Tambah jenis kartu peluang dan arah pembangunan; tanpa itu S1 mengulang keluhan ini |
| U2 | Keseluruhan harus tampak, bukan hanya sorotan | [761] 28 Mei: "Artinya selain headlines/semisalnya, atau data yang ditonjolkan, the whole thing juga harus ada, dong?" | Tidak ada | Lapis provinsi menyebut terang kebutuhan apa yang belum punya kartu |
| U3 | AI mencari data daerah, masalah sosial, arah pembangunan, dicocokkan ke profil | [446] 24 Apr: "Juga lainnya seperti problem sosial, arah pembangunan yang bisa di-match ke profil, dlsb.?" | Baru masuk hari ini, topik masih empat | Perluas topik kueri; tambah pencocokan ke bekal |
| U4 | Lapis ambil data waktu nyata yang bisa dimatikan, menambah tanpa merusak | [1033] 12 Jun: "mungkin bisa tambahkan juga layer terakhir untuk fetch data real time tersebut? Dengan cara yang tidak merusak build, tapi menambah." | Sejalan (bendera mati bawaan) | Tetap |
| U5 | Pengguna diberi prompt siap pakai untuk mencari sendiri dengan model yang lebih kuat | [1033] 12 Jun: "memberikan prompt pada user yang bisa mereka gunakan sendiri ke Gemini, untuk mereka search sendiri dengan model LLM yang lebih bagus atau bahkan deep research." | Tidak ada | Tambah S14: prompt siap salin, disusun dari wilayah, kebutuhan, dan bekal pengguna. Tanpa biaya penyedia |
| U6 | Reliabilitas dan aktualitas 38 entri provinsi dicek; data provinsi diletakkan di bagian SDG supaya makin lokal | [1032] 12 Jun: "Jadi semakin lokal begitu kan? Resolusinya bergerak jadi semakin jelas dan vivid." | Sebagian (lapis provinsi Peta Medan) | Tetap; audit 38 entri masuk lajur chief |
| U7 | Program pemerintah dihubungkan | [772] 29 Mei: "Juga kita hubungkan dengan data-data tentang program-program pemerintah." | Tidak ada | Tambah bidang program terkait pada kartu, bersumber |
| U8 | Jalan Bakti melanjutkan Kenali Diri; AI membantu menjelajah dari data provinsi yang dikerucutkan | [1168] 29 Jun: "Jadi page jalan bakti ini bukan start from scratch." | Ada (S12), lemah | Pertegas: bekal dari Kenali Diri wajib menjadi masukan S3 dan S4 |
| U9 | Menjelajah dan mengalami menjadi tugas nyata; mereka harus bergerak | [1169] 29 Jun: "Dengan penekanan besar bahwa they MUST move; tapi tentu dengan cara yang tidak sembarang eksplor." | Ada (S6) | Tetap |
| U10 | Boleh lebih dari satu langkah | [1190] 1 Jul: "Itu memang hanya pilih satu \"Jadikan langkahku\" ya? Tidak bisa lebih? Misal mereka mau cari orang plus \"nyebur\" begitu?" | Tidak disebut | S6 tidak boleh memaksa satu langkah |
| U11 | Peran, bukan sosok | [1170] 30 Jun: "Daripada mengarang alumni, atau memberi contoh sosok, yang belum tentu juga istiqamah di jalannya after kita post, lebih baik roles saja" | Sejalan | Tetap; pagar: temuan berita tidak dipakai untuk menokohkan orang |
| U12 | Mendorong mencipta jalan yang belum ada | [1413] 8 Jul: "bukan hanya mengarahkan ke taksonomi/jalan-jalan karir yang sudah ada, tapi juga mendorong mereka kreatif mencari atau membuat sesuatu yang belum ada sebelumnya." | Sejalan (jalur cipta) | Tetap |
| U13 | Pemimpin lokal yang membumi, bukan mengejar mercusuar di Jakarta | [632] 11 Mei: "but local leaders, yang membumi, yang ilmunya terpakai, yang hidup di tengah masyarakat, berjalan di pasar-pasar." | Tersirat | Jadikan kalimat arah "Titikmu" |
| U14 | Cara mempelajari keterampilan, bukan berhenti di tahu | [876] 3 Jun: "cara mempelajari skillnya. Apa berhenti di tahu saja? Kan itu tidak berguna." | Lemah (S5 hanya menunjuk bekal) | S5 memuat satu cara berlatih per bekal |
| U15 | Catatan sepanjang jalan dirangkum dan dicocokkan ke kebutuhan daerah | [876] 3 Jun: "Lalu, saya juga berencana menambah fitur journaling di sepanjang perjalanan Sulu ini." | Sebagian (S8) | Tetap; sambung ke S12 |
| U16 | Actionability; tanpa jualan IOU | [391] 24 Apr: "Yang terpenting adalah actionability. Kembali lagi ke prinsip kita, no overclaim. Kita tak berusaha hard-sell IOU di sini." | Sejalan | Tetap |
| U17 | Fitur interaksi dengan masalah nyata harus sempurna, banyak pembanding | [1182] 1 Jul: "Ini fitur yang sangat krusial, karena menentukan seberapa jauh dan akurat audiens bisa berinteraksi dengan real problems dan informations." | Belum ada pembanding | Pindai karya terdahulu untuk penjelajah lokal sebelum dikunci |
| U18 | Uji kemampuan AI memberi konteks lokal sendiri | [285] 10 Apr: "Saya kira, kita tes juga seberapa bagus LLM itu memberi konteks lokal?" | Sebagian (item 144) | Jadikan set uji tetap |
| U19 | Maqashid tidak dipakai | [898] 5 Jun: "Saya juga tak pernah menyetujui penggunaan maqashid di sini kok" | Sejalan | Tetap |
| U20 | Mahasiswa sosial-humaniora sebagai pemecah masalah nyata | [2118] 30 Jul: "business adm students should actually fix the BUMDes, not build MCKs or till the fields, etc." | Tidak ada | Contoh peran terikat bekal jurusan (sejalan temuan T5) |

## 3. Tiga perubahan terbesar bagi mesin

1. Kartu tidak boleh hanya kekurangan. Peluang yang tumbuh, arah pembangunan, dan program pemerintah sama wajibnya (U1, U3, U7).
2. Penjelajah lokal punya tiga lapis, bukan dua: dugaan tanpa AI, pencarian oleh AI, dan prompt siap pakai untuk pengguna (U5). Lapis ketiga murah dan belum pernah dibangun.
3. Bekal dari Kenali Diri adalah masukan wajib, bukan pelengkap (U8, U14).

Belum diperiksa pemeriksa terpisah.

## 4. Putaran kedua (16.53 WIB): topik peran AI, pengguna, tujuan, dan sebagian keterampilan, kenali diri, privasi

Dibaca sesi ini: 145 pesan (peran AI, pengguna, tujuan) seluruhnya, dan 134 dari 180 pesan (keterampilan, kenali diri, privasi). Belum dibaca: 46 pesan sisanya di kelompok kedua, dan topik operasi manusia, bukti dan angka, copy, tampilan, arsitektur, cara kerja.

| # | Niat Raihan | Kutipan | Keadaan di rancangan | Tindak |
|---|---|---|---|---|
| U21 | Fungsi AI di web, ditambah prompt yang dibagikan untuk model lebih kuat (menguatkan U5) | [880] 3 Jun: "mungkin ada fungsi di web kita, tapi juga di-share promptnya untuk dideploy sendiri dengan LLM Model yang lebih tinggi" | Belum ada | S14 naik prioritas |
| U22 | Hasil buatan AI wajib bertanda | [441] 5 Mei: "Kalau tidak salah saya sudah minta untuk flag ketika ada hasil AI." | Sebagian (tanda pada dugaan dan temuan) | Tiap keluaran AI di S3 dan S4 membawa tanda "dibuat AI"; masuk gerbang |
| U23 | Peta tidak boleh usang, kompas tidak boleh menyesatkan | [779] 30 Mei: "JANGAN SAMPAI PETA-NYA TIDAK UPDATE. JANGAN SAMPAI KOMPASNYA MENYESATKAN." | Hanya tahun data pada kartu | Gerbang kesegaran: kartu melewati batas umur ditandai usang dan tidak tampil sebagai keadaan sekarang |
| U24 | Fitur versi pertama (chatbot karier, data provinsi) dirombak untuk arsitektur baru, bukan dibuang | [1060] 13 Jun: "Apa itu semua bisa di-revamp untuk arsitektur baru kita?" | Tidak ada; dua fungsi server lama saya catat sebagai "tampak tidak dipanggil" | Ajukan ke chief: fungsi lama itu calon wadah penjelajah lokal, sebelum membuat fungsi baru |
| U25 | Riset Gemini dan dokumen OECD yang sudah ada menjadi bahan rujukan AI | [1065] 13 Jun: "saya ada data dari puluhan Gemini deep researches, dan dokumen-dokumen OECD dst. yang relevan dan bisa menjadi acuan RAG/semisalnya" | Tidak ada | Inventaris bahan itu; yang lulus pemeriksaan bukti menjadi korpus |
| U26 | Bekal juga dari orang terdekat: pembuat formulir untuk dikirim ke orang tepercaya | [2162] 18 Agu: "ada form generator untuk mereka kirimkan ke orang-orang yang mereka percaya" | Tidak ada | Tambah ke S12 sebagai sumber bekal; lajur chief untuk pemasangan |
| U27 | Inventori bekal lewat klik, tanpa pengukuran dan tanpa isian per keterampilan | [879] 3 Jun: "Cukup muncul pertanyaan tersebut (yang sudah punya apa saja), lalu mereka klik-klik." | Sejalan | Tetap; mesin membaca hasil klik itu |
| U28 | Inti Sulu: memperkenalkan pada kenyataan; untuk siswa, mahasiswa, dan lebih | [2120] 30 Jul: "This \"onboarding to reality\" is the very essence of Sulu." | Tersirat | Kalimat arah; menguatkan fakta upah dan biaya hidup bersumber (S9) |
| U29 | Tidak memosisikan diri sebagai bimbingan karier | [836] 1 Jun: "Yakin kita posisikan diri sebagai bimbingan karier? Bagaimana itu pertanggungjawabannya? Mana prinsip no overclaimnya?" | Ada (gerbang I) | Tetap |
| U30 | Hasil tidak boleh generik seperti ramalan | [445] 24 Apr: "tidak terasa seperti ramalan populer atau zodiak yang ngawang sekali gitu lho." | Tidak ada gerbang | Gerbang kekhususan: keluaran S4 harus memuat unsur dari kartu wilayah dan bekal pengguna itu; keluaran yang sama untuk dua profil berbeda = gagal |
| U31 | Tidak semua disampaikan sebagai paragraf | [1246] 6 Jul: "tidak semua harus disampaikan AS A PARAGRAPH, kan?" | Sejalan (kartu, pilihan, daftar cek) | Tetap; teks kartu tiga kalimat adalah batas atas |
| U32 | Sah bukan hanya angkanya, juga relevansi dan atribusi | [847] 2 Jun: "Yg harus valid bukan hanya angka ya, tapi juga relevansi ke konteks kita, dan semua sisi lain seperti atribusi, dlsb." | Sebagian | Gerbang A ditambah: atribusi penerbit dan catatan relevansi populasi pada tiap kartu |
| U33 | Audit yang sudah ada dulu, lalu melampaui | [1910] 25 Jul: "Kan Sulu tidak dibangun sejak awal, harus tahu apa yang sudah bagus" | Sejalan (inventaris, garis dasar) | Tetap |
| U34 | Mengkurasi, bukan mencipta taksonomi | [1407] 8 Jul: "kita tak menciptakan taksonomi baru, tapi mengkurasi dan menerjemahkan." | **Dilanggar**: bank dugaan dan daftar topik kueri saya tulis sendiri | Ganti dengan kurasi dari sumber (pedoman kader posyandu, juknis program, klasifikasi resmi), tiap butir bersumber |
| U35 | Pertanyaan tidak boleh membuat pengguna berkhayal | [877] 3 Jun: "jangan menanyakan sesuatu yang justru membuat mereka halu" | Sejalan (dugaan = hal yang bisa dicek) | Tetap |
| U36 | Pembanding per fitur, bukan per platform | [1420] 9 Jul: "Kita juga harus tahu benchmark bukan per platform mungkin, tapi per fungsi/fitur Sulu." | Belum | Pindai karya terdahulu per fitur: penjelajah lokal, kartu kebutuhan, prompt siap pakai |
| U37 | Untuk umum, bukan hanya pesantren | [961] 8 Jun: "audiens kita bukan hanya anak pesantren lho, ini harus fleksibel untuk umum juga." | Sejalan (gerbang E) | Tetap |
| U38 | Bukan sekadar membuat nyaman | [1047] 13 Jun: "Kita juga tidak seperti psikologi populer yang bottomline-nya sekadar membuat orang feel good." | Sejalan (varian lugas) | Tetap |

## 5. Yang berubah akibat putaran kedua

1. Bank dugaan dan daftar topik kueri berstatus sementara sampai dikurasi dari sumber (U34). Keduanya tidak boleh sampai ke pengguna dalam bentuk sekarang.
2. Tiga gerbang baru: kesegaran (U23), kekhususan (U30), atribusi dan relevansi (U32).
3. Dua fungsi server lama bukan sisa, melainkan calon wadah (U24). Catatan saya sebelumnya yang menyebutnya "tampak tidak dipanggil" tetap benar sebagai fakta kode, tetapi maknanya berbeda.
