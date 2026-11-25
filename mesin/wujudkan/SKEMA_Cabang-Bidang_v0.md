# Skema cabang bidang · v0 · 22 Nov 2026

SINTESIS sesi mesin (SESI-11NOV-SULU-MESIN). Langkah W3–W4 tahap Wujudkan (`mesin/uji/SINTESIS_Mesin-Wujudkan_Jejak-dan-Rancangan_18Nov2026.md` §3). Poros: yang mau dibangun, bukan jabatan (Raihan 18 Nov 16.08).

## Simpul

| Medan | Isi | Wajib |
|---|---|---|
| `id` | slug unik, mis. `digital.llm.aplikasi` | ya |
| `induk` | `id` simpul di atasnya; akar = domain Peta Bekal tayang (`skillMapContent.ts` lapis 3) | ya |
| `nama` | nama cabang, bahasa Indonesia | ya |
| `membangun` | contoh hal yang dibangun di cabang ini (bukan jabatan) | ya, ≥2 |
| `bekal` | daftar berurutan: `{nama, simpul_peta_bekal?, esco_uri?, onet_kode?, tahap: awal/tengah/lanjut}` | ya, ≥3 |
| `proyek_pertama` | satu proyek kecil yang bisa dikerjakan siswa dalam sebulan | ya |
| `pintu_belajar` | jalur terbuka (kurikulum, kursus, sertifikasi), tiap butir ber-URL | ≥1 |
| `pijakan_kbji` | kode KBJI 2026 orang yang sudah membangun hal serupa (`bank_peran.json`) | boleh kosong |
| `sumber` | URL primer untuk keberadaan cabang dan urutan bekalnya | ya, ≥1 |
| `status_sumber` | `bersumber` / `belum` | ya |

## Aturan

- Simpul tanpa `sumber` berstatus `belum` dan tidak tayang.
- Cabang yang tidak islami tidak masuk (Raihan 30 Mei).
- Tanpa angka gaji di simpul; upah sektor resmi menempel di W5 sebagai fakta.
- Solusi siswa yang tidak cocok cabang mana pun masuk jalur cipta, bukan dipaksakan ke cabang terdekat.

## Uji terima v1

1. Domain `teknologi-digital` punya cabang tingkat 1 dan 2, termasuk `llm` dengan ≥3 anak.
2. 100% simpul tayang berstatus `bersumber`.
3. Tiap `bekal.simpul_peta_bekal` ada di `skillMapContent.ts`.
