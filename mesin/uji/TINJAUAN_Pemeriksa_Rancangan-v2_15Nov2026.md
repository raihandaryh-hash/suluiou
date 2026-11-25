# Tinjauan pemeriksa terpisah atas rancangan sambungan versi 2

SINTESIS pemeriksa (subagen Fable, bukan penulis rancangan), 15 Nov 2026. Disalin utuh dari laporan pemeriksa oleh SESI-11NOV-SULU-MESIN (https://claude.ai/code/session_01JZPjjr3cEST9SPkxZSaHrr). Tindak lanjutnya: bagian 7–14 di `RANCANGAN_Sambungan-Mesin_v2_15Nov2026.md`.

VONIS: LAYAK DENGAN PERBAIKAN. Arah v2 benar dan 69 dari 91 niat termuat, tetapi v2 tidak boleh dibangun apa adanya: ia "menggantikan" versi 1 sambil menjatuhkan batas Chief Sulu, pemetaan kontrak, gerbang J, dan pagar pencarian tanpa menyatakannya dicabut; 22 niat melemah atau hanya ditempeli nomor; 11 dari 13 gerbang belum terukur.

Singkatan berkas (semua di /home/claude/suluiou/mesin/uji/ kecuali disebut):
- v2 = RANCANGAN_Sambungan-Mesin_v2_15Nov2026.md
- v1 = RANCANGAN_Sambungan-Mesin-ke-Alur-Tayang_15Nov2026.md
- UU = UJI-ULANG_Rancangan-terhadap-Indeks-Niat_15Nov2026.md (U1–U20 = baris 28–47, U21–U38 = baris 63–80)
- UT = UJI_Topik-Sisa_Niat-vs-Rancangan_15Nov2026.md (Vn = baris 8+n)

## A. Kesetiaan (91 niat)

Hitungan: setia 69 · melemah 12 · hanya nomor 9 · salah tempat 1. Semua 91 nomor dirujuk minimal sekali di v2 (dicek skrip); 61 dirujuk tepat sekali.

Melemah (12):
- U3 (UU:30): tindak "tambah pencocokan ke bekal" dan "masalah sosial" tidak ada di S3 (v2:37). Pencocokan ke profil juga berbenturan dengan pagar kueri v1:144.
- U8 (UU:35): tindak "bekal Kenali Diri WAJIB menjadi masukan S3 dan S4". S12 hanya menulis "Jawaban yang ada" (v2:46); S3 tidak menyebut bekal sama sekali.
- U11 (UU:38): pagar "temuan berita tidak dipakai menokohkan orang" hilang; tersisa "peran sebagai contoh" (v2:23).
- U22 (UU:64): tindak "masuk gerbang". S15 ada (v2:49), tetapi tidak ada gerbang yang mengukur tanda pada keluaran S4.
- U28 (UU:70): "the very essence of Sulu" diminta jadi kalimat arah; di v2 hanya baris S9 berstatus "menunggu Raihan" (v2:43), bukan prinsip.
- U30 (UU:72): tindak "keluaran harus memuat unsur kartu wilayah dan bekal pengguna itu". Gerbang L hanya "dua profil berbeda tidak mendapat keluaran yang sama" (v2:66); beda satu kata sudah lulus.
- U31 (UU:73): batas "teks kartu tiga kalimat" hilang; gerbang M merujuk U31 tanpa kriteria (v2:67).
- V4 (UT:12): batas resolusi dinyatakan (v2:35), tetapi "arahkan cara cek S3 dan langkah S6 ke desa/RT/RW" tidak ada di S3 maupun S6.
- V17 (UT:25): "yang tanpa dasar tidak tampil" hilang; S11 "Titikmu" (tempat asal temuan) tidak diberi aturan dasar (v2:45).
- V20 (UT:28): "cara lembaga otoritatif membahasakan angka, tanpa overclaim/doomsaying" disusutkan menjadi "memakai istilah sumbernya" (v2:24).
- V21 (UT:29): larangan membuka dengan deretan angka buruk tidak ditulis; S1 hanya mendaftar jenis kartu (v2:35).
- V23 (UT:31): Raihan meminta tampilan ke orang lain "ceria, lembut ... memicu tafa'ul"; prinsip 7 membatasi hangat ke tahap Proposal Diri dan "lugas di lapis data" (v2:27). Dasarnya "KEPUTUSAN 15 Nov 13.49" tidak ada di berkas mana pun di mesin/uji (grep 13.49 hanya kena v2:27).

Hanya nomor (9):
- U4 (UU:31): "bisa dimatikan, menambah tanpa merusak / bendera mati bawaan" tidak tertulis di S3 (v2:37).
- U18 (UU:45): "jadikan set uji tetap" kemampuan LLM memberi konteks lokal; tidak ada di S3 maupun gerbang.
- U20 (UU:47): contoh peran terikat bekal jurusan (soshum sebagai pemecah masalah); teks S4 yang mirip adalah V13, bukan ini (v2:38).
- V2 (UT:10): data keterampilan kurang pasokan dan kelebihan pasokan; S4 hanya memuat V46.
- V3 (UT:11): deprivasi multidimensi, daerah rawan, kemiskinan kota; tidak ada di S1.
- V7 (UT:15): pemetaan ke 8 ashnaf dan PMKS yang sudah tayang; tidak disebut.
- V18 (UT:26): daftar variabel prompt S3/S4 dan uji silangnya; tidak ada.
- V33 (UT:41): ajukan ke Raihan soal saringan tema sensitif ("Indonesia Gelap"); S3 hanya "saringan".
- V39 (UT:47): langkah balik saat kurasi dokumen arah pembangunan; tidak ada di S3 maupun urutan kerja v2:80.

Salah tempat (1):
- V8 (UT:16): isu sesudah 2030 diminta di lapis global sebelum mengerucut ke provinsi; v2 menaruhnya di S11 "penutup lapis provinsi" (v2:45).

## Temuan bernomor

1. BERAT · v2 menggantikan v1 tetapi menjatuhkan batas Chief Sulu.
Klaim: v2:5 "Menggantikan ... versi 1, disimpan sebagai riwayat".
Bukti hilang tanpa pencabutan: (a) "Mesin tidak menulis province_contexts; keluar sebagai lapis_provinsi.json" (v1:66), nol sebutan di v2; (b) "korpus S3 hanya bukti Live" dan pemisahan bukti lawan temuan (v1:68, 133–142); (c) temuan tidak masuk Proposal Diri sebagai fakta, bendera mati sampai Raihan menyalakan, Tonggak 2b (v1:167); (d) "tiap pintu AI baru melewati lapis distress sebelum model dipanggil" hanya tersisa sebagai "prasyarat tayang" (v2:44).
Saran: tambah bagian "Batas yang tetap mengikat dari versi 1" yang menyalin v1 §7 butir 1–5 dan v1 §11 alinea akhir, atau nyatakan tiap butir dicabut beserta dasarnya.

2. BERAT · Pemetaan kontrak jalur-jelajah/1 dan K5 hilang, padahal v2 menambah banyak bidang.
Bukti: tabel v1:73–83, K5 (v1:99) dan jawaban chief (v1:110) tidak ada di v2. S4 v2 menambah dasar pencocokan, bekal yang belum ada beserta mitigasi, data kemampuan, minat, nilai (v2:38); S1 menambah tenaga, peluang, arah, program, batas resolusi (v2:35). Tidak ada penilaian apakah kontrak versi 1 dan skema kartu masih muat.
Saran: ulangi pemetaan kontrak untuk S1–S16 sebelum urutan kerja butir 4.

3. BERAT · S4 "tetap" tidak sesuai kode tayang.
Bukti di origin/main (6dea505) supabase/functions/broaden-roles/index.ts: prompt "Kamu membantu siswa SMA/MA" (baris 69); "Sebutkan 6 peran atau jabatan NYATA" dan aturan 6 "jangan mengarang jabatan yang tidak nyata"; skema keluaran hanya title, whatTheyDo, demandsMost, whyUnexpected, pathwayHint, unexpected; masukan hanya medan, subPicks, siapa, province, skills, values (src/components/BroadenRoles.tsx:84). Tidak ada jalur cipta, dasar pencocokan, bekal yang belum ada, saringan peran, atau pengguna dewasa. Semua isi S4 v2 berarti mengubah prompt dan skema, yaitu PR chief; v2:38 menulis "(tetap)" dan v2:75 tidak mendaftarnya.
Saran: tulis terang "wadah dan nama tetap; prompt, masukan, dan skema keluaran berubah lewat PR chief", lalu daftar perubahannya.

4. BERAT · Benturan batas di bawah 18.
(a) S4 memakai "minat, nilai, dan kemampuan" (v2:38), sedangkan kode tayang mengosongkan skills dan values untuk di bawah 18 ("if (siap.bawah18) { skills = \"\"; values = \"\"; }", broaden-roles/index.ts). v2 tidak mengatur S4 untuk di bawah 18.
(b) S3 "tulisan disimpan untuk dirinya" (v2:37) adalah penyimpanan baru teks bebas anak; tidak masuk daftar pengecualian, dan pilihan gejala terstruktur sebagai masukan AI (v1:67; UT:50) tidak lagi disebut, padahal `penjelajah.py` dibangun di atasnya.
(c) S4 "Bahan: kartu, temuan, ..." (v2:38): temuan pencarian menjadi masukan AI lalu bisa mengalir ke S7/S8, berlawanan dengan "temuan tidak pernah menjadi bukti" (v1:133) dan "tidak masuk Proposal Diri sebagai fakta" (v1:167).
Saran: tetapkan per sambungan apa yang dikirim ke model untuk di bawah 18 dan dewasa; keluarkan "temuan" dari bahan S4 atau beri pagar tertulis.

5. BERAT · Gerbang J hilang tanpa dicabut.
Bukti: v1:102 (K8) memuat gerbang J; sumbernya UJI_Setia-Niat_15Nov2026.md:48–52 berisi empat butir (rumusan dalam kata pengguna, keberagaman gagasan, Raihan menilai sesi utuh, 0 jabatan struktural atau berhonor program sebagai tujuan). Tabel v2:54–68 melompat dari I ke K.
Saran: pulihkan J dengan keempat butir (v1 sendiri hanya menyebut tiga).

6. SEDANG · Prinsip 2 dilanggar tabelnya sendiri.
Klaim: "tiap tambahan masuk daftar untuk diputuskan Raihan" (v2:22). Bukti: hanya S16 berlabel "pengecualian yang diajukan" (v2:50). Tambahan lain tanpa label: isian tulisan S3, minta provinsi di tempat (S1), formulir orang terdekat dan klik inventori (S12), prompt siap pakai (S14), "Titikmu" (S11), berbagi dengan orang tua (S8). Syarat K3 (panen jawaban yang ada dulu; Raihan memutuskan di akhir tonggak, v1:97) juga hilang. Formulir orang terdekat mengumpulkan data pihak ketiga dan tidak diberi pembaca bernama (S13).
Saran: buat daftar pengecualian eksplisit dengan kolom data yang dikumpulkan, pembaca, dan usia.

7. SEDANG · Kolom "Yang tetap" v1 dihapus, sehingga prinsip 1 kehilangan isinya.
Bukti hilang: tujuh Jalan Bakti, SDG, Lensa Kepedulian (v1:26); dua daftar 7 dan 25 tidak digabung (v1:30); empat payung dan "Minta dijembatani" (v1:31); S7 "tanpa AI baru" (v1:32) yang oleh UT:66 dicatat sebagai niat sejalan [901]; S8 "tanpa label atau skor" (v1:33); "nasib tiap unsur Gambaran diputuskan Raihan" (v1:95).
Saran: kembalikan kolom itu.

8. SEDANG · Keadaan S1 dan jalur kritisnya tidak terbawa.
Bukti: v1:87 "0 butir boleh tampil ... jalur kritis bukan kode, melainkan teks kartu dan status Live"; `uji_s1.py` hari ini masih "0 boleh tampil". Urutan kerja v2:79–82 tidak memuat penerbitan kartu maupun pilihan varian teks; butir 4 langsung "kode: kartu baru". Ikut hilang: beda daftar nilai keandalan dan keandalan "hati-hati" pada 973 kartu belum punya cara tampil (v1:106); K10 angka kepala desa (v1:104).
Catatan angka: v1:87 menulis 265 butir, keluaran sekarang 234.

9. SEDANG · Pagar pencarian diringkas menjadi "pagar kueri dan saringan" dan tidak punya gerbang.
Bukti: aturan v1:140–144 (https, penerbit, tanggal, paling lama 24 bulan, tanpa ringkasan, paling banyak lima, tiga kata kunci huruf saja, ditolak untuk di bawah 18) tidak ada di v2:37. `uji_pencarian.py` ada dan lulus, tetapi tidak dirujuk gerbang mana pun. `pencarian.py` TOPIK masih empat kebutuhan; arah pembangunan dan program (U3, U7) belum ada.
Saran: tambah gerbang "temuan pencarian" yang menunjuk `uji_pencarian.py` dan salin tabel dua jalur.

10. SEDANG · Gerbang D mengukur lebih sempit daripada prinsip 1.
Klaim: v2:21 "tidak ada fungsi atau isi tayang yang dicabut (garis dasar)"; v2:59 "ada".
Bukti di mesin/sambung/garis_dasar.py: hanya rute, berkas halaman, folder fungsi tepi, pola `functions.invoke`, ekspor `src/data`, dan pencocokan kata nama kolom di JalanBakti.tsx. Komponen (`src/components`, misalnya BroadenRoles.tsx, PetaMedan.tsx) tidak dihitung; ekspor yang berhenti dirender tetap lulus. "Bidang provinsi yang ditampilkan = 6" keliru: `iou_program_relevance` hanya muncul di deklarasi tipe (JalanBakti.tsx:27), tidak dirender. Akibat ganda: alat tidak menangkap hilangnya render, dan menyebut "tampil" untuk bidang penautan program IOU yang menurut prinsip 8 dan BT4 justru berisiko.
Saran: hitung pemakaian komponen dan render bidang; koreksi angka 6 menjadi 5 yang dirender.

11. SEDANG · Gerbang B "ada" hanya sebagian.
Klaim: v2:57 "bertanda, punya cara mengecek, bersumber · ada".
Bukti: `penjelajah.periksa()` memeriksa tanda, cara cek, dan `dasar_kartu`, bukan sumber butir dugaan; mesin/sambung/bank_dugaan_v1.yaml tidak punya bidang sumber dan kepalanya sendiri menyatakan melanggar arahan 8 Jul. "Bersumber" untuk S3(a) (U34, V49) belum terukur.

12. SEDANG · Benturan antarprinsip tanpa aturan pemenang.
(a) Prinsip 4 "memakai istilah sumbernya" (V5, V6) lawan gerbang M "kata yang dihindari" (V29) dan "istilah dapur tidak tampil" (V28). (b) Prinsip 7 lawan V21, V23, V24 (lihat A). (c) Prinsip 1 "cari padanan dulu" (V10) lawan urutan kerja butir 4 "kartu baru (... peluang ...)" (v2:82), padahal `opportunitySection` sudah tayang. (d) Prinsip 6 "tiap angka bersumber dan bertahun" lawan "diperkaya" atas bagian peluang Insight yang memuat angka di badan teks, termasuk "Rp 3,73 juta/bulan" (src/data/insightContent.ts:343 dst.); cakupan gerbang A tidak menyebut bagian ini.

13. RINGAN · S3 merujuk 20 nomor, S1 20 nomor, dalam satu sel; inilah sumber utama "hanya nomor". V52 dan V53 dirujuk di S1/S3 padahal isinya di urutan kerja v2:80. V50 (peta titik sentuh) disebut syarat kunci S3 tetapi tidak ada di urutan kerja. Gerbang H tanpa niat (v2:63).

14. RINGAN · v2:13–14 menyebut semua kutipan "sudah dicocokkan skrip dengan arsip"; UT:115 menyatakan pencocokan tidak dilakukan penguji, lalu kepala UT:3 menyebut dicocokkan sesi mesin. Arsip tidak ada di repo, jadi tidak dapat saya uji.

## D. Klaim kode (origin/main = 6dea505)

Benar:
- `opportunitySection` dan `worldLayerSection` ada dan dirender (src/data/insightContent.ts:343, 737; src/pages/Insight.tsx:1167–1208).
- "Gambaran arah daerahmu" ada di langkah 2 Pahami (src/pages/JalanBakti.tsx:392–403), menampilkan narrative_hooks, economic_sectors, opportunities_2030, fardhu_kifayah_gaps, key_questions, dengan label "bukan data resmi atau vonis" (438). Cocok dengan K1.
- Slot provinsi Peta Medan mati: komentar "Lapis Provinsi SENGAJA belum aktif — province_contexts schema belum defensible (gate keras di spec)" (src/components/PetaMedan.tsx:20) dan label "Peta provinsimu — segera" (src/data/jalanBaktiContent.ts:194). v2 tidak menyebut gerbang keras spec ini.
- "Nyalakan peran yang belum terlihat" ada (src/components/BroadenRoles.tsx:133), memanggil `broaden-roles`; distress, saklar mati, samaran sudah terpasang.
- "Lihat Lebih Dekat" (jalanBaktiContent.ts:86), "Rancang Langkah Pertamamu" (258), `caraMelatih` di skillMapContent.ts (24 kemunculan) ada.
- Sembilan fungsi tepi; `career-chat` dan `generate-reflection` ada.
- Cabang mesin tidak punya commit yang menyentuh `src/` atau `supabase/`.

Alat: `garis_dasar.py`, `uji_s1.py`, `uji_penjelajah.py`, `uji_pencarian.py` ada di /home/claude/suluiou/mesin/sambung/. Ketiga uji lulus (exit 0):
- uji_s1: 973 kartu, 0 ditolak, 234 butir bersumber dan bertahun, 0 boleh tampil, 38 provinsi.
- uji_penjelajah: 134 dari 134 sah, 10 dari 10 cacat ditolak.
- uji_pencarian: 5 kueri buruk ditolak, 10 dari 10 temuan cacat ditolak.
- `garis_dasar.py banding origin/main origin/main` keluar 0 dengan hitungan 32/9/32/7/6/26/127/2117, sama dengan v1:114–121. Tanpa argumen skrip ini jatuh dengan IndexError.

Keliru atau menyesatkan: lihat temuan 3, 10, 11.

## E. Gerbang yang tidak terukur seperti tertulis

- A: `WAJIB` di s1_lapis_provinsi.py:21 hanya sumber_id, url, tahun_data, sha256, nilai, satuan. Kurang: bidang penerbit/atribusi, catatan relevansi, jenis sumber, aturan "tahun terbaru yang tersedia".
- B: kurang sumber per butir dugaan; keluaran AI S3 belum ada.
- C: kurang rubrik, set uji (profil siswa, kasus peran tidak islami, membeo), definisi "membeo" dan "menutup terlalu dini"; lapis 1 hanya regex pada dugaan S3, bukan S4.
- D: lihat temuan 10.
- E: kurang set uji, jumlah per kelompok, ambang lulus, arti "Guru BK dan orang tua sebagai pembaca".
- F: kurang daftar bagian dan cara menilai "berujung tindakan".
- G: kurang jumlah contoh, ambang kesepakatan, definisi "hidup dan lokal" dan "ukuran nada".
- H: kurang protokol dan jumlah pengguna uji.
- I: kurang daftar frasa klaim dan cakupan teks yang dipindai.
- K: kurang batas umur per jenis kartu dan bidang konteks zaman.
- L: kurang ukuran kemiripan dan syarat "memuat unsur kartu dan bekal".
- M: kurang daftar istilah dapur, daftar kata dihindari, protokol uji tampilan.
- N: kurang ukuran pilot dan daftar klaim.
- Tanpa gerbang sama sekali: tanda keluaran (U22, S15), keselamatan S10, pagar pencarian, privasi di bawah 18 dan penyamaran, prinsip 8 butir maqashid dan jualan IOU, gerbang J.
- K9 v1 (v1:103) sudah mendaftar kekurangan B–G; v2 menggantinya dengan kata "belum".

## F. Lima risiko terbesar bila dibangun apa adanya

1. Batas chief dilanggar tanpa sadar: penulisan `province_contexts`, temuan pencarian masuk AI peran lalu ke Proposal Diri, teks bebas anak tersimpan atau terkirim (temuan 1, 4).
2. S4 dibangun sebagai "tetap" lalu ternyata merombak prompt dan skema `broaden-roles`; atau sebaliknya jalur cipta tidak pernah muncul karena prompt tayang melarang peran yang belum ada dan menyapa "siswa SMA/MA" (temuan 3).
3. Kerja kode berjalan sementara 0 kartu boleh tampil dan bank dugaan belum bersumber; lapis provinsi kosong atau diisi karangan (temuan 8, 11).
4. Isi tayang hilang lolos gerbang D, karena komponen dan render tidak dihitung, sementara daftar "yang tetap" sudah dihapus dari rancangan (temuan 7, 10).
5. Watered-down berulang: 21 niat tercatat nomornya tetapi isinya tidak ada, dan 11 gerbang diklaim dalam tabel tanpa alat ukur; pembangun yang membaca v2 saja akan menganggapnya tertangkap (bagian A dan E). Ini pola yang Raihan sebut di UT:80–81.

## Cakupan

Dibaca sumbernya: 91 dari 91 niat (kutipan dan usul tindak pada baris UU dan UT), v2 dan v1 utuh, UJI_Setia-Niat bagian A–D.
Dijalankan: tiga uji dan `garis_dasar.py banding`.
Tidak diperiksa:
- kecocokan kutipan dengan arsip pesan (arsip tidak ada di repo);
- Ledger, Notion, RENCANA v3.4/v3.5, dan "KEPUTUSAN 15 Nov 13.49";
- isi BT1–BT24 dan B1–B28 (hanya BT4, BT21, dan judul bagian);
- T-temuan selain T14; pesan [1303] dan transkrip "Data Verify";
- tampilan nyata di layar dan isi basis data `province_contexts`;
- `s1_lapis_provinsi.py`, `kartu.py`, `rangkai.py` di luar yang dikutip; skema kontrak jalur-jelajah/1.
Tidak ada berkas yang diubah.
