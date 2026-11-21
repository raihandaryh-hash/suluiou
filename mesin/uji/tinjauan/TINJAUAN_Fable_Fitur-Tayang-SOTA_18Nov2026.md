# TINJAUAN · Fitur Sulu yang tayang terhadap praktik terbaik (18 Nov 2026)

Peninjau: Fable, peninjau independen, bukan penulis kode maupun rancangan. Label: SINTESIS peninjau. Vonis di sini usul, bukan keputusan.
Objek: `/home/claude/suluiou-main` (`src/`, `supabase/functions/`), dibaca hari ini. Rujukan baris memakai bentuk `berkas:baris`.
Prinsip yang dipakai: P1 "enhance, bukan break". Vonis per fitur: PERTAHANKAN, PERKAYA (disebut persis apa), atau GANTI (hanya dengan bukti kuat). Tidak ada vonis GANTI dalam tinjauan ini.

## 0. Batas tinjauan

| Batas | Akibat |
|---|---|
| Hanya baca kode. Aplikasi tidak dijalankan di peramban | Jejak pengguna diturunkan dari rute dan komponen. Rasa pakai (jarak gulir, kecepatan, tampilan ponsel) belum diuji langsung. Raihan sendiri meminta state tayang dilihat lewat peramban (27 Jul) |
| Isi basis data tidak dibaca (`province_contexts`, `insightContentStore`) | Teks Insight bisa sudah ditimpa dari basis data. Temuan angka di §3.2 berlaku untuk berkas kode |
| Tidak ada data pemakaian nyata | Klaim "berat" atau "ringan" berdasar hitungan kata dan jumlah isian, bukan perilaku pengguna |
| Pembanding sebagian besar buatan AS dan Eropa | Tidak ada pembanding Indonesia yang dicari. TIDAK DICARI, bukan tidak ada |
| Sebagian sumber primer tidak terbuka | Ditandai `[teks primer tidak dibuka]` per baris di §2 |

## 1. Peta alur pengguna yang tayang

`/` (Hero, `src/components/landing/Hero.tsx`) → `/mukadimah` (3 langkah) → `/insight` (4 langkah, pilihan sudut pandang siswa, orang tua, guru BK, mahasiswa) → `/skill-map` (Peta Bekal) → masuk akun atau tamu (`RequireAuth.tsx:10`) → `/kenali-dirimu` → `/kenali-dirimu/skill` → `/jalan-bakti` (4 langkah) → `/sintesis` → `/rencana-aksi` → `/ringkasan` (Surat Perjalanan, cetak).

| Pintu AI | Fungsi tepi | Status tayang |
|---|---|---|
| "Nyalakan peran yang belum terlihat" | `broaden-roles` | Hidup |
| "Tenun jadi satu cerita" | `generate-sintesis` | Hidup |
| "Tanya Sulu" | `career-chat` | Hidup untuk dewasa. Terkunci untuk di bawah 18 (`career-chat/index.ts:56`) |
| Proyeksi 2030 | `generate-projection` | TIDAK tayang. Terkunci di server (`generate-projection/index.ts:97`) dan di klien (`flags.ts`, `ASESMEN_TERBUKA = false`) |
| Narasi lapis 1 | `generate-layer1` | TIDAK tayang (`generate-layer1/index.ts:58`) |
| `generate-reflection` | | Tidak dipanggil dari `src/` |

Yang diminta ditinjau tetapi tidak tayang: Proposal Diri (hanya disebut di `flags.ts`, rencana Tonggak 2), `macroContext.ts` (dapur `generate-projection`, ikut terkunci), `PetaMedan.tsx` (100 baris, tidak diimpor halaman mana pun), `ValuesCardSort.tsx` (151 baris, tidak diimpor).

Fakta kunci yang memengaruhi semua vonis: status usia ditentukan gagal tertutup. Tamu, token anonim, dan akun tanpa `app_metadata.dewasa` dihitung di bawah 18 (`_shared/usia.ts:8-10`). Untuk kelompok itu teks bebas tidak dikirim ke model (`broaden-roles/index.ts:56`, `generate-sintesis/index.ts:68`). Artinya pengguna inti Sulu (siswa SMA/MA) menerima versi AI yang paling tidak personal. Aturan privasinya sah (B6). Akibat produknya belum ditutup.

## 2. Pembanding dan bukti (retrieval, ber-URL)

| # | Pembanding | Yang ditemukan | Sumber |
|---|---|---|---|
| B1 | 80,000 Hours, ulasan karier | Tiap ulasan memuat: ringkasan, status tinjauan ("Based on a medium-depth investigation"), mengapa berdampak, apa isi pekerjaannya, contoh orang yang menempuhnya, "How to assess your fit?", "How to enter", organisasi rujukan, bacaan lanjut | https://80000hours.org/career-reviews/forecasting/ (dibuka, satu ulasan contoh). Halaman indeks ulasan tidak dibuka |
| B2 | 80,000 Hours, perencanaan karier | Buku kerja 8 bagian: definisi karier bermakna, masalah paling mendesak, 3–6 jalur jangka panjang, fokus strategi, langkah berikut, Rencana A, B, Z, selidiki ketidakpastian dengan cara termurah dulu, titik tinjau ulang, aksi bertanggal | https://80000hours.org/career-planning/career-plan-template/ |
| B3 | Google Career Dreamer (19 Feb 2025) | Masukan: latar, pengalaman, pendidikan, keterampilan, minat. Keluaran: Career Identity Statement, saran karier, lowongan terdekat. Saran berdasar data pasar kerja Lightcast dan BLS AS. Batas negara tidak disebut artikel | https://blog.google/company-news/outreach-and-initiatives/grow-with-google/a-new-experiment-to-help-people-explore-more-career-possibilities/ |
| B4 | O*NET Interest Profiler, My Next Move | Jawaban lima tingkat suka atau tidak suka atas kegiatan kerja, lima Job Zone tingkat persiapan, hasil berupa daftar karier yang cocok dengan minat dan tingkat persiapan | https://mynextmove.org/explore/ip-help . Jumlah butir tidak tertulis di halaman itu |
| B5 | ESCO v1.2 | 3.039 okupasi, 13.939 konsep keterampilan dan pengetahuan, 28 bahasa termasuk Arab | https://esco.ec.europa.eu/system/files/2024-05/V1.2%20Launch%20-%20ESCO%20SEC%20combined%20-%20final%20clean.pdf |
| B6 | CareerExplorer (Sokanu) | Lebih dari 150 sifat ditanyakan, dicocokkan ke lebih dari 700 karier dengan algoritme tertutup, data O*NET dan BLS | https://www.careerexplorer.com/faqs/careerexplorer-career-test/how-does-careerexplorer-career-test-work |
| B7 | Roadtrip Nation | Menjelajah "leaders" per minat (27 bidang, mis. Pendidikan 399 tokoh), Roadmap Tool menghubungkan wawancara, karier, jurusan | https://www.roadtripnation.com/interests . Cara kerja Roadmap tidak terjelaskan di halaman itu |
| B8 | OECD, indikator kesiapan karier remaja | 11 dari 14 indikator terkonfirmasi di 12 set data, 10 negara, usia 14–16 diikuti 10–15 tahun. Menjelajah: percakapan karier, bertemu orang bekerja, kunjungan kerja atau job shadowing. Mengalami: kerja paruh waktu, kerelawanan. Memikirkan: kepastian, ambisi, keselarasan. Sifatnya asosiasi, bukan sebab | https://oecdedutoday.com/preparing-youth-for-work-what-works-career-guidance/ (2021) |
| B9 | OECD WP 258 (Covacevich, Mann, Santos, Champaud 2021) | Contoh: Kanada, percakapan dengan guru pada usia 15 berasosiasi dengan 3 poin persen lebih kecil peluang NEET pada usia 25. AS, job shadowing usia 13–14 berasosiasi dengan upah sekitar 10% lebih tinggi usia 23–24. Jerman dan Inggris nihil. Model observasional | https://one.oecd.org/document/EDU/WKP%282021%2915/en/pdf (terbaca sebagian, sampai bab 3) |
| B10 | OECD "Dream Jobs?" (2020, PISA 2018) | Sekitar 500.000 remaja, 41 negara. 47% laki-laki dan 53% perempuan berharap bekerja di salah satu dari 10 pekerjaan | https://www.educationandemployers.org/world-economic-forum-local-careers/ (sekunder) `[laporan primer tidak dibuka]` |
| B11 | OECD 2025, State of Global Teenage Career Preparation (PISA 2022) | Sekitar 700.000 remaja. 39% siswa OECD belum tahu pekerjaan yang diharapkan. 58% yang punya tujuan mengharap pekerjaan profesional. Blog OECD tidak menyebut "sepuluh pekerjaan" | https://oecdedutoday.com/young-peoples-career-expectations-arent-meeting-labour-market-realities-but-we-can-change-this/ `[laporan penuh tidak dibuka]` |
| B12 | Career adaptability (Savickas & Porfeli 2012) | Empat dimensi: concern, control, curiosity, confidence. 24 butir, 13 negara, alfa total 0,92 | https://www.marksavickas.com/files/1_Savickas_bio/Interviews/Savickas%20Publications/Journal%20Articles/CAAS_International.pdf |
| B13 | Intervensi karier siswa SMA (Wang, Li & Wang 2024, tinjauan sistematis 25 studi) | Umumnya menaikkan adaptabilitas dan efikasi keputusan karier. Hanya 5 dari 25 studi punya tindak lanjut, dua di antaranya menemukan hasil tidak bertahan. Dosis lazim 8 sesi sekitar 45 menit. Mengutip unsur kritis Whiston dkk. 2017 (dukungan konselor, klarifikasi nilai, psikoedukasi) dan Ryan 1999 (latihan tertulis, umpan balik pribadi, informasi dunia kerja, teladan, dukungan) | https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1461503/full . Whiston dkk. 2017 `[teks primer tidak dibuka]` |
| B14 | Niat implementasi (Gollwitzer & Sheeran 2006) | 94 uji independen, d = 0,65 pada pencapaian tujuan | https://kops.uni-konstanz.de/entities/publication/2e749bfb-8533-437c-8203-7e788c910c5f |
| B15 | Future Authoring (Morisano dkk. 2010) | RCT, 85 mahasiswa. IPK semester berikut 2,91 vs 2,46. Lolos standar WWC tanpa catatan | https://ies.ed.gov/ncee/WWC/Study/81535 . Populasi mahasiswa, bukan remaja 16–18 |
| B16 | Designing Your Life | Kuasi-eksperimen Kroasia, 19 vs 20: hanya afek negatif karier yang turun. Efikasi dan ketidakpastian tidak berubah | https://europeanproceedings.com/article/10.15405/epsbs.2019.11.19 . Sejalan dengan `mesin/uji/RISET_TLE-Odyssey-Peterson-Pentahelix_17Nov2026.md` §2. RCT Odyssey Plan: TIDAK DITEMUKAN |
| B17 | Wawancara informasional | Hanya studi pendahuluan (ASEE 2025, mahasiswa teknik biomedis, tanpa pembanding, ukuran sampel tidak dilaporkan). Uji terkendali pada remaja: TIDAK DITEMUKAN | https://peer.asee.org/board-123-work-in-progress-the-impact-of-informational-interviews-on-career-choices-and-professional-growth-for-undergraduate-biomedical-engineering-students |

Bacaan atas bukti: unsur yang paling berpijak adalah (a) kontak dengan orang dan tempat kerja (B8, B9, asosiasi jangka panjang), (b) latihan tertulis, umpan balik pribadi, informasi dunia kerja, teladan, dukungan (B13), (c) rencana "bila X maka Y" (B14). Yang lemah buktinya: lembar Odyssey (B16) dan wawancara informasional sebagai teknik tersendiri (B17). Tidak ada pembanding yang menggabungkan kebutuhan wilayah, bingkai bakti, dan lapis keislaman. Di titik itu Sulu tidak punya tolok ukur terbitan untuk dikejar.

## 3. Tinjauan per fitur

### 3.1 Beranda dan Mukadimah

| Butir | Isi |
|---|---|
| Apa | Hero satu layar dengan tiga paragraf dan dalil dalam dialog (`mukadimahContent.ts`). Mukadimah 3 langkah Undangan, Realita, Jalan (`Mukadimah.tsx:177-265`, `mukadimahBabakContent.ts`), sekitar 825 kata, grafik NEET ASEAN |
| Jejak | Buka `/` → baca hook "Pernah merasa bingung harus melangkah ke mana?" → "Mari kita mulai" → tiga langkah → "Siap? Yuk kita mulai dari step pertama" → `/insight` |
| Kekuatan | Menolak vonis sejak kalimat kedua. Tiga langkah memetakan seluruh perjalanan (dunia, diri, bakti). Suara kakak, dalil bersumber. Sejalan dengan dimensi concern pada B12 |
| Kelemahan vs pembanding | Pengguna tidak diberi tahu apa yang ia bawa pulang dan berapa lama. B2 dan B3 menyebut keluaran sejak awal (rencana, pernyataan identitas). Pembuka memakai angka besar (199 juta, 21,4%) sebelum menyapa keadaan pengguna |
| Rasa pakai remaja | Hangat. Campur kode "survive", "FOMO", "step" wajar untuk usia ini. Langkah 2 padat angka |
| Vonis | PERTAHANKAN. PERKAYA kecil: satu baris di Hero berisi hasil akhir ("kamu pulang membawa Surat Perjalanan dan satu langkah 30 hari") dan perkiraan waktu per tahap |

### 3.2 Insight (Kenali Dunia) dan Compass

| Butir | Isi |
|---|---|
| Apa | `Insight.tsx` 1.294 baris, 4 langkah (`:896`), isi `insightContent.ts` sekitar 5.600 kata. Pengalih sudut pandang siswa, orang tua, guru BK (`:69-102`). Kartu statistik bisa dibagikan (`:499-524`). Tujuh bidang peluang (`insightContent.ts:352-358`). `/compass`: empat perspektif narasumber bertanggal 3–6 Juni 2026 dan formulir daftar tunggu asesmen (`compassContent.ts`) |
| Jejak | Pilih sudut pandang → potret Indonesia → dunia kerja → peluang → lapis dunia → "Kenali Dirimu" (`Insight.tsx:1269`) |
| Kekuatan | Satu-satunya halaman yang melayani orang tua dan guru BK dengan isi berbeda. Sumber tertera. Tombol "berguna atau tidak" per bagian. Ini "informasi dunia kerja" pada B13 |
| Kelemahan vs pembanding | (1) Angka yang repo sendiri nyatakan salah label masih tayang di berkas: "Aset perbankan syariah tumbuh 33,92% dalam satu tahun" (`insightContent.ts:353`), padahal `macroContext.ts:24` mencatat koreksi 21 Jul menjadi 9,88% dan menyebut 33,92% sebagai pangsa aset terhadap PDB. Ini melanggar P7. (2) Volume: pembanding B1 dan B3 menaruh data di balik pilihan pengguna, bukan sebelum pilihan. Kekhawatiran "doom-dump" Raihan (20 Jun) masih berlaku untuk dua langkah pertama. (3) Tujuh bidang peluang tidak tersambung ke tujuh medan Jalan Bakti. (4) Compass masih menawarkan "Asesmen Sulu, Segera Hadir" dengan tanggal acara yang sudah lewat |
| Rasa pakai remaja | Kaya, mengesankan, berat. Remaja bisa "merasa wah" tanpa tahu harus berbuat apa (keluhan 10 Jun) |
| Vonis | PERKAYA. Persis: (a) betulkan butir 02 ke angka `macroContext.ts:24` dan sapu angka lain dengan cara yang sama, (b) tiap bidang peluang diberi tautan "bawa ke Jalan Bakti" ke medan padanannya, (c) tiap langkah ditutup satu pertanyaan atau satu catatan, bukan hanya tombol Lanjut, (d) Compass: hapus tanggal acara, ganti ajakan daftar tunggu dengan tautan ke Kenali Dirimu |

### 3.3 Peta Bekal (skill-map)

| Butir | Isi |
|---|---|
| Apa | 25 simpul di 4 lapis (`skillMapContent.ts`), tampilan peta dan daftar, saringan "tumbuh", "aman dari AI", "lapis 0" (`SkillMap.tsx:439`). Tiap simpul: deskripsi, catatan AI, sumber, "Cara melatihnya" (`:160`), "Coba minggu ini" (`:161`), "Jalur adaptasinya" untuk sektor rentan (`:193`). Jembatan istilah populer ke simpul (`ISTILAH_BRIDGE`). Narasi pembuka bersumber Anthropic Economic Index dan Stanford (`skillMapNarasiContent.ts`) |
| Jejak | Dari Insight → baca narasi AI → peta → ketuk simpul → baca cara melatih dan tugas pekan ini |
| Kekuatan | Fitur paling matang. Jujur soal batas bukti ("Belum ada latihan yang teruji", simpul kesadaran diri). Asal tiap garis hubung diklasifikasi (`CONNECTION_BASIS`), satu klaim kausal sudah dibongkar karena sitasi keliru (`skillMapContent.ts:5-12`). "Coba minggu ini" menjawab keluhan 3 Jun "cara mempelajari skillnya". Tidak ada pembanding di §2 yang memberi cara melatih berbukti per keterampilan. O*NET dan ESCO hanya mendaftar |
| Kelemahan vs pembanding | (1) Peta tidak tahu siapa penggunanya: tidak menyala menurut medan, peran, atau kompetensi yang dipilih. Raihan 14 Jun: "skill-map seperti hidup terpisah". B3 dan B6 selalu berangkat dari profil. (2) "Coba minggu ini" tidak bisa dikirim ke Rencana Aksi. (3) Label "Aman dari AI" berisiko terbaca sebagai jaminan. Sumbernya survei pemberi kerja dan analisis paparan, bukan ramalan |
| Rasa pakai remaja | Menarik untuk dijelajah. 25 simpul dengan teks panjang butuh penuntun "mulai dari mana" |
| Vonis | PERTAHANKAN isi dan struktur. PERKAYA: (a) saat datang dari Jalan Bakti, 3–5 simpul yang dituntut peran pilihan menyala (sudah S5 di rancangan v3), (b) tombol "jadikan langkah 30 hari" pada "Coba minggu ini", (c) label "Aman dari AI" diberi keterangan tahun dan sifat perkiraan |

### 3.4 Kenali Dirimu (Kenali Yang Sudah Ada)

| Butir | Isi |
|---|---|
| Apa | Jurnal tafakur: 4 domain × 3 pertanyaan dengan kalimat pembuka siap pakai, catatan pengalaman, cermin dari orang lain (kisah Zaid bin Tsābit, tombol bagikan ke orang tua atau guru, `KenaliDirimu.tsx:157,277`), arah tumbuh (`kenaliDirimuContent.ts`). 17 pertanyaan tertulis ditambah beberapa isian bebas |
| Jejak | Baca QS Ibrāhīm 7 → isi domain satu per satu → catat pengalaman → minta pandangan orang dekat → tulis yang ingin dikuatkan → Simpan → "Lanjut: Kenali Kompetensimu" |
| Kekuatan | Latihan tertulis adalah unsur kritis paling konsisten (B13). Domain 4 menulis masa depan yang diinginkan dan yang dihindari, serupa inti Future Authoring (B15). Cermin dari orang lain adalah umpan balik pribadi. Bingkai syukur menjaga dari rasa kurang (niat 7 Jun) |
| Kelemahan vs pembanding | (1) Tidak ada penggalian minat. Pembuka Jalan Bakti berjanji "minat, kemampuan, dan nilai kamu gali di tahap Kenali Dirimu" (`jalanBaktiOpeningContent.ts`, `bombAfter`), sedangkan sudut minat di Sintesis kosong (`Sintesis.tsx:202-203`). B4 dan B6 berangkat dari minat. (2) Beban tulis: sekitar 20 isian di satu halaman gulir, tanpa jalur ringkas. B15 memecah tulisan dalam sesi berwaktu. (3) Untuk di bawah 18 tulisan ini tidak sampai ke AI, sehingga hasil kerja terberat pengguna tidak kembali kepadanya sebagai cermin. (4) Umpan balik orang lain bergantung pada pengguna mengirim tangkapan lewat WA. Formulir orang terdekat (niat 18 Agu) belum ada |
| Rasa pakai remaja | Pertanyaan bagus dan aman. Jumlahnya membuat banyak siswa berhenti atau mengisi asal. Kata "Latent" di judul domain 2 asing |
| Vonis | PERTAHANKAN pertanyaan dan urutannya. PERKAYA: (a) jalur ringkas: satu pertanyaan wajib per domain, sisanya "tambah bila mau", dengan penanda kemajuan yang sudah ada, (b) kartu pilih "kegiatan yang membuatmu betah" sebagai pengisi sudut minat, tanpa skor dan tanpa label tipe. Karena menyentuh wilayah asesmen, butir ini perlu melewati tinjauan Mbak Satwika yang sama dengan sakelar A5, (c) ganti "Latent" dengan "yang belum tampak" |

### 3.5 Kenali Kompetensimu

| Butir | Isi |
|---|---|
| Apa | Tujuh kompetensi dengan tiga tingkat penilaian diri (`KenaliDirimuSkill.tsx:27-69`), pilih 1–3 untuk dikembangkan (`:278`), alasan, satu langkah 30 hari (`:324`). Pembuka al-Qawiyy dan al-Amīn (QS al-Qashash 26) |
| Jejak | Baca pembuka → tandai posisi di tujuh kompetensi → pilih 1–3 → tulis alasan dan langkah → Simpan → Jalan Bakti |
| Kekuatan | Ringan, tiga tingkat tanpa angka, "bukan ujian". Pilihan 1–3 memaksa prioritas |
| Kelemahan vs pembanding | (1) Tujuh kompetensi ini tidak bersumber di halaman. Daftarnya mirip delapan kompetensi kesiapan karier NACE `[TIDAK DIVERIFIKASI, tidak dicari]`. Halaman lain Sulu bersumber per klaim. (2) Dua taksonomi hidup berdampingan tanpa jembatan: 7 kompetensi di sini dan 25 simpul Peta Bekal. Pilihan di sini tidak membuka "Cara melatihnya" yang sudah ada di simpul padanan. (3) Yang dikirim ke penghasil peran adalah kode internal (`berpikir_kritis`), bukan nama (`buildSuluContext.ts:60`). (4) Langkah 30 hari di sini, di Jalan Bakti, dan di Rencana Aksi adalah tiga isian terpisah |
| Rasa pakai remaja | Mudah. Definisi kompetensi berbahasa buku ("Bertukar informasi, gagasan, dan sudut pandang secara jelas dan efektif") |
| Vonis | PERKAYA. Persis: (a) cantumkan sumber daftar, (b) tiap kompetensi yang dipilih menampilkan "Cara melatihnya" dan "Coba minggu ini" dari simpul Peta Bekal padanannya (pemetaan 7 ke 25 ditulis sekali, ditinjau Chief), (c) kirim nama, bukan kode, (d) langkah 30 hari ditulis sekali dan dibawa ke Rencana Aksi |

### 3.6 Jalan Bakti langkah 1 (Dengar)

| Butir | Isi |
|---|---|
| Apa | Pembuka temuan kecocokan diri dan lingkungan, doa Nabi Sulaimān, tiga gerakan (`JalanBaktiOpening`), murajaah, narasi bakti, QS Hūd 61, sejarah dan urgensi SDG, lima cip SDG (`JalanBakti.tsx:293-393`, `jalanBaktiContent.ts:8-78`) |
| Jejak | Buka `/jalan-bakti` → baca sekitar 900 kata → tandai SDG yang menggugah → Lanjut |
| Kekuatan | Kerangka mengerucut dunia ke Indonesia sesuai P6. Catatan "SDG hanyalah satu lensa" (`:67`) menjaga dari kerangka tunggal. Klaim riset ditahan ("efek nyata namun moderat" di komentar kode). Ikigai sengaja tidak dipakai |
| Kelemahan vs pembanding | (1) Interaksi pertama baru muncul sesudah sekitar 900 kata. (2) Hanya 5 dari 17 SDG yang bisa dipilih (`:69-75`), sedangkan teks menyebut 17. (3) Pilihan SDG tidak mengubah apa pun di langkah berikut di halaman ini. B2 memakai peringkat masalah untuk menurunkan jalur. (4) Kalimat "santri dan anak madrasah lebih sering diminta mengikuti agenda dunia" (`:52`) mengecualikan pengguna umum, padahal sasaran Sulu "siapa pun" (N8) |
| Rasa pakai remaja | Indah, panjang. Tiga blok dalil dan tiga blok sejarah sebelum satu ketukan |
| Vonis | PERKAYA. Persis: (a) sejarah dan urgensi SDG masuk lipatan seperti "pasca 2030", sehingga cip muncul lebih awal, (b) pilihan SDG menandai medan terkait di langkah 2 (pemetaan rumpun ke klaster sudah ada di `petaMedanSection`, `:188-193`, tinggal dipakai), (c) kalimat `:52` dibuat inklusif |

### 3.7 Jalan Bakti langkah 2: daerah, tujuh medan, sub-tantangan, lensa kepedulian

| Butir | Isi |
|---|---|
| Apa | "Gambaran arah daerahmu" dari `province_contexts` (`JalanBakti.tsx:399-474`), Kartu kebutuhan daerah BPS per kabupaten atau kota dengan lima pertanyaan lapangan (`KartuDaerah.tsx:38-202`, 36 dari 38 provinsi berberkas, dua jenis: kemiskinan dan pengangguran terbuka), tujuh medan pilih satu dengan 3–4 sub-tantangan (`:485-543`, `jalanBaktiContent.ts:94-178`), lensa 8 ashnāf dan PPKS (`:548-605`) |
| Jejak | Lihat gambaran provinsi → pilih kabupaten → baca kartu dan arti angkanya → lima pertanyaan lapangan → pilih satu medan → tandai sub-tantangan → tandai siapa yang ingin ditolong |
| Kekuatan | Kartu daerah adalah bagian paling kuat terhadap pembanding: angka resmi, bertahun, tautan sumber, arti angka, tanda hati-hati, lalu ajakan turun ke lapangan (P7, P9). Tidak ada pembanding di §2 yang turun ke kabupaten. Sub-tantangan ditulis sebagai wajah manusia ("Guru yang kelelahan"), bukan nama profesi, sehingga tidak mengunci. Lensa ashnāf memberi kerangka Indonesia dan Islam sendiri (N6). "Ini bukan keputusan seumur hidup" (`:81`) |
| Kelemahan vs pembanding | (1) Lapis daerah hanya tampil bila provinsi terbaca dari akun (`useProvince.ts:8-20`). Menurut kode, tamu tidak punya provinsi sehingga blok gambaran daerah dan kartu tidak tampil sama sekali `[perlu dicek di peramban]`. (2) Dua jenis kartu tidak terpetakan ke tujuh medan. Pengguna yang memilih medan lingkungan tidak mendapat kartu yang relevan. (3) Hanya satu medan boleh dipilih (`selectMedan`, `:229-235`), sedangkan B2 menyuruh memegang 3–6 jalur dan bukti eksplorasi mendukung keluasan. (4) Tidak ada isian "tantangan yang kulihat sendiri". Lima pertanyaan lapangan meminta pengguna mencatat, tetapi tidak ada tempat mencatat di halaman dan jawabannya tidak masuk alur. Ini titik masuk alami jalur cipta yang belum dipakai. (5) Hanya 2 dari 23 sub-tantangan yang punya keterangan bersumber (`k2b`, `k6d`). (6) Sub-tantangan `k1b` "Remaja yang memendam masalahnya sendirian" bisa mengenai pengguna sendiri. Rujukan distress hanya menyala dari teks bebas |
| Rasa pakai remaja | Bagian kartu dan medan enak dipakai. Lensa ashnāf menambah satu lapis pilihan lagi sebelum sampai ke peran, total empat jenis pilihan dalam satu layar gulir |
| Vonis | PERTAHANKAN tujuh medan, sub-tantangan, lensa, dan kartu. PERKAYA: (a) pemilih provinsi dan kabupaten untuk tamu, disimpan di perangkat, (b) satu medan utama ditambah satu medan cadangan, (c) isian pendek "yang kulihat sendiri di sekitarku" yang ikut ke Panen, Sintesis, dan Surat, tersimpan di perangkat untuk di bawah 18, (d) keterangan bersumber untuk sub-tantangan lain dari Evidence DB berstatus Live, (e) tautan sunyi ke `/bila-tidak-baik-baik-saja` pada `k1b` |

### 3.8 "Nyalakan peran yang belum terlihat"

| Butir | Isi |
|---|---|
| Apa | Sesudah medan dipilih, tiga paragraf "tampar sepuluh pekerjaan" (`jalanBaktiContent.ts:88-90`), lalu tombol (`BroadenRoles.tsx:133`). Fungsi tepi meminta model 6 peran nyata, minimal 3 "jarang terlihat", dengan `whatTheyDo`, `demandsMost`, `whyUnexpected`, `pathwayHint` (`broaden-roles/index.ts:69-85`, suhu 0,4). Pengguna memilih paling banyak 2 (`BroadenRoles.tsx:26`) |
| Jejak | Pilih medan → baca tampar → ketuk "Nyalakan" → enam kartu muncul satu per satu → buka "Lihat jalur ke sana" → "Telusuri ini" pada 1–2 peran → Lanjut |
| Kekuatan | Menjawab temuan OECD tentang aspirasi yang menumpuk (B10). Pagar anti-vonis dan larangan janji ada di prompt (aturan 5–7). Lapis distress berlapis sebelum dan sesudah model. Urutan muncul satu per satu memberi rasa "menyala". Catatan "pilihanmu ikut membentuk" (`:169-175`) |
| Kelemahan vs pembanding | (1) Tidak berpijak data. Daftar peran murni ingatan model: tanpa kode KBJI, tanpa sumber, tanpa pemeriksaan keluaran (`index.ts:158` mengembalikan JSON apa adanya). B3 berpijak Lightcast dan BLS, B4 dan B6 pada O*NET. Risiko peran karangan atau peran berhonor mikro (keluhan Raihan 15 Nov) tidak dicegah mekanis. (2) Tidak ada kedalaman per peran. "Telusuri ini" hanya menandai. B1 memberi isi pekerjaan, contoh orang, cara menilai kecocokan, cara masuk, dan status kedalaman riset. (3) Personalisasi mati untuk pengguna inti: di bawah 18 `skills` dan `values` dikosongkan (`index.ts:56`), sehingga aturan 2 prompt ("kaitkan dengan bekalnya") tidak pernah jalan, padahal paragraf tampar ketiga menjanjikan "peran mana yang paling pas dengan bekalmu". (4) Untuk dewasa pun sinyalnya lemah: `values` berisi tiga jawaban pertama fase 2a (`buildSuluContext.ts:23-33`), yang menurut urutan halaman adalah jawaban domain iman (ayat penenang), dan `skills` berisi kode kompetensi. (5) Tidak ada jalur cipta. Tidak ada kartu "peran yang belum bernama" atau isian "peran versiku". Pencarian kata di `src/` dan `supabase/functions/` nihil. Ini celah terbesar terhadap niat 7–8 Jul. Daftar enam peran tanpa pintu cipta berfungsi sebagai menu. (6) Tidak tersimpan dan tidak stabil: kartu hilang saat muat ulang, "Nyalakan" ulang mengosongkan pilihan (`BroadenRoles.tsx:96-97`), hasil bisa berbeda tiap ketukan. (7) Aturan 5 masih melarang angka gaji, bertentangan dengan P8. (8) Klaim tampar perlu dicocokkan: komentar kode menyebut PISA 2022, sekitar 690 ribu remaja, 81 negara (`:84`). Angka "hampir separuh pada sepuluh pekerjaan" yang berhasil saya temukan berasal dari laporan 2020 atas PISA 2018 (B10). Blog OECD 2025 tidak menyebut sepuluh pekerjaan (B11). Contoh "polisi, pegawai negeri" tidak saya temukan di sumber |
| Rasa pakai remaja | Momen paling menyenangkan di seluruh alur. Sesudah memilih, tidak terjadi apa-apa selain tanda centang, sehingga rasa ingin tahu yang baru menyala tidak diberi makan |
| Vonis | PERKAYA secara substansial. Wadah, nama, urutan muncul, dan pagar anti-vonis tetap. Persis: (a) bank peran terkurasi per medan dan sub-tantangan, berkode KBJI, bersumber, model hanya memilih dan menjelaskan dari bank (sejalan S4, L12, L13 rancangan v3), (b) lembar peran ringkas ala B1: apa yang dikerjakan, cocok bila, cara masuk dari SMA/MA, yang belum pasti, upah resmi bertahun bila ada (P8), tanda kedalaman kurasi, (c) kartu ketujuh tetap: "Belum ada perannya? Rumuskan sendiri", berisi tiga isian pendek (siapa yang kutolong, masalahnya, yang kukerjakan), (d) masukan terstruktur hasil klik (kompetensi pilihan, kegiatan yang disukai, kelompok yang ingin ditolong) dipakai untuk semua usia, sehingga di bawah 18 tetap mendapat kecocokan tanpa teks bebas, (e) hasil disimpan di perangkat, (f) ganti aturan 5 sesuai P8, (g) verifikasi klaim tampar ke laporan OECD primer |

### 3.9 Empat langkah: Temui orangnya, Selami bidangnya, Bangun bekalnya, Cebur sebentar

| Butir | Isi |
|---|---|
| Apa | Enam paragraf pengantar, empat kartu cara dengan varian "suka menyapa" dan "suka menyelami sendiri" (`jalanBaktiContent.ts:271-304`, `DesainLangkah.tsx:212-291`). Temui: pesan pembuka siap salin (`:306`) dan formulir "minta dijembatani" ke narasumber lewat admin (`DesainLangkah.tsx:72-166`). Selami: tiga kata kunci dan satu prompt AI siap salin (`:308-314`). Pilih paling banyak dua, tulis kapan dan di mana (`:293-304`). Langkah 4: Panen Kecil (`JalanBakti.tsx:683-729`) |
| Jejak | Baca pengantar → baca empat kartu → "Jadikan langkahku" → sunting kalimat langkah dengan hari, jam, tempat → Lanjut → lihat panen → Simpan → Sintesis |
| Kekuatan | Paling sejajar dengan bukti terkuat. Empat cara ini memetakan indikator OECD: percakapan dan bertemu orang bekerja (Temui), informasi (Selami), kerelawanan dan kunjungan (Cebur) (B8, B9). Permintaan kapan dan di mana adalah niat implementasi (B14). Batas dua langkah mencegah daftar niat. Varian menurut pembawaan menurunkan ambang bagi pemalu. Jembatan Manusia memberi pintu ke manusia (P11) |
| Kelemahan vs pembanding | (1) Hanya peran pertama yang dipakai (`JalanBakti.tsx:665`, `d.roles[0]`). Peran kedua hilang. (2) Pesan pembuka hanya satu pertanyaan ("bagaimana Kakak memulainya"). Tidak ada daftar pertanyaan untuk percakapannya dan tidak ada tempat mencatat jawabannya. Roadtrip Nation (B7) membangun seluruh produknya di sekitar pertanyaan kepada orang yang sudah menempuh. (3) Keselamatan: remaja diajak menghubungi orang asing lewat media sosial tanpa pagar (ajak orang dewasa, jangan bertemu sendirian, jangan beri data pribadi). Tinjauan Fable 14 Nov §1.1 sudah menandai hal serupa di templat mesin. (4) "Cebur" dan "Bangun" tidak memberi satu pun pintu nyata (tidak ada direktori kegiatan atau kursus). Pengguna 3T paling dirugikan. (5) Jembatan hanya untuk akun berizin (`DesainLangkah.tsx:89,104`). Tamu melihat kalimat "Masuk dengan Google". (6) Prompt AI siap salin membawa remaja ke model luar tanpa lapis distress. Rancangan v3 R2 sudah menandai risiko ini untuk S14. (7) Tidak ada kunjungan balik: tidak ada pertanyaan "sudah kulakukan? apa yang kutemukan?". B2 mewajibkan titik tinjau. B13 menunjukkan hasil intervensi memudar tanpa tindak lanjut. (8) Enam paragraf pengantar (sekitar 230 kata) sebelum kartu pertama |
| Rasa pakai remaja | Jelas dan bisa dikerjakan. Kalimat langkah bawaan dengan kurung siku "[isi hari & jamnya]" membantu. Pengantar terlalu panjang untuk bagian yang tujuannya bergerak |
| Vonis | PERTAHANKAN empat payung, batas dua, dan varian pembawaan. PERKAYA: (a) lima pertanyaan percakapan siap salin dan tiga baris catatan hasil, (b) tiga kalimat pagar keselamatan untuk di bawah 18 pada kartu Temui, (c) pemilih peran bila dua peran ditandai, (d) kartu "sudah kulakukan" saat pengguna kembali, dengan satu pertanyaan "apa yang berubah dari dugaanmu", (e) pengantar dipangkas menjadi dua paragraf, sisanya lipatan, (f) keputusan R2 berlaku juga untuk prompt salin yang sudah tayang |

### 3.10 Sintesis dan Tenunan

| Butir | Isi |
|---|---|
| Apa | Empat sudut titik temu: minat, kemampuan, nilai, jalan bakti (`sintesisContent.ts`), peran dan langkah, Tenunan AI 2–3 paragraf dari kata pengguna sendiri (`generate-sintesis/index.ts:87-`), satu refleksi lima tahun, penutup farḍu ʿain dan farḍu kifāyah |
| Jejak | Lihat empat sudut → ketuk "Tenun jadi satu cerita" → baca cermin → tulis refleksi → Rencana Aksi |
| Kekuatan | Prompt Tenunan adalah yang terbaik di repo: hanya memakai data pengguna, melarang kesimpulan profesi, bahasa sementara, jujur atas bagian kosong, menolak isian asal ketik (aturan 1–11). Catatan cermin mengundang koreksi pengguna. Ini bentuk umpan balik pribadi (B13) dan setara fungsi Career Identity Statement (B3) tanpa nada menjual diri |
| Kelemahan vs pembanding | (1) Sudut minat selalu kosong (`Sintesis.tsx:202-203`). Titik temu empat sudut tampil dengan tiga sudut. (2) Untuk di bawah 18, `fondasi` dan `langkah` dikosongkan (`index.ts:68`), sehingga janji "memakai kata-katamu sendiri" tidak bisa ditepati bagi pengguna inti. Tenunan mereka hanya dari label pilihan. (3) Tidak ada ruang ketidakpastian. B2 meminta pengguna menulis 3–5 hal yang belum ia ketahui dan cara termurah mengeceknya. Sulu berhenti di cermin |
| Rasa pakai remaja | Hangat dan singkat. Bagi siswa, hasil tenun bisa terasa umum karena bahannya hanya cip |
| Vonis | PERTAHANKAN prompt dan pagar. PERKAYA: (a) isi sudut minat dari kartu pilih §3.4b, (b) untuk di bawah 18, susun tenunan di perangkat dari kata pengguna dengan templat tanpa model, atau tampilkan kutipan jawaban mereka berdampingan dengan tenunan dari pilihan klik, (c) tambah satu isian "yang belum kuketahui dan ingin kucek", diteruskan ke Rencana Aksi |

### 3.11 Rencana Aksi dan Surat Perjalanan (Ringkasan)

| Butir | Isi |
|---|---|
| Apa | Pembuka tawakal (QS al-Qashash 22), "Rumus Karier" al-Qawiyy al-Amīn, formulir 10 isian dalam tiga gerak Arah, Tujuan, Komitmen. Isian kunci wajib: "Ketika [waktu/situasi], saya akan [satu aksi kecil]" (`rencanaAksiContent.ts:65`), pendamping (`:66`), niat, doa. Ringkasan: Surat Perjalanan yang dirangkai dari jawaban sendiri tanpa model (`suratPerjalanan.ts`), empat kartu pintu jalur (KIP Kuliah, PBSB, IOU, jalur lain), cetak (`Ringkasan.tsx:525`). Tombol bagikan ke orang tua mati (`flags.ts`) |
| Jejak | Baca pembuka → isi tiga gerak → Simpan → Surat Perjalanan → Cetak |
| Kekuatan | Isian kunci berbentuk bila-maka adalah teknik dengan bukti terkuat di seluruh alur (B14). Pendamping bernama menjawab unsur dukungan (B13). Surat dirangkai tanpa model, sehingga aman untuk semua usia dan jujur ("bukan dari tes psikologi"). IOU ditaruh sebagai satu pintu di antara empat, berlabel penyelenggara |
| Kelemahan vs pembanding | (1) Tidak ada titik tinjau dan tidak ada alasan untuk kembali. Rencana 30 hari tanpa hari ke-30. (2) Langkah dari Jalan Bakti dan dari Kenali Kompetensi tidak diisikan otomatis ke isian kunci. Pengguna menulis hal yang sama untuk ketiga kalinya. (3) Tidak ada Rencana B. B2 meminta A, B, Z. Bagi keluarga yang menuntut segera berpenghasilan (N15, N17), rencana cadangan justru menenangkan. (4) Empat kartu jalur statis dan sama untuk semua, tidak mengikuti medan atau peran. Alamat `kip-kuliah.kemdikbud.go.id` dan biaya IOU perlu dicek kebaruannya `[TIDAK DIVERIFIKASI]`. (5) Keluaran hanya cetak. Orang tua dan guru BK, pemegang keputusan nyata di keluarga Indonesia (niat 6 Jul), belum punya pintu |
| Rasa pakai remaja | Khidmat dan menenangkan. Sepuluh isian sesudah puluhan isian sebelumnya melelahkan |
| Vonis | PERTAHANKAN bila-maka, pendamping, niat, doa, dan Surat tanpa model. PERKAYA: (a) isian kunci terisi awal dari langkah Jalan Bakti, (b) satu isian "bila ini tidak jalan, aku akan", (c) kartu tinjau hari ke-30 di perangkat, tampil saat pengguna membuka Sulu lagi, (d) kartu jalur mengikuti medan dan tiap alamat diberi tanggal cek, (e) Proposal Diri menggantikan tombol bagikan sesuai rencana Tonggak 2 |

### 3.12 Tanya Sulu

| Butir | Isi |
|---|---|
| Apa | Tombol mengambang di Jalan Bakti dan Sintesis (`JalanBakti.tsx:732`, `Sintesis.tsx:400`). Prompt "teman refleksi" dengan enam aturan jiwa: anti-vonis, hati dulu, tanpa dalil berujukan, tanpa klaim berlebih, bukan diagnosis, konteks Indonesia (`career-chat/index.ts:109-150`) |
| Jejak | Ketuk "Tanya Sulu" → pilih satu dari tiga pertanyaan contoh atau ketik → jawaban mengalir |
| Kekuatan | Aturan jiwa selaras niat. Saat tidak yakin soal daerah, model disuruh memberi prompt riset, bukan mengarang (`:139`). IOU dan Khazilmu "salah satunya, bukan yang utama" |
| Kelemahan vs pembanding | (1) Di bawah 18 dan tamu baru tahu obrolan terkunci sesudah mengetik dan mengirim (`:56-60`). Teks kuncinya menyebut "hasil asesmen dan saran jalur kamu tetap bisa dibuka" (`usia.ts:42`), padahal asesmen tertutup. (2) Tidak berpijak pada kartu daerah, Peta Bekal, atau bank peran, sehingga jawaban faktual bergantung ingatan model. (3) Riwayat tidak tersimpan |
| Rasa pakai remaja | Untuk siswa: mengecewakan, karena tombolnya mengundang lalu menolak |
| Vonis | PERKAYA. Persis: (a) keadaan terkunci tampil sebelum mengetik, dengan teks yang tidak menyebut asesmen, (b) untuk di bawah 18 ganti dengan 6–8 pertanyaan siap ketuk berjawaban kurasi tanpa model, (c) untuk dewasa suntikkan kartu daerah dan simpul bekal terkait sebagai konteks |

## 4. Celah lintas fitur

| # | Celah | Bukti kode | Niat atau bukti yang dilanggar |
|---|---|---|---|
| C1 | Pengguna inti menerima versi paling tidak personal. Tiga pintu AI melemah atau tertutup untuk di bawah 18 dan tamu | `usia.ts:8-10`, `broaden-roles:56`, `generate-sintesis:68`, `career-chat:56` | Umpan balik pribadi (B13). Penutupnya bukan melonggarkan privasi, melainkan masukan terstruktur hasil klik dan perakitan di perangkat |
| C2 | Jalur cipta tidak ada di kode tayang | Pencarian "cipta", "belum bernama", "rumuskan sendiri" nihil | Niat 7–8 Jul, N7, P3 |
| C3 | Peran tanpa pijakan data dan tanpa lembar kedalaman | `broaden-roles:69-85,158` | P2, P7, pembanding B1, B3 |
| C4 | Sudut minat kosong, sedangkan pembuka Jalan Bakti menjanjikannya | `Sintesis.tsx:202-203`, `jalanBaktiOpeningContent.ts` | Kerangka kecocokan diri dan lingkungan yang dipakai Sulu sendiri |
| C5 | Tidak ada simpul balik. Alur berhenti di rencana | Tidak ada kode tinjau ulang atau pengingat | B2 titik tinjau, B13 efek memudar |
| C6 | Beban baca dan tulis menumpuk: Insight sekitar 5.600 kata, Jalan Bakti sekitar 2.300 kata, sekitar 35 isian teks sepanjang Spine B | hitungan kata atas berkas `src/data/` | Niat 6 Jul "terlalu wordy", 13 Jun "light di lapis UI, kaya dan dalam" |
| C7 | Tiga taksonomi tidak bersambung: 7 kompetensi, 25 simpul bekal, 7 bidang peluang Insight terhadap 7 medan | `KenaliDirimuSkill.tsx:27`, `skillMapContent.ts`, `insightContent.ts:352` | Niat 14 Jun "skill-map hidup terpisah", 30 Jun "standalone features" |
| C8 | Lapis lokal bergantung akun dan baru dua jenis kebutuhan | `useProvince.ts`, `indeks.json` | P6, P12 |
| C9 | Angka dan rujukan tidak selaras | `insightContent.ts:353` vs `macroContext.ts:24`. `jalanBaktiContent.ts:84,88` vs B10, B11 | P7 |
| C10 | Orang tua dan guru BK hanya dilayani di Insight dan Compass | pengalih sudut pandang hanya di `Insight.tsx` | Sasaran 18 Mei, percakapan karier dengan keluarga dan guru (B9) |
| C11 | Komponen yatim dan sisa lama | `PetaMedan.tsx`, `ValuesCardSort.tsx`, daftar tunggu Compass, teks kunci obrolan | Niat 25 Jul "fitur-fitur yatim" |

## 5. Lima perbaikan bernilai tertinggi, berurutan

| Urut | Perbaikan | Menutup | Mengapa urutan ini |
|---|---|---|---|
| 1 | "Nyalakan peran" berpijak: bank peran terkurasi berkode KBJI dan bersumber, lembar peran ringkas (isi kerja, cocok bila, cara masuk, yang belum pasti, upah resmi bertahun), dan kartu tetap "rumuskan peranmu sendiri" | C2, C3 | Ini pembeda yang Raihan sebut "80000 hours versi lebih baik" dan saat ini titik paling jauh dari pembandingnya. Wadah yang tayang tetap |
| 2 | Kecocokan untuk semua usia lewat masukan klik: kompetensi pilihan, kartu "kegiatan yang membuatmu betah", kelompok yang ingin ditolong. Dipakai penghasil peran dan Sintesis. Tenunan di bawah 18 dirakit di perangkat | C1, C4 | Tanpa ini perbaikan 1 tetap generik bagi siswa. Butuh tinjauan Mbak Satwika untuk kartu minat |
| 3 | Simpul balik: lima pertanyaan percakapan dan catatan hasil, pagar keselamatan, kartu "sudah kulakukan" dan tinjau hari ke-30, Rencana B | C5 | Bagian Sulu yang buktinya paling kuat (B8, B9, B14) baru bernilai bila langkahnya terjadi dan direfleksikan |
| 4 | Ringankan: jalur ringkas Kenali Dirimu, SDG dan pengantar langkah ke lipatan, langkah 30 hari ditulis sekali, jembatan 7 kompetensi ke simpul bekal, bidang peluang ke medan | C6, C7 | Tidak menambah fitur, menaikkan peluang pengguna sampai ke bagian bernilai |
| 5 | Lapis lokal untuk tamu, kartu dipetakan ke medan, sapuan angka (33,92%, klaim sepuluh pekerjaan, alamat jalur), rapikan sisa lama | C8, C9, C11 | Butir angka murah dan menyangkut "kompas jangan menyesatkan". Layak dikerjakan lebih dulu sebagai perbaikan cepat walau nilainya di urutan lima |

Perbaikan cepat yang bisa lepas dari urutan: betulkan `insightContent.ts:353`, teks `TEKS_OBROLAN_TERKUNCI`, kirim nama kompetensi (bukan kode), pakai peran kedua di langkah 3, simpan hasil peran di perangkat.

## 6. Jawaban atas pertanyaan tugas

Apakah fitur tayang sudah state of the art, terbaik, dan enak dipakai siswa SMA/MA?

| Ukuran | Jawaban |
|---|---|
| Kerangka dan suara | Ya, di atas pembanding. Tidak ada pembanding yang menggabungkan kebutuhan wilayah bersumber, bingkai bakti, cara melatih berbukti, dan pagar anti-vonis seketat ini |
| Peta Bekal, kartu daerah, empat langkah, bila-maka, Tenunan | Setara atau lebih baik dari pembanding pada isinya |
| Penghasil peran | Belum. Di bawah pembanding pada pijakan data, kedalaman, dan ketersimpanan. Belum memenuhi niat jalur cipta |
| Personalisasi bagi siswa | Belum. Versi untuk di bawah 18 adalah versi paling generik |
| Enak dipakai | Sebagian. Momen terbaik (peran menyala, kartu daerah, tenunan) terkubur di antara bacaan dan isian yang panjang. Tidak ada alasan untuk kembali |

Tidak ada fitur yang layak diganti. Semua perbaikan di atas bisa dipasang di samping atau di dalam wadah yang tayang.

## 7. PERLU RAIHAN

1. Apakah kartu pilih minat tanpa skor (§3.4b) boleh disiapkan untuk tinjauan Mbak Satwika, atau menunggu Asesmen Minat.
2. Apakah medan cadangan (satu utama, satu cadangan) sejalan dengan niat "pilih satu untuk ditelusuri lebih dulu".
3. Apakah keputusan R2 (prompt siap pakai tidak ditawarkan kepada di bawah 18) berlaku surut untuk prompt salin yang sudah tayang di kartu Selami.
4. Sumber resmi daftar tujuh kompetensi di Kenali Kompetensimu.

## Sumber repo yang dibaca

`src/App.tsx`, `src/data/flags.ts`, `src/pages/{JalanBakti,KenaliDirimu,KenaliDirimuSkill,SkillMap,Sintesis,Ringkasan,RencanaAksi,Insight,Compass,Mukadimah}.tsx` (sebagian lewat kerangka), `src/components/{BroadenRoles,DesainLangkah,KartuDaerah,SpineBLayout,RequireAuth}.tsx`, `src/components/sulu/SuluCompanion.tsx`, `src/data/{jalanBaktiContent,jalanBaktiOpeningContent,kartuDaerahContent,kenaliDirimuContent,skillMapContent,skillMapNarasiContent,sintesisContent,rencanaAksiContent,ringkasanContent,mukadimahContent,mukadimahBabakContent,macroContext,compassContent,insightContent}.ts`, `src/lib/buildSuluContext.ts`, `src/hooks/useProvince.ts`, `supabase/functions/{broaden-roles,generate-sintesis,career-chat,generate-projection}/index.ts`, `supabase/functions/_shared/{ai,usia}.ts`, `public/data/kartu/indeks.json`. Dokumen niat: `REGISTER-NIAT_Raihan_15Nov2026.md`, `UJI_Setia-Niat_15Nov2026.md`, `RANCANGAN_Sambungan-Mesin_v3_15Nov2026.md` (kerangka dan tabel S, L, R), `tinjauan/TINJAUAN_Fable_Templat-dan-ME3_14Nov2026.md` §2.5, `USUL_Prinsip-Produk-Sulu_A0_18Nov2026.md`, `RISET_TLE-Odyssey-Peterson-Pentahelix_17Nov2026.md`. Tidak ada chat yang dibuka. Tidak ada data remunerasi atau kunci akses yang disalin. Tidak ada berkas repo yang diubah.
