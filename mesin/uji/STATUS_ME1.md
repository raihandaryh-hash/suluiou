# Status tonggak ME1 (Fondasi data) · 13 Nov 2026 07.10 WIB (jam sistem) · SINTESIS

Dasar: rencana mesin v1 (isi v1.3) §4.2, disetujui Raihan 12 Nov 2026 18.16. Cabang `mesin-me1-fondasi`, PR draf #6.
Vonis pemeriksa independen: putaran 1 (13 Nov pagi) BELUM; putaran 2 (13 Nov) BELUM, bisa naik ke SELESAI BERSYARAT bila (a) Raihan memutus soal juri beda penyedia dan (b) penahanan sel ditegakkan kode. Butir (b) dikerjakan sesudah putaran 2 (bagian di bawah). Butir (a) dan keputusan cakupan menunggu Raihan.

## Sumber DIPAKAI untuk kartu (2), hanya sel yang cocok dengan publikasi kedua
| Sumber | Sel (daftar beku `sumber/sel/`) | G1.2 | G1.3 | G1.3m (empat jenis, beku sebelum dinilai) | G1.5 | G1.7 |
|---|---|---|---|---|---|---|
| Kemiskinan kab/kota 2025 | 398 kab/kota, 27 provinsi (108f45f2a0cf) | 93a658d3d2c4 identik dua jalan | 398 cocok, 0 berselisih | 100/100 | hati_hati, rse_tidak_terbit | Syarat BPS |
| Air minum layak 2025 | 108 kab/kota, 9 provinsi (57f8ae606190) | 176db7066fc3 identik | 108 cocok, 0 berselisih | 99/100 | hati_hati, rse_tidak_terbit | Syarat BPS |
Gabungan: 30 dari 34 provinsi. `kartu.py` hanya membangun kartu untuk sel dalam daftar; `alat/periksa_kartu.py` menolak kartu non-draf di luar daftar (uji negatif ada).

Catatan cara ukur (audit S1): G1.3 dan G1.3m pada sel berpasangan menguji pembanding publikasi kedua, belum menguji invarian. Pada seluruh tabel, SU-1m hanya menangkap 26-87 dari 100; karena itu sel tanpa pasangan ditahan (PUTUSAN ATAS DELEGASI 13 Nov 2026, diajukan ke Raihan karena mengubah cakupan).

## Sumber DITAHAN
- TPT Agustus 2025: G1.3 lulus (321 cocok) tetapi G1.3m baru tiga jenis; tabel TPT 2024 belum dipanen.
- Sanitasi 2025: koreksi label tahun Kalbar dicabut (audit S2: arah salah label tidak terbukti); 14 sel Kalbar dan Kota Metro ditarik; 79 cocok, di bawah minimal 100.
- SSGI 2024, Indeks Desa 2025, NEET, perkawinan anak: G1.3 belum. SISDMK: pensiun.

## Gerbang lintas sumber
| Gerbang | Status |
|---|---|
| G1.1 | lulus pada fixture; validator di CI |
| G1.2 | lulus: `alat/reproduksi_l3.py`, `uji/LOG_REPRODUKSI_L3.md` |
| G1.4 | lulus pada fixture dan 180 teks penulis; teks 180 belum utuh di repo |
| G1.5 | patuh jalur cadangan; `uji/AMBANG_CATATAN.md` |
| G1.6 | ukuran lulus pada SU-2b segar (n=100 per sisi, prompt v3 beku, satu jalan; `juri/hasil/KALIBRASI.md` putaran 4). Cara ukur belum lengkap: juri beda penyedia (§9 butir 4) belum. SU-2b kini dianggap terpakai; putaran berikut butuh set SU-2c dengan separuh keluaran penulis produksi |
| SU-4 / SU-6 | 72 persona, 450 pasangan; beku |

## Menunggu Raihan
1. Juri beda penyedia: kunci Gemini di folder kunci lokal, atau keputusan menunda syarat ini.
2. Cakupan: menerima bahwa kartu hanya memakai sel terverifikasi (sekarang 2 sumber, 30 provinsi), atau arah lain.
