#!/usr/bin/env python3
"""lampir_kutipan.py: menyusun lampiran kutipan asli secara mekanis (tanpa menulis ulang).

  lampir_kutipan.py <keluar.md> <judul> <sumber1.md> [<sumber2.md> ...] [--awalan U,V]

Tiap baris tabel sumber yang kolom pertamanya nomor butir disalin apa adanya: nomor dan
kolom kutipan. Tidak ada kata yang diubah. Pasangan alat: periksa_turunan.py.
"""
import re, sys
a = sys.argv[1:]
awalan = a[a.index("--awalan") + 1].split(",") if "--awalan" in a else ["BT", "B", "U", "V"]
b = [x for i, x in enumerate(a) if not x.startswith("--") and (i == 0 or a[i - 1] != "--awalan")]
rx = re.compile(r"^\|\s*\**((?:%s)\d+)\**\s*\|(.*)$" % "|".join(sorted(awalan, key=len, reverse=True)))
out = [f"# {b[1]}", "", "Disusun mesin oleh `mesin/alat/lampir_kutipan.py`; kolom kutipan disalin apa adanya dari sumber. Label: kutipan Raihan verbatim (sudah dicocokkan ke register saat berkas sumber dibuat); susunan = SINTESIS.", ""]
n = 0
for s in b[2:]:
    out += [f"## Sumber: `{s}`", "", "| Butir | Kutipan dan rujukan asli |", "|---|---|"]
    for baris in open(s, encoding="utf-8"):
        m = rx.match(baris)
        if m:
            sel = [c.strip() for c in m.group(2).split("|") if re.search(r"\[\d+\]", c) and re.search(r'"[^"]{15,}"|«[^»]{15,}»', c)]
            out.append(f"| {m.group(1)} | {' · '.join(sel) if sel else 'TANPA KUTIPAN TERBACA'} |"); n += 1
    out.append("")
open(b[0], "w", encoding="utf-8").write("\n".join(out) + "\n")
print(f"{n} butir ditulis ke {b[0]}")
