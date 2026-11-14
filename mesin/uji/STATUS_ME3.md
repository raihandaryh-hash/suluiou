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

## G3.2 pengembangan putaran 1 (13 Nov 2026 22.49 WIB) · separuh A, 130 pasangan, pemeta Opus mode PERIKSA, prompt v1
- Keluaran pemeta di laptop `MESIN\peran\periksa_A_keluaran.jsonl` (sidik 50a9482124df); validator kutipan: 130 sah, 0 ditolak.
- Diloloskan 22: benar 22, salah 0 → presisi 1,00 (batas bawah Wilson 0,85 pada n=22). Elusi 0/44 = 0%.
- **Cakupan rendah:** 22 dari 86 pasangan benar (26%). Dari 64 yang terlewat, 47 bersandar pada dokumen yang tidak ada di register L0, 9 dokumennya ada di register, 8 tanpa nomor dokumen.
- Akibat untuk gerbang: G3.2 butuh ≥100 pasangan yang diloloskan; dengan cakupan 26% atas 149 pasangan benar (A+B) hanya ~39 yang lolos. Jalan: register L0 diperluas (pedoman dan juknis yang menyebut pelaksana) oleh agen yang tetap tidak membaca SU-3; tidak memasukkan dokumen yang dikutip SU-3 secara langsung.
- Putusan pemeta yang paling bisa diperdebatkan (laporan pemeta): "dokter" untuk dokter umum, salah baca OCR "pekeda sosial", lembaga usaha/LSM sebagai pelaksana.

## G3.2 pengembangan putaran 2 (13 Nov 2026 23.34 WIB) · separuh A, register L0 v2 (+43 dokumen terunduh), penyiap bundel v2, prompt v1
- Keluaran `MESIN\peran\periksa_A2_keluaran.jsonl` (sidik bb26c81fd368); validator: 130 sah, 0 ditolak.
- Diloloskan 36: benar 36, salah 0 → presisi 1,00 (Wilson 0,90 pada n=36). Elusi 0/44. Cakupan 36/86 = 42% (putaran 1: 26%).
- Terlewat 50: 34 dokumennya tidak di register, 9 ada di register, 7 tanpa nomor. Terbanyak: perkawinan anak, UMKM, korban bencana (5 masing-masing).
- Hitungan kelayakan: G3.2 meminta ≥100 pasangan diloloskan. SU-3 berlaku memuat 149 pasangan benar (A 86 + B 63); pada cakupan 42% yang lolos ~62. Syarat n≥100 butuh cakupan ≥67%, jadi tidak tercapai dengan SU-3 sekarang tanpa menambah pasangan atau dokumen. Diajukan ke Raihan.

## G3.2 PENILAIAN AKHIR (14 Nov 2026 08.48 WIB) · sekali, register L0 v3, penyiap bundel v2, prompt v1, pemeta Opus
- Separuh A (terbuka): diloloskan 37, benar 37, salah 0; cakupan 37/86; elusi 0/44. Keluaran laptop `periksa_A3_keluaran.jsonl` (sidik 2f6f0f74fbd0); validator 130 sah.
- Separuh B (tersembunyi, dinilai di laptop oleh `peran/b_nilai.py`, hanya agregat; label sidik bf930a90…): diloloskan 26, benar 26, salah 0; Wilson 0,871; cakupan 26/63; elusi 0/42. Keluaran `periksa_B3_keluaran.jsonl` (sidik 06e0802d36b5); validator 105 sah.
- Gabungan: 63/63 benar → presisi 1,00, **batas bawah Wilson 95% 0,943 ≥ 0,85**; elusi 0/86 = 0% ≤ 5%; cakupan 63/149 = 42%.
- **G3.2 LULUS** menurut protokol + tambahan 1 (KEPUTUSAN Raihan "Batas bawah saja"). Catatan wajib: n = 63 (bukan 100), cakupan 42%; kandidat ditolak 86 (rencana 100).
- Kasus batas yang dilaporkan pemeta (diloloskan dan ternyata benar menurut label, atau di B tidak diketahui): padanan istilah (guru ngaji, TKSK, ATLM), lembaga masyarakat berisi orang (LAZ, UPZ, Kelompok Masyarakat SPAM) diloloskan sesuai prompt beku.
