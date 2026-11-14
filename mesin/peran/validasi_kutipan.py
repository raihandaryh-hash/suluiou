#!/usr/bin/env python3
"""Validator kutipan pemeta peran (G3.2 butir 1). Usulan atau periksa=true ditolak bila: kutipan tidak ditemukan persis
(spasi dinormalkan) di teks dokumen; dokumen tidak terdaftar untuk kebutuhan itu di register L0; kata utama nama peran tidak
ada di kutipan; kutipan >40 kata. Tanpa model.
Pakai: python validasi_kutipan.py KELUARAN_PEMETA.jsonl REGISTER.csv FOLDER_DOKUMEN  -> mencetak hitungan; menulis *.sah.jsonl"""
import csv, json, re, sys, unicodedata
OUT, REG, DOK = sys.argv[1:4]
norm = lambda s: re.sub(r"\s+", " ", unicodedata.normalize("NFKC", s or "")).strip().lower()
reg = {(r["kebutuhan"], r["doc_id"]) for r in csv.DictReader(open(REG, encoding="utf-8"))}
cache = {}
def teks(d):
    if d not in cache:
        try: cache[d] = norm(open(f"{DOK}/{d}.txt", encoding="utf-8").read())
        except FileNotFoundError: cache[d] = None
    return cache[d]
UMUM = {"tenaga", "petugas", "dan", "atau", "yang", "di", "ke", "dari", "untuk", "pada", "para", "tim"}
def kata_peran(p): return [w for w in re.findall(r"[a-z0-9]+", norm(p)) if w not in UMUM and len(w) > 2]
sah, tolak = [], []
for l in open(OUT, encoding="utf-8"):
    r = json.loads(l)
    if "status" in r or r.get("didukung") is False: sah.append(r); continue
    k, d, q = r.get("kebutuhan"), r.get("doc_id"), norm(r.get("kutipan"))
    t = teks(d); sebab = None
    if (k, d) not in reg: sebab = "dokumen tidak terdaftar untuk kebutuhan"
    elif t is None: sebab = "teks dokumen tidak ada"
    elif not q or q not in t: sebab = "kutipan tidak ditemukan persis"
    elif len(q.split()) > 40: sebab = "kutipan > 40 kata"
    elif not any(w in q for w in kata_peran(r.get("peran", ""))): sebab = "nama peran tidak ada di kutipan"
    (tolak if sebab else sah).append(dict(r, **({"ditolak": sebab} if sebab else {})))
json_out = OUT.rsplit(".", 1)[0]
with open(json_out + ".sah.jsonl", "w", encoding="utf-8") as f:
    for r in sah: f.write(json.dumps(r, ensure_ascii=False) + "\n")
with open(json_out + ".tolak.jsonl", "w", encoding="utf-8") as f:
    for r in tolak: f.write(json.dumps(r, ensure_ascii=False) + "\n")
import collections
print("sah", len(sah), "ditolak", len(tolak), dict(collections.Counter(r["ditolak"] for r in tolak)))
