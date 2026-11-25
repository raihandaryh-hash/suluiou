#!/usr/bin/env python3
"""Laporan cakupan Papua terpisah (G2.1 rencana: Papua dilaporkan terpisah). Papua = kode lama 91 dan 94 di wilayah induk
(enam provinsi skema 2025). Pakai: python3 lapor_papua.py KARTU.jsonl WILAYAH_INDUK.csv DIKK_TABEL21.csv"""
import collections, csv, json, sys
K = [json.loads(l) for l in open(sys.argv[1], encoding="utf-8")]
W = [w for w in csv.DictReader(open(sys.argv[2], encoding="utf-8")) if w["kode_bps"][:2] in ("91", "94") and len(w["kode_bps"]) == 4]
P = {r["kode_bps"]: float(r["jumlah_ribu"]) / (float(r["p0"]) / 100) for r in csv.DictReader(open(sys.argv[3], encoding="utf-8"))
     if r["tingkat"] == "kabkota" and float(r["p0"]) > 0}
papua = {w["kode_bps"] for w in W}; tot = sum(P.get(k, 0) for k in papua)
print(f"Papua (kode lama 91, 94): {len(papua)} kab/kota, penduduk {tot:,.0f} ribu (DIKK 2025, jumlah miskin / P0)")
per = collections.defaultdict(set)
for k in K:
    if k["wilayah"]["kode_bps"] in papua: per[k["jenis_kebutuhan"]].add(k["wilayah"]["kode_bps"])
for j in sorted({k["jenis_kebutuhan"] for k in K}):
    s = per[j]; print(f"{j:32} {len(s):3}/{len(papua)} kab/kota  {sum(P.get(x,0) for x in s)/tot:5.0%} penduduk Papua  belum: {len(papua)-len(s)}")
