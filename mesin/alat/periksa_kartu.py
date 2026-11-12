#!/usr/bin/env python3
"""Gerbang G1.1 (provenans) dan G1.4 (nol angka ketikan model) atas berkas kartu. Tanpa jaringan.
Pakai: python3 mesin/alat/periksa_kartu.py [KARTU.jsonl]   (bawaan: mesin/kartu/fixture_kartu.jsonl)"""
import json, os, re, sys
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(AKAR, "kartu")); sys.argv = sys.argv[:2]
import kartu as K
p = sys.argv[1] if len(sys.argv) > 1 else os.path.join(AKAR, "kartu", "fixture_kartu.jsonl")
gagal = []
kart = [json.loads(l) for l in open(p, encoding="utf-8")]
for k in kart:
    for ind in k["indikator"]:
        for f in ("sumber_id", "url", "tahun_data", "sha256", "tanggal_akses"):
            if not ind.get(f): gagal.append(f"{k['id']}: indikator tanpa {f}")
        if not re.fullmatch(r"[0-9a-f]{64}", ind.get("sha256") or ""): gagal.append(f"{k['id']}: sha256 bukan sidik penuh")
    if not re.search(r"@[0-9a-f]{12}$", k["jarak"].get("dihitung_oleh", "")): gagal.append(f"{k['id']}: jarak tanpa versi skrip")
    if not k["pembanding"].get("sumber_id"): gagal.append(f"{k['id']}: pembanding tanpa sumber")
    if k.get("teks", {}).get("judul"):
        K.normalisasi_satuan(k); gagal += [f"{k['id']}: {x}" for x in K.periksa_teks(k)]
# uji negatif: kartu rusak wajib ditolak
rusak = json.loads(json.dumps(kart[0])); rusak["teks"]["ringkasan"] = "Angkanya 25 persen, hampir seperempat balita."
if not K.periksa_teks(rusak): gagal.append("periksa_teks meloloskan kartu rusak")
print(f"G1.1/G1.4: {len(kart)} kartu, {len(gagal)} pelanggaran")
for g in gagal: print("  ", g)
sys.exit(1 if gagal else 0)
