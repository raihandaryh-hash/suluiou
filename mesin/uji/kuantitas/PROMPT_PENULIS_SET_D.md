# Prompt penulis set D (butir 110, tinjauan Fable P8) · disimpan sebelum dipakai
Dipakai dua agen Sonnet terpisah: satu menulis D-kal (kalibrasi), satu menulis D-uji (uji sekali). Keduanya tidak melihat set A, B, C,
regex, definisi juri, atau satu sama lain.

Isi yang diminta per agen (jumlah berbeda: D-kal 60 positif + 60 negatif; D-uji 160 positif + 160 negatif):
- Positif berstrata empat kelas sama besar: (1) proporsi/pecahan/jumlah kira-kira/klaim keseluruhan populasi; (2) peringkat dan superlatif;
  (3) perbandingan antarwilayah atau antarwaktu dan arah perubahan; (4) intensitas dan kiasan besaran.
- Negatif berstrata empat kelas sama besar: (a) kalimat tugas atau cara mulai peran; (b) bahasa syarat hukum dengan bilangan atau "paling";
  (c) teks kartu sah ber-isian yang membandingkan dengan nilai tengah nasional lewat {pembanding} dan {jarak}; (d) kalimat dengan kata
  pengecoh (seluruh kader, setiap bulan, naik ke panggung, turun ke lapangan, tertinggal sebagai status desa, se-kecamatan untuk lomba,
  kontribusi, seperti, rata-rata nilai ijazah sebagai syarat).
- Separuh butir tiap kelas ditulis sebagai teks kartu utuh {judul, ringkasan, harapan} memakai isian {prevalensi_stunting}, {pembanding},
  {jarak}, {tahun_data}, dengan tepat satu bagian yang memuat (atau, untuk negatif, tidak memuat) ungkapan kelasnya; separuh lagi satu kalimat.
- Kalimat ragu dibuang. Tiap butir: {"id", "kelas", "harus_ditolak", "teks"} dengan teks berupa string atau objek {judul, ringkasan, harapan}.
