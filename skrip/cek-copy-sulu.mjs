// cek-copy-sulu (G2-26, titipan Kepala Staf 23 Nov 2026 butir 6). Keluar 0 bila bersih, 1 bila ada temuan.
// 1) Teks berawalan "DRAF: " di literal string src/ (teks tayang tidak boleh berlabel draf).
// 2) Jadwal pendaftaran yang sudah lewat: baris berkata kunci jadwal (daftar, pendaftaran, dibuka, membuka,
//    tutup, batas, jadwal) yang memuat "<bulan>[–<bulan>] <tahun>" dengan akhir bulan sebelum hari ini.
// Baris komentar (// atau *) dilewati. Pemakaian: node skrip/cek-copy-sulu.mjs [YYYY-MM-DD]
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const BULAN = { jan: 1, feb: 2, mar: 3, apr: 4, mei: 5, may: 5, jun: 6, jul: 7, agu: 8, aug: 8, sep: 9, okt: 10, oct: 10, nov: 11, des: 12, dec: 12 };
const hariIni = process.argv[2] ? new Date(process.argv[2] + "T00:00:00Z") : new Date();
const reDraf = /['"`]DRAF: /;
const reKunci = /\b(daftar|pendaftaran|dibuka|membuka|tutup|batas|jadwal)\b/i;
const reJadwal = /\b(jan|feb|mar|apr|mei|jun|jul|agu|sep|okt|nov|des)[a-z]*\.?(?:\s*[–-]\s*(jan|feb|mar|apr|mei|jun|jul|agu|sep|okt|nov|des)[a-z]*\.?)?\s+(20\d\d)\b/gi;

function* berkas(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) { if (n !== "test" && n !== "node_modules") yield* berkas(p); }
    else if (/\.(ts|tsx)$/.test(n) && !n.endsWith(".d.ts")) yield p;
  }
}

const temuan = [];
for (const p of berkas("src")) {
  readFileSync(p, "utf8").split("\n").forEach((baris, i) => {
    const t = baris.trim();
    if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) return;
    if (reDraf.test(baris)) temuan.push(`${p}:${i + 1}: teks berawalan "DRAF: "`);
    if (!reKunci.test(baris)) return;
    for (const m of baris.matchAll(reJadwal)) {
      if (/(diperbarui|per)\s*$/i.test(baris.slice(0, m.index))) continue; // stempel pembaruan, bukan jadwal
      const akhir = BULAN[(m[2] || m[1]).toLowerCase().slice(0, 3)];
      const th = Number(m[3]);
      const batas = new Date(Date.UTC(th, akhir, 1)); // hari pertama bulan sesudah akhir jadwal
      if (batas <= hariIni) temuan.push(`${p}:${i + 1}: jadwal sudah lewat ("${m[0]}")`);
    }
  });
}
if (temuan.length) { console.error(temuan.join("\n")); console.error(`GAGAL: ${temuan.length} temuan.`); process.exit(1); }
console.log("LULUS: tanpa DRAF dan tanpa jadwal lewat.");
