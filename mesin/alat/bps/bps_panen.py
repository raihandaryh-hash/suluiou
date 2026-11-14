"""Panen mentah BPS WebAPI: P0 (persentase penduduk miskin) dan TPT per kab/kota, dari tiap domain provinsi.
Angka tidak diolah di sini; berkas JSON mentah disimpan apa adanya (kunci dihapus) beserta sha256.
Pakai: python bps_panen.py   -> MESIN\\mentah\\bps\\ + manifest.csv + panen.log
Kunci tidak pernah dicetak (lihat bps.py)."""
import csv, hashlib, json, os, re, sys, time
sys.path.insert(0, os.path.dirname(__file__))
from bps import ambil, bersih

AKAR = os.path.join(os.path.dirname(__file__), "..", "mentah", "bps")
os.makedirs(AKAR, exist_ok=True)
LOG = open(os.path.join(AKAR, "panen.log"), "a", encoding="utf-8")
def log(*a):
    s = " ".join(str(x) for x in a); print(s); LOG.write(s + "\n"); LOG.flush()

ATURAN = {
    "p0": dict(kata=["miskin"], wajib=[r"persentase penduduk miskin", r"kabupaten|kab/kota|kab\.?/kota"],
               tolak=[r"klasifikasi", r"rumah tangga", r"semester", r"desa/kota|perkotaan|perdesaan"]),
    "tpt": dict(kata=["pengangguran"], wajib=[r"tingkat pengangguran terbuka|\btpt\b", r"kabupaten|kab/kota|kab\.?/kota"],
                tolak=[r"pendidikan", r"umur", r"jenis kelamin", r"daerah tempat", r"tipe daerah"]),
}

def json_api(jalur):
    for coba in range(3):
        try:
            return json.loads(ambil(jalur))
        except Exception as e:
            log("  ulang", coba + 1, jalur.split("/key")[0], bersih(str(e))[:120]); time.sleep(3)
    return None

def semua_var(dom, kata):
    hasil, hal = [], 1
    while True:
        j = json_api(f"list/model/var/lang/ind/domain/{dom}/keyword/{kata}/page/{hal}")
        if not j or j.get("data-availability") != "available": break
        hasil += j["data"][1]
        if hal >= j["data"][0]["pages"]: break
        hal += 1
    return hasil

def simpan(nama, teks):
    p = os.path.join(AKAR, nama); b = teks.encode("utf-8")
    open(p, "wb").write(b); return hashlib.sha256(b).hexdigest(), len(b)

dj = json_api("list/model/domain/lang/ind/type/prov") or json_api("domain/type/prov")
prov = [(d["domain_id"], d["domain_name"]) for d in dj["data"][1]]
log(time.strftime("%Y-%m-%d %H:%M:%S"), "provinsi:", len(prov))
baris = []
for dom, nama in prov:
    for ind, a in ATURAN.items():
        cand = []
        for k in a["kata"]:
            for v in semua_var(dom, k):
                t = v["title"].lower()
                if all(re.search(w, t) for w in a["wajib"]) and not any(re.search(x, t) for x in a["tolak"]):
                    cand.append(v)
        uniq = {v["var_id"]: v for v in cand}
        if not uniq:
            log(dom, nama, ind, "TIDAK DITEMUKAN"); baris.append([dom, nama, ind, "", "", "", "", "", "tidak_ditemukan"]); continue
        for vid, v in uniq.items():
            tj = json_api(f"list/model/th/lang/ind/domain/{dom}/var/{vid}")
            ths = sorted(((int(t["th"]), t["th_id"]) for t in (tj or {}).get("data", [None, []])[1] if str(t.get("th", "")).isdigit()), reverse=True) if tj and tj.get("data-availability") == "available" else []
            if not ths:
                baris.append([dom, nama, ind, vid, v["title"], "", "", "", "tanpa_tahun"]); continue
            for th, thid in ths[:2]:
                teks = ambil(f"list/model/data/lang/ind/domain/{dom}/var/{vid}/th/{thid}")
                sha, n = simpan(f"{dom}_{ind}_{vid}_{th}.json", teks)
                ok = json.loads(teks).get("data-availability", "")
                baris.append([dom, nama, ind, vid, v["title"], th, sha, n, ok])
                log(dom, nama, ind, vid, th, ok, sha[:12])
        time.sleep(0.3)
with open(os.path.join(AKAR, "manifest.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(["domain", "provinsi", "indikator", "var_id", "judul", "tahun", "sha256", "bita", "status"]); w.writerows(baris)
log(time.strftime("%Y-%m-%d %H:%M:%S"), "selesai:", len(baris), "baris manifest")
