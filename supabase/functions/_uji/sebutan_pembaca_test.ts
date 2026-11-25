import { assertEquals, assertStringIncludes } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { sebutanPembaca } from "../_shared/usia.ts";

Deno.test("sebutan pembaca mengikuti peran akun", () => {
  assertEquals(sebutanPembaca("mahasiswa"), "mahasiswa");
  assertStringIncludes(sebutanPembaca("orang_tua"), "orang tua");
  assertStringIncludes(sebutanPembaca("guru_bk"), "guru BK");
  assertStringIncludes(sebutanPembaca(null), "orang");
  assertStringIncludes(sebutanPembaca("tidak-dikenal"), "orang");
});
