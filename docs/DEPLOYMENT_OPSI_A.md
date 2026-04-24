# Deployment Opsi A — Frontend Static di IOU, Backend Lovable Cloud

**Untuk: Mas Shofiq**
**Stack target: bahasa.iou.edu.gm/sulu (Apache + PHP 7.4 + MySQL 8.0)**
**Effort: ~30 menit. Zero PHP code.**

Pendekatan ini mempertahankan database, auth, dan AI functions di Lovable Cloud. Mas Shofiq cuma host file static React build di subdirektori `/sulu`.

---

## Langkah 1 — Build Frontend

Di mesin lokal (yang punya Node.js 18+):

```bash
git clone <repo-url> sulu
cd sulu
npm install
npm run build
```

Output: folder `dist/` (~2-5 MB) berisi `index.html`, `assets/`, dan static files.

**Penting**: file `.env` sudah otomatis di-inject saat build. Untuk Opsi A, biarkan `VITE_API_BASE_URL` kosong supaya frontend pakai Supabase langsung.

## Langkah 2 — Upload ke Server IOU

Via FTP, cPanel File Manager, atau SSH:

```
public_html/sulu/
├── index.html
├── assets/
│   ├── index-XXXX.js
│   ├── index-XXXX.css
│   └── ...
├── favicon.ico
└── .htaccess        ← buat manual (lihat Langkah 3)
```

## Langkah 3 — Konfigurasi `.htaccess` (SPA Routing)

React Router pakai client-side routing. Tanpa file ini, refresh di `/assessment` atau `/admin` akan kasih 404 dari Apache.

Buat file `public_html/sulu/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /sulu/

  # Jika file/folder fisik ada, serve langsung
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Selain itu, fallback ke index.html (React Router handle)
  RewriteRule ^ index.html [L]
</IfModule>

# Cache static assets agresif (mereka punya hash di nama)
<FilesMatch "\.(js|css|woff2|jpg|png|svg)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# Jangan cache index.html
<FilesMatch "index\.html$">
  Header set Cache-Control "no-cache, no-store, must-revalidate"
</FilesMatch>
```

## Langkah 4 — Update Supabase Auth Allowed URLs

Karena admin login pakai Supabase Auth + Google OAuth, domain baru harus di-whitelist.

Di Lovable editor → **Cloud → Users → Auth Settings (gear icon) → URL Configuration**:

- **Site URL**: `https://bahasa.iou.edu.gm/sulu`
- **Redirect URLs** (tambahkan):
  - `https://bahasa.iou.edu.gm/sulu`
  - `https://bahasa.iou.edu.gm/sulu/`
  - `https://bahasa.iou.edu.gm/sulu/admin/login`
  - `https://bahasa.iou.edu.gm/sulu/**` (wildcard)

Tanpa ini, Google OAuth callback akan reject domain IOU.

## Langkah 5 — CORS Edge Functions

Edge functions (`generate-projection`, `career-chat`) sudah pakai `Access-Control-Allow-Origin: *`, jadi tidak perlu konfigurasi tambahan. Frontend di IOU bisa langsung hit.

## Langkah 6 — Verifikasi

Buka `https://bahasa.iou.edu.gm/sulu` di browser, jalankan checklist:

- [ ] Halaman landing muncul, tidak ada 404 asset
- [ ] Klik "Mulai Asesmen" → 24 pertanyaan tampil
- [ ] Selesaikan asesmen → form profil muncul → submit → redirect ke /results
- [ ] Halaman results menampilkan jalur karier + AI projection (tunggu ~5 detik)
- [ ] Buka `/admin/login` → login dengan akun admin → dashboard tampil
- [ ] Refresh di `/assessment` tidak kasih 404 (artinya `.htaccess` jalan)
- [ ] Buka DevTools → Network → cek tidak ada CORS error

## Update Berikutnya

Setiap kali ada perubahan code:
1. `npm run build` lokal
2. Upload ulang folder `dist/` ke `public_html/sulu/`
3. Hard refresh browser (Cmd+Shift+R / Ctrl+F5)

Atau set up GitHub Action yang auto-deploy via SFTP — saya bisa buatkan kalau perlu.

## Troubleshooting

| Masalah | Penyebab | Solusi |
|---|---|---|
| Halaman blank, console error "MIME type" | `.htaccess` salah, asset di-rewrite ke index.html | Cek `RewriteCond` di Langkah 3 |
| 404 saat refresh `/admin` | `mod_rewrite` tidak aktif | Minta sysadmin enable `mod_rewrite` di Apache |
| Google login redirect error | Domain belum di whitelist | Ulangi Langkah 4 |
| AI projection muncul "logistik" generik | Edge function gagal, fallback template | Cek Lovable Cloud → Edge Functions → Logs |
| CORS error di console | Domain IOU belum dikenali | Edge function CORS sudah `*`, cek apakah ada proxy/CDN di IOU yang strip header |

## Kelebihan Opsi A

- ✅ Zero backend code untuk Mas Shofiq
- ✅ Database, auth, AI tetap di Lovable Cloud (auto-scaled, managed)
- ✅ Update frontend cukup re-upload `dist/`
- ✅ Data tetap accessible via admin dashboard di domain IOU
- ✅ Bisa migrasi ke Opsi B kapan saja tanpa ubah frontend (lihat `API_CONTRACT.md`)

## Kekurangan

- ⚠️ Database fisik bukan di server IOU (di Supabase managed). Kalau ada policy data residency Indonesia, perlu Opsi B.
- ⚠️ Bergantung pada uptime Supabase (99.9% SLA).
- ⚠️ Biaya Lovable Cloud usage-based (sangat murah untuk volume <10k user/bulan).
