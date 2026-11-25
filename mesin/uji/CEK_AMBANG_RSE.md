# Cek ambang RSE 25/50 ke dokumen resmi (gerbang G1.5, 13 Nov 2026)

Rencana mewajibkan ambang 25% dan 50% dicek ke dokumen BPS di ME1.

**Dokumen yang ditemukan:** Pusat Data dan Sistem Informasi Pertanian, Kementerian Pertanian. *Statistik Ketenagakerjaan Sektor Pertanian, Agustus 2025* (data Sakernas BPS). https://satudata.pertanian.go.id/assets/docs/publikasi/4911997b4ebb746620fc9caa8b7fa163.pdf, Konsep dan Definisi butir 15:
> "Estimasi yang baik adalah jika RSE lebih kecil dari 25 persen." ... "maka perlu kehati-hatian dalam menggunakannya." ... "Selanjutnya jika RSE bernilai 50 persen atau lebih maka estimasi tidak lagi akurat untuk digunakan." ... "Estimasi dengan nilai RSE ≥ 50% tidak dapat disajikan"

**Status:** ambang 25/50 sesuai. Dokumen ini terbitan kementerian yang memakai konvensi BPS, bukan dokumen BPS sendiri; dokumen BPS yang menyatakan ambang ini belum ditemukan (2 kueri, termasuk pencarian luas).

**Penyesuaian batas (bukan perubahan ambang):** batas tepat 50% kini ditekan (RSE ≥ 50%), dan RSE tepat 25% masuk hati-hati, mengikuti bunyi dokumen. Diterapkan di `parser/ssgi_2024.py`. Sumber BPS lain tidak terpengaruh karena RSE-nya tidak terbit (semua hati_hati).
