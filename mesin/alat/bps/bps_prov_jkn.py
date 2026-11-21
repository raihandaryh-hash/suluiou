"""G1.3 (tingkat konsistensi) untuk BPS var 2279 (persentase penduduk ber-JKN menurut provinsi, Susenas Maret 2025):
cari tabel di domain BPS provinsi yang memuat persentase penduduk berjaminan kesehatan 2025, ambil baris total provinsi,
cocokkan dengan nilai var 2279. Kunci tidak pernah dicetak (bps.py). Jalan di laptop: MESIN\\alat\\.
Pakai: python bps_prov_jkn.py   -> MESIN\\mentah\\bps_prov_jkn\\*.json + _cocok.csv (dicetak juga)"""
import csv, hashlib, json, os, re, sys, time
sys.path.insert(0, os.path.dirname(__file__))
from bps import ambil, bersih
AKAR = os.path.join(os.path.dirname(__file__), "..", "mentah", "bps_prov_jkn"); os.makedirs(AKAR, exist_ok=True)
NAS = json.load(open(os.path.join(os.path.dirname(__file__), "..", "mentah", "prov", "0000_jkn_2279_2025.json"), encoding="utf-8"))
NILAI = {str(v["val"]): (v["label"], NAS["datacontent"].get(f"{v['val']}227901250")) for v in NAS["vervar"]}
WAJIB = re.compile(r"(?i)jaminan kesehatan|\bjkn\b|bpjs kesehatan")
TOLAK = re.compile(r"(?i)ketenagakerjaan|lansia|disabilitas|pekerja|rumah tangga|balita|ibu|anak|keluhan")
def j(jalur):
    for c in range(4):
        try: return json.loads(ambil(jalur))
        except Exception as e: print("  ulang", c + 1, bersih(str(e))[:80], flush=True); time.sleep(15 * (c + 1))
    return {}
def norm(s): return re.sub(r"[^a-z]", "", s.lower().replace("kep.", "kepulauan"))
hasil = []
for dom, (nama, nilai_nas) in sorted(NILAI.items()):
    if nilai_nas is None: continue
    calon = []
    for kata in ("jaminan%20kesehatan", "JKN"):
        r = j(f"list/model/var/lang/ind/domain/{dom}/keyword/{kata}/page/1")
        calon += [v for v in (r["data"][1] if r.get("data-availability") == "available" else [])
                  if WAJIB.search(v["title"]) and not TOLAK.search(v["title"]) and v["var_id"] not in {c["var_id"] for c in calon}]
    temu = []
    for v in calon[:6]:
        t = j(f"list/model/th/lang/ind/domain/{dom}/var/{v['var_id']}")
        peta = {str(x["th"]): x["th_id"] for x in t["data"][1]} if t.get("data-availability") == "available" else {}
        if "2025" not in peta: continue
        s = None
        for c in range(4):
            try: s = ambil(f"list/model/data/lang/ind/domain/{dom}/var/{v['var_id']}/th/{peta['2025']}"); break
            except Exception: time.sleep(20 * (c + 1))
        if s is None: continue
        berkas = f"{dom}_jkn_{v['var_id']}_2025.json"; open(os.path.join(AKAR, berkas), "w", encoding="utf-8").write(s)
        d = json.loads(s)
        if d.get("data-availability") != "available": continue
        prov = [str(x["val"]) for x in d["vervar"] if norm(x["label"]) in (norm(nama), norm("provinsi" + nama)) or str(x["val"]) in (dom, dom[:2], "9999")]
        for k, val in d["datacontent"].items():
            if any(k.startswith(p) for p in prov) and isinstance(val, (int, float)):
                temu.append((v["var_id"], v["title"][:80], k, val, berkas, hashlib.sha256(s.encode()).hexdigest()))
    cocok = [x for x in temu if abs(x[3] - nilai_nas) <= 0.011]
    st = "cocok" if cocok else ("berselisih" if temu else "tanpa_pasangan")
    pilih = cocok[0] if cocok else (temu[0] if temu else None)
    hasil.append({"kode_prov": dom, "nama": nama, "nilai_var2279": nilai_nas, "status": st,
                  "nilai_kedua": pilih[3] if pilih else "", "var_kedua": pilih[0] if pilih else "", "judul_kedua": pilih[1] if pilih else "",
                  "berkas": pilih[4] if pilih else "", "sha256": pilih[5] if pilih else "", "n_calon_angka": len(temu)})
    print(dom, nama, nilai_nas, st, pilih[3] if pilih else "-", (pilih[1] if pilih else "")[:60], flush=True)
    time.sleep(1.0)
with open(os.path.join(AKAR, "_cocok.csv"), "w", encoding="utf-8", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(hasil[0]), lineterminator="\n"); w.writeheader(); w.writerows(hasil)
n = {s: sum(h["status"] == s for h in hasil) for s in ("cocok", "berselisih", "tanpa_pasangan")}
print("ringkas", n, time.strftime("%Y-%m-%d %H:%M:%S"))
