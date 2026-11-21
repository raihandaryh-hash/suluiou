#!/usr/bin/env python3
"""Isi teks kartu dari templat (tanpa model), uji tiap hasil dengan periksa_teks dan render.
Pakai: python3 isi_teks.py            -> hitung lulus per varian atas semua kartu, tulis contoh untuk dipilih
Tidak mengubah berkas kartu dan tidak mengubah status kartu."""
import json, glob, os, sys, collections, yaml
import kartu as K
TANDA = "\u27e6W\u27e7"
SINI = os.path.dirname(os.path.abspath(__file__))
T = yaml.safe_load(open(os.path.join(SINI, "templat_teks_v1.yaml"), encoding="utf-8"))
def isi(k, varian):
    t = T["jenis"][k["jenis_kebutuhan"]][varian]
    w = TANDA  # nama wilayah disisipkan sesudah pemeriksaan: nama seperti "Lima Puluh Kota" bukan kata kuantitas
    ind = k["indikator"][0]
    banding = T["bersama"]["banding"][k["pembanding"]["jenis"]][k["jarak"]["arah"]]
    ringkas = t["nilai"] + " " + banding + (" " + T["bersama"]["hati_hati"] if ind["keandalan"] == "hati_hati" else "")
    k2 = json.loads(json.dumps(k))
    k2["teks"] = {"judul": t["judul"].replace("{wilayah}", w), "ringkasan": ringkas.replace("{wilayah}", w), "harapan": t["harapan"].replace("{wilayah}", w)}
    return k2
if __name__ == "__main__":
    semua = [json.loads(l) for f in sorted(glob.glob(os.path.join(SINI, "keluaran", "*.jsonl"))) for l in open(f, encoding="utf-8") if l.strip()]
    contoh, gagal = {}, collections.Counter()
    lulus = collections.Counter()
    for k in semua:
        for v in ("A", "B"):
            k2 = isi(k, v)
            s = K.periksa_teks(k2)
            if s:
                gagal[(k["jenis_kebutuhan"], v, s[0])] += 1
                continue
            r = {b: x.replace(TANDA, k["wilayah"]["nama"]) for b, x in K.render(k2).items()}
            if any("{" in x or TANDA in x for x in r.values()):
                gagal[(k["jenis_kebutuhan"], v, "placeholder tersisa")] += 1
                continue
            lulus[v] += 1
            contoh.setdefault((k["jenis_kebutuhan"], k["jarak"]["arah"]), {})[v] = (k["id"], r)
    print(f"kartu {len(semua)}; lulus A {lulus['A']}, lulus B {lulus['B']}; gagal {sum(gagal.values())}")
    for g, n in gagal.most_common(8): print("  GAGAL", n, g)
    out = ["# Contoh teks kartu, dua varian (untuk dipilih Raihan)", "", f"SINTESIS. Dihasilkan `mesin/kartu/isi_teks.py` dari `templat_teks_v1.yaml`, tanpa model. {len(semua)} kartu; lulus pemeriksa teks: A {lulus['A']}, B {lulus['B']}.", ""]
    for (jenis, arah), d in sorted(contoh.items()):
        out.append(f"## {jenis} · {arah} · contoh {d['A'][0]}")
        for v in ("A", "B"):
            r = d[v][1]
            out += [f"**Varian {v}**", f"- Judul: {r['judul']}", f"- Ringkasan: {r['ringkasan']}", f"- Harapan: {r['harapan']}", ""]
    open(os.path.join(SINI, "..", "uji", "CONTOH_Teks-Kartu_Dua-Varian_15Nov2026.md"), "w", encoding="utf-8").write("\n".join(out))
    sys.exit(1 if gagal else 0)
