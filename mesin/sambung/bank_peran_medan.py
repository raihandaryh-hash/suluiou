"""A3: bank peran berkode KBJI 2026 per medan dan sub-tantangan Jalan Bakti.
PENGAYA penghasil peran AI (KEPUTUSAN 25 Nov 02.10 "tinggal enhance saja bukan break"), bukan pengganti.
Kata kunci per sub-tantangan = SINTESIS mesin; tiap peran lolos pola penolak (alat/pola_penolak_peran.mjs).
Keluaran: sambung/keluaran/bank_peran_medan.json"""
import csv, json, os, re, subprocess
AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
K = {
 "k1a": ["dokter umum","perawat","bidan","apoteker","ahli kesehatan masyarakat","sanitarian","ahli gizi","fisioterapis"],
 "k1b": ["psikolog klinis","psikolog pendidikan","konselor","pekerja sosial","psikiater"],
 "k1c": ["ahli gizi","dietisien","bidan","dokter spesialis anak","ahli kesehatan masyarakat"],
 "k2a": ["guru","dosen ilmu pendidikan","pengembang kurikulum","pengawas sekolah","desain pembelajaran"],
 "k2b": ["dosen ilmu keagamaan","penceramah agama","guru pendidikan agama","guru agama","asisten profesional keagamaan"],
 "k2c": ["guru","penasihat karier","pustakawan","guru bimbingan"],
 "k3a": ["pekerja sosial","psikolog klinis","konselor","advokat"],
 "k3b": ["perawat","pekerja sosial","fisioterapis","geriatri","terapis okupasi"],
 "k3c": ["terapis okupasi","fisioterapis","pendidikan khusus","ortotis","bahasa isyarat","pekerja sosial"],
 "k4a": ["perencana pengelolaan sampah","kepala fasilitas pengelolaan sampah","teknisi daur ulang limbah","ahli teknik lingkungan","insinyur lingkungan","auditor lingkungan"],
 "k4b": ["insinyur listrik","teknisi listrik","insinyur energi","panas bumi","ahli geologi","insinyur mesin"],
 "k4c": ["kebencanaan","geolog","meteorolog","insinyur sipil","perencana lahan","geofisika","kebakaran hutan"],
 "k5a": ["analis keuangan","akuntan","konsultan manajemen","analis pemasaran","analis kredit"],
 "k5b": ["perencana keuangan","analis keuangan","analis kredit","aktuaris"],
 "k5c": ["akuntan","analis keuangan","auditor","manajer investasi"],
 "k5d": ["penasihat karier","profesional personalia dan karier","pengawas ketenagakerjaan","konselor bimbingan kejuruan"],
 "k6a": ["ahli agronomi","teknisi pertanian","penyuluh pertanian","ahli hama"],
 "k6b": ["manajer umum industri pengolahan","teknolog pangan","teknologi pangan","analis pemasaran","manajer pertanian tanaman pangan"],
 "k6c": ["ahli agronomi","teknolog pangan","pemulia tanaman","perikanan","peternakan"],
 "k6d": ["ahli hidrologi","insinyur sipil","operator mesin pengolahan air","ahli teknik lingkungan","sanitarian"],
 "k7a": ["perencana tata kota","perencana lahan","analis kebijakan","manajer kebijakan dan perencanaan","ahli statistik"],
 "k7b": ["akuntan","auditor","konsultan manajemen","manajer perencanaan strategis","analis organisasi"],
 "k7c": ["analis kebijakan","wartawan umum","wartawan media digital","advokat","ahli statistik"],
}
baris = list(csv.DictReader(open(os.path.join(AKAR,"sumber","kbji","kbji2026_jabatan.csv"),encoding="utf-8")))
pola = subprocess.run(["node","-e","import('./alat/pola_penolak_peran.mjs').then(m=>console.log(m.PERAN_DITOLAK.source))"],cwd=AKAR,capture_output=True,text=True,check=True).stdout.strip()
tolak = re.compile(pola.replace("(?<","(?P<"), re.I)
out, tanpa = {}, []
for st, kata in K.items():
    hasil, lihat = [], set()
    for k in kata:
        for r in baris:
            j = r["judul"].lower()
            if k in j and r["kode"] not in lihat and not r["kode"].startswith("11") and not tolak.search(r["judul"]):
                lihat.add(r["kode"]); hasil.append({"kode_kbji": r["kode"], "judul": r["judul"], "kata_kunci": k})
    out[st] = hasil[:12]
    if not hasil: tanpa.append(st)
json.dump({"versi":1,"asal":"KBJI 2026 BPS (mesin/sumber/kbji) x sub-tantangan Jalan Bakti main 0264b9e","label":"SINTESIS mesin; pengaya, bukan daftar tertutup","sub_tantangan":out,"tanpa_hasil":tanpa},
          open(os.path.join(AKAR,"sambung","keluaran","bank_peran_medan.json"),"w",encoding="utf-8"),ensure_ascii=False,indent=1)
print({k:len(v) for k,v in out.items()}, "tanpa:", tanpa)
