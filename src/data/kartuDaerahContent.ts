// Tonggak 2b · A1 (MANIFEST v0.4): kartu kebutuhan daerah di samping
// "Gambaran arah daerahmu". Isi kartu (judul, ringkasan, langkah awal, angka)
// datang dari berkas `public/data/kartu/` (skema kartu-tayang/1, sesi mesin).
// Kalimat tanda hati-hati ada di indeks berkas itu (varian A, Raihan 16 Nov 2026).
// Teks antarmuka di bawah boleh disunting tanpa menyentuh komponen.
export const kartuDaerahContent = {
  judulBagian: 'Kebutuhan nyata di daerahmu',
  pengantar:
    'Angka resmi dari BPS untuk kabupaten atau kotamu. Pakai sebagai titik awal untuk melihat dan bertanya langsung.',
  pilihLabel: 'Pilih kabupaten atau kotamu',
  pilihPlaceholder: 'Kabupaten atau kota',
  belumAdaProvinsi: 'Belum ada data bersumber untuk provinsi ini.',
  belumAdaKabkota: 'Belum ada data bersumber untuk daerah ini pada bagian ini:',
  gagalMuat: 'Data daerah belum bisa dimuat. Coba lagi nanti.',
  labelLangkah: 'Satu cara mulai',
  // Arahan Raihan 16 Nov 2026 18.14: langkah awal cukup mengamati dan mendengar
  // di sekitar, bukan mendatangi orang. Varian A terpasang; varian B menunggu
  // pilihan Raihan: 'Angka ini baru pembuka. Wujudnya di lingkunganmu hanya kamu
  // yang bisa melihat. Amati dulu, lalu catat satu hal yang paling sering kamu
  // temui soal ini.' Kolom langkah_awal di berkas kartu tidak ditampilkan.
  langkahAmati:
    'Sepekan ini, buka mata dan telinga di sekitarmu. Catat satu hal yang kamu lihat atau dengar sendiri terkait angka ini: di mana, siapa yang terdampak, dan siapa yang sudah menanganinya.',
  labelSumber: 'Sumber',
  bukaSumber: 'Buka sumber',
  tandaKurasi: 'Data BPS, disusun Sulu',
  namaJenis: {
    'kemiskinan-kabkota': 'kemiskinan',
    'pengangguran-terbuka-kabkota': 'pengangguran terbuka',
  } as Record<string, string>,
} as const;
