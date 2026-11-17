#!/usr/bin/env python3
"""Tetangga darat per kabupaten/kota (kode BPS), untuk bagian "Daerah lain" Halaman Isu (A19).

Pakai:
  python3 -I tetangga_wilayah.py <Kab_Kota.shp tanpa ekstensi> <geojson BIG pembanding> <keluaran.json>

Masukan geometri utama: repo GitHub Alf-Anas/batas-administrasi-indonesia, berkas Kab_Kota SHP
(7z tiga bagian, pembaruan 13 Jun 2023, 514 kab/kota, 38 provinsi, kode provinsi Papua pemekaran
masih kode lama). Pembanding: repo ardian28/GeoJson-Indonesia-38-Provinsi (README menyebut sumber
BIG geoservice.big.go.id, lisensi MIT).

Kode wilayah di kedua berkas adalah kode Kemendagri, berbeda urutan dengan kode BPS, jadi pencocokan
ke kode BPS dilakukan lewat nama dalam provinsi terhadap mesin/sumber/masukan_kartu/dikk2025_tabel21.csv.

Aturan tetangga: dua wilayah bertetangga bila batasnya bersinggungan dalam toleransi 0,001 derajat
(sekitar 110 m) sesudah penyederhanaan 0,0002 derajat. Panjang batas bersama dihitung kira-kira
(derajat x 111 km). Batas di bawah 1 km ditandai `singgung_pendek` supaya bisa disaring.
Wilayah kepulauan tanpa batas darat ditandai `tanpa_tetangga_darat`; tetangga lautnya tidak dihitung.
"""
import csv, json, os, re, sys, difflib

AKAR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DIKK = os.path.join(AKAR, "mesin", "sumber", "masukan_kartu", "dikk2025_tabel21.csv")
PROV = {"Daerah Istimewa Yogyakarta": "DI Yogyakarta", "Kepulauan Bangka Belitung": "Bangka Belitung"}
ALIAS = {"kepulauansiautagulandangbiaro": "kepulauansitaro"}
TOL, SIMP = 0.001, 0.0002


def n(s):
    s = s.lower()
    s = re.sub(r"\b(kabupaten|administrasi)\b", "", s)
    s = re.sub(r"[^a-z]", "", s)
    return ALIAS.get(s, s)


def muat_dikk():
    rows = [r for r in csv.DictReader(open(DIKK, encoding="utf-8")) if r["tingkat"] == "kabkota"]
    per_prov, info = {}, {}
    for r in rows:
        per_prov.setdefault(r["provinsi"], {})[n(r["nama"])] = r["kode_bps"]
        info[r["kode_bps"]] = {"nama": re.sub(r"\s+", " ", r["nama"]).strip(), "provinsi": r["provinsi"]}
    return per_prov, info


def cocokkan(nama, prov, per_prov, catatan):
    d = per_prov[PROV.get(prov, prov)]
    k = n(nama)
    if k in d:
        return d[k]
    m = difflib.get_close_matches(k, list(d), 1, 0.8)
    if m:
        catatan.append(f"nama dicocokkan longgar: {nama} ({prov}) -> {m[0]}")
        return d[m[0]]
    raise SystemExit(f"gagal cocok: {nama} ({prov})")


def tetangga_dari_shp(shp, per_prov, catatan):
    import shapefile
    from shapely.geometry import shape
    from shapely.validation import make_valid
    from shapely.strtree import STRtree
    r = shapefile.Reader(shp)
    kode, geoms = [], []
    for sr in r.iterShapeRecords():
        kode.append(cocokkan(sr.record["KAB_KOTA"], sr.record["PROVINSI"], per_prov, catatan))
        geoms.append(make_valid(shape(sr.shape.__geo_interface__)).simplify(SIMP, preserve_topology=True))
    T = STRtree(geoms)
    hasil = {k: {} for k in kode}
    for i, g in enumerate(geoms):
        gb = g.buffer(TOL)
        for j in T.query(gb):
            j = int(j)
            if j != i and gb.intersects(geoms[j]):
                L = g.boundary.intersection(geoms[j].buffer(TOL)).length * 111
                hasil[kode[i]][kode[j]] = round(L, 1)
    return hasil


def sisi_pembanding(gj, per_prov, catatan):
    from shapely.geometry import shape
    from shapely.validation import make_valid
    from shapely.strtree import STRtree
    fs = [f for f in json.load(open(gj, encoding="utf-8"))["features"] if f.get("geometry")]
    kode, geoms = [], []
    for f in fs:
        p = f["properties"]
        try:
            kode.append(cocokkan(p["WADMKK"], p["WADMPR"], per_prov, []))
        except SystemExit:
            kode.append(None)
        geoms.append(make_valid(shape(f["geometry"])))
    T = STRtree(geoms)
    E = set()
    for i, g in enumerate(geoms):
        gb = g.buffer(0.005)
        for j in T.query(gb):
            j = int(j)
            if j != i and kode[i] and kode[j] and kode[i] != kode[j] and gb.intersects(geoms[j]):
                E.add(frozenset((kode[i], kode[j])))
    return E, {k for k in kode if k}


def main():
    shp, gj, keluar = sys.argv[1:4]
    per_prov, info = muat_dikk()
    catatan = []
    adj = tetangga_dari_shp(shp, per_prov, catatan)
    E_big, ada_big = sisi_pembanding(gj, per_prov, catatan)
    wilayah = {}
    for k in sorted(adj):
        tt = []
        for j, L in sorted(adj[k].items(), key=lambda x: -x[1]):
            cek = (frozenset((k, j)) in E_big) if (k in ada_big and j in ada_big) else None
            tt.append({"kode_bps": j, "nama": info[j]["nama"], "provinsi": info[j]["provinsi"],
                       "lintas_provinsi": info[j]["provinsi"] != info[k]["provinsi"],
                       "batas_bersama_km_kira": L, "singgung_pendek": L < 1.0,
                       "ada_di_pembanding_big": cek})
        wilayah[k] = {"nama": info[k]["nama"], "provinsi": info[k]["provinsi"],
                      "tanpa_tetangga_darat": not tt, "tetangga": tt}
    sisi = {frozenset((a, b)) for a in adj for b in adj[a]}
    tak_simetris = [(a, b) for a in adj for b in adj[a] if a not in adj[b]]
    banding = [s for s in sisi if all(x in ada_big for x in s)]
    hanya_utama = sorted(tuple(sorted(s)) for s in banding if s not in E_big)
    hanya_big = sorted(tuple(sorted(s)) for s in E_big if s not in sisi)
    ringkas = {
        "wilayah": len(wilayah), "kode_dikk": len(info),
        "belum_terpetakan": sorted(set(info) - set(wilayah)),
        "sisi": len(sisi), "tanpa_tetangga_darat": sum(v["tanpa_tetangga_darat"] for v in wilayah.values()),
        "singgung_pendek": sum(1 for s in sisi if adj[min(s)][max(s)] < 1.0),
        "tak_simetris": len(tak_simetris),
        "pembanding_big": {"wilayah_bergeometri": len(ada_big), "sisi": len(E_big),
                           "sisi_utama_yang_dapat_dibanding": len(banding),
                           "cocok": len(banding) - len(hanya_utama),
                           "hanya_di_utama": [list(x) for x in hanya_utama],
                           "hanya_di_big": [list(x) for x in hanya_big]},
    }
    out = {"skema": "tetangga-wilayah/1",
           "dibuat": "17 Nov 2026, sesi mesin Sulu (titipan lima serahan, paket 2)",
           "label": "SINTESIS hitungan geometri; bukan data resmi BPS",
           "sumber_batas": {
               "utama": {"nama": "Alf-Anas/batas-administrasi-indonesia, Kab_Kota SHP",
                         "url": "https://github.com/Alf-Anas/batas-administrasi-indonesia",
                         "pembaruan": "13 Jun 2023", "lisensi": "tidak dinyatakan di README; asal data tidak disebut",
                         "kode": "kode Kemendagri; Papua pemekaran memakai kode lama"},
               "pembanding": {"nama": "ardian28/GeoJson-Indonesia-38-Provinsi, Kabupaten",
                              "url": "https://github.com/ardian28/GeoJson-Indonesia-38-Provinsi",
                              "asal": "BIG, geoservice.big.go.id (menurut README)", "lisensi": "MIT"}},
           "aturan": {"toleransi_derajat": TOL, "penyederhanaan_derajat": SIMP,
                      "tetangga_laut": "tidak dihitung", "pencocokan_kode": "nama dalam provinsi ke DIKK 2025 tabel 2.1"},
           "ringkas": ringkas, "catatan_pencocokan": catatan, "wilayah": wilayah}
    json.dump(out, open(keluar, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(json.dumps(ringkas, ensure_ascii=False)[:1500])


if __name__ == "__main__":
    main()
