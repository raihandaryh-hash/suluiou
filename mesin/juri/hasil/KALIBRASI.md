# Kalibrasi juri G1.6 pada SU-2 separuh terbuka (13 Nov 2026)

Juri: Claude Haiku 5.5, satu mode per panggilan, prompt `juri/PROMPT_JURI*.md`. Penulis teks: Claude Sonnet 5.5 (prompt penulis v1). Pemutus label: Claude Opus 5.5, bukan penulis dan bukan juri. Beda penyedia (rencana §9 butir 4, disetujui) belum dipakai karena belum ada akses API penyedia lain di sesi ini.

| Mode | Putaran 1 (v1) TPR / TNR | Putaran 2 (v2) | Putaran 3 (v3) | Prompt final |
|---|---|---|---|---|
| wilayah | 50/50 · 50/50 | | | v3 (teks mode sama dengan v1) |
| populasi | 90/90 · 40/50 | 50/90 · 50/50 | 90/90 · 50/50 | v3 |
| sebab | 50/57 · 50/50 | 56/57 · 50/50 | | v3 (= v2 untuk sebab) |
| vonis | 50/50 · 50/50 | | | v3 |
| placeholder | 50/50 · 50/50 | | | v3 |
| kuantitas | 50/50 · 50/50 | | | v3 |

Jumlah percobaan: 3 putaran prompt, 10 panggilan juri. Batas bawah Wilson pada n = 50 tidak bisa mencapai ambang beku (maksimum 0,929 untuk 50/50; ambang dihitung pada n >= 100), jadi vonis G1.6 baru diambil sesudah separuh tersembunyi dinilai dengan prompt v3 yang dibekukan.

Catatan jujur: tafsir di v2 dan v3 ditulis sesudah melihat galat di separuh terbuka, termasuk satu frasa yang dikutip dari set itu. Karena itu angka putaran 3 pada separuh terbuka bersifat optimistis; ukuran yang sah hanya hasil pada separuh tersembunyi.

Temuan penulis: pemutus menilai 47 dari 180 teks penulis v1 bergalat (40 populasi, 7 sebab). Prompt penulis dinaikkan ke v2 (`kartu/PROMPT_PENULIS.md`).

## Vonis G1.6 (13 Nov 2026, sesudah separuh tersembunyi dinilai dengan prompt v3 beku)

Separuh tersembunyi: 350 butir (sha256 e00c4a41…f5ea, hanya di laptop), ditulis agen Sonnet terpisah; dinilai enam juri Haiku di laptop; pembangun hanya menerima hitungan. Gabungan = separuh terbuka (putaran final per mode) + separuh tersembunyi.

| Mode | Tersembunyi TPR | Tersembunyi TNR | Gabungan TPR | Gabungan TNR | G1.6 |
|---|---|---|---|---|---|
| wilayah | 50/50 | 50/50 | 100/100 (LB 0.963) | 100/100 (LB 0.963) | LULUS |
| populasi | 50/50 | 50/50 | 140/140 (LB 0.973) | 100/100 (LB 0.963) | LULUS |
| sebab | 50/50 | 50/50 | 106/107 (LB 0.949) | 100/100 (LB 0.963) | LULUS |
| vonis | 50/50 | 50/50 | 100/100 (LB 0.963) | 100/100 (LB 0.963) | LULUS |
| placeholder | 49/50 | 50/50 | 99/100 (LB 0.946) | 100/100 (LB 0.963) | LULUS |
| kuantitas | 50/50 | 50/50 | 100/100 (LB 0.963) | 100/100 (LB 0.963) | LULUS |

Ambang beku: TPR batas bawah Wilson >= 0,90 dan TNR >= 0,85, masing-masing pada n >= 100. Semua mode lulus. Tuduhan lintas mode pada separuh tersembunyi: 0 dari 60 di keenam mode.

Batasan yang tetap berlaku:
1. Juri, penulis, dan penulis set tersembunyi semuanya keluarga Claude. Syarat "beda penyedia" belum terpenuhi; hasil ini sah untuk G1.6 sebagai juri bukan-penulis, tetapi galat yang dibagi bersama satu keluarga model belum teruji.
2. Hampir sempurna di dua separuh menandakan SU-2 mungkin terlalu mudah: galat ditulis oleh model yang tahu aturannya. Ukuran yang lebih keras datang dari galat penulis nyata (47 dari 180 di uji pertama); set berikutnya perlu lebih banyak galat nyata dari penulis versi produksi.
3. Koreksi bias (arXiv 2511.21140) tidak mengubah hasil karena galat juri hampir nol; rumusnya dipasang saat juri dipakai menaksir mutu kartu tayang.
