#!/usr/bin/env python3
"""Sampel acak 40 dari usulan sah pemeta v2 (seed 105) untuk pelabel, dan hitung Wilson dari label. Deterministik.
Pakai: sampel_v2.py SAH.jsonl -> usul_v2_sampel40.jsonl (untuk pelabel: id, kebutuhan, peran, kutipan)
       sampel_v2.py --nilai LABEL.jsonl"""
import json, math, os, random, sys
D = os.path.dirname(os.path.abspath(__file__))
def wilson(k, n, z=1.96):
    if n == 0: return 0.0
    p = k / n; a = p + z*z/(2*n); b = z*math.sqrt(p*(1-p)/n + z*z/(4*n*n)); return (a - b) / (1 + z*z/n)
if sys.argv[1] == "--nilai":
    L = [json.loads(l) for l in open(sys.argv[2], encoding="utf-8")]
    c = {x: sum(r["label"] == x for r in L) for x in ("benar", "salah", "ragu")}
    print(c, "n", len(L), f"Wilson ragu=salah {wilson(c['benar'], len(L)):.3f}", f"ragu dibuang {wilson(c['benar'], c['benar']+c['salah']):.3f}")
    sys.exit(0)
R = [json.loads(l) for l in open(sys.argv[1], encoding="utf-8")]
R = [r for r in R if "peran" in r]
S = random.Random(105).sample(R, min(40, len(R)))
with open(os.path.join(D, "usul_v2_sampel40.jsonl"), "w", encoding="utf-8") as f:
    for i, r in enumerate(S):
        f.write(json.dumps({"id": f"V{i:02d}", "kebutuhan": r["kebutuhan"], "peran": r["peran"], "kutipan": r["kutipan"],
                            "doc_id": r["doc_id"]}, ensure_ascii=False) + "\n")
print("sampel", len(S), "dari", len(R))
