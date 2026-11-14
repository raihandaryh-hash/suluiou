# Tinjauan independen Fable 5.2 · kerja 15 Nov 2026 (00.48 sampai 01.57 WIB)

Peninjau: Fable 5.2, agen terpisah dari pembangun, hanya baca. Cabang `mesin-me1-fondasi`, HEAD `db27dea`, 21 commit sejak `05e6f2c`.
Cakupan: STATUS_ME3 bagian "Pemeta v2 diukur ulang" sampai "Juri kuantitas G1.6 di luar sebaran"; STATUS_ME1 bagian "Syarat bawaan S3, S4, S6 ditutup".
Batas tinjauan: teks dokumen, cuplikan, dan gudang mentah hanya ada di laptop; yang menyangkut itu saya nilai dari berkas repo saja dan saya tandai.

## Ringkasan vonis

1. **Angka di STATUS hampir semuanya tereproduksi.** Semua Wilson, hitungan juri, hitungan regex, dan hitungan manifest cocok dengan berkas (tiga galat angka kecil: K1, K2, K3). Putusan "tidak lulus" untuk pemeta USUL (109) dan juri kuantitas (96) dilaporkan jujur, tidak dipoles.
2. **Yang menipu bukan angkanya, melainkan apa yang diukur.** Lima hal: "8 dari 8 di rantai" sirkular (P1); uji 109 hampir mustahil lulus pada n=29 dan tidak bebas antarbutir (P2); kueri 109 memuat nama peran dan kata "tugas" (P3); label "benar" tidak mengukur kelayakan peran untuk pengguna Sulu (P5); set kuantitas tidak punya negatif sulit dan asal-usulnya tidak terekam (P8).
3. **Kode baru punya celah nyata.** Validator v3.1 meloloskan 7 dari 7 usulan rusak buatan saya (P6). Regex kuantitas v2.1 kini menolak nama wilayah nyata "Kepulauan Seribu" yang dirender ke teks jalur (P7). `periksa_kartu.py` tidak memeriksa apa pun atas sumber tak terdaftar di kartu draf; 38 dari 73 kartu provinsi lewat jalur itu (P10).
4. **Kata "ditutup/SELESAI" untuk S4 dan S6 terlalu kuat.** S6 dipenuhi dengan pengganti (URL dibentuk dari pola, waktu ubah berkas); S4 berlubang untuk draf. S3 layak disebut selesai dengan cara setara.
5. **Tonggak ME3 belum bisa ditutup.** G3.2 mode USUL dan G1.6/G3.4 lapis 2 belum lulus; jalan masuk pengguna saat ini bertumpu pada satu pelabel dari satu penyedia yang galatnya belum pernah diukur.

Jumlah temuan: **P = 11, K = 9.**

## Temuan penting (P)

### P1 · "Ketepatan peran di rantai 8 dari 8" sirkular
- Bukti: `mesin/jalur/rangkai.py:66-67,161-162`: mata rantai peran lolos hanya bila `rantai_label_v2.jsonl` berisi "benar". Berkas itu berisi 8 baris, semuanya "benar". STATUS_ME3 butir 109: "dengan gerbang itu ketepatan peran di rantai 8 dari 8".
- Dampak: label adalah syarat masuk, jadi 8 dari 8 benar menurut definisi, bukan hasil ukur. Sekalipun dianggap ukuran, batas bawah Wilson 8/8 = 0,676, di bawah 0,85. Satu-satunya jalan masuk ke pengguna bertumpu pada satu pelabel (Fable, penyedia sama dengan pemeta) tanpa taksiran galat pelabel.
- Perbaikan: tulis "8 peran lolos gerbang", bukan "ketepatan". Ukur pelabelnya: label ganda oleh penyedia lain (butir 102) ditambah 20 sampai 30 butir dilabel Raihan atau SME, laporkan kesepakatan (kappa) dan arah selisih. Gerbang rantai baru boleh disebut terukur sesudah itu.

### P2 · Uji 109 kurang daya dan butirnya tidak bebas
- Bukti: `sampel_v2.py --nilai usul_109_label.jsonl` → benar 26, ragu 3, n 29, Wilson 0,736 (cocok). Wilson 28/29 = 0,828; hanya 29/29 (0,883) yang lulus. Bila ketepatan sejati 0,95, peluang 29/29 = 0,23; pada 0,97 = 0,41. HOLDOUT_107 dan STATUS butir 107 menjanjikan rancangan ≥ 40 usulan; `AMBANG.yaml:18` menulis `n: 100, elusi_maks: 0.05`. Sebaran: 29 usulan berasal dari 7 dokumen (7, 6, 4, 4, 4, 3, 1); 5 dari 12 dokumen nol usulan; JKN 4 usulan dari 2 dokumen. X10, X11, X12 memakai kutipan kebutuhan yang sama.
- Dampak: "tidak lulus" sah menurut pendaftaran, tetapi uji ini hampir tidak bisa membedakan pemeta 0,80 dari pemeta 0,95. Wilson mengandaikan butir bebas; usulan dari satu peraturan berbagi nasib, jadi selang sebenarnya lebih lebar. Elusi (peran yang terlewat) tidak pernah diukur padahal ada di ambang.
- Perbaikan: pendaftaran berikutnya memakai aturan henti berdasar jumlah usulan (≥ 100 usulan sah dari ≥ 25 dokumen, paling banyak 5 usulan per dokumen), selang dihitung dengan bootstrap klaster per dokumen di samping Wilson, dan elusi diukur pada 10 dokumen yang dibaca penuh pelabel.

### P3 · Pemilihan dokumen 109 condong ke kasus mudah, dan jejak pemilihannya tidak lengkap
- Bukti: `HOLDOUT_109.md:6-8`: kueri memuat "tugas", "pendamping", "petugas", "tugas kader posyandu", "kader pembangunan manusia tugas". `HOLDOUT_109_kandidat.json`: 59 URL, 42 di antaranya `peraturan.bpk.go.id`; satu genre (perbup/perwal). Register produksi L0 memuat inpres, perpres, pedoman, dan juknis (HOLDOUT_107). Berkas kandidat tidak tercantum di `BEKU.sha256`; tidak ada log terima/lewati per kandidat walau `HOLDOUT_109.md:10` menulis "dilewati dan dicatat" (manifest menunjukkan `h109-mis-02` hilang tanpa alasan tertulis di repo). Commit pendaftaran 01.20.37, commit kandidat 01.21.28.
- Dampak: kueri menyebut nama peran yang menjadi jawaban dan kata kerja yang dicari validator, jadi dokumen terpilih kaya kalimat "X bertugas ...". Arah bias optimis: 0,736 adalah batas atas longgar untuk sebaran produksi, bukan taksirannya. Urutan commit membuktikan urutan penyimpanan, bukan urutan kerja; selang 51 detik untuk enam pencarian tidak membuktikan pencarian dijalankan sesudah pembekuan.
- Perbaikan: ambil sampel acak berstrata dari register L0 v4 atas dokumen yang belum pernah dipetakan (teks dipastikan dulu), atau pakai kueri netral tanpa kata peran dan tanpa "tugas". Simpan log per kandidat (URL, diterima/dilewati, alasan, sidik) dan bekukan sebelum pemetaan.

### P4 · Hasil 109 tidak bisa diperiksa ulang dari repo
- Bukti: `git show --stat 177df0c` hanya menambah `usul_109_keluaran.sah.jsonl` dan `usul_109_sampel.jsonl`. Tidak ada keluaran mentah pemeta, berkas `.tolak`, 47 cuplikan, atau teks dokumen. Klaim "29 sah, 0 tolak", "semua cuplikan terbaca penuh", "sha validator di laptop = versi beku" hanya pernyataan.
- Dampak: syarat inti (kutipan persis ada di dokumen) tidak dapat diuji peninjau. Untuk v3 keluaran mentah ada, untuk 109 tidak.
- Perbaikan: masukkan keluaran mentah pemeta dan log validator (keduanya keluaran model/alat, bukan data mentah), serta sidik tiap cuplikan dan tiap teks hasil ekstraksi. Sidik PDF sudah ada di manifest; itu bagus dan cukup untuk dokumennya.

### P5 · Label "benar" tidak mengukur kelayakan peran bagi pengguna
- Bukti: 13 dari 26 "benar" di 109 adalah jabatan struktural atau jabatan dalam tim: Kepala Bidang/Seksi (X00 sampai X03), Kepala Dinas (X04, X15, X16, X28), Sekretaris (X05, X26), Ketua pelaksana (X24, X25), Koordinator Bidang (X27). `PELABEL_v1.md` hanya menanyakan "orang mengerjakan sesuatu yang berkait kebutuhan". X19 dilabel benar walau KPM di kutipan itu sasaran peningkatan kapasitas.
- Dampak: lulus 0,85 pun tidak berarti usulan layak tampil sebagai peran tujuan navigasi karier; "Sekretaris" atau "Ketua pelaksana" tanpa konteks tidak bermakna dan tidak bisa dimasuki mahasiswa. Ukuran G3.2 saat ini mengukur konstruk yang lebih longgar daripada yang dibutuhkan produk.
- Perbaikan: PELABEL v2 dengan dua dimensi terpisah: (a) pelaksana tugas terkait kebutuhan, (b) nama peran berdiri sendiri dan dapat dimasuki (bukan jabatan eselon, bukan jabatan dalam kepanitiaan). Gerbang rantai menuntut keduanya. Dimensi (b) kandidat untuk aturan mekanis di validator.

### P6 · Validator v3.1 meloloskan tujuh kelas usulan rusak
- Bukti: tujuh baris buatan dijalankan pada `validasi_kutipan_v3_1.py` (fixture di luar repo): keluaran `sah 7 ditolak 0`.
  1. Lembaga lolos `BUKAN_ORANG` karena daftar hanya dicocokkan di awal dan tidak lengkap: "Perangkat Daerah", "Sekretariat TPPS" (juga OPD, UPTD, Bidang, Seksi, Fasilitas Kesehatan).
  2. Celah butir 108 terbuka lagi bila nama peran disingkat: peran "Staf Administrasi" + kutipan "Staf Administrasi Perluasan Kepesertaan membuat laporan" lolos, sebab `tanpa_peran` hanya membuang string nama persis (baris 26-28).
  3. `KERJA` (baris 22) menerima awalan `ter` dan `pe` serta kata non-kerja: "melalui", "petugas", "terhadap", "pemerintah", "berdasarkan". Docstring hanya menyebut me-, ber-, di-.
  4. Penanda dicocokkan sebagai awalan tanpa batas akhir (baris 25): "kis" cocok "kisaran", "rentan" cocok "rentang", "iuran" cocok "iuran sampah", "pengukuran" cocok "pengukuran kinerja".
  5. `kutipan_kebutuhan` dicari di seluruh dokumen (baris 42), padahal prompt aturan 7 dan docstring menuntut cuplikan yang sama; kutipan dari pasal jauh yang tidak berkait lolos.
  6. "Nama peran ada di kutipan" cukup satu kata sebagai potongan string (baris 39): "Kader" cocok "Kaderisasi".
  7. `kata_tugas` cukup ada di kutipan; tidak dituntut berdekatan dengan atau berpelaku peran itu.
- Dampak: validator dipakai sebagai separuh gerbang rantai ("kutipan tugas terverifikasi"). Pada keluaran nyata celah 2 dan 4 sudah terlihat: v3 punya tiga usulan berpenanda hanya "iuran", dua hanya "posyandu" untuk Babinsa/Babinkamtibmas. Fixture gerbang (2 sah, 3 tolak) tidak menyentuh satu pun kelas di atas.
- Perbaikan (v3.2, dibekukan dengan fixture negatif untuk tiap kelas): `BUKAN_ORANG` dicari di seluruh nama dengan daftar diperluas; buang dari kutipan seluruh rentang frasa nomina tempat nama peran muncul (nama peran + kata berhuruf kapital yang menyambung), bukan string persis; `KERJA` kembali ke me-/ber-/di- dengan daftar tolak kata tugas (melalui, merupakan, berdasarkan, bersama, dinas, dan sejenisnya); penanda dengan batas kata di kedua sisi, kecuali yang memang awalan; `kutipan_kebutuhan` wajib berada di teks `cuplikan_id` yang sama; nama peran dicocokkan per kata utuh, minimal dua kata bila nama lebih dari satu kata.

### P7 · Regex kuantitas v2.1 menolak teks sah yang tidak ada di set uji, termasuk nama wilayah nyata
- Bukti: `rangkai.py:97` merender `wilayah.nama` ke ringkasan jalur dan `rangkai.py:141` menerapkan `KATA_KUANTITAS` ke semua string. Pola baru `(?:se|beribu-)?ribu` menangkap "Seribu" pada "Kab. Kepulauan Seribu" (kode 3101, ada di `kartu_me2.jsonl`); regex lama tidak. "Lima Puluh Kota" sudah tertolak sejak regex lama. Uji tangan saya atas kalimat peran yang wajar, semuanya TERTANGKAP: "Pada umumnya kader bertugas di posyandu", "Kader belajar dari setiap kunjungan rumah", "penghubung di antara dua pihak", "Pendidikan tertinggi yang kamu tamatkan", "Lomba posyandu se-kecamatan", "unit terkecil masyarakat", "Kebanyakan tugas dikerjakan di lapangan", "lebih baik daripada menunggu", "Nilai rata-rata ijazah". Sebaliknya yang LOLOS: "paling tinggi", "paling banyak se-Jawa Barat" (sudah diketahui dari B, tidak dibetulkan di v2.1), "hampir setiap rumah", "sangat banyak", "tidak sedikit", "sejumlah besar", "tinggi sekali".
- Dampak: klaim "0 tangkapan baru pada teks nyata" benar untuk korpus saat ini (pindai saya: 37 tangkapan baru di repo, semuanya di luar teks kartu/jalur, 4 di antaranya "Seribu" sebagai nama wilayah), tetapi korpus itu kecil dan ditulis sebelum regex ini ada. Begitu jalur dirangkai untuk Kepulauan Seribu, atau penulis produksi menulis teks peran, gerbang akan menolak teks sah. Label "ketepatan tinggi" bertumpu pada 130 negatif yang tidak memuat kelas ini.
- Perbaikan: buang nama wilayah (dari daftar `nama_induk.json`) sebelum pemindaian, seperti placeholder; beri batas kata penutup pada `ribu|juta|ratus|belas|puluh`; pindahkan "umumnya", "dari setiap", "di antara N", "ter-", "se-wilayah", "lebih X daripada", "rata-rata" dari regex ke juri bila teks peran/jalur ikut dipindai, atau pisahkan dua daftar (teks kartu ketat, teks peran longgar). Tambah set negatif dari kalimat peran dan syarat hukum nyata sebelum disetel lagi.

### P8 · Set kuantitas A, B, C: asal-usul tidak terekam, negatif terlalu mudah, label tanpa adjudikasi
- Bukti: tidak ada prompt penulis set di `uji/kuantitas/`. Kemiripan C dengan lolosan B yang sudah diketahui: B-P36 dan C-P19 ("paling banyak se-Jawa Barat"), B-P32 dan C-P14 ("... di kecamatan ini kekurangan air bersih"), B-P09 dan C-P05 ("membengkak dari tahun ke tahun"); 13 pasangan lintas set mirip di atas 0,72. Dari 130 negatif: 0 memuat placeholder, 0 memuat perbandingan sah gaya kartu ("di atas nilai tengah nasional", contoh benar di `definisi_mode.json` mode vonis); hanya 11 memuat kata yang dekat dengan kuantitas. A-N30 "Posyandu tersedia di hampir setiap pelosok" dilabel negatif, padahal itu kuantitas dalam kata; satu-satunya "salah tangkap" juri justru tangkapan yang masuk akal.
- Dampak: C bukan sampel bebas; 33/50 bukan taksiran daya tangkap, dan arah biasnya tidak bisa ditentukan tanpa prompt penulis. TNR 129/130 (juri) dan 130/130 (regex) diukur pada negatif yang tidak menyerupai teks kartu sungguhan, jadi tidak mendukung klaim TNR untuk G1.6. Set ini direncanakan menjadi bahan kalibrasi mode baru (butir 110) dalam keadaan itu.
- Perbaikan: simpan prompt penulis dan pernyataan apa yang penulis lihat. Sebelum dipakai mengkalibrasi: adjudikasi label oleh agen kedua plus contoh periksa Raihan; tambah negatif sulit (placeholder terender, perbandingan dari `jarak.arah`, syarat hukum "paling sedikit", frekuensi "setiap bulan"); pakai format kartu utuh, bukan kalimat tunggal di kartu netral.

### P9 · Sebab kegagalan juri kuantitas dilaporkan terlalu rapi
- Bukti: dari 42 positif yang diloloskan juri, 26 tertangkap regex. Di antaranya yang jelas berada di dalam definisi "besaran dengan kata": A-P24 "Sekitar 40 persen keluarga", B-P28 "Sekitar 30 persen penduduk", B-P12 "Umumnya anak muda ...", A-P27 "Rata-rata anak ...", B-P29 "golongan terbesar". STATUS: "juri (dengan benar menurut definisinya) meloloskannya".
- Dampak: sebagian kegagalan adalah galat juri (Haiku), bukan celah definisi. Mode baru saja tidak akan menutupnya; gabungan regex-atau-juri TPR 114/130 (batas bawah 0,809) sebagian besar ditopang regex.
- Perbaikan: pisahkan lolosan juri menjadi "di luar definisi" dan "di dalam definisi" di STATUS; untuk yang kedua, kalibrasi ulang prompt kuantitas (contoh "N persen", "umumnya", "rata-rata") atau naikkan model, lalu uji pada set baru.

### P10 · S4: sumber tak terdaftar di kartu draf tidak diperiksa sama sekali
- Bukti: `periksa_kartu.py` cabang `else` di `periksa_asal`: bila sumber tanpa kontrak ber-URL, hanya status draf dan host yang dicek. Uji saya: kartu draf dengan `sumber_id="karangan"`, `url="https://www.bps.go.id/x"`, `sha256="ab"*32` → `[]` (lolos). `kartu_me3_prov.jsonl`: 38 dari 73 kartu memakai `bps-var-2279`, yang tidak punya berkas kontrak di `mesin/sumber/`.
- Dampak: "0 pelanggaran pada 73 kartu" hampa untuk 38 kartu; sidik dan URL-nya tidak diikat ke apa pun. "S4 ditutup" berlaku untuk kartu bersumber kontrak, tidak untuk draf.
- Perbaikan: `sumber_id` wajib ada di registri walau draf; buat kontrak `bps-var-2279` (sidiknya sudah ada di manifest) atau tolak; tambah uji negatif "draf bersumber tak terdaftar". Uji negatif yang ada ditegaskan dengan mencocokkan isi pesan (lihat K5).

### P11 · S6 (dan sebagian S3): kolom `url` bukan URL unduhan, label "ditutup" terlalu kuat
- Bukti: `manifest_mentah.py` membentuk URL WebAPI dari nama berkas (baris `WEBAPI`), tanpa tahun dan tanpa kunci: 1.015 dari 1.031 URL berasal dari pola; 1.015 berkas hanya punya 831 URL unik (berkas beda tahun berbagi URL). Dua "PDF kontrak" ber-URL halaman pendarat (`.html` dan laman SSGI), bukan berkas yang disidik. 529 berkas tanpa URL; 41 tanpa URL dan tanpa asal. Tanggal unduh diganti waktu ubah berkas. Docstring skrip jujur soal ini; STATUS_ME1 dan kepala kolom CSV tidak membedakan URL tercatat dari URL bentukan. Syarat asli (STATUS_ME3 baris S6): "nama, URL, sidik penuh, tanggal unduh, versi alat".
- Dampak: pihak ketiga tidak bisa mengunduh ulang berkas dari kolom itu lalu mencocokkan sidik; untuk WebAPI jawabannya dinamis dan berkunci. Hal yang sama berlaku untuk pasangan `berkas_url` + `berkas_sha256` di kontrak sakernas dan air minum. Manifest membuktikan inventaris dan sidik, belum membuktikan asal.
- Perbaikan: ganti status menjadi "SELESAI DENGAN PENGGANTI"; tambah kolom `jenis_url` (tercatat / dibentuk dari pola / halaman pendarat) dan parameter permintaan lengkap tanpa kunci (var, th, turvar) dari log panen; pengunduh berikutnya mencatat URL dan waktu saat unduh. Baris S3 di STATUS_ME3 masih berbunyi "`kartu.py` membaca sidik dan URL dari kontrak", padahal yang dikerjakan adalah kesetaraan yang dipaksa gerbang (lihat K8).

## Temuan kecil (K)

- **K1** · STATUS butir 101: "salah tangkap 1 dari 170 kalimat negatif di B dan C". B + C = 90 negatif; A + B + C = 130. Angka 170 tidak cocok dengan berkas mana pun.
- **K2** · STATUS butir 107: "perlu ≥ 23 usulan benar tanpa satu pun ragu". Wilson 22/22 = 0,851, jadi minimalnya 22.
- **K3** · STATUS butir 109: "semuanya peraturan daerah". `h109-mis-04` adalah "MATRIKS PERBANDINGAN PERATURAN BUPATI ..." dari laman BPK perwakilan, bukan peraturan (nol usulan darinya).
- **K4** · Angka B untuk regex v2 (34/40, salah tangkap 1/40) tidak tereproduksi dari git: v2 dan v2.1 masuk dalam satu commit (`e5a6a27`); HEAD memberi B 35/40 dan 0/40. Simpan v2 sebagai commit atau berkas tersendiri.
- **K5** · Uji negatif S4 tidak mengisolasi jalur: "sidik nol" tertangkap dua pemeriksa (sidik berulang dan sidik kontrak), "url palsu" dua (skema dan URL kontrak); tes hanya memeriksa daftar tidak kosong. Menghapus pemeriksa sidik nol tidak akan menggagalkan tes.
- **K6** · Skema kartu: tanggal "2026-19-39" lolos (format tidak diaktifkan, pola longgar); `pembanding` tanpa `additionalProperties: false` (medan liar lolos); draf tidak diwajibkan punya `alasan_draf` (`then: {}`).
- **K7** · Yang disebut beku tetapi tidak ada di `BEKU.sha256`: `peran/potong_cuplikan.py` ("pemotong beku"), `HOLDOUT_109_kandidat.json`, `uji/kuantitas/nilai.py`. `sampel_v2.py` beku ber-seed 105 dengan nama keluaran tetap; sampel v3 (seed 106) dan 109 dibuat tanpa skrip di repo (seed 106 saya reproduksi manual, cocok).
- **K8** · Docstring `validasi_kutipan_v3_1.py` masih menulis cara pakai v2 dan daftar imbuhan yang tidak sama dengan kode. `nilai.py` galat tanpa argumen dan docstring-nya hanya menyebut A|B. Baris S3 di STATUS_ME3 perlu disesuaikan dengan yang benar-benar dikerjakan.
- **K9** · "Posyandu" ada di daftar penanda validator, sedangkan pelabel menilai "posyandu saja" belum menunjukkan kaitan stunting (X18, X20). Dua alat mengukur konstruk berbeda; selaraskan saat PELABEL v2 dan validator v3.2 ditulis (posyandu, penimbangan, pengukuran, iuran, kepesertaan sebagai penanda lemah yang butuh penanda kedua).

## Keputusan atas delegasi

Disetujui:
1. Mode USUL tetap usulan; tidak masuk jalur pengguna tanpa gerbang rantai. Benar dan konservatif.
2. Ragu dihitung salah sebagai kriteria; angka ragu-dibuang hanya dilaporkan.
3. Uji 107 dinyatakan tidak bisa diputus dan pemeta tidak dijalankan; tidak ada pengganti diam-diam.
4. Aturan v3 tidak disetel pada dokumen 109; penyetelan ditunda sampai ada pelabel penyedia lain.
5. Regex diposisikan sebagai lapis 1, C tidak dipakai menyetel, kata kerja perubahan dan "seluruh/semua" tidak dimasukkan ke regex.
6. Teks kartu dan jalur tidak tayang sampai juri lulus; mode baru didaftarkan dengan urutan beku → kalibrasi → uji sekali.
7. `kartu.py` tidak disunting demi sidik skrip ME2; kesetaraan dengan kontrak dipaksa gerbang. Setara secara kontrol, asal dicatat begitu.

Ditentang atau diminta diubah:
1. "Mode USUL v3 menjadi bawaan pemeta" (butir 106): boleh sebagai prompt, tetapi validator v3.1 belum layak menjadi separuh gerbang (P6). Tahan sampai v3.2 dengan fixture negatif.
2. Menyebut gerbang rantai "8 dari 8" sebagai ketepatan (P1). Ganti redaksi dan ukur pelabel.
3. Menjalankan dan memutus uji 109 pada n=29 walau rancangan ≥ 40 dan ambang n=100 (P2). Putusan gagalnya saya terima; rancangannya tidak boleh diulang.
4. Menandai S4 dan S6 "ditutup/SELESAI" (P10, P11). Jadikan "selesai bersyarat" dengan sisa yang disebut.
5. Kesimpulan "celahnya di definisi, bukan di juri" (P9): separuh benar. Butir 110 perlu ditambah kalibrasi ulang mode kuantitas.
6. Memakai A+B apa adanya sebagai bahan kalibrasi butir 110 (P8).

## Langkah berikut untuk menutup ME3

Urutan menurut ketergantungan:
1. **Pelabel kedua dari penyedia lain (butir 102) plus contoh periksa manusia.** Ini penghambat bersama G3.2, gerbang rantai, dan H1. Tanpa ini semua angka ketepatan adalah kesepakatan Anthropic dengan Anthropic.
2. **Validator v3.2 dan PELABEL v2** (P5, P6, K9), dibekukan bersama fixture negatif per kelas; uji mutasi: tiap aturan dihapus harus menggagalkan minimal satu fixture.
3. **Pendaftaran G3.2 ketiga** menurut P2 dan P3: sampel dari register, ≥ 100 usulan, batas per dokumen, bootstrap klaster, elusi diukur, seluruh jejak (kandidat, log, keluaran mentah, sidik cuplikan) masuk repo sebelum label dibuka.
4. **Regex v2.2** (P7): nama wilayah dibuang sebelum pindai, batas kata, pemisahan daftar teks kartu dan teks peran; diuji pada set negatif baru dari kalimat peran nyata.
5. **Butir 110, rancangan mode "perbandingan":**
   - Definisi berbentuk taksonomi dengan contoh bergalat dan contoh benar per kelas: (a) superlatif dan peringkat; (b) perbandingan antarwilayah tanpa placeholder; (c) perbandingan antarwaktu dan arah perubahan; (d) intensitas dan kiasan besaran ("besar sekali", "gunung es"), yang sekarang tidak dimiliki mode mana pun.
   - Pengecualian eksplisit: perbandingan yang seluruhnya datang dari `{pembanding}`, `{jarak}`, dan `jarak.arah` ("di atas nilai tengah nasional") sah; kata penguat di sekitarnya ("jauh di atas") tidak. Batas dengan mode sebab ("naik tajam sehingga ...") dan vonis ("terparah") ditulis, supaya satu kalimat tidak diperebutkan atau dilepas dua mode.
   - Mode kuantitas dikalibrasi ulang dalam pendaftaran yang sama (P9).
   - Bahan kalibrasi: A+B sesudah adjudikasi dan penambahan negatif sulit (P8). Set D ditulis agen yang tidak melihat A, B, C, STATUS, atau contoh definisi; prompt penulisnya disimpan dan dibekukan; minimal 150 positif dan 150 negatif (ambang butuh 143/150 untuk batas bawah TPR 0,90 dan 137/150 untuk TNR 0,85; pada n=100 butuh 96 dan 92), berstrata per kelas, separuhnya disisipkan ke teks kartu utuh hasil penulis produksi (sejalan H2).
   - Yang diukur dan diputus: gabungan regex ∪ juri kuantitas ∪ juri perbandingan, sebab salah tangkap menumpuk antar-lapis; TPR per kelas dilaporkan supaya satu kelas lemah tidak tertutup rata-rata.
   - Juri dari penyedia lain (H1) dijalankan pada D yang sama sebagai pembanding; selisih dua juri menjadi bahan adjudikasi, bukan diabaikan.
6. **S4 dan S6** dirapikan menurut P10 dan P11 sebelum syarat bawaan ME1 disebut tuntas.

## Yang diperiksa dan tidak ditemukan masalah

| Hal | Metode | Hasil |
|---|---|---|
| Gerbang deterministik | `python3 mesin/alat/periksa_gerbang.py` | "LULUS gerbang deterministik"; fixture v3 (2 sah, 2 tolak) dan v3.1 (2 sah, 3 tolak) cocok STATUS |
| Wilson pemeta v1, v2, v3, 109 | `sampel_v2.py --nilai` pada empat berkas label | 0,221/0,454; 0,422/0,857; 0,769/0,904; 0,736/0,871; semua cocok |
| Angka turunan | hitung ulang Wilson | 34/37 = 0,787; 29/29 = 0,883; 24/29 = 0,655; 33/40 = 0,680; 31/40 = 0,625; cocok |
| v3.1 diterapkan ulang | simulasi pemeriksa penanda pada sampel v3 | 3 tertolak (W18 ragu, W26 dan W35 benar); cocok |
| Jumlah usulan v3 | hitung baris | 42 baris = 41 usulan + 1 baris status; cocok "41" |
| Sampel v3 | `random.Random(106).sample(R, 40)` | identik dengan `usul_v3_sampel40.jsonl` |
| Regex pada A, B, C | `nilai.py A|B|C --rinci`; regex lama dari `git show c802ae8` | A 40/40, 0/40; C 33/50, 0/50; garis dasar lama A 15/40, B 19/40; cocok |
| Juri 96 | hitung ulang dari `juri96_keluar.jsonl` + `peta_juri96.json` | TPR 88/130 (0,592), TNR 129/130 (0,958); C 29/50 (0,442); regex 108/130 (0,757); gabungan 114/130 (0,809), C 38/50 (0,626); 12 lolos keduanya di C; semua cocok. Peta 260 id unik, tanpa duplikat persis antar-set |
| Pembekuan | sidik `BEKU.sha256` (baris terakhir per berkas, lewat gerbang) dan `git log` per berkas | prompt, validator, pelabel, pendaftaran, set A/B/C masuk commit sebelum commit hasilnya; tidak ada berkas beku yang disunting sesudahnya |
| Manifest | hitung dari CSV; `sha256sum` | 1.560 berkas, 1.031 ber-URL, 1.503 berpola; sidik manifest `b03ce55bc857`, versi alat `abf8d9161177` = sidik skrip; sidik penuh di semua baris; 4 dari 4 sidik kontrak tercantum |
| S3 | cetak `KONTRAK` dan jalankan `periksa_sumber_kartu` | empat kontrak ber-URL dan bersidik penuh; `kartu.py` SUMBER sama dengan kontrak |
| Uji negatif S4 | menjalankan salinan skrip di memori dengan pesan dicetak | keenamnya tertangkap oleh jalur yang dimaksud (dua di antaranya juga oleh jalur lain, K5); URL `http`, userinfo, dan host tiruan tertolak skema |
| Kejujuran putusan gagal | baca STATUS terhadap angka | kegagalan 107, 109, dan 96 dilaporkan apa adanya; peringatan penyedia tunggal dan optimisme dokumen penyusun aturan sudah ditulis pembangun sendiri |
| Perubahan produksi | `git log --stat` cakupan | semua perubahan di `mesin/`; tidak ada sentuhan di luar cabang mesin |

Tidak diperiksa (di luar jangkauan repo): keberadaan kutipan di teks dokumen 109, isi 47 cuplikan, kecocokan sidik kontrak dengan berkas mentah di laptop, klaim "0 tangkapan baru" pada berkas yang tidak ada di repo.
