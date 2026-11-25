"""Panen mentah Indeks Desa (Kemendesa, https://sid.kemendesa.go.id/indeks-desa) lewat titik data JSON publik
yang dipakai laman itu sendiri: /indeks-desa/data?tahun=T&kode=K. Tanpa kunci, pemeriksaan TLS menyala.
Pakai: python sid_panen.py 2025  -> MESIN\\mentah\\sid\\<tahun>_<kode>.json + manifest.csv"""
import csv, hashlib, json, os, sys, time, urllib.request
T = sys.argv[1] if len(sys.argv) > 1 else "2025"
AKAR = os.path.join(os.path.dirname(__file__), "..", "mentah", "sid"); os.makedirs(AKAR, exist_ok=True)
DASAR = "https://sid.kemendesa.go.id/indeks-desa"
def ambil(jalur):
    req = urllib.request.Request(DASAR + jalur, headers={"Accept": "application/json", "User-Agent": "Sulu-Mesin-Eksplorasi/0.1 (IOU Indonesia)"})
    for coba in range(3):
        try:
            with urllib.request.urlopen(req, timeout=90) as r: return r.read()
        except Exception as e:
            print("  ulang", coba + 1, jalur, str(e)[:100]); time.sleep(3)
    raise SystemExit("gagal: " + jalur)
def simpan(nama, b):
    open(os.path.join(AKAR, nama), "wb").write(b); return hashlib.sha256(b).hexdigest()
prov = json.loads(ambil(f"/wilayah?tahun={T}&induk="))
baris = []
b = ambil(f"/data?tahun={T}&kode="); baris.append(["nasional", "", simpan(f"{T}_nasional.json", b), len(b)])
for p in prov:
    b = ambil(f"/data?tahun={T}&kode={p['kode']}")
    j = json.loads(b); n = len((j.get("anak") or {}).get("baris") or [])
    sha = simpan(f"{T}_{p['kode']}.json", b); baris.append([p["kode"], p["nama"], sha, len(b)])
    print(p["kode"], p["nama"], "kab/kota:", n, "final:", j.get("tahun_final"), "sementara:", j.get("sementara"), sha[:12]); time.sleep(0.5)
with open(os.path.join(AKAR, f"manifest_{T}.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(["kode", "nama", "sha256", "bita"]); w.writerows(baris)
print("provinsi:", len(prov), "berkas:", len(baris), time.strftime("%Y-%m-%d %H:%M:%S"))
