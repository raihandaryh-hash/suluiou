#!/usr/bin/env python3
"""S3 penjelajah lokal, lapis tanpa AI (penjelajah/1).
- pilihan_gejala(prov): pilihan terstruktur dari kartu provinsi (untuk pengguna di bawah 18: teks bebas tidak dipakai).
- jelajah(prov, jenis_kebutuhan): 3 dugaan berbentuk pertanyaan + cara cek, berdasar kartu yang ada.
- periksa(o): gerbang B (tiap dugaan bertanda 'perlu_kamu_cek', punya cara cek, punya dasar kartu) dan
  lapis 1 gerbang C (tanpa vonis, tanpa angka, tanpa kata kuantitas). Keluaran AI kelak wajib lolos periksa() yang sama.
Lapis distress dan pemanggilan model bukan di sini: itu di sisi aplikasi (lajur Chief Sulu)."""
import json, os, re, sys, yaml
SINI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(SINI, "..", "kartu")); sys.path.insert(0, os.path.join(SINI, "..", "jalur"))
import kartu as PK
_r = open(os.path.join(SINI, "..", "jalur", "rangkai.py"), encoding="utf-8").read()
VONIS = re.compile("".join(re.findall(r'r"([^"\n]+)"', _r[_r.index("VONIS = re.compile"):_r.index("PENGECUALIAN_VONIS")])))
VONIS_TAMBAHAN = re.compile(r"(?i)\b(kamu cocok|cocok untukmu|paling tepat untukmu|jurusan yang tepat|pekerjaan yang tepat|sebaiknya kamu menjadi|kamu berbakat)\b")
BANK = yaml.safe_load(open(os.path.join(SINI, "bank_dugaan_v1.yaml"), encoding="utf-8"))
LAPIS = json.load(open(os.path.join(SINI, "keluaran", "lapis_provinsi.json"), encoding="utf-8"))["provinsi"]
JENIS_CEK = ("tanya_orang", "lihat_langsung", "baca_dokumen")

def pilihan_gejala(prov):
    p = LAPIS.get(prov)
    if not p: return []
    return [{"jenis_kebutuhan": j, "label": (v["provinsi"] or (v["kabkota_jarak_terbesar"] or [None])[0] or {}).get("teks", {}).get("judul")}
            for j, v in sorted(p["kebutuhan"].items()) if j in BANK and (v["provinsi"] or v["kabkota_jarak_terbesar"])]

def jelajah(prov, jenis, gejala_sumber="pilihan_terstruktur"):
    p = LAPIS.get(prov)
    v = p["kebutuhan"].get(jenis) if p else None
    dasar = [b["kartu_id"] for b in ([v["provinsi"]] if v and v["provinsi"] else []) + (v["kabkota_jarak_terbesar"] if v else [])]
    o = {"skema": "penjelajah/1", "status": "ok", "masukan": {"kode_provinsi": prov, "jenis_kebutuhan": jenis, "gejala_sumber": gejala_sumber},
         "pernyataan": {"bukan_jawaban": True}, "dugaan": []}
    if not dasar or jenis not in BANK:
        o["status"] = "tanpa_bahan"; return o
    for d in BANK[jenis]:
        o["dugaan"].append({"id": d["id"], "teks": d["teks"], "tanda": "perlu_kamu_cek", "dasar_kartu": dasar[:1],
                            "cara_cek": {"jenis": d["cek"]["jenis"], "teks": d["cek"]["teks"], "paling_lama_hari": d["cek"]["hari"]}})
    return o

def periksa(o):
    s = []
    if o.get("skema") != "penjelajah/1": s.append("skema")
    if o.get("pernyataan") != {"bukan_jawaban": True}: s.append("pernyataan bukan_jawaban hilang")
    if o.get("status") not in ("ok", "tanpa_bahan", "ditahan_rujukan"): s.append("status")
    dg = o.get("dugaan", [])
    if o.get("status") == "ok" and not 3 <= len(dg) <= 5: s.append(f"jumlah dugaan {len(dg)} di luar 3-5")
    if o.get("status") != "ok" and dg: s.append("dugaan muncul padahal status bukan ok")
    for d in dg:
        i = d.get("id", "?")
        if d.get("tanda") != "perlu_kamu_cek": s.append(f"{i}: tanpa tanda perlu_kamu_cek")
        if not d.get("dasar_kartu"): s.append(f"{i}: tanpa dasar kartu")
        c = d.get("cara_cek") or {}
        if c.get("jenis") not in JENIS_CEK or len(c.get("teks", "")) < 20: s.append(f"{i}: cara cek tidak sah")
        if not isinstance(c.get("paling_lama_hari"), int) or not 1 <= c["paling_lama_hari"] <= 30: s.append(f"{i}: batas hari")
        if not d.get("teks", "").rstrip().endswith("?"): s.append(f"{i}: dugaan bukan pertanyaan")
        for t in (d.get("teks", ""), c.get("teks", "")):
            if re.search(r"\d", t): s.append(f"{i}: angka di teks")
            if PK.KATA_KUANTITAS.search(t): s.append(f"{i}: kata kuantitas '{PK.KATA_KUANTITAS.search(t).group(0)}'")
            m = VONIS.search(t) or VONIS_TAMBAHAN.search(t)
            if m: s.append(f"{i}: vonis '{m.group(0)}'")
    return s
