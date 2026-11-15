#!/usr/bin/env python3
"""S3b: lapis pencarian untuk penjelajah lokal (temuan-berita/1). Dasar: KEPUTUSAN Raihan 15 Nov 2026 14.01
(sesudah pengguna memasukkan data, AI mencari berita dan sejenisnya untuk melengkapi).
Bagian ini TIDAK memanggil internet. Ia hanya: (1) menyusun kueri yang aman, (2) memeriksa temuan sebelum boleh tampil.
Pemanggilan pencarian dan pembacaan halaman dilakukan di sisi aplikasi (lajur Chief Sulu), sesudah lapis distress.
Aturan:
- kueri hanya dari: nama wilayah resmi, kata topik kebutuhan (daftar tertutup), dan paling banyak tiga kata kunci pengguna
  (huruf saja). Kalimat bebas pengguna tidak pernah masuk kueri; untuk pengguna di bawah 18 kata kunci pengguna ditolak.
- temuan bukan bukti: tidak masuk kartu, tidak mengubah angka. Tampil sebagai "berita untuk kamu cek", bertautan dan bertanggal.
- temuan tanpa tanggal terbit, lebih tua dari BATAS_BULAN, atau bukan https ditolak. Tidak ada ringkasan isi yang dikarang:
  hanya judul asli, penerbit, tanggal, tautan, dan satu pertanyaan cek dari bank dugaan."""
import re, datetime
BATAS_BULAN = 24
MAKS = 5
TOPIK = {"kemiskinan-kabkota": "kemiskinan bantuan sosial", "pengangguran-terbuka-kabkota": "pengangguran lapangan kerja pelatihan",
         "stunting-balita": "stunting posyandu gizi balita", "penduduk-tanpa-jaminan-kesehatan": "jaminan kesehatan BPJS kepesertaan"}
TINGKAT = {1: re.compile(r"(^|\.)go\.id$"), 2: re.compile(r"(^|\.)(antaranews\.com|rri\.co\.id|kompas\.com|kompas\.id|tempo\.co|detik\.com|republika\.co\.id|tribunnews\.com|medcom\.id)$")}
# Saringan wajib (jawaban Chief Sulu 15 Nov 14.08): butir dibuang utuh bila judul atau cuplikannya menyangkut kasus orang pribadi
# atau kriminal dan kekerasan. Daftar ini lantai pertama; saringan nama orang pribadi oleh model ada di sisi aplikasi.
KASUS = re.compile(r"(?i)\b(korban|tersangka|terdakwa|pelaku|tewas|meninggal|dibunuh|pembunuhan|bunuh diri|pemerkosaan|perkosa\w*|cabul\w*|asusila|pelecehan|kekerasan|penganiayaan|aniaya|ditangkap|dibekuk|narkoba|pencurian|begal|tawuran|mayat|jenazah|gantung diri|kdrt)\b")
KALIMAT_KOSONG = "Belum ada berita yang cocok."
KATA = re.compile(r"^[A-Za-z]{3,20}$")

def kueri(wilayah_nama, jenis, kata_pengguna=(), mode_ai="dewasa", tahun=None):
    if jenis not in TOPIK: raise ValueError("jenis kebutuhan tanpa topik terdaftar")
    if mode_ai != "dewasa" and kata_pengguna: raise ValueError("kata kunci pengguna ditolak untuk pengguna di bawah 18")
    kata = list(kata_pengguna)
    if len(kata) > 3 or any(not KATA.match(k) for k in kata): raise ValueError("kata kunci pengguna: paling banyak tiga, huruf saja")
    w = re.sub(r"^(Kab\.|Kota)\s+", lambda m: {"Kab.": "Kabupaten ", "Kota": "Kota "}[m.group(1)], wilayah_nama)
    return " ".join(["berita", TOPIK[jenis].split()[0], *kata, w, str(tahun or datetime.date.today().year)])

def tingkat(url):
    host = re.sub(r"^https://([^/]+).*$", r"\1", url).lower()
    return next((t for t, p in TINGKAT.items() if p.search(host)), 3)

def periksa_temuan(t, hari_ini=None):
    """Kembalikan daftar alasan tolak. Kosong = boleh tampil sebagai 'berita untuk kamu cek'."""
    s, hari_ini = [], hari_ini or datetime.date.today()
    url = t.get("url", "")
    if not url.startswith("https://"): s.append("bukan https")
    if len(t.get("judul", "")) < 10: s.append("judul kosong")
    if not t.get("penerbit"): s.append("penerbit kosong")
    try:
        tgl = datetime.date.fromisoformat(t.get("tanggal_terbit") or "")
        umur = (hari_ini.year - tgl.year) * 12 + hari_ini.month - tgl.month
        if tgl > hari_ini: s.append("tanggal di masa depan")
        elif umur > BATAS_BULAN: s.append(f"lebih tua dari {BATAS_BULAN} bulan")
    except ValueError:
        s.append("tanpa tanggal terbit")
    if t.get("tanda") != "dari_pencarian_perlu_dicek": s.append("tanpa tanda")
    if t.get("ringkasan"): s.append("ringkasan isi tidak diizinkan")
    for bagian in ("judul", "cuplikan"):
        m = KASUS.search(t.get(bagian) or "")
        if m: s.append(f"menyangkut kasus atau kekerasan: '{m.group(0)}'"); break
    if url.lower().endswith(".pdf") or "/article/download/" in url: s.append("bukan berita (berkas jurnal)")
    return s

def saring(daftar, hari_ini=None):
    lolos = [dict(t, tingkat_sumber=tingkat(t["url"])) for t in daftar if not periksa_temuan(t, hari_ini)]
    lolos.sort(key=lambda t: (t["tingkat_sumber"], -datetime.date.fromisoformat(t["tanggal_terbit"]).toordinal()))
    return lolos[:MAKS]

def tampilan(daftar, hari_ini=None):
    """Yang sampai ke layar: butir lolos tanpa cuplikan, atau kalimat netral bila nol. Tidak disimpan per pengguna."""
    lolos = saring(daftar, hari_ini)
    return {"skema": "temuan-berita/1", "disimpan": False, "masuk_proposal_diri": False,
            "butir": [{k: t[k] for k in ("judul", "url", "penerbit", "tanggal_terbit", "tanda", "tingkat_sumber")} for t in lolos],
            "kosong": None if lolos else KALIMAT_KOSONG}
