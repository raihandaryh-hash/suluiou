"""Pemeriksa angka umum (L2v) untuk satu indikator BPS kab/kota: tabel nasional A vs tabel provinsi B.
Uji: (1) cakupan A terhadap 514 kode resmi; (2) A vs B per kode dan tahun (toleransi 0,005); (3) nilai di rentang 0-100
untuk persentase; (4) mutasi 100. Tidak memakai model.
Pakai: python periksa_lintas.py _l3_bps.csv _domain_all.json IND VAR_A TAHUN [TURVAR_A]"""
import csv, collections, json, random, sys
R = list(csv.DictReader(open(sys.argv[1], encoding="utf-8")))
resmi = {d["domain_id"] for d in json.load(open(sys.argv[2], encoding="utf-8"))["data"][1] if not d["domain_id"].endswith("00")}
IND, VAR, TH = sys.argv[3], sys.argv[4], sys.argv[5]; TV = sys.argv[6] if len(sys.argv) > 6 and sys.argv[6] != "-" else None
import os
WI = os.path.join(os.path.dirname(sys.argv[2]), "..", "_wilayah_induk.csv")
BARU = {w["kode_bps_baru"]: w["kode_bps"] for w in csv.DictReader(open(WI, encoding="utf-8")) if w.get("kode_bps_baru") and w["kode_bps_baru"] != w["kode_bps"]} if os.path.exists(WI) else {}
def nilai(r):
    try: return float(r["nilai"])
    except ValueError: return None
A = {}
for r in R:
    if r["berkas"] == f"0000_{IND}_{VAR}_{TH}.json" and r["tingkat"] == "kabkota" and (TV is None or r["turvar"].strip() == TV):
        k = r["kode_bps"]; dari_baru = False
        if k not in resmi and k in BARU: k, dari_baru = BARU[k], True  # kode BPS baru Papua -> kode domain lama
        elif k not in resmi: continue  # baris di luar daftar resmi
        if nilai(r) is None: continue
        if dari_baru: A[k] = nilai(r)  # baris berkode baru (pasca-pemekaran) menang atas baris berkode lama
        else: A.setdefault(k, nilai(r))
B = collections.defaultdict(set)
for r in R:
    f = r["berkas"]
    if f.startswith("0000") or f"_{IND}_" not in f or not f.endswith(f"_{TH}.json") or r["tingkat"] != "kabkota": continue
    if nilai(r) is not None: B[r["kode_bps"]].add(round(nilai(r), 2))
print(f"[{IND} {TH}] (1) A: {len(A)} kode; resmi tercakup {len(set(A) & resmi)} dari {len(resmi)}; di luar daftar resmi {len(set(A) - resmi)}")
cocok, beda, tanpa, bulat = 0, [], 0, []
for k, v in A.items():
    if k not in B: tanpa += 1
    elif any(abs(v - x) <= 0.005 for x in B[k]): cocok += 1
    elif any(abs(round(v, 1) - x) <= 0.005 or abs(round(v) - x) <= 0.005 for x in B[k]): cocok += 1; bulat.append(k)
    else: beda.append((k, v, sorted(B[k])))
print(f"  (2) A vs B: {cocok} cocok (di antaranya {len(bulat)} karena B dibulatkan), {len(beda)} berbeda, {tanpa} tanpa pasangan B; provinsi B: {len({k[:2] for k in B})}")
for b in beda[:15]: print("     beda:", b)
luar = [(k, v) for k, v in A.items() if not 0 <= v <= 100]
print(f"  (3) di luar 0-100: {len(luar)} {luar[:5]}")
pas = [k for k, v in A.items() if k in B and any(abs(v - x) <= 0.005 for x in B[k])]
if pas:
    rnd = random.Random(20261113); t = 0
    for _ in range(100):
        k = rnd.choice(pas); m = A[k] + rnd.choice([-1, 1]) * rnd.choice([0.01, 0.1, 1.0, 10.0]); t += not any(abs(m - x) <= 0.005 for x in B[k])
    print(f"  (4) mutasi: {t} dari 100 tertangkap")
