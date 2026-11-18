#!/usr/bin/env python3
"""Pijakan KBJI 2026 per medan Jalan Bakti (k1-k7), untuk memperkaya broaden-roles yang tayang (bukan mengganti).
Cara pilih: jabatan yang judulnya, atau judul kelompok 4 digitnya, memuat kata kunci medan; golongan 9 (pekerja kasar),
0 (TNI/Polri), dan kelompok pejabat pemerintahan (111x) tidak dipakai sebagai tujuan (KEPUTUSAN 15 Nov 09.16). Kata kunci per medan
diturunkan dari judul medan dan sub-tantangan yang tayang (jalanBaktiContent.ts). Hasil = kandidat; gerbang kelayakan karier
G3.6 (20 profesi dinilai Raihan, lulus bila minimal 18 ya) tetap berlaku sebelum dipakai sebagai daftar tetap.
Pakai: python3 -I kbji_per_medan.py"""
import csv, json, os, re, collections
S = os.path.dirname(os.path.abspath(__file__))
R = list(csv.DictReader(open(os.path.join(S, "..", "sumber", "kbji", "kbji2026_jabatan.csv"), encoding="utf-8")))
MEDAN = {
 "k1": ("Kesehatan & Kesejahteraan", r"kesehatan|medis|perawat|bidan|gizi|psikolog|farmasi|kesehatan jiwa|rehabilitasi|epidemiolog"),
 "k2": ("Pendidikan & Ilmu", r"pendidikan|guru|dosen|pengajar|instruktur|kurikulum|peneliti|ilmuwan|perpustakaan|pembelajaran"),
 "k3": ("Keluarga, Anak & Kelompok Rentan", r"pekerja sosial|konselor|konseling|pengasuh|lanjut usia|lansia|disabilitas|kesejahteraan sosial|terapis|rehabilitasi"),
 "k4": ("Bumi & Lingkungan", r"lingkungan|energi|surya|iklim|limbah|sampah|kehutanan|konservasi|bencana|meteorolog|geolog"),
 "k5": ("Ekonomi Adil & Keuangan", r"keuangan|akuntan|perbankan|kredit|pinjaman|koperasi|usaha mikro|pemasaran|investasi|pajak|asuransi|ekonom"),
 "k6": ("Pangan, Air & Keberlanjutan", r"pertanian|pangan|perikanan|peternakan|agronom|hortikultura|irigasi|air bersih|pengolahan air|tanaman"),
 "k7": ("Kepemimpinan & Tata Kelola", r"kebijakan|perencana|tata kota|pengembangan wilayah|hukum|advokat|hubungan masyarakat|statistik|pengembangan masyarakat|lembaga nirlaba|wakaf|zakat"),
}
def dipakai(r):
    k = r["kode"]
    return not (k[0] in "09" or k.startswith("111"))
out = {}
for m, (nama, pola) in MEDAN.items():
    rx = re.compile(pola, re.I)
    unit = collections.OrderedDict()
    for r in R:
        if not dipakai(r): continue
        if rx.search(r["judul_unit"]) or rx.search(r["judul"]):
            unit.setdefault(r["kode_unit"], {"kode_unit": r["kode_unit"], "judul_unit": r["judul_unit"], "golongan_pokok": r["golongan_pokok"], "jabatan": []})
            unit[r["kode_unit"]]["jabatan"].append({"kode_kbji": r["kode"], "judul": r["judul"]})
    out[m] = {"nama": nama, "jumlah_kelompok": len(unit), "jumlah_jabatan": sum(len(u["jabatan"]) for u in unit.values()),
              "per_golongan": dict(collections.Counter(u["golongan_pokok"] for u in unit.values())), "kelompok": list(unit.values())}
json.dump({"skema": "kbji-per-medan/1", "dibuat": "18 Nov 2026, sesi mesin Sulu (butir 262)",
           "sumber": "KBJI 2026, Peraturan BPS 7/2026, https://www.bps.go.id/en/publication/2026/09/18/037999e06c01ccb8acd2e7af/klasifikasi-baku-jabatan-indonesia--kbji--2026.html; terurai 2.179 dari 2.380 jabatan",
           "label": "SINTESIS pemilihan kata kunci; kandidat sebelum gerbang G3.6", "medan": out},
          open(os.path.join(S, "keluaran", "kbji_per_medan.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for m, v in out.items(): print(m, v["nama"], v["jumlah_kelompok"], "kelompok,", v["jumlah_jabatan"], "jabatan", v["per_golongan"])
