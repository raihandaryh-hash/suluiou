"""Paket titipan 2 (Chief Sulu → sesi mesin, 16 Nov 2026 23.10): garis kemiskinan per kab/kota dan provinsi
dari rilis BPS asli, angka provinsi dan nasional, dan deret tahun kemiskinan dan TPT.

Masukan (semua turunan mekanis dari BPS, tanpa model):
  sumber/masukan_kartu/dikk2025_tabel21.csv  DIKK 2025 Tabel 2.1 (Susenas Maret 2025): p0 dan gk per kab/kota dan provinsi
  <folder L3>/L3_gk.csv, L3_p0.csv, L3_tpt.csv  urai parser/bps_webapi.py atas tabel WebAPI provinsi + nasional
     (laptop MESIN\\mentah\\bps dan MESIN\\mentah\\bps_gk, panen 12-13 Nov dan 16 Nov 2026)
Keluaran (keluaran/):
  garis_kemiskinan_kabkota.csv   kode, nama, gk 2025 DIKK, gk 2025 WebAPI, gk 2026 WebAPI, selisih 2025
  deret_kemiskinan_tpt.csv       kode, tingkat, indikator, tahun, nilai, sumber (satu baris per nilai terpilih)
  ringkas_nasional.json          angka nasional dengan URL rilis primer
Aturan pilih: P0 dan GK 2025 dari DIKK (publikasi); tahun lain dari tabel provinsi WebAPI; TPT dari tabel nasional
var 2824 bila ada, lalu tabel provinsi. Nilai ganda yang berbeda dari tabel berbeda dicatat di kolom `nilai_lain`.
Pakai: python3 deret_kemiskinan_tpt.py <folder L3>"""
import csv, collections, json, os, sys

SINI = os.path.dirname(os.path.abspath(__file__))
DIKK = os.path.join(SINI, "..", "sumber", "masukan_kartu", "dikk2025_tabel21.csv")
KEL = os.path.join(SINI, "keluaran")
PAPUA = os.path.join(SINI, "..", "sumber", "wilayah", "kode_baru_papua.csv")

NASIONAL = {
    "kemiskinan": [
        {"periode": "Maret 2026", "p0_persen": 8.07, "garis_rp_kapita_bulan": 669235,
         "url": "https://www.bps.go.id/id/pressrelease/2026/08/05/2594/persentase-penduduk-miskin-maret-2026-turun-menjadi-8-07-persen-.html",
         "dicek": "Chief Sulu 16 Nov 2026 (rilis BPS)"},
        {"periode": "Maret 2025", "p0_persen": 8.47, "garis_rp_kapita_bulan": None,
         "url": "https://www.worldbank.org/en/news/statement/2026/09/09/joint-statement-bps-wb-on-indonesia-poverty-figures",
         "catatan": "8,47 persen disebut di pernyataan bersama BPS-Bank Dunia; garis nasional Maret 2025 belum dicek ke rilis BPS (BELUM DIVERIFIKASI)"}],
    "tpt": [
        {"periode": "Agustus 2025", "tpt_persen": 4.85, "url": "https://www.bps.go.id/id/pressrelease/2025/11/05/2479/keadaan-ketenagakerjaan-.html", "dicek": "cuplikan halaman rilis BPS 16 Nov 2026"},
        {"periode": "Agustus 2024", "tpt_persen": 4.91, "url": "https://www.bps.go.id/id/pressrelease/2025/11/05/2479/keadaan-ketenagakerjaan-.html", "dicek": "cuplikan halaman rilis BPS (pembanding tahun lalu)"},
        {"periode": "Agustus 2026", "tpt_persen": 4.75, "url": "https://mediaindonesia.com/ekonomi/952620/bps-tingkat-pengangguran-terbuka-agustus-2026-turun-jadi-475-persen",
         "catatan": "rilis BPS 5 Nov 2026 belum dibuka; angka dari media (BELUM DIVERIFIKASI ke primer). Tabel kab/kota nasional var 2824 tahun 2026 belum tersedia di WebAPI per 16 Nov 2026 (dicoba, datacontent kosong)"}],
}

def f(x):
    try: return float(str(x).replace(",", "."))
    except ValueError: return None

def utama(l3):
    baru = {r["kode_bps_lama"]: r["kode_bps_baru"] for r in csv.DictReader(open(PAPUA, encoding="utf-8"))}
    dikk = {r["kode_bps"]: r for r in csv.DictReader(open(DIKK, encoding="utf-8"))}
    nama = {k: " ".join(r["nama"].split()) for k, r in dikk.items()}
    nama.update({baru[k]: v for k, v in list(nama.items()) if k in baru})  # kode baru Papua ikut bernama
    dikk = {baru.get(k, k): r for k, r in dikk.items()}
    nilai = collections.defaultdict(list)  # (kode, ind, tahun) -> [(nilai, sumber)]
    for k, r in dikk.items():
        nilai[(k, "p0", "2025")].append((f(r["p0"]), "DIKK 2025 Tabel 2.1"))
        nilai[(k, "gk", "2025")].append((f(r["gk"]), "DIKK 2025 Tabel 2.1"))
    aturan = {
        "gk": ("L3_gk.csv", lambda r: r["turvar"] in ("Tidak ada", "Garis Kemiskinan (rupiah/kapita/bulan)") and "garis kemiskinan" in (r["judul"] + r["turvar"]).lower()),
        "p0": ("L3_p0.csv", lambda r: r["turvar"] in ("Tidak ada", "Persentase Penduduk Miskin - Maret") and "persentase penduduk miskin" in (r["judul"] + r["turvar"]).lower() and "September" not in r["periode"]),
        "tpt": ("L3_tpt.csv", lambda r: r["turvar"].strip() in ("Jumlah", "Tidak ada", "TPT") and r["periode"] in ("Tahun", "Tahunan", "Agustus")),
    }
    for ind, (berkas, ok) in aturan.items():
        for r in csv.DictReader(open(os.path.join(l3, berkas), encoding="utf-8")):
            if not ok(r): continue
            v = f(r["nilai"])
            if v is None: continue
            if ind == "gk" and r["satuan"].lower().startswith("ribu"): v *= 1000
            if ind == "gk" and v < 10000: continue  # sel bukan rupiah (mis. persen dalam tabel gabungan)
            sumber = ("tabel nasional var " if r["berkas"].startswith("0000") else "tabel provinsi var ") + r["var_id"] + " (" + r["berkas"] + ")"
            nilai[(baru.get(r["kode_bps"], r["kode_bps"]), ind, r["tahun"])].append((v, sumber))
    baris = []
    for (k, ind, th), vs in sorted(nilai.items()):
        vs = [x for x in vs if x[0] is not None]
        if not vs: continue
        urut = sorted(vs, key=lambda x: (0 if x[1].startswith("DIKK") else 1 if "nasional" in x[1] else 2))
        pilih = urut[0]
        lain = sorted({round(x[0], 2) for x in urut[1:] if abs(x[0] - pilih[0]) > (1 if ind == "gk" else 0.011)})
        baris.append({"kode_bps": k, "nama": nama.get(k, ""), "tingkat": "provinsi" if k.endswith(("00", "99")) else "kabkota", "indikator": ind,
                      "tahun": th, "nilai": pilih[0], "sumber": pilih[1], "jumlah_sumber": len(vs), "nilai_lain": ";".join(map(str, lain))})
    os.makedirs(KEL, exist_ok=True)
    with open(os.path.join(KEL, "deret_kemiskinan_tpt.csv"), "w", newline="", encoding="utf-8") as o:
        w = csv.DictWriter(o, fieldnames=list(baris[0])); w.writeheader(); w.writerows(baris)
    gk = collections.defaultdict(dict)
    for b in baris:
        if b["indikator"] == "gk": gk[b["kode_bps"]][b["tahun"]] = b
    gk_rows = []
    for k in sorted(dikk):
        r = dikk[k]; a = gk[k].get("2025"); c = gk[k].get("2026")
        web25 = [x for x in nilai[(k, "gk", "2025")] if not x[1].startswith("DIKK")]
        gk_rows.append({"kode_bps": k, "nama": nama[k], "tingkat": r["tingkat"], "provinsi": r["provinsi"],
                        "gk_2025_dikk": f(r["gk"]), "gk_2025_webapi": web25[0][0] if web25 else "",
                        "selisih_2025": round(web25[0][0] - f(r["gk"]), 1) if web25 else "",
                        "gk_2026_webapi": c["nilai"] if c else "", "sumber_2026": c["sumber"] if c else ""})
    with open(os.path.join(KEL, "garis_kemiskinan_kabkota.csv"), "w", newline="", encoding="utf-8") as o:
        w = csv.DictWriter(o, fieldnames=list(gk_rows[0])); w.writeheader(); w.writerows(gk_rows)
    json.dump({"skema": "ringkas-nasional/1", "nasional": NASIONAL,
               "provinsi_2025": {k: {"nama": nama[k], "p0": f(dikk[k]["p0"]), "gk": f(dikk[k]["gk"])} for k in dikk if dikk[k]["tingkat"] == "provinsi"},
               "sumber_provinsi_2025": "DIKK 2025 Tabel 2.1, https://www.bps.go.id/id/publication/2025/11/28/f7534097ff9c717e794cd6e1/data-dan-informasi-kemiskinan-kabupaten--kota-tahun-2025.html"},
              open(os.path.join(KEL, "ringkas_nasional.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    kab = [g for g in gk_rows if g["tingkat"] == "kabkota"]
    banding = [g for g in kab if g["gk_2025_webapi"] != ""]
    beda = [g for g in banding if abs(g["selisih_2025"]) > 1]
    c = collections.Counter((b["indikator"], b["tahun"]) for b in baris if b["tingkat"] == "kabkota")
    print("kab/kota:", len(kab), "| gk 2025 DIKK:", sum(1 for g in kab if g["gk_2025_dikk"]), "| dibanding WebAPI:", len(banding), "beda >Rp1:", len(beda),
          "| gk 2026:", sum(1 for g in kab if g["gk_2026_webapi"] != ""))
    print("isi deret kab/kota per (indikator, tahun):", sorted(c.items()))
    for g in beda[:10]: print("  beda", g["kode_bps"], g["nama"], g["gk_2025_dikk"], g["gk_2025_webapi"])
    return beda

if __name__ == "__main__":
    utama(sys.argv[1])
