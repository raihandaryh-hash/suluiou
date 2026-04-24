# AI Proxy di PHP 7.4 — Panduan Implementasi

**Konteks**: Saat ini dua endpoint AI (`generate-projection`, `career-chat`) jalan di Supabase Edge Functions (Deno + fetch ke Gemini API). Kalau migrasi ke Opsi B (full PHP), Mas Shofiq perlu replace ini dengan PHP yang proxy ke Gemini API.

**Provider AI**: Google Gemini (via Generative Language API). Key dari https://aistudio.google.com/app/apikey — gratis quota cukup besar untuk volume sekolah.

**Model default**: `gemini-2.5-flash` (cepat + murah, cocok untuk projection 150 kata + chat).

---

## Setup Awal

### 1. API Key

Dapatkan API key Gemini di https://aistudio.google.com/app/apikey. **JANGAN commit ke git.**

Simpan di file `config.php` di luar `public_html/`:
```php
<?php
// /home/iou/private_config/sulu_config.php (di luar webroot!)
return [
    'ai_api_key' => 'AIzaSy...',
    'ai_model' => 'gemini-2.5-flash',
    'ai_base_url' => 'https://generativelanguage.googleapis.com/v1beta',
    'jwt_secret' => 'random-256-bit-string-disini',
    'db_host' => 'localhost',
    'db_name' => 'sulu_db',
    'db_user' => 'sulu_user',
    'db_pass' => '...',
];
```

Load di endpoint:
```php
$config = require '/home/iou/private_config/sulu_config.php';
```

### 2. Cek dukungan cURL streaming

```bash
php -r "var_dump(function_exists('curl_init'));"
# Harus: bool(true)
```

Kalau hosting cuma allow `file_get_contents`, streaming SSE tidak akan jalan dengan baik. Wajib cURL.

---

## Endpoint 1: `/api/generate-projection` (Non-Streaming)

Paling simple. Kirim 1 request ke Gemini, terima 1 response, balikin ke frontend.

```php
<?php
// public_html/sulu/api/generate-projection.php
declare(strict_types=1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$config = require '/home/iou/private_config/sulu_config.php';
$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$scores = $body['scores'] ?? [];
$pathway = $body['pathway'] ?? [];
$topTraits = $body['topTraits'] ?? [];
$profile = $body['studentProfile'] ?? null;

$systemPrompt = 'Kamu adalah penulis narasi karier untuk siswa SMA di Indonesia. '
    . 'Tugasmu menulis narasi inspiratif orang kedua ("kamu") yang menggambarkan '
    . 'kehidupan profesional siswa di tahun 2030.

Aturan:
- Tulis dalam Bahasa Indonesia yang hidup dan emosional
- Gunakan sudut pandang orang kedua ("kamu")
- Panjang 150-200 kata, satu hingga dua paragraf
- Jangan gunakan bullet point atau heading
- Spesifik terhadap trait kepribadian dan jalur karier siswa
- Sebutkan industri lokal dan karier konkret
- Jika tersedia, kaitkan narasi dengan provinsi siswa, latar belakang keluarganya, dan aspirasinya';

$profileBlock = '';
if ($profile) {
    $profileBlock = "\n\nKonteks personal:\n"
        . "- Nama panggilan: " . ($profile['name'] ?? '(tidak disebutkan)') . "\n"
        . "- Provinsi: " . ($profile['province'] ?? '(tidak disebutkan)') . "\n"
        . "- Latar belakang keluarga: " . ($profile['familyBackground'] ?? '(tidak disebutkan)') . "\n"
        . '- Aspirasi pribadi: "' . ($profile['aspiration'] ?? '(tidak disebutkan)') . '"';
}

$userPrompt = "Profil siswa:\n\nSkor kepribadian (skala 1-5):\n";
foreach ($scores as $k => $v) {
    $userPrompt .= "- $k: $v\n";
}
$userPrompt .= "\nJalur terbaik: " . ($pathway['name'] ?? '');
$userPrompt .= "\nKarier potensial: " . implode(', ', $pathway['careers'] ?? []);
$userPrompt .= "\nIndustri lokal: " . implode(', ', $pathway['localIndustries'] ?? []);
$userPrompt .= "\nTrait dominan: " . implode(', ', $topTraits);
$userPrompt .= $profileBlock;
$userPrompt .= "\n\nTulis narasi \"Dirimu di Tahun 2030\" untuk siswa ini.";

$url = $config['ai_base_url'] . '/models/' . $config['ai_model']
     . ':generateContent?key=' . urlencode($config['ai_api_key']);

$payload = [
    'contents' => [
        [
            'role' => 'user',
            'parts' => [['text' => $systemPrompt . "\n\n" . $userPrompt]],
        ],
    ],
    'generationConfig' => [
        'maxOutputTokens' => 1024,
        'temperature' => 0.9,
    ],
];

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 25,
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 429) {
    http_response_code(429);
    echo json_encode(['error' => 'Rate limit exceeded']);
    exit;
}
if ($httpCode !== 200) {
    error_log("Gemini error $httpCode: $response");
    http_response_code(500);
    echo json_encode(['error' => 'AI gateway error']);
    exit;
}

$data = json_decode($response, true);
$projection = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

if (!$projection) {
    http_response_code(500);
    echo json_encode(['error' => 'No content in AI response']);
    exit;
}

echo json_encode(['projection' => trim($projection)]);
```

---

## Endpoint 2: `/api/career-chat` (STREAMING SSE) — TRICKY

Ini bagian paling rawan di PHP 7.4. Streaming SSE dari Gemini ke browser, dengan transformasi format ke OpenAI-compatible (yang frontend expect).

### Tantangan

1. **PHP buffering**: Apache + PHP punya beberapa layer buffer (output buffer, mod_deflate, FastCGI). Wajib semua di-disable.
2. **Long-lived connection**: shared hosting kadang bunuh connection >30 detik. Cek dengan IOU sysadmin.
3. **Format conversion**: Gemini SSE format ≠ OpenAI SSE format. Frontend expect OpenAI style:
   ```
   data: {"choices":[{"delta":{"content":"text"}}]}
   ```

### Implementasi

```php
<?php
// public_html/sulu/api/career-chat.php
declare(strict_types=1);

// === DISABLE SEMUA BUFFER ===
@ini_set('zlib.output_compression', '0');
@ini_set('output_buffering', '0');
@ini_set('implicit_flush', '1');
ob_implicit_flush(true);
while (ob_get_level() > 0) ob_end_flush();
ignore_user_abort(false);
set_time_limit(120);

// === HEADERS SSE ===
header('Content-Type: text/event-stream; charset=utf-8');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('X-Accel-Buffering: no'); // penting kalau ada Nginx di depan
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$config = require '/home/iou/private_config/sulu_config.php';
$body = json_decode(file_get_contents('php://input'), true);
$messages = $body['messages'] ?? [];
$context = $body['studentContext'] ?? [];

// Bangun system prompt + sertakan student context
$systemPrompt = "Kamu adalah konselor karier untuk siswa SMA Indonesia. "
              . "Jawab pertanyaan tentang karier, jurusan, skill, dengan ramah dan spesifik. "
              . "Konteks siswa:\n" . json_encode($context, JSON_UNESCAPED_UNICODE);

// Convert messages OpenAI format → Gemini contents format
$contents = [['role' => 'user', 'parts' => [['text' => $systemPrompt]]]];
foreach ($messages as $msg) {
    $role = ($msg['role'] === 'assistant') ? 'model' : 'user';
    $contents[] = ['role' => $role, 'parts' => [['text' => $msg['content']]]];
}

$url = $config['ai_base_url'] . '/models/' . $config['ai_model']
     . ':streamGenerateContent?alt=sse&key=' . urlencode($config['ai_api_key']);

$payload = [
    'contents' => $contents,
    'generationConfig' => [
        'maxOutputTokens' => 2048,
        'temperature' => 0.7,
    ],
];

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Accept: text/event-stream'],
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_RETURNTRANSFER => false, // streaming mode
    CURLOPT_TIMEOUT => 90,
    CURLOPT_BUFFERSIZE => 128,
    CURLOPT_WRITEFUNCTION => function ($ch, $chunk) {
        // Gemini SSE chunk format: "data: {...}\n\n"
        // Bisa multi-line dalam 1 chunk
        static $buffer = '';
        $buffer .= $chunk;

        while (($pos = strpos($buffer, "\n\n")) !== false) {
            $event = substr($buffer, 0, $pos);
            $buffer = substr($buffer, $pos + 2);

            if (strpos($event, 'data: ') !== 0) continue;
            $jsonStr = substr($event, 6);
            if (trim($jsonStr) === '') continue;

            $parsed = json_decode($jsonStr, true);
            $text = $parsed['candidates'][0]['content']['parts'][0]['text'] ?? null;
            if ($text === null) continue;

            // Re-emit dalam format OpenAI delta yang frontend expect
            $openAiChunk = json_encode([
                'choices' => [['delta' => ['content' => $text]]]
            ], JSON_UNESCAPED_UNICODE);

            echo "data: $openAiChunk\n\n";
            @ob_flush();
            @flush();
        }

        if (connection_aborted()) return 0; // stop curl kalau client disconnect
        return strlen($chunk);
    },
]);

curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Tutup stream
echo "data: [DONE]\n\n";
@ob_flush();
@flush();
```

### Test Streaming

```bash
curl -N -X POST https://bahasa.iou.edu.gm/sulu/api/career-chat.php \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Apa itu jurusan teknik?"}],"studentContext":{}}'
```

Kalau jalan benar, terminal akan stream chunk demi chunk, bukan tunggu sampai habis baru tampil.

### Kalau Streaming TIDAK Jalan di Hosting IOU

Backup plan: bikin endpoint non-streaming `/api/career-chat-sync.php` yang return full response sekaligus, lalu modify frontend `CareerChatbot.tsx` untuk handle non-stream response. UX kurang smooth (loading dot ~5 detik) tapi tetap functional.

---

## Catatan Penting

### Rate Limiting Gemini

Free tier: 15 requests/minute. Cukup untuk testing tapi kalau 1 sekolah submit barengan bisa hit limit. Solusi:
- Upgrade ke paid tier ($0.075/1M tokens — sangat murah)
- Atau implement queue di MySQL: simpan request, process dengan cron worker

### Logging

JANGAN log raw payload (mengandung aspirasi pribadi siswa) ke file public. Log cuma error code + timestamp:
```php
error_log("AI request OK: pathway=" . $pathway['name']);
// JANGAN: error_log("Request body: " . file_get_contents('php://input'));
```

### Fallback

Frontend sudah punya fallback template kalau endpoint return error/timeout. Jadi tidak perlu obsesif handle semua edge case — biarin fail silently dengan HTTP 500, frontend tampilkan template.

### Upgrade ke PHP 8.1+

Implementasi di atas PHP 7.4-compatible, tapi **sangat disarankan upgrade**. Di PHP 8.1+:
- Bisa pakai `Generator` + `yield` untuk streaming yang lebih bersih
- `Symfony HttpClient` punya streaming SSE handling built-in
- Type system lebih kuat → less bugs

Kalau IOU bisa upgrade, saya rekomen rewrite pakai library Symfony HttpClient.
