# Set uji mesin · aturan pembekuan

Sumber aturan: rencana mesin v1 (isi v1.3) §4, disetujui Raihan 12 Nov 2026 18.16.

- Semua ambang ada di `AMBANG.yaml`. Ambang dan set uji di folder ini dibekukan lewat `BEKU.sha256`; CI (`mesin/alat/periksa_gerbang.py`) gagal bila berkas beku berubah.
- **Separuh tersembunyi.** Tiap set punya separuh terbuka (di repo) dan separuh tersembunyi yang ditulis agen lain dan disimpan di laptop Raihan `Sulu Build\Audit-Nov2026\MESIN\uji_tersembunyi\`. Di repo hanya sidiknya (`TERSEMBUNYI.sha256`). Separuh tersembunyi dibuka hanya saat penilaian akhir gerbang.
- Uji ulang sesudah perbaikan memakai sampel segar; jumlah percobaan dicatat.
- Set yang bergantung pada data (SU-1, SU-1m, SU-2, SU-3, SU-8) dibangun di ME1–ME3 sesudah sumber lolos SU-0, lalu dibekukan dengan cara yang sama sebelum pemeriksanya ditulis.
- Distress (SU-7) memakai ulang `evals/d6/` dari Tonggak 1 (pakai, bukan bangun), ditambah kasus mesin.

| Set | Status |
|---|---|
| SU-0 akses sumber | Berjalan: uji jaringan 12 Nov 18.20 dari laptop |
| SU-5 vonis | Separuh terbuka 30 butir beku; separuh tersembunyi 30 butir di laptop |
| SU-4, SU-6 persona | Generator menyusul di ME1 |
| SU-1, SU-1m, SU-2, SU-3, SU-8 | Menunggu data |
| SU-7 | Pakai `evals/d6/` + kasus mesin |
