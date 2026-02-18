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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { messages, studentContext } = await req.json();

    const systemPrompt = `Kamu adalah konselor karier AI bernama "Sulu Advisor" untuk siswa SMA di Indonesia. Kamu ramah, suportif, dan berbicara dalam Bahasa Indonesia yang santai tapi tetap informatif.

Profil siswa ini berdasarkan tes HEXACO & RIASEC:
- Jalur terbaik: ${studentContext.topPathway}
- Match: ${studentContext.matchPercentage}%
- Trait dominan: ${studentContext.topTraits.join(", ")}
- Karier potensial: ${studentContext.careers.join(", ")}
- Industri lokal: ${studentContext.localIndustries.join(", ")}

Skor kepribadian (1-5):
${Object.entries(studentContext.scores).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

Tugasmu:
- Jawab pertanyaan siswa tentang karier, jurusan kuliah, skill yang perlu dikembangkan
- Berikan saran yang spesifik dan actionable berdasarkan profil mereka
- Jika ditanya di luar topik karier/pendidikan, arahkan kembali dengan sopan
- Jawab singkat dan padat (maks 200 kata) kecuali diminta penjelasan detail
- Gunakan emoji sesekali untuk membuat percakapan lebih hidup`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

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
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
