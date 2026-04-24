

# Handover Package untuk Mas Shofiq (PHP 7.4 + MySQL 8.0)

Berdasarkan stack Mas Shofiq, saya rekomendasikan **Opsi A (frontend static di IOU, backend tetap Lovable Cloud)** sebagai jalur utama, dengan **Opsi B (full PHP/MySQL)** sebagai dokumen siap-pakai kalau nanti mau full migrasi.

Alasan: PHP 7.4 sudah end-of-life (no security patches sejak Nov 2022). Bikin backend baru di PHP 7.4 untuk handle AI streaming (SSE) + auth modern itu beresiko & effort tinggi. Opsi A bikin Mas Shofiq cuma perlu host file static — zero PHP code.

## Yang Akan Dibuat

### 1. `docs/DEPLOYMENT_OPSI_A.md` — Jalur Cepat (rekomendasi)
Langkah deploy untuk Mas Shofiq:
- Cara build: `npm install && npm run build` → folder `dist/`
- Upload `dist/` ke `bahasa.iou.edu.gm/sulu/` via FTP/cPanel
- Konfigurasi `.htaccess` untuk SPA routing (React Router) di Apache
- Update Supabase Auth allowed redirect URLs (saya kasih screenshot path-nya)
- Set custom domain di publish settings Lovable
- Checklist verifikasi (assessment jalan, admin login, AI projection muncul)

### 2. `docs/API_CONTRACT.md` — Spesifikasi untuk Opsi B
Kalau nanti Mas Shofiq mau full migrasi ke PHP/MySQL, dokumen ini berisi:
- 3 endpoint REST yang harus dibikin (`POST /api/results`, `POST /api/generate-projection`, `POST /api/career-chat`)
- Request/response JSON schema lengkap untuk masing-masing
- Format SSE streaming untuk chatbot (penting: PHP 7.4 perlu `ob_flush()` + `flush()` + disable output buffering)
- Auth endpoint contract (admin login + session)
- CORS requirements
- Contoh skeleton PHP 7.4 untuk endpoint paling sederhana (`/api/results`) sebagai starting point

### 3. `docs/MYSQL_SCHEMA.sql` — Database Schema untuk MySQL 8.0
Konversi schema Postgres → MySQL 8.0:
- `CREATE TABLE` untuk `assessment_results`, `province_contexts`, `admin_users` (+ `user_sessions`)
- Tipe data dipetakan: `uuid` → `CHAR(36)`, `jsonb` → `JSON`, `timestamp with time zone` → `TIMESTAMP`, `text[]` → `JSON`
- Index untuk kolom yang sering di-query admin (`submitted_at DESC`, `lead_score DESC`, `follow_up_status`)
- Catatan: tanpa RLS — security harus di-handle di PHP layer (validasi session admin sebelum SELECT)

### 4. `docs/DATA_MIGRATION.md` + script export
- Cara export data existing dari Lovable Cloud (pakai Supabase dashboard atau `pg_dump` via connection string)
- Script Node.js sederhana (`scripts/export-to-mysql.js`) yang convert Postgres dump → MySQL `INSERT` statements
- Cara import 38 row `province_contexts` + semua `assessment_results` ke MySQL Mas Shofiq

### 5. `docs/AI_PROXY_PHP.md` — Panduan AI calls di PHP 7.4
Khusus untuk Opsi B, karena AI integration paling tricky:
- Cara proxy Gemini API dari PHP (pakai `cURL` dengan `CURLOPT_WRITEFUNCTION` untuk streaming)
- Penanganan API key Gemini (taruh di env / config terpisah, jangan commit)
- Code snippet PHP 7.4-compatible untuk endpoint `/api/career-chat` yang stream SSE ke browser
- Catatan: shared hosting kadang block long-lived connections — perlu cek dengan IOU sysadmin

### 6. `.env.production.example`
Template env vars dengan komentar mana yang dipakai untuk Opsi A vs B:
```
# Opsi A: kosongkan, frontend langsung pakai Lovable Cloud
VITE_API_BASE_URL=

# Opsi B: isi dengan root URL backend PHP Mas Shofiq
# VITE_API_BASE_URL=https://bahasa.iou.edu.gm/sulu
```

## Catatan Penting tentang PHP 7.4

Akan saya tulis di docs sebagai disclaimer:
- PHP 7.4 EOL → minta Mas Shofiq pertimbangkan upgrade ke PHP 8.1+ kalau memungkinkan, terutama untuk handle AI streaming
- Beberapa library modern (e.g., GuzzleHttp v7+) butuh PHP 7.4 minimum tapi sebagian fitur baru perlu 8.0+
- Session handling untuk admin lebih aman pakai JWT (`firebase/php-jwt` library) daripada PHP native sessions

## Yang TIDAK Akan Saya Buat (kecuali diminta)

- Full PHP backend implementation — itu kerjaan Mas Shofiq berdasarkan contract
- MySQL data migration eksekusi — saya kasih script, eksekusi pas siap pindah
- Auth replacement (Supabase Auth → PHP session) — design-nya ada di API contract, implementasi di Mas Shofiq

## Pertanyaan Konfirmasi

Sebelum saya generate semua docs di atas, satu hal cepat:
- **Setuju jalur utamanya Opsi A** (frontend di IOU, backend tetap Lovable Cloud) dan Opsi B disiapkan sebagai dokumen siap-pakai untuk nanti? Atau Mas Shofiq memang sudah committed full migrasi sekarang ke PHP/MySQL (Opsi B saja)?

