#!/usr/bin/env python3
"""Commit hanya bila gerbang deterministik lulus (penjaga mekanis atas insiden 13 Nov: dua commit terkirim dengan
gerbang gagal, satu penimpaan berkas beku). Dipakai sesi pembangun sebagai ganti `git commit` langsung.
Pakai: python3 mesin/alat/commit_aman.py "pesan commit"   (dijalankan dari akar repo; berkas sudah di-`git add`)"""
import os, subprocess, sys
akar = subprocess.run(["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True).stdout.strip()
g = subprocess.run([sys.executable, os.path.join(akar, "mesin/alat/periksa_gerbang.py")], capture_output=True, text=True)
if g.returncode != 0:
    print(g.stdout[-800:], g.stderr[-400:]); sys.exit("COMMIT DITOLAK: gerbang deterministik gagal")
# Serahan baru (keluaran sambung, aturan, set uji) wajib membawa jejak cek niat (README "Disiplin per langkah").
staged = subprocess.run(["git", "diff", "--cached", "--name-only"], capture_output=True, text=True, cwd=akar).stdout.split()
if any(f.startswith(("mesin/sambung/", "mesin/uji/set_tahap/")) for f in staged) and "Kartu-niat:" not in sys.argv[1]:
    sys.exit('COMMIT DITOLAK: serahan tanpa baris "Kartu-niat: <kata kunci> · <KEPUTUSAN yang dicek> · <kode tayang serupa>" (jalankan mesin/alat/cek_niat.py dulu)')
pesan = sys.argv[1] + "\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01JZPjjr3cEST9SPkxZSaHrr"
sys.exit(subprocess.run(["git", "commit", "-q", "-m", pesan]).returncode)
