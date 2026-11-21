"""Panggil BPS WebAPI tanpa pernah mencetak kunci.
Pakai: python bps.py JALUR [BERKAS_SIMPAN]
  contoh JALUR: list/model/var/domain/0000/keyword/miskin
Kunci dibaca dari Sulu Build\\kunci-lokal\\bps.txt (milik Raihan, jangan disalin ke mana pun)
dan dihapus dari setiap keluaran, pesan galat, dan berkas simpanan."""
import hashlib, sys, urllib.request

KUNCI = open(r"C:\Users\p\Documents\IOU\Foresight\Sulu Build\kunci-lokal\bps.txt", encoding="utf-8").read().strip()

def bersih(s):
    return s.replace(KUNCI, "[dihapus]")

def ambil(jalur):
    url = f"https://webapi.bps.go.id/v1/api/{jalur.strip('/')}/key/{KUNCI}/"
    req = urllib.request.Request(url, headers={"User-Agent": "Sulu-Mesin-Eksplorasi/0.1 (IOU Indonesia)"})
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            return bersih(r.read().decode("utf-8"))
    except Exception as e:  # jangan biarkan URL berkunci ikut ke jejak galat
        raise RuntimeError(bersih(f"{type(e).__name__}: {e}")) from None

if __name__ == "__main__":
    try:
        teks = ambil(sys.argv[1])
    except Exception as e:
        print("galat:", bersih(str(e))); sys.exit(1)
    if len(sys.argv) > 2:
        data = teks.encode("utf-8")
        open(sys.argv[2], "wb").write(data)
        print(f"tersimpan: {sys.argv[2]} | bita: {len(data)} | sha256: {hashlib.sha256(data).hexdigest()}")
    else:
        sys.stdout.buffer.write(teks.encode("utf-8"))
