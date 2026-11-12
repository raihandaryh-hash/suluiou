#!/usr/bin/env python3
"""Validator registri sumber (L0) untuk gerbang G1.0, G1.3 (status), dan G1.7. Tanpa jaringan.
Tiap kontrak wajib punya `dipakai_kartu` ('ya' atau 'tidak: <alasan>') dan tidak boleh memuat properti ganda.
Kontrak yang dipakai untuk kartu wajib: SU-0 berisi LOLOS, G1.3_status diawali 'lulus', syarat_pakai_kutipan berisi
LULUS atau merujuk aturan dasar pakai, dan sitasi. Keluar 1 bila ada pelanggaran.
Pakai: python3 mesin/alat/periksa_sumber.py"""
import collections, glob, os, sys, yaml
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cacat, baris = [], []
for p in sorted(glob.glob(os.path.join(AKAR, "sumber", "*.yaml"))):
    d = yaml.safe_load(open(p, encoding="utf-8"))
    nama = [c["property"] for c in d.get("customProperties", [])]
    ganda = [n for n, k in collections.Counter(nama).items() if k > 1]
    if ganda: cacat.append(f"{d['id']}: properti ganda {ganda}")
    cp = {c["property"]: str(c["value"]) for c in d.get("customProperties", [])}
    dp = cp.get("dipakai_kartu", "")
    if not (dp == "ya" or dp.startswith("tidak:")): cacat.append(f"{d['id']}: dipakai_kartu kosong atau tak sah")
    pakai = dp == "ya"
    g10 = "LOLOS" in cp.get("SU-0", "")
    g17 = "LULUS" in cp.get("syarat_pakai_kutipan", "") or "aturan butir 1" in cp.get("syarat_pakai_kutipan", "")
    g13 = cp.get("G1.3_status", "").startswith("lulus")
    sit = bool(cp.get("sitasi"))
    baris.append((d["id"], "dipakai" if pakai else "ditahan", g10, g13, g17, sit))
    if pakai and not (g10 and g13 and g17 and sit):
        cacat.append(f"{d['id']}: dipakai tetapi gerbang belum lengkap (G1.0={g10} G1.3={g13} G1.7={g17} sitasi={sit})")
print(f"{'sumber':32} {'status':8} G1.0  G1.3  G1.7  sitasi")
for b in baris: print(f"{b[0]:32} {b[1]:8} " + "  ".join(("ya  " if x else "tdk ") for x in b[2:]))
print(f"dipakai: {sum(b[1] == 'dipakai' for b in baris)} dari {len(baris)}")
if cacat:
    for c in cacat: print("GAGAL", c)
    sys.exit(1)
print("LULUS registri sumber")
