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
def sumber_ditahan(k):
    """Kartu yang bukan draf hanya boleh memakai sumber berstatus dipakai_kartu: ya."""
    if k.get("status") == "draf": return []
    return [f"{k['id']}: status {k.get('status')} memakai sumber ditahan {i['sumber_id']}" for i in k["indikator"] if i["sumber_id"] not in DIPAKAI]
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
print(f"G1.1/G1.4: {len(kart)} kartu, {len(gagal)} pelanggaran")
for g in gagal: print("  ", g)
sys.exit(1 if gagal else 0)
