# Kontrak kolom: kode_bps_kabkota_514.csv
SUMBER: mesin/sumber/masukan_kartu/dikk2025_tabel21.csv + mesin/sumber/wilayah/kode_baru_papua.csv @ cabang mesin-me1-fondasi 9fa8567
Salinan baca untuk AD (isi awal kamus kode_bps). Sesudah AD memuat, mesin membaca dari kamus AD; berkas ini tidak dipelihara sebagai kanon kedua.

| Kolom | Isi |
|---|---|
| kode_bps | 4 digit, kode 38 provinsi (Papua sudah dipetakan ke kode baru) |
| kode_bps_lama | 4 digit, kode 34 provinsi seperti di publikasi kemiskinan 2025 |
| kode_prov | 2 digit pertama kode_bps |
| provinsi | nama provinsi di publikasi |
| nama | ejaan publikasi, berawalan "Kab." atau "Kota" |
| jenis | kabupaten / kota |

Uji: 514 baris, 514 kode unik. Selesai bila AD menyatakan cocok 514/514.
