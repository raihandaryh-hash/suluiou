#!/usr/bin/env python3
"""Skor saringan ME2 dan uji stabilitas G2.3 (metode_saringan v1-v4, bobot_v2).
Pakai: python3 alat/saringan.py [bank/komponen_saringan_vN.yaml] [--v5 | --v6 | --v7]
--v6: skala v3 + batas mayoritas (bagian terdampak >50% keluar), bank/bagian_kelompok_v1.yaml.
--v5: skala tanpa target = orang kelebihan di atas median provinsi (metode_saringan_v5), data sumber/prov/<id>.csv.
skala: bertarget -> log10(orang x jarak relatif ke batas target terdekat), di dalam rentang -> skala terendah;
tanpa target -> log10(orang). Normalisasi persentil (0 terendah, 1 tertinggi; seri dirata-rata).
G2.3: tiap bobot +-25%, bobot lain dinormalisasi ulang; lulus bila >=4 dari 5 teratas tetap; sah hanya bila >=30 lengkap.
Dijalankan dua kali: semua kandidat lengkap, dan hanya yang bertarget. Keluar 1 bila G2.3 tidak lulus sah."""
import math, os, re, sys, yaml
akar = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_arg = [a for a in sys.argv[1:] if not a.startswith("--")]
K = yaml.safe_load(open(_arg[0] if _arg else os.path.join(akar, "bank/komponen_saringan_v1.yaml"), encoding="utf-8"))["kandidat"]
for _i, _k in K.items(): _k["_id"] = _i
W = yaml.safe_load(open(os.path.join(akar, "bank/bobot_v2.yaml"), encoding="utf-8"))["komponen"]
def rentang(s):
    a, b = re.match(r"([\d,]+)-([\d,]+)", s).groups(); return float(a.replace(",", ".")), float(b.replace(",", "."))
V5 = "--v5" in sys.argv
V7 = "--v7" in sys.argv   # metode v7 = v6 + target 2029 (sama dengan kartu); --v7 mengaktifkan v6 juga
if V7 and "--v6" not in sys.argv: sys.argv.append("--v6")
PROV = os.path.join(akar, "sumber/prov")
def kelebihan(i):
    """metode v5: orang di atas median laju provinsi (laju_persen, populasi_kelompok per provinsi)."""
    import csv, statistics
    f = os.path.join(PROV, i + ".csv")
    if not os.path.exists(f): return None
    r = [x for x in csv.DictReader(open(f, encoding="utf-8")) if x["laju_persen"] not in ("", None)]
    if len(r) < 34: return None
    med = statistics.median(float(x["laju_persen"]) for x in r)
    return sum(max(0.0, float(x["laju_persen"]) - med) * float(x["populasi_kelompok"]) / 100 for x in r if x["populasi_kelompok"])
def skala(k):
    if "target" not in k:
        if V5: e = kelebihan(k["_id"]); return math.log10(e) if e and e > 0 else float("-inf")
        return math.log10(k["orang"])
    lo, hi = rentang(k["target_2029"] if V7 and "target_2029" in k else k["target"]); v = k["nilai_nasional"]
    j = (v - hi) / hi if v > hi else (lo - v) / lo if v < lo else 0.0   # arah buruk = naik untuk dua indikator bertarget
    return math.log10(k["orang"] * j) if j > 0 else float("-inf")
def persentil(d):
    u = sorted(d.values()); n = len(u)
    return {i: (sum(x < v for x in u) + (sum(x == v for x in u) - 1) / 2) / (n - 1) if n > 1 else 0.5 for i, v in d.items()}
def peringkat(ids, w):
    ps = persentil({i: skala(K[i]) for i in ids}); pk = persentil({i: K[i]["keterpecahan"] for i in ids})
    sk = {i: w["skala"] * ps[i] + w["keterpecahan"] * pk[i] for i in ids}
    return sorted(ids, key=lambda i: (-sk[i], i)), sk, ps, pk
_lulus_hitung = {}
def uji(ids, nama):
    urut, sk, ps, pk = peringkat(ids, W); top = set(urut[:5]); hasil = []
    print(f"\n== {nama}: {len(ids)} kandidat lengkap")
    for r, i in enumerate(urut, 1):
        print(f"{r:2}. {i:22} skor {sk[i]:.3f}  skala {skala(K[i]):6.2f} (p{ps[i]:.2f})  keterpecahan {K[i]['keterpecahan']} (p{pk[i]:.2f})"
              + ("  [bertarget]" if "target" in K[i] else "  [tanpa target resmi]"))
    for c in W:
        for f in (1.25, 0.75):
            w = dict(W); w[c] = W[c] * f; s = sum(w.values()); w = {a: b / s for a, b in w.items()}
            t = set(peringkat(ids, w)[0][:5]); hasil.append(len(t & top))
            print(f"   {c} x{f}: tetap {len(t & top)}/5")
    lulus = min(hasil) >= 4; sah = len(ids) >= 30; _lulus_hitung[nama] = lulus
    print(f"   G2.3 {'lulus' if lulus else 'gagal'} perhitungan; {'SAH' if sah else ('LULUS TERBATAS (KEPUTUSAN Raihan 13 Nov; <30 kandidat lengkap)' if V6 else 'BELUM SAH (butuh >=30 kandidat lengkap)')}")
    return lulus and sah
V6 = "--v6" in sys.argv
BAG = {}
if V6:
    _b = yaml.safe_load(open(os.path.join(akar, "bank/bagian_kelompok_v1.yaml"), encoding="utf-8"))
    BAG = {**_b["ketat"], **_b["longgar"]}
    for _i in [i for i in K if (BAG.get(i) or {}).get("bagian") is not None and BAG[i]["bagian"] > 50]:
        print(f"v6 kebutuhan mayoritas ({BAG[_i]['bagian']}%), keluar dari peringkat:", _i); del K[_i]
if V5:  # kandidat tanpa target yang belum punya laju provinsi >=34 = belum lengkap untuk v5
    for _i in [i for i in K if "target" not in K[i] and kelebihan(i) is None]: print("v5 belum lengkap:", _i); del K[_i]
semua = sorted(K); bertarget = [i for i in semua if "target" in K[i]]
a = uji(semua, "semua"); b = uji(bertarget, "hanya bertarget") if len(bertarget) >= 2 else False
# Keluar: v6/v7 mengikuti KEPUTUSAN Raihan "Lulus terbatas" (metode_saringan_v6.status_ambang_30): lulus bila perhitungan
# set ketat lulus; uji hanya-bertarget (2 kandidat) hanya informasi. Tanpa v6: syarat lama (sah >=30, dua putaran).
if V6: sys.exit(0 if _lulus_hitung["semua"] else 1)
sys.exit(0 if a and b else 1)
