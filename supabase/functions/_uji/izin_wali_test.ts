// Tonggak PW · uji aturan murni izin orang tua/wali.
import { assert, assertEquals, assertFalse } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { periksaSetuju, keadaanTautan, bolehMintaIzin, sahToken, namaPanggilan, TEKS_VERSI, teksKanonik, sha256, TEKS_IZIN } from "../_shared/izinWali.ts";
import { ABJAD, kodeAcak } from "../_shared/pintu.ts";

const sekarang = new Date("2026-11-28T15:00:00Z");

Deno.test("tautan: tidak ada, kedaluwarsa, sudah dipakai, sah", () => {
  assertEquals(keadaanTautan(null, sekarang), "tidak_ada");
  assertEquals(keadaanTautan({ berlaku_sampai: "2026-11-28T14:59:59Z", dipakai_pada: null }, sekarang), "kedaluwarsa");
  assertEquals(keadaanTautan({ berlaku_sampai: "2026-11-28T15:00:00Z", dipakai_pada: null }, sekarang), "kedaluwarsa");
  assertEquals(keadaanTautan({ berlaku_sampai: "2026-12-12T00:00:00Z", dipakai_pada: "2026-11-28T10:00:00Z" }, sekarang), "sudah_dipakai");
  assertEquals(keadaanTautan({ berlaku_sampai: "2026-12-12T00:00:00Z", dipakai_pada: null }, sekarang), "sah");
});

Deno.test("isian orang tua: lima kasus ditolak, satu diterima", () => {
  const dasar = { nama: "Siti Aminah", hubungan: "ibu", centang: true, teks_versi: TEKS_VERSI };
  assertEquals(periksaSetuju({ ...dasar, nama: "  " }), { ok: false, galat: "nama_tidak_sah" });
  assertEquals(periksaSetuju({ ...dasar, nama: "123" }), { ok: false, galat: "nama_tidak_sah" });
  assertEquals(periksaSetuju({ ...dasar, hubungan: "kakak" }), { ok: false, galat: "hubungan_tidak_sah" });
  assertEquals(periksaSetuju({ ...dasar, centang: "true" }), { ok: false, galat: "belum_centang" });
  assertEquals(periksaSetuju({ ...dasar, teks_versi: "pw-0" }), { ok: false, galat: "versi_berubah" });
  assertEquals(periksaSetuju({ ...dasar, nama: "  Siti   Aminah " }), { ok: true, nama: "Siti Aminah", hubungan: "ibu" });
});

Deno.test("hanya akun anak yang meminta izin wali", () => {
  assert(bolehMintaIzin({ umur_terkunci: true, dewasa: false }));
  assertFalse(bolehMintaIzin({ umur_terkunci: true, dewasa: true }));
  assertFalse(bolehMintaIzin({}));
  assertFalse(bolehMintaIzin(undefined));
});

Deno.test("token dari kodeAcak selalu lolos sahToken; huruf mirip ditolak", () => {
  for (let i = 0; i < 50; i++) assert(sahToken(kodeAcak(32)));
  assertFalse(sahToken("I".repeat(32)));
  assertFalse(sahToken("O".repeat(32)));
  assertFalse(sahToken(ABJAD.slice(0, 31)));
  assertFalse(sahToken(123));
});

Deno.test("nama panggilan: kata pertama, paling panjang 30", () => {
  assertEquals(namaPanggilan({ full_name: "Ahmad Fauzi Rahman" }), "Ahmad");
  assertEquals(namaPanggilan({}), "");
  assertEquals(namaPanggilan({ name: "X".repeat(40) }).length, 30);
});

Deno.test("sidik teks stabil dan memuat versi", async () => {
  assert(teksKanonik().startsWith(TEKS_VERSI + "\n"));
  assertEquals(await sha256(teksKanonik()), await sha256(teksKanonik()));
  assert(TEKS_IZIN.butir.some((b) => b.includes("tidak dipakai untuk menghubungi")));
});
