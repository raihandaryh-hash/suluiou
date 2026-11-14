#!/usr/bin/env python3
"""Daftar sel (kode_bps) yang cocok dengan publikasi kedua, per sumber. Hanya sel ini boleh dipakai kartu
(PUTUSAN ATAS DELEGASI 13 Nov 2026). Memakai pemuat yang sama dengan uji/su1m.py.
Pakai: python sel_terverifikasi.py SUMBER KELUARAN.csv -- <argumen muat su1m>"""
import csv, hashlib, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uji"))
import su1m
pisah = sys.argv.index("--"); sumber, out = sys.argv[1:pisah]; A, _, B = su1m.muat(sys.argv[pisah + 1:])
cocok = lambda v, xs: any(abs(v - x) <= 0.005 or abs(round(v, 1) - x) <= 0.005 for x in xs)
ok = sorted(k for k, v in A.items() if k in B and cocok(v, B[k]))
beda = sorted(k for k, v in A.items() if k in B and not cocok(v, B[k]))
with open(out, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(["kode_bps"]); [w.writerow([k]) for k in ok]
print(f"{sumber}: {len(ok)} sel cocok, {len(beda)} berpasangan tetapi berselisih (ditarik) {beda}, {len(A) - len(ok) - len(beda)} tanpa pasangan (ditahan); "
      f"sha256 {hashlib.sha256(open(out, 'rb').read()).hexdigest()[:12]}")
