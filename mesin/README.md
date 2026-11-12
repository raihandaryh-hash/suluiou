# Mesin eksplorasi Sulu

Pencari kebutuhan nyata per bidang × wilayah dari data resmi, yang menawarkan beberapa jalur jelajah ke Proposal Diri. Istilah internal: mesin pencari porsi atau jalur fardu kifayah. Ke pengguna: "kebutuhan nyata yang ada".

**Dasar:** rencana mesin v1 (isi v1.3), disetujui Raihan 12 Nov 2026 18.16 ("Saya setujui semuanya"). Berkas rencana di laptop `Sulu Build\Audit-Nov2026\MESIN\RENCANA_Mesin-Eksplorasi-SOTA_v1_12Nov2026.md`.

**Prinsip yang ditegakkan kode di folder ini:**
- Angka tidak pernah melewati model. Angka dihitung skrip dari berkas resmi bersidik.
- Set uji dan ambang dibekukan sebelum pemeriksanya ditulis (`uji/`).
- Keluaran ke Proposal Diri hanya lewat kontrak `jalur-jelajah/1` (`kontrak/`).
- Lima aturan Jalan Tengah (KEPUTUSAN 12 Nov): sendiri pun bermakna, pintu ke manusia selalu ada tapi tidak wajib, bekalnya kaya, tumbuh tanpa leher botol manusia, menyalakan.

| Folder | Isi | Tonggak |
|---|---|---|
| `bank/` | Bank kandidat jenis kebutuhan (33, beku) dan bobot saringan v1 | ME1–ME2 |
| `sumber/` | Kontrak data per sumber (format ODCS v3.1) dengan status uji akses SU-0 | ME1 |
| `uji/` | Ambang beku, set uji terbuka, sidik set tersembunyi | ME1–ME3 |
| `kontrak/` | Skema `jalur-jelajah/1`, generator, 27 fixture | ME0 (disetujui) |
| `alat/` | Gerbang deterministik untuk CI | ME1 |

Tidak ada bagian folder ini yang menyentuh produksi, database, atau data pengguna.
