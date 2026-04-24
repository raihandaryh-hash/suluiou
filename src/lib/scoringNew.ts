// Scoring engine for the new instruments (HEXACO-PIR + SDS-Holland).
// Produces a 12-dimension DimensionScores compatible with matchPathways().

import { hexacoQuestions, type HexacoDimension } from '@/data/hexacoQuestions';
import { sdsQuestions, type RiasecCategory } from '@/data/sdsQuestions';
import type { DimensionScores } from '@/lib/scoring';

// ---------- HEXACO ----------
// Likert 1..5; if reverse, flip via 6-x.
export function scoreHexaco(answers: Record<number, number>) {
  const sums: Record<HexacoDimension, number> = {
    honesty: 0, emotionality: 0, extraversion: 0,
    agreeableness: 0, conscientiousness: 0, openness: 0,
  };
  const counts: Record<HexacoDimension, number> = {
    honesty: 0, emotionality: 0, extraversion: 0,
    agreeableness: 0, conscientiousness: 0, openness: 0,
  };

  hexacoQuestions.forEach((q) => {
    const a = answers[q.id];
    if (a === undefined) return;
    const v = q.reverse ? 6 - a : a;
    sums[q.dimension] += v;
    counts[q.dimension] += 1;
  });

  const out = {} as Record<HexacoDimension, number>;
  (Object.keys(sums) as HexacoDimension[]).forEach((d) => {
    out[d] = counts[d] ? sums[d] / counts[d] : 3;
  });
  return out;
}

// ---------- SDS ----------
// Each item is a binary answer (true = "suka/mampu/menarik"). Per RIASEC
// category we tally the count, then normalize the count → 1..5 scale so it can
// merge with HEXACO Likert scores in DimensionScores.
//
// totals per category across all 3 sections:
// - Section 1: 11 per cat
// - Section 2: 11 per cat
// - Section 3: 14 per cat
// → max 36 per category.
const SDS_MAX_PER_CATEGORY = 36;

export function scoreSds(answers: Record<string, boolean>) {
  const counts: Record<RiasecCategory, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  sdsQuestions.forEach((q) => {
    if (answers[q.id]) counts[q.category] += 1;
  });

  // Normalize 0..MAX → 1..5
  const normalized = {} as Record<RiasecCategory, number>;
  (Object.keys(counts) as RiasecCategory[]).forEach((c) => {
    normalized[c] = 1 + (counts[c] / SDS_MAX_PER_CATEGORY) * 4;
  });

  // Holland code = top 3 categories by raw count
  const order = (Object.keys(counts) as RiasecCategory[])
    .sort((a, b) => counts[b] - counts[a]);
  const code = order.slice(0, 3).join('');

  return { counts, normalized, code };
}

// ---------- Combine into DimensionScores (12 dims) ----------
const RIASEC_TO_DIM: Record<RiasecCategory, keyof DimensionScores> = {
  R: 'realistic',
  I: 'investigative',
  A: 'artistic',
  S: 'social',
  E: 'enterprising',
  C: 'conventional',
};

export function combineScores(
  hexacoAnswers: Record<number, number>,
  sdsAnswers: Record<string, boolean>
): { scores: DimensionScores; hollandCode: string; sdsCounts: Record<RiasecCategory, number> } {
  const hex = scoreHexaco(hexacoAnswers);
  const sds = scoreSds(sdsAnswers);

  const scores: DimensionScores = {
    honesty: hex.honesty,
    emotionality: hex.emotionality,
    extraversion: hex.extraversion,
    agreeableness: hex.agreeableness,
    conscientiousness: hex.conscientiousness,
    openness: hex.openness,
    realistic: sds.normalized.R,
    investigative: sds.normalized.I,
    artistic: sds.normalized.A,
    social: sds.normalized.S,
    enterprising: sds.normalized.E,
    conventional: sds.normalized.C,
  };

  return { scores, hollandCode: sds.code, sdsCounts: sds.counts };
}
