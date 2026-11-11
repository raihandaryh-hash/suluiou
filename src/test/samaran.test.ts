// Uji modul bersama edge function: samaran bolak-balik, penyedia AI, penentu usia (Tonggak 1, 11 Nov 2026).
import { describe, it, expect } from "vitest";
import { Samaran } from "../../supabase/functions/_shared/samaran";
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
