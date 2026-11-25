#!/usr/bin/env python3
"""Cek niat sebelum membangun atau mengklaim (penegak mekanis INSIDEN 18 Nov 14.29: 'belum ada' tanpa membaca yang tayang;
peran kader masuk sebagai arah padahal ditolak KEPUTUSAN 15 Nov 09.16).

Wajib dijalankan sesi mesin SEBELUM: (a) mulai satu serahan baru, (b) menyebut fitur Sulu 'belum ada' atau 'sudah ada',
(c) menulis daftar peran, teks untuk siswa, atau aturan pencocokan.

Pakai: python3 -I mesin/alat/cek_niat.py "kata1,kata2,..." [--main <folder suluiou-main>] [--buku <folder BUKU/masuk>]
Mencari kata kunci di: register niat Raihan (626 kutipan), berkas KOREKSI dan UJI setia-niat, Buku Pengetahuan, ARAH,
manifest terbaru, rancangan v3, dan kode yang tayang (src/, supabase/functions/). Keluaran: daftar temuan per sumber
+ blok 'Kartu niat' yang wajib ditempel di baris JAWAB/LOG-SESI. Ledger KEPUTUSAN tidak terjangkau dari skrip: blok itu
memuat kueri notion-search yang wajib dijalankan sesi."""
import glob, os, re, sys
A = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
def arg(k, d):
    return sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
kata = [k.strip() for k in sys.argv[1].split(",") if k.strip()]
MAIN = arg("--main", "/home/claude/suluiou-main"); BUKU = arg("--buku", "/mnt/user-data/uploads/MESIN/masuk")
SUMBER = {
 "register niat": glob.glob(os.path.join(A, "mesin/uji/REGISTER-NIAT_*.md")),
 "koreksi dan uji niat": glob.glob(os.path.join(A, "mesin/uji/KOREKSI_*.md")) + glob.glob(os.path.join(A, "mesin/uji/UJI_Setia-Niat_*.md")),
 "rancangan v3": glob.glob(os.path.join(A, "mesin/uji/RANCANGAN_Sambungan-Mesin_v3_*.md")),
 "buku, arah, manifest": sorted(glob.glob(os.path.join(BUKU, "BUKU_*.md")) + glob.glob(os.path.join(BUKU, "ARAH_*.md")))
                          + sorted(glob.glob(os.path.join(BUKU, "MANIFEST_*.md")))[-1:],
 "kode tayang": [p for p in glob.glob(os.path.join(MAIN, "src/**/*.ts*"), recursive=True) + glob.glob(os.path.join(MAIN, "supabase/functions/**/*.ts"), recursive=True)],
}
pola = re.compile(r"\b(" + "|".join(re.escape(k) for k in kata) + r")", re.I)
total = 0
for nama, berkas in SUMBER.items():
    hits = []
    for p in berkas:
        try:
            for i, l in enumerate(open(p, encoding="utf-8", errors="ignore"), 1):
                if pola.search(l): hits.append((os.path.relpath(p, A if p.startswith(A) else os.path.dirname(p)), i, l.strip()[:220]))
        except IsADirectoryError: pass
    total += len(hits)
    print(f"\n## {nama}: {len(hits)} temuan" + ("" if berkas else " (SUMBER TIDAK ADA: stage dulu)"))
    for h in hits[:12]: print(f"  {h[0]}:{h[1]}  {h[2]}")
    if len(hits) > 12: print(f"  ... {len(hits) - 12} lagi")
print(f"""
## Kartu niat (tempel di baris JAWAB/LOG-SESI)
- kata kunci: {', '.join(kata)} · temuan berkas: {total}
- Ledger: jalankan notion-search "{' '.join(kata[:3])} KEPUTUSAN" di data source Ledger, Stream Sulu; sebut kode KEPUTUSAN yang mengikat.
- kode tayang yang sudah melakukan hal serupa: (isi dari bagian 'kode tayang' di atas; bila ada, serahan MEMPERKAYA, tidak mengganti)
- niat yang dijaga: (sebut nomor U/V dari register atau rancangan v3)""")
