#!/usr/bin/env python3
"""uji_balik.py: untuk tiap arahan lama, cari pesan Raihan SESUDAH tanggal arahan yang
menyebut hal yang sama, supaya terlihat apakah arahan itu pernah diubah atau dicabut.

  uji_balik.py <daftar.tsv> <register_raihan.jsonl> [<giliran_dua_sisi.jsonl>] [--tampil N] [--lebar N]

daftar.tsv: id <TAB> tanggal arahan (YYYY-MM-DD) <TAB> regex
Keluaran per butir: jumlah pesan Raihan sesudah tanggal itu (register), jumlah giliran
asisten sesudahnya (riwayat dua sisi, bila diberi), dan N pesan Raihan TERAKHIR yang kena.
Nol kena = tidak ada jejak perubahan dalam rentang sumber, bukan bukti mutlak.
"""
import json, re, sys
a = sys.argv[1:]
def opsi(n, b): return int(a[a.index(n) + 1]) if n in a else b
tampil, lebar = opsi("--tampil", 3), opsi("--lebar", 150)
berkas = [x for i, x in enumerate(a) if not x.startswith("--") and (i == 0 or a[i - 1] not in ("--tampil", "--lebar"))]
try: sys.stdout.reconfigure(encoding="utf-8")
except Exception: pass
muat = lambda p: [json.loads(b) for b in open(p, encoding="utf-8") if b.strip()]
REG = muat(berkas[1])
DUA = muat(berkas[2]) if len(berkas) > 2 else []
w = sorted(r["waktu"] for r in REG if r.get("waktu"))
print(f"register: {len(REG)} pesan Raihan, {w[0][:10]} s.d. {w[-1][:10]}; dua sisi: {len(DUA)} giliran")
for baris in open(berkas[0], encoding="utf-8"):
    if not baris.strip() or baris.startswith("#"): continue
    kid, tgl, pola = baris.rstrip("\n").split("\t")
    rx = re.compile(pola, re.I | re.S)
    kena = sorted(((r, m) for r in REG if r.get("waktu", "")[:10] > tgl for m in [rx.search(r["teks"])] if m),
                  key=lambda x: x[0]["waktu"])
    asis = sum(1 for r in DUA if r["peran"] == "assistant" and r["waktu"][:10] > tgl and rx.search(r["teks"]))
    print(f"\n== {kid} (arahan {tgl}) /{pola}/ : Raihan sesudahnya {len(kena)}; asisten sesudahnya {asis}")
    for r, m in kena[-tampil:]:
        s, e = max(0, m.start() - lebar), min(len(r["teks"]), m.end() + lebar)
        print(f"   [{r['waktu'][:10]} {r['chat'][:8]}] …{' '.join(r['teks'][s:e].split())}…")
