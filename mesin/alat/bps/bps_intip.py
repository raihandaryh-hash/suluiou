"""Intip variabel BPS nasional: judul, label wilayah, jumlah wilayah, turunan variabel, tahun terbaru. Tidak menyimpan.
Pakai: python bps_intip.py 0000 1186,2654,2655"""
import json, sys, time, os
sys.path.insert(0, os.path.dirname(__file__))
from bps import ambil
dom = sys.argv[1]
for v in sys.argv[2].split(","):
    try:
        t = json.loads(ambil(f"list/model/th/lang/ind/domain/{dom}/var/{v}"))
        ths = sorted(((int(x["th"]), x["th_id"]) for x in t["data"][1] if str(x["th"]).isdigit()), reverse=True)
        j = json.loads(ambil(f"list/model/data/lang/ind/domain/{dom}/var/{v}/th/{ths[0][1]}"))
        print(v, "|", j["var"][0]["label"][:120], "| wilayah:", j.get("labelvervar"), len(j["vervar"]), "| turvar:",
              [x["label"][:20] for x in j["turvar"]][:6], "| tahun:", [x[0] for x in ths[:4]])
    except Exception as e:
        print(v, "galat", str(e)[:80])
    time.sleep(1.5)
