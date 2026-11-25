"""Pengurai + pemeriksa Indeks Desa (sid.kemendesa.go.id) per kabupaten/kota. Tidak memakai model.
Masukan: folder MESIN\\mentah\\sid (hasil sid_panen.py). Keluaran: CSV kab/kota.
Uji internal: (1) status desa per kab/kota berjumlah sama dengan jumlah desa; (2) jumlah kab/kota per provinsi sama
dengan ringkasan provinsi untuk semua kolom hitungan; (3) ringkasan provinsi sama dengan baris provinsi di berkas
nasional; (4) persen di ringkasan sama dengan hitungan/jumlah (toleransi 0,05 poin).
Pakai: python sid_2025.py FOLDER 2025 KELUARAN.csv"""
import csv, glob, hashlib, json, os, sys
folder, T, out = sys.argv[1:4]
HIT = ["jumlah_desa", "desa_mandiri", "desa_maju", "desa_berkembang", "desa_tertinggal", "desa_sangat_tertinggal",
       "desa_belum_dihitung", "desa_status_lain", "desa_punya_bumdes", "bumdes_aktif", "bumdes_berbadan_hukum",
       "desa_terdampak_banjir", "desa_terdampak_kekeringan", "desa_terdampak_longsor", "desa_terdampak_gelombang_pasang",
       "desa_sudah_kajian_risiko"]
STATUS = HIT[1:8]
def n(x):
    try: return float(x)
    except (TypeError, ValueError): return None
nas = json.load(open(os.path.join(folder, f"{T}_nasional.json"), encoding="utf-8"))
nas_prov = {r["kode"]: r for r in (nas.get("anak") or {}).get("baris", [])}
baris, temuan = [], {"status": [], "prov_sum": [], "nasional": [], "persen": [], "kab_vs_prov": [], "kec_sum": [], "kab_tanpa_berkas": []}
KAB_HIT = ["jumlah_desa"] + STATUS + ["desa_punya_bumdes"]
for f in sorted(glob.glob(os.path.join(folder, f"{T}_[0-9][0-9].json"))):
    raw = open(f, "rb").read(); j = json.loads(raw); sha = hashlib.sha256(raw).hexdigest()
    pk = j["wilayah"]["kode"]; ring = j["ringkasan"][0]
    kab = j["anak"]["baris"]
    for r in kab:
        s = sum(n(r.get(k)) or 0 for k in STATUS)
        if n(r.get("jumlah_desa")) is not None and abs(s - n(r["jumlah_desa"])) > 0.5: temuan["status"].append((r["kode"], r["nama"], s, r["jumlah_desa"]))
        isi = {k: r.get(k) for k in HIT}; sk, berkas_kab = None, ""
        fk = os.path.join(folder, "kab", f"{T}_{r['kode']}.json")
        if os.path.exists(fk):
            rawk = open(fk, "rb").read(); jk = json.loads(rawk); rk = jk["ringkasan"][0]; berkas_kab = hashlib.sha256(rawk).hexdigest()
            for k in KAB_HIT:
                if n(rk.get(k)) != n(r.get(k)): temuan["kab_vs_prov"].append((r["kode"], k, r.get(k), rk.get(k)))
            for k in HIT:
                if isi.get(k) is None: isi[k] = rk.get(k)
                kec = sum(n(x.get(k)) or 0 for x in (jk.get("anak") or {}).get("baris", []))
                if k in KAB_HIT and n(rk.get(k)) is not None and abs(kec - n(rk[k])) > 0.5: temuan["kec_sum"].append((r["kode"], k, kec, rk[k]))
        else: temuan["kab_tanpa_berkas"].append(r["kode"])
        baris.append(dict(kode_kemendagri=r["kode"], nama=r["nama"], provinsi=j["wilayah"]["nama"], tahun=T,
                          **isi, rata_skor=r.get("rata_skor"), berkas=os.path.basename(f), sha256_berkas=sha, sha256_berkas_kab=berkas_kab))
    for k in KAB_HIT:
        a = sum(n(r.get(k)) or 0 for r in kab); b = n(ring.get(k))
        if b is not None and abs(a - b) > 0.5: temuan["prov_sum"].append((pk, k, a, b))
        c = n((nas_prov.get(pk) or {}).get(k))
        if c is not None and b is not None and abs(c - b) > 0.5: temuan["nasional"].append((pk, k, b, c))
    for st in ["mandiri", "maju", "berkembang", "tertinggal", "sangat_tertinggal", "belum_dihitung"]:
        p = n(ring.get("pct_" + st)); h = n(ring.get("desa_" + st)); jd = n(ring.get("jumlah_desa"))
        if p is not None and jd: 
            if abs(100 * h / jd - p) > 0.0501: temuan["persen"].append((pk, st, p, round(100 * h / jd, 2)))
    for k in HIT[8:]:  # kolom yang hanya ada di ringkasan: jumlah kab/kota vs provinsi
        a = sum(n(b.get(k)) or 0 for b in baris if b["provinsi"] == j["wilayah"]["nama"]); bb = n(ring.get(k))
        if bb is not None and abs(a - bb) > 0.5: temuan["prov_sum"].append((pk, k, a, bb))
with open(out, "w", newline="", encoding="utf-8") as o:
    w = csv.DictWriter(o, fieldnames=list(baris[0].keys())); w.writeheader(); w.writerows(baris)
print(f"kab/kota {len(baris)} | provinsi {len({b['provinsi'] for b in baris})} | desa {sum(n(b['jumlah_desa']) or 0 for b in baris):.0f} | nasional di berkas: {n((nas.get('ringkasan') or [{}])[0].get('jumlah_desa'))}")
for k, v in temuan.items(): print(f"  uji {k}: {len(v)} pelanggaran {v[:6]}")
