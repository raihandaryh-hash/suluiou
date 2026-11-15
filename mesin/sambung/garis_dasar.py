#!/usr/bin/env python3
"""Gerbang D: garis dasar fungsi dan isi aplikasi tayang, dihitung dari git, tanpa menjalankan aplikasi.
Pakai:
  python3 garis_dasar.py potret <ref>            -> JSON ke stdout
  python3 garis_dasar.py banding <ref_lama> <ref_baru>  -> keluar 1 bila ada yang hilang
Yang dihitung: rute, fungsi tepi, halaman, pemanggilan fungsi tepi dari src, ekspor dan jumlah teks per berkas isi (src/data),
bidang province_contexts yang ditampilkan JalanBakti. Yang TIDAK dihitung: perilaku saat dijalankan, tampilan, isi basis data.
"""
import subprocess, re, json, sys, hashlib
import os
AKAR = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
def git(*a):
    return subprocess.run(["git", "-C", AKAR, *a], capture_output=True, text=True, check=True).stdout
def berkas(ref, awalan):
    return [p for p in git("ls-tree", "-r", "--name-only", ref, awalan).split("\n") if p]
def isi(ref, p):
    return git("show", f"{ref}:{p}")
def potret(ref):
    sha = git("rev-parse", ref).strip()
    app = isi(ref, "src/App.tsx")
    src = [p for p in berkas(ref, "src") if p.endswith((".ts", ".tsx"))]
    panggil = set()
    for p in src:
        for m in re.finditer(r"functions\s*\.\s*invoke\(\s*[\"'`]([\w-]+)", isi(ref, p)):
            panggil.add(f"{p} -> {m.group(1)}")
    data = {}
    for p in berkas(ref, "src/data"):
        t = isi(ref, p)
        data[p] = {"ekspor": sorted(set(re.findall(r"export\s+(?:const|function|type|interface|enum)\s+(\w+)", t))),
                   "teks_panjang": len(re.findall(r"[\"'`][^\"'`\n]{20,}[\"'`]", t)),
                   "sha256": hashlib.sha256(t.encode()).hexdigest()[:12]}
    jb = isi(ref, "src/pages/JalanBakti.tsx")
    kolom = ["narrative_hooks", "economic_sectors", "opportunities_2030", "fardhu_kifayah_gaps", "key_questions", "iou_program_relevance"]
    return {"ref": sha,
            "rute": sorted(set(re.findall(r"<Route\s+path=\"([^\"]+)\"", app))),
            "fungsi_tepi": sorted({p.split("/")[2] for p in berkas(ref, "supabase/functions") if p.split("/")[2] != "_shared"}),
            "halaman": sorted(berkas(ref, "src/pages")),
            "panggilan_fungsi_tepi": sorted(panggil),
            "isi": data,
            "bidang_provinsi_tampil": sorted(k for k in kolom if re.search(r"\b" + k + r"\b", jb))}
def banding(a, b):
    A, B = potret(a), potret(b)
    for P in (A, B):
        if not (P["rute"] and P["fungsi_tepi"] and P["halaman"] and P["isi"]):
            raise SystemExit("potret kosong: garis dasar tidak sah, periksa ref dan letak repo")
    hilang, berkurang = [], []
    for kunci in ("rute", "fungsi_tepi", "halaman", "panggilan_fungsi_tepi", "bidang_provinsi_tampil"):
        for x in A[kunci]:
            if x not in B[kunci]:
                hilang.append(f"{kunci}: {x}")
    for p, d in A["isi"].items():
        if p not in B["isi"]:
            hilang.append(f"isi: {p}")
            continue
        for e in d["ekspor"]:
            if e not in B["isi"][p]["ekspor"]:
                hilang.append(f"ekspor: {p}:{e}")
        if B["isi"][p]["teks_panjang"] < d["teks_panjang"]:
            berkurang.append(f"{p}: teks {d['teks_panjang']} -> {B['isi'][p]['teks_panjang']}")
    hit = lambda P: {k: len(P[k]) for k in ("rute", "fungsi_tepi", "halaman", "panggilan_fungsi_tepi", "bidang_provinsi_tampil")} | {"berkas_isi": len(P["isi"]), "ekspor_isi": sum(len(d["ekspor"]) for d in P["isi"].values()), "teks_panjang": sum(d["teks_panjang"] for d in P["isi"].values())}
    print(json.dumps({"lama": A["ref"][:7], "baru": B["ref"][:7], "hitungan_lama": hit(A), "hitungan_baru": hit(B), "hilang": hilang, "teks_berkurang_perlu_persetujuan": berkurang}, ensure_ascii=False, indent=1))
    return 1 if hilang else 0
if __name__ == "__main__":
    if sys.argv[1] == "potret":
        print(json.dumps(potret(sys.argv[2]), ensure_ascii=False, indent=1, sort_keys=True))
    else:
        sys.exit(banding(sys.argv[2], sys.argv[3]))
