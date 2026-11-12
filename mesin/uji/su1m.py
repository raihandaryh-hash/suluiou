#!/usr/bin/env python3
"""SU-1m: mutasi tabel L3 untuk gerbang G1.3m (daya tangkap pemeriksa). Empat jenis sesuai rencana §4 tabel SU-1m:
  kolom_bergeser  nilai satu deret kab/kota dalam satu provinsi bergeser satu baris (3-8 sel)
  tahun_sebelah   nilai diganti nilai tahun sebelumnya untuk wilayah yang sama
  koma_desimal    nilai dikali atau dibagi 10
  sae_ditukar     estimasi langsung diganti estimasi tak langsung (median kab/kota sepropinsi; pengganti SAE
                  karena BPS tidak menerbitkan SAE untuk tabel ini)
Lokasi mutasi diambil acak dari SEMUA kab/kota bernilai, bukan hanya yang berpasangan, jadi sel tanpa pembanding
bisa lolos: itu yang diukur. Mutasi yang tidak mengubah nilai (selisih <=0,005) diundi ulang.
Pemeriksa = pemeriksa gerbang G1.3: beda dengan publikasi kedua (toleransi pembulatan) atau di luar 0-100.

Mode berpasangan (lingkungan SU1M_BERPASANGAN=1): lokasi mutasi hanya sel yang cocok dengan publikasi kedua, yaitu
tabel yang boleh dipakai kartu menurut PUTUSAN ATAS DELEGASI 13 Nov 2026 (sel tanpa pasangan ditahan).

Dua langkah supaya set beku sebelum dinilai:
  buat:  python su1m.py buat  SUMBER BENIH KELUARAN.jsonl -- <argumen muat>
  nilai: python su1m.py nilai SUMBER MUTASI.jsonl          -- <argumen muat>
Argumen muat: bps L3.csv DOMAIN.json IND VAR TH [TURVAR|-]   atau   dikk DIKK_TABEL21.csv L3.csv"""
import collections, csv, hashlib, json, os, random, statistics, sys

def _nilai(s):
    try: return float(s)
    except (TypeError, ValueError): return None

def muat_bps(l3, domain, ind, var, th, tv=None):
    R = list(csv.DictReader(open(l3, encoding="utf-8")))
    D = json.load(open(domain, encoding="utf-8"))["data"][1]
    resmi = {d["domain_id"] for d in D if not d["domain_id"].endswith("00")}
    wi = os.path.join(os.path.dirname(domain), "..", "_wilayah_induk.csv")
    baru = {w["kode_bps_baru"]: w["kode_bps"] for w in csv.DictReader(open(wi, encoding="utf-8"))
            if w.get("kode_bps_baru") and w["kode_bps_baru"] != w["kode_bps"]} if os.path.exists(wi) else {}
    tukar = {"6100_sanitasi_368"}  # sama dengan parser/periksa_lintas.py
    def tabel_a(tahun):
        A = {}
        for r in R:
            if r["berkas"] == f"0000_{ind}_{var}_{tahun}.json" and r["tingkat"] == "kabkota" and (tv is None or r["turvar"].strip() == tv):
                k = r["kode_bps"]; db = False
                if k not in resmi and k in baru: k, db = baru[k], True
                elif k not in resmi: continue
                v = _nilai(r["nilai"])
                if v is None: continue
                if db: A[k] = v
                else: A.setdefault(k, v)
        return A
    def th_ef(f):
        awal, t = f[:-5].rsplit("_", 1)
        return {"2024": "2025", "2025": "2024"}.get(t, t) if awal in tukar else t
    B = collections.defaultdict(set)
    for r in R:
        f = r["berkas"]
        if f.startswith("0000") or f"_{ind}_" not in f or th_ef(f) != th or r["tingkat"] != "kabkota": continue
        v = _nilai(r["nilai"])
        if v is not None: B[r["kode_bps"]].add(round(v, 2))
    return tabel_a(th), tabel_a(str(int(th) - 1)), B

def muat_dikk(dikk, l3):
    import re
    A = {r["kode_bps"]: float(r["p0"]) for r in csv.DictReader(open(dikk, encoding="utf-8")) if r["tingkat"] == "kabkota"}
    pola = re.compile(r"persentase penduduk miskin", re.I)
    tolak = re.compile(r"ekstrem|usia|tahun ke atas|garis|jumlah|klasifikasi|rumah tangga|desa/kota", re.I)
    B, prev = collections.defaultdict(set), {}
    for r in csv.DictReader(open(l3, encoding="utf-8")):
        if r["tingkat"] == "kabkota" and pola.search(r["judul"]) and not tolak.search(r["judul"]):
            v = _nilai(r["nilai"])
            if v is None: continue
            if r["tahun"] == "2025": B[r["kode_bps"]].add(round(v, 2))
            elif r["tahun"] == "2024": prev.setdefault(r["kode_bps"], v)
    return A, prev, B

def muat(argv):
    return muat_bps(*argv[1:6], None if len(argv) < 7 or argv[6] == "-" else argv[6]) if argv[0] == "bps" else muat_dikk(*argv[1:3])

JENIS = ["kolom_bergeser", "tahun_sebelah", "koma_desimal", "sae_ditukar"]

def buat(A, prev, benih, n_per=25):
    rnd = random.Random(benih); kode = sorted(A); per_prov = collections.defaultdict(list)
    for k in kode: per_prov[k[:2]].append(k)
    jenis = [j for j in JENIS if j != "tahun_sebelah" or any(k in prev for k in kode)]
    n = {j: 100 // len(jenis) + (1 if i < 100 % len(jenis) else 0) for i, j in enumerate(jenis)}
    keluar, ulang = [], 0
    for j in jenis:
        while sum(m["jenis"] == j for m in keluar) < n[j]:
            k = rnd.choice(kode); ubah = {}
            if j == "kolom_bergeser":
                p = per_prov[k[:2]]
                if len(p) < 4: ulang += 1; continue
                pjg = rnd.randint(3, min(8, len(p) - 1)); i = rnd.randrange(len(p) - pjg)
                ubah = {p[i + t]: A[p[i + t + 1]] for t in range(pjg)}
            elif j == "tahun_sebelah":
                if k not in prev: ulang += 1; continue
                ubah = {k: prev[k]}
            elif j == "koma_desimal":
                ubah = {k: round(A[k] * 10, 2) if rnd.random() < 0.5 else round(A[k] / 10, 3)}
            else:
                ubah = {k: round(statistics.median(A[x] for x in per_prov[k[:2]] if x != k), 2) if len(per_prov[k[:2]]) > 1 else A[k]}
            ubah = {c: v for c, v in ubah.items() if abs(v - A[c]) > 0.005}
            if not ubah: ulang += 1; continue
            keluar.append({"jenis": j, "ubah": [{"kode": c, "lama": A[c], "baru": v} for c, v in ubah.items()]})
    return keluar, ulang

def tertangkap(m, B):
    for u in m["ubah"]:
        v = u["baru"]
        if not 0 <= v <= 100: return "rentang"
        if u["kode"] in B and not any(abs(v - x) <= 0.005 or abs(round(v, 1) - x) <= 0.005 or abs(round(v) - x) <= 0.005 for x in B[u["kode"]]):
            return "publikasi_kedua"
    return None

if __name__ == "__main__":
    pisah = sys.argv.index("--"); depan, argm = sys.argv[1:pisah], sys.argv[pisah + 1:]
    A, prev, B = muat(argm)
    if os.environ.get("SU1M_BERPASANGAN") == "1":
        A = {k: v for k, v in A.items() if k in B and any(abs(v - x) <= 0.005 or abs(round(v, 1) - x) <= 0.005 or abs(round(v) - x) <= 0.005 for x in B[k])}
        print(f"mode berpasangan: {len(A)} sel cocok dengan publikasi kedua dari {len(set(A) | set(B))} kode")
    if depan[0] == "buat":
        sumber, benih, out = depan[1], int(depan[2]), depan[3]
        M, ulang = buat(A, prev, benih)
        with open(out, "w", encoding="utf-8") as f:
            for m in M: f.write(json.dumps({"sumber": sumber, **m}, ensure_ascii=False) + "\n")
        print(f"{sumber}: {len(M)} mutasi ({collections.Counter(m['jenis'] for m in M)}); diundi ulang {ulang}; "
              f"sha256 {hashlib.sha256(open(out, 'rb').read()).hexdigest()}")
    else:
        sumber, path = depan[1], depan[2]
        M = [json.loads(l) for l in open(path, encoding="utf-8")]
        hasil = collections.defaultdict(lambda: [0, 0]); lolos = []
        for m in M:
            t = tertangkap(m, B); hasil[m["jenis"]][1] += 1; hasil[m["jenis"]][0] += t is not None
            if t is None: lolos.append(m)
        total = sum(v[0] for v in hasil.values())
        print(f"{sumber}: {total} dari {len(M)} tertangkap (ambang >=98) · " + " · ".join(f"{j} {a}/{b}" for j, (a, b) in hasil.items()))
        tanpa = sum(all(u["kode"] not in B for u in m["ubah"]) for m in lolos)
        print(f"  lolos {len(lolos)}, di antaranya {tanpa} karena semua sel yang diubah tanpa pasangan publikasi kedua")
