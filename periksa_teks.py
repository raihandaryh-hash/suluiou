#!/usr/bin/env python3
"""Periksa pola teks yang ditolak di copy Sulu (aturan Raihan dan lantai penulisan).
Pakai: python3 periksa_teks.py <berkas atau folder> [...]. Keluar 1 bila ada temuan.
Pola: antitesis "X, bukan Y" dan kerabatnya, kalimat berawalan Dan/Atau.
Tanda pisah panjang hanya dihitung dan dilaporkan (Raihan 16 Nov 2026 21.37: tidak mutlak terlarang)."""
import json, os, re, sys
POLA = [
    (r",\s*bukan\b", "antitesis ', bukan'"),
    (r"\bbukan (sekadar|hanya|cuma)\b", "antitesis 'bukan sekadar/hanya'"),
    (r"\btidak (hanya|sekadar)\b", "antitesis 'tidak hanya'"),
    (r"(^|[.!?]\s+)(Dan|Atau)\b", "kalimat berawalan Dan/Atau"),
]
def teks(path):
    if path.endswith(".json"):
        def jalan(o):
            if isinstance(o, str): yield o
            elif isinstance(o, dict):
                for v in o.values(): yield from jalan(v)
            elif isinstance(o, list):
                for v in o: yield from jalan(v)
        yield from jalan(json.load(open(path, encoding="utf-8")))
    else:
        for baris in open(path, encoding="utf-8"):
            b = baris.strip()
            if b.startswith("//") or b.startswith("*") or b.startswith("/*"): continue
            yield from re.findall(r"'((?:[^'\\\\]|\\\\.)*)'|\"((?:[^\"\\\\]|\\\\.)*)\"", b) and [m[0] or m[1] for m in re.findall(r"'((?:[^'\\\\]|\\\\.)*)'|\"((?:[^\"\\\\]|\\\\.)*)\"", b)]
def berkas(args):
    for a in args:
        if os.path.isdir(a):
            for d, _, fs in os.walk(a):
                for f in fs:
                    if f.endswith((".json", ".ts", ".tsx")): yield os.path.join(d, f)
        else: yield a
n = 0
pisah = 0
for f in berkas(sys.argv[1:]):
    for t in teks(f):
        pisah += len(re.findall(r"\u2014", t))
        for p, nama in POLA:
            if re.search(p, t):
                n += 1; print(f"{f}: {nama}: {t[:110]}")
print(f"temuan {n} · tanda pisah panjang {pisah} (laporan saja)")
sys.exit(1 if n else 0)
