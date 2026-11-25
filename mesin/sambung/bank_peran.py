"""Bank peran bersumber (262b): contoh peran dari simpul domain Peta Bekal tayang
(src/data/skillMapContent.ts, bersumber WEF FoJ 2025, BPS Sakernas per KBLI, Bappenas, KNEKS, OJK)
dicocokkan ke jabatan resmi KBJI 2026. Contoh tanpa padanan KBJI ditandai `belum_di_kbji`:
itu sinyal peran yang tumbuh lebih cepat dari katalog, bahan "peran yang belum bernama".
Medan Jalan Bakti dipetakan ke domain. Upah sektor (255) ditempel kemudian per KBLI."""
import csv, json, re, sys, pathlib
AKAR = pathlib.Path(__file__).resolve().parents[2]
MAIN = AKAR.parent / "suluiou-main"
KBJI = list(csv.DictReader(open(AKAR/"mesin/sumber/kbji/kbji2026_jabatan.csv", encoding="utf-8")))
t = (MAIN/"src/data/skillMapContent.ts").read_text(encoding="utf-8")
DOMAIN = {}
for m in re.finditer(r'\{ id: "([a-z-]+)", layer: 3, name: "([^"]*)".*?description: "([^"]*)".*?(?:sources?|sumber)\s*:\s*"([^"]*)"', t):
    DOMAIN[m.group(1)] = {"nama": m.group(2), "deskripsi": m.group(3), "sumber": m.group(4)}
ARAH = {"klerikal": "menyusut", "ritel-manual": "menyusut"}  # simpul ini ditulis sebagai tugas yang diambil alih AI
# padanan istilah contoh -> kata kunci judul KBJI (kerja penerjemahan, bukan klaim permintaan)
CONTOH = {
 "energi-terbarukan": {"Teknisi instalasi panel surya": ["surya","fotovoltaik"], "Manajer proyek PLTS": ["manajer proyek"], "Auditor energi": ["auditor energi","energi"], "Insinyur proses": ["insinyur proses","teknik kimia"], "Teknisi turbin": ["turbin"], "Ahli geologi panas bumi": ["geologi","panas bumi","geotermal"], "Konsultan jejak karbon": ["karbon","lingkungan"]},
 "teknologi-digital": {"Pengembang perangkat lunak": ["pengembang perangkat lunak","pemrogram"], "Analis data": ["analis data","ilmuwan data"], "Insinyur AI/ML": ["kecerdasan artifisial","pembelajaran mesin"], "Analis keamanan siber": ["keamanan siber","keamanan informasi"], "Desainer UI/UX": ["antarmuka","pengalaman pengguna","desainer web"], "Insinyur teknologi finansial": ["teknologi finansial","fintech"]},
 "pendidikan": {"Pengajar semua jenjang": ["guru","dosen"], "Perancang pembelajaran": ["desainer instruksional","pengembang pembelajaran"], "Konselor karier": ["konselor karier","bimbingan karier","konselor pendidikan"], "Pelatih vokasi": ["instruktur","pelatih kejuruan"], "Pengembang kurikulum": ["kurikulum"]},
 "kesehatan": {"Tenaga keperawatan": ["perawat"], "Konselor": ["konselor"], "Pekerja sosial": ["pekerja sosial"], "Petugas kesehatan masyarakat": ["kesehatan masyarakat","promosi kesehatan"], "Psikolog klinis": ["psikolog"]},
 "keuangan-syariah": {"Analis sukuk": ["sukuk","analis efek","analis keuangan"], "Konsultan fikih muamalah": ["syariah","muamalah"], "Manajer risiko syariah": ["manajer risiko","analis risiko"], "Auditor halal": ["auditor halal","halal"]},
 "pertanian-modern": {"Spesialis pertanian presisi": ["pertanian presisi","agronom"], "Manajer rantai pasok pertanian": ["rantai pasok","logistik"], "Teknisi IoT pertanian": ["mekanisasi pertanian","teknisi pertanian"], "Teknisi irigasi cerdas": ["irigasi"]},
}
MEDAN = {"k1": ["kesehatan"], "k2": ["pendidikan"], "k3": ["kesehatan"], "k4": ["energi-terbarukan"],
         "k5": ["keuangan-syariah","teknologi-digital"], "k6": ["pertanian-modern"], "k7": []}
TOLAK_GOL = re.compile(r"^(0|9|111)")
def cari(kunci):
    hasil = []
    for r in KBJI:
        if TOLAK_GOL.match(r["kode"]): continue
        j = r["judul"].lower()
        if any(k in j for k in kunci): hasil.append({"kode": r["kode"], "judul": r["judul"], "golongan": r["golongan_pokok"]})
    return hasil[:6]
bank = {}
for dom, contoh in CONTOH.items():
    d = DOMAIN.get(dom); assert d, dom
    bank[dom] = {"nama": d["nama"], "sumber_kebutuhan": d["sumber"], "arah": ARAH.get(dom, "tumbuh"), "peran": []}
    for nama, kunci in contoh.items():
        k = cari(kunci)
        bank[dom]["peran"].append({"contoh": nama, "kbji": k, "status": "di_kbji" if k else "belum_di_kbji"})
keluar = {"versi": 1, "asal": "skillMapContent.ts lapis 3 (tayang) x KBJI 2026", "medan_ke_domain": MEDAN,
          "catatan_k7": "medan kepemimpinan dan tata kelola umat belum punya simpul domain di Peta Bekal; celah dicatat, bukan diisi peran struktural",
          "domain": bank}
p = AKAR/"mesin/sambung/keluaran/bank_peran.json"; p.write_text(json.dumps(keluar, ensure_ascii=False, indent=1), encoding="utf-8")
n = sum(len(v["peran"]) for v in bank.values()); b = sum(1 for v in bank.values() for x in v["peran"] if x["status"]=="belum_di_kbji")
print(f"domain {len(bank)} · contoh {n} · di KBJI {n-b} · belum di KBJI {b}")
for dom,v in bank.items():
    for x in v["peran"]: print(dom, "|", x["contoh"], "|", x["status"], "|", "; ".join(f'{k["kode"]} {k["judul"]}' for k in x["kbji"][:3]))
