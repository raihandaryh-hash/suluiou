// Scoring engine untuk instrumen baru (HEXACO-PIR 60 + SDS-Holland 216).
// Output kompatibel dengan DimensionScores existing → matchPathways tidak berubah.

import type { DimensionScores } from '@/lib/scoring';
import type { Dimension } from '@/data/questions';
import {
  hexacoQuestions,
  type HexacoDimension,
  type HexacoItem,
} from '@/data/hexacoQuestions';
import {
  sdsQuestions,
  type RiasecCategory,
  type SdsItem,
} from '@/data/sdsQuestions';

export type HexacoAnswers = Record<number, number>; // id → 1..5
export type SdsAnswers = Record<number, 0 | 1>;     // id → 1 (positif) / 0 (tidak)

// --- HEXACO: rerata Likert per dimensi (skala 1..5) ---
export function scoreHexaco(answers: HexacoAnswers): Record<HexacoDimension, number> {
  const sums: Record<HexacoDimension, number> = {
    honesty: 0, emotionality: 0, extraversion: 0,
    agreeableness: 0, conscientiousness: 0, openness: 0,
  };
  const counts: Record<HexacoDimension, number> = {
    honesty: 0, emotionality: 0, extraversion: 0,
    agreeableness: 0, conscientiousness: 0, openness: 0,
  };

  hexacoQuestions.forEach((q: HexacoItem) => {
    const a = answers[q.id];
    if (a === undefined) return;
    const v = q.reverse ? 6 - a : a;
    sums[q.dimension] += v;
    counts[q.dimension] += 1;
  });

  const result = {} as Record<HexacoDimension, number>;
  (Object.keys(sums) as HexacoDimension[]).forEach((d) => {
    result[d] = counts[d] > 0 ? sums[d] / counts[d] : 3;
  });
  return result;
}

// --- SDS: tally jumlah "ya" per kategori RIASEC, dinormalisasi ke 1..5 ---
// Total maksimum per kategori = 11 + 11 + 14 = 36.
export const SDS_MAX_PER_CATEGORY = 36;

const riasecToDimension: Record<RiasecCategory, Dimension> = {
  R: 'realistic',
  I: 'investigative',
  A: 'artistic',
  S: 'social',
  E: 'enterprising',
  C: 'conventional',
};

export function scoreSds(answers: SdsAnswers): {
  raw: Record<RiasecCategory, number>;
  normalized: Record<Dimension, number>;
  topThreeCode: string; // Holland Code, e.g. "SAI"
} {
  const raw: Record<RiasecCategory, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  sdsQuestions.forEach((q: SdsItem) => {
    if (answers[q.id] === 1) raw[q.category] += 1;
  });

  // Normalisasi ke skala 1..5 agar sebanding dengan HEXACO Likert.
  const normalized = {} as Record<Dimension, number>;
  (Object.keys(raw) as RiasecCategory[]).forEach((cat) => {
    const ratio = raw[cat] / SDS_MAX_PER_CATEGORY; // 0..1
    normalized[riasecToDimension[cat]] = 1 + ratio * 4; // 1..5
  });

  const topThreeCode = (Object.keys(raw) as RiasecCategory[])
    .sort((a, b) => raw[b] - raw[a])
    .slice(0, 3)
    .join('');

  return { raw, normalized, topThreeCode };
}

// --- Combined: hasil akhir cocok dgn DimensionScores existing ---
export function combineScores(
  hexaco: HexacoAnswers,
  sds: SdsAnswers
): { scores: DimensionScores; hollandCode: string } {
  const hex = scoreHexaco(hexaco);
  const { normalized, topThreeCode } = scoreSds(sds);

  const scores: DimensionScores = {
    honesty: hex.honesty,
    emotionality: hex.emotionality,
    extraversion: hex.extraversion,
    agreeableness: hex.agreeableness,
    conscientiousness: hex.conscientiousness,
    openness: hex.openness,
    realistic: normalized.realistic,
    investigative: normalized.investigative,
    artistic: normalized.artistic,
    social: normalized.social,
    enterprising: normalized.enterprising,
    conventional: normalized.conventional,
  };

  return { scores, hollandCode: topThreeCode };
}
