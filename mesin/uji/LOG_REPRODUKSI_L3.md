# Log reproduksi L3 (G1.2) · 13 Nov 2026 06.41 WIB (jam sistem) · keluaran alat apa adanya

Alat: `mesin/alat/reproduksi_l3.py` (sha256 awalan 69d4cb932368, salinan laptop bersidik sama). Tiap baris: dua proses terpisah dari gudang mentah ke dua berkas baru. Pengurai di laptop bersidik sama dengan repo (dikk_2025 d801c88c70ae, bps_webapi 26d6ad1bbc0c, sid_2025 a4f81e82428f).

```
[laptop] kemiskinan: jalan1 93a658d3d2c4 · jalan2 93a658d3d2c4 → identik
[laptop] bps-webapi: jalan1 176db7066fc3 · jalan2 176db7066fc3 → identik
[laptop] indeks-desa: jalan1 a083acb7294b · jalan2 a083acb7294b → identik
[ruang kerja] ssgi-2024: jalan1 27e9cf9164e2 · jalan2 27e9cf9164e2 → identik
```
Sidik berkas L3 tersimpan sebelumnya: 93a658d3d2c4, 176db7066fc3, a083acb7294b (laptop), 27e9cf9164e2 (ruang kerja): semuanya sama dengan hasil ulang.
Catatan: sidik SSGI 1a7168163e3d di STATUS lama adalah sidik baris di dalam periksa_ssgi_2024.py (metode lain), bukan sidik berkas.

## Pembaruan 13 Nov 2026 12.24 WIB (jam sistem)
Tabel L3 BPS dibangun ulang sesudah `0000_tpt_2824_2024.json` (bc4c6f139e79) dipanen. Satu-satunya perubahan: 1.737 baris dari berkas itu bertambah, tidak ada baris hilang (dicek per berkas).
```
[laptop] bps-webapi: jalan1 779aa79d7a2e · jalan2 779aa79d7a2e → identik
```

## Wilayah induk · 13 Nov 2026 14.40 WIB (jam sistem)
`parser/wilayah_induk.py` (7493c88fa84e, salinan laptop sama) dijalankan dua kali ke berkas baru: f3b676e88a71 dan f3b676e88a71, identik dengan berkas `mentah/_wilayah_induk.csv` di laptop (ditulis 13 Nov 02.39). Ringkasan sesi sebelumnya mencatat sidik lain (c1fee24ceef1); sidik itu tidak tercatat di repo dan tidak bisa ditelusuri, jadi yang berlaku adalah f3b676e88a71 yang terbukti bisa dibangun ulang.
