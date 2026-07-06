// src/lib/suratPerjalanan.ts
// Kompilasi seluruh refleksi journaling (localStorage) menjadi "Surat Perjalanan".
// Bentuk data terverifikasi dari: buildSuluContext.ts, Sintesis.tsx, KenaliDirimu.tsx (GitHub main).
// Label di-inline VERBATIM dari sumber (anti-watering-down). Catatan sumber di tiap blok.

import { jalanBaktiContent } from "@/data/jalanBaktiContent";
import { getNotesBySource, type SuluNote } from "@/lib/notes";
import { rencanaAksiContent } from "@/data/rencanaAksiContent";

function readJSON<T = unknown>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

// ── 2A: id → pertanyaan (verbatim dari 16 <JournalingPrompt> di KenaliDirimu.tsx) ──
const LABELS_2A: Record<string, string> = {
  d1_q1: "Yang menenangkan saat berat",
  d1_q2: "Nilai yang membimbing",
  d1_q3: "Rutinitas yang menguatkan",
  d2_q1: "Yang terasa mengalir",
  d2_q2: "Yang orang lain lihat",
  d2_q3: "Peran yang cocok",
  d3_q1: "Pujian yang membekas",
  d3_q2: "Yang membuka mata",
  d3_q3: "Cara memberi manfaat",
  d4_q1: "Lima tahun ke depan",
  d4_q2: "Yang ingin dihindari",
  d4_q3: "Sumber keyakinan",
  ach_q1: "Pengalaman yang dijalani",
  ach_q2: "Saat memberi manfaat nyata",
  ach_q3: "Yang berat tapi berbuah baik",
  abu_q1: "Yang langsung terlihat",
  free_nikmat: "Nikmat lain yang disyukuri",
  ge_gap: "Yang ingin dikuatkan",
  ge_mitigasi: "Cara menumbuhkannya",
  final_free: "Catatan tambahan",
};

// ── 2B: id → label (verbatim COMPETENCY_LABELS, Sintesis.tsx) ──
const LABELS_2B: Record<string, string> = {
  berpikir_kritis: "Berpikir Kritis",
  komunikasi: "Komunikasi",
  kerja_sama: "Kerja Sama Tim",
  literasi_teknologi: "Literasi Teknologi",
  kepemimpinan: "Kepemimpinan",
  profesionalisme: "Profesionalisme",
  pengembangan_diri: "Pengembangan Diri & Karier",
};

// ── Jalan Bakti: id → label dibangun via walk rekursif jalanBaktiContent (robust thd nesting) ──
const JB_LABELS: Record<string, string> = (() => {
  const acc: Record<string, string> = {};
  const walk = (v: unknown) => {
    if (Array.isArray(v)) { v.forEach(walk); return; }
    if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      if (typeof o.id === "string" && typeof o.label === "string") acc[o.id] = o.label;
      Object.values(o).forEach(walk);
    }
  };
  walk(jalanBaktiContent);
  return acc;
})();

const labelJB = (ids: unknown): string[] =>
  Array.isArray(ids)
    ? ids.filter((x): x is string => typeof x === "string").map((id) => JB_LABELS[id] ?? id)
    : [];

// ── Phase 5: key → label dibangun dari rencanaAksiContent.form.gerak[].fields[] ──
const RA_LABELS: Record<string, string> = (() => {
  const acc: Record<string, string> = {};
  try {
    const gerak = (rencanaAksiContent as { form?: { gerak?: Array<{ fields?: Array<{ key?: string; label?: string }> }> } }).form?.gerak;
    gerak?.forEach((g) => g?.fields?.forEach((f) => { if (f?.key && f?.label) acc[f.key] = f.label; }));
  } catch { /* noop */ }
  return acc;
})();

export interface SuratQA { question: string; answer: string; }

// Label pertanyaan 2B (Skill Reflection) — fix Hukum 1 (Audit Pertanyaan 6 Jul):
// `why`/`step` sudah lama tersimpan di sulu_phase2b tapi tidak pernah dibaca di
// sini. Verbatim dari KenaliDirimuSkill.tsx.
const LABELS_2B_REFLEKSI: Record<string, string> = {
  why: "Mengapa kamu memilih kompetensi ini?",
  step: "Satu langkah konkret 30 hari ke depan",
};

export interface SuratData {
  refleksiDiri: SuratQA[];                                   // 2A
  kompetensi: string[];                                      // 2B
  refleksiSkill: SuratQA[];                                   // 2B why/step (fix 6 Jul)
  jalanBakti: { isu: string[]; subBidang: string[]; peduli: string[] };
  refleksiSintesis: string;                                  // fase 4
  rencanaAksi: SuratQA[];                                    // fase 5 (rencana-aksi)
  catatan: SuluNote[];                                       // sulu_notes_v1
  hasAny: boolean;
}

export function compileSurat(): SuratData {
  const p2a = readJSON<Record<string, unknown>>("sulu_phase2a") || {};
  const refleksiDiri: SuratQA[] = Object.keys(LABELS_2A)
    .map((k) => ({ question: LABELS_2A[k], answer: typeof p2a[k] === "string" ? (p2a[k] as string).trim() : "" }))
    .filter((qa) => qa.answer.length > 0);

  const p2b = readJSON<{ selected?: unknown; why?: unknown; step?: unknown }>("sulu_phase2b");
  const kompetensi = Array.isArray(p2b?.selected)
    ? (p2b!.selected as unknown[]).filter((x): x is string => typeof x === "string").map((id) => LABELS_2B[id] ?? id)
    : [];
  const refleksiSkill: SuratQA[] = Object.keys(LABELS_2B_REFLEKSI)
    .map((k) => ({
      question: LABELS_2B_REFLEKSI[k],
      answer: typeof p2b?.[k as "why" | "step"] === "string" ? (p2b![k as "why" | "step"] as string).trim() : "",
    }))
    .filter((qa) => qa.answer.length > 0);

  const p3 = readJSON<{ sdgTags?: unknown; subPicks?: unknown; peduliPicks?: unknown }>("jalan_bakti_v1");
  const jalanBakti = {
    isu: labelJB(p3?.sdgTags),
    subBidang: labelJB(p3?.subPicks),
    peduli: labelJB(p3?.peduliPicks),
  };

  const p4 = readJSON<{ refleksi?: unknown }>("sulu_phase4_sintesis");
  const refleksiSintesis = typeof p4?.refleksi === "string" ? p4.refleksi.trim() : "";

  const p5 = readJSON<Record<string, unknown>>("sulu_phase5_action_plan") || {};
  const rencanaAksi: SuratQA[] = Object.keys(RA_LABELS)
    .map((k) => ({ question: RA_LABELS[k], answer: typeof p5[k] === "string" ? (p5[k] as string).trim() : "" }))
    .filter((qa) => qa.answer.length > 0);

  const catatan = [...getNotesBySource("insight"), ...getNotesBySource("skillmap")];

  const hasAny =
    refleksiDiri.length > 0 ||
    kompetensi.length > 0 ||
    refleksiSkill.length > 0 ||
    jalanBakti.isu.length + jalanBakti.subBidang.length + jalanBakti.peduli.length > 0 ||
    refleksiSintesis.length > 0 ||
    rencanaAksi.length > 0 ||
    catatan.length > 0;

  return { refleksiDiri, kompetensi, refleksiSkill, jalanBakti, refleksiSintesis, rencanaAksi, catatan, hasAny };
}
