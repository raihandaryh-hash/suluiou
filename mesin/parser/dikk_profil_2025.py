#!/usr/bin/env python3
"""Pengurai tabel profil penduduk miskin DIKK 2025 (BPS, katalog 3205014): Tabel 3.1, 3.2, 4.1, 4.2, 5.1, 6.1, per kab/kota.
Masukan: teks `pdftotext -layout` PDF DIKK 2025. Kode wilayah dicocokkan lewat urutan nama dalam provinsi ke Tabel 2.1
(mesin/sumber/masukan_kartu/dikk2025_tabel21.csv). Tanda air ('.go', '.id', 'ps', 'w', 'http') dibuang. NA dipertahankan.
Pakai: python3 -I dikk_profil_2025.py dikk.txt keluaran.csv"""
import csv, os, re, sys
S = os.path.dirname(os.path.abspath(__file__))
T21 = os.path.join(S, "..", "sumber", "masukan_kartu", "dikk2025_tabel21.csv")
TABEL = {"3.1": ["pend_kurang_sd", "pend_sd_smp", "pend_sma_ke_atas"], "3.2": ["aps_7_12", "aps_13_15"],
         "4.1": ["tidak_bekerja", "kerja_informal", "kerja_formal"], "4.2": ["tidak_bekerja_b", "kerja_pertanian", "kerja_bukan_pertanian"],
         "5.1": ["makanan_miskin", "makanan_tidak_miskin", "makanan_semua"], "6.1": ["air_layak", "jamban_sendiri_bersama"]}
NUM = r"(NA|–|-|\d{1,3},\d{2})"  # "–" = nihil menurut lambang BPS, dibaca 0
def angka(x): return None if x == "NA" else (0.0 if x in ("–", "-") else float(x.replace(",", ".")))
def kanon(n): return re.sub(r"[^a-z]", "", n.lower().replace("kabupaten", ""))
def main(txt, out):
    t21 = [r for r in csv.DictReader(open(T21, encoding="utf-8"))]
    urut = [(r["kode_bps"], r["tingkat"], r["provinsi"], kanon(r["nama"])) for r in t21]
    rows = {}
    tabel = None
    for line in open(txt, encoding="utf-8"):
        m = re.search(r"Tabel\s+(\d\.\d)\s+Persentase|Tabel\s+(\d\.\d)\s+Angka", line)
        if m and "...." not in line: tabel = m.group(1) or m.group(2); prov_i = 0; continue
        if tabel not in TABEL: continue
        bersih = re.sub(r"\s(\.go|\.id|go|ps|w+|//w+|s:|tp|ht|\.b|\.)\s", "  ", " " + line.rstrip() + " ")
        n = len(TABEL[tabel])
        mm = re.match(r"^\s*(\d{1,2})?\s+([A-Za-z][A-Za-z .'\-()/]*?)\s{2,}" + r"\s+".join([NUM] * n) + r"\s*$", bersih)
        if not mm: continue
        nama = re.sub(r"\s+", " ", mm.group(2)).strip()
        vals = [angka(mm.group(3 + i)) for i in range(n)]
        rows.setdefault(tabel, []).append((nama, vals))
    # cocokkan ke Tabel 2.1 lewat urutan: tiap tabel memuat wilayah dalam urutan yang sama dengan Tabel 2.1
    keluar = {}
    for tb, lst in rows.items():
        j = 0
        for nama, vals in lst:
            k = kanon(nama)
            while j < len(urut) and urut[j][3] != k and not urut[j][3].startswith(k[:8]): j += 1
            if j >= len(urut): break
            kode = urut[j][0]; keluar.setdefault(kode, {"kode_bps": kode, "nama": nama, "tingkat": urut[j][1], "provinsi": urut[j][2]})
            for c, v in zip(TABEL[tb], vals): keluar[kode][c] = v
            j += 1
    kol = ["kode_bps", "nama", "tingkat", "provinsi"] + [c for v in TABEL.values() for c in v]
    w = csv.DictWriter(open(out, "w", newline="", encoding="utf-8"), fieldnames=kol); w.writeheader()
    for r in keluar.values(): w.writerow(r)
    for tb in TABEL: print(tb, "baris", len(rows.get(tb, [])), "terpetakan", sum(1 for r in keluar.values() if TABEL[tb][0] in r))
if __name__ == "__main__": main(*sys.argv[1:3])
