# Status tonggak ME2 (Cakupan) · 13 Nov 2026 14.42 WIB (jam sistem) · SINTESIS

Dasar: rencana mesin v1 §4.2 G2.0-G2.5. Dimulai 13 Nov 2026 sesudah ME1 SELESAI BERSYARAT (pemeriksa putaran 3) dan arahan Raihan "Lanjut". Tinjauan akhir ME1 oleh Raihan masih terbuka.

| Gerbang | Status | Bukti |
|---|---|---|
| G2.0 bank kandidat | bank v2 dibekukan 13 Nov 2026 16.10 WIB (`bank/bank_kandidat_v2.yaml`, sidik di `uji/BEKU.sha256`) sebelum angka kandidat baru diambil: 33 kandidat v1 tetap + 24 tambahan bersatuan orang, aturan pemilihan tertulis di kepala berkas; per medan K1 10, K2 9, K3 9, K4 6, K5 10, K6 6, K7 7. Pengambilan orang terdampak dan bukti cara kerja untuk 24 tambahan sedang berjalan | `alat/periksa_gerbang.py` (masih membaca v1) |
| G2.1 lantai (versi 2, `uji/G2_1_v2.md`, KEPUTUSAN 13 Nov 15.29) | kemiskinan 36/38, 99% penduduk LULUS; TPT 32/38, 86% penduduk LULUS; air minum 14/38, 38%: kartu nasional saja | `alat/periksa_g2.py --penduduk` |
| G2.2 konsistensi | rentang: 0 gagal di ketiga sumber; total kab/kota vs provinsi kemiskinan 38/38; beda antar-tahun >3 sb ditandai: kemiskinan 2 dari 116 (5208 Lombok Utara, 9471 Kota Jayapura), TPT 6 dari 410 (5309, 6104, 6409, 7410, 9414, 9427), air minum 1 dari 160 (7603 Mamasa, 36,70 → 52,97). Uji total TPT dan air minum tidak bisa (tanpa jumlah absolut) | `alat/periksa_konsistensi.py` (5bd32780c42b) di laptop |
| G2.3 stabilitas saringan | putaran 2, 13 Nov 2026 16.4x WIB, atas 18 kandidat lengkap (`bank/komponen_saringan_v2.yaml` = 9 lama + 9 dari bank v2): 5 teratas tetap 5/5, 4/5, 4/5, 4/5 → lulus perhitungan, **BELUM SAH** (syarat >=30). Bank v2 menambah 9 dari 24 karena aturan satuan orang dan basis resmi tetap ketat. Temuan metode: kandidat yang hampir seluruh kelompoknya 'terdampak' (pemuda tidak berorganisasi 94%, pekerja informal 58%) naik karena skala hanya menghitung orang. Menunggu keputusan Raihan soal ambang 30 dan aturan ini. Putaran 1 (9 kandidat): 5/5 pada keempat variasi | `alat/saringan.py` |
| G2.4 pembanding | kemiskinan dan TPT 0% median (target RPJMN, `sumber/target/target_resmi.yaml`); air minum 100% median → gagal, tidak tayang per daerah | `alat/periksa_g2.py` |
| G2.5 lolos M1 | kartu hanya dari sel terverifikasi; `alat/periksa_kartu.py` di CI | |

Catatan: kemiskinan tahun sebelumnya hanya tersedia untuk 116 sel (dari tabel pembanding 2024), jadi uji antar-tahun kemiskinan terbatas.

## Insiden kecil · 13 Nov 2026 14.47 WIB
Sesi pembangun sempat menimpa `bank/bobot_v1.yaml` yang sudah beku (lupa memeriksa bahwa berkas itu ada). Ditemukan sebelum commit lewat `git diff`; berkas dipulihkan dari git, sidik kembali df8f006b9e7d sesuai BEKU. Isi draf yang menimpa dipindah ke berkas baru `metode_saringan_v1.yaml` (mengatur cara hitung, bukan bobot). Mekanisme pencegah yang sudah ada dan bekerja: pemeriksa BEKU di CI akan gagal bila berkas beku berubah.
