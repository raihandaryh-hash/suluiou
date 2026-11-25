# L0 Register Dokumen Resmi (Sulu)
Label: SINTESIS (hasil retrieval; bukan verdict peran/kutipan). Tanggal: 13 Nov 2026.
Berkas: L0_register_dokumen.csv (89 baris, 49 dokumen unik, 40 kebutuhan).

## Dokumen per kebutuhan
| kebutuhan | jumlah dokumen | catatan |
|---|---|---|
| penduduk-tanpa-jaminan-kesehatan | 4 | ok |
| kemiskinan-kabkota | 4 | ok |
| stunting-balita | 5 | ok |
| wasting-balita | 3 | ok |
| dokter-per-penduduk | 3 | ok |
| rasio-murid-guru | 2 | ok |
| apk-perguruan-tinggi | 2 | ok |
| tpq-per-anak | 3 | ok |
| disabilitas-sekolah | 2 | ok |
| perkawinan-anak | 3 | ok |
| desa-rawan-bencana | 3 | ok |
| neet-muda | 2 | ok |
| umkm-akses-kredit | 3 | ok |
| wakaf-belum-produktif | 2 | ok |
| petani-muda | 1 | PARSIAL (1 dok) |
| sanitasi-layak | 3 | ok |
| nilai-tambah-pertanian | 1 | PARSIAL (1 dok) |
| kepala-desa-muda | 2 | ok |
| partisipasi-musrenbang | 2 | ok |
| buta-huruf-dewasa | 1 | PARSIAL (1 dok) |
| korban-bencana | 2 | ok |
| persalinan-tanpa-nakes | 3 | ok |
| puskesmas-tanpa-9-nakes | 2 | ok |
| kesehatan-jiwa-remaja | 2 | ok |
| anak-tidak-sekolah | 2 | ok |
| buta-aksara-quran | 2 | ok |
| lansia-sendiri | 2 | ok |
| kekerasan-anak | 2 | ok |
| sampah-tidak-terkelola | 1 | PARSIAL (1 dok) |
| rasio-elektrifikasi-ebt | 2 | ok |
| tpt-kabkota | 2 | ok |
| penyerapan-zakat | 1 | PARSIAL (1 dok) |
| literasi-keuangan-syariah | 1 | PARSIAL (1 dok) |
| air-minum-layak | 3 | ok |
| kerawanan-pangan | 4 | ok |
| desa-tertinggal | 3 | ok |
| tata-kelola-masjid | 0 | TIDAK DITEMUKAN |
| anak-tidak-paud | 1 | PARSIAL (1 dok) |
| lansia-miskin | 3 | ok |
| pemilih-tidak-menggunakan-hak | 0 | TIDAK DITEMUKAN |

Tiga teratas: penduduk-tanpa-jaminan-kesehatan 4, kemiskinan-kabkota 4, stunting-balita 5.

## TIDAK DITEMUKAN
- tata-kelola-masjid: tidak ada peraturan/pedoman nasional terverifikasi di hasil pencarian (kandidat: regulasi Kemenag/BKM, belum ditemukan).
- pemilih-tidak-menggunakan-hak: tidak ada dokumen terverifikasi (kandidat: UU 7/2017 dan PKPU sosialisasi/pendidikan pemilih; pencarian tidak mengembalikan halaman resmi).

## PARSIAL (hanya 1 dokumen, belum memenuhi 2-5)
petani-muda, nilai-tambah-pertanian, buta-huruf-dewasa, sampah-tidak-terkelola, penyerapan-zakat, literasi-keuangan-syariah, anak-tidak-paud. Kandidat belum terverifikasi: PP 26/2021 (pertanian), PP 47/2008 (wajib belajar), UU 17/2023 (Kesehatan) dan UU 18/2012 (Pangan) tanpa URL terlihat.

## Catatan mutu
- Status berlaku diambil dari halaman JDIH BPK/peraturan.go.id yang tampil di hasil pencarian; curl diblokir proxy, tidak ada verifikasi langsung. Kolom cek_status menyebut mana yang tidak dibuka (label "dugaan").
- Dibuang: Permenag 13/2014 (dicabut), Permenkes 43/2019 (digantikan), Perka BNPB 7/2022 (digantikan), "Permendikdasmen 26/2025" (draf).
- FLAG: Perka BKKBN 12/2021 (periode 2021-2024 berakhir); Stranas PPA 2024 bukan peraturan; Permen PPPA 6/2025 hanya Renstra; Permenag 31/2020 relevansi TPQ perlu dicek; Permendesa 9/2024 hanya abstrak; slug BPK PP 7/2021 salah label; Permensos 7/2021 dan Perpres 185/2014 belum dicek status.
- Sebagian dokumen untuk kebutuhan pendidikan (PP 57/2021) dipakai lintas banyak kebutuhan karena kebutuhan spesifik (buta huruf, anak tidak PAUD) belum menemukan pedoman khusus; mapper perlu menilai relevansi.
- Independensi: SU3*/uji_tersembunyi hanya dibaca untuk daftar id kebutuhan.
