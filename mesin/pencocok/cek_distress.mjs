// Jembatan pemeriksa distress lapis 1 (src/lib/distress.ts, dibundel esbuild) untuk pencocok Python.
// Pakai: node cek_distress.mjs MODUL.mjs < teks.json   (array string) -> array {cocok, tingkat}
import { pathToFileURL } from "node:url";
const m = await import(pathToFileURL(process.argv[2]).href);
let s = ""; for await (const c of process.stdin) s += c;
const out = JSON.parse(s).map((t) => (t ? m.periksaDistress(t) : { cocok: false, tingkat: null }));
process.stdout.write(JSON.stringify({ versi: m.DAFTAR_VERSI, hasil: out }));
