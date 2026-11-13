# Status tonggak ME3 (Kedalaman M3/M3b dan pencocok uji) · dimulai 13 Nov 2026 19.11 WIB (jam sistem) · SINTESIS

Dasar: rencana mesin v1 §4.4-§4.5 dan baris ME3 di tabel tonggak ("Tiga jenis teratas × ≥2 jalur; jalur cipta satu jenis; pencocok dijalankan di luar produksi pada SU-4 sampai SU-7"). Dimulai atas KEPUTUSAN Raihan 13 Nov 2026 19.04 WIB "Lanjut" yang menutup ME2 SELESAI BERSYARAT.

Tiga jenis teratas saringan v7: penduduk tanpa jaminan kesehatan, kemiskinan, stunting balita.

## Urutan kerja (jalur kritis)
1. **Set uji dibekukan dulu** (aturan §4): SU-3 peran (daftar 40 kebutuhan beku di `uji/SU3_kebutuhan.yaml`; separuh A terbuka dan separuh B tersembunyi ditulis dua agen berbeda, berjalan), SU-8 menyalakan (sesudah teks kartu ada), SU-5 vonis (sudah beku sejak ME0).
2. **Kartu untuk tiga teratas.** Kemiskinan: ada (490). Stunting: SSGI ditahan karena publikasi kedua independen belum ada; panen publikasi kedua dari domain BPS kabupaten/kota berjalan di laptop. Jaminan kesehatan: panen domain BPS kabupaten/kota menyusul sesudah stunting (dua panen bersamaan memicu batas laju BPS).
3. **Rantai tujuh mata rantai (G3.1)** dan pemetaan peran berbukti (G3.2) untuk tiga jenis, ≥2 jalur per jenis; G3.3 keterjangkauan; G3.4 tanpa vonis; G3.5 data pasar kerja.
4. **Jalur cipta (M3b)** untuk satu jenis; G3b.1-G3b.2.
5. **Pencocok** atas SU-4 sampai SU-7 di luar produksi; G4.1-G4.10.

## Syarat bawaan ME2
1. Uji total G2.2 TPT dan air minum; kartu nasional air minum; G2.1 ulang dengan wilayah induk f3b676e88a71.
2. Daftar 3T 2025-2029.
3. Kartu jaminan kesehatan dan stunting (= langkah 2 di atas).
4. Wilayah induk ke repo; G2.1 dan laporan Papua ke CI.
5. Teks kartu dan status `siap_tinjau` di skema.
