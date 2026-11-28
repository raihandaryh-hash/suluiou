#!/usr/bin/env python3
"""Gerbang migrasi: tiap CREATE TABLE di migrasi baru wajib diikuti GRANT eksplisit sebelum ENABLE ROW LEVEL SECURITY.

Asal: Lovable menolak menerapkan 0010 dua kali (29 Nov 2026): tanpa GRANT eksplisit ke service_role, lalu GRANT
sesudah ENABLE RLS. Aturan migrasi proyek: GRANT tepat sesudah CREATE TABLE, sebelum RLS. Migrasi 0000-0009
sudah diterapkan dan tidak diperiksa ulang.
Pakai: python3 skrip/cek-urutan-grant.py [folder]   (keluar 0 = lulus, 1 = gagal)
"""
import pathlib, re, sys

MULAI = 10  # nomor migrasi pertama yang diperiksa
folder = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "drizzle/migrations")
gagal = []
for f in sorted(folder.glob("[0-9][0-9][0-9][0-9]_*.sql")):
    if int(f.name[:4]) < MULAI:
        continue
    s = f.read_text(encoding="utf-8")
    for m in re.finditer(r"CREATE TABLE (?:IF NOT EXISTS )?public\.(\w+)", s, re.I):
        t = m.group(1)
        sisa = s[m.end():]
        rls = re.search(rf"ALTER TABLE public\.{t} ENABLE ROW LEVEL SECURITY", sisa, re.I)
        grant = re.search(rf"GRANT [^;]+ ON (?:TABLE )?public\.{t} TO", sisa, re.I)
        if not grant:
            gagal.append(f"{f.name}: {t} tanpa GRANT eksplisit")
        elif rls and grant.start() > rls.start():
            gagal.append(f"{f.name}: {t} GRANT sesudah ENABLE ROW LEVEL SECURITY")
for g in gagal:
    print("GAGAL", g)
print("LULUS" if not gagal else f"{len(gagal)} pelanggaran")
sys.exit(1 if gagal else 0)
