#!/usr/bin/env python3
"""Nilai juri G1.6 per mode: TPR pada teks bergalat mode itu, TNR pada teks benar, dan salah-tuduh lintas mode.
Batas bawah Wilson 95% dihitung untuk tiap rasio. Ambang beku: uji/AMBANG.yaml G1.6 (TPR LB >= 0,90; TNR LB >= 0,85;
minimal 100 per sisi). Separuh terbuka (50 per sisi) hanya untuk kalibrasi; vonis gerbang memakai terbuka + tersembunyi.
Pakai: python3 nilai_juri.py SU2.jsonl FOLDER_KELUAR [SU2_tersembunyi.jsonl]"""
import collections, glob, json, math, os, sys
def wilson(k, n, z=1.96):
    if n == 0: return 0.0
    p = k / n; d = 1 + z * z / n
    return (p + z * z / (2 * n) - z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n))) / d
S = {s["butir"]: s for s in map(json.loads, open(sys.argv[1], encoding="utf-8"))}
for p in sorted(glob.glob(os.path.join(sys.argv[2], "keluar_*.jsonl"))):
    m = os.path.basename(p)[7:-6]
    O = {o["butir"]: bool(o["melanggar"]) for o in map(json.loads, open(p, encoding="utf-8"))}
    pos = [b for b in O if S[b].get("mode") == m]; neg = [b for b in O if S[b]["label"] == "benar"]
    lain = [b for b in O if S[b]["label"] == "bergalat" and S[b]["mode"] != m]
    tp = sum(O[b] for b in pos); tn = sum(not O[b] for b in neg); fl = sum(O[b] for b in lain)
    asal = collections.Counter(S[b]["asal"] for b in pos if not O[b])
    print(f"{m:12} TPR {tp}/{len(pos)} (LB {wilson(tp, len(pos)):.3f}) | TNR {tn}/{len(neg)} (LB {wilson(tn, len(neg)):.3f}) | "
          f"tuduh lintas mode {fl}/{len(lain)} | lolos per asal {dict(asal)} | n masuk {len(O)}")
