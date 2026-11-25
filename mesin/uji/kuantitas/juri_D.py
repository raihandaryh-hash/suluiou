#!/usr/bin/env python3
"""Butir 110 (juri v4.1; aturan putus terdaftar: dua juri, yaitu kuantitas ATAU perbandingan; regex dilaporkan terpisah). Bangun masukan juri dari set D (id diacak, label disembunyikan) dan nilai hasil juri + regex.
Pakai: juri_D.py bangun SET.jsonl FOLDER_KELUAR SEED   -> masuk.jsonl, peta.json, PROMPT_<mode>.md
       juri_D.py nilai SET.jsonl FOLDER_KELUAR           (membaca keluar_kuantitas.jsonl, keluar_perbandingan.jsonl)"""
import json, math, os, random, re, sys
AKAR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
def wilson(k, n, z=1.96):
    if n == 0: return 0.0
    p = k / n; a = p + z*z/(2*n); b = z*math.sqrt(p*(1-p)/n + z*z/(4*n*n)); return (a - b) / (1 + z*z/n)
def teks_obj(t): return t if isinstance(t, dict) else {"judul": "", "ringkasan": t, "harapan": ""}
cmd, SET, OUT = sys.argv[1:4]; os.makedirs(OUT, exist_ok=True)
R = [json.loads(l) for l in open(SET, encoding="utf-8") if l.strip()]
if cmd == "bangun":
    rg = random.Random(int(sys.argv[4])); X = R[:]; rg.shuffle(X); peta = {}
    with open(os.path.join(OUT, "masuk.jsonl"), "w", encoding="utf-8") as f:
        for i, r in enumerate(X):
            b = f"Z{i:03d}"; peta[b] = r["id"]
            f.write(json.dumps({"id": b, "kartu": {"wilayah": {"nama": "(lihat teks)"}, "populasi": "penduduk", "indikator": [{"kode": "prevalensi_stunting"}], "jarak": {"arah": "(tidak diberikan)"}},
                                "teks": teks_obj(r["teks"])}, ensure_ascii=False) + "\n")
    json.dump(peta, open(os.path.join(OUT, "peta.json"), "w"))
    d = json.load(open(os.path.join(AKAR, "juri", "definisi_mode_v4_1.json"), encoding="utf-8"))
    for m in ("kuantitas", "perbandingan"):
        open(os.path.join(OUT, f"PROMPT_{m}.md"), "w", encoding="utf-8").write(
            open(os.path.join(AKAR, "juri", "PROMPT_JURI_v4_1.md"), encoding="utf-8").read().replace("{MODE}", m).replace("{DEFINISI}", d[m]))
    print(len(X), "butir")
else:
    import importlib.util
    sp = importlib.util.spec_from_file_location("rk", os.path.join(AKAR, "jalur", "rangkai.py")); RK = importlib.util.module_from_spec(sp); sys.argv = [sys.argv[0]]; sp.loader.exec_module(RK)
    peta = json.load(open(os.path.join(OUT, "peta.json"))); S = {r["id"]: r for r in R}
    J = {}
    for m in ("kuantitas", "perbandingan"):
        p = os.path.join(OUT, f"keluar_{m}.jsonl")
        J[m] = {peta[o["butir"]]: bool(o["melanggar"]) for o in map(json.loads, open(p, encoding="utf-8"))} if os.path.exists(p) else {}
    def gab_teks(r): return " ".join(teks_obj(r["teks"]).values())
    def rx(r): t = RK.NAMA_WILAYAH.sub("", re.sub(r"\{[a-z_]+\}", "", gab_teks(r))); return bool(RK.KATA_KUANTITAS.search(t))
    F = {"regex": rx, "juri kuantitas": lambda r: J["kuantitas"].get(r["id"], False), "juri perbandingan": lambda r: J["perbandingan"].get(r["id"], False)}
    F["dua juri"] = lambda r: F["juri kuantitas"](r) or F["juri perbandingan"](r)
    F["gabungan"] = lambda r: F["regex"](r) or F["dua juri"](r)
    pos = [r for r in R if r["harus_ditolak"]]; neg = [r for r in R if not r["harus_ditolak"]]
    for nm, f in F.items():
        tp = sum(f(r) for r in pos); tn = sum(not f(r) for r in neg)
        print(f"{nm:18} TPR {tp}/{len(pos)} LB {wilson(tp, len(pos)):.3f} | TNR {tn}/{len(neg)} LB {wilson(tn, len(neg)):.3f}")
    for k in sorted({r["kelas"] for r in R}):
        g = [r for r in R if r["kelas"] == k]; f = F["gabungan"]
        print(f"  kelas {k}: gabungan {'tangkap' if g[0]['harus_ditolak'] else 'tolak salah'} {sum(f(r) for r in g)}/{len(g)}")
