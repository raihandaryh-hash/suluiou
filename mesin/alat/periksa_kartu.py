#!/usr/bin/env python3
"""Gerbang G1.1 (provenans) dan G1.4 (nol angka ketikan model) atas berkas kartu. Tanpa jaringan.
Pakai: python3 mesin/alat/periksa_kartu.py [KARTU.jsonl]   (bawaan: mesin/kartu/fixture_kartu.jsonl)"""
import json, os, re, sys
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(AKAR, "kartu")); sys.argv = sys.argv[:2]
import kartu as K
p = sys.argv[1] if len(sys.argv) > 1 else os.path.join(AKAR, "kartu", "fixture_kartu.jsonl")
import glob, yaml
DIPAKAI = set()
for q in glob.glob(os.path.join(AKAR, "sumber", "*.yaml")):
    d = yaml.safe_load(open(q, encoding="utf-8"))
    if any(c["property"] == "dipakai_kartu" and str(c["value"]) == "ya" for c in d.get("customProperties", [])): DIPAKAI.add(d["id"])
import csv as _csv
SEL = {os.path.basename(q)[:-4]: {r["kode_bps"] for r in _csv.DictReader(open(q, encoding="utf-8"))}
       for q in glob.glob(os.path.join(AKAR, "sumber", "sel", "*.csv"))}
def sumber_ditahan(k):
    """Kartu yang bukan draf hanya boleh memakai sumber berstatus dipakai_kartu: ya, dan hanya sel yang tercantum
    di sumber/sel/<sumber>.csv (sel yang cocok dengan publikasi kedua)."""
    if k.get("status") == "draf": return []
    out = [f"{k['id']}: status {k.get('status')} memakai sumber ditahan {i['sumber_id']}" for i in k["indikator"] if i["sumber_id"] not in DIPAKAI]
    out += [f"{k['id']}: sel {k['wilayah']['kode_bps']} tidak terverifikasi untuk {i['sumber_id']}" for i in k["indikator"]
            if i["sumber_id"] in DIPAKAI and k["wilayah"]["kode_bps"] not in SEL.get(i["sumber_id"], set())]
    return out
gagal = []
kart = [json.loads(l) for l in open(p, encoding="utf-8")]
for k in kart:
    for ind in k["indikator"]:
        for f in ("sumber_id", "url", "tahun_data", "sha256", "tanggal_akses"):
            if not ind.get(f): gagal.append(f"{k['id']}: indikator tanpa {f}")
        if ind.get("alasan_keandalan") not in ("rse_dari_ci", "rse_tidak_terbit", "administratif"): gagal.append(f"{k['id']}: alasan_keandalan kosong atau tak sah")
        if not re.fullmatch(r"[0-9a-f]{64}", ind.get("sha256") or ""): gagal.append(f"{k['id']}: sha256 bukan sidik penuh")
    if not re.search(r"@[0-9a-f]{12}$", k["jarak"].get("dihitung_oleh", "")): gagal.append(f"{k['id']}: jarak tanpa versi skrip")
    if not k["pembanding"].get("sumber_id"): gagal.append(f"{k['id']}: pembanding tanpa sumber")
    gagal += sumber_ditahan(k)
    if k.get("teks", {}).get("judul"):
        K.normalisasi_satuan(k); gagal += [f"{k['id']}: {x}" for x in K.periksa_teks(k)]
# uji negatif: kartu rusak wajib ditolak
rusak = json.loads(json.dumps(kart[0])); rusak["teks"]["ringkasan"] = "Angkanya 25 persen, hampir seperempat balita."
if not K.periksa_teks(rusak): gagal.append("periksa_teks meloloskan kartu rusak")
terbit = json.loads(json.dumps(kart[0])); terbit["status"] = "terbit"; terbit["indikator"][0]["sumber_id"] = "ssgi-2024"
if not sumber_ditahan(terbit): gagal.append("kartu terbit bersumber ditahan diloloskan")
sel_luar = json.loads(json.dumps(kart[0])); sel_luar["status"] = "terbit"; sel_luar["indikator"][0]["sumber_id"] = "kemiskinan-kabkota-2025"; sel_luar["wilayah"]["kode_bps"] = "9999"
if not sumber_ditahan(sel_luar): gagal.append("kartu terbit dengan sel tak terverifikasi diloloskan")
sel_dalam = json.loads(json.dumps(sel_luar)); sel_dalam["wilayah"]["kode_bps"] = "3171"
if sumber_ditahan(sel_dalam): gagal.append("kartu terbit dengan sel terverifikasi ditolak")
print(f"G1.1/G1.4: {len(kart)} kartu, {len(gagal)} pelanggaran")
for g in gagal: print("  ", g)
sys.exit(1 if gagal else 0)
