import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Kamu adalah futurist pendidikan yang menulis proyeksi personal untuk siswa SMA/SMK/MA Indonesia berusia 15-18 tahun. Tugasmu: gambarkan siapa mereka bisa menjadi di tahun 2030 — sekitar 4-5 tahun dari sekarang.

ATURAN MUTLAK:
1. Tulis dalam Bahasa Indonesia yang hangat, membumi, dan memotivasi
2. Gunakan "kamu" sepanjang narasi
3. Panjang: 180-220 kata. Tidak lebih.
4. Nada: hopeful tapi realistis — bukan mimpi kosong, bukan beban berat
5. JANGAN sebut kode teknis (HEXACO, RIASEC, Holland Code, nama dimensi)
6. JANGAN gunakan bullet point atau heading — 2-3 paragraf mengalir

STRUKTUR NARASI:
Paragraf 1 (3-4 kalimat): Siapa kamu di 2030 — peran konkret, cara berkontribusi, nilai yang dibawa. Spesifik untuk profil ini, bukan generik. Gunakan konteks provinsi dan contributionGoal sebagai anchor.
Paragraf 2 (2-3 kalimat): Bagaimana perjalananmu menuju ke sana. Sesuaikan dengan learningStyle dan karakter dominan. Tentang proses, bukan hanya tujuan.
Penutup (1-2 kalimat): Jembatan ringan ke IOU sebagai salah satu jalur — bukan satu-satunya. Contoh tone yang tepat: "Perjalanan ini butuh fondasi yang kuat — dan ada banyak cara untuk membangunnya, salah satunya lewat program-program IOU Indonesia yang dirancang untuk menjawab kebutuhan nyata seperti yang ada di depanmu."

CARA MENGGUNAKAN program pilihan siswa:
Jika ada program yang dipilih, kalimat jembatan ke IOU di akhir narasi boleh menyebut program tersebut secara ringan dan natural. Contoh: "...salah satunya lewat program Psikologi IOU yang memadukan ilmu jiwa modern dengan perspektif Islam."
Jika tidak ada program dipilih, gunakan kalimat jembatan generik.
JANGAN klaim sebagai satu-satunya pilihan terbaik.

CARA MENGGUNAKAN KONTEKS PROVINSI:
Sebutkan konteks sosial-ekonomi atau kebutuhan SDM di provinsi tersebut secara natural dan akurat. Contoh:
- Jawa Barat: kebutuhan pendidikan berkualitas dan teknologi yang terus tumbuh
- Sulawesi Selatan: sektor pertanian dan kelautan yang bertransformasi
- DKI Jakarta: persaingan yang justru membuka peluang bagi yang berkarakter kuat
- Nusa Tenggara Timur: kebutuhan tenaga kesehatan dan pendidikan yang masih sangat besar
Jika tidak yakin detail spesifik, tetap general tapi tidak salah.

CARA MENGGUNAKAN contributionGoal:
Ini benang merah proyeksi — harus tercermin di setiap paragraf:
"keluarga dan orang-orang terdekat" = proyeksi berbasis stabilitas, peran sebagai tulang punggung
"komunitas atau lingkungan sekitar" = proyeksi berbasis peran lokal konkret, perubahan yang terasa dekat
"masyarakat luas" = proyeksi berbasis dampak sistemik, profesi yang menjangkau banyak orang
"belum tahu" = proyeksi berbasis karakter dan nilai, undang siswa membayangkan

CARA MENGGUNAKAN learningStyle:
"belajar sendiri" = tekankan kemandirian dan kemampuan tumbuh tanpa harus selalu diarahkan
"belajar bersama orang lain" = tekankan kolaborasi, belajar dari orang lain, jaringan sebagai aset
"campuran keduanya" = tekankan fleksibilitas dan kemampuan menyesuaikan diri

CARA MENGGUNAKAN careerCertainty:
"sudah tahu" = proyeksi konkret tentang peran spesifik yang selaras profil
"masih bingung" = proyeksi tentang karakter dan nilai sebagai fondasi solid, apapun jalannya
"belum kepikiran" = proyeksi membuka, normalkan posisi mereka, undang berimajinasi

CARA MENGGUNAKAN aspiration:
Jika ada dan bermakna: jadikan titik awal atau benang merah proyeksi.
Jika kosong atau "belum tahu": andalkan Holland Code dan karakter dominan.

CARA MENGGUNAKAN familyBackground:
Latar keluarga membantu memilih bahasa dan referensi yang resonan — bukan stereotip atau membatasi pilihan karier.
- "petani, nelayan, atau peternak" = sentuh ketahanan pangan, transformasi sektor primer, akar yang jadi kekuatan
- "pedagang atau wirausaha" = sentuh insting bisnis, melihat peluang, membangun dari nol sebagai modal
- "karyawan swasta atau buruh" = sentuh etos kerja, kedisiplinan, naik kelas lewat keahlian
- "pegawai negeri, TNI, atau Polri" = sentuh nilai pelayanan publik, integritas, kontribusi pada negara
- "profesional (dokter, guru, insinyur, dll)" = sentuh standar keahlian, jejak yang sudah ada bisa dilanjutkan atau dibelokkan
- "pengusaha atau wiraswasta besar" = sentuh skala dampak, tanggung jawab pada banyak orang, bukan hanya warisan
- "pendakwah, ustadz, atau ulama" = sentuh nilai-nilai keislaman secara natural: orientasi kontribusi sebagai bentuk ibadah, ilmu yang bermanfaat (ilmun yanfa'u), peran sebagai khalifah di bumi, atau menjaga keseimbangan dunia-akhirat. Boleh menyebut istilah seperti "amanah", "barakah", atau "manfaat untuk umat" — tapi jangan dipaksakan, jangan menggurui, jangan terlalu sering. Maksimal 1-2 sentuhan halus dalam keseluruhan proyeksi.
- "lainnya" / "tidak ingin berbagi" = abaikan dimensi ini, andalkan konteks lain

KONTEKS INDONESIA 2030 yang akurat:
- Bonus demografi puncak: Indonesia butuh SDM berkarakter, bukan hanya bergelar
- Sektor yang tumbuh berdasarkan Holland Code:
  S dominan = pendidik, konselor, fasilitator komunitas, pengembang SDM
  I dominan = peneliti, data analyst, tenaga kesehatan, ilmuwan terapan
  E dominan = wirausahawan, pemimpin organisasi, manajer program, advokat kebijakan
  A dominan = desainer komunikasi, kreator konten, pengembang kurikulum
  C dominan = akuntan, analis sistem, koordinator program, administrator publik
  R dominan = insinyur, teknisi, ahli pertanian modern, perancang infrastruktur

YANG TIDAK BOLEH di kalimat jembatan IOU:
Jangan: "IOU adalah pilihan terbaik untukmu", "Daftarkan dirimu sekarang", atau klaim berlebihan.`;

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

    const { scores, hollandCode, pathway, topTraits, studentProfile, selectedPathwayNames } = await req.json();
    const selectedNames: string[] = Array.isArray(selectedPathwayNames) ? selectedPathwayNames : [];

    const sp = studentProfile || {};

    const userPrompt = `Tulis proyeksi 2030 untuk siswa ini.

KEPRIBADIAN (HEXACO, skala 1-5):
- Kejujuran & Kerendahan Hati: ${scores.honesty}
- Emosionalitas: ${scores.emotionality}
- Ekstraversi: ${scores.extraversion}
- Keramahan: ${scores.agreeableness}
- Kehati-hatian: ${scores.conscientiousness}
- Keterbukaan: ${scores.openness}

MINAT KARIER (RIASEC, skala 1-5):
- Realistic: ${scores.realistic}
- Investigative: ${scores.investigative}
- Artistic: ${scores.artistic}
- Social: ${scores.social}
- Enterprising: ${scores.enterprising}
- Conventional: ${scores.conventional}

Holland Code: ${hollandCode || "(tidak tersedia)"}
Trait dominan (bahasa sehari-hari): ${(topTraits || []).join(", ") || "(tidak ada yang menonjol)"}

KONTEKS PERSONAL:
- Provinsi: ${sp.province || "(tidak disebutkan)"}
- Latar keluarga: ${sp.familyBackground || "(tidak disebutkan)"}
- Cara belajar: ${sp.learningStyle || "(tidak disebutkan)"}
- Keyakinan pilihan studi: ${sp.careerCertainty || "(tidak disebutkan)"}
- Ingin berkontribusi untuk: ${sp.contributionGoal || "(tidak disebutkan)"}
- Aspirasi: "${sp.aspiration || "tidak disebutkan"}"
- Program IOU yang menarik minat siswa: ${selectedNames.length ? selectedNames.join(" dan ") : "(tidak ada yang dipilih — gunakan kalimat jembatan generik)"}

180-220 kata, Bahasa Indonesia, 2-3 paragraf mengalir.`;

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
