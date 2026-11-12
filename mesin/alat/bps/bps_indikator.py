"""Panen satu indikator kab/kota dari BPS WebAPI dalam dua terbitan terpisah:
  A = tabel nasional (domain 0000, var tertentu), B = tabel provinsi (domain provinsi, dicari lewat kata kunci + pola judul).
Berkas mentah: MESIN\\mentah\\bps\\<domain>_<ind>_<var>_<tahun>.json (kunci dihapus, lihat bps.py).
Pakai: python bps_indikator.py IND VAR_NASIONAL KATA_KUNCI "POLA_WAJIB" "POLA_TOLAK" [TAHUN_MAKS]
Contoh: python bps_indikator.py airminum 2830 "air%20minum" "air minum layak" "provinsi dan|klasifikasi|kuintil|berkelanjutan|aman"
"""
import json, os, re, sys, time, hashlib
sys.path.insert(0, os.path.dirname(__file__))
from bps import ambil, bersih
IND, VAR, KATA, WAJIB, TOLAK = sys.argv[1:6]; THMAX = int(sys.argv[6]) if len(sys.argv) > 6 else 2100
AKAR = os.path.join(os.path.dirname(__file__), "..", "mentah", "bps")
def j(jalur):
    for c in range(3):
        try: return json.loads(ambil(jalur))
        except Exception as e: print("  ulang", c + 1, jalur.split("/key")[0][:80], bersih(str(e))[:80]); time.sleep(15 * (c + 1))
    return {}
def tahun(dom, var, n=2):
    t = j(f"list/model/th/lang/ind/domain/{dom}/var/{var}")
    if t.get("data-availability") != "available": return []
    return sorted(((int(x["th"]), x["th_id"]) for x in t["data"][1] if str(x["th"]).isdigit() and int(x["th"]) <= THMAX), reverse=True)[:n]
def simpan(dom, var, th, thid):
    s = None
    for c in range(4):
        try: s = ambil(f"list/model/data/lang/ind/domain/{dom}/var/{var}/th/{thid}"); break
        except Exception as e: print("  ulang data", c + 1, dom, var, th, str(e)[:60]); time.sleep(20 * (c + 1))
    if s is None: print(dom, IND, var, th, "GAGAL", flush=True); return
    nama = f"{dom}_{IND}_{var}_{th}.json"; open(os.path.join(AKAR, nama), "w", encoding="utf-8").write(s)
    ok = json.loads(s).get("data-availability"); print(dom, IND, var, th, ok, hashlib.sha256(s.encode()).hexdigest()[:12], flush=True)
for th, thid in tahun("0000", VAR): simpan("0000", VAR, th, thid)
D = json.load(open(os.path.join(AKAR, "_domain_all.json"), encoding="utf-8"))["data"][1]
for d in D:
    dom = d["domain_id"]
    if not dom.endswith("00") or dom == "0000": continue
    hal, var = 1, []
    while True:
        r = j(f"list/model/var/lang/ind/domain/{dom}/keyword/{KATA}/page/{hal}")
        if r.get("data-availability") != "available": break
        var += [v for v in r["data"][1] if re.search(WAJIB, v["title"], re.I) and re.search(r"kab|kota", v["title"], re.I) and not re.search(TOLAK, v["title"], re.I)]
        if hal >= r["data"][0]["pages"]: break
        hal += 1
    if not var: print(dom, d["domain_name"], IND, "TIDAK DITEMUKAN", flush=True)
    for v in var:
        for th, thid in tahun(dom, v["var_id"]): simpan(dom, v["var_id"], th, thid)
    time.sleep(1.0)
print("selesai", time.strftime("%Y-%m-%d %H:%M:%S"))
