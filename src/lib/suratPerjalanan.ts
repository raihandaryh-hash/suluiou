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
  d1_q1: "Ayat, doa, atau momen ibadah mana yang paling sering membawa ketenangan saat hatimu terasa berat?",
  d1_q2: "Pemahaman atau nilai dalam Islam mana yang paling melekat dalam dirimu — yang memberi arah ketika kamu bimbang, atau kekuatan ketika kamu hampir menyerah?",
  d1_q3: "Rutinitas amal apa yang biasanya memberi kamu ketenangan dan kekuatan di hari-hari biasa?",
  d2_q1: "Pernahkah kamu mengerjakan sesuatu yang terasa mudah, mengalir, dan merasa 'ini saya banget' — sangat cocok dan terasa benar? Apa yang sedang kamu lakukan saat itu, dan kenapa rasanya begitu?",
  d2_q2: "Hal apa yang sering orang lain perhatikan atau komentari tentang cara kamu bekerja atau berinteraksi — bahkan orang yang baru saja mengenalmu?",
  d2_q3: "Di sekolah, ekskul, atau komunitas, peran atau tugas apa yang paling cocok dengan cara kamu biasanya bekerja?",
  d3_q1: "Siapa yang pernah mengatakan sesuatu positif tentang cara kerjamu atau kemampuanmu? Ceritakan apa yang mereka katakan.",
  d3_q2: "Pernahkah seseorang mengatakan sesuatu tentang kemampuanmu yang membuatmu menyadari sesuatu tentang dirimu yang belum pernah terpikir sebelumnya?",
  d3_q3: "Bagaimana kamu biasanya memberi manfaat kepada keluarga atau komunitas lewat hal-hal yang kamu kuasai?",
  d4_q1: "Bayangkan lima tahun mendatang. Kehidupan seperti apa yang ingin kamu bangun bersama keluarga dan komunitas?",
  d4_q2: "Hal apa yang ingin kamu hindari di masa depan agar tetap selaras dengan nilai dan tanggung jawabmu?",
  d4_q3: "Ketika kamu menghadapi ketidakpastian tentang masa depan, apa yang biasanya memberimu keyakinan untuk tetap bergerak?",
  ach_q1: "Pengalaman atau kegiatan apa saja yang pernah kamu jalani — di sekolah, komunitas, keluarga, atau di mana saja? Ceritakan peranmu dan apa yang kamu lakukan.",
  ach_q2: "Pernahkah kamu melakukan sesuatu — sekecil apapun — dan merasakan bahwa itu memberi manfaat nyata bagi orang lain? Ceritakan.",
  ach_q3: "Pernahkah kamu melewati pengalaman yang terasa berat atau tidak kamu inginkan, tapi belakangan kamu sadari ada kebaikan atau pelajaran di baliknya?",
  abu_q1: "Apa yang sering orang lain perhatikan atau komentari tentang dirimu — hal yang langsung terlihat, bahkan sebelum mereka mengenalmu lebih dalam?",
  free_nikmat: "Nikmat lain yang kamu syukuri",
  ge_gap: "Satu hal yang masih ingin kamu kuatkan",
  ge_mitigasi: "Cara kamu menumbuhkannya",
  final_free: "Catatan tambahan tentang dirimu",
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
export interface SuratData {
  refleksiDiri: SuratQA[];                                   // 2A
  kompetensi: string[];                                      // 2B
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

  const p2b = readJSON<{ selected?: unknown }>("sulu_phase2b");
  const kompetensi = Array.isArray(p2b?.selected)
    ? (p2b!.selected as unknown[]).filter((x): x is string => typeof x === "string").map((id) => LABELS_2B[id] ?? id)
    : [];

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
    jalanBakti.isu.length + jalanBakti.subBidang.length + jalanBakti.peduli.length > 0 ||
    refleksiSintesis.length > 0 ||
    rencanaAksi.length > 0 ||
    catatan.length > 0;

  return { refleksiDiri, kompetensi, jalanBakti, refleksiSintesis, rencanaAksi, catatan, hasAny };
}
