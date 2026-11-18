#!/usr/bin/env python3
"""Pemeriksa gerbang A (bersumber), K (kesegaran), M (istilah dan panjang) atas berkas kartu tayang (skema kartu-tayang/3).
Gelombang 1 Tonggak 2b (A1) mensyaratkan gerbang A, K, M lulus (manifest 2b, baris A1). Ambang dari rancangan sambungan v3 bagian 6.

Pakai: python3 -I periksa_gerbang_kartu.py [--tahun-cek 2026] [--folder <kartu_tayang>] [--deret <deret_kemiskinan_tpt.csv>]
Usulan ambang K (PUTUSAN ATAS DELEGASI sesi mesin 18 Nov 2026, dapat dibalik): angka tahunan segar bila tahun_cek - tahun_data <= 1,
usang bila >= 3; di antaranya "perlu diperbarui". Kartu juga dilaporkan bila deret BPS sudah punya angka tahun lebih baru untuk wilayah itu.
Keluar 0 bila tidak ada GAGAL."""
import csv, glob, json, os, re, sys, collections

SINI = os.path.dirname(os.path.abspath(__file__))
FOLDER = os.path.join(SINI, "..", "sambung", "keluaran", "kartu_tayang")
DERET = os.path.join(SINI, "..", "sambung", "keluaran", "deret_kemiskinan_tpt.csv")
IND = {"kemiskinan-kabkota": "p0", "pengangguran-terbuka-kabkota": "tpt"}
# istilah dapur: kata kerja internal yang tidak boleh tampil ke pengguna (rancangan v3 gerbang M; aturan bahasa Sulu)
DAPUR = [r"\bRSE\b", r"\bP0\b", r"\bTPT\b", r"\bkode[_ ]bps\b", r"\blapis\b", r"\bSINTESIS\b", r"\bskema\b", r"\bpembanding\b",
         r"\bjarak\b", r"\bfard[ua] kifayah\b", r"\bmaq[aā]sh?id\b", r"\bvar\s*\d+", r"\bWebAPI\b", r"\bDIKK\b"]
DIHINDARI = [(r"—", "tanda pisah panjang"), (r",\s*bukan\s+\w+", "pola 'X, bukan Y'"), (r"(^|[.!?]\s+)(Dan|Atau|Serta|Lalu|Namun)\b", "kalimat dibuka kata sambung"),
             (r"\bcocok(nya)? (kamu|jadi)\b", "nada vonis"), (r"\bpasti\b", "klaim pasti")]

def kalimat(t): return [p for p in re.split(r"(?<=[.!?])\s+", t.strip()) if p]

def main(a):
    tahun_cek = int(a[a.index("--tahun-cek") + 1]) if "--tahun-cek" in a else 2026
    folder = a[a.index("--folder") + 1] if "--folder" in a else FOLDER
    deret_p = a[a.index("--deret") + 1] if "--deret" in a else DERET
    idx = json.load(open(os.path.join(folder, "indeks.json"), encoding="utf-8"))
    terbaru = collections.defaultdict(int)
    if os.path.exists(deret_p):
        for r in csv.DictReader(open(deret_p, encoding="utf-8")):
            if r["tingkat"] == "kabkota": terbaru[(r["kode_bps"], r["indikator"])] = max(terbaru[(r["kode_bps"], r["indikator"])], int(r["tahun"]))
    hasil = {"A": collections.Counter(), "K": collections.Counter(), "M": collections.Counter()}
    contoh = collections.defaultdict(list); n = 0
    for f in sorted(glob.glob(os.path.join(folder, "prov_*.json"))):
        d = json.load(open(f, encoding="utf-8")); ks = d if isinstance(d, list) else d.get("kartu", [])
        for k in ks:
            n += 1; ang = k["angka"]; s = idx["sumber"].get(ang.get("sumber_id"))
            # A
            kurang = [m for m in ("penerbit", "judul", "periode_survei", "tautan_baca") if not (s or {}).get(m)]
            if s is None or ang.get("nilai") is None or not ang.get("tahun_data"): hasil["A"]["GAGAL"] += 1; contoh["A GAGAL"].append(k["id"])
            elif kurang: hasil["A"]["GAGAL"] += 1; contoh["A GAGAL"].append(k["id"] + " kurang " + ",".join(kurang))
            else:
                hasil["A"]["LULUS"] += 1
                if not s.get("relevansi"): hasil["A"]["catatan relevansi belum ada (syarat gerbang A, per sumber)"] += 1
            # K
            umur = tahun_cek - int(ang["tahun_data"])
            status = "segar" if umur <= 1 else ("usang" if umur >= 3 else "perlu diperbarui")
            if status == "usang": hasil["K"]["GAGAL usang"] += 1; contoh["K usang"].append(k["id"])
            else: hasil["K"][status] += 1
            if str(ang["tahun_data"]) not in k["ringkasan"]: hasil["K"]["GAGAL tahun tidak disebut di teks"] += 1; contoh["K tanpa tahun"].append(k["id"])
            t = terbaru.get((k["wilayah"]["kode_bps"], IND.get(k["jenis_kebutuhan"], "")), 0)
            if t > int(ang["tahun_data"]): hasil["K"][f"ada angka BPS lebih baru ({t})"] += 1; contoh[f"K lebih baru {k['jenis_kebutuhan']}"].append(k["wilayah"]["kode_bps"])
            # M
            teks = k["judul"] + ". " + k["ringkasan"]
            if len(kalimat(k["ringkasan"])) > 3: hasil["M"]["GAGAL lebih dari tiga kalimat"] += 1; contoh["M panjang"].append(k["id"])
            for p in DAPUR:
                if re.search(p, teks, re.I): hasil["M"]["GAGAL istilah dapur " + p] += 1; contoh["M dapur"].append(k["id"])
            for p, nama in DIHINDARI:
                if re.search(p, teks): hasil["M"]["GAGAL " + nama] += 1; contoh["M hindari"].append(k["id"])
    for teks in list(idx.get("hati_hati_per_jenis", {}).values()):
        for p in DAPUR:
            if re.search(p, teks, re.I): hasil["M"]["GAGAL istilah dapur di hati-hati " + p] += 1
    gagal = any(c.startswith("GAGAL") for g in hasil.values() for c in g)
    print(f"kartu diperiksa: {n} · tahun cek {tahun_cek}")
    for g, c in hasil.items(): print(f"gerbang {g}:", dict(c))
    for kk, v in contoh.items(): print(f"  {kk}: {len(v)} contoh {v[:5]}")
    print("VONIS:", "GAGAL" if gagal else "LULUS (lihat catatan)")
    return 1 if gagal else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
