#!/usr/bin/env python3
"""Skor saringan ME2 dan uji stabilitas G2.3 (metode_saringan v1-v4, bobot_v2).
Pakai: python3 alat/saringan.py [bank/komponen_saringan_v1.yaml]
skala: bertarget -> log10(orang x jarak relatif ke batas target terdekat), di dalam rentang -> skala terendah;
tanpa target -> log10(orang). Normalisasi persentil (0 terendah, 1 tertinggi; seri dirata-rata).
G2.3: tiap bobot +-25%, bobot lain dinormalisasi ulang; lulus bila >=4 dari 5 teratas tetap; sah hanya bila >=30 lengkap.
Dijalankan dua kali: semua kandidat lengkap, dan hanya yang bertarget. Keluar 1 bila G2.3 tidak lulus sah."""
import math, os, re, sys, yaml
akar = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
K = yaml.safe_load(open(sys.argv[1] if len(sys.argv) > 1 else os.path.join(akar, "bank/komponen_saringan_v1.yaml"), encoding="utf-8"))["kandidat"]
W = yaml.safe_load(open(os.path.join(akar, "bank/bobot_v2.yaml"), encoding="utf-8"))["komponen"]
def rentang(s):
    a, b = re.match(r"([\d,]+)-([\d,]+)", s).groups(); return float(a.replace(",", ".")), float(b.replace(",", "."))
def skala(k):
    if "target" not in k: return math.log10(k["orang"])
    lo, hi = rentang(k["target"]); v = k["nilai_nasional"]
    j = (v - hi) / hi if v > hi else (lo - v) / lo if v < lo else 0.0   # arah buruk = naik untuk dua indikator bertarget
    return math.log10(k["orang"] * j) if j > 0 else float("-inf")
def persentil(d):
    u = sorted(d.values()); n = len(u)
    return {i: (sum(x < v for x in u) + (sum(x == v for x in u) - 1) / 2) / (n - 1) if n > 1 else 0.5 for i, v in d.items()}
def peringkat(ids, w):
    ps = persentil({i: skala(K[i]) for i in ids}); pk = persentil({i: K[i]["keterpecahan"] for i in ids})
    sk = {i: w["skala"] * ps[i] + w["keterpecahan"] * pk[i] for i in ids}
    return sorted(ids, key=lambda i: (-sk[i], i)), sk, ps, pk
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
    lulus = min(hasil) >= 4; sah = len(ids) >= 30
    print(f"   G2.3 {'lulus' if lulus else 'gagal'} perhitungan; {'SAH' if sah else 'BELUM SAH (butuh >=30 kandidat lengkap)'}")
    return lulus and sah
semua = sorted(K); bertarget = [i for i in semua if "target" in K[i]]
a = uji(semua, "semua"); b = uji(bertarget, "hanya bertarget") if len(bertarget) >= 2 else False
sys.exit(0 if a and b else 1)
