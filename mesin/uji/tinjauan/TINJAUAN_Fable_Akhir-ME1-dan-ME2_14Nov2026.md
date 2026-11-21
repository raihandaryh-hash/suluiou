# TINJAUAN AKHIR · ME1 (Fondasi data) dan gerbang ME2 · mesin eksplorasi Sulu · 14 Nov 2026

Label: SINTESIS peninjau independen (Fable 5.2; bukan penulis; tidak membaca transkrip penulis; tidak membuka set tersembunyi). Repo `/home/claude/suluiou`, cabang `mesin-me1-fondasi` @ 5fae053, pohon kerja bersih sebelum dan sesudah tinjauan. Semua uji perusakan dijalankan di salinan `scratchpad/fable56/`.

Catatan cara kerja: `periksa_gerbang.py` yang diminta dijalankan menulis ulang `kartu_me2.jsonl` dan `kartu_me3_prov.jsonl` di tempat. Hasilnya identik bita demi bita (`git status` kosong), jadi tidak ada perubahan repo.

## 0. Vonis singkat

- **ME1: layak ditutup final sebagai SELESAI BERSYARAT, bukan LULUS penuh.** Tidak ada angka kartu yang salah terhadap masukan (900 dari 900 saya cocokkan). Tidak ada ambang beku yang disunting. Syaratnya: enam butir di §2.3 dicatat sebagai syarat bawaan sebelum penutupan, terutama dua syarat G1.6 yang hilang dari STATUS_ME2 dan STATUS_ME3.
- **Rantai syarat bawaan ME1→ME2→ME3 tidak lengkap.** Lima butir hilang diam-diam (§2.2).
- Bukti terkuat ME1 (G1.2 dari gudang mentah, G1.3, G1.3m) berada di laptop. Dari repo saja bukti itu berupa pernyataan penulis, bukan hasil hitung. Ini batas tinjauan saya, sekaligus celah utama terhadap state of the art.

## 1. Vonis per gerbang

Kolom "Sendiri" = saya jalankan atau hitung sendiri. Kolom "Penulis" = hanya dilaporkan penulis (log laptop, teks STATUS, properti YAML).

### 1.1 ME1

| Gerbang | Vonis | Sendiri | Penulis | Catatan |
|---|---|---|---|---|
| G1.0 akses sumber | LULUS BERSYARAT | 3 kontrak dipakai memuat properti SU-0; `periksa_sumber.py` LULUS | Berkas mentah dan sidiknya di laptop | `air-minum-layak-kabkota.yaml` tidak punya `berkas_sha256`; `sakernas-agustus.yaml` hanya awalan 12 karakter. Sidik penuh hanya ada sebagai konstanta di `kartu/kartu.py:29-32` |
| G1.1 provenans | LULUS BERSYARAT | 900/900 kartu punya `sumber_id`, URL, tahun, sha256 64 heksa, versi skrip `kartu.py@9313726225d8` = sidik berkas sekarang | — | Rencana meminta "Validator JSON Schema di CI"; skema kartu tidak ada (`kontrak/` hanya memuat skema jalur). Validator hanya memeriksa keberadaan field (uji T4, §3 P2) |
| G1.2 reproduksi | LULUS BERSYARAT | L3→kartu: dibangun ulang dua kali (repo dan salinan), sidik b5d29da502d9 sama. Masukan DIKK bersidik 93a658d3d2c4 = `sidik_l3` di log | Mentah→L3 dua jalan identik (`uji/LOG_REPRODUKSI_L3.md`, laptop) | Mentah tidak di repo; dari repo saja pihak ketiga tidak bisa mengulang. Masukan TPT `a_tpt_airminum_2025.json` (59030f661277) adalah cuplikan, bukan L3 (779aa79d7a2e), jadi mata rantainya tidak tersambung sidik |
| G1.3 kebenaran angka | LULUS BERSYARAT | Kartu ⊆ daftar sel beku (490, 410; 0 di luar); 490 nilai kemiskinan ada di `baris_asli` PDF; jumlah miskin kab/kota = baris provinsi 38/38 (toleransi pembulatan) | 490, 410, 160 sel cocok publikasi kedua; 1 ditarik (`uji/LOG_SEL_TERVERIFIKASI.md`) | Tidak bisa saya ulang. Lihat P3: publikasi kedua satu produsen (BPS), dan kelulusan 100% sebagian lahir dari seleksi sel berpasangan |
| G1.3m mutasi | LULUS (dilaporkan penulis) | Sidik set SU-1m tercatat di BEKU sebelum dinilai (urutan commit cocok) | 100/100 di tiga sumber | Pada sel berpasangan, pembanding sama-nilai hampir pasti menangkap mutasi; angka seluruh tabel 26–87/100 (STATUS_ME1) adalah ukuran daya tangkap yang lebih jujur |
| G1.4 nol angka ketikan | LULUS BERSYARAT | 3 kartu fixture: 0 pelanggaran. 900 kartu ME2: teks kosong, jadi uji hampa | 180 teks penulis lolos; "belum utuh di repo" | Uji elusi saya: 10 dari 13 frasa kuantitas lolos regex (§3 P5) |
| G1.5 keandalan | LULUS BERSYARAT | 900/900 `hati_hati` + `rse_tidak_terbit`; AMBANG.yaml tidak berubah | Pencarian RSE BPS nihil | Lulus lewat jalur cadangan beku. Klaim "100% RSE >50% ditekan" tidak bisa diuji untuk sumber ini (diakui `AMBANG_CATATAN.md`). Rujukan ambang 25/50 berasal dari Kementan, bukan BPS |
| G1.6 juri teks | LULUS BERSYARAT (keputusan terkunci) | `PROMPT_JURI_v3.md` dan definisi mode cocok BEKU | Putaran 4 SU-2b: LB TPR ≥0,930, LB TNR ≥0,888 | Dijalankan benar menurut keputusan, tetapi syaratnya tidak diteruskan (§2.2). SU-2b sempat berada di ruang kerja pembangun (`uji/TERSEMBUNYI.sha256` baris 1) |
| G1.7 lisensi | LULUS | Kutipan syarat BPS ada di kontrak kemiskinan; dua kontrak lain merujuknya | — | Validator hanya mencari kata "LULUS". Kutipan diambil dari subdomain kabupaten karena laman pusat menolak akses otomatis. Klausul buku soal tujuan komersial perlu putusan (§5) |

### 1.2 ME2

| Gerbang | Vonis | Sendiri | Penulis | Catatan |
|---|---|---|---|---|
| G2.0 bank | LULUS | 57 kandidat; K1 10, K2 9, K3 9, K4 6, K5 10, K6 6, K7 7; v1 dan v2 cocok BEKU | — | — |
| G2.1 lantai v2 | LULUS BERSYARAT | Dihitung ulang tanpa wilayah induk: kemiskinan 36/38 provinsi, 98,8% penduduk; TPT 32/38, 85,7%; Papua 25/42 dan 7/42 | Angka resmi memakai wilayah induk di luar repo | Aturan diubah sesudah hasil terlihat (§3 P4). Provinsi dihitung "berangka" bila punya ≥1 kab/kota |
| G2.2 konsistensi | LULUS BERSYARAT | Rentang 0–100: 0 gagal dari 900 (1,10–42,56); total kemiskinan 38/38 | Tanda antar-tahun; uji total TPT dan air minum belum | `periksa_konsistensi.py` butuh data laptop, tidak di CI |
| G2.3 stabilitas | LULUS TERBATAS (keputusan terkunci) | `saringan.py --v7`: 15 kandidat; 5/5, 4/5, 4/5, 5/5; lima teratas sama dengan STATUS | Gangguan ±30%, kelonggaran L1–L5 | Dijalankan benar. Label "bukan aturan buta" ditulis jujur di kepala v7 |
| G2.4 pembanding | LULUS BERSYARAT | 900/900 `target_resmi` 2029 (4,5–5,0; 4,00–4,71) = `target_resmi.yaml`; jarak 900/900 terhitung ulang benar | Angka target dibaca dari gambar halaman | Kartu nasional air minum belum ada. Berkas target tidak dibekukan (P2) |
| G2.5 lolos M1 | LULUS BERSYARAT | 900 kartu, 0 pelanggaran `periksa_kartu.py`; tereproduksi | — | Mewarisi semua syarat G1.x; teks belum ada, jadi G1.4 dan G1.6 belum pernah menyentuh kartu ini |

### 1.3 Pencocokan sampel

Seluruh 900 kartu dicocokkan ke `sumber/masukan_kartu/` (nilai, nama, keanggotaan sel, jarak): 0 selisih. Sampel acak 24 kartu (benih 56) ditampilkan dengan baris asalnya, antara lain: 1112 Aceh Barat Daya 13,30; 9428 Mamberamo Raya 35,09; 5321 Malaka 13,52; 3514 Pasuruan 8,21; 1372 Kota Solok 2,91; 6308 Hulu Sungai Utara 4,81 (di dalam rentang target); TPT 7603 Mamasa 2,91; 1673 Kota Pagar Alam 2,19; 6404 Kutai Timur 6,20; 3374 Kota Semarang 5,65; 1509 Bungo 4,33 (di dalam). Semua cocok. Skrip: `scratchpad/fable56/cek.py`.

BEKU.sha256: 37 berkas repo cocok dengan baris terakhirnya; 0 berubah; 0 hilang. 15 entri `laptop:` tidak bisa diperiksa. `AMBANG.yaml` hanya punya satu commit (e126e89, 12 Nov 18.22).

## 2. Vonis tonggak

### 2.1 ME1
Layak ditutup final dengan status SELESAI BERSYARAT. Alasan: angka kartu benar terhadap masukan, pembekuan utuh, sumber yang gagal ditahan (bukan dipaksa lulus), dan kelemahan dicatat terbuka oleh penulis. Alasan bukan LULUS penuh: lima dari sembilan gerbang G1 bersandar pada bukti yang tidak bisa diulang dari repo, dan G1.4 serta G1.6 belum pernah diuji pada teks kartu produksi karena teksnya belum ada.

### 2.2 Syarat yang hilang diam-diam

| # | Syarat | Tercatat di | Hilang di | Bukti |
|---|---|---|---|---|
| H1 | Juri beda penyedia (G1.6) | STATUS_ME1 baris 4, 31, 37 | STATUS_ME2 dan STATUS_ME3 | `grep -i "beda penyedia\|SU-2c\|Gemini"` atas kedua berkas: 0 baris |
| H2 | Ukur ulang G1.6 dengan SU-2c (separuh keluaran penulis produksi) | STATUS_ME1 baris 4, 31 | STATUS_ME2 dan STATUS_ME3 | sama |
| H3 | Target ≥30 kandidat ketat untuk G2.3 ("dibawa ke tonggak berikut") | STATUS_ME2 baris G2.3 | Daftar syarat STATUS_ME2 (6 butir) dan STATUS_ME3 (5 butir) | tidak ada di kedua daftar |
| H4 | Butir 6 STATUS_ME2: v7 adalah putusan atas delegasi yang perlu disampaikan ke Raihan | STATUS_ME2 baris 13 | STATUS_ME3 "Syarat bawaan ME2" (5 butir) | butir 6 tidak diteruskan; tidak ada catatan jawaban Raihan |
| H5 | 180 teks penulis belum utuh di repo (G1.4); juri populasi menuduh lintas mode 6/50 "dicatat untuk ME2" | STATUS_ME1; `juri/hasil/KALIBRASI.md` | STATUS_ME2 dan STATUS_ME3 | tidak ada |

Tambahan: STATUS_ME2 baris 3 menyebut "Tinjauan akhir ME1 oleh Raihan masih terbuka"; STATUS_ME3 tidak menyebutnya. ME3 juga mencatat G3.4 lapis 2 (juri vonis) belum; itu juri kedua yang akan memerlukan syarat H1.

### 2.3 Syarat penutupan ME1 yang saya usulkan
1. H1–H5 ditulis ke STATUS_ME3 sebagai "Syarat bawaan ME1" dengan tonggak tujuan yang eksplisit.
2. Sidik tiga berkas `sumber/masukan_kartu/`, `target_resmi.yaml`, dan `kartu_me2.jsonl` masuk BEKU.sha256 (P2).
3. `berkas_sha256` penuh ditulis di kontrak sakernas dan air minum; `kartu.py` membaca sidik dan URL dari kontrak (P6).
4. Skema JSON kartu ditulis dan dijalankan di CI (janji G1.1).
5. STATUS_ME1 diperbarui: angka provinsi (34 dan 31 menurut kode lama; 36 dan 32 menurut skema 38) disebut dengan basisnya.
6. Manifest gudang mentah (nama berkas, URL, sidik penuh, tanggal unduh, versi alat) masuk repo (P1).

## 3. Temuan berperingkat

### Kritis
Tidak ada temuan yang menunjukkan angka salah atau ambang disunting.

### Penting

**P1. Syarat G1.6 hilang dari rantai tonggak.** Bukti: §2.2 H1–H2. Dampak: keputusan Raihan "ditunda ke tahap kedua" terlaksana sebagai penundaan tanpa pemilik; ME2 ditutup tanpa menyentuhnya, dan ME3 akan menulis teks kartu serta memakai juri vonis dengan juri satu keluarga model yang set tersembunyinya pernah bocor ke ruang kerja pembangun. Perbaikan: bagian "Syarat bawaan ME1" di STATUS_ME3; gerbang teks apa pun (G1.4 pada teks nyata, G1.6, G3.4 lapis 2) ditahan sampai SU-2c dinilai; arti "tahap kedua" dikonfirmasi (§5).

**P2. Gerbang reproduksi tidak mengikat masukan.** Bukti (salinan): satu nilai di `dikk2025_tabel21.csv` saya ubah (Simeulue 15,52 → 51,52). Tanpa bangun ulang, gerbang GAGAL "G2.5: kartu ME2 tidak tereproduksi" (benar). Sesudah `bangun_kartu_me2.py` dijalankan, gerbang tidak lagi melaporkan G2.5 dan kartu memuat 51,52. Hal sama untuk target TPT yang saya ubah menjadi 1,00–1,10. (Kegagalan G3.1 di salinan adalah artefak: `jalur/rangkai.py:18` membaca `src/data/skillMapContent.ts` di luar `mesin/`.) Sebab: `periksa_gerbang.py:53-58` membandingkan kartu dengan hasil bangun ulang dari masukan yang sama; sidik masukan (93a658d3d2c4, 59030f661277, a3c2ffb8b234) dan sidik kartu (b5d29da502d9) hanya ada sebagai prosa di STATUS_ME2. Dampak: commit yang mengubah masukan dan kartu sekaligus lolos CI; klaim "angka dapat direproduksi dari berkas resmi bersidik" (D2) putus di mata rantai mentah→masukan. Perbaikan: masukkan keempat sidik dan `target_resmi.yaml` ke BEKU.sha256; gerbang membandingkan sidik kartu dengan nilai tercatat, bukan dengan berkas itu sendiri.

**P3. G1.0, G1.3, G1.3m, G1.7 di CI adalah pencocokan kata atas tulisan penulis.** Bukti: `alat/periksa_sumber.py` baris `g10 = "LOLOS" in ...`, `g13 = ...startswith("lulus")`, `g17 = "LULUS" in ...`, `g13m = "LULUS" in ...`. `periksa_kartu.py` menerima kartu yang seluruh sha256-nya saya ganti `000…0`, URL `x`, tahun 1999, satu nilai 99,0 dengan pembanding diganti median: "900 kartu, 0 pelanggaran" (uji T4). Dampak: gerbang hijau tidak membuktikan G1.3; ia membuktikan penulis menulis "lulus". Dua kelemahan isi G1.3 yang terkait: (a) publikasi kedua adalah tabel BPS provinsi dan kab/kota, satu produsen dengan sumber utama, sehingga yang teruji adalah pengurai dan salin-tempel, bukan angka sumber; standar ini lebih longgar daripada yang dipakai untuk menahan SSGI ("publikasi kedua independen belum ada"); (b) sel tanpa pasangan dibuang, jadi "0 berselisih" sebagian adalah hasil seleksi; uji ulang sampel segar sesudah penarikan Kota Pangkalpinang tidak saya temukan catatannya. Perbaikan: log keluaran alat laptop disimpan sebagai berkas bersidik yang dibaca gerbang (jumlah cocok, berselisih, tanpa pasangan, sidik masukan), ditandatangani atau setidaknya dibekukan; `periksa_kartu.py` mencocokkan `sha256`, `url`, `tahun_data` ke kontrak sumber; definisi "publikasi kedua" ditulis satu kali dan dipakai sama untuk semua sumber.

**P4. G2.1 diubah sesudah hasil terlihat, dan AMBANG.yaml tidak mencerminkannya.** Bukti: `AMBANG.yaml` `G2.1_lantai_provinsi: 34`; `uji/G2_1_v2.md` (15.30, sesudah TPT diketahui 32/38) menambah jalur "≥80% penduduk"; `periksa_g2.py` memakai `len(pv) >= 34 or pdd >= 0.80`. Prinsipnya KEPUTUSAN Raihan; angka 80% PUTUSAN ATAS DELEGASI yang dipilih saat cakupan TPT (86%) sudah diketahui. Aturan pembekuan rencana §4 berbunyi ambang yang berubah sesudah hasil terlihat membatalkan gerbang. Tidak ada catatan di `AMBANG_CATATAN.md`. Penyebut penduduk diturunkan dari jumlah miskin ÷ P0, bukan dari proyeksi penduduk resmi. Dampak: TPT tayang per daerah atas ambang yang tidak buta, dengan Papua 7/42. Perbaikan: catat G2.1 v2 di `AMBANG_CATATAN.md` dengan label sama jujurnya dengan kepala v7; minta Raihan mengunci 80% (§5); ganti penyebut dengan proyeksi penduduk BPS.

**P5. G1.4 belum teruji pada teks nyata, dan regexnya mudah dilewati.** Bukti: `periksa_kartu.py:48` hanya memeriksa teks bila `judul` terisi; 900/900 kosong. Uji elusi pada kartu fixture lewat `kartu.periksa_teks`: lolos "Dua pertiga balita…", "Tiga perempat keluarga…", "Kebanyakan…", "Nyaris seluruh…", "Hampir seluruh…", "Satu di antara empat…", "Lebih dari sebagian…", "Sebagian kecil…", "Umumnya…", "Tertinggi di provinsi ini"; tertangkap hanya "dua kalinya" dan "berlipat". Rencana memang menyerahkan sisa ini ke juri kuantitas G1.6, yang justru bersyarat (P1). Dampak: begitu teks ditulis di ME3, lapis deterministik tidak menahan pecahan dan superlatif. Perbaikan: tambah `pertiga|perempat|perlima|per \w+|di antara|kebanyakan|umumnya|nyaris|hampir seluruh|sebagian kecil|ter(tinggi|rendah|banyak|sedikit)` ke `KATA_KUANTITAS` sebagai versi baru daftar; simpan 180 teks penulis di repo; uji mutasi regex masuk CI.

**P6. Provenans kartu memakai konstanta, bukan metadata pengambilan.** Bukti: `kartu/kartu.py:62` `tanggal_akses="2026-11-13"` sebagai nilai bawaan; `kartu.py:23-32` kamus `SUMBER` berisi URL dan sidik yang diketik di kode, terpisah dari kontrak YAML; `kartu.py:73` `"metode": "langsung"` untuk semua sel, padahal `su1m.py:6` mengenal jenis `sae_ditukar` dan kontrak kemiskinan menyebut estimasi kab/kota "diturunkan dari P0 provinsi". Sidik di kartu TPT (8688b81a…) menunjuk berkas mentah laptop, sedangkan kartu dibangun dari cuplikan 59030f66… yang tidak disebut di kartu. Dampak: empat field provenans benar hari ini karena kebetulan cocok, bukan karena diturunkan; sumber kebenaran ganda akan menyimpang pada pembaruan data pertama. Perbaikan: pengunduh menulis berkas `*.meta.json` (URL, waktu, sidik, ukuran); pembangun kartu membaca dari sana dan dari kontrak; `metode` diisi dari sumber atau dikosongkan dengan alasan.

### Kecil

- K1. `STATUS_ME1.md` baris 7: kalimat judul tabel rusak ("…ukuran sama)., hanya sel yang cocok…"). Angka provinsi ME1 (34, 31) dan ME2 (36, 32) memakai basis berbeda tanpa keterangan.
- K2. Semua kontrak sumber berstatus `draft`, tanpa blok `schema` dan `quality`; isi gerbang ditaruh sebagai prosa di `customProperties`. Bentuknya ODCS, fungsinya belum kontrak yang bisa dijalankan.
- K3. `.github/workflows/mesin-gerbang.yml`: `pip install` tanpa versi; aksi dirujuk dengan tag, bukan SHA; filter jalur `mesin/**` tidak mencakup `src/data/skillMapContent.ts` yang dibaca gerbang. Versi `pdftotext` hanya disebut di komentar `parser/dikk_2025.py:5` (xpdf 4.06), tidak diperiksa saat jalan.
- K4. `kartu.py:52` parameter `arah_buruk` tidak dipakai; arah `di_bawah` pada TPT berarti lebih baik daripada target, tetapi kartu tidak membawa makna itu. `konteks.median_nasional` adalah nilai tengah tak berbobot antar-kab/kota, bukan angka nasional; namanya menyesatkan.
- K5. `periksa_gerbang.py` menulis ulang berkas keluaran di pohon kerja. Bangun ke direktori sementara lalu bandingkan.
- K6. Status `siap_tinjau` belum punya arti di skema (sudah tercatat sebagai syarat ME2 butir 5).
- K7. Hanya dua jenis kebutuhan berkartu dan keduanya K5. Ini bukan cacat ME1, tetapi fondasi belum pernah diuji pada sumber non-BPS, sumber ber-RSE, atau data administratif.

## 4. Menuju state of the art

Rujukan di bawah saya ketahui pasti keberadaannya; bagian yang saya tidak yakin tidak saya tulis.

**Data contract**
1. Kontrak yang dijalankan, bukan dibaca. Isi blok `schema` dan `quality` ODCS (tipe kolom, rentang 0–100, keunikan `kode_bps`, jumlah baris 514) lalu uji dengan alat, sehingga G2.2 rentang dan G1.1 menjadi hasil kontrak. Rujukan: Open Data Contract Standard, https://bitol-io.github.io/open-data-contract-standard/ ; Data Contract CLI, https://github.com/datacontract/datacontract-cli.
2. Skema JSON untuk Kartu Kebutuhan (JSON Schema 2020-12, sama seperti kontrak jalur) dengan enumerasi `status`, pola sha256, dan `format: uri`. Rujukan: https://json-schema.org/draft/2020-12.
3. Deskriptor tabel untuk berkas L3 dan masukan kartu. Rujukan: Frictionless Table Schema dan Data Package, https://specs.frictionlessdata.io/table-schema/ dan https://datapackage.org/.
4. Versi kontrak naik saat sel atau target berubah, dan gerbang menolak perubahan yang memutus tanpa kenaikan versi.

**Provenans**
5. Catatan asal per kartu dalam model baku: entitas (berkas mentah, L3, masukan, kartu), aktivitas (unduh, urai, bangun), agen (skrip bersidik, orang). Rujukan: W3C PROV-O, https://www.w3.org/TR/prov-o/. Untuk rantai pipa: OpenLineage, https://openlineage.io/.
6. Atestasi yang bisa diverifikasi untuk langkah yang terjadi di laptop: predikat provenans berisi sidik masukan, sidik keluaran, perintah, dan versi alat, ditandatangani. Ini menutup P3 tanpa memindahkan data mentah. Rujukan: SLSA Provenance, https://slsa.dev/spec/v1.0/provenance ; in-toto, https://in-toto.io/ ; Sigstore, https://www.sigstore.dev/.
7. Bukti waktu pembekuan di luar kendali penulis. Sekarang urutan "beku sebelum dinilai" bersandar pada jam commit lokal dan kepercayaan bahwa riwayat tidak ditulis ulang. Rujukan: OpenTimestamps, https://opentimestamps.org/ ; RFC 3161, https://www.rfc-editor.org/rfc/rfc3161. Langkah murah: cabang dilindungi dan commit bertanda tangan.
8. Sitasi yang menunjuk rilis tetap: sidik berkas ditambah salinan arsip untuk URL yang bisa berubah (lampiran RPJMN sudah membalas 404 menurut `target_resmi.yaml`).

**Reproduksi**
9. Gudang mentah beralamat-isi dengan penunjuk di repo, sehingga siapa pun yang berhak bisa menarik berkas persis dan CI bisa memeriksa sidik tanpa menyimpan data. Rujukan: DVC, https://dvc.org/doc.
10. Lingkungan terkunci: versi paket dengan sidik (`pip install --require-hashes`, https://pip.pypa.io/en/stable/topics/secure-installs/), versi `pdftotext` diperiksa saat jalan, aksi CI disemat ke SHA (GitHub, Security hardening for GitHub Actions, https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions).
11. Keluaran deterministik tanpa nilai waktu tersembunyi: `tanggal_akses` berasal dari metadata unduhan, bukan nilai bawaan. Rujukan prinsip: https://reproducible-builds.org/docs/source-date-epoch/.
12. Paket reproduksi satu perintah dari mentah ke kartu, dikemas dengan metadata. Rujukan: RO-Crate, https://www.researchobject.org/ro-crate/ ; prinsip FAIR, https://www.go-fair.org/fair-principles/.
13. Verifikasi oleh pihak yang tidak memegang kunci penulis: satu jalan ulang penuh mentah→kartu oleh pemeriksa di mesin lain, dicatat sebagai atestasi kedua.

Urutan termurah dengan dampak terbesar: butir 2, lalu sidik masukan di BEKU (P2), lalu butir 6, lalu butir 9.

## 5. Keputusan yang hanya bisa diambil Raihan

1. **Arti "tahap kedua" untuk juri beda penyedia.** Penulis menafsirkannya ME2; ME2 sudah ditutup tanpa itu. Pilihan: (a) wajib sebelum teks kartu pertama dinilai di ME3; (b) wajib sebelum ME4 atau tayang; (c) dilepas dengan risiko diterima tertulis. Butuh akses API penyedia lain.
2. **Angka 80% pada G2.1 v2.** Sekarang putusan atas delegasi yang dipilih saat hasil TPT sudah terlihat. Kunci, ubah, atau kembalikan TPT ke kartu nasional saja. Sertakan apakah TPT layak tayang per daerah dengan Papua 7 dari 42.
3. **Metode v7 (target 2029).** Butir 6 STATUS_ME2 menunggu tanggapan; tidak ada catatan jawaban. Sahkan sebagai KEPUTUSAN atau balik ke v6.
4. **Definisi "publikasi kedua".** Apakah tabel BPS lain atas estimasi yang sama cukup (maka SSGI bisa dinilai dengan ukuran yang sama), atau harus produsen berbeda (maka kemiskinan, TPT, air minum lulus dengan catatan batas).
5. **Klausul komersial buku BPS.** Kontrak kemiskinan mencatat larangan mereproduksi isi buku untuk tujuan komersial tanpa izin tertulis. Perlu pernyataan posisi IOU/Sulu (nonkomersial atau minta izin).
6. **Penutupan ME1.** Tutup sebagai SELESAI BERSYARAT dengan enam syarat §2.3, atau tahan sampai butir 1–4 §2.3 selesai.

## 6. Batas tinjauan

- Tidak diperiksa: berkas mentah, L3, set SU-1m, keluaran juri, dan wilayah induk (semuanya di laptop); isi set tersembunyi (dilarang); kebenaran angka terhadap terbitan BPS di web (tidak saya buka).
- G3.2 dinilai hanya dari sisi hitungan: 63/63 memberi batas bawah Wilson 0,943 dan 26/26 memberi 0,871 (saya hitung ulang; cocok). n = 63 dan cakupan 42% dilaporkan sesuai keputusan. `AMBANG.yaml` tetap `n: 100` dengan tambahan protokol beku terpisah, cara yang benar.
- Vonis pemeriksa sebelumnya dibaca sebagai data. Temuan B1 mereka (kode keluar pembangun) memang sudah diperbaiki; P2 di atas adalah celah berbeda pada mekanisme yang sama.
