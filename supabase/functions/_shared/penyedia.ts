// Tonggak 1 · penyedia AI Sulu (KEPUTUSAN Raihan 11 Nov 2026 10.21, butir 2: keputusan "Anthropic dipercaya
// penuh" 10 Nov 22.21 berlaku juga untuk Sulu).
// - Bawaan: Anthropic Messages API. Kunci: ANTHROPIC_API_KEY. Model: AI_MODEL_ANTHROPIC (bawaan claude-haiku-5-5).
// - Saklar balik: AI_PROVIDER = "gemini" memakai jalur lama (AI_API_KEY atau GEMINI_API_KEY, AI_BASE_URL, AI_MODEL).
// - Tanpa kunci Anthropic dan tanpa saklar balik: galat konfigurasi (tidak diam-diam kembali ke Gemini).
// - Keluaran selalu dibentuk seperti Gemini (candidates[0].content.parts[0].text, finishReason "SAFETY" untuk
//   penolakan), supaya klien, pemeriksa blokir keamanan, dan pengklasifikasi lama tidak perlu diubah.
// - Bila diberi Samaran: semua teks yang dikirim disamarkan, semua teks jawaban dibuka kembali.

import type { Samaran } from "./samaran.ts";

export type KonfigAI = {
  penyedia: "anthropic" | "gemini";
  apiKey: string;
  model: string;
  baseUrl: string;
};

export type Pesan = { role: "user" | "assistant"; content: string };

export type PermintaanAI = {
  system: string;
  pesan: Pesan[];
  maxTokens: number;
  temperature: number;
  /** Hanya Gemini: tambahan generationConfig (mis. responseMimeType); diabaikan untuk Anthropic. */
  geminiTambahan?: Record<string, unknown>;
  /** Hanya Gemini: tambahan di akar badan permintaan (mis. safetySettings); diabaikan untuk Anthropic. */
  geminiAkar?: Record<string, unknown>;
};

export class GalatKonfigAI extends Error {}

export function konfigDariEnv(get: (k: string) => string | undefined): KonfigAI {
  if ((get("AI_PROVIDER") || "").toLowerCase() === "gemini") {
    const apiKey = get("AI_API_KEY") || get("GEMINI_API_KEY");
    if (!apiKey) throw new GalatKonfigAI("AI_API_KEY is not configured");
    return {
      penyedia: "gemini",
      apiKey,
      model: get("AI_MODEL") || "gemini-2.5-flash",
      baseUrl: get("AI_BASE_URL") || "https://generativelanguage.googleapis.com/v1beta",
    };
  }
  const apiKey = get("ANTHROPIC_API_KEY");
  if (!apiKey) throw new GalatKonfigAI("ANTHROPIC_API_KEY is not configured");
  return {
    penyedia: "anthropic",
    apiKey,
    model: get("AI_MODEL_ANTHROPIC") || "claude-haiku-5-5",
    baseUrl: get("ANTHROPIC_BASE_URL") || "https://api.anthropic.com/v1",
  };
}

/** Bentuk satu peristiwa SSE bergaya Gemini dari teks. */
export function sseGemini(teks: string, finishReason?: string): string {
  const kandidat: Record<string, unknown> = { content: { role: "model", parts: [{ text: teks }] } };
  if (finishReason) kandidat.finishReason = finishReason;
  return `data: ${JSON.stringify({ candidates: [kandidat] })}\n\n`;
}

/** Terjemahkan satu peristiwa SSE Anthropic menjadi teks (delta) atau tanda penolakan. */
export function bacaPeristiwaAnthropic(ev: unknown): { teks?: string; tolak?: boolean } {
  const e = ev as { type?: string; delta?: { type?: string; text?: string; stop_reason?: string } } | null;
  if (!e) return {};
  if (e.type === "content_block_delta" && e.delta?.type === "text_delta") return { teks: e.delta.text ?? "" };
  if (e.type === "message_delta" && e.delta?.stop_reason === "refusal") return { tolak: true };
  return {};
}

function badanAnthropic(cfg: KonfigAI, p: PermintaanAI, stream: boolean): string {
  return JSON.stringify({
    model: cfg.model,
    max_tokens: p.maxTokens,
    temperature: Math.min(1, Math.max(0, p.temperature)),
    ...(p.system ? { system: p.system } : {}),
    messages: p.pesan.map((m) => ({ role: m.role, content: m.content || "." })),
    stream,
  });
}

function badanGemini(p: PermintaanAI): string {
  return JSON.stringify({
    systemInstruction: { parts: [{ text: p.system }] },
    contents: p.pesan.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
    generationConfig: { maxOutputTokens: p.maxTokens, temperature: p.temperature, thinkingConfig: { thinkingBudget: 0 }, ...(p.geminiTambahan ?? {}) },
    ...(p.geminiAkar ?? {}),
  });
}

function samarkanPermintaan(p: PermintaanAI, s?: Samaran): PermintaanAI {
  if (!s) return p;
  return { ...p, system: s.samarkan(p.system), pesan: p.pesan.map((m) => ({ role: m.role, content: s.samarkan(m.content) })) };
}

/**
 * Satu panggilan tanpa aliran. Mengembalikan objek bergaya Gemini generateContent
 * (teks sudah dibuka kembali bila ada Samaran). Melempar galat dengan .status bila HTTP gagal.
 */
export async function panggilAI(
  cfg: KonfigAI,
  permintaan: PermintaanAI,
  opsi: { samaran?: Samaran; signal?: AbortSignal; fetchFn?: typeof fetch } = {},
): Promise<{ candidates: Array<{ content: { parts: Array<{ text: string }> }; finishReason?: string }> }> {
  const f = opsi.fetchFn ?? fetch;
  const p = samarkanPermintaan(permintaan, opsi.samaran);
  let teks = "";
  let tolak = false;
  if (cfg.penyedia === "anthropic") {
    const r = await f(`${cfg.baseUrl}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": cfg.apiKey, "anthropic-version": "2023-06-01" },
      body: badanAnthropic(cfg, p, false),
      signal: opsi.signal,
    });
    if (!r.ok) throw Object.assign(new Error(`status ${r.status}`), { status: r.status });
    const d = await r.json();
    teks = (d?.content ?? []).filter((b: { type?: string }) => b?.type === "text").map((b: { text?: string }) => b.text ?? "").join("");
    tolak = d?.stop_reason === "refusal";
  } else {
    const r = await f(`${cfg.baseUrl}/models/${cfg.model}:generateContent?key=${cfg.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: badanGemini(p),
      signal: opsi.signal,
    });
    if (!r.ok) throw Object.assign(new Error(`status ${r.status}`), { status: r.status });
    const d = await r.json();
    if (d?.promptFeedback?.blockReason || d?.candidates?.[0]?.finishReason === "SAFETY") tolak = true;
    teks = d?.candidates?.[0]?.content?.parts?.map((x: { text?: string }) => x?.text ?? "").join("") ?? "";
  }
  if (opsi.samaran) teks = opsi.samaran.buka(teks);
  return { candidates: [{ content: { parts: [{ text: teks }] }, ...(tolak ? { finishReason: "SAFETY" } : {}) }] };
}

/**
 * Panggilan beraliran. Mengembalikan aliran SSE bergaya Gemini (teks sudah dibuka kembali bila ada Samaran)
 * dan peristiwa pertama yang sudah diurai (untuk pemeriksa blokir keamanan sebelum header dikirim).
 */
export async function aliranAI(
  cfg: KonfigAI,
  permintaan: PermintaanAI,
  opsi: { samaran?: Samaran; signal?: AbortSignal; fetchFn?: typeof fetch } = {},
): Promise<{ pertama: unknown; aliran: ReadableStream<Uint8Array> }> {
  const f = opsi.fetchFn ?? fetch;
  const p = samarkanPermintaan(permintaan, opsi.samaran);
  const url = cfg.penyedia === "anthropic"
    ? `${cfg.baseUrl}/messages`
    : `${cfg.baseUrl}/models/${cfg.model}:streamGenerateContent?key=${cfg.apiKey}&alt=sse`;
  const r = await f(url, {
    method: "POST",
    headers: cfg.penyedia === "anthropic"
      ? { "content-type": "application/json", "x-api-key": cfg.apiKey, "anthropic-version": "2023-06-01" }
      : { "Content-Type": "application/json" },
    body: cfg.penyedia === "anthropic" ? badanAnthropic(cfg, p, true) : badanGemini(p),
    signal: opsi.signal,
  });
  if (!r.ok || !r.body) throw Object.assign(new Error(`status ${r.status}`), { status: r.status });

  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const reader = r.body.getReader();
  const buka = opsi.samaran?.pembukaAliran();
  let buf = "";

  // Urai aliran penyedia menjadi daftar peristiwa {teks, tolak}.
  const ambilPeristiwa = async (): Promise<Array<{ teks?: string; tolak?: boolean }> | null> => {
    while (true) {
      const batas = buf.indexOf("\n\n");
      if (batas >= 0) {
        const blok = buf.slice(0, batas);
        buf = buf.slice(batas + 2);
        const data = blok.split("\n").filter((l) => l.startsWith("data:")).map((l) => l.slice(5).trim()).join("");
        if (!data || data === "[DONE]") continue;
        let ev: unknown;
        try { ev = JSON.parse(data); } catch { continue; }
        if (cfg.penyedia === "anthropic") return [bacaPeristiwaAnthropic(ev)];
        const g = ev as { promptFeedback?: { blockReason?: unknown }; candidates?: Array<{ finishReason?: string; content?: { parts?: Array<{ text?: string }> } }> };
        const tolak = Boolean(g?.promptFeedback?.blockReason) || g?.candidates?.[0]?.finishReason === "SAFETY";
        const teks = g?.candidates?.[0]?.content?.parts?.map((x) => x?.text ?? "").join("") ?? "";
        return [{ teks, tolak }];
      }
      const { done, value } = await reader.read();
      if (done) return null;
      buf += dec.decode(value, { stream: true });
    }
  };

  // Peristiwa pertama yang bermakna (teks tidak kosong atau penolakan), untuk pemeriksa blokir.
  const tertunda: Array<{ teks?: string; tolak?: boolean }> = [];
  let pertama: unknown = null;
  while (pertama === null) {
    const evs = await ambilPeristiwa();
    if (evs === null) { pertama = { candidates: [{ content: { parts: [{ text: "" }] } }] }; break; }
    for (const e of evs) {
      tertunda.push(e);
      if (e.tolak) pertama = { candidates: [{ finishReason: "SAFETY" }] };
      else if (e.teks) pertama = { candidates: [{ content: { parts: [{ text: e.teks }] } }] };
    }
  }

  const keluarkan = (c: ReadableStreamDefaultController<Uint8Array>, e: { teks?: string; tolak?: boolean }): boolean => {
    if (e.tolak) { c.enqueue(enc.encode(sseGemini("", "SAFETY"))); return true; }
    if (!e.teks) return false;
    const t = buka ? buka.dorong(e.teks) : e.teks;
    if (t) { c.enqueue(enc.encode(sseGemini(t))); return true; }
    return false;
  };

  const aliran = new ReadableStream<Uint8Array>({
    start(c) { tertunda.forEach((e) => keluarkan(c, e)); },
    async pull(c) {
      // Baca terus sampai ada yang dikirim atau aliran habis; pull yang selesai tanpa enqueue membuat aliran macet.
      while (true) {
        const evs = await ambilPeristiwa();
        if (evs === null) {
          const sisa = buka?.tutup();
          if (sisa) c.enqueue(enc.encode(sseGemini(sisa)));
          c.close();
          return;
        }
        let ada = false;
        for (const e of evs) ada = keluarkan(c, e) || ada;
        if (ada) return;
      }
    },
    cancel() { return reader.cancel(); },
  });
  return { pertama, aliran };
}

/** Ambil objek atau larik JSON pertama dari teks (buang pagar ``` dan teks pengantar). */
export function ekstrakJSON(teks: string): string {
  const t = teks.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const awal = t.search(/[{[]/);
  if (awal < 0) return t;
  const buka = t[awal];
  const tutup = buka === "{" ? "}" : "]";
  let kedalaman = 0, dalamString = false, lolos = false;
  for (let i = awal; i < t.length; i++) {
    const c = t[i];
    if (dalamString) {
      if (lolos) lolos = false; else if (c === "\\") lolos = true; else if (c === '"') dalamString = false;
      continue;
    }
    if (c === '"') dalamString = true;
    else if (c === buka) kedalaman++;
    else if (c === tutup && --kedalaman === 0) return t.slice(awal, i + 1);
  }
  return t.slice(awal);
}

type BadanGemini = {
  systemInstruction?: { parts?: Array<{ text?: string }> };
  contents?: Array<{ role?: string; parts?: Array<{ text?: string }> }>;
  generationConfig?: { maxOutputTokens?: number; temperature?: number; responseSchema?: unknown; responseMimeType?: string; [k: string]: unknown };
  [k: string]: unknown;
};

/** Ubah badan permintaan Gemini lama menjadi PermintaanAI. */
export function dariBadanGemini(badan: BadanGemini): PermintaanAI {
  const system = (badan.systemInstruction?.parts ?? []).map((p) => p?.text ?? "").join("");
  const pesan: Pesan[] = (badan.contents ?? []).map((c) => ({
    role: c.role === "model" ? "assistant" : "user",
    content: (c.parts ?? []).map((p) => p?.text ?? "").join(""),
  }));
  const g = badan.generationConfig ?? {};
  const { maxOutputTokens, temperature, ...tambahan } = g;
  const { systemInstruction: _s, contents: _c, generationConfig: _g, ...akar } = badan;
  return {
    system,
    pesan: pesan.length ? pesan : [{ role: "user", content: "" }],
    maxTokens: maxOutputTokens ?? 1024,
    temperature: temperature ?? 0.7,
    geminiTambahan: tambahan,
    geminiAkar: akar,
  };
}

/** Anthropic tanpa skema terpaksa: minta JSON lewat instruksi bila permintaan lama memakai responseSchema. */
function arahanJSON(p: PermintaanAI): PermintaanAI {
  const skema = p.geminiTambahan?.responseSchema;
  if (!skema) return p;
  const arahan = `\n\nBalas HANYA dengan satu objek JSON yang valid, tanpa teks lain dan tanpa pagar kode, mengikuti skema ini: ${JSON.stringify(skema)}`;
  return { ...p, system: (p.system || "") + arahan };
}

/**
 * Pengganti fetch untuk panggilan Gemini lama di edge function. Fungsi tetap menyusun URL dan badan gaya Gemini;
 * pengganti ini mengirimnya ke penyedia yang disetel (Anthropic bawaan), menyamarkan isi bila ada Samaran,
 * dan mengembalikan Response bergaya Gemini (JSON generateContent, atau SSE untuk streamGenerateContent).
 */
export function buatFetchAI(cfg: KonfigAI, samaran?: Samaran, fetchFn: typeof fetch = fetch): typeof fetch {
  return (async (masukan: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = String(masukan);
    const badan = JSON.parse(String(init?.body ?? "{}")) as BadanGemini;
    let p = dariBadanGemini(badan);
    if (cfg.penyedia === "anthropic") p = arahanJSON(p);
    const opsi = { samaran, signal: init?.signal ?? undefined, fetchFn };
    try {
      if (url.includes(":streamGenerateContent")) {
        const { aliran } = await aliranAI(cfg, p, opsi);
        return new Response(aliran, { status: 200, headers: { "Content-Type": "text/event-stream" } });
      }
      const d = await panggilAI(cfg, p, opsi);
      if (cfg.penyedia === "anthropic" && p.geminiTambahan?.responseSchema) {
        const c = d.candidates[0];
        if (c?.content?.parts?.[0]) c.content.parts[0].text = ekstrakJSON(c.content.parts[0].text);
      }
      return new Response(JSON.stringify(d), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (typeof status === "number") return new Response(JSON.stringify({ error: "ai" }), { status });
      throw e;
    }
  }) as typeof fetch;
}
