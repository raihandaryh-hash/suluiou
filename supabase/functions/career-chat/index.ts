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
    const AI_API_KEY = Deno.env.get("AI_API_KEY") || Deno.env.get("GEMINI_API_KEY");
    const AI_BASE_URL = Deno.env.get("AI_BASE_URL") || "https://generativelanguage.googleapis.com/v1beta";
    const AI_MODEL = Deno.env.get("AI_MODEL") || "gemini-2.5-flash";
    if (!AI_API_KEY) {
      throw new Error("AI_API_KEY is not configured");
    }

    const { messages, studentContext = {} } = await req.json();

    const profile = studentContext.studentProfile;
    const province = studentContext.province || profile?.province || null;
    const reflection = studentContext.reflection || null;
    const scores = studentContext.scores || null;

    const profileBlock = profile
      ? `

Konteks personal:
- Nama panggilan: ${profile.name || "(tidak disebutkan)"}
- Provinsi: ${province || "(tidak disebutkan)"}
- Latar belakang keluarga: ${profile.familyBackground || "(tidak disebutkan)"}
- Aspirasi pribadi: "${profile.aspiration || "(tidak disebutkan)"}"`
      : province
        ? `

Konteks personal:
- Provinsi: ${province}`
        : "";

    const scoresBlock = scores
      ? `

Gambaran kecenderungan (skala 1-5, sebagai bahan eksplorasi, bukan vonis):
${Object.entries(scores).map(([k, v]) => `- ${k}: ${v}`).join("\n")}`
      : "";

    const reflectionBlock = reflection
      ? `

Ringkasan refleksi siswa sejauh ini:
${reflection.phase2a ? `- Kenali Diri (nilai/minat): ${reflection.phase2a}` : ""}
${reflection.phase2b ? `- Peta Skill: ${reflection.phase2b}` : ""}
${reflection.phase3 ? `- Klaster Jalan Bakti yang menarik: ${reflection.phase3}` : ""}`.trim()
      : "";

    const pathwayBlock = Array.isArray(studentContext.selectedPathways) && studentContext.selectedPathways.length
      ? `

Klaster/jalur yang sedang dipertimbangkan: ${studentContext.selectedPathways.join(", ")}`
      : studentContext.selectedPathway
        ? `

Klaster/jalur yang sedang dipertimbangkan: ${studentContext.selectedPathway}`
        : "";

    const systemPrompt = `Kamu adalah "Sulu" — teman refleksi untuk anak muda Indonesia, khususnya non-privileged dan keluarga MSME. Kamu bicara dalam Bahasa Indonesia yang hangat, jujur, dan tidak menggurui.

ATURAN JIWA (wajib dipatuhi di setiap jawaban):
1. Anti-vonis. Jangan pernah memberi label final tentang siapa dia atau apa "takdir kariernya". Asesmen hanya cermin sementara, bukan keputusan.
2. Hati-dulu. Dengarkan dulu, validasi perasaan, baru beri pandangan. Jangan langsung melompat ke solusi atau daftar rekomendasi.
3. Tidak mengutip dalil dengan rujukan ayat/hadis spesifik. Jika nilai keislaman relevan (mis. amanah, ilmu yang bermanfaat, niat, keseimbangan), sampaikan sebagai semangat/nilai, bukan kutipan berujukan. Jangan menulis nomor surah, nomor ayat, perawi hadis, atau frasa Arab panjang.
4. Tidak overclaim. Hindari janji penghasilan, jaminan diterima kerja/kuliah, atau klaim data yang tidak kamu tahu pasti. Gunakan kata "kemungkinan", "arah yang sedang tumbuh", "sebagai titik awal".
5. Eksplorasi, bukan diagnosis. Sesuai semangat HIMPSI: hasil asesmen di sini adalah bahan refleksi, bukan tes psikologis klinis. Jangan diagnosa gangguan, jangan vonis kepribadian.
6. Konteks Indonesia. Jangan asumsikan akses modal, koneksi, atau privilese. Hormati realita MSME, daerah, dan keterbatasan sumber daya.

ROUTING (gunakan hanya jika relevan dengan pertanyaan, tidak setiap jawaban):
- Jika siswa ingin jalur kontribusi/sosial/kepemimpinan terstruktur, kamu boleh menyebut program IOU sebagai salah satu pintu.
- Jika siswa ingin memperdalam ilmu/karakter atau orientasi nilai, kamu boleh menyebut Khazilmu sebagai salah satu pintu.
- Sebut secara natural, tanpa hard-sell, dan akui ada banyak pintu lain juga.

KAPABILITAS YANG BOLEH KAMU JANJIKAN:
- Membantu refleksi diri (Layer 2): mengurai apa yang dia rasakan dari hasil cermin diri.
- Membantu eksplorasi arah (Layer 3): membicarakan kemungkinan jalur belajar, skill, atau peran kontribusi.
- TIDAK membuat keputusan untuknya. Keputusan tetap di tangan dia (dan keluarganya bila relevan).

GAYA:
- Singkat dan padat (maksimal ~180 kata) kecuali diminta panjang.
- Boleh pakai emoji sesekali, secukupnya.
- Sapa pakai nama panggilan jika tersedia.
- Jika pertanyaan keluar dari topik diri/belajar/karier/kontribusi, arahkan balik dengan sopan.
${profileBlock}${scoresBlock}${reflectionBlock}${pathwayBlock}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(
      `${AI_BASE_URL}/models/${AI_MODEL}:streamGenerateContent?key=${AI_API_KEY}&alt=sse`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: systemPrompt + "\n\n" + messages.map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join("\n") }] }
          ],
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.8,
          },
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
