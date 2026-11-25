"""Panen publikasi kedua dari domain BPS kabupaten/kota (bukan provinsi), untuk sel yang belum berpasangan.
Berkas: MESIN\\mentah\\bps_kab\\<dom>_<ind>_<var>_<th>.json. Kunci tidak pernah dicetak (lihat bps.py).
Pakai: python bps_kab_panen.py IND KATA_KUNCI "POLA_WAJIB" "POLA_TOLAK" PREFIKS_PROV(koma) TAHUN(koma)
Contoh: python bps_kab_panen.py p0 "penduduk%20miskin" "persentase penduduk miskin|p0" "ekstrem|usia" 17,21,33,94 2025
Lingkungan LANJUT=1: domain yang sudah punya berkas <dom>_<IND>_* dilewati (melanjutkan panen yang terputus, mis. laptop
tidur). Tanpa LANJUT, semua domain diminta ulang dan berkas lama ditimpa."""
import glob, hashlib, json, os, re, sys, time
sys.path.insert(0, os.path.dirname(__file__))
from bps import ambil, bersih
IND, KATA, WAJIB, TOLAK, PROV, TH = sys.argv[1:7]; PROV = PROV.split(","); TH = TH.split(",")
AKAR = os.path.join(os.path.dirname(__file__), "..", "mentah", "bps_kab"); os.makedirs(AKAR, exist_ok=True)
LANJUT = os.environ.get("LANJUT") == "1"
def j(jalur):
    for c in range(4):
        try: return json.loads(ambil(jalur))
        except Exception as e: print("  ulang", c + 1, bersih(str(e))[:80], flush=True); time.sleep(15 * (c + 1))
    return {}
D = json.load(open(os.path.join(AKAR, "..", "bps", "_domain_all.json"), encoding="utf-8"))["data"][1]
n_dom = n_simpan = n_lewat = 0
for d in D:
    dom = d["domain_id"]
    if dom.endswith("00") or dom[:2] not in PROV: continue
    if LANJUT and glob.glob(os.path.join(AKAR, f"{dom}_{IND}_*.json")): n_lewat += 1; continue
    n_dom += 1
    r = j(f"list/model/var/lang/ind/domain/{dom}/keyword/{KATA}/page/1")
    var = [v for v in (r["data"][1] if r.get("data-availability") == "available" else [])
           if re.search(WAJIB, v["title"], re.I) and not re.search(TOLAK, v["title"], re.I)]
    if not var: print(dom, d["domain_name"], "TIDAK DITEMUKAN", flush=True)
    for v in var:
        t = j(f"list/model/th/lang/ind/domain/{dom}/var/{v['var_id']}")
        peta = {str(x["th"]): x["th_id"] for x in t["data"][1]} if t.get("data-availability") == "available" else {}
        for th in TH:
            if th not in peta: continue
            s = None
            for c in range(4):
                try: s = ambil(f"list/model/data/lang/ind/domain/{dom}/var/{v['var_id']}/th/{peta[th]}"); break
                except Exception as e: time.sleep(20 * (c + 1))
            if s is None: print(dom, v["var_id"], th, "GAGAL", flush=True); continue
            nama = f"{dom}_{IND}_{v['var_id']}_{th}.json"; open(os.path.join(AKAR, nama), "w", encoding="utf-8").write(s); n_simpan += 1
            print(nama, d["domain_name"], "|", v["title"][:70], hashlib.sha256(s.encode()).hexdigest()[:12], flush=True)
    time.sleep(1.0)
print("selesai", n_dom, "domain,", n_simpan, "berkas,", n_lewat, "dilewati (LANJUT)", time.strftime("%Y-%m-%d %H:%M:%S"))
