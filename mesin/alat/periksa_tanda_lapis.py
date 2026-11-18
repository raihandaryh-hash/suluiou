#!/usr/bin/env python3
"""Pemeriksa tanda lapis untuk gerbang O (manifest 2b A10).

Pakai: python3 -I periksa_tanda_lapis.py <teks_tampil.json> [--daftar <daftar_lapis.json>]

<teks_tampil.json>: daftar butir {"id", "teks", "lapis", "tanda", ...medan} yang tampil di layar,
disusun oleh build (satu butir per teks yang tampil). Daftar lapis dibaca dari satu berkas data
(bawaan: mesin/sambung/keluaran/lapis/daftar_lapis.json), tidak ditulis di kode ini.

Gerbang O lulus bila 100% butir lulus. Keluar 0 bila lulus, 1 bila tidak.
"""
import json, os, re, sys

BAWAAN = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                      "sambung", "keluaran", "lapis", "daftar_lapis.json")


def kosong(v):
    return v is None or (isinstance(v, (str, list, dict)) and len(v) == 0)


def periksa(butir, daftar):
    lapis = {l["kode"]: l for l in daftar["lapis"]}
    hasil = []
    for b in butir:
        salah = []
        l = lapis.get(b.get("lapis"))
        if kosong(b.get("teks")):
            salah.append("teks kosong")
        if l is None:
            salah.append(f"lapis tidak dikenal: {b.get('lapis')!r}")
        elif l["tanda"] == "BELUM DITETAPKAN":
            salah.append(f"tanda lapis {l['kode']} belum ditetapkan; butir ini tidak bisa lulus")
        else:
            t = b.get("tanda") or ""
            if t.strip() == "BELUM DITETAPKAN" or not re.search(l["pola_tanda"], t):
                salah.append(f"tanda tidak sesuai {l['kode']}: {t!r}")
            for m in l["medan_wajib"]:
                if kosong(b.get(m)):
                    salah.append(f"medan wajib kosong: {m}")
            if l["kode"] == "L2" and not salah:
                n = b["n_sumber"]
                satu = l.get("tanda_satu_sumber", "").split(" · ")[1] if l.get("tanda_satu_sumber") else "satu sumber"
                if n == 1 and satu not in t:
                    salah.append(f"L2 satu sumber harus bertanda '{satu}'")
                if isinstance(n, int) and n > 1 and f"· {n} sumber ·" not in t:
                    salah.append("jumlah sumber di tanda tidak sama dengan n_sumber")
                tautan = b["tautan"] if isinstance(b["tautan"], list) else [b["tautan"]]
                if isinstance(n, int) and len(tautan) < n:
                    salah.append("tautan asli lebih sedikit dari n_sumber")
            if l["kode"] == "L1" and not salah and str(b["tahun"]) not in t:
                salah.append("tahun di tanda tidak sama dengan medan tahun")
            if l["kode"] == "L4" and not salah:
                dipakai = b["lapis_dipakai"] if isinstance(b["lapis_dipakai"], list) else [b["lapis_dipakai"]]
                asing = [x for x in dipakai if x not in lapis]
                if asing:
                    salah.append(f"lapis_dipakai tidak dikenal: {asing}")
        hasil.append({"id": b.get("id"), "lapis": b.get("lapis"), "lulus": not salah, "salah": salah,
                      "peringatan": []})
    return hasil


def main():
    a = sys.argv[1:]
    daftar_p = BAWAAN
    if "--daftar" in a:
        i = a.index("--daftar"); daftar_p = a[i + 1]; del a[i:i + 2]
    daftar = json.load(open(daftar_p, encoding="utf-8"))
    butir = json.load(open(a[0], encoding="utf-8"))
    hasil = periksa(butir, daftar)
    lulus = sum(h["lulus"] for h in hasil)
    for h in hasil:
        if not h["lulus"] or h["peringatan"]:
            print(("GAGAL " if not h["lulus"] else "CATAT ") + f"{h['id']} [{h['lapis']}]: " + "; ".join(h["salah"] + h["peringatan"]))
    pct = 100.0 * lulus / len(hasil) if hasil else 0.0
    print(f"gerbang O: {lulus}/{len(hasil)} butir bertanda benar ({pct:.1f}%) · {'LULUS' if hasil and lulus == len(hasil) else 'GAGAL'}")
    sys.exit(0 if hasil and lulus == len(hasil) else 1)


if __name__ == "__main__":
    main()
