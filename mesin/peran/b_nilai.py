#!/usr/bin/env python3
"""Nilai G3.2 pada separuh B tanpa membuka isi ke sesi pembangun: hanya hitungan agregat yang dicetak.
Pakai: python b_nilai.py SU3b_pasangan_berlaku.jsonl KELUARAN_PEMETA.sah.jsonl"""
import json, math, sys
R = [json.loads(l) for l in open(sys.argv[1], encoding="utf-8")]
R = [r for r in R if r.get("label") in ("benar", "salah")]
lab = {f"B{i:03d}": r["label"] for i, r in enumerate(R)}
lolos = {json.loads(l)["id"] for l in open(sys.argv[2], encoding="utf-8") if json.loads(l).get("didukung")}
tp = sum(lab[i] == "benar" for i in lolos); fp = len(lolos) - tp
nb = sum(v == "benar" for v in lab.values()); ns = len(lab) - nb
def w(k, n, z=1.96):
    if n == 0: return 0.0
    p = k / n; d = 1 + z * z / n; c = p + z * z / (2 * n); r = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)); return (c - r) / d
print(f"B: lolos {len(lolos)}, benar {tp}, salah {fp}; presisi {tp / max(1, len(lolos)):.3f}, Wilson {w(tp, len(lolos)):.3f}; cakupan {tp}/{nb}; elusi {fp}/{ns}")
