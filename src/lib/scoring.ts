import type { Dimension, Question } from '@/data/questions';

export type DimensionScores = Record<Dimension, number>;

export const traitLabels: Record<Dimension, string> = {
  honesty: 'Kejujuran',
  emotionality: 'Sensitivitas',
  extraversion: 'Sosial',
  agreeableness: 'Keramahan',
  conscientiousness: 'Keteraturan',
  openness: 'Keterbukaan',
  realistic: 'Praktis',
  investigative: 'Analitis',
  artistic: 'Kreatif',
  social: 'Penolong',
  enterprising: 'Wirausaha',
  conventional: 'Terstruktur',
};

const allDimensions: Dimension[] = [
  'honesty',
  'emotionality',
  'extraversion',
  'agreeableness',
  'conscientiousness',
  'openness',
  'realistic',
  'investigative',
  'artistic',
  'social',
  'enterprising',
  'conventional',
];

export function calculateScores(
  answers: Record<number, number>,
  questionList: Question[]
): DimensionScores {
  const sums: Partial<Record<Dimension, number>> = {};
  const counts: Partial<Record<Dimension, number>> = {};

  questionList.forEach((q) => {
    const answer = answers[q.id];
    if (answer !== undefined) {
      const value = q.reverse ? 6 - answer : answer;
      sums[q.dimension] = (sums[q.dimension] || 0) + value;
      counts[q.dimension] = (counts[q.dimension] || 0) + 1;
    }
  });

  const scores = {} as DimensionScores;
  allDimensions.forEach((dim) => {
    scores[dim] = counts[dim] ? (sums[dim] || 0) / (counts[dim] || 1) : 3;
  });

  return scores;
}

/**
 * Compute "top traits" labels (3 dominant trait names) for downstream UI/AI.
 * Pulls from RIASEC dimensions since those are the closest to interest signals.
 */
export function computeTopTraits(scores: DimensionScores): string[] {
  const riasecDims: Dimension[] = [
    'realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional',
  ];
  return riasecDims
    .map((dim) => ({ dim, score: scores[dim] || 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ dim }) => traitLabels[dim]);
}
