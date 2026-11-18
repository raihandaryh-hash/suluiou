#!/usr/bin/env python3
"""Angka BPS yang lebih baru dari angka kartu tayang, per kartu. Berkas terpisah, skema kartu tidak diubah.
Asal: gerbang A (tahun terbaru yang tersedia) dan K (kesegaran); periksa_gerbang_kartu.py 18 Nov 2026 menemukan 379 dari 900 kartu
punya angka BPS 2026 di tabel WebAPI provinsi. Kartu tetap memakai DIKK 2025 / Sakernas 2025 (satu sumber, satu tahun, 514 wilayah)
sampai Chief memutus cara tampil (tahun campur antarwilayah memengaruhi bagian Daerah lain).
Pakai: python3 -I angka_terbaru_kartu.py"""
import csv, glob, json, os, collections
S = os.path.dirname(os.path.abspath(__file__)); K = os.path.join(S, "keluaran")
IND = {"kemiskinan-kabkota": "p0", "pengangguran-terbuka-kabkota": "tpt"}
deret = collections.defaultdict(dict)
for r in csv.DictReader(open(os.path.join(K, "deret_kemiskinan_tpt.csv"), encoding="utf-8")):
    if r["tingkat"] == "kabkota": deret[(r["kode_bps"], r["indikator"])][int(r["tahun"])] = r
out = {}
for f in sorted(glob.glob(os.path.join(K, "kartu_tayang", "prov_*.json"))):
    d = json.load(open(f, encoding="utf-8")); ks = d if isinstance(d, list) else d.get("kartu", [])
    for k in ks:
        th = int(k["angka"]["tahun_data"]); ser = deret.get((k["wilayah"]["kode_bps"], IND[k["jenis_kebutuhan"]]), {})
        baru = [t for t in ser if t > th]
        if not baru: continue
        t = max(baru); r = ser[t]
        out[k["id"]] = {"tahun_data": t, "nilai": float(r["nilai"]), "nilai_kartu": k["angka"]["nilai"], "tahun_kartu": th,
                        "selisih_poin": round(float(r["nilai"]) - k["angka"]["nilai"], 2),
                        "sumber": "BPS WebAPI, " + r["sumber"], "periode": "Maret" if IND[k["jenis_kebutuhan"]] == "p0" else "Agustus"}
ring = collections.Counter(v["tahun_data"] for v in out.values())
json.dump({"skema": "angka-terbaru-kartu/1", "dibuat": "18 Nov 2026, sesi mesin Sulu",
           "label": "SINTESIS mekanis dari deret_kemiskinan_tpt.csv; nilai dari tabel BPS provinsi, belum dicek ke rilis BRS per provinsi",
           "jumlah": len(out), "per_tahun": dict(ring),
           "per_jenis": dict(collections.Counter(i.split(".")[0] for i in out)),
           "catatan_rse": "catatan BPS 'kurang teliti' di kartu TPT berasal dari tabel 2025; untuk angka 2026 catatan itu belum dipanen",
           "kartu": out}, open(os.path.join(K, "angka_terbaru_kartu.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(out), dict(ring))
