#!/usr/bin/env python3
"""Validator pemeta v3.2 (PROMPT_PEMETA_v3; tinjauan Fable 15 Nov P6). Tanpa model. Aturan:
1. dokumen terdaftar untuk kebutuhan; teks dokumen ada; kutipan persis ada di teks dokumen DAN di teks cuplikan_id; ≤40 kata.
2. nama peran: kata utuh, minimal min(2, jumlah kata inti) kata nama peran ada di kutipan.
3. bukan peran orang: kata kepala nama (kata pertama) harus kata pelaku orang (daftar PELAKU), dan nama tidak memuat lembaga
   (daftar LEMBAGA) kecuali didahului kata pelaku; jabatan politik dan kepala daerah ditolak di mana pun.
4. kata_tugas: ada di kutipan; kata pertama berawalan me-, ber-, atau di- dan bukan kata fungsi (TOLAK_TUGAS); muncul dalam 15 kata
   dari sebutan peran di kutipan.
5. penanda kebutuhan: dicari dengan batas kata di kedua sisi, sesudah seluruh frasa nama peran (nama + kata berhuruf kapital yang
   menyambung) dibuang; di kutipan atau di kutipan_kebutuhan, yang wajib persis ada di teks cuplikan_id yang sama, ≤40 kata.
Pakai: python validasi_kutipan_v3_2.py KELUARAN.jsonl REGISTER.csv FOLDER_DOKUMEN FOLDER_CUPLIKAN -> *.sah.jsonl, *.tolak.jsonl
FOLDER_CUPLIKAN berisi berkas .json (daftar) atau .jsonl dengan butir {id, teks}."""
import csv, glob, json, os, re, sys, unicodedata
OUT, REG, DOK, CUP = sys.argv[1:5]
norm = lambda s: re.sub(r"\s+", " ", unicodedata.normalize("NFKC", s or "")).strip().lower()
reg = {(r["kebutuhan"], r["doc_id"]) for r in csv.DictReader(open(REG, encoding="utf-8"))}
cache = {}
def teks(d):
    if d not in cache:
        try: cache[d] = norm(open(os.path.join(DOK, d + ".txt"), encoding="utf-8").read())
        except FileNotFoundError: cache[d] = None
    return cache[d]
CUPLIKAN = {}
for f in glob.glob(os.path.join(CUP, "*.json")) + glob.glob(os.path.join(CUP, "*.jsonl")):
    isi = json.load(open(f, encoding="utf-8")) if f.endswith(".json") else [json.loads(l) for l in open(f, encoding="utf-8") if l.strip()]
    for c in isi: CUPLIKAN[c["id"]] = norm(c["teks"])
UMUM = {"dan", "atau", "yang", "di", "ke", "dari", "untuk", "pada", "para", "serta"}
def kata(s): return re.findall(r"[a-z0-9]+", norm(s))
PELAKU = {"kepala", "ketua", "wakil", "sekretaris", "bendahara", "anggota", "koordinator", "staf", "staff", "petugas", "kader", "pendamping",
          "tenaga", "operator", "fasilitator", "bidan", "dokter", "perawat", "penyuluh", "relawan", "direktur", "manajer", "supervisor",
          "kabid", "kasi", "kaur", "kasubag", "pj", "penanggung", "pengelola", "pekerja", "duta", "agen", "asisten", "verifikator",
          "enumerator", "pendata", "pencacah", "mentor", "pelatih", "guru", "konselor", "analis", "juru", "deputi", "babinsa", "babinkamtibmas",
          "tksk", "psm", "kpm", "pkh", "ro", "relationship", "administrator", "ahli", "nutrisionis", "sanitarian", "penggerak", "motivator",
          "pemasar"}
LEMBAGA = {"tim", "kelompok", "pokja", "satgas", "satuan", "forum", "lembaga", "organisasi", "dinas", "badan", "kementerian", "pemerintah",
           "sekretariat", "opd", "uptd", "upt", "unit", "kantor", "fasilitas", "puskesmas", "posyandu", "bumdes", "koperasi", "yayasan",
           "daerah", "bidang", "seksi", "subbagian", "direktorat", "kedeputian", "cabang", "karang", "taruna", "tpps", "tpk", "tkpk", "tkpkd"}
POLITIK = re.compile(r"(?i)\b(menteri|gubernur|bupati|wali ?kota|walikota|camat|kepala desa|lurah|kepala daerah|presiden|wakil presiden|wali nagari)\b")
TOLAK_TUGAS = {"melalui", "merupakan", "berdasarkan", "bersama", "berupa", "berada", "bertempat", "berlaku", "dimaksud", "diatur", "dengan",
               "dalam", "dinas", "demikian", "diri", "dimana", "digunakan", "memiliki", "menjadi", "mengenai", "meliputi", "berikut", "beserta",
               "terhadap", "tersebut", "termasuk"}
KERJA = re.compile(r"^(me|ber|di)[a-z]{3,}$")
PENANDA = {"kemiskinan-kabkota": ["miskin", "kemiskinan", "fakir", "kesejahteraan sosial", "bantuan sosial", "bansos", "dtks", "dtsen", "pkh", "rentan"],
           "penduduk-tanpa-jaminan-kesehatan": ["jaminan kesehatan", "jkn", "bpjs kesehatan", "kepesertaan", "pbi", "kis",
                                                "iuran (?:jkn|jaminan|bpjs|peserta|kepesertaan)"],
           "stunting-balita": ["stunting", "gizi", "balita", "baduta", "posyandu", "tumbuh kembang", "penimbangan",
                               "pengukuran (?:balita|tinggi|panjang|berat|antropometri|serentak)", "ibu hamil"]}
def tanda(k, s): return any(re.search(r"\b" + p + r"\b", s) for p in PENANDA.get(k, []))
def frasa_peran(mentah, peran):
    """Rentang frasa nama peran di kutipan mentah: kemunculan kata nama peran + kata berhuruf kapital/singkatan yang menyambung."""
    kp = [w for w in re.findall(r"[A-Za-z0-9]+", peran) if w.lower() not in UMUM]
    if not kp: return []
    pola = re.compile(r"(?i:\b" + re.escape(kp[0]) + r")\b(?:[\s/().-]+(?:[A-Z][\w/-]*))*")
    return [m.span() for m in pola.finditer(mentah)]
def buang_frasa(mentah, peran):
    out = mentah
    for a, b in sorted(frasa_peran(mentah, peran), reverse=True): out = out[:a] + " " + out[b:]
    return norm(out)
def dekat(qk_kata, peran_kata, tugas_kata, jarak=15):
    idx_p = [i for i, w in enumerate(qk_kata) if w in peran_kata]; idx_t = [i for i, w in enumerate(qk_kata) if w == tugas_kata]
    return any(abs(i - j) <= jarak for i in idx_p for j in idx_t)
sah, tolak = [], []
for l in open(OUT, encoding="utf-8"):
    if not l.strip(): continue
    r = json.loads(l)
    if "status" in r: sah.append(r); continue
    k, d, mentah = r.get("kebutuhan"), r.get("doc_id"), r.get("kutipan") or ""
    q, qk, kt, peran = norm(mentah), norm(r.get("kutipan_kebutuhan")), norm(r.get("kata_tugas")), r.get("peran", "")
    t, c = teks(d), CUPLIKAN.get(r.get("cuplikan_id"))
    pk = [w for w in kata(peran) if w not in UMUM]; qw = kata(q); sebab = None
    if (k, d) not in reg: sebab = "dokumen tidak terdaftar untuk kebutuhan"
    elif t is None: sebab = "teks dokumen tidak ada"
    elif c is None: sebab = "cuplikan tidak ditemukan"
    elif not q or q not in t or q not in c: sebab = "kutipan tidak ditemukan persis di dokumen dan cuplikan"
    elif len(q.split()) > 40: sebab = "kutipan > 40 kata"
    elif sum(w in qw for w in set(pk)) < min(2, len(set(pk))): sebab = "nama peran tidak ada di kutipan (kata utuh)"
    elif POLITIK.search(peran): sebab = "jabatan politik atau kepala daerah"
    elif not pk or pk[0] not in PELAKU: sebab = "bukan peran orang (kata kepala bukan pelaku)"
    elif not kt or kt not in q or not KERJA.match(kt.split()[0]) or kt.split()[0] in TOLAK_TUGAS: sebab = "kata tugas tidak ada atau bukan kata kerja tugas"
    elif not dekat(qw, {pk[0]}, kt.split()[0]): sebab = "kata tugas jauh dari sebutan peran"
    elif qk and (qk not in c or len(qk.split()) > 40): sebab = "kutipan kebutuhan tidak ada persis di cuplikan yang sama atau > 40 kata"
    elif not tanda(k, buang_frasa(mentah, peran)) and not (qk and tanda(k, buang_frasa(r.get("kutipan_kebutuhan") or "", peran))): sebab = "penanda kebutuhan tidak ada di luar nama peran"
    (tolak if sebab else sah).append(dict(r, **({"ditolak": sebab} if sebab else {})))
o = OUT.rsplit(".", 1)[0]
for akhir, isi in ((".sah.jsonl", sah), (".tolak.jsonl", tolak)):
    with open(o + akhir, "w", encoding="utf-8", newline="\n") as f:
        for r in isi: f.write(json.dumps(r, ensure_ascii=False) + "\n")
from collections import Counter
print("sah", len(sah), "ditolak", len(tolak), dict(Counter(r["ditolak"] for r in tolak)))
