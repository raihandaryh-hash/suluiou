// Stub uji: klien Supabase layanan; rpc sulu_laju_ok_ip selalu true kecuali LAJU_TOLAK disetel.
export type SupabaseClient = { rpc: (n: string, a: unknown) => Promise<{ data: unknown; error: unknown }> };
export function createClient(): SupabaseClient {
  return { rpc: async () => ({ data: !(globalThis as { LAJU_TOLAK?: boolean }).LAJU_TOLAK, error: null }) };
}
