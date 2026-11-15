#!/usr/bin/env python3
"""Uji gerbang B dan lapis 1 gerbang C untuk S3, termasuk uji negatif (pemeriksa harus menolak yang cacat)."""
import copy, json, penjelajah as P
n = ok = 0
for prov in sorted(P.LAPIS):
    pil = P.pilihan_gejala(prov)
    assert pil and all(x["label"] for x in pil), prov
    for x in pil:
        o = P.jelajah(prov, x["jenis_kebutuhan"]); n += 1
        s = P.periksa(o)
        assert not s, (prov, x["jenis_kebutuhan"], s)
        assert o["status"] == "ok" and len(o["dugaan"]) == 3; ok += 1
assert P.jelajah("00", "stunting-balita")["status"] == "tanpa_bahan" and not P.periksa(P.jelajah("00", "stunting-balita"))
assert P.jelajah("32", "tidak-ada")["status"] == "tanpa_bahan"
b = P.jelajah("32", "stunting-balita")
def rusak(f):
    o = copy.deepcopy(b); f(o); return P.periksa(o)
neg = {
 "tanpa tanda": lambda o: o["dugaan"][0].pop("tanda"),
 "tanpa cara cek": lambda o: o["dugaan"][0].pop("cara_cek"),
 "tanpa dasar": lambda o: o["dugaan"][1].update(dasar_kartu=[]),
 "pernyataan sebab": lambda o: o["dugaan"][0].update(teks="Stunting di sini terjadi karena orang tua lalai."),
 "vonis": lambda o: o["dugaan"][0].update(teks="Apakah kamu harus menjadi ahli gizi?"),
 "vonis cocok": lambda o: o["dugaan"][0].update(teks="Bukankah pekerjaan yang tepat untukmu adalah bidan?"),
 "angka": lambda o: o["dugaan"][2].update(teks="Apakah 30 persen balita belum ditimbang?"),
 "dua dugaan": lambda o: o["dugaan"].pop(),
 "bukan_jawaban hilang": lambda o: o.pop("pernyataan"),
 "dugaan saat ditahan": lambda o: o.update(status="ditahan_rujukan"),
}
for nama, f in neg.items():
    assert rusak(f), f"pemeriksa meloloskan cacat: {nama}"
print(f"LULUS gerbang B dan lapis 1 gerbang C: {ok} dari {n} keluaran sah di {len(P.LAPIS)} provinsi; {len(neg)} dari {len(neg)} cacat buatan ditolak")
