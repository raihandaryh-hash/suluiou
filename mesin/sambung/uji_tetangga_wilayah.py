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
sb = d["ringkas"]["selisih_dengan_pembanding"]
u("kecocokan dengan pembanding >= 99 persen", sb["cocok"] / sb["sisi_utama_dibanding"] >= 0.99)
u("sumber utama BIG, pembanding Alf-Anas", "BIG" in d["sumber_batas"]["utama"]["asal_data"] and "Alf-Anas" in d["sumber_batas"]["pembanding"]["nama"])
# v3 (19 Nov 2026, Grok): wilayah tanpa geometri utama kini dari pelengkap berlisensi; uji ini memeriksa penandaan apa pun asalnya
u("tiap wilayah tanpa geometri utama ditandai dan sisinya ber-asal non-utama yang sama",
  all(W[c.split()[0]]["geometri_dari"] in ("pembanding", "pelengkap") and all(t["asal"] == W[c.split()[0]]["geometri_dari"] for t in W[c.split()[0]]["tetangga"]) for c in d["ringkas"]["utama_tanpa_geometri"]))
u("Kota Magelang: Magelang", {t["nama"] for t in W["3371"]["tetangga"]} == {"Magelang"})
u("sumber batas tertulis", d["sumber_batas"]["utama"]["url"].startswith("https://github.com/"))
if d["skema"] == "tetangga-wilayah/3":
    pl = d["sumber_batas_pelengkap"]
    u("v3: pelengkap berlisensi tertulis CC BY-IGO dari BPS lewat HDX",
      "CC BY-IGO" in pl["lisensi"] and "/licenses/by/3.0/igo/" in pl["lisensi"] and "BPS" in pl["asal_data"] and pl["url"].startswith("https://data.humdata.org/"))
    u("v3: tidak ada sisi ber-asal pembanding tanpa lisensi", d["ringkas"]["sisi_dari_pembanding"] == 0 and all(t["asal"] != "pembanding" for v in W.values() for t in v["tetangga"]))
    pb = d["ringkas"]["pelengkap_dibanding_pembanding"]
    u("v3: tetangga pelengkap tujuh wilayah ada juga di pembanding", len(pb) == 7 and all(set(x["pelengkap"]) <= set(x["pembanding"]) for x in pb.values()))
for n, ok in uji: print("LULUS" if ok else "GAGAL", n)
print(f"{sum(o for _, o in uji)}/{len(uji)} lulus")
raise SystemExit(0 if all(o for _, o in uji) else 1)
