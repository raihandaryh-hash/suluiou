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
    const AI_API_KEY = Deno.env.get("AI_API_KEY") || Deno.env.get("LOVABLE_API_KEY");
    const AI_BASE_URL = Deno.env.get("AI_BASE_URL") || "https://generativelanguage.googleapis.com/v1beta";
    const AI_MODEL = Deno.env.get("AI_MODEL") || "gemini-2.0-flash";
    if (!AI_API_KEY) {
      throw new Error("AI_API_KEY is not configured");
    }

    const { scores, pathway, topTraits, studentProfile } = await req.json();

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

Skor kepribadian (skala 1-5):
- Kejujuran: ${scores.honesty}
- Sensitivitas: ${scores.emotionality}
- Sosial: ${scores.extraversion}
- Keramahan: ${scores.agreeableness}
- Keteraturan: ${scores.conscientiousness}
- Keterbukaan: ${scores.openness}
- Praktis: ${scores.realistic}
- Analitis: ${scores.investigative}
- Kreatif: ${scores.artistic}
- Penolong: ${scores.social}
- Wirausaha: ${scores.enterprising}
- Terstruktur: ${scores.conventional}

Jalur terbaik: ${pathway.name}
Karier potensial: ${pathway.careers.join(", ")}
Industri lokal: ${pathway.localIndustries.join(", ")}
Trait dominan: ${topTraits.join(", ")}${profileBlock}

Tulis narasi "Dirimu di Tahun 2030" untuk siswa ini.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);
    const response = await fetch(
      `${AI_BASE_URL}/models/${AI_MODEL}:generateContent?key=${AI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
          ],
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.9,
          },
        }),
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const projection = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!projection) {
      throw new Error("No content in AI response");
    }

    return new Response(JSON.stringify({ projection }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-projection error:", e);
    if (e instanceof Error && e.name === 'AbortError') {
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
