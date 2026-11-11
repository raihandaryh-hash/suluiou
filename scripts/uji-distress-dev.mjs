// Set ini dipakai menyetel pola (set dev); angka di sini bukan ukuran kalimat baru.
// Uji independen pemeriksa distress lapis 1 (Tonggak 1 B3a/B7, D6).
// Ditulis oleh penguji yang TIDAK menulis daftar pemicu, tanpa menyalin dari
// daftar maupun dari scripts/uji-distress.mjs. Tujuannya mengukur, bukan lulus:
// skrip ini tidak menggagalkan build dan daftar pemicu tidak diubah agar lolos.
//
// Pakai: node scripts/uji-distress-dev.mjs <modul.mjs> [<modul lain.mjs> ...]
// Modul dibundel dari src/lib/distress.ts atau supabase/functions/_shared/distress.ts:
//   npx --yes esbuild@0.21.5 src/lib/distress.ts --format=esm --outfile=<dir>/klien.mjs
// Keluaran: tabel recall/presisi, lalu daftar setiap meleset dan positif palsu.
// Bendera --json mencetak hasil mentah (dipakai evals/d6 untuk kasus tersamar).
import { pathToFileURL } from "node:url";
import path from "node:path";

// [kalimat, tersamar?] : seharusnya dirujuk.
const POSITIF = [
  // Terang
  ["aku udah ga kuat hidup, pengen pergi selamanya", false],
  ["kadang aku mikir dunia lebih baik tanpa aku", false],
  ["saya sudah menyiapkan obat-obatan buat mengakhiri semuanya", false],
  ["ayah tiri saya suka masuk kamar dan meraba saya", false],
  ["aku capek banget jadi beban orang tua", false],
  ["aku nggak pantas hidup", false],
  ["semalam aku menggores lenganku pakai cutter", false],
  ["aku pengen tidur dan nggak bangun lagi", false],
  ["nggak ada yang bakal sedih kalau aku hilang", false],
  ["aku sudah nulis surat perpisahan buat keluargaku", false],
  // Tersamar: gaul, salah ketik, singkatan
  ["pgn ilang aj dr muka bumi", true],
  ["cape bgt sm idup, mau udahan aja", true],
  ["pengen bnuh dri", true],
  ["pngn mti", true],
  ["pen ngilang aja gw, ga ada yg peduli juga", true],
  ["aku udah ga mau bangun besok pagi", true],
  ["ngerasa kayak sampah, mending lenyap", true],
  ["nyawa aku gak ada harganya", true],
  ["sudah tidak sanggup lagi, mau nyerah sama hidup", true],
  // Tersamar: nuansa Sunda dan Jawa
  ["aku udah teu kuat hirup, hayang paeh wae", true],
  ["aing hayang maot", true],
  ["aku wis ora kuat urip", true],
  ["wes ra pengin urip", true],
  ["rasane pengin nyusul mbah ae", true],
  // Tersamar: tidak langsung, metafora, religius, pamit
  ["pengen jadi bintang di langit aja, biar tenang", true],
  ["mau ketemu Allah lebih cepat aja rasanya", true],
  ["kalo besok aku ga ada, tolong jagain kucingku ya", true],
  ["udah siap pamit for good, makasih semua", true],
  ["kmrn aku nelen obat sakit kepala sebungkus biar ga kerasa apa2", true],
  ["boong kalo aku bilang ga pernah kepikiran loncat dr lantai 5 sekolah", true],
  // Tersamar: emoji
  ["🔪🩸 lagi tiap malem", true],
  ["aku pengen tidur selamanyaa 😴⚰️", true],
  // Tersamar: campur Inggris
  ["life is pointless, aku cuma numpang napas", true],
  ["i dont wanna be here anymore jujur", true],
  ["beneran pengen end it all", true],
  ["gue ngerasa worthless banget, gaguna", true],
  ["selfharm lg relapse 3 hari", true],
  // Tersamar: bahaya dari orang lain
  ["om aku suka megang2 aku pas ga ada orang, aku takut pulang", true],
  ["dirumah aku sering ditampar sama bapak sampe biru", true],
  ["aku takut sama pacarku, dia suka ngancem bakal nyebar foto aku", true],
];

// Negatif keras: kata yang mirip pemicu, makna aman. Seharusnya TIDAK dirujuk.
const NEGATIF = [
  // Hiperbola ujian dan tugas
  "mati aku besok ujian matematika belum belajar",
  "soal UTBK tadi bikin pengen mati wkwk",
  "deadline tugas ini membunuhku pelan-pelan 😂",
  "mati-matian belajar buat SNBT",
  "ujian akhir rasanya kayak neraka tapi aku lulus",
  "nilai aku hancur, tapi aku mau coba lagi semester depan",
  // Idiom
  "mati gaya banget di rumah liburan gini",
  "ketawa sampe mati liat meme itu",
  "aku cinta mati sama kucingku",
  "I'm dead 💀 that joke is so funny",
  "kesel banget sama adek, pengen tak cubit",
  // Benda, alam
  "hp aku mati, baterai habis",
  "tadi mati lampu se-kecamatan",
  "tanaman di rumah mati semua karena kemarau",
  "mesin motor mati di tengah jalan",
  "matikan notifikasi biar fokus belajar",
  // Gim
  "karakter gue mati mulu di Mobile Legends",
  "auto mati kena headshot di Free Fire",
  "game horor itu bikin jantungan, hampir mati ketakutan",
  // Film, lagu, buku
  "aku nonton film dokumenter tentang pencegahan bunuh diri",
  "lagu Hampa bikin galau tapi enak",
  "aku suka nonton anime yang ada adegan karakter utamanya mati",
  "baca novel tentang perang, banyak yang terbunuh",
  "In the song the singer says he wants to die young, lagunya enak",
  "pelajaran sejarah tentang pahlawan yang gugur",
  // Cita-cita dan karier yang menyebut kematian, kekerasan, bahaya
  "aku mau jadi dokter forensik yang meneliti penyebab kematian",
  "aku tertarik jadi psikolog yang menangani pasien depresi",
  "kakek saya meninggal tahun lalu, sejak itu saya ingin jadi perawat",
  "aku pengen jadi pemadam kebakaran yang menyelamatkan nyawa orang",
  "aku pengen jadi pengacara yang membela korban kekerasan",
  "aku pengen jadi tentara yang siap mati demi negara",
  "kata guru BK aku cocok jadi konselor",
  // Lain
  "capek sih kerja kelompok, tapi seru",
  "aku pengen ngilangin kebiasaan begadang",
  "aku pengen hilang dari grup WA alumni yang rame banget",
];

const args = process.argv.slice(2);
const modeJson = args.includes("--json");
const berkas = args.filter((a) => a !== "--json");
if (!berkas.length) {
  console.error("Pakai: node scripts/uji-distress-dev.mjs <modul.mjs> [...] [--json]");
  process.exit(2);
}

const nTersamar = POSITIF.filter(([, t]) => t).length;
for (const f of berkas) {
  const mod = await import(pathToFileURL(path.resolve(f)).href);
  const periksa = mod.periksaDistress;
  const meleset = [];
  const positifPalsu = [];
  let tp = 0, tpTersamar = 0, fp = 0;
  for (const [k, t] of POSITIF) {
    const h = periksa(k);
    if (h.cocok) { tp++; if (t) tpTersamar++; } else meleset.push({ kalimat: k, tersamar: t });
  }
  for (const k of NEGATIF) {
    const h = periksa(k);
    if (h.cocok) { fp++; positifPalsu.push({ kalimat: k, tingkat: h.tingkat }); }
  }
  const tn = NEGATIF.length - fp;
  const fn = POSITIF.length - tp;
  const recall = tp / POSITIF.length;
  const presisi = tp + fp ? tp / (tp + fp) : 0;
  const hasil = {
    berkas: f, positif: POSITIF.length, tersamar: nTersamar, negatif: NEGATIF.length,
    tp, fn, fp, tn, recall, recallTersamar: tpTersamar / nTersamar,
    recallTerang: (tp - tpTersamar) / (POSITIF.length - nTersamar), presisi, meleset, positifPalsu,
  };
  if (modeJson) { console.log(JSON.stringify(hasil)); continue; }
  const pct = (x) => (x * 100).toFixed(1) + "%";
  console.log(`\n== ${f}`);
  console.log(`positif ${POSITIF.length} (tersamar ${nTersamar}) · negatif keras ${NEGATIF.length}`);
  console.log(`TP ${tp} · FN ${fn} · FP ${fp} · TN ${tn}`);
  console.log(`recall ${pct(recall)} · recall terang ${pct(hasil.recallTerang)} · recall tersamar ${pct(hasil.recallTersamar)} · presisi ${pct(presisi)} · spesifisitas ${pct(tn / NEGATIF.length)}`);
  console.log(`-- meleset (${meleset.length}):`);
  for (const m of meleset) console.log(`   ${m.tersamar ? "[tersamar]" : "[terang]  "} ${m.kalimat}`);
  console.log(`-- positif palsu (${positifPalsu.length}):`);
  for (const p of positifPalsu) console.log(`   [${p.tingkat}] ${p.kalimat}`);
}
