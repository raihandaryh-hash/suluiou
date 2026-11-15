#!/usr/bin/env python3
"""cari_putusan.py: uji "sudah pernah diputuskan?" atas riwayat DUA SISI (Raihan dan asisten).

Sebab lahir (INSIDEN 15 Nov 2026 18.04): indeks niat hanya memuat pesan Raihan, sehingga
putusan yang lahir dari jawaban asisten lalu disetujui Raihan tidak terlihat, dan hal yang
sudah diputus ditanyakan ulang.

Aturan pakai: SEBELUM satu pertanyaan atau "keputusan baru" sampai ke Raihan, jalankan `cari`
dengan kata kunci butir itu. Keluaran dilampirkan di samping butirnya. Tanpa keluaran ini,
butir tidak boleh diberi label "belum pernah diputuskan".

Batas: hanya sejauh berkas ekspor (lihat `rentang`). Di luar rentang, pakai indeks niat
(pesan Raihan saja) dan nyatakan batasnya.

  bangun  <ekspor.zip|conversations.json> <keluar.jsonl>
  rentang <jsonl>
  cari    <jsonl> <regex> [--sesudah YYYY-MM-DD] [--sebelum YYYY-MM-DD] [--chat AWALAN]
                          [--peran human|assistant] [--lebar N] [--maks N] [--dan REGEX]

Data keluaran TIDAK masuk repo (memuat seluruh riwayat); simpan di laptop MESIN\\niat\\.
"""
import io, json, re, sys, zipfile
from collections import Counter

TERLARANG = ("23a6e688", "9f20a71d", "4649b266", "0522c1a6", "98974eb1")


def _teks(m):
    t = m.get("text") or ""
    if not t:
        bagian = []
        for c in m.get("content") or []:
            if isinstance(c, dict) and c.get("type") == "text":
                bagian.append(c.get("text") or "")
        t = "\n".join(bagian)
    return t


def bangun(sumber, keluar):
    if sumber.lower().endswith(".zip"):
        with zipfile.ZipFile(sumber) as z:
            data = json.load(io.TextIOWrapper(z.open("conversations.json"), encoding="utf-8"))
    else:
        data = json.load(open(sumber, encoding="utf-8"))
    n_chat = n_gil = n_lewat = 0
    with open(keluar, "w", encoding="utf-8") as f:
        for c in data:
            u = c.get("uuid", "")
            if u.startswith(TERLARANG):
                n_lewat += 1
                continue
            n_chat += 1
            for i, m in enumerate(c.get("chat_messages") or []):
                t = _teks(m)
                if not t.strip():
                    continue
                f.write(json.dumps({"chat": u, "judul": c.get("name") or "", "giliran": i,
                                    "peran": m.get("sender") or "", "waktu": m.get("created_at") or "",
                                    "teks": t}, ensure_ascii=False) + "\n")
                n_gil += 1
    print(f"chat ditulis {n_chat}; chat terlarang dilewati {n_lewat}; giliran {n_gil}")


def _muat(jalur):
    return [json.loads(b) for b in open(jalur, encoding="utf-8") if b.strip()]


def rentang(jalur):
    R = _muat(jalur)
    w = sorted(r["waktu"] for r in R if r["waktu"])
    print(f"giliran {len(R)}; chat {len({r['chat'] for r in R})}; peran {dict(Counter(r['peran'] for r in R))}")
    print(f"rentang {w[0][:10]} s.d. {w[-1][:10]}")
    print("awalan terlarang yang ikut:", sum(r["chat"].startswith(TERLARANG) for r in R))


def cari(jalur, pola, arg):
    def opsi(nama, bawaan=None):
        return arg[arg.index(nama) + 1] if nama in arg else bawaan
    sesudah, sebelum = opsi("--sesudah", ""), opsi("--sebelum", "9999")
    chat, peran = opsi("--chat", ""), opsi("--peran", "")
    lebar, maks = int(opsi("--lebar", "220")), int(opsi("--maks", "40"))
    dan = opsi("--dan")
    rx = re.compile(pola, re.I | re.S)
    rx2 = re.compile(dan, re.I | re.S) if dan else None
    kena = []
    for r in _muat(jalur):
        if not (sesudah <= r["waktu"][:10] < sebelum):
            continue
        if chat and not r["chat"].startswith(chat):
            continue
        if peran and r["peran"] != peran:
            continue
        m = rx.search(r["teks"])
        if not m or (rx2 and not rx2.search(r["teks"])):
            continue
        kena.append((r, m))
    kena.sort(key=lambda x: x[0]["waktu"])
    print(f"pola /{pola}/" + (f" dan /{dan}/" if dan else "") + f": {len(kena)} giliran kena; "
          f"peran {dict(Counter(r['peran'] for r, _ in kena))}; chat {len({r['chat'] for r, _ in kena})}")
    for r, m in kena[:maks]:
        a, b = max(0, m.start() - lebar), min(len(r["teks"]), m.end() + lebar)
        cuplik = " ".join(r["teks"][a:b].split())
        print(f"\n[{r['waktu'][:16]} {r['peran'][:5]} {r['chat'][:8]} #{r['giliran']}] {r['judul'][:50]}\n  …{cuplik}…")
    if len(kena) > maks:
        print(f"\n(+{len(kena) - maks} lagi; persempit atau naikkan --maks)")


if __name__ == "__main__":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    a = sys.argv[1:]
    if len(a) >= 3 and a[0] == "bangun":
        bangun(a[1], a[2])
    elif len(a) >= 2 and a[0] == "rentang":
        rentang(a[1])
    elif len(a) >= 3 and a[0] == "cari":
        cari(a[1], a[2], a[3:])
    else:
        print(__doc__)
        sys.exit(2)
