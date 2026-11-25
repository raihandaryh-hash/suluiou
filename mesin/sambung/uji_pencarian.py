#!/usr/bin/env python3
import datetime, pencarian as C
H = datetime.date(2026, 11, 15)
assert C.kueri("Kab. Garut", "stunting-balita", tahun=2026) == "berita stunting Kabupaten Garut 2026"
assert C.kueri("Kota Malang", "pengangguran-terbuka-kabkota", ["bengkel"], tahun=2026) == "berita pengangguran bengkel Kota Malang 2026"
for buruk in (dict(kata_pengguna=["a", "b", "c", "d"]), dict(kata_pengguna=["08123456789"]), dict(kata_pengguna=["nama saya budi"]),
              dict(kata_pengguna=["bengkel"], mode_ai="c")):
    try: C.kueri("Kab. Garut", "stunting-balita", **buruk); raise SystemExit(f"kueri buruk lolos: {buruk}")
    except ValueError: pass
try: C.kueri("Kab. Garut", "tidak-ada"); raise SystemExit("jenis asing lolos")
except ValueError: pass
b = {"judul": "Pemkab Garut Tekankan Kades Atasi Masalah Stunting", "url": "https://rri.co.id/bandung/regional/2479326/pemkab-garut-tekankan-kades-atasi-masalah-stunting",
     "penerbit": "RRI Bandung", "tanggal_terbit": "2026-06-01", "tanda": "dari_pencarian_perlu_dicek"}  # tanggal fixture karangan untuk uji, bukan tanggal terbit sebenarnya
assert not C.periksa_temuan(b, H)
neg = {"tanpa tanggal": dict(b, tanggal_terbit=None), "lama": dict(b, tanggal_terbit="2024-01-10"), "masa depan": dict(b, tanggal_terbit="2027-01-01"),
       "http": dict(b, url="http://rri.co.id/x"), "tanpa tanda": dict(b, tanda=None), "ringkasan karangan": dict(b, ringkasan="Stunting di Garut disebabkan ..."),
       "jurnal": dict(b, url="https://journal.ugm.ac.id/v3/BKM/article/download/14675/5445"), "tanpa penerbit": dict(b, penerbit="")}
neg["korban"] = dict(b, judul="Balita Korban Gizi Buruk di Garut Meninggal Dunia")
neg["kriminal di cuplikan"] = dict(b, cuplikan="Polisi menyebut tersangka ditangkap di rumahnya")
for n, t in neg.items(): assert C.periksa_temuan(t, H), f"temuan cacat lolos: {n}"
g = dict(b, url="https://jabarprov.go.id/id/berita/x", tanggal_terbit="2025-12-01"); lain = dict(b, url="https://blog.contoh.com/x")
urut = C.saring([lain, b, g] + list(neg.values()), H)
assert [t["tingkat_sumber"] for t in urut] == [1, 2, 3] and len(urut) == 3
T = C.tampilan([b, dict(b, cuplikan="Rapat koordinasi digelar di pendopo")] + list(neg.values()), H)
assert len(T["butir"]) == 2 and T["kosong"] is None and all("cuplikan" not in x for x in T["butir"]) and T["disimpan"] is False and T["masuk_proposal_diri"] is False
K = C.tampilan(list(neg.values()), H)
assert K["butir"] == [] and K["kosong"] == "Belum ada berita yang cocok."
print(f"LULUS pencarian: kueri aman (5 kueri buruk ditolak), {len(neg)} dari {len(neg)} temuan cacat ditolak, urutan sumber resmi lebih dulu")
