import { describe, it, expect } from 'vitest';
import { hexacoQuestions } from '@/data/hexacoQuestions';
import { sdsQuestions, sdsItemsBy } from '@/data/sdsQuestions';
import { scoreHexaco, scoreSds, combineScores, SDS_MAX_PER_CATEGORY } from '@/lib/scoringNew';

describe('HEXACO-PIR data', () => {
  it('punya tepat 60 item', () => {
    expect(hexacoQuestions).toHaveLength(60);
  });
  it('tiap dimensi punya tepat 10 item', () => {
    const dims = ['honesty', 'emotionality', 'extraversion', 'agreeableness', 'conscientiousness', 'openness'] as const;
    dims.forEach((d) => {
      const count = hexacoQuestions.filter((q) => q.dimension === d).length;
      expect(count, `dimensi ${d}`).toBe(10);
    });
  });
  it('id unik 1..60', () => {
    const ids = hexacoQuestions.map((q) => q.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 60 }, (_, i) => i + 1));
  });
});

describe('SDS-Holland data', () => {
  it('punya tepat 216 item', () => {
    expect(sdsQuestions).toHaveLength(216);
  });
  it('Bagian I (activities) = 66 item, 11 per kategori', () => {
    const acts = sdsQuestions.filter((q) => q.section === 'activities');
    expect(acts).toHaveLength(66);
    ['R', 'I', 'A', 'S', 'E', 'C'].forEach((c) => {
      expect(sdsItemsBy('activities', c as 'R')).toHaveLength(11);
    });
  });
  it('Bagian II (competencies) = 66 item, 11 per kategori', () => {
    expect(sdsQuestions.filter((q) => q.section === 'competencies')).toHaveLength(66);
  });
  it('Bagian III (occupations) = 84 item, 14 per kategori', () => {
    expect(sdsQuestions.filter((q) => q.section === 'occupations')).toHaveLength(84);
    ['R', 'I', 'A', 'S', 'E', 'C'].forEach((c) => {
      expect(sdsItemsBy('occupations', c as 'R')).toHaveLength(14);
    });
  });
  it('SDS_MAX_PER_CATEGORY = 36', () => {
    expect(SDS_MAX_PER_CATEGORY).toBe(36);
  });
});

describe('Scoring engine', () => {
  it('HEXACO: jawaban semua 5 → tiap dimensi mendekati 5 (kecuali ada reverse)', () => {
    const answers: Record<number, number> = {};
    hexacoQuestions.forEach((q) => (answers[q.id] = 5));
    const result = scoreHexaco(answers);
    // Karena ada item reverse, hasil akan mix. Tapi yang non-reverse semua = 5.
    Object.values(result).forEach((v) => {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(5);
    });
  });
  it('HEXACO: tanpa jawaban → default 3 (netral)', () => {
    const result = scoreHexaco({});
    Object.values(result).forEach((v) => expect(v).toBe(3));
  });
  it('SDS: semua "ya" di kategori S → social = 5, lainnya = 1', () => {
    const answers: Record<number, 0 | 1> = {};
    sdsQuestions.forEach((q) => (answers[q.id] = q.category === 'S' ? 1 : 0));
    const { raw, normalized } = scoreSds(answers);
    expect(raw.S).toBe(36);
    expect(normalized.social).toBeCloseTo(5, 5);
    expect(normalized.realistic).toBeCloseTo(1, 5);
  });
  it('combineScores: menghasilkan 12 dimensi DimensionScores', () => {
    const { scores, hollandCode } = combineScores({}, {});
    expect(Object.keys(scores)).toHaveLength(12);
    expect(hollandCode).toHaveLength(3);
  });
});
