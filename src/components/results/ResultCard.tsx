import { forwardRef } from 'react';
import { Sparkles } from 'lucide-react';
import type { DimensionScores, PathwayMatch } from '@/lib/scoring';
import { traitLabels } from '@/lib/scoring';
import type { Dimension } from '@/data/questions';

interface ResultCardProps {
  scores: DimensionScores;
  topMatch: PathwayMatch;
  allMatches: PathwayMatch[];
}

const IOU_BLUE = '#1a3a6c';
const IOU_BLUE_LIGHT = '#2a5298';
const IOU_BLUE_PALE = '#e8eef7';
const IOU_GOLD = '#c5a44e';
const WHITE = '#ffffff';
const GRAY = '#6b7280';

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
          padding: 0,
          background: WHITE,
          color: IOU_BLUE,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          borderRadius: 16,
          position: 'relative',
          overflow: 'hidden',
          border: `2px solid ${IOU_BLUE}`,
        }}
      >
        {/* Header band */}
        <div
          style={{
            background: `linear-gradient(135deg, ${IOU_BLUE}, ${IOU_BLUE_LIGHT})`,
            padding: '28px 32px 20px',
            color: WHITE,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 2, color: IOU_GOLD, marginBottom: 4 }}>
                Assessment Karier
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
                Hasil Profil Sulu
              </div>
            </div>
            <div style={{ textAlign: 'right' as const }}>
              <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
                INTERNATIONAL
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
                OPEN UNIVERSITY
              </div>
              <div style={{ fontSize: 10, color: IOU_GOLD, marginTop: 2 }}>
                IOU Indonesia
              </div>
            </div>
          </div>
          {/* Gold divider */}
          <div style={{ height: 2, background: IOU_GOLD, borderRadius: 1, opacity: 0.7 }} />
        </div>

        {/* Body */}
        <div style={{ padding: '24px 32px 28px' }}>
          {/* Top match card */}
          <div
            style={{
              background: IOU_BLUE_PALE,
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
              border: `1.5px solid ${IOU_BLUE}22`,
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', top: 12, right: 16, fontSize: 10, fontWeight: 600, color: IOU_GOLD, textTransform: 'uppercase' as const, letterSpacing: 1 }}>
              Top Match
            </div>
            <div style={{ fontSize: 36, marginBottom: 6 }}>{topMatch.pathway.icon}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 40, fontWeight: 800, color: IOU_BLUE }}>
                {topMatch.matchPercentage}%
              </span>
              <span style={{ fontSize: 12, color: GRAY, fontWeight: 500 }}>kecocokan</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: IOU_BLUE, marginBottom: 8 }}>
              {topMatch.pathway.name}
            </div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const }}>
              {topMatch.topTraits.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 10,
                    padding: '3px 10px',
                    borderRadius: 20,
                    background: WHITE,
                    color: IOU_BLUE,
                    border: `1px solid ${IOU_BLUE}33`,
                    fontWeight: 600,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Runner-up matches */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {allMatches.slice(1, 3).map((m) => (
              <div
                key={m.pathway.id}
                style={{
                  flex: 1,
                  background: WHITE,
                  borderRadius: 10,
                  padding: 14,
                  border: `1.5px solid ${IOU_BLUE}18`,
                  textAlign: 'center' as const,
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 4 }}>{m.pathway.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: IOU_BLUE_LIGHT }}>
                  {m.matchPercentage}%
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: IOU_BLUE }}>{m.pathway.name}</div>
              </div>
            ))}
          </div>

          {/* Top dimensions */}
          <div
            style={{
              background: WHITE,
              borderRadius: 10,
              padding: 14,
              marginBottom: 16,
              border: `1.5px solid ${IOU_BLUE}18`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Sparkles style={{ width: 13, height: 13, color: IOU_GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: IOU_BLUE, textTransform: 'uppercase' as const, letterSpacing: 1.5 }}>
                Dimensi Terkuat
              </span>
            </div>
            {topDimensions.map((d) => (
              <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                <span style={{ fontSize: 11, width: 85, color: GRAY, fontWeight: 500 }}>{d.label}</span>
                <div style={{ flex: 1, height: 7, borderRadius: 4, background: IOU_BLUE_PALE }}>
                  <div
                    style={{
                      width: `${(d.value / 5) * 100}%`,
                      height: '100%',
                      borderRadius: 4,
                      background: `linear-gradient(90deg, ${IOU_BLUE}, ${IOU_BLUE_LIGHT})`,
                    }}
                  />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: IOU_BLUE, width: 28, textAlign: 'right' as const }}>
                  {d.value.toFixed(1)}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 10, color: GRAY }}>
              sulu.iou.id • Coba tes minat kariermu juga!
            </div>
            <div style={{ fontSize: 9, color: IOU_GOLD, fontWeight: 600, letterSpacing: 1 }}>
              @iouindonesia
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ResultCard.displayName = 'ResultCard';
