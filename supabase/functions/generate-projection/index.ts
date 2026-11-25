import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { cabangDistress, cabangDistressKeluaran, ARAHAN_LAPIS_KEDUA, saklarHidup, cabangBlokirKeamanan } from "../_shared/distressServer.ts";
import { cabangKlasifikasi } from "../_shared/distressKlasifikasi.ts";
import { siapkanAI } from "../_shared/ai.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { gerbangAI, gerbangAsesmen } from "../_shared/gerbang.ts";
import { sebutanPembaca } from "../_shared/usia.ts";


// Macro context — diinjeksi ke system prompt sebagai "dapur" AI.
// Update per kuartal saat ada data BPS/BAPPENAS baru yang signifikan.
const INDONESIA_MACRO_CONTEXT = `
=== KONTEKS INDONESIA 2025–2030 ===

MOMENTUM SEJARAH (anchor narasi ke sini):
- Puncak bonus demografi: 2025–2035. Sekitar 201 juta penduduk usia 15–64 tahun pada 2030 (BPS, Proyeksi Penduduk 2020–2050). Setelah 2035, rasio ketergantungan naik lagi. Jendela ini tidak berulang.
- Indonesia Emas 2045: target top-5 ekonomi dunia. BAPPENAS: kunci adalah Total Factor Productivity via inovasi + pendidikan, bukan hanya kapital.
- K-shaped recovery: pemuda dengan keterampilan tinggi naik cepat, sisanya tertinggal. Gap ini melebar setiap tahun.

KRISIS YANG BELUM TERPECAHKAN (= peluang nyata bagi yang siap):
- 19,44% pemuda Indonesia NEET (BPS Sakernas 2025) — tidak bekerja, tidak sekolah, tidak pelatihan
- Junior Squeeze: posisi entry-level turun 20% di sektor AI-exposed (Stanford AI Index 2026)
- Ketahanan pangan: Indonesia masih impor gandum, kedelai, bawang putih — kemandirian pangan agenda strategis nasional

SEKTOR YANG AKAN SHORTAGE SDM BERKUALITAS 2030:
- Ekonomi halal (HVC): kontribusi ke PDB ~26% [CATATAN: Sumber: KNEKS 2024. Dikoreksi 21 Jul 2026 — selaras fix skill-map 8 Jul: 47,27% lama itu AUS/Aktivitas Usaha Syariah keseluruhan, bukan HVC], tapi SDM yang paham fiqh muamalah + bisnis modern sangat langka
- Keuangan syariah: pangsa pasar perbankan syariah 7,72% dari total nasional, aset tumbuh 9,88% dalam setahun [CATATAN: Sumber: OJK, Des 2024. Dikoreksi 21 Jul 2026 — 33,92% lama itu KEKSI 2023 pangsa aset-syariah/PDB yang mislabel sebagai "pertumbuhan"] — mismatch SDM akut
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

// DRAF rumusan, menunggu paket Raihan (D4: aturan 1 dan 10 diganti peta peluang berjamak; D3: aturan 4 jalur belajar berjamak).
// Audit niat 24 Nov D1: "konselor karir" bertentangan dengan 1 Jun ("Yakin kita posisikan diri sebagai bimbingan karier?"); diganti peran cermin. Pembaca kini dewasa (asesmen hanya untuk dewasa, KEPUTUSAN 6 Jul).
const SYSTEM_PROMPT = `Kamu adalah cermin yang membantu seseorang menimbang beberapa kemungkinan arah ke depan. Kamu bukan konselor karier dan tidak menentukan arah siapa pun. Sulu dipakai beragam pengguna (siswa, mahasiswa, orang tua, guru BK, guru, umum); pembaca saat ini disebut di baris PEMBACA. Di aturan di bawah, "siswa" berarti pembaca ini; sesuaikan contoh dan jalur dengan peran pembaca, jangan anggap semua pembaca sedang kuliah.
Narasi ini harus di-anchor ke realitas Indonesia yang nyata, bukan angan-angan.

PRINSIP EDITORIAL — BACA INI DULU:
Kamu diberi banyak data makro: angka NEET, disrupsi AI, krisis pangan, geopolitik.
Tidak semua perlu masuk ke narasi siswa. Itu adalah dapur — konteks agar kamu bisa
menulis dengan benar. Yang keluar ke siswa hanya yang relevan langsung untuk perjalanan
mereka. Satu fakta konkret yang tepat lebih kuat dari sepuluh angka yang membingungkan.
Jangan ceramah. Jangan menakut-nakuti. Jangan pamer data.

${INDONESIA_MACRO_CONTEXT}

ATURAN MENULIS — WAJIB:
1. Paragraf 1, PETA PELUANG: Gambarkan dua sampai tiga kemungkinan arah di tahun 2030 yang masuk akal untuk cara berpikir siswa ini, masing-masing dalam satu sampai dua kalimat yang konkret. Pakai bahasa sementara ("mungkin", "salah satu kemungkinan", "bisa jadi"), bukan vonis. Kaitkan tiap kemungkinan ke kebutuhan Indonesia yang nyata dan belum terpenuhi. Tegaskan bahwa ini bahan untuk ditimbang, bukan penentuan arah.
2. Paragraf 2 — KONEKSI: Hubungkan kekuatan psikologis siswa (dari pola minat RIASEC + kepribadian enam faktor) ke kebutuhan nyata itu. Tunjukkan mengapa profil INI relevan untuk masalah ITU.
3. Paragraf 3 — KONTEKS LOKAL: Satu kalimat konkret tentang provinsi atau latar siswa. Bukan klise geografis. Boleh dilewati jika tidak ada yang konkret dan relevan — jangan paksakan.
4. Paragraf 4, JALUR BELAJAR: Sebut beberapa jalur belajar yang bisa mendekatkan siswa ke kemungkinan tadi, sesuai tahap hidup pembaca di baris PEMBACA. Untuk siswa sekolah: kuliah di berbagai kampus, pendidikan vokasi, kursus singkat, atau belajar sambil bekerja. Untuk mahasiswa: mata kuliah pilihan, magang, organisasi, proyek, atau studi lanjut. Untuk orang tua, guru, guru BK, dan umum: belajar sambil bekerja, kursus atau sertifikasi singkat, kuliah lanjutan bila memungkinkan, peran di komunitas, atau pindah peran di tempat kerja; jangan anggap mereka akan mulai kuliah dari awal. Bila siswa memilih program IOU, program itu boleh disebut sebagai salah satu jalur di antara yang lain, ringan dan tanpa hard sell. Bila tidak ada program dipilih, IOU cukup disebut sebagai salah satu pintu di antara banyak pintu lain. Tulis nama IOU persis "IOU" atau "International Open University (IOU)"; jangan mengarang kepanjangan lain.
5. Akhiri dengan satu pertanyaan atau pernyataan yang mendorong siswa untuk action.
6. Panjang: 200–240 kata. Bahasa Indonesia serius tapi memberdayakan.
7. DILARANG: kalimat generik seperti "dunia terus berkembang", "masa depan cerah menantimu", "dengan tekad yang kuat". Setiap kalimat harus bisa salah untuk orang lain tapi benar untuk siswa ini.
8. DILARANG: menyebut angka statistik secara verbal di narasi siswa ("19,44% pemuda Indonesia..."). Data itu ada di dapurmu — gunakan untuk nuansa, bukan untuk dikutip.
9. DILARANG menyebut kode teknis: HEXACO, RIASEC, Holland Code, nama dimensi.
10. DILARANG memvonis satu jurusan, satu karier, atau satu arah sebagai jawaban. Sajikan beberapa kemungkinan yang setara, lalu kembalikan pilihan kepada siswa dan keluarganya.
11. DILARANG: mengulang kata-kata dari aspirasi siswa secara literal. Tafsirkan maknanya — tunjukkan kamu mengerti lebih dalam dari sekadar apa yang mereka tulis.
10. JANGAN gunakan bullet point atau heading — paragraf mengalir.
11. JANGAN klaim IOU sebagai satu-satunya pilihan terbaik. JANGAN: "Daftarkan dirimu sekarang".

ATURAN DATA YANG TIDAK BOLEH DILANGGAR:
- Semua angka yang kamu sebut dalam narasi HARUS berasal dari data konteks yang diberikan di atas. Tidak boleh mengarang angka baru.
- Jika tidak ada data presisi untuk suatu klaim, gunakan framing kualitatif: "berdasarkan tren yang ada" atau "diperkirakan".
- JANGAN gunakan "kamu akan" — gunakan "kamu mungkin" atau "kamu cenderung".
- JANGAN gunakan "kamu adalah" untuk menyebut sifat atau karakter — gunakan "dari yang kamu ceritakan, kamu cenderung".
- Narasi ini adalah bayangan skenario, bukan ramalan. Framing harus selalu "ikhtiar kita, hasil milik Allah."
- Nama asli siswa sudah diganti dengan "kamu" sebelum sampai ke sini. Pertahankan "kamu".`;

// TODO(Round 2b): Badge "Bayangan, bukan ramalan" — untuk UI assessment locked.
// Sisipkan label confidence ini saat hasil proyeksi ditampilkan ke pengguna di masa depan.

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

  // A7: kunci asesmen di server kini lewat gerbangAsesmen sesudah identitas diketahui.

  try {
    const badan = await req.json();
    const {
      scores,
      hollandCode,
      hollandNarrative,
      topTwoHEXACO,
      tensionPair,
      topTraits,
      studentProfile,
      selectedPathwayNames,
    } = badan;

    // B3a + B5a: cabang distress atas teks pengguna, SEBELUM panggilan model. Tidak ada teks yang disimpan.
    const cabang = cabangDistress(
      "generate-projection",
      corsHeaders,
      studentProfile?.aspiration,
      studentProfile?.contributionGoal,
      studentProfile?.familyBackground,
    );
    if (cabang) return cabang;
    // Penyedia, usia, mode (c), samaran (KEPUTUSAN Raihan 11 Nov 2026 10.21).
    const siap = await siapkanAI(req, badan);
    // G2-13: tanpa akun sah -> 401, batas laju -> 429, sebelum pengklasifikasi dan model.
    const gerbang = await gerbangAI(req, "generate-projection", corsHeaders, siap);
    if (gerbang) return gerbang;
    // Spine A: admin selalu; dewasa bila dibuka Raihan; siswa tertutup (KEPUTUSAN 6 Jul).
    const gerbangA = await gerbangAsesmen("generate-projection", corsHeaders, siap);
    if (gerbangA) return gerbangA;
    // D6 lapis 1b: pengklasifikasi keselamatan, hanya bila lapis 1 tidak cocok. Galat/lewat 3 detik -> lanjut.
    const cabang1b = await cabangKlasifikasi(
      "generate-projection",
      corsHeaders,
      { ai: siap.ai, samaran: siap.samaran },
      studentProfile?.aspiration,
      studentProfile?.contributionGoal,
      studentProfile?.familyBackground,
    );
    if (cabang1b) return cabang1b;
    const selectedNames: string[] = Array.isArray(selectedPathwayNames) ? selectedPathwayNames : [];
    const topTwo: Array<{ dim: string; interpretation: string }> = Array.isArray(topTwoHEXACO) ? topTwoHEXACO : [];
    const tension = tensionPair && typeof tensionPair === 'object' ? tensionPair : null;

    // Mode (c): teks bebas profil (latar keluarga, tujuan kontribusi, aspirasi) tidak dikirim ke AI untuk di bawah 18.
    const sp = siap.bawah18
      ? { ...(studentProfile || {}), familyBackground: undefined, contributionGoal: undefined, aspiration: undefined }
      : (studentProfile || {});

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

PROGRAM IOU YANG DIPILIH SISWA: ${selectedNames.length ? selectedNames.join(" dan ") : "(tidak ada yang dipilih, sebut IOU hanya sebagai salah satu pintu)"}

Ingat: 200–240 kata, paragraf mengalir, dilarang sebut kode teknis atau kutip angka makro.`;

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    let response: Response | null = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);
      try {
        response = await siap.aiFetch("ai:generateContent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: /* B9 lapis kedua, DRAF rumusan */ SYSTEM_PROMPT + `\nPEMBACA: ${sebutanPembaca(siap.peran)}.\n` + ARAHAN_LAPIS_KEDUA }] },
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: {
              maxOutputTokens: 1024,
              temperature: 0.65,
            },
          }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (response.ok) break;

      const isRetryable = response.status === 429 || response.status >= 500;
      await response.body?.cancel().catch(() => {});
      console.warn(`AI gateway attempt ${attempt + 1} failed: ${response.status}`);
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
      console.error("AI gateway error after retries:", status);
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    // Blokir filter keamanan penyedia: rujukan tanda_berat, bukan galat umum.
    const blokir = cabangBlokirKeamanan("generate-projection", corsHeaders, data);
    if (blokir) return blokir;
    const projection = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!projection) {
      console.error("No content in AI response, finishReason:", data?.candidates?.[0]?.finishReason ?? "none", "blockReason:", data?.promptFeedback?.blockReason ?? "none");
      throw new Error("No content in AI response");
    }

    // B9 periksa keluaran: model menuruti arahan lapis kedua, kirim JSON distress yang sama.
    const keluaranDistress = cabangDistressKeluaran("generate-projection", corsHeaders, projection);
    if (keluaranDistress) return keluaranDistress;

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
