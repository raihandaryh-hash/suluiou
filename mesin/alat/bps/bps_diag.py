"""Diagnosa: tampilkan judul variabel kandidat untuk provinsi yang belum punya pilihan. Tidak menyimpan apa pun.
Pakai: python bps_diag.py 1700,1800 miskin"""
import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from bps import ambil
for dom in sys.argv[1].split(","):
    for kata in sys.argv[2].split(","):
        hal, n = 1, 0
        while True:
            j = json.loads(ambil(f"list/model/var/lang/ind/domain/{dom}/keyword/{kata}/page/{hal}"))
            if j.get("data-availability") != "available": print(dom, kata, "kosong"); break
            for v in j["data"][1]:
                n += 1; print(dom, kata, v["var_id"], v["title"][:95])
            if hal >= j["data"][0]["pages"]: break
            hal += 1
