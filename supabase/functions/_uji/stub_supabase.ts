// Stub uji: klien Supabase layanan; rpc sulu_laju_ok_ip selalu true kecuali LAJU_TOLAK atau LAJU_TOLAK_UID disetel.
export type SupabaseClient = { rpc: (n: string, a: unknown) => Promise<{ data: unknown; error: unknown }> };
export function createClient(): SupabaseClient {
  return {
    rpc: async (_n: string, a: unknown) => {
      const args = (a && typeof a === "object" ? a : {}) as { p_aksi?: string; p_ip?: string };
      const g = globalThis as { LAJU_TOLAK?: boolean; LAJU_TOLAK_UID?: boolean; CATAT_RPC?: Array<{ p_aksi?: string; p_ip?: string }> };
      if (Array.isArray(g.CATAT_RPC)) g.CATAT_RPC.push(args);
      if (g.LAJU_TOLAK) return { data: false, error: null };
      if (g.LAJU_TOLAK_UID && String(args.p_ip || "").startsWith("uid:")) return { data: false, error: null };
      return { data: true, error: null };
    },
  };
}
