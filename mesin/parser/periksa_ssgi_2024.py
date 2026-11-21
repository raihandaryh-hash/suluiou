#!/usr/bin/env python3
"""Pemeriksa angka SSGI 2024 (lapis L2v). Tidak memakai model.
Uji: (1) nilai di dalam CI-nya sendiri; (2) nilai provinsi Tabel 4.1 berada di antara min dan maks kab/kota-nya;
(3) cacah kab/kota = 514; (4) reproduksi: dua kali urai memberi sidik tabel sama; (5) mutasi G1.3m: 100 angka L3
diubah acak, pemeriksa reproduksi wajib menangkap semuanya.
Belum diuji di sini: publikasi kedua yang independen (G1.3). Lihat laporan SU-0.
Pakai: python3 -I periksa_ssgi_2024.py BERKAS.pdf"""
import csv, hashlib, io, random, re, subprocess, sys
sys.path.insert(0, __file__.rsplit("/", 1)[0])
import ssgi_2024 as P

ALIAS = {"Bangka Belitung": "Kep. Bangka Belitung"}  # nama di Tabel 4.1 vs judul Tabel 4.11

def tabel_provinsi(pdf):
    teks = subprocess.run(["pdftotext", "-layout", "-f", "40", "-l", "44", pdf, "-"], capture_output=True, text=True).stdout
    i = re.search(r"Tabel 4\.1 Prevalensi Balita Bermasalah Gizi Berdasarkan Status Gizi menurut Provinsi\s*\n", teks).end()
    hasil, tak = {}, []
    for b in teks[i:].splitlines()[:60]:
        if b.strip().startswith("INDONESIA"): break
        m = re.match(r"^\s*([A-Z][A-Za-z.' ]+?)\s+(\d.*)$", b)
        if not m: continue
        g = P.pecah(re.sub(r"\s*([-\u2013])\s*", r" \1 ", m.group(2)))
        if not g or len(g) != 5: tak.append(m.group(1).strip()); continue
        hasil[ALIAS.get(m.group(1).strip(), m.group(1).strip())] = {ind: P.f(x[0]) for x, ind in zip(g, P.INDIKATOR)} | {"_ci": [(P.f(x[1]), P.f(x[2])) for x in g]}
    return hasil, tak

def sidik(rows):
    buf = io.StringIO(); w = csv.writer(buf)
    for r in rows: w.writerow([r["provinsi"], r["kabkota"], r["indikator"], r["nilai"], r["ci_bawah"], r["ci_atas"]])
    return hashlib.sha256(buf.getvalue().encode()).hexdigest()

def main(pdf):
    _, rows, tolak = P.urai(pdf)
    temuan = []
    luar_ci = [r for r in rows if "nilai di luar CI" in r["cacat_terbitan"]]
    temuan.append(f"(1) nilai di luar CI kab/kota: {len(luar_ci)} sel → ditekan: " + "; ".join(f"{r['kabkota']} {r['indikator']} {r['nilai']} [{r['ci_bawah']}–{r['ci_atas']}] hlm {r['halaman']}" for r in luar_ci))
    prov, tak = tabel_provinsi(pdf)
    nprov_ci = [(p, ind, v[ind], v["_ci"][k]) for p, v in prov.items() for k, ind in enumerate(P.INDIKATOR) if v["_ci"][k][0] is not None and not (v["_ci"][k][0] <= v[ind] <= v["_ci"][k][1])]
    temuan.append(f"    nilai di luar CI provinsi: {len(nprov_ci)}: " + "; ".join(f"{p} {i} {n} {c}" for p, i, n, c in nprov_ci) + (f" · baris provinsi tak terurai: {', '.join(tak)}" if tak else ""))
    rentang = []
    for p, v in prov.items():
        for ind in P.INDIKATOR:
            ks = [r["nilai"] for r in rows if r["provinsi"] == p and r["indikator"] == ind and not r["cacat_terbitan"]]
            if ks and not (min(ks) <= v[ind] <= max(ks)): rentang.append(f"{p} {ind} {v[ind]} di luar [{min(ks)}, {max(ks)}]")
    temuan.append(f"(2) provinsi di luar rentang kab/kotanya: {len(rentang)} dari {len(prov)*5}: " + "; ".join(rentang))
    nkab = len({(r['provinsi'], r['kabkota']) for r in rows}) + len(tolak)
    temuan.append(f"(3) cacah kab/kota: {nkab} (terurai {nkab-len(tolak)}, kolom tak lengkap {len(tolak)}) · harapan 514 → {'cocok' if nkab == 514 else 'TIDAK COCOK'}")
    s1 = sidik(rows); _, rows2, _ = P.urai(pdf); s2 = sidik(rows2)
    temuan.append(f"(4) reproduksi: sidik tabel {s1[:12]} vs {s2[:12]} → {'identik' if s1 == s2 else 'BERBEDA'}")
    rnd = random.Random(20261112); tangkap = 0
    for _ in range(100):
        mut = [dict(r) for r in rows]; k = rnd.randrange(len(mut))
        mut[k]["nilai"] = round(mut[k]["nilai"] + rnd.choice([-1, 1]) * rnd.choice([0.1, 1.0, 10.0]), 1)
        tangkap += sidik(mut) != s1 and any(a["nilai"] != b["nilai"] for a, b in zip(mut, rows2))
    temuan.append(f"(5) mutasi G1.3m: {tangkap} dari 100 tertangkap (ambang ≥98)")
    ada = sum(1 for r in rows if r["keandalan"] == "tidak_diketahui"); hh = sum(1 for r in rows if r["keandalan"] == "hati_hati"); dt = sum(1 for r in rows if r["keandalan"] == "ditekan")
    temuan.append(f"(6) keandalan: andal {len(rows)-ada-hh-dt} · hati_hati {hh} · ditekan {dt} · tidak_diketahui {ada} ({ada/len(rows):.1%}; ambang ≤20%)")
    st = [r for r in rows if r["indikator"] == "stunting"]
    temuan.append(f"    khusus stunting: hati_hati {sum(r['keandalan']=='hati_hati' for r in st)} · ditekan {sum(r['keandalan']=='ditekan' for r in st)} · tidak_diketahui {sum(r['keandalan']=='tidak_diketahui' for r in st)} dari {len(st)}")
    print("\n".join(temuan)); return s1

if __name__ == "__main__": main(sys.argv[1])
