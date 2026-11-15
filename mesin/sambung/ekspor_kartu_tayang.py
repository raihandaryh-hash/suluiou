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
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(AKAR, "kartu"))
import kartu as K, isi_teks
HATI = "Angka survei BPS untuk tingkat kabupaten/kota. BPS tidak menerbitkan besar galatnya, jadi baca sebagai gambaran, bukan angka pasti."
SUMBER = {
 "kemiskinan-kabkota-2025": {"penerbit": "Badan Pusat Statistik", "judul": "Data dan Informasi Kemiskinan Kabupaten/Kota Tahun 2025", "periode_survei": "Susenas Maret 2025",
   "tautan_baca": "https://www.bps.go.id/id/publication/2025/11/28/f7534097ff9c717e794cd6e1/data-dan-informasi-kemiskinan-kabupaten--kota-tahun-2025.html"},
 "sakernas-agustus": {"penerbit": "Badan Pusat Statistik", "judul": "Tingkat Pengangguran Terbuka menurut Kabupaten/Kota", "periode_survei": "Sakernas Agustus 2025",
   "tautan_baca": None, "catatan": "halaman tabel BPS yang bisa dibaca orang belum dipastikan; alamat data: https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/2824"},
}
def bangun():
    kart = [json.loads(l) for l in open(os.path.join(AKAR, "kartu", "keluaran", "kartu_me2.jsonl"), encoding="utf-8") if l.strip()]
    induk = {}
    for r in csv.DictReader(open(os.path.join(AKAR, "sumber", "masukan_kartu", "dikk2025_tabel21.csv"), encoding="utf-8")):
        if r["tingkat"] == "kabkota": induk[r["kode_bps"]] = (r["provinsi"], r["nama"])
    prov = collections.defaultdict(list)
    for k in kart:
        k2 = isi_teks.isi(k, "A")
        t = isi_teks.T["jenis"][k["jenis_kebutuhan"]]["A"]
        k2["teks"]["ringkasan"] = t["nilai"].replace("{wilayah}", isi_teks.TANDA)
        galat = K.periksa_teks(k2)
        if galat: raise SystemExit(f"teks ditolak {k['id']}: {galat}")
        r = {b: x.replace(isi_teks.TANDA, k["wilayah"]["nama"]) for b, x in K.render(k2).items()}
        ind = k["indikator"][0]
        prov[k["wilayah"]["kode_bps"][:2]].append({
            "id": k["id"], "wilayah": k["wilayah"], "jenis_kebutuhan": k["jenis_kebutuhan"],
            "angka": {"nilai": ind["nilai"], "satuan": ind["satuan"], "tahun_data": ind["tahun_data"], "sumber_id": ind["sumber_id"]},
            "hati_hati": ind["keandalan"] == "hati_hati",
            "judul": r["judul"], "ringkasan": r["ringkasan"], "langkah_awal": r["harapan"]})
    keluar = os.path.join(AKAR, "sambung", "keluaran", "kartu_tayang"); os.makedirs(keluar, exist_ok=True)
    jenis = sorted({k["jenis_kebutuhan"] for k in kart})
    idx = {"skema": "kartu-tayang/1", "tanda_hati_hati": HATI, "sumber": SUMBER, "jenis_kebutuhan": jenis, "provinsi": {}}
    for kode in sorted({c[:2] for c in induk}):
        ks = sorted(prov.get(kode, []), key=lambda x: (x["wilayah"]["kode_bps"], x["jenis_kebutuhan"]))
        punya = collections.defaultdict(set)
        for x in ks: punya[x["jenis_kebutuhan"]].add(x["wilayah"]["kode_bps"])
        semua = sorted(c for c in induk if c[:2] == kode)
        nama_prov = induk[semua[0]][0]
        idx["provinsi"][kode] = {"nama": nama_prov, "berkas": f"prov_{kode}.json" if ks else None, "jumlah_kartu": len(ks),
            "belum_punya_kartu": {j: [{"kode_bps": c, "nama": induk[c][1]} for c in semua if c not in punya[j]] for j in jenis}}
        if ks: json.dump({"skema": "kartu-tayang/1", "provinsi": {"kode": kode, "nama": nama_prov}, "kartu": ks},
                         open(os.path.join(keluar, f"prov_{kode}.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(idx, open(os.path.join(keluar, "indeks.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    return idx, prov, len(induk)
if __name__ == "__main__":
    idx, prov, n_kab = bangun()
    semua = [x for v in prov.values() for x in v]
    kal = lambda s: len([p for p in re.split(r"(?<=[.!?])\s+", s.strip()) if p])
    uji = {
      "jumlah kartu 900": len(semua) == 900,
      "tiap kartu berjudul dan beringkasan": all(x["judul"] and x["ringkasan"] and x["langkah_awal"] for x in semua),
      "ringkasan paling banyak tiga kalimat": all(kal(x["ringkasan"]) <= 3 for x in semua),
      "tanpa pembanding dan jarak": not any(re.search(r"target|jarak|nilai tengah|poin di (atas|bawah)", x["judul"] + x["ringkasan"] + x["langkah_awal"]) for x in semua) and not any("pembanding" in x or "jarak" in x for x in semua),
      "tanpa placeholder tersisa": not any(re.search(r"[{}⟦⟧]", x["judul"] + x["ringkasan"] + x["langkah_awal"]) for x in semua),
      "tiap angka bersumber dan bertahun": all(x["angka"]["sumber_id"] in idx["sumber"] and x["angka"]["tahun_data"] for x in semua),
      "id unik": len({x["id"] for x in semua}) == len(semua),
    }
    tot = {j: (sum(1 for x in semua if x["jenis_kebutuhan"] == j), sum(len(p["belum_punya_kartu"][j]) for p in idx["provinsi"].values())) for j in idx["jenis_kebutuhan"]}
    uji["punya + belum = jumlah kab/kota"] = all(a + b == n_kab for a, b in tot.values())
    for n, ok in uji.items(): print("LULUS" if ok else "GAGAL", n)
    print("kab/kota di daftar induk:", n_kab, "| per jenis (punya, belum):", tot, "| provinsi berberkas:", sum(1 for p in idx["provinsi"].values() if p["berkas"]), "dari", len(idx["provinsi"]))
    sys.exit(0 if all(uji.values()) else 1)
