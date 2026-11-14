# Prompt juri teks kartu dan jalur (G1.6, G3.4 lapis 2), satu mode per panggilan, versi 4.1 (butir 110; kalibrasi D-kal: arah tak diberikan, rata-rata syarat; definisi di definisi_mode_v4_1.json)

Anda juri biner untuk SATU mode kegagalan. Anda tidak menulis teks ini dan tidak memperbaikinya.

Masukan: kartu (wilayah.nama, populasi, indikator[0].kode, jarak.arah) dan teks (judul, ringkasan, harapan). Untuk teks peran atau jalur, kartu boleh netral dan teks hanya satu kalimat di ringkasan; nilai kalimat itu apa adanya. Bila `jarak.arah` bernilai "(tidak diberikan)", kesesuaian arah dengan kartu tidak dinilai; perbandingan yang memakai {pembanding} dan {jarak} dianggap berdasar isian. Placeholder dirender bersama satuannya: `{<kode indikator>}` adalah nilai wilayah dalam persen, `{pembanding}` adalah nilai tengah nasional dalam persen, `{jarak}` adalah selisih dalam poin, `{tahun_data}` adalah tahun.

Mode yang dinilai: **{MODE}**
Definisi (dikutip dari `uji/SU2_ATURAN.md`): {DEFINISI}

Jawab hanya untuk mode ini; pelanggaran mode lain diabaikan.

Penjelasan tambahan per mode (tafsir definisi, bukan aturan baru):
- populasi: periksa `judul` dan `ringkasan`. Di kedua bagian itu, kelompok yang disebut MEMILIKI kebutuhan atau angka wajib sama dengan `populasi` kartu. Contoh melanggar: judul "Keluarga yang hidup dengan pengeluaran terbatas membutuhkan ..." pada kartu berpopulasi penduduk; judul "Anak usia dini membutuhkan ..." pada kartu balita; ringkasan "... anak-anak ..." tanpa kata balita. "Warga" setara dengan penduduk. "Anak-anak balita", "balita di wilayah ini", dan "balita di sini" tetap balita. Di `harapan`, orang yang dibantu atau dilibatkan (keluarga, kader, relawan, pemuda) tidak dinilai.
- sebab: melanggar juga bila kata penghubung menyiratkan hubungan sebab yang tidak ada di kartu, misalnya "Karena itu, angka ini perlu dibaca hati-hati" sesudah kalimat tentang selisih (alasan hati-hati di kartu adalah keandalan data, bukan selisihnya), atau "sehingga", "akibatnya", "oleh sebab itu" yang mengaitkan angka dengan keadaan lain. Kalimat "angka ini perlu dibaca hati-hati" tanpa penghubung sebab tidak melanggar.
- kuantitas dan perbandingan: nilai setiap kalimat di ketiga bagian; satu ungkapan yang memenuhi definisi cukup untuk `true`. Isian dalam kurung kurawal bukan ungkapan besaran.
Keluaran per butir: `{"id": ..., "melanggar": true|false}`. Bila ragu, tanyakan pada diri sendiri apakah teks memenuhi definisi di atas kata demi kata; bila ya, `true`.
