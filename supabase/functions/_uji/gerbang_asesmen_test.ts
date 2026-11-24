import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { gerbangAsesmen } from "../_shared/gerbang.ts";

const cors = { "Access-Control-Allow-Origin": "*" };

Deno.test("gerbang asesmen: dewasa lolos", () => {
  assertEquals(gerbangAsesmen("x", cors, { usia: "dewasa" }, () => undefined), null);
});
Deno.test("gerbang asesmen: di bawah 18 ditolak 403", () => {
  assertEquals(gerbangAsesmen("x", cors, { usia: "bawah18" }, () => undefined)?.status, 403);
});
Deno.test("gerbang asesmen: saklar Raihan membuka untuk siswa", () => {
  assertEquals(gerbangAsesmen("x", cors, { usia: "bawah18" }, () => "ya"), null);
});
