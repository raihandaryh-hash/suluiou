# AUDIT ARCH DOC SULU (v1 → v2 → v3) — pengenceran dan pemakaian

> Catatan sesi mesin (SESI-11NOV-SULU-MESIN, 15 Nov 2026 17.09 WIB). SINTESIS auditor (subagen Opus, bukan penulis rancangan), diminta Raihan 15 Nov 17.00. Pencocokan kutipan Raihan oleh skrip: 35 potongan cocok huruf demi huruf dengan arsip, 3 tidak cocok karena auditor menyisipkan tanda elipsis di tengah kutipan pesan [1033], [255], [632]; ketiganya dibaca sebagai ringkasan, bukan kutipan. Cek silang kode oleh sesi mesin: PetaMedan.tsx:20, kenaliDirimuContent.ts:3 dan :214, Results.tsx:579, serta baris 42, 344, 422, 620, 850 arch doc v3 cocok dengan klaim auditor. Batas auditor: berkas topik tampilan dan copy hanya dibaca lewat saringan kata kunci; versi 1 dan 2 utuh tidak ada di arsip; isi yang tampil di halaman dan Notion tidak diperiksa.

Tanggal audit: 15 Nov 2026. Auditor: subagen baca-saja. Satu berkas ditulis (berkas ini), tidak ada commit.

Singkatan path:
- `D12` = `/mnt/user-data/uploads/MESIN/mentah/riwayat/p2/docs/D_Sulu_Architecture_DIFF_v1_ke_v2.md`
- `D23` = `.../D_Sulu_Architecture_DIFF_v2_ke_v3.md`
- `V3` = `.../D_Sulu_Architecture_v3.md`
- `T/<nama>` = `/tmp/claude-0/-home-claude/24ad2657-1416-5975-bcd6-c67e5e357b4e/scratchpad/niat/topik/<nama>.txt`
- Kode = `git -C /home/claude/suluiou show origin/main:<path>` (commit 6dea505, 15 Nov 2026). Pencarian kode memakai `git grep -n -i -E '<pola>' origin/main -- src supabase`.

Vonis satu kalimat: dugaan pengenceran **terbukti sebagian dan terlokalisasi**, sedangkan dugaan "arch doc tidak terpakai" **sebagian salah**: v3 dipakai membangun fase 2A sampai 5 pada 9–29 Jun, lalu tersingkir diam-diam oleh manifest dan paket Fable yang tidak pernah merujuknya, sementara arahan Raihan soal data daerah, AI web, program pemerintah, prompt pengguna, dan penanda AI sudah hilang atau menyusut sejak v3 sendiri.

---

## A. Riwayat versi menurut dua DIFF

Catatan metode: hanya isi yang tampak di DIFF. Bagian v1/v2 di luar hunk tidak ditebak.

### A1. v1 (7 Jun) → v2 (11 Jun)

| # | Kutipan DIFF (baris) | Jenis | Alasan tertulis? |
|---|---|---|---|
| 1 | `-Version 1.0 … Draft for Stress-Test` → `+Version 2.0 … Spec (perapian reference-drift)` (D12:6-7) | ubah | ya, "perapian reference-drift" |
| 2 | `+PRINSIP DOKUMEN — SPEC, BUKAN LOG … JANGAN di-append sebagai bagian baru` (D12:12-17) | tambah | ya (D12:14) |
| 3 | `-Copy: 🔲 Belum di-draft (3-4 kalimat)` → `+Copy: ✅ LIVE di /kenali-dirimu — verbatim di build/Truth State` (D12:26, 46) | **pindah** (copy dikeluarkan dari dok ke build) | ya: "Copy verbatim domain = LIVE di build, bukan di doc" (D12:52). Efek: spec tidak lagi memuat teks; pembaca dok tidak bisa mengecek isi |
| 4 | `-Format yang diizinkan: Visual Picker … Swipe Cards … Quick Visual Grid` (D12:32-35) → `+Tafakkur Journaling … BUKAN … Visual Picker / Swipe Cards` (D12:50) | hapus + ubah | ya: Frattaroli 2006, Morisano 2010 (D12:50). Sesuai arahan Raihan [959] |
| 5 | Domain 1: `-1. Ayat/Hadith koping aktif … 2. Guru/kiai/ustadz yang diikuti … 3. Rutinitas ibadah` (D12:41-44) → `+Intent: secure base spiritual …` (D12:55) | **lemahkan** (tiga butir konkret jadi satu kalimat intent) + rename "Akses Spiritual"→"Fondasi Keimanan" | rename ya (Ibn Qayyim, D12:54); pemadatan butir: hanya alasan umum "copy LIVE di build" |
| 6 | Domain 2: `-Format UX: Swipe Cards … 3 item` (D12:60-66) → `+Intent … Prompt 1 = peak experience … Prompt 2 = zahir strengths Abu Mahdzurah` (D12:67-69) | ubah + tambah | ya (format journaling) |
| 7 | Domain 3: `-1. Siapa guru/mentor … 2. Siapa alumni … 3. Siapa tokoh komunitas` (D12:75-77) → `+Intent: fokus figur otoritas/mentor …` (D12:79) | **lemahkan** (tiga pertanyaan spesifik hilang dari spec) | tidak spesifik |
| 8 | Domain 4: `-Horizontal Slider Likert (3 item dari ID-CAAS)` + tiga item verbatim (D12:84-87) → `+Item ID-CAAS Likert = milik battery /kenali-dirimu` (D12:90) | pindah | ya (D12:90) |
| 9 | 6.5: `+Framing aditif (ucap + cinta + manfaat), BUKAN substitutif` + `Atribusi halaman 508 … perlu diverifikasi` (D12:100, 103) | tambah | ya (arahan [981]) |
| 10 | 7.1: `-Status: Raihan ingin baca tafsir dulu` (D12:121) → `+Placement (LOCKED): PEMBUKA Phase 2B` (D12:124) | ubah | ya. Sisa lama tetap di V3:870 (Bagian 16 item 5) → kontradiksi internal |
| 11 | 7.3: `-BUILD FLAG: Rename node "Berpikir Analitis" → "Berpikir Kritis"` (D12:156) → `+JANGAN rename node — lihat 25.4` (D12:148) | ubah makna (membalik keputusan) | ya (25.4) |
| 12 | 7.3: deskripsi NACE dikoreksi ("dua arah", "capitalize on strengths", "+jejaring/navigasi") (D12:148-157) + `+Catatan Adaptability` (D12:159) | ubah + tambah | ya (PDF NACE 2024) |
| 13 | `-Prompt … "Skill mana yang ingin kamu kembangkan"` → `+pilih 1–3 skill + alasan + 1 langkah` (D12:163, 167); `+"pembawaan" (BUKAN "fitrah")` (D12:169) | ubah + tambah | ya ([981]) |
| 14 | 8.1: `+Copy … QS Hud 61 … terjemahan Kemenag terverifikasi` (D12:192-194) | tambah | ya |
| 15 | 8.2: `-Framing: "Inilah diskusi para pemimpin dunia …"`, `-Narasi intro: 🔲` (D12:179-181) → strong-why tiga gerakan + pasca-2030 (D12:202-237) | ubah + tambah | ya ([1018]) |
| 16 | K3: `-Keluarga, Anak & Inklusivitas` → `+Keluarga, Anak & Kelompok Rentan` (D12:241-242) | ubah | ya ([1008] "inklusivitas punya konotasi negatif") |
| 17 | `-Sub-tantangan … 🔲`, `-Bridge questions … 🔲` (D12:246, 248) → 6 bridge + 19 sub-tantangan verbatim (D12:257-300) | tambah | ya (provenance D12:300) |
| 18 | `-PMKS/Dhu'afa Framing … Hadith Bukhari 2896 … Copy: 🔲` (D12:250-254) → `+8.3b LENSA KEPEDULIAN … Opsi A` (D12:302-328); Bukhari 2896 diturunkan jadi "pendukung" (D12:308) | pindah + ubah | ya (D12:304) |
| 19 | 8.5: `-Thread … QS Al-Hujurat 13` → `+🔲 Belum ditentukan … DIPINDAH ke 8.2` (D12:332-333) | pindah (8.5 kini tanpa dalil) | ya (D12:333) |
| 20 | 9.2: `-Dalil: QS Al-Hashr 19 (sebagai closing)` → `+QS Ar-Ra'd 17` (D12:337-338) | ubah | **tidak** ada alasan tertulis di DIFF |
| 21 | **Bagian 18 Current State dihapus seluruhnya** (D12:342-516), termasuk flag Odyssey Plan "diskusi/ajuan AI dianggap keputusan" (D12:486), `/ringkasan` membaca `ai_narrative` (D12:495), AdminInsight STUB (D12:509), daftar "Perubahan yang diperlukan" /insight (D12:434-438) dan /skill-map (D12:467-470) | **hapus** | ya: "duplikasi peran Truth State adalah sumber reference-drift" (D12:523). Efek samping: daftar pekerjaan terbuka ikut hilang dari spec |
| 22 | Bagian 21: `-Critical Thinking … (rename dari Analitis)`, `-Adaptability … Masih perlu mapping` → mapping baru (D12:531-536) | ubah | ya (25.4) |
| 23 | Bagian 24 item 4: framing "…orang-orang dari pesantren seperti kamu" (D12:540) → pointer ke 25.2 (D12:541) | ubah (copy dikeluarkan) | ya |
| 24 | 25.2: `-Framing … "7 dari 10 … tidak bisa membaca"`, `-38.49% buta huruf (Kemenag/MUI)`, `-Atribusi … dikutip MUI dan Kemenag` (D12:549-557) → IIQ-only + LARANGAN (D12:561-578) | ubah makna (koreksi atribusi) | ya (D12:572-576) |

### A2. v2 (11 Jun) → v3 (13 Jun)

| # | Kutipan DIFF (baris) | Jenis | Alasan tertulis? |
|---|---|---|---|
| 25 | `+Bagian 4.1b — WORLDVIEW SPINE … (restorasi 13 Jun 2026)` (D23:6-39) | tambah (pemulihan) | ya: "audit 13 Jun: An-Nur, kefakihan, muyassar, orientasi-akhirat, tashfiyah/tarbiyah = 0x" (D23:8). Ini pengakuan tertulis bahwa v1/v2 sudah kehilangan tulang punggung worldview |
| 26 | `-Data kunci: Indonesia 2030 … 68 juta Gen Z`, `-HEADLINE … SUBHEADLINE … NARASI PEMBUKA (Draft Grok)`, `-CTA kandidat` (D23:45-61) | hapus (pindah ke /insight) | ya (D23:69). Sisa lama tetap di V3:153, 957-959, 1303-1334, 1544 → kontradiksi |
| 27 | `-Thread Ust. Hilman … QS Al-Hashr 19 … "Kenapa mengenal diri dimulai dari mengenal Allah"` (D23:63-66) | **hapus** | **tidak** ada alasan tertulis. V3:764 (thread map) masih mencantumkannya untuk Mukadimah |
| 28 | `-Thread … QS Al-Anfal 60 (siapkan kekuatan) + Hadith Ma'adin` → `+kuasai kekuatan modern … Hadith Ma'adin DIPINDAH ke Mukadimah Worldview` (D23:86-87) | ubah makna + pindah | ya (Raihan [1035]). Namun copy final Mukadimah (V3:231-237) dan Lapis dalam (V3:241) **tidak memuat Ma'adin**; Ma'adin hanya ada di tabel dapur 4.1b (V3:204). Efek: pindah ke tempat yang tak menampilkannya |
| 29 | Thread map Action Plan diubah (D23:91-92) | ubah | ya |
| 30 | Tabel dalil 19.8: Ma'adin "DIPINDAH … 🔲 takhrij", Al-Anfal "parafrase longgar; 🔲 perlu terjemah Kemenag" (D23:96-99) | ubah (menurunkan status jadi belum terverifikasi) | ya |

**Jumlah butir A: 30** (v1→v2: 24; v2→v3: 6). Hapus 4 (no. 4, 21, 26, 27), lemahkan 2 (no. 5, 7), pindah 6 (3, 8, 18, 19, 23, 28 sebagian), ubah/ubah makna 12, tambah 6. Penghapusan tanpa alasan tertulis: no. 20 (Al-Hashr 19 closing) dan no. 27 (Al-Hashr 19 Mukadimah).

### A3. Pelanggaran prinsip dok oleh dok itu sendiri (di luar DIFF, tampak di V3)

Prinsip V3:25 melarang append-as-new-section. Kenyataannya:
- Header V3:5 masih "Version 2.0 | 11 Juni 2026" pada berkas v3.
- Penutup dok ada di V3:909 ("Dokumen ini dibuat 7 Juni 2026"), lalu Bagian 11B, 18–26 tetap ter-append setelahnya (V3:913-1639).
- Pelacak copy Bagian 15 (V3:831-859) masih 🔲 untuk butir yang di bagian lain berstatus LIVE (mis. narasi syukur V3:328 vs V3:837; NACE V3:418 vs V3:842; bridge questions V3:547 vs V3:847).
- Mukadimah: tiga versi bertentangan (V3:224-241 worldview; V3:957-959 "Copy yang Sudah Final" bonus demografi; Prompt Lovable 2 V3:1303-1334 bonus demografi; target /insight V3:1544).
- Kartu 4 UMKM "framing masih dalam iterasi" (V3:284-287) vs "DATA DIKUNCI 8 Jun: 7,4% syariah" (V3:1360, 1425).
- JourneyBar "belum dibangun" (V3:177) vs "sudah ada di kode … 3 steps" (V3:1269).
- Thread map "Copy per titik: 🔲 Semua belum" (V3:776) vs copy Hud 61 dan Hujurat 13 E+F (V3:485-492).
Kesimpulan: dok yang mendiagnosis reference-drift (V3:25) masih memuatnya; pembaca baru tidak bisa tahu baris mana yang berlaku.

---

## B. Arahan Raihan yang tidak tertangkap atau melemah di v3

Tolok ukur: arahan sampai ±13 Jun (tanggal v3). Arahan sesudahnya ditandai "di luar jendela" dan tidak dihitung sebagai kegagalan v3. Pencarian V3 memakai `grep -niE '<pola>' V3`.

| # | Arahan Raihan (kutipan persis, berkas topik) | Apa kata V3 | Status |
|---|---|---|---|
| B1 | [446] 04-24 «Apa tak terpikir untuk memanfaatkan data luas yang bisa diakses Gemini? Untuk memanfaatkan strength-nya di akses ke data Google yang bisa fetch virtually anything tentang suatu daerah/provinsi? ‖ Juga lainnya seperti problem sosial, arah pembangunan yang bisa di-match ke profil, dlsb.?» (T/inti-mesin:50) | 8.4 empat baris: "AI (Gemini) web search data kebutuhan lokal … RAG dari province_contexts … Output: data lokal yang segar" (V3:620-628). Tidak ada problem sosial, arah pembangunan, atau match ke profil | **lemah** |
| B2 | [901] 06-06 «Kemudian, baru ke hyperlocal di Provinsi atau Kota, di sini ada AI prompting, mereka isi dan nanti muncul data dari web search dan RAG.» (T/inti-mesin:121) | Tertangkap sebagai arah di V3:166, 620-625; loading/result 🔲 (V3:627-628), prioritas "🟢 Rendah" (V3:850) | tertangkap, **diturunkan prioritasnya** |
| B3 | [1031] 06-12 «Hanya saja, bagaimana desain AI-nya agar benar-benar data yang di-fetch itu nanti kaya, up-to-date, dan relevan.»; [1032] 06-12 «Seingat saya 38 entri sudah terisi penuh, tapi juga perlu dicek lagi, bukan hanya keberadaannya, tapi reliabilitas/aktualitasnya.» (T/inti-mesin:133-134) | Tidak ada desain fetch, tidak ada cek reliabilitas 38 entri. Pola `reliab|aktual|38` → hanya L624 menyebut province_contexts | **tidak ada** |
| B4 | [1032] 06-12 «apa tidak bagusnya justru di bagian yang SDGs dst. itu? Jadi semakin lokal begitu kan? Resolusinya bergerak jadi semakin jelas dan vivid.» (T/inti-mesin:134) | Transisi SDG→Indonesia ada (V3:526-527) tetapi tanpa lapis provinsi; hyperlocal ditaruh sesudah 6 klaster (V3:166) | **lemah** |
| B5 | [1033] 06-12 «mungkin bisa tambahkan juga layer terakhir untuk fetch data real time tersebut? … Kita juga pernah membahas tentang memberikan prompt pada user yang bisa mereka gunakan sendiri ke Gemini, untuk mereka search sendiri dengan model LLM yang lebih bagus atau bahkan deep research.» (T/inti-mesin:135); juga [880] 06-03 «mungkin ada fungsi di web kita, tapi juga di-share promptnya untuk dideploy sendiri dengan LLM Model yang lebih tinggi» | Pola `prompt.*(user|pengguna)|deep research|LLM` → 0 hit. Lapisan real-time tidak ada | **tidak ada** |
| B6 | [788] 05-31 «data Jabar kok tidak mencakup growing opportunities dst. yang sudah dirisetkan, dan malah soal pengangguran saja dan yg tidak actionable?» (T/inti-mesin:100) | Pola `peluang (daerah|lokal)|growing opportunit` → 0. Jabar hanya disebut sebagai section lama yang disembunyikan di Data Lanjutan (V3:1583) | **tidak ada** (peluang daerah) |
| B7 | [772] 05-29 «Saya rasa kita perlu benar-benar perkuat lagi di local context juga. Juga kita hubungkan dengan data-data tentang program-program pemerintah.»; [790] 05-31 «Soal programs pemerintah yang katanya mau jadi page program juga mana?» (T/inti-mesin:93, 101) | Pola `program pemerintah|program-program pemerintah|programs pemerintah|Prakerja|MBKM` → 0 hit | **tidak ada** |
| B8 | [772] 05-29 «kita harus memfasilitasi mereka bukan hanya untuk mengenal diri dan lingkungan, tapi juga bagaimana menghimpun itu jadi narasi, lalu mengakomodasi eksplorasi diri mereka, hingga mereka mandiri. Itu landasan dari platform Sulu ini.» | Pola `CL BK|kemandirian|Kurikulum Merdeka` → hanya V3:1433 (CL Kurikulum Merdeka sebagai usulan Gemini, 🔲 belum diputuskan). Landasan yang Raihan sebut "landasan platform" tidak masuk Bagian 1 | **tidak ada sebagai landasan** |
| B9 | [876] 06-03 «Kemudian, saya rasa dia kurang satu hal juga: cara mempelajari skillnya. Apa berhenti di tahu saja? Kan itu tidak berguna.» (T/keterampilan:15) | Pola `cara (mempelajari|melatih|belajar)|caraMelatih|microcredential` → 1 hit, V3:1147 (daftar langkah Pak Evan). 7.3 hanya "Skills ini tidak harus dikuasai sekarang" (V3:442) | **tidak ada** (kemudian dibangun di kode Juli: `caraMelatih` 24 hit di `src/data/skillMapContent.ts`, tanpa jejak di arch doc) |
| B10 | [876] 06-03 «Lalu, saya juga berencana menambah fitur journaling di sepanjang perjalanan Sulu ini.»; ringkasan topik: "journaling sepanjang jalan dirangkum dan dicocokkan ke fardu kifayah daerah"; [903] 06-06 «mereka nanti bisa terus revisit Sulu, menambahkan catatan-catatan jadi semisal journaling begitu» | Pola `journal` → hanya Phase 2A (V3:339, 358-359, 885). Pola `revisit` → 0. Summary (V3:737-750) tidak mencocokkan apa pun ke kebutuhan daerah | **lemah** (journaling dipersempit ke 2A; pencocokan ke daerah tidak ada) |
| B11 | [879] 06-03 «Tidak diminta input per skill juga, lelah sekali. Cukup muncul pertanyaan tersebut (yang sudah punya apa saja), lalu mereka klik-klik.» (T/keterampilan:16) | 7.3 menetapkan "Format self-assessment: 3-level NON-EVALUATIF" per kompetensi (V3:422-425) | **ubah makna** (kebalikan arahan) |
| B12 | [441] 05-05 «Kalau tidak salah saya sudah minta untuk flag ketika ada hasil AI. Mengapa tidak muncul di Layer 1, ya?» (T/inti-mesin:70) | Pola `AI-generated|flag.*AI|penanda|label AI|hasil AI` → V3:28 (flag 🔲 dokumen) dan V3:740 ("BUKAN AI-generated"). Tidak ada aturan penanda keluaran AI untuk hyperlocal atau fitur AI lain | **tidak ada** |
| B13 | [901] 06-06 rangkuman akhir tanpa AI (ringkasan topik: "rangkuman akhir tanpa AI") | V3:740 "Inventory semua jawaban … (BUKAN AI-generated)" | tertangkap |
| B14 | [904] 06-06 «Lewat kisah Zaid, remaja diminta mencari tahu dengan bertanya pada orang-orang terdekat mereka soal dirinya, seperti orang tua, guru, dan sosok-sosok yang dekat dan bisa menilainya.»; [955] 06-08 «Kok penekanannya tidak ada?» (T/kenali-diri:66, 68) | 6.4 "Tanyakan Orang Terdekatmu" + Abu Mahdzurah (V3:364-374), data persist (V3:811) | tertangkap (copy 🔲) |
| B15 | [969] 06-09 «Pengalaman-pengalaman seperti organisasi, volunteering, dst. juga kan penting.» (T/kenali-diri:75) | Pola `organisasi|volunteer` → V3:39 (organisasi IOU) dan V3:1148 (daftar Pak Evan). Tidak ada di inventori 2A | **tidak ada** di inventori |
| B16 | [975] 06-09 «bagaimana kalau ternyata mereka selama ini mengikuti tokoh yang menyimpang dan tidak sadar?» (T/kenali-diri:78); [968] 06-09 «Apalagi figur spiritual atau pengalaman keagamaan, ini berpotensi jadi sufi-sufi gitu gak sih?» | Domain 1 intent masih "guru/kiai yang diikuti" dan "secure base spiritual" (V3:344) | **bertentangan** (spec mempertahankan yang ditolak) |
| B17 | [836] 06-01 «Yakin kita posisikan diri sebagai bimbingan karier? Bagaimana itu pertanggungjawabannya? Mana prinsip no overclaimnya?»; [857] 06-02 «platform eksplorasi jalur kontribusi untuk anak muda Muslim Indonesia.» (T/inti-mesin:105, 111) | V3:42 "Sulu adalah platform eksplorasi karier"; V3:51 "Asisten kognitif asinkronus". Pola `jalur kontribusi` → 0 di Bagian 1 (hanya V3:305 terkait Bu Evi tidak relevan; V3:42 hit untuk "eksplorasi karier") | **lemah / ubah makna** (positioning kembali ke "eksplorasi karier") |
| B18 | [263] 04-20 «Ingat juga, jangan sampai ada kesan overclaim soal Sulu atau IOU-nya.»; [378] 04-23 «Kita tak berusaha hard-sell IOU di sini.»; [320] 04-14 «Saya tidak mau overclaim ia sebagai instrumen atau alat pemetaan.» | Prinsip 3 No Overclaim (V3:70-73) dipersempit ke klaim IQ/EF dan metakognisi. "tanpa hard-sell" hanya di Kartu 4 (V3:1365). Positioning "bukan alat pemetaan" tidak eksplisit | **lemah** (prinsip ada, cakupan menyempit) |
| B19 | [898] 06-05 «Saya juga tak pernah menyetujui penggunaan maqashid di sini kok; dari face validity saja sudah terlalu jauh kelihatannya.» (T/dalil-akidah:36) | "❌ Maqasid al-Shariah sebagai framework desain user-facing (Raihan konfirmasi eksplisit)" (V3:878) | tertangkap. Catatan: [255] 04-20 masih menyebut «internalization of maqashid sharia» untuk keterampilan menerjemahkan nas; V3 menolak tanpa mencatat batas "user-facing vs internal" secara utuh |
| B20 | [784] 05-30 «intinya career choices yang nontradisional dan menjadi possible di era ini (jangan masukkan influencer TikTok atau semacamnya yang tidak islami!)» (T/inti-mesin:99) | Pola `profesi|karier baru|nontradisional|jalan baru|belum ada sebelumnya` → 4 hit tak relevan (V3:284, 436, 533, 1105) | **tidak ada** |
| B21 | [255] 04-20 «Sustainability must be brought to the local level, dan kemandirian di tiap bidang on a micro-level (RT, RW, Desa for example) … Skills to translate the nushush of the din … into local initiatives, will be diamonds in the rough.» (T/inti-mesin:28) | Pola `kepala desa|local leader|pemimpin lokal` → V3:214 (satu baris telos), kartu kepala desa (V3:271-275). "Inisiatif lokal"/RT-RW-Desa → 0 | **lemah** |
| B22 | [632] 05-11 «Kita juga perlu jadi leader, tapi bukan leader as in presidents; but local leaders …»; [633] «Kita perlu jadi suar-suar, dan sulu-sulu, di tempat kita berpijak masing-masing.» | V3:214 + copy Mukadimah "cukup menjadi cahaya di tempatmu sendiri" (V3:237) | tertangkap (dipadatkan) |
| B23 | [780] 05-30 «Saya rasa kita perlu jadi platform yang juga membedah term-term yang sedang beredar dalam hal ekonomi dan ketenagakerjaan dan relevansinya terhadap audiens.» (T/tampilan-alur:95) | Glosarium "hidden by default" untuk BK/ortu (V3:308-314, 1585) | **lemah** (disembunyikan, tanpa syarah/konsekuensi/navigasi) |
| B24 | [304] 04-21 «sebelum feed ke AI, ada semacam "enkripsi" sederhana dulu, misal nama diganti nomor» (T/inti-mesin:34) | Pola `pseudonim|enkripsi` → 0 | **tidak ada** (kode punya `supabase/functions/_shared/samaran.ts`, dibangun Nov) |
| B25 | [1060] 06-13 «Apa itu semua bisa di-revamp untuk arsitektur baru kita?» (chatbot karier, data provinsi); [1063] 06-13 rancang penempatan chatbot | Pola `chatbot` → 0 | **tidak ada** (hari yang sama dengan v3; batas jendela) |
| B26 | [1011] 06-11 «kalau tidak salah akan membawakan SGGs dari Bappenas or something juga.» | V3:524 Bappenas hanya sebagai jangkar deskripsi per-SDG yang masih 🔲 | **lemah** |
| B27 | [1062] 06-13 «Isian provinsi saat login pun bisa jadi driver untuk menampilkan data provinsi yang sesuai di page yang relevan.» | Provinsi hanya diisi di 8.4 (V3:622); auth flow 4.1 tanpa provinsi (V3:183-187) | **tidak ada** (batas jendela) |
| B28 | [1035] 06-12 «Jadi, memaksimalkan potensi itu hanya bisa jika dibarengi kefakihan dalam beragama.» | Kefakihan di 4.1b (V3:206); Ma'adin dipindah ke Mukadimah tetapi tidak tampil di copy (lihat A no. 28) | tertangkap di dapur, **lemah** di permukaan |

Arahan yang tertangkap utuh dan perlu dicatat sebagai bukti v3 tidak sepenuhnya mengencerkan: [981] syukur aditif (V3:383), [1009]/[1020] kelompok rentan dan riqab (V3:572, 610), [1018] SDG strong-why (V3:494-520), [1046]/[1047] Adab Nabawi dan anti feel-good (V3:216-222), [907] Al-Qawiyy Al-Amin payung, coping, CV (V3:402, 980, 1008), [616] agregator instrumen (V3:65-68), [903] isti'anah (V3:727).

Di luar jendela (setelah v3, tidak dihitung): [1104] 06-16 notebook dan paspor, [1078] 06-14 ringkasan surat/PDF, [1169] 06-29 horizon profesi, [1413] 07-08 «bagaimana Sulu bukan hanya mengarahkan ke taksonomi/jalan-jalan karir yang sudah ada, tapi juga mendorong mereka kreatif mencari atau membuat sesuatu yang belum ada sebelumnya.»

**Jumlah butir B: 28** (tidak ada 12, lemah 10, ubah makna/bertentangan 3, tertangkap 3 sebagai kontrol).

---

## C. Arch doc v3 lawan aplikasi tayang (origin/main 6dea505)

| # | Bagian V3 (baris) | Status | Bukti kode |
|---|---|---|---|
| 1 | JourneyBar 5 tahap (V3:177, 1267-1299) | dibangun | `src/components/JourneyBar.tsx:21` ("Kenali Jalan Baktimu"), `:75,99` ("Segera hadir") |
| 2 | Mukadimah Worldview + "Lihat dasar Qur'annya" (V3:224-241) | dibangun | `src/data/mukadimahContent.ts:11` |
| 3 | 4 Kartu Penampar primer (V3:261-290, 1552-1557) | dibangun berbeda | `src/components/MismatchMukadimah.tsx:5,15`; /insight kini 4 babak (Insight Rebuild Manifest:20-28) |
| 4 | Pak Evan Insights (V3:292-299, 1039-1197) | dibangun | `src/data/insightContent.ts:701-710` (4 pilar, roadmap); W1 Manifest:101 |
| 5 | Bu Evi Insights di /insight (V3:301-306) | dibangun berbeda (di /compass) | `src/data/compassContent.ts:99,141`; pola `Bu Evi` tidak ada di `Insight.tsx` |
| 6 | Data Lanjutan + Glosarium hidden toggle (V3:308-314, 1573-1585) | dibangun berbeda | `src/components/DataMendalam.tsx:28` (dipindah ke tab Data Pusat Rujukan); route `/glossary`, `/data` di `src/App.tsx` |
| 7 | Persona switcher 25.1 (V3:1446-1478) | dibangun berbeda (chip inline, bukan dropdown+floating) | Insight Rebuild Manifest:97-101; HANDOFF JalanBakti:62 (persona dipaksa siswa) |
| 8 | Narasi syukur + 4 domain Tafakkur Journaling (V3:328-360) | dibangun | `src/pages/KenaliDirimu.tsx`, `src/data/kenaliDirimuContent.ts` |
| 9 | CV Achievement Log "Catatan Perjalananmu" (V3:1008-1014) | dibangun | `src/data/kenaliDirimuContent.ts:153-154`; `KenaliDirimu.tsx:236-240` |
| 10 | Tanyakan Orang Terdekat + Abu Mahdzurah (V3:362-374) | dibangun | `kenaliDirimuContent.ts:189-191` (zaid); W1 Manifest:136-137 |
| 11 | NACE 7 + Skill Reflection (V3:418-447) | dibangun | `src/pages/KenaliDirimuSkill.tsx`; W1 Manifest:163-165 |
| 12 | OECD 3 Transformative Competencies (V3:407-416) | sebagian (hanya disebut) | `src/components/SetelahPeta.tsx:25`; pola `Creating New Value|Reconciling` → 0 |
| 13 | Al-Amanah 3 dimensi (V3:449-462) | tidak dibangun | pola `Integritas.*Pelaksanaan|Skala Amanah` → 0 (hit `Kebajikan` hanya terjemah ayat) |
| 14 | Islamic Growth Mindset, teks wajib (V3:1018-1025) | tidak dibangun | pola `التصبر|dengan berlatih sabar|bitTahallum` → 0 |
| 15 | SDGs strong-why + chips (V3:488-529) | dibangun | `src/data/jalanBaktiContent.ts:48,70` |
| 16 | 6 Klaster + bridge + 19 sub-tantangan (V3:531-590) | dibangun berbeda (7 klaster, copy ditulis ulang) | Landasan Induk:66 (K7), :88-93 (exemplar copy baru) |
| 17 | Lensa Kepedulian 8 ashnaf + PPKS (V3:592-618) | dibangun | `jalanBaktiContent.ts:215,223-236` |
| 18 | Hyperlocal AI (V3:620-628) | sebagian | `src/services/api.ts:309` membaca `province_contexts` statis; `src/components/PetaMedan.tsx:20,96` lapis provinsi "SENGAJA belum aktif"; `jalanBaktiContent.ts:181`. Pola `google_search|googleSearch|web search|hyperlocal|gali lebih dekat` → 0 (satu hit `grounding` di `macroContext.ts:1` untuk narasi Layer 3, bukan web search) |
| 19 | Refleksi bebas + 4 Pertanyaan Pak Dillo (V3:630-644) | tidak dibangun (pernah dibangun lalu dihapus) | pola `kekuatanku|yang aku sukai|perlu kukembangkan` → 0; `jalanBaktiContent.ts:321` "menggantikan closing 4Q lama"; Landasan Induk:69 |
| 20 | Pak Dillo Triangle di Sintesis (V3:650-659) | dibangun (+ Tenunan AI, tambahan di luar V3) | `src/data/sintesisContent.ts:19,46`; `src/components/TenunSintesis.tsx` |
| 21 | Ust. Hilman Closing fardhu ain→kifayah (V3:661-671) | dibangun | `sintesisContent.ts:65` |
| 22 | Rencana Aksi 10 field (V3:694-713) | dibangun berbeda (form 3 gerak) | W1 Manifest:222; `src/pages/RencanaAksi.tsx` |
| 23 | Doa Musa + isti'anah + mikro-magang (V3:715-735) | dibangun | `src/data/rencanaAksiContent.ts:80-81`; `RencanaAksi.tsx:311-314` |
| 24 | Summary Page 9:16 + share WA (V3:737-754) | dibangun berbeda (Surat Perjalanan; tombol WA ke ortu disembunyikan) | `src/data/ringkasanContent.ts:5`; `src/lib/suratPerjalanan.ts:2`; `src/data/flags.ts:21` |
| 25 | Coping FAQ organik (V3:980-1004) | tidak dibangun | pola `coping|faq` → 0 (selain biner jpg) |
| 26 | Akhwat framing QS Ali Imran 36 (V3:790-802) | tidak dibangun | pola `Ali Imran.?36|perempuan muda|akhwat` → hanya nomor WA EduAdvisor (`src/lib/constants.ts:2`) |
| 27 | UI micro-copy (V3:780-786) | tidak diperiksa (kecuali label JourneyBar, lihat no. 1) | — |
| 28 | Admin/edit panel (V3:1421) | tidak dibangun | `src/pages/AdminInsight.tsx:7` "kept as a stub"; `src/lib/insightContentStore.ts:1` "Legacy stub" |
| 29 | Gamification Skill Tree (V3:1423, 1505-1518) | dibangun berbeda (garis relasi berbasis bukti, bukan pohon RPG) | `src/data/dapurPetaContent.ts:9,253`; `CONNECTION_BASIS` di `skillMapContent.ts` |
| 30 | Data Persistence ke Supabase per jawaban (V3:141-143, 806-823) | sebagian (banyak di localStorage) | `KenaliDirimu.tsx:142` (mirror localStorage); Design Spec:15 "lenyap ke localStorage" |

**N = 30 bagian diperiksa.** Dibangun 12 (no. 1, 2, 4, 8, 9, 10, 11, 15, 17, 20, 21, 23) · dibangun berbeda 8 (3, 5, 6, 7, 16, 22, 24, 29) · sebagian 3 (12, 18, 30) · tidak dibangun 6 (13, 14, 19, 25, 26, 28) · tidak diperiksa 1 (27).

Bukti langsung bahwa v3 dipakai saat membangun: komentar kode `src/data/kenaliDirimuContent.ts:3` "Voice: kakak senior (10 Prinsip, arch 11B)" dan `:214` "Framing: arch 19.5"; HANDOFF JalanBakti:89 "`Sulu_Architecture_v3.md` — full spec. Bagian 8 = Jalan Bakti vision. Bagian 9 = Sintesis".

---

## D. Dokumen penerus: merujuk, menggantikan, atau mengabaikan?

Dasar: semua dibaca utuh (lihat Cakupan).

| Dokumen (tanggal) | Sikap terhadap V3 | Bukti | Butir V3 yang hilang lagi / diganti |
|---|---|---|---|
| Insight Rebuild Manifest (15 Jun) | **Mengabaikan.** Sumber provenance: `insightContent.ts`, deck Pak Evan, transkrip (baris 7). Tidak menyebut arch doc | :7, :20-28 | Struktur /insight V3 Bagian 5/26 (4 kartu primer + 2 tombol + toggle) diganti arc 4 babak; Bu Evi Insights tidak disebut; persona 25.1 dibuang (:99 "Buang switcher 3-arah global") |
| W1 Arc Manifest (16 Jun) | **Mengabaikan, memakai kode sebagai kebenaran.** "Ground truth = GitHub" (:6) | :6, :14-22 | Summary V3 10.4 diganti Paspor/surat (:20, :251-260); menambah growth edge (:149) di luar V3. Mengonfirmasi 2A/2B/3/4/5 sudah tayang sesuai V3 (:127-224) |
| HANDOFF JalanBakti (±29 Jun) | **Merujuk eksplisit**, lalu merombak | :89; :133-136 | Tiga taksonomi V3 (SDG/klaster/lensa) dilebur jadi corong "Dengar"; hyperlocal jadi "Pahami (AI research tool)" memperluas pola province_contexts (:135); framework sintesis = person-environment fit + doa Sulaiman (:111-117), tidak ada di V3 |
| 4-HANDOFF master (6 Jul) | **Menggantikan.** "Dokumen ini = arsitek pengganti" (:5). Tidak menyebut arch doc | :5, :7-13 | Closing 4Q dihapus (:8); 7 file paket jadi rujukan |
| Landasan Induk (7 Jul) | **Menggantikan untuk rasional; arch doc tidak masuk hierarki kebenaran** ("GitHub > Notion Current State > dokumen ini > memori", :11). Satu-satunya rujukan: "Grep arch doc/transkrip dulu" untuk dalil (:103) | :11, :103 | Summary → Proposal Diri (:46); 4Q dihapus (:69); K7 ditambah (:66); SDG diturunkan jadi "bahasa masuk" (:63). Tidak memuat: Coping FAQ, akhwat framing, Amanah 3 dimensi, Islamic Growth Mindset, admin editor, OECD 3, Bu Evi Insights, program pemerintah, prompt pengguna, penanda AI |
| World-Class Design Spec (7–8 Jul) | **Mengabaikan.** Tidak menyebut arch doc | :95-99 | Hyperlocal kembali sebagai "Gali Lebih Dekat" tetapi **diturunkan**: hipotesis untuk dicek, digerbang province schema, tanpa web search (:97-98). Ringkasan → Proposal Diri (:70-75) |
| KOMPAS (7 Jul, lampiran 27 Jul) | **Menggantikan** paket 7-file sebagai pintu masuk (:5). Tidak menyebut arch doc | :5, :66 | Provinsi hanya sebagai kolom sourcing (:66); journaling dan penanda AI tidak disebut |
| Addendum v2 (12 Jul) | **Menggantikan** Design Spec di titik konflik (:4). Tidak menyebut arch doc | :4, :18-41 | Proposal Diri jadi tulang punggung (R1); distress R6 baru |
| HANDOFF 3 Sep | **Mengabaikan.** Tidak menyebut arch doc | :15, :45-52 | R1 Proposal Diri "TIDAK DITEMUKAN … belum dikerjakan" (:15); R1–R8 menggantung sejak 27 Jul |

Butir V3 yang hilang lagi di penerus (tidak dibangun dan tidak disebut di penerus mana pun yang dibaca): Coping FAQ (V3:980), akhwat framing (V3:790), Amanah 3 dimensi (V3:449), teks Islamic Growth Mindset (V3:1018), admin editor (V3:1421), Bu Evi Insights di /insight (V3:301), OECD 3 kompetensi transformatif sebagai konten (V3:407). Hyperlocal AI (V3:620) satu-satunya yang muncul lagi, dalam bentuk lebih sempit, dan masih belum aktif di kode (PetaMedan.tsx:20).

Pola sistemik: tiap penerus menyatakan diri "pintu masuk" atau "arsitek pengganti" (4-HANDOFF:5, KOMPAS:5, Addendum:4) tanpa baris supersession untuk V3. Tidak satu pun menandai butir V3 mana yang ditarik dan mana yang tetap berlaku. Ini mengulang persis mekanisme yang V3 sendiri sebut akar watering-down (V3:25), di tingkat antar-dokumen.

---

## E. Vonis

1. **Pengenceran terbukti sebagian.** v1→v2 sebagian besar koreksi dan pemindahan dengan alasan tertulis (A no. 4, 8, 11, 16, 18, 24), bukan pengenceran. Pelemahan nyata ada pada pengeluaran teks dari spec ke build (A no. 3, 5, 7), penghapusan Current State beserta daftar pekerjaan terbukanya (A no. 21), dan dua penghapusan dalil tanpa alasan (A no. 20, 27). Bukti paling kuat bahwa pengenceran memang terjadi ada di dok itu sendiri: v3 mengaku worldview spine sempat 0x (D23:8).
2. **"Arch doc tidak terpakai" sebagian salah.** Fase 2A sampai 5 dibangun mengikuti v3 (C: 12 dibangun, 8 dibangun berbeda dari 30), kode mengutip "arch 11B" dan "arch 19.5", HANDOFF JalanBakti memakainya sebagai spec penuh. Mulai 15–16 Jun manifest berhenti merujuknya, dan sejak 6–7 Jul paket Fable menggantikannya tanpa supersession. Arch doc sendiri tidak pernah dirapikan lagi (header v3 masih "2.0", pelacak copy basi).
3. **Paling parah: lapisan daerah dan AI.** Arahan berulang sejak April ([446], [772], [788], [790], [901], [1031]–[1033], [1062]) menyusut jadi empat baris di V3:620-628 berprioritas rendah, tidak dibangun di kode (PetaMedan.tsx:20), dan di penerus turun lagi jadi "hipotesis untuk dicek" (Design Spec:97). Peringkat kedua: kontradiksi internal v3 (A3) yang membuat dok tak bisa dipakai tanpa memilih versi sendiri.

### Sepuluh butir paling berharga untuk dipulihkan

| # | Butir | Asal | Kondisi sekarang |
|---|---|---|---|
| 1 | Hyperlocal AI penuh: web search + RAG province_contexts + problem sosial + arah pembangunan + lapis real-time | [446], [901], [1031], [1033] | V3:620 tipis; kode gated (PetaMedan.tsx:20); penerus menyempitkan |
| 2 | Program pemerintah dan peluang daerah (bukan hanya pengangguran) | [772], [788], [790] | 0 di V3; 0 di kode dengan pola `program pemerintah|Prakerja` |
| 3 | Prompt siap-pakai untuk pengguna (LLM lebih kuat, deep research) | [880], [1033] | 0 di V3; jejak parsial di `supabase/functions/career-chat/index.ts:139`, `src/components/results/MyDataSection.tsx:62` |
| 4 | Penanda keluaran AI di semua fitur AI | [441] | 0 di V3; hanya di Results Spine A (`src/pages/Results.tsx:579`) |
| 5 | Journaling sepanjang jalan + revisit + pencocokan ke kebutuhan daerah | [876], [903] | V3 hanya 2A; kode punya Catatanku/Surat, pencocokan daerah tidak ada |
| 6 | Inventori skill dua pertanyaan klik, tanpa input per skill | [879] | V3:422 membalik arahan |
| 7 | Larangan prompt tokoh agama/figur spiritual di Domain 1 | [968], [975] | V3:344 masih memuatnya; copy live tidak diperiksa |
| 8 | Positioning "eksplorasi jalur kontribusi", bukan "eksplorasi karier"/bimbingan karier; no overclaim termasuk "bukan alat pemetaan" | [320], [836], [857] | V3:42 mundur ke "eksplorasi karier" |
| 9 | Karier nontradisional dan mencipta jalan baru (horizon peran) | [784]; di luar jendela [1413] | 0 di V3; `BroadenRoles` ada di kode sebagai pendekatan parsial |
| 10 | Butir V3 yang hilang di build dan penerus: Coping FAQ, Islamic Growth Mindset + Amanah 3 dimensi, akhwat framing | V3:980, 1018, 449, 790; arahan [907], [266] | Tidak dibangun (C no. 13, 14, 25, 26) |

---

## Cakupan

Dibaca utuh:
- D12 (578 baris), D23 (99), V3 (1639, dalam tiga potongan).
- D_SULU_LANDASAN_INDUK.md, D_Sulu_W1_Arc_Manifest.md, D_HANDOFF_Sulu_JalanBakti.md, L_..._Sulu_Master_Context.md, L_..._SULU_HANDOFF_25Apr2026.md, L_..._Rancangan_Narasi_Sulu_v2.docx.txt, L_..._Sulu_Insight_Rebuild_Manifest.md, L_..._4-HANDOFF-master.md, L_..._SULU_World_Class_Design_Spec.md, L_..._0-KOMPAS-...md, L_..._SULU_World_Class_Addendum_v2.md, L_..._HANDOFF_Sesi_3Sep2026_untuk_Fable.md (Master Context dan Handoff 25 Apr dibaca lewat `cat -n | cut -c1-260`; baris panjang bisa terpotong di kolom 260).
- T/keterampilan.txt, T/kenali-diri.txt, T/dalil-akidah.txt.

Dibaca sebagian:
- T/inti-mesin.txt: baris 1–154 dari 245 (sampai 06-17); sisanya sesudah jendela, tidak dibaca.
- T/tampilan-alur.txt dan T/copy-suara.txt: hanya baris bertanggal Mar–17 Jun yang lolos saring kata kunci (rangkum, journal, catatan, notebook, prompt, flag, penanda, program pemerintah, peran, overclaim, proposal, PDF, hyperlocal, provinsi, daerah, dll.), dipotong 420 karakter per baris. Baris lain tidak dibaca.

Kode: tidak dibaca utuh. Diperiksa lewat `git ls-tree`, `git grep` dengan pola yang dicantumkan di bagian C, `git show` untuk `src/App.tsx` (daftar route), `src/data/ringkasanContent.ts` (40 baris awal), `src/pages/AdminInsight.tsx` (30 baris awal). Render nyata (apakah blok provinsi Jalan Bakti tampil, isi copy Domain 1 yang tayang, micro-copy) **tidak diperiksa**.

Tidak dibaca: versi penuh v1 dan v2 (tidak tersedia), Notion (Truth State, Current State, Decisions Log), transkrip chat asal.
