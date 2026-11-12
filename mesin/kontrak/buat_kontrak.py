import json, copy, sys, os
from jsonschema import Draft202012Validator
os.chdir(sys.argv[1])
TANPA_DIGIT = "^[^0-9]*$"
DAFTAR_PUTIH = "^https://([a-z0-9-]+\\.)*(go\\.id|who\\.int|unicef\\.org|ilo\\.org)(/|$)"
import re
KATA_KUANTITAS = re.compile(r"(?i)\b(persen|separuh|setengah|sepertiga|seperempat|sebagian besar|mayoritas|minoritas|hampir semua|ribuan|jutaan|puluhan|ratusan|dua kali|tiga kali|berlipat|satu dari|dua dari|tiga dari|empat dari|lima dari|dari sepuluh|dari seratus|banyak sekali|[a-z]*puluh|[a-z]*belas|[a-z]*ratus|ribu|juta|miliar)")
sumber = {"type":"object","required":["sumber_id","url"],"additionalProperties":False,
  "properties":{"sumber_id":{"type":"string"},"url":{"type":["string","null"],"format":"uri"}}}
kontak = {"type":"object","required":["jenis","cara"],"additionalProperties":False,
  "properties":{"jenis":{"enum":["guru_bk","orang_tua","career_center","praktisi","komunitas","orang_terdekat"]},"cara":{"type":"string"}}}
umum = {
  "id":{"type":"string"},
  "judul":{"type":"string","pattern":TANPA_DIGIT,"minLength":3},
  "langkah_pertama":{"type":"object","required":["teks","paling_lama_hari","butuh_orang_lain"],"additionalProperties":False,
     "properties":{"teks":{"type":"string","pattern":TANPA_DIGIT},"paling_lama_hari":{"type":"integer","minimum":1,"maximum":30},"butuh_orang_lain":{"type":"boolean"}}},
  "orang_untuk_ditanya":{"type":"array","minItems":1,"items":kontak},
  "keyakinan":{"enum":["tinggi","sedang","rendah"]},
  "batas":{"type":"string","pattern":TANPA_DIGIT},
  "bukti_cara_kerja":{"type":"array","items":sumber},
  "harapan":{"type":"string","pattern":TANPA_DIGIT,"minLength":10,"description":"aturan Jalan Tengah 5: apa yang sudah berhasil atau apa yang bisa dilakukan satu orang"}
}
req_umum = ["id","jenis","judul","langkah_pertama","orang_untuk_ditanya","keyakinan","batas","bukti_cara_kerja","harapan"]
angka = {"type":"object","required":["kode","nilai","satuan","tahun_data","label","sumber_id","sumber_nama","url","sha256","keandalan"],"additionalProperties":False,
  "properties":{"kode":{"type":"string"},"nilai":{"type":"number"},"satuan":{"type":"string"},"tahun_data":{"type":"integer","minimum":2000},
  "label":{"type":"string"},"sumber_id":{"type":"string"},"sumber_nama":{"type":"string","minLength":3},"url":{"type":"string"},"sha256":{"type":"string","pattern":"^[0-9a-f]{64}$"},
  "keandalan":{"enum":["andal","hati_hati","tidak_diketahui","administratif"]}}}
kebutuhan = {"type":"object","required":["kartu_id","kartu_versi","wilayah_kode","tingkat","berlaku_sampai","ringkasan"],"additionalProperties":False,
  "properties":{"kartu_id":{"type":"string"},"kartu_versi":{"type":"string"},"wilayah_kode":{"type":"string","pattern":"^[0-9]{2}([0-9]{2})?$|^00$"},
  "tingkat":{"enum":["kabkota","provinsi","nasional"]},"berlaku_sampai":{"type":"string","format":"date"},
  "ringkasan":{"type":"string","description":"placeholder {kode} hanya merujuk angka_kunci pada jalur yang sama"}}}
peran = {"type":"object","required":["nama","kbji_kode","jenis","sumber_id"],"additionalProperties":False,
  "properties":{"nama":{"type":"string"},"kbji_kode":{"type":["string","null"]},"jenis":{"enum":["formal","nonformal","sukarela","belum_bernama"]},"sumber_id":{"type":["string","null"]}},
  "if":{"properties":{"jenis":{"enum":["formal","nonformal","sukarela"]}}},"then":{"properties":{"sumber_id":{"type":"string","minLength":1}}}}
belajar = {"type":"object","required":["nama","jenis","penyelenggara","url","sumber_id","milik_iou"],"additionalProperties":False,
  "properties":{"nama":{"type":"string"},"jenis":{"enum":["prodi","kursus","magang","komunitas","mandiri"]},"penyelenggara":{"type":["string","null"]},
  "url":{"type":["string","null"]},"sumber_id":{"type":"string"},"milik_iou":{"type":"boolean"}}}
def varian(jenis, extra_props, extra_req):
    p = copy.deepcopy(umum); p["jenis"]={"const":jenis}; p.update(extra_props)
    return {"type":"object","additionalProperties":False,"required":req_umum+extra_req,"properties":p}
j_data = varian("data",{"kebutuhan":kebutuhan,"angka_kunci":{"type":"array","minItems":1,"maxItems":3,"items":angka},
   "peran_contoh":{"type":"array","minItems":1,"items":peran},"skill":{"type":"array","minItems":1,"items":{"type":"object","required":["nama","simpul_skillmap"],"properties":{"nama":{"type":"string"},"simpul_skillmap":{"type":["string","null"]}},"additionalProperties":False}},
   "jalur_belajar":{"type":"array","items":belajar}},["kebutuhan","angka_kunci","peran_contoh","skill","jalur_belajar"])
j_cipta = varian("cipta",{"kartu_id":{"type":["string","null"]},"undangan":{"type":"string","pattern":TANPA_DIGIT}},["kartu_id","undangan"])
j_lain = varian("jalan_lain",{"tujuan":{"type":"string","pattern":TANPA_DIGIT},"peran_contoh":{"type":"array","items":peran}},["tujuan","peran_contoh"])
jalur_item = {"oneOf":[j_data,j_cipta,j_lain]}
schema = {
 "$schema":"https://json-schema.org/draft/2020-12/schema",
 "$id":"https://sulu.iou/kontrak/jalur-jelajah-1.schema.json",
 "title":"jalur-jelajah/1","type":"object","additionalProperties":False,
 "required":["bingkai_nilai_id","kontrak","id_permintaan","dibuat","versi_mesin","versi_data","status","untuk","jalur","rujukan","untuk_pemilik","pernyataan","pemberitahuan_tarik","jejak"],
 "properties":{
  "kontrak":{"const":"jalur-jelajah/1"},
  "id_permintaan":{"type":"string","description":"kunci idempotensi: masukan sama + versi_data sama = keluaran sama"},
  "dibuat":{"type":"string","format":"date-time"},"versi_mesin":{"type":"string"},"versi_data":{"type":"string"},
  "status":{"enum":["ok","tanpa_kartu","ditahan_rujukan"]},
  "untuk":{"type":"object","additionalProperties":False,"required":["peran","jenjang","situasi","kode_provinsi","kode_kabkota","mode_ai","tujuan_di_luar_bank"],
    "properties":{"peran":{"enum":["siswa","mahasiswa","orang_tua","guru_bk","guru","umum"]},
      "jenjang":{"enum":["kelas_10_11","kelas_12","baru_lulus",None]},
      "situasi":{"enum":["belajar","bekerja","mencari_kerja","merawat_keluarga","lainnya",None]},
      "kode_provinsi":{"type":"string","pattern":"^[0-9]{2}$"},"kode_kabkota":{"type":["string","null"],"pattern":"^[0-9]{4}$"},
      "mode_ai":{"enum":["dewasa","c"]},"tujuan_di_luar_bank":{"type":"boolean"}}},
  "jalur":{"type":"array","maxItems":5,"items":jalur_item},
  "rujukan":{"type":["object","null"],"additionalProperties":False,"required":["jenis","teks_tetap_id","kontak"],
    "properties":{"jenis":{"const":"distress"},"teks_tetap_id":{"type":"string"},"kontak":{"type":"array","minItems":1,"items":{"enum":["guru_bk","orang_tua","orang_dewasa_tepercaya","hsa","layanan_resmi"]}}}},
  "untuk_pemilik":{"type":"object","additionalProperties":False,"required":["alasan"],"description":"hanya dirender untuk pemilik akun; tidak untuk orang tua atau guru BK",
    "properties":{"alasan":{"type":"array","items":{"type":"object","required":["jalur_id","dari_profil","teks"],"additionalProperties":False,
      "properties":{"jalur_id":{"type":"string"},"dari_profil":{"type":"array","items":{"type":"string"}},"teks":{"type":"string","pattern":TANPA_DIGIT}}}}}},
  "bingkai_nilai_id":{"const":None,"description":"id teks tetap dari bank bingkai nilai yang disetujui Raihan (gerbang dalil); tidak pernah ditulis model"},
  "pernyataan":{"type":"object","additionalProperties":False,"required":["jalan_lain_sah","bukan_fatwa","teks_tetap_id"],
    "properties":{"jalan_lain_sah":{"const":True},"bukan_fatwa":{"const":True},"teks_tetap_id":{"type":"string"}}},
  "pemberitahuan_tarik":{"type":"array","items":{"type":"object","required":["kartu_id","kartu_versi","alasan","pengganti"],"additionalProperties":False,
    "properties":{"kartu_id":{"type":"string"},"kartu_versi":{"type":"string"},"alasan":{"type":"string"},"pengganti":{"type":["string","null"]}}}},
  "jejak":{"type":"object","required":["kartu_dipakai","gerbang","model"],"properties":{"kartu_dipakai":{"type":"array","items":{"type":"string"}},"gerbang":{"type":"object"},"model":{"type":"object"}}}
 },
 "allOf":[
  {"if":{"properties":{"status":{"enum":["ok","tanpa_kartu"]}}},"then":{"properties":{"jalur":{"contains":{"properties":{"langkah_pertama":{"properties":{"butuh_orang_lain":{"const":False}}}}}}}}},
  {"if":{"properties":{"status":{"const":"ok"}}},"then":{"properties":{"jalur":{"minItems":3},"rujukan":{"type":"null"}},
     "allOf":[{"properties":{"jalur":{"contains":{"properties":{"jenis":{"const":"cipta"}}}}}},
              {"properties":{"jalur":{"contains":{"properties":{"jenis":{"const":"jalan_lain"}}}}}}]}},
  {"if":{"properties":{"status":{"const":"ok"},"untuk":{"properties":{"tujuan_di_luar_bank":{"const":False}}}}},
   "then":{"properties":{"jalur":{"contains":{"properties":{"jenis":{"const":"data"}}}}}}},
  {"if":{"properties":{"status":{"const":"tanpa_kartu"}}},"then":{"properties":{"jalur":{"minItems":2,"items":{"not":{"properties":{"jenis":{"const":"data"}},"required":["jenis"]}}},"rujukan":{"type":"null"}}}},
  {"if":{"properties":{"status":{"const":"ditahan_rujukan"}}},"then":{"properties":{"jalur":{"maxItems":0},"rujukan":{"type":"object"}}}},
  {"if":{"properties":{"untuk":{"properties":{"tujuan_di_luar_bank":{"const":True}}}}},"then":{"properties":{"jalur":{"prefixItems":[{"properties":{"jenis":{"const":"jalan_lain"}}}]}}}},
  {"if":{"properties":{"untuk":{"properties":{"peran":{"const":"siswa"}}}}},"then":{"properties":{"untuk":{"properties":{"mode_ai":{"const":"c"}}}}},
   "else":{"properties":{"untuk":{"properties":{"jenjang":{"type":"null"}}}}}},
  {"if":{"properties":{"untuk":{"properties":{"mode_ai":{"const":"c"}}}}},"then":{"properties":{"jalur":{"items":{"properties":{
      "orang_untuk_ditanya":{"items":{"properties":{"jenis":{"enum":["guru_bk","orang_tua","career_center","orang_terdekat"]}}}},
      "jalur_belajar":{"items":{"properties":{"url":{"type":"null"}}}},
      "bukti_cara_kerja":{"items":{"properties":{"url":{"anyOf":[{"type":"null"},{"type":"string","pattern":DAFTAR_PUTIH}]}}}},
      "angka_kunci":{"items":{"properties":{"url":{"type":"string","pattern":DAFTAR_PUTIH}}}}}}}}}}
 ]}
json.dump(schema, open("jalur-jelajah-1.schema.json","w"), ensure_ascii=False, indent=1)
SHA = "0"*64
def dasar(mode="dewasa", peran_="umum", jen=None, sit="bekerja", luar=False, kk=None):
    return {"kontrak":"jalur-jelajah/1","id_permintaan":"contoh","dibuat":"2026-11-12T03:00:00+07:00","versi_mesin":"mesin@contoh","versi_data":"2026.1",
     "status":"ok","untuk":{"peran":peran_,"jenjang":jen,"situasi":sit,"kode_provinsi":"32","kode_kabkota":kk,"mode_ai":mode,"tujuan_di_luar_bank":luar},
     "jalur":[],"rujukan":None,"untuk_pemilik":{"alasan":[]},
     "pernyataan":{"jalan_lain_sah":True,"bukan_fatwa":True,"teks_tetap_id":"teks-tetap-1"},"pemberitahuan_tarik":[],
     "jejak":{"kartu_dipakai":[],"gerbang":{},"model":{}},"bingkai_nilai_id":None}
def jl(mode="dewasa"):
    kon = [{"jenis":"guru_bk","cara":"tanyakan di jam BK"}] if mode=="c" else [{"jenis":"praktisi","cara":"lewat Career Center"}]
    return {"id":"j-data","jenis":"data","judul":"Banyak balita di daerahmu belum tumbuh optimal",
      "kebutuhan":{"kartu_id":"stunting-balita.3204","kartu_versi":"2026.1","wilayah_kode":"3204","tingkat":"kabkota","berlaku_sampai":"2027-12-31","ringkasan":"Prevalensi stunting balita di kabupaten ini {prevalensi_stunting}."},
      "angka_kunci":[{"kode":"prevalensi_stunting","nilai":0.0,"satuan":"persen","tahun_data":2024,"label":"prevalensi stunting balita","sumber_id":"ssgi-2024","sumber_nama":"Survei Status Gizi Indonesia 2024, Kemenkes","url":"https://www.badankebijakan.kemkes.go.id/contoh","sha256":SHA,"keandalan":"andal"}],
      "peran_contoh":[{"nama":"kader posyandu","kbji_kode":None,"jenis":"sukarela","sumber_id":"pedoman-contoh"}],
      "skill":[{"nama":"komunikasi","simpul_skillmap":None}],
      "jalur_belajar":[{"nama":"pelatihan kader","jenis":"kursus","penyelenggara":None,"url":None,"sumber_id":"pedoman-contoh","milik_iou":False}],
      "langkah_pertama":{"teks":"Datangi posyandu terdekat dan tanyakan apa yang paling kurang","paling_lama_hari":14,"butuh_orang_lain":True},
      "orang_untuk_ditanya":kon,"keyakinan":"sedang","batas":"angka tingkat kabupaten, bukan desa","bukti_cara_kerja":[],"harapan":"Posyandu yang aktif sudah terbukti menolong, dan kamu bisa ikut membantunya"}
def jc(mode="dewasa"):
    kon = [{"jenis":"guru_bk","cara":"ceritakan gagasanmu"}] if mode=="c" else [{"jenis":"orang_terdekat","cara":"minta pendapat"}]
    return {"id":"j-cipta","jenis":"cipta","judul":"Rancang caramu sendiri","kartu_id":"stunting-balita.3204","undangan":"Tulis dulu gagasanmu sendiri",
      "langkah_pertama":{"teks":"Tulis satu gagasan lalu uji kecil","paling_lama_hari":30,"butuh_orang_lain":False},"orang_untuk_ditanya":kon,"keyakinan":"sedang","batas":"belum diuji","bukti_cara_kerja":[],"harapan":"Gagasan kecil yang kamu uji sendiri bisa menjadi awal yang berarti"}
def jo(mode="dewasa", tujuan="jalan hidup lain yang kamu pilih"):
    kon = [{"jenis":"orang_tua","cara":"bicarakan"}] if mode=="c" else [{"jenis":"komunitas","cara":"cari kelompok sebaya"}]
    return {"id":"j-lain","jenis":"jalan_lain","judul":"Jalan yang kamu pilih juga bermakna","tujuan":tujuan,"peran_contoh":[],
      "langkah_pertama":{"teks":"Tulis apa yang ingin kamu tekuni pekan ini","paling_lama_hari":7,"butuh_orang_lain":False},"orang_untuk_ditanya":kon,"keyakinan":"tinggi","batas":"mesin tidak menilai pilihan ini","bukti_cara_kerja":[],"harapan":"Pilihanmu ini juga jalan bermanfaat bagi dirimu dan sesama"}
fx = {}
a = dasar("c","siswa","kelas_12",None); a["jalur"]=[jl("c"),jc("c"),jo("c")]; fx["01_siswa_bawah18_ok"]=a
b = dasar("dewasa","umum",None,"merawat_keluarga",True); b["jalur"]=[jo(tujuan="merawat keluarga"),jl(),jc()]; fx["02_umum_merawat_keluarga"]=b
c = dasar("dewasa","mahasiswa",None,"belajar",False,"3273"); c["status"]="tanpa_kartu"; c["jalur"]=[jc(),jo()]; fx["03_tanpa_kartu"]=c
d = dasar("c","siswa","kelas_10_11",None); d["status"]="ditahan_rujukan"; d["rujukan"]={"jenis":"distress","teks_tetap_id":"rujukan-siswa","kontak":["guru_bk","orang_tua","layanan_resmi"]}; fx["04_distress"]=d
e = dasar("dewasa","guru_bk",None,"bekerja"); e["jalur"]=[jl(),jc(),jo()]; e["pemberitahuan_tarik"]=[{"kartu_id":"stunting-balita.3204","kartu_versi":"2025.9","alasan":"angka salah ekstraksi","pengganti":"2026.1"}]; fx["05_dengan_penarikan"]=e
f = dasar("dewasa","orang_tua",None,"bekerja"); f["jalur"]=[jl(),jc(),jo()]; f["untuk_pemilik"]={"alasan":[{"jalur_id":"j-data","dari_profil":["medan:K1"],"teks":"Kamu memilih medan kesehatan"}]}; fx["06_orang_tua_dewasa"]=f
g = copy.deepcopy(a); g["jalur"][0]["judul"]="Sebanyak 20 persen balita"; fx["X1_gagal_angka_di_judul"]=g
h = copy.deepcopy(a); h["jalur"][0]["orang_untuk_ditanya"]=[{"jenis":"praktisi","cara":"DM"}]; fx["X2_gagal_bawah18_praktisi"]=h
i = copy.deepcopy(b); i["jalur"]=[jl(),jc(),jo()]; fx["X3_gagal_jalan_lain_bukan_pertama"]=i
k = dasar("dewasa","umum",None,"bekerja"); k["jalur"]=[jl(),jl(),jc()]; k["jalur"][1]["id"]="j2"; fx["X4_gagal_tanpa_jalan_lain"]=k
m = dasar("dewasa","umum",None,"bekerja"); m["jalur"]=[jc(),jo(),jc()]; m["jalur"][2]["id"]="j3"; fx["X5_gagal_ok_tanpa_data"]=m
from jsonschema import FormatChecker
n6 = copy.deepcopy(f); n6["jalur"][0]["peran_contoh"][0]["sumber_id"]=None; fx["X6_gagal_peran_tanpa_sumber"]=n6
n7 = copy.deepcopy(f); n7["jalur"][0]["judul"]="Sebanyak dua puluh persen balita"; fx["X7_gagal_kuantitas_kata"]=n7
n8 = copy.deepcopy(f); n8["jalur"][0]["kebutuhan"]["ringkasan"]="Angka {kode_lain}."; fx["X8_gagal_placeholder_asing"]=n8
n9 = copy.deepcopy(f); n9["jalur"][1]["id"]="j-data"; fx["X9_gagal_id_ganda"]=n9
n10 = dasar("dewasa","siswa","kelas_12",None); n10["jalur"]=[jl(),jc(),jo()]; fx["X10_gagal_siswa_mode_dewasa"]=n10
n11 = copy.deepcopy(a); n11["jalur"][0]["bukti_cara_kerja"]=[{"sumber_id":"blog","url":"https://contoh-blog.com/x"}]; fx["X11_gagal_bawah18_url_luar"]=n11
n12 = copy.deepcopy(f); n12["dibuat"]="kemarin"; fx["X12_gagal_format_tanggal"]=n12
n13 = copy.deepcopy(f); n13["untuk"]["jenjang"]="kelas_12"; fx["X13_gagal_jenjang_bukan_siswa"]=n13
n14 = copy.deepcopy(f); n14["jalur"][0]["batas"]="empat dari sepuluh desa"; fx["X14_gagal_kuantitas_dari"]=n14
n15 = copy.deepcopy(f); n15["jalur"][0]["kebutuhan"]["ringkasan"]="Angka {KodeLain}."; fx["X15_gagal_placeholder_kapital"]=n15
n16 = copy.deepcopy(f)
for j in n16["jalur"]: j["langkah_pertama"]["butuh_orang_lain"]=True
fx["X16_gagal_tanpa_langkah_mandiri"]=n16
n17 = copy.deepcopy(f); del n17["jalur"][0]["harapan"]; fx["X17_gagal_tanpa_harapan"]=n17
n19 = copy.deepcopy(f); n19["jalur"][0]["skill"]=[]; fx["X18_gagal_skill_kosong"]=n19
n20 = copy.deepcopy(f); n20["bingkai_nilai_id"]="dalil-buatan-model-1"; fx["X19_gagal_bingkai_sebelum_bank"]=n20
n21 = copy.deepcopy(f); del n21["jalur"][0]["angka_kunci"][0]["sumber_nama"]; fx["X20_gagal_angka_tanpa_nama_sumber"]=n21
n18 = copy.deepcopy(a); n18["jalur"][1]["orang_untuk_ditanya"]=[{"jenis":"orang_terdekat","cara":"kirim dari WhatsApp-mu sendiri"}]; fx["07_bawah18_orang_terdekat"]=n18
V = Draft202012Validator(schema, format_checker=FormatChecker()); hasil=[]
def periksa_tambahan(o):
    salah=[]
    ids=[j.get("id") for j in o.get("jalur",[])]
    if len(ids)!=len(set(ids)): salah.append("id jalur ganda")
    for a in o.get("untuk_pemilik",{}).get("alasan",[]):
        if a.get("jalur_id") not in ids: salah.append("alasan menunjuk jalur yang tidak ada")
    for j in o.get("jalur",[]):
        teks=[j.get("judul",""),j.get("batas",""),j.get("harapan",""),j.get("langkah_pertama",{}).get("teks",""),j.get("undangan",""),j.get("tujuan","")]
        if j.get("jenis")=="data": teks.append(re.sub(r"\{[A-Za-z0-9_]+\}","",j["kebutuhan"]["ringkasan"]))
        for t in teks:
            if KATA_KUANTITAS.search(t or ""): salah.append("kuantitas dalam kata: "+t[:40])
        if j.get("jenis")=="data":
            kode={a["kode"] for a in j["angka_kunci"]}
            for ph in re.findall(r"\{([A-Za-z0-9_]+)\}", j["kebutuhan"]["ringkasan"]):
                if ph not in kode: salah.append("placeholder asing: "+ph)
            if re.search(r"[0-9]", re.sub(r"\{[A-Za-z0-9_]+\}","",j["kebutuhan"]["ringkasan"])): salah.append("digit di ringkasan")
    for a in o.get("untuk_pemilik",{}).get("alasan",[]):
        if KATA_KUANTITAS.search(a.get("teks","")): salah.append("kuantitas dalam kata di alasan")
    # G4.10 bekal kaya
    for j in o.get("jalur",[]):
        if j.get("jenis")=="data":
            if not j.get("peran_contoh") or not j.get("skill") or not j.get("harapan") or not j.get("batas"):
                salah.append("bekal tidak lengkap")
            for a in j.get("angka_kunci",[]):
                if not a.get("sumber_nama") or not a.get("tahun_data"): salah.append("angka tanpa nama sumber atau tahun")
    return salah
def validasi(o):
    return [e.message[:80] for e in V.iter_errors(o)] + periksa_tambahan(o)
os.makedirs("fixture", exist_ok=True)
for n,o in fx.items():
    json.dump(o, open(f"fixture/{n}.json","w"), ensure_ascii=False, indent=1)
    err = validasi(o)
    ok = not err; harap = not n.startswith("X")
    hasil.append((n, "lolos" if ok else "gagal", "SESUAI" if ok==harap else "TIDAK SESUAI", (err[0][:80] if err else "")))
for r in hasil: print(" | ".join(r))
print("sesuai:", sum(r[2]=="SESUAI" for r in hasil), "dari", len(hasil))
