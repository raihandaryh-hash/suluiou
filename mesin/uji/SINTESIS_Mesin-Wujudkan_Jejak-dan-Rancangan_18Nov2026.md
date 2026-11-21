# SINTESIS · Mesin "Wujudkan": dari proposal ke rencana meraihnya · 18 Nov 2026

Asal: SINTESIS sesi mesin (SESI-11NOV-SULU-MESIN, https://claude.ai/code/session_01JZPjjr3cEST9SPkxZSaHrr) atas arahan Raihan 18 Nov 16.08 dan 16.19. Bahan: repo Otak @430412d (catatan rak kerja saja), riwayat chat, repo suluiou `main`, dokumen mesin. Untuk ditinjau Chief Sulu **sejak awal**, karena bagian ini sudah dirancang berkali-kali sejak Juni.

## 0. Arahan Raihan (kutipan persis, 18 Nov)

- 16.08: "zaman sekarang itu bukan job/profession-based utamanya, tapi justru problem-solution based. Jadi, bukan "mau jadi apa", tapi "mau bikin/bangun apa". Lalu, stack keterampilan dst. itu akan ngikut ke sana."
- 16.19: "setelah user merancang problem statement atau proposalnya, dia bisa dibimbing untuk meraih itu sejak sekarang, dengan merancang plan, apa saja yang harus dipelajari, dst., dengan memanfaatkan AI." · "Ini justru fitur yang paling "mahal", on how to assist people to fulfill their life purpose."
- 15.47 (berlaku di sini): siswa diberi "kapabilitas full"; medan boleh lebih dari satu.

## 1. Jejak: yang sudah pernah dirancang (bersumber)

| # | Rancangan | Asal | Isi yang relevan |
|---|---|---|---|
| J1 | Diskusi Pak Evan 3 Jun 2026 | chat 8349d722 g54 (kiriman Raihan) | "Tools yang akan menemani seseorang di perjalanan career developmentnya untuk bisa sukses di dunia dan akhirat"; "Mereka ada di mana sekarang, lalu kita bawa ke tempat mereka bisa sukses"; "State dan stage hidup (latarkabunna thabaqan 'an thabaq)"; "Membantu eksplorasi diri dan menata diri dan plan hidup menuju sukses"; "Jadi kita temen ngobrolmu. Seperti coach"; "umur SMA itu jangan dibatasi, tapi diperluas khazanah eksplorasinya" |
| J2 | Langkah konkret Pak Evan untuk Fase 5 | Otak `sulu/ce2232e09b660342.md` (Arsitektur v3) §19.6–19.7 | Roadmap Kenali → Sesuaikan → Bertindak → Mandiri; pilih 1–2 skill inti, microcredential, pengalaman nyata (magang, proyek, volunteer), portofolio sejak dini, jaringan dan adab |
| J3 | Purpose Statement | Otak `notion-halaman/…372a…` (Build Order Jun) ITEM 5 | "Di [provinsi], aku ingin membantu [masalah] dengan cara [kelebihan dari refleksiku]"; dasar Yeager 2014 + Damon |
| J4 | Divergen dulu, konvergen kemudian; Possible Selves wajib dengan strategi | Otak `notion-halaman/…3a4a…` (DS-C-3 Stanford) A+++ dan A++++ | Odyssey lewat Oyserman (RCT remaja, efek 2 tahun) hanya bekerja bila tiap diri-yang-mungkin punya strategi yang masuk akal; Proposal Diri = wadah, bukan metode; landasan Savickas + Krumboltz (PHLT) |
| J5 | Spine pengalaman | chat e764b22b (Sulu Start) J02 | Peta Perjalanan + Benang Journaling berkategori + Paspor/Proposal Diri |
| J6 | Mesin inovasi dan solusi | `ARAH_Mesin-Inovasi-Sulu…v0.5_16Nov2026.md` §13; chat Chief 627adaf2 §5 | Buka → Lapangan → Perjelas → Arah → Pihak → Rancang → Uji kecil dan kembali → Sambung. R8 "innovation and solution engine yang robust, scalable, engineering creativity, dan grounded" |
| J7 | Pendampingan manusia | Otak (Flywheel LM×Sulu, Master Tasks "fitur pendampingan siswa", Manifes v2.1) | Jembatan Manusia, Kakak Pembimbing, loop H+7/H+30; pengukuran career maturity pre/post + follow-through (Landasan Induk #15) |
| J8 | Portofolio dan pencatatan capaian | Otak `riset-pendidikan/daf48f7bf5d58d1f.md` | "Mesin Pembangun Portofolio Portabel"; achievement logging untuk siswa SES rendah |
| J9 | Rencana Aksi tayang | `src/data/rencanaAksiContent.ts` | Bila-maka, pendamping, niat, doa; Surat Perjalanan tanpa model |

Yang **tidak** ditemukan (cari: "learning path", "jalur belajar", "rencana belajar", "dari nol", "bikin apa", "bangun apa", "roadmap belajar", "kurikulum pribadi" di Otak rak kerja dan riwayat chat): rancangan bagian **sesudah** proposal yang menurunkan solusi menjadi cabang bidang dan rencana belajar bertahap dengan AI. Rancangan berhenti di "Rancang" (J6 langkah 5), "Jalur kembali" (J6 f), dan Rencana Aksi 30 hari (J9). Tinjauan Fable 18 Nov §3.11 mencatat hal yang sama: rencana tanpa hari ke-30, tanpa Rencana B.

## 2. Yang hilang di tayang

- Poros "mau bangun apa" belum ada; Nyalakan peran masih berporos jabatan (tinjauan Fable C2, C3).
- Sesudah Rencana Aksi tidak ada kelanjutan: tidak ada rencana belajar, tidak ada cabang bidang, tidak ada tahap hidup (J1 "thabaqan 'an thabaq"), tidak ada kembali.
- AI tidak pernah dipakai sebagai coach rencana, padahal J1 memintanya.

## 3. Usulan: tahap "Wujudkan" (melanjutkan J6, tidak mengganti)

Masuk sesudah "Rancang" dan Proposal Diri; berulang, bukan sekali jalan.

| Langkah | Pengguna | AI | Pijakan |
|---|---|---|---|
| W1 Rumuskan yang mau dibangun | satu kalimat: masalah, untuk siapa, yang akan dibangun | memantik dengan pertanyaan, tidak menulis untuknya | J3, J6 |
| W2 Tiga kemungkinan bentuk | dua sampai tiga cara membangunnya (divergen) | menunjukkan contoh orang atau lembaga yang sudah membangun hal serupa | J4 (Oyserman), J6 |
| W3 Cabang bidang | memilih cabang yang dibutuhkan bentuk pilihannya (mis. digital → LLM → aplikasi di atas model / data dan evaluasi / pelatihan model) | menurunkan cabang dari sumber terbuka; tiap simpul bersumber atau ditandai belum | ESCO, O*NET, kurikulum terbuka; Peta Bekal tayang |
| W4 Jalan bertahap | versi kecil bulan ini → versi berikut tahun ini → versi matang, tiap versi dengan bekal yang perlu | menyusun urutan bekal; "Cara melatihnya" dari Peta Bekal; mengajari cara belajar dengan AI | J1 tahap hidup, J2, Peta Bekal |
| W5 Pintu belajar | jalur pendidikan dan pelatihan yang membuka bekal itu (sekolah, kuliah, kursus, microcredential; IOU satu di antaranya) | mencocokkan, tanpa memilihkan | J2, D04 (IOU organik) |
| W6 Proyek perintis dan catatan capaian | membuat versi kecil, mencatat hasil | membantu merefleksi; menyusun portofolio | J8, J2 |
| W7 Kembali | H+7, H+30, dan tiap tonggak: apa yang berubah dari dugaan | melanjutkan dari catatan terakhir; Rencana B bila macet | J6 f, J7, tinjauan Fable perbaikan 3 |
| W8 Manusia | Kakak Pembimbing, orang yang sudah membangun hal serupa, orang tua lewat Proposal Diri | menyiapkan pertanyaan; tidak menggantikan | J7, Temui orangnya |

Profesi resmi (KBJI) dan upah sektor menjadi fakta pendamping di W2 dan W5, bukan poros. Kerja bank peran yang sudah ada (`mesin/sambung/keluaran/bank_peran.json`) dipakai di sini.

## 4. Batas dan ukuran

- Tanpa vonis; AI cermin dan coach yang bertanya (A01, J1).
- Siswa mendapat fungsi penuh dengan pengaman: samaran profil ke AI, isian ke AI tidak disimpan (KEPUTUSAN 8 Nov 20.23; 18 Nov 15.47).
- Tiap langkah AI baru lewat set uji dan penilai terpisah; ukuran pilot tetap career maturity pre/post dan follow-through H+7/H+30.
- Cabang yang tidak islami tidak tampil (Raihan 30 Mei).

## 5. Yang diminta dari Chief

1. Tinjau jejak §1 sejak awal (Juni sampai Nov), tambahkan rancangan yang terlewat, dan koreksi bacaan.
2. Putuskan tempat tahap Wujudkan di manifest (sesudah 2b bersama Rancang dan Proposal Diri, atau lebih awal).
3. Selaraskan "kapabilitas full" siswa dengan keputusan 11 Nov 10.21 dan DPIA.
