#!/usr/bin/env python3
"""Validator pemeta v3.1 (PROMPT_PEMETA_v3; butir 108: penanda dicari di kutipan sesudah nama peran dibuang). Validator v3: Sama dengan v2, ditambah: kata_tugas boleh frasa (kata pertama diuji); penanda kebutuhan wajib di kutipan atau kutipan_kebutuhan (persis, satu cuplikan dokumen, ≤40 kata). Aturan v1 (kutipan persis, dokumen terdaftar, nama peran di kutipan, ≤40 kata) ditambah:
nama peran bukan tim, lembaga, atau jabatan politik dan kepala daerah; `kata_tugas` wajib ada di kutipan dan berbentuk kata kerja
(berimbuhan me-, ber-, di-, men-, meng-, meny-, mem-, atau kata "tugas"). Tanpa model.
Pakai: python validasi_kutipan_v2.py KELUARAN.jsonl REGISTER.csv FOLDER_DOKUMEN  -> *.sah.jsonl dan *.tolak.jsonl"""
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
UMUM = {"tenaga", "petugas", "dan", "atau", "yang", "di", "ke", "dari", "untuk", "pada", "para"}
def kata_peran(p): return [w for w in re.findall(r"[a-z0-9]+", norm(p)) if w not in UMUM and len(w) > 2]
BUKAN_ORANG = re.compile(r"(?i)^\s*(tim|kelompok|pokja|satgas|satuan|forum|lembaga|organisasi|dinas|badan|kementerian|pemerintah|"
                         r"tp[ -]?pkk|tim penggerak|karang ?taruna|posyandu|puskesmas|bumdes|koperasi|menteri|gubernur|bupati|wali ?kota|"
                         r"walikota|camat|kepala desa|lurah|kepala daerah)\b")
KERJA = re.compile(r"(?i)^(me|ber|di|ter|pe)[a-z]{3,}$|^tugas$|^bertugas$")
PENANDA = {"kemiskinan-kabkota": ["miskin", "kemiskinan", "fakir", "kesejahteraan sosial", "bantuan sosial", "bansos", "dtks", "dtsen", "pkh", "rentan"],
           "penduduk-tanpa-jaminan-kesehatan": ["jaminan kesehatan", "jkn", "bpjs kesehatan", "kepesertaan", "pbi", "kis", "iuran"],
           "stunting-balita": ["stunting", "gizi", "balita", "baduta", "posyandu", "tumbuh kembang", "penimbangan", "pengukuran", "ibu hamil"]}
def tanda(k, s): return any(re.search(r"\b" + re.escape(p), s) for p in PENANDA.get(k, []))
def tanpa_peran(s, p):
    n = norm(p)
    return s.replace(n, " ") if n else s
sah, tolak = [], []
for l in open(OUT, encoding="utf-8"):
    r = json.loads(l)
    if "status" in r: sah.append(r); continue
    k, d, q = r.get("kebutuhan"), r.get("doc_id"), norm(r.get("kutipan"))
    t = teks(d); kt = norm(r.get("kata_tugas")); qk = norm(r.get("kutipan_kebutuhan")); sebab = None
    if (k, d) not in reg: sebab = "dokumen tidak terdaftar untuk kebutuhan"
    elif t is None: sebab = "teks dokumen tidak ada"
    elif not q or q not in t: sebab = "kutipan tidak ditemukan persis"
    elif len(q.split()) > 40: sebab = "kutipan > 40 kata"
    elif not any(w in q for w in kata_peran(r.get("peran", ""))): sebab = "nama peran tidak ada di kutipan"
    elif BUKAN_ORANG.search(r.get("peran", "")): sebab = "bukan peran orang (tim, lembaga, jabatan politik)"
    elif not kt or kt not in q or not KERJA.match(kt.split()[0]): sebab = "kata tugas tidak ada di kutipan atau bukan kata kerja"
    elif qk and (qk not in t or len(qk.split()) > 40): sebab = "kutipan kebutuhan tidak ditemukan persis atau > 40 kata"
    elif not tanda(k, tanpa_peran(q, r.get("peran", ""))) and not (qk and tanda(k, tanpa_peran(qk, r.get("peran", "")))): sebab = "penanda kebutuhan tidak ada di kutipan"
    (tolak if sebab else sah).append(dict(r, **({"ditolak": sebab} if sebab else {})))
o = OUT.rsplit(".", 1)[0]
for akhir, isi in ((".sah.jsonl", sah), (".tolak.jsonl", tolak)):
    with open(o + akhir, "w", encoding="utf-8", newline="\n") as f:
        for r in isi: f.write(json.dumps(r, ensure_ascii=False) + "\n")
from collections import Counter
print("sah", len(sah), "ditolak", len(tolak), dict(Counter(r["ditolak"] for r in tolak)))
