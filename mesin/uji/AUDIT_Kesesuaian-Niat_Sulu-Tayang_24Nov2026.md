# AUDIT · Kesesuaian niat Raihan terhadap Sulu yang tayang (24 Nov 2026)

Auditor: sesi mesin, hanya baca. Objek: `/home/claude/suluiou-main` main @20831b0 (Merge PR #34). Tidak ada berkas repo yang diubah, tidak ada push.
Label tiap butir: **DILIHAT** (path:baris dibaca sesi ini), **DUGAAN** (disimpulkan dari kode, belum diamati di peramban atau keluaran model), **TIDAK TAHU**.
Sumber niat: `REGISTER-NIAT_Raihan_15Nov2026.md` (termasuk KOREKSI 24 Nov: butir 13.4 lama tidak berlaku), `LAMPIRAN_Kutipan-Niat_Rancangan-v2_15Nov2026.md`, `KOREKSI_Arah-Lapis-Peran_15Nov2026.md`, `UJI_Setia-Niat_15Nov2026.md` (bagian E butir N18 dan pencabutan penolak struktural sudah dibatalkan oleh 18 Nov 14.38 dan KOREKSI 24 Nov), `USUL_Prinsip-Produk-Sulu_A0_18Nov2026.md`, `tinjauan/TINJAUAN_Fable_Fitur-Tayang-SOTA_18Nov2026.md`, `SINTESIS_Mesin-Wujudkan_Jejak-dan-Rancangan_18Nov2026.md`, keluaran `mesin/alat/cek_niat.py` (kata kunci: gaji/upah, kapabilitas full, foreclosure, RT/RW, bangun apa, 2026, TikTok/islami), dan kutipan keputusan 18 Nov yang diberikan pemberi tugas (belum dicocokkan sendiri ke Ledger).

## 0. Mana yang tayang (src/App.tsx)

| Rute atau fungsi | Status | Bukti |
|---|---|---|
| `/`, `/mukadimah`, `/insight`, `/skill-map`, `/glossary`, `/compass`, `/suar`, `/bila-tidak-baik-baik-saja`, `/programs` | Dirutekan | `App.tsx:137-157` (DILIHAT). `/programs` tanpa tautan masuk dari komponen mana pun (grep, DILIHAT) |
| `/kenali-dirimu`, `/kenali-dirimu/skill`, `/jalan-bakti`, `/sintesis`, `/rencana-aksi`, `/ringkasan` | Dirutekan di balik sesi siswa (Google atau tamu) | `App.tsx:158-165`, `RequireAuth.tsx:12-21` (DILIHAT) |
| `/profile`, `/consent`, `/assessment`, `/hasil/:id` | Tertutup | `AsesmenGuard`, `flags.ts:10` `ASESMEN_TERBUKA = false`, `flags.ts:13` (DILIHAT) |
| `broaden-roles`, `generate-sintesis`, `career-chat` | Dipanggil dari `src/` | `BroadenRoles.tsx:84`, `TenunSintesis.tsx:52`, `services/api.ts:275` (DILIHAT) |
| `generate-projection`, `generate-layer1` | Terkunci di server | `generate-projection/index.ts:94`, `generate-layer1/index.ts:55` (`SULU_ASESMEN_TERBUKA !== "1"`) (DILIHAT); nilai env di Lovable TIDAK TAHU |
| `generate-reflection` | Pensiun, tidak dipanggil | `supabase/config.toml:11` (DILIHAT) |
| `aktifkan-peserta`, `atur-peran`, `kelola-peserta` | Admin, tanpa perintah AI | cek sekilas, tidak diaudit niat |
| `PetaMedan.tsx`, `ValuesCardSort.tsx`, Proposal Diri | Tidak diimpor halaman mana pun | grep import nihil (DILIHAT) |

Fakta lintas fitur: semua fungsi AI menolak permintaan tanpa akun sah dengan 401 (`_shared/gerbang.ts:242-247`, DILIHAT). Sesi tamu hanya tersimpan di perangkat (`lib/classSession.ts:33-34`, DILIHAT), jadi tamu DUGAAN tidak pernah mendapat keluaran AI. Siswa dengan akun dihitung di bawah 18 dan mode (c) memangkas teks bebasnya kecuali env `SULU_MODE_C_MATI` dinyalakan (`_shared/usia.ts:67-69`, `ai.ts:174`, DILIHAT; nilai env TIDAK TAHU).

## 1. Ringkasan hitungan

52 butir: **17 SESUAI · 27 MENYIMPANG · 4 BELUM DIPUTUSKAN · 4 TIDAK TAYANG.**

| Fitur | Sesuai | Menyimpang | Belum diputuskan | Tidak tayang |
|---|---|---|---|---|
| F1 Nyalakan peran (`broaden-roles` + `BroadenRoles.tsx`) | 3 | 8 | 1 | 0 |
| F2 Tanya Sulu (`career-chat`) | 3 | 5 | 0 | 0 |
| F3 Sintesis dan Tenunan (`generate-sintesis` + layar) | 1 | 3 | 0 | 0 |
| F4 Lapis bersama (`_shared`) | 2 | 0 | 1 | 0 |
| F5 Jalan Bakti selain Nyalakan peran | 2 | 6 | 2 | 0 |
| F6 Insight | 1 | 2 | 0 | 0 |
| F7 Peta Bekal | 0 | 2 | 0 | 0 |
| F8 Beranda dan Mukadimah | 1 | 0 | 0 | 0 |
| F9 Kenali Dirimu | 1 | 0 | 0 | 0 |
| F10 Rencana Aksi, Ringkasan, Programs | 3 | 0 | 0 | 0 |
| F11 Compass | 0 | 1 | 0 | 0 |
| F12 Yang tidak tayang | 0 | 0 | 0 | 4 |

Jawaban atas kekhawatiran Raihan ("keseluruhan Sulu-nya pun gak sesuai intent saya"), SINTESIS: kerangka nilai (anti-vonis, cermin, IOU satu jalan, lapis keselamatan, kartu daerah bersumber, bila-maka) setia niat. Penyimpangan menumpuk di tiga simpul: (a) mesin peran masih berporos menu jabatan dari ingatan model, tanpa jalur cipta dan dengan penolak yang bolong; (b) pengguna inti (siswa, tamu) belum mendapat "kapabilitas full"; (c) angka di layar banyak yang tanpa URL, satu masih salah label. Tidak ada perintah AI tayang yang memerintahkan vonis.

## 2. Tabel per perintah AI dan per layar

Pemilik: Chief = teks tayang dan perintah AI; Mesin = data dan alat; Raihan = keputusan.

### F1 · Nyalakan peran

| # | path:baris | Niat atau keputusan | Vonis | Bukti | Perbaikan | Pemilik | Label |
|---|---|---|---|---|---|---|---|
| A1 | `broaden-roles/index.ts:26-27` | KEPUTUSAN 15 Nov 09.16 "Masa iya … menyarankan remaja … untuk jadi petugas-petugas bergaji mikro"; 18 Nov 14.38 "Bukan malah bikin peran yang mengarahkan user jadi pekerja RT/RW" | SESUAI | "Yang DILARANG sebagai tujuan: jabatan struktural atau politik … kader, relawan, pendamping program" | Pertahankan | Chief | DILIHAT |
| A2 | `broaden-roles/index.ts:10`, `:172-174` | sama dengan A1 | MENYIMPANG | Pola hanya diuji pada `title`. Uji pola (disalin persis, dijalankan di node): **lolos** Ketua PKK, Penggerak PKK, Pendamping PKH, Pendamping Lokal Desa, Fasilitator Desa, Kepala Dusun, Perangkat Kelurahan, Staf Kelurahan, Ketua Pokdarwis, Fasilitator Posyandu, Guru Honor, Volunteer Coordinator. Ditolak dengan benar: lima peran pemicu | Perluas pola (pkk, pkh, pendamping\s+\w+, fasilitator\s+(desa\|posyandu\|pemberdayaan), kepala\s+dusun, kelurahan, pokdarwis, honor\b); periksa juga `whatTheyDo` dan `pathwayHint`; tambah kasus ke `_uji/penolak_peran_test.ts` | Mesin (pola, sepadan `periksa_gerbang.py`), Chief (pasang) | DILIHAT |
| A3 | `broaden-roles/index.ts:15`, `:23` | 8 Nov 21.45 "betul-betul bersandarkan data riil"; P2 "berkode KBJI 2026"; 28 Mei "Be exact!" | MENYIMPANG | "rujuk gaya Klasifikasi Baku Jabatan Indonesia / KBJI"; peran dari ingatan model, `bank_peran.json` mesin belum tersambung | Bank peran berkode KBJI per medan dan sub-tantangan; model memilih dan menjelaskan dari bank | Mesin | DILIHAT |
| A4 | seluruh prompt; grep "cipta", "belum bernama", "rumuskan sendiri" nihil di `src/` dan `supabase/functions/` | 8 Jul "mendorong mereka kreatif mencari atau membuat sesuatu yang belum ada"; tim psikologi 7 Jul "Nama-nama pekerjaan, jangan jadi foreclosure kreativitas" | MENYIMPANG | "Sebutkan 6 peran atau jabatan NYATA di medan itu" | Kartu tetap ketujuh "Belum ada perannya? Rumuskan sendiri" (siapa yang kutolong, masalahnya, yang kubangun) | Chief | DILIHAT |
| A5 | `broaden-roles/index.ts:12` | 18 Nov 16.08 "bukan "mau jadi apa", tapi "mau bikin/bangun apa"" | BELUM DIPUTUSKAN | "memperluas cakrawala tentang peran-peran nyata di satu medan" (poros jabatan). Tempat tahap Wujudkan di manifest masih diminta ke Chief (`SINTESIS_Mesin-Wujudkan` §5.2) | Putuskan tempat poros "bangun apa"; sementara A4 menjadi jembatan | Chief, diketahui Raihan | DILIHAT |
| A6 | prompt tanpa aturan; pola `:10` | 30 Mei "jangan masukkan influencer TikTok atau semacamnya yang tidak islami!" | MENYIMPANG | Uji pola: "Influencer TikTok" dan "Selebgram" lolos; prompt tidak memuat saringan islami | Tambah aturan 12 di prompt dan pola saringan | Chief, Mesin | DILIHAT |
| A7 | `broaden-roles/index.ts:22` | tanpa janji gaji; KEPUTUSAN 15 Nov 12.35 (via manifest 2b v0.7): upah resmi bertahun boleh tampil sebagai fakta | SESUAI | "JANGAN janjikan diterima kerja atau angka gaji" | Upah resmi masuk lewat lembar fakta bersumber, tidak lewat model | Mesin | DILIHAT |
| A8 | `broaden-roles/index.ts:24`, `:30` | AI cermin, bukan penilai; tanpa vonis | SESUAI | "ini titik awal eksplorasi, bukan penentuan nasib" | Pertahankan | Chief | DILIHAT |
| A9 | `broaden-roles/index.ts:85` | 18 Nov 15.47 "Kasih kapabilitas full." (samaran tetap) | MENYIMPANG | `if (siap.bawah18) { skills = ""; values = ""; }` | Hapus pemangkasan untuk siswa; samaran (`ai.ts:179`) tetap | Chief, setelah konfirmasi Raihan (bagian 4 butir 1) | DILIHAT; env TIDAK TAHU |
| A10 | `broaden-roles/index.ts:12` | 18 Mei: siswa, fresh grad, guru BK, orang tua, umum; N8 "untuk siapa pun" | MENYIMPANG (kecil) | "Kamu membantu siswa SMA/MA Indonesia" | Sebut pengguna sesuai peran akun | Chief | DILIHAT |
| L14 | `JalanBakti.tsx:665` | 1 Jul U10 "Tidak bisa lebih?" | MENYIMPANG | `role={d.roles[0] \|\| null}`: peran kedua yang dipilih tidak dipakai di langkah 3 | Pemilih peran bila dua ditandai | Chief | DILIHAT |
| L24 | `BroadenRoles.tsx:92-103`; `gerbang.ts:244` | 2 Jun "enlightening, bukan misleading"; P12 siapa pun termasuk 3T | MENYIMPANG | Tamu menerima 401 "Masuk dulu…", layar menampilkan "Belum berhasil menyalakan peran. Coba lagi sebentar." | Tampilkan alasan sebenarnya, atau jalur tamu (bagian 4 butir 2) | Chief | DUGAAN (perlu peramban) |

### F2 · Tanya Sulu (`career-chat`)

| # | path:baris | Niat atau keputusan | Vonis | Bukti | Perbaikan | Pemilik | Label |
|---|---|---|---|---|---|---|---|
| B1 | `career-chat/index.ts:150-158` | AI cermin; tanpa vonis; 13 Jun "bukan … sekadar membuat orang feel good" | SESUAI | "Jangan pernah memberi label final tentang siapa dia" | Pertahankan | Chief | DILIHAT |
| B2 | `career-chat/index.ts:164-168` | 23 Apr "Kita tak berusaha hard-sell IOU"; IOU satu jalan | SESUAI | "IOU boleh disebut sebagai salah satunya, bukan satu-satunya dan bukan yang utama" | Pertahankan | Chief | DILIHAT |
| B3 | `career-chat/index.ts:75-79` | 18 Nov 15.47 "Kasih kapabilitas full." | MENYIMPANG | `if (siap.bawah18) { return … TEKS_OBROLAN_TERKUNCI` | Buka untuk siswa dengan samaran dan lapis distress yang sudah ada | Chief, setelah konfirmasi Raihan | DILIHAT |
| B4 | `_shared/usia.ts:72-73` | 2 Jun "enlightening, bukan misleading"; asesmen tertutup (`flags.ts:10`) | MENYIMPANG | "hasil asesmen dan saran jalur kamu tetap bisa dibuka" | Hapus sebutan asesmen | Chief | DILIHAT |
| B5 | `career-chat/index.ts:170-178` | 15 Nov 09.16; 18 Nov 14.38; 30 Mei (tidak islami) | MENYIMPANG | "membicarakan kemungkinan jalur belajar, skill, atau peran kontribusi" tanpa larangan peran struktural, kader, honor, tidak islami | Salin aturan 9 dan 10 `broaden-roles` ke prompt ini | Chief | DILIHAT (prompt); keluaran DUGAAN |
| B6 | `career-chat/index.ts:176` | 30 Mei "JANGAN SAMPAI KOMPASNYA MENYESATKAN" | SESUAI | "Bila kamu tidak yakin soal fakta daerah/peluang, JANGAN mengarang" | Pertahankan | Chief | DILIHAT |
| B7 | `career-chat/index.ts:146` | aturan copy tanpa tanda hubung panjang (dipakai `broaden-roles` aturan 8) | MENYIMPANG (kecil) | tanda hubung panjang (U+2014) antara `"Sulu"` dan `teman refleksi` di kalimat persona, bisa ditiru model | Ganti koma | Chief | DILIHAT |
| B8 | `career-chat/index.ts:156` | tiap angka ber-URL | MENYIMPANG | "atau angka yang tidak kamu tahu pasti" (model boleh menyebut angka yang ia "tahu pasti", tanpa URL) | Larang angka dari model; rujuk ke kartu daerah atau Insight | Chief | DILIHAT (prompt); keluaran DUGAAN |

### F3 · Sintesis dan Tenunan

| # | path:baris | Niat atau keputusan | Vonis | Bukti | Perbaikan | Pemilik | Label |
|---|---|---|---|---|---|---|---|
| C1 | `generate-sintesis/index.ts:24-33` | AI cermin; tanpa vonis; anti-foreclosure (3 Jul) | SESUAI | "DILARANG memvonis: jangan menyebut jurusan, profesi, atau karier sebagai kesimpulan" | Pertahankan | Chief | DILIHAT |
| C2 | `generate-sintesis/index.ts:93` | 18 Nov 15.47 | MENYIMPANG | `if (siap.bawah18) { fondasi = []; langkah = ""; }` | Kirim tulisan siswa dengan samaran | Chief, setelah konfirmasi Raihan | DILIHAT |
| C3 | `generate-sintesis/index.ts:21` | N8 "untuk siapa pun" | MENYIMPANG (kecil) | "membantu seorang siswa SMA/MA Indonesia" | Sebut pengguna sesuai peran akun | Chief | DILIHAT |
| L19 | `Sintesis.tsx:202-204`; `jalanBaktiOpeningContent.ts:22-23` | 2 Jun "enlightening, bukan misleading" | MENYIMPANG | Janji "minat, kemampuan, dan nilai, kamu gali di tahap Kenali Dirimu"; kode `minatItems = useMemo<string[]>(() => [], [])` | Ubah kalimat pembuka, atau isi sudut minat dari kartu pilih tanpa skor (bagian 4 butir 6) | Chief | DILIHAT |

### F4 · Lapis bersama (`_shared`)

| # | path:baris | Niat atau keputusan | Vonis | Bukti | Perbaikan | Pemilik | Label |
|---|---|---|---|---|---|---|---|
| E1 | `distressServer.ts:88-92`; `distressKlasifikasi.ts` (kepala berkas); `distressRujukan.ts:12-14` | 28 Mei "safe space"; V31 27 Jul kill-switch dan cabang distress | SESUAI | "ARAHAN KESELAMATAN (lapis kedua, mengalahkan semua aturan di atas)"; pengklasifikasi gagal tertutup | Pertahankan; nomor Healing119 dicek ulang berkala | Mesin | DILIHAT; kebaruan nomor TIDAK TAHU |
| E2 | `ai.ts:179-184`; `samaran.ts` | 18 Nov 15.47 "pengaman samaran tetap"; V30 20 Apr | SESUAI | `const pakaiSamaran = usia !== "dewasa" \|\| ai.penyedia !== "anthropic";` | Pertahankan saat A9, B3, C2 dibuka | Chief | DILIHAT |
| E3 | `gerbang.ts:242-247` | P12 "Siapa pun, termasuk 3T"; 2 Apr "sampai daerah 3T" | BELUM DIPUTUSKAN | "Masuk dulu untuk memakai fitur ini." (asal G2-13, tinjauan Gemini 23 Nov, bukan kutipan Raihan) | Raihan memilih: tamu tetap tanpa AI, atau jalur tamu berbatas laju | Raihan | DILIHAT; keputusan TIDAK TAHU |

### F5 · Jalan Bakti selain Nyalakan peran

| # | path:baris | Niat atau keputusan | Vonis | Bukti | Perbaikan | Pemilik | Label |
|---|---|---|---|---|---|---|---|
| L8 | `jalanBaktiContent.ts:81`; `JalanBakti.tsx:229-235` | 18 Nov 15.47 "Boleh dong, masa cuma satu? Foreclosure dong kalau gitu?" | MENYIMPANG | "Tujuh medan. Pilih satu untuk kamu telusuri lebih dulu."; `selectMedan` menimpa pilihan lama | Izinkan lebih dari satu medan; Nyalakan peran per medan | Chief | DILIHAT |
| L9 | `jalanBaktiContent.ts:166-173` | 15 Nov 10.23 (masalah kepala desa lulusan SMA, arus ke kota); 18 Nov 14.38 | BELUM DIPUTUSKAN | Sub-tantangan "Desa yang ditinggal calon pemimpin mudanya" di medan "Kepemimpinan & Tata Kelola". Bingkai ini mendorong model ke jabatan desa; DUGAAN kuat inilah masukan yang melahirkan lima peran pemicu | Raihan memilih rumusan masalah yang tetap sah tanpa mengundang jabatan (mis. "Desa yang ditinggal anak mudanya yang terdidik"); prompt diberi contoh profesi untuk k7 | Raihan (rumusan), Chief (pasang) | DILIHAT (teks); kaitan ke pemicu DUGAAN |
| L10 | `jalanBaktiContent.ts:114` | tiap angka ber-URL; 31 Mei "semua HARUS VALID" | MENYIMPANG | "Menurut riset IIQ Jakarta (2024), lebih dari 7 dari 10 Muslim Indonesia" tanpa tautan | Tautan sumber primer | Chief | DILIHAT |
| L11 | `jalanBaktiContent.ts:84`, `:88` | 28 Mei "Be exact!"; no overclaim | MENYIMPANG | Komentar "PISA 2022, ~690rb remaja/81 negara"; teks "hampir separuh … sepuluh pekerjaan … Dokter, guru, polisi, pegawai negeri". Tinjauan Fable 18 Nov B10, B11: angka sepuluh pekerjaan dari laporan 2020 atas PISA 2018; contoh profesi tidak ditemukan di sumber | Verifikasi ke laporan OECD primer, betulkan, beri tautan | Mesin (verifikasi), Chief (teks) | DILIHAT (teks); ketidakcocokan sumber dari tinjauan Fable |
| L12 | `JalanBakti.tsx:399-445` | tiap angka ber-URL; komentar `jalanBaktiContent.ts:178` "province_contexts schema belum defensible" | MENYIMPANG | Blok "Gambaran arah daerahmu" dari basis data, hanya bertanda "bukan data resmi atau vonis", tanpa sumber per butir | Tampilkan sumber per butir atau sembunyikan sampai bersumber | Mesin (isi), Chief (tampilan) | DUGAAN (isi basis data tidak dibaca) |
| L13 | `KartuDaerah.tsx:157` | tiap angka ber-URL; 12 Jun "semakin lokal … jelas dan vivid" | SESUAI | `href={s.tautan_baca}` | Pertahankan | Mesin | DILIHAT |
| L15 | `jalanBaktiContent.ts:276-278`; `DesainLangkah.tsx` (grep pagar nihil) | P12 "di bawah 18 dilindungi" (KEPUTUSAN 8 Nov 20.23 dan 21.45) | MENYIMPANG (keselamatan) | "Cari satu orang yang benar-benar menjalani peran ini, lewat gurumu, alumni, atau media sosial." "sapa langsung"; tanpa kalimat pagar | Tiga kalimat pagar untuk siswa: libatkan orang tua atau guru, jangan bertemu sendirian, jangan beri data pribadi | Chief | DILIHAT |
| L16 | `jalanBaktiContent.ts:310-311` | R2 rancangan v3 (prompt siap pakai tidak ditawarkan kepada di bawah 18), berlaku surut belum diputus (Fable 18 Nov PERLU RAIHAN 3) | BELUM DIPUTUSKAN | "Atau tanyakan ini ke AI" ke model luar tanpa lapis distress | Raihan memutus; bila 15.47 berarti fungsi penuh, ganti dengan Tanya Sulu yang berlapis keselamatan | Raihan | DILIHAT |
| L17 | `jalanBaktiContent.ts:297-298` | KOREKSI 15 Nov 4.2 butir 1: relawan sebagai PIJAKAN pengalaman, bukan tujuan | SESUAI | "Cebur sebentar … Jadi relawan sehari atau ikut acara" | Pertahankan | Chief | DILIHAT |
| L18 | `jalanBaktiContent.ts:259-266` | tiap angka ber-URL | MENYIMPANG | "penghidupan bagi sekitar tiga juta mitra pengemudi"; "Penelitian terhadap ribuan pelajar"; sumber hanya di komentar (GoTo AR 2024; Celio dkk. 2011). Bingkai "Langkah pertamamu boleh kecil. Tujuanmu tidak harus kecil." sejalan 16.08 | Tautan sumber di layar | Chief | DILIHAT |

### F6 · Insight

| # | path:baris | Niat atau keputusan | Vonis | Bukti | Perbaikan | Pemilik | Label |
|---|---|---|---|---|---|---|---|
| L2 | `insightContent.ts:357` | 30 Mei "JANGAN SAMPAI KOMPASNYA MENYESATKAN"; P7 | MENYIMPANG (angka salah) | "Aset perbankan syariah tumbuh 33,92% dalam satu tahun"; koreksi 9,88% ada di `generate-projection/index.ts:27` dan `macroContext.ts` sejak 21 Jul. Ditandai Fable 18 Nov, belum dibetulkan | Ganti ke 9,88% (OJK Des 2024) dengan tautan | Chief | DILIHAT |
| L3 | `insightContent.ts` (45 baris `source:`, 3 baris `http`) | tiap angka ber-URL | MENYIMPANG | Sumber tampil sebagai nama lembaga (`Insight.tsx:180`, `:293`, `:369`), bukan tautan | Tambah URL per sumber | Mesin (URL), Chief (tampilan) | DILIHAT (hitungan grep) |
| L4 | `insightContent.ts:370-376` | 18 Nov 13.56 "Soal angka 2026, saya putuskan tampil." | SESUAI | "Bank Indonesia Jawa Barat Q1 2026"; "BPJPH, Feb 2026" | Pertahankan | Chief | DILIHAT; cakupan persis keputusan TIDAK TAHU |

### F7 · Peta Bekal

| # | path:baris | Niat atau keputusan | Vonis | Bukti | Perbaikan | Pemilik | Label |
|---|---|---|---|---|---|---|---|
| L5 | `skillMapContent.ts:26`; `SkillMap.tsx:418` | no overclaim (24 Apr U16, 1 Jun U29) | MENYIMPANG | "Aman dari AI", "Tidak atau sangat sulit disubstitusi" | Ganti "Paparan AI rendah (perkiraan, tahun)" | Chief | DILIHAT |
| L6 | `skillMapContent.ts` (28 baris sumber, 0 `http`) | tiap angka ber-URL | MENYIMPANG | Sumber bernama tanpa tautan | Tambah URL | Mesin | DILIHAT (hitungan grep) |

### F8 sampai F11 · layar lain

| # | path:baris | Niat atau keputusan | Vonis | Bukti | Perbaikan | Pemilik | Label |
|---|---|---|---|---|---|---|---|
| L1 | `mukadimahContent.ts:5` | anti-vonis; 7 Jun "empowering" | SESUAI | "bukan untuk memberi jawaban instan, apalagi vonis tentang "kamu cocoknya jadi apa"" | Pertahankan | Chief | DILIHAT |
| L7 | `kenaliDirimuContent.ts:88`, `:191` | 8 Jun g61 "mengenali potensi lewat orang tua, guru" | SESUAI | "Orang tua, guru, dan sahabat sering melihat kekuatanmu lebih jelas"; kisah Zaid bin Tsābit | Pertahankan | Chief | DILIHAT |
| L20 | `rencanaAksiContent.ts:65` | 3 Mei actionable; 24 Apr "Yang terpenting adalah actionability" | SESUAI | "Ketika [waktu/situasi], saya akan [satu aksi kecil]." | Pertahankan | Chief | DILIHAT |
| L21 | `ringkasanContent.ts:59-95` | IOU satu jalan, tidak dicocokkan eksplisit; 23 Apr | SESUAI | Empat kartu statis, IOU berlabel "Penyelenggara Sulu" | Beri tanggal cek pada biaya dan alamat | Chief | DILIHAT |
| L22 | `Programs.tsx:70-84` | IOU satu jalan | SESUAI | "IOU adalah mitra penyelenggara platform Sulu." di antara enam jalur | Pertahankan; rute tanpa tautan masuk (yatim, niat 25 Jul) | Chief | DILIHAT |
| L23 | `compassContent.ts:27-98`, `:122`; `Compass.tsx:206` | U23; 25 Jul "fitur-fitur yatim" | MENYIMPANG (kecil) | Tanggal "3 Juni 2026" sampai "6 Juni 2026" dan daftar tunggu asesmen | Hapus tanggal lewat; ganti ajakan ke Kenali Dirimu | Chief | DILIHAT |

### F12 · Tidak tayang

| # | path:baris | Catatan bila kelak dibuka | Vonis | Label |
|---|---|---|---|---|
| D1 | `generate-projection/index.ts:42`, `:94` | "Kamu adalah konselor karir" bertentangan dengan 1 Jun "Yakin kita posisikan diri sebagai bimbingan karier?"; "Proyeksi 2030" | TIDAK TAYANG | DILIHAT |
| D2 | `generate-layer1/index.ts:10`, `:55` | Peran cermin sudah tertulis ("tidak menilai, tidak mendiagnosis") | TIDAK TAYANG | DILIHAT |
| D3 | `generate-reflection/index.ts`; `config.toml:11` | Pensiun | TIDAK TAYANG | DILIHAT |
| L25 | `/profile`, `/consent`, `/assessment`, `/hasil/:id`, `PetaMedan.tsx`, `ValuesCardSort.tsx`, Proposal Diri | Tertutup sakelar atau tidak diimpor | TIDAK TAYANG | DILIHAT |

## 3. Penyimpangan berat, urut prioritas

1. **Keselamatan · L15.** Siswa diajak menyapa orang asing lewat media sosial tanpa satu kalimat pagar (`jalanBaktiContent.ts:276-278`). Murah dan mendesak. DILIHAT.
2. **Peran remeh · A2, B5, L9.** Penolak PR #34 menutup lima peran pemicu, tetapi pendamping PKH, PKK, fasilitator desa, kepala dusun, perangkat kelurahan masih lolos, dan hanya judul yang diperiksa (A2, DILIHAT lewat uji pola). Tanya Sulu tidak membawa larangan yang sama (B5). Sumber dorongan ke jabatan desa, sub-tantangan k7a, masih tayang (L9).
3. **Foreclosure · A4, L8, L14 (dan A5).** Tidak ada jalur cipta di kode tayang; hanya satu medan; hanya peran pertama yang dipakai. Ketiganya melawan 8 Jul, 7 Jul (tim psikologi), dan 18 Nov 15.47.
4. **Angka tanpa sumber atau salah · L2, L11, L3, L6, L10, L18, L12, B8, L5.** 33,92% masih tayang walau koreksinya ada di repo sendiri; klaim "sepuluh pekerjaan" tidak cocok sumbernya; Insight 3 tautan untuk 45 sumber, Peta Bekal 0 untuk 28; "Aman dari AI" berbunyi jaminan.
5. **Kapabilitas penuh belum dipasang · A9, B3, C2, L24.** Siswa berakun menerima versi terpangkas atau obrolan terkunci; tamu tidak mendapat AI sama sekali dan melihat galat umum.
6. **Pijakan data peran · A3.** Peran dari ingatan model, tanpa KBJI, tanpa lembar fakta.
7. **Tidak islami · A6.** Tidak ada saringan di prompt maupun pola.
8. **Vonis:** tidak ditemukan pada perintah AI yang tayang (A8, B1, C1 SESUAI). Keluaran nyata belum diuji (bagian 5).

## 4. Butuh keputusan Raihan

1. **Kapabilitas penuh (A9, B3, C2).** Apakah "Kasih kapabilitas full." (18 Nov 15.47) menggantikan mode (c) KEPUTUSAN 11 Nov 10.21 sepenuhnya, termasuk membuka obrolan bebas Tanya Sulu untuk siswa tanpa izin orang tua (teks kunci menyebut izin orang tua; DPIA Sulu 11 Nov perlu diselaraskan)? Cara pasang: hapus pemangkasan di kode, atau nyalakan `SULU_MODE_C_MATI` di Lovable.
2. **Tamu tanpa akun (E3, L24).** Tetap tanpa AI (G2-13 asal tinjauan Gemini), atau jalur tamu berbatas laju supaya pengguna 3T tanpa Google tetap mendapat fungsi?
3. **Rumusan k7a (L9).** "Desa yang ditinggal calon pemimpin mudanya" dipertahankan, dirumus ulang, atau medan Kepemimpinan & Tata Kelola diberi contoh profesi khusus?
4. **Prompt AI siap salin ke model luar (L16).** Untuk siswa: dihapus, dipertahankan, atau diganti Tanya Sulu?
5. **Poros "mau bangun apa" (A5).** Setujui tempat tahap Wujudkan di manifest yang diusulkan Chief, dan apakah kartu "rumuskan sendiri" (A4) boleh dipasang lebih dulu sebagai jembatan.
6. **Sudut minat (L19).** Kartu pilih "kegiatan yang membuatmu betah" tanpa skor disiapkan untuk tinjauan Mbak Satwika, atau kalimat janji minat diubah saja sampai Asesmen Minat?
7. **Cakupan "angka 2026 tampil" (L4).** Angka apa persisnya (rilis 2026 di Insight, KBJI 2026, atau yang lain)? Audit ini hanya bisa menyatakan angka berlabel 2026 memang tampil.

## 5. Batas audit

| Yang tidak diperiksa | Akibat |
|---|---|
| Keluaran model nyata. Kunci AI hanya di Lovable; tidak ada panggilan ke fungsi tayang | Vonis untuk prompt adalah atas teks perintah, bukan atas jawaban model. Peran yang benar-benar keluar sesudah PR #34 TIDAK TAHU |
| Nilai env di Lovable (`SULU_MODE_C_MATI`, `SULU_ASESMEN_TERBUKA`, `SULU_AI_MATI`, `SULU_KLASIFIKASI_MATI`, penyedia) | Status mode (c) dan fungsi terkunci diturunkan dari bawaan kode |
| Isi basis data (`province_contexts`, penimpa isi Insight) | L12 berlabel DUGAAN; angka Insight bisa ditimpa basis data |
| Aplikasi di peramban | Perilaku tamu (L24) dan urutan layar belum diamati |
| Ledger dan Notion | Kutipan 18 Nov dan 15 Nov 12.35 dipakai sebagaimana diberikan pemberi tugas dan manifest; tidak dicocokkan ulang ke Ledger. Keputusan sesudah 18 Nov selain yang tertulis di berkas bahan TIDAK TAHU |
| Halaman `/suar`, `/glossary`, Hero (`landing/`), `Results.tsx`, halaman admin | Tidak diaudit niat |
| Uji pola penolak | Dijalankan di node atas salinan persis pola `broaden-roles/index.ts:10`; mesin regex sama dengan Deno (V8), tetapi bukan `deno test` atas berkas uji |
| Kebaruan nomor Healing119 dan alamat jalur (KIP Kuliah, PBSB, IOU) | TIDAK TAHU |
