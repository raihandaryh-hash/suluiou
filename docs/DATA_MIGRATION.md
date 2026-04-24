# Data Migration — Lovable Cloud (Postgres) → MySQL 8.0

**Tujuan**: Pindahkan semua data existing dari Supabase ke MySQL Mas Shofiq tanpa kehilangan satu row pun.

**Data yang dimigrasi**:
- `assessment_results` (semua submission siswa) — saat ini ~11 row, akan terus tumbuh sampai cutover
- `province_contexts` (38 row, data 38 provinsi Indonesia)

**TIDAK dimigrasi**:
- `auth.users` (Supabase Auth) — admin baru dibuat manual di MySQL `admin_users`
- `user_roles`, `profiles` — di-handle ulang oleh PHP auth layer

---

## Langkah 1 — Export dari Supabase

### Cara A: Lewat Lovable Cloud Dashboard (paling mudah)

1. Buka Lovable editor → **Cloud → Database → Tables**
2. Klik tabel `assessment_results` → tombol **Export** → pilih format CSV
3. Ulangi untuk `province_contexts`
4. Simpan dua file: `assessment_results.csv`, `province_contexts.csv`

### Cara B: Lewat `pg_dump` (lebih lengkap, untuk advanced)

Butuh `psql` / `pg_dump` di mesin lokal. Connection string ada di Lovable Cloud → Database → Connection.

```bash
# Dump cuma 2 tabel yang relevan, format SQL
pg_dump \
  --host=<SUPABASE_HOST> \
  --port=5432 \
  --username=postgres \
  --dbname=postgres \
  --table=public.assessment_results \
  --table=public.province_contexts \
  --data-only \
  --column-inserts \
  --no-owner \
  --no-acl \
  > supabase_dump.sql
```

Output: file `supabase_dump.sql` berisi `INSERT INTO ...` Postgres-flavored.

---

## Langkah 2 — Convert ke MySQL Format

Postgres dump TIDAK bisa langsung di-`mysql -e`. Ada beberapa perbedaan syntax:

| Postgres | MySQL |
|---|---|
| `'{"key":"val"}'::jsonb` | `'{"key":"val"}'` (cast tidak ada) |
| `'{a,b,c}'::text[]` | `'["a","b","c"]'` (JSON array) |
| `'2025-04-25 10:00:00+00'` | `'2025-04-25 10:00:00'` (drop timezone) |
| `gen_random_uuid()` | UUID literal `'xxxxxxxx-xxxx-...'` |
| `true` / `false` | `1` / `0` (atau biarkan) |
| `E'string\n'` | `'string\n'` (drop `E` prefix) |

Pakai script Node.js di `scripts/export-to-mysql.js` (lihat di bawah). Atau kalau jumlah row kecil (<50), edit manual.

```bash
node scripts/export-to-mysql.js supabase_dump.sql > mysql_import.sql
```

---

## Langkah 3 — Import ke MySQL

```bash
mysql -u sulu_user -p sulu_db < mysql_import.sql
```

Verifikasi:
```sql
SELECT COUNT(*) FROM assessment_results;  -- harus sama dengan jumlah di Supabase
SELECT COUNT(*) FROM province_contexts;   -- harus 38
SELECT province, JSON_EXTRACT(economic_sectors, '$[0]') FROM province_contexts LIMIT 5;
```

Kalau hasilnya muncul nama sektor (bukan `NULL`), berarti JSON column terisi dengan benar.

---

## Langkah 4 — Cutover (saat siap go-live di IOU)

**Strategi disarankan**: cutover di malam hari saat traffic minimal.

1. **Freeze Supabase** (sementara): di Lovable, set assessment form jadi disabled, atau tampilkan banner "maintenance".
2. **Re-export** `assessment_results` (untuk capture row-row yang masuk sejak export pertama).
3. **Import incremental**: hanya row dengan `submitted_at` lebih baru dari export sebelumnya:
   ```sql
   -- Di MySQL, hapus row lama yang akan di-replace
   DELETE FROM assessment_results WHERE submitted_at >= '<TIMESTAMP_EXPORT_PERTAMA>';
   -- Lalu import file baru
   ```
4. **Switch DNS / config**: deploy frontend yang sudah di-build dengan `VITE_API_BASE_URL=https://bahasa.iou.edu.gm/sulu`.
5. **Smoke test**: submit 1 asesmen test → cek muncul di MySQL.
6. **Disable Supabase write** (optional): bisa pertahankan Supabase sebagai backup read-only selama 30 hari.

---

## Catatan Penting

### `province_contexts` — recommended re-seed manual

38 row province_contexts itu data referensi yang jarang berubah. Lebih bersih kalau Mas Shofiq seed manual dari source-of-truth (file CSV/Excel internal IOU), bukan migrasi dari Supabase. Saya bisa generate file `province_contexts_seed.sql` kalau diminta.

### Foreign Key

MySQL schema tidak punya FK antara `assessment_results` dan `admin_users` (lm_id), karena `lm_id` di Postgres juga bukan FK ketat (cuma string). Jadi import bisa skip pengecekan FK.

### Encoding

Pastikan dump file di-save sebagai UTF-8 (BOM-less), bukan UTF-8 BOM atau Latin-1. Nama daerah Indonesia (e.g., "Jakarta", "Yogyakarta") aman di ASCII, tapi `family_background` / `aspiration` siswa bisa pakai karakter Indonesia full unicode + emoji.

---

## Script Helper

Lihat `scripts/export-to-mysql.js` di root project — script Node.js yang melakukan konversi otomatis Postgres SQL dump → MySQL INSERT statements.
