# Catatan resmi atas AMBANG.yaml (ambang/1) · 13 Nov 2026 · SINTESIS

AMBANG.yaml tetap beku dan tidak diubah. Catatan ini mencatat dua tafsir yang dipakai sesudah hasil pertama terlihat, supaya tidak ada perubahan ambang yang diam-diam (aturan pembekuan rencana §4).

## 1. Batas `rse_tekan_di_atas: 0.50` dibaca inklusif
- Bunyi ambang/1: "ditekan di atas 0,50". Kode SSGI semula `rse > 0.50`; sejak commit c10aa2d `rse >= 0.50`.
- Dasar: dokumen resmi yang memakai data BPS menyatakan RSE "lebih dari atau sama dengan 50 persen" tidak disajikan (lihat `CEK_AMBANG_RSE.md`).
- Arah: lebih ketat (konservatif). Sel yang terdampak di SSGI 2024: 0 sel dengan RSE tepat 0,50 pada data yang diurai (hitungan ulang di bawah).
- Tafsir ini dicatat sesudah hasil terlihat. Karena arahnya hanya menambah penekanan, tafsir ini tidak meloloskan sel yang sebelumnya gagal.

## 2. Label `hati_hati` punya dua alasan
- Rencana §3 aturan 2: `hati_hati` = RSE 25–50%.
- Jalur cadangan beku (G1.5): sumber survei yang RSE-nya tidak terbit diturunkan ke `hati_hati`.
- Mulai 13 Nov tiap indikator kartu membawa `alasan_keandalan`: `rse_dari_ci` (RSE dihitung dari selang kepercayaan terbit), `rse_tidak_terbit` (jalur cadangan), atau `administratif` (data registrasi).
- Akibatnya: untuk sumber ber-`rse_tidak_terbit` (empat sumber BPS), klaim "100% sel RSE >50% ditekan" tidak bisa diverifikasi. Klaim itu hanya berlaku untuk sumber ber-`rse_dari_ci`.
