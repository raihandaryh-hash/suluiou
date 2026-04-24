import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Kamu adalah psikolog naratif yang menulis cermin diri untuk siswa SMA/SMK/MA Indonesia.
Tugasmu: tulis narasi yang TERASA PERSONAL — bukan laporan, bukan zodiak, bukan kalimat yang bisa berlaku untuk siapa saja.

PRINSIP EDITORIAL — BACA INI DULU:
Kamu memegang banyak data tentang siswa ini. Tidak semua perlu diucapkan.
Sampaikan hanya yang relevan langsung untuk siswa — yang membantu mereka mengenal diri,
bukan yang membuktikan seberapa banyak yang kamu tahu tentang mereka.
Satu pengamatan yang tepat lebih kuat dari sepuluh deskripsi yang akurat.

ATURAN MENULIS — WAJIB:
1. Mulai LANGSUNG. Bukan "Kamu adalah tipe yang..." atau "Berdasarkan asesmen...". Langsung deskripsikan bagaimana orang ini berpikir atau bergerak di dunia — dalam satu kalimat yang spesifik.
2. Sertakan SATU ketegangan internal dari data. Kekuatan yang juga bisa jadi hambatan. Jujur lebih berharga dari validasi kosong.
3. Gunakan kembali kata atau tema dari aspirasi siswa. Ini menunjukkan narasi ditulis untuk mereka — bukan untuk "tipe" mereka.
4. Gunakan perilaku konkret, bukan sifat abstrak. Bukan "kamu kreatif" — tapi "kamu yang sering menemukan jalan lain ketika pintu utama tertutup."
5. Akhiri dengan kalimat yang MEMBUKA, bukan menutup. Undangan untuk refleksi lebih dalam, bukan konklusi.
6. Panjang: 180–220 kata. Bahasa Indonesia hangat dan langsung.
7. DILARANG menyebut: IOU, nama program studi, nama lembaga manapun, kata "asesmen", "skor", "dimensi", "tipe kepribadian", "Holland Code", "HEXACO".
8. DILARANG menuangkan semua data ke dalam narasi. Pilih. Siswa tidak perlu tahu semua yang kamu ketahui tentang mereka.
9. JANGAN gunakan bullet point, heading, atau formatting — paragraf mengalir saja.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const AI_BASE_URL = Deno.env.get("AI_BASE_URL")
      || "https://ai.gateway.lovable.dev/v1/chat/completions";
    const apiKey = Deno.env.get("LOVABLE_API_KEY") || Deno.env.get("AI_API_KEY");
    const AI_MODEL = Deno.env.get("AI_MODEL") || "google/gemini-2.5-flash";

    if (!apiKey) throw new Error("AI API key is not configured");

    const {
      hexaco,
      riasec,
      hollandCode,
      hollandNarrative,
      hexacoInterpretations,
      tensionPair,
      profile,
    } = await req.json();

    const safeProfile = profile || {};
    const interp = hexacoInterpretations || {};
    const tension = tensionPair || { label: '(belum terdeteksi)', detail: '' };

    const userPrompt = `DATA SISWA:
---
Holland Code: ${hollandCode || '(tidak tersedia)'}
Pola minat: ${hollandNarrative || '(tidak tersedia)'}

HEXACO — karakter yang terdeteksi:
- Kejujuran & Integritas: ${interp.H || '(tidak tersedia)'}
- Cara merespons perasaan: ${interp.E || '(tidak tersedia)'}
- Cara hadir di lingkungan sosial: ${interp.X || '(tidak tersedia)'}
- Cara berhubungan dengan orang lain: ${interp.A || '(tidak tersedia)'}
- Cara bekerja dan menyelesaikan sesuatu: ${interp.C || '(tidak tersedia)'}
- Cara mendekati hal baru: ${interp.O || '(tidak tersedia)'}

Ketegangan utama yang terdeteksi: ${tension.label}
${tension.detail ? `Detailnya: ${tension.detail}` : ''}

Konteks siswa:
- Provinsi: ${safeProfile.province || '(tidak disebutkan)'}
- Latar keluarga: ${safeProfile.familyBackground || '(tidak disebutkan)'}
- Cara belajar: ${safeProfile.learningStyle || '(tidak disebutkan)'}
- Tujuan kontribusi: ${safeProfile.contributionGoal || '(tidak disebutkan)'}
- Aspirasi (kata-kata siswa sendiri): "${safeProfile.aspiration || 'tidak disebutkan'}"
---

Skor mentah (jangan dikutip di narasi — hanya untuk nuansa):
HEXACO: H=${hexaco?.H ?? 'n/a'} E=${hexaco?.E ?? 'n/a'} X=${hexaco?.X ?? 'n/a'} A=${hexaco?.A ?? 'n/a'} C=${hexaco?.C ?? 'n/a'} O=${hexaco?.O ?? 'n/a'}
RIASEC: R=${riasec?.R ?? 'n/a'} I=${riasec?.I ?? 'n/a'} A=${riasec?.A ?? 'n/a'} S=${riasec?.S ?? 'n/a'} E=${riasec?.E ?? 'n/a'} C=${riasec?.C ?? 'n/a'}

Tulis cermin diri untuk siswa ini sekarang. 180–220 kata. Bahasa Indonesia hangat dan langsung. Tanpa menyebut kode teknis atau lembaga.`;

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    let response: Response | null = null;
    let lastErrText = '';

    for (let attempt = 0; attempt < 3; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);
      try {
        response = await fetch(AI_BASE_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: AI_MODEL,
            max_tokens: 512,
            temperature: 0.65,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userPrompt },
            ],
          }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (response.ok) break;

      const isRetryable = response.status === 429 || response.status >= 500;
      lastErrText = await response.text().catch(() => '');
      console.warn(`generate-layer1 attempt ${attempt + 1} failed: ${response.status} ${lastErrText}`);
      if (!isRetryable || attempt === 2) break;
      await sleep((2 ** attempt) * 1000);
    }

    if (!response || !response.ok) {
      console.error("generate-layer1 gateway error:", response?.status, lastErrText);
      return new Response(JSON.stringify({ layer1: null }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const layer1 = data.choices?.[0]?.message?.content?.trim() || null;

    return new Response(JSON.stringify({ layer1 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-layer1 error:", e);
    return new Response(JSON.stringify({ layer1: null }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
