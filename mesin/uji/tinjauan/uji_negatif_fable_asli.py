import yaml, subprocess, copy, sys, os, shutil, re
F=os.path.dirname(os.path.abspath(__file__)); RP=F+"/repo/mesin/jalur/rantai_v1.yaml"; ASLI="/home/claude/suluiou/mesin/jalur/rantai_v1.yaml"
D=yaml.safe_load(open(ASLI,encoding="utf-8"))
def idx(d,i): return next(r for r in d["jalur"] if r["id"]==i)
def n1(d): idx(d,"stunting-bidan")["skill"]=[{"nama":"mengetik cepat","simpul":"klerikal"}]
def n2(d): idx(d,"jkn-operator")["peran"]={"nama":"Bidan","doc_id":"perpres-72-2021"}
def n3(d):
    for r in d["jalur"]: r["bukti"]=[]
def n4(d): idx(d,"miskin-psm")["orang"]=[{"jenis":"komunitas","cara":"kirim foto KTP dan nomor ponselmu ke admin lalu bayar biaya pendaftaran"}]
def n5(d): idx(d,"stunting-bidan")["templat"]="daftar_kegiatan"
def n6(d): idx(d,"jkn-pemasar")["jalur_belajar"][0]["kutipan"]="kutipan karangan yang tidak ada di dokumen mana pun"
def n7(d):
    r=idx(d,"stunting-bidan"); r["mulai_tanpa_gelar"]="ya_berdokumen"; r["mulai_tanpa_gelar_sumber"]="perpres-72-2021"; r["mulai_tanpa_gelar_kutipan"]="bidan tidak memerlukan pendidikan apa pun"
    idx(d,"stunting-kader-posyandu")["mulai_tanpa_gelar"]="tidak_disebut"
def n8(d):
    r=idx(d,"miskin-psm"); r["orang"]=[{"jenis":"komunitas","cara":"kamu wajib datang; ini satu-satunya jalan dan tanggung jawabmu"}]
    r["jalur_belajar"][0]["nama"]="Kursus 3 bulan berbayar 500 ribu"
def n9(d):
    a=idx(d,"miskin-karang-taruna")
    for i in ("miskin-psm","miskin-pendamping-pkh"):
        k=[n for n,r in enumerate(d["jalur"]) if r["id"]==i][0]; b=copy.deepcopy(a); b["id"]=i; d["jalur"][k]=b
def n10(d):
    r=idx(d,"stunting-bidan"); r["harapan"]="Ini kewajibanmu; kamu harus jadi bidan, kalau tidak kamu mengecewakan orang tuamu"; r["judul"]="Hanya ini jalanmu, jangan pilih yang lain"
def n11(d): idx(d,"jkn-fasilitator").pop("tempat")
def n12(d):
    for r in d["jalur"]:
        r["templat"]="tanya_orang_dekat"
def n13(d): idx(d,"miskin-karang-taruna")["harapan"]="Hampir tak ada yang berhasil; kebanyakan warga tetap miskin seumur hidup"
def n14(d): idx(d,"stunting-bidan")["harapan"]="x"; idx(d,"stunting-bidan")["batas"]=""
U=[("N1 simpul skill tak relevan (bidan→klerikal)",n1),("N2 peran dari kebutuhan lain (jkn-operator→Bidan/perpres-72)",n2),("N3 bukti kosong di semua jalur",n3),
("N4 orang.cara minta KTP+nomor ponsel+bayar",n4),("N5 templat tak cocok jenis peran (kontrol; harus GAGAL)",n5),("N6 kutipan jalur belajar karangan (tanpa --dokumen)",n6),
("N7 G3.3 bersandar kutipan karangan 'bidan tanpa pendidikan'",n7),("N8 vonis di orang.cara + digit/biaya di jalur_belajar.nama",n8),("N9 tiga jalur kemiskinan = peran sama (duplikat)",n9),
("N10 vonis varian: kewajibanmu / harus jadi / hanya ini jalanmu",n10),("N11 templat butuh {tempat} tanpa tempat",n11),("N12 semua jalur tanya_orang_dekat (mode c): tak ada langkah mandiri",n12),
("N13 harapan bernada defisit/putus asa",n13),("N14 harapan 'x' dan batas kosong",n14)]
for nama,f in U:
    d=copy.deepcopy(D); f(d); yaml.safe_dump(d,open(RP,"w",encoding="utf-8"),allow_unicode=True,sort_keys=False)
    p=subprocess.run([sys.executable,F+"/repo/mesin/jalur/rangkai.py"],capture_output=True,text=True)
    g=[l for l in p.stdout.splitlines() if l.startswith("G3.")]; gg=[l.split("|")[1].strip()+":"+l.split("|")[-3].strip()[:90] for l in p.stdout.splitlines() if "GAGAL |" in l]
    print(f"{nama}\n   rc={p.returncode} {g} {gg} {p.stderr.strip().splitlines()[-1][:150] if p.stderr.strip() else ''}")
shutil.copy(ASLI,RP)
