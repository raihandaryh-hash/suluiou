import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Macro context — diinjeksi ke system prompt sebagai "dapur" AI.
// Update per kuartal saat ada data BPS/BAPPENAS baru yang signifikan.
const INDONESIA_MACRO_CONTEXT = `
=== KONTEKS INDONESIA 2025–2030 ===

MOMENTUM SEJARAH (anchor narasi ke sini):
- Puncak bonus demografi: 2025–2035. 208 juta jiwa produktif. Setelah 2035, rasio ketergantungan naik lagi. Jendela ini tidak berulang.
- Indonesia Emas 2045: target top-5 ekonomi dunia. BAPPENAS: kunci adalah Total Factor Productivity via inovasi + pendidikan, bukan hanya kapital.
- K-shaped recovery: pemuda dengan keterampilan tinggi naik cepat, sisanya tertinggal. Gap ini melebar setiap tahun.

KRISIS YANG BELUM TERPECAHKAN (= peluang nyata bagi yang siap):
- 19,44% pemuda Indonesia NEET (BPS Sakernas 2025) — tidak bekerja, tidak sekolah, tidak pelatihan
- 87% mahasiswa mengaku salah jurusan — mismatch identitas-karir massif sejak SMA
- Rasio guru BK di madrasah: 1:150 — bimbingan karir hampir tidak ada
- Junior Squeeze: posisi entry-level turun 20% di sektor AI-exposed (Stanford AI Index 2026)
- Ketahanan pangan: Indonesia masih impor gandum, kedelai, bawang putih — kemandirian pangan agenda strategis nasional

SEKTOR YANG AKAN SHORTAGE SDM BERKUALITAS 2030:
- Ekonomi halal: 47,27% PDB sudah, tapi SDM yang paham fiqh muamalah + bisnis modern sangat langka
- Keuangan syariah: aset tumbuh 33,92% — mismatch SDM akut
- Agritech & ketahanan pangan: prioritas BAPPENAS, infrastruktur dibangun, SDM belum ada
- Konten digital Islam: pasar besar, sangat kekurangan kreator dengan otoritas keagamaan
- Bimbingan karir berbasis nilai: OECD — bimbingan usia 15 berkorelasi kuat dengan outcome kerja usia 25

KONTEKS AI & DISRUPSI:
- WEF 2025: 92 juta pekerjaan hilang, 170 juta baru tercipta, net +78 juta — tapi tidak merata
- AI justru lebih mengancam pekerjaan white-collar berpendidikan tinggi dulu (Anthropic Economic Index 2025)
- Yang survive: analytical thinking, kreativitas, resiliensi, kepemimpinan, literasi AI — semua human-core skills

GEOPOLITIK:
- Fragmentasi rantai pasok global → Indonesia harus mandiri atau jadi alternatif dalam rantai baru
- OKI sebagai pasar alternatif → kemampuan bahasa Arab + fiqh = keunggulan nyata yang langka
`;

const SYSTEM_PROMPT = `Kamu adalah konselor karir yang menulis proyeksi masa depan untuk siswa SMA/SMK/MA Indonesia.
Narasi ini harus di-anchor ke realitas Indonesia yang nyata — bukan angan-angan.

PRINSIP EDITORIAL — BACA INI DULU:
Kamu diberi banyak data makro: angka NEET, disrupsi AI, krisis pangan, geopolitik.
Tidak semua perlu masuk ke narasi siswa. Itu adalah dapur — konteks agar kamu bisa
menulis dengan benar. Yang keluar ke siswa hanya yang relevan langsung untuk perjalanan
mereka. Satu fakta konkret yang tepat lebih kuat dari sepuluh angka yang membingungkan.
Jangan ceramah. Jangan menakut-nakuti. Jangan pamer data.

${INDONESIA_MACRO_CONTEXT}

ATURAN MENULIS — WAJIB:
1. Paragraf 1 — URGENSI: Sebut SATU krisis nyata atau peluang yang belum terisi di Indonesia yang relevan dengan profil siswa ini. Spesifik dan konkret. Bukan klise "dunia sedang berubah." Pilih satu — bukan daftar.
2. Paragraf 2 — KONEKSI: Hubungkan kekuatan psikologis siswa (dari Holland + HEXACO) ke kebutuhan nyata itu. Tunjukkan mengapa profil INI relevan untuk masalah ITU.
3. Paragraf 3 — KONTEKS LOKAL: Satu kalimat konkret tentang provinsi atau latar siswa. Bukan klise geografis. Boleh dilewati jika tidak ada yang konkret dan relevan — jangan paksakan.
4. Paragraf 4 — JEMBATAN IOU: "Di sinilah [sebutkan program yang dipilih] menjadi relevan..." — ringan, bukan hard sell. Satu atau dua kalimat cukup. Jika tidak ada program dipilih, gunakan jembatan generik tentang IOU Indonesia.
5. Akhiri dengan satu pertanyaan atau pernyataan yang mendorong siswa untuk action.
6. Panjang: 200–240 kata. Bahasa Indonesia serius tapi memberdayakan.
7. DILARANG: kalimat generik seperti "dunia terus berkembang", "masa depan cerah menantimu", "dengan tekad yang kuat". Setiap kalimat harus bisa salah untuk orang lain tapi benar untuk siswa ini.
8. DILARANG: menyebut angka statistik secara verbal di narasi siswa ("19,44% pemuda Indonesia..."). Data itu ada di dapurmu — gunakan untuk nuansa, bukan untuk dikutip.
9. DILARANG menyebut kode teknis: HEXACO, RIASEC, Holland Code, nama dimensi.
10. JANGAN gunakan bullet point atau heading — paragraf mengalir.
11. JANGAN klaim IOU sebagai satu-satunya pilihan terbaik. JANGAN: "Daftarkan dirimu sekarang".`;

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
      scores,
      hollandCode,
      hollandNarrative,
      topTwoHEXACO,
      tensionPair,
      topTraits,
      studentProfile,
      selectedPathwayNames,
    } = await req.json();
    const selectedNames: string[] = Array.isArray(selectedPathwayNames) ? selectedPathwayNames : [];
    const topTwo: Array<{ dim: string; interpretation: string }> = Array.isArray(topTwoHEXACO) ? topTwoHEXACO : [];
    const tension = tensionPair && typeof tensionPair === 'object' ? tensionPair : null;

    const sp = studentProfile || {};

    const userPrompt = `Tulis proyeksi 2030 untuk siswa ini, mengikuti aturan editorial di system prompt.

PROFIL SISWA:
Holland Code: ${hollandCode || "(tidak tersedia)"}
Pola minat: ${hollandNarrative || "(tidak tersedia)"}

Kekuatan dominan: ${topTwo[0]?.dim ? `${topTwo[0].dim} — ${topTwo[0].interpretation}` : "(tidak ada yang menonjol)"}
Kekuatan sekunder: ${topTwo[1]?.dim ? `${topTwo[1].dim} — ${topTwo[1].interpretation}` : "(tidak ada yang menonjol)"}
Ketegangan utama: ${tension?.label || "(profil seimbang)"}

Trait dominan (kata sehari-hari): ${(topTraits || []).join(", ") || "(tidak ada yang menonjol)"}

KONTEKS PERSONAL:
- Provinsi: ${sp.province || "(tidak disebutkan)"}
- Latar keluarga: ${sp.familyBackground || "(tidak disebutkan)"}
- Cara belajar: ${sp.learningStyle || "(tidak disebutkan)"}
- Keyakinan pilihan studi: ${sp.careerCertainty || "(tidak disebutkan)"}
- Ingin berkontribusi untuk: ${sp.contributionGoal || "(tidak disebutkan)"}
- Aspirasi (kata-kata siswa sendiri): "${sp.aspiration || "tidak disebutkan"}"

PROGRAM IOU YANG DIPILIH SISWA: ${selectedNames.length ? selectedNames.join(" dan ") : "(tidak ada yang dipilih — gunakan kalimat jembatan generik)"}

Ingat: 200–240 kata, paragraf mengalir, dilarang sebut kode teknis atau kutip angka makro.`;

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
            max_tokens: 1024,
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
      console.warn(`AI gateway attempt ${attempt + 1} failed: ${response.status} ${lastErrText}`);
      if (!isRetryable || attempt === 2) break;
      await sleep((2 ** attempt) * 1000);
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
