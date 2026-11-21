# TINJAUAN · Templat langkah pertama dan kemajuan ME3 · 14 Nov 2026

**Peninjau:** Fable 5.2, independen (bukan penulis). **Label:** Tugas 1 = tinjauan sekali (rencana §4.4), Tugas 2 = SINTESIS peninjau.
**Objek:** repo `/home/claude/suluiou`, folder `mesin/`, keadaan 14 Nov 2026 09.09 WIB.
**Cara kerja:** hanya baca. Semua perintah dijalankan di salinan `scratchpad/fable93/repo` karena `periksa_gerbang.py` dan `rangkai.py` menulis ulang berkas keluaran. Sidik seluruh berkas `mesin/` sebelum dan sesudah tinjauan sama (repo tidak berubah). Transkrip penulis dan set uji tersembunyi tidak dibuka.
**Skrip uji negatif:** `/tmp/claude-0/-home-claude/24ad2657-1416-5975-bcd6-c67e5e357b4e/scratchpad/fable93/uji_negatif.py`

---

## 0. Ringkasan vonis

| Objek | Vonis |
|---|---|
| `amati_dan_tanya` | UBAH |
| `baca_pedoman` | UBAH |
| `tanya_orang_dekat` | UBAH |
| `daftar_kegiatan` | UBAH (kecil) |
| `aturan_pilih` | UBAH (substansial; bunyi sekarang tidak dijalankan kode dan dilanggar rantai) |
| G3.1 LULUS BERSYARAT | Layak hanya sebagai "lulus mekanis"; belum layak disebut lulus gerbang. Validatornya meloloskan 11 dari 13 rantai rusak yang saya suntikkan |
| G3.3 LULUS | Belum layak. Bersandar pada kutipan yang tidak diperiksa di repo dan pada tebakan jenis peran |
| G3.2 LULUS | Layak menurut protokol + tambahan 1, dengan catatan angka bersih = separuh B saja (26 dari 26, Wilson 0,871) |

Semua teks pengganti di bawah sudah saya uji terhadap `KATA_KUANTITAS` (`mesin/kontrak/buat_kontrak.py:7`), regex vonis (`mesin/jalur/rangkai.py:24`), dan larangan digit: nol pelanggaran.

---

## 1. TUGAS 1 · Tinjauan sekali templat (mengikat)

### 1.1 `amati_dan_tanya` → UBAH

Alasan:
1. "Amati apa yang dikerjakan {peran}" di kantor desa tidak bisa dikerjakan untuk empat jalur yang memakainya. Pendamping PKH, PSM, TPK, dan fasilitator verifikasi tidak berkantor tetap di kantor desa. Mengamati petugas bekerja juga terasa mengawasi.
2. Hasil render canggung: "paling butuh bantuan untuk tumbuh kembang balita" (`keluaran_jalur_me3.jsonl`, jalur `stunting-tpk`).
3. Tidak ada pengaman bagi pengguna yang datang sendirian ke kantor asing.

Teks pengganti:

> Datangi {tempat} di dekat tempat tinggalmu pada jam layanan, bila perlu bersama orang yang kamu percaya. Sampaikan bahwa kamu ingin mengenal pekerjaan {peran}, lalu tanyakan satu hal: bantuan seperti apa yang paling terasa manfaatnya bagi {kebutuhan_ringkas}.

Field: `paling_lama_hari: 14`, `butuh_orang_lain: true`, `cocok_untuk: [formal, nonformal]`. Tambahan wajib: `mode_c: false` (tidak dipakai untuk pengguna di bawah 18) dan `butuh_tempat: true` (validator menolak bila `tempat` kosong; lihat uji N11).

### 1.2 `baca_pedoman` → UBAH

Alasan:
1. "Tulis tiga hal yang sudah bisa kamu lakukan" mengandaikan pengguna sudah mampu. Untuk bidan atau operator SIKS-NG jawaban jujur seorang siswa bisa "tidak ada", dan itu mengecilkan (aturan 5 Jalan Tengah).
2. "Bagian tugas {peran} di pedoman resmi" tidak selalu ada. Untuk `stunting-bidan` dokumennya Perpres 72/2021 dan kutipan perannya hanya "tenaga kesehatan paling sedikit mencakup bidan" (`usul_top3_keluaran.sah.jsonl`); tidak ada bagian tugas bidan untuk dibaca.
3. Ini satu-satunya templat `butuh_orang_lain=false`, jadi ia memikul seluruh aturan 1. Langkahnya harus selalu bisa dikerjakan.

Teks pengganti:

> Buka dokumen resmi yang tercantum pada jalur ini dan cari bagian yang menyebut {peran}. Tulis dengan kata-katamu sendiri apa yang dikerjakan peran itu, satu hal yang membuatmu tertarik, dan satu hal yang ingin kamu pelajari.

Field: `paling_lama_hari: 7`, `butuh_orang_lain: false`, `cocok_untuk: [formal, nonformal, sukarela]`, `mode_c: true`. Syarat validator: templat ini hanya sah bila dokumen peran punya `url` tidak kosong di L0 dan dokumen itu memuat nama peran (sudah dijamin validator kutipan pemeta).

Catatan terbuka (bukan syarat vonis): membaca Perbup atau Perdir berpuluh halaman adalah langkah mandiri yang berat untuk remaja. Juri G4.9 mode "langkah mandiri remeh atau salah tanda" perlu mengujinya. Usul untuk v2: sertakan letak (pasal atau halaman) dari kutipan pemeta.

### 1.3 `tanya_orang_dekat` → UBAH

Alasan:
1. "Orang yang kamu percaya" terlalu longgar untuk pengguna di bawah 18; bisa berarti kenalan daring. Rencana membatasi mode (c) pada guru BK, orang tua, career center, orang terdekat.
2. Langkah ini berujung pada perkenalan dengan pihak ketiga tanpa pendamping.
3. "Pernah menjadi {peran}" rusak untuk peran berbentuk organisasi atau tim: "pernah menjadi karang taruna", "pernah menjadi tim pendamping keluarga".

Teks pengganti:

> Ceritakan jalur ini kepada orang tua, wali, guru BK, atau orang dewasa lain yang kamu percaya, lalu tanyakan apakah mereka mengenal {peran}. Bila ada, minta mereka menemanimu berkenalan.

Field: `paling_lama_hari: 7`, `butuh_orang_lain: true`, `cocok_untuk: [formal, nonformal, sukarela]`, `mode_c: true`.

### 1.4 `daftar_kegiatan` → UBAH (kecil)

Alasan: "menonton" tidak pantas untuk kegiatan posyandu (penimbangan balita keluarga lain). Selebihnya layak.

Teks pengganti:

> Cari tahu di {tempat} kapan kegiatan berikutnya yang melibatkan {peran}, lalu tanyakan apakah warga boleh hadir untuk melihat atau ikut membantu.

Field: `paling_lama_hari: 21`, `butuh_orang_lain: true`, `cocok_untuk: [nonformal, sukarela]`, `mode_c: false`, `butuh_tempat: true`.

### 1.5 `aturan_pilih` → UBAH

Temuan:
1. **Mode (c) tidak punya langkah mandiri pada jalur data.** Aturan "mode (c) → tanya_orang_dekat saja" memberi `butuh_orang_lain=true` pada semua jalur data. Kontrak (`buat_kontrak.py:77`) menuntut ≥1 jalur `butuh_orang_lain=false` per keluaran berstatus ok. Untuk siswa syarat itu hanya bisa dipenuhi jalur cipta atau jalan lain, bukan jalur data. Skema lolos, semangat aturan 1 tidak.
2. **Dewasa pun bolong per jenis.** Di rantai sekarang: kemiskinan 0 dari 3 jalur mandiri; stunting 1 dari 3 dan itu bidan (butuh pendidikan profesi); jaminan kesehatan 2 dari 3. Sumber: kolom `butuh_orang_lain` di `keluaran_jalur_me3.jsonl`.
3. **Aturan tidak dijalankan kode.** `rangkai.py:44` membaca `r["templat"]` yang ditulis tangan di rantai. Empat dari sembilan jalur menyimpang dari bunyi aturan: `jkn-fasilitator`, `miskin-pendamping-pkh`, `miskin-psm`, `stunting-tpk` berjenis nonformal dan `tempat` diketahui, menurut aturan seharusnya `daftar_kegiatan`, yang dipakai `amati_dan_tanya`.
4. **Cabang "selain itu amati_dan_tanya" buntu.** Cabang itu berlaku saat `tempat` tidak diketahui, padahal `amati_dan_tanya` juga butuh `{tempat}`. Uji N11: render "Datangi  terdekat" dan tetap LULUS.
5. **`orang_untuk_ditanya` tidak siap mode (c).** Delapan dari sembilan jalur memakai `komunitas` atau `praktisi`, yang dilarang skema untuk mode (c) (`buat_kontrak.py:88-89`). Sesudah disaring, `jkn-operator` dan `miskin-psm` tidak punya kontak sama sekali (melanggar `minItems: 1`). Tidak ada satu pun jalur yang menawarkan `guru_bk` atau `orang_tua`.

Teks pengganti:

> Dewasa: nonformal/sukarela → daftar_kegiatan bila {tempat} diketahui, selain itu tanya_orang_dekat; formal → baca_pedoman; amati_dan_tanya hanya bila {tempat} diketahui dan peran memang bertugas di tempat itu. Mode (c): baca_pedoman atau tanya_orang_dekat saja. Di tiap jenis kebutuhan dan tiap mode, minimal satu jalur memakai baca_pedoman (langkah mandiri); validator menolak bila tidak ada.

Syarat penerapan (mengikat bersama vonis):
- Aturan dijalankan `rangkai.py`, bukan ditulis tangan per jalur; penyimpangan = GAGAL.
- Tiap jalur membawa daftar kontak mode (c) tersendiri dari {guru_bk, orang_tua, career_center, orang_terdekat}, minimal satu.
- Rantai dirender dan divalidasi dua kali, sekali per mode, terhadap skema keluaran penuh (bukan hanya varian `data`).

### 1.6 Hasil render (bukan isi templat, tetapi merusak teks tayang)

| Gejala | Bukti | Perbaikan |
|---|---|---|
| Akronim menjadi huruf kecil: "pendamping pkh", "operator siks-ng" | `rangkai.py:46` `.lower()`; `keluaran_jalur_me3.jsonl` jalur `miskin-pendamping-pkh`, `jkn-operator` | Tambah field `peran_frasa` per jalur di rantai (mis. "pendamping PKH", "anggota tim pendamping keluarga", "pengurus atau anggota karang taruna"); jangan `.lower()` |
| "tenaga pemasar/relationship officer" | jalur `jkn-pemasar` | `peran_frasa: "tenaga pemasar"` |
| Mubazir: "Cari tahu di posyandu kapan kegiatan berikutnya yang melibatkan kader posyandu" | jalur `stunting-kader-posyandu` | `peran_frasa: "kader"` untuk jalur ini |
| Ringkasan memakai wilayah yang tidak ada hubungannya dengan dokumen peran: "Di Kab. Supiori" dengan peran dari Perbup Pringsewu; "Di Jambi" dengan Perbup Bogor | `keluaran_jalur_me3.jsonl` | Lihat temuan P4 |

---

## 2. TUGAS 2 · Tinjauan kemajuan ME3

### 2.1 Keluaran perintah

`python3 mesin/alat/periksa_gerbang.py` (salinan): `LULUS gerbang deterministik`, rc 0. Baris ME3: `G3.1: LULUS BERSYARAT (semua jalur lulus mekanis: True; ≥2 per jenis: True)`, `G3.3: LULUS`; validator kutipan `sah 1 ditolak 3`; kontrak `sesuai: 27 dari 27`.
`python3 mesin/jalur/rangkai.py` (salinan): rc 0; keluaran identik byte demi byte dengan `mesin/uji/G3_1_hasil_14Nov2026.md` dan `mesin/jalur/keluaran_jalur_me3.jsonl` di repo. Reproduksi terbukti.

Hitungan Wilson di STATUS saya hitung ulang: 22/22 → 0,851; 36/36 → 0,904; 26/26 → 0,871; 63/63 → 0,943. Semua cocok.

### 2.2 Uji negatif validator rantai (13 mutasi + 1 kontrol)

Tiap mutasi diterapkan pada salinan `rantai_v1.yaml`, lalu `rangkai.py` dijalankan.

| # | Rantai rusak yang disuntikkan | Hasil | Harapan |
|---|---|---|---|
| N1 | Skill bidan diganti simpul `klerikal` ("mengetik cepat") | LULUS | gagal |
| N2 | `jkn-operator` diberi peran "Bidan" dari Perpres 72/2021 (peran milik stunting) | LULUS | gagal |
| N3 | `bukti: []` di kesembilan jalur | LULUS | gagal |
| N4 | `orang.cara`: "kirim foto KTP dan nomor ponselmu ke admin lalu bayar biaya pendaftaran" | LULUS | gagal |
| N5 | Kontrol: bidan (formal) dengan templat `daftar_kegiatan` | GAGAL | gagal (benar) |
| N6 | Kutipan jalur belajar karangan | LULUS (dengan syarat cetak) | gagal |
| N7 | G3.3 stunting disandarkan pada kutipan karangan "bidan tidak memerlukan pendidikan apa pun" | G3.3 LULUS | gagal |
| N8 | Vonis di `orang.cara` ("kamu wajib datang; ini satu-satunya jalan dan tanggung jawabmu") + "Kursus 3 bulan berbayar 500 ribu" di nama jalur belajar | LULUS | gagal |
| N9 | Tiga jalur kemiskinan = peran yang sama, beda id | LULUS | gagal |
| N10 | Harapan "Ini kewajibanmu; kamu harus jadi bidan, kalau tidak kamu mengecewakan orang tuamu"; judul "Hanya ini jalanmu, jangan pilih yang lain" | LULUS | gagal |
| N11 | `amati_dan_tanya` tanpa `tempat` → "Datangi  terdekat" | LULUS | gagal |
| N12 | Semua jalur `tanya_orang_dekat` (keadaan mode c) | LULUS | di luar cakupan rangkai; tidak ada pemeriksa lain |
| N13 | Harapan "Hampir tak ada yang berhasil; kebanyakan warga tetap miskin seumur hidup" | LULUS | wilayah juri lapis 2 (belum ada) |
| N14 | Harapan "x", batas kosong | GAGAL | gagal (benar) |

Kesimpulan: validator menangkap bentuk (skema, templat vs jenis peran, panjang teks), tidak menangkap isi. "9 dari 9 lulus tujuh mata rantai" membuktikan berkas terisi rapi, belum membuktikan rantainya benar.

### 2.3 Temuan berperingkat

#### KRITIS

**K1 · Validator G3.1 meloloskan rantai tanpa bukti, peran salah jenis, dan jalur kembar.**
Bukti: N2, N3, N9. `rangkai.py:65` memeriksa (nama, doc_id) ada di berkas sah tanpa mencocokkan `kebutuhan`; `rangkai.py:76` `all(... for b in r["bukti"])` bernilai benar untuk daftar kosong; tidak ada cek keunikan peran per jenis.
Dampak: gerbang "≥2 jalur dengan tujuh mata rantai" bisa lulus dengan satu peran yang disalin dan nol bukti.
Perbaikan: (a) peran dicocokkan pada tiga kunci (kebutuhan, peran, doc_id); (b) `bukti` minimal satu atau `bukti_label` "kosong berlabel" eksplisit; (c) peran unik per jenis; (d) ketiga mutasi dijadikan uji negatif tetap di `periksa_gerbang.py`, seperti pola `uji/validasi_kutipan`.

**K2 · Teks yang sampai ke pengguna tidak seluruhnya dipindai.**
Bukti: N4, N8, N10. `rangkai.py:81` hanya memindai judul, batas, harapan, langkah, ringkasan. `orang_untuk_ditanya.cara`, `jalur_belajar.nama`, `skill.nama`, `peran_contoh.nama` lolos tanpa pindai. Regex vonis memakai batas kata sehingga "kewajibanmu", "mewajibkan", "harus jadi", "hanya ini jalanmu" lolos. Tidak ada pemindai permintaan data pribadi atau pembayaran.
Dampak: klaim STATUS baris 50 "G3.4 lapis 1 ... 0 pelanggaran" benar untuk lima field, bukan "seluruh teks" seperti bunyi G3.4. Untuk pengguna di bawah 18, `cara` yang meminta KTP atau nomor ponsel adalah celah keselamatan.
Perbaikan: pindai semua field string pada objek jalur secara rekursif; perluas regex ke bentuk berimbuhan (wajib, kewajiban, mewajibkan, diwajibkan; "harus" + kata ganti orang kedua; "hanya ini", "tidak ada jalan lain"); tambah daftar larangan data pribadi dan biaya (KTP, NIK, nomor ponsel, alamat rumah, foto diri, bayar, biaya, transfer); lapis 2 juri tetap syarat lulus G3.4.

**K3 · "G3.3 LULUS" dicetak tanpa syarat padahal kedua kakinya belum terbukti di repo.**
Bukti kaki "tanpa gelar": `rangkai.py:105-106` menerima kutipan yang tidak diperiksa (`is not False`), N7 lulus dengan kutipan karangan; `G3_1_hasil_14Nov2026.md:2` sendiri mencatat "kutipan tidak diperiksa". Klaim STATUS baris 49 "7 dari 7 cocok" dijalankan di laptop dan keluarannya tidak ada di repo. Isi kutipan juga lemah: "berasal dari unsur Potensi dan Sumber Kesejahteraan Sosial atau kader masyarakat" (jkn-fasilitator) dan "Pendaftaran Data Diri Kader Ke Puskesmas Pelaksanaan Pelatihan 25 Keterampilan Dasar Kader" (kader posyandu) tidak menyatakan apa pun tentang syarat pendidikan; "tanpa gelar" di sini adalah inferensi dari diam.
Bukti kaki "nonformal/sukarela dari daftar tertutup bersumber": `jenis_peran` adalah penilaian pemeta, bukan daftar bersumber. Untuk jaminan kesehatan satu-satunya penopang adalah Fasilitator dengan catatan pemeta "status kepegawaian fasilitator tidak dijelaskan; dinilai nonformal secara hati-hati". Ketidakstabilan label terbukti: Operator SIKS-NG = `formal` menurut pemeta, `nonformal` menurut SU-3 separuh A; PSM = `nonformal` menurut pemeta, `sukarela` menurut SU-3 A.
Tambahan: `rangkai.py:122` kode keluar tidak memperhitungkan G3.3, jadi G3.3 GAGAL tidak menggagalkan CI.
Dampak: gerbang keterjangkauan, yang paling menentukan bagi siswa tanpa akses kuliah, lulus atas tebakan.
Perbaikan: status jujur sekarang "G3.3 LULUS MEKANIS, kutipan belum diperiksa di repo". Simpan keluaran `rangkai.py --dokumen` (dengan sidik teks dokumen) di `uji/`. `ya_berdokumen` hanya sah bila kutipan memuat syarat masuk eksplisit (contoh baik: Permensos 10/2019 Pasal 8). Buat daftar tertutup peran nonformal/sukarela ber-pasal (PSM, kader posyandu, karang taruna, TKSK, kader PKK) dan cocokkan ke sana. G3.3 masuk kode keluar.

**K4 · Aturan 1 Jalan Tengah tidak terpenuhi oleh jalur data untuk mode (c) dan untuk kemiskinan.**
Bukti: §1.5 butir 1, 2, 5.
Dampak: prinsip pemilik "sendiri pun bermakna" dan pembatasan kontak mode (c) baru terpenuhi di fixture kontrak, belum di rantai nyata. Begitu rantai ini disambung ke keluaran siswa, skema menolak 8 dari 9 jalur atau pengguna menerima jalur tanpa langkah mandiri.
Perbaikan: terapkan §1.5.

#### PENTING

**P1 · Dua syarat "bersyarat" G3.1 menyentuh dua dari tiga jenis, dan STATUS menyebut syarat lebih sedikit daripada artefaknya.**
Bukti: `G3_1_hasil_14Nov2026.md:21-23` mencetak tiga syarat; `STATUS_ME3.md:46` menulis dua (syarat ketiga, kutipan belum diperiksa, hilang). Kartu stunting dan jaminan kesehatan berstatus draf dan sumbernya `ditahan` (keluaran `periksa_sumber`: `ssgi-2024 ditahan`; `bps-var-2279` tidak ada di registri sumber). G3.1 berbunyi "tiap jenis kebutuhan tayang"; yang layak tayang hari ini hanya kemiskinan.
Dampak: "LULUS BERSYARAT" terbaca seperti hampir lulus; faktanya satu dari tiga jenis yang punya kartu sah. CI (`periksa_gerbang.py` bagian ME3, komentar "bersyarat boleh") tidak membedakan.
Perbaikan: tulis "G3.1: lulus mekanis 9 dari 9; lulus gerbang 1 dari 3 jenis (kemiskinan), menunggu G1.3 untuk dua sumber". Syarat dihitung per jenis.

**P2 · Bukti peran lemah secara isi walau kutipannya persis.**
Bukti (`usul_top3_keluaran.sah.jsonl`): Karang Taruna dan PSM bersandar pada daftar anggota tim di lampiran Perbup Pringsewu ("Staf Kecamatan, Korluh Pertanian, KarangTaruna, Dunia Usaha, UPT Perikanan"; "Pekeija Sosial Masyarakat (PSM)" dengan salah baca OCR). Bidan bersandar pada "tenaga kesehatan paling sedikit mencakup bidan". Validator kutipan menguji keberadaan string dan nama peran, bukan apakah kutipan menyatakan peran itu pelaksana untuk kebutuhan itu.
Dampak: definisi "benar" SU-3 ("menyebut peran itu sebagai pelaksana untuk kebutuhan itu") tidak diuji pada peran yang dipakai rantai.
Perbaikan: tambah uji dukungan (entailment) kutipan terhadap klaim, sebagaimana ukuran presisi sitasi di ALCE (Gao dkk. 2023, https://arxiv.org/abs/2305.14627); bisa memakai juri terkalibrasi yang sudah ada polanya di `mesin/juri/`. Untuk PSM pakai Permensos 10/2019 Pasal 6 (sudah ada di SU-3 A) sebagai dokumen peran, bukan lampiran Perbup.

**P3 · G3.2 tidak mengukur peran yang dipakai rantai.**
Bukti: G3.2 mengukur pemeta mode PERIKSA atas pasangan SU-3 (`STATUS_ME3.md:21-38`). Rantai memakai keluaran mode USUL (92 usulan top-3). Protokol butir 6: usulan di luar SU-3 tidak masuk hitungan presisi. Separuh A dipakai tiga putaran pengembangan dan register diperluas menurut pola yang terlewat di A (STATUS baris 31), lalu A dihitung lagi dalam "gabungan 63/63".
Dampak: angka Wilson 0,943 terkontaminasi set pengembangan; angka bersih adalah B: 26/26, Wilson 0,871, tetap ≥0,85. Elusi B 0/42 punya batas atas Wilson 95% sekitar 8,4%, di atas ambang 5%; gabungan 0/86 sekitar 4,3%. Label SU-3 ditulis agen, tanpa anotasi manusia.
Perbaikan: laporkan B sebagai angka gerbang, A sebagai pengembangan. Ambil sampel acak dari 92 usulan top-3 (mis. 40), labeli oleh agen terpisah plus cek manusia atas sebagian, hitung presisi mode USUL. Tambah pengecoh sampai n salah ≥100 seperti rencana.

**P4 · Bukti dan wilayah tidak nyambung; status berlaku dokumen tidak diperiksa.**
Bukti: kartu contoh dipilih dari jarak terbesar (`rangkai.py:39-41`) sehingga keluaran berbunyi "Di Kab. Supiori ..." dengan peran yang hanya berdokumen Perbup Pringsewu, dan "Di Jambi ..." dengan Perbup Bogor. Dari dokumen yang dipakai rantai, lima berstatus "Berlaku (dugaan)" (perdir-bpjs-26-2021, perbup-pringsewu-23-2023, perbup-bogor-60-2023, perwal-batu-6-2026, juknis-ukur-serentak-2024) dan satu "Terikat tahun 2024 (status 2026 tidak dipastikan)" (buku-panduan-bokb-2024). Juknis nasional diambil dari salinan `cdn.samarindakota.go.id`. `rangkai.py` tidak membaca kolom `status_berlaku` sama sekali. Sebagian kolom `cek_status` masih berbunyi "berkas tidak diunduh/dibuka penuh" padahal teksnya sudah dipakai.
Dampak: `batas` memang mengaku "pedoman satu kabupaten", tetapi `keyakinan` dipatok "sedang" untuk semua (`rangkai.py:58`). Pengguna di Papua diberi peran yang dasar tertulisnya ada di Lampung.
Perbaikan: field `cakupan_dokumen` (nasional/daerah) pada peran; bila hanya daerah lain → `keyakinan: rendah` dan dokumen nasional dicari dulu (PKH: Permensos 1/2018; PSM: Permensos 10/2019; karang taruna: Permensos 25/2019 jo. 9/2025; nomor-nomor ini perlu dicek di laman resmi sebelum masuk register). Mata rantai bukti gagal bila status bukan "Berlaku" terverifikasi di laman resmi. Segarkan `cek_status`.

**P5 · Mata rantai skill adalah sintesis tanpa bukti di delapan dari sembilan jalur.**
Bukti: hanya `jkn-pemasar` punya `skill_kutipan`, dan field itu tidak dibaca validator. N1 lulus. "empati" muncul di enam dari sembilan jalur, "komunikasi-kompleks" di lima; pembeda antarjalur nyaris tidak ada. `kbji_kode` kosong di semua jalur (`rangkai.py:52`).
Dampak: skill-map tidak menolong pengguna membedakan jalur. Ini titik terjauh dari SOTA.
Perbaikan: tiap skill membawa salah satu dari (a) kutipan dokumen L0, atau (b) kode okupasi dan skill dari taksonomi terbuka: ESCO (https://esco.ec.europa.eu/en) atau O*NET (https://www.onetonline.org/), dengan jembatan KBJI ke ISCO-08 (https://ilostat.ilo.org/methods/concepts-and-definitions/classification-occupation/). Rencana §4.4 sendiri menyebut pilihan ini. Validator menolak skill tanpa salah satunya.

**P6 · "Bukti cara kerja" berisi dokumen aturan, bukan bukti bahwa caranya bekerja; kalimat `harapan` tidak bersumber.**
Bukti: sembilan dari sembilan jalur memakai peraturan atau pedoman sebagai `bukti_cara_kerja`; nol studi tayang (STATUS baris 52, diakui). Harapan `jkn-pemasar`: "Petugas yang datang dan menjelaskan dengan sabar membantu pekerja memahami haknya". Studi kandidat yang dicatat di jalur itu sendiri, Banerjee dkk. 2021 (https://www.aeaweb.org/doi/10.1257/aer.20200523; versi NBER https://www.nber.org/papers/w26204), sejauh ingatan saya atas abstraknya melaporkan bahwa subsidi sementara menaikkan kepesertaan, pendaftaran berbantuan menaikkan upaya mendaftar tetapi banyak yang gagal di tahap administrasi, dan informasi saja tidak berpengaruh. Bila benar, kalimat harapan itu berlawanan arah dengan studinya. Saya tidak membuka teks penuhnya dalam tinjauan ini; wajib dicek sebelum dipakai. Cahyadi dkk. 2020 adalah studi PKH, tetapi juga dicantumkan sebagai kandidat untuk `stunting-kader-posyandu`.
Dampak: aturan 5 meminta harapan = "apa yang sudah terbukti menolong atau apa yang bisa dilakukan satu orang". Kalimat sekarang terdengar seperti yang pertama tanpa buktinya.
Perbaikan: tiap `harapan` berlabel jenis (`terbukti` + sumber_id, atau `bisa_dilakukan` tanpa klaim dampak). Masukkan dua studi itu ke Evidence DB lewat Evidence Pass, atau tulis ulang harapan sebagai `bisa_dilakukan`.

**P7 · Jalur belajar kosong di lima dari sembilan jalur; satu dari empat yang terisi salah alamat.**
Bukti: `jalur_belajar: []` pada jkn-operator, miskin-pendamping-pkh, miskin-karang-taruna, stunting-tpk, stunting-bidan. `jkn-fasilitator` memakai bimbingan teknis PSM (Permensos 10/2019) sebagai jalur belajar fasilitator verifikasi JKN; kaitannya adalah tafsir pembangun atas "unsur PSKS", bukan bunyi dokumen. Uji N6: kutipan karangan lolos tanpa `--dokumen`.
Dampak: "kosong berlabel" sah menurut G3.1, tetapi aturan 3 (bekal kaya) tipis: bidan tanpa satu pun rujukan pendidikan kebidanan.
Perbaikan: perluas L0 dengan sumber jalur belajar resmi (PDDikti untuk prodi kebidanan, kurikulum pelatihan kader Kemenkes, rekrutmen pendamping PKH Kemensos). Laporkan angka cakupan jalur belajar di STATUS sebagai ukuran, bukan hanya ya/tidak.

#### KECIL

**C1.** `L0` di `rangkai.py:16` dikunci `doc_id` padahal 34 `doc_id` muncul lebih dari satu baris; baris terakhir menang diam-diam. Aman selama URL sama; tambahkan penegasan.
**C2.** `kartu_prov.py:28-33`: pembanding = nilai tengah antarprovinsi, jadi separuh provinsi selalu "di atas" apa pun keadaannya. Sudah dilabeli "bukan target resmi"; pastikan label itu ikut ke teks kartu saat status naik dari draf. Nilai jaminan kesehatan adalah turunan (100 dikurangi var 2279) dengan `rse: None`.
**C3.** `berlaku_sampai: "2027-12-31"` dipatok di `rangkai.py:49` untuk semua jalur tanpa dasar per sumber.
**C4.** `periksa_gerbang.py` menulis ulang `kartu_me2.jsonl`, `kartu_me3_prov.jsonl`, dan `keluaran_jalur_me3.jsonl` di repo saat dijalankan, berbeda dari pola G4.1 yang bekerja di salinan. Gagal di tengah bisa meninggalkan berkas berubah.
**C5.** G3.5 "lulus kosong" sudah ditulis jujur di STATUS baris 51; pertahankan bunyi itu di ringkasan mana pun.
**C6.** Kutipan `mulai_tanpa_gelar_kutipan` karang taruna memuat digit ("16 (enam belas)"); tidak tayang sekarang, tetapi jangan pernah dirender tanpa saringan.

### 2.4 Hal yang dikerjakan dengan baik

- Reproduksi penuh: keluaran identik pada salinan bersih.
- Kejujuran pencatatan: G3.3 putaran 1 GAGAL ditulis, G3.5 disebut lulus kosong, studi kandidat ditahan karena status Live belum terbukti, kartu draf diberi `alasan_draf`.
- Pemisahan pemeta dari SU-3 dan separuh tersembunyi dinilai agregat; protokol dibekukan sebelum pemeta ditulis; perubahan ambang dicatat sebagai tambahan ber-KEPUTUSAN, protokol asal tidak disunting.
- Validator kutipan punya uji negatif tetap di CI (`sah 1 ditolak 3`). Pola ini tinggal diperluas ke `rangkai.py`.

### 2.5 Apa yang perlu agar ME3 setara state of the art

| Lapis | Keadaan sekarang | Yang dibutuhkan | Rujukan |
|---|---|---|---|
| Atribusi | Kutipan persis ada di dokumen | Kutipan terbukti mendukung klaim (presisi dan recall sitasi), diukur pada sampel mode USUL | ALCE, https://arxiv.org/abs/2305.14627 |
| Okupasi dan skill | Simpul skill-map pilihan pembangun; KBJI kosong | Kode okupasi + skill dari taksonomi terbuka, jembatan KBJI ke ISCO | ESCO https://esco.ec.europa.eu/en · O*NET https://www.onetonline.org/ · ISCO https://ilostat.ilo.org/methods/concepts-and-definitions/classification-occupation/ |
| Bukti dampak | Peraturan sebagai bukti | Studi berstatus Live per jalur, atau harapan berlabel `bisa_dilakukan` | Banerjee dkk. 2021, https://www.aeaweb.org/doi/10.1257/aer.20200523 |
| Pembanding produk | Ukuran rencana §5: lebih baik dari 80,000 Hours untuk pengguna Indonesia | Tiap jalur memuat cara masuk, kecocokan pribadi, dan ketidakpastian, seperti ulasan karier pembanding | https://80000hours.org/career-reviews/ |
| Validator | Bentuk | Bentuk + uji negatif tetap (N1–N11) + pindai semua teks + dua mode | §2.2 laporan ini |
| Keselamatan remaja | Aturan satu baris, tidak dijalankan | Templat ber-`mode_c`, kontak mode (c) per jalur, pindai data pribadi dan biaya | §1.5, K2 |

Tidak ada rujukan yang saya temukan untuk tolok ukur terbitan khusus "mesin jalur karier berbasis kebutuhan wilayah" di Indonesia: TIDAK DITEMUKAN dalam tinjauan ini (tidak dicari mendalam; satu pencarian web dipakai hanya untuk memastikan URL Banerjee dkk.).

### 2.6 Vonis kemajuan ME3

Fondasi pencatatan dan reproduksi kuat, G3.2 layak lulus pada angka separuh B, tetapi G3.1 dan G3.3 baru terbukti pada tingkat bentuk; keduanya belum layak dipakai sebagai dasar tayang sampai K1–K4 ditutup dan dua sumber kartu lewat G1.3.

---

## 3. PERLU RAIHAN

1. Mengesahkan lima vonis UBAH §1 beserta teks penggantinya (tinjauan sekali; sesudah itu teks dibekukan sebagai bank).
2. Memutuskan apakah mode (c) boleh memakai `baca_pedoman` (membaca dokumen publik sendirian). Usul peninjau: boleh.
3. Memutuskan apakah `daftar_kegiatan` boleh untuk usia 16–17 dengan izin orang tua (karang taruna menerima anggota sejak usia itu menurut kutipan Permensos 9/2025 di rantai). Usul peninjau: tidak untuk v1; tinjau lagi sesudah pilot.

## Sumber

- Berkas repo: `mesin/jalur/templat_langkah_pertama_v1.yaml`, `rantai_v1.yaml`, `rangkai.py`, `keluaran_jalur_me3.jsonl`; `mesin/uji/STATUS_ME3.md`, `G3_1_hasil_14Nov2026.md`, `G3_2_PROTOKOL.md`, `G3_2_PROTOKOL_tambahan1.md`, `SU3_ATURAN.md`, `SU3_pasangan_terbuka.jsonl`, `TERSEMBUNYI.sha256`, `AMBANG.yaml`; `mesin/kartu/kartu_prov.py`; `mesin/sumber/dokumen/L0_register_v4.csv`; `mesin/peran/usul_top3_keluaran.sah.jsonl`; `mesin/kontrak/buat_kontrak.py`; `mesin/alat/periksa_gerbang.py`.
- Rencana: `RENCANA_Mesin-Eksplorasi-SOTA_v1_12Nov2026.md` §0.3, §4.4, §4.5 (G4.8, G4.9).
- [Banerjee dkk. 2021, American Economic Review](https://www.aeaweb.org/doi/10.1257/aer.20200523) · [versi NBER w26204](https://www.nber.org/papers/w26204.pdf)
- [Gao dkk. 2023, ALCE](https://arxiv.org/abs/2305.14627) · [ESCO](https://esco.ec.europa.eu/en) · [O*NET OnLine](https://www.onetonline.org/) · [ISCO, ILOSTAT](https://ilostat.ilo.org/methods/concepts-and-definitions/classification-occupation/) · [80,000 Hours career reviews](https://80000hours.org/career-reviews/)
- Catatan keterbatasan: URL ALCE, ESCO, O*NET, ISCO, dan 80,000 Hours ditulis dari pengetahuan peninjau, tidak dibuka dalam tinjauan ini. Isi abstrak Banerjee dkk. ditulis dari ingatan, belum diverifikasi ke teks.
