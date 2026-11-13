#!/usr/bin/env python3
"""Bangun kartu ME2 (G2.5): kemiskinan dan TPT per kab/kota dari sel terverifikasi; air minum tidak per daerah (gagal G2.1/G2.4).
Status kartu 'siap_tinjau' (bukan draf) supaya pemeriksa sumber dan sel aktif; tidak ada penerbitan produksi.
Masukan: sumber/masukan_kartu/ (DIKK 2025 Tabel 2.1 hasil parser; tabel BPS WebAPI A tpt/airminum; nama kab/kota).
Pakai: python3 mesin/alat/bangun_kartu_me2.py  -> mesin/kartu/keluaran/kartu_me2.jsonl"""
import json, os, sys
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(AKAR, "kartu")); import kartu as K
M = os.path.join(AKAR, "sumber", "masukan_kartu")
kart = K.kartu_dari_dikk(os.path.join(M, "dikk2025_tabel21.csv")) + K.kartu_dari_bps(os.path.join(M, "a_tpt_airminum_2025.json"), os.path.join(M, "nama_induk.json"), "tpt")
for k in kart: k["status"] = "siap_tinjau"
out = os.path.join(AKAR, "kartu", "keluaran", "kartu_me2.jsonl")
with open(out, "w", encoding="utf-8") as f:
    for k in kart: f.write(json.dumps(k, ensure_ascii=False, sort_keys=True) + "\n")
print("kartu:", len(kart), {j: sum(k["jenis_kebutuhan"] == j for k in kart) for j in sorted({k["jenis_kebutuhan"] for k in kart})})
