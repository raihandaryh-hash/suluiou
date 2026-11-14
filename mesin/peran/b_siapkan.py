#!/usr/bin/env python3
"""Separuh B (tersembunyi): buang label dan isi lain, tulis hanya (id, kebutuhan, peran). Dijalankan di laptop.
Tidak mencetak isi. Pakai: python b_siapkan.py SU3b_pasangan_berlaku.jsonl KELUARAN_tanpa_label.jsonl"""
import json, sys, hashlib
R = [json.loads(l) for l in open(sys.argv[1], encoding="utf-8")]
R = [r for r in R if r.get("label") in ("benar", "salah")]
with open(sys.argv[2], "w", encoding="utf-8", newline="\n") as f:
    for i, r in enumerate(R): f.write(json.dumps({"id": f"B{i:03d}", "kebutuhan": r["kebutuhan"], "peran": r["peran"]}, ensure_ascii=False) + "\n")
print(len(R), "pasangan;", hashlib.sha256(open(sys.argv[2], "rb").read()).hexdigest()[:12])
