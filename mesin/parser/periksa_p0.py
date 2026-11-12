"""Pemeriksa angka P0 kab/kota 2025 (lapis L2v). Dua publikasi BPS yang terpisah:
  A = buku "Data dan Informasi Kemiskinan Kabupaten/Kota 2025" Tabel 2.1 (_dikk2025_tabel21.csv)
  B = tabel dinamis BPS provinsi lewat WebAPI (_l3_bps.csv, variabel P0, tahun 2025)
Uji: (1) cakupan 514; (2) jumlah penduduk miskin kab/kota per provinsi = angka provinsi (toleransi pembulatan);
(3) P0 A vs B per kode wilayah (toleransi 0,005 poin, yaitu pembulatan dua desimal); (4) mutasi: 100 angka A diubah,
pembanding B wajib menangkap yang punya pasangan. Tidak memakai model.
Pakai: python periksa_p0.py A.csv B.csv"""
import csv, collections, random, re, sys
A = list(csv.DictReader(open(sys.argv[1], encoding="utf-8")))
B = list(csv.DictReader(open(sys.argv[2], encoding="utf-8")))
kab = [r for r in A if r["tingkat"] == "kabkota"]
print(f"(1) cakupan A: {len(kab)} kab/kota, {len({r['kode_bps'] for r in kab})} kode unik, {sum(r['tingkat']=='provinsi' for r in A)} provinsi")
prov = {r["provinsi"]: float(r["jumlah_ribu"]) for r in A if r["tingkat"] == "provinsi"}
jml = collections.defaultdict(float); n = collections.Counter()
for r in kab: jml[r["provinsi"]] += float(r["jumlah_ribu"]); n[r["provinsi"]] += 1
selisih = [(p, round(jml[p], 2), prov[p]) for p in prov if abs(jml[p] - prov[p]) > 0.01 * n[p] + 0.02]
print(f"(2) jumlah kab/kota vs provinsi: {len(prov) - len(selisih)} dari {len(prov)} cocok dalam toleransi pembulatan; selisih: {selisih}")
pola = re.compile(r"persentase penduduk miskin", re.I); tolak = re.compile(r"ekstrem|usia|tahun ke atas|garis|jumlah|klasifikasi|rumah tangga|desa/kota", re.I)
Bp = collections.defaultdict(set)
for r in B:
    if r["tingkat"] == "kabkota" and r["tahun"] == "2025" and pola.search(r["judul"]) and not tolak.search(r["judul"]):
        try: Bp[r["kode_bps"]].add(round(float(r["nilai"]), 2))
        except ValueError: pass
pas, beda, tanpa = 0, [], 0
for r in kab:
    vb = Bp.get(r["kode_bps"])
    if not vb: tanpa += 1; continue
    if any(abs(float(r["p0"]) - v) <= 0.005 for v in vb): pas += 1
    else: beda.append((r["kode_bps"], r["nama"], float(r["p0"]), sorted(vb), r["halaman"]))
print(f"(3) P0 A vs B: {pas} cocok, {len(beda)} berbeda, {tanpa} tanpa pasangan di B (dari {len(kab)})")
for b in beda[:25]: print("    beda:", b)
rnd = random.Random(20261113); kena, dapat = 0, 0
ber = [r for r in kab if Bp.get(r["kode_bps"]) and any(abs(float(r["p0"]) - v) <= 0.005 for v in Bp[r["kode_bps"]])]
for _ in range(100):
    r = rnd.choice(ber); v = float(r["p0"]) + rnd.choice([-1, 1]) * rnd.choice([0.01, 0.1, 1.0, 10.0])
    kena += 1; dapat += not any(abs(v - x) <= 0.005 for x in Bp[r["kode_bps"]])
print(f"(4) mutasi G1.3m: {dapat} dari {kena} tertangkap (ambang >=98)")
