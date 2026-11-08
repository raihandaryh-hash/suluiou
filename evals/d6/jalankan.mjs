// Runner eval D6 (Tonggak 1). Mengirim tiap kasus evals/d6/kasus.jsonl ke edge function
// di proyek UJI, lalu menyimpan keluaran mentah ke evals/d6/hasil/<stempel>.jsonl untuk juri.
//
// Pakai:
//   SULU_UJI_URL=http://127.0.0.1:54321/functions/v1 \
//   SULU_UJI_KUNCI=<anon key proyek uji> \
//   node evals/d6/jalankan.mjs [--hanya a|b|c] [--id a01,b03]
//
// Pengaman: runner menolak jalan bila SULU_UJI_URL memuat project ref produksi yang tertulis
// di supabase/config.toml. Kunci tidak pernah dicetak. Runner tidak membaca .env repo.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(DIR, "..", "..");

function refProduksi() {
  const toml = fs.readFileSync(path.join(REPO, "supabase", "config.toml"), "utf8");
  const m = toml.match(/^\s*project_id\s*=\s*"([^"]+)"/m);
  if (!m) throw new Error("project_id tidak ditemukan di supabase/config.toml; runner berhenti demi aman.");
  return m[1];
}

const BASE = (process.env.SULU_UJI_URL || "").replace(/\/+$/, "");
const KUNCI = process.env.SULU_UJI_KUNCI || "";
if (!BASE) {
  console.error("SULU_UJI_URL kosong. Isi dengan URL functions proyek uji, misalnya http://127.0.0.1:54321/functions/v1");
  process.exit(2);
}
const REF = refProduksi();
if (BASE.toLowerCase().includes(REF.toLowerCase())) {
  console.error("DITOLAK: SULU_UJI_URL menunjuk proyek produksi (project ref di supabase/config.toml). Pakai proyek uji terpisah atau `supabase functions serve`.");
  process.exit(3);
}

const args = process.argv.slice(2);
const ambil = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const hanya = ambil("--hanya");
const ids = (ambil("--id") || "").split(",").filter(Boolean);

const kasus = fs.readFileSync(path.join(DIR, "kasus.jsonl"), "utf8")
  .split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l))
  .filter((k) => (!hanya || k.bagian === hanya) && (!ids.length || ids.includes(k.id)));

const stempel = new Date().toISOString().replace(/[:.]/g, "-");
const dirHasil = path.join(DIR, "hasil");
fs.mkdirSync(dirHasil, { recursive: true });
const berkasHasil = path.join(dirHasil, `${stempel}.jsonl`);
const tulis = fs.createWriteStream(berkasHasil);

// Rangkai teks dari aliran SSE Gemini (career-chat), sama seperti klien.
function rangkaiSSE(mentah) {
  let teks = "";
  for (const baris of mentah.split("\n")) {
    const b = baris.replace(/\r$/, "");
    if (!b.startsWith("data: ")) continue;
    const isi = b.slice(6).trim();
    if (isi === "[DONE]") break;
    try {
      const j = JSON.parse(isi);
      const t = j.candidates?.[0]?.content?.parts?.[0]?.text;
      if (t) teks += t;
    } catch { /* potongan tidak lengkap diabaikan */ }
  }
  return teks;
}

const headers = { "Content-Type": "application/json" };
if (KUNCI) { headers.Authorization = `Bearer ${KUNCI}`; headers.apikey = KUNCI; }

let n = 0;
for (const k of kasus) {
  const mulai = Date.now();
  const rekam = { id: k.id, bagian: k.bagian, fungsi: k.fungsi, jalur: k.jalur ?? null, pasangan: k.pasangan ?? null, gender: k.gender ?? null, juri: k.juri };
  try {
    const r = await fetch(`${BASE}/${k.fungsi}`, { method: "POST", headers, body: JSON.stringify(k.body) });
    const ct = r.headers.get("content-type") || "";
    const mentah = await r.text();
    rekam.status = r.status;
    if (ct.includes("application/json")) {
      const j = JSON.parse(mentah);
      rekam.distress = j.distress === true;
      rekam.tingkat = j.tingkat ?? null;
      rekam.keluaran = j.distress ? j.rujukan : (j.projection ?? j.layer1 ?? j.narrative ?? null);
      rekam.galat = j.error ?? null;
    } else {
      rekam.distress = false;
      rekam.keluaran = rangkaiSSE(mentah);
    }
  } catch (e) {
    rekam.galat = e instanceof Error ? e.message : String(e);
  }
  rekam.ms = Date.now() - mulai;
  tulis.write(JSON.stringify(rekam) + "\n");
  n++;
  console.log(`${k.id}\t${rekam.status ?? "-"}\t${rekam.distress ? "distress" : rekam.galat ? "galat" : "ok"}`);
}
tulis.end();
console.log(`\n${n} kasus, hasil: ${path.relative(REPO, berkasHasil)}`);
