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
_v2 = os.path.join(AKAR, "bank/bank_kandidat_v2.yaml")   # v2 = v1 + tambahan (v1 tidak disunting)
if os.path.exists(_v2): bank = bank + yaml.safe_load(open(_v2))["tambahan"]
per = collections.Counter(k["medan"] for k in bank)
if len(bank) < amb["G2.0_bank"]["minimal_kandidat"]: gagal.append(f"G2.0: bank {len(bank)} < 30")
for m in ["K1","K2","K3","K4","K5","K6","K7"]:
    if per[m] < amb["G2.0_bank"]["minimal_per_medan"]: gagal.append(f"G2.0: {m} hanya {per[m]}")
if len({k['id'] for k in bank}) != len(bank): gagal.append("G2.0: id ganda")
# Pembekuan: sidik berkas beku harus cocok dengan BEKU.sha256
beku = os.path.join(AKAR, "uji/BEKU.sha256")
# Berkas tertulis lebih dari sekali: baris terakhir yang berlaku, baris lama tetap sebagai riwayat (BEKU hanya ditambah).
# Entri "laptop:" berada di luar repo dan diperiksa di laptop, bukan di CI.
terakhir = {}
for baris in open(beku):
    if not baris.strip() or baris.startswith("#"): continue
    h, p = baris.split(None, 1); terakhir[p.strip()] = h
for p, h in terakhir.items():
    if p.startswith("laptop:"): continue
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
# G1.1 dan G1.4: provenans dan teks kartu (fixture)
rk = subprocess.run([sys.executable, os.path.join(AKAR, "alat/periksa_kartu.py")], capture_output=True, text=True)
print(rk.stdout.strip())
if rk.returncode != 0: gagal.append("G1.1/G1.4: kartu cacat")
# G1.0 dan G1.7: registri sumber
rs = subprocess.run([sys.executable, os.path.join(AKAR, "alat/periksa_sumber.py")], capture_output=True, text=True)
print(rs.stdout.strip())
if rs.returncode != 0: gagal.append("G1.0/G1.7: registri sumber cacat")
# ME2: kartu ME2 (G2.5) dibangun ulang dan harus sama sidiknya; diperiksa provenans/sel; saringan v7 (G2.3) dan kepekaan
km = os.path.join(AKAR, "kartu/keluaran/kartu_me2.jsonl")
if os.path.exists(km):
    h0 = hashlib.sha256(open(km, "rb").read()).hexdigest()
    rb = subprocess.run([sys.executable, os.path.join(AKAR, "alat/bangun_kartu_me2.py")], capture_output=True, text=True)
    if rb.returncode != 0: gagal.append("G2.5: pembangun kartu ME2 gagal (masukan hilang atau rusak)")
    if hashlib.sha256(open(km, "rb").read()).hexdigest() != h0: gagal.append("G2.5: kartu ME2 tidak tereproduksi dari masukan")
    r2 = subprocess.run([sys.executable, os.path.join(AKAR, "alat/periksa_kartu.py"), km], capture_output=True, text=True)
    print("ME2", r2.stdout.strip().splitlines()[0] if r2.stdout.strip() else "")
    if r2.returncode != 0: gagal.append("G2.5: kartu ME2 cacat")
    rg = subprocess.run([sys.executable, os.path.join(AKAR, "alat/saringan.py"), os.path.join(AKAR, "bank/komponen_saringan_v2.yaml"), "--v7"], capture_output=True, text=True)
    print("G2.3 v7:", [l for l in rg.stdout.splitlines() if "G2.3" in l][:1])
    if rg.returncode != 0: gagal.append("G2.3: saringan v7 tidak lulus perhitungan")
# ME3: validator kutipan pemeta peran harus menolak tiga kasus buruk dan menerima satu kasus baik (uji/validasi_kutipan)
vk = os.path.join(AKAR, "uji/validasi_kutipan")
if os.path.isdir(vk):
    import shutil, tempfile
    tmp = tempfile.mkdtemp(); shutil.copy(os.path.join(vk, "contoh.jsonl"), tmp)
    rv = subprocess.run([sys.executable, os.path.join(AKAR, "peran/validasi_kutipan.py"), os.path.join(tmp, "contoh.jsonl"), os.path.join(vk, "reg.csv"), os.path.join(vk, "dok")], capture_output=True, text=True)
    print("ME3 validator kutipan:", rv.stdout.strip())
    if not rv.stdout.startswith("sah 1 ditolak 3"): gagal.append("G3.2: validator kutipan tidak menolak kasus buruk")
# ME3: validator pemeta v3 (penanda kebutuhan, kutipan kebutuhan persis) menolak dua kasus buruk dan menerima dua kasus baik
vk3 = os.path.join(AKAR, "uji/validasi_kutipan_v3")
if os.path.isdir(vk3):
    tmp3 = tempfile.mkdtemp(); shutil.copy(os.path.join(vk3, "contoh.jsonl"), tmp3)
    rv3 = subprocess.run([sys.executable, os.path.join(AKAR, "peran/validasi_kutipan_v3.py"), os.path.join(tmp3, "contoh.jsonl"), os.path.join(vk3, "reg.csv"), os.path.join(vk3, "dok")], capture_output=True, text=True)
    print("ME3 validator kutipan v3:", rv3.stdout.strip())
    if not rv3.stdout.startswith("sah 2 ditolak 2"): gagal.append("G3.2: validator kutipan v3 tidak menolak kasus buruk")
# ME3: kartu provinsi (butir 88) tereproduksi dan lolos periksa_kartu; rantai tanpa cacat mekanis; uji negatif validator rantai
kp = os.path.join(AKAR, "kartu/keluaran/kartu_me3_prov.jsonl")
if os.path.exists(kp):
    h0 = hashlib.sha256(open(kp, "rb").read()).hexdigest()
    rp = subprocess.run([sys.executable, os.path.join(AKAR, "kartu/kartu_prov.py")], capture_output=True, text=True)
    if rp.returncode != 0 or hashlib.sha256(open(kp, "rb").read()).hexdigest() != h0: gagal.append("ME3: kartu provinsi tidak tereproduksi")
    r3 = subprocess.run([sys.executable, os.path.join(AKAR, "alat/periksa_kartu.py"), kp], capture_output=True, text=True)
    if r3.returncode != 0: gagal.append("ME3: kartu provinsi cacat")
    rr = subprocess.run([sys.executable, os.path.join(AKAR, "jalur/rangkai.py")], capture_output=True, text=True)
    print("ME3", [l for l in rr.stdout.splitlines() if l.startswith("G3.")])
    if rr.returncode != 0: gagal.append("G3.1/G3.3/G3.4: rantai jalur bercacat mekanis (lihat rangkai.py)")
    rn = subprocess.run([sys.executable, os.path.join(AKAR, "uji/rantai_negatif.py")], capture_output=True, text=True)
    print("ME3 uji negatif rantai:", (rn.stdout.strip().splitlines() or [""])[-1])
    if rn.returncode != 0: gagal.append("G3.1: validator rantai meloloskan rantai rusak (uji/rantai_negatif.py)")
    rc = subprocess.run([sys.executable, os.path.join(AKAR, "cipta/uji_cipta.py")], capture_output=True, text=True)
    print("ME3 cipta:", [l for l in rc.stdout.splitlines() if l.startswith("G3b")])
    if rc.returncode != 0: gagal.append("G3b: alur cipta atau bank pemantik gagal (cipta/uji_cipta.py)")
print(f"bank {len(bank)} kandidat {dict(sorted(per.items()))}; kontrak: {akhir}")
if gagal:
    print("GAGAL:\n- " + "\n- ".join(gagal)); sys.exit(1)
print("LULUS gerbang deterministik")
