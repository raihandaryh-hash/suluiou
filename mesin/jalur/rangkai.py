#!/usr/bin/env python3
"""Rangkai jalur `data` dari rantai_v1.yaml dan periksa G3.1 (rantai lengkap) serta G3.3 (keterjangkauan).
Tiap jalur dirangkai untuk satu wilayah contoh per jenis (kartu dengan jarak terbesar) lalu divalidasi terhadap
varian `data` di kontrak jalur-jelajah/1 plus periksa_tambahan kontrak.
Pakai: python3 mesin/jalur/rangkai.py [--dokumen DIR_TEKS_L0]
  --dokumen: folder teks dokumen L0 (laptop MESIN/dokumen); tanpa ini kutipan jalur belajar dan syarat ditandai "tidak diperiksa".
Keluar 0 bila G3.1 lulus (G3.3 dilaporkan, tidak menentukan kode keluar)."""
import csv, json, os, re, sys, yaml
from jsonschema import Draft202012Validator, FormatChecker
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(AKAR)
DOK = sys.argv[sys.argv.index("--dokumen") + 1] if "--dokumen" in sys.argv else None
R = yaml.safe_load(open(os.path.join(AKAR, "jalur", "rantai_v1.yaml"), encoding="utf-8"))["jalur"]
T = yaml.safe_load(open(os.path.join(AKAR, "jalur", "templat_langkah_pertama_v1.yaml"), encoding="utf-8"))["templat"]
SAH = [json.loads(l) for l in open(os.path.join(AKAR, "peran", "usul_top3_keluaran.sah.jsonl"), encoding="utf-8")]
L0 = {r["doc_id"]: r for r in csv.DictReader(open(os.path.join(AKAR, "sumber", "dokumen", "L0_register_v3.csv"), encoding="utf-8"))}
SIMPUL = set(re.findall(r'\{ id: "([a-z-]+)", layer:', open(os.path.join(REPO, "src", "data", "skillMapContent.ts"), encoding="utf-8").read()))
KARTU = [json.loads(l) for f in ("kartu_me2.jsonl", "kartu_me3_prov.jsonl") for l in open(os.path.join(AKAR, "kartu", "keluaran", f), encoding="utf-8")]
S = json.load(open(os.path.join(AKAR, "kontrak", "jalur-jelajah-1.schema.json"), encoding="utf-8"))
V_DATA = Draft202012Validator(S["properties"]["jalur"]["items"]["oneOf"][0], format_checker=FormatChecker())
_src = open(os.path.join(AKAR, "kontrak", "buat_kontrak.py"), encoding="utf-8").read()
KATA_KUANTITAS = re.compile(re.search(r'KATA_KUANTITAS = re\.compile\(r"(.+?)"\)\n', _src).group(1))
VONIS = re.compile(r"(?i)\b(wajib|harus menjadi|satu-satunya|seharusnya|tanggung jawabmu|berdosa|cukup|tercukupi|fardh?u kifayah|kifayah)\b")
ORANG = {"guru_bk", "orang_tua", "career_center", "praktisi", "komunitas", "orang_terdekat"}
RINGKAS = {"stunting-balita": "tumbuh kembang balita", "kemiskinan-kabkota": "keluarga yang hidup di bawah garis kemiskinan",
           "penduduk-tanpa-jaminan-kesehatan": "warga yang belum punya jaminan kesehatan"}
LABEL = {"prevalensi_stunting": "prevalensi stunting balita", "persentase_penduduk_miskin": "persentase penduduk miskin",
         "persen_tanpa_jaminan_kesehatan": "persentase penduduk tanpa jaminan kesehatan"}
NAMA_SUMBER = {"ssgi-2024": "Survei Status Gizi Indonesia 2024, Kemenkes", "kemiskinan-kabkota-2025": "Data dan Informasi Kemiskinan Kabupaten/Kota 2025, BPS",
               "bps-var-2279": "Tabel penduduk yang memiliki jaminan kesehatan 2025, BPS"}
teks_dok = {}
def ada_di_dokumen(doc, kutipan):
    if DOK is None: return None
    if doc not in teks_dok:
        teks_dok[doc] = re.sub(r"\s+", " ", open(os.path.join(DOK, doc + ".txt"), encoding="utf-8", errors="ignore").read())
    return re.sub(r"\s+", " ", kutipan) in teks_dok[doc]

def kartu_contoh(jenis):
    k = [x for x in KARTU if x["jenis_kebutuhan"] == jenis and x["jarak"]["arah"] == "di_atas"]
    return max(k, key=lambda x: (x["jarak"]["nilai"], x["id"])) if k else None

def rangkai(r):
    k = kartu_contoh(r["kebutuhan"]); ind = k["indikator"][0]; t = T[r["templat"]]
    peran_jenis = next(x["jenis_peran"] for x in SAH if x["peran"] == r["peran"]["nama"] and x["doc_id"] == r["peran"]["doc_id"])
    langkah = t["teks"].replace("{peran}", r["peran"]["nama"].split(" (")[0].lower()).replace("{kebutuhan_ringkas}", RINGKAS[r["kebutuhan"]]).replace("{tempat}", r.get("tempat", ""))
    return {"id": r["id"], "jenis": "data", "judul": r["judul"],
        "kebutuhan": {"kartu_id": k["id"], "kartu_versi": k["versi"], "wilayah_kode": k["wilayah"]["kode_bps"], "tingkat": k["wilayah"]["tingkat"],
                      "berlaku_sampai": "2027-12-31", "ringkasan": "Di " + k["wilayah"]["nama"] + ", " + LABEL[ind["kode"]] + " tercatat {" + ind["kode"] + "}."},
        "angka_kunci": [{"kode": ind["kode"], "nilai": ind["nilai"], "satuan": "persen", "tahun_data": ind["tahun_data"], "label": LABEL[ind["kode"]],
                         "sumber_id": ind["sumber_id"], "sumber_nama": NAMA_SUMBER[ind["sumber_id"]], "url": ind["url"], "sha256": ind["sha256"], "keandalan": ind["keandalan"]}],
        "peran_contoh": [{"nama": r["peran"]["nama"], "kbji_kode": None, "jenis": peran_jenis, "sumber_id": r["peran"]["doc_id"]}],
        "skill": [{"nama": s["nama"], "simpul_skillmap": s["simpul"]} for s in r["skill"]],
        "jalur_belajar": [{"nama": j["nama"], "jenis": j["jenis"], "penyelenggara": j["penyelenggara"], "url": L0[j["sumber_id"]]["url"],
                           "sumber_id": j["sumber_id"], "milik_iou": False} for j in r["jalur_belajar"]],
        "langkah_pertama": {"teks": langkah, "paling_lama_hari": t["paling_lama_hari"], "butuh_orang_lain": t["butuh_orang_lain"]},
        "orang_untuk_ditanya": [{"jenis": o["jenis"], "cara": o["cara"]} for o in r["orang"]],
        "keyakinan": "sedang", "batas": r["batas"] + ("" if r["jalur_belajar"] else "; " + r["jalur_belajar_label"]),
        "bukti_cara_kerja": [{"sumber_id": b, "url": L0[b]["url"]} for b in r["bukti"]], "harapan": r["harapan"]}, k

def periksa(r, j, k):
    """Tujuh mata rantai; tiap mata rantai: (nama, lulus, catatan)."""
    m = []
    m.append(("kebutuhan", k is not None, f"{k['id']} status {k['status']}" + (f" ({k.get('alasan_draf')})" if k and k["status"] == "draf" else "")))
    ok_peran = any(x["peran"] == r["peran"]["nama"] and x["doc_id"] == r["peran"]["doc_id"] for x in SAH) and r["peran"]["doc_id"] in L0
    m.append(("peran", ok_peran, r["peran"]["doc_id"]))
    m.append(("skill", all(s["simpul"] in SIMPUL for s in r["skill"]), ",".join(s["simpul"] for s in r["skill"])))
    if r["jalur_belajar"]:
        cek = [ada_di_dokumen(x["sumber_id"], x["kutipan"]) for x in r["jalur_belajar"]]
        ok = all(x["sumber_id"] in L0 for x in r["jalur_belajar"]) and all(c is not False for c in cek)
        m.append(("jalur_belajar", ok, "kutipan " + ("cocok" if all(cek) else "tidak diperiksa" if None in cek else "TIDAK COCOK")))
    else:
        m.append(("jalur_belajar", bool(r.get("jalur_belajar_label")), "kosong berlabel"))
    m.append(("langkah_pertama", r["templat"] in T and bool(set(T[r["templat"]]["cocok_untuk"]) & {j["peran_contoh"][0]["jenis"]}), r["templat"] + " (templat menunggu tinjauan sekali)"))
    m.append(("orang", bool(r["orang"]) and all(o["jenis"] in ORANG for o in r["orang"]), ",".join(o["jenis"] for o in r["orang"])))
    m.append(("bukti", all(b in L0 for b in r["bukti"]), "dokumen resmi L0: " + ",".join(r["bukti"])))
    return m

def periksa_teks(j):
    salah = [e.message[:90] for e in V_DATA.iter_errors(j)]
    for t in (j["judul"], j["batas"], j["harapan"], j["langkah_pertama"]["teks"], re.sub(r"\{[a-z_]+\}", "", j["kebutuhan"]["ringkasan"])):
        t = re.sub(r"(?i)\bpersentase\b", "", t)  # nama indikator, bukan besaran (sama dengan kartu.periksa_teks)
        if KATA_KUANTITAS.search(t): salah.append("kuantitas: " + KATA_KUANTITAS.search(t).group(0))
        if VONIS.search(t): salah.append("vonis: " + VONIS.search(t).group(0))
        if re.search(r"\d", t): salah.append("digit: " + t[:40])
    for ph in re.findall(r"\{([a-z_]+)\}", j["kebutuhan"]["ringkasan"]):
        if ph not in {a["kode"] for a in j["angka_kunci"]}: salah.append("placeholder asing " + ph)
    return salah

hasil, keluaran, g31 = [], [], True
for r in R:
    j, k = rangkai(r); m = periksa(r, j, k); s = periksa_teks(j)
    lulus = all(x[1] for x in m) and not s; g31 &= lulus
    keluaran.append(j); hasil.append((r, m, s, lulus, k))
jenis_all = sorted({r["kebutuhan"] for r in R})
print("# G3.1 rantai lengkap dan G3.3 keterjangkauan")
print(f"dokumen teks: {'diperiksa di ' + DOK if DOK else 'tidak tersedia (kutipan tidak diperiksa)'}\n")
print("| jalur | kebutuhan | peran | skill | jalur belajar | langkah | orang | bukti | teks | lulus |\n|---|---|---|---|---|---|---|---|---|---|")
for r, m, s, l, k in hasil:
    print(f"| {r['id']} | " + " | ".join(("ya" if x[1] else "TIDAK") + f" ({x[2]})" for x in m) + f" | {'ya' if not s else '; '.join(s)} | {'LULUS' if l else 'GAGAL'} |")
print()
g33 = True
for je in jenis_all:
    rs = [r for r in R if r["kebutuhan"] == je]; n_l = sum(l for r, m, s, l, k in hasil if r["kebutuhan"] == je)
    tg = [r["id"] for r in rs if r["mulai_tanpa_gelar"] == "ya_berdokumen"]
    nf = [r["id"] for r, m, s, l, k in hasil if r["kebutuhan"] == je and m[1][1] and next(x["jenis_peran"] for x in SAH if x["peran"] == r["peran"]["nama"] and x["doc_id"] == r["peran"]["doc_id"]) in ("nonformal", "sukarela")]
    kd = {k["status"] for r, m, s, l, k in hasil if r["kebutuhan"] == je}
    g33 &= bool(tg) and bool(nf)
    print(f"- {je}: {n_l} jalur lulus rantai (perlu ≥2); kartu berstatus {','.join(sorted(kd))}; tanpa gelar berdokumen: {tg or 'TIDAK ADA'}; nonformal/sukarela: {nf or 'TIDAK ADA'}")
g31_jenis = all(sum(l for r, m, s, l, k in hasil if r["kebutuhan"] == je) >= 2 for je in jenis_all)
syarat = []
if any(k["status"] == "draf" for r, m, s, l, k in hasil): syarat.append("kartu draf: " + ", ".join(sorted({k["id"].split(".")[0] for r, m, s, l, k in hasil if k["status"] == "draf"})))
syarat.append("templat langkah pertama belum ditinjau")
if DOK is None: syarat.append("kutipan jalur belajar belum diperiksa terhadap teks dokumen")
mek = g31_jenis and g31
print(f"\nG3.1: {'GAGAL' if not mek else 'LULUS BERSYARAT' if syarat else 'LULUS'} (semua jalur lulus mekanis: {g31}; ≥2 per jenis: {g31_jenis})")
for x in syarat: print("  syarat:", x)
print(f"G3.3: {'LULUS' if g33 else 'GAGAL'}")
with open(os.path.join(AKAR, "jalur", "keluaran_jalur_me3.jsonl"), "w", encoding="utf-8") as f:
    for j in keluaran: f.write(json.dumps(j, ensure_ascii=False, sort_keys=True) + "\n")
sys.exit(0 if g31_jenis and g31 else 1)
