#!/usr/bin/env python3
"""Gerbang ME2 yang bisa dihitung dari kartu: G2.1 (lantai 34 dari 38 provinsi, skema provinsi 2025 lewat kode BPS
baru di wilayah induk) dan G2.4 (kartu berpembanding median nasional paling banyak 30% per jenis kebutuhan).
Pakai: python3 periksa_g2.py KARTU.jsonl WILAYAH_INDUK.csv [KODE_BARU.json]
Peta kode baru Papua dibaca dari sumber/wilayah/kode_baru_papua.csv (nama vervar tabel nasional BPS 2025 berkode baru,
 dicocokkan dengan nama di wilayah induk; 26 kab/kota). KODE_BARU.json opsional menimpa.
Keluar 1 bila ada jenis yang gagal; jenis yang gagal G2.1 tayang sebagai kartu nasional saja (rencana §4.2)."""
import collections, csv, json, sys
K = [json.loads(l) for l in open(sys.argv[1], encoding="utf-8")]
W = {w["kode_bps"]: w for w in csv.DictReader(open(sys.argv[2], encoding="utf-8"))}
import os
_peta = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "sumber", "wilayah", "kode_baru_papua.csv")
BARU = {r["kode_bps_lama"]: r["kode_bps_baru"] for r in csv.DictReader(open(_peta, encoding="utf-8"))}
if len(sys.argv) > 3: BARU.update(json.load(open(sys.argv[3], encoding="utf-8")))
prov38 = lambda k: (BARU.get(k) or k)[:2]
semua38 = {prov38(k) for k in W}
per = collections.defaultdict(list)
for k in K: per[k["jenis_kebutuhan"]].append(k)
gagal = False
print(f"{'jenis':32} kartu  provinsi/{len(semua38)}  G2.1  median%  G2.4")
for j, ks in sorted(per.items()):
    pv = {prov38(k["wilayah"]["kode_bps"]) for k in ks}
    med = sum(k["pembanding"]["jenis"] == "median_nasional" for k in ks) / len(ks)
    g21, g24 = len(pv) >= 34, med <= 0.30
    gagal |= not (g21 and g24)
    print(f"{j:32} {len(ks):5}  {len(pv):11}  {'ya ' if g21 else 'tdk'}   {med:6.0%}  {'ya' if g24 else 'tdk'}")
    if not g21: print("   provinsi belum:", sorted(semua38 - pv))
sys.exit(1 if gagal else 0)
