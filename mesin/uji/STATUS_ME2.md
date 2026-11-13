# Status tonggak ME2 (Cakupan) · diperbarui 13 Nov 2026 18.01 WIB (jam sistem) · SINTESIS

Dasar: rencana mesin v1 §4.3 G2.0-G2.5 (koreksi rujukan dari §4.2, temuan pemeriksa ME2). Dimulai 13 Nov 2026 sesudah ME1 SELESAI BERSYARAT (pemeriksa putaran 3) dan arahan Raihan "Lanjut". Tinjauan akhir ME1 oleh Raihan masih terbuka.

**KEPUTUSAN Raihan 13 Nov 2026 19.04 WIB atas tinjauan akhir ME2: "Lanjut"** (diajukan dengan kalimat: bila hasilnya bisa diterima, "lanjut" dari Anda menutupnya). ME2 ditutup SELESAI BERSYARAT; syarat di bawah dibawa ke ME3.

**Vonis pemeriksa independen putaran 2 (13 Nov 2026): SELESAI BERSYARAT.** Putaran 1: BELUM (kartu ME2 belum ada). Syarat yang dibawa ke tonggak berikut, dicatat 18.05 WIB:
1. Uji total G2.2 untuk TPT dan air minum, kartu nasional air minum, dan pemeriksaan G2.1 ulang dengan wilayah induk f3b676e88a71 (ketiganya butuh laptop).
2. Daftar 3T 2025-2029 belum ditemukan; laporan 3T terpisah tertunda.
3. Dari 5 teratas saringan hanya kemiskinan yang punya kartu; jaminan kesehatan, stunting, pemilih, kerawanan pangan belum (ME3 meminta kartu untuk tiga teratas).
4. Wilayah induk masuk repo dan G2.1 serta laporan Papua masuk CI.
5. Kartu ME2 belum berteks; status `siap_tinjau` belum ada di skema kartu.
6. Metode v7 (target 2029) adalah putusan atas delegasi yang menggeser satu dari lima teratas; disampaikan ke Raihan 13 Nov.
Temuan B1 (gerbang tidak membaca kode keluar pembangun kartu) sudah diperbaiki dan diuji: masukan DIKK dihapus → gerbang GAGAL.

| Gerbang | Status | Bukti |
|---|---|---|
| G2.0 bank kandidat | LULUS. Bank v2 dibekukan 13 Nov 2026 16.10 WIB (commit b14d062) sebelum angka kandidat baru diambil: 33 v1 + 24 tambahan bersatuan orang; per medan K1 10, K2 9, K3 9, K4 6, K5 10, K6 6, K7 7 | `alat/periksa_gerbang.py` (membaca v1 + tambahan v2) |
| G2.1 lantai (versi 2, `uji/G2_1_v2.md`, KEPUTUSAN 13 Nov 15.29) | LULUS BERSYARAT. Kartu ME2 (`kartu/keluaran/kartu_me2.jsonl`): kemiskinan 490 kartu, 36/38 provinsi, 99% penduduk; TPT 410 kartu, 32/38, 86%; air minum 14/38, 38% → tidak per daerah. Papua dilaporkan terpisah (`alat/lapor_papua.py`): kemiskinan 25/42 kab/kota (51% penduduk Papua), TPT 7/42 (19%). Syarat tersisa: (a) daftar 3T: hanya Perpres 63/2020 (2020-2024, sudah lewat) yang ditemukan, daftar 2025-2029 tidak ditemukan dalam satu pencarian; (b) wilayah induk yang dipakai pemeriksa di container bersidik c1fee24ceef1, bukan versi tereproduksi f3b676e88a71 di laptop; diulang saat laptop menyala (pemeriksa ME2 sudah menghitung ulang dari laptop: angka sama) | `alat/periksa_g2.py --penduduk`, `alat/lapor_papua.py` |
| G2.2 konsistensi | LULUS BERSYARAT. Rentang: 0 gagal di ketiga sumber; total kab/kota vs provinsi: kemiskinan 38/38; beda antar-tahun >3 sb ditandai: kemiskinan 2 dari 116 (5208, 9471), TPT 6 dari 410 (5309, 6104, 6409, 7410, 9414, 9427), air minum 1 dari 160 (7603). Syarat tersisa: uji total TPT dan air minum (butuh jumlah absolut per kab/kota dan provinsi, diambil lewat laptop) | `alat/periksa_konsistensi.py` |
| G2.3 stabilitas saringan | LULUS TERBATAS (KEPUTUSAN Raihan 13 Nov: "Lulus terbatas (Recommended)"). Berlaku metode v7 = v6 (jumlah orang + batas mayoritas 50%, KEPUTUSAN Raihan "Orang + batas 50% (Recommended)") + target 2029 sama dengan kartu (PUTUSAN ATAS DELEGASI, ditulis sesudah pemeriksa menunjukkan efeknya; lihat kepala `bank/metode_saringan_v7.yaml`). Set ketat 15: 5/5, 4/5, 4/5, 5/5; 5 teratas: tanpa jaminan kesehatan, kemiskinan, stunting, pemilih tidak memilih, kerawanan pangan. Set longgar 26: 4, 5, 5, 4. Gangguan ±30% 200 ulangan: >=4/5 pada 200/200. Kelonggaran L1-L5: tau 0,92-0,98. Catatan pembekuan: aturan 50% dipilih Raihan sesudah hasil v3 terlihat (pilihan disodorkan karena masalah pemuda tidak berorganisasi), jadi v6/v7 bukan aturan buta; ketahanannya ditunjukkan oleh uji kepekaan, bukan oleh urutan pembekuan. Target >=30 kandidat ketat dibawa ke tonggak berikut. Riwayat: putaran 1 (9, v3), 2 (18, v3), 3 (13, v5 ditinggalkan), 4 (15, v6), 5 (15, v7) | `alat/saringan.py --v7`, `alat/kepekaan_data.py --v7`; di CI lewat `periksa_gerbang.py` |
| G2.4 pembanding | LULUS BERSYARAT. Kemiskinan dan TPT 0% median (target RPJMN 2029, `sumber/target/target_resmi.yaml`); air minum 100% median → tidak tayang per daerah. Syarat tersisa: kartu nasional air minum (rencana §6) belum dibangun; angka nasional ada di berkas laptop `0000_airminum_2830_2025.json` | `alat/periksa_g2.py` |
| G2.5 lolos M1 | LULUS. 900 kartu ME2 berstatus `siap_tinjau` (bukan draf, jadi pemeriksa sumber dan sel aktif), dibangun `alat/bangun_kartu_me2.py` dari `sumber/masukan_kartu/` (DIKK 93a658d3d2c4, tabel BPS 59030f661277, nama a3c2ffb8b234); sidik kartu b5d29da502d9, tereproduksi dua kali; `periksa_kartu.py`: 0 pelanggaran; CI membangun ulang dan mencocokkan sidik. Tidak ada penerbitan produksi | `alat/periksa_gerbang.py` |

Catatan: kemiskinan tahun sebelumnya hanya tersedia untuk 116 sel (dari tabel pembanding 2024), jadi uji antar-tahun kemiskinan terbatas.

## Insiden kecil · 13 Nov 2026 14.47 WIB
Sesi pembangun sempat menimpa `bank/bobot_v1.yaml` yang sudah beku (lupa memeriksa bahwa berkas itu ada). Ditemukan sebelum commit lewat `git diff`; berkas dipulihkan dari git, sidik kembali df8f006b9e7d sesuai BEKU. Isi draf yang menimpa dipindah ke berkas baru `metode_saringan_v1.yaml` (mengatur cara hitung, bukan bobot). Mekanisme pencegah yang sudah ada dan bekerja: pemeriksa BEKU di CI akan gagal bila berkas beku berubah.
