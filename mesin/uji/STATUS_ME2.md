# Status tonggak ME2 (Cakupan) · 13 Nov 2026 14.42 WIB (jam sistem) · SINTESIS

Dasar: rencana mesin v1 §4.2 G2.0-G2.5. Dimulai 13 Nov 2026 sesudah ME1 SELESAI BERSYARAT (pemeriksa putaran 3) dan arahan Raihan "Lanjut". Tinjauan akhir ME1 oleh Raihan masih terbuka.

| Gerbang | Status | Bukti |
|---|---|---|
| G2.0 bank kandidat | belum dinilai ulang: bank 33 kandidat (K1 5, K2 5, K3 4, K4 3, K5 7, K6 5, K7 4) sudah beku sejak ME0; perlu dicek "minimal 3 per medan" (K4 = 3, lolos batas bawah) dan "ditulis sebelum sumber dipilih" | `alat/periksa_gerbang.py` keluaran bank |
| G2.1 lantai 34 dari 38 provinsi | kemiskinan 36/38 LULUS (belum: Papua Tengah, Papua Pegunungan); TPT 32/38 → kartu nasional saja; air minum 14/38 → kartu nasional saja | `alat/periksa_g2.py`, peta `sumber/wilayah/kode_baru_papua.csv` |
| G2.2 konsistensi | rentang: 0 gagal di ketiga sumber; total kab/kota vs provinsi kemiskinan 38/38; beda antar-tahun >3 sb ditandai: kemiskinan 2 dari 116 (5208 Lombok Utara, 9471 Kota Jayapura), TPT 6 dari 410 (5309, 6104, 6409, 7410, 9414, 9427), air minum 1 dari 160 (7603 Mamasa, 36,70 → 52,97). Uji total TPT dan air minum tidak bisa (tanpa jumlah absolut) | `alat/periksa_konsistensi.py` (5bd32780c42b) di laptop |
| G2.3 stabilitas saringan | belum: bobot ditulis sesudah kerangka §9 butir 3 (disetujui 12 Nov) | |
| G2.4 pembanding | kemiskinan dan TPT 0% median (target RPJMN, `sumber/target/target_resmi.yaml`); air minum 100% median → gagal, tidak tayang per daerah | `alat/periksa_g2.py` |
| G2.5 lolos M1 | kartu hanya dari sel terverifikasi; `alat/periksa_kartu.py` di CI | |

Catatan: kemiskinan tahun sebelumnya hanya tersedia untuk 116 sel (dari tabel pembanding 2024), jadi uji antar-tahun kemiskinan terbatas.
