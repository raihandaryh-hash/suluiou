#!/usr/bin/env python3
"""Pengurai KBJI 2026 (BPS, Peraturan BPS 7/2026, rilis 18 Sep 2026) dari teks `pdftotext -layout -nodiag`.
Keluaran: satu baris per jabatan 6 digit (kode NNNN.NN) dengan judul, uraian, dan kelompok 4 digit induknya (judul + uraian tugas).
Pakai: python3 -I kbji_2026.py k.txt keluaran.csv"""
import csv, re, sys
GOL = {"1": "Manajer", "2": "Profesional", "3": "Teknisi dan asisten profesional", "4": "Tenaga tata usaha",
       "5": "Tenaga usaha jasa dan penjualan", "6": "Pekerja terampil pertanian, kehutanan, dan perikanan",
       "7": "Pekerja pengolahan, kerajinan, dan yang berhubungan", "8": "Operator dan perakit mesin", "9": "Pekerja kasar", "0": "TNI dan Polri"}
def main(src, out):
    lines = open(src, encoding="utf-8").read().splitlines()
    mulai = next(i for i, l in enumerate(lines) if re.match(r"^\s*1\s+MANAJER\s*$", l) and i > 2000) if any(re.match(r"^\s*1\s+MANAJER\s*$", l) for l in lines[2000:]) else 3000
    unit, jab, cur = {}, [], None
    for l in lines[mulai:]:
        if re.search(r"\|\s*\d+\s*$", l) or re.match(r"^\s*\d+\s*\|", l): continue  # kaki halaman
        m6 = re.match(r"^\s*(\d{4})\.(\d{2})\s{2,}([A-Z0-9][A-Z0-9 ,/().'&-]+)$", l)
        m4 = re.match(r"^(\d{4})\s{2,}([A-Z][A-Z ,/().'&-]+)$", l)
        if m6:
            cur = {"kode": f"{m6.group(1)}.{m6.group(2)}", "kode_unit": m6.group(1), "judul": m6.group(3).strip().capitalize(), "uraian": []}
            jab.append(cur); continue
        if m4:
            cur = {"_unit": m4.group(1), "judul": m4.group(2).strip().capitalize(), "uraian": []}
            unit[m4.group(1)] = cur; continue
        if cur is not None and l.strip(): cur["uraian"].append(l.strip())
    rows = []
    for j in jab:
        u = unit.get(j["kode_unit"], {"judul": "", "uraian": []})
        ur = " ".join(j["uraian"]); uu = " ".join(u["uraian"]).split("Contoh jabatan")[0]
        rows.append({"kode": j["kode"], "judul": j["judul"], "kode_unit": j["kode_unit"], "judul_unit": u["judul"],
                     "golongan_pokok": GOL.get(j["kode"][0], ""), "uraian": re.sub(r"\s+", " ", ur)[:800],
                     "uraian_unit": re.sub(r"\s+", " ", uu)[:800]})
    w = csv.DictWriter(open(out, "w", newline="", encoding="utf-8"), fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
    print("jabatan", len(rows), "unit", len(unit), "unit tanpa judul", sum(1 for r in rows if not r["judul_unit"]))
if __name__ == "__main__": main(*sys.argv[1:3])
