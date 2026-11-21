#!/usr/bin/env python3
"""Gerbang G1.2 (reproduksi): jalankan pengurai dua kali dari gudang mentah, di dua proses terpisah, ke dua berkas
keluaran baru, lalu bandingkan sidik sha256 berkas L3. Sidik yang dicatat di kontrak (properti `sidik_l3`) adalah
12 karakter pertama sha256 berkas CSV keluaran.
Pakai: python reproduksi_l3.py NAMA_SUMBER PENGURAI.py ARG1 ... {OUT} ...
  {OUT} diganti path keluaran sementara. Keluar 1 bila dua jalan berbeda.
Contoh: python reproduksi_l3.py kemiskinan parser/dikk_2025.py mentah/bps-pub/DIKK-2025.pdf mentah/bps/_domain_all.json {OUT}"""
import hashlib, os, subprocess, sys, tempfile
nama, pengurai, args = sys.argv[1], sys.argv[2], sys.argv[3:]
if "{OUT}" not in args: sys.exit("argumen wajib memuat {OUT}")
sidik = []
with tempfile.TemporaryDirectory() as d:
    for i in (1, 2):
        out = os.path.join(d, f"l3_{i}.csv")
        r = subprocess.run([sys.executable, "-I", pengurai] + [out if a == "{OUT}" else a for a in args],
                           capture_output=True, text=True)
        if r.returncode != 0 or not os.path.exists(out):
            sys.exit(f"{nama}: jalan {i} gagal (kode {r.returncode}): {r.stderr.strip()[-300:]}")
        sidik.append(hashlib.sha256(open(out, "rb").read()).hexdigest())
print(f"{nama}: jalan1 {sidik[0][:12]} · jalan2 {sidik[1][:12]} → {'identik' if sidik[0] == sidik[1] else 'BERBEDA'}")
sys.exit(0 if sidik[0] == sidik[1] else 1)
