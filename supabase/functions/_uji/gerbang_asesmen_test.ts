import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { gerbangAsesmen } from "../_shared/gerbang.ts";

const cors = { "Access-Control-Allow-Origin": "*" };
const bukanAdmin = async () => false;
const admin = async () => true;
const env = (m: Record<string, string>) => (k: string) => m[k];

Deno.test("gerbang asesmen: tertutup bawaan, dewasa pun 503", async () => {
  assertEquals((await gerbangAsesmen("x", cors, { usia: "dewasa", userId: "u" }, env({}), bukanAdmin))?.status, 503);
});
Deno.test("gerbang asesmen: dewasa lolos bila dibuka Raihan", async () => {
  assertEquals(await gerbangAsesmen("x", cors, { usia: "dewasa", userId: "u" }, env({ SULU_ASESMEN_DEWASA_TERBUKA: "1" }), bukanAdmin), null);
});
Deno.test("gerbang asesmen: siswa tetap 503 walau dewasa dibuka", async () => {
  assertEquals((await gerbangAsesmen("x", cors, { usia: "bawah18", userId: "u" }, env({ SULU_ASESMEN_DEWASA_TERBUKA: "1" }), bukanAdmin))?.status, 503);
});
Deno.test("gerbang asesmen: admin bawah18 lolos untuk peninjauan", async () => {
  assertEquals(await gerbangAsesmen("x", cors, { usia: "bawah18", userId: "u" }, env({}), admin), null);
});
Deno.test("gerbang asesmen: saklar semua membuka untuk siswa", async () => {
  assertEquals(await gerbangAsesmen("x", cors, { usia: "bawah18", userId: "u" }, env({ SULU_ASESMEN_TERBUKA: "1" }), bukanAdmin), null);
});
