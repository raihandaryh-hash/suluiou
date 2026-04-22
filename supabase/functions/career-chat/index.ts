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
    const AI_BASE_URL = Deno.env.get("AI_BASE_URL") || "https://generativelanguage.googleapis.com/v1beta/openai";
    const AI_MODEL = Deno.env.get("AI_MODEL") || "gemini-2.0-flash";
    if (!AI_API_KEY) {
      throw new Error("AI_API_KEY is not configured");
    }

    const { messages, studentContext } = await req.json();

    const profile = studentContext.studentProfile;
    const profileBlock = profile
      ? `

Konteks personal siswa:
- Nama panggilan: ${profile.name || "(tidak disebutkan)"}
- Provinsi: ${profile.province || "(tidak disebutkan)"}
- Latar belakang keluarga: ${profile.familyBackground || "(tidak disebutkan)"}
- Aspirasi pribadi: "${profile.aspiration || "(tidak disebutkan)"}"`
      : "";

    const systemPrompt = `Kamu adalah konselor karier AI bernama "IOU Advisor" untuk siswa SMA di Indonesia. Kamu ramah, suportif, dan berbicara dalam Bahasa Indonesia yang santai tapi tetap informatif.

Profil siswa berdasarkan asesmen Kepribadian & Minat:
- Jalur terbaik: ${studentContext.topPathway}
- Match: ${studentContext.matchPercentage}%
- Trait dominan: ${studentContext.topTraits.join(", ")}
- Karier potensial: ${studentContext.careers.join(", ")}
- Industri lokal: ${studentContext.localIndustries.join(", ")}

Skor kepribadian (1-5):
${Object.entries(studentContext.scores).map(([k, v]) => `- ${k}: ${v}`).join("\n")}${profileBlock}

Tugasmu:
- Jawab pertanyaan siswa tentang karier, jurusan kuliah, skill yang perlu dikembangkan
- Berikan saran yang spesifik dan actionable berdasarkan profil mereka
- Jika konteks personal tersedia, kaitkan saran dengan provinsi, latar keluarga, dan aspirasi siswa agar terasa relevan
- Sapa dengan nama panggilan siswa jika tersedia
- Jika ditanya di luar topik karier/pendidikan, arahkan kembali dengan sopan
- Jawab singkat dan padat (maks 200 kata) kecuali diminta penjelasan detail
- Gunakan emoji sesekali untuk membuat percakapan lebih hidup`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(
      `${AI_BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: AI_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Terlalu banyak permintaan, coba lagi nanti." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Kuota AI habis." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "Gagal menghubungi AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("career-chat error:", e);
    if (e instanceof Error && e.name === 'AbortError') {
      return new Response(
        JSON.stringify({ error: "Maaf, AI tidak merespons. Coba lagi." }),
        { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
