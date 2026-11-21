# Prompt pemeta peran (L5, ME3) · versi 1 · dibekukan 13 Nov 2026 21.38 WIB sebelum dijalankan

Label: PUTUSAN ATAS DELEGASI 13 Nov 2026. Pemeta TIDAK diberi SU-3 dan tidak boleh membukanya (`uji/G3_2_PROTOKOL.md` butir 2).

Anda membaca cuplikan dokumen resmi Indonesia untuk SATU kebutuhan masyarakat. Tugas Anda menyebut **peran** (jabatan, profesi, petugas, kader, relawan, lembaga pelaksana yang diisi orang) yang oleh dokumen itu **ditugaskan atau disebut sebagai pelaksana** penanganan kebutuhan tersebut.

## Mode USUL
Masukan: `kebutuhan` (id dan indikator) dan daftar cuplikan `{id, doc_id, teks}`.
Keluaran: satu baris JSON per peran: `{"kebutuhan", "peran", "jenis_peran": "formal|nonformal|sukarela", "doc_id", "cuplikan_id", "kutipan"}`.
Aturan:
1. `kutipan` disalin **persis** dari `teks` cuplikan (boleh dipotong, tidak boleh diubah satu huruf pun), paling banyak 40 kata, dan **memuat nama peran**.
2. Hanya peran yang dokumen sebut melaksanakan, membantu, mendampingi, atau bertugas untuk kebutuhan ini. Peran yang hanya disebut sebagai penerima manfaat, sasaran, atau pihak yang dilapori **bukan** peran pelaksana.
3. Lembaga (kementerian, dinas) bukan peran kecuali dokumen menyebut orang atau jabatan di dalamnya.
4. Tidak menambah peran dari pengetahuan umum. Bila cuplikan tidak menyebut pelaksana, keluarkan `{"kebutuhan", "status": "TIDAK ADA DI CUPLIKAN"}`.

## Mode PERIKSA
Masukan: `kebutuhan`, satu `peran`, dan cuplikan dari dokumen terdaftar untuk kebutuhan itu yang memuat kata dari nama peran.
Keluaran: `{"kebutuhan", "peran", "didukung": true|false, "doc_id", "cuplikan_id", "kutipan"}`.
- `didukung: true` hanya bila sebuah cuplikan menyebut peran itu (atau padanan yang jelas sama, misalnya "kader posyandu" dan "kader kesehatan posyandu") sebagai pelaksana untuk kebutuhan ini, dengan kutipan persis yang memuat nama peran.
- Kesamaan kata saja tidak cukup; peran yang disebut untuk urusan lain di dokumen yang sama = `false`.
- Ragu = `false`. Tanpa kutipan = `false`.
