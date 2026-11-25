# Keputusan atas tinjauan Fable 5.2 kerja 15 Nov 2026 · PUTUSAN ATAS DELEGASI
Asal: Raihan 15 Nov 2026 02.34 WIB "Review dengan Fable 5.2, lanjut." dan delegasi 14 Nov 09.10 "decide the best for things, go SOTA".
Laporan: `uji/tinjauan/TINJAUAN_Fable_Kerja-15Nov2026.md` (P = 11, K = 9). Semua temuan diadopsi; tidak ada yang ditolak. Butir tindak lanjut:

| Temuan | Tindakan | Butir |
|---|---|---|
| P1 "8 dari 8" sirkular | Redaksi diganti "8 peran lolos gerbang rantai"; galat pelabel diukur dengan pelabel penyedia lain + contoh periksa manusia | 102, 113 |
| P2 uji 109 kurang daya, butir tidak bebas | Pendaftaran G3.2 ketiga: ≥100 usulan sah dari ≥25 dokumen, ≤5 usulan per dokumen, bootstrap klaster per dokumen, elusi diukur (AMBANG G3.2 n 100, elusi_maks 0,05) | 114 |
| P3 kueri 109 bias | Pendaftaran ketiga memakai sampel acak berstrata dari register atau kueri netral tanpa nama peran dan tanpa "tugas"; log terima/lewati per kandidat di repo | 114 |
| P4 109 tak tereproduksi | Keluaran mentah pemeta, cuplikan, label mentah, dan log pengambilan kini di `uji/presisi_usul/h109/` | selesai |
| P5 "benar" bukan kelayakan | PELABEL v2 dua dimensi: pelaksana, dan peran yang bisa dimasuki orang biasa (bukan jabatan struktural atau jabatan tim) | 113 |
| P6 validator v3.1 berlubang | Validator v3.2 + fixture negatif per kelas (lembaga, nama disingkat, KERJA, penanda awalan, kutipan kebutuhan di luar cuplikan, potongan kata) | 112 |
| P7 regex v2.1 regresi dan salah tangkap peran | Regex v2.2: nama wilayah dibuang sebelum pindai, batas kata, daftar terpisah untuk teks kartu dan teks peran | 111 |
| P8 set A/B/C | Prompt penulis set disimpan mulai set D; C dinilai sebagai set berkorelasi dengan B; A-N30 dicatat salah label; set D berstrata dan memuat teks kartu utuh ber-isian | 110 |
| P9 klaim "juri benar menurut definisinya" | Redaksi dikoreksi: 26 dari 42 lolosan juri tertangkap regex, sebagian jelas di dalam definisi; juri kuantitas dikalibrasi ulang | 110 |
| P10 S4 berlubang untuk draf | Sidik setiap kartu (termasuk draf) wajib ada di manifest mentah; skema diperketat (K6) | selesai bila gerbang lulus |
| P11 S6 URL dari pola | Kolom diganti `url_tercatat` + `jenis_url` (pola_tabel, kandidat_unduh, halaman_pendarat); STATUS menyebut S6 "dipenuhi dengan pengganti" | selesai bila manifest dibangun ulang |
| K1 sampai K9 | Koreksi redaksi dan angka di STATUS; BEKU untuk alat yang belum beku (dibekukan sesudah dipakai, dicatat begitu) | selesai |

Keputusan delegasi yang ditentang peninjau dan kini dibalik: "USUL v3 jadi bawaan" ditunda sampai validator v3.2 lulus fixture; "8 dari 8" bukan ukuran ketepatan; S4 dan S6 tidak lagi disebut "ditutup" tanpa catatan; "celah di definisi, bukan di juri" diganti "celah di definisi dan di juri"; A+B tidak dipakai apa adanya untuk kalibrasi butir 110.

## KEPUTUSAN Raihan 15 Nov 2026 03.12 WIB (verbatim)
"Model di luar Anthropic tidak usah, saya tak punya juga soalnya API-nya.
Ahlinya saya saja.
Lanjut."
Akibat (PUTUSAN ATAS DELEGASI, 03.13 WIB):
- Butir 102 ditutup: syarat juri dan pelabel beda penyedia (H1, rencana §9 butir 4) diganti dua pengaman: (a) label Raihan sebagai acuan manusia untuk mengukur galat pelabel dan juri model; (b) silang antarmodel dalam keluarga Anthropic (Haiku, Sonnet, Fable) dengan ketidaksepakatan dilaporkan. Galat bersama satu keluarga model tetap dicatat sebagai batasan, bukan syarat yang ditunggu.
- Butir 115: Raihan menilai sekitar 25 usulan peran secara buta (label Fable tidak ditampilkan); hasilnya mengukur kesepakatan Fable dengan Raihan dan menjadi acuan PELABEL v2 (butir 113).
