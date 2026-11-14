"""Manifest gudang mentah (syarat bawaan ME1 S6): nama, URL bila tercatat, sidik penuh, ukuran, waktu ubah berkas, versi alat.
URL diisi bila tercatat mekanis: daftar kandidat uji 109, unduhan uji 107, dan berkas BPS WebAPI (URL tabel tanpa kunci, dibentuk dari
domain dan var di nama berkas, sama dengan cara kontrak menulis URL). Selain itu kolom asal_tercatat berisi pola yang terbaca dari nama
berkas, atau "tidak tercatat". Waktu ubah berkas dipakai sebagai pengganti tanggal unduh dan diberi label begitu.
Kolom jenis_url: pola_tabel = URL tabel WebAPI tanpa kunci dan tanpa tahun, dibentuk dari nama berkas (bukan URL unduhan persis; banyak berkas berbagi satu URL); kandidat_unduh = URL yang dipakai mengunduh berkas itu; halaman_pendarat = halaman sumber, bukan berkasnya. Tidak membaca folder kunci. Pakai: python manifest_mentah.py  -> MESIN/MANIFEST_mentah.csv"""
import csv, datetime, hashlib, json, os, re
M = r"C:\Users\p\Documents\IOU\Foresight\Sulu Build\Audit-Nov2026\MESIN"
RAW = os.path.join(M, "mentah")
VERSI = hashlib.sha256(open(__file__, "rb").read()).hexdigest()[:12]
URL = {}
k109 = os.path.join(M, "peran", "v2", "kand_109.json")
if os.path.exists(k109):
    sk = {"kemiskinan-kabkota": "mis", "penduduk-tanpa-jaminan-kesehatan": "jkn", "stunting-balita": "stu"}
    for keb, us in json.load(open(k109, encoding="utf-8")).items():
        for i, u in enumerate(us): URL[f"holdout109/h109-{sk[keb]}-{i:02d}.pdf"] = u
U107 = {"kepsekda-dki-75-2023": "https://jdih.jakarta.go.id/dokumenPeraturanDirectory/0031/2023PERDA0031075.pdf",
        "perbup-bone-3-2023": "https://peraturan.bpk.go.id/Download/401285/PERATURAN%20BUPATI%20NO.%203%20TAHUN%202023%20TENTANG%20PENYELENGGARAAN%20PESERTA%20PROGRAM%20JAMINAN%20KESEHATAN%20NASIONAL%20UNTUK%20MENCAPAI%20UNIVERSAL%20HEALTH%20COVERAGE%20DI%20KABUPATEN%20BONE.pdf"}
for k, u in U107.items(): URL[f"holdout/{k}.pdf"] = u
URL["bps-pub/DIKK-2025.pdf"] = "https://www.bps.go.id/id/publication/2025/11/28/f7534097ff9c717e794cd6e1/data-dan-informasi-kemiskinan-kabupaten--kota-tahun-2025.html"  # berkas_url kontrak kemiskinan-kabkota-2025
URL["ssgi-2024/SSGI-2024-Dalam-Angka.pdf"] = "https://www.badankebijakan.kemkes.go.id/survei-status-gizi-indonesia-ssgi-2024/"  # berkas_url kontrak ssgi-2024
WEBAPI = re.compile(r"^(?:bps|bps_kab|bps_prov_jkn|prov)/(\d{4})_([A-Za-z0-9-]+)_(\d+)_(\d{4})\.json$")
POLA = [(WEBAPI, "BPS WebAPI domain {0} var {2} tahun {3}"),
        (re.compile(r"^bps/(_.*|manifest\.csv|panen\.log)$"), "log atau tabel antara panen BPS"),
        (re.compile(r"^sid/"), "Indeks Desa 2025; rincian unduhan di sid/manifest_2025.csv dan sid/manifest_kab_2025.csv")]
baris = []
for r, ds, fs in os.walk(RAW):
    ds.sort()
    for f in sorted(fs):
        p = os.path.join(r, f); rel = os.path.relpath(p, RAW).replace(os.sep, "/")
        h = hashlib.sha256(open(p, "rb").read()).hexdigest(); st = os.stat(p)
        asal = "tidak tercatat"
        for pola, fmt in POLA:
            m = pola.match(rel)
            if m: asal = fmt.format(*m.groups()); break
        wm = WEBAPI.match(rel)
        if wm and rel not in URL: URL[rel] = f"https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/{wm.group(1)}/var/{wm.group(3)}"
        u = URL.get(rel, ""); jenis = "" if not u else ("pola_tabel" if wm else ("halaman_pendarat" if rel.startswith(("bps-pub/", "ssgi-2024/")) else "kandidat_unduh"))
        baris.append([rel, u, jenis, asal, h, st.st_size,
                      datetime.datetime.fromtimestamp(st.st_mtime).strftime("%Y-%m-%d %H:%M"), VERSI])
out = os.path.join(M, "MANIFEST_mentah.csv")
with open(out, "w", encoding="utf-8", newline="") as fo:
    w = csv.writer(fo, lineterminator="\n")
    w.writerow(["berkas", "url_tercatat", "jenis_url", "asal_tercatat", "sha256", "bita", "waktu_ubah_berkas", "versi_alat"]); w.writerows(baris)
print(len(baris), "berkas;", sum(1 for b in baris if b[1]), "ber-URL;", sum(1 for b in baris if b[3] != "tidak tercatat"), "berpola; versi", VERSI)
print("tanpa asal:", [b[0] for b in baris if b[3] == "tidak tercatat" and not b[1]][:3])
print(hashlib.sha256(open(out, "rb").read()).hexdigest())
