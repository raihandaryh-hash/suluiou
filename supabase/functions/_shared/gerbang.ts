// G2-13 (tinjauan Gemini 23 Nov 2026): gerbang semua fungsi AI.
// Dipanggil SESUDAH siapkanAI dan SEBELUM pengklasifikasi (cabangKlasifikasi) serta panggilan model,
// jadi pemanggil tanpa akun tidak pernah memicu satu pun panggilan ke penyedia AI.
// 1) Tanpa akun sah ("anon": tanpa token, token anon/publishable, token tidak sah, gagal membaca) -> 401.
// 2) Batas laju per IP lewat sulu_laju_ok_ip (migrasi drizzle 0007). Gagal membaca -> 429 (gagal tertutup).
import { ipDari, klienLayanan, lajuOk } from "./pintu.ts";

/** Batas per IP per jendela 10 menit (per /24 = dua kali lipat; IP mitra sekolah memakai pengali). */
export const BATAS_LAJU_AI = 120;
/** G3-016: batas per akun (user.id) per jendela 10 menit, tidak dikalikan pengali IP mitra. */
export const BATAS_LAJU_AI_AKUN = 60;

export async function gerbangAI(
  req: Request,
  fn: string,
  corsHeaders: Record<string, string>,
  siap: { anon: boolean; userId?: string | null },
  laju: (req: Request, aksi: string, userId?: string | null) => Promise<boolean> = lajuBawaan,
): Promise<Response | null> {
  if (siap.anon) {
    console.log(JSON.stringify({ evt: "ai_tolak_anon", fn, t: new Date().toISOString() }));
    return new Response(JSON.stringify({ error: "Masuk dulu untuk memakai fitur ini." }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!(await laju(req, `ai:${fn}`, siap.userId))) {
    console.log(JSON.stringify({ evt: "ai_tolak_laju", fn, t: new Date().toISOString() }));
    return new Response(JSON.stringify({ error: "Terlalu banyak permintaan, coba lagi nanti." }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  return null;
}

async function lajuBawaan(req: Request, aksi: string, userId?: string | null): Promise<boolean> {
  try {
    const layanan = klienLayanan();
    const ip = ipDari(req).ip;
    const kunciAkun = `uid:${userId && userId.trim() ? userId.trim() : "tanpa-id"}`;
    const [okIp, okAkun] = await Promise.all([
      lajuOk(layanan, aksi, BATAS_LAJU_AI, ip),
      lajuOk(layanan, `${aksi}:uid`, BATAS_LAJU_AI_AKUN, kunciAkun),
    ]);
    return okIp && okAkun;
  } catch {
    return false;
  }
}
