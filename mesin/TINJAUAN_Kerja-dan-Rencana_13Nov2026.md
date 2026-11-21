# Tinjauan kerja dan rencana mesin · 13 Nov 2026 15.12 WIB (jam sistem) · SINTESIS
Diminta Raihan 13 Nov 15.09: "Review also your work this far, find out if there are better ways in the plan, etc."

## Yang terbukti berhasil
1. Aturan "angka masuk kartu hanya bila ada salinan kedua yang cocok" + panen BPS kab/kota: kemiskinan 490/514 (36 dari 38 provinsi), TPT 410, air minum 160; 0 selisih kecuali yang ditarik.
2. Bekukan dulu, nilai kemudian: semua set uji dan bobot bersidik sebelum hasil terlihat.
3. Pemeriksa independen: tiga putaran menemukan cacat nyata (G1.6 tak sah, sel tak ditegakkan, koreksi Kalbar tak sah).

## Kesalahan saya hari ini (pola dan penjaganya)
| Kesalahan | Penjaga mekanis | Status |
|---|---|---|
| Jam ditebak (sesi sebelumnya) | jam hanya dari `TZ=Asia/Jakarta date` | berjalan |
| Dua commit terkirim dengan gerbang gagal | `alat/commit_aman.py` (commit ditolak bila gerbang gagal); kait git lokal ditolak sistem izin | terpasang 13 Nov |
| Menimpa berkas beku bobot_v1 | pemeriksa BEKU di CI dan commit_aman | terpasang |
| Daftar air minum keluar kosong (argumen ambigu) | su1m.py menolak susunan argumen itu | terpasang |
| Set uji tersembunyi SU-2b sempat di ruang kerja pembangun | SU-2c: juri membaca langsung dari laptop, berkas tidak pernah masuk ruang kerja pembangun | aturan untuk SU-2c |

## Cara yang lebih baik dalam rencana (usulan, belum diubah)
1. **Medan timpang.** Data terverifikasi kini hanya K5 (kemiskinan, TPT) dan K6 (air minum, tanpa target). Persona dan jalur akan miring ke ekonomi. Usul: urutan sumber berikutnya dipilih menurut "medan baru per jam kerja": SSGI (K1) butuh publikasi kedua (profil kesehatan provinsi atau BPS), Dapodik (K2) mulai jalur nota kesepakatan sekarang karena lambat.
2. **Lantai provinsi vs kartu kab/kota.** G2.1 menghitung provinsi; TPT punya 410 kab/kota terverifikasi tetapi jatuh ke "kartu nasional saja" karena 32 dari 38 provinsi. Usul untuk diputus Raihan: tetap tampilkan kartu kab/kota yang terverifikasi bila cakupan penduduknya di atas ambang tertentu, dengan label provinsi yang belum terisi. Risiko yang dijaga G2.1 (hanya satu daerah terisi) tetap tertangkap ambang penduduk.
3. **Keterabaian.** Daripada memetakan anggaran ke kebutuhan (tafsir), pakai cakupan program resmi per orang terdampak bila ada (mis. penerima PKH per penduduk miskin). Lebih bisa diperiksa.
4. **Ketergantungan laptop.** Pekerjaan panjang terputus saat laptop tidur; panen kini bisa dilanjutkan (LANJUT=1). Container tidak bisa menjangkau BPS, jadi panen tetap di laptop.
5. **Biaya sesi.** Banyak langkah salin bolak-balik laptop–ruang kerja. Usul: simpan turunan kecil bersidik (daftar kode, tabel A) di repo begitu dibuat, supaya tidak perlu diangkut lagi.
