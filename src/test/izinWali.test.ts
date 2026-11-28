// Uji Tonggak PW: sesudah izin wali ditarik, isian server kembali ke perangkat tanpa menimpa isian perangkat.
import { describe, it, expect, beforeEach, vi } from "vitest";

const server: Record<string, unknown> = {
  phase_2a_inventory: { versi: "server-lama" },
  phase_3_jalan_bakti: { versi: "server" },
};
const panggilanRpc: string[] = [];
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getUser: async () => ({ data: { user: { id: "anak1", app_metadata: { umur_terkunci: true, dewasa: false } } } }),
      getSession: async () => ({ data: { session: { user: { id: "anak1" } } } }),
    },
    rpc: async (nama: string) => { panggilanRpc.push(nama); return nama === "sulu_hapus_data_sendiri" ? { data: null, error: null } : { data: false, error: null }; },
    from: (t: string) => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: server[t] ? { data: server[t] } : null }) }) }) }),
  },
}));
import { pindahkanDataServerKePerangkat, tulisPerangkat, bacaPerangkat, lupakanCacheIzin } from "@/lib/perangkat";

beforeEach(() => { localStorage.clear(); panggilanRpc.length = 0; lupakanCacheIzin(); });

describe("izin wali ditarik: data kembali ke perangkat", () => {
  it("salinan server masuk, isian perangkat yang lebih baru tidak ditimpa, server diminta menghapus", async () => {
    tulisPerangkat("phase_2a_inventory", "anak1", { versi: "perangkat-baru" });
    expect(await pindahkanDataServerKePerangkat("anak1")).toBe(true);
    expect(bacaPerangkat("phase_2a_inventory", "anak1")).toEqual({ versi: "perangkat-baru" });
    expect(bacaPerangkat("phase_3_jalan_bakti", "anak1")).toEqual({ versi: "server" });
    expect(panggilanRpc).toContain("sulu_hapus_data_sendiri");
  });
  it("sekali saja: pemanggilan kedua tidak memuat ulang", async () => {
    await pindahkanDataServerKePerangkat("anak1");
    expect(await pindahkanDataServerKePerangkat("anak1")).toBe(false);
  });
});
