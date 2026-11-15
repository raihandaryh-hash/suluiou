#!/usr/bin/env python3
"""S1: susun isi lapis provinsi (Peta Medan, 'Gambaran arah daerahmu') dari kartu kebutuhan.
Deterministik, tanpa AI, tanpa teks karangan. Tidak menulis province_contexts (penulis tunggal: Chief Sulu).
Pakai: python3 s1_lapis_provinsi.py [keluaran.json]
Aturan:
- hanya angka yang punya sumber_id, url, tahun_data, sha256 yang masuk;
- boleh_tampil hanya bila status kartu 'terbit'; selain itu isi ikut keluar untuk ditinjau, tidak untuk tayang;
- provinsi tanpa kartu ditulis 'tanpa_kartu', tidak diisi karangan;
- keadaan (belum ada / belum cukup / belum efektif) = null sampai ada sumber tentang pelaku; angka jarak tidak cukup untuk itu.
"""
import json, sys, glob, os, collections
SINI = os.path.dirname(os.path.abspath(__file__))
KARTU = sorted(glob.glob(os.path.join(SINI, "..", "kartu", "keluaran", "*.jsonl")))
WAJIB = ("sumber_id", "url", "tahun_data", "sha256", "nilai", "satuan")

def muat():
    for f in KARTU:
        for l in open(f, encoding="utf-8"):
            if l.strip():
                yield json.loads(l)

def angka(k):
    i = k["indikator"][0]
    if any(i.get(w) in (None, "") for w in WAJIB):
        return None
    return {w: i[w] for w in WAJIB} | {"kode": i["kode"], "keandalan": i["keandalan"]}

def butir(k):
    a = angka(k)
    if a is None:
        return None
    return {"kartu_id": k["id"], "kartu_versi": k["versi"], "wilayah_kode": k["wilayah"]["kode_bps"],
            "wilayah_nama": k["wilayah"]["nama"], "angka": a, "jarak": k["jarak"]["nilai"], "arah": k["jarak"]["arah"],
            "pembanding": {x: k["pembanding"].get(x) for x in ("jenis", "sumber_id", "catatan")},
            "status": k["status"], "boleh_tampil": k["status"] == "terbit"}

def susun():
    prov = collections.defaultdict(lambda: {"nama": None, "kebutuhan": collections.defaultdict(lambda: {"provinsi": None, "kabkota": []})})
    ditolak = 0
    for k in muat():
        b = butir(k)
        if b is None:
            ditolak += 1
            continue
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
        for jenis, s in sorted(p["kebutuhan"].items()):
            kk = sorted(s["kabkota"], key=lambda b: (-b["jarak"], b["wilayah_kode"]))
            keb[jenis] = {"medan": s["medan"], "keadaan": None, "provinsi": s["provinsi"],
                          "kabkota_jumlah": len(kk),
                          "kabkota_melewati_pembanding": sum(1 for b in kk if b["arah"] == "di_atas"),
                          "kabkota_jarak_terbesar": kk[:3]}
        ada_tampil = any((v["provinsi"] and v["provinsi"]["boleh_tampil"]) or any(b["boleh_tampil"] for b in v["kabkota_jarak_terbesar"]) for v in keb.values())
        out[kode] = {"nama": p["nama"], "status": "ada_kartu_tayang" if ada_tampil else "kartu_belum_terbit", "kebutuhan": keb}
    return out, ditolak

if __name__ == "__main__":
    out, ditolak = susun()
    tujuan = sys.argv[1] if len(sys.argv) > 1 else os.path.join(SINI, "keluaran", "lapis_provinsi.json")
    os.makedirs(os.path.dirname(tujuan), exist_ok=True)
    json.dump({"skema": "lapis-provinsi/0", "catatan": "provinsi yang tidak ada di sini = tanpa_kartu", "provinsi": out},
              open(tujuan, "w", encoding="utf-8"), ensure_ascii=False, indent=1, sort_keys=True)
    st = collections.Counter(v["status"] for v in out.values())
    print(f"provinsi berkartu {len(out)}; {dict(st)}; kartu ditolak tanpa sumber lengkap {ditolak}")
