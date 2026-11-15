#!/usr/bin/env python3
"""Uji gerbang A untuk S1: 100% angka bersumber dan bertahun; tak ada yang tayang sebelum 'terbit'; deterministik."""
import json, hashlib, s1_lapis_provinsi as s
a, ditolak = s.susun(); b, _ = s.susun()
semua = list(s.muat())
assert ditolak == 0, f"{ditolak} kartu ditolak"
h = lambda o: hashlib.sha256(json.dumps(o, sort_keys=True).encode()).hexdigest()
assert h(a) == h(b), "tidak deterministik"
n = tampil = 0
for kode, p in a.items():
    assert len(kode) == 2
    for v in p["kebutuhan"].values():
        assert v["keadaan"] is None
        jt = v["kabkota_jarak_terbesar"]
        assert all(x["melewati"] for x in jt), "jarak terbesar memuat wilayah yang lebih baik dari pembanding"
        assert jt == sorted(jt, key=lambda x: (-x["jarak"], x["wilayah_kode"]))
        assert len(jt) == min(3, v["kabkota_melewati_pembanding"]) and v["kabkota_melewati_pembanding"] <= v["kabkota_jumlah"]
        for bt in ([v["provinsi"]] if v["provinsi"] else []) + v["kabkota_jarak_terbesar"]:
            n += 1
            for w in s.WAJIB:
                assert bt["angka"][w] not in (None, ""), (bt["kartu_id"], w)
            assert bt["angka"]["url"].startswith("https://") and bt["angka"]["tahun_data"] >= 2000
            assert bt["boleh_tampil"] == (bt["status"] == "terbit")
            tampil += bt["boleh_tampil"]
assert sum(v["kabkota_jumlah"] + bool(v["provinsi"]) for p in a.values() for v in p["kebutuhan"].values()) == len(semua)
print(f"LULUS gerbang A (data): {len(semua)} kartu dibaca, 0 ditolak; keluaran {n} butir, {n} bersumber dan bertahun, {tampil} boleh tampil, {len(a)} provinsi berkartu")
