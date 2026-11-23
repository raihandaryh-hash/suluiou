// G2-13 (tinjauan Gemini 23 Nov 2026): CORS dikunci ke domain resmi Sulu, bukan "*".
// SULU_ASAL_RESMI (rahasia fungsi, opsional) menimpa bawaan bila domain berubah.
// CORS hanya menahan peramban; pemanggil tanpa akun ditolak oleh gerbangAI (gerbang.ts).
export const ASAL_RESMI = (Deno.env.get("SULU_ASAL_RESMI") || "https://suluiou.lovable.app").trim();

export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": ASAL_RESMI,
  "Vary": "Origin",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
