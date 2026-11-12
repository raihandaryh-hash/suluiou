#!/usr/bin/env python3
"""Validator registri sumber (L0) untuk gerbang G1.0, G1.3 (status), dan G1.7. Tanpa jaringan.
Tiap kontrak aktif (status bukan 'retired') wajib punya: SU-0 berisi LOLOS, syarat_pakai_kutipan berisi LULUS atau
merujuk aturan dasar pakai, dan sitasi. Mencetak tabel status gerbang per sumber; keluar 1 bila ada kontrak aktif cacat.
Pakai: python3 mesin/alat/periksa_sumber.py"""
import glob, os, sys, yaml
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cacat, baris = [], []
for p in sorted(glob.glob(os.path.join(AKAR, "sumber", "*.yaml"))):
    d = yaml.safe_load(open(p, encoding="utf-8")); cp = {c["property"]: str(c["value"]) for c in d.get("customProperties", [])}
    aktif = d.get("status") != "retired"
    g10 = "LOLOS" in cp.get("SU-0", "")
    g17 = "LULUS" in cp.get("syarat_pakai_kutipan", "") or "aturan butir 1" in cp.get("syarat_pakai_kutipan", "")
    g13 = cp.get("G1.3_status", "").startswith("lulus")
    sit = bool(cp.get("sitasi"))
    baris.append((d["id"], "aktif" if aktif else "pensiun", g10, g13, g17, sit))
    if aktif and not (g10 and g17 and sit): cacat.append(d["id"])
print(f"{'sumber':32} {'status':8} G1.0  G1.3  G1.7  sitasi")
for b in baris: print(f"{b[0]:32} {b[1]:8} " + "  ".join(("ya  " if x else "tdk ") for x in b[2:]))
if cacat: print("GAGAL registri sumber:", cacat); sys.exit(1)
print("LULUS registri sumber")
