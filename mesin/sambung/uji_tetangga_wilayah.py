#!/usr/bin/env python3
"""Uji keluaran tetangga_wilayah.json tanpa butuh berkas batas. Jalankan: python3 -I uji_tetangga_wilayah.py"""
import json, os, csv
D = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(D, "keluaran", "tetangga", "tetangga_wilayah.json"), encoding="utf-8"))
W = d["wilayah"]
dikk = {r["kode_bps"] for r in csv.DictReader(open(os.path.join(D, "..", "sumber", "masukan_kartu", "dikk2025_tabel21.csv"), encoding="utf-8")) if r["tingkat"] == "kabkota"}
uji = []
def u(nama, ok): uji.append((nama, bool(ok)))
u("514 wilayah = kode DIKK", set(W) == dikk and len(W) == 514)
u("simetris", all(k in {t["kode_bps"] for t in W[t2["kode_bps"]]["tetangga"]} for k, v in W.items() for t2 in v["tetangga"]))
u("tak bertetangga dengan diri sendiri", all(t["kode_bps"] != k for k, v in W.items() for t in v["tetangga"]))
u("Garut: Bandung, Cianjur, Sumedang, Tasikmalaya", {t["nama"] for t in W["3205"]["tetangga"]} == {"Bandung", "Cianjur", "Sumedang", "Tasikmalaya"})
u("Kepulauan Seribu tanpa tetangga darat", W["3101"]["tanpa_tetangga_darat"])
u("Manggarai: Manggarai Barat, Manggarai Timur", {t["nama"] for t in W["5313"]["tetangga"]} == {"Manggarai Barat", "Manggarai Timur"})
u("kecocokan BIG >= 99 persen", d["ringkas"]["pembanding_big"]["cocok"] / d["ringkas"]["pembanding_big"]["sisi_utama_yang_dapat_dibanding"] >= 0.99)
u("sumber batas tertulis", d["sumber_batas"]["utama"]["url"].startswith("https://github.com/"))
for n, ok in uji: print("LULUS" if ok else "GAGAL", n)
print(f"{sum(o for _, o in uji)}/{len(uji)} lulus")
raise SystemExit(0 if all(o for _, o in uji) else 1)
