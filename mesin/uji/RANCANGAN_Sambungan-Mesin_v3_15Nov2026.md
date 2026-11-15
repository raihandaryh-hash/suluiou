# Rancangan sambungan mesin ke alur Sulu yang tayang

v3 · 15 Nov 2026

SINTESIS. Sesi: SESI-11NOV-SULU-MESIN https://claude.ai/code/session_01JZPjjr3cEST9SPkxZSaHrr. Usulan untuk Chief Sulu (https://claude.ai/code/session_01JZPjjrf5venkgUsuTMXLCa), lalu Raihan. Belum ada kode baru.

Dokumen ini menggantikan v2.1 (sha256 816b0d4a0096350643637df049de7342f74674e75e35c7444c63cac001ff03f7). Versi 1 dan v2.1 disimpan sebagai riwayat dan tidak lagi mengikat.

Kutipan asli 91 niat: LAMPIRAN_Kutipan-Niat_Rancangan-v2_15Nov2026.md

## 0. Dasar

### 0.1 Ucapan Raihan 15 Nov (tercatat KEPUTUSAN di Ledger)

- 09.16: "Tugas Anda enhance, bukan break."
- 10.11: "bukan hanya menampilkan yang sudah ada, tapi juga menjadi jalan untuk kreatif"; "karir itu bukan job"; "bukan hanya untuk anak muda … tapi siapapun itu".
- 10.23: "as local as possible itu bukan sekedar kartu-kartu yang kita punya, tapi juga memang ada mesin AI yang itu untuk explore … where to start".
- 10.28: "take over apa yang telah dibangun dahulu dengan sebelum co-work, kemudian di-enhance gitu kan, dan semuanya tuh harus terintegrasi".

### 0.2 Keputusan Raihan lain pada 15 Nov yang dipakai dokumen ini

- 13.49: "Varian A, lugas is better". Keputusan ini memilih varian teks kartu. Rujukannya Ledger menurut v2.1.
- 14.01: "Ya, paham juga kan maksud saya selokal mungkin itu bisa juga dengan search? Yakni, setelah mereka memasukkan data-data, AI akan search news dst. untuk melengkapi gitu?"
- 17.49: "Terus untuk Pak Dillo, itu gak usah dikutip lagi atas nama Pak Dillo. Pak Evan saja yang dipertahankan. Sisanya langsung dari sisi Sulu as a platform saja."

### 0.3 Cara membaca

Tiap langkah dan tiap gerbang menunjuk nomor niat. Kata pemilik tidak ditulis ulang di sini. Kutipan persisnya ada di lampiran dan di berkas sumbernya.

| Awalan | Berkas | Isi |
|---|---|---|
| U1–U38 | `UJI-ULANG_Rancangan-terhadap-Indeks-Niat_15Nov2026.md` | 38 niat, 38 kutipan cocok |
| V1–V53 | `UJI_Topik-Sisa_Niat-vs-Rancangan_15Nov2026.md` | 53 niat, 68 kutipan cocok |
| BT1–BT24 dan B1–B28 | `AUDIT_Dokumen-Arsitektur_Tambahan-B_15Nov2026.md`, `AUDIT_Dokumen-Arsitektur_v1-v3-dan-Penerus_15Nov2026.md` | arahan yang hilang atau melemah di dokumen arsitektur |

Pencocokan kutipan dengan arsip dinyatakan oleh kepala berkas sumber. Arsip pesan tidak ada di repo. Indeks niat lengkap (3.059 dari 3.059 pesan) ada di laptop `MESIN\niat\`.

### 0.4 Hasil pemeriksa terpisah atas versi 2

Pemeriksa (Fable, bukan penulis) membaca sumber 91 dari 91 niat dan menjalankan ketiga uji. Vonisnya: LAYAK DENGAN PERBAIKAN. Hitungannya: 69 niat setia, 12 melemah, 9 hanya ditempeli nomor, 1 salah tempat, dan 5 temuan berat. Laporan utuh: `TINJAUAN_Pemeriksa_Rancangan-v2_15Nov2026.md`. Versi 2.1 lalu diperiksa pemeriksa kedua, yang memvonisnya GAGAL karena pertentangan aturan tentang pengguna di bawah 18 dan pencarian (`TINJAUAN-2_Pemeriksa_Rancangan-v2.1_15Nov2026.md`). Versi 3 menerapkan 26 suntingan wajib dari tinjauan kedua itu (W1–W26). Daftarnya ada di Catatan perubahan. Versi 3 sendiri diperiksa pemeriksa ketiga: lulus bersyarat, dengan 17 suntingan yang sudah diterapkan di berkas ini (lihat akhir Catatan perubahan).

### 0.5 Keadaan hari ini

| Hal | Fakta | Asal |
|---|---|---|
| Kode tayang | `origin/main` @714d3f7 | penulis induk; dicek ulang penulis v3 |
| Kartu kabupaten/kota | 900 kartu berstatus `siap_tinjau`: 490 kemiskinan (sumber `kemiskinan-kabkota-2025`) dan 410 pengangguran (sumber `sakernas-agustus`) | penulis induk |
| Kartu provinsi | 73 kartu berstatus `draf`: 35 stunting (`ssgi-2024`, menunggu publikasi kedua yang independen) dan 38 jaminan kesehatan (`bps-var-2279`, belum punya kontrak data) | penulis induk |
| Lapis provinsi | 234 butir, 0 boleh tampil. Versi 1 menulis 265 butir. Sesudah perbaikan arah jarak, keluarannya 234 butir | penulis induk; v2.1 |
| Slot provinsi Peta Medan | mati di kode tayang (`src/components/PetaMedan.tsx:20`) | dicek penulis v3 |
| S4 di kode tayang | `broaden-roles` menyapa "siswa SMA/MA", meminta "peran atau jabatan NYATA", dan untuk di bawah 18 mengosongkan keterampilan dan nilai sebelum ke model | dicek penulis v3 pada @714d3f7 |
| `iou_program_relevance` | diambil di `src/services/api.ts`, dideklarasikan di `src/pages/JalanBakti.tsx`, tidak dirender | penulis induk; dicek ulang penulis v3 |
| Nama "Dillo" | sudah tidak tampil ke pengguna menurut penulis induk. Nama itu tinggal di komentar, nama pengenal kode, dan nama berkas komponen. `git grep -il dillo origin/main -- src supabase` yang saya jalankan mengembalikan 6 berkas | penulis induk; hitungan penulis v3 |
| Fungsi tepi lama | `career-chat` dan `generate-reflection` ada di `supabase/functions`. `career-chat` dirujuk lewat alamat langsung di `src/services/api.ts:275`. Terpakai atau tidaknya rujukan itu belum dicek | dicek penulis v3 |
| Garis dasar | `garis_dasar.py` dihitung pada commit 6dea505: 32 rute, 32 halaman, 9 fungsi tepi, 7 pemanggilan, 26 berkas isi, 127 ekspor, 2.117 teks panjang. Bidang provinsi yang dirender 5, bukan 6. Hitungan pada @714d3f7 belum dijalankan | v1; pemeriksa |

## 1. Prinsip

1. **Memperkaya yang tayang, bukan mengganti.** Tidak ada fungsi atau isi tayang yang dicabut. Sebelum membuat sesuatu, cari padanannya di aplikasi dan di fitur lama. Bagian peluang di Insight diperkaya lebih dulu sebelum ada kartu peluang baru, dan angkanya ikut gerbang A. (U24, U33, V10)
2. **Karier bukan pekerjaan; untuk siapa pun.** Dasarnya ucapan 10.11 di 0.1: "karir itu bukan job"; "bukan hanya untuk anak muda … tapi siapapun itu". (U37, V43, V48)
3. **Layar dan isian baru adalah pengecualian yang diajukan.** Bawaannya memanen jawaban yang ada. Tiap tambahan masuk daftar di bagian 9 untuk diputuskan Raihan. (V41)
4. **Kebutuhan dulu, peran sebagai contoh, jalur cipta setara.** Temuan berita tidak dipakai untuk menokohkan orang. (U11, U12)
5. **Mengkurasi, bukan mengarang.** Daftar, hal untuk dicek, topik, dan cara berlatih diambil dari sumber. (U34, V45, V49)
6. **AI memantik dan memantulkan, tidak memvonis.** Keluaran model bertanda. (U22, V37)
7. **Tiap angka bersumber, bertahun, beratribusi, dan relevan.** Angka yang usang ditandai. (U23, U32, V19, V51)
8. **Nada tampilan mengikuti kata pemilik di V23:** "tapi dalam "UI/UX" ke orang lain, harus ceria, lembut, enlightening, tidak memberatkan, memudahkan, memicu tafa'ul (bukan justru doom-thoughts), tidak membuat lari, dst." Tampilan memicu tafāʾul dan tidak melemahkan (V24). Kata "lugas" hanya berlaku untuk pilihan varian teks kartu (varian A, keputusan 13.49). Kalimat kartu mengikuti cara lembaga sumber membahasakan angkanya, tanpa melebih-lebihkan dan tanpa menakut-nakuti (V20). Tampilan tidak dibuka dengan deretan angka buruk, dan peluang tampil berdampingan (V21, V22). Batas lainnya ada di U38.
9. **Tidak memosisikan diri sebagai bimbingan karier, tanpa jualan IOU, tanpa kerangka maqashid.** Pencocokan ke program studi IOU tidak dilakukan. (U16, U19, U29)
10. **Upah: fakta bersumber, bukan janji.** Lihat U28: "This \"onboarding to reality\" is the very essence of Sulu." S9 mengikuti prinsip ini.
11. **Tidak semua jadi paragraf.** (U31)
12. **Satu aturan istilah.** Nama indikator dan nama kelompok memakai istilah sumber (V5, V6). Daftar kata yang dihindari berlaku pada kalimat buatan Sulu (V29). Istilah dapur tidak pernah tampil (V28).
13. **Sumber kerangka.** Tidak ada keluaran, teks kartu, prompt, atau dokumen metode mesin yang menyebut nama Pak Dillo sebagai sumber. Kerangka yang dipakai dirujuk ke sumber akademiknya atau disampaikan sebagai milik Sulu. Dasarnya keputusan 17.49 di 0.2.

## 2. Batas dari Chief dan yang tetap

### 2.1 Batas yang mengikat

| # | Batas | Asal | Niat |
|---|---|---|---|
| B1 | Kode tayang (`src/`, `supabase/`) hanya berubah lewat PR Chief Sulu. Mesin menulis isi dan data di `mesin/` | jawaban Chief 12.23 | U33 |
| B2 | Mesin tidak menulis `province_contexts`. Isi lapis provinsi keluar sebagai `mesin/sambung/keluaran/lapis_provinsi.json` untuk dipasang Chief | jawaban Chief 12.23 | V52 |
| B3 | Slot provinsi Peta Medan baru menyala sesudah gerbang S lulus | kode tayang; versi 1 | U6, V19 |
| B4 | Dua jalur tidak dicampur: bukti (angka kartu; hanya bukti berstatus Live) dan temuan pencarian. Temuan tidak pernah menjadi bukti, tidak disimpan per pengguna, tidak masuk Proposal Diri sebagai fakta, bukan bahan S4, dan tidak dipakai untuk menokohkan orang | jawaban Chief 14.08 | U3, U11, V17 |
| B5 | Keselamatan: tiap pintu AI baru melewati lapis distress yang tayang sebelum model dipanggil. Fungsi baru lahir dengan bendera mati dan hanya dinyalakan Raihan. Tinjauan manusia adalah prasyarat tayang | jawaban Chief 12.23 dan 14.08 | V31, U4 |
| B6 | Tulisan bebas pengguna di bawah 18 disimpan hanya di perangkatnya, tidak ke server, tidak ke AI | putusan Chief Sulu | V42, V30 |

Cakupan B6: isian baru yang dibawa sambungan ini. Kode tayang hari ini berjalan berbeda dan tidak diubah oleh dokumen ini. Di `broaden-roles`, teks kemampuan dan nilai pengguna di bawah 18 sampai ke fungsi tepi, dibaca lapis distress, lalu dikosongkan sebelum model dipanggil. `generate-reflection` menyebut refleksi pengguna di bawah 18 tersimpan. Menyamakan isian tayang dengan B6 adalah butir R11.

Arti "di bawah 18" di dokumen ini mengikuti kode tayang (`supabase/functions/_shared/usia.ts`): semua pemanggil selain akun yang bertanda dewasa, termasuk tamu, akun tanpa tanda usia, dan pembacaan yang gagal. Pengosongan masukan hanya berjalan bila saklar mode (c) hidup (`modeCHidup`, `_shared/ai.ts`). Akibatnya: set uji gerbang E memuat tamu dan akun tanpa tanda usia, dan gerbang Q memeriksa keadaan saklar itu sebelum tiap uji.

### 2.2 Putusan Chief Sulu (bukan putusan Raihan)

1. Pencarian lokal dibangun sebagai fungsi tepi baru. Fungsi itu tidak menumpang `career-chat` atau `generate-reflection`.
2. Kedua fungsi lama tetap tayang tanpa diubah di tonggak 2b. Perombakannya diajukan kepada Raihan di bagian 9 butir R1.
3. Formulir orang terdekat ditunda sampai kajian data pribadi ditandatangani.
4. Tulisan bebas pengguna di bawah 18 disimpan hanya di perangkat (B6).
5. Pencocokan ke program studi IOU tidak dilakukan.
6. S1 ditambah di samping. Keempat unsur lama "Gambaran arah daerahmu" tetap tayang sampai Raihan memutus per unsur (jawaban Chief 13.13).
7. Bekal untuk jalur cipta dan jalan lain dirangkai di sisi aplikasi dari data peta bekal pengguna. Kontrak tetap versi 1 (jawaban Chief 13.13).
8. Penyedia pencarian belum diputus. Akun dan biayanya keputusan Raihan (jawaban Chief 14.08).

### 2.3 Yang tetap tayang

- Tujuh Jalan Bakti, SDG, dan Lensa Kepedulian.
- Empat unsur "Gambaran arah daerahmu". Nasib tiap unsur diputuskan Raihan.
- Isi "Lihat Lebih Dekat".
- Dua daftar keterampilan (7 dan 25). Keduanya tidak digabung dan tidak diubah.
- Empat payung langkah dan "Minta dijembatani".
- Sintesis tanpa AI baru.
- Ringkasan tanpa label atau skor. Surat dan cetak tetap.
- S4: wadah dan nama "Nyalakan peran yang belum terlihat" tetap. Tampilan dan pagar anti-vonis tetap.
- S9: angka Insight lain tetap.
- Dua fungsi tepi lama (`career-chat`, `generate-reflection`).

## 3. Langkah S1–S16

| # | Bagian | Tempat di alur tayang | Isi | Prasyarat | Niat |
|---|---|---|---|---|---|
| S1 | Kartu kebutuhan dan peluang daerah | Lapis provinsi Peta Medan; "Gambaran arah daerahmu" di langkah Pahami (ditambah di samping); bagian peluang dan lapis dunia di Insight (diperkaya) | Jenis isi: kekurangan layanan, kekurangan tenaga (V1), peluang yang tumbuh (U1), arah pembangunan, program pemerintah (U7). Deprivasi multidimensi, daerah rawan, dan kemiskinan kota masuk bila ada sumbernya (V3). Keseluruhan tampak: kartu utama, sisanya di "lebih lanjut", dan terang menyebut kebutuhan yang belum punya kartu (U2, V22). Batas resolusi dinyatakan: provinsi dan kabupaten/kota (U6, V4). Tanpa provinsi, aplikasi meminta provinsi di tempat (V26). Urutan lapis: dunia, nasional, daerah (V9, V10). Isu sesudah 2030 berada di lapis dunia (V8). Angka yang terikat peristiwa menyebut konteks zamannya (V51). Teks memakai varian A dan mengikuti prinsip 8 dan 12 (V5, V6, V20, V21). Skema `lapis_provinsi.json` dikunci sesudah pesan [1303] dibaca (V52) | L1 (lima syarat terbit); gerbang S untuk slot provinsi; gerbang A, K, M; L4, L5 | U1, U2, U6, U7, U23, U32, V1, V3, V4, V5, V6, V8, V9, V10, V19, V20, V21, V22, V26, V51, V52 |
| S2 | Tiga keadaan kebutuhan (belum ada; ada tapi belum cukup; cukup tapi belum efektif) | Tanda pada kartu S1 | Nilainya kosong sampai ada sumber tentang pelaku. Angka `jarak` kartu tidak dipakai sebagai gantinya. Tanda diuji terhadap kesan melemahkan | S1 terbit; sumber tentang pelaku; rubrik gerbang G | V24 |
| S3 | Penjelajah lokal, tiga lapis | "Lihat Lebih Dekat" di langkah Pahami. Penempatan dikunci sesudah peta titik sentuh (V50) | (a) Hal untuk dicek di lapangan. Isinya dari sumber, bukan hipotesis tim, dan tanpa model (U34, U35, V49). Cara mengeceknya diarahkan ke desa, RT, RW (V4). (b) Pencarian berita, masalah sosial, arah pembangunan, dan program oleh AI dengan pagar di bagian 5 (U3, U17). Lapis ini lahir dengan bendera mati dan bisa dimatikan tanpa merusak (U4). Pencocokan ke profil dikerjakan sesudah pencarian, di sisi aplikasi. (c) Prompt siap pakai, lihat S14. Wadah (b): fungsi tepi baru (2.2 butir 1). Rancangannya mudah dipindah ke stack Tim IT (V34). Penyedia: dahulukan yang gratis atau yang dibangun sendiri (V35). Gemini dicatat sebagai calon (V36). Bahan: riset Gemini dan dokumen OECD yang lulus pemeriksaan bukti (U25). Variabel yang masuk prompt didaftar dan diuji silang (V18). Aturan data per usia ada di bagian 4 (V30, V42) | S10, S13, S15; L4 (V53), L6, L7, L8, L9, L10, L14, L15, L16; gerbang B, P, Q; bendera dinyalakan Raihan | U3, U4, U17, U18, U25, U34, U35, U36, V4, V18, V30, V33, V34, V35, V36, V38, V39, V42, V43, V49, V50, V53 |
| S4 | Jalur dan peran | "Nyalakan peran yang belum terlihat" | Wadah, nama, tampilan, dan pagar anti-vonis tetap. Prompt, masukan, dan skema keluaran berubah lewat PR Chief. Daftar perubahannya ada di 3.1 | S10, S12, S13, S15; L11, L12, L13, L14; gerbang C, J, L, O, Q | U8, U11, U12, U20, U22, U30, V2, V12, V13, V14, V15, V16, V17, V32, V46 |
| S5 | Bekal dan cara berlatih | Kenali Kompetensimu, peta bekal | Tiap jalur menunjuk bekal yang dilatih dan satu cara berlatih. Cara berlatih diambil dari isian `caraMelatih` peta bekal yang sudah bersumber. Tidak ada cara latih baru yang ditulis mesin. Untuk jalur cipta dan jalan lain, bekal dirangkai di sisi aplikasi (2.2 butir 7) | S12; S4 | U14, V45 |
| S6 | Langkah | "Rancang Langkah Pertamamu" | Cara mengecek dari S3(a) menjadi usulan langkah. Pengguna boleh mengambil lebih dari satu langkah (U10). Pengguna harus bergerak (U9). Langkah diarahkan ke desa, RT, RW (V4). Empat payung tetap | S3(a); L10 | U9, U10, V4 |
| S7 | Titik temu | Sintesis | Membaca medan, kebutuhan, dan jalur pilihan pengguna. Memanggil kembali isu Insight yang sudah dibaca pengguna. Tanpa model baru | S13 (pembaca "riwayat isu Insight yang dibaca"); S1, S4 | V11 |
| S8 | Setoran Proposal Diri | Ringkasan | Tiga baris dari kata pengguna sendiri: medan, kebutuhan bersumber, langkah. Catatan sepanjang jalan dicocokkan ke kebutuhan daerah (U15). Setoran bisa dibicarakan dengan orang tua, dengan persetujuan (V47). Tanpa label atau skor. Temuan pencarian tidak masuk sebagai fakta (B4) | S13 (pembaca "catatan sepanjang jalan"); S6 | U15, V47 |
| S9 | Fakta upah dan biaya hidup bersumber | Insight | Mengikuti prinsip 10. Tayang hanya bila Raihan setuju. Angka Insight lain tetap | persetujuan Raihan (R5); gerbang A; L18 | U28 |
| S10 | Keselamatan | Semua pintu AI | Lapis distress, saklar mati, dan tinjauan manusia. Ketiganya prasyarat tayang S3 dan S4 | lajur Chief; gerbang Q | V31 |
| S11 | "Titikmu" | Penutup lapis provinsi | Sesudah dunia, nasional, dan daerah, tampil titik pengguna (V9). Kalimat arahnya mengajak menjadi pemimpin lokal yang membumi, bukan mengejar mercusuar di Jakarta (U13). Pertemuan bekal, minat, dan nilai dengan satu kebutuhan hanya tampil bila punya dasar tertulis (V12, V17). Isu Insight yang sudah dibaca dipanggil kembali (V11). Tanpa model | S1 terbit; S12; L11 | U13, V9, V11, V12, V17 |
| S12 | Sumber bekal | Kenali Dirimu, Kenali Kompetensimu | Jawaban yang sudah ada dipanen (U8). Inventori bekal diisi lewat klik, tanpa pengukuran (U27). Tanpa penilaian AI. Formulir orang terdekat (U26) ditunda dan bukan bagian tonggak 2b (2.2 butir 3) | prasyarat bagi S4, S5, S11, S14 | U8, U26, U27 |
| S13 | Pembaca bernama | Lintas | Data pilihan pengguna hanya disimpan bila ada pembacanya. Temuan pencarian tidak disimpan. Daftarnya ada di 4.3 | prasyarat bagi S3, S4, S7, S8 | U15, V11, V30 |
| S14 | Prompt siap pakai | Di samping S3 | Prompt disusun dari wilayah, kebutuhan, dan bekal, untuk dipakai pengguna di model yang lebih kuat (U5, U21). Penyusunannya tanpa model, di perangkat pengguna, dan tanpa biaya penyedia. S14 juga jalan keluar saat pencarian nol atau topik di luar daftar (V38). Untuk di bawah 18: bawaannya tidak ditawarkan (R2) | S12; L14; putusan Raihan atas R2 | U5, U21, V38 |
| S15 | Tanda keluaran | Semua keluaran | Tanda "dibuat AI" hanya untuk keluaran model. Isi kurasi bertanda lain | prasyarat bagi S3 dan S4; gerbang O | U22, V37 |
| S16 | Halaman metode | Baru (pengecualian yang diajukan) | Menjelaskan konstruk kartu bagi Guru BK, orang tua, dan penelaah: jarak dari pembanding, arah, tiga keadaan, dan label keandalan | S1 terbit; putusan Raihan atas R6 | V44, V48 |

### 3.1 Perubahan S4 lewat PR Chief

1. Sapaan: siapa pun, bukan hanya siswa (U37).
2. Aturan "jabatan nyata" ditambah jalur cipta. Tiap keluaran berstatus ok memuat paling sedikit satu jalur cipta (U12).
3. Masukan untuk dewasa: medan, siapa, provinsi, kartu, minat, nilai, dan kemampuan yang disamarkan (U8, V12, V30).
4. Masukan untuk di bawah 18 mengikuti kode tayang: medan, siapa, provinsi, dan kartu. Bekal, minat, dan nilai mereka dipakai di luar model, dari pilihan terstruktur (U8, V30).
5. Skema keluaran: dasar pencocokan tiap jalur (V17), bekal yang belum ada beserta jalan keluarnya lewat belajar atau kolaborasi (V14), dan data bersumber tentang kemampuan yang dituntut peran (V46). Untuk di bawah 18, bekal yang belum ada dihasilkan di baris "S4, pencocokan bekal" di luar model, bukan oleh model.
6. Contoh peran terikat bekal jurusan (U20). Data keterampilan yang kurang dan yang berlebih pasokan menjadi bahan, bersumber (V2). Untuk di bawah 18, keterikatan jurusan juga dikerjakan di luar model. Jurusan belum ada di daftar masukan mana pun: asalnya dicari dulu di jawaban yang sudah ada (prinsip 3), dan bila tidak ada ia diajukan sebagai pengecualian di 9.2.
7. Pengguna yang sudah memilih jurusan diperkaya pilihannya, tidak diganti (V13).
8. Saringan peran: peran contoh dan jalur cipta yang tidak islami tidak tampil (V16).
9. Keluaran tidak membeo keinginan pengguna (V15) dan tidak menutup pilihan siswa terlalu dini (V32).
10. Tiap keluaran model bertanda "dibuat AI" (U22).
11. Temuan pencarian bukan bahan S4 (B4).

## 4. Aturan per pintu AI dan per kelompok usia

### 4.1 Data masuk, keluar, dan simpan

| Langkah | Model | Masuk: dewasa | Masuk: di bawah 18 | Keluar | Simpan |
|---|---|---|---|---|---|
| S1 | tanpa model | provinsi | provinsi | kartu bersumber | provinsi: profil bagi yang login |
| S3(a) hal untuk dicek | tanpa model | kartu wilayah | kartu wilayah; pilihan gejala terstruktur dari kartu | butir bertanda kurasi, dengan cara mengecek | tidak ada |
| S3(b) pencarian | fungsi tepi baru; tahap pertama tanpa model bahasa, hanya memanggil layanan pencarian | wilayah, topik dari daftar tertutup hasil kurasi, paling banyak tiga kata kunci huruf saja | wilayah dan topik pilihan saja | temuan bertanda "dari pencarian, perlu kamu cek" | temuan tidak disimpan |
| S4 | ya | medan, siapa, provinsi, kartu, minat, nilai, kemampuan (disamarkan) | medan, siapa, provinsi, kartu | jalur bertanda "dibuat AI" | mengikuti S13 |
| S4, pencocokan bekal | tanpa model | tidak dipakai | bekal, minat, nilai dari pilihan terstruktur | hasil pencocokan di sisi aplikasi | mengikuti S13 |
| S7 | tanpa model | medan, kebutuhan, jalur, riwayat isu Insight | sama | titik temu | mengikuti S13 |
| S8 | tanpa model | kata pengguna, catatan sepanjang jalan | sama; tulisan bebasnya hanya di perangkat (B6) | tiga baris setoran | mengikuti S13 |
| S11 | tanpa model | bekal, minat, nilai, satu kebutuhan | sama, dari pilihan terstruktur | kalimat penutup | tidak ada |
| S14 | tanpa model | wilayah, kebutuhan, bekal | bawaan: tidak ditawarkan. Bila Raihan memutuskan ditawarkan (R2), isi prompt hanya wilayah dan kebutuhan pilihan, tanpa bekal, nilai, dan teks bebas | teks prompt untuk disalin | tidak ada |

Niat yang dijaga tabel ini: V30, V17, V49, U34, U8.

### 4.2 Aturan tulisan pengguna

1. Tulisan bebas pengguna di bawah 18 disimpan hanya di perangkatnya, tidak ke server, tidak ke AI (V42, V30).
2. Kalimat bebas pengguna tidak pernah masuk kueri pencarian, pada usia berapa pun (U35).
3. Tidak ada tulisan pengguna yang dikirim ke model di S3. Isian gejala dewasa hanya menjadi catatan pengguna sendiri untuk dibawa mengecek ke lapangan; ia tidak mengubah butir S3(a).
4. Tiap teks dewasa yang dikirim ke model disamarkan otomatis sebelum model dipanggil (V30). Hari ini hal itu berlaku di S4.

### 4.3 Daftar data dan pembaca bernama (S13)

| Data | Langkah | Tempat simpan | Pembaca bernama | Niat |
|---|---|---|---|---|
| Provinsi | S1 | profil bagi yang login | aplikasi (S1, S3, S4) | V26 |
| Hasil klik inventori bekal | S12 | sudah ada di aplikasi | S4, S5, S11, S14 | U27 |
| Kata kunci pencarian dewasa | S3(b) | tidak disimpan | fungsi pencarian, sekali pakai | U35 |
| Riwayat isu Insight yang dibaca | S7 | ditetapkan Chief Sulu | S7 dan S11 | V11 |
| Catatan sepanjang jalan | S8 | dewasa: ditetapkan Chief Sulu; di bawah 18: hanya di perangkat (B6) | pengguna; S8 | U15 |
| Tulisan bebas pengguna di bawah 18 | S3 | perangkat pengguna saja | hanya pengguna | V42 |
| Isian gejala setempat (dewasa) | S3 | tidak disimpan | hanya pengguna | U35 |
| Temuan pencarian | S3(b) | tidak disimpan | tidak ada | U3 |
| Topik yang nol temuan atau di luar daftar | S3(b), S14 | catatan kurasi, hanya topik dan wilayah, tanpa identitas pengguna | kurator sesi mesin | V38 |
| Jawaban formulir orang terdekat | S12 | ditunda (2.2 butir 3) | pengguna, bila kelak dibuka | U26 |
| Setoran yang dibagikan ke orang tua | S8 | mengikuti persetujuan pengguna; untuk di bawah 18 cara berbagi tanpa server belum ditetapkan (R12) | orang tua | V47 |

## 5. Pagar pencarian

Niat yang dijaga: U3, U35, U4, U11, V33, V38, V43.

### 5.1 Dua jalur, tidak dicampur

| | Bukti | Temuan pencarian |
|---|---|---|
| Isi | angka kartu bersumber dan bertahun | berita dan laman resmi tentang kebutuhan itu di wilayah pengguna |
| Syarat tampil | kartu terbit, bukti Live | https, penerbit, tanggal terbit, umur paling lama 24 bulan, bertanda "dari pencarian, perlu kamu cek" |
| Yang ditulis Sulu | teks kartu varian A | tidak ada ringkasan isi; hanya judul asli, penerbit, tanggal, tautan, dan satu pertanyaan cek |
| Urutan | tidak ada | laman pemerintah, lalu media besar, lalu lainnya; paling banyak lima |

### 5.2 Pagar kueri (`mesin/sambung/pencarian.py`)

1. Kueri hanya disusun dari nama wilayah resmi, kata topik dari daftar tertutup hasil kurasi, dan paling banyak tiga kata kunci pengguna (huruf saja).
2. Kalimat bebas pengguna tidak pernah masuk kueri.
3. Untuk pengguna di bawah 18, kata kunci pengguna ditolak. Pencarian tetap jalan dari wilayah dan kebutuhan yang ia pilih.
4. Profil pengguna tidak masuk kueri. Pencocokan ke profil dikerjakan sesudah pencarian, di sisi aplikasi.
5. Kueri berbentuk "berita" ditambah topik, wilayah, dan tahun. Uji coba 15 Nov 14.02: kueri tanpa kata "berita" menghasilkan 16 berkas jurnal dari 17 hasil. Kueri dengan kata "berita" menghasilkan 15 berita atau laman pemerintah dari 19 hasil.

### 5.3 Syarat temuan

1. Tanggal terbit diambil dari halaman. Hasil pencarian tidak memuat tanggal terbit, jadi halaman dibuka dulu sebelum temuan boleh tampil.
2. Butir yang menyangkut kasus orang pribadi, kriminal, atau kekerasan dibuang utuh.
3. Tema sensitif yang dimaksud V33 ditahan. Aturan ini bawaan sampai Raihan menjawab R3.
4. Temuan tidak dipakai untuk menokohkan orang (U11).

### 5.4 Saat nol temuan atau topik di luar daftar

1. Tampil kalimat netral: "Belum ada berita yang cocok."
2. Pengguna dewasa ditawari S14. Pengguna di bawah 18 mengikuti R2.
3. Topiknya dicatat untuk dikurasi (V38). Yang dicatat hanya topik dan wilayah.

### 5.5 Topik kueri

`pencarian.py` hari ini memuat empat topik kebutuhan. Masalah sosial, arah pembangunan, dan program pemerintah belum ada (U3, U7). Daftar topik berstatus sementara sampai dikurasi dari sumber (L8) dan dipetakan (L9). Daftar itu tidak boleh sampai ke pengguna dalam bentuk sekarang.

### 5.6 Yang belum ada

Pemanggilan pencarian dan pembacaan tanggal di sisi aplikasi (lajur Chief). Biaya per pencarian. Uji pada kabupaten 3T (L16). Penanganan berita yang menyebut nama orang pribadi di sisi aplikasi. Penggabungan dengan RAG atas data yang sudah dimiliki (versi 1 bagian 11) belum dirancang.

## 6. Gerbang A–S

Ambang yang belum berangka ditetapkan sebelum uji dijalankan. Penetapnya: sesi mesin mengusulkan dan mencatatnya sebelum uji, pemeriksa terpisah menilai kewajarannya, dan gerbang G dikalibrasi ke Raihan. Alat ukur dibuat dengan urutan: C, K, L, O, Q lebih dulu (U23), lalu sisanya.

| Gerbang | Niat yang dijaga | Ambang lulus | Alat ukur dan yang masih kurang | Status alat hari ini |
|---|---|---|---|---|
| A. Bersumber | U32, V19, V6 | 100% angka yang tampil punya sumber, tahun, atribusi penerbit, dan catatan relevansi. Sumber berjenis layak dan bertahun terbaru yang tersedia. Cakupan termasuk angka di bagian peluang Insight yang diperkaya | `mesin/sambung/uji_s1.py`. Kurang: bidang penerbit, catatan relevansi, jenis sumber, aturan tahun terbaru | ada untuk data saja |
| B. Hal untuk dicek | U34, U35, V49 | 100% butir S3(a) bertanda, punya cara mengecek, dan bersumber | `mesin/sambung/uji_penjelajah.py`. Kurang: bidang sumber per butir. Bank butir sekarang berstatus sementara | ada, belum mengukur klaimnya |
| C. Tanpa vonis | U12, V13, V15, V16, V32 | Cakupan: keluaran S4, S5, S7, S11. 0 vonis. Paling sedikit 1 jalur cipta pada keluaran berstatus ok. Tidak membeo. Tidak menutup pilihan siswa terlalu dini. 0 peran yang lolos saringan peran padahal harus ditahan | Kurang: rubrik, set uji (profil siswa, kasus peran tidak islami, kasus membeo), definisi "membeo" dan "menutup terlalu dini". Lapis 1 yang ada hanya memeriksa butir S3 | belum ada |
| D. Isi tayang utuh | U33, V10 | Tidak ada rute, halaman, fungsi tepi, pemanggilan, bidang, berkas isi, ekspor, komponen, atau render yang hilang. Teks yang berkurang tercetak dan butuh persetujuan Raihan. Potret kosong ditolak | `mesin/sambung/garis_dasar.py`. Kurang: hitungan komponen dan render; angka bidang provinsi 5 | ada sebagian |
| E. Siapa pun | U37, V43, V48 | Set uji memuat siswa, mahasiswa, dewasa 40–50, umum, kabupaten 3T, serta Guru BK dan orang tua sebagai pembaca | Kurang: set uji, jumlah per kelompok, ambang, arti "sebagai pembaca" | belum ada |
| F. Dua pertanyaan dan dapat dikerjakan | U9, U16, V48 | Tiap bagian mengisi Proposal Diri atau menyambungkan ke manusia, dan berujung tindakan | Kurang: daftar bagian dan cara menilai "berujung tindakan" | belum ada |
| G. Penilai | V23, V24, V25, U38 | Penilai dikalibrasi ke Raihan sebelum dipercaya. Butir rubrik: nada sesuai prinsip 8 (ceria, lembut, memicu tafāʾul); tidak melemahkan, termasuk pada S2 dan S3; terasa hidup dan lokal (V25) | Kurang: jumlah contoh, ambang kesepakatan, definisi butir rubrik | belum ada |
| H. Langkah jelas | U9, U10 | Pengguna uji bisa menyebut langkah yang akan ia ambil | Kurang: protokol dan jumlah pengguna uji | belum ada |
| I. Bukan bimbingan karier | U29 | 0 klaim itu di teks | Kurang: daftar frasa klaim dan cakupan teks yang dipindai | belum ada |
| J. Arah milik pengguna | U12, U13, V12 | (1) Tiap sesi simulasi persona muda dan dewasa berakhir dengan rumusan dalam kata pengguna sendiri. (2) Keberagaman gagasan antarpersona dipantau. (3) Raihan menilai sampel sesi utuh. (4) 0 jabatan struktural atau peran berhonor program tampil sebagai tujuan | Asal: `UJI_Setia-Niat_15Nov2026.md` bagian C. Kurang: set persona, ukuran keberagaman, jumlah sampel | belum ada |
| K. Kesegaran | U23, V51 | Kartu yang melewati batas umur ditandai usang dan tidak tampil sebagai keadaan sekarang. Konteks zaman angka disebut | Kurang: batas umur per jenis kartu dan bidang konteks zaman | belum ada |
| L. Kekhususan | U30, U8 | Keluaran memuat unsur dari kartu wilayah itu dan dari bekal pengguna itu. Dua profil berbeda tidak mendapat keluaran yang sama. Untuk di bawah 18, unsur bekal diperiksa pada hasil pencocokan di luar model, bukan pada keluaran model | Kurang: ukuran kemiripan dan pemeriksa unsur | belum ada |
| M. Tampilan dan istilah | U31, V27, V28, V29 | Uji pengguna dan tinjauan tampilan lulus. Istilah dapur tidak tampil. Kata yang dihindari tidak dipakai. Teks kartu paling banyak tiga kalimat | Kurang: daftar istilah dapur beserta padanannya, daftar kata dihindari, protokol uji tampilan, penghitung kalimat | belum ada |
| N. Pilot | V40 | Ukuran minimum dan daftar klaim yang boleh dan tidak boleh dibuat ditetapkan sebelum pilot | Kurang: ukuran pilot dan daftar klaim | belum ada |
| O. Tanda keluaran | U22, V37 | 100% keluaran model (hari ini hanya S4) bertanda "dibuat AI". 100% temuan S3(b) bertanda "dari pencarian, perlu kamu cek"; bila kelak S3(b) memakai model bahasa, keluarannya juga bertanda "dibuat AI". Isi kurasi bertanda lain | Kurang: pemeriksa tanda pada keluaran S3(b) dan S4; keterangan di `pencarian.py` sudah disamakan bunyinya | belum ada |
| P. Temuan pencarian | U3, U35, V33 | Semua aturan bagian 5.2 dan 5.3 dipenuhi | `mesin/sambung/uji_pencarian.py`. Kurang: kasus tema sensitif (R3) | ada; lulus untuk 5.2 dan 5.3 butir 2 pada modul mesin. Belum diukur: 5.3 butir 1, 3, 4 dan fungsi tepi yang kelak tayang |
| Q. Keselamatan dan privasi | V30, V31, V42 | Lapis distress dijalankan sebelum model. Saklar mati berfungsi. Tinjauan manusia berjalan. Penyamaran berjalan. Aturan 4.1 dan 4.2 dipenuhi, termasuk daftar masukan model untuk di bawah 18 | Kurang: seluruh alat; bentuk tinjauan manusia ditetapkan Chief | belum ada |
| R. Larangan | U16, U19 | 0 kerangka maqashid. 0 jualan IOU. 0 pencocokan ke program studi IOU. `iou_program_relevance` tetap tidak dirender dan tidak masuk `lapis_provinsi.json`. 0 nama yang dilarang prinsip 13 sebagai sumber | Kurang: daftar frasa dan cakupan teks | belum ada |
| S. Skema provinsi (gerbang keras) | U6, V19, V52 | Slot provinsi Peta Medan menyala hanya bila: (1) tiap bidang `lapis_provinsi.json` punya sumber, tahun, dan aturan isi tertulis; (2) gerbang A dan K lulus untuk isinya; (3) pesan [1303] sudah dibaca dan dipetakan ke skema; (4) provinsi tanpa kartu terbit tampil sebagai "belum ada data bersumber"; (5) Chief Sulu menerima skemanya lewat PR | Kurang: pemeriksa skema | belum ada |

## 7. Pemetaan ke kontrak

Tabel versi 1 (dicek ke skema `jalur-jelajah/1` pada 15 Nov 12.33) dipulihkan. Kolom terakhir baru.

| Langkah | Muat? | Di mana | Berubah di v3 |
|---|---|---|---|
| S1 kartu | di luar kontrak | skema kartu; `kebutuhan.kartu_id` dan `angka_kunci` di jalur menunjuk kartu | Jenis isi bertambah: tenaga, peluang, arah, program, deprivasi. Skema kartu perlu dinilai ulang (L3) |
| S2 tiga keadaan | belum bisa diisi | butuh sumber tentang pelaku. Sampai ada sumbernya, nilainya kosong | tidak berubah |
| S3 hal untuk dicek | di luar kontrak | isi refleksi; dirangkai di sisi aplikasi | tidak berubah |
| S4 jalur cipta dan peran contoh | muat untuk jalur cipta dan peran contoh | kontrak mewajibkan satu jalur `cipta` dan satu `jalan_lain`; `peran_contoh.jenis` punya nilai `belum_bernama` | Bidang baru: dasar pencocokan, bekal yang belum ada beserta jalan keluar, data kemampuan, tanda "dibuat AI". Muat atau tidaknya belum dicek (L3) |
| S5 bekal | muat untuk jalur data saja | `skill[].simpul_skillmap` | tidak berubah |
| S6 langkah dari cara cek | di luar kontrak | turunan S3; `langkah_pertama` kontrak tidak punya bidang payung | tidak berubah |
| S7, S8 | di luar kontrak | kata pengguna sendiri | tidak berubah |
| S9 fakta upah | di luar kontrak | isi Insight dan satu kalimat aturan di prompt S4 | Baru di pemetaan |
| S10 keselamatan | di luar kontrak | modul bersama fungsi tepi (distress, saklar, usia) | Baru di pemetaan |
| S11 "Titikmu" | belum dipetakan | calon: dirangkai di sisi aplikasi | Baru di pemetaan. Butuh dasar tertulis per pertemuan (L11) |
| S12 sumber bekal | belum dipetakan | data peta bekal pengguna di aplikasi | Baru di pemetaan |
| S13 pembaca bernama | di luar kontrak | aturan simpan di aplikasi | Baru di pemetaan |
| S14 prompt siap pakai | di luar kontrak | disusun di perangkat pengguna | Baru di pemetaan |
| S15 tanda keluaran | belum dipetakan | calon: bidang tanda pada keluaran S4 ("dibuat AI") dan temuan S3(b) ("dari pencarian, perlu kamu cek") | Baru di pemetaan |
| S16 halaman metode | di luar kontrak | halaman baru | Baru di pemetaan |

K5 (versi 1): S5 belum muat untuk jalur cipta. Bidang bekal hanya ada pada jalur data. Jalur cipta dan jalan lain tidak punya. Kesimpulan "tidak perlu kontrak versi 2" ditarik dan hal ini diajukan ke Chief Sulu.

Jawaban Chief Sulu 15 Nov 13.13 (Ledger, RENCANA v3.5): bekal untuk jalur cipta dan jalan lain dirangkai di sisi aplikasi dari data peta bekal pengguna. Kontrak tetap versi 1.

Akibat bagi v3: jawaban itu mendahului bidang baru S4. L3 menilai apakah bidang baru itu muat di kontrak versi 1, lalu hasilnya diajukan ke Chief.

## 8. Urutan kerja

### 8.1 L1: penerbitan kartu ke status `terbit` (jalur kritis S1)

Tanpa L1, lapis provinsi kosong. Sebuah kartu naik ke `terbit` bila kelima syarat ini terpenuhi.

| Syarat | Isi | Pemilik | Status |
|---|---|---|---|
| T1 | Lulus pemeriksa skema dan sumber | sesi mesin | sudah |
| T2 | Angka dicocokkan peninjau terpisah ke sumber | peninjau terpisah | sudah untuk 900 kartu, 14 Nov |
| T3 | Baris sumber di basis bukti Sulu berstatus Live | Chief Sulu (pemeriksaan bukti) | dua baris berstatus Proposed ditulis sesi mesin 15 Nov; kenaikan ke Live belum |
| T4 | Varian teks dipilih Raihan | Raihan | sudah: varian A |
| T5 | Cara tampil label keandalan "hati-hati" ditetapkan | Raihan, atas usul sesi mesin (R4) | belum; semua kartu berlabel itu |

Untuk 73 kartu provinsi ada dua syarat tambahan sebelum T1–T5: publikasi kedua yang independen bagi 35 kartu stunting, dan kontrak data bagi 38 kartu jaminan kesehatan. Pemiliknya sesi mesin. Beda daftar nilai keandalan antara skema kartu dan kontrak diselesaikan di L3.

### 8.2 Langkah bernama

| Langkah | Isi | Pemilik | Niat | Melayani |
|---|---|---|---|---|
| L1 | Penerbitan kartu (8.1) | lihat 8.1 | U23, U32, V19 | S1, S2, S11, S16 |
| L2 | Perbaikan `garis_dasar.py`: komponen, render, angka bidang 5, hitung ulang pada @714d3f7 | sesi mesin | U33 | gerbang D |
| L3 | Pemetaan ulang S1–S16 ke kontrak `jalur-jelajah/1` dan skema kartu; hasil diajukan ke Chief | sesi mesin; putusan Chief Sulu | V17, V46 | bagian 7 |
| L4 | Bacaan wajib: pesan [1303] dan transkrip "Data Verify" | sesi mesin, dari arsip di laptop | V52, V53 | S1, S3, gerbang S |
| L5 | Inventaris: bagian peluang dan lapis dunia yang tayang; riset Gemini dan dokumen OECD | sesi mesin; bahan dari Raihan | V10, V9, U25 | S1, S3 |
| L6 | Peta titik sentuh sepanjang Jalan Bakti, sebelum S3 dikunci | sesi mesin; tinjauan Chief Sulu | V50 | S3 |
| L7 | Pembanding per fitur: penjelajah lokal, kartu, prompt siap pakai. Dipindai sebelum rancangan dikunci | sesi mesin | U17, U36 | S1, S3, S14 |
| L8 | Kurasi sumber untuk S3(a) dan topik kueri. Saat mengurasi dokumen arah pembangunan, catat yang ditekankan dokumen tetapi tidak ada di daftar | sesi mesin | U34, V49, V39, U3, U7 | S3, bagian 5.5 |
| L9 | Pemetaan jenis kebutuhan kartu dan topik kueri ke "8 ashnaf zakat" dan "PMKS" yang sudah tayang | sesi mesin; tinjauan Chief Sulu | V7 | S1, S3 |
| L10 | Arah ke desa, RT, RW pada cara mengecek (S3) dan langkah (S6) | sesi mesin | V4 | S3, S6 |
| L11 | Aturan dasar pencocokan: tiap pertemuan bekal dan kebutuhan menyebut sumber atau aturan tertulisnya; yang tanpa dasar tidak tampil | sesi mesin; tinjauan Chief Sulu | V17 | S4, S11 |
| L12 | Kurasi data keterampilan: yang kurang pasokan, yang berlebih pasokan, dan kemampuan yang dituntut peran, semuanya bersumber | sesi mesin | V2, V46, U20 | S4 |
| L13 | Saringan peran: aturan tertulis dan kasus ujinya | sesi mesin; putusan isi oleh Raihan | V16 | S4, gerbang C |
| L14 | Daftar variabel yang masuk prompt S3, S4, dan S14 beserta asalnya; diuji silang sebelum dikunci | sesi mesin | V18 | S3, S4, S14 |
| L15 | Set uji tetap "kemampuan model memberi konteks lokal" per provinsi. Jumlah butir per provinsi dan ambang lulus ditetapkan sebelum uji | sesi mesin; ambang disetujui Raihan | U18 | S3, S4 |
| L16 | Uji pencarian untuk kabupaten 3T. Sebelum penyedia diputus (R8) uji memakai `uji_pencarian.py` dengan fixture 3T; uji atas hasil nyata menunggu R8 | sesi mesin | V43 | S3(b), gerbang E dan P |
| L17 | Alat ukur gerbang: C, K, L, O, Q lebih dulu; lalu A, B, D (pelengkap), E, F, G, H, I, J, M, N, R, S | sesi mesin; kalibrasi G dan penilaian J oleh Raihan | U23 | bagian 6 |
| L18 | Cek angka kepala desa ke sumber asli. Dokumen lama menulis 56,4%, yang tayang 57,54%. Keduanya belum dicek | sesi mesin | U32 | S9, gerbang A |
| L19 | Prasyarat lintas: S10 (keselamatan), S12 (sumber bekal), S13 (pembaca bernama), S15 (tanda keluaran). Isi S12 dan S15 disiapkan sebelum L21. Pemasangan S10, S13, S15 pada pintu baru dikerjakan di dalam PR L21 dan menjadi syarat tayang, bukan syarat mulai | S10 dan S13: Chief Sulu. S12 dan S15: sesi mesin untuk isi, Chief Sulu untuk pemasangan | V31, U8, V11, U22 | S3, S4, S7, S8 |
| L20 | Kerja di `mesin/`: jenis kartu tambahan (S1), tanda S2, isi S3(a), penyusun S14, penunjuk bekal dan cara berlatih (S5), usulan langkah (S6) | sesi mesin | U1, U5, U14, U9 | S1, S2, S3, S5, S6, S14 |
| L21 | Usulan PR untuk Chief: perubahan S4 (3.1), fungsi tepi baru S3(b), S7, S8, S9, S11, S16 | usulan sesi mesin; PR Chief Sulu | U12, V11, V44 | S3, S4, S7, S8, S9, S11, S16 |
| L21a | Jalankan semua gerbang pada hasil L20 dan L21 sebelum bendera mana pun dinyalakan | sesi mesin; pemeriksa terpisah | U23 | semua gerbang |
| L21b | Sumber tentang pelaku untuk S2: dicari dan dikurasi; sampai ada, tanda S2 kosong | sesi mesin | V24 | S2 |
| L21c | Isi halaman metode (S16): konstruk kartu, sumber, batas | sesi mesin; pemasangan Chief Sulu | V44 | S16 |
| L22 | Pilot: ukuran minimum dan daftar klaim | sesi mesin; putusan Raihan | V40 | gerbang N |

Urutannya: L1 dan L2 berjalan lebih dulu. L3 sampai L16 mendahului kode. L17 mendahului klaim lulus gerbang mana pun. Isi L19 mendahului L21, dan pemasangannya ada di dalam L21. S5 di L20 memakai skema jalur S4 yang ditetapkan L3, bukan menunggu L21. L21a mendahului penyalaan bendera. L20 dan L21 baru berjalan sesudah itu.

### 8.3 Tempat tiap S di urutan kerja

| Langkah S | Ada di |
|---|---|
| S1 | L1, L3, L4, L5, L9, L20 |
| S2 | L1, L17 (rubrik G), L20 |
| S3 | L6, L7, L8, L9, L10, L14, L15, L16, L19, L20, L21 |
| S4 | L11, L12, L13, L14, L15, L19, L21 |
| S5 | L20, sesudah S12 di L19 |
| S6 | L10, L20 |
| S7 | L19 (S13), L21 |
| S8 | L19 (S13), L21 |
| S9 | L18, L21, sesudah R5 dijawab |
| S10 | L19 (prasyarat) |
| S11 | L1, L11, L21 |
| S12 | L19 (prasyarat) |
| S13 | L19 (prasyarat) |
| S14 | L7, L14, L20, sesudah R2 dijawab |
| S15 | L19 (prasyarat), L17 (gerbang O) |
| S16 | L21, sesudah R6 dijawab |

## 9. Butir untuk Raihan

### 9.1 Pertanyaan

| # | Butir | Bawaan sampai dijawab | Niat |
|---|---|---|---|
| R1 | Perombakan dua fungsi lama: kapan dan dalam bentuk apa. Kutipan U24: "Apa itu semua bisa di-revamp untuk arsitektur baru kita?" Putusan Chief Sulu di 2.2 membiarkan keduanya tayang tanpa diubah di tonggak 2b | keduanya tetap tayang, tidak dirombak | U24 |
| R2 | Apakah prompt siap pakai (S14) ditawarkan kepada pengguna di bawah 18. Prompt itu dibawa ke model luar tanpa lapis distress | tidak ditawarkan kepada di bawah 18 | U5, V31 |
| R3 | Apakah saringan pencarian menahan tema sensitif yang dimaksud V33 | ditahan | V33 |
| R4 | Cara tampil label keandalan "hati-hati" (T5). Semua kartu berlabel itu | kartu tidak naik ke `terbit` | U32 |
| R5 | Apakah S9 tayang | tidak tayang | U28 |
| R6 | Putusan atas tiap pengecualian di 9.2 | tidak dipasang | V41 |
| R7 | Nasib tiap unsur "Gambaran arah daerahmu" | keempatnya tetap tayang | V26 |
| R8 | Penyalaan bendera pencarian S3(b), berikut penyedia, akun, dan biayanya | bendera mati | U4, V35, V36 |
| R9 | Persetujuan atas teks tayang yang berkurang (gerbang D), kalibrasi penilai (gerbang G), dan penilaian sesi utuh (gerbang J) | tidak ada klaim lulus | V25 |
| R10 | Isi saringan peran (L13) dan ambang set uji konteks lokal (L15) | S4 tidak diajukan sebagai PR | V16, U18 |
| R11 | Apakah isian tayang pengguna di bawah 18 (teks kemampuan dan nilai di `broaden-roles`, refleksi di `generate-reflection`) disamakan dengan B6 | kode tayang tidak diubah | V42, V30 |
| R12 | Cara pengguna di bawah 18 berbagi setoran ke orang tua bila tulisannya hanya ada di perangkat | belum ada fitur berbagi untuk di bawah 18 | V47 |
| R13 | Lapis distress untuk tulisan pengguna di bawah 18 yang hanya ada di perangkat: tulisan itu tidak melewati lapis distress server | rujukan bantuan statis selalu tampil di layar tempat menulis | V31, V42 |

Butir R1 sampai R13 belum diuji balik ke riwayat chat. Sebelum satu pun diajukan ke Raihan, tiap butir diuji dengan dua pola kata di register, pencarian chat lampau, dan Ledger.

### 9.2 Pengecualian yang diajukan (prinsip 3)

| Tambahan | Data yang dikumpulkan | Pembaca | Catatan |
|---|---|---|---|
| Isian gejala setempat (S3), dewasa | teks pendek | hanya pengguna; tidak disimpan; tidak dikirim ke model; tidak masuk kueri | boleh dilewati; jawaban yang ada dipanen dulu; Raihan memutuskan di akhir tonggak |
| Tulisan untuk diri sendiri bagi di bawah 18 (S3) | teks bebas | hanya pengguna | disimpan hanya di perangkatnya, tidak ke server, tidak ke AI (B6) |
| Kata kunci pencarian (S3(b)), dewasa | paling banyak tiga kata, huruf saja | fungsi pencarian; tidak disimpan | isian baru; tidak ditawarkan kepada di bawah 18 |
| Minta provinsi di tempat (S1) | provinsi | aplikasi | sudah ada di profil bagi yang login |
| Formulir orang terdekat (S12) | jawaban pihak ketiga | pengguna | data pihak ketiga; butuh pembaca bernama dan persetujuan orang itu; ditunda sampai kajian data pribadi ditandatangani; lajur Chief |
| Prompt siap pakai (S14) | tidak ada | tidak ada | disusun di perangkat pengguna; untuk di bawah 18 lihat R2 |
| "Titikmu" (S11) | tidak ada | tidak ada | kalimat penutup |
| Berbagi dengan orang tua (S8) | tidak ada data baru | orang tua | dengan persetujuan |
| Halaman metode (S16) | tidak ada | publik | layar baru |

## 10. Keputusan dan pembagian lajur

### 10.1 Keputusan Raihan yang mengikat dokumen ini

Empat ucapan di 0.1 dan tiga keputusan di 0.2. Akibat keputusan 17.49 bagi mesin tertulis di prinsip 13. Perubahan nama itu di kode tayang adalah lajur Chief Sulu.

### 10.2 Putusan Chief Sulu

Delapan butir di 2.2 dan batas B1–B6 di 2.1.

### 10.3 Pembagian lajur (Ledger 15 Nov, titipan triase)

- Sesi mesin memegang sisi niat: indeks, dan setia atau tidaknya rancangan. Sesi mesin menulis isi dan data di `mesin/`.
- Chief Sulu memegang kode tayang.
- Titik temu: tabel triase di folder BUKU dan manifest tahap berikutnya.

### 10.4 Diserahkan ke Chief Sulu

- Arahan yang hilang atau melemah di dokumen arsitektur dan menyangkut bagian lain Sulu: BT1–BT24 dan sepuluh butir pemulihan di bagian E audit pertama. Dua risiko terbuka: istilah yang Raihan minta tidak ditampilkan masih ada di glosarium (BT21), dan penautan kartu ke program IOU (BT4).
- Audit keandalan 38 entri provinsi (U6).
- Kenaikan baris sumber ke Live (T3).
- Fungsi tepi pencarian dan penyedianya.
- Pemasangan formulir orang terdekat sesudah kajian ditandatangani (U26).
- Pemasangan apa pun ke kode tayang.

### 10.5 Permintaan versi 1 kepada Chief Sulu yang jawabannya tidak tercatat di berkas yang saya baca

1. RENCANA Build v3.3 §4 menulis "Sumber peran: broaden-roles diganti peta peran berbukti saat ME3 lulus." Usul versi 1: ganti menjadi "broaden-roles tetap, diberi bahan dari kartu, penjelajah lokal, dan bekal pengguna". Sesudah B4, kata "penjelajah lokal" di usul itu hanya berarti hal untuk dicek, bukan temuan pencarian.
2. Lengan pilot "Jalan Bakti lama lawan mesin" tidak lagi tepat. Usul versi 1: bandingkan Jalan Bakti tanpa dan dengan S1–S4. Ukurannya mengikuti gerbang N.

Keduanya tetap terbuka. Tiga permintaan lain di versi 1 sudah dijawab: kontrak (bagian 7), penulis `province_contexts` (B2), dan distress (B5).

### 10.6 Batas dokumen ini

- Topik "cara kerja" (1.422 pesan) hanya dipanen sebagai lima belas prinsip.
- Arsip berhenti 18 Okt 2026.
- Versi 1 dan 2 dokumen arsitektur ada di folder Sulu Build. Audit penuh tiga versi sedang berjalan.
- Notion, Ledger, dan tampilan nyata di layar tidak diperiksa penulis v3.
- Skema kontrak hanya dibaca bidang tingkat atasnya. Bidang di dalam `jalur` tidak dibaca penulis v3.
- Versi 3 belum diperiksa pemeriksa terpisah.

## Catatan perubahan dari v2.1

### Suntingan wajib

| W | Yang diubah | Bagian v3 |
|---|---|---|
| W1 | Tiga aturan simpan tulisan di bawah 18 dijadikan satu | 2.1 B6, 4.2 butir 1, 4.3, 9.2 |
| W2 | Bekal sebagai masukan model S4 hanya untuk dewasa; di bawah 18 dipakai di luar model | 3.1 butir 3 dan 4, 4.1 |
| W3 | Gerbang L untuk di bawah 18 memeriksa hasil pencocokan di luar model | 6 baris L |
| W4 | "Fungsi lama sebagai calon wadah" dihapus; putusan Chief dan nasib dua fungsi lama ditulis; U24 menjadi butir R1 | 2.2 butir 1 dan 2, 2.3, 9.1 R1 |
| W5 | Baris "S3 isian gejala" ke model dihapus; S3(a) tanpa model | 3 baris S3, 4.1, 4.2 butir 3 |
| W6 | Klausul "bagian belakang berlaku" dan "aturan pemenang" dihapus; isinya dilebur menjadi satu aturan | 1 prinsip 1 dan 12; seluruh dokumen |
| W7 | Pagar pencarian dipulihkan utuh | 5 |
| W8 | Tabel pemetaan kontrak, K5, dan jawaban Chief dipulihkan; kolom "berubah di v3" ditambah | 7 |
| W9 | Gerbang J memuat butir keempat; ambang ditetapkan sebelum uji | 6 baris J dan kalimat pembuka |
| W10 | "Yang tetap" ditambah S4 dan S9 | 2.3 |
| W11 | Empat ucapan 15 Nov disalin; prinsip "karier bukan pekerjaan; untuk siapa pun" ditambah | 0.1, 1 prinsip 2 |
| W12 | Baris S7, S8, S11 "tanpa model" dan baris S14 untuk di bawah 18 ditambah | 4.1 |
| W13 | Pertanyaan prompt siap pakai bagi di bawah 18, dengan bawaan tidak ditawarkan | 9.1 R2, 3 baris S14, 4.1 |
| W14 | "Tinjauan manusia" masuk batas keselamatan dan gerbang Q | 2.1 B5, 3 baris S10, 6 baris Q |
| W15 | Tema sensitif: bawaan ditahan | 5.3 butir 3, 9.1 R3 |
| W16 | Satu tabel gerbang A–S dengan ambang, alat, dan status; gerbang keras skema provinsi menjadi gerbang S | 6 |
| W17 | Urutan alat ukur: C, K, L, O, Q lebih dulu | 6 kalimat pembuka, 8.2 L17 |
| W18 | "Paling banyak tiga kalimat" menjadi kriteria gerbang M | 6 baris M |
| W19 | Langkah bernama untuk status Live, aturan dasar pencocokan, kurasi keterampilan, saringan peran, set uji konteks lokal, pemetaan 8 ashnaf dan PMKS, arah desa RT RW, uji 3T | 8.1, 8.2 L9–L16 |
| W20 | Semua S punya tempat; S10, S12, S13, S15 sebagai prasyarat | 8.2 L19, 8.3, kolom prasyarat bagian 3 |
| W21 | "Riwayat isu Insight yang dibaca" dan "catatan sepanjang jalan" berikut pembacanya | 4.3 |
| W22 | Prinsip nada memakai kata V23; "lugas" hanya untuk varian teks kartu; menjadi butir rubrik G | 1 prinsip 8, 6 baris G |
| W23 | Prinsip 10 ditulis | 1 prinsip 10 |
| W24 | Teks kalah dihapus (daftar di bawah) | 3, 6, 10.6 |
| W25 | Fakta `iou_program_relevance` dan fakta nama Dillo diperbaiki | 0.5 |
| W26 | Daftar perubahan S4 memuat saringan peran dan tanda "dibuat AI" | 3.1 butir 8 dan 10 |

### Tambahan dari pemeriksa

| Butir | Yang dikerjakan | Bagian v3 |
|---|---|---|
| "Catat topiknya untuk dikurasi" saat nol temuan (V38) | ditulis | 4.3, 5.4 butir 3 |
| K10 angka kepala desa | dipulihkan sebagai L18 | 8.2 |
| Permintaan ke Chief di versi 1 butir 1 dan 2 | dipulihkan sebagai butir terbuka | 10.5 |
| Cara tampil keandalan "hati-hati" | menjadi syarat T5 dan butir R4 | 8.1, 9.1 |

### Kalimat v2.1 yang dihapus

| Baris v2.1 | Kalimat | Alasan |
|---|---|---|
| R3 | cap jam penulisan di kepala | milik versi 2; tidak dibawa |
| R27 | "Lugas di lapis data, hangat di tahap Proposal Diri" | kalah oleh V23 (W22) |
| R37 | "Di bawah 18: tulisan disimpan untuk dirinya, tidak dikirim ke AI" | diganti satu aturan simpan (W1) |
| R37 | "fungsi lama sebagai calon wadah" | kalah oleh putusan Chief (W4) |
| R37 | "Dewasa: penyamaran otomatis sebelum model dipanggil" sebagai aturan S3 | tidak ada lagi tulisan ke model di S3 (W5); aturan penyamaran pindah ke 4.2 butir 4 |
| R38 | "(tetap)" dan kata "temuan" pada bahan S4 | S4 berubah lewat PR Chief; temuan bukan bahan S4 (W24) |
| R45 | "isu sesudah 2030" di S11 | tempatnya lapis dunia (W24) |
| R46 | "masukan dari orang terdekat lewat formulir" sebagai isi S12 yang berjalan | ditunda oleh putusan Chief (W24) |
| R57, R59 | status "ada" untuk gerbang B dan D | status sebenarnya di bagian 6 (W16, W24) |
| R58 | "lapis 1 ada" untuk gerbang C | lapis itu hanya memeriksa butir S3 (W16) |
| R66 | kriteria gerbang L tanpa unsur kartu dan bekal | diperketat (W24) |
| R79–R82 | bagian 5 urutan kerja lama | diganti bagian 8 |
| R86 | "Versi 1 dan 2 dokumen arsitektur yang utuh tidak ada" | keliru menurut R179 (W24) |
| R86 | "Belum diperiksa pemeriksa terpisah" untuk versi 2 | sudah diperiksa; kalimat baru berlaku untuk v3 |
| R92 | "bila berbeda dengan bagian 1–6, bagian ini yang berlaku" | tidak ada lagi dua aturan (W6) |
| R117 | baris "S3 isian gejala" | W5 |
| R126 | "penyimpanan baru data anak; butuh putusan Raihan dan telaah pelindungan data oleh chief; bawaan: tidak disimpan" | diganti satu aturan simpan (W1) |
| R136 | bekal "wajib menjadi masukan S4" tanpa batas usia | dibatasi untuk dewasa (W2) |
| R155 | judul "Aturan pemenang antarprinsip" | isinya menjadi prinsip 1 dan 12 (W6) |
| R161 | "`iou_program_relevance` hanya ada di deklarasi tipe" | fakta diperbaiki (W25) |
| R176 | "7 berkas memuat nama itu pada cabang utama @96be475" | fakta diperbaiki (W25) |
| R178 | "penjelajah lokal dibuat sebagai fungsi baru, bukan memakai fungsi lama" | ditulis ulang lebih tepat sebagai 2.2 butir 1 dan 2 |

### Suntingan sesudah pemeriksa ketiga (15 Nov 2026)

Pemeriksa ketiga (Fable, bukan penulis) memvonis v3 LULUS BERSYARAT: W1–W26 tertutup 23, sebagian 3, belum 0; tidak ada pasangan aturan yang berlawanan; 17 suntingan diminta. Ketujuh belasnya diterapkan di berkas ini: (1) catatan dan setoran di bawah 18 tunduk B6, cara berbagi menjadi R12; (2) keluaran bekal dan jurusan dipisah per usia; (3) cakupan B6 dan perilaku kode tayang, R11; (4) S3(b) tahap pertama tanpa model bahasa, gerbang O dan baris S15 disesuaikan; (5) gerbang Q mencakup 4.1; (6) arti "di bawah 18" dan saklar mode (c); (7) status gerbang P; (8) kata kunci pencarian dewasa sebagai pengecualian dan baris data, guna isian gejala dewasa; (9) "daftar tertutup hasil kurasi"; (10) asal W1–W26; (11) L19 dipecah, L21a, L21b, L21c, alat L16; (12) penetap ambang dan cakupan gerbang C; (13) tiga kalimat v2.1 dipulihkan; (14) frasa gerbang G tidak lagi bertanda kutip; (15) `iou_program_relevance` di gerbang R; (16) R13; (17) baris S9 dan S10 di pemetaan kontrak.

Belum diperiksa ulang sesudah 17 suntingan ini.
