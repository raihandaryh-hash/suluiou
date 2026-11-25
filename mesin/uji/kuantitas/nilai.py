#!/usr/bin/env python3
"""Nilai penangkap kata kuantitas (baris KATA_KUANTITAS di kontrak/buat_kontrak.py) pada set uji beku. Tanpa model.
Pakai: python3 mesin/uji/kuantitas/nilai.py A|B [--rinci]"""
import json, os, re, sys
AKAR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
src = open(os.path.join(AKAR, "kontrak", "buat_kontrak.py"), encoding="utf-8").read()
KK = re.compile(re.search(r'KATA_KUANTITAS = re\.compile\(r"(.+?)"\)\n', src).group(1))
R = [json.loads(l) for l in open(os.path.join(AKAR, "uji", "kuantitas", f"set_{sys.argv[1]}.jsonl"), encoding="utf-8")]
tp = sum(1 for r in R if r["harus_ditolak"] and KK.search(r["teks"])); fn = [r for r in R if r["harus_ditolak"] and not KK.search(r["teks"])]
fp = [r for r in R if not r["harus_ditolak"] and KK.search(r["teks"])]; P = sum(r["harus_ditolak"] for r in R)
print(f"set {sys.argv[1]}: tertangkap {tp}/{P}, salah tangkap {len(fp)}/{len(R)-P}")
if "--rinci" in sys.argv:
    for r in fn: print("LOLOS", r["id"], r["teks"])
    for r in fp: print("SALAH", r["id"], r["teks"], "|", KK.search(r["teks"]).group(0))
