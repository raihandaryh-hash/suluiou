// Uji unit pemeriksa distress (Tonggak 1 B3a/B7).
// Pakai: node scripts/uji-distress.mjs <modul-distress.mjs> [<modul lain.mjs> ...]
// Modul .mjs dihasilkan dengan esbuild dari src/lib/distress.ts atau
// supabase/functions/_shared/distress.ts, misalnya:
//   npx --yes esbuild@0.21.5 src/lib/distress.ts --format=esm --outfile=/tmp/x/klien.mjs
import { pathToFileURL } from "node:url";
import path from "node:path";

// [kalimat, tingkat yang diharapkan]
const POSITIF = [
  ["aku pengen bunuh diri", "bahaya_langsung"],
  ["Saya ingin mati saja", "bahaya_langsung"],
  ["kayaknya mending aku mati", "bahaya_langsung"],
  ["aku mau mengakhiri hidupku", "bahaya_langsung"],
  ["gue udah gak mau hidup lagi", "bahaya_langsung"],
  ["semalam aku nyilet tangan lagi", "bahaya_langsung"],
  ["aku sering menyakiti diri sendiri", "bahaya_langsung"],
  ["aku dipukuli ayahku tiap malam", "bahaya_langsung"],
  ["aku dilecehkan sama om aku", "bahaya_langsung"],
  ["aku tidak aman di rumah sekarang", "bahaya_langsung"],
  ["kepikiran lompat dari jembatan", "bahaya_langsung"],
  ["I want to kill myself", "bahaya_langsung"],
  ["capek hidup, rasanya pengen selesai", "tanda_berat"],
  ["hidup aku gak ada gunanya", "tanda_berat"],
  ["gak ada gunanya hidup", "tanda_berat"],
  ["aku cuma jadi beban buat keluarga", "tanda_berat"],
  ["aku merasa tidak berharga", "tanda_berat"],
  ["sudah tidak ada harapan lagi", "tanda_berat"],
  ["nyesel dilahirkan", "tanda_berat"],
  ["i feel hopeless", "tanda_berat"],
  // Tersamar, slang, leetspeak, dieja
  ["pengen matiii aja rasanya", "bahaya_langsung"],
  ["pgn mati", "bahaya_langsung"],
  ["b u n u h d i r i", "bahaya_langsung"],
  ["bundir aja kali ya", "bahaya_langsung"],
  ["m4u m4ti aj4", "bahaya_langsung"],
  ["bunuh_diri", "bahaya_langsung"],
  ["kms fr", "bahaya_langsung"],
  ["pengen unalive", "bahaya_langsung"],
  ["PENGEN MODAR AE", "bahaya_langsung"],
  ["gamau hidup lagiii", "bahaya_langsung"],
  ["pengen ngilang aja dari dunia", "tanda_berat"],
  ["cape bgt hidup", "tanda_berat"],
  ["gk kuat lagi", "tanda_berat"],
  ["udh g ad harapan", null], // sengaja: singkatan "ad" tidak dicakup (catatan celah)
  ["buat apa aku hidup", "tanda_berat"],
  ["l3lah hidup", "tanda_berat"],
];

const NEGATIF = [
  "aku lagi mati gaya di kelas",
  "tadi mati lampu jadi gak bisa belajar",
  "hp aku mati pas ujian online",
  "capek tugas numpuk banget",
  "capek belajar matematika",
  "aku berjuang mati-matian buat lolos SNBT",
  "aku berjuang mati2an",
  "bikin mati penasaran deh",
  "ngakak sampe mati ketawa",
  "deadline tugas besok",
  "aku mau jadi dokter",
  "aku pengen kuliah di luar negeri",
  "aku ingin membantu orang miskin",
  "cita-citaku jadi guru",
  "aku pengen tahu jurusan apa yang cocok",
  "gimana cara jadi programmer",
  "aku suka menggambar dan desain",
  "aku pengen hidup mandiri setelah lulus",
  "aku ingin hidup bermanfaat bagi orang lain",
  "pelajaran biologi tentang sel mati",
  "motor aku mati di jalan",
  "harga mati NKRI",
  "jangan bunuh waktu dengan main game",
  "aku mau matiin hp dulu",
  "kakekku sudah meninggal tahun lalu",
  "aku lagi nonton suicide squad",
  "kerja kelompok bikin capek kerja sendiri",
  "aku ingin menghilangkan rasa malas",
  "mau tanya tentang kebutuhan hidup mahasiswa",
  "hidup sehat itu penting",
  "baterai laptop mati",
  "aku mau berhenti main sosmed",
];

let totalGagal = 0;
for (const arg of process.argv.slice(2)) {
  const mod = await import(pathToFileURL(path.resolve(arg)).href);
  let tp = 0, fn = 0, tingkatSalah = 0, fp = 0, tn = 0;
  const gagal = [];
  for (const [k, harap] of POSITIF) {
    const h = mod.periksaDistress(k);
    if (harap === null) {
      if (h.cocok) gagal.push(`celah-terdokumentasi kini cocok: "${k}"`);
      continue;
    }
    if (h.cocok) {
      tp++;
      if (h.tingkat !== harap) { tingkatSalah++; gagal.push(`tingkat salah "${k}": ${h.tingkat} != ${harap}`); }
    } else { fn++; gagal.push(`tidak terdeteksi: "${k}"`); }
  }
  for (const k of NEGATIF) {
    const h = mod.periksaDistress(k);
    if (h.cocok) { fp++; gagal.push(`positif palsu (${h.tingkat}): "${k}"`); } else tn++;
  }
  const npos = POSITIF.filter(([, h]) => h !== null).length;
  console.log(`== ${arg} · ${mod.DAFTAR_VERSI}`);
  console.log(`positif ${npos}: terdeteksi ${tp}, lolos ${fn}, tingkat salah ${tingkatSalah} · recall ${(tp / npos).toFixed(3)}`);
  console.log(`negatif ${NEGATIF.length}: benar ${tn}, positif palsu ${fp} · presisi ${(tp / Math.max(1, tp + fp)).toFixed(3)}`);
  for (const g of gagal) console.log("  GAGAL " + g);
  totalGagal += gagal.length;
}
process.exit(totalGagal ? 1 : 0);
