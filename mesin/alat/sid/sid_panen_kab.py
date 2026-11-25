"""Panen tingkat kab/kota Indeks Desa: /indeks-desa/data?tahun=T&kode=<kode kab> untuk tiap kab/kota di berkas provinsi.
Ringkasan kab/kota memuat kolom yang tidak ada di baris provinsi (BUMDes aktif, desa terdampak bencana, kajian risiko).
Pakai: python sid_panen_kab.py 2025 -> MESIN\\mentah\\sid\\kab\\<tahun>_<kode>.json + manifest_kab_<tahun>.csv"""
import csv, glob, hashlib, json, os, sys, time, urllib.request
T = sys.argv[1] if len(sys.argv) > 1 else "2025"
AKAR = os.path.join(os.path.dirname(__file__), "..", "mentah", "sid"); KAB = os.path.join(AKAR, "kab"); os.makedirs(KAB, exist_ok=True)
def ambil(kode):
    req = urllib.request.Request(f"https://sid.kemendesa.go.id/indeks-desa/data?tahun={T}&kode={kode}",
                                 headers={"Accept": "application/json", "User-Agent": "Sulu-Mesin-Eksplorasi/0.1 (IOU Indonesia)"})
    for coba in range(3):
        try:
            with urllib.request.urlopen(req, timeout=90) as r: return r.read()
        except Exception as e:
            print("  ulang", coba + 1, kode, str(e)[:100]); time.sleep(5)
    return None
kode = []
for f in sorted(glob.glob(os.path.join(AKAR, f"{T}_[0-9][0-9].json"))):
    kode += [r["kode"] for r in json.load(open(f, encoding="utf-8"))["anak"]["baris"]]
baris, gagal = [], []
for i, k in enumerate(kode):
    p = os.path.join(KAB, f"{T}_{k}.json")
    if os.path.exists(p): b = open(p, "rb").read()
    else:
        b = ambil(k)
        if b is None: gagal.append(k); continue
        open(p, "wb").write(b); time.sleep(0.4)
    baris.append([k, hashlib.sha256(b).hexdigest(), len(b)])
    if i % 50 == 0: print(i, "dari", len(kode), time.strftime("%H:%M:%S"), flush=True)
with open(os.path.join(AKAR, f"manifest_kab_{T}.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(["kode", "sha256", "bita"]); w.writerows(baris)
print("selesai", len(baris), "dari", len(kode), "gagal", gagal, time.strftime("%Y-%m-%d %H:%M:%S"))
