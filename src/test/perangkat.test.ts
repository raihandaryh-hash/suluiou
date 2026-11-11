// Uji mode perangkat Tonggak 2a (manifest v0.6 B.1, C.7; §6.2).
import { describe, it, expect, beforeEach, vi } from "vitest";
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth: { getUser: async () => ({ data: { user: null } }) }, rpc: async () => ({ data: false }) } }));
import { bersihkanHpLama, tulisPerangkat, bacaPerangkat, hapusSemuaDariPerangkat, pindahPemilikPerangkat, bolehSimpan, simpanFase, bacaFase, KEDALUWARSA_MS } from "@/lib/perangkat";
import { uraiRekap } from "@/components/admin/PesertaKelasAdmin";
import { makeGuestIdentifier } from "@/lib/classSession";

beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });

describe("nomor HP lama dibersihkan dari perangkat", () => {
  it("isi dan nama kunci", () => {
    localStorage.setItem("sulu.studentSession.v1", JSON.stringify({ kind: "guest", guestIdentifier: "guest_081234567890_AB2C", phone: "081234567890" }));
    localStorage.setItem("sulu.progressBackup.guest_guest_081234567890_AB2C", "{}");
    sessionStorage.setItem("sulu.studentSession.v1", JSON.stringify({ phone: "0812" }));
    localStorage.setItem("sulu.lain", "aman");
    bersihkanHpLama();
    const semua = [...Object.keys(localStorage), ...Object.values(localStorage), ...Object.keys(sessionStorage), ...Object.values(sessionStorage)].join("|");
    expect(semua).not.toMatch(/0812\d+/);
    expect(localStorage.getItem("sulu.lain")).toBe("aman");
  });
  it("pengenal tamu baru tanpa angka HP", () => {
    expect(makeGuestIdentifier("ab2c")).toMatch(/^tamu_[a-z0-9]+_AB2C$/);
  });
});

describe("simpanan perangkat", () => {
  it("kedaluwarsa 30 hari", () => {
    tulisPerangkat("hasil", "u1", { a: 1 });
    expect(bacaPerangkat("hasil", "u1")).toEqual({ a: 1 });
    const k = "sulu.perangkat.v1.hasil.u1";
    localStorage.setItem(k, JSON.stringify({ data: { a: 1 }, disentuh: Date.now() - KEDALUWARSA_MS - 1 }));
    expect(bacaPerangkat("hasil", "u1")).toBeNull();
  });
  it("hapus dari perangkat", () => {
    tulisPerangkat("hasil", "u1", 1);
    localStorage.setItem("sulu.progressBackup.user_u1", "{}");
    hapusSemuaDariPerangkat();
    expect(localStorage.length).toBe(0);
  });
  it("tamu masuk Google: data pindah pemilik", () => {
    tulisPerangkat("hasil", "tamu_x", 1);
    localStorage.setItem("sulu.progressBackup.guest_tamu_x", "{}");
    pindahPemilikPerangkat("tamu_x", "u9");
    expect(bacaPerangkat("hasil", "u9")).toBe(1);
    expect(localStorage.getItem("sulu.progressBackup.user_u9")).toBe("{}");
  });
  it("tamu tidak boleh simpan di server; fase ke perangkat", async () => {
    expect(await bolehSimpan()).toBe(false);
    await simpanFase("phase_3_jalan_bakti", "u1", { x: 1 });
    expect((await bacaFase("phase_3_jalan_bakti", "u1")).data).toEqual({ data: { x: 1 } });
  });
});

describe("rekap formulir", () => {
  it("urai baris", () => {
    expect(uraiRekap("Ani;ya;tidak;ya;Ibu Siti;2026-11-12\n\n")).toEqual([
      { nama_panggilan: "Ani", izin_asesmen_ai: true, izin_dihubungi_kuliah: false, izin_hasil_untuk_tawaran: true, nama_orang_tua: "Ibu Siti", tanggal_formulir: "2026-11-12" },
    ]);
  });
});
