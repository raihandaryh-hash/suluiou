# Prompt pemeta peran (L5, ME3) · versi 3 · dibekukan 15 Nov 2026 01.05 WIB sebelum dijalankan

Label: PUTUSAN ATAS DELEGASI (Raihan 14 Nov 09.10 "decide the best for things, go SOTA"). Asal: v2 diukur 15 Nov (benar 23, salah 0, ragu 17; semua ragu = kaitan kebutuhan tak tampak). Sebelumnya: ketepatan mode USUL v1 diukur rendah
(sampel 40: benar 14, salah 7, ragu 19; uji/presisi_usul/). Pemeta TIDAK diberi SU-3 dan tidak boleh membukanya.

Anda membaca cuplikan dokumen resmi Indonesia untuk SATU kebutuhan masyarakat. Tugas Anda menyebut **peran orang** (jabatan,
profesi, petugas, kader, relawan) yang oleh dokumen itu **ditugaskan atau disebut mengerjakan sesuatu** untuk kebutuhan tersebut.

## Mode USUL
Masukan: `kebutuhan` (id dan indikator) dan daftar cuplikan `{id, doc_id, teks}`.
Keluaran: satu baris JSON per peran: `{"kebutuhan", "peran", "jenis_peran": "formal|nonformal|sukarela", "doc_id", "cuplikan_id", "kutipan", "kata_tugas", "kutipan_kebutuhan"}` (`kutipan_kebutuhan` boleh null bila aturan 7 sudah dipenuhi `kutipan`).
Aturan:
1. `kutipan` disalin **persis** dari `teks` (boleh dipotong, tidak boleh diubah satu huruf pun), paling banyak 40 kata, memuat nama peran
   **dan** kata kerja tugas yang dikerjakan peran itu (mis. bertugas, melaksanakan, mendampingi, mendata, menimbang, memverifikasi).
   `kata_tugas` = kata kerja itu, disalin persis dari kutipan (boleh frasa; kata pertamanya harus kata kerja).
2. Kutipan yang hanya berupa daftar nama, susunan keanggotaan, atau komposisi tim tanpa kata kerja tugas peran itu **tidak boleh** dipakai.
   Bila satu-satunya penyebutan peran berupa daftar, jangan keluarkan peran itu.
3. **Bukan peran orang** dan tidak boleh dikeluarkan: tim, kelompok kerja, satuan tugas, forum, lembaga, organisasi, dinas, badan,
   kementerian, pemerintah daerah, dan jabatan politik atau kepala daerah (menteri, gubernur, bupati, wali kota, camat, kepala desa,
   lurah). Anggota orang di dalam tim boleh bila kutipan menyebut tugas anggota itu sendiri.
4. Peran yang hanya disebut sebagai penerima manfaat, sasaran, atau pihak yang dilapori **bukan** pelaksana.
5. Tidak menambah peran dari pengetahuan umum. Bila tidak ada, keluarkan `{"kebutuhan", "status": "TIDAK ADA DI CUPLIKAN"}`.
6. Satu peran boleh muncul lebih dari sekali bila dari dokumen berbeda; pilih kutipan tugas terkuat per dokumen.
7. **Kaitan dengan kebutuhan harus tampak dari teks.** Kutipan tugas harus memuat kata penanda kebutuhan (lihat daftar di bawah); bila tidak,
   isi `kutipan_kebutuhan` dengan kutipan kedua yang disalin persis dari cuplikan yang SAMA, paling banyak 40 kata, yang menunjukkan bahwa
   tugas peran itu ditujukan untuk kebutuhan tersebut (bukan sekadar dokumen itu menyebut kebutuhannya di tempat lain). Bila tidak ada kutipan
   seperti itu, jangan keluarkan peran itu.
   Penanda: kemiskinan-kabkota → miskin, kemiskinan, fakir, kesejahteraan sosial, bantuan sosial, bansos, DTKS, DTSEN, PKH, rentan ·
   penduduk-tanpa-jaminan-kesehatan → jaminan kesehatan, JKN, BPJS Kesehatan, kepesertaan, PBI, KIS, iuran · stunting-balita → stunting,
   gizi, balita, baduta, posyandu, tumbuh kembang, penimbangan, pengukuran, ibu hamil.
