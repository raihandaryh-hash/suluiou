import type { Dimension, Question } from '@/data/questions';
import type { Pathway } from '@/data/pathways';

export type DimensionScores = Record<Dimension, number>;

export interface PathwayMatch {
  pathway: Pathway;
  matchPercentage: number;
  topTraits: string[];
}

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

export function matchPathways(
  scores: DimensionScores,
  pathwayList: Pathway[]
): PathwayMatch[] {
  return pathwayList
    .map((pathway) => {
      let totalWeight = 0;
      let weightedScore = 0;

      Object.entries(pathway.weights).forEach(([dim, weight]) => {
        const w = weight as number;
        totalWeight += w;
        weightedScore += (scores[dim as Dimension] || 3) * w;
      });

      const matchPercentage = Math.round(
        (weightedScore / (totalWeight * 5)) * 100
      );

      const topTraits = Object.entries(pathway.weights)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([dim]) => traitLabels[dim as Dimension]);

      return { pathway, matchPercentage, topTraits };
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export function generateProjection(
  topMatch: PathwayMatch,
  scores: DimensionScores
): string {
  const templates = topMatch.pathway.projectionTemplates;

  const hexacoTraits: Dimension[] = [
    'honesty',
    'emotionality',
    'extraversion',
    'agreeableness',
    'conscientiousness',
    'openness',
  ];

  const dominantHexaco = hexacoTraits.reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  const templateIndex = ['honesty', 'emotionality', 'extraversion'].includes(
    dominantHexaco
  )
    ? 0
    : templates.length > 1
      ? 1
      : 0;

  return templates[templateIndex];
}