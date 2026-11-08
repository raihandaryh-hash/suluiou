// Tonggak 1 B3a, B5a, B9: cabang distress sisi server, dipakai keenam edge function.
import { periksaDistressNilai, type TingkatDistress, DAFTAR_VERSI } from "./distress.ts";
import { RUJUKAN_POLOS } from "./distressRujukan.ts";

export { periksaDistressNilai };

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
  return new Response(
    JSON.stringify({ distress: true, tingkat, rujukan: RUJUKAN_POLOS[tingkat], versi: DAFTAR_VERSI }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}
