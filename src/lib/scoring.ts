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

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

export function matchPathways(
  scores: DimensionScores,
  pathwayList: Pathway[]
): PathwayMatch[] {
  const riasecDimensions: Dimension[] = [
    'realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional',
  ];

  // Normalize RIASEC scores from [1,5] scale to [0,1]
  const studentRiasecVec = riasecDimensions.map(
    (dim) => ((scores[dim] || 1) - 1) / 4
  );

  return pathwayList
    .map((pathway) => {
      // Use riasecVector if available, else fall back to weight-based calculation
      let riasecSim: number;
      if (pathway.riasecVector && pathway.riasecVector.length === 6) {
        riasecSim = cosineSimilarity(studentRiasecVec, pathway.riasecVector);
      } else {
        // Fallback: build vector from weights
        const maxW = Math.max(...riasecDimensions.map((d) => (pathway.weights[d] as number) || 0), 1);
        const pathwayVec = riasecDimensions.map((d) => ((pathway.weights[d] as number) || 0) / maxW);
        riasecSim = cosineSimilarity(studentRiasecVec, pathwayVec);
      }

      // IOU Lens score placeholder (0–1). Will be populated once Lens is implemented.
      const lensScore = pathway.lensScore ?? 0;

      // Combined match: cosine RIASEC × 0.65 + lens × 0.35
      const rawMatch = riasecSim * 0.65 + lensScore * 0.35;
      const matchPercentage = Math.round(rawMatch * 100);

      const topTraits = riasecDimensions
        .map((dim) => ({ dim, score: scores[dim] || 0 }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(({ dim }) => traitLabels[dim]);

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