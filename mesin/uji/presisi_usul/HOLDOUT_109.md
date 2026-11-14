# Uji dokumen baru kedua untuk pemeta v3 (butir 109) · aturan pemilihan dibekukan sebelum pencarian
Label: PUTUSAN ATAS DELEGASI. Pengganti himpunan 107 yang kekurangan teks (3 dari 11 dokumen bertekst).

Pemilihan mekanis, tanpa membaca isi dokumen sebelum dipilih:
1. Kueri pencarian web (mode standar), tepat dua per kebutuhan, dijalankan sekali, urutan hasil dipakai apa adanya:
   - kemiskinan-kabkota: "peraturan bupati penanggulangan kemiskinan tugas pendamping pdf" · "peraturan wali kota tim koordinasi penanggulangan kemiskinan daerah tugas pdf"
   - penduduk-tanpa-jaminan-kesehatan: "peraturan bupati pendaftaran peserta jaminan kesehatan nasional penduduk didaftarkan pemerintah daerah pdf" · "peraturan wali kota universal health coverage jaminan kesehatan petugas pdf"
   - stunting-balita: "peraturan bupati percepatan penurunan stunting tugas kader posyandu pdf" · "peraturan wali kota percepatan penurunan stunting kader pembangunan manusia tugas pdf"
2. Hasil diterima bila: tautan berdomain go.id; berkas yang diunduh berawalan %PDF; teks terekstrak ≥ 5.000 karakter; doc_id belum ada di register L0 v4.
3. Hasil diperiksa menurut urutan (kueri pertama dulu, lalu kedua), berhenti pada 4 dokumen per kebutuhan. Dokumen yang gagal syarat 2 dilewati dan dicatat.
4. Alat beku sama dengan 107: potong_cuplikan.py, PROMPT_PEMETA_v3.md (Sonnet), validasi_kutipan_v3_1.py, PELABEL_v1.md dengan kutipan kebutuhan
   dibaca sebagai bagian kutipan (Fable 5.2 baru). Sampel: semua usulan sah bila ≤ 40, selain itu 40 acak seed 109.
5. Kriteria lulus: batas bawah Wilson 95% ≥ 0,85, ragu dihitung salah. Angka ragu-dibuang dilaporkan, tidak menentukan.
