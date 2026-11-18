# Rencana mesin terintegrasi · 18 Nov 2026

Asal: SINTESIS sesi mesin (SESI-11NOV-SULU-MESIN, https://claude.ai/code/session_01JZPjjr3cEST9SPkxZSaHrr), atas perintah Raihan 18 Nov 14.43 ("Pastikan Chief bisa mereview semua plan ini, dan kita bisa terintegrasi"). Cabang repo `mesin-me1-fondasi` @ e93ac37. Pembaca: Chief Sulu (penulis tunggal manifest). Dokumen ini tidak mengubah manifest; ia menunjukkan tiap butir mesin, niat yang dijaga, data yang dipakai, dan uji terimanya.

## 1. Prinsip yang mengikat semua butir

| Prinsip | Sumber |
|---|---|
| Enhance, bukan break. TUJUAN = profesi riil; PIJAKAN = pengalaman. Peran mikro-bayar dan struktural (kader, pengurus, RT/RW, kepala desa) ditolak sebagai tujuan | KEPUTUSAN 15 Nov 09.16 (Ledger 419a045d99578130ad40fa402f8ab7b8); Raihan 18 Nov 14.38 "Bukan malah bikin peran yang mengarahkan user jadi pekerja RT/RW" |
| Angka upah resmi bertahun; label "rata-rata sektor" bila bukan per jabatan; nol kalimat janji | KEPUTUSAN 15 Nov 12.35 (Ledger 419a045d995781f49ac1e15707042ea7); manifest 2b A3 |
| Angka 2026 tampil bila ada | KEPUTUSAN Raihan 18 Nov 13.56 |
| Tiga lapis: yang Sulu tampilkan · yang Sulu dorong untuk dicari tahu · jelajah bebas | Raihan 18 Nov 14.20 |
| Bekerja dari sumber, bukan ingatan model | Raihan 18 Nov 14.38 |

Usulan lengkap 12 prinsip untuk A0: `mesin/uji/USUL_Prinsip-Produk-Sulu_A0_18Nov2026.md` (menunggu Chief).

## 2. Penegak mekanis (sudah di repo)

- `mesin/alat/cek_niat.py "kata"`: cari register niat, rancangan v3, Buku, manifest, dan kode tayang sebelum membangun; cetak Kartu niat.
- `commit_aman.py`: menolak commit di `mesin/sambung/` atau `set_tahap/` tanpa baris `Kartu-niat:`.
- `periksa_gerbang.py`: berkas beku, dan PENOLAK PERAN (regex kepala/camat/lurah/kader/relawan/honor/pengurus/ketua/pendamping desa atas daftar `tujuan*`).
- `periksa_gerbang_kartu.py`: gerbang A/K/M atas kartu (900/900 lulus).

## 3. Stack yang dipakai (agar tidak halu)

| Sumber | Dipakai untuk | Cara akses |
|---|---|---|
| Kode `main` (broaden-roles, jalanBaktiContent.ts, skillMapContent.ts) | titik sambung; yang sudah tayang diperkaya | clone segar `suluiou-main` |
| KBJI 2026 (BPS, 2.179 dari 2.380 jabatan berurai) | profesi tujuan bersumber | `mesin/sumber/kbji/kbji2026_jabatan.csv` |
| BPS WebAPI (kemiskinan, TPT, upah Sakernas) | angka kartu dan upah | laptop `MESIN\alat\bps.py` |
| DIKK 2025 profil miskin | aturan pencocokan | `mesin/sumber/masukan_kartu/dikk2025_profil_miskin.csv` |
| Ledger, Buku v1.4, rancangan v3, manifest 2b | niat dan keputusan | `cek_niat.py` + notion-search |
| Otak laptop | hanya dibaca | Filesystem jarak jauh |

## 4. Butir mesin

| No | Butir | Melayani manifest | Data / alat | Uji terima | Status |
|---|---|---|---|---|---|
| 262 | Kolam profesi KBJI per medan k1–k7 | A6 broaden-roles | KBJI 2026 csv; kata kunci per medan | semua kode KBJI ada di katalog; 0 lolos penolak peran | selesai e93ac37 (kandidat, sebelum G3.6) |
| 255 | Upah sektor BPS untuk profesi KBJI | A3, A6 | Sakernas rata-rata upah per lapangan usaha (WebAPI), peta KBJI → KBLI kasar | tiap angka ber-URL dan bertahun; label "rata-rata sektor"; 0 kalimat janji | berjalan |
| G3.6 | Lembar 20 profesi untuk dinilai Raihan | gerbang G3.6 | 262 + 255 | Raihan menilai; lulus ≥18/20 | sesudah 255 |
| 250 | Sumber dan cara cek "Hal untuk dicek" | A5 | baca fitur "Lihat Lebih Dekat" tayang dulu | tiap butir punya sumber dan langkah cek | antre |
| 251 | Variabel prompt + pembanding per fitur | A7 | kartu, deret, pembanding_kemiskinan.json | tiap variabel menunjuk berkas | antre |
| 252 | Inventaris peluang dan lapis dunia | A2 | lapis/daftar_lapis.json | tanda lapis lulus `periksa_tanda_lapis.py` | antre |
| 254 | Dua varian teks siswa untuk L11 | L11 tampil/cari_tahu | pencocokan_dasar.json | periksa_teks.py 0 wajib; dipilih Raihan | antre (pemilih Raihan via Chief) |
| 213 | Alat gerbang pintu AI | gelombang 3 | set_tahap SET_Perjelas v3, SET_Arah v2 | ambang J10 | antre |
| 214 | Uji pencarian berita lokal | gelombang 3 | — | — | parkir |
| 223 | Replikasi Future Authoring | gelombang 3 | — | — | parkir |

## 5. Yang Chief perlu nilai

1. Usulan Prinsip Produk A0 (12 prinsip): masuk manifest atau tidak.
2. Apakah 262/255 dipasang di A6 sebagai sumber daftar profesi broaden-roles (ganti ingatan model dengan kolam KBJI bersumber, tanpa membuang fungsi tayang).
3. Teks siswa dua varian (254) sesudah draf.

Selain tiga ini, mesin memutus sendiri dan mencatat PUTUSAN ATAS DELEGASI di Ledger (KEPUTUSAN 18 Nov 13.46).
