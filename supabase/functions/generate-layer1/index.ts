import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Kamu adalah konselor pengembangan diri yang menulis profil kepribadian untuk siswa SMA/SMK/MA berusia 15-18 tahun di Indonesia. Tugasmu menulis narasi yang jujur, hangat, dan memberdayakan — bukan menjual apapun, bukan memuji berlebihan.

ATURAN MUTLAK — jangan dilanggar satupun:
1. JANGAN sebut nama program studi, universitas, lembaga, atau merek apapun
2. JANGAN sebut kode teknis: HEXACO, RIASEC, Holland Code, atau kode dimensi (H, E, X, A, C, O, R, I, S)
3. Tulis dalam Bahasa Indonesia yang natural — bukan bahasa akademik
4. Gunakan "kamu" sepanjang narasi
5. Panjang: 150-200 kata. Tidak lebih, tidak kurang.
6. Nada: reflektif dan jujur — bukan pujian kosong, bukan kritik menyerang
7. JANGAN gunakan bullet point, heading, atau formatting — paragraf mengalir saja

STRUKTUR NARASI (ikuti urutan ini):
1. Kalimat pembuka (1-2 kalimat): langsung gambarkan kekuatan terbesar — konkret dan spesifik, bukan klise
2. Karakteristik pendukung (2-3 kalimat): trait lain yang memperkaya profil, dengan contoh konkret bagaimana trait ini muncul dalam kehidupan sehari-hari
3. Catatan jujur (1 kalimat): satu area yang perlu perhatian — sampaikan hormat dan konstruktif, tidak menghakimi
4. Kalimat penutup (1 kalimat): buka rasa ingin tahu tentang langkah selanjutnya — jangan simpulkan, cukup buka pintu

CARA MEMBACA SKOR HEXACO (1.0-5.0):
Lebih dari 3.8 = sangat dominan, jadikan fokus utama
3.5-3.7 = dominan, sebutkan sebagai pendukung
2.5-3.4 = netral, tidak perlu disorot
Kurang dari 2.4 = area perhatian, sebutkan konstruktif di bagian catatan jujur

Makna dimensi dalam bahasa sehari-hari:
H tinggi = tidak silau oleh status, kata dan tindakan selaras, tidak suka pura-pura
H rendah = pragmatis soal reputasi, bisa memanfaatkan situasi untuk keuntungan sendiri
E tinggi = merasakan dengan dalam, mudah tersentuh, peka terhadap orang sekitar
E rendah = tenang di bawah tekanan, tidak mudah cemas, bisa tampak kurang empati
X tinggi = energi sosial tinggi, nyaman jadi pusat perhatian, antusias
X rendah = lebih nyaman sendiri, pemikir mendalam, memilih interaksi yang bermakna
A tinggi = sabar, memaafkan, menghindari konflik, mudah bekerja sama
A rendah = tegas, tidak segan berdebat, punya pendirian kuat
C tinggi = teratur, disiplin, tidak puas dengan hasil setengah-setengah
C rendah = fleksibel, spontan, bisa kesulitan dengan rutinitas ketat
O tinggi = rasa ingin tahu tinggi, suka ide baru, imajinatif
O rendah = praktis, lebih suka yang terbukti, tidak tertarik hal abstrak

CARA MEMBACA HOLLAND CODE:
Gunakan untuk memperkaya narasi secara natural — bukan sebagai label.
R = senang bekerja dengan tangan, alat, atau alam
I = senang menganalisis, meneliti, memecahkan teka-teki
A = senang berekspresi, menciptakan, berimajiinasi
S = senang membantu, mengajar, bekerja dengan dan untuk orang lain
E = senang memimpin, meyakinkan, mengambil inisiatif
C = senang dengan keteraturan, sistem, dan detail

CARA MENYESUAIKAN TONE berdasarkan careerCertainty:
"sudah tahu mau ke mana" = narasi konfirmatif, validasi kekuatan yang mendukung pilihan
"masih bingung" = narasi eksploratif, normalkan kebingungan, tekankan profil ini sebagai titik awal
"belum kepikiran sama sekali" = narasi membuka kesadaran perlahan, tidak memaksa, undang bertanya pada diri sendiri

CARA MEMASUKKAN contributionGoal:
Jangan sebut mentah-mentah. Masukkan sebagai nilai yang sudah terlihat dari profil.
Contoh: contributionGoal "masyarakat luas" + S tinggi = "Ada dalam dirimu dorongan yang tulus untuk hadir bagi orang-orang — bukan sekadar membantu, tapi benar-benar peduli."`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const AI_BASE_URL = Deno.env.get("AI_BASE_URL")
      || "https://ai.gateway.lovable.dev/v1/chat/completions";
    const apiKey = Deno.env.get("AI_API_KEY") || Deno.env.get("LOVABLE_API_KEY");
    const AI_MODEL = Deno.env.get("AI_MODEL") || "gemini-2.5-flash";

    if (!apiKey) throw new Error("AI API key is not configured");

    const { hexaco, riasec, hollandCode, topHexacoTraits, profile } = await req.json();

    const safeProfile = profile || {};
    const traits = Array.isArray(topHexacoTraits) ? topHexacoTraits : [];

    const userPrompt = `Tulis profil psikologis untuk siswa ini.

SKOR KEPRIBADIAN (HEXACO, skala 1-5):
- Kejujuran & Kerendahan Hati: ${hexaco?.H ?? "(n/a)"}
- Emosionalitas: ${hexaco?.E ?? "(n/a)"}
- Ekstraversi: ${hexaco?.X ?? "(n/a)"}
- Keramahan: ${hexaco?.A ?? "(n/a)"}
- Kehati-hatian: ${hexaco?.C ?? "(n/a)"}
- Keterbukaan: ${hexaco?.O ?? "(n/a)"}

SKOR MINAT KARIER (RIASEC, skala 1-5):
- Realistic: ${riasec?.R ?? "(n/a)"}
- Investigative: ${riasec?.I ?? "(n/a)"}
- Artistic: ${riasec?.A ?? "(n/a)"}
- Social: ${riasec?.S ?? "(n/a)"}
- Enterprising: ${riasec?.E ?? "(n/a)"}
- Conventional: ${riasec?.C ?? "(n/a)"}

Holland Code (3 minat tertinggi): ${hollandCode || "(tidak tersedia)"}
Trait kepribadian dominan: ${traits.length ? traits.join(", ") : "(tidak ada yang menonjol)"}

Konteks siswa:
- Cara belajar: ${safeProfile.learningStyle || "(tidak disebutkan)"}
- Keyakinan pilihan studi: ${safeProfile.careerCertainty || "(tidak disebutkan)"}
- Ingin berkontribusi untuk: ${safeProfile.contributionGoal || "(tidak disebutkan)"}
- Aspirasi: "${safeProfile.aspiration || "tidak disebutkan"}"

150-200 kata, Bahasa Indonesia, tanpa mention lembaga atau kode teknis.`;

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
            max_tokens: 512,
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
      console.warn(`generate-layer1 attempt ${attempt + 1} failed: ${response.status} ${lastErrText}`);
      if (!isRetryable || attempt === 2) break;
      await sleep((2 ** attempt) * 1000);
    }

    if (!response || !response.ok) {
      console.error("generate-layer1 gateway error:", response?.status, lastErrText);
      return new Response(JSON.stringify({ layer1: null }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const layer1 = data.choices?.[0]?.message?.content?.trim() || null;

    return new Response(JSON.stringify({ layer1 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-layer1 error:", e);
    return new Response(JSON.stringify({ layer1: null }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
