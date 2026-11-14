#!/usr/bin/env python3
"""Pengurai SSGI 2024 (Buku Hasil SSGI 2024 Dalam Angka, Kemenkes BKPK).
Masukan: PDF resmi bersidik (lihat mesin/sumber/ssgi-2024.yaml). Keluaran: CSV indikator per kab/kota.
Angka tidak pernah melewati model: tiap baris membawa halaman, nomor tabel, dan teks baris aslinya.
Pakai: python3 -I ssgi_2024.py BERKAS.pdf KELUARAN.csv
"""
import csv, hashlib, re, subprocess, sys

SIDIK = "06eae149a5f84888c1f0dab6ce8506a2dbf2e3ad93da3c2809f09e091e2a7c65"
INDIKATOR = ["stunting", "underweight", "severe_wasting", "wasting", "overweight"]
NUM = r"\d{1,3}(?:[.,]\d)?"
NAMA = re.compile(r"^\s*([A-Z][A-Za-z.'\- ]+?)\s{2,}(\d.*)$")
GRUP = re.compile(r"(" + NUM + r")\s+(?:(" + NUM + r")\s*[-\u2013]\s*(" + NUM + r")|([-\u2013]))(?=\s|$)")

def pecah(sisa):
    """Pecah sisa baris jadi grup (nilai, bawah, atas); CI '-' saja -> (nilai, None, None)."""
    grup, pos = [], 0
    for m in GRUP.finditer(sisa):
        if sisa[pos:m.start()].strip(): return None
        grup.append((m.group(1), m.group(2), m.group(3))); pos = m.end()
    return grup if not sisa[pos:].strip() else None
JUDUL = re.compile(r"Tabel (4\.(\d+)) Prevalensi Balita Provinsi (.+?) Bermasalah Gizi")

def f(s): return None if s is None else float(s.replace(",", "."))

def keandalan(nilai, bawah, atas):
    """Tingkat keandalan dari lebar CI 95% (rencana mesin §3: RSE >25% hati-hati, >50% ditekan).
    RSE didekati (atas-bawah)/3,92/nilai; CI nol-nol = tidak_diketahui."""
    if bawah is None or atas is None or atas <= bawah or nilai <= 0: return "tidak_diketahui", None
    rse = (atas - bawah) / 3.92 / nilai
    t = "andal" if rse < 0.25 else ("hati_hati" if rse < 0.50 else "ditekan")  # batas: RSE >= 50% tidak disajikan (cek ME1, lihat uji/CEK_AMBANG_RSE.md)
    return t, round(rse, 4)

def urai(pdf):
    sha = hashlib.sha256(open(pdf, "rb").read()).hexdigest()
    if sha != SIDIK: sys.exit(f"TOLAK: sidik berkas {sha[:12]} bukan sidik kontrak {SIDIK[:12]}")
    halaman = int(re.search(r"Pages:\s+(\d+)", subprocess.run(["pdfinfo", pdf], capture_output=True, text=True).stdout).group(1))
    keluar, tabel, prov, ditolak = [], None, None, []
    for h in range(1, halaman + 1):
        teks = subprocess.run(["pdftotext", "-layout", "-f", str(h), "-l", str(h), pdf, "-"], capture_output=True, text=True).stdout
        for b in teks.splitlines():
            if "...." in b: continue  # daftar isi
            j = JUDUL.search(b)
            if not j and re.match(r"\s*Tabel \d", b):
                tabel = None  # tabel lain dimulai: blok kab/kota selesai
                continue
            if j:
                tabel, prov = j.group(1), j.group(3).strip()
                continue
            if not tabel: continue
            m = NAMA.match(b)
            if not m: continue
            nama, g = m.group(1).strip(), pecah(m.group(2))
            if g is None or len(g) != 5:
                ditolak.append((h, nama, "-", f"kolom tak lengkap ({0 if g is None else len(g)} dari 5)")); continue
            for (sn, slo, shi), ind in zip(g, INDIKATOR):
                n, lo, hi = f(sn), f(slo), f(shi)
                cacat = []
                if "." in sn: cacat.append("titik desimal")
                if "," not in sn and "." not in sn: cacat.append("tanpa desimal")
                if lo is not None and not (lo <= n <= hi): cacat.append("nilai di luar CI")
                t, rse = keandalan(n, lo, hi)
                if "nilai di luar CI" in cacat: t = "ditekan"
                keluar.append(dict(provinsi=prov, kabkota=nama, indikator=ind, nilai=n, ci_bawah=lo, ci_atas=hi,
                                   rse_dekat=rse, keandalan=t, cacat_terbitan=";".join(cacat), tabel=tabel, halaman=h,
                                   baris_asli=b.strip()))
    return sha, keluar, ditolak

if __name__ == "__main__":
    sha, rows, tolak = urai(sys.argv[1])
    with open(sys.argv[2], "w", newline="", encoding="utf-8") as o:
        w = csv.DictWriter(o, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
    kab = {(r["provinsi"], r["kabkota"]) for r in rows}
    print(f"sidik {sha[:12]} · {len(kab)} kab/kota · {len({r['provinsi'] for r in rows})} provinsi · {len(rows)} baris · tertolak {len(tolak)}")
    for t in tolak[:40]: print("  tolak:", t)
