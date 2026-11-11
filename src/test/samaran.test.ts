// Uji modul bersama edge function: samaran bolak-balik, penyedia AI, penentu usia (Tonggak 1, 11 Nov 2026).
import { describe, it, expect } from "vitest";
import { Samaran, cariNamaLain } from "../../supabase/functions/_shared/samaran";
import { konfigDariEnv, aliranAI, panggilAI, bacaPeristiwaAnthropic, GalatKonfigAI } from "../../supabase/functions/_shared/penyedia";
import { putuskanUsia, statusUsiaPermintaan, modeCHidup } from "../../supabase/functions/_shared/usia";

describe("Samaran", () => {
  it("mengganti nama, sekolah, HP, surel lalu membukanya kembali", () => {
    const s = new Samaran("Saya Aisyah dari SMAN 3 Bandung, wa 0812-3456-7890, aisyah@gmail.com");
    s.daftar("nama", "Aisyah");
    s.daftar("sekolah", "SMAN 3 Bandung");
    const asli = "Saya Aisyah dari SMAN 3 Bandung, wa 0812-3456-7890, aisyah@gmail.com";
    const samar = s.samarkan(asli);
    expect(samar).not.toMatch(/Aisyah|SMAN 3 Bandung|0812-3456-7890|aisyah@gmail\.com/i);
    expect(s.buka(samar)).toBe(asli);
  });

  it("tidak memakai tiruan yang sudah muncul di teks siswa", () => {
    const s = new Samaran("teman saya Laras juga ikut");
    const t = s.daftar("nama", "Aisyah");
    expect(t).not.toBe("Laras");
  });

  it("nama tanpa membedakan huruf besar kecil", () => {
    const s = new Samaran();
    const t = s.daftar("nama", "Aisyah")!;
    expect(s.samarkan("halo AISYAH")).toBe(`halo ${t}`);
  });

  it("samarkanNilai menyentuh objek bersarang tanpa mengubah aslinya", () => {
    const s = new Samaran();
    s.daftar("nama", "Budi");
    const o = { profil: { name: "Budi", cita: ["jadi dokter seperti Budi"] } };
    const h = s.samarkanNilai(o);
    expect(JSON.stringify(h)).not.toContain("Budi");
    expect(o.profil.name).toBe("Budi");
  });

  it("pembuka aliran membuka tiruan yang terbelah di antara potongan", () => {
    const s = new Samaran();
    const t = s.daftar("nama", "Aisyah")!;
    const b = s.pembukaAliran();
    const teks = `Halo ${t}, semangat ya ${t}!`;
    const potongan = teks.match(/.{1,3}/gs)!;
    const keluar = potongan.map((p) => b.dorong(p)).join("") + b.tutup();
    expect(keluar).toBe("Halo Aisyah, semangat ya Aisyah!");
  });

  it("pembuka aliran tidak menahan teks biasa tanpa batas", () => {
    const s = new Samaran();
    s.daftar("nama", "Aisyah");
    const b = s.pembukaAliran();
    expect(b.dorong("Halo semua")).toBe("Halo semua");
  });
});

describe("konfigDariEnv", () => {
  const env = (o: Record<string, string>) => (k: string) => o[k];
  it("bawaan Anthropic dengan model Haiku 5.5", () => {
    const c = konfigDariEnv(env({ ANTHROPIC_API_KEY: "k" }));
    expect(c.penyedia).toBe("anthropic");
    expect(c.model).toBe("claude-haiku-5-5");
  });
  it("tanpa kunci Anthropic tidak diam-diam kembali ke Gemini", () => {
    expect(() => konfigDariEnv(env({ GEMINI_API_KEY: "g" }))).toThrow(GalatKonfigAI);
  });
  it("saklar balik AI_PROVIDER=gemini", () => {
    expect(konfigDariEnv(env({ AI_PROVIDER: "gemini", GEMINI_API_KEY: "g" })).penyedia).toBe("gemini");
  });
});

function sseAnthropic(teks: string[], tolak = false): Response {
  const ev = [
    { type: "message_start", message: {} },
    ...teks.map((t) => ({ type: "content_block_delta", index: 0, delta: { type: "text_delta", text: t } })),
    { type: "message_delta", delta: { stop_reason: tolak ? "refusal" : "end_turn" } },
    { type: "message_stop" },
  ];
  const body = ev.map((e) => `event: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`).join("");
  return new Response(body, { status: 200, headers: { "content-type": "text/event-stream" } });
}

async function bacaGemini(a: ReadableStream<Uint8Array>): Promise<{ teks: string; safety: boolean }> {
  const t = await new Response(a).text();
  let teks = ""; let safety = false;
  for (const l of t.split("\n")) {
    if (!l.startsWith("data: ")) continue;
    const j = JSON.parse(l.slice(6));
    teks += j.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    if (j.candidates?.[0]?.finishReason === "SAFETY") safety = true;
  }
  return { teks, safety };
}

describe("aliranAI (Anthropic → SSE bergaya Gemini)", () => {
  const cfg = { penyedia: "anthropic" as const, apiKey: "k", model: "claude-haiku-5-5", baseUrl: "https://x" };

  it("mengirim teks tersamar dan membuka jawaban", async () => {
    const s = new Samaran();
    const t = s.daftar("nama", "Aisyah")!;
    let dikirim = "";
    const fetchFn = (async (_u: string, init: RequestInit) => {
      dikirim = String(init.body);
      return sseAnthropic([`Halo ${t.slice(0, 2)}`, `${t.slice(2)}, apa kabar?`]);
    }) as unknown as typeof fetch;
    const { pertama, aliran } = await aliranAI(cfg, { system: "Nama: Aisyah", pesan: [{ role: "user", content: "aku Aisyah" }], maxTokens: 10, temperature: 0 }, { samaran: s, fetchFn });
    expect(dikirim).not.toContain("Aisyah");
    expect(dikirim).toContain(t);
    expect((pertama as { candidates: Array<{ finishReason?: string }> }).candidates[0].finishReason).toBeUndefined();
    const h = await bacaGemini(aliran);
    expect(h.teks).toBe("Halo Aisyah, apa kabar?");
  });

  it("penolakan Anthropic menjadi finishReason SAFETY", async () => {
    const fetchFn = (async () => sseAnthropic([], true)) as unknown as typeof fetch;
    const { pertama } = await aliranAI(cfg, { system: "s", pesan: [{ role: "user", content: "x" }], maxTokens: 10, temperature: 0 }, { fetchFn });
    expect((pertama as { candidates: Array<{ finishReason?: string }> }).candidates[0].finishReason).toBe("SAFETY");
  });

  it("bacaPeristiwaAnthropic mengabaikan peristiwa lain", () => {
    expect(bacaPeristiwaAnthropic({ type: "ping" })).toEqual({});
  });

  it("panggilAI tanpa aliran membuka tiruan", async () => {
    const s = new Samaran();
    const t = s.daftar("nama", "Aisyah")!;
    const fetchFn = (async () => new Response(JSON.stringify({ content: [{ type: "text", text: `Hai ${t}` }], stop_reason: "end_turn" }))) as unknown as typeof fetch;
    const d = await panggilAI(cfg, { system: "s", pesan: [{ role: "user", content: "x" }], maxTokens: 10, temperature: 0 }, { samaran: s, fetchFn });
    expect(d.candidates[0].content.parts[0].text).toBe("Hai Aisyah");
  });
});

describe("usia", () => {
  it("hanya jalur mahasiswa IOU yang dewasa", () => {
    expect(putuskanUsia({ user_metadata: { user_track: "mahasiswa_iou" } })).toBe("dewasa");
    expect(putuskanUsia({ user_metadata: { user_track: "siswa" } })).toBe("bawah18");
    expect(putuskanUsia(null)).toBe("bawah18");
  });
  it("tanpa token atau gagal baca akun → bawah18", async () => {
    const tanpa = new Request("https://x");
    expect(await statusUsiaPermintaan(tanpa, { supabaseUrl: "https://s", anonKey: "a" })).toBe("bawah18");
    const req = new Request("https://x", { headers: { authorization: "Bearer t" } });
    const gagal = (async () => new Response("", { status: 401 })) as unknown as typeof fetch;
    expect(await statusUsiaPermintaan(req, { supabaseUrl: "https://s", anonKey: "a" }, gagal)).toBe("bawah18");
    const ok = (async () => new Response(JSON.stringify({ user_metadata: { user_track: "mahasiswa_iou" } }))) as unknown as typeof fetch;
    expect(await statusUsiaPermintaan(req, { supabaseUrl: "https://s", anonKey: "a" }, ok)).toBe("dewasa");
  });
  it("mode (c) hidup kecuali dimatikan", () => {
    expect(modeCHidup(() => undefined)).toBe(true);
    expect(modeCHidup(() => "ya")).toBe(false);
  });
});

describe("Samaran batas kata", () => {
  it("nama pendek tidak mengganti bagian kata lain", () => {
    const s = new Samaran();
    const t = s.daftar("nama", "Ani")!;
    expect(s.samarkan("Ani dan Daniel")).toBe(`${t} dan Daniel`);
  });
  it("surel yang memuat nama tetap utuh setelah dibuka", () => {
    const s = new Samaran();
    s.daftar("nama", "Aisyah");
    const asli = "aisyah@gmail.com dan Aisyah";
    expect(s.buka(s.samarkan(asli))).toBe(asli);
  });
});

describe("Perbaikan pemeriksa independen 11 Nov", () => {
  it("membuka tiruan tidak merusak kata biasa (Sekar dalam Sekarang)", () => {
    const s = new Samaran();
    // paksa tiruan "Sekar": isi kolam sebelum Sekar sudah muncul di teks
    const s2 = new Samaran("Laras Bima");
    const t = s2.daftar("nama", "Andi")!;
    expect(t).toBe("Sekar");
    expect(s2.buka(`${t}, sekarang dan Sekarang giliranmu`)).toBe("Andi, sekarang dan Sekarang giliranmu");
    expect(s.buka("tanpa tiruan")).toBe("tanpa tiruan");
  });
  it("aliran: tiruan utuh di ujung potongan yang ternyata bagian kata", () => {
    const s = new Samaran("Laras Bima");
    s.daftar("nama", "Andi");
    const b = s.pembukaAliran();
    const keluar = ["Halo Sekar", "ang kita mulai. Sekar", ", semangat"].map((p) => b.dorong(p)).join("") + b.tutup();
    expect(keluar).toBe("Halo Sekarang kita mulai. Andi, semangat");
  });
  it("nama yang juga kata biasa tidak mengganti kata huruf kecil", () => {
    const s = new Samaran();
    const t = s.daftar("nama", "Indah")!;
    expect(s.samarkan("pemandangan yang indah, kata Indah")).toBe(`pemandangan yang indah, kata ${t}`);
  });
  it("HP dengan spasi sesudah 62 tersamar", () => {
    const s = new Samaran();
    expect(s.samarkan("hubungi 62 812 3456 7890")).not.toContain("3456");
  });
  it("badan Anthropic untuk Haiku: tanpa temperature, thinking mati, effort low", async () => {
    let badan: Record<string, unknown> = {};
    const fetchFn = (async (_u: string, init: RequestInit) => {
      badan = JSON.parse(String(init.body));
      return new Response(JSON.stringify({ content: [{ type: "text", text: "ok" }], stop_reason: "end_turn" }));
    }) as unknown as typeof fetch;
    await panggilAI({ penyedia: "anthropic", apiKey: "k", model: "claude-haiku-5-5", baseUrl: "https://x" },
      { system: "s", pesan: [{ role: "user", content: "x" }], maxTokens: 32, temperature: 0.8 }, { fetchFn });
    expect(badan.temperature).toBeUndefined();
    expect(badan.thinking).toEqual({ type: "disabled" });
    expect(badan.output_config).toEqual({ effort: "low" });
  });
  it("galat penyedia atau aliran kosong sebelum teks: dilempar dengan status, bukan 200 kosong", async () => {
    const cfg = { penyedia: "anthropic" as const, apiKey: "k", model: "claude-haiku-5-5", baseUrl: "https://x" };
    const galat = (async () => new Response(`event: error\ndata: ${JSON.stringify({ type: "error", error: { type: "overloaded_error" } })}\n\n`)) as unknown as typeof fetch;
    await expect(aliranAI(cfg, { system: "s", pesan: [{ role: "user", content: "x" }], maxTokens: 9, temperature: 0 }, { fetchFn: galat })).rejects.toMatchObject({ status: 503 });
    const kosong = (async () => new Response("")) as unknown as typeof fetch;
    await expect(aliranAI(cfg, { system: "s", pesan: [{ role: "user", content: "x" }], maxTokens: 9, temperature: 0 }, { fetchFn: kosong })).rejects.toMatchObject({ status: 502 });
  });
});

import { cariPribadi } from "../../supabase/functions/_shared/samaran";
describe("Verifikasi kedua pemeriksa (N1–N3)", () => {
  it("N1: nama bidang (medan.nama) tidak dianggap nama orang; nama di profil tetap", () => {
    expect(cariPribadi({ medan: { nama: "Kesehatan" }, subPicks: ["gizi"] })).toEqual([]);
    expect(cariPribadi({ profile: { name: "Aisyah", province: "Jabar" } })).toEqual([["nama", "Aisyah"]]);
    expect(cariPribadi({ studentContext: { studentProfile: { name: "Budi" } } })).toEqual([["nama", "Budi"]]);
    const s = new Samaran();
    for (const [j, v] of cariPribadi({ medan: { nama: "Kesehatan" } })) s.daftar(j, v);
    expect(s.samarkan("Medan yang dipilih siswa: Kesehatan")).toBe("Medan yang dipilih siswa: Kesehatan");
  });
  it("N2: deret skor dua digit bukan HP; HP asli tetap tersamar", () => {
    const s = new Samaran();
    expect(s.samarkan("skor 62 80 81 82 83 84")).toBe("skor 62 80 81 82 83 84");
    expect(s.samarkan("wa 0812-3456-7890")).not.toContain("3456");
    expect(s.samarkan("hubungi 62 812 3456 7890")).not.toContain("3456");
  });
  it("N3: effort di luar low/medium/high jatuh ke low; model non-5.x tanpa output_config", async () => {
    let badan: Record<string, unknown> = {};
    const fetchFn = (async (_u: string, init: RequestInit) => { badan = JSON.parse(String(init.body)); return new Response(JSON.stringify({ content: [], stop_reason: "end_turn" })); }) as unknown as typeof fetch;
    const p = { system: "s", pesan: [{ role: "user" as const, content: "x" }], maxTokens: 9, temperature: 0 };
    await panggilAI({ penyedia: "anthropic", apiKey: "k", model: "claude-haiku-5-5", baseUrl: "https://x", effort: "max" }, p, { fetchFn });
    expect(badan.output_config).toEqual({ effort: "low" });
    await panggilAI({ penyedia: "anthropic", apiKey: "k", model: "claude-3-haiku", baseUrl: "https://x" }, p, { fetchFn });
    expect(badan.output_config).toBeUndefined();
    expect(badan.thinking).toBeUndefined();
  });
});

// Penyamaan dengan War Room samaran-0.7.2 (pengenal sapaan, 11 Nov): nama orang lain di teks bebas dan nama sendiri huruf kecil.
describe("samaran · nama orang lain dan huruf kecil", () => {
  it("menyamarkan nama sesudah sapaan, dua kata huruf kecil, dan membukanya kembali", () => {
    const teks = "aku cerita ke bu wulandari kusumaningrum soal jurusan, terus Kak Sylvandra bilang coba teknik";
    const s = new Samaran(teks);
    const keluar = s.samarkan(teks);
    for (const n of ["wulandari", "kusumaningrum", "Sylvandra"]) expect(keluar).not.toContain(n);
    expect(s.buka(keluar)).toBe(teks);
  });
  it("tidak menyamarkan jabatan atau sapaan bertumpuk", () => {
    const teks = "pak ustadz bilang guru BK dan bu kepala sekolah mau bantu";
    expect(new Samaran(teks).samarkan(teks)).toBe(teks);
  });
  it("menyamarkan nama siswa yang ditulis huruf kecil", () => {
    const teks = "halo aku zahra, mau tanya jurusan";
    const s = new Samaran(teks); s.daftar("nama", "Zahra");
    const keluar = s.samarkan(teks);
    expect(keluar).not.toMatch(/zahra/i);
    expect(s.buka(keluar)).toBe("halo aku Zahra, mau tanya jurusan");
  });
  it("menangkap nama sesudah 'atas nama' hanya bila berhuruf kapital", () => {
    expect(cariNamaLain("surat atas nama Nazwa Putri sudah ada")).toEqual(["Nazwa Putri"]);
    expect(cariNamaLain("atas nama sekolah kami")).toEqual([]);
  });
});
