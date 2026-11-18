#!/usr/bin/env python3
"""ekspor_kartu_tayang.py: berkas kartu untuk dipasang Chief Sulu (elemen A1), bentuk yang diminta Chief 16 Nov 2026.

Keluaran di mesin/sambung/keluaran/kartu_tayang/:
  indeks.json          daftar sumber, kalimat tanda hati-hati, dan per provinsi: berkas, jumlah kartu,
                       kabupaten/kota yang belum punya kartu per jenis
  prov_<kode>.json     kartu satu provinsi
Tiap kartu: wilayah, jenis kebutuhan, angka + satuan + tahun, tanda hati-hati, judul, ringkasan (satu kalimat
angka), langkah_awal. TIDAK ikut: pembanding target nasional dan angka jarak (manifest D3; evaluasi 16 Nov).
Teks dari templat varian A (KEPUTUSAN Raihan 15 Nov 13.49), tanpa model. Kalimat tanda hati-hati = varian A
pilihan Raihan 16 Nov 00.27. Tidak mengubah berkas kartu sumber dan tidak mengubah statusnya.
"""
import json, os, sys, csv, collections, re
from decimal import Decimal, ROUND_HALF_UP
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(AKAR, "kartu"))
import kartu as K, isi_teks
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import tpt_catatan_bps
# Paket titipan 5 (16 Nov 2026 23.10): medan tunggal tanda_hati_hati dicabut (kalimat lama keliru untuk TPT dan
# berpola "X, bukan Y"). Gantinya teks per jenis (sama dengan kartuDaerahContent.ts di main 77c7f86) dan catatan
# per kartu untuk kab/kota yang BPS tandai RSE (dari tpt_catatan_bps.json). Raihan 16 Nov 23.21: "gunakan yang terbaik saja".
HATI_PER_JENIS = {
 "kemiskinan-kabkota": "Angka survei BPS untuk tingkat kabupaten/kota. Ketelitiannya terbatas. Baca sebagai gambaran.",
 "pengangguran-terbuka-kabkota": "Angka survei BPS untuk tingkat kabupaten/kota. Ketelitiannya terbatas, dan untuk sebagian kabupaten BPS sendiri menandai angkanya kurang teliti. Baca sebagai gambaran.",
}
CATATAN_RSE = "BPS menandai angka daerah ini kurang teliti: galat relatifnya 25 sampai 50 persen."
CATATAN_TPT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "keluaran", "tpt_catatan_bps.json")
SUMBER = {
 "kemiskinan-kabkota-2025": {"penerbit": "Badan Pusat Statistik", "judul": "Data dan Informasi Kemiskinan Kabupaten/Kota Tahun 2025", "periode_survei": "Susenas Maret 2025",
   "relevansi": "ukuran resmi kemiskinan moneter tingkat kab/kota; satu publikasi, satu tahun untuk 514 wilayah sehingga antarwilayah sebanding",
   "tautan_baca": "https://www.bps.go.id/id/publication/2025/11/28/f7534097ff9c717e794cd6e1/data-dan-informasi-kemiskinan-kabupaten--kota-tahun-2025.html"},
 "sakernas-agustus": {"penerbit": "Badan Pusat Statistik", "judul": "Tingkat Pengangguran Terbuka menurut Kabupaten/Kota", "periode_survei": "Sakernas Agustus 2025",
   "relevansi": "ukuran resmi pengangguran terbuka tingkat kab/kota; sebagian kab/kota bertanda kurang teliti oleh BPS (catatan_bps di kartu)",
   "tautan_baca": "https://www.bps.go.id/id/statistics-table/2/MjgyNCMy/tingkat-pengangguran-terbuka-menurut-jenis-kelamin-dan-kabupaten-kota.html",
   "catatan": "tabel nasional var 2824; judul halaman dicek 16 Nov 2026. Tabel provinsi per kode provinsi ada di indeks provinsi.<kode>.tautan_baca_tpt"},
}
IND_DERET = {"kemiskinan-kabkota": "p0", "pengangguran-terbuka-kabkota": "tpt"}
JUDUL_TABEL = {"kemiskinan-kabkota": "Persentase Penduduk Miskin menurut Kabupaten/Kota", "pengangguran-terbuka-kabkota": "Tingkat Pengangguran Terbuka menurut Kabupaten/Kota"}
def _terbaru():
    import csv as _c
    out = {}
    for r in _c.DictReader(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "keluaran", "deret_kemiskinan_tpt.csv"), encoding="utf-8")):
        if r["tingkat"] != "kabkota" or not r["sumber"].startswith("tabel provinsi var "): continue
        m = re.match(r"tabel provinsi var (\d+) \((\d{4})_", r["sumber"]); th = int(r["tahun"])
        key = (r["kode_bps"], r["indikator"])
        if m and (key not in out or th > out[key][0]): out[key] = (th, float(r["nilai"]), int(m.group(1)), m.group(2))
    return out
TERBARU = _terbaru()
def bangun():
    tpt = json.load(open(CATATAN_TPT, encoding="utf-8"))
    rse = {x["kode_bps"]: x for x in tpt["kab_ditandai_rse"] if x["kode_bps"]}
    tautan_prov = {p["domain"][:2]: (p["tautan_baca"], p["tautan_jenis"]) for p in tpt["per_provinsi"]}
    kart = [json.loads(l) for l in open(os.path.join(AKAR, "kartu", "keluaran", "kartu_me2.jsonl"), encoding="utf-8") if l.strip()]
    induk = {}
    for r in csv.DictReader(open(os.path.join(AKAR, "sumber", "masukan_kartu", "dikk2025_tabel21.csv"), encoding="utf-8")):
        if r["tingkat"] == "kabkota":
            nama = " ".join(r["nama"].split())
            induk[r["kode_bps"]] = (r["provinsi"], nama if nama.startswith("Kota ") else "Kab. " + nama)
    # Papua: kode kab/kota lama (34 provinsi) dipetakan ke kode baru (38 provinsi)
    baru = {r["kode_bps_lama"]: r["kode_bps_baru"] for r in csv.DictReader(open(os.path.join(AKAR, "sumber", "wilayah", "kode_baru_papua.csv"), encoding="utf-8"))}
    kode_baru = lambda c: baru.get(c, c)
    setengah = lambda x: str(Decimal(str(x)).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)).replace(".", ",")
    prov = collections.defaultdict(list)
    for k in kart:
        k2 = isi_teks.isi(k, "A")
        t = isi_teks.T["jenis"][k["jenis_kebutuhan"]]["A"]
        k2["teks"]["ringkasan"] = t["nilai"].replace("{wilayah}", isi_teks.TANDA)
        galat = K.periksa_teks(k2)
        if galat: raise SystemExit(f"teks ditolak {k['id']}: {galat}")
        lama = k["wilayah"]["kode_bps"]; nama = induk[lama][1]   # satu ejaan per kode: nama publikasi kemiskinan 2025
        r = {b: x.replace(isi_teks.TANDA, nama) for b, x in K.render(k2).items()}
        ind = k["indikator"][0]
        a, b_ = f"{ind['nilai']:.1f}".replace(".", ","), setengah(ind["nilai"])
        if a != b_:
            assert r["ringkasan"].count(a + " persen") == 1, (k["id"], a)
            r["ringkasan"] = r["ringkasan"].replace(a + " persen", b_ + " persen")
        wil = {"kode_bps": kode_baru(lama), "nama": nama, "tingkat": k["wilayah"]["tingkat"]}
        if kode_baru(lama) != lama: wil["kode_bps_lama"] = lama
        angka = {"nilai": ind["nilai"], "satuan": ind["satuan"], "tahun_data": ind["tahun_data"], "sumber_id": ind["sumber_id"]}
        catatan, catatan_t = ((CATATAN_RSE, rse[lama]["tautan_tabel"]) if k["jenis_kebutuhan"] == "pengangguran-terbuka-kabkota" and lama in rse else (None, None))
        sebelumnya = None
        br = TERBARU.get((kode_baru(lama), IND_DERET[k["jenis_kebutuhan"]]))
        if br and br[0] > int(ind["tahun_data"]):   # KEPUTUSAN Raihan 18 Nov 2026 13.56: "Soal angka 2026, saya putuskan tampil."
            th, nilai, var, dom = br
            lama_s, baru_s = setengah(ind["nilai"]) + " persen", setengah(nilai) + " persen"
            assert r["ringkasan"].count(lama_s) == 1 and r["ringkasan"].count(str(ind["tahun_data"])) == 1, (k["id"], r["ringkasan"])
            r["ringkasan"] = r["ringkasan"].replace(lama_s, baru_s).replace(str(ind["tahun_data"]), str(th))
            sid = f"{IND_DERET[k['jenis_kebutuhan']]}-{th}-prov{dom}"
            SUMBER.setdefault(sid, {"penerbit": "Badan Pusat Statistik", "judul": JUDUL_TABEL[k["jenis_kebutuhan"]] + f" (tabel BPS provinsi, var {var})",
                "periode_survei": ("Susenas Maret " if IND_DERET[k["jenis_kebutuhan"]] == "p0" else "Sakernas Agustus ") + str(th),
                "tautan_baca": tpt_catatan_bps.tautan(dom, var, JUDUL_TABEL[k["jenis_kebutuhan"]]) if dom in tpt_catatan_bps.SUB else SUMBER[ind["sumber_id"]]["tautan_baca"],
                "tautan_jenis": "dibangun dari nomor tabel BPS provinsi (belum dibuka)",
                "relevansi": "angka resmi terbaru tingkat kab/kota; tahunnya bisa berbeda dengan wilayah tetangga, jadi tahun tampil di kartu"})
            sebelumnya = {"nilai": ind["nilai"], "tahun_data": ind["tahun_data"], "sumber_id": ind["sumber_id"]}
            angka = {"nilai": nilai, "satuan": ind["satuan"], "tahun_data": th, "sumber_id": sid}
            if k["jenis_kebutuhan"] == "pengangguran-terbuka-kabkota": catatan, catatan_t = None, None  # tabel 2026 tanpa catatan RSE
        prov[kode_baru(lama)[:2]].append({
            "id": k["id"], "wilayah": wil, "jenis_kebutuhan": k["jenis_kebutuhan"],
            "angka": angka, **({"angka_sebelumnya": sebelumnya} if sebelumnya else {}),
            "hati_hati": ind["keandalan"] == "hati_hati",
            "catatan_bps": catatan, "catatan_bps_tautan": catatan_t,
            "judul": r["judul"], "ringkasan": r["ringkasan"]})
    keluar = os.path.join(AKAR, "sambung", "keluaran", "kartu_tayang"); os.makedirs(keluar, exist_ok=True)
    jenis = sorted({k["jenis_kebutuhan"] for k in kart})
    idx = {"skema": "kartu-tayang/3", "perubahan_3_1": "angka BPS 2026 (tabel provinsi) tampil bila tersedia, KEPUTUSAN Raihan 18 Nov 2026 13.56; angka 2025 di angka_sebelumnya; sumber per provinsi", "perubahan_dari_2": "tanda_hati_hati (satu kalimat) dicabut, diganti hati_hati_per_jenis; kartu TPT kab/kota yang BPS tandai RSE membawa catatan_bps + catatan_bps_tautan; sakernas-agustus punya tautan_baca; tiap provinsi membawa tautan_baca_tpt (tabel BPS provinsi, cadangan tabel nasional)",
           "perubahan_dari_1": "satu ejaan nama per kode_bps; pembulatan setengah ke atas; enam provinsi Papua dengan kode baru (kode_bps_lama disertakan); bidang langkah_awal dicabut; nama di belum_punya_kartu berawalan Kab. atau Kota",
           "hati_hati_per_jenis": HATI_PER_JENIS, "sumber": SUMBER, "jenis_kebutuhan": jenis, "provinsi": {}}
    induk = {kode_baru(c): v for c, v in induk.items()}
    for kode in sorted({c[:2] for c in induk}):
        ks = sorted(prov.get(kode, []), key=lambda x: (x["wilayah"]["kode_bps"], x["jenis_kebutuhan"]))
        punya = collections.defaultdict(set)
        for x in ks: punya[x["jenis_kebutuhan"]].add(x["wilayah"]["kode_bps"])
        semua = sorted(c for c in induk if c[:2] == kode)
        nama2 = {induk[c][0] for c in semua}
        assert len(nama2) == 1, (kode, nama2)
        nama_prov = induk[semua[0]][0]
        tb = tautan_prov.get(kode, (SUMBER["sakernas-agustus"]["tautan_baca"], "tabel nasional (provinsi baru tanpa domain WebAPI)"))
        idx["provinsi"][kode] = {"nama": nama_prov, "berkas": f"prov_{kode}.json" if ks else None, "jumlah_kartu": len(ks),
            "tautan_baca_tpt": tb[0], "tautan_baca_tpt_jenis": tb[1],
            "belum_punya_kartu": {j: [{"kode_bps": c, "nama": induk[c][1]} for c in semua if c not in punya[j]] for j in jenis}}
        if ks: json.dump({"skema": "kartu-tayang/3", "provinsi": {"kode": kode, "nama": nama_prov}, "kartu": ks},
                         open(os.path.join(keluar, f"prov_{kode}.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(idx, open(os.path.join(keluar, "indeks.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    return idx, prov, len(induk)
setengah_uji = lambda x: str(Decimal(str(x)).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)).replace(".", ",")
if __name__ == "__main__":
    idx, prov, n_kab = bangun()
    semua = [x for v in prov.values() for x in v]
    kal = lambda s: len([p for p in re.split(r"(?<=[.!?])\s+", s.strip()) if p])
    uji = {
      "jumlah kartu 900": len(semua) == 900,
      "tiap kartu berjudul dan beringkasan": all(x["judul"] and x["ringkasan"] for x in semua),
      "ringkasan paling banyak tiga kalimat": all(kal(x["ringkasan"]) <= 3 for x in semua),
      "tanpa pembanding dan jarak": not any(re.search(r"target|jarak|nilai tengah|poin di (atas|bawah)", x["judul"] + x["ringkasan"]) for x in semua) and not any("pembanding" in x or "jarak" in x for x in semua),
      "tanpa placeholder tersisa": not any(re.search(r"[{}⟦⟧]", x["judul"] + x["ringkasan"]) for x in semua),
      "tiap angka bersumber dan bertahun": all(x["angka"]["sumber_id"] in idx["sumber"] and x["angka"]["tahun_data"] for x in semua),
      "id unik": len({x["id"] for x in semua}) == len(semua),
      "satu ejaan nama per kode_bps": all(len(v) == 1 for v in collections.defaultdict(set, {c: {y["wilayah"]["nama"] for y in semua if y["wilayah"]["kode_bps"] == c} for c in {x["wilayah"]["kode_bps"] for x in semua}}).values()),
      "tanpa spasi ganda atau huruf berjarak di nama": not any(re.search(r"  |(^| )\S \S \S( |$)", x["wilayah"]["nama"] + " " + x["judul"]) for x in semua),
      "kode kab/kota berawalan kode provinsinya": all(x["wilayah"]["kode_bps"].startswith(k) for k, v in prov.items() for x in v),
      "38 provinsi": len(idx["provinsi"]) == 38,
      "pembulatan setengah ke atas": all(setengah_uji(x["angka"]["nilai"]) + " persen" in x["ringkasan"] for x in semua),
      "teks hati-hati untuk tiap jenis": set(idx["hati_hati_per_jenis"]) == set(idx["jenis_kebutuhan"]),
      "medan tunggal tanda_hati_hati tidak ada": "tanda_hati_hati" not in idx,
      "catatan RSE hanya di kartu TPT yang BPS tandai": all((x["catatan_bps"] is not None) == (x["jenis_kebutuhan"] == "pengangguran-terbuka-kabkota" and x["wilayah"].get("kode_bps_lama", x["wilayah"]["kode_bps"]) in {r["kode_bps"] for r in json.load(open(CATATAN_TPT, encoding="utf-8"))["kab_ditandai_rse"]}) for x in semua),
      "tiap provinsi bertautan baca TPT": all(p["tautan_baca_tpt"].startswith("https://") for p in idx["provinsi"].values()),
      "teks hati-hati tanpa pola X, bukan Y dan tanpa tanda pisah": not any(re.search(r", bukan |\u2014", t) for t in list(idx["hati_hati_per_jenis"].values()) + [CATATAN_RSE]),
    }
    tot = {j: (sum(1 for x in semua if x["jenis_kebutuhan"] == j), sum(len(p["belum_punya_kartu"][j]) for p in idx["provinsi"].values())) for j in idx["jenis_kebutuhan"]}
    uji["punya + belum = jumlah kab/kota"] = all(a + b == n_kab for a, b in tot.values())
    for n, ok in uji.items(): print("LULUS" if ok else "GAGAL", n)
    print("kab/kota di daftar induk:", n_kab, "| per jenis (punya, belum):", tot, "| provinsi berberkas:", sum(1 for p in idx["provinsi"].values() if p["berkas"]), "dari", len(idx["provinsi"]))
    sys.exit(0 if all(uji.values()) else 1)
