// Reads lightweight reflection signals from localStorage that prior Spine B
// phases write, and shapes them into a small context payload for the
// career-chat edge function (which now accepts studentContext.reflection
// + studentContext.province).

function readJSON<T = unknown>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function summarizeStrings(items: unknown, max = 6): string {
  if (!Array.isArray(items)) return "";
  const cleaned = items
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .slice(0, max);
  return cleaned.join(", ");
}

function summarizePhase2a(obj: Record<string, unknown> | null): string {
  if (!obj) return "";
  const bits: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string" && v.trim().length > 0) {
      bits.push(`${k}: ${v.trim()}`);
    }
    if (bits.length >= 3) break;
  }
  return bits.join(" | ");
}

export type SuluReflection = {
  phase2a?: string;
  phase2b?: string;
  phase3?: string;
};

export type SuluContext = {
  reflection: SuluReflection;
  province: string | null;
};

export function buildSuluContext(province: string | null): SuluContext {
  const p2a = readJSON<Record<string, unknown>>("sulu_phase2a_inventory");
  const p2b = readJSON<{ selected?: unknown }>("sulu_phase2b");
  const p3 = readJSON<{
    sdgTags?: unknown;
    subPicks?: unknown;
    peduliPicks?: unknown;
  }>("jalan_bakti_v1");

  const reflection: SuluReflection = {};

  const a = summarizePhase2a(p2a);
  if (a) reflection.phase2a = a;

  const b = summarizeStrings(p2b?.selected);
  if (b) reflection.phase2b = b;

  if (p3) {
    const parts: string[] = [];
    const sdg = summarizeStrings(p3.sdgTags);
    if (sdg) parts.push(`isu: ${sdg}`);
    const sub = summarizeStrings(p3.subPicks);
    if (sub) parts.push(`sub-bidang: ${sub}`);
    const peduli = summarizeStrings(p3.peduliPicks);
    if (peduli) parts.push(`peduli: ${peduli}`);
    if (parts.length) reflection.phase3 = parts.join(" · ");
  }

  return { reflection, province: province || null };
}
