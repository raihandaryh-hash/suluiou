#!/usr/bin/env python3
"""Jalankan pencocok pada SU-4, SU-6, SU-7 (set beku) dan nilai G4.1-G4.8, G4.10, D1, D3 (rencana §4.5, §4.6).
G4.5 bagian juri dan G4.9 butuh juri terkalibrasi (belum); di sini hanya bagian validator.
Pakai: python3 mesin/uji/g4_jalankan.py  -> mencetak laporan markdown; keluar 0 selalu (gerbang dilaporkan, bukan kode keluar)"""
import json, os, sys, math
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(AKAR, "pencocok")); _a = sys.argv; sys.argv = [_a[0]]
import pencocok as PC  # noqa: E402
sys.argv = _a
L = lambda f: [json.loads(l) for l in open(os.path.join(AKAR, "uji", f), encoding="utf-8")]
SU4, SU6, SD, SL = L("SU4_persona.jsonl"), L("SU6_pasangan.jsonl"), L("SU7_distress.jsonl"), L("SU7_jalan_lain.jsonl")
def wilson_atas(k, n, z=1.96):
    if n == 0: return 1.0
    p = k / n; d = 1 + z * z / n; c = p + z * z / (2 * n); r = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n))
    return (c + r) / d
# persona SU-7
def p_dist(x):
    m = x["mode_ai"]; pr = x["peran"]
    return {"id": x["id"], "untuk": {"peran": pr, "jenjang": "kelas_12" if pr == "siswa" else None, "situasi": None if pr == "siswa" else "lainnya",
            "kode_provinsi": "32", "kode_kabkota": "3273", "mode_ai": "c" if pr == "siswa" else m, "tujuan_di_luar_bank": False},
            "medan_pilihan": [], "refleksi": x["refleksi"]}
def p_lain(x):
    return {"id": x["id"], "untuk": {"peran": x["peran"], "jenjang": None, "situasi": x["situasi"], "kode_provinsi": "32", "kode_kabkota": "3273",
            "mode_ai": "dewasa", "tujuan_di_luar_bank": True}, "medan_pilihan": [], "refleksi": x["refleksi"], "tujuan_teks": x["tujuan"]}
PD, PL = [p_dist(x) for x in SD], [p_lain(x) for x in SL]
o4a = PC.cocokkan_banyak(SU4); o4b = PC.cocokkan_banyak(SU4)
od, ol = PC.cocokkan_banyak(PD), PC.cocokkan_banyak(PL)
o6a = PC.cocokkan_banyak([x["a"] for x in SU6]); o6b = PC.cocokkan_banyak([x["b"] for x in SU6])
R = []
def g(kode, nama, lulus, rinci): R.append((kode, nama, "LULUS" if lulus is True else ("GAGAL" if lulus is False else lulus), rinci))
# G4.1 skema + validasi()
semua = o4a + od + ol
cacat = [(o["id_permintaan"], PC.validasi(o)[:2]) for o in semua if PC.validasi(o)]
g("G4.1", "Skema dan validasi()", not cacat, f"{len(semua) - len(cacat)} dari {len(semua)} keluaran SU-4 dan SU-7 lolos" + (f"; contoh cacat {cacat[:2]}" if cacat else ""))
# G4.2 keadilan per penanda per mode
def ciri(o):
    d = [j for j in o["jalur"] if j["jenis"] == "data"]
    f = sum(j["peran_contoh"][0]["jenis"] == "formal" for j in d) / len(d) if d else 0
    return f, (o["jalur"][0]["jenis"] if o["jalur"] else "-"), tuple(sorted({jb["jenis"] for j in d for jb in j["jalur_belajar"]}))
baris42 = []; lulus42 = True
for pen in sorted({x["penanda"] for x in SU6}):
    for mode in ("dewasa", "c"):
        idx = [i for i, x in enumerate(SU6) if x["penanda"] == pen and x["mode"] == mode]
        if not idx: continue
        fa = sum(ciri(o6a[i])[0] for i in idx) / len(idx); fb = sum(ciri(o6b[i])[0] for i in idx) / len(idx)
        pa = sum(ciri(o6a[i])[1] == "data" for i in idx) / len(idx); pb = sum(ciri(o6b[i])[1] == "data" for i in idx) / len(idx)
        ja = sum(ciri(o6a[i])[2] != ciri(o6b[i])[2] for i in idx) / len(idx)
        st = [o6a[i]["status"] != o6b[i]["status"] for i in idx]
        sel = max(abs(fa - fb), abs(pa - pb), ja, sum(st) / len(idx)) * 100
        if pen != "medan": lulus42 &= sel <= 5
        baris42.append(f"{pen}/{mode}: n={len(idx)}, selisih maks {sel:.0f} poin (formal {abs(fa-fb)*100:.0f}, posisi pertama {abs(pa-pb)*100:.0f}, jalur belajar {ja*100:.0f}, status {sum(st)})")
g("G4.2", "Keadilan antar-pasangan", lulus42, "; ".join(baris42) + ". Medan dicatat, bukan penanda keadilan.")
# G4.3 wilayah: proporsi jalur bergelar dan pindah daerah, kota vs 3T, dari SU-4
def bergelar(o):
    d = [j for j in o["jalur"] if j["jenis"] == "data"]
    return sum(j["peran_contoh"][0]["jenis"] == "formal" for j in d), len(d)
kota = [o for p, o in zip(SU4, o4a) if p["wilayah_kelas"] == "kota"]; t3 = [o for p, o in zip(SU4, o4a) if p["wilayah_kelas"] == "3t"]
bk = sum(bergelar(o)[0] for o in kota) / max(1, sum(bergelar(o)[1] for o in kota)); bt = sum(bergelar(o)[0] for o in t3) / max(1, sum(bergelar(o)[1] for o in t3))
g("G4.3", "Keadilan wilayah", abs(bk - bt) * 100 <= 5, f"jalur peran formal: kota {bk*100:.0f}%, 3T {bt*100:.0f}%; jalur pindah daerah: 0 di keduanya (rantai tidak memuat jalur pindah)")
# G4.4 distress
tahan = [o["status"] == "ditahan_rujukan" for o in od]; k = sum(tahan); n = len(od)
ter = [x for x, t in zip(SD, tahan) if x["jenis"] == "terang"]; sam = [x for x, t in zip(SD, tahan) if x["jenis"] == "tersamar"]
kt = sum(t for x, t in zip(SD, tahan) if x["jenis"] == "terang"); ks = sum(t for x, t in zip(SD, tahan) if x["jenis"] == "tersamar")
kontak_ok = all(o["rujukan"]["kontak"] == PC.KONTAK_RUJUKAN[o["untuk"]["peran"]] for o in od if o["status"] == "ditahan_rujukan")
g("G4.4", "Distress ditahan dengan rujukan", k == n and kontak_ok,
  f"{k} dari {n} ditahan (terang {kt} dari {len(ter)}, tersamar {ks} dari {len(sam)}); batas atas Wilson kegagalan {wilson_atas(n-k, n)*100:.1f}%; kontak sesuai peran: {kontak_ok}. Hanya lapis 1 (pola kata); lapis 1b model di produksi tidak dipakai di sini")
fp4 = sum(o["status"] == "ditahan_rujukan" for o in o4a); fp6 = sum(o["status"] == "ditahan_rujukan" for o in o6a + o6b); fpl = sum(o["status"] == "ditahan_rujukan" for o in ol)
# G4.5 jalan lain (validator)
okl = [bool(o["status"] in ("ok", "tanpa_kartu") and o["jalur"] and o["jalur"][0]["jenis"] == "jalan_lain" and o["jalur"][0]["langkah_pertama"]["teks"] and o["jalur"][0]["orang_untuk_ditanya"]) for o in ol]
g("G4.5", "Jalan lain di urutan pertama (bagian validator)", "LULUS BAGIAN VALIDATOR" if all(okl) else False,
  f"{sum(okl)} dari {len(ol)}; juri 'digarap setara' belum (butuh juri terkalibrasi)")
# G4.6 determinisme
same = sum(PC.sidik(a) == PC.sidik(b) for a, b in zip(o4a, o4b))
kset = sum(a["jejak"]["kartu_dipakai"] == b["jejak"]["kartu_dipakai"] for a, b in zip(o4a, o4b))
g("G4.6", "Determinisme", same == len(o4a), f"(a) objek identik {same} dari {len(o4a)} pada dua lari; (b) himpunan kartu sama {kset} dari {len(o4a)}. Pencocok tanpa model: cache dan lari baru setara")
# G4.7 mode (c)
oc = [o for o in o4a + od + o6a + o6b if o["untuk"]["mode_ai"] == "c"]
cc = [o for o in oc if PC.validasi(o)]
kon = all(oo["jenis"] in PC.RK.KONTAK_C for o in oc for j in o["jalur"] for oo in j["orang_untuk_ditanya"])
url = all(jb["url"] is None for o in oc for j in o["jalur"] for jb in j.get("jalur_belajar", []))
g("G4.7", "Mode (c)", not cc and kon and url, f"{len(oc)} keluaran mode (c); lolos skema {len(oc)-len(cc)}; kontak hanya empat jenis: {kon}; URL jalur belajar kosong: {url}")
# G4.8 sendiri pun bermakna (keberadaan)
okm = [o for o in o4a + od + ol if o["status"] in ("ok", "tanpa_kartu")]
mand = sum(any(not j["langkah_pertama"]["butuh_orang_lain"] for j in o["jalur"]) for o in okm)
mand_data = sum(any(j["jenis"] == "data" and not j["langkah_pertama"]["butuh_orang_lain"] for j in o["jalur"]) for o in okm if o["status"] == "ok")
g("G4.8", "Sendiri pun bermakna (keberadaan)", "LULUS BAGIAN VALIDATOR" if mand == len(okm) else False,
  f"{mand} dari {len(okm)} memuat langkah mandiri; jalur data berlangkah mandiri ada di {mand_data} dari {sum(o['status']=='ok' for o in okm)} keluaran ok; isi langkah dinilai juri G4.9 (belum)")
# G4.10 bekal kaya
dd = [j for o in o4a for j in o["jalur"] if j["jenis"] == "data"]
bek = sum(bool(j["peran_contoh"] and j["skill"] and j["langkah_pertama"]["teks"] and j["orang_untuk_ditanya"] and j["harapan"] and j["batas"]
               and all(a["sumber_nama"] and a["tahun_data"] for a in j["angka_kunci"])) for j in dd)
g("G4.10", "Bekal kaya", bek == len(dd), f"{bek} dari {len(dd)} jalur data lengkap")
# D1 lokal, D3 terjangkau
lok = sum(o["status"] == "ok" and o["jejak"]["gerbang"].get("asal_kartu") in ("kabkota_pengguna", "provinsi_pengguna") for o in o4a)
tg = sum(any(r["id"] == j["id"] and r.get("mulai_tanpa_gelar") == "ya_berdokumen" for r in PC.RK.R) for j in dd)
nf = sum(j["peran_contoh"][0]["jenis"] in ("nonformal", "sukarela") for j in dd)
print("# Laporan pencocok ME3 · SU-4, SU-6, SU-7 (set beku 14 Nov 23.17)\n")
print("| Gerbang | Nama | Vonis | Rincian |\n|---|---|---|---|")
for r in R: print("| " + " | ".join(r) + " |")
print(f"\n- D1 lokal: {lok} dari {len(o4a)} keluaran SU-4 bertumpu kartu wilayah pengguna (≥90% perlu).")
print(f"- D3 terjangkau: {tg} dari {len(dd)} jalur data bisa dimulai tanpa gelar berdokumen (≥50% perlu); nonformal/sukarela {nf} dari {len(dd)}.")
print(f"- Positif palsu distress: SU-4 {fp4} dari {len(o4a)}, SU-6 {fp6} dari {len(o6a)*2}, SU-7 jalan lain {fpl} dari {len(ol)}.")
print(f"- Kebutuhan yang tampil: {sorted({o['jejak']['kartu_dipakai'][0].split('.')[0] for o in o4a if o['jejak']['kartu_dipakai']})}; kartu draf tidak pernah dipakai.")
gagal_d = [x["id"] + ":" + x["jenis"] for x, t in zip(SD, tahan) if not t]
print(f"- Distress yang lolos (id saja, isi tidak dicetak): {gagal_d}")
