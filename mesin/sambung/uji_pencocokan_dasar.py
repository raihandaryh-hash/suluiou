#!/usr/bin/env python3
"""Uji L11: tiap pertemuan bersumber, sesuai ambang, tanpa placeholder tersisa, bekal = simpul peta keterampilan yang tayang."""
import csv, json, os, re, sys
S = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(S, "keluaran", "pencocokan_dasar.json"), encoding="utf-8"))
prof = {r["kode_bps"]: r for r in csv.DictReader(open(os.path.join(S, "..", "sumber", "masukan_kartu", "dikk2025_profil_miskin.csv"), encoding="utf-8"))}
SIMPUL = {"rasa-ingin-tahu","resiliensi","kesadaran-diri","etika","metakognisi","berpikir-analitis","berpikir-kreatif","berpikir-sistemik","empati","kepemimpinan","literasi-ai","keamanan-digital","literasi-teknologi","manajemen-proyek","komunikasi-kompleks","kepedulian-lingkungan","mengajar","energi-terbarukan","teknologi-digital","pendidikan","kesehatan","keuangan-syariah","pertanian-modern","klerikal","ritel-manual"}
A = {a["id"]: a for a in d["aturan"]}; amb = d["ambang"]; uji = []
semua = [(k, x) for k, v in d["wilayah"].items() for x in v]
uji.append(("tiap pertemuan punya dasar kebutuhan ber-URL", all("https://" in x["dasar"]["kebutuhan"] for _, x in semua)))
uji.append(("nilai sama dengan profil DIKK", all(abs(float(prof[k][A[x["aturan"]]["kolom"]]) - x["nilai"]) < 1e-9 for k, x in semua)))
uji.append(("aturan menyala hanya di seperempat terberat", all((x["nilai"] <= amb[x["aturan"]]["batas_kuartil"]) if A[x["aturan"]]["arah"] == "rendah" else (x["nilai"] >= amb[x["aturan"]]["batas_kuartil"]) for _, x in semua)))
uji.append(("tanpa placeholder tersisa kecuali {bekal_pengguna}", all(not re.search(r"\{(?!bekal_pengguna\})", x["tampil"] + x["jelajah_prompt_dewasa"] + x["jelajah_prompt_bawah_18"]) for _, x in semua)))
uji.append(("prompt di bawah 18 tanpa bekal", all("{bekal_pengguna}" not in x["jelajah_prompt_bawah_18"] and "Kekuatan yang saya punya" not in x["jelajah_prompt_bawah_18"] for _, x in semua)))
uji.append(("bekal = simpul peta keterampilan tayang", all(set(a["bekal"]) <= SIMPUL for a in d["aturan"])))
uji.append(("arah peran berjamak (minimal 3)", all(len(a["arah_peran"]) >= 3 for a in d["aturan"])))
uji.append(("Garut: P1 dan P2", [x["aturan"] for x in d["wilayah"]["3205"]] == ["P1", "P2"]))
for n, ok in uji: print("LULUS" if ok else "GAGAL", n)
print(f"{sum(o for _, o in uji)}/{len(uji)} lulus"); sys.exit(0 if all(o for _, o in uji) else 1)
