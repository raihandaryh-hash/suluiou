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

## Pendaftaran uji sekali D-uji (ditulis sesudah kalibrasi D-kal, sebelum D-uji dibuka)
- Kalibrasi D-kal (juri v4, Haiku): dua juri TPR 60/60, TNR 57/60. Tiga salah: dua karena kartu netral di harness memakai jarak.arah "di_atas" sedangkan teks sah menyebut "di bawah" (galat harness), satu "rata-rata nilai ijazah sebagai syarat". Regex ketat atas teks D-kal: TNR 51/60 bila digabung (salah tangkap di syarat hukum dan pengecoh).
- Perbaikan v4.1: arah "(tidak diberikan)" di harness dan prompt; pengecualian rata-rata syarat di definisi kuantitas. Tidak ada perubahan lain.
- Aturan putus G1.6/G3.4 lapis 2 untuk D-uji: **dua juri (kuantitas ATAU perbandingan), Haiku, v4.1, satu jalan**. Ambang: LB TPR ≥ 0,90 dan LB TNR ≥ 0,85 atas 160/160. Regex dan gabungan dilaporkan, tidak menentukan.
- Silang model (pengganti beda penyedia, KEPUTUSAN 15 Nov 03.12): Sonnet menjalankan kedua juri v4.1 yang sama pada D-uji; kesepakatan Haiku-Sonnet dilaporkan.
