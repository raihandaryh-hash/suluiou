"""Panen mentah BPS WebAPI, putaran titipan 16 Nov 2026:
  gk   = garis kemiskinan menurut kabupaten/kota, dari tiap domain provinsi (dua tahun terakhir);
  tpt2 = TPT kab/kota untuk domain yang tidak ketemu di panen pertama (aturan dilonggarkan);
  catatan definisi/note tiap tabel ikut tersimpan karena JSON mentah disimpan utuh.
Keluaran: MESIN\\mentah\\bps_gk\\<dom>_<ind>_<var>_<th>.json + manifest_gk.csv + panen_gk.log.
Tidak menimpa mentah\\bps\\manifest.csv. Kunci tidak pernah dicetak (lihat bps.py)."""
import csv, hashlib, json, os, re, sys, time
sys.path.insert(0, os.path.dirname(__file__))
from bps import ambil, bersih

AKAR = os.path.join(os.path.dirname(__file__), "..", "mentah", "bps_gk")
os.makedirs(AKAR, exist_ok=True)
LOG = open(os.path.join(AKAR, "panen_gk.log"), "a", encoding="utf-8")
def log(*a):
    s = " ".join(str(x) for x in a); print(s); LOG.write(s + "\n"); LOG.flush()

KAB = r"kabupaten|kab/kota|kab\.?/kota|kab\. ?/ ?kota"
ATURAN = {
    "gk": dict(kata=["garis kemiskinan"], wajib=[r"garis kemiskinan", KAB],
               tolak=[r"makanan", r"rumah tangga", r"semester|september", r"perkotaan|perdesaan|desa/kota"], semua=True),
    "tpt2": dict(kata=["pengangguran"], wajib=[r"pengangguran terbuka|\btpt\b", KAB],
                 tolak=[r"pendidikan", r"umur|kelompok"], semua=False),
}
TPT_HILANG = {"1200", "1600", "1700", "2100", "5100", "6300", "7100", "7300", "7500", "9200", "9500", "9600", "9700", "9800", "9900"}

def json_api(jalur):
    for coba in range(3):
        try:
            return json.loads(ambil(jalur))
        except Exception as e:
            log("  ulang", coba + 1, bersih(str(e))[:120]); time.sleep(3)
    return None

def semua_var(dom, kata):
    hasil, hal = [], 1
    while True:
        j = json_api(f"list/model/var/lang/ind/domain/{dom}/keyword/{kata.replace(' ', '%20')}/page/{hal}")
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
        if not a["semua"] and dom not in TPT_HILANG: continue
        cand = []
        for k in a["kata"]:
            for v in semua_var(dom, k):
                t = v["title"].lower()
                if all(re.search(w, t) for w in a["wajib"]) and not any(re.search(x, t) for x in a["tolak"]):
                    cand.append(v)
        uniq = {v["var_id"]: v for v in cand}
        if not uniq:
            log(dom, nama, ind, "TIDAK DITEMUKAN"); baris.append([dom, nama, ind, "", "", "", "", "", "tidak_ditemukan"]); continue
        for vid, v in list(uniq.items())[:3]:
            tj = json_api(f"list/model/th/lang/ind/domain/{dom}/var/{vid}")
            ths = sorted(((int(t["th"]), t["th_id"]) for t in (tj or {}).get("data", [None, []])[1] if str(t.get("th", "")).isdigit()), reverse=True) if tj and tj.get("data-availability") == "available" else []
            if not ths:
                baris.append([dom, nama, ind, vid, v["title"], "", "", "", "tanpa_tahun"]); continue
            for th, thid in ths[:2]:
                try:
                    teks = ambil(f"list/model/data/lang/ind/domain/{dom}/var/{vid}/th/{thid}")
                except Exception as e:
                    log(dom, ind, vid, th, "galat", bersih(str(e))[:80]); continue
                sha, n = simpan(f"{dom}_{ind}_{vid}_{th}.json", teks)
                ok = json.loads(teks).get("data-availability", "")
                baris.append([dom, nama, ind, vid, v["title"], th, sha, n, ok])
                log(dom, nama, ind, vid, th, ok, sha[:12])
        time.sleep(0.3)
with open(os.path.join(AKAR, "manifest_gk.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(["domain", "provinsi", "indikator", "var_id", "judul", "tahun", "sha256", "bita", "status"]); w.writerows(baris)
log(time.strftime("%Y-%m-%d %H:%M:%S"), "selesai:", len(baris), "baris manifest")
