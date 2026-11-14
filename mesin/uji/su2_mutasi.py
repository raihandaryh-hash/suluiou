#!/usr/bin/env python3
"""SU-2 separuh terbuka: mutasi skrip per mode atas teks yang sudah diputus BENAR (aturan: uji/SU2_ATURAN.md).
Satu teks bergalat = satu mode. Deterministik (benih tetap). Tidak memakai model.
Pakai: python3 su2_mutasi.py KARTU_SAMPEL.jsonl TEKS_BENAR.jsonl KELUARAN.jsonl [per_mode=50]"""
import json, random, re, sys
kartu = {k["id"]: k for k in map(json.loads, open(sys.argv[1], encoding="utf-8"))}
benar = [json.loads(l) for l in open(sys.argv[2], encoding="utf-8")]
N = int(sys.argv[4]) if len(sys.argv) > 4 else 50
rnd = random.Random(20261113)
nama_lain = sorted({k["wilayah"]["nama"] for k in kartu.values()})
SEBAB = ["karena pola asuh yang belum tepat", "akibat layanan kesehatan yang lemah", "sebab perhatian pemerintah daerah masih kurang",
         "karena banyak warga yang tidak peduli", "sehingga masa depan generasi berikutnya terancam", "akibat rendahnya pendidikan orang tua"]
VONIS = ["Darurat", "Gagal", "Memalukan", "Krisis", "Terpuruk", "Parah"]
KUANT = ["hampir seperempat", "sepertiga", "satu dari lima", "mayoritas", "hampir separuh", "sebagian besar", "dua kali lipat"]
POP = {"balita": ["anak-anak", "anak", "generasi muda", "keluarga"], "penduduk": ["keluarga", "anak-anak", "rumah tangga", "pemuda"]}
def m_wilayah(t, k):
    n = k["wilayah"]["nama"]
    alt = ("Kota " + n[5:]) if n.startswith("Kab. ") and ("Kota " + n[5:]) in nama_lain else rnd.choice([x for x in nama_lain if x != n])
    t = dict(t)
    for b in ("judul", "ringkasan"):
        if n in t[b]: t[b] = t[b].replace(n, alt, 1); return t
    t["ringkasan"] = f"Di {alt}, " + t["ringkasan"][0].lower() + t["ringkasan"][1:]; return t
def m_populasi(t, k):
    p = k["populasi"]; t = dict(t)
    for b in ("ringkasan", "judul", "harapan"):
        if re.search(rf"\b{p}\b", t[b]): t[b] = re.sub(rf"\b{p}\b", rnd.choice(POP[p]), t[b], count=1); return t
    return None
def m_sebab(t, k):
    t = dict(t); s = t["ringkasan"].rstrip(".")
    t["ringkasan"] = s + ", " + rnd.choice(SEBAB) + "."; return t
def m_vonis(t, k):
    t = dict(t); v = rnd.choice(VONIS)
    t["judul"] = f"{v}: " + t["judul"][0].lower() + t["judul"][1:] if rnd.random() < 0.5 else t["judul"].rstrip(".") + f", sebuah kondisi yang {v.lower()}."
    return t
def m_placeholder(t, k):
    ind = k["indikator"][0]["kode"]; t = dict(t); r = t["ringkasan"]
    if "{" + ind + "}" in r and "{pembanding}" in r:
        t["ringkasan"] = r.replace("{" + ind + "}", "\0").replace("{pembanding}", "{" + ind + "}").replace("\0", "{pembanding}"); return t
    if "{" + ind + "}" in r: t["ringkasan"] = r.replace("{" + ind + "}", "{jarak}", 1); return t
    return None
def m_kuantitas(t, k):
    ind = k["indikator"][0]["kode"]; t = dict(t); r = t["ringkasan"]
    if "{" + ind + "}" not in r: return None
    t["ringkasan"] = r.replace("{" + ind + "}", rnd.choice(KUANT), 1); return t
MODE = {"wilayah": m_wilayah, "populasi": m_populasi, "sebab": m_sebab, "vonis": m_vonis, "placeholder": m_placeholder, "kuantitas": m_kuantitas}
out = []
for mode, f in MODE.items():
    urut = benar[:]; rnd.shuffle(urut); n = 0
    for t in urut:
        if n >= N: break
        m = f(t, kartu[t["id"]])
        if m and m != t:
            out.append(dict(m, mode=mode, label="bergalat", asal="mutasi_skrip")); n += 1
    print(mode, n)
with open(sys.argv[3], "w", encoding="utf-8") as o:
    for x in out: o.write(json.dumps(x, ensure_ascii=False) + "\n")
print("total", len(out))
