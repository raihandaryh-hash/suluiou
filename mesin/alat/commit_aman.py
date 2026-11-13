#!/usr/bin/env python3
"""Commit hanya bila gerbang deterministik lulus (penjaga mekanis atas insiden 13 Nov: dua commit terkirim dengan
gerbang gagal, satu penimpaan berkas beku). Dipakai sesi pembangun sebagai ganti `git commit` langsung.
Pakai: python3 mesin/alat/commit_aman.py "pesan commit"   (dijalankan dari akar repo; berkas sudah di-`git add`)"""
import os, subprocess, sys
akar = subprocess.run(["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True).stdout.strip()
g = subprocess.run([sys.executable, os.path.join(akar, "mesin/alat/periksa_gerbang.py")], capture_output=True, text=True)
if g.returncode != 0:
    print(g.stdout[-800:], g.stderr[-400:]); sys.exit("COMMIT DITOLAK: gerbang deterministik gagal")
pesan = sys.argv[1] + "\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01JZPjjr3cEST9SPkxZSaHrr"
sys.exit(subprocess.run(["git", "commit", "-q", "-m", pesan]).returncode)
