import { describe, it, expect } from 'vitest';
import { hexacoQuestions } from '@/data/hexacoQuestions';
import { sdsQuestions } from '@/data/sdsQuestions';
import { scoreHexaco, scoreSds, combineScores } from '@/lib/scoringNew';

describe('HEXACO instrument', () => {
  it('has 60 items', () => {
    expect(hexacoQuestions).toHaveLength(60);
  });
  it('has 10 items per dimension', () => {
    const dims = ['honesty','emotionality','extraversion','agreeableness','conscientiousness','openness'] as const;
    dims.forEach((d) => {
      expect(hexacoQuestions.filter((q) => q.dimension === d)).toHaveLength(10);
    });
  });
  it('reverse-keys flip the score', () => {
    const reverseQ = hexacoQuestions.find((q) => q.reverse)!;
    const normalQ = hexacoQuestions.find((q) => !q.reverse && q.dimension === reverseQ.dimension)!;
    const s = scoreHexaco({ [reverseQ.id]: 1, [normalQ.id]: 5 });
    // reverse 1 → 5, normal 5 → 5; mean over 2 items = 5
    expect(s[reverseQ.dimension]).toBeCloseTo(5);
  });
  it('returns 3 (neutral) when no answers', () => {
    const s = scoreHexaco({});
    expect(s.honesty).toBe(3);
  });
});

describe('SDS instrument', () => {
  it('has 216 items', () => {
    expect(sdsQuestions).toHaveLength(216);
  });
  it('has correct distribution per category', () => {
    const cats = ['R','I','A','S','E','C'] as const;
    cats.forEach((c) => {
      // 11 + 11 + 14 = 36 per category
      expect(sdsQuestions.filter((q) => q.category === c)).toHaveLength(36);
    });
  });
  it('all-yes maxes the normalized score to 5', () => {
    const all = Object.fromEntries(sdsQuestions.map((q) => [q.id, true]));
    const r = scoreSds(all);
    expect(r.normalized.R).toBeCloseTo(5);
    expect(r.code).toHaveLength(3);
  });
  it('all-no gives 1', () => {
    const r = scoreSds({});
    expect(r.normalized.R).toBe(1);
  });
  it('Holland code reflects top 3 categories', () => {
    const ans: Record<string, boolean> = {};
    sdsQuestions.forEach((q) => {
      if (q.category === 'S') ans[q.id] = true;
      if (q.category === 'A' && q.section <= 2) ans[q.id] = true;
      if (q.category === 'I' && q.section === 1) ans[q.id] = true;
    });
    const r = scoreSds(ans);
    expect(r.code[0]).toBe('S');
    expect(r.code).toContain('A');
    expect(r.code).toContain('I');
  });
});

describe('combineScores', () => {
  it('produces 12 dimensions', () => {
    const { scores } = combineScores({}, {});
    expect(Object.keys(scores)).toHaveLength(12);
  });
  it('integrates HEXACO and SDS', () => {
    const hexAns = Object.fromEntries(hexacoQuestions.map((q) => [q.id, q.reverse ? 1 : 5]));
    const sdsAns = Object.fromEntries(sdsQuestions.map((q) => [q.id, true]));
    const { scores, hollandCode } = combineScores(hexAns, sdsAns);
    expect(scores.honesty).toBeCloseTo(5);
    expect(scores.realistic).toBeCloseTo(5);
    expect(hollandCode).toHaveLength(3);
  });
});
