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
