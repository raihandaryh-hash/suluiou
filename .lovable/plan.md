## Tujuan

Buat `/ringkasan` benar-benar terasa seperti **buku kecil / surat pribadi** yang hangat, tenang, dan layak dicetak — bukan kartu dashboard seperti sekarang. Sekaligus pastikan **semua catatan** yang user tulis di touchpoint sepanjang journey (Insight per-section + SkillMap per-node) muncul di sana dengan rapi.

Tidak ada perubahan copy, route, data, atau logic save/print/share. Tidak ada perubahan skema notes. Hanya layer visual + pengelompokan catatan yang sudah ada.

## Soal saran T3 (notebook kanan di SpineBLayout)

**Saran: TUNDA, jangan dikerjakan sekarang.** Alasan:

- `sulu_notes_v1` sudah punya field `source` ("insight" | "skillmap") dan `label` — itu sudah cukup untuk mengelompokkan di Surat Perjalanan. Tidak perlu menambah `category` ke skema.
- Menambah panel sticky kanan + bottom-sheet mobile + kategori baru = menyentuh `SpineBLayout`, semua halaman Spine B, dan tiap titik capture catatan. Risiko regresi tinggi vs nilai marginal — Catatanku per-anchor sudah ada di tempat yang tepat (saat membaca).
- Right column di SpineBLayout sudah direservasi kosong. Bisa diisi nanti kalau benar-benar dibutuhkan, terpisah dari pekerjaan visual Ringkasan.

Yang dikerjakan sekarang: **kumpulkan dengan indah di Ringkasan**, jangan tambah surface baru.

## Scope perubahan

Satu file inti:

- `src/pages/Ringkasan.tsx` — re-skin penuh ke "letter-book" + pengelompokan catatan per-source.

Tidak menyentuh: `suratPerjalanan.ts`, `notes.ts`, `SpineBLayout.tsx`, semua halaman fase, route, skema DB.

## Arah visual (letter-book)

Rasa: halaman jurnal/surat (Day One, Matter, buku saku pribadi). Bukan dashboard, bukan kartu-kartu.

1. **Bingkai halaman**
   - Background luar: `bg-scholarly` (cream) — memberi rasa "kertas di atas meja".
   - "Halaman" tengah: kartu putih dengan shadow lembut + border tipis `border-border/60`, padding generous (px-8 md:px-14 py-12 md:py-16), max-width ~`72ch`, terpusat, sudut radius medium.
   - Print: kartu kehilangan shadow/background, jadi hemat tinta (sudah ada `@media print`, tinggal disesuaikan).

2. **Header surat**
   - Kicker kecil tracking-widest: "SURAT PERJALANAN" + tanggal verbatim (sudah ada).
   - Judul serif/Outfit besar `text-4xl md:text-5xl`, leading ketat, warna `--ink-deep`.
   - Subtitle italic ringan di bawah, `--mid-blue`.
   - Garis hairline gold di bawah header sebagai pembatas.
   - Salam pembuka opsional kecil di kiri ("Untukmu, [nama bila ada], dan siapa pun yang kamu percaya —") menggunakan teks `header.subtitle` yang sudah ada — TIDAK menulis copy baru, hanya merangkai field yang ada.

3. **Pembagi bab** (ChapterDivider yang sudah ada, diperhalus)
   - Numeral Romawi besar (I, II) center-aligned di atas kicker.
   - Ornamen: tiga titik gold `• • •` di atas judul bab.
   - Lebih banyak whitespace vertikal (mt-16 / mt-20), supaya transisi bab terasa seperti membalik halaman.

4. **Tipografi**
   - Heading: Outfit (sudah dipakai), tracking dipertegas.
   - Body: leading-relaxed → leading-loose untuk paragraf naratif AI dan refleksi, ukuran `text-[17px]` di desktop supaya nyaman dibaca panjang.
   - Blok naratif AI → diberi style **kutipan**: indent kiri, border-left 2px `--torch-gold`, italic pertama beberapa kata via `first-letter` opsional (skip kalau mengganggu print).

5. **Blok refleksi (Refleksi Dirimu — 2A)**
   - Bukan grid kartu. Tampil sebagai **entry jurnal berurutan**: pertanyaan dalam Outfit semibold lebih kecil dan `--mid-blue`, jawaban di bawah dalam body serif-feel (Inter sudah oke), dipisah spasi luas, tanpa border per item — hanya divider hairline tipis di antaranya. Memberi rasa "halaman buku".

6. **Values (top 3) & Kompetensi (2B)**
   - Values: dijadikan **pull-quote** kecil center, "Yang paling bermakna bagimu: **X · Y · Z**" dengan typografi besar tenang, bukan pill berwarna gelap. Pill versi sekarang terlalu UI-ish.
   - Kompetensi: chip lembut bg `secondary/40`, border hairline, text tenang.

7. **Arah Jalan Bakti (3)**
   - Daftar inline bergaya katalog: tiga sub-section (Isu / Sub-bidang / Yang kamu pedulikan) dengan label kecil tracking-widest + item-item sebagai teks dipisah `·`, bukan pill berdesakan.

8. **Refleksi Sintesis (4)**
   - Blockquote besar dengan tanda kutip ornamental `"` gold di kiri-atas, italic, indented.

9. **Catatan dari Perjalananmu** (poin sentral request user)
   - **Sudah** dikumpulkan oleh `compileSurat()` via `getNotesBySource("insight")` + `getNotesBySource("skillmap")`. Yang berubah hanya presentasi:
     - Pisah menjadi dua sub-section dengan sub-heading: **"Catatan saat mengenal dunia"** (source=insight) dan **"Catatan dari Peta Keahlian"** (source=skillmap). Label sub-heading dari konten Ringkasan yang sudah ada / inline netral — tidak menambah copy baru di luar dua label sub-heading deskriptif ini (konfirmasi: bila user ingin label persis tertentu, akan dipakai).
     - Tiap catatan: label anchor (`n.label`) sebagai kicker kecil uppercase, teks catatan sebagai paragraf jurnal, hairline divider di antara entry. Tidak ada kartu kotak.
     - Urutkan secara stabil per source mengikuti urutan `getNotesBySource` (sudah terbaru-dulu) — tidak ada perubahan logic.
   - Bila user belum punya catatan apa pun di source tertentu, section itu tidak dirender (sudah behavior sekarang per source gabungan; pecah jadi dua kondisi).

10. **Footer surat**
    - "Surat ini bukan titik akhir…" (verbatim) ditampilkan sebagai paragraf penutup italic center, dengan tanda tangan ornamen `~ Sulu` kecil di bawah (atau hanya garis hairline + tanggal lagi — pilih yang paling tenang, tidak menambah copy). Jika user keberatan tanda tangan, pakai garis hairline saja.

11. **CTA**
    - Tombol-tombol (WA, Print, Kembali) dipindah ke bawah dalam grup terpisah di luar "halaman" buku — supaya halaman buku terasa utuh sebagai artefak. Mobile: stack vertikal. `print:hidden` tetap.

12. **Mobile**
    - Padding halaman buku dikurangi (px-5 py-8), font sedikit lebih kecil tapi leading tetap loose. Tidak ada perubahan struktur — hanya skala.

13. **Print (@media print)**
    - Hilangkan shadow, border tebal, dan background cream → halaman A4 putih bersih.
    - Pastikan `break-inside: avoid` di blok refleksi & catatan supaya tidak terpotong jelek.
    - Sembunyikan semua CTA & tombol.

## Teknis singkat

- Token warna yang dipakai (sudah ada di `index.css`): `--brand-navy`, `--ink-deep`, `--mid-blue`, `--torch-gold`, `--bg-scholarly`. Tidak ada hex baru, tidak ada warna hard-coded.
- Pengelompokan catatan: di dalam komponen Ringkasan, partisi `surat.catatan` dengan `n.source === "insight"` vs `"skillmap"`. Tidak perlu ubah `suratPerjalanan.ts`.
- Tidak menambah dependency. Bisa pakai `framer-motion` yang sudah ada untuk fade-in halus per section (opsional, tetap respect `prefers-reduced-motion`).
- Tidak menyentuh `useEffect` data-fetch, hooks, atau Supabase calls.

## Tidak dilakukan

- Tidak menambah right-rail notebook / bottom-sheet (T3).
- Tidak menambah field `category` di `sulu_notes_v1`.
- Tidak mengubah `SpineBLayout`, halaman fase, atau capture catatan di SkillMap/Insight.
- Tidak menulis copy baru selain dua sub-heading deskriptif untuk pengelompokan catatan (akan dikonfirmasi bila user mau wording lain).

## Verifikasi sesudah build

1. Buka `/ringkasan` (logged-in dengan data lengkap) di desktop & mobile → halaman terasa seperti buku, bukan dashboard.
2. Catatan di Insight dan SkillMap (tambah 1 catatan masing-masing) muncul terkelompok di section "Catatan dari Perjalananmu".
3. `window.print()` → preview PDF bersih, tanpa background cream, tanpa shadow, tanpa tombol, tidak ada blok terpotong di tengah.
4. State kosong (belum ada data) tetap menampilkan empty state yang sudah ada.
