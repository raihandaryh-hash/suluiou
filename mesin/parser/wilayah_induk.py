"""Daftar wilayah induk 514 kab/kota: satu baris per wilayah, dengan kode domain BPS dan kode Kemendagri.
Sumber: (a) daftar domain BPS (_domain_all.json, kode lama untuk Papua); (b) kode Kemendagri dari Indeks Desa SID
(berkas provinsi mentah\\sid\\2025_XX.json); (c) kode baru Papua dari tabel nasional TPT BPS (0000_tpt_2824_2025.json).
Pencocokan per nama baku (kanon) di dalam provinsi; Papua dicocokkan lintas provinsi lama-baru. Tidak memakai model.
Pakai: python wilayah_induk.py KELUARAN.csv"""
import csv, glob, json, os, sys, collections
sys.path.insert(0, os.path.dirname(__file__))
from bps_webapi import kanon
M = os.path.join(os.path.dirname(__file__), "..", "mentah")
D = json.load(open(os.path.join(M, "bps", "_domain_all.json"), encoding="utf-8"))["data"][1]
bps = {d["domain_id"]: d["domain_name"] for d in D if not d["domain_id"].endswith("00")}
prov_bps = {d["domain_id"][:2]: d["domain_name"] for d in D if d["domain_id"].endswith("00") and d["domain_id"] != "0000"}
def kn(kode, nama): return kanon(("kota " if int(kode[2:]) >= 71 else "") + nama)
# kode Kemendagri dari SID (hanya kab/kota yang punya desa)
sid = {}
for f in glob.glob(os.path.join(M, "sid", "2025_[0-9][0-9].json")):
    j = json.load(open(f, encoding="utf-8"))
    for r in j["anak"]["baris"]: sid[r["kode"]] = (r["nama"], j["wilayah"]["nama"])
# kode baru Papua dari tabel nasional TPT
tpt = json.load(open(os.path.join(M, "bps", "0000_tpt_2824_2025.json"), encoding="utf-8"))
baru = {str(v["val"]): v["label"] for v in tpt["vervar"] if str(v["val"])[:2] in ("91", "92", "93", "94", "95", "96") and not str(v["val"]).endswith("00")}
PAPUA_BPS = ("91", "94")
# Catatan penting: kode Kemendagri dan kode domain BPS TIDAK sama urutannya (contoh: Kemendagri 1101 = Aceh Selatan,
# BPS 1101 = Simeulue). Pencocokan wajib lewat nama di dalam provinsi, bukan lewat angka kode.
ALIAS_NAMA = {"kotapadangsidempuan": "kotapadangsidimpuan", "kepulauansiautagulandangbiaro": "siautagulandangbiaro",
              "kepulauantanimbar": "malukutenggarabarat"}
def kunci_sid(n):
    k = kanon(n)
    return ALIAS_NAMA.get(k, k)
idx_sid = collections.defaultdict(dict)
for k, (n, p) in sid.items(): idx_sid[k[:2]][kunci_sid(n)] = k
idx_baru = {}
for k, n in baru.items(): idx_baru.setdefault(kanon(("kota " if int(k[2:]) >= 71 else "") + n), []).append(k)
baris, masalah = [], []
for kb, nama in sorted(bps.items()):
    key = kn(kb, nama); p2 = kb[:2]
    if p2 in PAPUA_BPS:
        cand = sorted(k for k, (n, _) in sid.items() if k[:2] in ("91", "92", "93", "94", "95", "96") and kunci_sid(n) == key)
        km = cand[0] if len(cand) == 1 else ""
        if len(cand) != 1 and int(kb[2:]) < 71: masalah.append((kb, nama, cand))
    else:
        km = idx_sid[p2].get(key) or ""
        if not km and int(kb[2:]) < 71: masalah.append((kb, nama, "kab tanpa pasangan di SID"))
    baris.append(dict(kode_bps=kb, kode_kemendagri=km, nama=("Kota " if int(kb[2:]) >= 71 else "") + nama,
                      provinsi_bps=prov_bps.get(p2, ""), ada_di_sid=km in sid, provinsi_kemendagri=(sid.get(km) or ("", ""))[1]))
with open(sys.argv[1], "w", newline="", encoding="utf-8") as o:
    w = csv.DictWriter(o, fieldnames=list(baris[0].keys())); w.writeheader(); w.writerows(baris)
print(f"wilayah {len(baris)} | berkode Kemendagri {sum(bool(b['kode_kemendagri']) for b in baris)} | ada di SID {sum(b['ada_di_sid'] for b in baris)} | kode SID tak terpakai {len(set(sid) - {b['kode_kemendagri'] for b in baris})}")
print("  kode SID tak terpakai:", sorted(set(sid) - {b["kode_kemendagri"] for b in baris})[:20])
for m in masalah[:30]: print("  masalah:", m)
