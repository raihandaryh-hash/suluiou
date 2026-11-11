// Uji aturan kunci umur Tonggak 2a (manifest v0.6 A.3, A.9; §6.1).
import { describe, it, expect } from "vitest";
import { putuskanTulisan, sisaRalat, MASA_RALAT_MS, type MetaUmur } from "../../supabase/functions/_shared/umur";

const t0 = new Date("2026-11-12T08:00:00Z");
const nanti = (ms: number) => new Date(t0.getTime() + ms);

describe("kunci umur", () => {
  it("tulisan pertama bebas lalu terkunci", () => {
    const h = putuskanTulisan({}, { peran: "umum", menyatakan18: true }, t0);
    expect(h.ok && h.meta.dewasa && h.meta.umur_terkunci && h.meta.umur_sumber === "diri").toBe(true);
  });
  it("siswa selalu di bawah 18 walau mencentang 18+", () => {
    const h = putuskanTulisan({}, { peran: "siswa", jenjang: "kelas_12", menyatakan18: true }, t0);
    expect(h.ok && h.meta.dewasa).toBe(false);
  });
  it("masa ralat 15 menit: salah klik bisa diperbaiki ke arah mana pun", () => {
    const a = putuskanTulisan({}, { peran: "siswa", menyatakan18: false }, t0);
    if (!a.ok) throw new Error();
    const b = putuskanTulisan(a.meta, { peran: "guru", menyatakan18: true }, nanti(MASA_RALAT_MS - 1000));
    expect(b.ok && b.meta.dewasa).toBe(true);
    expect(sisaRalat(a.meta, nanti(60_000))).toBeGreaterThan(0);
  });
  it("sesudah masa ralat: ke dewasa ditolak, ke lebih ketat boleh", () => {
    const a = putuskanTulisan({}, { peran: "siswa", menyatakan18: false }, t0);
    if (!a.ok) throw new Error();
    expect(putuskanTulisan(a.meta, { peran: "umum", menyatakan18: true }, nanti(MASA_RALAT_MS + 1000))).toEqual({ ok: false, alasan: "terkunci_arah_longgar" });
    const d = putuskanTulisan({}, { peran: "umum", menyatakan18: true }, t0);
    if (!d.ok) throw new Error();
    const k = putuskanTulisan(d.meta, { peran: "siswa", menyatakan18: false }, nanti(MASA_RALAT_MS + 1000));
    expect(k.ok && k.meta.dewasa).toBe(false);
    expect(sisaRalat(d.meta, nanti(MASA_RALAT_MS + 1000))).toBe(0);
  });
  it("akun hasil backfill atau aktivasi kode tidak punya masa ralat", () => {
    for (const sumber of ["backfill_siswa", "aktivasi_peserta"]) {
      const lama: MetaUmur = { dewasa: false, umur_terkunci: true, umur_sumber: sumber, umur_ditulis_pada: t0.toISOString() };
      expect(putuskanTulisan(lama, { peran: "umum", menyatakan18: true }, nanti(1000)).ok).toBe(false);
      expect(sisaRalat(lama, nanti(1000))).toBe(0);
    }
  });
  it("peran tidak dikenal ditolak", () => {
    expect(putuskanTulisan({}, { peran: "admin" as never, menyatakan18: true }, t0)).toEqual({ ok: false, alasan: "peran_tidak_dikenal" });
  });
});
