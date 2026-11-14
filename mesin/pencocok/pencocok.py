#!/usr/bin/env python3
"""Pencocok jalur ME3 (rencana §3 L6, §4.5), dijalankan di luar produksi. Deterministik, tanpa model:
kartu dipilih aturan tetap dari wilayah dan medan; jalur diambil dari rantai_v2 lewat jalur/rangkai.py; urutan jalur
tetap (data menurut urutan rantai, lalu cipta, lalu jalan lain; jalan lain pertama bila tujuan di luar bank).
Pemeriksa distress lapis 1 = src/lib/distress.ts (dibundel esbuild, identik byte dengan salinan server).
Lapis 1b (pengklasifikasi model) di produksi tidak dipakai di sini; G4.4 di sini mengukur lapis 1 saja.
Masukan persona: {id, untuk{...}, medan_pilihan[], refleksi|null, tujuan_teks|null}. Keluaran: objek jalur-jelajah/1.
Pakai sebagai modul: from pencocok import cocokkan_banyak, validasi"""
import copy, hashlib, json, os, re, subprocess, sys, tempfile
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(AKAR)
sys.path.insert(0, os.path.join(AKAR, "jalur"))
_argv = sys.argv; sys.argv = [sys.argv[0]]
import rangkai as RK  # noqa: E402
sys.argv = _argv
from jsonschema import Draft202012Validator, FormatChecker  # noqa: E402

VERSI = "pencocok-me3-v1"
SKEMA = json.load(open(os.path.join(AKAR, "kontrak", "jalur-jelajah-1.schema.json"), encoding="utf-8"))
_src = open(os.path.join(AKAR, "kontrak", "buat_kontrak.py"), encoding="utf-8").read()
_ns = {"re": re, "KATA_KUANTITAS": RK.KATA_KUANTITAS, "V": Draft202012Validator(SKEMA, format_checker=FormatChecker())}
exec(_src[_src.index("def periksa_tambahan(o):"):_src.index('os.makedirs("fixture"')], _ns)  # validasi() persis dari buat_kontrak.py
validasi = _ns["validasi"]

URUT_KEBUTUHAN = ["kemiskinan-kabkota", "penduduk-tanpa-jaminan-kesehatan", "stunting-balita"]  # aturan tetap, bukan peringkat
KARTU_TAYANG = [k for k in RK.KARTU if k["status"] != "draf"]
KONTAK_RUJUKAN = {"siswa": ["guru_bk", "orang_tua", "layanan_resmi"], "mahasiswa": ["hsa", "orang_dewasa_tepercaya", "layanan_resmi"],
                  "orang_tua": ["orang_dewasa_tepercaya", "layanan_resmi"], "guru_bk": ["orang_dewasa_tepercaya", "layanan_resmi"],
                  "guru": ["orang_dewasa_tepercaya", "layanan_resmi"], "umum": ["orang_dewasa_tepercaya", "layanan_resmi"]}

_MODUL = None
def _modul_distress():
    global _MODUL
    if _MODUL is None:
        d = tempfile.mkdtemp(); _MODUL = os.path.join(d, "distress.mjs")
        subprocess.run(["npx", "--yes", "esbuild@0.21.5", os.path.join(REPO, "src", "lib", "distress.ts"), "--format=esm", "--outfile=" + _MODUL],
                       check=True, capture_output=True)
    return _MODUL

def periksa_distress(teks):
    r = subprocess.run(["node", os.path.join(AKAR, "pencocok", "cek_distress.mjs"), _modul_distress()],
                       input=json.dumps(teks), capture_output=True, text=True, check=True)
    return json.loads(r.stdout)["hasil"]

def pilih_kartu(untuk, jenis, medan):
    """Aturan tetap: kartu kab/kota pengguna; bila tidak ada, kartu provinsi; bila tidak ada, kartu kab/kota di provinsi yang sama
    dengan jarak di atas pembanding terbesar (kode terkecil bila seri). Kartu draf tidak pernah dipakai."""
    k = [x for x in KARTU_TAYANG if x["jenis_kebutuhan"] == jenis and (not medan or x["medan"] in medan)]
    kk = untuk.get("kode_kabkota")
    a = [x for x in k if kk and x["wilayah"]["kode_bps"] == kk]
    if a: return a[0], "kabkota_pengguna"
    a = [x for x in k if x["wilayah"]["tingkat"] == "provinsi" and x["wilayah"]["kode_bps"][:2] == untuk["kode_provinsi"]]
    if a: return a[0], "provinsi_pengguna"
    a = [x for x in k if x["wilayah"]["kode_bps"][:2] == untuk["kode_provinsi"] and x["jarak"]["arah"] == "di_atas"]
    if a: return sorted(a, key=lambda x: (-x["jarak"]["nilai"], x["wilayah"]["kode_bps"]))[0], "kabkota_lain_di_provinsi"
    return None, None

def _cipta(mode, kartu_id):
    kon = [{"jenis": "guru_bk", "cara": "ceritakan gagasanmu"}] if mode == "c" else [{"jenis": "orang_terdekat", "cara": "minta pendapat tentang gagasanmu"}]
    return {"id": "j-cipta", "jenis": "cipta", "judul": "Rancang caramu sendiri", "kartu_id": kartu_id, "undangan": "Tulis dulu gagasanmu sendiri",
            "langkah_pertama": {"teks": "Tulis satu gagasan kecil yang bisa kamu coba sendiri, lalu catat apa yang terjadi", "paling_lama_hari": 30, "butuh_orang_lain": False},
            "orang_untuk_ditanya": kon, "keyakinan": "sedang", "batas": "gagasan ini belum diuji", "bukti_cara_kerja": [],
            "harapan": "Gagasan kecil yang kamu uji sendiri bisa menjadi awal yang berarti"}

def _lain(mode, tujuan):
    kon = [{"jenis": "orang_tua", "cara": "bicarakan pilihanmu"}] if mode == "c" else [{"jenis": "orang_terdekat", "cara": "bicarakan pilihanmu dengan orang yang kamu percaya"}]
    t = re.sub(r"\d", "", tujuan or "").strip() or "jalan hidup lain yang kamu pilih"
    return {"id": "j-lain", "jenis": "jalan_lain", "judul": "Jalan yang kamu pilih juga bermakna", "tujuan": t, "peran_contoh": [],
            "langkah_pertama": {"teks": "Tulis apa yang ingin kamu tekuni dan rawat pekan ini", "paling_lama_hari": 7, "butuh_orang_lain": False},
            "orang_untuk_ditanya": kon, "keyakinan": "tinggi", "batas": "mesin tidak menilai pilihan ini", "bukti_cara_kerja": [],
            "harapan": "Pilihanmu ini juga jalan bermanfaat bagi dirimu dan sesama"}

def _dasar(p, status):
    return {"kontrak": "jalur-jelajah/1", "id_permintaan": p["id"] + "-" + p["untuk"]["mode_ai"], "dibuat": p.get("dibuat", "2026-11-14T00:00:00+07:00"),
            "versi_mesin": "mesin@" + VERSI, "versi_data": "2026.1", "status": status, "untuk": p["untuk"], "jalur": [], "rujukan": None,
            "untuk_pemilik": {"alasan": []}, "pernyataan": {"jalan_lain_sah": True, "bukan_fatwa": True, "teks_tetap_id": "teks-tetap-1"},
            "pemberitahuan_tarik": [], "jejak": {"kartu_dipakai": [], "gerbang": {}, "model": {}}, "bingkai_nilai_id": None}

def cocokkan(p, distress):
    u = p["untuk"]; mode = u["mode_ai"]
    if distress["cocok"]:
        o = _dasar(p, "ditahan_rujukan")
        o["rujukan"] = {"jenis": "distress", "teks_tetap_id": "rujukan-" + distress["tingkat"] + ("-siswa" if mode == "c" else ""),
                        "kontak": KONTAK_RUJUKAN[u["peran"]]}
        return o
    medan = p.get("medan_pilihan") or []
    pilih = None
    for je in URUT_KEBUTUHAN:
        k, asal = pilih_kartu(u, je, medan)
        if k: pilih = (je, k, asal); break
    lain = _lain(mode, p.get("tujuan_teks"))
    if pilih is None:
        o = _dasar(p, "tanpa_kartu")
        o["jalur"] = [lain, _cipta(mode, "tanpa-kartu")] if u["tujuan_di_luar_bank"] else [_cipta(mode, "tanpa-kartu"), lain]
        return o
    je, k, asal = pilih
    rs = [r for r in RK.R if r["kebutuhan"] == je]
    tem = RK.pilih_templat(rs, mode)
    data = [RK.rangkai(r, tem[r["id"]], mode, kartu=k)[0] for r in rs][:3]
    o = _dasar(p, "ok")
    o["jalur"] = ([lain] + data + [_cipta(mode, k["id"])]) if u["tujuan_di_luar_bank"] else (data + [_cipta(mode, k["id"]), lain])
    o["jalur"] = o["jalur"][:5]
    tempat = {"kabkota_pengguna": "di kabupaten atau kotamu", "provinsi_pengguna": "di provinsimu", "kabkota_lain_di_provinsi": "di provinsimu"}[asal]
    o["untuk_pemilik"]["alasan"] = [{"jalur_id": d["id"], "dari_profil": ["wilayah"] + (["medan_pilihan"] if medan else []),
                                     "teks": "Jalur ini bertumpu pada kebutuhan yang tercatat " + tempat + "; peran dan langkahnya bersumber dokumen resmi"} for d in data]
    o["jejak"]["kartu_dipakai"] = [k["id"]]
    o["jejak"]["gerbang"] = {"asal_kartu": asal}
    return o

def cocokkan_banyak(persona):
    teks = [" ".join(x for x in (p.get("refleksi"), p.get("tujuan_teks")) if x) for p in persona]
    ds = periksa_distress(teks)
    return [cocokkan(p, d) for p, d in zip(persona, ds)]

def sidik(o): return hashlib.sha256(json.dumps(o, ensure_ascii=False, sort_keys=True).encode()).hexdigest()

if __name__ == "__main__":
    P = [json.loads(l) for l in open(sys.argv[1], encoding="utf-8")]
    for o in cocokkan_banyak(P): print(json.dumps(o, ensure_ascii=False, sort_keys=True))
