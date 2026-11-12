#!/usr/bin/env python3
"""Pengurai JSON mentah BPS WebAPI (list/model/data) menjadi baris indikator per kab/kota.
Tidak memanggil jaringan dan tidak memakai model. Masukan: folder hasil bps_panen.py (berkas *.json + manifest.csv).
Pakai: python bps_webapi.py FOLDER_MENTAH KELUARAN.csv
Kunci sel datacontent = kode vervar + var + turvar + kode tahun + turtahun; pengurai mencocokkan susunan itu
secara eksplisit dan menolak sel yang tidak cocok."""
import csv, hashlib, json, os, re, sys

def urai_berkas(path):
    raw = open(path, "rb").read(); j = json.loads(raw)
    if j.get("data-availability") != "available": return [], [f"{os.path.basename(path)}: tidak tersedia"]
    var = j["var"][0]; turvar = j["turvar"]; tahun = j["tahun"]; turth = j["turtahun"]
    nama = {str(v["val"]): v["label"] for v in j["vervar"]}
    baris, tolak = [], []
    for kunci, nilai in j["datacontent"].items():
        cocok = None
        for vv in nama:
            if not kunci.startswith(vv): continue
            sisa = kunci[len(vv):]
            for tv in turvar:
                for th in tahun:
                    for tt in turth:
                        if sisa == f"{var['val']}{tv['val']}{th['val']}{tt['val']}":
                            cocok = (vv, tv, th, tt)
        if not cocok: tolak.append(f"{os.path.basename(path)}: kunci {kunci} tak terurai"); continue
        vv, tv, th, tt = cocok
        kode = int(vv)
        tingkat = "provinsi" if kode % 100 == 0 else "kabkota"
        baris.append(dict(kode_bps=vv, wilayah=nama[vv], tingkat=tingkat, var_id=var["val"], judul=var["label"],
                          satuan=var.get("unit", ""), turvar=tv["label"], tahun=th["label"], periode=tt["label"],
                          nilai=nilai, catatan_sumber=re.sub("<[^>]+>", " ", var.get("note") or "").strip(),
                          pembaruan_bps=j.get("last_update", ""), berkas=os.path.basename(path),
                          sha256_berkas=hashlib.sha256(raw).hexdigest()))
    return baris, tolak

if __name__ == "__main__":
    folder, keluar = sys.argv[1], sys.argv[2]
    semua, tolak = [], []
    for f in sorted(os.listdir(folder)):
        if f.endswith(".json"):
            b, t = urai_berkas(os.path.join(folder, f)); semua += b; tolak += t
    with open(keluar, "w", newline="", encoding="utf-8") as o:
        w = csv.DictWriter(o, fieldnames=list(semua[0].keys())); w.writeheader(); w.writerows(semua)
    kab = {(r["kode_bps"]) for r in semua if r["tingkat"] == "kabkota"}
    print(f"{len(semua)} sel · {len(kab)} kab/kota unik · tertolak {len(tolak)}")
    for t in tolak[:20]: print("  tolak:", t)
