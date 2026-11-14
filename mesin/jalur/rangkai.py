#!/usr/bin/env python3
"""Rangkai jalur `data` dari rantai_v2.yaml dan periksa G3.1 (rantai lengkap), G3.3 (keterjangkauan), lapis 1 G3.4.
v2 (14 Nov 2026) menerapkan tinjauan Fable 5.2: templat dipilih kode menurut aturan_pilih v2; dua mode (dewasa dan c)
dirender dan divalidasi terhadap skema keluaran penuh jalur-jelajah/1; semua teks dipindai; peran dicocokkan pada
(kebutuhan, peran, doc_id); bukti minimal satu; peran unik per jenis; kutipan hanya sah bila tercatat cocok di
uji/kutipan_terverifikasi.jsonl (dibuat di laptop terhadap teks dokumen bersidik).
Kode keluar: 1 bila ada cacat mekanis (rantai rusak, teks terlarang, klaim tanpa bukti). Vonis gerbang dicetak terpisah:
gerbang yang belum terpenuhi bukan cacat, klaim lulus tanpa bukti adalah cacat.
Pakai: python3 mesin/jalur/rangkai.py [--rantai BERKAS] [--kutipan-perlu BERKAS_JSON]
  --kutipan-perlu: tulis daftar kutipan yang harus diverifikasi di laptop, lalu keluar."""
import copy, csv, json, os, re, sys, yaml
from jsonschema import Draft202012Validator, FormatChecker
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(AKAR)
arg = lambda k, d=None: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
R = yaml.safe_load(open(arg("--rantai", os.path.join(AKAR, "jalur", "rantai_v2.yaml")), encoding="utf-8"))["jalur"]
T = yaml.safe_load(open(os.path.join(AKAR, "jalur", "templat_langkah_pertama_v2.yaml"), encoding="utf-8"))["templat"]
SAH = [json.loads(l) for l in open(os.path.join(AKAR, "peran", "usul_top3_keluaran.sah.jsonl"), encoding="utf-8")]
SAH3 = {(x["kebutuhan"], x["peran"], x["doc_id"]): x for x in SAH}
L0ROWS = list(csv.DictReader(open(os.path.join(AKAR, "sumber", "dokumen", "L0_register_v4.csv"), encoding="utf-8")))
L0K = {(r["kebutuhan"], r["doc_id"]): r for r in L0ROWS}
SIMPUL = set(re.findall(r'\{ id: "([a-z-]+)", layer:', open(os.path.join(REPO, "src", "data", "skillMapContent.ts"), encoding="utf-8").read()))
KARTU = [json.loads(l) for f in ("kartu_me2.jsonl", "kartu_me3_prov.jsonl") for l in open(os.path.join(AKAR, "kartu", "keluaran", f), encoding="utf-8")]
S = json.load(open(os.path.join(AKAR, "kontrak", "jalur-jelajah-1.schema.json"), encoding="utf-8"))
V = Draft202012Validator(S, format_checker=FormatChecker())
_src = open(os.path.join(AKAR, "kontrak", "buat_kontrak.py"), encoding="utf-8").read()
KATA_KUANTITAS = re.compile(re.search(r'KATA_KUANTITAS = re\.compile\(r"(.+?)"\)\n', _src).group(1))
# Lapis 1 G3.4 diperluas (tinjauan Fable K2): bentuk berimbuhan dan larangan mutlak.
VONIS = re.compile(r"(?i)(\b\w*wajib\w*\b|\bkeharusan\b|\bharus\b|\bhanya ini\b|\btidak ada jalan lain\b|\bjangan pilih\b|\bsatu-satunya\b|\bseharusnya\b|"
                   r"\btanggung jawabmu\b|\bberdosa\b|\bdosa\b|\bcukup\b|\btercukupi\b|\bfardh?u kifayah\b|\bkifayah\b|\bmengecewakan\b)")
PENGECUALIAN_VONIS = re.compile(r"(?i)\bwajib belajar\b")  # istilah program (UU 20/2003 Pasal 34), bukan vonis
PRIBADI_BIAYA = re.compile(r"(?i)\b(ktp|nik|nomor (ponsel|hp|telepon|whatsapp)|alamat rumah|foto diri|foto|bayar\w*|berbayar|biaya|transfer|rekening|kata sandi|password)\b")
TANPA_PINDAI = {"id", "url", "sumber_id", "kode", "sha256", "kartu_id", "kartu_versi", "wilayah_kode", "tingkat", "berlaku_sampai",
                "jenis", "kbji_kode", "simpul_skillmap", "satuan", "keandalan", "sumber_nama", "label", "penyelenggara"}
KONTAK_C = {"guru_bk", "orang_tua", "career_center", "orang_terdekat"}
PUTIH = re.compile(r"^https://([a-z0-9-]+\.)*(go\.id|who\.int|unicef\.org|ilo\.org)(/|$)")
RINGKAS = {"stunting-balita": "tumbuh kembang balita", "kemiskinan-kabkota": "keluarga yang hidup di bawah garis kemiskinan",
           "penduduk-tanpa-jaminan-kesehatan": "warga yang belum punya jaminan kesehatan"}
LABEL = {"prevalensi_stunting": "prevalensi stunting balita", "persentase_penduduk_miskin": "persentase penduduk miskin",
         "persen_tanpa_jaminan_kesehatan": "persentase penduduk tanpa jaminan kesehatan"}
NAMA_SUMBER = {"ssgi-2024": "Survei Status Gizi Indonesia 2024, Kemenkes", "kemiskinan-kabkota-2025": "Data dan Informasi Kemiskinan Kabupaten/Kota 2025, BPS",
               "bps-var-2279": "Tabel penduduk yang memiliki jaminan kesehatan 2025, BPS"}
# definisi_terbuka (14 Nov 20.2x): definisi resmi peran memuat kriterianya sendiri tanpa syarat pendidikan (mis. Permendagri 13/2024 Pasal 1 angka 8 Kader Posyandu).
GELAR_DIHITUNG = {"syarat_eksplisit", "keanggotaan_terbuka", "definisi_terbuka"}

def kutipan_rantai(r):
    out = [(j["sumber_id"], j["kutipan"]) for j in r["jalur_belajar"]]
    if r.get("mulai_tanpa_gelar") == "ya_berdokumen": out.append((r["mulai_tanpa_gelar_sumber"], r["mulai_tanpa_gelar_kutipan"]))
    if r.get("skill_kutipan"): out.append((r["skill_kutipan_sumber"], r["skill_kutipan"]))
    return out

if "--kutipan-perlu" in sys.argv:
    q = sorted({k for r in R for k in kutipan_rantai(r)})
    json.dump([{"doc_id": d, "kutipan": t} for d, t in q], open(arg("--kutipan-perlu"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("kutipan perlu diverifikasi:", len(q)); sys.exit(0)

_kv = os.path.join(AKAR, "uji", "kutipan_terverifikasi.jsonl")
KV = {(x["doc_id"], x["kutipan"]) for x in (json.loads(l) for l in open(_kv, encoding="utf-8")) if x["ada"]} if os.path.exists(_kv) else set()

def kartu_contoh(jenis):
    k = [x for x in KARTU if x["jenis_kebutuhan"] == jenis and x["jarak"]["arah"] == "di_atas"]
    return max(k, key=lambda x: (x["jarak"]["nilai"], x["id"])) if k else None

def jenis_peran(r): return SAH3[(r["kebutuhan"], r["peran"]["nama"], r["peran"]["doc_id"])]["jenis_peran"]

def pilih_templat(rs, mode):
    """aturan_pilih v2, dijalankan kode. rs = jalur satu jenis kebutuhan, urutan rantai."""
    pil = {}
    for r in rs:
        jp = jenis_peran(r)
        if mode == "c": pil[r["id"]] = "baca_pedoman" if jp == "formal" else "tanya_orang_dekat"
        elif jp == "formal": pil[r["id"]] = "baca_pedoman"
        else: pil[r["id"]] = "daftar_kegiatan" if r.get("tempat") else "tanya_orang_dekat"
    if "baca_pedoman" not in pil.values():
        cal = sorted(rs, key=lambda r: (jenis_peran(r) != "formal", r.get("cakupan_dokumen") != "nasional", rs.index(r)))
        pil[cal[0]["id"]] = "baca_pedoman"
    return pil

def rangkai(r, templat, mode):
    k = kartu_contoh(r["kebutuhan"]); ind = k["indikator"][0]; t = T[templat]
    frasa = r["peran_frasa"] if templat in ("daftar_kegiatan", "amati_dan_tanya") else r.get("peran_frasa_lengkap", r["peran_frasa"])
    langkah = t["teks"].replace("{peran}", frasa).replace("{kebutuhan_ringkas}", RINGKAS[r["kebutuhan"]]).replace("{tempat}", r.get("tempat") or "")
    url_c = lambda u: u if (mode != "c" or (u and PUTIH.match(u))) else None
    orang = r["kontak_c"] if mode == "c" else r["orang"]
    return {"id": r["id"], "jenis": "data", "judul": r["judul"],
        "kebutuhan": {"kartu_id": k["id"], "kartu_versi": k["versi"], "wilayah_kode": k["wilayah"]["kode_bps"], "tingkat": k["wilayah"]["tingkat"],
                      "berlaku_sampai": "2027-12-31", "ringkasan": "Di " + k["wilayah"]["nama"] + ", " + LABEL[ind["kode"]] + " tercatat {" + ind["kode"] + "}."},
        "angka_kunci": [{"kode": ind["kode"], "nilai": ind["nilai"], "satuan": "persen", "tahun_data": ind["tahun_data"], "label": LABEL[ind["kode"]],
                         "sumber_id": ind["sumber_id"], "sumber_nama": NAMA_SUMBER[ind["sumber_id"]], "url": ind["url"], "sha256": ind["sha256"], "keandalan": ind["keandalan"]}],
        "peran_contoh": [{"nama": r["peran"]["nama"], "kbji_kode": None, "jenis": jenis_peran(r), "sumber_id": r["peran"]["doc_id"]}],
        "skill": [{"nama": s["nama"], "simpul_skillmap": s["simpul"]} for s in r["skill"]],
        "jalur_belajar": [{"nama": j["nama"], "jenis": j["jenis"], "penyelenggara": j["penyelenggara"], "url": None if mode == "c" else L0K[(r["kebutuhan"], j["sumber_id"])]["url"],
                           "sumber_id": j["sumber_id"], "milik_iou": False} for j in r["jalur_belajar"]],
        "langkah_pertama": {"teks": langkah, "paling_lama_hari": t["paling_lama_hari"], "butuh_orang_lain": t["butuh_orang_lain"]},
        "orang_untuk_ditanya": [{"jenis": o["jenis"], "cara": o["cara"]} for o in orang],
        "keyakinan": "sedang" if r.get("cakupan_dokumen") == "nasional" else "rendah",
        "batas": r["batas"] + ("" if r["jalur_belajar"] else "; " + r["jalur_belajar_label"]),
        "bukti_cara_kerja": [{"sumber_id": b, "url": url_c(L0K[(r["kebutuhan"], b)]["url"])} for b in r["bukti"]], "harapan": r["harapan"]}, k

def keluaran_penuh(data, mode):
    """Bungkus jalur data dengan jalur cipta dan jalan lain minimal supaya divalidasi terhadap skema penuh."""
    kon = [{"jenis": "guru_bk", "cara": "ceritakan gagasanmu"}] if mode == "c" else [{"jenis": "orang_terdekat", "cara": "minta pendapat"}]
    cipta = {"id": "j-cipta", "jenis": "cipta", "judul": "Rancang caramu sendiri", "kartu_id": data[0]["kebutuhan"]["kartu_id"], "undangan": "Tulis dulu gagasanmu sendiri",
             "langkah_pertama": {"teks": "Tulis satu gagasan lalu uji kecil", "paling_lama_hari": 30, "butuh_orang_lain": False}, "orang_untuk_ditanya": kon,
             "keyakinan": "sedang", "batas": "belum diuji", "bukti_cara_kerja": [], "harapan": "Gagasan kecil yang kamu uji sendiri bisa menjadi awal yang berarti"}
    lain = {"id": "j-lain", "jenis": "jalan_lain", "judul": "Jalan yang kamu pilih juga bermakna", "tujuan": "jalan hidup lain yang kamu pilih", "peran_contoh": [],
            "langkah_pertama": {"teks": "Tulis apa yang ingin kamu tekuni pekan ini", "paling_lama_hari": 7, "butuh_orang_lain": False},
            "orang_untuk_ditanya": [{"jenis": "orang_tua", "cara": "bicarakan"}] if mode == "c" else [{"jenis": "komunitas", "cara": "cari kelompok sebaya"}],
            "keyakinan": "tinggi", "batas": "mesin tidak menilai pilihan ini", "bukti_cara_kerja": [], "harapan": "Pilihanmu ini juga jalan bermanfaat bagi dirimu dan sesama"}
    untuk = {"peran": "siswa", "jenjang": "kelas_12", "situasi": None, "kode_provinsi": "32", "kode_kabkota": None, "mode_ai": "c", "tujuan_di_luar_bank": False} if mode == "c" else \
            {"peran": "umum", "jenjang": None, "situasi": "bekerja", "kode_provinsi": "32", "kode_kabkota": None, "mode_ai": "dewasa", "tujuan_di_luar_bank": False}
    return {"kontrak": "jalur-jelajah/1", "id_permintaan": "rangkai-g31-" + mode, "dibuat": "2026-11-14T09:00:00+07:00", "versi_mesin": "mesin@rangkai-v2",
            "versi_data": "2026.1", "status": "ok", "untuk": untuk, "jalur": data + [cipta, lain], "rujukan": None, "untuk_pemilik": {"alasan": []},
            "pernyataan": {"jalan_lain_sah": True, "bukan_fatwa": True, "teks_tetap_id": "teks-tetap-1"}, "pemberitahuan_tarik": [],
            "jejak": {"kartu_dipakai": [d["kebutuhan"]["kartu_id"] for d in data], "gerbang": {}, "model": {}}, "bingkai_nilai_id": None}

def pindai(o, jalan=""):
    """Semua teks string pada objek jalur, kecuali kunci teknis. Kembalikan daftar pelanggaran."""
    salah = []
    if isinstance(o, dict):
        for k, v in o.items():
            if k in TANPA_PINDAI: continue
            salah += pindai(v, jalan + "." + k)
    elif isinstance(o, list):
        for i, v in enumerate(o): salah += pindai(v, f"{jalan}[{i}]")
    elif isinstance(o, str):
        t = re.sub(r"\{[a-z_]+\}", "", o)
        t = re.sub(r"(?i)\bpersentase\b", "", t)          # nama indikator, bukan besaran (sama dengan kartu.periksa_teks)
        t2 = PENGECUALIAN_VONIS.sub("", t)
        if not jalan.endswith("peran_contoh[0].nama") and re.search(r"\d", t): salah.append(f"digit di {jalan}")
        if KATA_KUANTITAS.search(t): salah.append(f"kuantitas '{KATA_KUANTITAS.search(t).group(0)}' di {jalan}")
        if VONIS.search(t2): salah.append(f"vonis '{VONIS.search(t2).group(0)}' di {jalan}")
        if PRIBADI_BIAYA.search(t): salah.append(f"data pribadi atau biaya '{PRIBADI_BIAYA.search(t).group(0)}' di {jalan}")
    return salah

def periksa_rantai(r):
    """Tujuh mata rantai + cacat mekanis. Kembalikan (mata_rantai, cacat)."""
    m, cacat = [], []
    k = kartu_contoh(r["kebutuhan"])
    m.append(("kebutuhan", k is not None, (k["id"] + " " + k["status"]) if k else "tanpa kartu"))
    kunci = (r["kebutuhan"], r["peran"]["nama"], r["peran"]["doc_id"])
    ok = kunci in SAH3 and (r["kebutuhan"], r["peran"]["doc_id"]) in L0K
    m.append(("peran", ok, r["peran"]["doc_id"]))
    if not ok: cacat.append("peran tidak ada di berkas sah untuk kebutuhan ini")
    ok = bool(r["skill"]) and all(s["simpul"] in SIMPUL for s in r["skill"])
    m.append(("skill", ok, ",".join(s["simpul"] for s in r["skill"]) + ("" if r.get("skill_kutipan") else " (sintesis, tanpa kutipan)")))
    if not ok: cacat.append("simpul skill tidak ada")
    if r["jalur_belajar"]:
        okd = all((r["kebutuhan"], j["sumber_id"]) in L0K for j in r["jalur_belajar"])
        okq = all((j["sumber_id"], j["kutipan"]) in KV for j in r["jalur_belajar"])
        m.append(("jalur_belajar", okd and okq, "kutipan terverifikasi" if okq else "KUTIPAN BELUM TERVERIFIKASI"))
        if not (okd and okq): cacat.append("jalur belajar tanpa dokumen terdaftar atau kutipan terverifikasi")
    else:
        m.append(("jalur_belajar", bool(r.get("jalur_belajar_label")), "kosong berlabel"))
        if not r.get("jalur_belajar_label"): cacat.append("jalur belajar kosong tanpa label")
    m.append(("langkah_pertama", True, "dipilih kode"))
    okc = bool(r.get("kontak_c")) and all(o["jenis"] in KONTAK_C for o in r["kontak_c"])
    m.append(("orang", bool(r["orang"]) and okc, ",".join(o["jenis"] for o in r["orang"]) + " | c: " + ",".join(o["jenis"] for o in r.get("kontak_c", []))))
    if not (r["orang"] and okc): cacat.append("kontak dewasa atau kontak mode (c) kosong/terlarang")
    okb = bool(r["bukti"]) and all((r["kebutuhan"], b) in L0K for b in r["bukti"])
    m.append(("bukti", okb, "dokumen resmi L0: " + ",".join(r["bukti"])))
    if not okb: cacat.append("bukti kosong atau tidak terdaftar untuk kebutuhan ini")
    if r.get("mulai_tanpa_gelar") == "ya_berdokumen":
        if (r["kebutuhan"], r.get("mulai_tanpa_gelar_sumber")) not in L0K or (r["mulai_tanpa_gelar_sumber"], r["mulai_tanpa_gelar_kutipan"]) not in KV:
            cacat.append("klaim tanpa gelar tanpa kutipan terverifikasi")
        if r.get("jenis_bukti_gelar") not in GELAR_DIHITUNG | {"asal_kader", "jalan_masuk"}: cacat.append("jenis_bukti_gelar tak dikenal")
    if r.get("skill_kutipan") and (r.get("skill_kutipan_sumber"), r["skill_kutipan"]) not in KV: cacat.append("kutipan skill belum terverifikasi")
    if not (r.get("peran_frasa") or "").strip(): cacat.append("peran_frasa kosong (teks langkah akan rusak)")
    if r.get("harapan_jenis") not in ("bisa_dilakukan", "terbukti"): cacat.append("harapan tanpa jenis")
    if r.get("harapan_jenis") == "terbukti": cacat.append("harapan 'terbukti' butuh baris Evidence DB Live (belum didukung)")
    return m, cacat

# --- jalankan
hasil, keluaran, cacat_semua = [], {"dewasa": [], "c": []}, []
jenis_all = sorted({r["kebutuhan"] for r in R})
for je in jenis_all:
    rs = [r for r in R if r["kebutuhan"] == je]
    nama = [r["peran"]["nama"] for r in rs]
    if len(set(nama)) != len(nama): cacat_semua.append(f"{je}: peran ganda dalam satu jenis")
    if len({r["id"] for r in rs}) != len(rs): cacat_semua.append(f"{je}: id ganda")
    rusak = False
    for r in rs:
        m, c = periksa_rantai(r)
        hasil.append([r, m, c, {}])
        cacat_semua += [f"{r['id']}: {x}" for x in c]
        rusak |= bool(c) or not all(x[1] for x in m)
    if rusak: continue
    for mode in ("dewasa", "c"):
        pil = pilih_templat(rs, mode)
        data = []
        for r in rs:
            t = pil[r["id"]]
            if mode == "c" and not T[t]["mode_c"]: cacat_semua.append(f"{r['id']}: templat {t} terlarang di mode (c)")
            if T[t]["butuh_tempat"] and not r.get("tempat"): cacat_semua.append(f"{r['id']}: templat {t} butuh tempat")
            if jenis_peran(r) not in T[t]["cocok_untuk"]: cacat_semua.append(f"{r['id']}: templat {t} tidak cocok untuk {jenis_peran(r)}")
            j, k = rangkai(r, t, mode)
            data.append(j); next(h for h in hasil if h[0] is r)[3][mode] = t
            for p in pindai(j): cacat_semua.append(f"{r['id']} ({mode}): {p}")
        if not any(not d["langkah_pertama"]["butuh_orang_lain"] for d in data): cacat_semua.append(f"{je} ({mode}): tidak ada jalur data berlangkah mandiri")
        o = keluaran_penuh(data, mode)
        for e in V.iter_errors(o): cacat_semua.append(f"{je} ({mode}): skema: {e.message[:100]}")
        keluaran[mode] += data

print("# G3.1 rantai lengkap, G3.3 keterjangkauan, G3.4 lapis 1 · rangkai.py v2")
print(f"kutipan terverifikasi tercatat: {len(KV)} (uji/kutipan_terverifikasi.jsonl)\n")
print("| jalur | kebutuhan | peran | skill | jalur belajar | langkah (dewasa / c) | orang | bukti | cacat |\n|---|---|---|---|---|---|---|---|---|")
for r, m, c, t in hasil:
    sel = [("ya" if x[1] else "TIDAK") + f" ({x[2]})" for x in m]
    sel[4] = f"{t.get('dewasa', '-')} / {t.get('c', '-')}"
    print(f"| {r['id']} | " + " | ".join(sel) + f" | {'; '.join(c) or '-'} |")
print("\n## Vonis per jenis")
g31_jenis, g33_jenis = {}, {}
for je in jenis_all:
    hs = [h for h in hasil if h[0]["kebutuhan"] == je]
    mek = sum(1 for r, m, c, t in hs if not c and all(x[1] for x in m))
    k = kartu_contoh(je); tayang = k is not None and k["status"] != "draf"
    g31_jenis[je] = "LULUS" if mek >= 2 and tayang else ("LULUS MEKANIS, kartu " + (k["status"] if k else "tidak ada") if mek >= 2 else "GAGAL")
    tg = [r["id"] for r, m, c, t in hs if r.get("mulai_tanpa_gelar") == "ya_berdokumen" and r.get("jenis_bukti_gelar") in GELAR_DIHITUNG and not c]
    nf = [r["id"] for r, m, c, t in hs if not c and jenis_peran(r) in ("nonformal", "sukarela")]
    g33_jenis[je] = "LULUS" if tg and nf else "BELUM"
    print(f"- {je}: rantai {mek} dari {len(hs)} lulus mekanis → G3.1 {g31_jenis[je]}; tanpa gelar dengan syarat eksplisit: {tg or 'TIDAK ADA'}; "
          f"nonformal/sukarela (label pemeta): {nf or 'TIDAK ADA'} → G3.3 {g33_jenis[je]}")
lulus = lambda d: sum(v == "LULUS" for v in d.values())
print(f"\nG3.1: {lulus(g31_jenis)} dari {len(jenis_all)} jenis lulus gerbang")
print(f"G3.3: {lulus(g33_jenis)} dari {len(jenis_all)} jenis lulus")
print(f"G3.4 lapis 1: {sum(('vonis' in x) or ('kuantitas' in x) or ('pribadi' in x) for x in cacat_semua)} pelanggaran pada seluruh teks jalur; lapis 2 (juri) belum")
print(f"\nCACAT MEKANIS: {len(cacat_semua)}")
for x in cacat_semua: print("  -", x)
if not cacat_semua and "--rantai" not in sys.argv:
    with open(os.path.join(AKAR, "jalur", "keluaran_jalur_me3.jsonl"), "w", encoding="utf-8") as f:
        for mode in ("dewasa", "c"):
            for j in keluaran[mode]: f.write(json.dumps({"mode": mode, **j}, ensure_ascii=False, sort_keys=True) + "\n")
sys.exit(1 if cacat_semua else 0)
