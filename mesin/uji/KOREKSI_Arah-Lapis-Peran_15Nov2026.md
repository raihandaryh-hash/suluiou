# KOREKSI ARAH · Lapis peran mesin (15 Nov 2026)

Sesi: SESI-11NOV-SULU-MESIN · https://claude.ai/code/session_01JZPjjr3cEST9SPkxZSaHrr
Mengoreksi: RENCANA Mesin v1 (12 Nov 2026) baris M3 dan §10 butir 4; gerbang G3.1–G3.3.

## 1. KEPUTUSAN (Raihan, 15 Nov 2026 09.16 WIB, verbatim sebagian)

> "Coba cek engine Sulu yang existing dalam hal ini. Tugas Anda enhance, bukan break. Masa iya sekelas kita ini, yang harusnya bisa lebih baik dari 80000 hours, menyarankan remaja--dalam platform yang harusnya menyalakan obor semangat di hati mereka--untuk jadi petugas-petugas bergaji mikro gitu :( Kepala dinas pula.. gimana sih? [...] Coba deh yang riil. Cari tahu juga permasalahan karir di kalangan Gen Z sekarang, juga Millennials dst. [...] Padahal saya juga tadinya ingin Anda mengimprove narasi-narasi di awal, engine skill cards etc.-nya, tapi lho kok ini meisn yang krusial malah seperti ini."

Catatan penilaiannya atas 6 dari 25 usulan peran (15 Nov, lembar nilai): tidak ada yang "ya". Kutipan: "Gak lazim banget... apakah dia sustainable?"; "gajinya berapa sih? Ratusan ribu...Sesempit itu?"; "LOL, masa kepala dinas? ... Realistislah."

## 2. Apa yang salah, dan dari mana (SINTESIS, dicek ke berkas)

1. Rencana yang saya tulis sendiri (M3: "tiap pasangan kebutuhan → peran wajib menunjuk pedoman atau dokumen program resmi ... broaden-roles diganti"; §10 butir 4) menjadikan peraturan program sebagai SUMBER peran. Peraturan menyebut pelaksana program (petugas, pendamping, kader, pejabat), bukan profesi. Keluaran yang jelek adalah akibat langsung rancangan ini, bukan kecelakaan pemeta.
2. Yang diukur G3.2 adalah "apakah dokumen ini benar menyebut orang itu mengerjakan tugas itu". Tidak ada gerbang yang bertanya "apakah ini karier yang layak dituju seorang remaja". Angka ketepatan 0,70–0,79 mengukur hal yang salah dengan teliti.
3. G3.5 (data pasar kerja per peran) tidak pernah dibangun.
4. Yang tayang tidak tersentuh: `git diff origin/main...HEAD -- src supabase` kosong (dicek 15 Nov 09.21 WIB). Mesin penghasil peran yang tayang (`supabase/functions/broaden-roles`) tetap seperti semula.

## 3. Yang sudah ada di mesin Sulu yang tayang (dibaca 15 Nov, main 42e7d38)

| Bagian | Yang dikerjakan | Yang belum |
|---|---|---|
| `broaden-roles` | 6 jabatan nyata per medan, gaya KBJI, minimal 3 yang jarang terlihat; "demandsMost", "pathwayHint"; larangan janji kerja dan angka gaji; anti-vonis | Dari ingatan model, tanpa bukti; tidak menimbang apakah peran itu menghidupi; tidak ada fakta pasar kerja; tidak ada penolak jabatan struktural |
| Jalan Bakti, Gerakan 3 | Empat payung: Temui orangnya, Selami bidangnya, Bangun bekalnya, Cebur sebentar | Tempat yang tepat untuk peran program dan relawan sudah ada (Cebur sebentar), belum dipakai mesin |
| Insight | Kartu realita pasar kerja (NEET, TPT pemuda, mismatch, upah, informal); profesi nyata di lapis dunia | Sebagian angka sudah punya rilis lebih baru |
| Skill map | 25 simpul, sektor tumbuh dan rentan, cara melatih, coba minggu ini | Belum tersambung ke peran dan ke kartu kebutuhan |

## 4. Arah baru

### 4.1 KEPUTUSAN (turunan langsung kalimat Raihan)
- Mesin MEMPERKAYA mesin yang tayang; tidak menggantinya. M3 "broaden-roles diganti" dan §10 butir 4 DICABUT.
- Peran yang ditawarkan sebagai tujuan harus karier nyata yang menghidupi dan menarik. Peran program berhonor kecil dan jabatan struktural bukan tujuan.

### 4.2 PUTUSAN ATAS DELEGASI (delegasi 14 Nov 09.10: "Review the progress til now, decide the best for things, go SOTA."; bisa dibalik)
1. **Dua jenis butir, tidak dicampur.**
   - TUJUAN = profesi: pekerjaan utama yang dikenal pasar kerja (ada di KBJI atau lazim di lowongan), terbuka bagi orang biasa lewat pendidikan, sertifikasi, atau portofolio, dan punya jalur penghasilan yang wajar dalam lebih dari satu bentuk kerja (karyawan, lepas, usaha sendiri).
   - PIJAKAN = pengalaman: peran program, relawan, kader, magang. Hanya tampil di payung "Cebur sebentar" atau "Temui orangnya", berlabel pengalaman, tidak pernah sebagai tujuan.
2. **Penolak mekanis** untuk TUJUAN: jabatan struktural dan politik (kepala dinas, camat, lurah, bupati, anggota dewan), peran yang hidup dari honor program, peran yang hanya ada selama satu program berjalan.
3. **Hasil pemetaan peraturan (USUL v1–v3.2) tidak dibuang.** Ia pindah fungsi menjadi bahan PIJAKAN dan bahan "siapa yang sekarang mengerjakan ini di lapangan" pada kartu kebutuhan. Tidak ada berkas beku yang diubah.
4. **Lembar fakta per profesi** (pengganti G3.5 yang tak pernah dibangun), semua bersumber dan bertahun, kosong berlabel bila tidak ada: upah rata-rata sektor (BPS Sakernas), jalur masuk (pendidikan, sertifikasi), tanda permintaan (lowongan atau daftar resmi), dan "yang berat" (seberapa sempit pintu masuknya). Angka tidak pernah melewati model.
5. **Jujur soal pasar.** Tiap jalur menyebut bekal yang bisa dibawa ke bidang lain, karena pintu kerja formal menyempit (lihat `mesin/riset/RISET_Realita-Karier-Muda_15Nov2026.md`). Nada mengikuti konstitusi copy Sulu: realita keras sebagai peta untuk amal, tanpa menakut-nakuti dan tanpa janji.
6. **Gerbang baru G3.6 Kelayakan karier** (menggantikan G3.2 sebagai gerbang penentu lapis peran; G3.2 tetap dicatat sebagai ukuran ketepatan kutipan):
   - Tahap 1: 20 profesi keluaran baru dinilai Raihan di lembar nilai. Lulus bila ≥18 "ya" dan 0 butir dari jenis yang ia tolak (struktural, honor mikro, tidak lazim).
   - Tahap 2: juri kelayakan dikalibrasi ke label Raihan (set kalibrasi dan set uji terpisah, dibekukan sebelum dinilai), lalu dijalankan atas seluruh keluaran.
   - Gagal dua putaran → berhenti, laporkan, jangan tambal.
7. **Aturan "JANGAN janjikan ... angka gaji"** pada penghasil peran yang tayang tetap. Yang diusulkan untuk ditimbang Raihan di akhir tonggak: angka upah resmi bertahun boleh tampil sebagai fakta bersumber, bukan janji. Sampai ia memutuskan, tidak ada perubahan pada kode tayang.

## 5. Yang TIDAK berubah
Kartu kebutuhan berbasis data (ME1–ME2), kontrak jalur, juri kuantitas dan perbandingan, pemeriksa kartu, manifest berkas mentah. Semua tetap dan tetap dipakai.

## 6. Butir kerja yang lahir
- 116 Lapis peran dua jenis (TUJUAN dan PIJAKAN) → rancang ulang M3 di atas mesin yang tayang.
- 117 Lembar fakta profesi dari sumber resmi (buka publikasi BPS per jenis pekerjaan; cari proyeksi kebutuhan tenaga kerja).
- 118 Narasi awal Sulu: tinjau dan usulkan perbaikan (permintaan Raihan 09.16).
- 119 Mesin kartu keterampilan (skill map): sambungkan ke profesi dan kartu kebutuhan; usulkan perbaikan (permintaan Raihan 09.16).
- 120 Penyegaran angka halaman Insight ke rilis terbaru → titipan ke pemilik kode tayang.
