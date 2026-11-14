#!/usr/bin/env python3
"""Alur jalur cipta (M3b) di luar produksi. Ide dulu (G3b.1): pemantik terkunci sampai pengguna menulis ≥1 gagasan.
Mode (c): pemantik dari bank statis (aturan tetap, gagasan tidak dikirim ke mana pun). Mode dewasa: gagasan tersamar dikirim ke
model pemantik; di luar produksi fungsi ini mengembalikan permintaan model (`butuh_model`), tidak memanggil model.
Pakai sebagai modul: from alur import minta_pemantik"""
import os, re, yaml
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
B = yaml.safe_load(open(os.path.join(AKAR, "cipta", "bank_pemantik_v2.yaml"), encoding="utf-8"))
MIN_HURUF = 12  # gagasan dihitung bila memuat setidaknya sekian huruf setelah spasi dibuang (bukan isian kosong atau satu kata)

def gagasan_sah(g):
    return isinstance(g, str) and len(re.sub(r"[^A-Za-zÀ-ÿ]", "", g)) >= MIN_HURUF

def minta_pemantik(mode, jenis_kebutuhan, gagasan, putaran):
    """gagasan: daftar teks yang sudah ditulis pengguna; putaran: urutan pemantik yang diminta, mulai dari nol."""
    if not any(gagasan_sah(g) for g in (gagasan or [])):
        return {"status": "terkunci", "pesan": "Tulis dulu gagasanmu sendiri. Pertanyaan pemantik muncul sesudahnya."}
    if mode == "c":
        bank = B["bank"].get(jenis_kebutuhan) or B["bank"]["umum"]
        if putaran >= len(bank): return {"status": "habis", "pesan": B["penutup"]}
        return {"status": "pemantik", "sumber": "bank_statis", "label": B["label_generik"], "pertanyaan": bank[putaran]}
    return {"status": "butuh_model", "sumber": "model_dewasa", "masukan": {"gagasan_tersamar": "[disamarkan sebelum dikirim]", "putaran": putaran}}
