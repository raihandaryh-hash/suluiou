import { describe, it, expect } from 'vitest';
import { hexacoQuestions } from '@/data/hexacoQuestions';
import { sdsQuestions } from '@/data/sdsQuestions';
import { scoreHexaco, scoreSds, combineScores } from '@/lib/scoringNew';

describe('Kepribadian (Mini-IPIP6)', () => {
  it('has 24 items', () => {
    expect(hexacoQuestions).toHaveLength(24);
  });
  it('has 4 items per dimension', () => {
    const dims = ['honesty','emotionality','extraversion','agreeableness','conscientiousness','openness'] as const;
    dims.forEach((d) => {
      expect(hexacoQuestions.filter((q) => q.dimension === d)).toHaveLength(4);
    });
  });
  it('reverse-keys flip the score', () => {
    const reverseQ = hexacoQuestions.find((q) => q.reverse && hexacoQuestions.some((o) => !o.reverse && o.dimension === q.dimension))!;
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

describe('Minat (O*NET IP Short Form)', () => {
  it('has 60 items', () => {
    expect(sdsQuestions).toHaveLength(60);
  });
  it('has correct distribution per category', () => {
    const cats = ['R','I','A','S','E','C'] as const;
    cats.forEach((c) => {
      expect(sdsQuestions.filter((q) => q.category === c)).toHaveLength(10);
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
      if (q.category === 'A' && q.num <= 7) ans[q.id] = true;
      if (q.category === 'I' && q.num <= 4) ans[q.id] = true;
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

describe('kunci butir', () => {
  it('id kepribadian unik dan di luar rentang HEXACO-PI-R lama', () => {
    const ids = hexacoQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(Math.min(...ids)).toBeGreaterThan(60);
  });
  it('tiap butir menyimpan teks asli', () => {
    expect(hexacoQuestions.every((q) => q.asli.length > 0)).toBe(true);
    expect(sdsQuestions.every((q) => q.asli.length > 0)).toBe(true);
  });
});
