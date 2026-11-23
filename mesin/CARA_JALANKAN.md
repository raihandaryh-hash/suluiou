# Cara menjalankan mesin Sulu tanpa laptop · 23 Nov 2026

Buku jalan mandiri untuk siapa pun yang memegang repo, termasuk Tim IT sesudah serah 1 Des. Tidak butuh folder `MESIN\` di laptop Raihan. Semua perintah di bawah diuji dari klon segar cabang `mesin-me1-fondasi` pada 23 Nov 2026 (Linux, Python 3.13).

## 1. Siapkan

```bash
git clone --branch mesin-me1-fondasi https://github.com/raihandaryh-hash/suluiou
cd suluiou
python3 --version            # 3.12 atau lebih baru
python3 -m pip install pyyaml  # satu-satunya pustaka luar untuk jalur di bawah
```

Hanya untuk mengurai ulang PDF resmi (`mesin/parser/`): `pdftotext` dari paket poppler-utils. Tidak dibutuhkan untuk §3 dan §4.

Semua perintah dijalankan dari akar repo dengan `python3 -I` (mode terisolasi), kecuali yang disebut lain.

## 2. Variabel lingkungan (nama saja)

| Nama | Dipakai oleh | Wajib untuk §3–§4 |
|---|---|---|
| `BPS_KUNCI_BERKAS` | `mesin/alat/bps/bps.py`: jalur berkas teks berisi kunci BPS WebAPI. Kunci tidak pernah masuk repo, log, atau keluaran | tidak |
| `REGISTER_RAIHAN` | `mesin/alat/cari_putusan.py`: jalur register pesan Raihan (tidak di repo) | tidak |
| `LANJUT` | dua alat panen: lanjutkan panen yang terputus | tidak |

Data turunan yang dipakai kartu dan pencocok sudah ada di repo (`mesin/sumber/`, `mesin/sambung/keluaran/`). Panen ulang dari BPS hanya perlu bila ingin menyegarkan angka; bps.go.id menolak sebagian jaringan pusat data, jadi panen dijalankan dari jaringan biasa.

## 3. Jalankan satu domain contoh: kemiskinan kabupaten/kota

Domain contoh dibekukan sampai sesudah 1 Des (keputusan Kepala Staf 23 Nov, R9 disetujui Raihan 22 Nov 01.56). Perluasan ke domain lain ditunda.

```bash
python3 -I mesin/sambung/ekspor_kartu_tayang.py      # kartu wilayah dari angka resmi
python3 -I mesin/alat/periksa_gerbang_kartu.py        # gerbang A/K/M atas 900 kartu
python3 -I mesin/sambung/pencocokan_dasar.py          # aturan P1–P6 → mesin/sambung/keluaran/pencocokan_dasar.json
```

Hasil yang diharapkan (23 Nov 2026):
- ekspor: `kab/kota di daftar induk: 514`, kemiskinan `(490, 24)`, provinsi berberkas `36 dari 38`;
- gerbang kartu: `VONIS: LULUS`;
- pencocokan: enam aturan dengan batas kuartil, mis. `P1 pend_sma_ke_atas … n_berangka 497`.

Bila `git status` sesudahnya bersih, keluaran identik dengan yang di repo.

## 4. Uji

```bash
python3 -I mesin/alat/periksa_gerbang.py              # LULUS gerbang deterministik
python3 -I mesin/sambung/uji_pencocokan_dasar.py      # 11/11
python3 -I mesin/sambung/uji_tetangga_wilayah.py      # 11/11 (14/14 sesudah PR #19)
python3 -I mesin/alat/uji_periksa_tanda_lapis.py      # 17/17 (28/28 sesudah PR #20)
cd mesin/sambung && python3 uji_pencarian.py && python3 uji_penjelajah.py && python3 uji_s1.py && cd ../..
cd mesin/uji/set_tahap && python3 -I bangun_set.py && cd ../../..   # set uji tahap; jalankan dari foldernya
```

`uji_pencarian`, `uji_penjelajah`, dan `uji_s1` mengimpor modul tetangganya, jadi dijalankan dari `mesin/sambung/` tanpa `-I`.

## 5. Komit

```bash
git add <berkas>
python3 mesin/alat/commit_aman.py "<pesan>"   # menolak berkas beku dan peran struktural sebagai tujuan
```
Perubahan di `mesin/sambung/` atau `mesin/uji/set_tahap/` butuh baris `Kartu-niat:` di pesan; buat dengan `python3 -I mesin/alat/cek_niat.py "kata kunci" --main <klon main> --buku <folder bahan>`.

## 6. Batas

- Tidak ada perintah di buku ini yang menyentuh produksi, database, atau data pengguna.
- Cabang `main` tidak disentuh; penggabungan ke `mesin-me1-fondasi` lewat PR yang ditinjau.
- Uji yang butuh model (juri, pemantik jalur cipta) memakai kunci API dan tidak termasuk buku ini.
