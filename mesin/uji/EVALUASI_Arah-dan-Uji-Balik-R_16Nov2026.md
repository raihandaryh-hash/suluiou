# Evaluasi arah kerja sesi mesin dan Chief Sulu, dan uji balik R1–R13 · 16 Nov 2026

Sesi: SESI-11NOV-SULU-MESIN · https://claude.ai/code/session_01JZPjjr3cEST9SPkxZSaHrr
Label: SINTESIS. Kutipan ber-[indeks] dicocokkan skrip ke register pesan Raihan. Diminta Raihan 16 Nov 00.35: "Eval your work, pastikan Anda dan Chief berada di jalan yang benar."

## 1. Temuan utama: satu aturan buatan kami menahan fitur yang Raihan minta

- Rancangan versi 1 (sesi mesin, 15 Nov) menulis "Tidak ada layar baru dan tidak ada pertanyaan baru". Chief memasukkannya ke RENCANA v3.4 sebagai "Prinsip sambungan (baru)", berstatus berlaku, dengan dasar keputusan 09.16 ("Tugas Anda enhance, bukan break.").
- Uji balik: pola kata larangan layar, halaman, pertanyaan, isian, atau fitur baru pada 3.059 pesan Raihan menghasilkan 1 kena, dan itu soal lain ([418] 24 Apr, halaman awal). Pencarian chat lampau hanya menemukan kalimat itu di tulisan Chief dan sesi mesin. Jadi kalimat itu bukan kata Raihan.
- Kata Raihan yang ada justru: "Dengan cara yang tidak merusak build, tapi menambah. Jadi, kalau nanti tim punya resource, bisa dibuka. Kalau tidak, ya tinggal dinonaktifkan dulu" ([1033] 12 Jun); "Saya ingin explorasi maksimal — bukan hanya yang sudah ada sekarang." ([648] 11 Mei); "Tidak diminta input per skill juga, lelah sekali." ([879] 3 Jun); "pertanyaannya juga tidak seabrek langsung kan, tapi dijahit ke tiap subsesi?" ([958] 8 Jun).
- Akibat yang sudah terjadi: MANIFEST 2b v0.3 menahan prompt siap pakai (A7), kalimat "Titikmu" (A15), dan kata kunci pencarian (A4) di belakang "R6: putusan Raihan per pengecualian". Ketiganya permintaan Raihan sendiri. Baris V41 di manifest itu bahkan memuat kutipan "explorasi maksimal" di samping kata "menunggu putusannya".
- Perbaikan: prinsip 3 rancangan diganti dengan empat kutipan di atas (v3.1). R6 dicabut.

## 2. Asal tiap butir yang dulu disebut "pengecualian"

| Butir | Asal di kata Raihan | Status sesudah uji |
|---|---|---|
| Prompt siap pakai | [1033] 12 Jun: "memberikan prompt pada user yang bisa mereka gunakan sendiri ke Gemini"; [880] 3 Jun | diminta; dibangun. Untuk di bawah 18 lihat R2 |
| Kata kunci dan pencarian | 15 Nov 14.01: "setelah mereka memasukkan data-data, AI akan search news dst. untuk melengkapi" | diminta; dibangun di balik saklar |
| Isian gejala setempat | 15 Nov 10.28 (arahan bahwa pengguna memasukkan keadaan di tempatnya) | diminta; boleh dilewati |
| "Titikmu" | [632] 11 Mei: "but local leaders, yang membumi, yang ilmunya terpakai, yang hidup di tengah masyarakat, berjalan di pasar-pasar." | diminta sebagai arah; dibangun |
| Formulir orang terdekat | [2162] 18 Agu: "ada form generator untuk mereka kirimkan ke orang-orang yang mereka percaya"; KEPUTUSAN 12 Nov 12.45: "Bangun, tanpa simpan nomor (Rekomendasi)" | SUDAH DIPUTUS. Penundaan oleh Chief 15 Nov bertabrakan dengan keputusan ini |
| Halaman metode | [1406] 8 Jul: "harus jelas sekali konstruknya dan tak boleh tersembunyi." | diminta; usul Chief memasangnya di tab yang sudah ada sah sebagai cara |
| Tulisan untuk diri sendiri | [959] 8 Jun: "refleksi mendalam itu ya dengan tulisan" | diminta |
| Berbagi ke orang tua | Proposal Diri (Tonggak 2c) | lajur Chief |

## 3. Uji balik R1–R13

| R | Hasil | Dasar |
|---|---|---|
| R1 perombakan fungsi lama | sudah terjawab | chatbot lama sudah menjadi "Tanya Sulu" sejak Juni |
| R2 prompt siap pakai untuk di bawah 18 | TERSISA | Juni: pengguna yang dimaksud siswa SMA. November: mode aman di bawah 18. Giliran asli keputusan 11 Nov belum saya baca, jadi belum boleh saya simpulkan |
| R3 tema sensitif | sudah terjawab | [782] 30 Mei menyebut satu tema; saringan menahan tema itu saja |
| R4 label keandalan | sudah diputus | Raihan 16 Nov 00.27, varian A |
| R5 angka upah | sudah diputus | Raihan 15 Nov 12.35 |
| R6 putusan per pengecualian | DICABUT | bagian 1 dan 2 |
| R7 empat unsur "Gambaran arah daerahmu" | bukan pertanyaan | tetap tayang; "enhance, bukan break" |
| R8 penyedia dan saklar pencarian | tersisa: akun berbayar dan penyalaan | pemilihan dikerjakan sesi mesin. V35 ternyata dari chat Obsidian ([2216] 28 Agu), bukan Sulu, jadi dicabut sebagai dasar |
| R9 tinjauan teks, penilai, sesi utuh | tinjauan akhir tonggak | bukan pertanyaan di muka |
| R10 saringan peran dan ambang uji | diputus atas delegasi | [784] 30 Mei memberi isi saringan; [285] 10 Apr hanya meminta ujinya. Tidak ada pesan sesudahnya yang mengubah (42 kena pola kedua, semuanya di luar topik) |
| R11 isian tayang di bawah 18 disamakan | TERSISA | menyangkut keputusan pelindungan data 11 Nov; giliran asli belum dibaca |
| R12 berbagi ke orang tua tanpa server | pindah ke 2c | lajur Chief |
| R13 lapis keselamatan untuk tulisan di perangkat | bukan pertanyaan | rujukan statis selalu tampil |

Rekonsiliasi: sudah diputus 2 (R4, R5) + sudah terjawab 2 (R1, R3) + dicabut 1 (R6) + bukan pertanyaan 3 (R7, R9, R13) + delegasi 1 (R10) + pindah 1 (R12) + tersisa 3 (R2, R8 sebagian, R11) = 13.

## 4. Temuan evaluasi lain

1. **Indeks niat berhenti 18 Okt.** 91 niat diambil dari pesan sampai 18 Okt 2026. Ledger memuat 53 baris keputusan Raihan untuk Sulu bertanggal 2 sampai 15 Nov. Baris-baris itu belum diuji satu per satu terhadap rancangan dan manifest. Dua sudah terbukti tidak terbawa: keputusan formulir orang terdekat (di atas), dan kalimat Raihan 12 Nov 12.45: "Sulu instills and helps find purpose, the \"spark\" that ignites life, yang menghidupkan hati dari gelapnya apatisme atau anxiety atas segala ketidakpastian" (0 kena di rancangan v3).
2. **Niat salah alamat.** V35 berasal dari chat tentang Obsidian. Inisiatif Raihan terpisah sampai ia sendiri menautkannya. 90 niat lain belum saya periksa asal chat-nya satu per satu.
3. **Pagar bertambah lebih cepat daripada hasil.** Dalam dua hari lahir 19 gerbang (1 punya alat ukur), 25 langkah kerja, 13 butir pertanyaan, dan 5 versi rancangan; perubahan yang dilihat pengguna dari sisi mesin: 0. Sejak 16 Nov 00.27, 900 kartu kabupaten/kota memenuhi semua syarat terbit. Jalan terpendek ke nilai nyata adalah memasang kartu itu (elemen A1) tanpa pembanding.
4. **Catatan Chief yang tidak cocok dengan repo.** Manifest v0.3 dan temuan 16 pemeriksanya menyebut kepala cabang utama be12c43 dan menyatakan 714d3f7 "tidak ada". Di repo: 714d3f7 adalah gabungan PR #12, tercatat 15 Nov 21.30. Baris keputusan 00.27 menulis PR #12 digabung Chief sesudah 00.27; cap waktu repo menunjukkan 21.30.
5. **Pembanding target 2029.** Target RPJMN adalah target nasional. Membandingkan satu kabupaten dengan target nasional lalu menulis "jarak" bukan perbandingan setara dan bisa melemahkan (V24). Usul: target tampil sebagai konteks nasional tanpa angka jarak per kabupaten; pembanding setara (angka provinsi atau nilai tengah kabupaten/kota) dipakai bila ingin posisi relatif.

## 5. Hasil kerja lain 16 Nov

- **Periode survei kemiskinan: Susenas Maret 2025.** Dibaca dari isi PDF (sha256 a468dbaa…5511): kata pengantar halaman 7 ("dihitung dari hasil Survei Sosial Ekonomi Nasional (Susenas) periode Maret 2025"), bagian Sumber Data halaman 18 ("Susenas Modul Konsumsi dan Pengeluaran Maret 2025 (VSEN25.KP)"), dan catatan kaki Tabel 2.1 ("Susenas) Maret 2025"). Di 40 halaman pertama "Maret 2025" muncul 2 kali dan "Maret 2024" 0 kali. Abstrak halaman web yang menulis Maret 2024 keliru.
- **Pindaian kedua layanan pencarian (ketentuan pakai, per 16 Nov 2026; ringkasan alat baca, belum dibaca dari teks mentah):**

| Layanan | Tampil ke pengguna | Simpan hasil | Kueri dipakai melatih model | Batas usia | Sumber |
|---|---|---|---|---|---|
| Brave Search API | boleh di aplikasi pelanggan; atribusi pilihan | dilarang selain sementara | tidak disebut; kueri dipakai untuk menyediakan hasil | tidak disebut | https://api-dashboard.search.brave.com/terms-of-service (1 Sep 2026) |
| Tavily | hanya "internal business purposes" | tidak disebut | ya, "training, improving, developing" | pengguna 18 tahun ke atas; larangan data anak | https://tavily.com/terms (4 Mei 2026) |
| Parallel | boleh ke pelanggan akhir | dilarang "copied, cached, stored" | ya, "may use Customer IP to train" | tidak disebut | https://parallel.ai/customer-terms (10 Nov 2026) |
| Perplexity | TIDAK DIPERIKSA | TIDAK DIPERIKSA | TIDAK DIPERIKSA | TIDAK DIPERIKSA | — |

  Bacaan sementara: dari tiga yang terbaca, hanya Brave yang ketentuannya cocok dengan rancangan (hasil ditampilkan, tidak disimpan, kueri tanpa data pribadi). Harganya $5 per 1.000 kueri, jadi 500 sampai 5.000 kueri per bulan berarti $2,5 sampai $25. Belum diukur: mutu untuk berita lokal Indonesia, parameter negara dan bahasa, saringan konten aman.

## 6. Yang tidak diperiksa
Giliran asli keputusan 11 Nov; 53 baris keputusan November satu per satu; asal chat 90 niat lain; isi penuh MANIFEST v0.3 (yang dibaca: kepala bagian dan 40 baris yang menyebut R6, R10, pengecualian, formulir, kepala cabang); ketentuan Perplexity; teks mentah ketentuan tiga layanan.
