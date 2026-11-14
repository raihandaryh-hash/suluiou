"""Ambil satu tabel BPS (domain, var, tahun) ke MESIN\\mentah\\<folder>\\<dom>_<ind>_<var>_<th>.json. Kunci tidak pernah dicetak.
Pakai: python bps_ambil_satu.py FOLDER DOM IND VAR TAHUN [TAHUN ...]"""
import hashlib, json, os, sys, time
sys.path.insert(0, os.path.dirname(__file__))
from bps import ambil, bersih
folder, dom, ind, var = sys.argv[1:5]; tahun = sys.argv[5:]
AKAR = os.path.join(os.path.dirname(__file__), "..", "mentah", folder); os.makedirs(AKAR, exist_ok=True)
t = json.loads(ambil(f"list/model/th/lang/ind/domain/{dom}/var/{var}"))
peta = {str(x["th"]): x["th_id"] for x in t["data"][1]} if t.get("data-availability") == "available" else {}
for th in tahun:
    if th not in peta: print(dom, ind, var, th, "tahun tidak tersedia"); continue
    for c in range(4):
        try: s = ambil(f"list/model/data/lang/ind/domain/{dom}/var/{var}/th/{peta[th]}"); break
        except Exception as e: print("  ulang", c + 1, bersih(str(e))[:80]); time.sleep(20 * (c + 1))
    else: print(dom, ind, var, th, "GAGAL"); continue
    nama = f"{dom}_{ind}_{var}_{th}.json"; open(os.path.join(AKAR, nama), "w", encoding="utf-8").write(s)
    print(nama, json.loads(s).get("data-availability"), hashlib.sha256(s.encode()).hexdigest()[:12])
