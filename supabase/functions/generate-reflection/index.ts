import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Kamu membantu siswa memahami refleksi diri yang sudah mereka tulis sendiri.

Tugasmu adalah MENGORGANISIR dan MERANGKAI jawaban mereka menjadi narasi yang koheren — bukan menilai, bukan mendiagnosis, bukan menambah interpretasi baru.

ATURAN YANG TIDAK BOLEH DILANGGAR:

JANGAN menambahkan label kepribadian yang tidak ada di jawaban siswa (introvert, extrovert, melankolis, dll)

JANGAN mendiagnosis atau menilai kualitas jawaban

JANGAN menggunakan "kamu adalah X" — gunakan "dari yang kamu tuliskan, kamu cenderung memilih"

JANGAN menggunakan "kamu akan" — gunakan "kamu mungkin" atau "kamu cenderung"

Jika input terlalu singkat untuk dirangkai, katakan "refleksimu masih bisa dikembangkan — coba tambahkan lebih banyak detail"

Mulai narasi dengan: "Dari yang kamu tuliskan sendiri..."

JANGAN menyebut IOU, nama kampus, atau program studi apapun

Nama siswa sudah diganti menjadi "kamu" sebelum sampai ke sini — pertahankan "kamu" saja`;

const FALLBACK = "Refleksimu sudah tersimpan. Untuk melihat ringkasan, coba muat ulang halaman ini.";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { session_id, values_top3, possible_selves, odyssey_plans } = await req.json();

    if (!session_id) {
      return new Response(JSON.stringify({ error: "session_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const plans = Array.isArray(odyssey_plans) ? odyssey_plans : [];
    const planA = plans.find((p: any) => p.lintasan === "A") || { judul: "", gambaran: "" };
    const planB = plans.find((p: any) => p.lintasan === "B") || { judul: "", gambaran: "" };
    const planC = plans.find((p: any) => p.lintasan === "C") || { judul: "", gambaran: "" };
    const ps = possible_selves || {};

    const userPrompt = `Siswa ini memilih nilai-nilai berikut sebagai yang paling penting baginya (urutan dari paling penting): ${(values_top3 || []).join(", ")}.

Diri yang ia harapkan di 2030: "${ps.harapan || ""}"

Diri yang ia khawatirkan: "${ps.kekhawatiran || ""}"

Diri yang ia harap-bisa: "${ps.harap_bisa || ""}"

Tiga lintasan hidup yang ia bayangkan: Lintasan A (${planA.judul}): ${planA.gambaran} Lintasan B (${planB.judul}): ${planB.gambaran}
Lintasan C (${planC.judul}): ${planC.gambaran}

Rangkai jawaban-jawaban ini menjadi narasi refleksi diri yang koheren. Panjang: 200-300 kata. Awali dengan "Dari yang kamu tuliskan sendiri..."`;

    const apiKey = Deno.env.get("AI_API_KEY") || Deno.env.get("GEMINI_API_KEY");
    const AI_BASE_URL = Deno.env.get("AI_BASE_URL") || "https://generativelanguage.googleapis.com/v1beta";
    const AI_MODEL = Deno.env.get("AI_MODEL") || "gemini-2.5-flash";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    let narrative = FALLBACK;

    if (apiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);
        const aiResp = await fetch(`${AI_BASE_URL}/models/${AI_MODEL}:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: {
              maxOutputTokens: 1024,
              temperature: 0.6,
            },
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (aiResp.status === 402) {
          return new Response(
            JSON.stringify({ error: "Payment required, please add credits to your Lovable AI workspace." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (aiResp.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (aiResp.ok) {
          const data = await aiResp.json();
          const text = data.choices?.[0]?.message?.content?.trim();
          if (text) narrative = text;
        } else {
          console.error("AI gateway error:", aiResp.status, await aiResp.text().catch(() => ""));
        }
      } catch (e) {
        console.error("AI call failed:", e);
      }
    } else {
      console.error("No AI API key configured");
    }

    const { error: upErr } = await supabase
      .from("kenali_dirimu_sessions")
      .update({ ai_narrative: narrative, completed: true })
      .eq("session_id", session_id);

    if (upErr) console.error("Update error:", upErr);

    return new Response(JSON.stringify({ narrative }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-reflection error:", e);
    return new Response(
      JSON.stringify({ narrative: FALLBACK, error: e instanceof Error ? e.message : "Unknown" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
