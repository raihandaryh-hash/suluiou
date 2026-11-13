#!/usr/bin/env python3
"""Siapkan bundel mode PERIKSA: untuk tiap pasangan (id, kebutuhan, peran) tanpa label, ambil cuplikan dari dokumen
register L0 kebutuhan itu yang memuat kata utama nama peran (jendela ±700 karakter, paling banyak 6 per pasangan).
Pakai: python siapkan_periksa.py PASANGAN.jsonl REGISTER.csv FOLDER_DOKUMEN KELUARAN.jsonl"""
import csv, json, re, sys
PAS, REG, DOK, OUT = sys.argv[1:5]
UMUM = {"tenaga", "petugas", "dan", "atau", "yang", "di", "ke", "dari", "untuk", "pada", "para", "tim", "lembaga", "unit"}
per = {}
for r in csv.DictReader(open(REG, encoding="utf-8")): per.setdefault(r["kebutuhan"], set()).add(r["doc_id"])
teks = {}
def t(d):
    if d not in teks:
        try: teks[d] = open(f"{DOK}/{d}.txt", encoding="utf-8").read()
        except FileNotFoundError: teks[d] = ""
    return teks[d]
with open(OUT, "w", encoding="utf-8", newline="\n") as f:
    for l in open(PAS, encoding="utf-8"):
        p = json.loads(l); kata = [w for w in re.findall(r"[a-z0-9]+", p["peran"].lower()) if w not in UMUM and len(w) > 2]
        cup = []
        for d in sorted(per.get(p["kebutuhan"], [])):
            x = t(d)
            for w in kata[:3]:
                for m in re.finditer(re.escape(w), x, re.I):
                    a, b = max(0, m.start() - 700), min(len(x), m.end() + 700)
                    if any(c["doc_id"] == d and a < c["akhir"] and b > c["awal"] for c in cup): continue
                    cup.append({"doc_id": d, "awal": a, "akhir": b, "teks": x[a:b]})
                    if len(cup) >= 6: break
                if len(cup) >= 6: break
        f.write(json.dumps(dict(p, cuplikan=[dict(c, id=f"{p['id']}#{i}") for i, c in enumerate(cup)]), ensure_ascii=False) + "\n")
        print(p["id"], len(cup))
