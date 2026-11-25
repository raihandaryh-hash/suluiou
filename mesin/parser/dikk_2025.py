"""Pengurai Tabel 2.1 "Data dan Informasi Kemiskinan Kabupaten/Kota Tahun 2025" (BPS, ISSN 2087-2216).
Masukan: PDF bersidik a468dbaabdc9056d0f78054e04d6718bccf472f7a93e5de6a2850a2578c85511 + _domain_all.json (daftar wilayah BPS).
Keluaran: CSV per kab/kota dan provinsi: jumlah miskin (ribu), P0, P1, P2, garis kemiskinan. Tidak memakai model.
Pakai: python dikk_2025.py PDF DOMAIN_JSON KELUARAN.csv
Ekstraksi memakai pdftotext -table -nodiag (xpdf 4.06) supaya tanda air diagonal dibuang."""
import csv, hashlib, json, os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(__file__))
from bps_webapi import kanon, ALIAS

SIDIK = "a468dbaabdc9056d0f78054e04d6718bccf472f7a93e5de6a2850a2578c85511"
NUM = r"(\d{1,3}(?:\.\d{3})*,\d+|\d{1,3}(?:\.\d{3})+)"
BARIS = re.compile(r"^\s*(\d{1,2})?\s+([A-Za-z][A-Za-z .'\-()]*?)\s{2,}" + r"\s+".join([NUM] * 5) + r"\s*$")
NAMA_SAJA = re.compile(r"^\s*(\d{1,2})?\s+([A-Za-z][A-Za-z .'\-()]*?)\s*$")

def angka(s): return float(s.replace(".", "").replace(",", "."))

ALIAS_DIKK = {"kepulauansitaro": "siautagulandangbiaro", "kepulauantanimbar": "malukutenggarabarat",
              "pangkep": "pangkajenedankepulauan"}

def cari(peta, nama):
    """Cocokkan nama ke kode: persis, alias, awalan 'kota', lalu awalan unik (nama terpotong di tabel, mis. 'Pangkajene Dan Kepu-')."""
    kn = kanon(nama.rstrip("-"))
    kn = ALIAS_DIKK.get(kn, ALIAS.get(kn, kn))
    if kn in peta: return peta[kn], "nama"
    if "kota" + kn in peta: return peta["kota" + kn], "nama_tanpa_kota"
    awal = [v for k, v in peta.items() if k.startswith(kn) and not k.startswith("kota")]
    if len(awal) == 1: return awal[0], "awalan_unik"
    return None, ""

pdf, dom, out = sys.argv[1:4]
sha = hashlib.sha256(open(pdf, "rb").read()).hexdigest()
if sha != SIDIK: sys.exit(f"TOLAK: sidik {sha[:12]} bukan {SIDIK[:12]}")
D = json.load(open(dom, encoding="utf-8"))["data"][1]
prov_kode = {kanon(d["domain_name"]): d["domain_id"][:2] for d in D if d["domain_id"].endswith("00") and d["domain_id"] != "0000"}
prov_kode.update({kanon("Bangka Belitung"): "19", kanon("Papua Barat Daya"): "96", kanon("Papua Selatan"): "93",
                  kanon("Papua Tengah"): "94b", kanon("Papua Pegunungan"): "95"})
wil = {}
for d in D:
    k = d["domain_id"]
    if not k.endswith("00"): wil.setdefault(k[:2], {})[kanon(("kota " if int(k[2:]) >= 71 else "") + d["domain_name"])] = k

baris, tunda, tolak, mulai = [], [], [], False
for h in range(20, 60):
    t = subprocess.run(["pdftotext", "-f", str(h), "-l", str(h), "-table", "-nodiag", pdf, "-"], capture_output=True).stdout.decode("utf-8", "replace")
    if not re.search(r"Tabel\s+2\.1", t) or "DAFTAR TABEL" in t: continue
    sisa_nama = None
    for b in t.splitlines():
        m = BARIS.match(b)
        if not m:
            n = NAMA_SAJA.match(b)
            if n and n.group(1) and not re.search(r"\d,\d", b): sisa_nama = (n.group(1), n.group(2).strip())
            elif (n and not n.group(1) and tunda and len(n.group(2).split()) <= 3
                  and kanon(n.group(2)) not in prov_kode and not re.search(r"kabupaten|kota/|tabel|miskin|kemiskinan|jumlah|persentase|garis|penduduk|bulan|rp/|^no$|^p[12]$", n.group(2), re.I)):
                tunda[-1]["nama"] = (tunda[-1]["nama"].rstrip("-") + ("" if tunda[-1]["nama"].endswith("-") else " ") + n.group(2).strip())
                tunda[-1]["sambungan"] = n.group(2).strip()
            continue
        no, nama, *v = m.groups()
        nama = nama.strip()
        if sisa_nama and not no: no, nama = sisa_nama[0], sisa_nama[1] + " " + nama
        sisa_nama = None
        r = dict(no=no or "", nama=nama, jumlah_ribu=angka(v[0]), p0=angka(v[1]), p1=angka(v[2]), p2=angka(v[3]), gk=angka(v[4]), halaman=h, baris_asli=b.strip())
        if no: tunda.append(r); continue
        kp = prov_kode.get(kanon(nama))
        if not kp: tolak.append((h, nama, "baris tanpa nomor bukan nama provinsi")); continue
        for x in tunda:
            p2 = kp[:2]
            kode, cara = cari(wil.get(p2, {}), x["nama"])
            if not kode:  # provinsi pemekaran Papua: cari di kode lama 91/94
                for alt in ("91", "94"):
                    kode, cara = cari(wil.get(alt, {}), x["nama"])
                    if kode: break
            x.update(provinsi=nama, kode_bps=kode or "", cara_petakan=cara, tingkat="kabkota")
            if not kode: tolak.append((x["halaman"], x["nama"], "kab/kota tak terpetakan"))
            baris.append(x)
        r.update(provinsi=nama, kode_bps=kp[:2] + "00", cara_petakan="provinsi", tingkat="provinsi"); baris.append(r); tunda = []
if tunda: tolak += [(x["halaman"], x["nama"], "tanpa baris provinsi penutup") for x in tunda]
with open(out, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, extrasaction="ignore", fieldnames=["kode_bps", "cara_petakan", "tingkat", "provinsi", "no", "nama", "jumlah_ribu", "p0", "p1", "p2", "gk", "halaman", "baris_asli"])
    w.writeheader(); w.writerows(baris)
kab = [x for x in baris if x["tingkat"] == "kabkota"]
print(f"sidik {sha[:12]} | provinsi {sum(x['tingkat']=='provinsi' for x in baris)} | kab/kota {len(kab)} | berkode {sum(bool(x['kode_bps']) for x in kab)} | tertolak {len(tolak)}")
for t in tolak[:30]: print("  tolak:", t)
