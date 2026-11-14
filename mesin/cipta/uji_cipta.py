#!/usr/bin/env python3
"""G3b.1 (ide dulu, uji fungsional kedua mode) dan pemeriksaan aturan bank statis G3b.2 mode (c). Keluar 1 bila gagal."""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from alur import minta_pemantik, B
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(AKAR, "jalur")); _a = sys.argv; sys.argv = [_a[0]]
import rangkai as RK  # noqa: E402
sys.argv = _a
KOSONG = [None, [], [""], ["   "], ["ok"], ["?!"], ["123456789012345"], ["ide"], ["\n\t"]]
ISI = [["Saya ingin membuat kelompok belajar untuk anak tetangga"], ["", "Mengajak teman membersihkan saluran air"]]
gagal = []
n = 0
for mode in ("dewasa", "c"):
    for je in ("kemiskinan-kabkota", "stunting-balita"):
        for g in KOSONG:
            for p in (0, 3):
                n += 1; r = minta_pemantik(mode, je, g, p)
                if r["status"] != "terkunci": gagal.append(f"G3b.1 tidak terkunci: {mode} {je} {g!r}")
        for g in ISI:
            n += 1; r = minta_pemantik(mode, je, g, 0)
            if r["status"] == "terkunci": gagal.append(f"G3b.1 terkunci padahal ada gagasan: {mode} {g!r}")
            if mode == "c" and r.get("sumber") != "bank_statis": gagal.append("mode c tidak memakai bank statis")
SOLUSI = re.compile(r"(?i)\b(sebaiknya|solusi\w*|caranya adalah|jawabannya|coba buat|buatlah|lakukan|kamu bisa membuat|disarankan|rekomendasi)\b")
butir = [t for v in B["bank"].values() for t in v]
for t in butir + [B["penutup"], B["label_generik"]]:
    for x in RK.pindai({"teks": t}): gagal.append(f"bank: {x}: {t[:50]}")
for t in butir:
    if not t.strip().endswith("?"): gagal.append(f"bank bukan pertanyaan: {t[:50]}")
    if SOLUSI.search(t): gagal.append(f"bank memuat saran: {SOLUSI.search(t).group(0)}")
print(f"G3b.1: {n} permintaan uji (dua mode, dua jenis), {'LULUS' if not [x for x in gagal if x.startswith('G3b.1') or 'bank statis' in x] else 'GAGAL'}")
print(f"G3b.2 mode (c), lapis aturan: {len(butir)} butir bank; {'LULUS' if not [x for x in gagal if x.startswith('bank')] else 'GAGAL'}; tinjauan juri terkalibrasi belum")
print("G3b.2 mode dewasa: belum (butuh simulasi model pemantik dan juri)")
for x in gagal: print("  -", x)
sys.exit(1 if gagal else 0)
