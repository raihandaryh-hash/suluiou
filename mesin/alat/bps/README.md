# Alat BPS WebAPI (dijalankan di laptop Raihan)

Kunci BPS hanya ada di laptop (`Sulu Build\kunci-lokal\bps.txt`) dan tidak pernah masuk repo, log, atau keluaran. `bps.py` menghapus kunci dari setiap teks yang dikembalikan.

| Berkas | Fungsi |
|---|---|
| `bps.py` | panggil satu jalur WebAPI, simpan JSON mentah + sha256 |
| `bps_panen.py` | panen P0 dan TPT kab/kota dari tiap domain provinsi ke `MESIN\mentah\bps\` + `manifest.csv` |
| `../../parser/bps_webapi.py` | urai JSON mentah ke tabel L3 |
| `bps_pilih.py` | pilih satu variabel per provinsi per indikator dengan aturan tetap → `_pilihan.csv` |

Status 12 Nov 2026: panen pertama 152 berkas dari 34 domain provinsi. Pemilihan belum layak: sebagian variabel memakai kode vervar urut (1, 2, …), bukan kode wilayah BPS, sehingga perlu pemetaan ke daftar kab/kota resmi (`domain/type/kabbyprov`). Empat provinsi Papua baru dan Papua Barat Daya belum muncul di daftar domain.
