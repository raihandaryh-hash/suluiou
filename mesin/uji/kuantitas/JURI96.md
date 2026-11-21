# Uji luar sebaran juri kuantitas G1.6 (butir 96) · didaftarkan sebelum dijalankan
Label: PUTUSAN ATAS DELEGASI. Juri: prompt beku PROMPT_JURI_v3.md + definisi_mode.json mode kuantitas, model Haiku (sama dengan vonis G1.6
putaran 4), satu kali jalan, tanpa penyetelan. Masukan: 260 kalimat set A, B, C (130 positif, 130 negatif) diacak seed 96 dan diberi id
baru (peta_juri96.json) supaya label tidak terbaca dari id. Kalimat ditaruh di teks.ringkasan dengan kartu netral.
Ukuran: TPR dan TNR dengan batas bawah Wilson 95% atas seluruh 260 dan atas C saja; ambang AMBANG G1.6 (LB TPR ≥ 0,90, LB TNR ≥ 0,85).
Hasil dilaporkan per kelas ungkapan yang lolos regex v2.1 (gabungan juri dan regex = lapis 1 + lapis 2).
