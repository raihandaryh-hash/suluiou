"""Uji daya tangkap (G1.3m) untuk Indeks Desa: 100 sel hitungan kab/kota diubah acak, pemeriksa jumlah provinsi
(ringkasan provinsi di berkas SID) wajib menangkapnya. Pakai: python sid_mutasi.py _l3_sid_2025.csv FOLDER_SID 2025"""
import csv, json, os, random, sys, collections
R = list(csv.DictReader(open(sys.argv[1], encoding="utf-8"))); folder, T = sys.argv[2], sys.argv[3]
ring = {}
for r in R:
    if r["provinsi"] not in ring:
        j = json.load(open(os.path.join(folder, r["berkas"]), encoding="utf-8")); ring[r["provinsi"]] = j["ringkasan"][0]
F = ["jumlah_desa", "desa_mandiri", "desa_maju", "desa_berkembang", "desa_tertinggal", "desa_punya_bumdes", "bumdes_aktif",
     "desa_terdampak_banjir", "desa_terdampak_longsor", "desa_sudah_kajian_risiko"]
rnd = random.Random(20261113); tangkap = 0
for _ in range(100):
    i = rnd.randrange(len(R)); k = rnd.choice(F); d = rnd.choice([-1, 1]) * rnd.choice([1, 2, 5, 50])
    p = R[i]["provinsi"]
    tot = sum(float(r[k] or 0) for r in R if r["provinsi"] == p) + d
    tangkap += abs(tot - float(ring[p][k] or 0)) > 0.5
print(f"mutasi Indeks Desa: {tangkap} dari 100 tertangkap oleh pemeriksa jumlah provinsi")
