"""Unduh dokumen register L0 ke MESIN\\dokumen\\<doc_id>.pdf dan ekstrak teks ke <doc_id>.txt (PyMuPDF).
Pakai (dari MESIN\\alat): python unduh_dokumen.py ..\\dokumen\\l0_url.tsv   Lingkungan LANJUT=1 melewati yang sudah ada."""
import hashlib, os, re, sys, time, urllib.request, urllib.parse
import fitz
TSV = sys.argv[1]; AKAR = os.path.dirname(os.path.abspath(TSV)); LANJUT = os.environ.get("LANJUT") == "1"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"}
def ambil(u):
    with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=240) as r: return r.read(), r.headers.get("Content-Type", "")
for baris in open(TSV, encoding="utf-8"):
    did, url = baris.rstrip("\n").split("\t"); pdf = os.path.join(AKAR, did + ".pdf"); txt = os.path.join(AKAR, did + ".txt")
    if LANJUT and os.path.exists(txt): print(did, "lewat"); continue
    try:
        b, ct = ambil(url)
        if not b.startswith(b"%PDF"):
            h = b.decode("utf-8", "ignore")
            m = re.findall(r'href="([^"]*/Download/[^"]+)"', h) or re.findall(r'href="([^"]+?\.pdf)"', h, re.I)  # /Read/ di BPK = penampil HTML
            if not m: print(did, "GAGAL bukan-pdf tanpa tautan", ct[:30]); continue
            b, ct = ambil(urllib.parse.urljoin(url, m[0]))
            if not b.startswith(b"%PDF"): print(did, "GAGAL tautan bukan pdf", ct[:30]); continue
        open(pdf, "wb").write(b)
        d = fitz.open(pdf); t = "\n".join(p.get_text() for p in d); open(txt, "w", encoding="utf-8").write(t)
        print(did, "OK", hashlib.sha256(b).hexdigest()[:12], len(d), "hal", len(t), "kar", flush=True)
    except Exception as e: print(did, "GAGAL", type(e).__name__, str(e)[:80], flush=True)
    time.sleep(2)
