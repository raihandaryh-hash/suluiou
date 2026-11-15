#!/usr/bin/env python3
"""Cari ucapan Raihan di arsip pesan (register 3.059 pesan) sebelum menyebut sebuah rancangan lama 'usang', 'tidak pernah
diminta', atau 'baru'. Dijalankan di laptop; salinannya di MESIN\\alat\\cari_register.py.
ATURAN (lahir 15 Nov 2026 14.06, sesudah pencarian web dicap usang padahal Raihan memintanya 24 Apr, 5 Jun, 6 Jun, 12 Jun):
tidak ada rancangan lama yang boleh dicap usang atau baru di dokumen mesin tanpa keluaran skrip ini dikutip di dokumen yang sama.
pakai: python cari_register.py POLA_WAJIB POLA_KEDUA MAKS_HASIL LEBAR"""
import json, re, sys, os
p1, p2, maks, lebar = re.compile(sys.argv[1], re.I), re.compile(sys.argv[2], re.I), int(sys.argv[3]), int(sys.argv[4])
f = os.environ.get("REGISTER_RAIHAN", r"C:\Users\p\Documents\IOU\Foresight\Sulu Build\Audit-Nov2026\MESIN\mentah\riwayat\p1b\REGISTER_giliran-Raihan.jsonl")
n = 0
for l in open(f, encoding="utf-8"):
    r = json.loads(l); t = r.get("teks") or ""
    for m in p1.finditer(t):
        s = t[max(0, m.start() - lebar):min(len(t), m.end() + lebar)]
        if p2.search(s):
            n += 1
            print(f"## {r.get('waktu','')[:16]} chat {str(r.get('chat',''))[:8]} g{r.get('giliran')}\n{s.replace(chr(10),' ')}\n")
            break
    if n >= maks: break
print("hasil", n)
