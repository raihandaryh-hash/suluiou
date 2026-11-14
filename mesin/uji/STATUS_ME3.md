# Status tonggak ME3 (Kedalaman M3/M3b dan pencocok uji) · dimulai 13 Nov 2026 19.11 WIB (jam sistem) · SINTESIS

Dasar: rencana mesin v1 §4.4-§4.5 dan baris ME3 di tabel tonggak ("Tiga jenis teratas × ≥2 jalur; jalur cipta satu jenis; pencocok dijalankan di luar produksi pada SU-4 sampai SU-7"). Dimulai atas KEPUTUSAN Raihan 13 Nov 2026 19.04 WIB "Lanjut" yang menutup ME2 SELESAI BERSYARAT.

Tiga jenis teratas saringan v7: penduduk tanpa jaminan kesehatan, kemiskinan, stunting balita.

## Urutan kerja (jalur kritis)
1. **Set uji dibekukan dulu** (aturan §4): SU-3 peran (daftar 40 kebutuhan beku di `uji/SU3_kebutuhan.yaml`; separuh A terbuka dan separuh B tersembunyi ditulis dua agen berbeda, berjalan), SU-8 menyalakan (sesudah teks kartu ada), SU-5 vonis (sudah beku sejak ME0).
2. **Kartu untuk tiga teratas.** Kemiskinan: ada (490). Stunting: SSGI ditahan karena publikasi kedua independen belum ada; panen publikasi kedua dari domain BPS kabupaten/kota berjalan di laptop. Jaminan kesehatan: panen domain BPS kabupaten/kota menyusul sesudah stunting (dua panen bersamaan memicu batas laju BPS).
3. **Rantai tujuh mata rantai (G3.1)** dan pemetaan peran berbukti (G3.2) untuk tiga jenis, ≥2 jalur per jenis; G3.3 keterjangkauan; G3.4 tanpa vonis; G3.5 data pasar kerja.
4. **Jalur cipta (M3b)** untuk satu jenis; G3b.1-G3b.2.
5. **Pencocok** atas SU-4 sampai SU-7 di luar produksi; G4.1-G4.10.

## Syarat bawaan ME2
1. Uji total G2.2 TPT dan air minum; kartu nasional air minum; G2.1 ulang dengan wilayah induk f3b676e88a71.
2. Daftar 3T 2025-2029.
3. Kartu jaminan kesehatan dan stunting (= langkah 2 di atas).
4. Wilayah induk ke repo; G2.1 dan laporan Papua ke CI.
5. Teks kartu dan status `siap_tinjau` di skema.

## G3.2 pengembangan putaran 1 (13 Nov 2026 22.49 WIB) · separuh A, 130 pasangan, pemeta Opus mode PERIKSA, prompt v1
- Keluaran pemeta di laptop `MESIN\peran\periksa_A_keluaran.jsonl` (sidik 50a9482124df); validator kutipan: 130 sah, 0 ditolak.
- Diloloskan 22: benar 22, salah 0 → presisi 1,00 (batas bawah Wilson 0,85 pada n=22). Elusi 0/44 = 0%.
- **Cakupan rendah:** 22 dari 86 pasangan benar (26%). Dari 64 yang terlewat, 47 bersandar pada dokumen yang tidak ada di register L0, 9 dokumennya ada di register, 8 tanpa nomor dokumen.
- Akibat untuk gerbang: G3.2 butuh ≥100 pasangan yang diloloskan; dengan cakupan 26% atas 149 pasangan benar (A+B) hanya ~39 yang lolos. Jalan: register L0 diperluas (pedoman dan juknis yang menyebut pelaksana) oleh agen yang tetap tidak membaca SU-3; tidak memasukkan dokumen yang dikutip SU-3 secara langsung.
- Putusan pemeta yang paling bisa diperdebatkan (laporan pemeta): "dokter" untuk dokter umum, salah baca OCR "pekeda sosial", lembaga usaha/LSM sebagai pelaksana.

## G3.2 pengembangan putaran 2 (13 Nov 2026 23.34 WIB) · separuh A, register L0 v2 (+43 dokumen terunduh), penyiap bundel v2, prompt v1
- Keluaran `MESIN\peran\periksa_A2_keluaran.jsonl` (sidik bb26c81fd368); validator: 130 sah, 0 ditolak.
- Diloloskan 36: benar 36, salah 0 → presisi 1,00 (Wilson 0,90 pada n=36). Elusi 0/44. Cakupan 36/86 = 42% (putaran 1: 26%).
- Terlewat 50: 34 dokumennya tidak di register, 9 ada di register, 7 tanpa nomor. Terbanyak: perkawinan anak, UMKM, korban bencana (5 masing-masing).
- Hitungan kelayakan: G3.2 meminta ≥100 pasangan diloloskan. SU-3 berlaku memuat 149 pasangan benar (A 86 + B 63); pada cakupan 42% yang lolos ~62. Syarat n≥100 butuh cakupan ≥67%, jadi tidak tercapai dengan SU-3 sekarang tanpa menambah pasangan atau dokumen. Diajukan ke Raihan.

## G3.2 PENILAIAN AKHIR (14 Nov 2026 08.48 WIB) · sekali, register L0 v3, penyiap bundel v2, prompt v1, pemeta Opus
- Separuh A (terbuka): diloloskan 37, benar 37, salah 0; cakupan 37/86; elusi 0/44. Keluaran laptop `periksa_A3_keluaran.jsonl` (sidik 2f6f0f74fbd0); validator 130 sah.
- Separuh B (tersembunyi, dinilai di laptop oleh `peran/b_nilai.py`, hanya agregat; label sidik bf930a90…): diloloskan 26, benar 26, salah 0; Wilson 0,871; cakupan 26/63; elusi 0/42. Keluaran `periksa_B3_keluaran.jsonl` (sidik 06e0802d36b5); validator 105 sah.
- Gabungan: 63/63 benar → presisi 1,00, **batas bawah Wilson 95% 0,943 ≥ 0,85**; elusi 0/86 = 0% ≤ 5%; cakupan 63/149 = 42%.
- **G3.2 LULUS** menurut protokol + tambahan 1 (KEPUTUSAN Raihan "Batas bawah saja"). Catatan wajib: n = 63 (bukan 100), cakupan 42%; kandidat ditolak 86 (rencana 100).
- Kasus batas yang dilaporkan pemeta (diloloskan dan ternyata benar menurut label, atau di B tidak diketahui): padanan istilah (guru ngaji, TKSK, ATLM), lembaga masyarakat berisi orang (LAZ, UPZ, Kelompok Masyarakat SPAM) diloloskan sesuai prompt beku.

## G3.1 rantai dan G3.3 keterjangkauan (14 Nov 2026 09.06 WIB) · putaran 1
- Masukan: peran usul pemeta top-3 tervalidasi di laptop (`MESIN\peran\usul_top3_keluaran.sah.jsonl`, sidik 314e1a00e17e; 92 sah, 2 ditolak "nama peran tidak ada di kutipan"), disalin ke `peran/usul_top3_keluaran.sah.jsonl` dengan sidik sama.
- Kartu provinsi baru (butir 88) `kartu/kartu_prov.py` → `kartu/keluaran/kartu_me3_prov.jsonl`: stunting 35, jaminan kesehatan 38; periksa_kartu 0 pelanggaran. **Status draf**: SSGI 2024 masih `dipakai_kartu: tidak` (G1.3 belum: publikasi kedua independen belum ada); BPS var 2279 belum punya kontrak data dan belum lewat G1.3.
- Rantai: `jalur/rantai_v1.yaml` (9 jalur, 3 per jenis; PUTUSAN ATAS DELEGASI, pilihan peran dan simpul skill = SINTESIS pembangun) → `jalur/rangkai.py` → `jalur/keluaran_jalur_me3.jsonl`; hasil lengkap `uji/G3_1_hasil_14Nov2026.md`.
- Kutipan jalur belajar dan syarat diperiksa terhadap teks dokumen di laptop 14 Nov: 3 dari 3 cocok (perdir-bpjs-26-2021 ×2, juknis-ukur-serentak-2024 ×1).
- **G3.1: LULUS BERSYARAT.** 9 dari 9 jalur lulus tujuh mata rantai dan varian `data` kontrak; ≥2 per jenis. Syarat: (a) kartu stunting dan jaminan kesehatan masih draf; (b) templat langkah pertama belum ditinjau sekali (butir 93).
- **G3.3 putaran 1 (09.06): GAGAL**: tanpa gelar berdokumen hanya stunting.
- **G3.3 putaran 2 (09.08): LULUS.** L0 v4 = v3 + 4 baris: Permensos 10/2019 Pekerja Sosial Masyarakat (Pasal 8: warga negara, kemauan, KTP setempat, usia dewasa, mampu membaca dan menulis, berkelakuan baik, bimbingan teknis dasar; tanpa syarat gelar), Permensos 25/2019 Karang Taruna jo. Permensos 9/2025 (Pasal 18 diubah: rentang usia keanggotaan sekarang 16 sampai 30 tahun, bukan 13 sampai 45 seperti bunyi 2019). Fasilitator verifikasi JKN "berasal dari unsur Potensi dan Sumber Kesejahteraan Sosial atau kader masyarakat" (Perbup Bogor 60/2023). Tanpa gelar berdokumen: stunting (kader posyandu), kemiskinan (karang taruna, PSM), jaminan kesehatan (fasilitator). Nonformal/sukarela ada di ketiganya. Status berlaku Permensos dari pasal.id (sekunder) per 14 Nov 2026; laman resmi peraturan.bpk.go.id belum dibuka.
- Kutipan diperiksa terhadap teks dokumen di laptop 14 Nov 09.08: 7 dari 7 cocok.
- G3.4 lapis 1 (regex vonis + kata kuantitas + digit) dijalankan atas judul, batas, harapan, langkah, ringkasan kesembilan jalur: 0 pelanggaran. Lapis 2 (juri vonis terkalibrasi, ≥100 positif dan ≥100 negatif) belum.
- G3.5: jalur tidak memuat angka upah atau lowongan; tidak ada yang diuji (0 dari 0). Lulus kosong, bukan bukti kemampuan.
- Bukti cara kerja = dokumen resmi L0. Studi kandidat (Banerjee dkk. 2021 JKN; Cahyadi dkk. 2020 PKH) dicatat di rantai, tidak ditayangkan: dua pencarian Notion tidak menemukan barisnya di Evidence DB, jadi status Live belum terbukti.

## Putaran 3 sesudah tinjauan Fable 5.2 (14 Nov 2026 09.24 WIB) · menggantikan klaim putaran 1 dan 2 di atas
Putusan: `uji/KEPUTUSAN_Tinjauan-Fable_14Nov2026.md`. Klaim "G3.1 LULUS BERSYARAT" dan "G3.3 LULUS" di atas dicabut; peninjau menunjukkan validator v1 meloloskan 11 dari 13 rantai rusak.
- Templat v2 (teks peninjau, dibekukan) dan aturan pilih dijalankan kode. Rantai v2 dirender dua mode (dewasa dan c) dan divalidasi terhadap skema keluaran penuh.
- Validator v2: peran dicocokkan pada (kebutuhan, peran, dokumen); bukti minimal satu; peran unik per jenis; seluruh teks dipindai (vonis berimbuhan, kata kuantitas, digit, data pribadi, biaya); kutipan sah hanya bila tercatat di `uji/kutipan_terverifikasi.jsonl` (7 kutipan, dicocokkan di laptop terhadap teks bersidik). Uji negatif tetap `uji/rantai_negatif.py`: 14 dari 14 tertangkap, kontrol lolos. Di luar jangkauan: relevansi simpul skill, nada defisit.
- **G3.1: 1 dari 3 jenis lulus gerbang** (kemiskinan). Jaminan kesehatan dan stunting: 3 dari 3 rantai lulus mekanis, kartu draf (SSGI ditahan G1.3; BPS var 2279 tanpa kontrak).
- **G3.3: 1 dari 3 jenis lulus** (kemiskinan: karang taruna dengan keanggotaan terbuka Permensos 9/2025; PSM dengan daftar syarat Permensos 10/2019 Pasal 8). Jaminan kesehatan dan stunting BELUM: kutipan fasilitator ("kader masyarakat") dan kader posyandu (jalan masuk lewat puskesmas) tidak menyatakan syarat pendidikan. Perlu dokumen syarat kader posyandu (mis. pedoman Posyandu Kemendagri) dan syarat fasilitator.
- **G3.4 lapis 1: 0 pelanggaran pada seluruh teks jalur** (kedua mode). Lapis 2 belum; bersyarat juri beda penyedia (syarat bawaan ME1 H1).
- **G3.2:** angka gerbang = separuh B saja, 26 dari 26, batas bawah Wilson 0,871 (≥0,85, lulus). Separuh A dipakai pengembangan. Elusi B 0 dari 42, batas atas Wilson sekitar 8%, di atas ambang 5%: elusi belum terbukti ≤5% pada separuh bersih. Presisi mode USUL (yang dipakai rantai) belum diukur.
- G3.5: tidak ada angka upah atau lowongan di jalur; tidak ada yang diuji.

## Syarat bawaan ME1 (dipindah 14 Nov dari STATUS_ME1 dan tinjauan Fable)
- H1 juri beda penyedia untuk G1.6, dan berlaku juga untuk G3.4 lapis 2; tenggat: sebelum teks tayang (tahap 2b).
- H2 ukur ulang G1.6 dengan set SU-2c (separuh keluaran penulis produksi); SU-2b dianggap terpakai.
- H3 target ≥30 kandidat ketat untuk G2.3 (sekarang 15).
- H4 v7 diputus dipertahankan (KEPUTUSAN_Tinjauan-Fable B5).
- H5 teks 180 penulis utuh di repo untuk G1.4; juri populasi menuduh lintas mode 6 dari 50.
- S2 sidik masukan kartu, target, kartu keluaran di BEKU: SELESAI 14 Nov.
- S3 `berkas_sha256` penuh di kontrak sakernas dan air minum; `kartu.py` membaca sidik dan URL dari kontrak.
- S4 skema JSON kartu di CI (janji G1.1); `periksa_kartu.py` menolak sidik nol dan URL palsu.
- S5 basis hitung provinsi dicatat di STATUS_ME1: SELESAI 14 Nov.
- S6 manifest gudang mentah (nama, URL, sidik penuh, tanggal unduh, versi alat) masuk repo.
- Tambahan peninjau: G1.4 regex kuantitas meloloskan "dua pertiga", "kebanyakan", "nyaris seluruh" (10 dari 13 frasa uji); diperluas sebelum teks kartu ditulis.

## Antre baru dari tinjauan
- Presisi mode USUL: sampel acak 40 dari 92 usulan, label agen terpisah, cek manusia sebagian.
- Uji dukungan kutipan terhadap klaim peran (gaya ALCE, Gao dkk. 2023, https://arxiv.org/abs/2305.14627).
- Skill berbukti: kutipan dokumen atau kode ESCO/O*NET dengan jembatan KBJI–ISCO-08.
- Jalur belajar resmi (PDDikti kebidanan, kurikulum kader Kemenkes, rekrutmen pendamping PKH).
- Status berlaku dokumen L0 dicek di laman resmi; dokumen nasional untuk peran yang kini berdokumen daerah.

## Putaran 4 (14 Nov 2026 20.18 WIB) · butir 99, syarat resmi tanpa gelar
- Permendagri 13/2024 tentang Posyandu (BPK, sidik 1b7f166422dd) masuk L0 untuk stunting. Pasal 1 angka 8: Kader Posyandu "anggota masyarakat yang bersedia, mampu, dan memiliki waktu" membantu kepala desa/lurah. Definisi ini tidak memuat syarat pendidikan. Kriteria baca tulis di Pasal 8 ayat 2 berlaku untuk pengurus, bukan kader. Jenis bukti baru `definisi_terbuka` (definisi resmi yang memuat kriterianya sendiri) dihitung G3.3. Kutipan dicocokkan di laptop: cocok (8 dari 8 kutipan rantai). Catatan OCR: teks resmi tertulis "desa/Jurah" (salah ketik "lurah" di PDF), kutipan disalin apa adanya.
- **G3.3: 2 dari 3 jenis lulus** (kemiskinan, stunting). Jaminan kesehatan BELUM. Peraturan DJSN 2/2020 (bn1227-2020, sidik 42e1c456fed0) mendefinisikan Kader JKN sebagai mitra BPJS Kesehatan tanpa menyebut syarat pendidikan, tetapi Kader JKN belum ada di keluaran pemeta. Perlu: dokumen syarat Kader JKN atau fasilitator, lalu satu putaran pemeta USUL atas dokumen itu.
- Uji negatif rantai tetap 14 dari 14; cacat mekanis 0.

## Putaran 5 (14 Nov 2026 21.38 WIB) · butir 99 selesai
- L0 v4 + 2 baris jaminan kesehatan: Peraturan DJSN 2/2020 (definisi Kader JKN, mitra BPJS Kesehatan) dan pengumuman rekrutmen Kader JKN BPJS Kesehatan KC Pangkalpinang di portal Pemkab Belitung Timur, 8 Apr 2026 (dokumen daerah; HTML sidik 976910d54460).
- Pemeta USUL (Sonnet, prompt beku PROMPT_PEMETA_v1) atas 3 cuplikan kedua dokumen: 2 usulan (Kader JKN nonformal; Agenalis formal), validasi kutipan di laptop 2 sah 0 ditolak → `peran/usul_jkn2_keluaran.sah.jsonl` (sidik LF 91fba581106a; salinan laptop CRLF 209821429bfd).
- Rantai: `jkn-kader-jkn` ditambah (syarat eksplisit "Pendidikan min. SLTA/sederajat", kutipan cocok di laptop; keyakinan rendah karena satu pengumuman kantor cabang). `jkn-operator` dijadikan cadangan: skema membatasi tiga jalur data per keluaran, dan peran klerikal paling rentan otomasi.
- **G3.3: 3 dari 3 jenis lulus.** G3.1 tetap 1 dari 3 (dua kartu draf). Uji negatif 14 dari 14 (dua mutasi dipindah dari jalur cadangan ke jkn-kader-jkn); cacat mekanis 0.

## Putaran 6 (14 Nov 2026 malam) · butir 95, publikasi kedua untuk kartu JKN provinsi
- Koreksi definisi: BPS var 2279 = persentase penduduk ber-JKN (BPJS PBI, BPJS non-PBI, atau Jamkesda; Susenas Maret 2025), bukan semua jaminan kesehatan. Kartu dan label jalur diperjelas: "tanpa Jaminan Kesehatan Nasional"; yang hanya berasuransi swasta ikut terhitung tanpa JKN. Angka tidak berubah; sidik kartu baru dicatat di BEKU.
- Pencarian publikasi kedua (alat/bps/bps_prov_jkn.py, laptop): domain BPS provinsi, kata kunci "jaminan kesehatan" dan "JKN", tahun 2025. Hasil 33 provinsi terbaca sebelum WebAPI galat 500 berulang: 0 cocok, 4 berselisih (Sumatera Barat 75,12 lawan 78,19 = cakupan kepesertaan administratif; Riau 45,08 lawan 73,30; Banten = tabel rawat inap tertangkap pola; NTT 58,55 lawan 77,45), sisanya tanpa pasangan. Domain nasional hanya memuat var 2279. Indikator Kesejahteraan Rakyat 2025 (BPS, 140 halaman, sidik 1104afc8992b) tidak memuat tabel JKN per provinsi.
- Simpulan: belum ada produk BPS kedua dengan definisi sama. Kartu JKN tetap draf; G1.3 JKN belum. Jalan berikutnya: data kepesertaan BPJS Kesehatan per provinsi (produsen berbeda, definisi administratif) sebagai pembanding tingkat independen dengan toleransi beda definisi yang ditetapkan sebelum dilihat, atau permintaan tabel Susenas ke BPS.

## Pencocok G4 · putaran 1 (14 Nov 2026 23.25 WIB)
- `pencocok/pencocok.py` (deterministik, tanpa model): kartu dipilih aturan tetap (kab/kota pengguna → provinsi → kab/kota lain di provinsi dengan jarak terbesar); kartu draf tidak pernah dipakai; jalur dari rantai v2; urutan tetap. Distress lapis 1 = `src/lib/distress.ts` dibundel esbuild (identik byte dengan salinan server), lewat `pencocok/cek_distress.mjs`.
- Set dibekukan sebelum dinilai (BEKU 23.17): SU-4 84 lari dari 72 persona (mahasiswa dua mode), SU-6 450 pasangan (lima penanda dewasa, wilayah dan medan di dua mode), SU-7 100 distress (40 terang, 60 tersamar) dan 40 jalan lain, ditulis agen Sonnet terpisah yang tidak membuka daftar pemicu.
- Hasil (`uji/G4_hasil_14Nov2026.md`): G4.1 224/224; G4.2 selisih 0 poin di semua penanda keadilan; G4.3 0 lawan 0; G4.6 84/84 identik; G4.7 244/244; G4.10 252/252; G4.5 dan G4.8 lulus bagian validator (juri belum); D1 84/84 lokal; D3 168/252 tanpa gelar berdokumen.
- **G4.4 GAGAL: 44 dari 100 distress ditahan** (terang 34/40, tersamar 10/60). Pencocok hanya memakai lapis 1 (pola kata). Di produksi ada lapis 1b (pengklasifikasi model, penyedia Gemini menurut skema respons di `distressKlasifikasi.ts`); kinerjanya pada SU-7 belum diukur. Positif palsu lapis 1: 0 dari 1.024 teks tanpa distress. SU-7 tidak dipakai menyetel pola (set uji, bukan set pengembangan).
- Catatan keadilan: semua keluaran memakai kebutuhan kemiskinan karena dua kebutuhan lain masih berkartu draf. Selisih nol karena pencocok tidak membaca refleksi selain untuk distress. Uji keadilan menjadi bermakna setelah ada lebih dari satu kebutuhan yang bisa tampil.
