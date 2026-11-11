import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { cabangDistress, cabangDistressKeluaran, ARAHAN_LAPIS_KEDUA, saklarHidup, cabangBlokirKeamanan } from "../_shared/distressServer.ts";
import { cabangKlasifikasi } from "../_shared/distressKlasifikasi.ts";
import { siapkanAI } from "../_shared/ai.ts";

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

  // B1: kill-switch. SULU_AI_MATI ("1", "true", "ya") -> 503 sebelum memanggil model.
  if (saklarHidup("SULU_AI_MATI")) {
    return new Response(JSON.stringify({ error: "ai_mati" }), {
      status: 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const medan = body.medan || {};
    const subPicks: string[] = Array.isArray(body.subPicks) ? body.subPicks : [];
    const siapa: string[] = Array.isArray(body.siapa) ? body.siapa : [];
    const province: string | null = body.province || null;
    const personSide = body.personSide || {};
    let skills: string = typeof personSide.skills === "string" ? personSide.skills : "";
    let values: string = typeof personSide.values === "string" ? personSide.values : "";

    // B3a + B5a: cabang distress atas teks pengguna, SEBELUM panggilan model. Tidak ada teks yang disimpan.
    const cabang = cabangDistress("broaden-roles", corsHeaders, skills, values);
    if (cabang) return cabang;
    // Penyedia, usia, mode (c), samaran (KEPUTUSAN Raihan 11 Nov 2026 10.21).
    const siap = await siapkanAI(req, body);
    // D6 lapis 1b: pengklasifikasi keselamatan, hanya bila lapis 1 tidak cocok. Galat/lewat 3 detik -> lanjut.
    const cabang1b = await cabangKlasifikasi(
      "broaden-roles",
      corsHeaders,
      { ai: siap.ai, samaran: siap.samaran },
      skills, values,
    );
    if (cabang1b) return cabang1b;
    // Mode (c): teks bebas (skill dan nilai yang ditulis siswa) tidak dikirim ke AI untuk di bawah 18; pilihan medan tetap.
    if (siap.bawah18) { skills = ""; values = ""; }

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

    const response = await siap.aiFetch(
      "ai:generateContent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: /* B9 lapis kedua, DRAF rumusan */ prompt + ARAHAN_LAPIS_KEDUA }] }],
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
      console.error("AI error:", response.status);
      return json({ error: "Gagal menghubungi AI" }, 500);
    }

    const data = await response.json();
    // Blokir filter keamanan penyedia: rujukan tanda_berat, bukan galat umum.
    const blokir = cabangBlokirKeamanan("broaden-roles", corsHeaders, data);
    if (blokir) return blokir;
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    // B9 periksa keluaran: model menuruti arahan lapis kedua, kirim JSON distress yang sama.
    const keluaranDistress = cabangDistressKeluaran("broaden-roles", corsHeaders, raw);
    if (keluaranDistress) return keluaranDistress;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const gagalDistress = cabangDistressKeluaran("broaden-roles", corsHeaders, raw, true);
      if (gagalDistress) return gagalDistress;
      console.error("Parse fail, panjang:", raw.length);
      return json({ error: "Format jawaban AI tidak terbaca, coba lagi." }, 502);
    }
    return json(parsed, 200);
  } catch (e) {
    console.error(e);
    return json({ error: "Terjadi kesalahan." }, 500);
  }
});
