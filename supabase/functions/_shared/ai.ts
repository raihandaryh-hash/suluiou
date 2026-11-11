// Tonggak 1 · persiapan AI per permintaan (Deno). Satu tempat untuk: penyedia (penyedia.ts), status usia
// (usia.ts), mode (c) untuk di bawah 18, dan samaran bolak-balik (samaran.ts).
// KEPUTUSAN Raihan 11 Nov 2026 10.21: di bawah 18 = (c) dengan samaran; Anthropic berlaku untuk Sulu.
// Dewasa (jalur mahasiswa IOU) memakai Anthropic tanpa samaran, sesuai KEPUTUSAN 10 Nov 22.23
// (samaran otomatis hanya untuk model non-Anthropic); bila saklar balik ke Gemini, samaran dipakai semua orang.
import { buatFetchAI, konfigDariEnv, type KonfigAI } from "./penyedia.ts";
import { Samaran, type JenisPribadi } from "./samaran.ts";
import { modeCHidup, statusUsiaPermintaan } from "./usia.ts";

export type PersiapanAI = {
  ai: KonfigAI;
  /** true bila pengguna di bawah 18 dan mode (c) hidup: teks bebas tidak dikirim ke AI utama. */
  bawah18: boolean;
  samaran?: Samaran;
  aiFetch: typeof fetch;
};

const env = (k: string) => Deno.env.get(k);

/**
 * pribadi: nilai pribadi yang diketahui dari badan permintaan (nama, sekolah, kelas, HP, surel) untuk didaftarkan.
 * semuaTeks: seluruh badan permintaan, agar nilai tiruan tidak bertabrakan dengan isi siswa.
 */
export async function siapkanAI(
  req: Request,
  semuaTeks: unknown,
  pribadi: Array<[JenisPribadi, unknown]> = [],
): Promise<PersiapanAI> {
  const ai = konfigDariEnv(env);
  const usia = await statusUsiaPermintaan(req, { supabaseUrl: env("SUPABASE_URL"), anonKey: env("SUPABASE_ANON_KEY") });
  const bawah18 = usia === "bawah18" && modeCHidup(env);
  const pakaiSamaran = usia === "bawah18" || ai.penyedia !== "anthropic";
  let samaran: Samaran | undefined;
  if (pakaiSamaran) {
    samaran = new Samaran(JSON.stringify(semuaTeks ?? ""));
    for (const [jenis, nilai] of pribadi) samaran.daftar(jenis, nilai);
  }
  return { ai, bawah18, samaran, aiFetch: buatFetchAI(ai, samaran) };
}
