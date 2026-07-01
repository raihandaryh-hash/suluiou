import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function json(obj: unknown, status: number) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const AI_API_KEY = Deno.env.get("AI_API_KEY") || Deno.env.get("GEMINI_API_KEY");
    const AI_BASE_URL =
      Deno.env.get("AI_BASE_URL") || "https://generativelanguage.googleapis.com/v1beta";
    const AI_MODEL = Deno.env.get("AI_MODEL") || "gemini-2.5-flash";
    if (!AI_API_KEY) throw new Error("AI_API_KEY is not configured");

    const body = await req.json();
    const medan = body.medan || {};
    const subPicks: string[] = Array.isArray(body.subPicks) ? body.subPicks : [];
    const siapa: string[] = Array.isArray(body.siapa) ? body.siapa : [];
    const province: string | null = body.province || null;
    const personSide = body.personSide || {};
    const skills: string = typeof personSide.skills === "string" ? personSide.skills : "";
    const values: string = typeof personSide.values === "string" ? personSide.values : "";

    const ctx = [
      `Medan yang dipilih siswa: ${medan.nama || "(tidak disebutkan)"}`,
      subPicks.length ? `Sub-tantangan yang ia soroti: ${subPicks.join(", ")}` : "",
      siapa.length ? `Kelompok yang ingin ia bantu: ${siapa.join(", ")}` : "",
      province ? `Provinsi: ${province}` : "",
      skills ? `Skill yang ia kenali pada dirinya: ${skills}` : "",
      values ? `Nilai/karakter yang ia sebut: ${values}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const prompt = `Kamu membantu siswa SMA/MA Indonesia memperluas cakrawala tentang peran-peran nyata di satu medan kontribusi. Banyak siswa hanya membayangkan sedikit pekerjaan yang itu-itu saja. Tugasmu menyalakan peran-peran yang jarang mereka lihat.

${ctx}

Sebutkan 6 peran atau jabatan NYATA di medan itu, campuran antara yang umum dikenal dan yang jarang terlihat siswa. Utamakan jabatan yang benar-benar ada di Indonesia (rujuk gaya Klasifikasi Baku Jabatan Indonesia / KBJI), termasuk sektor informal, UMKM, atau organisasi masyarakat bila relevan dengan provinsinya.

Aturan wajib:
1. Tiap peran harus terhubung ke tantangan yang siswa pilih, bukan generik.
2. "demandsMost": sebut satu kekuatan (skill atau karakter) yang paling dituntut peran itu. Bila siswa menyebut skill atau nilai dirinya, kaitkan agar ia bisa menimbang mana yang pas dengan bekalnya.
3. "whyUnexpected": jelaskan singkat kenapa peran ini jarang terlihat siswa. Untuk peran yang umum, beri sudut yang mungkin belum ia sadari.
4. "unexpected": true bila peran tergolong jarang terlihat, false bila umum. Sertakan minimal 3 yang true.
5. "pathwayHint": arah pendidikan atau skill menuju peran itu. JANGAN janjikan diterima kerja atau angka gaji. Pakai frasa seperti "salah satu jalur" atau "arah yang sedang tumbuh".
6. NO OVERCLAIM: jangan mengarang jabatan yang tidak nyata. Kalau ragu, pilih peran nyata yang lebih dikenal. Jangan sebut statistik yang tidak kamu ketahui pasti.
7. Anti-vonis: ini titik awal eksplorasi, bukan penentuan nasib.
8. Bahasa Indonesia yang hangat dan mudah dibaca, kalimat pendek, tanpa tanda hubung panjang.

"note": satu kalimat penutup yang menenangkan, mengingatkan bahwa ini titik awal untuk dijelajahi, bukan pilihan yang harus segera dikunci.`;

    const response = await fetch(
      `${AI_BASE_URL}/models/${AI_MODEL}:generateContent?key=${AI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 2048,
            thinkingConfig: { thinkingBudget: 0 },
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                roles: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      title: { type: "STRING" },
                      whatTheyDo: { type: "STRING" },
                      demandsMost: { type: "STRING" },
                      whyUnexpected: { type: "STRING" },
                      pathwayHint: { type: "STRING" },
                      unexpected: { type: "BOOLEAN" },
                    },
                    required: [
                      "title",
                      "whatTheyDo",
                      "demandsMost",
                      "whyUnexpected",
                      "pathwayHint",
                      "unexpected",
                    ],
                  },
                },
                note: { type: "STRING" },
              },
              required: ["roles", "note"],
            },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429)
        return json({ error: "Terlalu banyak permintaan, coba lagi sebentar." }, 429);
      if (response.status === 402) return json({ error: "Kuota AI habis." }, 402);
      const text = await response.text();
      console.error("AI error:", response.status, text);
      return json({ error: "Gagal menghubungi AI" }, 500);
    }

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("Parse fail:", raw);
      return json({ error: "Format jawaban AI tidak terbaca, coba lagi." }, 502);
    }
    return json(parsed, 200);
  } catch (e) {
    console.error(e);
    return json({ error: "Terjadi kesalahan." }, 500);
  }
});
