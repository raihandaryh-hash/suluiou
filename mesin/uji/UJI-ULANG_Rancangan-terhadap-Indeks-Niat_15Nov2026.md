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
