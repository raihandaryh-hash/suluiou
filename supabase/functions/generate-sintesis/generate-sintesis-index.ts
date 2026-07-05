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

function clip(s: unknown, max = 400): string {
  return typeof s === "string" ? s.slice(0, max) : "";
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
    const fondasi: { q: string; a: string }[] = Array.isArray(body.fondasi)
      ? body.fondasi.map((x: { q: unknown; a: unknown }) => ({ q: clip(x?.q, 120), a: clip(x?.a) }))
      : [];
    const skills: string[] = Array.isArray(body.skills) ? body.skills.map((s: unknown) => clip(s, 80)) : [];
    const bakti: string[] = Array.isArray(body.bakti) ? body.bakti.map((s: unknown) => clip(s, 120)) : [];
    const siapa: string[] = Array.isArray(body.siapa) ? body.siapa.map((s: unknown) => clip(s, 80)) : [];
    const roles: string[] = Array.isArray(body.roles) ? body.roles.map((s: unknown) => clip(s, 80)) : [];
    const langkah = clip(body.langkah);

    const ctx = [
      fondasi.length
        ? `Fondasi & nilai yang ia tulis sendiri:\n${fondasi.map((f) => `- ${f.q}: "${f.a}"`).join("\n")}`
        : "",
      skills.length ? `Kemampuan yang ingin ia kuatkan: ${skills.join(", ")}` : "",
      bakti.length ? `Tantangan yang menggerakkan hatinya: ${bakti.join("; ")}` : "",
      siapa.length ? `Kelompok yang ingin ia bantu: ${siapa.join(", ")}` : "",
      roles.length ? `Peran yang sedang ia jajaki: ${roles.join(", ")}` : "",
      langkah ? `Langkah pertama yang ia rancang sendiri: "${langkah}"` : "",
    ]
      .filter(Boolean)
      .join("\n");

    if (!ctx) {
      return json({ error: "Belum ada cukup catatan untuk ditenun." }, 400);
    }

    const prompt = `Kamu membantu seorang siswa SMA/MA Indonesia melihat benang merah dari perjalanan mengenal dirinya. Ia sudah menuliskan sendiri potongan-potongannya di sepanjang perjalanan. Tugasmu menenun potongan itu menjadi cerita pendek yang utuh, memakai kata-kata siswa itu sendiri.

DATA SISWA (satu-satunya bahan yang boleh kamu pakai):
${ctx}

Tulis "tenun": 2 sampai 3 paragraf pendek (total maksimal 170 kata), sudut pandang "kamu".

Aturan wajib:
1. HANYA pakai yang ada di data. Dilarang menambah fakta, minat, sifat, pengalaman, atau kesimpulan yang tidak ia tulis.
2. Gemakan kata-katanya sendiri di titik-titik penting, supaya ia mengenali dirinya di cermin ini. Boleh mengutip frasa pendek miliknya apa adanya.
3. DILARANG memvonis: jangan menyebut jurusan, profesi, atau karier sebagai kesimpulan. Peran yang ia jajaki disebut sebagai sesuatu yang sedang ia jelajahi, bukan tujuan akhir. Ini titik awal, bukan penentuan nasib.
4. Bahasa provisional: "mulai terlihat", "sedang tumbuh", "bisa jadi". Hindari "kamu adalah", "jalanmu sudah jelas", atau kepastian sejenis.
5. Kalau ada bagian data yang kosong, jujur: sebut sebagai ruang yang belum dijelajahi. Jangan diisi karangan.
6. Tunjukkan SAMBUNGAN antar potongan: bagaimana nilainya menyambung ke kemampuan yang ia pilih, kemampuannya ke kepedulian, kepeduliannya ke peran dan langkah pertamanya. Sambungan yang masuk akal dari datanya sendiri, bukan daftar ulang.
7. Nada hangat seperti kakak yang membacakan kembali catatan adiknya dengan bangga tapi tenang. Kalimat pendek. Tanpa tanda hubung panjang. Jangan memulai kalimat dengan kata "Dan".
8. NO OVERCLAIM: tanpa statistik, tanpa janji hasil, tanpa superlatif kosong.

"catatan": satu kalimat penutup yang mengingatkan bahwa tenunan ini cermin sementara yang bisa berubah seiring ia tumbuh, dan keputusan selalu di tangannya.`;

    const response = await fetch(
      `${AI_BASE_URL}/models/${AI_MODEL}:generateContent?key=${AI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 1024,
            thinkingConfig: { thinkingBudget: 0 },
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                tenun: { type: "ARRAY", items: { type: "STRING" } },
                catatan: { type: "STRING" },
              },
              required: ["tenun", "catatan"],
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
