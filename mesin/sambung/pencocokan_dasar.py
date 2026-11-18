#!/usr/bin/env python3
"""L11 aturan dasar pencocokan bekal dan kebutuhan (prasyarat A15 "Titikmu"; juga dipakai A5, A7, A6).
Prinsip (rancangan v3 L11): tiap pertemuan bekal dan kebutuhan menyebut sumber atau aturan tertulisnya; yang tanpa dasar tidak tampil.

Tiga lapis keluaran per pertemuan (arah Raihan 18 Nov 2026 14.16):
  tampil      apa yang Sulu punya dan tampilkan: satu fakta bersumber tentang penduduk miskin di wilayah itu
  cari_tahu   apa yang Sulu dorong pengguna cari tahu sendiri: pertanyaan lapangan + kepada siapa bertanya (desa, RT, sekolah)
  jelajah     bahan jelajah bebas: prompt siap pakai yang membawa wilayah, kebutuhan, dan bekal (dipakai A7; di bawah 18 tanpa bekal)

Dasar kebutuhan: profil penduduk miskin DIKK 2025 (Tabel 3.1, 3.2, 4.1, 4.2, 6.1) per kab/kota. Aturan menyala hanya bila nilai wilayah
termasuk seperempat terberat di antara kab/kota yang punya angka (bukan NA). Dasar bekal: simpul peta keterampilan yang tayang
(src/data/skillMapContent.ts) dan medan `connections` simpul itu. Tanpa model bahasa.
Pakai: python3 -I pencocokan_dasar.py"""
import csv, json, os, statistics
S = os.path.dirname(os.path.abspath(__file__))
PROFIL = os.path.join(S, "..", "sumber", "masukan_kartu", "dikk2025_profil_miskin.csv")
DIKK_URL = "https://www.bps.go.id/id/publication/2025/11/28/f7534097ff9c717e794cd6e1/data-dan-informasi-kemiskinan-kabupaten--kota-tahun-2025.html"

ATURAN = [
 {"id": "P1", "kebutuhan": "kemiskinan-kabkota", "tema": "pendidikan orang dewasa",
  "kolom": "pend_sma_ke_atas", "arah": "rendah", "tabel": "DIKK 2025 Tabel 3.1 (hlm. 31)",
  "tampil": "Di {wilayah}, hanya {nilai} dari 100 penduduk miskin dewasa yang tamat SMA. Angka ini masuk seperempat terendah di antara kabupaten/kota se-Indonesia.",
  "bekal": ["mengajar", "komunikasi-kompleks", "empati", "pendidikan"],
  "arah_peran": ["pendamping belajar warga dewasa", "tutor program kesetaraan (Paket A, B, C)", "pengajar keterampilan di lembaga kursus desa"],
  "cari_tahu": ["Di desamu, adakah program kesetaraan atau tempat belajar untuk orang dewasa? Siapa pengelolanya?",
                "Kalau ada warga yang ingin lanjut belajar, apa yang paling menahan mereka: waktu, biaya, atau jarak?"],
  "tanya_ke": ["kantor desa", "PKBM terdekat", "guru di sekolahmu"]},
 {"id": "P2", "kebutuhan": "kemiskinan-kabkota", "tema": "anak usia SMP tidak sekolah",
  "kolom": "aps_13_15", "arah": "rendah", "tabel": "DIKK 2025 Tabel 3.2 (hlm. 47)",
  "tampil": "Di {wilayah}, {nilai} dari 100 anak usia 13 sampai 15 tahun dari keluarga miskin masih bersekolah. Angka ini masuk seperempat terendah di antara kabupaten/kota se-Indonesia.",
  "bekal": ["mengajar", "empati", "kepemimpinan", "pendidikan"],
  "arah_peran": ["pendamping belajar anak sekitar rumah", "kakak asuh atau mentor sebaya", "penggerak kelompok belajar di masjid, gereja, atau balai desa"],
  "cari_tahu": ["Adakah anak tetangga seumuran SMP yang tidak lagi sekolah? Tanyakan alasannya dengan hormat, tanpa menyebut nama di catatanmu.",
                "Apa yang sudah dilakukan sekolah atau desa untuk anak yang berhenti sekolah?"],
  "tanya_ke": ["wali kelas atau Guru BK", "ketua RT", "kantor desa"]},
 {"id": "P3", "kebutuhan": "kemiskinan-kabkota", "tema": "penduduk miskin bekerja di pertanian",
  "kolom": "kerja_pertanian", "arah": "tinggi", "tabel": "DIKK 2025 Tabel 4.2 (hlm. 84)",
  "tampil": "Di {wilayah}, {nilai} dari 100 penduduk miskin dewasa bekerja di pertanian. Angka ini masuk seperempat tertinggi di antara kabupaten/kota se-Indonesia.",
  "bekal": ["pertanian-modern", "literasi-teknologi", "kepedulian-lingkungan", "berpikir-sistemik"],
  "arah_peran": ["penyuluh pertanian", "pengolah hasil panen supaya harganya naik", "penghubung petani dengan pembeli"],
  "cari_tahu": ["Tanya satu petani di dekatmu: berapa harga jual panen terakhirnya, dan ke mana ia menjualnya?",
                "Apa masalah terbesar petani di desamu musim ini: air, pupuk, harga, atau tenaga muda?"],
  "tanya_ke": ["petani atau kelompok tani", "penyuluh pertanian di kecamatan", "kantor desa"]},
 {"id": "P4", "kebutuhan": "kemiskinan-kabkota", "tema": "penduduk miskin bekerja informal",
  "kolom": "kerja_informal", "arah": "tinggi", "tabel": "DIKK 2025 Tabel 4.1 (hlm. 67)",
  "tampil": "Di {wilayah}, {nilai} dari 100 penduduk miskin dewasa bekerja di sektor informal, tanpa kontrak tetap. Angka ini masuk seperempat tertinggi di antara kabupaten/kota se-Indonesia.",
  "bekal": ["manajemen-proyek", "literasi-teknologi", "keuangan-syariah", "komunikasi-kompleks"],
  "arah_peran": ["pendamping usaha kecil", "pengurus koperasi atau BUMDes", "pengajar pembukuan sederhana"],
  "cari_tahu": ["Pilih satu warung atau usaha kecil di dekat rumah. Tanyakan apa yang paling sulit: modal, pembeli, atau pencatatan uang?",
                "Adakah koperasi atau BUMDes di desamu? Apa yang sudah dan belum berjalan?"],
  "tanya_ke": ["pemilik usaha kecil", "pengurus koperasi atau BUMDes", "kantor desa"]},
 {"id": "P5", "kebutuhan": "pengangguran-terbuka-kabkota", "tema": "penduduk miskin tidak bekerja",
  "kolom": "tidak_bekerja", "arah": "tinggi", "tabel": "DIKK 2025 Tabel 4.1 (hlm. 67)",
  "tampil": "Di {wilayah}, {nilai} dari 100 penduduk miskin dewasa tidak bekerja. Angka ini masuk seperempat tertinggi di antara kabupaten/kota se-Indonesia.",
  "bekal": ["komunikasi-kompleks", "literasi-teknologi", "mengajar", "manajemen-proyek"],
  "arah_peran": ["penghubung info lowongan dan pelatihan", "pelatih keterampilan kerja", "penggerak usaha bersama warga"],
  "cari_tahu": ["Tanya dua orang dewasa yang sedang mencari kerja: dari mana mereka biasanya tahu ada lowongan?",
                "Adakah balai latihan kerja atau pelatihan desa yang bisa diikuti warga? Seberapa jauh dan berapa biayanya?"],
  "tanya_ke": ["kantor desa", "Karang Taruna", "keluarga atau tetangga yang sedang mencari kerja"]},
 {"id": "P6", "kebutuhan": "kemiskinan-kabkota", "tema": "air layak dan jamban",
  "kolom": "air_layak", "arah": "rendah", "tabel": "DIKK 2025 Tabel 6.1",
  "tampil": "Di {wilayah}, hanya {nilai} dari 100 rumah tangga miskin yang memakai air layak. Angka ini masuk seperempat terendah di antara kabupaten/kota se-Indonesia.",
  "bekal": ["kesehatan", "kepedulian-lingkungan", "berpikir-sistemik", "manajemen-proyek"],
  "arah_peran": ["kader kesehatan lingkungan", "pengelola sarana air bersih desa", "penggerak warga untuk sanitasi"],
  "cari_tahu": ["Dari mana keluarga di sekitarmu mengambil air minum? Berapa jauh dan berapa lama?",
                "Siapa yang mengurus sarana air bersih di desamu, dan apa kendalanya?"],
  "tanya_ke": ["Posyandu atau puskesmas", "pengelola air desa", "kantor desa"]},
]
PROMPT = ("Saya tinggal di {wilayah}. Menurut BPS (data 2025), {fakta_ringkas}. "
          "Bantu saya memahami masalah ini di daerah saya: apa saja penyebab yang mungkin, siapa saja yang sudah bergerak, "
          "dan satu langkah kecil yang bisa saya coba minggu ini. {bekal_kalimat}Sebutkan sumber untuk tiap klaim, dan tandai mana yang perlu saya cek sendiri.")
BEKAL_KALIMAT = "Kekuatan yang saya punya: {bekal}. "

def fakta(a, nama, nilai):
    t = a["tampil"].format(wilayah=nama, nilai=nilai).split(". Angka ini")[0]
    return t.replace("Di " + nama + ", ", "di " + nama + " ")

def f(x):
    try: return float(x)
    except (TypeError, ValueError): return None

def main():
    rows = [r for r in csv.DictReader(open(PROFIL, encoding="utf-8")) if r["tingkat"] == "kabkota"]
    hasil = {}
    ambang = {}
    for a in ATURAN:
        vals = sorted(v for v in (f(r[a["kolom"]]) for r in rows) if v is not None)
        q = statistics.quantiles(vals, n=4)
        batas = q[0] if a["arah"] == "rendah" else q[2]
        ambang[a["id"]] = {"kolom": a["kolom"], "arah": a["arah"], "batas_kuartil": round(batas, 2), "n_berangka": len(vals)}
        for r in rows:
            v = f(r[a["kolom"]])
            if v is None: continue
            nyala = v <= batas if a["arah"] == "rendah" else v >= batas
            if not nyala: continue
            nilai = str(round(v)).replace(".", ",")
            nama = r["nama"] if r["nama"].startswith("Kota ") else "Kab. " + r["nama"]
            hasil.setdefault(r["kode_bps"], []).append({
                "aturan": a["id"], "kebutuhan": a["kebutuhan"], "nilai": v,
                "tampil": a["tampil"].format(wilayah=nama, nilai=nilai),
                "dasar": {"kebutuhan": a["tabel"] + ", " + DIKK_URL, "bekal": "simpul peta keterampilan: " + ", ".join(a["bekal"])},
                "bekal": a["bekal"], "arah_peran_contoh": a["arah_peran"],
                "cari_tahu": a["cari_tahu"], "tanya_ke": a["tanya_ke"],
                "jelajah_prompt_dewasa": PROMPT.format(wilayah=nama, fakta_ringkas=fakta(a, nama, nilai), bekal_kalimat=BEKAL_KALIMAT.format(bekal="{bekal_pengguna}")),
                "jelajah_prompt_bawah_18": PROMPT.format(wilayah=nama, fakta_ringkas=fakta(a, nama, nilai), bekal_kalimat="") + " Saya akan membaca jawabannya bersama orang tua atau guru."})
    out = {"skema": "pencocokan-dasar/1", "dibuat": "18 Nov 2026, sesi mesin Sulu (L11)",
           "label": "SINTESIS aturan; fakta dari DIKK 2025, arah peran berbentuk contoh berjamak, tanpa vonis",
           "aturan_umum": ["Pertemuan bekal dan kebutuhan tampil hanya bila aturannya menyala untuk wilayah itu (nilai di seperempat terberat).",
                           "Arah peran selalu contoh berjamak, bukan saran tunggal; kalimat pengantar di aplikasi memakai bahasa provisional.",
                           "Bekal pengguna di bawah 18 tidak masuk prompt jelajah (aturan A6/A7); pencocokan bekal untuk mereka dikerjakan di aplikasi dari pilihan terstruktur.",
                           "Wilayah tanpa aturan menyala menampilkan lapis cari_tahu umum dari kartu kebutuhannya, tanpa klaim pertemuan."],
           "ambang": ambang, "aturan": ATURAN, "wilayah": hasil,
           "ringkas": {"wilayah_dengan_pertemuan": len(hasil), "total_pertemuan": sum(len(v) for v in hasil.values()),
                       "per_aturan": {a["id"]: sum(1 for v in hasil.values() for x in v if x["aturan"] == a["id"]) for a in ATURAN}}}
    p = os.path.join(S, "keluaran", "pencocokan_dasar.json")
    json.dump(out, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(json.dumps(out["ringkas"], ensure_ascii=False)); print(json.dumps(ambang, ensure_ascii=False))

if __name__ == "__main__": main()
