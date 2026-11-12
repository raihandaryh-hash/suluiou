"""Pilih satu variabel per provinsi per indikator dari L3 BPS, dengan aturan tetap, lalu tulis registri pilihan.
Aturan (SINTESIS, bisa diaudit): judul wajib cocok pola indikator dan tidak memuat kata tolak; turvar harus tunggal
('Tidak ada' atau satu nilai); dipilih tahun terbaru dengan cakupan kab/kota terbanyak.
Pakai: python bps_pilih.py ..\\mentah\\bps\\_l3_bps.csv ..\\mentah\\bps\\_pilihan.csv"""
import csv, collections, re, sys

POLA = {
    "p0": (r"persentase penduduk miskin", r"ekstrem|usia|tahun ke atas|garis|jumlah|klasifikasi|rumah tangga|desa/kota"),
    "tpt": (r"pengangguran terbuka|\btpt\b", r"tpak|partisipasi|pendidikan|umur|jenis kelamin|daerah|setengah"),
}
rows = list(csv.DictReader(open(sys.argv[1], encoding="utf-8")))
kel = collections.defaultdict(list)
for r in rows:
    if r["tingkat"] != "kabkota": continue
    j = r["judul"].lower()
    for ind, (wajib, tolak) in POLA.items():
        if re.search(wajib, j) and not re.search(tolak, j):
            kel[(r["kode_bps"][:2], ind, r["var_id"], r["tahun"])].append(r)
pilih = {}
for (prov, ind, vid, th), rs in kel.items():
    turvar = {r["turvar"] for r in rs}
    if len(turvar) > 1: continue
    kab = {r["kode_bps"] for r in rs}
    skor = (int(th) if th.isdigit() else 0, len(kab))
    if (prov, ind) not in pilih or skor > pilih[(prov, ind)][0]:
        pilih[(prov, ind)] = (skor, vid, th, rs[0]["judul"], len(kab), rs[0]["berkas"], rs[0]["sha256_berkas"], rs[0]["catatan_sumber"][:80])
with open(sys.argv[2], "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(["prov2", "indikator", "var_id", "tahun", "judul", "n_kabkota", "berkas", "sha256", "catatan_sumber"])
    for k in sorted(pilih): s = pilih[k]; w.writerow([k[0], k[1], s[1], s[2], s[3], s[4], s[5], s[6], s[7]])
for ind in POLA:
    ps = sorted(k[0] for k in pilih if k[1] == ind)
    print(ind, "provinsi:", len(ps), "kab/kota:", sum(pilih[(p, ind)][4] for p in ps),
          "tahun:", dict(collections.Counter(pilih[(p, ind)][2] for p in ps)))
    print("   ", " ".join(f"{p}:{pilih[(p, ind)][1]}/{pilih[(p, ind)][2]}/{pilih[(p, ind)][4]}" for p in ps))
