#!/usr/bin/env python3
"""L4 Kartu Kebutuhan (kartu-kebutuhan/1): bagian deterministik. Tidak memakai model.
- bangun_kartu(): angka dari L3, pembanding, jarak, keandalan -> kartu tanpa teks.
- periksa_teks(): gerbang G1.4 (digit di luar placeholder, kata kuantitas, placeholder asing) + aturan skema 3.
- render(): mengisi placeholder dari kartu; teks tanpa lolos periksa_teks tidak pernah dirender.
Pakai sebagai pustaka, atau: python3 kartu.py SSGI_WILAYAH.csv [DIKK.csv] KELUARAN.jsonl"""
import csv, hashlib, json, os, re, statistics, sys
# Daftar kata kuantitas tunggal: dibaca dari baris KATA_KUANTITAS di kontrak/buat_kontrak.py (skrip itu tidak bisa
# diimpor karena langsung menulis fixture), supaya kontrak dan kartu tidak pernah memakai dua daftar berbeda.
_src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "kontrak", "buat_kontrak.py"), encoding="utf-8").read()
KATA_KUANTITAS = re.compile(re.search(r'KATA_KUANTITAS = re\.compile\(r"(.+?)"\)\n', _src).group(1))

VERSI = "2026.1"
KATA_TERLARANG = re.compile(r"(?i)\b(cukup|tercukupi|fardu kifayah|fardhu kifayah|kifayah)\b")
PLACEHOLDER = re.compile(r"\{([a-z0-9_]+)\}")
JENIS = {  # jenis kebutuhan -> (indikator, populasi baku, medan, arah buruk)
    "stunting": ("stunting-balita", "prevalensi_stunting", "balita", "K1", "naik"),
    "wasting": ("wasting-balita", "prevalensi_wasting", "balita", "K1", "naik"),
    "p0": ("kemiskinan-kabkota", "persentase_penduduk_miskin", "penduduk", "K5", "naik"),
}
SUMBER = {"stunting": ("ssgi-2024", 2024, "https://www.badankebijakan.kemkes.go.id/survei-status-gizi-indonesia-ssgi-2024/",
                       "06eae149a5f84888c1f0dab6ce8506a2dbf2e3ad93da3c2809f09e091e2a7c65"),
          "p0": ("kemiskinan-kabkota-2025", 2025, "https://www.bps.go.id/id/publication/2025/11/28/f7534097ff9c717e794cd6e1/data-dan-informasi-kemiskinan-kabupaten--kota-tahun-2025.html",
                 "a468dbaabdc9056d0f78054e04d6718bccf472f7a93e5de6a2850a2578c85511")}
SUMBER["wasting"] = SUMBER["stunting"]
SHA_SKRIP = hashlib.sha256(open(__file__, "rb").read()).hexdigest()[:12]

def placeholder_sah(k):
    ind = k["indikator"][0]["kode"]
    return {ind, "pembanding", "jarak", "tahun_data"}

def bangun_kartu(jenis, kode_bps, nama, nilai, keandalan, median, tanggal_akses="2026-11-13", alasan_keandalan="rse_dari_ci"):
    """alasan_keandalan: rse_dari_ci (RSE dihitung dari CI terbit) atau rse_tidak_terbit (label hati_hati karena
    galat sampel tidak diterbitkan, jalur cadangan G1.5; lihat uji/AMBANG_CATATAN.md)."""
    jk, ind, pop, medan, arah_buruk = JENIS[jenis]; sid, th, url, sha = SUMBER[jenis]
    jarak = round(nilai - median, 2)
    return {"id": f"{jk}.{kode_bps}", "versi": VERSI, "jenis_kebutuhan": jk, "medan": medan,
            "wilayah": {"kode_bps": kode_bps, "nama": nama, "tingkat": "kabkota"}, "populasi": pop,
            "indikator": [{"kode": ind, "nilai": nilai, "satuan": "persen", "tahun_data": th, "rse": None,
                           "keandalan": keandalan, "alasan_keandalan": alasan_keandalan, "metode": "langsung", "sumber_id": sid, "url": url, "sha256": sha,
                           "tanggal_akses": tanggal_akses}],
            "pembanding": {"jenis": "median_nasional", "nilai": median, "sumber_id": sid, "url": url,
                           "catatan": "nilai tengah seluruh kabupaten/kota di tabel terbit, termasuk yang belum terverifikasi publikasi kedua; bukan target resmi (target resmi dicari di ME2)"},
            "jarak": {"nilai": abs(jarak), "arah": "di_atas" if jarak > 0 else "di_bawah", "dihitung_oleh": f"mesin/kartu/kartu.py@{SHA_SKRIP}"},
            "teks": {"judul": "", "ringkasan": "", "harapan": ""}, "status": "draf"}

SATUAN_SESUDAH_PH = re.compile(r"(\{[a-z0-9_]+\})\s+(persen|poin|persentase poin)\b")

def normalisasi_satuan(k):
    """Placeholder sudah membawa satuan saat dirender ('25,5 persen', '3,3 poin'). Satuan yang ditulis penulis
    tepat sesudah placeholder dibuang supaya tidak ganda dan tidak terbaca sebagai kata kuantitas."""
    for b in ("judul", "ringkasan", "harapan"):
        k["teks"][b] = SATUAN_SESUDAH_PH.sub(r"\1", k["teks"].get(b) or "")
    return k

def periksa_teks(k):
    """Kembalikan daftar pelanggaran G1.4 dan aturan skema 3 untuk teks kartu. Kosong = lolos."""
    salah, sah = [], placeholder_sah(k)
    for bagian in ("judul", "ringkasan", "harapan"):
        t = k["teks"].get(bagian) or ""
        tanpa_ph = PLACEHOLDER.sub("", t)
        tanpa_ph = re.sub(r"(?i)\bpersentase\b", "", tanpa_ph)  # nama indikator, bukan besaran; daftar kontrak menangkapnya sebagai awalan "persen"
        if re.search(r"\d", tanpa_ph): salah.append(f"{bagian}: digit di luar placeholder")
        if KATA_KUANTITAS.search(tanpa_ph): salah.append(f"{bagian}: kata kuantitas '{KATA_KUANTITAS.search(tanpa_ph).group(0)}'")
        if KATA_TERLARANG.search(t): salah.append(f"{bagian}: kata terlarang '{KATA_TERLARANG.search(t).group(0)}'")
        for ph in PLACEHOLDER.findall(t):
            if ph not in sah: salah.append(f"{bagian}: placeholder asing {{{ph}}}")
        if re.search(r"\{[^}]*[A-Z\s][^}]*\}", t): salah.append(f"{bagian}: placeholder bentuk salah")
        if bagian in ("judul", "harapan") and PLACEHOLDER.search(t): salah.append(f"{bagian}: angka tidak boleh di {bagian}")
    if not k["teks"].get("harapan"): salah.append("harapan kosong (aturan Jalan Tengah: menyalakan)")
    return salah

def render(k):
    if periksa_teks(k): raise ValueError("teks belum lolos G1.4")
    ind = k["indikator"][0]
    if ind["keandalan"] == "ditekan": raise ValueError("indikator ditekan tidak dirender")
    f = lambda x: f"{x:.1f}".replace(".", ",")
    nilai = {ind["kode"]: f(ind["nilai"]) + " persen", "pembanding": f(k["pembanding"]["nilai"]) + " persen",
             "jarak": f(k["jarak"]["nilai"]) + " poin", "tahun_data": str(ind["tahun_data"])}
    return {b: PLACEHOLDER.sub(lambda m: nilai[m.group(1)], k["teks"][b]) for b in ("judul", "ringkasan", "harapan")}

def kartu_dari_ssgi(path):
    R = [r for r in csv.DictReader(open(path, encoding="utf-8")) if r["indikator"] in ("stunting", "wasting")]
    out = []
    for jenis in ("stunting", "wasting"):
        rs = [r for r in R if r["indikator"] == jenis and r["keandalan"] != "ditekan"]
        med = round(statistics.median(float(r["nilai"]) for r in rs), 2)
        for r in rs:
            nama = r["kabkota"] if r["kabkota"].startswith("Kota") else "Kab. " + r["kabkota"]
            out.append(bangun_kartu(jenis, r["kode_bps"], nama, float(r["nilai"]), r["keandalan"], med))
    return out

def sel_terverifikasi(sumber_id):
    """Kode kab/kota yang cocok dengan publikasi kedua (sumber/sel/<sumber>.csv); hanya ini yang boleh jadi kartu."""
    p = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "sumber", "sel", sumber_id + ".csv")
    return {r["kode_bps"] for r in csv.DictReader(open(p, encoding="utf-8"))}

def kartu_dari_dikk(path):
    R = [r for r in csv.DictReader(open(path, encoding="utf-8")) if r["tingkat"] == "kabkota"]
    sah = sel_terverifikasi("kemiskinan-kabkota-2025")
    med = round(statistics.median(float(r["p0"]) for r in R), 2)  # nilai tengah dari semua kab/kota; kartu hanya sel sah
    return [bangun_kartu("p0", r["kode_bps"], r["nama"] if r["nama"].startswith("Kota") else "Kab. " + r["nama"],
                         float(r["p0"]), "hati_hati", med, alasan_keandalan="rse_tidak_terbit") for r in R if r["kode_bps"] in sah]

if __name__ == "__main__":
    kart = kartu_dari_ssgi(sys.argv[1])
    if len(sys.argv) > 3: kart += kartu_dari_dikk(sys.argv[2])
    with open(sys.argv[-1], "w", encoding="utf-8") as f:
        for k in kart: f.write(json.dumps(k, ensure_ascii=False) + "\n")
    print("kartu draf:", len(kart), {j: sum(k["jenis_kebutuhan"] == JENIS[j][0] for k in kart) for j in JENIS})
