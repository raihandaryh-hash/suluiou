#!/usr/bin/env python3
"""Gerbang G2.2 (konsistensi) untuk sel terverifikasi: (1) uji rentang 0-100; (2) beda antar-tahun yang menyimpang
lebih dari 3 simpangan baku dari rata-rata beda seluruh kab/kota ditandai (bukan ditolak); (3) uji total, bila sumber
punya jumlah kab/kota dan provinsi (kemiskinan: lihat parser/periksa_p0.py langkah 2).
Pakai: python periksa_konsistensi.py SUMBER SEL.csv -- <argumen muat su1m>
Keluar 1 bila ada kegagalan rentang; tanda antar-tahun dilaporkan, tidak menggagalkan."""
import csv, os, statistics, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uji"))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import su1m
pisah = sys.argv.index("--"); sumber, sel = sys.argv[1:pisah]
A, prev, _ = su1m.muat(sys.argv[pisah + 1:])
sah = {r["kode_bps"] for r in csv.DictReader(open(sel, encoding="utf-8"))}
A = {k: v for k, v in A.items() if k in sah}
luar = sorted(k for k, v in A.items() if not 0 <= v <= 100)
beda = {k: A[k] - prev[k] for k in A if k in prev}
tanda = []
if len(beda) > 2:
    m, sd = statistics.mean(beda.values()), statistics.pstdev(beda.values())
    tanda = sorted((k, round(prev[k], 2), A[k], round(d, 2)) for k, d in beda.items() if sd and abs(d - m) > 3 * sd)
    print(f"{sumber}: {len(A)} sel; rentang gagal {len(luar)} {luar}; beda antar-tahun n={len(beda)} rata {m:.2f} sb {sd:.2f}; "
          f"ditandai >3 sb: {len(tanda)}")
else:
    print(f"{sumber}: {len(A)} sel; rentang gagal {len(luar)} {luar}; beda antar-tahun tidak bisa dihitung (tahun sebelumnya {len(beda)} sel)")
for t in tanda: print("   tanda:", t)
sys.exit(1 if luar else 0)
