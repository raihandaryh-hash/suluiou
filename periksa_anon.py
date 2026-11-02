#!/usr/bin/env python3
"""Pemeriksa repo Sulu: tolak migrasi yang memberi akses ke peran anon/public pada tabel data siswa.

Lahir dari INSIDEN 2 Nov 2026 (kenali_dirimu_sessions, assessment_progress, class_enrollments
terbaca publik). Jalankan dari akar repo: python3 periksa_anon.py
Keluar 1 bila ada temuan. Mencetak cakupan (N berkas dipindai); 0 berkas = gagal, bukan lolos.
Batas: migrasi lama bisa sudah dibatalkan migrasi sesudahnya. Kebenaran akhir = pg_policies di produksi.
Diuji 2 Nov 2026 atas repo @4e2f653: 30 berkas, 13 temuan.
"""
import glob, re, sys

# Tabel yang memang boleh dibaca publik (konten, bukan data orang). Ubah hanya dengan keputusan tertulis.
BOLEH_PUBLIK = {"province_contexts", "site_content", "classes"}

POLA = re.compile(
    r'create\s+policy\s+"(?P<nama>[^"]+)"\s+on\s+(?:public\.)?"?(?P<tabel>[a-z_0-9]+)"?(?P<isi>.*?);',
    re.I | re.S,
)
PERAN = re.compile(r'\bto\s+((?:"?[a-z_]+"?\s*,\s*)*"?[a-z_]+"?)', re.I)
GRANT = re.compile(r'grant\s+[^;]*?\bon\s+(?:table\s+)?(?:public\.)?"?([a-z_0-9]+)"?\s+to\s+([^;]+);', re.I)


def main() -> int:
    berkas = sorted(glob.glob("supabase/migrations/*.sql") + glob.glob("drizzle/migrations/*.sql"))
    if not berkas:
        print("GAGAL: 0 berkas migrasi dipindai; jalankan dari akar repo.")
        return 1
    temuan = []
    for f in berkas:
        teks = open(f, encoding="utf-8").read()
        for m in POLA.finditer(teks):
            isi = m.group("isi")
            p = PERAN.search(isi)
            peran = {x.strip().strip('"').lower() for x in p.group(1).split(",")} if p else {"public"}
            # Kebijakan yang hanya membuka baris milik pengguna login sendiri tidak dihitung.
            milik_sendiri = re.search(r"using\s*\(\s*\(?\s*\(?auth\.uid\(\)\s*=\s*\w+\)?\s*\)?\s*\)", isi, re.I) or re.search(r"using\s*\(\s*\(?\s*\w+\s*=\s*auth\.uid\(\)\s*\)?\s*\)", isi, re.I)
            if peran & {"anon", "public"} and m.group("tabel") not in BOLEH_PUBLIK and not milik_sendiri:
                if re.search(r"\bfor\s+(select|all|update)\b", isi, re.I) or not re.search(r"\bfor\s+\w+", isi, re.I):
                    temuan.append(f"{f}: kebijakan '{m.group('nama')}' membuka {m.group('tabel')} untuk {sorted(peran & {'anon','public'})}")
        for t, ke in GRANT.findall(teks):
            if re.search(r"\banon\b", ke, re.I) and t not in BOLEH_PUBLIK:
                temuan.append(f"{f}: GRANT ke anon pada {t}")
    print(f"Dipindai {len(berkas)} berkas migrasi; temuan {len(temuan)}.")
    for t in temuan:
        print(" -", t)
    return 1 if temuan else 0


if __name__ == "__main__":
    sys.exit(main())
