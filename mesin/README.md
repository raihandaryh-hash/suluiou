# Mesin eksplorasi Sulu

Pencari kebutuhan nyata per bidang × wilayah dari data resmi, yang menawarkan beberapa jalur jelajah ke Proposal Diri. Istilah internal: mesin pencari porsi atau jalur fardu kifayah. Ke pengguna: "kebutuhan nyata yang ada".

**Dasar:** rencana mesin v1 (isi v1.3), disetujui Raihan 12 Nov 2026 18.16 ("Saya setujui semuanya"). Berkas rencana di laptop `Sulu Build\Audit-Nov2026\MESIN\RENCANA_Mesin-Eksplorasi-SOTA_v1_12Nov2026.md`. Rencana terkini untuk tinjauan Chief: `RENCANA-MESIN_Terintegrasi_18Nov2026.md` (rujukan komit di dalamnya sudah lama; pakai kepala cabang).

**Yang beku hanya produksi** (KEPUTUSAN Raihan 24 Nov 18.24, "beku produksi bukan beku kerja"): merge ke `main` produksi, deploy basis data utama, dan spek serah Tim IT. Kerja di cabang mesin berjalan per milestone. Uji Claude Code Projects tetap ditunda sampai sesudah 1 Des karena berbagi kuota (R9, Raihan 22 Nov 01.56). Folder `mesin/` dan `grok/` tidak masuk build situs, `tsc`, `vitest`, maupun `eslint` aplikasi.

**Prinsip yang ditegakkan kode di folder ini:**
- Angka tidak pernah melewati model. Angka dihitung skrip dari berkas resmi bersidik.
- Set uji dan ambang dibekukan sebelum pemeriksanya ditulis (`uji/`).
- Keluaran ke Proposal Diri hanya lewat kontrak `jalur-jelajah/1` (`kontrak/`).
- Lima aturan Jalan Tengah (KEPUTUSAN 12 Nov): sendiri pun bermakna, pintu ke manusia selalu ada tapi tidak wajib, bekalnya kaya, tumbuh tanpa leher botol manusia, menyalakan.

**Kepala cabang:** `mesin-me1-fondasi` (cek dengan `git log --oneline -1 origin/mesin-me1-fondasi`; jangan menyalin SHA ke dokumen lain). Cara menjalankan tanpa laptop: `mesin/CARA_JALANKAN.md`.

| Folder | Isi | Tonggak |
|---|---|---|
| `sumber/` | Kontrak data per sumber, data resmi turunan (BPS, DIKK, KBJI 2026, SSGI, SID) | ME1 |
| `parser/` | Pengurai PDF dan tabel resmi | ME1 |
| `bank/` | Bank kandidat jenis kebutuhan (v2, 57 kandidat) dan metode saringan v1–v7 | ME1–ME2 |
| `kartu/` | Pembangun kartu wilayah dan skemanya | ME2 |
| `sambung/` | Sambungan ke alur tayang: deret angka, ekspor kartu, lapis provinsi, tetangga wilayah, pencarian, penjelajah, pencocokan dasar, bank peran KBJI; keluaran di `sambung/keluaran/` | sesudah ME3 |
| `pencocok/`, `jalur/`, `peran/` | Pencocok uji ME3 dan rantai jalur; arah peran dikoreksi 15 Nov (`uji/KOREKSI_Arah-Lapis-Peran_15Nov2026.md`) | ME3 |
| `cipta/` | Jalur cipta: pemantik gagasan pengguna | ME3 |
| `juri/` | Juri satu mode per panggilan dan hasil kalibrasinya | ME1–ME3 |
| `kontrak/` | Skema `jalur-jelajah/1`, generator, fixture | ME0 |
| `uji/` | Ambang beku, set uji, sidik set tersembunyi, laporan gerbang, tinjauan | ME1–ME3 |
| `wujudkan/` | Tahap Wujudkan (dari proposal ke rencana meraihnya): skema cabang bidang v0. Rancangan: `uji/SINTESIS_Mesin-Wujudkan_Jejak-dan-Rancangan_18Nov2026.md`. Posisi: **Tonggak 2c**, sesudah 2b (jelajah + "mau bangun apa") dan sebelum Tonggak 3 (Proposal Diri + persetujuan orang tua), putusan Chief Sulu 23 Nov (Ledger 421a045d9957812e92aef82eb44649a6), bisa dibalik Raihan. W1–W8 jadi bahan manifest 2c yang ditulis Chief sesudah 2b dibangun; `sambung/keluaran/bank_peran.json` dipakai di W2; sesi mesin tidak menambah rancangan | 2c |
| `alat/` | Gerbang deterministik, alat BPS, penegak niat dan komit | semua |

Tidak ada bagian folder ini yang menyentuh produksi, database, atau data pengguna.

## Disiplin per langkah (sejak 18 Nov 2026, INSIDEN 14.29)
1. Sebelum mulai satu serahan, sebelum menyebut fitur Sulu "belum ada" atau "sudah ada", dan sebelum menulis daftar peran, teks untuk siswa, atau aturan pencocokan: jalankan `python3 -I mesin/alat/cek_niat.py "<kata kunci>"` atas `main` yang segar, lalu notion-search Ledger KEPUTUSAN Stream Sulu dengan kata kunci yang sama.
2. Tempel blok "Kartu niat" keluaran skrip di baris JAWAB atau LOG-SESI serahan itu: KEPUTUSAN yang mengikat, kode tayang yang sudah melakukan hal serupa, niat U/V yang dijaga.
3. Bila kode tayang sudah melakukannya, serahan memperkaya yang tayang (KEPUTUSAN 15 Nov 09.16: "enhance, bukan break"); tidak membuat jalur tandingan.
4. Gerbang deterministik (`commit_aman.py`) menolak keluaran yang memuat jabatan struktural, kader, relawan, pengurus, atau peran berhonor sebagai tujuan.
