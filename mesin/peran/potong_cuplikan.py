#!/usr/bin/env python3
"""Pemotong cuplikan untuk pemeta peran (L5, ME3). Untuk tiap kebutuhan, ambil jendela teks di sekitar kata kunci kebutuhan
(peran/kata_kunci_kebutuhan.json) dari dokumen register L0 yang terdaftar untuk kebutuhan itu, yang juga memuat kata isyarat
pelaksana. Tanpa model. Tidak membaca SU-3.
Pakai: python potong_cuplikan.py REGISTER.csv KATA_KUNCI.json FOLDER_DOKUMEN FOLDER_KELUARAN"""
import csv, json, os, re, sys, hashlib
REG, KK, DOK, OUT = sys.argv[1:5]; os.makedirs(OUT, exist_ok=True)
ISYARAT = re.compile(r"(?i)pelaksana|dilaksanakan oleh|bertugas|tugas|melibatkan|kader|tenaga|pendamping|petugas|penyuluh|relawan|"
                     r"fasilitator|koordinator|tim percepatan|satuan tugas|bidan|guru|pekerja sosial|penanggung jawab|berperan")
LEBAR, BATAS = 700, 30
kk = {k: re.compile(v, re.I) for k, v in json.load(open(KK, encoding="utf-8")).items()}
per = {}
for r in csv.DictReader(open(REG, encoding="utf-8")): per.setdefault(r["kebutuhan"], []).append(r["doc_id"])
for keb, pola in sorted(kk.items()):
    cup = []
    for did in sorted(set(per.get(keb, []))):
        p = os.path.join(DOK, did + ".txt")
        if not os.path.exists(p): continue
        t = open(p, encoding="utf-8").read(); jend = []
        for m in pola.finditer(t):
            a, b = max(0, m.start() - LEBAR), min(len(t), m.end() + LEBAR)
            if jend and a <= jend[-1][1]: jend[-1][1] = b
            else: jend.append([a, b])
        for a, b in jend:
            s = t[a:b]; n = len(ISYARAT.findall(s))
            if n: cup.append({"kebutuhan": keb, "doc_id": did, "awal": a, "akhir": b, "isyarat": n, "teks": s})
    cup = sorted(cup, key=lambda c: (-c["isyarat"], c["doc_id"], c["awal"]))[:BATAS]
    with open(os.path.join(OUT, keb + ".jsonl"), "w", encoding="utf-8", newline="\n") as f:
        for i, c in enumerate(cup): f.write(json.dumps(dict(c, id=f"{keb}#{i}"), ensure_ascii=False) + "\n")
    print(keb, len(set(per.get(keb, []))), "dok", sum(os.path.exists(os.path.join(DOK, d + ".txt")) for d in set(per.get(keb, []))), "ada teks", len(cup), "cuplikan")
