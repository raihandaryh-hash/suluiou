#!/usr/bin/env python3
"""Pengurai JSON mentah BPS WebAPI (list/model/data) menjadi baris indikator per kab/kota.
Tidak memanggil jaringan dan tidak memakai model. Masukan: folder hasil bps_panen.py (berkas *.json + manifest.csv).
Pakai: python bps_webapi.py FOLDER_MENTAH KELUARAN.csv
Kunci sel datacontent = kode vervar + var + turvar + kode tahun + turtahun; pengurai mencocokkan susunan itu
secara eksplisit dan menolak sel yang tidak cocok."""
import csv, hashlib, json, os, re, sys

ALIAS = {"pangkep": "pangkajenedankepulauan", "sidrap": "sidenrengrappang"}  # singkatan lazim di tabel BPS provinsi

def kanon(nama):
    """Nama wilayah ke bentuk pembanding: huruf kecil, tanpa awalan Kabupaten/Kab., spasi tunggal; 'Kota' dipertahankan."""
    n = re.sub(r"<[^>]+>", "", nama)
    n = re.sub(r"\s+", " ", n.lower().replace(chr(160), " ")).strip()
    n = re.sub(r"^(kabupaten|kab\.?)\s+", "", n)
    n = re.sub(r"^kota\s+adm(\.|inistrasi)?\s+", "kota ", n)
    n = re.sub(r"^(kota\s+)?kep\.?\s+", lambda m: (m.group(1) or "") + "kepulauan ", n)
    return re.sub(r"[\s\-.]", "", n)

def muat_wilayah(folder):
    """Daftar 514 kab/kota resmi dari _domain_all.json (domain/type/all): {prov2: {kanon(nama): kode}}."""
    p = os.path.join(folder, "_domain_all.json")
    if not os.path.exists(p): return {}
    peta = {}
    for d in json.load(open(p, encoding="utf-8"))["data"][1]:
        k = d["domain_id"]
        if k == "0000": continue
        if k.endswith("00"):
            peta.setdefault(k[:2], {})[kanon("provinsi " + d["domain_name"])] = k
            peta[k[:2]][kanon(d["domain_name"])] = k
            continue
        nama = ("kota " if int(k[2:]) >= 71 else "") + d["domain_name"]  # nama domain BPS tanpa kata Kota
        peta.setdefault(k[:2], {})[kanon(nama)] = k
    return peta

def urai_berkas(path, wilayah=None):
    raw = open(path, "rb").read(); j = json.loads(raw)
    if j.get("data-availability") != "available": return [], [f"{os.path.basename(path)}: tidak tersedia"]
    var = j["var"][0]; turvar = j["turvar"]; tahun = j["tahun"]; turth = j["turtahun"]
    nama = {str(v["val"]): v["label"] for v in j["vervar"]}
    baris, tolak = [], []
    if not isinstance(j.get("datacontent"), dict):  # tabel tanpa isi (BPS mengembalikan daftar kosong)
        return [], [f"{os.path.basename(path)}: datacontent kosong"]
    for kunci, nilai in j["datacontent"].items():
        cocok = None
        for vv in nama:
            if not kunci.startswith(vv): continue
            sisa = kunci[len(vv):]
            for tv in turvar:
                for th in tahun:
                    for tt in turth:
                        if sisa == f"{var['val']}{tv['val']}{th['val']}{tt['val']}":
                            cocok = (vv, tv, th, tt)
        if not cocok: tolak.append(f"{os.path.basename(path)}: kunci {kunci} tak terurai"); continue
        vv, tv, th, tt = cocok
        prov2 = os.path.basename(path)[:2]
        if re.fullmatch(r"\d{4}", vv) and (vv[:2] == prov2 or prov2 == "00"):  # domain 0000 memakai kode wilayah penuh
            kode, cara = vv, "kode_vervar"
        elif re.search(r"^(jumlah|total|indonesia)$", nama[vv].strip().lower()):
            kode, cara = prov2 + "00", "baris_jumlah"
        else:
            w, kn = (wilayah or {}).get(prov2, {}), kanon(nama[vv])
            kn = ALIAS.get(kn, kn)
            kode, cara = w.get(kn), "nama"
            if not kode and w.get("kota" + kn): kode, cara = w["kota" + kn], "nama_tanpa_kota"
            if not kode: tolak.append(f"{os.path.basename(path)}: wilayah '{nama[vv]}' tak terpetakan"); continue
        tingkat = "provinsi" if kode.endswith("00") else "kabkota"
        baris.append(dict(kode_bps=kode, cara_petakan=cara, vervar_asli=vv, wilayah=nama[vv], tingkat=tingkat, var_id=var["val"], judul=var["label"],
                          satuan=var.get("unit", ""), turvar=tv["label"], tahun=th["label"], periode=tt["label"],
                          nilai=nilai, catatan_sumber=re.sub("<[^>]+>", " ", var.get("note") or "").strip(),
                          pembaruan_bps=j.get("last_update", ""), berkas=os.path.basename(path),
                          sha256_berkas=hashlib.sha256(raw).hexdigest()))
    return baris, tolak

if __name__ == "__main__":
    folder, keluar = sys.argv[1], sys.argv[2]
    semua, tolak = [], []
    wilayah = muat_wilayah(folder)
    for f in sorted(os.listdir(folder)):
        if f.endswith(".json") and re.match(r"\d{4}_", f):
            b, t = urai_berkas(os.path.join(folder, f), wilayah); semua += b; tolak += t
    with open(keluar, "w", newline="", encoding="utf-8") as o:
        w = csv.DictWriter(o, fieldnames=list(semua[0].keys())); w.writeheader(); w.writerows(semua)
    kab = {(r["kode_bps"]) for r in semua if r["tingkat"] == "kabkota"}
    print(f"{len(semua)} sel · {len(kab)} kab/kota unik · tertolak {len(tolak)}")
    import collections
    for t, n in collections.Counter(x.split(": ", 1)[1].split("'")[0] + (x.split("'")[1] if "'" in x else "") for x in tolak).most_common(25): print("  tolak:", n, t)
