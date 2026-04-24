import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY") || Deno.env.get("AI_API_KEY");
    const AI_MODEL = Deno.env.get("AI_MODEL") || "google/gemini-2.5-flash";
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { scores, hollandCode, pathway, topTraits, studentProfile } = await req.json();

    const systemPrompt = `Kamu adalah penulis narasi karier untuk siswa SMA di Indonesia. Tugasmu menulis narasi inspiratif orang kedua ("kamu") yang menggambarkan kehidupan profesional siswa di tahun 2030.

Aturan:
- Tulis dalam Bahasa Indonesia yang hidup dan emosional
- Gunakan sudut pandang orang kedua ("kamu")
- Panjang 150-200 kata, satu hingga dua paragraf
- Jangan gunakan bullet point atau heading
- Spesifik terhadap trait kepribadian dan jalur karier siswa
- Sebutkan industri lokal dan karier konkret
- Jika tersedia, kaitkan narasi dengan provinsi siswa, latar belakang keluarganya, dan aspirasinya — buat ia merasa "ini benar-benar tentang aku"
- Buat pembaca merasa bersemangat tentang masa depannya`;

    const profileBlock = studentProfile
      ? `\n\nKonteks personal:
- Nama panggilan: ${studentProfile.name || "(tidak disebutkan)"}
- Provinsi: ${studentProfile.province || "(tidak disebutkan)"}
- Latar belakang keluarga: ${studentProfile.familyBackground || "(tidak disebutkan)"}
- Aspirasi pribadi: "${studentProfile.aspiration || "(tidak disebutkan)"}"`
      : "";

    const userPrompt = `Profil siswa:

Kepribadian (HEXACO, skala 1-5):
- Kejujuran & Kerendahan Hati: ${scores.honesty}
- Emosionalitas: ${scores.emotionality}
- Ekstraversi: ${scores.extraversion}
- Keramahan: ${scores.agreeableness}
- Kehati-hatian: ${scores.conscientiousness}
- Keterbukaan: ${scores.openness}

Minat karier (RIASEC, skala 1-5):
- Realistic (teknis/konkret): ${scores.realistic}
- Investigative (analitis/ilmiah): ${scores.investigative}
- Artistic (kreatif/ekspresif): ${scores.artistic}
- Social (membantu/mengajar): ${scores.social}
- Enterprising (memimpin/wirausaha): ${scores.enterprising}
- Conventional (terstruktur/administratif): ${scores.conventional}

Holland Code (3 minat tertinggi): ${hollandCode || "(tidak tersedia)"}

Jalur terbaik: ${pathway.name}
Karier potensial: ${pathway.careers.join(", ")}
Industri lokal: ${pathway.localIndustries.join(", ")}
Trait dominan: ${topTraits.join(", ")}${profileBlock}

Tulis narasi "Dirimu di Tahun 2030" untuk siswa ini.`;

    // Exponential backoff for transient AI gateway errors (429/5xx).
    // Max 3 attempts with 1s → 2s → 4s waits. Total worst case ≈ 7s + request time.
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    let response: Response | null = null;
    let lastErrText = '';

    for (let attempt = 0; attempt < 3; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);
      try {
        response = await fetch(
          "https://ai.gateway.lovable.dev/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: AI_MODEL,
              max_tokens: 1024,
              temperature: 0.65,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
              ],
            }),
            signal: controller.signal,
          }
        );
      } finally {
        clearTimeout(timeoutId);
      }

      if (response.ok) break;

      // Retry only on rate limit (429) or 5xx; bail out on 4xx (auth/payment/etc).
      const isRetryable = response.status === 429 || response.status >= 500;
      lastErrText = await response.text().catch(() => '');
      console.warn(`AI gateway attempt ${attempt + 1} failed: ${response.status} ${lastErrText}`);
      if (!isRetryable || attempt === 2) break;
      await sleep((2 ** attempt) * 1000); // 1s, 2s
    }

    if (!response || !response.ok) {
      const status = response?.status ?? 502;
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add credits to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded after retries." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("AI gateway error after retries:", status, lastErrText);
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const projection = data.choices?.[0]?.message?.content?.trim();

    if (!projection) {
      console.error("No content in AI response:", JSON.stringify(data));
      throw new Error("No content in AI response");
    }

    return new Response(JSON.stringify({ projection }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-projection error:", e);
    if (e instanceof Error && e.name === "AbortError") {
      return new Response(
        JSON.stringify({ error: "AI request timed out" }),
        { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
