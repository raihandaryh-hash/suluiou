#!/usr/bin/env python3
"""Uji negatif tetap untuk validator rantai (rangkai.py v2). Asal: uji suntikan peninjau Fable 5.2, 14 Nov 2026
(N1-N14), disesuaikan dengan rantai v2. Tiap mutasi diterapkan pada salinan rantai_v2.yaml di folder sementara,
lalu rangkai.py --rantai SALINAN dijalankan; mutasi yang diharapkan tertangkap wajib keluar dengan kode 1.
Kontrol (rantai asli) wajib keluar 0. Di luar jangkauan validator mekanis (dicatat, tidak dihitung):
N1 relevansi simpul skill (butuh pemetaan ESCO/O*NET), N13 nada defisit (juri G3.4 lapis 2).
N5 dan N12 versi Fable gugur di v2: templat dipilih kode, jadi tempat kosong menghasilkan tanya_orang_dekat, bukan teks rusak.
Pakai: python3 mesin/uji/rantai_negatif.py   (keluar 1 bila ada mutasi yang lolos)"""
import copy, os, subprocess, sys, tempfile, yaml
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASLI = os.path.join(AKAR, "jalur", "rantai_v2.yaml")
D = yaml.safe_load(open(ASLI, encoding="utf-8"))
def idx(d, i): return next(r for r in d["jalur"] if r["id"] == i)
def n2(d): idx(d, "jkn-operator")["peran"] = {"nama": "Bidan", "doc_id": "perpres-72-2021"}
def n3(d):
    for r in d["jalur"]: r["bukti"] = []
def n4(d): idx(d, "miskin-psm")["orang"] = [{"jenis": "komunitas", "cara": "kirim foto KTP dan nomor ponselmu ke admin lalu bayar biaya pendaftaran"}]
def n6(d): idx(d, "jkn-pemasar")["jalur_belajar"][0]["kutipan"] = "kutipan karangan yang tidak ada di dokumen mana pun"
def n7(d):
    r = idx(d, "stunting-bidan"); r.update({"mulai_tanpa_gelar": "ya_berdokumen", "mulai_tanpa_gelar_sumber": "perpres-72-2021",
                                            "mulai_tanpa_gelar_kutipan": "bidan tidak memerlukan pendidikan apa pun", "jenis_bukti_gelar": "syarat_eksplisit"})
def n8(d):
    r = idx(d, "miskin-psm"); r["orang"] = [{"jenis": "komunitas", "cara": "kamu wajib datang; ini satu-satunya jalan dan tanggung jawabmu"}]
    r["jalur_belajar"][0]["nama"] = "Kursus tiga bulan berbayar"
def n9(d):
    a = idx(d, "miskin-karang-taruna")
    for i in ("miskin-psm", "miskin-pendamping-pkh"):
        k = [n for n, r in enumerate(d["jalur"]) if r["id"] == i][0]; b = copy.deepcopy(a); b["id"] = i; d["jalur"][k] = b
def n10(d):
    r = idx(d, "stunting-bidan"); r["harapan"] = "Ini kewajibanmu; kamu harus jadi bidan, kalau tidak kamu mengecewakan orang tuamu"; r["judul"] = "Hanya ini jalanmu, jangan pilih yang lain"
def n11(d): idx(d, "jkn-fasilitator").pop("tempat"); idx(d, "jkn-fasilitator")["peran_frasa"] = ""
def n12(d): idx(d, "miskin-psm")["kontak_c"] = [{"jenis": "praktisi", "cara": "hubungi lewat pesan langsung"}]
def n14(d): idx(d, "stunting-bidan")["harapan"] = "x"; idx(d, "stunting-bidan")["batas"] = ""
def n15(d): idx(d, "miskin-psm")["harapan_jenis"] = "terbukti"
def n16(d): idx(d, "jkn-operator")["kontak_c"] = []
def n17(d): idx(d, "miskin-psm")["harapan"] = "Sebagian besar warga desa bisa terbantu oleh pekerja sosial"
U = [("N2 peran dari kebutuhan lain", n2), ("N3 bukti kosong", n3), ("N4 cara meminta KTP dan biaya", n4),
     ("N6 kutipan jalur belajar karangan", n6),
     ("N7 klaim tanpa gelar dengan kutipan karangan", n7), ("N8 vonis di cara + biaya di nama jalur belajar", n8),
     ("N9 tiga jalur dengan peran sama", n9), ("N10 vonis berimbuhan di harapan dan judul", n10),
     ("N11 tempat dan frasa peran kosong", n11), ("N12 kontak praktisi di mode (c)", n12),
     ("N14 harapan terlalu pendek dan batas kosong", n14), ("N15 harapan 'terbukti' tanpa Evidence DB", n15),
     ("N16 kontak mode (c) kosong", n16), ("N17 kata kuantitas di harapan", n17)]
RK = os.path.join(AKAR, "jalur", "rangkai.py")
tmp = tempfile.mkdtemp(); lolos = []
def jalan(d):
    p = os.path.join(tmp, "rantai.yaml"); yaml.safe_dump(d, open(p, "w", encoding="utf-8"), allow_unicode=True, sort_keys=False)
    return subprocess.run([sys.executable, RK, "--rantai", p], capture_output=True, text=True).returncode
rc0 = jalan(copy.deepcopy(D))
print(f"kontrol rantai asli: rc={rc0} ({'benar' if rc0 == 0 else 'SALAH'})")
for nama, f in U:
    d = copy.deepcopy(D); f(d); rc = jalan(d)
    print(f"{nama}: rc={rc} {'tertangkap' if rc == 1 else 'LOLOS'}")
    if rc != 1: lolos.append(nama)
print(f"tertangkap {len(U) - len(lolos)} dari {len(U)}; di luar jangkauan: N1 relevansi skill, N13 nada defisit")
sys.exit(1 if lolos or rc0 != 0 else 0)
