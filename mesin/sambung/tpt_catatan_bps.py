"""Paket titipan 1, 4, 5 (Chief Sulu → sesi mesin, 16 Nov 2026 23.10).

1. Kab/kota yang angka TPT-nya ditandai BPS kurang teliti (catatan RSE), dibaca dari medan
   `def` dan `note` tabel TPT kab/kota tiap domain provinsi di BPS WebAPI (berkas mentah laptop).
4. Tautan baca TPT per provinsi: halaman tabel BPS provinsi yang sama, dibangun dari nomor tabel
   (pola https://<sub>.bps.go.id/id/statistics-table/2/<base64("<var>#2")>/...), cadangan tabel nasional.
5. Teks hati-hati per jenis kebutuhan + tanda per kartu (dipakai ekspor_kartu_tayang.py).

Pakai: python3 tpt_catatan_bps.py <folder JSON mentah bps> <keluaran.json>
Hanya membaca; tidak memanggil jaringan. Kunci akses tidak pernah ada di berkas mentah (dihapus bps.py)."""
import base64, csv, glob, html, json, os, re, sys, unicodedata

SINI = os.path.dirname(os.path.abspath(__file__))
DIKK = os.path.join(SINI, "..", "sumber", "masukan_kartu", "dikk2025_tabel21.csv")

SUB = {"1100": "aceh", "1200": "sumut", "1300": "sumbar", "1400": "riau", "1500": "jambi", "1600": "sumsel",
       "1700": "bengkulu", "1800": "lampung", "1900": "babel", "2100": "kepri", "3100": "jakarta", "3200": "jabar",
       "3300": "jateng", "3400": "jogja", "3500": "jatim", "3600": "banten", "5100": "bali", "5200": "ntb",
       "5300": "ntt", "6100": "kalbar", "6200": "kalteng", "6300": "kalsel", "6400": "kaltim", "6500": "kaltara",
       "7100": "sulut", "7200": "sulteng", "7300": "sulsel", "7400": "sultra", "7500": "gorontalo", "7600": "sulbar",
       "8100": "maluku", "8200": "malut", "9100": "papuabarat", "9400": "papua"}
# Tautan yang sudah dicocokkan dengan hasil pencarian web (judul dan nomor tabel sama), 16 Nov 2026.
TERCEK = {("5300", 522), ("3500", 54), ("6500", 115), ("3300", 64), ("3600", 157), ("9100", 270), ("5200", 415)}
NASIONAL = {"judul": "Tingkat Pengangguran Terbuka menurut Jenis Kelamin dan Kabupaten/Kota",
            "tautan": "https://www.bps.go.id/id/statistics-table/2/MjgyNCMy/tingkat-pengangguran-terbuka-menurut-jenis-kelamin-dan-kabupaten-kota.html",
            "dicek": "16 Nov 2026, judul halaman cocok (pengambil halaman Parallel)"}
POLA_RSE = re.compile(r"RSE|relative standard error|kurang teliti|hati-hati dalam menginterpretasi", re.I)

def teks(v):
    t = re.sub(r"<[^>]+>", " ", (v.get("def") or "") + " " + (v.get("note") or ""))
    return re.sub(r"\s+", " ", html.unescape(t)).strip()

def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")[:80]

def tautan(dom, var, judul):
    b = base64.b64encode(f"{var}#2".encode()).decode()
    return f"https://{SUB[dom]}.bps.go.id/id/statistics-table/2/{b}/{slug(judul)}.html"

def nama_kunci(s):
    s = re.sub(r"^(kabupaten|kab\.?|kota)\s+", "", s.strip().lower())
    return re.sub(r"\s+", " ", s)

def peta_kode():
    p = {}
    for r in csv.DictReader(open(DIKK, encoding="utf-8")):
        if r["tingkat"] != "kabkota": continue
        p.setdefault(r["kode_bps"][:2], {})[nama_kunci(r["nama"])] = r["kode_bps"]
    return p

def daftar_dari_catatan(t):
    """'kabupaten A, B, ... dan C memiliki Keterangan RSE' -> [A, B, ..., C]"""
    m = re.search(r"kabupaten\s+(.+?)\s+memiliki\s+keterangan\s+rse", t, re.I)
    if not m: return []
    return [x.strip() for x in re.split(r",|\sdan\s", m.group(1)) if x.strip()]

def utama(folder, keluar):
    kode = peta_kode()
    per_dom = {}
    for p in sorted(glob.glob(os.path.join(folder, "*_tpt_*.json"))):
        dom, _, var, th = os.path.basename(p)[:-5].split("_")
        if dom == "0000": continue
        if dom not in per_dom or th > per_dom[dom][2]:
            per_dom[dom] = (p, int(var), th)
    prov, ditandai, belum = [], [], []
    for dom in sorted(SUB):
        if dom not in per_dom:
            belum.append(dom)
            prov.append({"domain": dom, "tabel_provinsi": None, "tautan_baca": NASIONAL["tautan"],
                         "tautan_jenis": "tabel nasional (cadangan)", "catatan_bps": None,
                         "catatan_rse": "BELUM DIPERIKSA: tabel TPT kab/kota provinsi tidak ditemukan di WebAPI pada panen 12-13 Nov"})
            continue
        p, var, th = per_dom[dom]
        d = json.load(open(p, encoding="utf-8"))
        v = d["var"][0]; t = teks(v)
        rse = bool(POLA_RSE.search(t))
        nama = daftar_dari_catatan(t) if rse else []
        cocok = []
        for n in nama:
            k = kode.get(dom[:2], {}).get(nama_kunci(n))
            cocok.append({"nama": n, "kode_bps": k})
            ditandai.append({"kode_bps": k, "nama": n, "provinsi_domain": dom, "tahun": 2025,
                             "keterangan_bps": "RSE 25-50%, hati-hati dalam menginterpretasi",
                             "tautan_tabel": tautan(dom, var, v["label"])})
        prov.append({"domain": dom, "tabel_provinsi": {"var": var, "judul": v["label"], "tahun_tabel_terbaru": th,
                                                         "diperbarui_bps": d.get("last_update")},
                     "tautan_baca": tautan(dom, var, v["label"]),
                     "tautan_jenis": "tabel provinsi, dicocokkan web" if (dom, var) in TERCEK else "tabel provinsi, dibangun dari nomor tabel (belum dibuka)",
                     "catatan_bps": t[:600] or None,
                     "catatan_rse": ("ADA: " + ", ".join(nama)) if rse else "TIDAK ADA catatan RSE di definisi/catatan tabel",
                     "kab_ditandai": cocok})
    hasil = {
        "skema": "tpt-catatan-bps/1",
        "dibuat": "16 Nov 2026, sesi mesin Sulu",
        "cara": "medan def dan note tabel TPT kab/kota provinsi (BPS WebAPI, berkas mentah laptop MESIN\\mentah\\bps, panen 12-13 Nov 2026) dipindai pola RSE; nama kab dicocokkan ke kode BPS lewat DIKK 2025 Tabel 2.1",
        "cakupan": {"provinsi_lama_34": len(SUB), "punya_tabel_provinsi": len(per_dom), "belum_diperiksa": belum,
                    "empat_provinsi_papua_baru": "tidak punya domain di daftar WebAPI; angka kartu dari tabel nasional (tanpa catatan RSE)"},
        "tabel_nasional": NASIONAL,
        "kab_ditandai_rse": ditandai,
        "sumber_sekunder_belum_ke_primer": [
            {"provinsi": "Bali", "isi": "IDN Times 12 Nov 2026 mengutip BRS BPS Bali No. 71/11/51/Th.XX (5 Nov 2026): sebagian besar angka TPT kab/kota Agustus 2025 dan 2026 bertanda (*) RSE di atas 25 persen, kecuali Karangasem dan Gianyar pada 2026",
             "tautan": "https://bali.idntimes.com/news/bali/pengangguran-di-karangasem-tertinggi-se-bali-00-pfsg1-zqb2r5",
             "status": "BELUM DIVERIFIKASI ke BRS BPS Bali; tidak dipakai menandai kartu"}],
        "per_provinsi": prov,
    }
    json.dump(hasil, open(keluar, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"provinsi dengan tabel: {len(per_dom)}/34 · kab ditandai RSE: {len(ditandai)} · tanpa kode: {sum(1 for x in ditandai if not x['kode_bps'])} · belum diperiksa: {belum}")

if __name__ == "__main__":
    utama(sys.argv[1], sys.argv[2])
