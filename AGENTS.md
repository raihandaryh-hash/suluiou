# AGENTS.md · suluiou (wajib dibaca agen mana pun sebelum menulis kode, prompt AI, atau teks layar)

Pemilik: Chief Sulu (penulis tunggal manifest Sulu). Gerbang akhir: Raihan.

## Urutan wajib sebelum membangun
1. Baca `INTENT_KANON.md` utuh. Butir di sana mengikat; pengingat Raihan bukan keputusan baru.
2. Cocokkan rencana ke **Buku Pengetahuan Sulu** (Bab 11 keputusan, Bab 12 register kebutuhan) dan register niat Sulu. Buku dan register tidak ada di repo publik ini; letaknya di folder Foresight Raihan (`Sulu Build/Audit-Nov2026/BUKU/`) dan Project "IOU - Foresight" (`sulu/RINGKASAN_Buku-Pengetahuan-Sulu_v1.md`, `sulu/REGISTER_Sulu.md`), plus baris KEPUTUSAN Stream Sulu di Ledger.
3. Sebelum bertanya ke Raihan atau menitip riset ke lajur lain: cari dulu di Buku, register, dan basis bukti. Pertanyaan atau titipan hanya untuk sisa yang benar-benar tidak ada, dengan menyebut apa yang sudah dicari.
4. Catat peran yang terdampak (siswa, mahasiswa, orang tua, guru BK, guru, umum). Jangan menulis untuk satu peran saja kecuali keputusan menyebutnya.

## Gerbang mekanis (CI)
- `cari-sebelum-cipta`: badan PR wajib bagian `## Cari sebelum cipta` (pakai / tiru / bangun).
- `rujukan-niat`: PR yang menyentuh `src/` atau `supabase/functions/` wajib bagian `## Rujukan niat` berisi kutipan atau rujukan Buku bertanggal, dan baris `Peran terdampak:`.
- Uji deno `pembaca_semua_fungsi_test.ts`: tiap fungsi AI menyuntik baris PEMBACA peka peran.
- `cek-copy-sulu`, `periksa-anon`, `uji-gerbang-ai`: lihat berkasnya di `.github/workflows/`.

## Perintah periksa lokal
```
npx tsc --noEmit -p tsconfig.app.json && npx vitest run
npx -y deno@2 test -A --no-check --import-map=supabase/functions/_uji/import_map.json supabase/functions/_uji/
npx --yes esbuild@0.21.5 supabase/functions/<fungsi>/index.ts --format=esm
```

## Pagar
- Air-gap keras pengguna di bawah 18 (INTENT_KANON butir 5); asesmen terkunci untuk siswa SMA (butir 4).
- Flag yang membuka asesmen, hasil publik, atau fitur AI baru hanya dinyalakan Raihan.
- Merge ke `main` hanya atas kata Raihan; merge bukan rilis (Publish dan deploy fungsi oleh Raihan lewat Lovable).
- Uji tidak memakai database produksi tanpa izin eksplisit Raihan.
- Nol PII dan nol rahasia di Git. Repo ini publik.
- Prosedur lengkap: skill `sulu-build-discipline` (di luar repo).
