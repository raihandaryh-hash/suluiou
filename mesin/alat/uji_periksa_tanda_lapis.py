#!/usr/bin/env python3
"""Uji pemeriksa tanda lapis: tiap butir contoh berawalan ok- harus lulus, gagal- harus gagal."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from periksa_tanda_lapis import periksa, BAWAAN
daftar = json.load(open(BAWAAN, encoding="utf-8"))
contoh = json.load(open(os.path.join(os.path.dirname(BAWAAN), "contoh_teks_tampil.json"), encoding="utf-8"))
hasil = periksa(contoh, daftar)
benar = [h["lulus"] == h["id"].startswith("ok-") for h in hasil]
for h, b in zip(hasil, benar):
    print("LULUS" if b else "SALAH", h["id"], h["salah"])
kode = [l["kode"] for l in daftar["lapis"]]
ok_lapis = kode[:5] == ["L0", "L1", "L2", "L3", "L4"]
print("daftar memuat L0-L4 berurutan:", ok_lapis)
print(f"{sum(benar)}/{len(benar)} kasus benar")
sys.exit(0 if all(benar) and ok_lapis else 1)
