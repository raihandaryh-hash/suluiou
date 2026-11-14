#!/usr/bin/env python3
"""Kartu tingkat provinsi untuk stunting dan penduduk tanpa jaminan kesehatan (ME3, butir papan 88).
Alasan: panen kab/kota keduanya terlalu tipis (STATUS_ME2), jadi rantai G3.1 memakai kartu provinsi.
Status draf (lihat ALASAN_DRAF). Pembanding = nilai tengah antar-provinsi berlabel (tidak ada target resmi ukuran sama yang dibaca dari dokumen);
jarak dihitung kartu.jarak_ke. Tidak mengubah kartu.py supaya sidik kartu ME2 tetap.
Pakai: python3 mesin/kartu/kartu_prov.py  -> mesin/kartu/keluaran/kartu_me3_prov.jsonl"""
import csv, hashlib, json, os, statistics, sys
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(AKAR, "kartu")); import kartu as K
SHA_SKRIP = hashlib.sha256(open(__file__, "rb").read()).hexdigest()[:12]
# sidik berkas mentah di laptop MESIN/mentah (dicek 14 Nov 2026 lewat Get-FileHash)
JENIS = {
    "stunting-balita": {"ind": "prevalensi_stunting", "pop": "balita", "medan": "K1", "th": 2024, "sid": "ssgi-2024",
        "url": K.SUMBER["stunting"][2], "sha": K.SUMBER["stunting"][3], "keandalan": "hati_hati", "alasan": "rse_tidak_terbit", "metode": "langsung", "catatan": "RSE tingkat provinsi belum dihitung dari CI Tabel 4.1"},
    "penduduk-tanpa-jaminan-kesehatan": {"ind": "persen_tanpa_jaminan_kesehatan", "pop": "penduduk", "medan": "K1", "th": 2025, "sid": "bps-var-2279",
        "url": "https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/2279",
        "sha": "efeb768d27e5d67c1daedaad9d1df3197d797dde52cab41221e5c0f97217a1a4", "keandalan": "hati_hati",
        "alasan": "rse_tidak_terbit", "metode": "turunan", "catatan": "nilai = 100 dikurangi var 2279 (penduduk ber-JKN: BPJS PBI, BPJS non-PBI, atau Jamkesda, Susenas Maret 2025); yang berasuransi swasta saja ikut terhitung tanpa JKN"},
}

# Kedua sumber belum boleh dipakai kartu tayang (periksa_kartu: dipakai_kartu): kartu berstatus draf sampai syaratnya terpenuhi.
ALASAN_DRAF = {"stunting-balita": "sumber ssgi-2024 dipakai_kartu: tidak (G1.3 belum: publikasi kedua independen belum ada)",
               "penduduk-tanpa-jaminan-kesehatan": "sumber bps-var-2279 belum punya kontrak data di mesin/sumber dan belum lewat G1.3"}

def kartu_prov(jenis):
    c = JENIS[jenis]
    R = list(csv.DictReader(open(os.path.join(AKAR, "sumber", "prov", jenis + ".csv"), encoding="utf-8")))
    med = round(statistics.median(float(r["laju_persen"]) for r in R), 2)
    out = []
    for r in R:
        v = float(r["laju_persen"])
        pb = {"jenis": "median_nasional", "nilai": med, "sumber_id": c["sid"], "url": c["url"],
              "catatan": "nilai tengah antar-provinsi di tabel terbit; bukan target resmi"}
        jn, arah = K.jarak_ke(v, pb)
        out.append({"id": f"{jenis}.{r['kode_prov']}", "versi": K.VERSI, "jenis_kebutuhan": jenis, "medan": c["medan"],
            "wilayah": {"kode_bps": r["kode_prov"], "nama": r["nama_prov"], "tingkat": "provinsi"}, "populasi": c["pop"],
            "populasi_kelompok": int(r["populasi_kelompok"]),
            "indikator": [{"kode": c["ind"], "nilai": v, "satuan": "persen", "tahun_data": c["th"], "rse": None,
                "keandalan": c["keandalan"], "alasan_keandalan": c["alasan"], "metode": c["metode"], "sumber_id": c["sid"],
                "url": c["url"], "sha256": c["sha"], "tanggal_akses": "2026-11-13", "catatan_sumber": r["sumber_laju"] + "; " + c["catatan"]}],
            "pembanding": pb, "konteks": {"median_nasional": med},
            "jarak": {"nilai": jn, "arah": arah, "dihitung_oleh": f"mesin/kartu/kartu_prov.py@{SHA_SKRIP}"},
            "teks": {"judul": "", "ringkasan": "", "harapan": ""}, "status": "draf", "alasan_draf": ALASAN_DRAF[jenis]})
    return out

if __name__ == "__main__":
    kart = kartu_prov("stunting-balita") + kartu_prov("penduduk-tanpa-jaminan-kesehatan")
    p = os.path.join(AKAR, "kartu", "keluaran", "kartu_me3_prov.jsonl")
    with open(p, "w", encoding="utf-8") as f:
        for k in kart: f.write(json.dumps(k, ensure_ascii=False, sort_keys=True) + "\n")
    print("kartu provinsi:", len(kart), {j: sum(k["jenis_kebutuhan"] == j for k in kart) for j in JENIS})
