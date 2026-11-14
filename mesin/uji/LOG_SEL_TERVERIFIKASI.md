# Log pembuatan daftar sel terverifikasi · 13 Nov 2026 (jam sistem) · keluaran alat apa adanya
Alat `alat/sel_terverifikasi.py` (sha256 awalan 33c4659611b8) dijalankan di laptop atas `mentah/bps/_l3_bps.csv` (176db7066fc3) dan `mentah/bps-pub/_dikk2025_tabel21.csv` (93a658d3d2c4); `uji/su1m.py` c19dca26b624.
```
kemiskinan-kabkota-2025: 398 sel cocok, 0 berpasangan tetapi berselisih (ditarik) [], 116 tanpa pasangan (ditahan); sha256 108f45f2a0cf
sakernas-agustus: 321 sel cocok, 0 berpasangan tetapi berselisih (ditarik) [], 193 tanpa pasangan (ditahan); sha256 3cc288d98e7d
air-minum-layak-kabkota: 108 sel cocok, 0 berpasangan tetapi berselisih (ditarik) [], 397 tanpa pasangan (ditahan); sha256 57f8ae606190
sanitasi-layak-kabkota: 79 sel cocok, 15 berpasangan tetapi berselisih (ditarik) ['1872', '6101', '6102', '6103', '6104', '6105', '6106', '6107', '6108', '6109', '6110', '6111', '6112', '6171', '6172'], 410 tanpa pasangan (ditahan); sha256 ab7293f7ce0a
```
Sidik keempat berkas di repo `sumber/sel/` sama dengan sidik laptop di atas (diperiksa di ruang kerja).

## Pembaruan kemiskinan · 13 Nov 2026 12.17 WIB (jam sistem)
Pemuat `uji/su1m.py` 583160552dcc menerima tabel BPS kab/kota; `alat/sel_terverifikasi.py` 949e343b2a29 (pembulatan bilangan bulat tidak lagi diterima).
Panen `alat/bps_kab_panen.py`: 422 domain kab/kota (34 provinsi), 206 berkas; L3 `mentah/bps_kab/_l3_bps_kab.csv` 3bcce756f5b8 (1.322 sel, 396 kab/kota unik, 121 baris tertolak karena label wilayah bukan nama kab/kota).
```
kemiskinan-kabkota-2025: 490 sel cocok, 0 berpasangan tetapi berselisih (ditarik) [], 24 tanpa pasangan (ditahan); sha256 f911c48b30a0
kemiskinan: 100 dari 100 tertangkap (ambang >=98) · kolom_bergeser 25/25 · tahun_sebelah 25/25 · koma_desimal 25/25 · sae_ditukar 25/25
```

## Pembaruan TPT · 13 Nov 2026 14.03 WIB (jam sistem)
Panen `alat/bps_kab_panen.py tpt`: 514 domain, 240 berkas. Pengurai `parser/bps_webapi.py` 38ff4f1c3e88 (tabel tanpa isi dilewati). L3 `mentah/bps_kab/_l3_bps_kab_tpt.csv` 3584a064ed3f. Daftar kemiskinan diperiksa ulang dengan L3 ini: tetap f911c48b30a0.
```
sakernas-agustus: 410 sel cocok, 0 berpasangan tetapi berselisih (ditarik) [], 104 tanpa pasangan (ditahan); sha256 29b723c7b1f5
tpt: 100 dari 100 tertangkap (ambang >=98) · kolom_bergeser 25/25 · tahun_sebelah 25/25 · koma_desimal 25/25 · sae_ditukar 25/25
```

## Pembaruan air minum · 13 Nov 2026 14.20 WIB (jam sistem)
Panen air minum: 514 domain, 34 berkas. L3 gabungan kab/kota `mentah/bps_kab/_l3_bps_kab.csv` 39d8454ff8a5; dengan L3 ini daftar kemiskinan tetap f911c48b30a0 dan TPT tetap 29b723c7b1f5.
Catatan: satu jalan pertama memberi 0 sel karena L3 tambahan terbaca sebagai TURVAR; `uji/su1m.py` 32768711a71b kini menolak argumen itu.
```
air-minum-layak-kabkota: 160 sel cocok, 1 berpasangan tetapi berselisih (ditarik) ['1971'], 344 tanpa pasangan (ditahan); sha256 be6bc6f8c9d7
airminum: 100 dari 100 tertangkap (ambang >=98) · kolom_bergeser 25/25 · tahun_sebelah 25/25 · koma_desimal 25/25 · sae_ditukar 25/25
```
