#!/usr/bin/env python3
"""Pasangkan baris SSGI 2024 (nama kab/kota + provinsi) ke daftar wilayah induk (kode BPS dan Kemendagri).
SSGI tidak memuat kode wilayah, jadi pencocokan lewat nama baku di dalam provinsi. Tidak memakai model.
Pakai: python3 -I ssgi_wilayah.py SSGI_KABKOTA.csv WILAYAH_INDUK.csv KELUARAN.csv"""
import csv, collections, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bps_webapi import kanon
ALIAS = {"kotabaubau": "kotabaubau", "kepulauansitaro": "siautagulandangbiaro", "kepulauantanimbar": "malukutenggarabarat", "keptanimbar": "malukutenggarabarat",
         "pangkajenekepulauan": "pangkajenedankepulauan", "kotapadangsidempuan": "kotapadangsidimpuan"}
S = list(csv.DictReader(open(sys.argv[1], encoding="utf-8")))
W = list(csv.DictReader(open(sys.argv[2], encoding="utf-8")))
prov = {kanon(w["provinsi_bps"]): w["kode_bps"][:2] for w in W}
prov.update({kanon("Kep. Bangka Belitung"): "19", kanon("Bangka Belitung"): "19", kanon("DI Yogyakarta"): "34", kanon("DKI Jakarta"): "31"})
idx = collections.defaultdict(dict)
for w in W: idx[w["kode_bps"][:2]][kanon(w["nama"])] = w
PAPUA_BARU = {"papuabaratdaya": "91", "papuaselatan": "94", "papuatengah": "94", "papuapegunungan": "94", "papuabarat": "91", "papua": "94"}
hasil, gagal = [], []
for r in S:
    kp = kanon(r["provinsi"]); p2 = PAPUA_BARU.get(kp) or prov.get(kp)
    kn = ALIAS.get(kanon(r["kabkota"]), kanon(r["kabkota"]))
    w = (idx.get(p2, {}) if p2 else {}).get(kn)
    if not w and p2:
        w = idx[p2].get("kota" + kn) if not kn.startswith("kota") else None
    if not w: gagal.append((r["provinsi"], r["kabkota"])); continue
    hasil.append(dict(r, kode_bps=w["kode_bps"], kode_kemendagri=w["kode_kemendagri"]))
with open(sys.argv[3], "w", newline="", encoding="utf-8") as o:
    wr = csv.DictWriter(o, fieldnames=list(hasil[0].keys())); wr.writeheader(); wr.writerows(hasil)
u = {(h["provinsi"], h["kabkota"]) for h in hasil}; kode = {h["kode_bps"] for h in hasil}
print(f"SSGI kab/kota {len({(r['provinsi'], r['kabkota']) for r in S})} | terpasang {len(u)} | kode BPS unik {len(kode)} | gagal {len(set(gagal))}")
for g in sorted(set(gagal))[:30]: print("  gagal:", g)
