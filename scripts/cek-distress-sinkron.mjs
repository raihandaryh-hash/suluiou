// Tonggak 1 B7: gagal bila dua salinan daftar pemicu distress berbeda, atau bila
// teks rujukan polos di sisi server berbeda dari src/data/distressContent.ts.
// Dipanggil oleh "prebuild" (npm run build).
import { readFileSync } from "node:fs";

const klien = readFileSync("src/lib/distress.ts", "utf8");
const server = readFileSync("supabase/functions/_shared/distress.ts", "utf8");
let gagal = false;
if (klien !== server) {
  console.error("cek-distress-sinkron: src/lib/distress.ts dan supabase/functions/_shared/distress.ts BERBEDA.");
  gagal = true;
}

const blok = (teks, nama) => {
  const m = teks.match(/\/\/ MULAI RUJUKAN_POLOS\n([\s\S]*?)\/\/ AKHIR RUJUKAN_POLOS/);
  if (!m) { console.error(`cek-distress-sinkron: blok RUJUKAN_POLOS tidak ada di ${nama}.`); gagal = true; return null; }
  return m[1];
};
const a = blok(readFileSync("src/data/distressContent.ts", "utf8"), "src/data/distressContent.ts");
const b = blok(readFileSync("supabase/functions/_shared/distressRujukan.ts", "utf8"), "supabase/functions/_shared/distressRujukan.ts");
if (a !== null && b !== null && a !== b) {
  console.error("cek-distress-sinkron: blok RUJUKAN_POLOS di distressContent.ts dan _shared/distressRujukan.ts BERBEDA.");
  gagal = true;
}
if (gagal) process.exit(1);
console.log("cek-distress-sinkron: daftar pemicu dan teks rujukan sinkron.");
