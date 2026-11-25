// Penegak mekanis KEPUTUSAN Raihan 8 Nov 21.45 (Sulu untuk siapa pun, pilihan peran di awal) setelah insiden 25 Nov:
// prompt asesmen berbingkai "mahasiswa". Tiap fungsi yang memanggil siapkanAI wajib menyuntik pembaca peka peran.
import { assert } from "https://deno.land/std@0.224.0/assert/mod.ts";

const akar = new URL("../", import.meta.url);
Deno.test("tiap fungsi AI menyuntik baris PEMBACA peka peran", async () => {
  const lupa: string[] = [];
  let n = 0;
  for await (const e of Deno.readDir(akar)) {
    if (!e.isDirectory || e.name.startsWith("_")) continue;
    let teks: string;
    try { teks = await Deno.readTextFile(new URL(`${e.name}/index.ts`, akar)); } catch { continue; }
    if (!teks.includes("siapkanAI(")) continue;
    n++;
    if (!/(barisPembaca|sebutanPembaca)\(siap\.peran\)/.test(teks)) lupa.push(e.name);
  }
  assert(n >= 6, `hanya ${n} fungsi AI ditemukan; pemindai rusak?`);
  assert(lupa.length === 0, `fungsi AI tanpa baris PEMBACA: ${lupa.join(", ")}`);
});
