#!/usr/bin/env python3
"""periksa_turunan.py: penjaga "menunjuk, bukan meringkas" antara dokumen sumber dan turunannya.

  periksa_turunan.py <turunan.md> <sumber1.md> [<sumber2.md> ...] [--awalan BT,B,U,V]

Dari sumber diambil baris tabel yang kolom pertamanya sebuah nomor butir (mis. BT7, B11, U12)
beserta kutipan di baris itu (di antara "…" atau «…»). Untuk tiap butir dilaporkan:
  HILANG    nomor butir tidak disebut sama sekali di turunan
  RINGKASAN nomor disebut, tetapi tak satu pun kutipan sumbernya ikut (isi ditulis ulang
            atau hanya dirujuk; pembaca turunan tidak melihat kata asli)
  UTUH      nomor disebut dan paling sedikit satu kutipan sumber ikut persis
Keluar 1 bila ada HILANG. RINGKASAN bukan galat bila turunan memang hanya daftar rujukan;
ia menjadi galat begitu turunan dipakai sebagai dasar kerja atau diajukan ke Raihan.
"""
import re, sys
a = sys.argv[1:]
awalan = a[a.index("--awalan") + 1].split(",") if "--awalan" in a else ["BT", "B", "U", "V"]
berkas = [x for i, x in enumerate(a) if not x.startswith("--") and (i == 0 or a[i - 1] != "--awalan")]
if len(berkas) < 2:
    print(__doc__); sys.exit(2)
try: sys.stdout.reconfigure(encoding="utf-8")
except Exception: pass
n = lambda s: " ".join(s.replace("\\", "").split())
turunan = n(open(berkas[0], encoding="utf-8").read())
rx_id = re.compile(r"^\|\s*\**((?:%s)\d+)\**\s*\|(.*)$" % "|".join(sorted(awalan, key=len, reverse=True)))
butir = {}
for s in berkas[1:]:
    for baris in open(s, encoding="utf-8"):
        m = rx_id.match(baris)
        if not m: continue
        kol = m.group(2).split("|")[0]
        kut = [n(q) for q in re.findall(r'"([^"]{15,})"|«([^»]{15,})»', kol) for q in q if q]
        butir.setdefault(m.group(1), []).extend(kut)
hasil = {"HILANG": [], "RINGKASAN": [], "UTUH": []}
for k, kut in butir.items():
    if not re.search(r"(?<![A-Za-z0-9])%s(?![0-9])" % re.escape(k), turunan):
        hasil["HILANG"].append(k)
    elif any(q[:60] in turunan for q in kut):
        hasil["UTUH"].append(k)
    else:
        hasil["RINGKASAN"].append(k)
print(f"butir sumber: {len(butir)}; turunan: {berkas[0]}")
for s in ("HILANG", "RINGKASAN", "UTUH"):
    print(f"{s} {len(hasil[s])}: {', '.join(hasil[s])}")
sys.exit(1 if hasil["HILANG"] else 0)
