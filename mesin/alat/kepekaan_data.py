#!/usr/bin/env python3
"""Uji kepekaan saringan terhadap ATURAN DATA (bukan bobot). Menjawab: bila aturan data dilonggarkan, atau angka turunan
meleset, apakah urutan tetap sama? Pakai metode skala yang berlaku di alat/saringan.py (v3) dan bobot_v2.
Varian: K = ketat (komponen_saringan_v2); L1 = + rumah tangga dikali anggota / aproksimasi kasar; L2 = + basis sasaran
program; L3 = + sumber sekunder; L4 = + rentang/ukuran tidak persis; L5 = semua kelonggaran. Plus gangguan angka:
tiap angka TURUNAN/aproksimasi dikali 0,7 atau 1,3 secara acak (200 ulangan, benih tetap).
Angka kelonggaran dicatat di LONGGAR di bawah, diambil dari laporan riset 13 Nov (label SINTESIS), BUKAN dipakai kartu."""
import importlib.util, os, random, sys, yaml, math
akar = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sp = importlib.util.spec_from_file_location("s", os.path.join(akar, "alat/saringan.py"))
src = open(sp.origin).read().split("semua = sorted(K)")[0]; ns = {"__file__": sp.origin}
sys.argv = [sp.origin, os.path.join(akar, "bank/komponen_saringan_v2.yaml")]; exec(src, ns)
K, peringkat, W = ns["K"], ns["peringkat"], ns["W"]
LONGGAR = {  # id: (varian, orang, keterpecahan v4, asal)
 "air-minum-layak": ("L1", 19.3e6, 0.5, "persen RT x jiwa"), "sanitasi-layak": ("L1", 41.6e6, 1, "persen RT x jiwa"),
 "persalinan-tanpa-nakes": ("L2", 182683, 1, "SKI x sasaran Kemenkes"), "anemia-ibu-hamil": ("L2", 1359288, 0.5, "SKI x sasaran"),
 "imunisasi-dasar-tidak-lengkap": ("L2", 1.65e6, 0.5, "0-4/5 sebagai basis"),
 "kekerasan-anak": ("L3", 11.5e6, 0.5, "Antara"), "guru-honorer": ("L3", 237196, 0.5, "IDN Times"),
 "pekerja-anak": ("L4", 1052789, 1, "5-17 bukan 10-17"), "anak-tanpa-akta-lahir": ("L4", 4.9e6, 0.5, "basis 0-17 aproksimasi"),
 "kesehatan-jiwa-remaja": ("L4", 4.36e6, 0.5, "ukuran beda"), "disabilitas-sekolah": ("L4", 5.68e6, 0.5, "bukan usia sekolah"),
 "anak-tanpa-orang-tua-kandung": ("L4", 0.51e6, 0.5, "hanya 0-6"), "penduduk-terpapar-bencana": ("L4", 271130365, 0.5, "tak dipilah kelas"),
}
TURUNAN = [i for i, k in K.items() if "x" in str(k.get("rumus", "")) or "TURUNAN" in str(k.get("rumus", ""))]
def tambah(varian):
    for i, (v, o, kp, a) in LONGGAR.items():
        if varian == "L5" or v == varian: K[i] = {"orang": o, "keterpecahan": kp, "rumus": a + " x"}
def kendall(a, b):
    c = [x for x in a if x in b]; ra = {x: i for i, x in enumerate(a)}; rb = {x: i for i, x in enumerate(b)}
    n = len(c); s = sum(1 if (ra[c[i]] - ra[c[j]]) * (rb[c[i]] - rb[c[j]]) > 0 else -1 for i in range(n) for j in range(i + 1, n))
    return s / (n * (n - 1) / 2)
asli = dict(K); dasar = peringkat(sorted(K), W)[0]; top = dasar[:5]
print("ketat:", len(dasar), "kandidat; 5 teratas:", ", ".join(top))
for v in ["L1", "L2", "L3", "L4", "L5"]:
    K.clear(); K.update(asli); tambah(v); u = peringkat(sorted(K), W)[0]; ketat_saja = [x for x in u if x in asli]
    print(f"{v}: {len(u):2} kandidat | 5 teratas tetap {len(set(ketat_saja[:5]) & set(top))}/5 (di antara kandidat ketat) | "
          f"tau urutan ketat {kendall(dasar, ketat_saja):.2f} | masuk 5 teratas baru: {[x for x in u[:5] if x not in asli]}")
K.clear(); K.update(asli); random.seed(13); hasil = []; tau = []
for _ in range(200):
    for i in TURUNAN: K[i] = dict(asli[i], orang=asli[i]["orang"] * random.choice([0.7, 1.3]))
    u = peringkat(sorted(K), W)[0]; hasil.append(len(set(u[:5]) & set(top))); tau.append(kendall(dasar, u))
print(f"gangguan +-30% pada {len(TURUNAN)} angka turunan, 200 ulangan: 5 teratas tetap min {min(hasil)}/5, "
      f">=4/5 pada {sum(h >= 4 for h in hasil)}/200; tau median {sorted(tau)[100]:.2f}")
K.clear(); K.update(asli); tambah("L5"); t5 = set(peringkat(sorted(K), W)[0][:5]); r = []
for c in W:
    for f in (1.25, 0.75):
        w = dict(W); w[c] *= f; s = sum(w.values()); w = {a: b / s for a, b in w.items()}
        r.append(len(set(peringkat(sorted(K), w)[0][:5]) & t5))
print(f"uji bobot +-25% atas set longgar L5 ({len(K)} kandidat): 5 teratas tetap {r}")
