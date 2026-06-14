// src/lib/notes.ts
// Skema penyimpanan catatan-baca "Catatanku" — dipakai bersama oleh:
//   (1) Insight (per-section) & SkillMap (per-node) untuk menangkap catatan saat membaca
//   (2) D "Surat Perjalanan" (/ringkasan) untuk menghimpunnya jadi satu dokumen
// localStorage key tunggal: sulu_notes_v1. Pola sama dengan journaling Spine B.

const KEY = "sulu_notes_v1";

export type NoteSource = "insight" | "skillmap";

export interface SuluNote {
  id: string;          // unik: `${source}:${anchor}` (1 catatan per anchor; upsert)
  source: NoteSource;  // dari halaman mana
  anchor: string;      // sectionId (Insight) atau nodeId (SkillMap)
  label: string;       // judul manusiawi untuk ditampilkan di Surat Perjalanan
  text: string;        // isi catatan user
  ts: number;          // epoch ms terakhir disimpan
}

function safeRead(): SuluNote[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SuluNote[]) : [];
  } catch {
    return [];
  }
}

function safeWrite(notes: SuluNote[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(notes));
  } catch {
    // storage penuh / diblokir — gagal diam-diam, jangan ganggu alur baca
  }
}

/** Semua catatan, terbaru dulu. */
export function getAllNotes(): SuluNote[] {
  return safeRead().sort((a, b) => b.ts - a.ts);
}

/** Catatan untuk satu anchor (section/node) tertentu, atau null. */
export function getNote(source: NoteSource, anchor: string): SuluNote | null {
  const id = `${source}:${anchor}`;
  return safeRead().find((n) => n.id === id) ?? null;
}

/** Catatan untuk satu source (mis. semua catatan SkillMap). */
export function getNotesBySource(source: NoteSource): SuluNote[] {
  return safeRead()
    .filter((n) => n.source === source)
    .sort((a, b) => b.ts - a.ts);
}

/**
 * Simpan/timpa catatan untuk satu anchor. Teks kosong → hapus catatan.
 * Mengembalikan daftar catatan terbaru (untuk update state pemanggil).
 */
export function upsertNote(
  source: NoteSource,
  anchor: string,
  label: string,
  text: string
): SuluNote[] {
  const id = `${source}:${anchor}`;
  const notes = safeRead().filter((n) => n.id !== id);
  const trimmed = text.trim();
  if (trimmed.length > 0) {
    notes.push({ id, source, anchor, label, text: trimmed, ts: Date.now() });
  }
  safeWrite(notes);
  return notes.sort((a, b) => b.ts - a.ts);
}

/** Hapus catatan satu anchor. */
export function removeNote(source: NoteSource, anchor: string): SuluNote[] {
  const id = `${source}:${anchor}`;
  const notes = safeRead().filter((n) => n.id !== id);
  safeWrite(notes);
  return notes.sort((a, b) => b.ts - a.ts);
}

/** Jumlah total catatan (untuk indikator UI). */
export function countNotes(source?: NoteSource): number {
  const all = safeRead();
  return source ? all.filter((n) => n.source === source).length : all.length;
}
