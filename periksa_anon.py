#!/usr/bin/env python3
"""Pemeriksa repo Sulu: tolak kebijakan dan GRANT yang membuka data ke peran anon/public.

Lahir dari INSIDEN 2 Nov 2026 (kenali_dirimu_sessions, assessment_progress, class_enrollments
terbaca publik). Jalankan dari akar repo: python3 periksa_anon.py

v2 (9 Nov 2026): menghitung KEADAAN AKHIR, bukan tiap migrasi. Migrasi diputar berurutan;
CREATE POLICY menambah, DROP POLICY dan blok DO yang menghapus kebijakan lewat pg_policies
mencabut, GRANT menambah, REVOKE mencabut. Yang dilaporkan hanya yang masih hidup sesudah
migrasi terakhir.

Keluar 1 bila ada temuan. 0 berkas = gagal, bukan lolos.
Batas: kebenaran akhir tetap pg_policies di produksi. Migrasi yang dijalankan tangan di luar
repo tidak terlihat. drizzle/migrations dianggap dijalankan 2 Nov 2026 (sesudah semua
supabase/migrations bertanggal sebelum itu).
"""
import glob, os, re, sys

# Tabel yang boleh dibaca publik (konten, bukan data orang). Ubah hanya dengan keputusan tertulis.
BOLEH_PUBLIK = {"province_contexts", "site_content", "classes"}
# INSERT saja (formulir publik, telemetri) boleh, karena anon tidak bisa membaca atau mengubah.
BOLEH_INSERT_SAJA = {"waitlist_sulu", "analytics_events"}
# Pengecualian sementara bertanggal: (tabel, nama kebijakan) -> alasan. Tiap butir wajib ditinjau ulang.
DIKECUALIKAN = {
    ("assessment_results", "Owner can fill empty layer1_text"): "9 Nov 2026: jalur simpan teks hasil tamu (api.updateLayer1) mungkin masih dipakai; "
    "anon hanya bisa mengisi teks pada hasil tamu yang teksnya kosong, tanpa baca. Ditutup bersama rancang ulang alur tamu (Tonggak 2).",
}
# Ember storage publik berisi konten, bukan data orang.
BOLEH_STORAGE = {"suar-slides"}

I = re.I | re.S
CREATE = re.compile(r'create\s+policy\s+"(?P<nama>[^"]+)"\s+on\s+(?P<tabel>(?:[a-z_]+\.)?"?[a-z_0-9]+"?)(?P<isi>.*?);', I)
DROP = re.compile(r'drop\s+policy\s+(?:if\s+exists\s+)?"(?P<nama>[^"]+)"\s+on\s+(?P<tabel>(?:[a-z_]+\.)?"?[a-z_0-9]+"?)', I)
PERAN = re.compile(r'\bto\s+((?:"?[a-z_]+"?\s*,\s*)*"?[a-z_]+"?)', I)
GRANT = re.compile(r'grant\s+(?P<hak>[^;]*?)\s+on\s+(?:table\s+)?(?P<tabel>(?:[a-z_]+\.)?"?[a-z_0-9]+"?)\s+to\s+(?P<ke>[^;]+);', I)
REVOKE = re.compile(r'revoke\s+(?P<hak>[^;]*?)\s+on\s+(?:table\s+)?(?P<tabel>(?:[a-z_]+\.)?"?[a-z_0-9]+"?)\s+from\s+(?P<dari>[^;]+);', I)
# Blok DO yang menghapus kebijakan lewat pg_policies (pola drizzle 0001, 2 Nov).
DO_HAPUS = re.compile(r"from\s+pg_policies.*?tablename\s+in\s*\((?P<tabel>[^)]*)\).*?cmd\s+in\s*\((?P<cmd>[^)]*)\).*?drop\s+policy", I)

HAK_SEMUA = {"select", "insert", "update", "delete"}


def bersih(t: str) -> str:
    t = t.replace('"', "").lower()
    return t.split(".", 1)[1] if t.startswith("public.") else t


def peran_dari(teks: str) -> set:
    return {x.strip().strip('"').lower() for x in re.split(r"\s*,\s*", teks.strip())}


def urutan(f: str) -> str:
    nama = os.path.basename(f)
    if f.startswith("drizzle/"):
        return "20261102000000_" + nama
    return nama


def main() -> int:
    berkas = sorted(glob.glob("supabase/migrations/*.sql") + glob.glob("drizzle/migrations/*.sql"), key=urutan)
    if not berkas:
        print("GAGAL: 0 berkas migrasi dipindai; jalankan dari akar repo.")
        return 1
    kebijakan = {}  # (tabel, nama) -> (berkas, cmd, peran, isi)
    hak = {}  # (tabel, peran) -> set hak
    for f in berkas:
        teks = re.sub(r"--[^\n]*", "", open(f, encoding="utf-8").read())
        kejadian = []
        for m in CREATE.finditer(teks):
            kejadian.append((m.start(), "create", m))
        for m in DROP.finditer(teks):
            kejadian.append((m.start(), "drop", m))
        for m in GRANT.finditer(teks):
            kejadian.append((m.start(), "grant", m))
        for m in REVOKE.finditer(teks):
            kejadian.append((m.start(), "revoke", m))
        for m in DO_HAPUS.finditer(teks):
            kejadian.append((m.start(), "do", m))
        for _, jenis, m in sorted(kejadian, key=lambda k: k[0]):
            if jenis == "create":
                isi = m.group("isi")
                c = re.search(r"\bfor\s+(select|insert|update|delete|all)\b", isi, I)
                p = PERAN.search(isi)
                kebijakan[(bersih(m.group("tabel")), m.group("nama"))] = (
                    f, c.group(1).lower() if c else "all", peran_dari(p.group(1)) if p else {"public"}, isi)
            elif jenis == "drop":
                kebijakan.pop((bersih(m.group("tabel")), m.group("nama")), None)
            elif jenis == "do":
                tabel = {bersih(x.strip().strip("'")) for x in m.group("tabel").split(",")}
                cmd = {x.strip().strip("'").lower() for x in m.group("cmd").split(",")}
                for k in [k for k, v in kebijakan.items() if k[0] in tabel and v[1] in cmd and v[2] & {"anon", "public"}]:
                    kebijakan.pop(k)
            else:
                h = m.group("hak").lower()
                hs = HAK_SEMUA if re.search(r"\ball\b", h) else {x for x in HAK_SEMUA if re.search(rf"\b{x}\b", h)}
                ke = peran_dari(m.group("ke" if jenis == "grant" else "dari"))
                for r in ke & {"anon", "public"}:
                    kunci = (bersih(m.group("tabel")), r)
                    if jenis == "grant":
                        hak.setdefault(kunci, set()).update(hs)
                    else:
                        hak.setdefault(kunci, set()).difference_update(hs)
    temuan = []
    for (tabel, nama), (f, cmd, peran, isi) in sorted(kebijakan.items()):
        # Pengguna login yang boleh mengubah atau membaca baris tamu (user_id kosong) bisa mengklaim baris orang lain.
        using = re.search(r"\busing\s*\((.*)", isi, I)
        if "authenticated" in peran and cmd in {"update", "select", "all"} and using and re.search(r"user_id\s+is\s+null", using.group(1), I) \
                and not re.search(r"auth\.uid\(\)\s+is\s+null\s+and\s+user_id\s+is\s+null", using.group(1), I) and (tabel, nama) not in DIKECUALIKAN:
            temuan.append(f"kebijakan '{nama}' ({cmd}) membolehkan pengguna login menyentuh baris tamu di {tabel} · {f}")
        if not peran & {"anon", "public"}:
            continue
        # Policy RESTRICTIVE hanya mempersempit akses (digabung AND), tidak pernah membuka (Tonggak 2a, 0007).
        if re.search(r"\bas\s+restrictive\b", isi, I):
            continue
        if tabel in BOLEH_PUBLIK and cmd == "select":
            continue
        if tabel == "storage.objects" and any(b in isi for b in BOLEH_STORAGE) and cmd == "select":
            continue
        if cmd == "insert":
            continue  # INSERT tidak membuka baca atau ubah
        milik_sendiri_login = re.search(r"using\s*\(\s*\(?\s*auth\.uid\(\)\s*=\s*\w+\s*\)?\s*\)", isi, I) or re.search(
            r"using\s*\(\s*\(?\s*\w+\s*=\s*auth\.uid\(\)\s*\)?\s*\)", isi, I)
        hanya_admin = re.search(r"user_roles|is_admin\s*\(", isi, I) and not re.search(r"auth\.uid\(\)\s+is\s+null|user_id\s+is\s+null", isi, I)
        if milik_sendiri_login or hanya_admin:
            continue
        if (tabel, nama) in DIKECUALIKAN:
            print(f" (dikecualikan) {tabel} '{nama}': {DIKECUALIKAN[(tabel, nama)]}")
            continue
        temuan.append(f"kebijakan '{nama}' ({cmd}) masih membuka {tabel} untuk {sorted(peran & {'anon', 'public'})} · {f}")
    for (tabel, r), hs in sorted(hak.items()):
        sisa = hs - ({"insert"} if tabel in BOLEH_INSERT_SAJA else set())
        if tabel in BOLEH_PUBLIK:
            sisa -= {"select"}
        if sisa:
            temuan.append(f"GRANT {sorted(sisa)} ke {r} masih hidup pada {tabel}")
    print(f"Dipindai {len(berkas)} berkas migrasi (keadaan akhir); temuan {len(temuan)}.")
    for t in temuan:
        print(" -", t)
    return 1 if temuan else 0


if __name__ == "__main__":
    sys.exit(main())
