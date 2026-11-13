# Status tonggak ME1 (Fondasi data) · 13 Nov 2026 11.03 WIB (jam sistem) · SINTESIS

Dasar: rencana mesin v1 (isi v1.3) §4.2, disetujui Raihan 12 Nov 2026 18.16. Cabang `mesin-me1-fondasi`, PR draf #6.
Vonis pemeriksa independen: putaran 1 BELUM, putaran 2 BELUM, **putaran 3 (13 Nov siang) SELESAI BERSYARAT**. Syarat yang dibawa ke ME2: juri beda penyedia; pengukuran ulang G1.6 dengan set baru SU-2c.

## Sumber DIPAKAI untuk kartu (3)
Target resmi pembanding (G2.4, ME2): `sumber/target/target_resmi.yaml` (kemiskinan dan TPT dari RPJMN, dibaca dari gambar halaman; air minum layak tanpa target ukuran sama)., hanya sel yang cocok dengan publikasi kedua
| Sumber | Sel (daftar beku `sumber/sel/`) | G1.2 | G1.3 | G1.3m (empat jenis, beku sebelum dinilai) | G1.5 | G1.7 |
|---|---|---|---|---|---|---|
| Kemiskinan kab/kota 2025 | 490 kab/kota, 34 provinsi (f911c48b30a0) | 93a658d3d2c4 identik dua jalan | 490 cocok, 0 berselisih (pembanding: tabel BPS provinsi dan kab/kota) | 100/100 (SU1mP3) | hati_hati, rse_tidak_terbit | Syarat BPS |
| TPT Agustus 2025 | 410 kab/kota, 31 provinsi (29b723c7b1f5) | 779aa79d7a2e identik | 410 cocok, 0 berselisih (pembanding: tabel BPS provinsi dan kab/kota) | 100/100 (SU1mP4_tpt, empat jenis) | hati_hati, rse_tidak_terbit | Syarat BPS |
| Air minum layak 2025 | 160 kab/kota, 14 provinsi (be6bc6f8c9d7) | 176db7066fc3 identik | 160 cocok, 1 berselisih ditarik (Kota Pangkalpinang) | 100/100 (SU1mP4_airminum) | hati_hati, rse_tidak_terbit | Syarat BPS |
Gabungan: 34 dari 34 provinsi. `kartu.py` hanya membangun kartu untuk sel dalam daftar; `alat/periksa_kartu.py` menolak kartu non-draf di luar daftar (uji negatif ada).

Pembanding: nilai tengah nasional dihitung dari seluruh kab/kota di tabel terbit A (termasuk sel yang ditahan), karena ia ringkasan tabel resmi, bukan angka sel; dicatat juga di `pembanding.catatan` tiap kartu (audit putaran 3 N1).
Asal daftar sel: `uji/LOG_SEL_TERVERIFIKASI.md`. Validator mewajibkan sumber dipakai punya daftar sel ≥100 baris.

Catatan cara ukur (audit S1): G1.3 dan G1.3m pada sel berpasangan menguji pembanding publikasi kedua, belum menguji invarian. Pada seluruh tabel, SU-1m hanya menangkap 26-87 dari 100; karena itu sel tanpa pasangan ditahan (PUTUSAN ATAS DELEGASI 13 Nov 2026, diajukan ke Raihan karena mengubah cakupan).

## Sumber DITAHAN
- Sanitasi 2025: koreksi label tahun Kalbar dicabut (audit S2: arah salah label tidak terbukti); 14 sel Kalbar dan Kota Metro ditarik; 79 cocok, di bawah minimal 100.
- SSGI 2024, Indeks Desa 2025, NEET, perkawinan anak: G1.3 belum. SISDMK: pensiun.

## Gerbang lintas sumber
| Gerbang | Status |
|---|---|
| G1.1 | lulus pada fixture; validator di CI |
| G1.2 | lulus: `alat/reproduksi_l3.py`, `uji/LOG_REPRODUKSI_L3.md` |
| G1.4 | lulus pada fixture dan 180 teks penulis; teks 180 belum utuh di repo |
| G1.5 | patuh jalur cadangan; `uji/AMBANG_CATATAN.md` |
| G1.6 | LULUS BERSYARAT (syarat beda penyedia ditunda ke ME2 oleh Raihan). Ukuran lulus pada SU-2b segar (n=100 per sisi, prompt v3 beku, satu jalan; `juri/hasil/KALIBRASI.md` putaran 4). Cara ukur belum lengkap: juri beda penyedia (§9 butir 4) belum. SU-2b kini dianggap terpakai; putaran berikut butuh set SU-2c dengan separuh keluaran penulis produksi |
| SU-4 / SU-6 | 72 persona, 450 pasangan; beku |

## Keputusan Raihan
1. KEPUTUSAN 13 Nov 2026 10.59 WIB: "Saya tidak punya API Gemini. Ditunda saja ke tahap kedua." Syarat juri beda penyedia G1.6 pindah ke ME2.
2. PUTUSAN ATAS DELEGASI (tafsir, bukan kutipan keputusan), dasar kutipan yang sama: "tinggal cari saja bahan-bahan yang valid, lalu sitasi, apa susahnya?" Dibaca sebagai: aturan sel terverifikasi berlaku, cakupan diperluas dengan memanen publikasi kedua yang sah (tabel BPS kabupaten/kota dan provinsi lain). Pekerjaan perluasan tidak menahan penutupan ME1 karena G1.0-G1.7 dinilai per sumber yang dipakai.
