"""Pemeriksa angka TPT kab/kota Agustus 2025 (lapis L2v). Dua terbitan BPS yang terpisah:
  A = tabel dinamis nasional var 2824 "TPT menurut Jenis Kelamin dan Kabupaten/Kota" (domain 0000), turvar Jumlah
  B = tabel dinamis BPS provinsi (domain provinsi), variabel TPT kab/kota, tahun 2025
Uji: (1) cakupan A terhadap 514 kode resmi; (2) A vs B per kode (toleransi 0,005); (3) Laki-laki dan Perempuan
mengapit Jumlah di A; (4) mutasi 100. Tidak memakai model.
Pakai: python periksa_tpt.py _l3_bps.csv _domain_all.json"""
import csv, collections, json, random, re, sys
R = list(csv.DictReader(open(sys.argv[1], encoding="utf-8")))
resmi = {d["domain_id"] for d in json.load(open(sys.argv[2], encoding="utf-8"))["data"][1] if not d["domain_id"].endswith("00")}
A = collections.defaultdict(dict)
for r in R:
    if r["berkas"].startswith("0000_tpt_2824_2025") and r["tingkat"] == "kabkota":
        try: A[r["kode_bps"]][r["turvar"].strip()] = float(r["nilai"])
        except ValueError: pass
kodeA = set(A)
print(f"(1) A: {len(kodeA)} kode kab/kota; resmi tercakup {len(kodeA & resmi)} dari {len(resmi)}; kode di luar daftar resmi: {len(kodeA - resmi)} {sorted(kodeA - resmi)[:12]}")
print(f"    resmi tanpa nilai A: {sorted(resmi - kodeA)[:20]}")
pola = re.compile(r"pengangguran terbuka|\btpt\b", re.I); tol = re.compile(r"tpak|partisipasi|pendidikan|umur|jenis kelamin|daerah|setengah", re.I)
B = collections.defaultdict(set)
for r in R:
    if r["berkas"].startswith("0000"): continue
    if r["tingkat"] == "kabkota" and r["tahun"] == "2025" and pola.search(r["judul"]) and not tol.search(r["judul"]):
        try: B[r["kode_bps"]].add(round(float(r["nilai"]), 2))
        except ValueError: pass
cocok, beda, tanpa = 0, [], 0
for k, v in A.items():
    j = v.get("Jumlah")
    if j is None: continue
    if k not in B: tanpa += 1; continue
    if any(abs(j - x) <= 0.005 for x in B[k]): cocok += 1
    else: beda.append((k, j, sorted(B[k])))
print(f"(2) A vs B: {cocok} cocok, {len(beda)} berbeda, {tanpa} tanpa pasangan B")
for b in beda[:20]: print("    beda:", b)
apit = [(k, v) for k, v in A.items() if {"Laki-Laki", "Perempuan", "Jumlah"} <= set(v) and not (min(v["Laki-Laki"], v["Perempuan"]) - 0.01 <= v["Jumlah"] <= max(v["Laki-Laki"], v["Perempuan"]) + 0.01)]
print(f"(3) Jumlah tidak diapit L dan P: {len(apit)} {apit[:8]}")
rnd = random.Random(20261113); pas = [k for k, v in A.items() if k in B and any(abs(v.get('Jumlah', -9) - x) <= 0.005 for x in B[k])]
tangkap = 0
for _ in range(100):
    k = rnd.choice(pas); m = A[k]["Jumlah"] + rnd.choice([-1, 1]) * rnd.choice([0.01, 0.1, 1.0, 10.0])
    tangkap += not any(abs(m - x) <= 0.005 for x in B[k])
print(f"(4) mutasi: {tangkap} dari 100 tertangkap")
