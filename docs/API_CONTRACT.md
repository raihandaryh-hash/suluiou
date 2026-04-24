# API Contract — Untuk Migrasi ke PHP/MySQL (Opsi B)

**Tujuan**: Spesifikasi REST endpoint yang harus diimplementasikan Mas Shofiq agar frontend React (yang sudah ada) bisa dialihkan dari Lovable Cloud ke backend PHP 7.4 + MySQL 8.0 di IOU **tanpa mengubah satu baris kode frontend**.

**Cara aktivasi**: set env var saat build:
```
VITE_API_BASE_URL=https://bahasa.iou.edu.gm/sulu
```
Lalu `npm run build`. Frontend akan otomatis hit `${VITE_API_BASE_URL}/api/*` (lihat `src/services/api.ts`).

---

## Disclaimer PHP 7.4

PHP 7.4 sudah EOL (Nov 2022, no security patch). **Sangat disarankan upgrade ke PHP 8.1+** sebelum deploy production, terutama karena:
- Endpoint `/api/career-chat` butuh streaming SSE yang lebih reliable di PHP 8.x
- `firebase/php-jwt` v6+ lebih aman dan butuh PHP 8.0+
- Type system PHP 8 lebih ketat → bug lebih cepat ketangkap

Kalau terpaksa PHP 7.4: hindari readonly properties, named arguments, enums. Pakai `array` daripada `match` expression.

---

## Endpoint 1 — `POST /api/results`

**Tujuan**: Simpan hasil asesmen siswa ke database. Dipanggil sekali setelah student submit form profil di akhir asesmen.

### Request

```http
POST /api/results
Content-Type: application/json
```

```json
{
  "student_name": "Aisyah Rahma",
  "student_email": "aisyah@example.com",
  "student_phone": "081234567890",
  "student_class": "12 IPA 2",
  "school_name": "SMA Negeri 5 Bandung",
  "student_province": "Jawa Barat",
  "province": "Jawa Barat",
  "family_background": "Anak pertama, ayah petani, ibu IRT",
  "aspiration": "Ingin jadi dokter membantu masyarakat",
  "scores": {
    "honesty": 4.2,
    "emotionality": 3.8,
    "extraversion": 3.5,
    "agreeableness": 4.0,
    "conscientiousness": 4.5,
    "openness": 3.7,
    "realistic": 2.5,
    "investigative": 4.3,
    "artistic": 3.0,
    "social": 4.5,
    "enterprising": 3.2,
    "conventional": 3.8
  },
  "top_pathway_id": "kesehatan-medis",
  "top_pathway_name": "Kesehatan & Medis",
  "match_percentage": 87,
  "all_matches": [
    { "pathway_id": "kesehatan-medis", "name": "Kesehatan & Medis", "score": 87 },
    { "pathway_id": "pendidikan", "name": "Pendidikan", "score": 78 }
  ],
  "projection": "Tahun 2030, kamu...(narasi AI ~150 kata)",
  "lead_score": 75,
  "lm_name": null,
  "lm_id": null
}
```

**Field nullable**: `student_name`, `student_email`, `student_phone`, `student_class`, `school_name`, `student_province`, `province`, `family_background`, `aspiration`, `lm_name`, `lm_id`.

**Field wajib**: `scores`, `top_pathway_id`, `top_pathway_name`, `match_percentage`, `all_matches`, `lead_score`.

### Response

**Sukses (200)**:
```json
{ "error": null }
```

**Atau optional**:
```json
{ "error": null, "id": "uuid-of-inserted-row" }
```

**Gagal (4xx/5xx)**:
```json
{ "error": { "message": "Validation failed: email format invalid" } }
```

Frontend cuma cek `response.ok`. Body error ditampilkan ke admin via console.

### Skeleton PHP 7.4

```php
<?php
// public_html/sulu/api/results.php
declare(strict_types=1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => ['message' => 'Method not allowed']]);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['error' => ['message' => 'Invalid JSON']]);
    exit;
}

// Validasi minimal
$required = ['scores', 'top_pathway_id', 'top_pathway_name', 'match_percentage', 'all_matches', 'lead_score'];
foreach ($required as $f) {
    if (!isset($body[$f])) {
        http_response_code(422);
        echo json_encode(['error' => ['message' => "Missing field: $f"]]);
        exit;
    }
}

require __DIR__ . '/db.php'; // bikin file ini: return PDO instance
$pdo = get_pdo();

$id = bin2hex(random_bytes(16)); // uuid-ish; idealnya pakai library uuid

$sql = "INSERT INTO assessment_results (
    id, student_name, student_email, student_phone, student_class,
    school_name, student_province, province, family_background, aspiration,
    scores, top_pathway_id, top_pathway_name, match_percentage, all_matches,
    projection, lead_score, lm_name, lm_id, follow_up_status, submitted_at
) VALUES (
    :id, :student_name, :student_email, :student_phone, :student_class,
    :school_name, :student_province, :province, :family_background, :aspiration,
    :scores, :top_pathway_id, :top_pathway_name, :match_percentage, :all_matches,
    :projection, :lead_score, :lm_name, :lm_id, 'new', NOW()
)";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':id' => $id,
    ':student_name' => $body['student_name'] ?? null,
    ':student_email' => $body['student_email'] ?? null,
    ':student_phone' => $body['student_phone'] ?? null,
    ':student_class' => $body['student_class'] ?? null,
    ':school_name' => $body['school_name'] ?? null,
    ':student_province' => $body['student_province'] ?? null,
    ':province' => $body['province'] ?? null,
    ':family_background' => $body['family_background'] ?? null,
    ':aspiration' => $body['aspiration'] ?? null,
    ':scores' => json_encode($body['scores']),
    ':top_pathway_id' => $body['top_pathway_id'],
    ':top_pathway_name' => $body['top_pathway_name'],
    ':match_percentage' => $body['match_percentage'],
    ':all_matches' => json_encode($body['all_matches']),
    ':projection' => $body['projection'] ?? null,
    ':lead_score' => $body['lead_score'],
    ':lm_name' => $body['lm_name'] ?? null,
    ':lm_id' => $body['lm_id'] ?? null,
]);

echo json_encode(['error' => null, 'id' => $id]);
```

---

## Endpoint 2 — `POST /api/generate-projection`

**Tujuan**: Generate narasi "Dirimu di Tahun 2030" dengan Gemini AI berdasarkan skor + profil siswa. Non-streaming, balik 1 response JSON.

### Request

```json
{
  "scores": { "honesty": 4.2, "emotionality": 3.8, "...": "..." },
  "pathway": {
    "name": "Kesehatan & Medis",
    "careers": ["Dokter umum", "Perawat", "Apoteker"],
    "localIndustries": ["RS Hasan Sadikin", "Klinik daerah"]
  },
  "topTraits": ["Sosial", "Penolong", "Analitis"],
  "studentProfile": {
    "name": "kamu",
    "province": "Jawa Barat",
    "familyBackground": "Anak pertama, ayah petani",
    "aspiration": "Ingin jadi dokter membantu masyarakat"
  }
}
```

**Catatan privasi**: frontend SUDAH pseudonymize — `name` selalu jadi `"kamu"`, email/phone/sekolah TIDAK pernah dikirim ke endpoint ini. Jangan log raw payload ke disk.

### Response

**Sukses (200)**:
```json
{ "projection": "Tahun 2030. Pagi di Bandung. Kamu masuk ke ruang praktik..." }
```

**Gagal (4xx/5xx)**:
```json
{ "error": "Rate limit exceeded" }
```

Frontend treat any error as silent → fallback ke template hardcoded. Jadi endpoint TIDAK boleh hang/timeout >25 detik.

### Implementasi

Lihat `AI_PROXY_PHP.md` untuk detail proxy ke Gemini API.

---

## Endpoint 3 — `POST /api/career-chat` (STREAMING SSE)

**Tujuan**: Chatbot AI yang menjawab pertanyaan karier siswa setelah lihat hasil. Response harus streaming Server-Sent Events supaya UX smooth (chunked text muncul progresif).

### Request

```json
{
  "messages": [
    { "role": "user", "content": "Apa skill yang harus saya pelajari untuk jadi dokter?" },
    { "role": "assistant", "content": "Untuk jalur kedokteran..." },
    { "role": "user", "content": "Berapa lama kuliahnya?" }
  ],
  "studentContext": {
    "studentProfile": {
      "name": "kamu",
      "province": "Jawa Barat",
      "familyBackground": "...",
      "aspiration": "..."
    },
    "topPathway": "Kesehatan & Medis",
    "scores": { "...": "..." }
  }
}
```

### Response (Streaming SSE)

```http
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
X-Accel-Buffering: no
```

Body berupa rangkaian event:
```
data: {"choices":[{"delta":{"content":"Kuliah "}}]}

data: {"choices":[{"delta":{"content":"kedokteran "}}]}

data: {"choices":[{"delta":{"content":"di Indonesia..."}}]}

data: [DONE]

```

**Penting**:
- Setiap event diakhiri dengan **dua** newline (`\n\n`)
- Format `delta.content` ini sengaja meniru format OpenAI ChatCompletion supaya frontend (`CareerChatbot.tsx`) tidak perlu diubah
- Stream berakhir dengan literal `data: [DONE]\n\n`
- Frontend parse via `EventSource`-style reader

### PHP 7.4 Streaming Catatan

Apache + PHP 7.4 sering buffer output. Wajib:
```php
@ini_set('zlib.output_compression', 0);
@ini_set('output_buffering', 'off');
@ini_set('implicit_flush', 1);
ob_implicit_flush(true);
while (ob_get_level()) ob_end_flush();

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('X-Accel-Buffering: no'); // disable Nginx buffering kalau ada
```

Detail lengkap di `AI_PROXY_PHP.md`.

---

## Endpoint 4 — Auth Admin (untuk dashboard)

Frontend admin dashboard saat ini pakai Supabase Auth. Untuk Opsi B, perlu replacement. Disarankan **JWT-based session**, BUKAN PHP native session (lebih scalable, lebih aman untuk SPA).

### `POST /api/auth/login`

```json
// Request
{ "email": "admin@iou.edu.gm", "password": "..." }

// Response 200
{ "token": "eyJhbGc...", "user": { "id": "...", "email": "...", "role": "admin" } }

// Response 401
{ "error": { "message": "Invalid credentials" } }
```

Token JWT signed dengan secret di `.env` server. Expire 24 jam. Disimpan frontend di `localStorage`.

### `GET /api/auth/me`

Header: `Authorization: Bearer <token>`

```json
// 200
{ "user": { "id": "...", "email": "...", "role": "admin" } }
// 401
{ "error": { "message": "Invalid token" } }
```

### `GET /api/admin/results`

Header: `Authorization: Bearer <token>` (wajib role admin)

Return semua row `assessment_results` (untuk admin dashboard).

```json
{ "data": [ {...row1...}, {...row2...} ] }
```

### `PATCH /api/admin/results/:id`

Update `follow_up_status`, `notes`, `lm_name`, `lm_id`.

```json
// Request
{ "follow_up_status": "contacted", "notes": "Sudah ditelepon 2025-04-25" }
// Response 200
{ "error": null }
```

**Catatan**: Endpoint admin di atas BELUM ada di `src/services/api.ts` saat ini (admin dashboard pakai Supabase client langsung). Kalau migrasi Opsi B, file `AdminDashboard.tsx` perlu di-refactor untuk pakai `api.adminListResults()` dst — saya bisa siapkan refactor itu kalau Opsi B disetujui.

---

## CORS Requirements

Semua endpoint harus return:
```
Access-Control-Allow-Origin: https://bahasa.iou.edu.gm
Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

Dan handle `OPTIONS` preflight dengan 204.

Kalau frontend & backend di domain yang sama (`bahasa.iou.edu.gm/sulu`), CORS tidak strictly perlu, tapi tetap recommended untuk safety.

---

## Checklist Mas Shofiq

- [ ] Setup MySQL schema (lihat `MYSQL_SCHEMA.sql`)
- [ ] Bikin `db.php` dengan PDO connection (lihat snippet)
- [ ] Implement `/api/results` (paling simple, mulai dari sini)
- [ ] Implement auth endpoints + JWT middleware
- [ ] Implement `/api/admin/results` + PATCH
- [ ] Implement `/api/generate-projection` (proxy ke Gemini, lihat `AI_PROXY_PHP.md`)
- [ ] Implement `/api/career-chat` SSE (paling tricky, lihat `AI_PROXY_PHP.md`)
- [ ] Test dengan frontend yang di-build dengan `VITE_API_BASE_URL=https://bahasa.iou.edu.gm/sulu`
- [ ] Migrate data lama dari Supabase (lihat `DATA_MIGRATION.md`)
