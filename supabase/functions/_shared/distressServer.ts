// Tonggak 1 B3a, B5a, B9: cabang distress sisi server, dipakai keenam edge function.
import { periksaDistressNilai, type TingkatDistress, DAFTAR_VERSI } from "./distress.ts";
import { RUJUKAN_POLOS } from "./distressRujukan.ts";

export { periksaDistressNilai };

/**
 * Kill-switch longgar: "1", "true", "ya" (tanpa membedakan huruf besar kecil) berarti hidup.
 * Dipakai SULU_AI_MATI dan SULU_KLASIFIKASI_MATI. SULU_ASESMEN_TERBUKA TIDAK memakai ini
 * (tetap ketat "1", gagal tertutup).
 */
export function saklarHidup(nama: string): boolean {
  const v = (Deno.env.get(nama) ?? "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "ya";
}

/**
 * Jawaban penyedia diblokir filter keamanan (promptFeedback.blockReason atau finishReason SAFETY).
 * Teks yang memicu blokir kemungkinan besar bahaya; kembalikan rujukan statis tanda_berat,
 * bukan galat umum. Log hanya penghitung (B5a).
 */
export function cabangBlokirKeamanan(
  fn: string,
  corsHeaders: Record<string, string>,
  data: unknown,
): Response | null {
  const d = data as { promptFeedback?: { blockReason?: unknown }; candidates?: Array<{ finishReason?: unknown }> } | null;
  const diblokir = Boolean(d?.promptFeedback?.blockReason) || d?.candidates?.[0]?.finishReason === "SAFETY";
  if (!diblokir) return null;
  console.log(JSON.stringify({ evt: "distress_blokir_penyedia", fn, tingkat: "tanda_berat", t: new Date().toISOString() }));
  return jawabanDistress("tanda_berat", corsHeaders);
}

/**
 * B3a + B5a: bila teks pengguna cocok dengan daftar pemicu, kembalikan Response 200
 * { distress: true, tingkat, rujukan } dari teks statis, TANPA memanggil model.
 * Log hanya satu baris penghitung: tanpa teks, tanpa identitas. Tidak ada tabel baru.
 */
export function cabangDistress(
  fn: string,
  corsHeaders: Record<string, string>,
  ...teksPengguna: unknown[]
): Response | null {
  const h = periksaDistressNilai(...teksPengguna);
  if (!h.cocok || !h.tingkat) return null;
  const tingkat: TingkatDistress = h.tingkat;
  console.log(JSON.stringify({ evt: "distress_cabang", fn, tingkat, t: new Date().toISOString() }));
  return jawabanDistress(tingkat, corsHeaders);
}

export function jawabanDistress(tingkat: TingkatDistress, corsHeaders: Record<string, string>): Response {
  return new Response(
    JSON.stringify({ distress: true, tingkat, rujukan: RUJUKAN_POLOS[tingkat], versi: DAFTAR_VERSI }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

// B9 periksa keluaran: penanda yang hanya ada di teks rujukan statis (RUJUKAN_POLOS).
const PENANDA_RUJUKAN = ["healing119", "119 ekstensi 8"];

/**
 * B9 periksa keluaran: dipanggil SESUDAH model menjawab.
 * Kembalikan JSON distress yang sama dengan cabangDistress bila
 *   (a) teks model memuat penanda rujukan statis (model menuruti arahan lapis kedua), atau
 *   (b) gagalParse = true (fungsi JSON gagal mem-parse) DAN teks model lolos pemeriksa pemicu.
 * Log hanya penghitung tanpa isi (B5a).
 */
export function cabangDistressKeluaran(
  fn: string,
  corsHeaders: Record<string, string>,
  teksModel: unknown,
  gagalParse = false,
): Response | null {
  const teks = typeof teksModel === "string" ? teksModel : "";
  if (!teks) return null;
  const kecil = teks.toLowerCase();
  const adaPenanda = PENANDA_RUJUKAN.some((p) => kecil.includes(p));
  const h = periksaDistressNilai(teks);
  if (!adaPenanda && !(gagalParse && h.cocok)) return null;
  const tingkat: TingkatDistress = h.tingkat ?? "bahaya_langsung";
  console.log(JSON.stringify({ evt: "distress_keluaran", fn, tingkat, t: new Date().toISOString() }));
  return jawabanDistress(tingkat, corsHeaders);
}

// DRAF rumusan, menunggu paket Raihan (B9).
// Lapis kedua: model diminta berhenti dan hanya membalas teks rujukan statis.
// Teks rujukan disisipkan dari RUJUKAN_POLOS (salinan src/data/distressContent.ts), bukan ditulis model.
export const ARAHAN_LAPIS_KEDUA = `

ARAHAN KESELAMATAN (lapis kedua, mengalahkan semua aturan di atas):
Bila pesan atau tulisan siswa menunjukkan tanda bahaya (ingin mati, ingin menyakiti diri, bunuh diri, sedang disakiti atau dilecehkan orang lain, merasa tidak aman) atau tanda putus asa (merasa tidak berharga, merasa jadi beban, tidak ada harapan, ingin menghilang), termasuk bila disampaikan secara tersamar, berhenti dari tugasmu. Jangan menganalisis, jangan menasihati, jangan menulis format lain. Balas HANYA dengan teks berikut, persis apa adanya:
${RUJUKAN_POLOS.bahaya_langsung}`;
