#!/usr/bin/env python3
"""Tetangga darat per kabupaten/kota (kode BPS), untuk bagian "Daerah lain" Halaman Isu (A19).

Pakai:
  python3 -I tetangga_wilayah.py <geojson BIG utama> <Kab_Kota.shp pembanding tanpa ekstensi> <keluaran.json>
  python3 -I tetangga_wilayah.py <geojson BIG utama> <Kab_Kota.shp pembanding> <keluaran.json> <idn_admin2.shp pelengkap tanpa ekstensi>
Versi 2 (18 Nov 2026): sumber utama dan pembanding ditukar atas permintaan Chief; docstring di bawah ini riwayat v1.
Versi 3 (19 Nov 2026, sesi Grok Meja IOU, brief/02 tugas 1): argumen keempat opsional = pelengkap berlisensi tertulis,
HDX COD-AB Indonesia (cod-ab-idn, sumber BPS, disusun OCHA, lisensi CC BY-IGO 3.0), berkas idn_admin2. Bila diberikan,
wilayah yang tidak bergeometri di utama mengambil geometri dan tetangganya dari pelengkap (asal = "pelengkap"), dicocokkan
lewat adm2_pcode = "ID" + kode BPS dengan nama diperiksa ke DIKK; pembanding Alf-Anas tetap dipakai sebagai pembanding.
Tanpa argumen keempat, perilakunya sama dengan v2. Rincian sumber: grok/SUMBER_Batas.md.

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
TOL_BIG = 0.005  # geometri BIG di repo utama sudah disederhanakan (1,1 MB), jadi toleransinya lebih besar


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


def _muat_shp(shp, per_prov, catatan):
    import shapefile
    from shapely.geometry import shape
    from shapely.validation import make_valid
    r = shapefile.Reader(shp)
    out = {}
    for sr in r.iterShapeRecords():
        k = cocokkan(sr.record["KAB_KOTA"], sr.record["PROVINSI"], per_prov, catatan)
        out[k] = make_valid(shape(sr.shape.__geo_interface__)).simplify(SIMP, preserve_topology=True)
    return out


def _muat_geojson(gj, per_prov, catatan):
    from shapely.geometry import shape
    from shapely.validation import make_valid
    from shapely.ops import unary_union
    fs = json.load(open(gj, encoding="utf-8"))["features"]
    out, kosong, sengketa = {}, [], []
    for f in fs:
        p = f["properties"]
        if not p.get("WADMKK"):
            continue  # satu fitur tanpa nama kab/kota (Jawa Timur), tanpa geometri
        if "/" in (p.get("WADMKK") or ""):  # area sengketa dua daerah di data BIG: tidak dipakai untuk tetangga
            sengketa.append(p["WADMKK"] + " (" + p["WADMPR"] + ")"); continue
        k = cocokkan(p["WADMKK"], p["WADMPR"], per_prov, catatan)
        if not f.get("geometry"):
            kosong.append(k); continue
        g = make_valid(shape(f["geometry"]))
        out[k] = unary_union([out[k], g]) if k in out else g
    return out, kosong, sengketa


def _muat_pelengkap(shp, info, catatan):
    """COD-AB idn_admin2: adm2_pcode 'ID' + kode BPS. Hanya kode yang ada di DIKK; nama diperiksa."""
    import shapefile
    from shapely.geometry import shape
    from shapely.validation import make_valid
    r = shapefile.Reader(shp)
    out = {}
    for sr in r.iterShapeRecords():
        pc = sr.record["adm2_pcode"]
        k = pc[2:] if pc.startswith("ID") else pc
        if k not in info:
            catatan.append(f"pelengkap tanpa padanan DIKK: {pc} {sr.record['adm2_name']}"); continue
        if n(re.sub(r"^Kota\s+", "", sr.record["adm2_name"])) != n(re.sub(r"^Kota\s+", "", info[k]["nama"])):
            catatan.append(f"pelengkap nama beda: {pc} {sr.record['adm2_name']} -> {info[k]['nama']}")
        out[k] = make_valid(shape(sr.shape.__geo_interface__)).simplify(SIMP, preserve_topology=True)
    return out


def tetangga_untuk(geoms, kunci, tol):
    """Tetangga hanya untuk kode di `kunci` (pelengkap: cukup tujuh wilayah, tidak seluruh negeri)."""
    from shapely.strtree import STRtree
    kode = list(geoms); gs = [geoms[k] for k in kode]
    T = STRtree(gs)
    hasil = {}
    for a in kunci:
        if a not in geoms:
            continue
        g = geoms[a]; gb = g.buffer(tol); hasil[a] = {}
        for j in T.query(gb):
            b = kode[int(j)]
            if b != a and gb.intersects(gs[int(j)]):
                L1 = g.boundary.intersection(gs[int(j)].buffer(tol)).length * 111
                L2 = gs[int(j)].boundary.intersection(gb).length * 111
                hasil[a][b] = round(max(L1, L2), 1)
    return hasil


def tetangga(geoms, tol):
    from shapely.strtree import STRtree
    kode = list(geoms); gs = [geoms[k] for k in kode]
    T = STRtree(gs)
    hasil = {k: {} for k in kode}
    for i, g in enumerate(gs):
        gb = g.buffer(tol)
        for j in T.query(gb):
            j = int(j)
            if j != i and gb.intersects(gs[j]):
                hasil[kode[i]][kode[j]] = round(g.boundary.intersection(gs[j].buffer(tol)).length * 111, 1)
    for a in hasil:  # simetris: ambil panjang terbesar dari dua arah
        for b in list(hasil[a]):
            L = max(hasil[a][b], hasil[b].get(a, 0)); hasil[a][b] = hasil[b][a] = L
    return hasil


def main():
    gj, shp, keluar = sys.argv[1:4]
    pel = sys.argv[4] if len(sys.argv) > 4 else None
    per_prov, info = muat_dikk()
    catatan = []
    g_big, kosong_big, sengketa_big = _muat_geojson(gj, per_prov, catatan)
    g_alf = _muat_shp(shp, per_prov, catatan)
    adj_big = tetangga(g_big, TOL_BIG)
    adj_alf = tetangga(g_alf, TOL)
    hilang = sorted(set(info) - set(adj_big))
    # wilayah yang tidak bergeometri di BIG: tetangganya dari pelengkap berlisensi (v3) atau, tanpa pelengkap, dari pembanding (v2)
    adj_pel = tetangga_untuk(_muat_pelengkap(pel, info, catatan), hilang, TOL) if pel else {}
    asal_ganti = "pelengkap" if pel else "pembanding"
    adj = {k: dict(v) for k, v in adj_big.items()}
    for k in hilang:
        adj[k] = {}
        for j, L in (adj_pel if pel else adj_alf).get(k, {}).items():
            adj[k][j] = L; adj.setdefault(j, {})[k] = L
    asal = {}
    for a in adj:
        for b in adj[a]:
            pasangan = frozenset((a, b))
            asal[pasangan] = asal_ganti if (a in hilang or b in hilang) else "utama"
    sisi = set(asal)
    sisi_alf = {frozenset((a, b)) for a in adj_alf for b in adj_alf[a]}
    banding = [x for x in sisi if asal[x] == "utama"]
    hanya_utama = sorted(tuple(sorted(x)) for x in banding if x not in sisi_alf)
    hanya_alf = sorted(tuple(sorted(x)) for x in sisi_alf if x not in sisi and not (set(x) & set(hilang)))
    wilayah = {}
    for k in sorted(info):
        tt = []
        for j, L in sorted(adj.get(k, {}).items(), key=lambda x: -x[1]):
            p = frozenset((k, j))
            tt.append({"kode_bps": j, "nama": info[j]["nama"], "provinsi": info[j]["provinsi"],
                       "lintas_provinsi": info[j]["provinsi"] != info[k]["provinsi"],
                       "batas_bersama_km_kira": L, "singgung_pendek": L < 1.0,
                       "asal": asal[p], "ada_di_pembanding": p in sisi_alf})
        wilayah[k] = {"nama": info[k]["nama"], "provinsi": info[k]["provinsi"],
                      "geometri_dari": asal_ganti if k in hilang else "utama",
                      "tanpa_tetangga_darat": not tt, "tetangga": tt}
    nm = lambda x: [f"{c} {info[c]['nama']}" for c in x]
    ringkas = {
        "wilayah": len(wilayah), "kode_dikk": len(info),
        "sisi": len(sisi), "sisi_dari_pembanding": sum(1 for x in sisi if asal[x] == "pembanding"),
        "sisi_dari_pelengkap": sum(1 for x in sisi if asal[x] == "pelengkap"),
        "pelengkap_dibanding_pembanding": {k: {"pelengkap": sorted(adj_pel.get(k, {})), "pembanding": sorted(adj_alf.get(k, {})),
                                               "sama": sorted(adj_pel.get(k, {})) == sorted(adj_alf.get(k, {}))} for k in hilang} if pel else None,
        "tanpa_tetangga_darat": sum(v["tanpa_tetangga_darat"] for v in wilayah.values()),
        "singgung_pendek": sum(1 for x in sisi if adj[min(x)][max(x)] < 1.0),
        "utama_tanpa_geometri": nm(hilang), "catatan_fitur_kosong": "fitur_utama_kosong = fitur BIG tanpa geometri; wilayah yang masih punya fitur lain bergeometri (mis. 7503 Pohuwato, ejaan BIG 'Pahuwato') tetap memakai geometri utama", "area_sengketa_utama_diabaikan": sengketa_big, "fitur_utama_kosong": nm(sorted(set(kosong_big))),
        "selisih_dengan_pembanding": {"sisi_utama_dibanding": len(banding), "cocok": len(banding) - len(hanya_utama),
                                       "hanya_di_utama": [nm(x) for x in hanya_utama],
                                       "hanya_di_pembanding": [nm(x) for x in hanya_alf]},
    }
    out = {"skema": "tetangga-wilayah/3" if pel else "tetangga-wilayah/2",
           "dibuat": "18 Nov 2026, sesi mesin Sulu (BALASAN Chief 17 Nov 20.54 butir 4; titipan 17 Nov 21.00 butir 4)"
                     + ("; v3 19 Nov 2026, sesi Grok Meja IOU (brief/02 tugas 1): tujuh wilayah dari pelengkap COD-AB" if pel else ""),
           "label": "SINTESIS hitungan geometri; batas indikatif, bukan penegasan batas daerah; bukan data resmi BPS",
           "sumber_batas": {
               "utama": {"nama": "ardian28/GeoJson-Indonesia-38-Provinsi, Kabupaten/38 Provinsi Indonesia - Kabupaten.json",
                         "url": "https://github.com/ardian28/GeoJson-Indonesia-38-Provinsi",
                         "asal_data": "BIG (README repo menyebut geoservice.big.go.id; medan METADATA fitur: TASWIL1000020221227_DATA_BATAS_DESAKELURAHAN)",
                         "lisensi_kode_repo": "MIT (hanya kode repo, bukan data)",
                         "ketentuan_data": "UU 4/2011 tentang Informasi Geospasial, teks asli: Pasal 42 IGD bersifat terbuka (penjelasan: dapat diakses dan diperoleh setiap orang); Pasal 50 produk turunan untuk diperjualbelikan wajib izin pemilik IG. Batas wilayah termasuk peta dasar. Perubahan oleh UU Cipta Kerja belum dibaca."},
               "pembanding": {"nama": "Alf-Anas/batas-administrasi-indonesia, Kab_Kota SHP",
                              "url": "https://github.com/Alf-Anas/batas-administrasi-indonesia",
                              "pembaruan": "13 Jun 2023", "lisensi": "tidak dinyatakan; asal data tidak disebut"},
               "layanan_resmi_dicoba": {"url": "https://geoservices.big.go.id/rbi/rest/services/Hosted/Wilayah_Administrasi_Kabupaten__Kota/FeatureServer",
                                        "keterangan": "edisi September 2023 menurut deskripsi layanan; 18 Nov 2026 kueri dari sesi dan dari laptop menjawab galat 500, jadi belum bisa dipakai; 19 Nov 2026 17.42 WIB kueri dari sesi Grok masih galat 500"}},
           **({"sumber_batas_pelengkap": {
               "nama": "HDX COD-AB Indonesia, Indonesia - Subnational Administrative Boundaries (cod-ab-idn), berkas idn_admin2 (shp)",
               "url": "https://data.humdata.org/dataset/cod-ab-idn",
               "unduh": "https://data.humdata.org/dataset/84a1d98a-790b-4d66-9d14-bbfa48500802/resource/50b9aafa-47c5-483e-a361-826320bf75d5/download/idn_admin_boundaries.shp.zip",
               "asal_data": "Badan Pusat Statistik (BPS - Statistics Indonesia); disusun OCHA ROAP, diterbitkan OCHA FISS/HDX",
               "lisensi": "Creative Commons Attribution for Intergovernmental Organisations (CC BY-IGO), http://creativecommons.org/licenses/by/3.0/igo/legalcode",
               "tahun_data": "valid_on 2020-04-01 (batas dibuat sumber 8 Apr 2020); ditinjau 30 Okt 2025; berkas diperbarui HDX 23 Jun 2026",
               "kewajiban": "atribusi ke BPS dan OCHA, sertakan URI lisensi, tandai bahwa geometri disederhanakan (CC BY-IGO 3.0 pasal 3 dan 4)",
               "dipakai_untuk": "geometri dan tetangga tujuh wilayah yang tidak bergeometri di utama"}} if pel else {}),
           "aturan": {"toleransi_derajat_utama": TOL_BIG, "toleransi_derajat_pembanding": TOL, "penyederhanaan_pembanding": SIMP,
                      "tetangga_laut": "tidak dihitung", "pencocokan_kode": "nama dalam provinsi ke DIKK 2025 tabel 2.1",
                      "wilayah_tanpa_geometri_utama": ("tetangga diambil dari pelengkap COD-AB (toleransi 0,001, penyederhanaan 0,0002) dan ditandai asal = pelengkap; pembanding Alf-Anas hanya untuk dicocokkan"
                                                       if pel else "tetangga diambil dari pembanding dan ditandai asal = pembanding")},
           "syarat_tayang": ["Halaman menulis: batas wilayah dari data BIG, bersifat petunjuk; tetangga laut tidak dihitung.",
                             "Pasangan ber-asal pembanding tayang dengan tanda sendiri: 'Batas dari data pembanding yang asal datanya tidak dinyatakan.' PUTUSAN ATAS DELEGASI sesi mesin 18 Nov 2026 (dapat dibalik Chief atau Raihan): enam dari tujuh wilayah itu kota yang dikelilingi satu atau dua kabupaten (Kepulauan Seribu tanpa tetangga darat), jadi tetangganya tidak diperdebatkan; menahannya membuat tujuh Halaman Isu kosong di bagian Daerah lain."]
                            + (["v3: pasangan ber-asal pelengkap wajib membawa atribusi BPS dan OCHA (HDX COD-AB) serta URI lisensi CC BY-IGO; kalimat tandanya BELUM DISUSUN, menunggu Chief atau Raihan (sesi Grok tidak menulis teks tayang)."] if pel else []),
           "ringkas": ringkas, "catatan_pencocokan": sorted(set(catatan)), "wilayah": wilayah}
    json.dump(out, open(keluar, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(json.dumps(ringkas, ensure_ascii=False))


if __name__ == "__main__":
    main()
