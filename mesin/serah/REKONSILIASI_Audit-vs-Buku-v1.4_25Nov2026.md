# Sisa audit lajur mesin, dicocokkan ke Buku Pengetahuan Sulu v1.4 (Bab 8 §4b dan §6) dan basis bukti Sulu
SUMBER: Buku v1.4 (laptop Audit-Nov2026\MESIN\masuk, 620.919 bita) · basis bukti Notion 87c64d19 dibaca 25 Nov 11.45 · suluiou main 0264b9e

| Butir | Yang tayang | Kata Buku | Basis bukti | Tindakan untuk Chief |
|---|---|---|---|---|
| L10 | "riset IIQ Jakarta (2024), lebih dari 7 dari 10 Muslim" | §6a: 72,25% belum mampu membaca dengan baik, IIQ 2022/2024, n=3.111, 25 provinsi, web IIQ; KEPUTUSAN 8 Jun "kutip saja"; 10 Jun "cukup jadi landasan mengutip"; komposit dengan 38,49% ditarik | tidak ada baris | Angka sudah sah. Tambah tautan artikel IIQ (iiq.ac.id); hanya tautannya yang dicari |
| L11 | "hampir separuh … sepuluh pekerjaan", dikomentari PISA 2022 | §6c: Dream Jobs 2020 atas PISA 2018, 47% laki-laki / 53% perempuan, sekunder; KEPUTUSAN 30 Jun "Soal 10 dream jobs itu penting disampaikan secara kuat … disertai data" | OECD 2025 (PISA 2022) baris terpisah, angka 39% | Ganti atribusi ke Dream Jobs 2020 / PISA 2018; contoh "polisi, pegawai negeri" tidak ada di sumber (Fable B10), ganti dengan daftar dari laporan |
| L18a | "ribuan pelajar" | §6c Celio, Durlak & Dymnicki 2011: 62 studi, N=11.837, primer | Live, https://www.tamiu.edu/profcenter/documents/Meta-AnalysisoftheImpactofSLonStudentts_2011.pdf | Pasang tautan |
| L18b | "sekitar tiga juta mitra pengemudi" (GoTo AR 2024) | tidak ada | tidak ada | Satu-satunya yang betul-betul perlu dicari |
| L2 | 33,92% | §4b #8 dan §6a: ditarik, ganti 9,88% YoY, pangsa 7,72% | https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/Kinerja-Positif-Perbankan-Syariah-2024.aspx | Ganti angka dan tautan |
| BARU | "1,72 juta green jobs 2030 (IESR)" di Insight:133 dan Peta Bekal (kepedulian-lingkungan, energi-terbarukan) | §6a: DITARIK, tidak ada di primer; IESR 0,8 juta sektor listrik 2030 | baris Live bertaut Peta Jalan Bappenas | Konflik Buku vs basis bukti; tahan klaim sampai Raihan atau Chief memutus |
| BARU | "Ekonomi Jabar 5,79% Q1 2026" | — | baris Live menaut berita Q3 2025 (5,20%) | Tautan salah; cari rilis BPS Jabar Q1 2026 |
| L3 | 43 sumber Insight | §4b dan §6 memuat status tiap angka | 17 dipasangkan (L3_insight_cocok-basis-bukti.json) | Sisa 26 dicocokkan ke tabel §4b/§6 berikutnya |

## Susulan 25 Nov 12.4x (dicari karena tidak ada di Buku maupun basis bukti)
| Butir | Hasil | Tautan | Catatan |
|---|---|---|---|
| L18b GoTo | "lebih dari 3 juta mitra pengemudi dan lebih dari 5,3 juta mitra usaha pada tahun 2024", pernyataan GoTo di acara Mitra Juara 14 Jun 2025 | https://www.cnnindonesia.com/ekonomi/20250615013926-92-1239851/beri-pelayanan-terbaik-goto-beri-penghargaan-ke-40-ribu-lebih-mitra | Sekunder (media mengutip GoTo). Laporan tahunan GoTo 2024 belum dibuka; layar menyebut "GoTo AR 2024", ganti ke rujukan ini atau buka AR |
| L10 IIQ | 72,25% level "cukup dan kurang", disampaikan Rektor IIQ Jakarta 15 Sep 2022; n=3.111, 25 provinsi dikutip jurnal | https://nu.or.id/nasional/rektor-iiq-jakarta-buta-aksara-al-qur-an-di-indonesia-masih-tinggi-vn5aa | Tahun di layar "2024" tidak cocok: riset diumumkan 2022. Artikel di situs IIQ sendiri tidak ditemukan dalam satu pencarian |
| Jabar Q1 2026 | 5,79% yoy, di atas nasional 5,61% | https://www.bi.go.id/id/publikasi/laporan/lpp/Pages/Laporan-Perekonomian-Provinsi-Jawa-Barat-Mei-2026.aspx | Ganti tautan basis bukti yang salah (berita Q3 2025) |
| L12 kartu daerah | Isi `province_contexts` dari migrasi 23 Apr: 38 provinsi, kolom sektor, peluang 2030, konteks sosial, kait narasi, semuanya narasi tanpa sumber. Hanya Jawa Barat punya 2 butir kebutuhan; satu bersumber "Kemenag Okt 2025" (13.005 pesantren; Buku §6a: sekunder). Kolom `data_verified` (bawaan false) dan `primary_sources` (bawaan kosong) ditambah 6 Jul | supabase/migrations/20260423094910…, 20260706125833…, 20260706155829… | Isi basis data produksi tidak dibaca (aturan lajur). Usul: sembunyikan kartu bila `data_verified` false, sesuai temuan audit L12 |
| A3 bank peran | 23 sub-tantangan × peran KBJI 2026, 2–12 per sub-tantangan, semua lolos pola penolak; jabatan golongan 11 (pejabat) dikecualikan | mesin/sambung/keluaran/bank_peran_medan.json | SINTESIS pengaya untuk prompt broaden-roles: "pilih dan jelaskan dari bank bila cocok, boleh di luar bank". Belum dinilai pemeriksa terpisah |
