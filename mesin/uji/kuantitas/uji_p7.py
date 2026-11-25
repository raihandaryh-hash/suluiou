#!/usr/bin/env python3
"""Uji tetap regex kuantitas v2.2 dari tinjauan Fable 15 Nov P7. Kalimat peran wajar wajib lolos daftar peran; nama wilayah nyata
wajib lolos sesudah dibuang (rangkai.NAMA_WILAYAH); kalimat kartu yang lolos v2.1 wajib tertangkap daftar ketat. Keluar 1 bila ada yang gagal."""
import os, sys
AKAR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(AKAR, "jalur")); sys.argv = [sys.argv[0]]
import importlib.util
sp = importlib.util.spec_from_file_location("rk", os.path.join(AKAR, "jalur", "rangkai.py")); RK = importlib.util.module_from_spec(sp); sp.loader.exec_module(RK)
PERAN_WAJAR = ["Pada umumnya kader bertugas di posyandu.", "Kader belajar dari setiap kunjungan rumah.", "Kamu menjadi penghubung di antara dua pihak.",
               "Pendidikan tertinggi yang kamu tamatkan dicatat di formulir.", "Lomba posyandu se-kecamatan diadakan tiap tahun.",
               "Keluarga adalah unit terkecil masyarakat.", "Kebanyakan tugas dikerjakan di lapangan.", "Mencoba lebih baik daripada menunggu.",
               "Nilai rata-rata ijazah tidak menjadi syarat.", "Usia paling rendah delapan belas tahun."]
WILAYAH = ["Di Kab. Kepulauan Seribu, kader posyandu menimbang balita.", "Kader di Lima Puluh Kota mendampingi keluarga."]
KARTU_TANGKAP = ["Stunting di wilayah ini paling tinggi di antara kecamatan lain.", "Kasus balita pendek paling banyak se-Jawa Barat.",
                 "Hampir setiap rumah belum punya jamban.", "Penduduk tanpa JKN sangat banyak di sini.", "Jumlah penganggur tidak sedikit.",
                 "Sejumlah besar balita belum ditimbang.", "Angka kemiskinan tinggi sekali.", "Pengangguran terendah tercatat di sini."]
gagal = [("peran tertangkap", t) for t in PERAN_WAJAR if RK.KATA_KUANTITAS_PERAN.search(t)]
gagal += [("wilayah tertangkap", t) for t in WILAYAH if RK.KATA_KUANTITAS.search(RK.NAMA_WILAYAH.sub("", t)) or RK.KATA_KUANTITAS_PERAN.search(RK.NAMA_WILAYAH.sub("", t))]
gagal += [("kartu lolos", t) for t in KARTU_TANGKAP if not RK.KATA_KUANTITAS.search(t)]
print(f"uji P7: {len(PERAN_WAJAR) + len(WILAYAH) + len(KARTU_TANGKAP)} kalimat, {len(gagal)} gagal")
for g in gagal: print("  ", *g)
sys.exit(1 if gagal else 0)
