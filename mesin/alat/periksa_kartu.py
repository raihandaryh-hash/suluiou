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
def periksa_pembanding(k):
    """Pembanding target resmi wajib sama persis dengan sumber/target/target_resmi.yaml dan jaraknya dihitung ulang."""
    pb = k["pembanding"]
    if pb.get("jenis") == "median_nasional": return []
    if pb.get("jenis") != "target_resmi": return [f"{k['id']}: jenis pembanding tak dikenal"]
    t = K.muat_target(k["indikator"][0]["sumber_id"])
    if not t or any(pb.get(f) != t[f] for f in ("nilai_bawah", "nilai_atas", "tahun_target", "sumber_id")):
        return [f"{k['id']}: pembanding target_resmi tidak sama dengan berkas target"]
    jn, arah = K.jarak_ke(k["indikator"][0]["nilai"], pb)
    if (jn, arah) != (k["jarak"]["nilai"], k["jarak"]["arah"]): return [f"{k['id']}: jarak ke target salah"]
    return []
# S4 (syarat bawaan ME1): skema kartu, sidik bukan nol, URL hanya dari kontrak sumber; S3: SUMBER kartu.py sama dengan kontrak
import jsonschema, urllib.parse
SKEMA = jsonschema.Draft202012Validator(json.load(open(os.path.join(AKAR, "kartu", "kartu-1.schema.json"), encoding="utf-8")))
KONTRAK = {}
for q in glob.glob(os.path.join(AKAR, "sumber", "*.yaml")):
    d = yaml.safe_load(open(q, encoding="utf-8")); cp = {c["property"]: str(c["value"]) for c in d.get("customProperties", [])}
    m = re.match(r"[0-9a-f]{64}\b", cp.get("berkas_sha256", ""))
    KONTRAK[d["id"]] = {"sha256": m.group(0) if m else None, "url": cp.get("berkas_url")}
HOST_RESMI = {"www.bps.go.id", "webapi.bps.go.id", "www.badankebijakan.kemkes.go.id"}
def periksa_asal(k):
    out = [f"{k['id']}: skema: {e.message[:80]}" for e in SKEMA.iter_errors(k)]
    for i in k.get("indikator", []):
        h = i.get("sha256") or ""
        if re.fullmatch(r"(.)\1{63}", h): out.append(f"{k['id']}: sidik nol atau berulang")
        kt = KONTRAK.get(i.get("sumber_id"))
        if kt and kt["url"]:
            if i.get("url") != kt["url"]: out.append(f"{k['id']}: url tidak sama dengan berkas_url kontrak {i['sumber_id']}")
            if kt["sha256"] and h != kt["sha256"]: out.append(f"{k['id']}: sha256 tidak sama dengan berkas_sha256 kontrak {i['sumber_id']}")
        else:
            if k.get("status") != "draf": out.append(f"{k['id']}: sumber {i.get('sumber_id')} tanpa kontrak ber-URL, kartu wajib draf")
            if urllib.parse.urlparse(i.get("url") or "").hostname not in HOST_RESMI: out.append(f"{k['id']}: host url bukan host resmi")
    return out
def periksa_sumber_kartu():
    out = []
    for j, (sid, th, url, sha) in K.SUMBER.items():
        kt = KONTRAK.get(sid) or {}
        if kt.get("url") != url: out.append(f"kartu.py SUMBER[{j}]: url berbeda dari kontrak {sid}")
        if kt.get("sha256") != sha: out.append(f"kartu.py SUMBER[{j}]: sha256 berbeda dari kontrak {sid}")
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
    gagal += periksa_pembanding(k)
    gagal += sumber_ditahan(k)
    gagal += periksa_asal(k)
    if k.get("teks", {}).get("judul"):
        K.normalisasi_satuan(k); gagal += [f"{k['id']}: {x}" for x in K.periksa_teks(k)]
# uji negatif pembanding: target dipalsukan dan jarak salah wajib ditolak
_kt = K.bangun_kartu("p0", "3171", "Kota Jakarta Selatan", 3.23, "hati_hati", 9.0, alasan_keandalan="rse_tidak_terbit", target=K.muat_target("kemiskinan-kabkota-2025"))
if periksa_pembanding(_kt): gagal.append("pembanding target sah ditolak")
_p = json.loads(json.dumps(_kt)); _p["pembanding"]["nilai_atas"] = 9.9
if not periksa_pembanding(_p): gagal.append("target palsu diloloskan")
_p = json.loads(json.dumps(_kt)); _p["jarak"]["nilai"] = 1.0
if not periksa_pembanding(_p): gagal.append("jarak salah diloloskan")
# uji negatif: kartu rusak wajib ditolak
rusak = json.loads(json.dumps(kart[0])); rusak["teks"]["ringkasan"] = "Angkanya 25 persen, hampir seperempat balita."
if not K.periksa_teks(rusak): gagal.append("periksa_teks meloloskan kartu rusak")
terbit = json.loads(json.dumps(kart[0])); terbit["status"] = "terbit"; terbit["indikator"][0]["sumber_id"] = "ssgi-2024"
if not sumber_ditahan(terbit): gagal.append("kartu terbit bersumber ditahan diloloskan")
sel_luar = json.loads(json.dumps(kart[0])); sel_luar["status"] = "terbit"; sel_luar["indikator"][0]["sumber_id"] = "kemiskinan-kabkota-2025"; sel_luar["wilayah"]["kode_bps"] = "9999"
if not sumber_ditahan(sel_luar): gagal.append("kartu terbit dengan sel tak terverifikasi diloloskan")
sel_dalam = json.loads(json.dumps(sel_luar)); sel_dalam["wilayah"]["kode_bps"] = "3171"
if sumber_ditahan(sel_dalam): gagal.append("kartu terbit dengan sel terverifikasi ditolak")
# uji negatif S4: sidik nol, url palsu, sha tak sama kontrak, sumber tanpa kontrak berstatus terbit, skema rusak
gagal += periksa_sumber_kartu()
_b = json.loads(json.dumps(kart[0]))
for nama, ubah in (("sidik nol", lambda x: x["indikator"][0].update(sha256="0" * 64)),
                   ("url palsu", lambda x: x["indikator"][0].update(url="https://www.badankebijakan.kemkes.go.id.contoh.com/ssgi")),
                   ("url lain di host resmi", lambda x: x["indikator"][0].update(url="https://www.bps.go.id/id/publication/palsu.html")),
                   ("sha lain", lambda x: x["indikator"][0].update(sha256="ab" * 32)),
                   ("tanpa kontrak terbit", lambda x: (x["indikator"][0].update(sumber_id="tak-terdaftar"), x.update(status="terbit"))),
                   ("skema: medan tak dikenal", lambda x: x.update(medan="K9"))):
    _x = json.loads(json.dumps(_b)); ubah(_x)
    if not periksa_asal(_x): gagal.append(f"S4: {nama} diloloskan")
if periksa_asal(_b): gagal.append("S4: kartu sah ditolak")
print(f"G1.1/G1.4: {len(kart)} kartu, {len(gagal)} pelanggaran")
for g in gagal: print("  ", g)
sys.exit(1 if gagal else 0)
