import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Cite from '@/components/Cite';
import {
  SectionHeader,
  DataReveal,
  StatCard,
  UsefulFeedback,
  SkillLandscape,
  RoiBlock,
  BkBlock,
  type StatCardData,
} from '@/pages/Insight';
import {
  indonesiaSection,
  linkMatchSection,
  neetSection,
  laborRealitySection,
  worldSection,
  jabarSection,
  expertSection,
  type Persona,
} from '@/data/insightContent';

/**
 * "Data Lanjutan" — verbatim relocation of the 6 heavy stat sections that
 * used to live behind a collapsed toggle on /insight (indonesia, link-match,
 * neet, realita, dunia, jabar) + expert quotes. Moved here per Raihan's
 * direction: doom-prone narrative/data belongs in its own space for
 * critical readers (LMI-style), while /insight keeps only its 2-3 anchor
 * numbers inline (201 juta, NEET 1/5, Kartu Penampar — those never lived in
 * this toggle to begin with).
 *
 * JSX below is copied AS-IS from Insight.tsx's former dataOpen block — no
 * rewriting, no summarizing (anti-watering-down). Persona is fixed to
 * 'siswa' here since this is a reference page, not the personalized
 * narrative flow; persona-specific blocks (SkillLandscape/RoiBlock/BkBlock)
 * are all rendered so every persona's content is reachable regardless.
 */
export default function DataMendalam() {
  const persona: Persona = 'siswa';

  return (
    <>
      {/* Indonesia hari ini */}
      <section id="indonesia" className="container mx-auto px-6 py-16 max-w-6xl">
        <SectionHeader headline={indonesiaSection.headline} intro={indonesiaSection.intro[persona]} />
        <DataReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {indonesiaSection.cards.map((c, i) => (
              <StatCard key={i} card={c as StatCardData} persona={persona} />
            ))}
          </div>
        </DataReveal>
      </section>
      <UsefulFeedback section="indonesia" persona={persona} />

      {/* Link and Match */}
      <section id="link-match" className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-secondary/60 border border-border rounded-2xl p-6 md:p-8">
          <h2 className="font-heading font-semibold text-xl md:text-2xl text-foreground mb-3">{linkMatchSection.headline}</h2>
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-1">Artinya untuk kamu:</p>
            <p className="text-sm text-foreground/80 leading-relaxed italic">{linkMatchSection.artinya[persona]}</p>
          </div>
          <DataReveal>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{linkMatchSection.body}</p>
            <p className="text-xs text-muted-foreground italic">Sumber<Cite id="linkmatch-bps-kemendikbud" /></p>
          </DataReveal>
        </div>
      </section>
      <UsefulFeedback section="link-match" persona={persona} />

      {/* NEET Indonesia vs ASEAN (WDI 6 negara) */}
      <section id="neet" className="container mx-auto px-6 py-16 max-w-4xl">
        <SectionHeader headline={neetSection.headline} intro={neetSection.intro} />
        <DataReveal>
          <div className="bg-secondary/60 border border-border rounded-2xl p-6 md:p-8 space-y-5">
            {neetSection.data.map((row, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{row.country}</span>
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {row.value.toString().replace('.', ',')}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-background overflow-hidden">
                  <motion.div
                    className={cn('h-full rounded-full', row.colorClass)}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(row.value / neetSection.maxPercent) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-2 space-y-1">
              <p className="text-xs text-muted-foreground italic">Sumber<Cite id="neet-asean-wdi" /></p>
              <p className="text-xs text-muted-foreground">{neetSection.note}</p>
            </div>
          </div>
        </DataReveal>
      </section>
      <UsefulFeedback section="neet" persona={persona} />

      {/* Realita Dunia Kerja */}
      <section id="realita" className="container mx-auto px-6 py-16 max-w-6xl">
        <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground tracking-tight leading-tight mb-4 max-w-2xl">{laborRealitySection.headline}</h2>
        <p className="text-base text-foreground/80 max-w-2xl leading-relaxed mb-8">{laborRealitySection.intro[persona]}</p>
        <DataReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {laborRealitySection.cards.map((c, i) => (
              <StatCard key={i} card={c as StatCardData} persona={persona} />
            ))}
          </div>
        </DataReveal>
      </section>
      <UsefulFeedback section="realita" persona={persona} />

      {/* Persona-specific deep dives — all three shown (reference page, no active persona switch) */}
      <SkillLandscape persona="siswa" />
      <RoiBlock persona="orangtua" />
      <BkBlock persona="gurubk" />

      {/* Dunia 2025–2030 */}
      <section id="dunia" className="container mx-auto px-6 py-16 max-w-6xl">
        <SectionHeader headline={worldSection.headline} intro={worldSection.intro[persona]} />
        <DataReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {worldSection.cards.map((c, i) => (
              <StatCard key={i} card={c as StatCardData} persona={persona} />
            ))}
          </div>
        </DataReveal>
      </section>
      <UsefulFeedback section="dunia" persona={persona} />

      {/* Konteks Jawa Barat */}
      <section id="jabar" className="container mx-auto px-6 py-16 max-w-6xl">
        <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground tracking-tight leading-tight mb-4 max-w-2xl">{jabarSection.headline}</h2>
        <p className="text-base text-foreground/80 max-w-2xl leading-relaxed mb-8">{jabarSection.subtext}</p>
        <p className="text-sm text-foreground/80 italic mb-6 leading-relaxed max-w-2xl">{jabarSection.closingNote[persona]}</p>
        <DataReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {jabarSection.stats.map((s, i) => {
              const valueColor =
                s.tone === 'negative' ? 'text-destructive' :
                s.tone === 'positive' ? 'text-primary' :
                'text-foreground';
              return (
                <div key={i} className="bg-secondary/60 border border-border rounded-2xl p-6">
                  <p className="text-xs text-muted-foreground mb-2 leading-snug">{s.label}</p>
                  <div className={cn('font-heading font-medium tracking-tight text-3xl mb-2', valueColor)}>{s.value}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.context}</p>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3 italic">Sumber<Cite id="jabar-bps-bi" /></p>
        </DataReveal>
      </section>
      <UsefulFeedback section="jabar" persona={persona} />

      {/* Expert Quotes */}
      <section className="container mx-auto px-6 py-12 max-w-6xl">
        <h2 className="font-heading font-semibold text-2xl md:text-3xl text-foreground tracking-tight leading-tight mb-4 max-w-2xl">{expertSection.headline}</h2>
        <p className="text-sm text-muted-foreground mb-6">{expertSection.intro[persona]}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expertSection.quotes.map((q, i) => (
            <div key={i} className="bg-secondary/60 border border-border rounded-2xl p-6">
              <blockquote className="text-sm text-foreground/90 leading-relaxed italic mb-4">&ldquo;{q.quote}&rdquo;</blockquote>
              <div>
                <p className="font-heading font-semibold text-sm text-foreground">{q.speaker}</p>
                <p className="text-xs text-muted-foreground">{q.title}</p>
                {q.url ? (
                  <a href={q.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block">{q.source} ↗</a>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1 italic">{q.source}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
