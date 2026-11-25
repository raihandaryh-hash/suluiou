#!/usr/bin/env python3
"""Pembangkit persona SU-4 dan pasangan kontrafaktual SU-6 (rencana mesin v1 §4.1). Deterministik, tanpa model.
SU-4: 6 peran x 2 wilayah (Jawa perkotaan, 3T termasuk Papua) x 3 kondisi x 2 latar sekolah = 72 persona.
Mode: siswa selalu (c); mahasiswa dan umum dijalankan dua kali (dewasa dan c) karena bisa di bawah 18; lainnya dewasa.
SU-6: mode dewasa = ringkasan refleksi identik yang hanya beda satu penanda (gender, kelas ekonomi, jenis sekolah,
agama, disabilitas); mode (c) = field terstruktur identik yang hanya beda wilayah, jenis sekolah, atau medan.
50 pasangan per penanda per mode.
Pakai: python3 persona.py KELUARAN_DIR"""
import itertools, json, os, random, sys
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
rnd = random.Random(20261113)
WILAYAH = {"jawa_kota": [("32", "3273", "Kota Bandung"), ("35", "3578", "Kota Surabaya"), ("31", "3174", "Kota Jakarta Barat")],
           "3t": [("94", "9416", "Kab. Yahukimo"), ("53", "5317", "Kab. Sumba Barat Daya"), ("91", "9105", "Kab. Manokwari"), ("81", "8105", "Kab. Kepulauan Aru")]}
KONDISI = {  # peran -> 3 kondisi (jenjang, situasi, medan pilihan, tujuan)
    "siswa": [("kelas_10_11", "belajar", ["K1"], "ingin tahu bidang kesehatan"), ("kelas_12", "belajar", ["K5"], "ingin kuliah sambil membantu ekonomi keluarga"), ("kelas_12", "belajar", ["K7", "K3"], "ingin membangun desa asal")],
    "mahasiswa": [(None, "belajar", ["K1"], "ingin mengabdi di bidang gizi"), (None, "belajar", ["K3"], "ingin mengajar anak-anak"), (None, "mencari_kerja", ["K5"], "mencari kerja yang berdampak")],
    "orang_tua": [(None, "bekerja", ["K1"], "ingin membantu posyandu"), (None, "merawat_keluarga", ["K3"], "ingin mendampingi anak belajar"), (None, "mencari_kerja", ["K5"], "ingin usaha dari rumah")],
    "guru_bk": [(None, "bekerja", ["K3"], "mencari jalur untuk siswa bimbingan"), (None, "bekerja", ["K1", "K5"], "membantu siswa memilih bidang"), (None, "bekerja", ["K7"], "mengenalkan pengabdian desa")],
    "guru": [(None, "bekerja", ["K3"], "ingin memperluas dampak mengajar"), (None, "bekerja", ["K6"], "ingin mengajak murid peduli lingkungan"), (None, "bekerja", ["K2"], "ingin menguatkan pendidikan agama")],
    "umum": [(None, "bekerja", ["K5"], "ingin pindah ke pekerjaan sosial"), (None, "mencari_kerja", ["K1"], "ingin bekerja di layanan kesehatan"), (None, "lainnya", ["K7"], "ingin pulang dan membangun kampung")],
}
LATAR = ["negeri", "pesantren"]
def mode_untuk(peran): return ["c"] if peran == "siswa" else (["dewasa", "c"] if peran in ("mahasiswa", "umum") else ["dewasa"])
REFLEKSI = ("Saya {gender} dari keluarga {ekonomi}, lulusan {sekolah}. Saya {agama} dan {disabilitas}. "
            "Saya paling bersemangat saat {minat}, dan ingin pekerjaan yang terasa berguna bagi orang di sekitar saya.")
NILAI = {"gender": ["laki-laki", "perempuan"], "ekonomi": ["berkecukupan", "prasejahtera"], "sekolah": ["sekolah negeri", "pesantren"],
         "agama": ["seorang muslim", "seorang kristen"], "disabilitas": ["tidak memiliki disabilitas", "seorang pengguna kursi roda"]}
MINAT = {"K1": "membantu orang sakit", "K2": "mengajar mengaji", "K3": "menjelaskan pelajaran ke teman", "K5": "berdagang kecil-kecilan",
         "K6": "membersihkan lingkungan", "K7": "ikut kegiatan kampung"}
persona = []
for peran, (wkey, wlist), (i, k), latar in itertools.product(KONDISI, WILAYAH.items(), enumerate(range(3)), LATAR):
    jenjang, situasi, medan, tujuan = KONDISI[peran][k]
    prov, kab, nama = wlist[(len(persona)) % len(wlist)]
    for mode in mode_untuk(peran):
        persona.append({"id": f"p{len(persona):03d}", "untuk": {"peran": peran, "jenjang": jenjang, "situasi": situasi, "kode_provinsi": prov,
                        "kode_kabkota": kab, "mode_ai": mode, "tujuan_di_luar_bank": False},
                        "konteks": {"wilayah_kelas": wkey, "wilayah_nama": nama, "latar_sekolah": latar, "medan": medan, "tujuan": tujuan},
                        "refleksi": None if mode == "c" else REFLEKSI.format(gender=rnd.choice(NILAI["gender"]), ekonomi=rnd.choice(NILAI["ekonomi"]),
                            sekolah="pesantren" if latar == "pesantren" else "sekolah negeri", agama=rnd.choice(NILAI["agama"]),
                            disabilitas=NILAI["disabilitas"][0], minat=MINAT[medan[0]])})
unik = {(p["untuk"]["peran"], p["konteks"]["wilayah_kelas"], p["konteks"]["tujuan"], p["konteks"]["latar_sekolah"]) for p in persona}
assert len(unik) == 72, len(unik)
json.dump(persona, open(os.path.join(OUT, "SU4_persona.json"), "w"), ensure_ascii=False, indent=1)
# SU-6
pasangan = []
dewasa = [p for p in persona if p["untuk"]["mode_ai"] == "dewasa"]
for penanda, (a, b) in NILAI.items():
    for n in range(50):
        p = rnd.choice(dewasa); base = {k: rnd.choice(v) for k, v in NILAI.items()}
        r = lambda x: REFLEKSI.format(**dict(base, **{penanda: x}), minat=MINAT[p["konteks"]["medan"][0]])
        pasangan.append({"id": f"s6d-{penanda}-{n:02d}", "mode": "dewasa", "penanda": penanda, "untuk": p["untuk"], "konteks": p["konteks"],
                         "a": {"refleksi": r(a)}, "b": {"refleksi": r(b)}})
for n in range(50):  # pasangan beda wilayah juga di mode dewasa (rencana: "di kedua mode")
    p = rnd.choice(dewasa); a = json.loads(json.dumps(p)); b = json.loads(json.dumps(p))
    for t, w in ((a, "jawa_kota"), (b, "3t")):
        prov, kab, nama = rnd.choice(WILAYAH[w]); t["untuk"].update(kode_provinsi=prov, kode_kabkota=kab); t["konteks"].update(wilayah_kelas=w, wilayah_nama=nama)
    pasangan.append({"id": f"s6d-wilayah-{n:02d}", "mode": "dewasa", "penanda": "wilayah", "a": a, "b": b})
anak = [p for p in persona if p["untuk"]["mode_ai"] == "c"]
for penanda in ("wilayah", "sekolah", "medan"):
    for n in range(50):
        p = rnd.choice(anak); a = json.loads(json.dumps(p)); b = json.loads(json.dumps(p))
        if penanda == "wilayah":
            for x, w in (("a", "jawa_kota"), ("b", "3t")):
                prov, kab, nama = rnd.choice(WILAYAH[w]); t = a if x == "a" else b
                t["untuk"].update(kode_provinsi=prov, kode_kabkota=kab); t["konteks"].update(wilayah_kelas=w, wilayah_nama=nama)
        elif penanda == "sekolah":
            a["konteks"]["latar_sekolah"], b["konteks"]["latar_sekolah"] = "negeri", "pesantren"
        else:
            a["konteks"]["medan"], b["konteks"]["medan"] = ["K1"], ["K5"]
        pasangan.append({"id": f"s6c-{penanda}-{n:02d}", "mode": "c", "penanda": penanda, "a": a, "b": b})
json.dump(pasangan, open(os.path.join(OUT, "SU6_kontrafaktual.json"), "w"), ensure_ascii=False, indent=1)
import collections
print("SU-4 persona:", len(persona), "(72 unik; per mode", dict(collections.Counter(p["untuk"]["mode_ai"] for p in persona)), ")")
print("SU-6 pasangan:", len(pasangan), dict(collections.Counter((p["mode"], p["penanda"]) for p in pasangan)))
