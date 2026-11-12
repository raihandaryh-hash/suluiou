# Status tonggak ME1 (Fondasi data) · 13 Nov 2026 06.32 WIB (jam sistem) · SINTESIS

Dasar: rencana mesin v1 (isi v1.3) §4.2, disetujui Raihan 12 Nov 2026 18.16. Cabang `mesin-me1-fondasi`, PR draf #6.

## Sumber yang DIPAKAI untuk kartu (6)
| Sumber | Tingkat | G1.0 | G1.2 | G1.3 | G1.5 | G1.7 |
|---|---|---|---|---|---|---|
| Kemiskinan kab/kota 2025 (BPS, buku DIKK) | 514 kab/kota | lolos | ulang identik (93a658d3d2c4) | publikasi kedua 392/392 cocok; jumlah kab = provinsi 38/38; mutasi 100/100 | hati_hati (RSE tidak terbit) | Syarat Penggunaan BPS |
| TPT kab/kota Agustus 2025 (BPS) | 514 | lolos | ulang identik (176db7066fc3, tabel L3 BPS) | 310/310 cocok; apit L/P; mutasi 100/100 | hati_hati (SE Sakernas hanya DKI) | Syarat Penggunaan BPS |
| Air minum layak 2025 (BPS) | 505 | lolos | idem | 108/108 (2024: 139/139); mutasi 100/100 | hati_hati | idem |
| Sanitasi layak 2025 (BPS) | 504 | lolos | idem | 79 cocok; 15 selisih DITEKAN (14 label tahun Kalbar bergeser, 1 Kota Metro) | hati_hati | idem |
| SSGI 2024 (Kemenkes) | 513 + 1 baris cacat | lolos | ulang identik (1a7168163e3d) | tanpa publikasi kedua: invarian (nilai dalam CI, provinsi dalam rentang kab) + mutasi 100/100; 6 salah cetak ditekan | RSE dari CI: stunting 509 andal | sitasi + UU 28/2014 Ps 43 huruf b (KEPUTUSAN 13 Nov 01.48) |
| Indeks Desa 2025 (SID Kemendesa) | 432 kab/kota berdesa | lolos | ulang identik (a083acb7294b) | invarian (status = jumlah, kab = provinsi semua kolom, kecamatan = kab) + mutasi 100/100; BERSELISIH dengan Kepmendes 343/2025 di tingkat provinsi (sekunder); Papua 92-96 ditekan | administratif | aturan butir 1 |

## Sumber TIDAK dipakai sampai gerbang lengkap
- NEET dan perkawinan anak (provinsi): belum ada publikasi kedua maupun uji mutasi. Status draf.
- SISDMK: pensiun (tanpa tabel publik).

## Gerbang lintas sumber
| Gerbang | Status | Bukti |
|---|---|---|
| G1.1 Provenans | LULUS pada fixture; validator di CI | `alat/periksa_kartu.py` |
| G1.4 Nol angka ketikan | LULUS: 180/180 teks penulis lolos sesudah normalisasi satuan; uji negatif ditolak | `kartu/kartu.py`, `alat/periksa_kartu.py` |
| G1.5 Ambang RSE | ambang 25/50 cocok dengan dokumen resmi (Kementan, data Sakernas); batas 50% inklusif | `uji/CEK_AMBANG_RSE.md` |
| G1.6 Juri teks | LULUS enam mode (gabungan terbuka + tersembunyi, n ≥ 100) | `juri/hasil/KALIBRASI.md` |
| Daftar wilayah induk | 514 kab/kota; kode BPS lama, kode BPS baru Papua, kode Kemendagri | `parser/wilayah_induk.py` |
| SU-4 / SU-6 | 72 persona (96 jalan), 450 pasangan; dibekukan | `uji/persona.py` |

## Batasan yang dibawa ke ME2
1. Pembanding masih median nasional; target resmi (RPJMN, SPM) dicari di ME2.
2. Semua model satu keluarga; juri beda penyedia belum.
3. SU-2 kemungkinan terlalu mudah; set berikut perlu galat penulis produksi.
4. Indeks Desa berselisih dengan status hukum Kepmendes; kartu wajib menyebut SID dan tanggal akses.
