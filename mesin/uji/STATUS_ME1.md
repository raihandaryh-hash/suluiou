# Status tonggak ME1 (Fondasi data) · 13 Nov 2026 07.03 WIB (jam sistem) · SINTESIS

Dasar: rencana mesin v1 (isi v1.3) §4.2, disetujui Raihan 12 Nov 2026 18.16. Cabang `mesin-me1-fondasi`, PR draf #6.
**Vonis pemeriksa independen 13 Nov 06.3x: BELUM.** Bagian ini mencatat tindak lanjutnya. ME1 belum selesai sampai G1.6 sah dan pemeriksa independen menilai ulang.

## Sumber DIPAKAI untuk kartu (4), hanya sel yang cocok dengan publikasi kedua
| Sumber | Sel terverifikasi | G1.2 (sidik L3, dua jalan) | G1.3 | G1.3m (SU-1m empat jenis, beku sebelum dinilai) | G1.5 | G1.7 |
|---|---|---|---|---|---|---|
| Kemiskinan kab/kota 2025 | 398 kab/kota, 27 provinsi | 93a658d3d2c4 identik | 398 cocok (DKI masuk lewat tabel gabungan) | 100/100 (set segar sesudah perubahan filter; putaran 1: 99/100) | hati_hati, rse_tidak_terbit | Syarat BPS |
| TPT Agustus 2025 | 321, 21 provinsi | 176db7066fc3 identik | 321 cocok | 99/100 (tanpa jenis tahun sebelah) | hati_hati, rse_tidak_terbit | Syarat BPS |
| Air minum layak 2025 | 108, 9 provinsi | 176db7066fc3 identik | 108 (+139 tahun 2024) | 99/100 | hati_hati, rse_tidak_terbit | Syarat BPS |
| Sanitasi layak 2025 | 93, 8 provinsi | 176db7066fc3 identik | 93 + 124 sampel segar 2024; Kalbar dikoreksi (label tahun tertukar, 28/28); Kota Metro ditarik | 100/100 | hati_hati, rse_tidak_terbit | Syarat BPS |

Gabungan: 31 dari 34 provinsi (belum: Bengkulu, Kepulauan Riau, Papua) (kode domain lama). Pada seluruh tabel (termasuk sel tanpa pasangan) SU-1m hanya menangkap 26-87 dari 100; semua yang lolos ada di sel tanpa publikasi kedua. Karena itu sel tanpa pasangan ditahan (PUTUSAN ATAS DELEGASI 13 Nov 2026).

## Sumber DITAHAN
- SSGI 2024: publikasi kedua independen belum ada. Reproduksi L3 27e9cf9164e2 identik.
- Indeks Desa 2025: berselisih dengan Kepmendes 343/2025 (sekunder); aturan G1.3 mewajibkan ditarik. Reproduksi a083acb7294b identik.
- NEET, perkawinan anak: G1.3 dan mutasi belum. SISDMK: pensiun.
Validator `alat/periksa_sumber.py` kini gagal bila sumber dipakai tanpa G1.3 dan G1.3m lulus; `alat/periksa_kartu.py` menolak kartu non-draf bersumber ditahan.

## Gerbang lintas sumber
| Gerbang | Status |
|---|---|
| G1.1 | lulus pada fixture; validator di CI |
| G1.2 | lulus: `alat/reproduksi_l3.py`, log `uji/LOG_REPRODUKSI_L3.md`, sidik di tiap kontrak |
| G1.4 | lulus pada fixture dan 180 teks penulis; teks 180 belum utuh di repo (catatan audit 9) |
| G1.5 | patuh jalur cadangan; dua tafsir dicatat di `uji/AMBANG_CATATAN.md` |
| **G1.6** | **LULUS pada ukuran, BERSYARAT pada cara ukur.** Set tersembunyi segar SU-2b (n=100 per sisi per mode, prompt v3 beku, satu jalan): enam mode lulus, LB TPR 0,930-0,963, LB TNR 0,888-0,963 (`juri/hasil/KALIBRASI.md` putaran 4). Syarat juri beda penyedia (§9 butir 4) belum: menunggu akses dari Raihan |
| SU-4 / SU-6 | 72 persona, 450 pasangan; beku |

## Batasan yang dibawa
1. Pembanding masih median nasional; target resmi dicari di ME2.
2. Cakupan terverifikasi 31 dari 34 provinsi; G2.1 (lantai 34 provinsi) berisiko sampai publikasi kedua untuk provinsi lain dipanen.
3. Label hati_hati untuk sumber BPS berarti RSE tidak terbit, bukan RSE 25-50%.
