#!/usr/bin/env python3
"""Gerbang deterministik mesin yang bisa dijalankan di CI tanpa jaringan dan tanpa kunci API.
Saat ini: G2.0 (bank kandidat), G4.1 (kontrak: fixture sesuai harapan), pembekuan set uji (sidik).
Pakai: python3 mesin/alat/periksa_gerbang.py  (dari akar repo)"""
import collections, hashlib, json, os, subprocess, sys, tempfile, shutil
import yaml
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
gagal = []
amb = yaml.safe_load(open(os.path.join(AKAR, "uji/AMBANG.yaml")))
# G2.0
bank = yaml.safe_load(open(os.path.join(AKAR, "bank/bank_kandidat_v1.yaml")))["kandidat"]
per = collections.Counter(k["medan"] for k in bank)
if len(bank) < amb["G2.0_bank"]["minimal_kandidat"]: gagal.append(f"G2.0: bank {len(bank)} < 30")
for m in ["K1","K2","K3","K4","K5","K6","K7"]:
    if per[m] < amb["G2.0_bank"]["minimal_per_medan"]: gagal.append(f"G2.0: {m} hanya {per[m]}")
if len({k['id'] for k in bank}) != len(bank): gagal.append("G2.0: id ganda")
# Pembekuan: sidik berkas beku harus cocok dengan BEKU.sha256
beku = os.path.join(AKAR, "uji/BEKU.sha256")
for baris in open(beku):
    if not baris.strip() or baris.startswith("#"): continue
    h, p = baris.split(None, 1); p = p.strip()
    jalur = os.path.join(AKAR, p)
    if not os.path.exists(jalur): gagal.append(f"BEKU: {p} hilang"); continue
    if hashlib.sha256(open(jalur, "rb").read()).hexdigest() != h: gagal.append(f"BEKU: {p} berubah sesudah dibekukan")
# G4.1 fixture kontrak (dijalankan di salinan supaya berkas repo tidak tertimpa)
tmp = tempfile.mkdtemp()
shutil.copy(os.path.join(AKAR, "kontrak/buat_kontrak.py"), tmp)
out = subprocess.run([sys.executable, os.path.join(tmp, "buat_kontrak.py"), tmp], capture_output=True, text=True)
akhir = (out.stdout.strip().splitlines() or [""])[-1]
if out.returncode != 0 or not akhir.startswith("sesuai:"): gagal.append("G4.1: generator kontrak gagal: " + out.stderr[-200:])
else:
    a, _, b = akhir.split()[1:4]
    if a != b: gagal.append("G4.1: " + akhir)
    if hashlib.sha256(open(os.path.join(tmp, "jalur-jelajah-1.schema.json"), "rb").read()).hexdigest() != \
       hashlib.sha256(open(os.path.join(AKAR, "kontrak/jalur-jelajah-1.schema.json"), "rb").read()).hexdigest():
        gagal.append("G4.1: skema di repo berbeda dari keluaran generator")
# G1.0 dan G1.7: registri sumber
rs = subprocess.run([sys.executable, os.path.join(AKAR, "alat/periksa_sumber.py")], capture_output=True, text=True)
print(rs.stdout.strip())
if rs.returncode != 0: gagal.append("G1.0/G1.7: registri sumber cacat")
print(f"bank {len(bank)} kandidat {dict(sorted(per.items()))}; kontrak: {akhir}")
if gagal:
    print("GAGAL:\n- " + "\n- ".join(gagal)); sys.exit(1)
print("LULUS gerbang deterministik")
