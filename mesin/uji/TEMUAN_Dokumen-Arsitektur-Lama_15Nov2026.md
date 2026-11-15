# Temuan dari dokumen arsitektur Sulu sepanjang masa

SINTESIS. Disusun SESI-11NOV-SULU-MESIN (https://claude.ai/code/session_01JZPjjr3cEST9SPkxZSaHrr), 15 Nov 2026 12.15 WIB.
Asal perintah: Raihan 15 Nov 12.12, "Saya juga ingin Anda baca beragam arch docs Sulu sepanjang masa dan find out siapa tahu ada gem atau semisalnya yang bisa diambil dari sana."

## 1. Cakupan (jujur)

Sumber: folder laptop `MESIN\mentah\riwayat\p2\docs` (sekitar 95 berkas). Cara: garis besar per berkas, baca bagian yang menyentuh mesin, lalu satu pencarian kata kunci lintas berkas.

| Berkas | Tanggal | Yang dibaca |
|---|---|---|
| Rancangan Narasi Sulu v2 (tulisan Raihan sendiri) | 3 Jun | seluruhnya, 153 baris |
| Respon tim psikologi | 7 Jul | seluruhnya |
| 0-KOMPAS Sulu menuju kelas dunia | 7 Jul | seluruhnya |
| Sulu Architecture v3 | Jun | garis besar 1.640 baris; isi 1.2–1.4, 8.3–8.5, 9, 10.4, 20, 21, 24 |
| World Class Design Spec | 7 Jul | garis besar; SM-2 sampai SM-5, Bagian 4 dan 5 |
| World Class Addendum v2 | 12 Jul | R1 sampai R4; R6 lewat jendela kata kunci |
| Landasan Induk | Jul | bagian 1 sampai 3 |
| Kode `main` (PetaMedan.tsx, migrasi 6 Jul, types.ts) | hari ini | grep `province_contexts` |

Tidak dibaca: sekitar 85 berkas lain, termasuk dua DIFF arsitektur, Master Context 23 Apr, isi SULU_FLOW_AND_AI (mesin psikometrik lama), W1 Arc Manifest, 03_REFERENCE_DATA, design brief, Insight Rebuild Manifest, SPEC dua-pintu, RENCANA Build v3.2. Klaim "tidak ada" di dokumen ini hanya berlaku untuk yang dibaca.

## 2. Enam belas temuan

| # | Temuan | Sumber | Nasib di aplikasi tayang | Guna untuk mesin |
|---|---|---|---|---|
| T1 | Peta Medan tayang punya slot "Lapis 3, Provinsi" yang sengaja dimatikan sampai data provinsi bersumber. Tabel `province_contexts` sudah diberi kolom `data_verified`, `data_year`, `primary_sources` sejak 6 Jul. | `src/components/PetaMedan.tsx` baris 20 dan 96; migrasi 20260706155829 | Slot ada, kosong | Kartu kebutuhan mesin (bersumber, bertahun) adalah isi yang ditunggu slot ini. Mesin tidak butuh layar baru. |
| T2 | "Gali Lebih Dekat": sesudah pengguna memilih medan dan provinsi, AI memberi 3 sampai 5 hipotesis masalah setempat (provinsi × medan × siapa yang dipilih) beserta cara mengeceknya di lapangan, lalu menyambung ke payung "Temui/Dengar". "Hipotesis untuk dicek, BUKAN jawaban." Tiga gerbang: data provinsi bersumber dulu, pagar anti-vonis, tiap hipotesis bertanda "perlu kamu cek langsung". | Design Spec Bagian 4 | Belum dibangun | Ini rancangan penjelajah lokal yang sudah ada. Tinggal dibangun, bukan dirancang ulang. |
| T3 | Urutan Dunia → Indonesia → Provinsimu → Titikmu ("di sinilah kamu bisa berdiri"). | Design Spec SM-2 | Dua lapis pertama tayang | "Titikmu" adalah keluaran mesin: tempat bertemunya bekal pengguna dan satu kebutuhan setempat. |
| T4 | Metode asal Jalan Bakti: "mulai dari masalah/tantangan, bukan nama profesi" (SparkPath Challenge Method). | Arch v3 8.3 | Tayang (klaster, sub-tantangan) | Menegaskan arah: mesin berangkat dari kebutuhan, peran datang belakangan sebagai contoh. |
| T5 | Draf Raihan 3 Jun sudah memuat kisah kepala desa lulusan SMA yang harus mengelola dana desa sementara anak mudanya ke kota, dan contoh peran yang terikat tempat: sarjana administrasi bisnis membuat usaha sosial di kampungnya, psikolog yang dekat dan mudah diakses, sarjana agama di masjid dan sekolah. | Rancangan Narasi v2 baris 104–108 | Sebagian (kisah kepala desa) | Bentuk peran yang ia maksud sejak awal: bekal + tempat + kebutuhan, bukan nama jabatan. |
| T6 | Di draf yang sama Raihan meminta "fakta gaji fresh graduate dan fakta inflasi" per sektor, bersumber. | Rancangan Narasi v2 baris 141 | Tidak tayang | Angka upah sebagai fakta bersumber adalah permintaannya sendiri. Larangan angka gaji di mesin tidak punya dasar dari beliau. |
| T7 | Klaster ketujuh, Kepemimpinan dan Tata Kelola, dikunci sebagai "rumah brain-drain desa (56,4% kepala desa lulusan SMA)". | Landasan Induk §3 no. 9 | Tayang (Tujuh Jalan Bakti) | Jalur kepala desa sudah keputusan terkunci. Angka 56,4% belum saya cek ke sumber asli [BELUM DIVERIFIKASI]. |
| T8 | Lensa Kepedulian menutup dengan "route balik": "Kepedulianmu pada [X] bisa kamu wujudkan lewat klaster [Y] yang tadi kamu tandai." | Arch v3 8.3b | Tayang ("Siapa yang Ingin Kamu Tolong?") | Pola kalimat sambungan siapa → medan → jalur yang bisa dipakai mesin tanpa bahasa baru. |
| T9 | Proposal Diri sebagai tulang punggung: tiap fase menyetor satu bagian. Pagar: tanpa label, skor, atau angka hasil tes; kata-kata pengguna sendiri; nada meminta bimbingan, bukan mengumumkan keputusan; diuji baca ke 2 orang tua dan 1 guru BK. | Addendum v2 R1 | Ringkasan tayang, Proposal Diri belum | Keluaran mesin (medan, kebutuhan bersumber, langkah) harus berbentuk setoran ke Proposal Diri. |
| T10 | "Cermin yang mengisi": kata kunci pengguna sendiri terkumpul saat ia menulis, tanpa AI menilai. | Design Spec SM-3 | Belum | Sumber "bekal" untuk mesin tanpa pertanyaan baru dan tanpa vonis. |
| T11 | Tiga Hukum pertanyaan (memanen, tidak menduplikasi, moda tepat) dan mode-before-copy. Audit 6 Jul: "langkah" ditanya tiga kali. | Design Spec Bagian 5; KOMPAS §V | Sebagian diperbaiki | Mesin tidak boleh menambah pertanyaan. Ia memanen jawaban yang sudah ada. |
| T12 | Uji dua pertanyaan untuk tiap build: mengisi Proposal Diri? menyambungkan ke manusia? | Addendum v2 | Aturan | Gerbang tambahan untuk tiap bagian mesin. |
| T13 | Protokol distress berlaku ke semua pintu AI, "Gali Lebih Dekat kelak" disebut eksplisit. | Addendum v2 R6 | Sebagian | Penjelajah lokal wajib lahir dengan cabang ini. |
| T14 | Penyakit lama: "data tersimpan, tak pernah dibaca". Aturan: tetapkan data mengalir ke mana dan dibaca siapa sebelum mulai. | KOMPAS 2.3 dan §VI | Belum terjawab | Catatan pilihan pengguna di mesin perlu pembaca bernama sebelum disimpan. |
| T15 | Tim psikologi: "Nama-nama pekerjaan, jangan jadi foreclosure kreativitas. Mereka harus bisa menciptakan sesuatu yang tidak/belum terpikirkan oleh orang lain." dan "AI itu bukan sumber validitas." | Respon tim psikologi | Aturan | Dasar jalur cipta sebagai pusat, dan batas peran AI. |
| T16 | Anti-foreclosure dilonggarkan untuk dewasa: "tidak berlaku usia 30+; risiko etis jauh lebih rendah; kebutuhan justru nyata". | Landasan Induk §3 no. 3 | Jalur mahasiswa tayang | Dasar lama untuk pengguna 40–50 tahun: bagi mereka mesin boleh lebih lugas. |

## 3. Yang sudah usang di dokumen lama (jangan dihidupkan)

- Arch v3 1.3 menulis audiens 17–18 tahun MA/pesantren. Digantikan keputusan 8 Nov (siapa pun, dengan pilihan peran).
- Arch v3 8.4 menulis AI mencari data lokal langsung di web. Digantikan gerbang Design Spec Bagian 4: data bersumber dulu.
- Arch v3 10.4 memuat ajakan ke halaman program IOU di ringkasan. Keputusan kemudian: jalur non-IOU setara.

## 4. Tiga kesimpulan

1. Mesin punya soket yang sudah disiapkan pendahulunya: slot provinsi di Peta Medan, rancangan Gali Lebih Dekat, Titikmu. Kerja saya mengisi soket, bukan menambah bangunan.
2. Dua usulan saya yang keliru sebelumnya (daftar 20 profesi, penolak jabatan struktural) bertabrakan dengan keputusan yang sudah terkunci sejak Juni–Juli (T4, T5, T7, T15). Membaca sumber ini lebih awal akan mencegahnya.
3. Angka upah bersumber sejalan dengan draf Raihan sendiri (T6).

Belum diperiksa pemeriksa terpisah.
