import { forwardRef } from 'react';
import { Flame, Sparkles } from 'lucide-react';
import type { DimensionScores, PathwayMatch } from '@/lib/scoring';
import { traitLabels } from '@/lib/scoring';
import type { Dimension } from '@/data/questions';

interface ResultCardProps {
  scores: DimensionScores;
  topMatch: PathwayMatch;
  allMatches: PathwayMatch[];
}

export const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(
  ({ scores, topMatch, allMatches }, ref) => {
    const topDimensions = (Object.keys(traitLabels) as Dimension[])
      .map((key) => ({ key, label: traitLabels[key], value: scores[key] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return (
      <div
        ref={ref}
        style={{
          width: 600,
          padding: 40,
          background: 'linear-gradient(145deg, hsl(225, 45%, 7%), hsl(225, 40%, 12%))',
          color: 'hsl(40, 20%, 95%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          borderRadius: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative gradient bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, hsl(38, 92%, 50%), hsl(43, 96%, 56%), hsl(15, 80%, 55%))',
          }}
        />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          <Flame style={{ width: 24, height: 24, color: 'hsl(38, 92%, 50%)' }} />
          <span style={{ fontSize: 20, fontWeight: 700, color: 'hsl(38, 92%, 50%)' }}>
            Sulu
          </span>
          <span style={{ fontSize: 13, color: 'hsl(220, 15%, 55%)', marginLeft: 'auto' }}>
            Hasil Assessment Karier
          </span>
        </div>

        {/* Top match */}
        <div
          style={{
            background: 'hsl(225, 30%, 15%)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 20,
            border: '1px solid hsl(38, 92%, 50%, 0.3)',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 8 }}>{topMatch.pathway.icon}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: 'hsl(38, 92%, 50%)' }}>
              {topMatch.matchPercentage}%
            </span>
            <span style={{ fontSize: 13, color: 'hsl(220, 15%, 55%)' }}>kecocokan</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
            {topMatch.pathway.name}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
            {topMatch.topTraits.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 20,
                  background: 'hsl(38, 92%, 50%, 0.15)',
                  color: 'hsl(38, 92%, 50%)',
                  border: '1px solid hsl(38, 92%, 50%, 0.25)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Other matches */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {allMatches.slice(1, 3).map((m) => (
            <div
              key={m.pathway.id}
              style={{
                flex: 1,
                background: 'hsl(225, 30%, 15%)',
                borderRadius: 12,
                padding: 14,
                border: '1px solid hsl(225, 20%, 18%)',
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 4 }}>{m.pathway.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'hsl(38, 92%, 50%)' }}>
                {m.matchPercentage}%
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{m.pathway.name}</div>
            </div>
          ))}
        </div>

        {/* Top dimensions */}
        <div
          style={{
            background: 'hsl(225, 30%, 15%)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            border: '1px solid hsl(225, 20%, 18%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Sparkles style={{ width: 14, height: 14, color: 'hsl(38, 92%, 50%)' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'hsl(220, 15%, 55%)', textTransform: 'uppercase' as const, letterSpacing: 1 }}>
              Dimensi Terkuat
            </span>
          </div>
          {topDimensions.map((d) => (
            <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 12, width: 90, color: 'hsl(220, 15%, 65%)' }}>{d.label}</span>
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'hsl(225, 20%, 20%)' }}>
                <div
                  style={{
                    width: `${(d.value / 5) * 100}%`,
                    height: '100%',
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, hsl(38, 92%, 50%), hsl(43, 96%, 56%))',
                  }}
                />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'hsl(38, 92%, 50%)', width: 28, textAlign: 'right' as const }}>
                {d.value.toFixed(1)}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center' as const, color: 'hsl(220, 15%, 45%)', fontSize: 11 }}>
          sulu.iou.id • Coba tes minat kariermu juga!
        </div>
      </div>
    );
  }
);

ResultCard.displayName = 'ResultCard';

