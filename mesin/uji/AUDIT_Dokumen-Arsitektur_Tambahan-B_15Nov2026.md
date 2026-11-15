# AUDIT ARCH DOC SULU v3: TAMBAHAN BAGIAN B (dua berkas topik dibaca utuh)

Tanggal: 15 Nov 2026. Menutup celah audit pertama (`/home/claude/suluiou/mesin/uji/AUDIT_Dokumen-Arsitektur_v1-v3-dan-Penerus_15Nov2026.md`, Cakupan: "T/tampilan-alur.txt dan T/copy-suara.txt: hanya baris ... yang lolos saring kata kunci").

Bahan:
- T/tampilan-alur = `niat/topik/tampilan-alur_sd17Jun.txt`, T/copy-suara = `niat/topik/copy-suara_sd17Jun.txt`.
- V3 = `/mnt/user-data/uploads/MESIN/mentah/riwayat/p2/docs/D_Sulu_Architecture_v3.md`. Pencarian V3 = `grep -niE '<pola>' V3`, dan dok dibaca utuh.
- Aplikasi = `git -C /home/claude/suluiou grep -n <pola> origin/main -- src supabase`.

Jendela: mengikuti audit pertama, arahan sampai 13 Jun (tanggal v3). Arahan 14–17 Jun dihitung "di luar jendela" dan tidak dianggap kegagalan v3.

Butir yang sudah ada di bagian B audit pertama tidak diulang (B1–B28: [441], [780], [788] bagian Jabar, [790], [836], [857], [901], [904], [968] bagian figur spiritual, [975], [1062], [1063], [320], [263], [378]).

---

## B-tambahan

| # | Arahan Raihan | Apa kata V3 | Status | Aplikasi tayang |
|---|---|---|---|---|
| BT1 | [418] 04-24: "Padahal kan tidak begitu flownya. Orang mungkin mau lihat landing page dulu, membaca data, dst." (juga [419], [486], [515], dan [1066] 06-13) | Peta journey dibuka dengan `[LOGIN/REGISTER]` sebelum Mukadimah (V3:150-152). 4.1: "User membuka Sulu → pilih Google Login atau Guest ... → redirect ke Mukadimah" (V3:184-186). Login dipasang sebelum landing | **berubah makna** | Aplikasi mengikuti Raihan, bukan V3: `/`, `/mukadimah`, `/insight`, `/skill-map`, `/glossary`, `/compass` publik (`src/App.tsx:69-87`); `RequireAuth` hanya di `src/components/SpineBLayout.tsx:69` |
| BT2 | [746] 05-28: "Ini bisa jadi pre, post, sekaligus standalone. Bottomlinenya, harus robust as standalone." (juga [447], [485], [647]) | /insight hanya diposisikan sebagai Phase 1 dalam alur linear (V3:155-157, CTA Mukadimah → /insight V3:239). Pola `standalone\|berdiri sendiri` → hanya V3:1214 ("setiap phase bisa berdiri sendiri sebagai slide"), bukan syarat Insight berdiri sendiri | **melemah** | `/insight` rute publik (`src/App.tsx:83`); isi tidak diperiksa |
| BT3 | [861] 06-02: "Dia ikut journey dulu dari awal sampai akhir. Setelah itu semua, ada semacam index tree yang bisa langsung ke page-page data." (juga [860]) | Pola `index tree\|indeks\|sitemap\|peta isi` → 0. Data penuh hanya hidup di satu toggle tersembunyi di /insight (V3:254, 1573-1585), bukan halaman data yang bisa dituju dari pohon indeks | **tidak ada** | Jejak parsial: `/glossary` dan `/data → /glossary?tab=data` (`src/App.tsx:85-86`). Pohon indeks tidak diperiksa |
| BT4 | [842] 06-02: "Tidak perlu di-match ke program IOU, itu risky." | Kartu 4: "Koneksi natural ke program BBA IOU (tanpa hard-sell)" (V3:1365); "kesenjangan ekonomi Islam dan peluang BBA" (V3:1428). Kartu penampar dicocokkan ke prodi IOU tertentu | **berubah makna** | BBA ada di `src/data/compassContent.ts:155` (Kompas) dan `src/data/pathways.ts:8-13`; kartu /insight tidak diperiksa |
| BT5 | [267] 04-21: "Jadi, memahami diri sendiri itu akan meng-enhance semua pilihan yang telah dibuat, bukan merusak papan caturnya sama sekali." | "memfasilitasi MORATORIUM (eksplorasi aktif tanpa komitmen kaku)" (V3:51); prinsip 6: "eksplorasi tinggi, komitmen rendah" (V3:87). Tidak ada ruang bagi siswa yang sudah memilih; V3 justru menganjurkan komitmen rendah | **berubah makna** | Pola `moratorium\|komitmen rendah` → 0 di `src` |
| BT6 | [968] 06-09: "Kalau mau diflag, mungkin bukan bangga, tapi bermanfaat saja" | CV Achievement Log: "Apa yang pernah kamu capai atau lakukan yang membuatmu bangga, sekecil apapun?" (V3:1011). V3 mempertahankan bingkai "bangga" yang ditolak | **berubah makna** | Aplikasi mengikuti Raihan: "Catatan Perjalananmu" tanpa kata bangga (`src/data/kenaliDirimuContent.ts:153-160`) |
| BT7 | [978] 06-09: "Apa yang sudah kamu miliki saat ini? Modal apa yang bisa mendukung gerakanmu?" | 5.7 Transisi ke Phase 2: "🔲 Belum di-draft", bridge lain ("Tapi apa yang KAMU punya untuk mengisinya?") (V3:318-319). Copy dari Raihan tidak masuk | **tidak ada** | Pola `Modal apa` → 0. Mirip sebagian: `src/data/insightContent.ts:764` ("mengenal apa yang Allah titipkan padamu") |
| BT8 | [1016] 06-11: "intinya nanti ingin ada fungsi tersebut di semua teks di dalam platform, supaya mudah edit-editnya." (juga [982], [1012]) | Bagian 24 no. 1: "Admin/edit panel ... Keputusan desain UI editor belum ada" (V3:1421). Hanya satu sebutan "copy revisable via admin inline-edit" (V3:547). Keputusan Raihan (edit langsung di halaman, semua teks, tanpa dashboard) dicatat sebagai belum diputuskan | **melemah** | Pola `editable\|content_overrides\|copy_overrides\|AdminEdit\|EditCopy\|InlineEdit\|editMode` → hanya komentar "editable-ready" (`src/data/kenaliDirimuContent.ts:2`, `src/data/skillMapContent.ts:3`, `src/pages/Insight.tsx:892`). Fungsi edit tidak ditemukan |
| BT9 | [758] 05-28: "Mereka tahu posisi tiap skill itu dari sisi mana yang jadi landasan, mana yang ter-embed jadi sifat, mana yang skill teknis, lalu percabangan dari tiap skill teknis; mana yang jadi skill utama sebelum bercabang, dlsb." (juga [757]) | 25.3: "🔲 Masih perlu keputusan Raihan"; "Raihan: pertama kali tertarik ... belum ada keputusan final" (V3:1505-1518); Bagian 24 no. 2: enhancement post-MVP (V3:1423). Arahan isi (posisi dan percabangan) diturunkan jadi opsi visual | **melemah** | Ada graf: "PETA VIEW — graph: 4 lane, node berposisi deterministik, garis SVG." (`src/pages/SkillMap.tsx:208`) |
| BT10 | [874] 06-03: "Tidak apa-apa pakai Soft Skills, tapi beri disclaimer bahwa itu istilah populer saja, dan sebutkan biasanya di akademis apa istilahnya." (juga [870]) | Pola `soft skill` → 0. Deskripsi layer (V3:1390-1404) dan Jembatan Istilah (V3:1218-1236) tanpa payung soft skills | **tidak ada** | Ada entri `popular: "Soft skills", layer: "Layer 0 + Layer 1"` (`src/data/skillMapContent.ts:122`) |
| BT11 | [976] 06-09: "Harus sesuai kaidah bahasa Indonesia, misalnya tak mengawali kalimat dengan "Dan"." (juga [330], [1049]) | Aturan hanya ditulis untuk Mukadimah (V3:230). Style guide 11B (V3:933-951) tidak memuatnya. Copy di V3 sendiri melanggar: kalimat berawalan "Dan" di V3:480, 508, 966; em dash di copy V3:499, 501, 506-511, 549 | **melemah** | Pola `[.!?] Dan ` di `src/data`: `glossaryContent.ts` 2 hit, `insightContent.ts` 1 hit |
| BT12 | [1026] 06-12: "Ini paralelisme dalam copywritingnya terlalu over, malah jadi aneh; kalau ada yang bagusnya pakai pelesapan, ya lesapkan." (berkas yang sama: "Apapun" harusnya "apa pun") | Pola `paralel\|pelesapan` → 0. "apapun" di copy V3:666, 689, 1011 | **tidak ada** | "apapun" di copy: `src/data/compassContent.ts:36`, `src/data/insightContent.ts:87, 620`, `src/data/glossaryContent.ts:110, 171` |
| BT13 | [369] 04-22: "Ini kan ke sekolah Islam, jadi hilangkan ilustrasi atau foto makhluk hidup." | Pola `makhluk hidup\|ilustrasi\|foto` → 0. Konteks asal arahan: deck Suar; V3 Bagian 20 menyatakan Suar kini hidup sebagai halaman Sulu (V3:1201-1214), jadi aturan ikut pindah, tetapi tidak dicatat | **tidak ada** | tidak diperiksa |
| BT14 | [371] 04-22: "Ya, kalau bisa kurangi navy gelap, perbanyak yang terang saja; kalau benar-benar butuh gelap, pastikan kontennya kontras terang." (juga [149], [370], [636], [736]) | Pola `tema\|terang\|gelap\|warna` → tidak ada aturan tema (hit V3:231, 358 tak relevan). Arahan berulang lima kali (deck Suar dan brief), tidak ada sebagai prinsip visual | **tidak ada** | tidak diperiksa |
| BT15 | [593] 04-28: "Orang tua dan BK juga BISA mendapat laporan terpisah, karena ini butuh consent, jadi kita nyatakan ada jalannya saja, bukan sesuatu yang default." (juga [77], [489], [553]) | Pola `consent\|persetujuan\|izin orang` → 0. Hanya tombol "Bagikan ke Orang Tua/Guru" (V3:368). Tidak ada aturan consent, lead MSP, atau kolom consent admin | **tidak ada** | `parent_consent` di `src/components/admin/LeadsTable.tsx:194`, `LeadDetailDialog.tsx:180`; `src/components/results/IzinKuliahSection.tsx:2` menggantikan ParentConsentSection |
| BT16 | [460] 04-24: "Nanti kan ada 8 kelas, 4 ikhwan 4 akhwat, dan di akhir tes akan ditampilkan snapshot statistik masing-masing kelas mereka." (juga [367], [380], [381], [464], [468]) | Pola `kelas\|class` → hanya join code (V3:138, 143) dan V3:1391 (tak relevan). Pola `leads\|MSP` → 0. Admin dashboard, tampilan sesi kelas, dan statistik per kelas tidak ada di dok yang mengaku end-to-end | **tidak ada** | `AdminClassSession` (`src/App.tsx:35, 116-119`, rute `/admin/class/:classId/session`) |
| BT17 | [444] 04-24: "Coba Anda pelajari hasil seperti di 16personalities misalnya, itu "hidup" sekali. Local contextnya juga belum nampak mewujud dalam hasil." (juga [393]: lapis algoritma dulu, baru AI) | Pola `radar\|Results\|hasil asesmen\|proyeksi` → hanya V3:100 (disclaimer results page) dan V3:823 (battery "Belum (locked)"). Tidak ada spesifikasi halaman hasil asesmen, urutan algoritma → AI, atau syarat hasil hidup dan lokal | **tidak ada** | Rute `/results` dan `/hasil/:resultId` (`src/App.tsx:77-78`); isi tidak diperiksa |
| BT18 | [482] 04-25: "Jadi intinya siswa dari sekarang sudah harus bisa unduh/bagikan halaman yang dicapture ya." (juga [386], [480], [520]) | Summary "Format 9:16, bisa di-screenshot, ramah WA sharing" (V3:741). Pola `unduh\|download\|share\|Bagikan` → hanya V3:368. Tidak ada tombol unduh/bagikan hasil tangkapan, tidak ada antrean email ke DB, tidak ada catatan [520] soal orang awam | **melemah** | `src/components/results/CaptureShareButton.tsx:27`, `DownloadCardButton.tsx:24`, `src/components/ShareCard.tsx:18` (1080x1920) |
| BT19 | [789] 05-31: "Khazilmu perlu disebutkan eksplisit di kompas, khazilmu.com" | Pola `khazilmu` → 0 | **tidak ada** | Ada: `src/data/compassContent.ts:180-183`, `src/pages/Compass.tsx:409` |
| BT20 | [841] 06-02: ""Dari Ilmu ke Dampak — Mulai dari Sini."" | "Headline /insight: ... (draft)" (V3:290). Pilihan final Raihan masih berlabel draf | **melemah** | Tag `'DARI ILMU KE DAMPAK'` di `src/data/compassContent.ts:150` (Kompas, bukan headline /insight) |
| BT21 | [782] 05-30: "Sedikit note, soal Indonesia Gelap tak perlu ditampilkan di page kita nanti, itu agak sensitif, jadi soal kondisi Indonesia secara umum saja" | Pola `Indonesia Gelap` → 0. Larangan tidak tercatat, jadi tidak ada pagar untuk build | **tidak ada** | Muncul sebagai entri glosarium: `src/data/glossaryContent.ts:42, 175` (`term: "Indonesia Gelap"`). Bertentangan dengan arahan; render tidak diperiksa |
| BT22 | [1008] 06-11: "Btw, inklusivitas punya konotasi negatif." | Pola `inklusi` → 0. Larangan diksi tidak tercatat | **tidak ada** | Pola `inklusi` → 0 di `src`; hanya di migrasi `supabase/migrations/20260423094910_...sql:36, 40` (data province_contexts) |
| BT23 | [1025] 06-12: "Saya juga sempat berikan transkrip "Raihan's voice" dan didiskusikan serta disarikan prinsip-prinsip darinya, silakan grep." (juga [1024]) | Style guide copy = "Grok Style Guide Sulu (10 Prinsip)" (V3:933-951). Suara Raihan hanya disebut sebagai sumber worldview (V3:191), bukan prinsip copy | **melemah** | tidak diperiksa |
| BT24 | [745] 05-28: "Guru BK juga butuh panduan akan hal-hal yang mereka butuhkan dalam dealing with their students." | Guru BK hanya "Secondary: ... Guru BK (data lanjutan)" (V3:56); isi untuk BK = data sistemik + glosarium tersembunyi (V3:310-312). Tidak ada panduan bagi BK | **melemah** | tidak diperiksa |

---

## Tertangkap baik di V3 (kontrol, supaya adil)

| Arahan | Baris V3 |
|---|---|
| [82], [83], [863] Suar sebagai bagian pertama, hidup sebagai halaman | 1201-1214 |
| [614] Sulu diperluas jadi tempat membangun orientasi | 197 |
| [594], [840] hasil bukan rekomendasi prodi, tanpa diagnosis | 44-47, 99-100 |
| [288], [298], [691], [696] minat dan kepribadian; larang "tes bakat", "self-discovery" | 97-102 |
| [720] kefakihan (al-fahm), bukan fikih | 206 |
| [266] akhwat: tiap orang pemimpin, peran domestik juga bakti | 790-800 |
| [322] pohon QS Ibrahim sebagai akar | 75-78 |
| [332] simbol ﷺ | 608, 1021 |
| [449] info dapur tidak ke UI | 191, 1167-1171 |
| [747], [755], [917] default siswa + tombol ganti persona | 1446-1476 |
| [897], [918] empat kartu utama, data negatif lain tersembunyi | 251-254, 314, 1533-1585 |
| [916] cek Git sebelum build | 1031-1033 |
| [820], [830] prompt dari verbatim, bukan memori | 28, 1265 |
| [826] bagikan PNG 9:16 | 741 |
| [829] "Yaqazah" dibuang (tidak muncul di V3, dibaca utuh); [827], [828], [834] dijawab oleh restrukturisasi dan CTA baru | 290, 1321-1322 |
| [872], [875] Jembatan Istilah terlihat; klik tidak melompat | 1373-1386 |
| [870] terjemahan istilah ikut konvensi akademis | 80-82, 1522-1529 |
| [871] deskripsi Layer 2 dan 3 | 1398-1404 |
| [958], [959] inventori lewat tulisan, tolak picker/slider | 339 |
| [974] "ini saya banget" | 350 |
| [1009], [1010] label sumber resmi, kelompok rentan dinamai langsung, PPKS | 571-572, 600-612 |
| [1019] lensa kepedulian Opsi A | 592-594 |
| [1020] riqab tidak dilunakkan | 610 |
| [1018] SDG strong-why + pasca-2030 | 494-520 |
| [1027] sintesis: segitiga, pertanyaan 5 tahun, Ar-Ra'd 17 | 650-667 |
| [1034] glosarium di Insight | 308-312 |
| [1045], [1046] ringan di antarmuka, dalam di akar | 216-222 |
| [1049] dunia mengikuti orientasi akhirat | 208 |
| [967] tanpa em dash (hanya Mukadimah; lihat BT11) | 230 |
| [1051] hero vs Mukadimah ditandai untuk review | 228 |
| [766], [750], [951] asesmen dikunci dulu | 102, 866 |
| [708], [902], [914], [942], [943] materi Pak Evan diperkaya di Insight | 1039-1197 |
| [862] kenali dunia dulu, baru diri | 155-163 |
| [881] pertanyaan terkumpul di halaman inventori | 737-750 |
| [753] tidak terdengar AI | 917 |
| [400] login alternatif nama + WA | 128, 136 |
| [514] kode kelas opsional | 187 |
| [845], [848], [859] data terverifikasi, bahasa lembaga (Kemenkes) | 263, 277-281 |
| [850] kepala desa dan brain drain | 271-275 |
| [374] NEET 19,44% | 1250 |
| [373] angka literasi Qur'an bersumber | 1482-1501 |
| [756] waitlist dipertahankan | 1595, 1614 |
| [869] Mukadimah sebagai narasi pembuka | 224-241 |
| [402] instrumen tervalidasi, terminologi tidak diganti | 65-68, 80-81 |
| [838], [864], [865], [996], [997] 4C/CL BK pending; Pak Dillo; Phase 2B | 1433; 630-659, 1218-1236; 393-447 |
| [936] format kartu: judul emosional + data + framing peluang | 289 |
| [977] copy syukur 2A diserahkan ke build (LIVE) | 335 |

---

## Hitungan

Satuan hitung = nomor [N] unik dari dua berkas (overlap antar-berkas dihitung sekali). [N] yang punya beberapa bagian masuk kelompok BT bila satu bagiannya menjadi BT.

| Kelompok | Jumlah [N] |
|---|---|
| [N] unik di dua berkas | 272 |
| Di luar jendela (14–17 Jun) | 23 |
| Diperiksa dalam jendela | 249 |
| Masuk BT (utama + pendukung) | 53 |
| Tertangkap baik | 75 |
| Sudah tercakup bagian B audit pertama | 14 |
| Tidak bisa dinilai tanpa menebak ([785] CTA → LP → situs IOU vs "CTA → /programs" V3:174; [950] sign-off Bu Evi: tidak jelas sign-off yang mana) | 2 |
| Dilewati: bukan Sulu (deck rekrutmen LM, deck staf/Manifesto, brief IOU Fair/Ust. Hilman, webinar, spreadsheet Mbak Eli, peran IOU di sekolah), bug sesaat (login macet, counter, refresh), perintah proses sesi, arahan yang digantikan Raihan sendiri ([16], [287], [819]) | 105 |

Baris BT: **24**. Per status: **tidak ada 12** (BT3, 7, 10, 12, 13, 14, 15, 16, 17, 19, 21, 22) · **melemah 8** (BT2, 8, 9, 11, 18, 20, 23, 24) · **berubah makna 4** (BT1, 4, 5, 6).

Catatan pola: pada empat butir (BT1, BT6, BT18, BT19) aplikasi tayang sudah mengikuti arahan Raihan, sedangkan V3 tidak atau bertentangan. Dok tertinggal dari kode, bukan kode dari dok. Pada BT4 dan BT21 bahaya tetap terbuka: V3 menyuruh mencocokkan kartu ke BBA, dan kode memuat istilah "Indonesia Gelap" yang Raihan minta tidak ditampilkan.

Di luar jendela (tidak dihitung, tetapi relevan untuk penerus V3): [1067] header login, [1069] login jangan langsung ke Kenali Dirimu, [1078]/[1079] struktur Insight 4 babak + anchor + catatan, [1080] siswa-first, chip ortu/BK, [1100]/[1101]/[1103] header dapur, narasi robotik, hapus alumni, [1104] notebook mengambang + paspor akhir, [1106] tab view menggantikan accordion, [1109]/[1115]/[1118] layout interlatent (nav kiri, notebook kanan), [1110] judul penampar lugas, konteks Covid.

---

## Cakupan

- T/tampilan-alur: baris 1–166 dari 166 (Read offset 1 dan 135). Utuh.
- T/copy-suara: baris 1–140 dari 140. Utuh.
- V3: baris 1–1639 dari 1639 (Read 1–420, 420–899, 900–1269, 1270–1639). Utuh.
- Audit pertama: bagian A3 (64–77), B (78–117), E dan Cakupan (184–220).
- Aplikasi (origin/main): `git grep` dengan pola yang dicantumkan per baris; `git show` untuk `src/App.tsx` (daftar rute, baris 41-134) dan `src/data/kenaliDirimuContent.ts` (baris 150-165). Render nyata dan isi halaman /insight, /results tidak diperiksa.

> Catatan sesi mesin (15 Nov 2026 17.17 WIB): SINTESIS auditor kedua (subagen Opus), membaca utuh dua berkas arahan (306 baris) dan arch doc v3 (1.639 baris). Kutipan utama 24 baris dicocokkan skrip: 24 dari 24 cocok huruf demi huruf dengan arsip. Cek silang: istilah "Indonesia Gelap" memang ada di src/data/glossaryContent.ts:175 pada cabang utama.
