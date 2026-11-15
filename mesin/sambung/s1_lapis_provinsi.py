#!/usr/bin/env python3
"""S1: susun isi lapis provinsi (Peta Medan, 'Gambaran arah daerahmu') dari kartu kebutuhan.
Deterministik, tanpa AI, tanpa teks karangan. Tidak menulis province_contexts (penulis tunggal: Chief Sulu).
Pakai: python3 s1_lapis_provinsi.py [keluaran.json]
Aturan:
- hanya angka yang punya sumber_id, url, tahun_data, sha256 yang masuk;
- boleh_tampil hanya bila status kartu 'terbit'; selain itu isi ikut keluar untuk ditinjau, tidak untuk tayang;
- provinsi tanpa kartu tidak muncul di keluaran (pemasang membacanya sebagai tanpa kartu), tidak diisi karangan;
- 'jarak terbesar' hanya memuat wilayah yang melewati pembanding ke arah yang buruk;
- jenis kebutuhan baru wajib didaftarkan di ARAH_BURUK lebih dulu, supaya arah tidak diandaikan;
- keadaan (belum ada / belum cukup / belum efektif) = null sampai ada sumber tentang pelaku; angka jarak tidak cukup untuk itu.
"""
import json, sys, glob, os, collections
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "kartu"))
import isi_teks, kartu as PUSTAKA_KARTU
SINI = os.path.dirname(os.path.abspath(__file__))
KARTU = sorted(glob.glob(os.path.join(SINI, "..", "kartu", "keluaran", "*.jsonl")))
# arah jarak yang berarti keadaan lebih buruk dari pembanding, per jenis kebutuhan
ARAH_BURUK = {"kemiskinan-kabkota": "di_atas", "pengangguran-terbuka-kabkota": "di_atas",
              "stunting-balita": "di_atas", "penduduk-tanpa-jaminan-kesehatan": "di_atas"}
WAJIB = ("sumber_id", "url", "tahun_data", "sha256", "nilai", "satuan")

def muat():
    for f in KARTU:
        for l in open(f, encoding="utf-8"):
            if l.strip():
                yield json.loads(l)

def angka(k):
    if len(k["indikator"]) != 1:
        raise ValueError(f"kartu {k['id']} berindikator {len(k['indikator'])}; penyusun ini hanya untuk satu indikator")
    i = k["indikator"][0]
    if any(i.get(w) in (None, "") for w in WAJIB):
        return None
    return {w: i[w] for w in WAJIB} | {"kode": i["kode"], "keandalan": i["keandalan"]}

def teks(k):
    k2 = isi_teks.isi(k, isi_teks.T["terpilih"])
    if PUSTAKA_KARTU.periksa_teks(k2):
        raise ValueError(f"teks kartu {k['id']} tidak lolos pemeriksa")
    return {b: x.replace(isi_teks.TANDA, k["wilayah"]["nama"]) for b, x in PUSTAKA_KARTU.render(k2).items()}

def butir(k):
    a = angka(k)
    if a is None:
        return None
    return {"kartu_id": k["id"], "kartu_versi": k["versi"], "wilayah_kode": k["wilayah"]["kode_bps"],
            "wilayah_nama": k["wilayah"]["nama"], "angka": a, "jarak": k["jarak"]["nilai"], "arah": k["jarak"]["arah"],
            "pembanding": {x: k["pembanding"].get(x) for x in ("jenis", "sumber_id", "catatan")},
            "teks": teks(k), "status": k["status"], "boleh_tampil": k["status"] == "terbit"}

def susun():
    prov = collections.defaultdict(lambda: {"nama": None, "kebutuhan": collections.defaultdict(lambda: {"provinsi": None, "kabkota": []})})
    ditolak = 0
    for k in muat():
        b = butir(k)
        if b is None:
            ditolak += 1
            continue
        if k["jenis_kebutuhan"] not in ARAH_BURUK:
            raise ValueError(f"jenis {k['jenis_kebutuhan']} belum punya arah di ARAH_BURUK")
        if len(b["wilayah_kode"]) not in (2, 4):
            raise ValueError(f"kode wilayah tak dikenal: {b['wilayah_kode']}")
        b["melewati"] = b["arah"] == ARAH_BURUK[k["jenis_kebutuhan"]]
        kode = b["wilayah_kode"][:2]
        slot = prov[kode]["kebutuhan"][k["jenis_kebutuhan"]]
        slot["medan"] = k["medan"]
        if k["wilayah"]["tingkat"] == "provinsi":
            prov[kode]["nama"] = k["wilayah"]["nama"]
            slot["provinsi"] = b
        else:
            slot["kabkota"].append(b)
    out = {}
    for kode in sorted(prov):
        p = prov[kode]
        keb = {}
        tampil_n = 0
        for jenis, s in sorted(p["kebutuhan"].items()):
            semua = s["kabkota"]
            kk = sorted((b for b in semua if b["melewati"]), key=lambda b: (-b["jarak"], b["wilayah_kode"]))
            tampil_n += sum(b["boleh_tampil"] for b in semua) + bool(s["provinsi"] and s["provinsi"]["boleh_tampil"])
            keb[jenis] = {"medan": s["medan"], "keadaan": None, "provinsi": s["provinsi"],
                          "kabkota_jumlah": len(semua),
                          "kabkota_melewati_pembanding": len(kk),
                          "kabkota_jarak_terbesar": kk[:3]}
        ada_tampil = tampil_n > 0
        out[kode] = {"nama": p["nama"] or f"provinsi {kode}", "nama_dari_kartu": p["nama"] is not None, "status": "ada_kartu_tayang" if ada_tampil else "kartu_belum_terbit", "kebutuhan": keb}
    return out, ditolak

if __name__ == "__main__":
    out, ditolak = susun()
    tujuan = sys.argv[1] if len(sys.argv) > 1 else os.path.join(SINI, "keluaran", "lapis_provinsi.json")
    os.makedirs(os.path.dirname(tujuan), exist_ok=True)
    json.dump({"skema": "lapis-provinsi/0", "catatan": "provinsi yang tidak ada di sini = tanpa kartu; butir dengan boleh_tampil=false hanya untuk ditinjau, jangan dipasang; semua angka berkeandalan seperti tertulis di bidang keandalan", "provinsi": out},
              open(tujuan, "w", encoding="utf-8"), ensure_ascii=False, indent=1, sort_keys=True)
    st = collections.Counter(v["status"] for v in out.values())
    print(f"provinsi berkartu {len(out)}; {dict(st)}; kartu ditolak tanpa sumber lengkap {ditolak}")
